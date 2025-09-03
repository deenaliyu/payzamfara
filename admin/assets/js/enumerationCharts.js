
let theInfo = JSON.parse(localStorage.getItem("adminDataPrime"))

async function getEnumerators() {
  try {
    const response = await fetch(`${HOST}?getEnumUser`)
    const data = await response.json()

    $("#totalField").html(data.message.length)
    if (data.status === 1) {
      // con sole.log(data)


      data.message.reverse().forEach((txpayer, i) => {
        let aaa = ``
        aaa += `
          <tr>
            <td>${i + 1}</td>
            <td>${txpayer.agent_id}</td>
            <td>${txpayer.fullname}</td>
            <td>${txpayer.phone}</td>
            <td>0</td>
            <td id="enumEdit">
        `
        aaa += `
            <div class="flex items-center gap-3 updtFF">

            <button href=""><iconify-icon icon="material-symbols:delete-outline-rounded"
                style="font-size: 20px;"></iconify-icon></button>
            <a href="viewagent.html"><iconify-icon icon="material-symbols:edit-square-outline"
                style="font-size: 20px;"></iconify-icon></a>
          </div>
          `

        aaa += `     
            </td>
            <td>
            ${theInfo.enumeration_access === "full" ? `<a href="manageagent.html" class="btn btn-primary btn-sm">View</a>` : ''}
              
            </td>
          </tr>
        `

        $("#showEnumerators").append(aaa)
      });
    } else {



    }

  } catch (error) {
    console.log(error)
  }
}

getEnumerators().then(uu => {
  $("#dataTable").DataTable();
})


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

    // TOTAL TAXPAYER ENUMERATED

    let tt = 0
    data[0].forEach((guage, i) => {
      tt += parseInt(guage.count)
    })
    $("#theTotal").html(tt)
    $("#total1").html(tt)
    data[0].forEach((guage, i) => {
      if (guage.tax_category !== null) {
        GuageChart(guage.count, guage.tax_category)
        document.querySelectorAll(".countss")[i].textContent = guage.count
        document.querySelectorAll(".percent")[i].textContent = calculatePercentage(parseInt(guage.count), tt) + "%"
      }

    })

    // TOTAL TAXPAYER ENUMERATED

    let obj = {
      "Formal": "formalTax",
      "Informal": "inFormaltax",
      "Presumptive tax": "PresumptiveTax"
    }

    let tt2 = 0
    data[3].forEach((guage, i) => {
      tt2 += parseInt(guage.number)
    })
    $("#total2").html(tt2)
    data[3].forEach((guage, i) => {
      if (guage.category !== null) {
        GuageChart(guage.number, obj[guage.category])
        document.querySelectorAll(".countss2")[i].textContent = guage.number
        document.querySelectorAll(".percent2")[i].textContent = parseInt(calculatePercentage(parseInt(guage.number), tt2)) + "%"
      }

    })

    // TOTAL TAXPAYERS REGISTERED (BY FIELD AGENTS)
    let labelss = []
    let numberrs = []
    data[1].forEach(dta => {
      labelss.push(dta.by_account)
      numberrs.push(parseInt(dta.count))
    })

    // console.log(labelss)
    pieCharts(labelss, "TOTAL TAXPAYERS REGISTERED (BY FIELD AGENTS)", numberrs, "totalTaxPayer")

    // TOTAL TAXPAYER ENUMERATED BY BUSINESS TYPE
    let labelss2 = []
    let numberrs2 = []
    data[2].forEach(dta => {
      if (dta.business_type !== "") {
        labelss2.push(dta.business_type)
        numberrs2.push(parseInt(dta.count))
      }

    })
    pieCharts(labelss2, "TOTAL TAXPAYER ENUMERATED BY BUSINESS TYPE", numberrs2, "totalRegis")

  } catch (error) {
    console.log(error)
  }
}

getEnumerationCategoryDashboard()
// ENUMERATIONNN
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// TOTAL TAXPAYERS REGISTERED (BY FIELD AGENTS)
function pieCharts(labels, title, theData, theId) {
  const ctx = document.getElementById(theId).getContext('2d');
  const chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'pie',

    // The data for our dataset
    data: {
      labels: labels,
      datasets: [
        {
          label: title,
          backgroundColor: ['#005826', '#EA4335', '#63B967', '#3A37D0', '#7AD0C7', '#242424'],
          data: theData
        }
      ]
    },

    // Configuration options go here
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
          align: "middle"
        }
      }
    }
  });

}

// pieCharts(["Commercial", "Education", "Pool Betting", "Hospitality", "Retail", "Legal"], "TOTAL TAXPAYER ENUMERATED BY BUSINESS TYPE", [100, 130, 120, 70, 200, 230], "totalRegis")

