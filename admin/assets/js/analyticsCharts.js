function barCharts(dataDat, theValue, theElement) {
  var chartDom = document.getElementById(theElement);
  var myChart = echarts.init(chartDom);
  var option;

  option = {
    tooltip: {
      trigger: 'axis',
      extraCssText: "width:200px; white-space:pre-wrap;",
      axisPointer: {
        type: 'shadow'
      }
    },

    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    legend: {
      data: ['Forest', 'Steppe', 'Desert', 'Wetland']
    },
    xAxis: [
      {
        type: 'category',
        data: dataDat,
        axisTick: {
          alignWithLabel: true
        },

      }
    ],
    yAxis: [
      {
        type: 'value',
        show: true,
        name: "",
        tittle: "Revenue Generated",
        nameLocation: "end",
        nameRotate: 20
      }
    ],
    series: [
      {
        name: 'Rev. generated',
        type: 'bar',
        barWidth: '30%',
        data: theValue
      }
    ]
  };

  option && myChart.setOption(option);

}

async function getMDALGAPerformance(loopWord, endpoint, idToPush, tittle, objTitle) {

  const response = await fetch(`${HOST}?${endpoint}`)
  const data = await response.json()

  let theNumbers = []
  let categoryArr = []

  if (data.status === 1) {

    data[loopWord].forEach(dta => {
      theNumbers.push(parseInt(dta.count))
      categoryArr.push(dta[objTitle])
    });

    barCharts(categoryArr, theNumbers, idToPush)
  } else {

  }
}

getMDALGAPerformance("revenuePerLGA", "getMDALGAPerformance", "lgaChart", "Revenue generated", "lga")
getMDALGAPerformance("MDAPerformance", "getMDAPerformance", "mdaChart", "Revenue generated", "mda")



// barCharts(['Agric', 'Edu', 'Works', 'Finance', 'VIO', 'Lands', 'Transport'], [2900, 2800, 2600, 900, 700, 200, 150], "mdaChart")

barCharts(['PAYE', 'Stamp Duties', 'Laboratory', 'Pool', 'VIO', 'Lands', 'Transport'], [0, 0, 0, 0, 0, 0, 0], "revHeads")
barCharts(['Online Payment', 'Remita', 'Bank Branch', 'POS', 'USSD', 'E-naira', 'ATM'], [0, 0, 0, 0, 0, 0, 0], "payment")


let InvoiceChart = ""
function InvoiceCategory(dataDat, theValue, theElement, label) {
  const ctx = document.getElementById(theElement).getContext('2d');
  InvoiceChart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
      labels: dataDat,
      datasets: [{
        label: label,
        backgroundColor: ['#3A37D0', '#63B967', '#EA4335', '#005826'],
        borderColor: 'rgb(255, 99, 132)',
        data: theValue
      }]
    },

    // Configuration options go here
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });




}

async function getInvoicesData(loopWord, endpoint, idToPush, tittle) {

  const response = await fetch(`${HOST}?${endpoint}`)
  const data = await response.json()

  let theNumbers = []
  let categoryArr = []

  if (data.status === 1) {

    data[loopWord].forEach(dta => {
      theNumbers.push(parseInt(dta.count))
      categoryArr.push(dta.category)
    });

    InvoiceCategory(categoryArr, theNumbers, idToPush, tittle)
  } else {

  }
}

function secondsToMinutes(seconds) {
  var minutes = Math.floor(seconds / 60);
  var seconds = seconds % 60;
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

async function getAvgPayment() {
  let monthsss = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  try {

    const response = await fetch(`${HOST}?averagePaymentTime`)
    const data = await response.json()

    let theNumbers = []
    let categoryArr = []


    data.forEach(dta => {
      theNumbers.push(parseInt(secondsToMinutes(dta.average_time)))
      categoryArr.push(monthsss[dta.month])
    });

    console.log(theNumbers, categoryArr)
    const ctx2 = document.getElementById("avgpayment").getContext('2d');
    const avgPaymentChart = new Chart(ctx2, {
      // The type of chart we want to create
      type: 'bar',

      // The data for our dataset
      data: {
        labels: categoryArr,
        datasets: [{
          label: "Average Payment Time (in minutes)",
          backgroundColor: ['#3A37D0', '#63B967', '#EA4335', '#005826'],
          borderColor: 'rgb(255, 99, 132)',
          data: theNumbers
        }]
      },

      // Configuration options go here
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });

  } catch (error) {
    console.log(error)
  }




}


getInvoicesData("invoicesPerCategory", "getInvoicesGeneratedBasedOnCategories", "invgenerated", "No. of invoice generated")
getInvoicesData("paidInvoicesPerCategory", "getAnalyticPaidInvoiceBasedOnCategories", "invpaid", "No. of invoice paid")
getInvoicesData("tinRequestsPerMonth", "getAnalyticsTINRequestPerMonth", "invpaid", "No. of invoice paid")
getAvgPayment()

InvoiceCategory(["Jan 2023", "Feb 2023", "Mar 2023", "Apr 2023"], [100, 50, 130, 70], "monthver", "Number of Invoices Verified")

InvoiceCategory(["Receipt Error", "Payment Error", "Receipt Error", "Receipt Error"], [280, 250, 130, 70], "commonsubject", "Number of Support Tickets")

function doubleBarChart(data1, data2) {
  const ctx = document.getElementById(data1.theElement).getContext('2d');
  const chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
      labels: data1.dataDat,
      datasets: [
        {
          label: data1.label,
          backgroundColor: ['#4285F4'],
          data: data1.theValue
        },
        {
          label: data2.label,
          backgroundColor: ['#63B967'],
          data: data2.theValue
        }
      ]
    },

    // Configuration options go here
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });

}

