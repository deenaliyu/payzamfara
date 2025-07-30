let monthsss = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

let topLeastColor5 = ['#63B967', '#63B967', '#63B967', '#63B967', '#63B967', '#EA4335', '#EA4335', '#EA4335', '#EA4335', '#EA4335']

let topLeastColor3 = ['#63B967', '#63B967', '#63B967', '#63B967', '#63B967', '#EA4335']

let bottomLeastColors = ['#EA4335', '#EA4335', '#EA4335', '#EA4335', '#EA4335', '#EA4335']

let topBlOr = ['#ffa500cc', '#ffa500cc', '#ffa500cc', '#ffa500cc', '#ffa500cc']

let invgencolors = [
  '#015826',  // Individual
  'rgba(54, 162, 235, 0.8)',  // Corporate
  'rgba(255, 206, 86, 0.8)',  // State Agency
  'rgba(75, 192, 192, 0.8)'   // Federal Agency
]

let lightercol = '#01582774'

// The Trend Of Revenue Generated
async function revenueTrendSelectPerformance() {
  const selectInput = document.querySelector('#revenueTrendSelect')

  try {
    const response = await fetch(`${HOST}?filteredRevenue`)
    const responseDta = await response.json()

    function padNumberWithZero(num) {
      return num.toString().padStart(2, '0');
    }

    const years = Object.keys(responseDta.message);

    years.forEach(year => {
      const option = document.createElement('option');
      option.value = year;
      option.text = year;
      selectInput.appendChild(option);
    });

    const date = new Date();
    const currentYear = date.getFullYear().toString();

    if (years.includes(currentYear)) {
      selectInput.value = currentYear;
    } else {
      selectInput.value = years[0]; // Fallback to the first available year
    }


    selectInput.addEventListener('change', function () {
      const selectedYear = this.value;
      updateChart(selectedYear, responseDta.message);
    });

    const initialYear = selectInput.value;
    updateChart(initialYear, responseDta.message);

  } catch (error) {
    console.log(error)
  }

  async function updateChart(year, data) {
    document.querySelector("#revenueTrendSelectContainer").innerHTML = '<canvas class="theChart" id="revenueTrendSelectPerformance"></canvas>';
    const ctx = document.getElementById('revenueTrendSelectPerformance').getContext('2d');

    try {
      const monthsData = data[year];
      const monthNames = monthsData.map(item => {
        const [year, month] = item.month.split('-');
        return new Date(year, month - 1).toLocaleString('default', { month: 'long' });
      });
      const avgCycleTimes = monthsData.map(item => item.total_monthly_revenue);

      const chartData = {
        labels: monthNames,
        datasets: [{
          label: 'Revenue Generated (Million)',
          data: avgCycleTimes,
          backgroundColor: lightercol,
          borderColor: invgencolors[0],
          borderWidth: 2,
          fill: true,
          tension: 0.2
        }]
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'months'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'The Trend Of Revenue Generated'
            },
            ticks: {
              callback: function (value) {
                return value + 'M';
              }
            }
          }
        },
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.dataset.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}M`;
              }
            }
          }
        }
      };

      new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: options
      });

    } catch (error) {
      console.log(error);
    }
  }

}
revenueTrendSelectPerformance()

//TOP zonalOffPerformance chart 
async function zonalOffPerformance() {
  const selectInput = document.querySelector('#zonalOfficeSelect')

  try {
    const response = await fetch(`${HOST}?zonalOfficePerformance`)
    const responseDta = await response.json()

    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth() + 1; // JavaScript months are 0-based
    const currentMonthYear = `${currentYear}-${currentMonth}`;

    const months = Object.keys(responseDta).map(key => {
      const [year, month] = key.split('-');
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      return { value: key, text: `${monthNames[parseInt(month) - 1]} ${year}` };
    });

    months.forEach(month => {
      $('#zonalOfficeSelect').append(`
                <option value='${month.value}'>${month.text}</option>
            `)
    });

    if (months.some(month => month.value === currentMonthYear)) {
      selectInput.value = currentMonthYear;
    } else {
      selectInput.value = months[0].value; // Fallback to the first available month
    }

    selectInput.addEventListener('change', function () {
      const selectedMonth = this.value;
      updateChart(selectedMonth, responseDta);
    });

    const initialMonth = selectInput.value;
    updateChart(initialMonth, responseDta);

  } catch (error) {
    console.log(error)
  }

  async function updateChart(month, data) {
    document.querySelector("#zonalOffContainer").innerHTML = '<canvas class="theChart" id="zonalOffPerformance"></canvas>';
    const ctx = document.getElementById('zonalOffPerformance').getContext('2d');

    try {
      const topOfficeNames = data[month].top.map(item => item.office_name);
      const topTotalPayments = data[month].top.map(item => item.total_payments);


      const chartData = {
        labels: topOfficeNames,
        datasets: [{
          label: 'Performance Metric',
          data: topTotalPayments,
          backgroundColor: topLeastColor3,
          borderColor: topLeastColor3,
          borderWidth: 2,
          barThickness: 30
        }]
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'x',
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return value + 'M';
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.dataset.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}M`;
              }
            }
          }
        }
      };

      const myChart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: options
      });

      // myChart.destroy();

    } catch (error) {
      console.log(error);
    }
  }

}
zonalOffPerformance()