function GuageChart(valuee, theId) {
  var chartDom = document.getElementById(theId);
  var myChart = echarts.init(chartDom);
  var option;

  option = {
    series: [
      {
        type: 'gauge',
        progress: {
          show: true,
          width: 5
        },
        axisLine: {
          // show: false,
          lineStyle: {
            width: 5
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        anchor: {
          show: false,
        },
        title: {
          show: false
        },
        detail: {
          show: false,
        },
        pointer: {
          show: false
        },
        data: [
          {
            value: valuee
          }
        ]
      }
    ]
  };

  option && myChart.setOption(option);
}

// GuageChart(70, "individual")
// GuageChart(20, "corporate")
// GuageChart(10, "properties")

// GuageChart(70, "formalTax")
// GuageChart(20, "inFormaltax")
// GuageChart(10, "PresumptiveTax")


function barCharts(labels, title, theData, theId) {
  const ctx = document.getElementById(theId).getContext('2d');
  const chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
      labels: labels,
      datasets: [
        {
          label: title,
          backgroundColor: ['#3A37D0'],
          data: theData
        }
      ]
    },

    // Configuration options go here
    options: {
      scales: {
        yAxis: {
          title: {
            display: true,
            text: title,
            font: {
              weight: 'bold',
              size: 14
            },
          }
        },
        xAxis: {
          barPercentage: 0.5, // Adjust this value to control the bar width
          categoryPercentage: 0.8 // Adjust this value to control the spacing between bars
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          align: "middle"
        }
      }
    }
  });

}
// barCharts(["Ikot Abasi", "Ikot Akpan Essein", "Ikot Ntuen", "Ikot Akpa Nkuk", "Ikot Ekpene Town", "Ikot Ekpene Road"], "Total Taxpayers Enumerate", [300, 200, 150, 100, 60, 220, 100], "totalTaxPayerCluster")

function lineCharts(labels, title, theData, theId) {
  const ctx = document.getElementById(theId).getContext('2d');
  const chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
      labels: labels,
      datasets: [
        {
          label: title,
          backgroundColor: ['#005826'],
          borderColor: "#005826",
          data: theData
        }
      ]
    },

    // Configuration options go here
    options: {
      scales: {
        yAxis: {
          beginAtZero: true,
          title: {
            display: true,
            text: title,
            font: {
              weight: 'bold',
              size: 14
            },
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          align: "middle"
        }
      }
    }
  });

}

// lineCharts(["Week 1", "Week 2", "Week 3", "week 4"], "Average Registration Time (in minutes)", [250, 200, 280, 100], "averageRegisTime")

function barChartsColored(labels, title, theData, theId) {
  const ctx = document.getElementById(theId).getContext('2d');
  const chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
      labels: labels,
      datasets: [
        {
          label: title,
          backgroundColor: ['#005826', '#EA4335', '#63B967', '#3A37D0', '#7AD0C7'],
          data: theData
        }
      ]
    },

    // Configuration options go here
    options: {
      scales: {
        yAxis: {
          title: {
            display: true,
            text: title,
            font: {
              weight: 'bold',
              size: 14
            },
          }
        },
        xAxis: {
          barPercentage: 0.5, // Adjust this value to control the bar width
          categoryPercentage: 0.8 // Adjust this value to control the spacing between bars
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          align: "middle"
        }
      }
    }
  });

}

barChartsColored(["Dan", "Okon", "Ali", "Samu", "Nike"], "Total Taxpayers Enumerated", [250, 200, 280, 100, 50], "lest5Agents")
barChartsColored(["Basheer", "Jasmine", "Kachi", "Cynthia", "Madu"], "Total Taxpayers Enumerated", [100, 150, 180, 200, 130], "top5Agents")

// lineCharts(months, "Total Taxpayers Enumerated", [250, 200, 280, 100, 120, 100, 150, 170, 180, 200, 130, 110], "totalTaxEnummm")
// function doughnutCharts(labels, title, theData, theId) {
//   const ctx = document.getElementById(theId).getContext('2d');
//   const chart = new Chart(ctx, {
//     // The type of chart we want to create
//     type: 'doughnut',

//     // The data for our dataset
//     data: {
//       labels: labels,
//       datasets: [
//         {
//           label: title,
//           backgroundColor: ['#005826', '#EA4335', '#63B967', '#3A37D0', '#7AD0C7', '#242424'],
//           data: theData
//         }
//       ]
//     },

//     // Configuration options go here
//     options: {
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: {
//         legend: {
//           position: "right",
//           align: "middle"
//         }
//       }
//     }
//   });

// }
// doughnutCharts(["Individual", "Corporate", "Properties"], "TOTAL TAXPAYER ENUMERATED", [200, 109, 90], "taxPayerEnum")
// doughnutCharts(["Formal Tax", "In-Formal Tax", "Presumptive tax"], "TOTAL TAXPAYER ENUMERATED", [300, 199, 120], "taxCategEnum")

// % of TAXPAYERS REGISTERED(BY CATEGORY)

// function totalRegis() {
//   const ctx = document.getElementById("totalRegis").getContext('2d');
//   const chart = new Chart(ctx, {
//     // The type of chart we want to create
//     type: 'doughnut',

//     // The data for our dataset
//     data: {
//       labels: ["Individual", "Corporate", "Properties"],
//       datasets: [
//         {
//           label: "% of TAXPAYERS REGISTERED(BY CATEGORY)",
//           backgroundColor: ['#63B967', "#E8E8E8", "#EA4335"],
//           data: [80, 20, 69]
//         }
//       ]
//     },

//     // Configuration options go here
//     options: {
//       responsive: true,
//       maintainAspectRatio: false
//     }
//   });

// }
// totalRegis()