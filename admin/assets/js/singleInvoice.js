async function fetchInvoices() {
  const urlParams = new URLSearchParams(window.location.search);
  const userIdo = urlParams.get('id');
  // console.log(userIdo);
  $("#showInvoice").html("");
  $(".showInvoice2").html("");
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
    `${HOST}/php/index.php?userInvoices&payer_id=${userIdo}`
  );
  const userInvoices = await response.json();
  // console.log(userInvoices);
  $("#loader").css("display", "none");
  if (userInvoices.status === 1) {
    userInvoices.message.reverse().forEach((userInvoice, i) => {
      let addd = ""
      let invo = ""
      addd += `
        <tr class="relative">    
          <td>${userInvoice.tax_number}</td>
          <td>${userInvoice.invoice_number}</td>
          <td>${userInvoice.COL_4}</td>
          <td>${userInvoice.amount_paid}</td>
          <td>${userInvoice["due_date"]}</td>
          `
      if (userInvoice.payment_status === "paid") {
        addd += `
            <td id="" class="checking">
              <p class='text-success'>${userInvoice.payment_status}</p>
            </td>
            <td>
            <div class="flex gap-2 check-bt" id="">
              <a class="px-3 py-1 rounded-lg bg-success text-white diasbled">view</a>
            </div>
            </td>
            `
        invo += `
            <tr class="relative">    
            <td>${userInvoice.tax_number}</td>
            <td><a class="textPrimary" href="../viewinvoice.html?invnumber=${userInvoice.invoice_number}&load=true">${userInvoice.invoice_number}</a></td>
            <td>${userInvoice.COL_4}</td>
            <td>${userInvoice.amount_paid}</td>
            <td>${userInvoice["due_date"]}</td>
            <td id="" class="checking">
              <p class='text-success'>${userInvoice.payment_status}</p>
            </td>
            <td>
            <div class="flex gap-2 check-bt" id="">
              <a class="px-3 py-1 rounded-lg bg-success text-white diasbled">view</a>
            </div>
            </td>
            </tr>
            `
      } else {
        addd += `
            <td id="" class="checking">
              <p class='text-danger'>${userInvoice.payment_status}</p>
            </td>
            <td>
              <div class="flex gap-2 check-bt" id="">
                <a href="./viewinvoice.html?invnumber=${userInvoice.invoice_number}&load=true" class="px-3 py-1 rounded-lg bgPrimary text-white block">Pay</a>
              </div>
            </td>
            `
      }
      $("#showInvoice3").append(invo);
      addd += `
            
        </tr>
        `
      $("#showInvoice1").append(addd);
      // showInvoice3
    });

    userInvoices.message.reverse().forEach((userInvoice, i) => {
      if (userInvoice.payment_status === "paid") {
        $("#showInvoice3").append(`
            <tr class="relative">    
              <td>${userInvoice.tax_number}</td>
              <td>${userInvoice.invoice_number}</td>
              <td>${userInvoice.COL_4}</td>
              <td>${userInvoice.amount_paid}</td>
              <td>${userInvoice["due_date"]}</td>
              <td id="" class="checking">
                <p class='text-success'>${userInvoice.payment_status}</p>
              </td>
              <td>
              <div class="flex gap-2 check-bt" id="">
                <a class="px-3 py-1 rounded-lg bgPrimary text-white diasbled">View</a>
              </div>
              </td>
            </tr>
          `)
      }
    })


  } else {
    // $(".showInvoice").html("<tr></tr>");
    $("#dataTable3").DataTable();
  }
}

fetchInvoices().then((uu) => {
  $("#dataTable3").DataTable();
});