// LEAST zonalOffPerformance chart 
async function leastZonalOffPerformance() {
  const selectInput = document.querySelector('#leastZonalOfficeSelect')

  try {
    const response = await fetch(`${HOST}?zonalOfficePerformance`)
    const responseDta = await response.json()

    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth() + 1; // JavaScript months are 0-based
    const currentMonthYear = `${currentYear}-${currentMonth}`;

    const months = Object.keys(responseDta).map(key => {
      const [year, month] = key.split('-');
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      return { value: key, text: `${monthNames[parseInt(month) - 1]} ${year}` };
    });

    months.forEach(month => {
      $('#leastZonalOfficeSelect').append(`
                <option value='${month.value}'>${month.text}</option>
            `)
    });

    if (months.some(month => month.value === currentMonthYear)) {
      selectInput.value = currentMonthYear;
    } else {
      selectInput.value = months[0].value; // Fallback to the first available month
    }

    selectInput.addEventListener('change', function () {
      const selectedMonth = this.value;
      updateChart(selectedMonth, responseDta);
    });

    const initialMonth = selectInput.value;
    updateChart(initialMonth, responseDta);

  } catch (error) {
    console.log(error)
  }

  async function updateChart(month, data) {
    document.querySelector("#leastZonalOffContainer").innerHTML = '<canvas class="theChart" id="leastZonalOffPerformance"></canvas>';
    const ctx = document.getElementById('leastZonalOffPerformance').getContext('2d');

    try {
      const leastOfficeNames = data[month].least.map(item => item.office_name);
      const leastTotalPayments = data[month].least.map(item => item.total_payments);

      const chartData = {
        labels: leastOfficeNames,
        datasets: [{
          label: 'Performance Metric',
          data: leastTotalPayments,
          backgroundColor: bottomLeastColors,
          borderColor: bottomLeastColors,
          borderWidth: 2,
          barThickness: 30
        }]
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'x',
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return value + 'M';
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.dataset.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}M`;
              }
            }
          }
        }
      };

      const myChart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: options
      });

      // myChart.destroy();

    } catch (error) {
      console.log(error);
    }
  }

}
leastZonalOffPerformance()

// Area office Performance
function areaOffice() {
  const ctx = document.getElementById('areaOffice').getContext('2d');

  const data = {
    labels: ['Area A', 'Area B', 'Area C', 'Area D', 'Area E', 'Area F', 'Area G', 'Area H', 'Area I', 'Area J'],
    datasets: [{
      label: 'Performance Metric',
      data: [150, 200, 300, 250, 100, 50, 75, 125, 175, 225],
      backgroundColor: topLeastColor5,
      borderColor: topLeastColor5,
      borderWidth: 2 // Thicker border for highlighting
    }]
  };

  const options = {
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: false
      },

    }
  };

  new Chart(ctx, {
    type: 'bar',
    data: data,
    options: options
  });

}
// areaOffice()

// top LGA performance
async function topLeastPerformance() {
  const selectInput = document.querySelector('#topLeastPerformanceSelect')

  try {
    const response = await fetch(`${HOST}?getMDALGAPerformance`)
    const responseDta = await response.json()

    function padNumberWithZero(num) {
      return num.toString().padStart(2, '0');
    }

    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = padNumberWithZero(date.getMonth() + 1); // JavaScript months are 0-based
    const currentMonthYear = `${currentYear}-${currentMonth}`;

    const months = Object.keys(responseDta).map(key => {
      const [year, month] = key.split('-');
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      return { value: key, text: `${monthNames[parseInt(month) - 1]} ${year}` };
    });

    months.forEach(month => {
      $('#topLeastPerformanceSelect').append(`
                <option value='${month.value}'>${month.text}</option>
            `)
    });

    if (months.some(month => month.value === currentMonthYear)) {
      selectInput.value = currentMonthYear;
    } else {
      selectInput.value = months[0].value; // Fallback to the first available month
    }

    selectInput.addEventListener('change', function () {
      const selectedMonth = this.value;
      updateChart(selectedMonth, responseDta);
    });

    const initialMonth = selectInput.value;
    updateChart(initialMonth, responseDta);

  } catch (error) {
    console.log(error)
  }

  async function updateChart(month, data) {
    document.querySelector("#topLeastPerformanceContainer").innerHTML = '<canvas class="theChart" id="topLeastPerformance"></canvas>';
    const ctx = document.getElementById('topLeastPerformance').getContext('2d');

    try {
      const topLgaNames = data[month].top.map(item => item.lga);
      const topTotalPayments = data[month].top.map(item => item.total_payments);
      const topTotalInvoices = data[month].top.map(item => item.total_invoices);

      const labels = topLgaNames;

      const revenueCollected = topTotalPayments;
      const invoicesGenerated = topTotalInvoices;

      const chartData = {
        labels: labels,
        datasets: [
          {
            label: 'Revenue Collected',
            data: revenueCollected,
            backgroundColor: topLeastColor5,
            borderColor: topLeastColor5,
            borderWidth: 1,
            yAxisID: 'yLeft'
          },
          {
            label: 'Invoices Generated',
            data: invoicesGenerated,
            backgroundColor: topBlOr,
            borderColor: topBlOr,
            borderWidth: 1,
            yAxisID: 'yRight'
          }
        ]
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yLeft: {
            beginAtZero: true,
            position: 'left',
            title: {
              display: true,
              text: 'Revenue Collected'
            },
            ticks: {
              callback: function (value) {
                return value + 'M';
              }
            }
          },
          yRight: {
            beginAtZero: true,
            position: 'right',
            title: {
              display: true,
              text: 'Invoices Generated'
            },
            ticks: {
              callback: function (value) {
                return value + 'M';
              }
            },
            grid: {
              drawOnChartArea: false  // Only want the grid lines for one axis to show up
            }
          },
          x: {
            title: {
              display: true,
              text: 'LGA Name'
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.dataset.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}M`;
              }
            }
          }
        }
      };

      new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: options
      });

    } catch (error) {
      console.log(error);
    }
  }


}
// topLeastPerformance()

