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

  let config = {
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
    },
  };
  const response = await fetch(
    `${HOST}?AllInvoices`
  );
  const userInvoices = await response.json();
  console.log(userInvoices);
  if (userInvoices.status === 0){
    let tt = 0;
    $("#totalInv").html(tt)
  }else{
    $("#totalInv").html(userInvoices.message.length)
  }
 
  $("#loader").css("display", "none");
  if (userInvoices.status === 1) {
    AllInvoiceData =  userInvoices.message
    
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
    $("#due_amount").html(userAnalytics.due_amount)
    $("#due_invoices").html(userAnalytics.due_invoices)
    $("#total_amount_invoiced").html(userAnalytics.total_amount_invoiced.toLocaleString())
    $("#total_amountP").html(userAnalytics.total_amount_paid.toLocaleString())

    let total = (userAnalytics.total_amount_paid / userAnalytics.total_amount_invoiced) * 100
    $("#Compliance").html(total + "%")
    // console.log(userAnalytics)
  } catch (error) {
    console.log(error)
  }


}

fetchAnalytics()