let data1 = {
  dataDat: ["Jan", "Feb", "Mar", "Apr"],
  theValue: [280, 250, 130, 70],
  theElement: "supporClosure",
  label: "Total Tickets"
}

let data2 = {
  dataDat: ["Jan", "Feb", "Mar", "Apr"],
  theValue: [200, 230, 100, 70],
  theElement: "supporClosure",
  label: "Closed Tickets"
}

doubleBarChart(data1, data2)

function lineChart(dataDat, theValue, theElement, label) {
  const ctx = document.getElementById(theElement).getContext('2d');
  const chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',
    // The data for our dataset
    data: {
      labels: dataDat,
      datasets: [
        {
          label: label,
          backgroundColor: ['#4285F4'],
          borderColor: "#4285F4",
          pointStyle: 'circle',
          pointRadius: 5,
          data: theValue
        }
      ]
    },

    // Configuration options go here
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });

}

lineChart(["Jan", "Feb", "Mar", "Apr"], [200, 230, 100, 70], "supportResolu", "Average Resolution Time (Minute)")

// NUMBER OF TIN REQUEST

async function getTINData() {

  const response = await fetch(`${HOST}?getAnalyticsTINRequestPerMonth`)
  const data = await response.json()

  let theNumbers = []
  let categoryArr = []

  if (data.status === 1) {

    data["tinRequestsPerMonth"].forEach(dta => {
      theNumbers.push(parseInt(dta.requestCount))
      categoryArr.push(dta.month)
    });

    lineChart(categoryArr, theNumbers, "tinReqNumber", "Number of TIN Requests")

  } else {

  }
}
getTINData()

function singleBarChart(dataDat, theValue, theElement, label) {
  const ctx = document.getElementById(theElement).getContext('2d');
  const chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
      labels: dataDat,
      datasets: [
        {
          label: label,
          backgroundColor: ['#3A37D0'],
          data: theValue
        }
      ]
    },

    // Configuration options go here
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });

}
singleBarChart(["Online Payment", "Bank Transfer", "Bank Branch", "POS", "USSD"], [400, 360, 200, 300, 290], "peoplePref", "Payment Methods")

// NUMBER OF TIN REQUEST



// MONTHLY, WEEKLY, DAILY TIN REQUEST 

async function getMonthWeeklyDaily(params) {

  const response = await fetch(`${HOST}?getAnalyticsTINRequestPerDAYWEEKMONTH`)
  const data = await response.json()

  let theLabels = []
  let data1 = []
  let data2 = []
  let data3 = []

  if (data.status === 1) {

    data["monthlyRequests"].forEach(dta => {
      theLabels.push(dta.month)
      data1.push(parseInt(dta.numberOfRequest))
      data2.push(parseInt(dta.approvedRequests))
      data3.push(parseInt(dta.pendingRequests))
    });

    const ctx = document.getElementById("MonthWeeklyDaily").getContext('2d');
    const chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'bar',

      // The data for our dataset
      data: {
        labels: theLabels,
        datasets: [
          {
            label: "Number Of request",
            backgroundColor: ['#4285F4'],
            data: data1
          },
          {
            label: "Approved",
            backgroundColor: ['#EA4335'],
            data: data2
          },
          {
            label: "Pending",
            backgroundColor: ['#FBBC04'],
            data: data3
          }
        ]
      },

      // Configuration options go here
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });

  } else {

  }

}
getMonthWeeklyDaily()


// TRAFFIC  (Number of visitor that visit the site)

