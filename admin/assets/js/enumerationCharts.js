
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
    // Plot donut pie chart for TOTAL TAXPAYER ENUMERATED (BY CATEGORY)
    // Sample data: [{category: "Individual", count: "1333"}, {category: "Corporate", count: "261"}]
    const donutLabels = data[0].map(item => item.category);
    const donutData = data[0].map(item => parseInt(item.count));
    const donutColors = ['#63B967', '#EA4335', '#3A37D0', '#7AD0C7', '#005826', '#242424'];

    const donutCtx = document.getElementById("taxPayerEnum").getContext('2d');

    new Chart(donutCtx, {
      type: 'doughnut',
      data: {
        labels: donutLabels,
        datasets: [{
          label: "TOTAL TAXPAYER ENUMERATED (BY CATEGORY)",
          data: donutData,
          backgroundColor: donutColors
        }]
      },
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

    // TOTAL TAXPAYERS REGISTERED (BY FIELD AGENTS) - Use horizontal bar chart
    let agentLabels = data[1].map(dta => dta.enumerator_name);
    let agentCounts = data[1].map(dta => parseInt(dta.count));
    const agentBarCtx = document.getElementById("totalTaxPayer").getContext('2d');
    new Chart(agentBarCtx, {
      type: 'bar',
      data: {
        labels: agentLabels,
        datasets: [{
          label: "TOTAL TAXPAYERS REGISTERED (BY FIELD AGENTS)",
          data: agentCounts,
          backgroundColor: '#015826'
        }]
      },
      options: {
        indexAxis: 'x',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Taxpayers Registered" }
          },
          x: {
            title: { display: true, text: "Field Agent" }
          }
        }
      }
    });

    // TOTAL TAXPAYER ENUMERATED BY BUSINESS TYPE - Use bubble chart
    let labels = data[2].map(dta => {
      let name = dta.business_type || "Unknown";
      return name.length > 20 ? name.substring(0, 20) + "..." : name;
    });

    let values = data[2].map(dta => parseInt(dta.count));

    const ctx = document.getElementById("totalRegis").getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: "TOTAL TAXPAYER ENUMERATED BY BUSINESS TYPE",
          data: values,
          backgroundColor: "#3A37D0"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y', // horizontal bar
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (context) {
                // Always show the full name + value in tooltip
                let fullName = data[2][context.dataIndex].business_type;
                let value = context.raw;
                return `${fullName}: ${value}`;
              }
            }
          }
        },
        scales: {
          x: { beginAtZero: true }
        }
      }
    });


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

// barChartsColored(["Dan", "Okon", "Ali", "Samu", "Nike"], "Total Taxpayers Enumerated", [250, 200, 280, 100, 50], "lest5Agents")
// barChartsColored(["Basheer", "Jasmine", "Kachi", "Cynthia", "Madu"], "Total Taxpayers Enumerated", [100, 150, 180, 200, 130], "top5Agents")

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