// Least LGA performance
async function LeastPerformance() {
  const selectInput = document.querySelector('#LeastPerformanceSelect')

  try {
    const response = await fetch(`${HOST}?getMDALGAPerformance`)
    const responseDta = await response.json()

    function padNumberWithZero(num) {
      return num.toString().padStart(2, '0');
    }

    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = padNumberWithZero(date.getMonth() + 1); // JavaScript months are 0-based
    const currentMonthYear = `${currentYear}-${currentMonth}`;

    const months = Object.keys(responseDta).map(key => {
      const [year, month] = key.split('-');
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      return { value: key, text: `${monthNames[parseInt(month) - 1]} ${year}` };
    });

    months.forEach(month => {
      $('#LeastPerformanceSelect').append(`
                <option value='${month.value}'>${month.text}</option>
            `)
    });

    if (months.some(month => month.value === currentMonthYear)) {
      selectInput.value = currentMonthYear;
    } else {
      selectInput.value = months[0].value; // Fallback to the first available month
    }

    selectInput.addEventListener('change', function () {
      const selectedMonth = this.value;
      updateChart(selectedMonth, responseDta);
    });

    const initialMonth = selectInput.value;
    updateChart(initialMonth, responseDta);

  } catch (error) {
    console.log(error)
  }

  async function updateChart(month, data) {
    document.querySelector("#LeastPerformanceContainer").innerHTML = '<canvas class="theChart" id="LeastPerformance"></canvas>';
    const ctx = document.getElementById('LeastPerformance').getContext('2d');

    try {

      const leastLgaNames = data[month].least.map(item => item.lga);
      const leastTotalPayments = data[month].least.map(item => item.total_payments);
      const leastTotalInvoices = data[month].least.map(item => item.total_invoices);

      const labels = leastLgaNames;

      const revenueCollected = leastTotalPayments;
      const invoicesGenerated = leastTotalInvoices;

      const chartData = {
        labels: labels,
        datasets: [
          {
            label: 'Revenue Collected',
            data: revenueCollected,
            backgroundColor: topLeastColor5,
            borderColor: topLeastColor5,
            borderWidth: 1,
            yAxisID: 'yLeft'
          },
          {
            label: 'Invoices Generated',
            data: invoicesGenerated,
            backgroundColor: topBlOr,
            borderColor: topBlOr,
            borderWidth: 1,
            yAxisID: 'yRight'
          }
        ]
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yLeft: {
            beginAtZero: true,
            position: 'left',
            title: {
              display: true,
              text: 'Revenue Collected'
            },
            ticks: {
              callback: function (value) {
                return value + 'M';
              }
            }
          },
          yRight: {
            beginAtZero: true,
            position: 'right',
            title: {
              display: true,
              text: 'Invoices Generated'
            },
            ticks: {
              callback: function (value) {
                return value + 'M';
              }
            },
            grid: {
              drawOnChartArea: false  // Only want the grid lines for one axis to show up
            }
          },
          x: {
            title: {
              display: true,
              text: 'LGA Name'
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.dataset.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}M`;
              }
            }
          }
        }
      };

      new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: options
      });

    } catch (error) {
      console.log(error);
    }
  }


}
// LeastPerformance()

// Top 5 performing Revenue Head
async function topLeastPerformanceRev() {
  const selectInput = document.querySelector('#topLeastPerformanceRevSelect')

  try {
    const response = await fetch(`${HOST}?getRevenueHeadsPerformance`)
    const responseDta = await response.json()

    function padNumberWithZero(num) {
      return num.toString().padStart(2, '0');
    }

    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = padNumberWithZero(date.getMonth() + 1); // JavaScript months are 0-based
    const currentMonthYear = `${currentYear}-${currentMonth}`;

    const months = Object.keys(responseDta).map(key => {
      const [year, month] = key.split('-');
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      return { value: key, text: `${monthNames[parseInt(month) - 1]} ${year}` };
    });

    months.forEach(month => {
      $('#topLeastPerformanceRevSelect').append(`
                <option value='${month.value}'>${month.text}</option>
            `)
    });

    if (months.some(month => month.value === currentMonthYear)) {
      selectInput.value = currentMonthYear;
    } else {
      selectInput.value = months[0].value; // Fallback to the first available month
    }

    selectInput.addEventListener('change', function () {
      const selectedMonth = this.value;
      updateChart(selectedMonth, responseDta);
    });

    const initialMonth = selectInput.value;
    updateChart(initialMonth, responseDta);

  } catch (error) {
    console.log(error)
  }

  async function updateChart(month, data) {
    document.querySelector("#topLeastPerformanceRevContainer").innerHTML = '<canvas class="theChart" id="topLeastPerformanceRev"></canvas>';
    const ctx = document.getElementById('topLeastPerformanceRev').getContext('2d');

    try {
      const topRevNames = data[month].top.map(item => item.revenue_head);
      const topTotalPayments = data[month].top.map(item => item.total_payments);

      const labels = topRevNames;

      const revenueCollected = topTotalPayments;

      const chartData = {
        // labels: labels,
        labels: labels.map(x => { return x.split(" ") }),
        datasets: [{
          label: 'Revenue Collected',
          data: revenueCollected,
          backgroundColor: topLeastColor5,
          borderColor: topLeastColor5,
          borderWidth: 2,
          barThickness: 30,
        }]
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'x',  // This makes the bar chart horizontal
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Revenue Collected'
            },
            ticks: {
              callback: function (value) {
                return value + 'M';
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Revenue Head'
            },
            ticks: {
              maxRotation: 0 // angle in degrees
            }
            
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.dataset.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}M`;
              },
              title: function (context) {
                return context[0].label.replaceAll(',', ' ')
              }
            }
          }
        }
      };

      new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: options
      });

    } catch (error) {
      console.log(error);
    }
  }

}
topLeastPerformanceRev()

// Least 5 performing Revenue Head
async function LeastPerformanceRev() {
  const selectInput = document.querySelector('#LeastPerformanceRevSelect')

  try {
    const response = await fetch(`${HOST}?getRevenueHeadsPerformance`)
    const responseDta = await response.json()

    function padNumberWithZero(num) {
      return num.toString().padStart(2, '0');
    }

    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = padNumberWithZero(date.getMonth() + 1); // JavaScript months are 0-based
    const currentMonthYear = `${currentYear}-${currentMonth}`;

    const months = Object.keys(responseDta).map(key => {
      const [year, month] = key.split('-');
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      return { value: key, text: `${monthNames[parseInt(month) - 1]} ${year}` };
    });

    months.forEach(month => {
      $('#LeastPerformanceRevSelect').append(`
                <option value='${month.value}'>${month.text}</option>
            `)
    });

    if (months.some(month => month.value === currentMonthYear)) {
      selectInput.value = currentMonthYear;
    } else {
      selectInput.value = months[0].value; // Fallback to the first available month
    }

    selectInput.addEventListener('change', function () {
      const selectedMonth = this.value;
      updateChart(selectedMonth, responseDta);
    });

    const initialMonth = selectInput.value;
    updateChart(initialMonth, responseDta);

  } catch (error) {
    console.log(error)
  }

  async function updateChart(month, data) {
    document.querySelector("#LeastPerformanceRevContainer").innerHTML = '<canvas class="theChart" id="LeastPerformanceRev"></canvas>';
    const ctx = document.getElementById('LeastPerformanceRev').getContext('2d');

    try {

      const leastRevNames = data[month].least.map(item => item.revenue_head);
      const leastTotalPayments = data[month].least.map(item => item.total_payments);

      const labels = leastRevNames;

      const revenueCollected = leastTotalPayments;

      const chartData = {
        labels: labels.map(x => { return x.split(" ") }),
        datasets: [{
          label: 'Revenue Collected',
          data: revenueCollected,
          backgroundColor: bottomLeastColors,
          borderColor: bottomLeastColors,
          borderWidth: 2,
          barThickness: 30,
        }]
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'x',  // This makes the bar chart horizontal
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Revenue Collected'
            },
            ticks: {
              callback: function (value) {
                return value.toFixed(4) + 'M';
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Revenue Head'
            },
            ticks: {
              maxRotation: 0
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.dataset.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}M`;
              }
            }
          }
        }
      };

      new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: options
      });

    } catch (error) {
      console.log(error);
    }
  }

}
LeastPerformanceRev()


// INDUSTRIES PERFORMANCE

async function industriesPerformance() {
  const selectInput = document.querySelector('#industriesSelect')

  try {
    const response = await fetch(`${HOST}?getExpectedRevenueByIndustries`)
    const responseDta = await response.json()

    function padNumberWithZero(num) {
      return num.toString().padStart(2, '0');
    }

    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = padNumberWithZero(date.getMonth() + 1); // JavaScript months are 0-based
    const currentMonthYear = `${currentYear}-${currentMonth}`;

    const months = Object.keys(responseDta).map(key => {
      const [year, month] = key.split('-');
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      return { value: key, text: `${monthNames[parseInt(month) - 1]} ${year}` };
    });

    months.forEach(month => {
      $('#industriesSelect').append(`
                <option value='${month.value}'>${month.text}</option>
            `)
    });

    if (months.some(month => month.value === currentMonthYear)) {
      selectInput.value = currentMonthYear;
    } else {
      selectInput.value = months[0].value; // Fallback to the first available month
    }

    selectInput.addEventListener('change', function () {
      const selectedMonth = this.value;
      updateChart(selectedMonth, responseDta);
    });

    const initialMonth = selectInput.value;
    updateChart(initialMonth, responseDta);

  } catch (error) {
    console.log(error)
  }

  async function updateChart(month, data) {
    document.querySelector("#industriesSelectContainer").innerHTML = '<canvas class="theChart" id="industriesSelectPerformance"></canvas>';
    const ctx = document.getElementById('industriesSelectPerformance').getContext('2d');

    try {
      const topRevNames = data[month].map(item => item.industry);
      const topTotalPayments = data[month].map(item => item.total_revenue);

      const labels = topRevNames;

      const revenueCollected = topTotalPayments;

      const chartData = {
        labels: labels,
        datasets: [{
          label: 'Revenue Collected',
          data: revenueCollected,
          backgroundColor: "#E6D9B9",
          borderColor: "#015826",
          borderWidth: 2,
          barThickness: 30,
        }]
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'x',  // This makes the bar chart horizontal
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Revenue Collected by Industry'
            },
            ticks: {
              callback: function (value) {
                return value + 'M';
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Industry'
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.dataset.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}M`;
              }
            }
          }
        }
      };

      new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: options
      });

    } catch (error) {
      console.log(error);
    }
  }

}
industriesPerformance()

