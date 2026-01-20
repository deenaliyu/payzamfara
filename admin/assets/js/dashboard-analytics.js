/**
 * Dashboard Analytics - Collection Trend & Revenue Gauge
 * Updated: 
 * - Revenue Gauge now uses global filter (month/year dropdowns)
 * - Collection Trend uses its own yearSelector (not affected by global filter)
 * - Quarterly Performance/Metrics uses its own yearSelector (not affected by global filter)
 * - Bar chart now uses custom colors: #D08317, #E99F37, #37E946, #3781E9, #E937DA
 */

function toggleLoader(cardId, show) {
  const card = document.getElementById(cardId);
  if (!card) return;
  const loader = card.querySelector('.card-loader');
  if (show) loader.classList.add('active');
  else loader.classList.remove('active');
}

// ============================================
// REVENUE GAUGE (Now uses global filter)
// ============================================

async function updateRevenueGauge(month = '', year = '') {
  toggleLoader('gauge-card', true);
  try {
    const response = await fetch(`${HOST}?dashboardAnalyticsRevenueGauge&month=${month}&year=${year}`, {
      method: "GET",
      headers: {

        "Content-Type": "application/json",
      },
    });
    const result = await response.json();

    if (result.status === 'success') {
      const data = result.data;

      // 1. Update Numeric Texts (Formatting numbers to currency)
      const formatter = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 });

      document.getElementById('achievement-text').innerText = `${data.achievement_percentage}%`;
      document.getElementById('target-value').innerText = formatter.format(data.target);
      document.getElementById('actual-value').innerText = formatter.format(data.actual);
      document.getElementById('balance-value').innerText = formatter.format(data.balance);
      document.getElementById('rating-badge').innerText = data.rating;

      // 2. Update Gauge Visual
      // Total length of the arc is approx 283 units (pi * radius)
      const arcPath = document.getElementById('gauge-progress');
      const percentage = data.achievement_percentage > 100 ? 100 : data.achievement_percentage;
      const dashValue = (percentage / 100) * 283;
      arcPath.style.strokeDasharray = `${dashValue}, 283`;
    }
  } catch (error) {
    console.error("Error fetching gauge data:", error);
  } finally {
    toggleLoader('gauge-card', false); // STOP LOADER
  }
}

// Expose updateRevenueGauge globally so dashboard.js can call it
window.updateRevenueGauge = updateRevenueGauge;

// ============================================
// COLLECTION TREND & QUARTERLY PERFORMANCE
// (Uses its own yearSelector - NOT affected by global filter)
// ============================================

let collectionChart = null;
let currentView = 'quarterly'; // matches API param: 'quarterly' or 'yearly'

// Custom colors for the bar chart
const CHART_COLORS = ['#D08317', '#E99F37', '#37E946', '#3781E9', '#E937DA'];

document.addEventListener('DOMContentLoaded', function () {
  // Initial data fetch for Collection Trend & Quarterly Performance
  fetchPerformanceAndMetrics();
  fetchChartData();
});

// --- API 1: Quarterly Performance & Sidebar Metrics ---
// Note: This uses yearSelector, NOT the global filter
async function fetchPerformanceAndMetrics() {
  const yearValue = document.querySelector("#yearSelector")?.value || new Date().getFullYear();
  toggleLoader('trend-card', true); // START LOADER (covers the whole trend card)
  try {
    const response = await fetch(`${HOST}?dashboardAnalyticsQuarterlyPerformance&year=${yearValue}`, {
      method: "GET",
      headers: {

        "Content-Type": "application/json",
      },
    });
    const result = await response.json();

    if (result.status === 'success') {
      updateSidebarMetrics(result.metrics);
      updateQuarterlyIndicators(result.data);
    }
  } catch (error) {
    console.error("Error fetching performance metrics:", error);
  } finally {
    toggleLoader('trend-card', false); // STOP LOADER
  }
}

function handleYearChange() {
  fetchPerformanceAndMetrics();
  fetchChartData();
}

