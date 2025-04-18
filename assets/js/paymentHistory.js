let userInfo = JSON.parse(window.localStorage.getItem("userDataPrime"));

let userID = userInfo.tax_number;

function formatMoney(amount) {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'NGN', // Change this to your desired currency code
    minimumFractionDigits: 2,
  });
}

async function fetchPayment() {
  $("#showInvoice").html("");
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
    `${HOST}/php/index.php?fetchPayment&user_id=${userID}`
  );
  const userInvoices = await response.json();
  console.log(userInvoices);
  $("#loader").css("display", "none");
  if (userInvoices.status === 1) {
    for (let i = 0; i < userInvoices.message.length; i++) {
      const userInvoice = userInvoices.message[i];
      $("#showPayment").append(`
        <tr>
        <td>${userInvoice.user_id}</td>
        <td>${userInvoice.payment_reference_number}</td>
          <td>${userInvoice["COL_4"]}</td>
          <td>${formatMoney(parseFloat(userInvoice.amount_paid))}</td>
          <td>${userInvoice.payment_channel}</td>
          <td>
            <p class="text-success">Successful</p>
          </td>
          <td>
          </td>
        </tr>
        `);

      if (i === 4) {
        break;
      }
    }
  } else {
    // $("#showInvoice").html("<tr></tr>");
    $("#dataTable").DataTable();
  }
}

fetchPayment().then(rr => {
  $("#dataTable").DataTable();
})