// Top 5 performing MDA
async function topLeastPerformanceMDA() {
  const selectInput = document.querySelector('#topLeastPerformanceMDASelect')

  try {
    const response = await fetch(`${HOST}?getMDAPerformance`)
    const responseDta = await response.json()

    function padNumberWithZero(num) {
      return num.toString().padStart(2, '0');
    }

    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = padNumberWithZero(date.getMonth() + 1); // JavaScript months are 0-based
    const currentMonthYear = `${currentYear}-${currentMonth}`;

    const months = Object.keys(responseDta).map(key => {
      const [year, month] = key.split('-');
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      return { value: key, text: `${monthNames[parseInt(month) - 1]} ${year}` };
    });

    months.forEach(month => {
      $('#topLeastPerformanceMDASelect').append(`
                <option value='${month.value}'>${month.text}</option>
            `)
    });

    if (months.some(month => month.value === currentMonthYear)) {
      selectInput.value = currentMonthYear;
    } else {
      selectInput.value = months[0].value; // Fallback to the first available month
    }

    selectInput.addEventListener('change', function () {
      const selectedMonth = this.value;
      updateChart(selectedMonth, responseDta);
    });

    const initialMonth = selectInput.value;
    updateChart(initialMonth, responseDta);

  } catch (error) {
    console.log(error)
  }

  async function updateChart(month, data) {
    document.querySelector("#topLeastPerformanceMDAContainer").innerHTML = '<canvas class="theChart" id="topLeastPerformanceMDA"></canvas>';
    const ctx = document.getElementById('topLeastPerformanceMDA').getContext('2d');

    try {
      const topMdaNames = data[month].top.map(item => item.mda);
      const topTotalPayments = data[month].top.map(item => item.total_payments);

      const labels = topMdaNames;

      const revenueCollected = topTotalPayments;

      const chartData = {
        labels: labels.map(x => { return x.split(" ") }),
        datasets: [{
          label: 'Revenue Collected',
          data: revenueCollected,
          backgroundColor: topLeastColor5,
          borderColor: topLeastColor5,
          borderWidth: 2,
          barThickness: 30,  // Highlight bars by making them thicker
        }]
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'x',  // This makes the bar chart horizontal
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Revenue Collected'
            },
            ticks: {
              callback: function (value) {
                return value + 'M';
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'MDA'
            },
            ticks: {
              maxRotation: 0
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.dataset.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}M`;
              }
            }
          }
        }
      };

      new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: options
      });

    } catch (error) {
      console.log(error);
    }
  }
}
topLeastPerformanceMDA()

// Least 5 performing MDA
async function LeastPerformanceMDA() {
  const selectInput = document.querySelector('#LeastPerformanceMDASelect')

  try {
    const response = await fetch(`${HOST}?getMDAPerformance`)
    const responseDta = await response.json()

    function padNumberWithZero(num) {
      return num.toString().padStart(2, '0');
    }

    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = padNumberWithZero(date.getMonth() + 1); // JavaScript months are 0-based
    const currentMonthYear = `${currentYear}-${currentMonth}`;

    const months = Object.keys(responseDta).map(key => {
      const [year, month] = key.split('-');
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      return { value: key, text: `${monthNames[parseInt(month) - 1]} ${year}` };
    });

    months.forEach(month => {
      $('#LeastPerformanceMDASelect').append(`
                <option value='${month.value}'>${month.text}</option>
            `)
    });

    if (months.some(month => month.value === currentMonthYear)) {
      selectInput.value = currentMonthYear;
    } else {
      selectInput.value = months[0].value; // Fallback to the first available month
    }

    selectInput.addEventListener('change', function () {
      const selectedMonth = this.value;
      updateChart(selectedMonth, responseDta);
    });

    const initialMonth = selectInput.value;
    updateChart(initialMonth, responseDta);

  } catch (error) {
    console.log(error)
  }

  async function updateChart(month, data) {
    document.querySelector("#LeastPerformanceMDAContainer").innerHTML = '<canvas class="theChart" id="LeastPerformanceMDA"></canvas>';
    const ctx = document.getElementById('LeastPerformanceMDA').getContext('2d');

    try {
      const leastMdaNames = data[month].least.map(item => item.mda);
      const leastTotalPayments = data[month].least.map(item => item.total_payments);

      const labels = leastMdaNames;

      const revenueCollected = leastTotalPayments;

      const chartData = {
        labels: labels.map(x => { return x.split(" ") }),
        datasets: [{
          label: 'Revenue Collected',
          data: revenueCollected,
          backgroundColor: bottomLeastColors,
          borderColor: bottomLeastColors,
          borderWidth: 2,
          barThickness: 30,  // Highlight bars by making them thicker
        }]
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'x',  // This makes the bar chart horizontal
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Revenue Collected'
            },
            ticks: {
              callback: function (value) {
                return value + 'M';
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'MDA'
            },
            ticks: {
              maxRotation: 0
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.dataset.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}M`;
              }
            }
          }
        }
      };

      new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: options
      });

    } catch (error) {
      console.log(error);
    }
  }
}
LeastPerformanceMDA()

