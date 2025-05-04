const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('type');

let dataToExport;

$("#pageName").html(category === "private" ? 'Private PAYE (PIT)' : 'Public PAYE')

$("#bodyDrop").attr("href", `body-registration.html?type=${category}`)

function formatMoney(amount) {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'NGN', // Change this to your desired currency code
    minimumFractionDigits: 0,
  });
}

// Event listener for filter buttons
$(".payebtns").each(function () {
  $(this).on("click", function () {
    const selectedFilter = $(this).data("note"); // Get filter value from data-note attribute
    renderTable(selectedFilter); // Render table based on the filter
  });
});

async function renderTable(filterStatus = "all") {
  $("#payeMTabAll").empty(); // Clear the table before rendering
  $("#loader").remove()
  try {
    const response = await fetch(`${HOST}/?getSpecialUsers&id=all`);
    const result = await response.json();

    if (result.status === 0) {
      dataToExport = [];
      $("#payeMTabAll").html('<tr><td colspan="12" class="text-center">No users found.</td></tr>');
    } else {
      dataToExport = result.message;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    dataToExport = [];
    $("#payeMTabAll").html('<tr><td colspan="12" class="text-center">Failed to fetch users.</td></tr>');
  }

  dataToExport.forEach((rhUser, i) => {
    let annual = parseFloat(rhUser.monthly_estimate * 12) || 0;
    let monthly = parseFloat(rhUser.monthly_estimate) || 0;

    let theStatus = "";
    if (rhUser.status === "Defaulter") {
      theStatus = `<span class="badge bg-danger rounded-pill">Defaulter</span>`;
    } else if (rhUser.status === "Current") {
      theStatus = `<span class="badge bg-success rounded-pill">Current</span>`;
    } else if (rhUser.status === "Assessed") {
      theStatus = `<span class="badge bg-info rounded-pill">${rhUser.status}</span>`;
    } else {
      theStatus = `<span class="badge bg-warning rounded-pill">${rhUser.status}</span>`;
    }

    if (
      filterStatus === "all" ||
      rhUser.status.toLowerCase() === filterStatus.toLowerCase()
    ) {
      let htmlData = `
        <tr>
          <td>${i + 1}</td>
          <td><a class="textPrimary" href="paye-details.html?payerID=${rhUser.payer_id}&fullname=${rhUser.name}">${rhUser.payer_id}</a></td>
          <td>${rhUser.name}</td>
          <td>${rhUser.email}</td>
          <td>${rhUser.category}</td>
          <td>${rhUser.staff_quota}</td>
          <td>${formatMoney(annual)}</td>
          <td>${formatMoney(monthly)}</td>
          <td>${formatMoney(parseFloat(rhUser.total_remittance))}</td>
          <td>${theStatus}</td>
          <td>${rhUser.last_payment ? rhUser.last_payment.split(" ")[0] : "-"}</td>
          <td><a href="paye-details.html?payerID=${rhUser.payer_id}" class="btn btn-sm button-3">View</a></td>
        </tr>
      `;
      $("#payeMTabAll").append(htmlData);
    }
  });
}

renderTable().then(e => {
  $('#dataTable').DataTable();
});

async function getSpecialUsersDash1() {

  const response = await fetch(`${HOST}/?getSpecialUsersDash1&category=${category}`)
  const getDashData = await response.json()


  if (getDashData.status === 0) {
    // $('#dataTable').DataTable();

  } else {
    let dashData = getDashData.message[0]

    $("#reg_bodies").html(dashData.Total_Special_Users)
    $("#reg_staffs").html(dashData.Total_Staff)

  }

}

getSpecialUsersDash1()


async function getSpecialUsersDashAnnualEstimate(year) {
  $("#annEstimate").html('-')

  const response = await fetch(`${HOST}/?getSpecialUsersDashAnnualEstimate&year=${year}`)
  const getDashData = await response.json()

  if (getDashData.status === 0) {
    $("#annEstimate").html(0)

  } else {
    let dashData = getDashData.message[0]
    $("#annEstimate").html(formatMoney(parseInt(dashData.Total_Annual_Estimate)))

    // $("#monthlyEstimate").html(formatMoney(parseInt(dashData.Total_Annual_Estimate / 12)))
  }

}

$(document).ready(function () {
  let yearr = new Date().getFullYear()

  getSpecialUsersDashAnnualEstimate(yearr)
  // getSpecialUsersDashMonthlyEstimate(yearr)
});

// Populate #selYear with years from 2024 to the current years
function populateYearSelect() {
  const currentYear = new Date().getFullYear();
  const select = $(".selYear");
  const select2 = $(".selYear2");

  for (let year = 2024; year <= currentYear; year++) {
    const option = $("<option>").val(year).text(year);
    if (year === currentYear) {
      option.attr("selected", "selected");
    }
    select.append(option);
    select2.append(option)
  }
}

populateYearSelect();

$('#selYear').on('change', function () {
  let value = $(this).val()

  getSpecialUsersDashAnnualEstimate(value)

})

let finalJson = {}

// async function getSpecialUsersDashMonthlyEstimate(year) {
//   $("#annEstimate").html('-')

//   const response = await fetch(`${HOST}/?getSpecialUsersDashMonthlyEstimate&year=${year}`)
//   const getDashData = await response.json()

//   if (getDashData.status === 0) {
//     $("#monthlyEstimate").html(0)

//   } else {
//     populateSelect(getDashData.message)

//     finalJson = getDashData.message

//     setTimeout(() => {
//       displayEstimate()
//     }, 1000);

//   }

// }

function getAbbreviatedMonthName(monthValue) {
  var date = new Date(monthValue + "-01");
  return date.toLocaleString('default', { month: 'short' });
}

function populateSelect(jsonData) {
  var select = $("#monthSelect");
  $.each(jsonData, function (index, item) {
    var monthAbbreviation = getAbbreviatedMonthName(item.Year_Month);
    select.append($("<option>").val(item.Year_Month).text(monthAbbreviation));
  });
}

function displayEstimate() {
  var selectedMonth = $("#monthSelect").val();
  var selectedEstimate = finalJson.find(item => item.Year_Month === selectedMonth).Total_Monthly_Estimate;
  $("#monthlyEstimate").text(formatMoney(parseFloat(selectedEstimate)));
}

function exportData() {
  // console.log(dataToExport)
  const csvRows = [];

  // Extract headers (keys) excluding 'id'
  const headers = Object.keys(dataToExport[0]).filter((key) => key !== "id");
  csvRows.push(headers.join(",")); // Join headers with commas

  // Loop through the data to create CSV rows
  for (const row of dataToExport) {
    const values = headers.map((header) => {
      const value = row[header];
      return `"${value}"`; // Escape values with quotes
    });
    csvRows.push(values.join(","));
  }

  // Combine all rows into a single string
  const csvString = csvRows.join("\n");

  // Export to a downloadable file
  const blob = new Blob([csvString], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "paye-list.csv";
  a.click();
}