function updateSidebarMetrics(metrics) {
  // Note: API returns numbers like 19800, we format to currency
  document.getElementById('metricInvoice').innerText = formatCurrency(metrics.invoice);
  document.getElementById('metricRevenue').innerText = formatCurrency(metrics.revenue);
  document.getElementById('metricAccrued').innerText = formatCurrency(metrics.accrued);

  // Logic for arrows (Assuming positive is up/success)
  // You can add logic here to compare against previous values if available
}

function updateQuarterlyIndicators(quarters) {
  const container = document.getElementById('quarters-container');
  container.innerHTML = ''; // Clear existing

  quarters.forEach(q => {
    const statusClass = q.is_positive ? 'positive' : 'negative';
    const html = `
            <div class="d-flex align-items-center mb-2">
                <div class="quarters-circle ${statusClass} rounded-circle">
                    ${q.growth_percentage}
                </div>
                <div class="ms-2" style="flex: 1; min-width: 0;">
                    <div class="quarters-circle-title">${q.label}</div>
                    <div style="font-size: 0.65rem; color: #999;">${q.month}</div>
                </div>
            </div>`;
    container.insertAdjacentHTML('beforeend', html);
  });
}

// --- API 2: Collection Trends (The Chart) ---
// Note: This uses yearSelector, NOT the global filter
async function fetchChartData() {
  toggleLoader('trend-card', true); // START LOADER
  const yearValue = document.querySelector("#yearSelector")?.value || new Date().getFullYear();
  try {
    const response = await fetch(`${HOST}?dashboardAnalyticsCollectionTrend&view_type=${currentView}&year=${yearValue}`, {
      method: "GET",
      headers: {

        "Content-Type": "application/json",
      },
    });
    const result = await response.json();

    if (result.status === 'success') {
      const labels = result.data.map(item => item.label || item.year_label);
      const values = result.data.map(item => item.amount);

      renderChart(labels, values);
    }
  } catch (error) {
    console.error("Error fetching chart data:", error);
  } finally {
    toggleLoader('trend-card', false); // STOP LOADER
  }
}

function renderChart(labels, values) {
  const ctx = document.getElementById('collectionChart').getContext('2d');

  if (collectionChart) {
    collectionChart.destroy();
  }

  // Generate background colors array based on the number of data points
  const backgroundColors = values.map((_, index) => CHART_COLORS[index % CHART_COLORS.length]);

  collectionChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Collection Amount',
          data: values,
          backgroundColor: backgroundColors,
          borderRadius: 8,
          barThickness: currentView === 'quarterly' ? 60 : 40,
          order: 2
        },
        {
          type: 'line',
          label: 'Trend',
          data: values, // Using values for trend as per response structure
          borderColor: '#000000',
          borderWidth: 2,
          pointBackgroundColor: '#ffffff',
          fill: false,
          tension: 0.4,
          order: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (val) => {
              if (val >= 1_000_000_000) {
                return '₦' + (val / 1_000_000_000).toFixed(1) + 'B'
              }
              if (val >= 1_000_000) {
                return '₦' + (val / 1_000_000).toFixed(1) + 'M'
              }
              if (val >= 1_000) {
                return '₦' + (val / 1_000).toFixed(1) + 'K'
              }
              return '₦' + val
            }
          }
        }
      }
    }
  });
}

// --- View Switcher ---
function changeView(view) {
  // Map button click to API params
  currentView = (view === 'year') ? 'yearly' : 'quarterly';

  // Toggle Button UI
  document.getElementById('btnYear').classList.toggle('active', view === 'year');
  document.getElementById('btnQuarter').classList.toggle('active', view === 'quarter');

  fetchChartData();
}

function formatCurrency(value) {
  // API returns values like 19800. Assuming these are in Billions or Millions based on your UI
  // Adjust the divisor as needed based on your real DB scale
  if (value >= 1000000000) return '₦' + (value / 1000000000).toFixed(2) + 'B';
  if (value >= 1000000) return '₦' + (value / 1000000).toFixed(2) + 'M';
  if (value >= 1000) return '₦' + (value / 1000).toFixed(1) + 'K';
  return '₦' + value;
}

// Expose functions globally for inline handlers
window.changeView = changeView;
window.handleYearChange = handleYearChange;