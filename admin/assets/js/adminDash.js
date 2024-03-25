function formatMoney(amount) {
  return parseFloat(amount).toLocaleString('en-US', {
    style: 'currency',
    currency: 'NGN', // Change this to your desired currency code
    minimumFractionDigits: 2,
  });
}

function convertToTwoDigits(number) {
    // Using padStart to add a leading zero if needed
    return String(number).padStart(2, '0');
}

function sortByDateDescending(data) {
    return data.sort((a, b) => new Date(b.month) - new Date(a.month));
}

function fillSelectOptions(selectId, start, end, selectedValue) {
  var select = document.getElementById(selectId);

  for (var i = start; i <= end; i++) {
    var option = document.createElement("option");
    option.value = i;
    if (selectId === "selMonth") {
      option.text = monthss[i - 1];
    } else {
      option.text = i;
    }

    if (i === selectedValue) {
      option.selected = true;
    }
    select.add(option);
  }
}

var ThecurrentDate = new Date();
var theCurrentYear = ThecurrentDate.getFullYear();
var theCurrentMonth = ThecurrentDate.getMonth() + 1;

fillSelectOptions("annualYear", 2023, theCurrentYear + 8, theCurrentYear);

function refreshTheCards() {
//   let theMonth = document.querySelector("#selMonth").value
  let theYear = document.querySelector("#annualYear").value

  theCurrentYear = theYear
//   theCurrentMonth = theMonth
  getYearlyRevenue()
 
}

async function getYearlyRevenue() {
    $("#total_amount_invoiced2").html(`
        <div class="flex mb-4">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
        </div>
    `)
    
    try {
        const response = await fetch(`${HOST}?getYearlyRevenue&year=${theCurrentYear}`);
        const userAnalytics = await response.json();
        
        // console.log(userAnalytics)
        if(userAnalytics.status === 0) {
            $("#total_amount_invoiced2").html(0)
        } else {
            let theAmountGen = userAnalytics.message[0].total_annual_revenue
            $("#total_amount_invoiced2").html(formatMoney(theAmountGen))
        }
        

   
    } catch (error) {
        console.log(error)
        $("#total_amount_invoiced2").html(0)
    }
}

getYearlyRevenue()

function getMonthName(monthValue) {
    const [year, month] = monthValue.split('-');
    const date = new Date(year, month - 1, 1);
    const monthName = date.toLocaleString('default', { month: 'long' });
    return monthName;
}


function getYear(monthValue) {
    return monthValue.split('-')[0];
}

function filterByMonth(monthsArray, targetMonth) {
    const result = monthsArray.find(monthData => monthData.month === targetMonth);
    return result ? result.total_monthly_revenue : 0;
}
let allRevenueData = []

function refreshTheCards2() {
    let theMonth = document.querySelector("#monthlyYear").value
    
    let genAmount = filterByMonth(allRevenueData, theMonth)
    $("#total_amount_invoiced").html(formatMoney(genAmount))
}
async function getMonthlyRevenue() {
    $("#total_amount_invoiced").html(`
        <div class="flex mb-4">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
        </div>
    `)
    
    try {
        const response = await fetch(`${HOST}?getMonthlyRevenue`);
        const userAnalytics = await response.json();
        
        // console.log(userAnalytics)
        if(userAnalytics.status === 0) {
            $("#total_amount_invoiced").html(0)
        } else {
            allRevenueData = userAnalytics.message
            const monthSelector = document.getElementById('monthlyYear');
            
            let theSortedData = sortByDateDescending(userAnalytics.message)
            
            for (const monthData of theSortedData) {
                const option = document.createElement('option');
                const monthValue = monthData.month;
                const displayText = `${getMonthName(monthValue)} ${getYear(monthValue)}`;
    
                option.value = monthValue;
                option.text = displayText;
    
                // Set the default selected option to the current month and year
                
                if (monthValue === `${theCurrentYear}-${theCurrentMonth}`) {
                    option.selected = true;
                }
    
                monthSelector.add(option);
            }
            
            
            let theAmountGen = filterByMonth(theSortedData, `${theCurrentYear}-${convertToTwoDigits(theCurrentMonth)}`)
            // console.log(theCurrentMonth)
            $("#total_amount_invoiced").html(formatMoney(theAmountGen))
        }
        

   
    } catch (error) {
        console.log(error)
        $("#total_amount_invoiced").html(0)
    }
}

