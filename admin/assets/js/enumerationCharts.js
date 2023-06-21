// ENUMERATIONNN

// TOTAL TAXPAYERS REGISTERED (BY FIELD AGENTS)
function totalTaxPayer() {
    const ctx = document.getElementById("totalTaxPayer").getContext('2d');
    const chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'bar',
  
      // The data for our dataset
      data: {
        labels: ["Basheer", "Kachi", "Cynthia", "Madu", "Sule", "Ibrahim"],
        datasets: [
          {
            label: "TOTAL TAXPAYERS REGISTERED (BY FIELD AGENTS)",
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
  totalTaxPayer()
  
  // % of TAXPAYERS REGISTERED(BY CATEGORY)
  
  function totalRegis() {
    const ctx = document.getElementById("totalRegis").getContext('2d');
    const chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'doughnut',
  
      // The data for our dataset
      data: {
        labels: ["Individual", "Corporate", "Properties"],
        datasets: [
          {
            label: "% of TAXPAYERS REGISTERED(BY CATEGORY)",
            backgroundColor: ['#63B967', "#E8E8E8", "#EA4335"],
            data: [80, 20, 69]
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
  totalRegis()