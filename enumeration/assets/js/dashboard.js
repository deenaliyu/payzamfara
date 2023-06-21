function convertToPercentage(number, total) {
  var percentage = (number / total) * 100;
  return percentage.toFixed(2); // Round the percentage to two decimal places
}

function plotGraph(thData, totll) {
  var chartDom = document.getElementById('dashbordChart');
  var myChart = echarts.init(chartDom);
  var option;

  option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: '% Of Registered Tax payers',
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
          position: 'center'
        },

        labelLine: {
          show: false
        },
        data: [
          { value: convertToPercentage(thData[1].total_users, totll), name: 'Individual' },
          { value: convertToPercentage(thData[0].total_users, totll), name: 'Corporate' },
          { value: 0, name: 'Properties' }
        ]
      }
    ]
  };

  option && myChart.setOption(option);
}




async function getAnalytics() {
  try {
    const response = await fetch(`${HOST}?getEnumerationAgentDashboard`)
    const data = await response.json()

    console.log(data)
    $("#totalRegis").html(data[0][0].total_users)
    $("#totalRegCateg").html(data[1][1].total_users)
    $("#totalRegCategRege").html(data[2][0].total_users)


    plotGraph(data[1], data[0][0].total_users)

  } catch (error) {
    console.log(error)
  }
}

getAnalytics()