let USERINFO = JSON.parse(window.localStorage.getItem("taxManagerDataPrime"));

function formatMoney(amount) {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'NGN', // Change this to your desired currency code
    minimumFractionDigits: 2,
  });
}

let AllInvoiceData = {}

async function fetchInvoice() {

  $("#showThem").html("");
  $("#loader").css("display", "flex");

  const response = await fetch(`${HOST}?getPaymentByTaxOffice&id=${USERINFO.tax_office_id}`);
  const userInvoices = await response.json();

  // console.log(userInvoices);
  $("#loader").css("display", "none");
  if (userInvoices.status === 1) {

    AllInvoiceData = userInvoices.message

    displayData(userInvoices.message.reverse())

  } else {
    // $("#showInvoice").html("<tr></tr>");
    $("#dataTable").DataTable();
  }
}

function displayData(userInvoices) {
  userInvoices.forEach((userInvoice, i) => {
    let addd = ""
    addd += `
        <tr class="relative">
        <td>${i + 1}</td>
        <td>${userInvoice.mda_id}</td>
        <td>${userInvoice.COL_4}</td>
        <td>${userInvoice.first_name} ${userInvoice.surname}</td>
        <td>${userInvoice.office_name}</td>
        <td>${userInvoice.invoice_number}</td>
        <td>${formatMoney(parseFloat(userInvoice.amount_paid))}</td>
        <td>${userInvoice.payment_channel}</td>
        <td>${userInvoice.payment_reference_number}</td>
        <td>${userInvoice.invoice_number}</td>
        <td>${userInvoice.timeIn}</td>
        
          `
    addd += `
      <td>
      <a href="./viewreceipt.html?invnumber=${userInvoice.invoice_number}&load=true" target="_blank" class="btn btn-primary btn-sm viewUser" >View Receipt</a>
    </td> 
        </tr>
        `
    $("#showThem").append(addd);
    $("#showThem2").append(`
      <tr class="relative">
        <td>${i + 1}</td>
        <td>${userInvoice.mda_id}</td>
        <td>${userInvoice.COL_4}</td>
        <td>${userInvoice.first_name?.replace(/,/g, '')} ${userInvoice.surname?.replace(/,/g, '')}</td>
        <td>${userInvoice.office_name}</td>
        <td>${userInvoice.invoice_number}</td>
        <td>&#8358; ${(parseFloat(userInvoice.amount_paid))}</td>
        <td>${userInvoice.payment_channel}</td>
        <td>${userInvoice.payment_reference_number}</td>
        <td>${userInvoice.invoice_number}</td>
        <td>${userInvoice.timeIn}</td>
      </tr>
    `)
  });
}

fetchInvoice().then((uu) => {
  $("#dataTable").DataTable();
});

function exportData() {
  var csv = [];
  var table = document.getElementById("invoiceTableFull");

  // Add header to CSV
  var header = [];
  for (var h = 0; h < table.rows[0].cells.length; h++) {
    header.push(table.rows[0].cells[h].innerText);
  }
  csv.push(header.join(','));

  // Add rows to CSV
  for (var i = 1; i < table.rows.length; i++) {
    var row = [], cols = table.rows[i].querySelectorAll('td, th');

    for (var j = 0; j < cols.length; j++) {
      row.push(cols[j].innerText);
    }

    csv.push(row.join(','));
  }

  // Download CSV file
  var csvContent = 'data:text/csv;charset=utf-8,' + csv.join('\n');
  var encodedUri = encodeURI(csvContent);
  var link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'collection_report');
  document.body.appendChild(link);
  link.click();
}