// preferred payment channel
async function paymentChannel() {
  const selectInput = document.querySelector('#paymentChannelSelect')

  try {
    const response = await fetch(`${HOST}?analyticsTaxPayerPayment`)
    const responseDta = await response.json()

    function padNumberWithZero(num) {
      return num.toString().padStart(2, '0');
    }

    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = padNumberWithZero(date.getMonth() + 1); // JavaScript months are 0-based
    const currentMonthYear = `${currentYear}-${currentMonth}`;

    const months = Object.keys(responseDta).map(key => {
      const [year, month] = key.split('-');
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      return { value: key, text: `${monthNames[parseInt(month) - 1]} ${year}` };
    });

    months.forEach(month => {
      $('#paymentChannelSelect').append(`
                <option value='${month.value}'>${month.text}</option>
            `)
    });

    if (months.some(month => month.value === currentMonthYear)) {
      selectInput.value = currentMonthYear;
    } else {
      selectInput.value = months[0].value; // Fallback to the first available month
    }

    selectInput.addEventListener('change', function () {
      const selectedMonth = this.value;
      console.log(selectedMonth, responseDta)
      updateChart(selectedMonth, responseDta);
    });

    const initialMonth = selectInput.value;
    updateChart(initialMonth, responseDta);

  } catch (error) {
    console.log(error)
  }

  async function updateChart(month, data) {
    document.querySelector("#paymentChannelContainer").innerHTML = '<canvas class="theChart" id="paymentChannel"></canvas>';
    const ctx = document.getElementById('paymentChannel').getContext('2d');

    try {
      const payment_channel = data[month].map(item => item.payment_channel)
      const total_amount = data[month].map(item => item.percentage)

      const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      };

      const generateColors = (numColors) => {
        const colors = [];
        for (let i = 0; i < numColors; i++) {
          colors.push(getRandomColor());
        }
        return colors;
      };

      const chartData = {
        labels: payment_channel,
        datasets: [{
          label: 'Payment Methods',
          data: total_amount,
          backgroundColor: generateColors(data[month].length),
          borderWidth: 1
        }]
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}%`;
              }
            }
          }
        }
      };

      const myChart = new Chart(ctx, {
        type: 'pie',
        data: chartData,
        options: options
      });

    } catch (error) {
      console.log(error)
    }

  }

}
paymentChannel()

// Preferred Payment Bank
async function paymentBank() {
  const selectInput = document.querySelector('#paymentBankSelect')

  try {
    const response = await fetch(`${HOST}?analyticsTaxPayerPaymentBank`)
    const responseDta = await response.json()

    function padNumberWithZero(num) {
      return num.toString().padStart(2, '0');
    }

    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = padNumberWithZero(date.getMonth() + 1); // JavaScript months are 0-based
    const currentMonthYear = `${currentYear}-${currentMonth}`;

    const months = Object.keys(responseDta).map(key => {
      const [year, month] = key.split('-');
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      return { value: key, text: `${monthNames[parseInt(month) - 1]} ${year}` };
    });

    months.forEach(month => {
      $('#paymentBankSelect').append(`
                <option value='${month.value}'>${month.text}</option>
            `)
    });

    if (months.some(month => month.value === currentMonthYear)) {
      selectInput.value = currentMonthYear;
    } else {
      selectInput.value = months[0].value; // Fallback to the first available month
    }

    selectInput.addEventListener('change', function () {
      const selectedMonth = this.value;
      console.log(selectedMonth, responseDta)
      updateChart(selectedMonth, responseDta);
    });

    const initialMonth = selectInput.value;
    updateChart(initialMonth, responseDta);

  } catch (error) {
    console.log(error)
  }

  async function updateChart(month, data) {
    document.querySelector("#paymentBankContainer").innerHTML = '<canvas class="theChart" id="paymentBank"></canvas>';
    const ctx = document.getElementById('paymentBank').getContext('2d');

    try {
      const payment_channel = data[month].map(item => item.payment_bank)
      const total_amount = data[month].map(item => item.percentage)

      const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      };

      const generateColors = (numColors) => {
        const colors = [];
        for (let i = 0; i < numColors; i++) {
          colors.push(getRandomColor());
        }
        return colors;
      };

      const chartData = {
        labels: payment_channel,
        datasets: [{
          label: 'Payment Banks',
          data: total_amount,
          backgroundColor: generateColors(data[month].length),
          borderWidth: 1
        }]
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}%`;
              }
            }
          }
        }
      };

      const myChart = new Chart(ctx, {
        type: 'pie',
        data: chartData,
        options: options
      });

    } catch (error) {
      console.log(error)
    }

  }

}
paymentBank()

// Preferred Payment Method
async function paymentMethod() {
  const selectInput = document.querySelector('#paymentMethodSelect')

  try {
    const response = await fetch(`${HOST}?analyticsTaxPayerPaymentMethod`)
    const responseDta = await response.json()

    function padNumberWithZero(num) {
      return num.toString().padStart(2, '0');
    }

    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = padNumberWithZero(date.getMonth() + 1); // JavaScript months are 0-based
    const currentMonthYear = `${currentYear}-${currentMonth}`;

    const months = Object.keys(responseDta).map(key => {
      const [year, month] = key.split('-');
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      return { value: key, text: `${monthNames[parseInt(month) - 1]} ${year}` };
    });

    months.forEach(month => {
      $('#paymentMethodSelect').append(`
                <option value='${month.value}'>${month.text}</option>
            `)
    });

    if (months.some(month => month.value === currentMonthYear)) {
      selectInput.value = currentMonthYear;
    } else {
      selectInput.value = months[0].value; // Fallback to the first available month
    }

    selectInput.addEventListener('change', function () {
      const selectedMonth = this.value;
      console.log(selectedMonth, responseDta)
      updateChart(selectedMonth, responseDta);
    });

    const initialMonth = selectInput.value;
    updateChart(initialMonth, responseDta);

  } catch (error) {
    console.log(error)
  }

  async function updateChart(month, data) {
    document.querySelector("#paymentMethodContainer").innerHTML = '<canvas class="theChart" id="paymentMethod"></canvas>';
    const ctx = document.getElementById('paymentMethod').getContext('2d');

    try {
      const payment_channel = data[month].map(item => item.payment_method)
      const total_amount = data[month].map(item => item.percentage)

      const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      };

      const generateColors = (numColors) => {
        const colors = [];
        for (let i = 0; i < numColors; i++) {
          colors.push(getRandomColor());
        }
        return colors;
      };

      const chartData = {
        labels: payment_channel,
        datasets: [{
          label: 'Payment Method',
          data: total_amount,
          backgroundColor: generateColors(data[month].length),
          borderWidth: 1
        }]
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}%`;
              }
            }
          }
        }
      };

      const myChart = new Chart(ctx, {
        type: 'pie',
        data: chartData,
        options: options
      });

    } catch (error) {
      console.log(error)
    }

  }

}
paymentMethod()


// AMOUNT OF INVOICE GENERATED BASED CATEGORY
async function amountInvgenerated() {
  const selectInput = document.querySelector('#amountInvgeneratedSelected')

  try {
    const response = await fetch(`${HOST}?getMonthlyRevenueByUserCategories`)
    const responseDta = await response.json()

    function padNumberWithZero(num) {
      return num.toString().padStart(2, '0');
    }

    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = padNumberWithZero(date.getMonth() + 1); // JavaScript months are 0-based
    const currentMonthYear = `${currentYear}-${currentMonth}`;

    const months = Object.keys(responseDta).map(key => {
      const [year, month] = key.split('-');
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      return { value: key, text: `${monthNames[parseInt(month) - 1]} ${year}` };
    });

    months.forEach(month => {
      $('#amountInvgeneratedSelected').append(`
                <option value='${month.value}'>${month.text}</option>
            `)
    });

    if (months.some(month => month.value === currentMonthYear)) {
      selectInput.value = currentMonthYear;
    } else {
      selectInput.value = months[0].value; // Fallback to the first available month
    }

    selectInput.addEventListener('change', function () {
      const selectedMonth = this.value;
      updateChart(selectedMonth, responseDta);
    });

    const initialMonth = selectInput.value;
    updateChart(initialMonth, responseDta);

  } catch (error) {
    console.log(error)
  }

  async function updateChart(month, data) {
    document.querySelector("#amountInvgeneratedContainer").innerHTML = '<canvas class="theChart" id="amountInvgenerated"></canvas>';
    const ctx = document.getElementById('amountInvgenerated').getContext('2d');

    try {
      const theCategories = data[month].map(item => item.user_category)
      const theTotalPayments = data[month].map(item => item.total_monthly_revenue)

      const chartData = {
        labels: theCategories,
        datasets: [{
          label: 'Amount of Invoices Generated',
          data: theTotalPayments,
          backgroundColor: invgencolors,
          borderColor: invgencolors,
          borderWidth: 1,
          barThickness: 80
        }]
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.dataset.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}M`;
              }
            }
          }
        }
      };

      new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: options
      });

    } catch (error) {
      console.log(error);
    }
  }
}
amountInvgenerated()

