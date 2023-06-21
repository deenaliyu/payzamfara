async function fetchAnalytics2() {

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

    let total = (userAnalytics.total_amount_paid / userAnalytics.total_amount_invoiced) * 100
    if (total >= 50) {
      $("#Compliance").html(`
        <p class="text-[#11BB8D] text-[32px]" id="Compliance">${total} %</p>
      `)
      $("#theImg").attr("src", "./assets/img/icons/Data.png")
    } else {
      $("#Compliance").html(`
        <p class="text-[#E24949] text-[32px]" id="Compliance">${total} %</p>
      `)

      $("#theImg").attr("src", "./assets/img/icons/Data1.png")
    }

    // console.log(userAnalytics)
  } catch (error) {
    console.log(error)
  }


}

fetchAnalytics2()