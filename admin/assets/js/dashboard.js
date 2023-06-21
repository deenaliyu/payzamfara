function createLineChart() {
  // Get the canvas element
  var ctx = document.getElementById('myChart').getContext('2d');

  // Create the chart
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [{
        label: 'Sales',
        data: [12, 19, 3, 5, 2, 3, 9],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });



  // }

}
// createLineChart();

// Chart


function createBarChart() {
  var chartDom = document.getElementById('report-bar-chart');
  var myChart = echarts.init(chartDom);
  var option;

  option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    color: ["#3A37D0", "#63B967", "#EC4899"],
    legend: {},
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, 0.01]
    },
    xAxis: {
      type: 'category',
      data: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN']
    },
    series: [
      {
        name: 'Total Amount',
        type: 'bar',
        data: [2000, 1999, 1892, 1600, 2000, 1200]
      },
      {
        name: 'Amount Paid',
        type: 'bar',
        data: [832, 1000, 300, 854, 1800, 392]
      },
      {
        name: 'Amount Due',
        type: 'bar',
        data: [83, 203, 200, 90, 40, 30]
      }
    ]
  };

  option && myChart.setOption(option);
  // let ctxb = document.getElementById('report-bar-chart').getContext("2d");
  // let myChart = new Chart(ctxb, {
  //   type: "bar",
  //   data: {
  //     labels: [
  //       "Jan",
  //       "Feb",
  //       "Mar",
  //       "Apr",
  //       "May",
  //       "Jun",
  //       "Jul",
  //       "Aug",
  //     ],
  //     datasets: [
  //       {
  //         label: "Total Anual Invoice",
  //         barPercentage: 0.5,
  //         barThickness: 6,
  //         maxBarThickness: 8,
  //         minBarLength: 2,
  //         data: [0, 200, 250, 200, 500, 450, 850, 1050],
  //         backgroundColor: 'rgb(0, 39, 255)',
  //       },
  //       {
  //         label: "Total Anual Revenue",
  //         barPercentage: 0.5,
  //         barThickness: 6,
  //         maxBarThickness: 8,
  //         minBarLength: 2,
  //         data: [0, 300, 400, 560, 320, 600, 720, 850],
  //         backgroundColor: 'rgb(0, 255, 132)'
  //       },
  //     ],
  //   },
  //   options: {
  //     maintainAspectRatio: false,
  //     plugins: {
  //       legend: {
  //         labels: {
  //           color: 'rgb(0, 0, 0)',
  //         },
  //       },
  //     },
  //     scales: {
  //       x: {
  //         ticks: {
  //           font: {
  //             size: 12,
  //           },
  //           color: 'rgb(0,0,0)',
  //         },
  //         grid: {
  //           display: false,
  //           drawBorder: false,
  //         },
  //       },
  //       y: {
  //         ticks: {
  //           font: {
  //             size: "12",
  //           },
  //           color: 'rgb(0, 0, 0)',
  //           callback: function (value, index, values) {
  //             return "$" + value;
  //           },
  //         },
  //         grid: {
  //           color: 'rgb(0, 0, 0)',
  //           borderDash: [2, 2],
  //           drawBorder: false,
  //         },
  //       },
  //     },
  //   },
  // });
}

createBarChart();

function createDonutChart() {

  var chartDom = document.getElementById('donut-chart-widget');
  var myChart = echarts.init(chartDom);
  var option;

  option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center',
      position: 'right',
      orient: 'horizontal'
    },
    series: [
      {
        name: 'Rev. Generated',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'right'
        },
        emphasis: {
          label: {
            show: false,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: 'AKIRS' },
          { value: 735, name: 'Ministry of work' },
          { value: 580, name: 'Ministry of Justice' },
          { value: 484, name: 'AGRICULTURAL LOANS BOARD' },
          { value: 300, name: 'Ministry of work' }
        ]
      }
    ]
  };

  option && myChart.setOption(option);

}

createDonutChart();

function createGuageGraph() {

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
            value: 0.7,
            fontSize: 14,
            name: ''
          }
        ]
      }
    ]
  };

  option && myChart.setOption(option);

}

createGuageGraph();
