let USER_SESSION = localStorage.getItem("MDAINFO")
  finalUSER_SESSION = JSON.parse(USER_SESSION)
  let mdaID = finalUSER_SESSION.fullname

async function fetchREVssss() {

  const response = await fetch(`${HOST}/?getMDAsRevenueHeads&mdName=${mdaID}`)
  const REVHEAds = await response.json()


  if (REVHEAds.status === 0) {

  } else {

    REVHEAds.message.forEach(revheads => {
      $("#revHeads").append(`
        <option value="${revheads.COL_4}" data-revid="${revheads.id}">${revheads.COL_4}</option>
      `)
    });

  }
}

fetchREVssss()

async function fetchPayments() {
  let USER_SESSION1 = localStorage.getItem("mdaDataPrime")
  finalUSER_SESSION1 = JSON.parse(USER_SESSION1)
  let mdaIDs = finalUSER_SESSION1.mda_id
  // console.log(finalUSER_SESSION1)

  const response = await fetch(`${HOST}/?getMDACollections&mda_id=${mdaIDs}`)
  const paymentsColles = await response.json()


  if (paymentsColles.status === 0) {
    $("#dataTable").DataTable();
  } else {

    paymentsColles.message.forEach((paymentcol, i) => {
      $("#showPayments").append(`
        <tr>
          <td>${i + 1}</td>
          <td>${paymentcol.date_of_payment}</td>
          <td>${paymentcol.name}</td>
          <td>${paymentcol.revenue_name}</td>
          <td>&#8358; ${paymentcol.payment_amount}</td>
          <td>Cash Deposit</td>
          <td>Aminu Bulala</td>
        </tr>
      `)
    });

  }
}

fetchPayments().then((uu) => {
  $("#dataTable").DataTable();
});