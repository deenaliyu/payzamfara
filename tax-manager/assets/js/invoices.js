let USERINFO2 = JSON.parse(window.localStorage.getItem("taxManagerDataPrime"));

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

  const response = await fetch(
    `${HOST}?getInvoiceByTaxOffice&id=${USERINFO2.tax_office_id}`
  );
  const userInvoices = await response.json();
  // console.log(userInvoices);


  $("#loader").css("display", "none");
  if (userInvoices.status === 1) {
    AllInvoiceData = userInvoices.message
    $("#totalInvoices").html(userInvoices.message.length)

    displayData(userInvoices.message.reverse())
    displayData2(getFirstNItems(userInvoices.message.reverse(), 20))
    
  } else {
    // $("#showInvoice").html("<tr></tr>");
    $("#dataTable").DataTable();
    $("#totalInvoices").html(0)
  }
}

function displayData(userInvoices) {
  userInvoices.forEach((userInvoice, i) => {
    let addd = ""
    addd += `
        <tr class="relative">
        <td>${i + 1}</td>
        <td>${userInvoice.tax_number}</td>
        <td>${userInvoice.invoice_number}</td>
        <td>${userInvoice.COL_3}</td>
        <td>${userInvoice.office_name}</td>
        <td>${userInvoice.description}</td>
        <td>&#8358; ${parseFloat(userInvoice.amount_paid).toLocaleString()}</td>
        <td>${userInvoice.date_created.split(" ")[0]}</td>
        <td>${userInvoice.due_date}</td>
        <td id="" class="checking">
         ${userInvoice.payment_status === "paid" ?
        `<p class='text-success'>${userInvoice.payment_status}</p>` :
        `<p class='text-danger'>${userInvoice.payment_status}</p>`}
        </td>
        `
    addd += `
          <td>
            <a href="./viewinvoice.html?invnumber=${userInvoice.invoice_number}&load=true" target="_blank" class="btn btn-primary btn-sm viewUser" >View Invoice</a>
          </td>
        </tr>
        `
    $("#showThem").append(addd);
    $("#showThem2").append(`
      <tr>
          <td>${i + 1}</td>
          <td>${userInvoice.tax_number}</td>
          <td>${userInvoice.invoice_number}</td>
          <td>${userInvoice.COL_3.replace(/,/g, '')}</td>
          <td>${userInvoice.office_name}</td>
          <td>${userInvoice.description}</td>
          <td>&#8358; ${userInvoice.amount_paid}</td>
          <td>${userInvoice.date_created.split(" ")[0]}</td>
          <td>${userInvoice.due_date}</td>
          <td>${userInvoice.payment_status}</td>
      </tr>
    `)
  });
}

function displayData2(userInvoices) {
  userInvoices.forEach((userInvoice, i) => {
    let addd = ""
    addd += `
        <tr class="relative">
        <td>${i + 1}</td>
        <td>${userInvoice.tax_number}</td>
        <td>${userInvoice.invoice_number}</td>
        <td>${userInvoice.COL_3}</td>
        <td>${userInvoice.office_name}</td>
        <td>${userInvoice.description}</td>
        <td>&#8358; ${parseFloat(userInvoice.amount_paid).toLocaleString()}</td>
        <td>${userInvoice.date_created.split(" ")[0]}</td>
        <td>${userInvoice.due_date}</td>
        <td id="" class="checking">
         ${userInvoice.payment_status === "paid" ?
        `<p class='text-success'>${userInvoice.payment_status}</p>` :
        `<p class='text-danger'>${userInvoice.payment_status}</p>`}
        </td>
        `
    addd += `
          <td>
            <a href="./viewinvoice.html?invnumber=${userInvoice.invoice_number}&load=true" target="_blank" class="btn btn-primary btn-sm viewUser" >View Invoice</a>
          </td>
        </tr>
        `
    $("#showThem3").append(addd);

  });
}

fetchInvoice().then((uu) => {
  $("#dataTable").DataTable();
});

function getFirstNItems(arr, n) {
  return arr.slice(0, n);
}

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
  link.setAttribute('download', 'invoice_report');
  document.body.appendChild(link);
  link.click();
}