// invoice generated category
async function invgenerated() {
  const selectInput = document.querySelector('#invgeneratedSelected')

  try {
    const response = await fetch(`${HOST}?getInvoicesGeneratedBasedOnCategories`)
    const responseDta = await response.json()

    function padNumberWithZero(num) {
      return num.toString().padStart(2, '0');
    }

    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = padNumberWithZero(date.getMonth() + 1); // JavaScript months are 0-based
    const currentMonthYear = `${currentYear}-${currentMonth}`;

    const months = Object.keys(responseDta.results).map(key => {
      const [year, month] = key.split('-');
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      return { value: key, text: `${monthNames[parseInt(month) - 1]} ${year}` };
    });

    months.forEach(month => {
      $('#invgeneratedSelected').append(`
                <option value='${month.value}'>${month.text}</option>
            `)
    });

    if (months.some(month => month.value === currentMonthYear)) {
      selectInput.value = currentMonthYear;
    } else {
      selectInput.value = months[0].value; // Fallback to the first available month
    }

    selectInput.addEventListener('change', function () {
      const selectedMonth = this.value;
      updateChart(selectedMonth, responseDta.results);
    });

    const initialMonth = selectInput.value;
    updateChart(initialMonth, responseDta.results);

  } catch (error) {
    console.log(error)
  }

  async function updateChart(month, data) {
    document.querySelector("#invgeneratedContainer").innerHTML = '<canvas class="theChart" id="invgenerated"></canvas>';
    const ctx = document.getElementById('invgenerated').getContext('2d');

    try {
      const theCategories = data[month].invoicesPerCategory.map(item => item.category)
      const theTotalPayments = data[month].invoicesPerCategory.map(item => item.count)

      const chartData = {
        labels: theCategories,
        datasets: [{
          label: 'Number of Invoices Generated',
          data: theTotalPayments,
          backgroundColor: invgencolors,
          borderColor: invgencolors,
          borderWidth: 1,
          barThickness: 80
        }]
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.dataset.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}`;
              }
            }
          }
        }
      };

      new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: options
      });

    } catch (error) {
      console.log(error);
    }
  }
}
invgenerated()

// invoice paid category
async function invpaid() {
  const selectInput = document.querySelector('#invpaidSelected')

  try {
    const response = await fetch(`${HOST}?getAnalyticPaidInvoiceBasedOnCategories`)
    const responseDta = await response.json()

    function padNumberWithZero(num) {
      return num.toString().padStart(2, '0');
    }

    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = padNumberWithZero(date.getMonth() + 1); // JavaScript months are 0-based
    const currentMonthYear = `${currentYear}-${currentMonth}`;

    const months = Object.keys(responseDta.results).map(key => {
      const [year, month] = key.split('-');
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      return { value: key, text: `${monthNames[parseInt(month) - 1]} ${year}` };
    });

    months.forEach(month => {
      $('#invpaidSelected').append(`
                <option value='${month.value}'>${month.text}</option>
            `)
    });

    if (months.some(month => month.value === currentMonthYear)) {
      selectInput.value = currentMonthYear;
    } else {
      selectInput.value = months[0].value; // Fallback to the first available month
    }

    selectInput.addEventListener('change', function () {
      const selectedMonth = this.value;
      updateChart(selectedMonth, responseDta.results);
    });

    const initialMonth = selectInput.value;
    updateChart(initialMonth, responseDta.results);

  } catch (error) {
    console.log(error)
  }

  async function updateChart(month, data) {
    document.querySelector("#invpaidContainer").innerHTML = '<canvas class="theChart" id="invpaid"></canvas>';
    const ctx = document.getElementById('invpaid').getContext('2d');

    try {
      const theCategories = data[month].paidInvoicesPerCategory.map(item => item.category)
      const theTotalPayments = data[month].paidInvoicesPerCategory.map(item => item.count)

      const chartData = {
        labels: theCategories,
        datasets: [{
          label: 'Number of Invoices Paid',
          data: theTotalPayments,
          backgroundColor: invgencolors,
          borderColor: invgencolors,
          borderWidth: 1,
          barThickness: 80
        }]
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.dataset.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}`;
              }
            }
          }
        }
      };

      new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: options
      });

    } catch (error) {
      console.log(error);
    }
  }
}
invpaid()

