let USER_SESSION = localStorage.getItem("MDAINFO");
let finalUSER_SESSION = JSON.parse(USER_SESSION);
let mdaID = finalUSER_SESSION.fullname;
let mda_id = finalUSER_SESSION.id;

async function fetchREVssss() {
  const response = await fetch(`${HOST}/?getMDAsRevenueHeads&mdName=${mdaID}`);
  const REVHEAds = await response.json();

  if (REVHEAds.status === 0) {
  } else {
    REVHEAds.message.forEach((revheads) => {
      $("#revHeads").append(`
        <option value="${revheads.COL_4}" data-revid="${revheads.id}">${revheads.COL_4}</option>
      `);
    });
  }
}

fetchREVssss();

// async function fetchPayments() {
//   let USER_SESSION1 = localStorage.getItem("mdaDataPrime");
//   let finalUSER_SESSION1 = JSON.parse(USER_SESSION1);
//   let mdaIDs = finalUSER_SESSION1.mda_id;
//   console.log(finalUSER_SESSION1)

//   const response = await fetch(`${HOST}/?getMDACollections&mda_id=${mdaIDs}`);
//   const paymentsColles = await response.json();

//   if (paymentsColles.status === 0) {
//     $("#dataTable").DataTable();
//   } else {
//     paymentsColles.message.forEach((paymentcol, i) => {
//       $("#showPayments").append(`
//         <tr>
//           <td>${i + 1}</td>
//           <td>${paymentcol.date_of_payment}</td>
//           <td>${paymentcol.name}</td>
//           <td>${paymentcol.revenue_name}</td>
//           <td>&#8358; ${paymentcol.payment_amount}</td>
//           <td>Cash Deposit</td>
//           <td>Aminu Bulala</td>
//         </tr>
//       `);
//     });
//   }
// }

// fetchPayments().then((uu) => {
//   $("#dataTable").DataTable();
// });

// get all payment history

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
    `${HOST}/php/index.php?getcashPayment&mda_id=${mda_id}`
  );
  const paymentHistory = await response.json();
  console.log(paymentHistory);
  $("#loader").css("display", "none");
  if (paymentHistory.status === 1) {

    paymentHistory.message.reverse().forEach((payment, i) => {
      const userInvoice = paymentHistory.message[i];

      $("#showPayment").append(`
        <tr>
        <td>${i + 1}</td>
        <td>${payment.time_in}</td>
        <td>${payment.first_name} ${payment.surname} </td>
        <td>${payment.revenue_head} </td>
        <td>&#8358; ${payment.amount} </td>
        <td>cash</td>
        <td>
          <span class="badge bg-success">paid</span>
        </td>
        
       
        </tr>
        `);

    })

  } else {
    // $("#showInvoice").html("<tr></tr>");
    $("#dataTable").DataTable();
  }
}

fetchPayment().then(uu => {
  $("#dataTable").DataTable();
});