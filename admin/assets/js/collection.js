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
    `${HOST}/php/index.php?fetchAllPayment`
  );
  const userInvoices = await response.json();
  console.log(userInvoices);
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
        <td>${userInvoice.mda_id}</td>
        <td>${userInvoice.COL_4}</td>
        <td>${userInvoice.first_name} ${userInvoice.surname}</td>
        <td>${userInvoice.tax_number}</td>
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
            <td>${userInvoice.tax_number}</td>
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

