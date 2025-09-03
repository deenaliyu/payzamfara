const ctx = document.getElementById('myChart');

new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Educ', 'Agric', 'Health', 'Finance', 'Works'],
    datasets: [{
      label: 'Collected',
      data: [12, 19, 3, 5, 2, 3],
      borderWidth: 1,
      backgroundColor: '#005826',
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

const ctxa = document.getElementById('myChartA');

new Chart(ctxa, {
  type: 'bar',
  data: {
    labels: ['Health', 'Works', 'Finance', 'Tourism', 'Sport','Commerce', 'Environment', 'Humanitarian Affairs'],
    datasets: [{
      label: 'Industry (Growth)',
      data: [12, 19, 3, 5, 2, 3, 16, 17],
      borderWidth: 1,
      backgroundColor: '#005826',
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

// line graphh
if ($('#dashChart')) {
  const data = {
   
    datasets: [{
      label: 'My First Dataset',
      data: [300, 50, 100],
      backgroundColor: [
        '#63B967',
        '#F89030',
        '#439DEE'
      ],
      hoverOffset: 4
    }],
    labels: [
      'Kano South',
      'Kano Central',
      'Kano West'
    ]
  };

  const config = {
    type: 'pie',
    data: data,
    options: {
      barValueSpacing: 20,
      scales: {
        yAxes: [{
          ticks: {
            min: 0,
          }
        }]
      }
    }
  };
  const myChart = new Chart(
    document.getElementById('dashChart'),
    config
  );
}

if ($('#dash')) {
  const data = {
   
    datasets: [{
      label: 'My First Dataset',
      data: [300, 50, 100, 80],
      backgroundColor: [
        '#63B967',
        '#F89030',
        '#439DEE',
        '#E93B77'
      ],
      hoverOffset: 4
    }],
    labels: [
      'Very satisfied',
      'Satisfied',
      'Neutral',
      'frustrated'
    ]
  };

  const config = {
    type: 'pie',
    data: data,
    options: {
      barValueSpacing: 20,
      scales: {
        yAxes: [{
          ticks: {
            min: 0,
          }
        }]
      }
    }
  };
  const myChart = new Chart(
    document.getElementById('dash'),
    config
  );
}


  var dom = document.getElementById('taxi');
  var myChart = echarts.init(dom, null, {
    renderer: 'canvas',
    useDirtyRect: false
  });
  var app = {};
  
  var option;
  
  option = {
    tooltip: {
      trigger: 'axis'
    },
    
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['17', '18', '19', '20', '21', '22', '23']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Email',
        type: 'line',
        stack: 'Total',
        data: [0, 132, 101, 134, 90, 230, 210]
      },
      {
        name: 'Union Ads',
        type: 'line',
        stack: 'Total',
        data: [20, 182, 191, 234, 290, 330, 310]
      },
    
    ]
  };
  
  if (option && typeof option === 'object') {
    myChart.setOption(option);
  }
  
  window.addEventListener('resize', myChart.resize);
  