// Average  payment time
async function avgpayment() {
  const selectInput = document.querySelector('#avgpaymentSelected')

  try {
    const response = await fetch(`${HOST}?averagePaymentTime`)
    const responseDta = await response.json()

    function padNumberWithZero(num) {
      return num.toString().padStart(2, '0');
    }

    const years = Object.keys(responseDta);

    years.forEach(year => {
      const option = document.createElement('option');
      option.value = year;
      option.text = year;
      selectInput.appendChild(option);
    });

    const date = new Date();
    const currentYear = date.getFullYear().toString();

    if (years.includes(currentYear)) {
      selectInput.value = currentYear;
    } else {
      selectInput.value = years[0]; // Fallback to the first available year
    }


    selectInput.addEventListener('change', function () {
      const selectedYear = this.value;
      updateChart(selectedYear, responseDta);
    });

    const initialYear = selectInput.value;
    updateChart(initialYear, responseDta);

  } catch (error) {
    console.log(error)
  }

  async function updateChart(year, data) {
    document.querySelector("#avgpaymentContainer").innerHTML = '<canvas class="theChart" id="avgpayment"></canvas>';
    const ctx = document.getElementById('avgpayment').getContext('2d');

    try {
      const monthsData = data[year];
      const monthNames = monthsData.map(item => {
        const [year, month] = item.month.split('-');
        return new Date(year, month - 1).toLocaleString('default', { month: 'long' });
      });
      const avgCycleTimes = monthsData.map(item => item.avg_cycle_time_hours);

      const chartData = {
        labels: monthNames,
        datasets: [{
          label: 'Average Cycle Time (hours)',
          data: avgCycleTimes,
          backgroundColor: lightercol,
          borderColor: invgencolors[0],
          borderWidth: 2,
          fill: true,
          tension: 0.2
        }]
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'months'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Average Payment Time'
            }
          }
        },
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.dataset.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}hrs`;
              }
            }
          }
        }
      };

      new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: options
      });

    } catch (error) {
      console.log(error);
    }
  }

}
avgpayment()

// monthly invoice verification
function monthlyInvVerification() {
  const ctx = document.getElementById('monthlyInvVerification').getContext('2d');

  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [{
      label: 'Number of Invoices Verified',
      data: [30, 25, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80],
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',  // January
        'rgba(54, 162, 235, 0.8)',  // February
        'rgba(255, 206, 86, 0.8)',  // March
        'rgba(75, 192, 192, 0.8)',  // April
        'rgba(153, 102, 255, 0.8)',  // May
        'rgba(255, 159, 64, 0.8)',  // June
        'rgba(199, 199, 199, 0.8)',  // July
        'rgba(83, 102, 255, 0.8)',  // August
        'rgba(99, 255, 132, 0.8)',  // September
        'rgba(132, 99, 255, 0.8)',  // October
        'rgba(162, 235, 54, 0.8)',  // November
        'rgba(206, 86, 255, 0.8)'   // December
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',  // January
        'rgba(54, 162, 235, 1)',  // February
        'rgba(255, 206, 86, 1)',  // March
        'rgba(75, 192, 192, 1)',  // April
        'rgba(153, 102, 255, 1)',  // May
        'rgba(255, 159, 64, 1)',  // June
        'rgba(199, 199, 199, 1)',  // July
        'rgba(83, 102, 255, 1)',  // August
        'rgba(99, 255, 132, 1)',  // September
        'rgba(132, 99, 255, 1)',  // October
        'rgba(162, 235, 54, 1)',  // November
        'rgba(206, 86, 255, 1)'   // December
      ],
      borderWidth: 1
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Invoices Verified'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Month'
        }
      }
    },
    plugins: {
      legend: {
        display: false  // Hide the legend since there is only one dataset
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}`;
          }
        }
      }
    }
  };

  new Chart(ctx, {
    type: 'bar',
    data: data,
    options: options
  });
}
// monthlyInvVerification()

// weekly invoice verification
function weeklyInvVerification() {
  const ctx = document.getElementById('weeklyInvVerification').getContext('2d');

  const data = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11', 'Week 12'],
    datasets: [{
      label: 'Number of Invoices Verified',
      data: [30, 25, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80],
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',  // Week 1
        'rgba(54, 162, 235, 0.8)',  // Week 2
        'rgba(255, 206, 86, 0.8)',  // Week 3
        'rgba(75, 192, 192, 0.8)',  // Week 4
        'rgba(153, 102, 255, 0.8)',  // Week 5
        'rgba(255, 159, 64, 0.8)',  // Week 6
        'rgba(199, 199, 199, 0.8)',  // Week 7
        'rgba(83, 102, 255, 0.8)',  // Week 8
        'rgba(99, 255, 132, 0.8)',  // Week 9
        'rgba(132, 99, 255, 0.8)',  // Week 10
        'rgba(162, 235, 54, 0.8)',  // Week 11
        'rgba(206, 86, 255, 0.8)'   // Week 12
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',  // Week 1
        'rgba(54, 162, 235, 1)',  // Week 2
        'rgba(255, 206, 86, 1)',  // Week 3
        'rgba(75, 192, 192, 1)',  // Week 4
        'rgba(153, 102, 255, 1)',  // Week 5
        'rgba(255, 159, 64, 1)',  // Week 6
        'rgba(199, 199, 199, 1)',  // Week 7
        'rgba(83, 102, 255, 1)',  // Week 8
        'rgba(99, 255, 132, 1)',  // Week 9
        'rgba(132, 99, 255, 1)',  // Week 10
        'rgba(162, 235, 54, 1)',  // Week 11
        'rgba(206, 86, 255, 1)'   // Week 12
      ],
      borderWidth: 1
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Invoices Verified'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Week'
        }
      }
    },
    plugins: {
      legend: {
        display: false  // Hide the legend since there is only one dataset
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}`;
          }
        }
      }
    }
  };

  new Chart(ctx, {
    type: 'bar',
    data: data,
    options: options
  });
}
// weeklyInvVerification()

// daily invoice verification
function dailyInvVerification() {
  const ctx = document.getElementById('dailyInvVerification').getContext('2d');

  const data = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Day 9', 'Day 10'],
    datasets: [{
      label: 'Number of Invoices Verified',
      data: [30, 25, 35, 40, 45, 50, 55, 60, 65, 70],
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',  // Day 1
        'rgba(54, 162, 235, 0.8)',  // Day 2
        'rgba(255, 206, 86, 0.8)',  // Day 3
        'rgba(75, 192, 192, 0.8)',  // Day 4
        'rgba(153, 102, 255, 0.8)',  // Day 5
        'rgba(255, 159, 64, 0.8)',  // Day 6
        'rgba(199, 199, 199, 0.8)',  // Day 7
        'rgba(83, 102, 255, 0.8)',  // Day 8
        'rgba(99, 255, 132, 0.8)',  // Day 9
        'rgba(132, 99, 255, 0.8)',  // Day 10
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',  // Day 1
        'rgba(54, 162, 235, 1)',  // Day 2
        'rgba(255, 206, 86, 1)',  // Day 3
        'rgba(75, 192, 192, 1)',  // Day 4
        'rgba(153, 102, 255, 1)',  // Day 5
        'rgba(255, 159, 64, 1)',  // Day 6
        'rgba(199, 199, 199, 1)',  // Day 7
        'rgba(83, 102, 255, 1)',  // Day 8
        'rgba(99, 255, 132, 1)',  // Day 9
        'rgba(132, 99, 255, 1)',  // Day 10
      ],
      borderWidth: 1
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Invoices Verified'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Day'
        }
      }
    },
    plugins: {
      legend: {
        display: false  // Hide the legend since there is only one dataset
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}`;
          }
        }
      }
    }
  };

  new Chart(ctx, {
    type: 'bar',
    data: data,
    options: options
  });
}
// dailyInvVerification()


