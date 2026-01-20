/**
 * PayZamfara Dashboard - API Integration
 * Integrates dashboard cards with backend APIs
 * Charts excluded from this integration
 * Updated: Global filter (Month & Year dropdowns) applied to all endpoints except Collection Trend
 */

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getCurrentMonthYear() {
  const now = new Date();
  return {
    month: String(now.getMonth() + 1).padStart(2, "0"),
    year: now.getFullYear()
  };
}

function getGlobalFilterValues() {
  const month = document.getElementById("globalMonthFilter")?.value || getCurrentMonthYear().month;
  const year = document.getElementById("globalYearFilter")?.value || getCurrentMonthYear().year;
  return { month, year };
}

function formatMoney(amount) {
  return `₦ ${Number(amount).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
  })}`;
}

function showSpinner(elementId) {
  $(`#${elementId}`).html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
}

// ============================================
// GLOBAL FILTER POPULATION
// ============================================

let remittanceDateInput = document.getElementById("remittanceDate");
if (remittanceDateInput) {
  remittanceDateInput.value = new Date().toISOString().split("T")[0];
}

function populateGlobalYearFilter() {
  const yearSelect = document.getElementById("globalYearFilter");
  if (!yearSelect) return;

  const currentYear = new Date().getFullYear();
  const startYear = 2023;

  // Clear existing options
  yearSelect.innerHTML = "";

  for (let year = startYear; year <= currentYear; year++) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }

  // Set current year as default
  yearSelect.value = currentYear;
}

function populateGlobalMonthFilter() {
  const monthSelect = document.getElementById("globalMonthFilter");
  if (!monthSelect) return;

  // Set current month as default
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");
  monthSelect.value = currentMonth;
}

// Keep the year dropdown for Collection Trend (this is separate from global filter)
function populateYearDropdown() {
  const yearSelects = document.querySelectorAll(".annualRevFilter");
  const currentYear = new Date().getFullYear();
  const startYear = 2020;
  const endYear = currentYear;

  yearSelects.forEach((yearSelect) => {
    // Clear existing options first
    yearSelect.innerHTML = "";

    for (let year = startYear; year <= endYear; year++) {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      yearSelect.appendChild(option);
    }

    yearSelect.value = currentYear;
  });
}

// ============================================
// GLOBAL FILTER CHANGE HANDLER
// ============================================

function onGlobalFilterChange() {
  const { month, year } = getGlobalFilterValues();
  const monthYear = `${year}-${month}`;

  // Revenue Cards
  fetchTotalRevenue(monthYear);
  fetchExpectedMonthlyRevenue(monthYear);
  fetchExpectedAccruedRevenue(monthYear);

  // Invoice Statistics
  fetchInvoiceStatistics(monthYear);

  // E-Services / Tax Summary
  fetchTaxSummary(monthYear, true);

  // Revenue Gauge (now uses global filter)
  if (typeof updateRevenueGauge === 'function') {
    updateRevenueGauge(month, year);
  }
}

// ============================================
// REVENUE CARD APIs
// ============================================

/**
 * Fetch Total Monthly Revenue
 * Endpoint: /get-total-amount-paid
 */
