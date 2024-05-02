
$("#viewmore").on("click", function () {
  let theTextt = document.querySelector(".theText")

  if (theTextt.textContent === "View More") {
    theTextt.textContent = "See less"
  } else {
    theTextt.textContent = "View More"
  }
})


async function fetchGraph() {

  const response = await fetch(`${HOST}/?invoicesPaidBeforeDue`)
  const MDAs = await response.json()
  console.log(MDAs.message.on_time_percentage)
  let value2 = parseInt(MDAs.message.on_time_percentage)
  let valuei = value2 / 100
  // console.log(valuei)

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
            value: valuei,
            fontSize: 14,
            name: ''
          }
        ]
      }
    ]
  };

  option && myChart.setOption(option);

}

fetchGraph()

function createGuageGraph() {



}

createGuageGraph();
