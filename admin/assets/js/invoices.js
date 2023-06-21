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
  $("#totalInv").html(userInvoices.message.length)
  $("#loader").css("display", "none");
  if (userInvoices.status === 1) {
    userInvoices.message.reverse().forEach((userInvoice, i) => {
      let addd = ""
      addd += `
        <tr class="relative">
        <td>${i + 1}</td>
        <td>${userInvoice.tax_number}</td>
        <td>${userInvoice.COL_3}</td>
        <td>${userInvoice.COL_4}</td>
        <td>${userInvoice.first_name} ${userInvoice.surname}</td>
        <td>${userInvoice.invoice_number}</td>
        <td>&#8358; ${userInvoice.COL_6}</td>
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
    });
  } else {
    // $("#showInvoice").html("<tr></tr>");
    $("#dataTable").DataTable();
  }
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
