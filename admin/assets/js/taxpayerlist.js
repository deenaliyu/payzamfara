const urlParams = new URLSearchParams(window.location.search);
const userIdo = urlParams.get('id');

let userrrData = {}
async function getTaxPayer() {
  try {
    const response = await fetch(`${HOST}/?userProfile&id=${userIdo}`)
    const data = await response.json()

    let taxPayerData = data.user
    userrrData = taxPayerData
    // console.log(taxPayerData)
    let theimg = taxPayerData.img
    if (theimg === "") {
      theimg = "./assets/img/avatars/1.png"
    }
    $("#userInfo").html(`
        <div class="flex gap-x-2">
        <img src="${theimg}" class="h-[70px] w-[70px] object-cover rounded-full" />
        <div class="mt-2">
        <h6 class="font-bold text-[20px]">${taxPayerData.first_name} ${taxPayerData.surname}</h6>
        <p><span class="font-bold">TIN:</span> ${taxPayerData.tax_number}</p>
        </div>
        </div>
           
            <div class="flex flex-wrap gap-x-5 gap-y-3 mt-2">
              <p><span class="font-bold">Category:</span> ${taxPayerData.category}</p>
              <p><span class="font-bold">State:</span> ${taxPayerData.state}</p>
              <p><span class="font-bold">LGA:</span> ${taxPayerData.lga}</p>
              <p><span class="font-bold">Address:</span> ${taxPayerData.address}</p>
              <p><span class="font-bold">Email address:</span> ${taxPayerData.email}</p>
              <p><span class="font-bold">Contact:</span> ${taxPayerData.phone}</p>
              <p><span class="font-bold">Tax Number:</span> ${taxPayerData.tin}</p>
              <p><span class="font-bold">Business Type:</span> ${taxPayerData.business_type}</p>
            </div>

        
        `)

  } catch (error) {
    console.log(error)
  }

}

getTaxPayer().then(thee => {
  getTaxesCateg().then(res => {
    $(".dataTable").DataTable();
    $(".dataTable2").DataTable();
  })
})

function exportTablee(element, thetable) {
  $("#" + element).tableHTMLExport({
    // csv, txt, json, pdf
    type: 'csv',
    // file name
    filename: 'report.csv'
  });
}





async function getTaxesCateg() {
  const response = await fetch(`${HOST}?getAllRevenueHeads`)
  const revenueHeads = await response.json()

  console.log(revenueHeads)

  let ii = 0
  revenueHeads.message.forEach((revenuehead, i) => {
    if (revenuehead.COL_5 === userrrData.category) {
      ii++
      $("#showTaxes").append(`
        <tr>
          <td>${ii}</td>
          <td>${revenuehead["COL_4"]}</td>
          <td>Monthly</td>
        </tr>
      `)
    }
  });

  revenueHeads.message.forEach((revenuehead, i) => {
    $("#showAllTaxes").append(`
      <tr>
        <td>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="">
          </div>
        </td>
        <td>${revenuehead["COL_3"]}</td>
        <td>${revenuehead["COL_4"]}</td>
        <td>GENERAL</td>
        <td>${revenuehead["COL_5"]}</td>
        <td>Yes</td>
        <td>One-off</td>
        <td>${revenuehead["COL_6"]}</td>
      </tr>
    `)
  })

}

async function fetchInvoice() {
  $("#showInvoice").html("");
  $("#loader").css("display", "flex");

  const response = await fetch(`${HOST}/php/index.php?userInvoices&payer_id=${userIdo}`);
  const userInvoices = await response.json();
  // console.log(userInvoices);
  $("#loader").css("display", "none");
  console.log(userInvoices)
  if (userInvoices.status === 1) {
    $("#invNumbers").html(userInvoices.message.length)

    for (let i = 0; i < userInvoices.message.length; i++) {
      const userInvoice = userInvoices.message[i];
      let all = ""
      all += `
                <tr class="">
                    <td>${i + 1}</td>
                    <td>${userInvoice.COL_4}</td>
                    <td>${userInvoice.COL_6}</td>
             `
      if (userInvoice.payment_status === "paid") {
        all += `       
                  <td class="text-[#008000]">${userInvoice.payment_status}</td>
                 `
      } else {
        all += `       
                    <td class="text-[red]">${userInvoice.payment_status}</td>
                `
      }

      all += `    
                    <td>
                        <a href="./viewinvoice.html?invnumber=${userInvoice.invoice_number}&load=true" target="_blank" class="btn btn-primary btn-sm viewUser" >View Invoice</a>
                    </td>
                </tr>
            `
      $("#showInvoice").append(all);
    }
  } else {
    $("#showInvoice").html(`
        <tr>
          <td colspan="5" class="text-center">No data available</td>
        </tr>
      `);
    $("#dataTable").DataTable();
  }
}

fetchInvoice().then(rr => {
  $('#dataTable').DataTable();
})


async function getAnalytics() {
  try {
    const response = await fetch(`${HOST}?getActivityLogs&userId=${userIdo}`)
    const data = await response.json()

    if (data.status === 0) {
      $("#ActivityLogs").html(``)

    } else {
      // <button class="text-[#005826] text-[12px] underline underline-offset-1">clear</button>

      data.message.forEach((notification, i) => {
        $("#ActivityLogs").append(`
        <tr>
          <td>${notification.timeIn}</td>
          <td>${notification.comment}</td>
        </tr>
      `)

      });


    }

  } catch (error) {
    console.log(error)
  }
}

getAnalytics().then(ee => {
  $('#dataTable77').DataTable();
})
