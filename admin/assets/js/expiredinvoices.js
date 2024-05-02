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


  const response = await fetch(`${HOST}?AllDueInvoice`);
  const userInvoices = await response.json();


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
          <td>${userInvoice.tax_number}</td>
          <td>${userInvoice.COL_3}</td>
          <td>${userInvoice.COL_4}</td>
          <td>${userInvoice.first_name} ${userInvoice.surname}</td>
          <td>${userInvoice.office_name}</td>
          <td>${userInvoice.invoice_number}</td>
          <td>&#8358; ${parseFloat(userInvoice.amount_paid).toLocaleString()}</td>
          <td>${userInvoice.date_created.split(" ")[0]}</td>
          <td>${userInvoice.due_date}</td>
            `
    if (userInvoice.payment_status === "paid") {
      addd += `
              <td id="" class="checking">
                <p class='text-success'>${userInvoice.payment_status}</p>
              </td>
              
              `
    } else {
      addd += `
              <td id="" class="checking">
                <p class='text-danger'>${userInvoice.payment_status}</p>
              </td>
              `
    }

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
              <td>${userInvoice.COL_3.replace(/,/g, '')}</td>
              <td>${userInvoice.COL_4}</td>
              <td>${userInvoice.first_name.replace(/,/g, '')} ${userInvoice.surname.replace(/,/g, '')}</td>
              <td>${userInvoice.office_name}</td>
              <td>${userInvoice.invoice_number}</td>
              <td>&#8358; ${userInvoice.amount_paid}</td>
              <td>${userInvoice.date_created.split(" ")[0]}</td>
              <td>${userInvoice.due_date}</td>
              <td>${userInvoice.payment_status}</td>
          </tr>
        `)
  });
}

fetchInvoice().then((uu) => {
  $("#dataTable").DataTable();
});

async function fetchAnalytics() {

  try {
    const response = await fetch(
      `${HOST}/php/index.php?getDashboardAnalyticsAdmin`
    );

    const userAnalytics = await response.json();
    $("#totalInvE").html(userAnalytics.total_expired_invoice.toLocaleString())
    $("#total_amount_invoicedE").html(userAnalytics.total_expired_invoice_amount.toLocaleString())


  } catch (error) {
    console.log(error)
  }


}

fetchAnalytics()
