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
    $("#due_amount").html(userAnalytics.due_amount.toLocaleString())
    $("#due_invoices").html(userAnalytics.due_invoices.toLocaleString())
    $("#total_amount_invoiced").html(userAnalytics.total_amount_invoiced.toLocaleString())
    $("#total_amount_invoiced2").html(userAnalytics.total_amount_invoiced.toLocaleString())
    $("#total_amount_invoiced3").html(userAnalytics.total_amount_invoiced.toLocaleString())
    $("#total_amountP").html(userAnalytics.total_amount_paid.toLocaleString())
    $("#due_amount2").html(userAnalytics.due_amount.toLocaleString())

    let total = (userAnalytics.total_amount_paid / userAnalytics.total_amount_invoiced) * 100
    $("#Compliance").html(total + "%")
    // console.log(userAnalytics)
  } catch (error) {
    console.log(error)
  }


}

fetchAnalytics()

async function fetchInvoice() {
  const response = await fetch(
    `${HOST}/php/index.php?AllInvoices`
  );
  const userInvoices = await response.json();

  $("#total_invoices").html(userInvoices.message.length)
}

fetchInvoice()

async function fetchTaxPayers() {
  const response = await fetch(
    `${HOST}/php/index.php?getTaxPayer`
  );
  const taxPayers = await response.json();

  $("#reg_taxP").html(taxPayers.message.length)
}

fetchTaxPayers()


async function fetchMDAs() {

  const response = await fetch(`${HOST}/?getMDAs`)
  const MDAs = await response.json()

  $("#totalMDAs").html(MDAs.message.length)


}

fetchMDAs()

async function fetchRevHeads() {

  const response = await fetch(`${HOST}/?getAllRevenueHeads`)
  const MDAs = await response.json()

  $("#totalrevs").html(MDAs.message.length)


}

fetchRevHeads()