// commonsubject raised support
function commonsubjectSupport() {
  const ctx = document.getElementById('commonsubjectSupport').getContext('2d');

  const labels = ['Technical', 'Billing', 'Account', 'Sales', 'Other'];
  const dataCounts = [45, 30, 15, 10, 20];  // Example data counts

  const data = {
    labels: labels,
    datasets: [{
      label: 'Support Issues',
      data: dataCounts,
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',  // Red
        'rgba(54, 162, 235, 0.8)',  // Blue
        'rgba(255, 206, 86, 0.8)',  // Yellow
        'rgba(75, 192, 192, 0.8)',  // Green
        'rgba(153, 102, 255, 0.8)'  // Purple
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)'
      ],
      borderWidth: 1
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Support Issue Category'
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}`;
          }
        }
      }
    }
  };

  new Chart(ctx, {
    type: 'bar',
    data: data,
    options: options
  });
}
// commonsubjectSupport()

// supportClosure
function supportClosure() {
  const ctx = document.getElementById('supportClosure').getContext('2d');

  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dataValues = [75, 80, 85, 70, 90, 95, 88, 92, 85, 87, 89, 93];  // Example data for percentage of tickets closed

  const data = {
    labels: labels,
    datasets: [{
      label: 'Percentage of Tickets Closed',
      data: dataValues,
      borderColor: 'rgba(54, 162, 235, 1)',  // Blue Line
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      fill: true,
      tension: 0.1,  // Smooth curve
      borderWidth: 2
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Percentage of Tickets Closed (%)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time'
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}%`;
          }
        }
      }
    }
  };

  new Chart(ctx, {
    type: 'line',
    data: data,
    options: options
  });
}
// supportClosure()

// supportResolu
function supportResolu() {
  const ctx = document.getElementById('supportResolu').getContext('2d');

  const labels = ['0-24 hours', '24-48 hours', '>48 hours'];
  const dataValues = [100, 75, 50];  // Example data for number of tickets resolved

  // Create a gradient color scheme from light to dark
  const gradient = ctx.createLinearGradient(0, 0, 0, 200);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');  // Light color
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');        // Dark color

  const data = {
    labels: labels,
    datasets: [{
      label: 'Number of Tickets Resolved',
      data: dataValues,
      backgroundColor: gradient,
      borderColor: 'rgba(0, 0, 0, 1)',
      borderWidth: 1
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',  // Display the bars horizontally
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Tickets Resolved'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Resolution Time Range'
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}`;
          }
        }
      }
    }
  };

  new Chart(ctx, {
    type: 'bar',
    data: data,
    options: options
  });
}
// supportResolu()



// Monthly TIN Request
async function monthlyTinRequest() {
  const ctx = document.getElementById('monthlyTinRequest').getContext('2d');

  try {
    const response = await fetch(`${HOST}?getAnalyticsTINRequestPerMonth`);
    const responseDta = await response.json();

    const theMonth = responseDta.tinRequestsPerMonth.map(item => item.month)
    const requestCount = responseDta.tinRequestsPerMonth.map(item => item.requestCount)

    const labels = theMonth;
    const dataValues = requestCount;  // Example data for number of TIN requests

    // Use a pre-defined color palette to distinguish months
    const colors = [
      'rgba(255, 99, 132, 0.8)',   // Red
      'rgba(54, 162, 235, 0.8)',   // Blue
      'rgba(255, 206, 86, 0.8)',   // Yellow
      'rgba(75, 192, 192, 0.8)',   // Green
      'rgba(153, 102, 255, 0.8)'   // Purple
    ];

    const data = {
      labels: labels,
      datasets: [{
        label: 'Number of TIN Requests',
        data: dataValues,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1
      }]
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Monthly TIN Requests'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Month'
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.dataset.label || '';
              const value = context.raw || 0;
              return `${label}: ${value}`;
            }
          }
        }
      }
    };

    new Chart(ctx, {
      type: 'bar',
      data: data,
      options: options
    });


  } catch (error) {
    console.log(error)
  }
}
// monthlyTinRequest()

// weekly TIN Request
function weeklyTinRequest() {
  const ctx = document.getElementById('weeklyTinRequest').getContext('2d');

  const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'];
  const dataValues = [100, 120, 140, 130, 110];  // Example data for number of invoices verified

  // Use a pre-defined color palette to distinguish weeks
  const colors = [
    'rgba(255, 99, 132, 0.8)',   // Red
    'rgba(54, 162, 235, 0.8)',   // Blue
    'rgba(255, 206, 86, 0.8)',   // Yellow
    'rgba(75, 192, 192, 0.8)',   // Green
    'rgba(153, 102, 255, 0.8)'   // Purple
  ];

  const data = {
    labels: labels,
    datasets: [{
      label: 'Number of Weekly TIN Requests',
      data: dataValues,
      backgroundColor: colors,
      borderColor: colors,
      borderWidth: 1
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Weekly TIN Requests'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Weeks'
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}`;
          }
        }
      }
    }
  };

  new Chart(ctx, {
    type: 'bar',
    data: data,
    options: options
  });
}
// weeklyTinRequest()

//  Visitor's count rate
function visitorsCount() {
  const ctx = document.getElementById('visitorsCount').getContext('2d');

  const labels = ['Daily', 'Weekly', 'Monthly'];
  const dataValues = [500, 1500, 3000];  // Example data for number of visitors

  const data = {
    labels: labels,
    datasets: [{
      label: 'Number of Visitors',
      data: dataValues,
      borderColor: 'rgba(54, 162, 235, 1)',  // Blue Line
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      fill: true,
      tension: 0.1,  // Smooth curve
      borderWidth: 2
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Visitors'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time'
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}`;
          }
        }
      }
    }
  };

  new Chart(ctx, {
    type: 'line',
    data: data,
    options: options
  });
}
visitorsCount()

// Impressions
function impressionsChart() {
  const ctx = document.getElementById('impressionsChart').getContext('2d');

  const labels = ['Daily', 'Weekly', 'Monthly'];
  const dataValues = [1000, 7000, 30000];  // Example data for number of impressions

  const data = {
    labels: labels,
    datasets: [{
      label: 'Number of Impressions',
      data: dataValues,
      borderColor: 'rgba(75, 192, 192, 1)',  // Green Line
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: true,
      tension: 0.1,  // Smooth curve
      borderWidth: 2
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Impressions'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time'
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}`;
          }
        }
      }
    }
  };

  new Chart(ctx, {
    type: 'line',
    data: data,
    options: options
  });
}
impressionsChart()

// socialMedia
function socialMedia() {
  const ctx = document.getElementById('socialMedia').getContext('2d');

  const labels = ['Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'YouTube'];
  const dataValues = [300, 200, 250, 150, 350];  // Example data for number of interactions

  // Use a pre-defined color palette from Chart.js
  const colors = [
    'rgba(54, 162, 235, 0.8)',  // Blue for Facebook
    'rgba(75, 192, 192, 0.8)',  // Green for Twitter
    'rgba(255, 206, 86, 0.8)',  // Yellow for Instagram
    'rgba(153, 102, 255, 0.8)', // Purple for LinkedIn
    'rgba(255, 99, 132, 0.8)'   // Red for YouTube
  ];

  const data = {
    labels: labels,
    datasets: [{
      label: 'Number of Interactions',
      data: dataValues,
      backgroundColor: colors,
      borderColor: colors.map(color => color.replace('0.8', '1')),
      borderWidth: 1
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Interactions'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Social Media Platform'
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}`;
          }
        }
      }
    }
  };

  new Chart(ctx, {
    type: 'bar',
    data: data,
    options: options
  });
}
// socialMedia()