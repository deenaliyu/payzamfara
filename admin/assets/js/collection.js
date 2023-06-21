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
    userInvoices.message.reverse().forEach((userInvoice, i) => {
      let addd = ""
      addd += `
        <tr class="relative">
        <td>${i + 1}</td>
        <td>${userInvoice.mda_id}</td>
        <td>${userInvoice.COL_4}</td>
        <td>${userInvoice.first_name} ${userInvoice.surname}</td>
        <td>${userInvoice.tax_number}</td>
        <td>${userInvoice.invoice_number}</td>
        <td>${userInvoice.COL_6}</td>
        <td>${userInvoice.payment_channel}</td>
        <td>${userInvoice.payment_reference_number}</td>
        <td>${userInvoice.receipt_number}</td>
        <td>${userInvoice.timeIn}</td>
        
          `
      addd += `
      <td>
      <a href="./viewreceipt.html?invnumber=${userInvoice.invoice_number}&load=true" target="_blank" class="btn btn-primary btn-sm viewUser" >View Receipt</a>
    </td> 
        </tr>
        `
      $("#showThem").append(addd);
    });
  } else {
    // $("#showInvoice").html("<tr></tr>");
    $("#dataTable").DataTable();
  }
}

fetchInvoice().then((uu) => {
  $("#dataTable").DataTable();
});

