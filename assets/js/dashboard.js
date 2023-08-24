let userInfo = JSON.parse(window.localStorage.getItem("userDataPrime"));

let userID = userInfo.id;
$('#theUser').html(`<span>${userInfo.surname} ${userInfo.first_name}</span></h1>`)

async function fetchInvoice() {
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
    `${HOST}/php/index.php?userInvoices&payer_id=${userID}`
  );
  let gg = []
  const userInvoices = await response.json();
  // console.log(userInvoices);
  $("#loader").css("display", "none");
  if (userInvoices.status === 1) {
    let NumberOFInvoices = userInvoices.message.length;
    $(".invNumbers").html(userInvoices.message.length)

    for (let i = 0; i < userInvoices.message.length; i++) {
      const userInvoice = userInvoices.message[i];
      $("#showInvoice2").append(`
        <tr class="relative">
          <td>${i + 1}</td>
          <td><a class="text-primary" href="../viewinvoice.html?invnumber=${userInvoice.invoice_number}&load=true">${userInvoice.tax_number}</a></td>
          <td>${userInvoice.invoice_number}</td>
          <td>&#8358; ${userInvoice.COL_6}</td>
          <td>${userInvoice.due_date}</td>            
        </tr>
      `);

      if (i === 4) {
        break;
      }
      if (userInvoice.payment_status == "paid") {
        gg.push("g")
      }

    }
    let NumberOfPaid = gg.length
    $("#paid_invoices").html(NumberOfPaid)
    console.log(NumberOfPaid)
    const ctx = document.getElementById('dashboardGuage');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Invoice Generated', 'Invoice Paid'],
        datasets: [{
          label: 'Invoice',
          data: [NumberOFInvoices, NumberOfPaid],
          borderWidth: 0,
          borderRadius: 5,
          barThickness: 40,
          backgroundColor: '#005826',
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  } else {
    $("#showInvoice").html(`
      <tr>
        <td colspan="5" class="text-center">No data available</td>
      </tr>
    `);
    $("#dataTable").DataTable();
  }
}

async function fetchTaxes() {
  let userInfo = JSON.parse(localStorage.getItem("userDataPrime"))

  const response = await fetch(
    `${HOST}?getApplicableTaxes&tax_number=${userInfo.tax_number}`
  );
  const revenueHeads = await response.json();

  // console.log(revenueHeads);
  $("#loaderr").remove();
  for (const item of revenueHeads) {

    let aa = ""

    aa += `
                      <tr>
                        <td><a class="text-primary" href="./taxes.html">
                        ${item.business_type}</a> </th>
                        <td>Monthly</th>
                       
                    
    `

    for(const key in item) {

      if(item[key].id) {
        let i = key
      
      }else{
        aa += `

       
`
      }
      
    }
    

    aa +=`
    </tr>
    `

    $("#showTaxes").append(aa)
  }


  // for (let i = 0; i < revenueHeads.message.length; i++) {
  //   const revenuehead = revenueHeads.message[i];
  //   if (revenuehead.COL_5 === userInfo.category) {
  //     ii++
  //     $("#showTaxes").append(`
  //       <tr>
  //         <td>${ii}</td>
  //         <td>Monthly</td>
  //         <td>${revenuehead["COL_4"]}</td>          
  //       </tr>
  //     `)
  //   }
  //   if (ii === 5) {
  //     break;
  //   }
  // }
}

fetchTaxes()

fetchInvoice()

async function fetchPayment() {
  $("#showPayment").html("");
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
  // console.log(userInvoices);
  $("#loader").css("display", "none");
  if (userInvoices.status === 1) {
    for (let i = 0; i < userInvoices.message.length; i++) {
      const userInvoice = userInvoices.message[i];
      $("#showPayment").append(`
        <tr class="relative">
          <td>${i + 1}</td>
          <td>${userInvoice["COL_4"]}</td>
          <td>${userInvoice["receipt_number"]}</td>
          <td>&#8358;${userInvoice["COL_6"]}</td>
          <td>${userInvoice.timeIn}</td>            
        </tr>
      `);

      if (i === 4) {
        break;
      }
    }
  } else {
    $("#showPayment").html(`
      <tr>
        <td colspan="5" class="text-center">No data available</td>
      </tr>
    `);
    // $("#dataTable").DataTable();
  }
}

fetchPayment()


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
      `${HOST}/php/index.php?getDashboardAnalytics&user_id=${userID}`
    );

    const userAnalytics = await response.json();
    $("#due_amount").html(userAnalytics.due_amount)
    $("#due_invoices").html(userAnalytics.due_invoices)
    $("#total_amount").html(userAnalytics.total_amount_invoiced)
    $("#total_amountP").html(userAnalytics.total_amount_paid)
    // console.log(userAnalytics)
  } catch (error) {
    console.log(error)
  }


}

fetchAnalytics()