getMonthlyRevenue()

// getExpectedMonthlyRevenue 
let allExpectedRevenueData = []

function refreshTheCards3() {
    let theMonth = document.querySelector("#monthlyYear2").value
    
    let genAmount = filterByMonth(allExpectedRevenueData, theMonth)
    $("#due_amount").html(formatMoney(genAmount))
}

async function getExpectedMonthlyRevenue() {
    $("#due_amount").html(`
        <div class="flex mb-4">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
        </div>
    `)
    
    try {
        const response = await fetch(`${HOST}?getMonthlyRevenue&sort=expected`);
        const userAnalytics = await response.json();
        
        // console.log(userAnalytics)
        if(userAnalytics.status === 0) {
            $("#due_amount").html(0)
        } else {
            allExpectedRevenueData = userAnalytics.message
            const monthSelector = document.getElementById('monthlyYear2');
            
            let theSortedData = sortByDateDescending(userAnalytics.message)
            
            for (const monthData of theSortedData) {
                const option = document.createElement('option');
                const monthValue = monthData.month;
                const displayText = `${getMonthName(monthValue)} ${getYear(monthValue)}`;
    
                option.value = monthValue;
                option.text = displayText;
    
                // Set the default selected option to the current month and year
                if (monthValue === `${theCurrentYear}-${theCurrentMonth}`) {
                    option.selected = true;
                }
    
                monthSelector.add(option);
            }
            
            
            let theAmountGen = filterByMonth(theSortedData, `${theCurrentYear}-${convertToTwoDigits(theCurrentMonth)}`)
            $("#due_amount").html(formatMoney(theAmountGen))
        }
        

   
    } catch (error) {
        console.log(error)
        $("#due_amount").html(0)
    }
}

getExpectedMonthlyRevenue()

var myCharter;

async function fetchAnalytics() {

  let config = {
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
    },
  };
  try {
    const response = await fetch(
      `${HOST}/php/index.php?getDashboardAnalyticsAdmin`
    );

    const userAnalytics = await response.json();

    // console.log(userAnalytics)

    
    // $("#due_amount").html(userAnalytics.due_amount.toLocaleString())
    $("#due_invoices").html(userAnalytics.due_invoices.toLocaleString())
    $("#total_amount_invoiced3").html(formatMoney(userAnalytics.total_amount_invoiced))
    $("#total_amountP").html(formatMoney(userAnalytics.total_amount_paid))
    $("#due_amount2").html(formatMoney(userAnalytics.due_amount))
    $("#total_invoice").html(userAnalytics.total_invoice.toLocaleString())
    $("#total_amount").html(userAnalytics.total_invoice_paid.toLocaleString())
    $("#reg_taxP").html(userAnalytics.total_user.toLocaleString())

    let tt = parseFloat(userAnalytics.total_amount_paid);
    let ti = parseFloat(userAnalytics.total_amount_invoiced);
   
   
      total = (tt / ti) * 100;
  
//   console.log(total)
  
  
   

      var chartDom = document.getElementById('Compliance');
      myCharter = echarts.init(chartDom);
      var option;
      
      option = {
        xAxis: {
          type: 'category',
          data: ['','','','','Tax performance',]
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [0,0, 0, 0, total],
            type: 'line'
          }
        ]
      };
      
      option && myCharter.setOption(option);
    
      // }
    
   
   
  } catch (error) {
    console.log(error)
  }


}

fetchAnalytics()



async function fetchMDAs() {

  const response = await fetch(`${HOST}/?getMDAsCount`)
  const MDAs = await response.json()
// console.log(MDAs.message[0].total)
  $("#totalMDAs").html(MDAs.message[0].total)


}

fetchMDAs()

async function fetchRevHeads() {

  const response = await fetch(`${HOST}/?getRevenueCount`)
  const MDAs = await response.json()

  $("#totalrevs").html(MDAs.message[0].total)


}

fetchRevHeads()