function TrafficChart() {
  const ctx = document.getElementById("traffic").getContext('2d');
  const chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Number of Visitors",
          backgroundColor: ['#005826', '#EA4335', '#63B967', '#3A37D0', '#7AD0C7', '#242424'],
          data: [200, 230, 100, 70, 200, 230, 100]
        }
      ]
    },

    // Configuration options go here
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });

}
TrafficChart()

// bounce  (% of users that leaves after visiting one page)

function BouceChart() {
  const ctx = document.getElementById("bounceChart").getContext('2d');
  const chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'doughnut',

    // The data for our dataset
    data: {
      labels: ["Stay", "Bounce"],
      datasets: [
        {
          label: "bounce  (% of users that leaves after visiting one page)",
          backgroundColor: ['#63B967', "#E8E8E8"],
          data: [80, 20]
        }
      ]
    },

    // Configuration options go here
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });

}
BouceChart()


// AVERAGE SESSION DURATION AND PAGES PER SESSION 
function AverageSession() {
  const ctx = document.getElementById("AverageSession").getContext('2d');
  const chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Average Session Duration (Seconds)",
          backgroundColor: '#3A37D0',
          borderColor: "#3A37D0",
          data: [200, 230, 100, 70, 200, 230, 100]
        },
        {
          label: "Pages Per Session",
          backgroundColor: "#EA4335",
          borderColor: "#EA4335",
          data: [120, 100, 50, 20, 100, 40, 10]
        }
      ]
    },

    // Configuration options go here
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });

}
AverageSession()


// ENGAGEMENT RATE
function ENGAGEMENT() {
  const ctx = document.getElementById("ENGAGEMENTRATE").getContext('2d');
  const chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
      labels: ["Facebook", "Twitter", "Instagram"],
      datasets: [
        {
          label: "Number Of Posts",
          backgroundColor: ['#4285F4'],
          data: [10, 120, 10]
        },
        {
          label: "Total Engagement",
          backgroundColor: ['#EA4335'],
          data: [10, 70, 10]
        },
        {
          label: "Average Engagement per Post",
          backgroundColor: ['#005826'],
          data: [20, 100, 80]
        }
      ]
    },

    // Configuration options go here
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });

}

ENGAGEMENT()


// ENUMERATIONNN

function calculatePercentage(number, total) {

  if (total === 0) {
    return 0;
  }

  return (number / total) * 100;
}

async function getEnumerationCategoryDashboard() {
  try {
    const response = await fetch(`${HOST}?getEnumerationCategoryDashboard`)
    const data = await response.json()

    // TOTAL TAXPAYERS REGISTERED (BY FIELD AGENTS)
    let labelss = []
    let numberrs = []
    data[1].forEach(dta => {
      labelss.push(dta.by_account)
      numberrs.push(parseInt(dta.count))
    })

    // console.log(labelss)
    totalTaxPayer(labelss, numberrs)

    // TOTAL TAXPAYER ENUMERATED BY BUSINESS TYPE
    let labelss2 = []
    let numberrs2 = []
    let tt = 0
    data[0].forEach((dta, i) => {

      if (dta.tax_category !== "") {
        tt += parseInt(dta.count)
        labelss2.push(dta.tax_category)
        if (i === data[0].length - 1) {

          data[0].forEach(ffff => {
            numberrs2.push(calculatePercentage(parseInt(ffff.count), tt))
          })

        }


      }

    })

    totalRegis(labelss2, numberrs2)

  } catch (error) {
    console.log(error)
  }
}

getEnumerationCategoryDashboard()
// TOTAL TAXPAYERS REGISTERED (BY FIELD AGENTS)
function totalTaxPayer(labelss, numberss) {
  const ctx = document.getElementById("totalTaxPayer").getContext('2d');
  const chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
      labels: labelss,
      datasets: [
        {
          label: "TOTAL TAXPAYERS REGISTERED (BY FIELD AGENTS)",
          backgroundColor: ['#005826', '#EA4335', '#63B967', '#3A37D0', '#7AD0C7', '#242424'],
          data: numberss
        }
      ]
    },

    // Configuration options go here
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });

}


// % of TAXPAYERS REGISTERED(BY CATEGORY)

function totalRegis(labelss2, numberrs2) {
  const ctx = document.getElementById("totalRegis").getContext('2d');
  const chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'doughnut',

    // The data for our dataset
    data: {
      labels: labelss2,
      datasets: [
        {
          label: "% of TAXPAYERS REGISTERED(BY CATEGORY)",
          backgroundColor: ['#63B967', "#E8E8E8", "#EA4335"],
          data: numberrs2
        }
      ]
    },

    // Configuration options go here
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });

}
