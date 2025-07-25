
$("#viewmore").on("click", function () {
  let theTextt = document.querySelector(".theText")

  if (theTextt.textContent === "View More") {
    theTextt.textContent = "See less"
  } else {
    theTextt.textContent = "View More"
  }
})


function convertToTwoDigitsEx(number) {
  // Using padStart to add a leading zero if needed
  return String(number).padStart(2, '0');
}

function sortByDateDescendingExpired4(data) {
  return data.sort((a, b) => new Date(b.month) - new Date(a.month));
}

function getMonthNameEx4(monthValue) {
  const [year, month] = monthValue.split('-');
  const date = new Date(year, month - 1, 1);
  const monthName = date.toLocaleString('default', { month: 'long' });
  return monthName;
}


function getYearEx4(monthValue) {
  return monthValue.split('-')[0];
}

function filterByMonthEx(monthsArray, targetMonth) {
  const result = monthsArray.find(monthData => monthData.month === targetMonth);
  return result ? result.total_expired_revenue : 0;
}

var finalp = 0;

var ThecurrentDateEx4 = new Date();
var theCurrentYearEx4 = ThecurrentDateEx4.getFullYear();
var theCurrentMonthEx4 = ThecurrentDateEx4.getMonth() + 1;

let allExpectedRevenueDataEx4 = []

function refreshTheMonth1() {
  let theMonth = document.querySelector("#theMonth").value

  let genAmount = filterByMonthEx(allExpectedRevenueDataEx4, theMonth)
  $("#percent").html(genAmount)
  console.log(genAmount)
  fetchGraph(genAmount)
}


async function totalE() {
  $("#percent").html(`
          <div class="flex mb-4">
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
          </div>
      `)

  try {
    const response = await fetch(`${HOST}?getPercentage`);
    const userAnalytics = await response.json();

    console.log(userAnalytics)
   
      allExpectedRevenueDataEx4 = userAnalytics
      const monthSelector = document.getElementById('theMonth');

      let theSortedData = sortByDateDescendingExpired4(userAnalytics)

      for (const monthData of theSortedData) {
        const option = document.createElement('option');
        const monthValue = monthData.month;
        const displayText = `${getMonthNameEx4(monthValue)} ${getYearEx4(monthValue)}`;

        option.value = monthValue;
        option.text = displayText;

        // Set the default selected option to the current month and year
        if (monthValue === `${theCurrentYearEx4}-${theCurrentMonthEx4}`) {
          option.selected = true;
        }

        monthSelector.add(option);
      }


      let theAmountGen = filterByMonthEx(theSortedData, `${theCurrentYearEx4}-${convertToTwoDigitsEx(theCurrentMonthEx4)}`)
      // console.log(theAmountGen, theCurrentYearEx, theCurrentMonthEx)
      console.log(theAmountGen)
      $("#percent").html(theAmountGen)
      fetchGraph(theAmountGen)


  } catch (error) {
    console.log(error)
    $("#percent").html(0)
  }
}

totalE()

console.log(finalp)

function fetchGraph(finalp) {

  let valui = parseInt(finalp)
  let value2 = valui / 100

  var chartDom = document.getElementById('gauge-graph');
  var myChart = echarts.init(chartDom);
  var option;

  option = {
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        center: ['50%', '75%'],
        radius: '90%',
        min: 0,
        max: 1,
        splitNumber: 8,
        axisLine: {
          lineStyle: {
            width: 6,
            color: [
              [0.25, '#FF6E76'],
              [0.5, '#FDDD60'],
              [0.75, '#58D9F9'],
              [1, '#7CFFB2']
            ]
          }
        },
        pointer: {
          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
          length: '12%',
          width: 20,
          offsetCenter: [0, '-60%'],
          itemStyle: {
            color: 'inherit'
          }
        },
        axisTick: {
          length: 12,
          lineStyle: {
            color: 'inherit',
            width: 2
          }
        },
        splitLine: {
          length: 20,
          lineStyle: {
            color: 'inherit',
            width: 5
          }
        },
        axisLabel: {
          color: '#464646',
          fontSize: 14,
          distance: -60,
          rotate: 'tangential',
          formatter: function (value) {
            if (value === 0.875) {
              return '100%';
            } else if (value === 0.625) {
              return '75%';
            } else if (value === 0.375) {
              return '50%';
            } else if (value === 0.125) {
              return '0%';
            }
            return '';
          }
        },
        title: {
          offsetCenter: [0, '-10%'],
          fontSize: 14
        },
        detail: {
          fontSize: 30,
          offsetCenter: [0, '-35%'],
          valueAnimation: true,
          formatter: function (value) {
            return Math.round(value * 100) + '';
          },
          color: 'inherit'
        },
        data: [
          {
            value: value2,
            fontSize: 14,
            name: ''
          }
        ]
      }
    ]
  };

  option && myChart.setOption(option);

}


function createGuageGraph() {

  

}

createGuageGraph();