async function fetchTotalRevenue(monthYear) {
  showSpinner("totalMonthlyRevenue");
  const [year, month] = monthYear.split("-");

  try {
    const response = await fetch(
      `${HOST}?getMonthlyRevenue&month=${month}&year=${year}`,
      {
        method: "GET",
        headers: {
          
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();

    if (data.status === 1) {
      $("#totalMonthlyRevenue").html(formatMoney(data.message[0].total_monthly_revenue || 0));
    } else {
      $("#totalMonthlyRevenue").html(formatMoney(0));
    }
  } catch (error) {
    console.error("Error fetching total monthly revenue:", error);
    $("#totalMonthlyRevenue").html(formatMoney(0));
  }
}

/**
 * Fetch Expected Monthly Revenue
 * Endpoint: /get-expected-monthly-revenue
 */
async function fetchExpectedMonthlyRevenue(monthYear) {
  showSpinner("expectedMonthlyRevenue");
  const [year, month] = monthYear.split("-");

  try {
    const response = await fetch(
      `${HOST}?getMonthlyRevenue&month=${month}&year=${year}&sort=expected`,
      {
        method: "GET",
        headers: {
          
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();

    if (data.status === 1) {
      $("#expectedMonthlyRevenue").html(formatMoney(data.message[0].total_monthly_revenue || 0));
    } else {
      $("#expectedMonthlyRevenue").html(formatMoney(0));
    }
  } catch (error) {
    console.error("Error fetching expected monthly revenue:", error);
    $("#expectedMonthlyRevenue").html(formatMoney(0));
  }
}

/**
 * Fetch Accrued (Unpaid) Monthly Revenue
 * Endpoint: /get-accrued-monthly-revenue
 */
async function fetchExpectedAccruedRevenue(monthYear) {
  showSpinner("expectedAccruedRevenue");
  const [year, month] = monthYear.split("-");

  try {
    const response = await fetch(
      `${HOST}?getMonthlyUnpaidRevenue&month=${month}&year=${year}`,
      {
        method: "GET",
        headers: {
          
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();

    if (data.status === 1) {
      $("#expectedAccruedRevenue").html(formatMoney(data.message[0].total_unpaid_revenue || 0));
    } else {
      $("#expectedAccruedRevenue").html(formatMoney(0));
    }
  } catch (error) {
    console.error("Error fetching accrued revenue:", error);
    $("#expectedAccruedRevenue").html(formatMoney(0));
  }
}

// ============================================
// TAXPAYER STATISTICS API
// ============================================


// ============================================
// INVOICE STATISTICS API
// ============================================

/**
 * Fetch Invoice Summary Statistics
 * Endpoint: /invoices-summary
 * Populates multiple cards at once
 */
function fetchInvoiceStatistics(monthYear) {
  // Show spinners for all invoice-related cards
  showSpinner("totalInvoices");
  showSpinner("totalInvoiced");
  showSpinner("totalPaidInvoice");
  showSpinner("totalUnpaidInvoice");
  showSpinner("expectedAccruedRevenue")

  const [year, month] = monthYear.split("-");

  $.ajax({
    type: "GET",
    url: `${HOST}?invoiceSummaryTiles&year=${year}&month=${month}`,
    dataType: "json",
    headers: {
      
      "Content-Type": "application/json",
    },
    success: function (response) {
      if (response.status === "success") {
        const stats = response.data;
        // Total number of invoices
        $("#totalInvoices").text(stats.total_invoice.toLocaleString());

        // Total amount invoiced
        $("#totalInvoiced").text(formatMoney(stats.total_amount_invoiced || 0));

        // Total amount paid
        $("#totalPaidInvoice").text(formatMoney(stats.total_amount_paid || 0));

        // Total amount unpaid
        $("#totalUnpaidInvoice").text(formatMoney(stats.total_amount_unpaid || 0));

        $("#expectedAccruedRevenue").text(formatMoney(stats.total_amount_unpaid || 0));
      } else {
        console.error("Failed to fetch invoice statistics");
        resetInvoiceCards();
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching invoice statistics:", error);
      resetInvoiceCards();
    },
  });
}

/**
 * Reset invoice cards to zero on error
 */
function resetInvoiceCards() {
  $("#totalInvoices").text("0");
  $("#totalInvoiced").text(formatMoney(0));
  $("#totalPaidInvoice").text(formatMoney(0));
  $("#totalUnpaidInvoice").text(formatMoney(0));
  $("#totalInvoicesDue").text("0");
  $("#totalInvoicesPaid").text("0");
  $("#totalAmountDue").text(formatMoney(0));
  $("#totalMDA").text("0");
  $("#totalRevenueHeads").text("0");
}

// ============================================
// E-SERVICES / TAX SUMMARY API
// ============================================

/**
 * Fetch Tax Summary (E-Services Section)
 * Endpoint: /admin-tax-summary
 */
function fetchTaxSummary(monthYear, isMonthYear = false) {
  // Show loading indicators
  showSpinner("tinIssued");
  showSpinner("tccIssued");
  showSpinner("payeRemitted");
  showSpinner("totalAmountUnpaidPaye");
  showSpinner("totalUnpaidPaye");

  let url = `${HOST}/admin-tax-summary`;
  if (isMonthYear && monthYear) {
    const [year, month] = monthYear.split("-");
    url += `?year=${year}&month=${month}`;
  }

  $.ajax({
    type: "GET",
    url: url,
    dataType: "json",
    headers: {
      
      "Content-Type": "application/json",
    },
    success: function (response) {
      if (response.status === "success") {
        const data = response.data;

        // TIN Issued
        $("#tinIssued").text((data.tin_issued || 0).toLocaleString());

        // TCC Issued
        $("#tccIssued").text((data.tcc_issued || 0).toLocaleString());

        // PAYE Remitted
        $("#payeRemitted").text(
          formatMoney(data.paye_remitted || 0)
        );

        // Total Amount of Unpaid PAYE
        $("#totalAmountUnpaidPaye").text(
          formatMoney(data.unpaid_amount_paye_taxes || 0)
        );

        // Total Unpaid PAYE (count)
        $("#totalUnpaidPaye").text((data.unpaid_paye_taxes || 0).toLocaleString());

        // Total TIN Request (using the same element ID from HTML - note: there's a duplicate ID in HTML)
        // If you have a separate element for TIN requests, update accordingly
        if (data.total_tin_requests !== undefined) {
          $("[id='totalTinRequest']").text((data.total_tin_requests || 0).toLocaleString());
        }
      } else {
        console.error("Failed to fetch tax summary");
        resetTaxSummaryCards();
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching tax summary:", error);
      resetTaxSummaryCards();
    },
  });
}

/**
 * Reset tax summary cards to zero on error
 */
function resetTaxSummaryCards() {
  $("#tinIssued").text("0");
  $("#tccIssued").text("0");
  $("#payeRemitted").text(formatMoney(0));
  $("#totalAmountUnpaidPaye").text(formatMoney(0));
  $("#totalUnpaidPaye").text("0");
}

// ============================================
// AVERAGE DAILY REVENUE API
// ============================================

/**
 * Fetch Average Daily Revenue
 * Endpoint: /get-average-daily-revenue
 */

async function fetchDailyRemittance() {
  showSpinner("dailyRemittanceAmount");
  const date = document.getElementById("remittanceDate").value;

  const url = new URL(`${HOST}?getDailyRemittance&date=${date}`);
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    // Parse and display data
    const dailyRemittance = parseFloat((data.message[0].total_daily_amount || "0").toString().replace(/,/g, "")) || 0;

    $("#dailyRemittanceAmount").text("₦" + dailyRemittance.toLocaleString("en-NG", { minimumFractionDigits: 2 }));
    $("#remittanceCount").text(data.message[0].total_daily_remittances || 0);
  } catch (error) {
    $("#dailyRemittanceAmount").text("₦0");
    $("#remittanceCount").text("0");
  }
}

async function fetchAverageDailyRevenue() {
  // Set default dates if not provided (first and last day of current month)

  const url = `${HOST}?getDailyRevenue`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    // Parse and display data
    const averageDailyRevenue = parseFloat((data.message[0].total_daily_revenue || "0").toString().replace(/,/g, "")) || 0;

    $("#averageDailyRevenue").text("₦" + averageDailyRevenue.toLocaleString("en-NG", { minimumFractionDigits: 2 }));
  } catch (error) {
    $("#averageDailyRevenue").text("₦0");
  }
}

// ============================================
// TIN REQUEST COUNT API (Data only, no chart)
// ============================================

/**
 * Fetch TIN Request Count
 * Endpoint: /tin-request-counts
 */
async function fetchTimeRequestCountGauge() {
  const startDate = document.getElementById("tinStartDate")?.value || "";
  const endDate = document.getElementById("tinEndDate")?.value || "";
  const datemonth = document.getElementById("tinMonth")?.value || "";

  let month = "";
  let year = "";

  if (datemonth) {
    [year, month] = datemonth.split("-");
  }

  const url = `${HOST}/tin-request-counts?start_date=${startDate}&end_date=${endDate}&month=${month}&year=${year}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (data.status === "success") {
      // Data available for gauge chart rendering (charts excluded per request)
      console.log("TIN Request Count:", data.data?.tin_request_count);
    }
  } catch (error) {
    console.error("Error fetching TIN request count:", error);
  }
}

// ============================================
// INITIALIZATION & EVENT LISTENERS
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  // Get current date values
  const { month: currentMonth, year: currentYear } = getCurrentMonthYear();
  const currentMonthYear = `${currentYear}-${currentMonth}`;

  // Populate global filter dropdowns
  populateGlobalYearFilter();
  populateGlobalMonthFilter();

  // Populate year dropdown for Collection Trend (separate from global filter)
  populateYearDropdown();

  // ============================================
  // INITIAL DATA FETCH (using global filter values)
  // ============================================

  // Revenue Cards
  fetchTotalRevenue(currentMonthYear);
  fetchExpectedMonthlyRevenue(currentMonthYear);
  // fetchExpectedAccruedRevenue(currentMonthYear);

  // Statistics Cards
  fetchInvoiceStatistics(currentMonthYear);

  // E-Services / Tax Summary
  fetchTaxSummary(currentMonthYear, true);

  // Average Daily Revenue
  fetchAverageDailyRevenue();
  fetchDailyRemittance();

  fetchTimeRequestCountGauge();

  // Initial Revenue Gauge fetch (uses global filter)
  if (typeof updateRevenueGauge === 'function') {
    updateRevenueGauge(currentMonth, currentYear);
  }

  // ============================================
  // EVENT LISTENERS FOR GLOBAL FILTER
  // ============================================

  const globalMonthFilter = document.getElementById("globalMonthFilter");
  const globalYearFilter = document.getElementById("globalYearFilter");

  if (globalMonthFilter) {
    globalMonthFilter.addEventListener("change", onGlobalFilterChange);
  }

  if (globalYearFilter) {
    globalYearFilter.addEventListener("change", onGlobalFilterChange);
  }

  // Daily Remittance date filter (separate, not affected by global filter)
  if (remittanceDateInput) {
    remittanceDateInput.addEventListener("change", (event) => {
      fetchDailyRemittance();
    });
  }

  // Show dashboard container after loading
  const dashboardContainer = document.getElementById("dashboard-container");
  if (dashboardContainer) {
    dashboardContainer.classList.remove("d-none");
  }
});

// ============================================
// EXPOSE FUNCTIONS GLOBALLY (for inline handlers)
// ============================================

// These functions are called from inline onchange handlers in HTML
window.fetchAverageDailyRevenue = fetchAverageDailyRevenue;
window.fetchTimeRequestCountGauge = fetchTimeRequestCountGauge;
window.getGlobalFilterValues = getGlobalFilterValues;