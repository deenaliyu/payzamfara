let USERINFO = JSON.parse(window.localStorage.getItem("taxManagerDataPrime"));

// console.log(USERINFO)
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
    const response = await fetch(`${HOST}?getMonthlyRevenueTaxManager&id=${USERINFO.id}&sort=expected`);
    const userAnalytics = await response.json();

    // console.log(userAnalytics)
    if (userAnalytics.status === 0) {
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
    const response = await fetch(`${HOST}?getMonthlyRevenueTaxManager&id=${USERINFO.id}`);
    const userAnalytics = await response.json();

    // console.log(userAnalytics)
    if (userAnalytics.status === 0) {
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

async function fetchTaxOfficers() {

  const response = await fetch(`${HOST}/?getAllTaxOfficers`)
  const taxPayers = await response.json()


  $("#loader").css("display", "none")

  if (taxPayers.status === 0) {
    $("#revOfficers").html(0)
  } else {
    $("#revOfficers").html(taxPayers.message.length)

  }

}

fetchTaxOfficers()