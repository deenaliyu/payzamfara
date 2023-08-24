const urlParams = new URLSearchParams(window.location.search);
const userIdo = urlParams.get('id');

const enumerated = urlParams.get('enumerated')
let userrrData = {}

async function getTaxPayer() {
  try {
    const response = await fetch(`${HOST}/?userProfile&id=${userIdo}`)
    const data = await response.json()
    localStorage.setItem("singleUser", JSON.stringify(data.user))
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
        <p><span class="font-bold">Payer ID:</span> ${taxPayerData.tax_number}</p>
        </div>
        </div>
           
            <div class="flex flex-wrap gap-x-5 gap-y-3 mt-2">
              <p><span class="font-bold">Category:</span> ${taxPayerData.category}</p>
              <p><span class="font-bold">State:</span> ${taxPayerData.state}</p>
              <p><span class="font-bold">LGA:</span> ${taxPayerData.lga}</p>
              <p><span class="font-bold">Address:</span> ${taxPayerData.address}</p>
              <p><span class="font-bold">Email address:</span> ${taxPayerData.email}</p>
              <p><span class="font-bold">Contact:</span> ${taxPayerData.phone}</p>
              <p><span class="font-bold">Tin Status:</span> ${taxPayerData.tin_status}</p>
              <p><span class="font-bold">Tax Number:</span> ${taxPayerData.tin == "" ? '-' : taxPayerData.tin}</p>
              <p><span class="font-bold">Business Type:</span> ${taxPayerData.business_type == "" ? '-' : taxPayerData.business_type}</p>
              <p><span class="font-bold">Emplyment Status:</span> ${taxPayerData.employment_status == "" ? '-' : taxPayerData.employment_status}</p>
              <p><span class="font-bold">Number of Staff:</span> ${taxPayerData.number_of_staff == "" ? '-' : taxPayerData.number_of_staff}</p>
            </div>

        
        `)

  } catch (error) {
    console.log(error)
  }

}

async function getTaxPayer2() {
  try {
    const response = await fetch(`${HOST}/?getEnumerationTaxPayer`)
    const data = await response.json()

    let taxPayerData = data.message.find(dd => dd.id === userIdo)
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
              <p><span class="font-bold">Category:</span> ${taxPayerData.tax_category}</p>
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

if (enumerated) {
  getTaxPayer2().then(thee => {
    getTaxesCateg().then(res => {
      $(".dataTable").DataTable();
      $(".dataTable2").DataTable();
    })
  })
} else {
  getTaxPayer().then(thee => {
    getTaxesCateg().then(res => {
      $(".dataTable").DataTable();
      $(".dataTable2").DataTable();
    })
  })
}

function exportTablee(element, thetable) {
  $("#" + element).tableHTMLExport({
    // csv, txt, json, pdf
    type: 'csv',
    // file name
    filename: 'report.csv'
  });
}



async function getApplicableTaxes() {
  let userInfo = JSON.parse(localStorage.getItem("singleUser"))
  const userTax = userInfo.tax_number;
  const response = await fetch(
    `${HOST}?getApplicableTaxes&tax_number=${userTax}`
  );
  const revenueHeads = await response.json();

  // console.log(revenueHeads);
  $("#loaderr").remove();
  for (const item of revenueHeads) {

    let aa = ""

    aa += `
    <div class="accordion-item">
      <h2 class="accordion-header" id="headingOne">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${item.business_type_id}" aria-expanded="true" aria-controls="collapseOne">
          ${item.business_type}
      </button>
    </h2>
     <div id="collapse${item.business_type_id}" class="accordion-collapse collapse mee" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
     <div class="accordion-body">
     <div class="table-responsive -mt-6">
                  <table class="table">
                    <thead>
                      <tr>
                        <th></th>
                        <th>S/N</th>
                        <th>Description</th>
                        <th>Frequency</th>
                        <th>Amount</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody id="showTaxes">
    `

    for(const key in item) {

      if(item[key].id) {
        aa += `

                      <tr>
                       <td><input class="form-check-input taxChecks" data-theidd="${item[key].id}" type="checkbox" value="" onchange="checkTax(this)"></td>
                       <td>hhh</td>
                       <td>${item[key].COL_4}</td>
                       <td>Monthly</td>
                       <td>${item[key].COL_6}</td>
                       <td><button class="button text-sm" onclick="generateInv(${item[key].id})">Generate Invoice</button></td>
                       </tr>
      `
      }else{
        aa += `

       
`
      }
      
    }
    

    aa +=`
    </tbody>
    </table>
  </div>

</div>
      </div>
      </div>
    `

    $(".apt").append(aa)
  }
}

getApplicableTaxes().then((res) => {
  // $("#dataTable3").DataTable({
  //   'processing': true,
  //   'paging': false,
  //   'serverSide': false,
  // });
  // $("#dataTable3").DataTable();
});

async function getTaxesCateg() {
  const response = await fetch(`${HOST}?getAllRevenueHeads`)
  const revenueHeads = await response.json()

  // console.log(revenueHeads)

  let ii = 0

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
  $("#showInvoice1").html("");
  $("#loader").css("display", "flex");
  let userInfo = JSON.parse(localStorage.getItem("singleUser"))
  const userTax = userInfo.tax_number;
  console.log(userTax)
  const response = await fetch(`${HOST}/php/index.php?userInvoices&tax_number=${userTax}`);
  const userInvoices = await response.json();
 
  $("#loader").css("display", "none");
  if (userInvoices.status === 1) {
    $("#invNumbers").html(userInvoices.message.length)

    for (let i = 0; i < userInvoices.message.length; i++) {
      const userInvoice = userInvoices.message[i];
      // console.log(userInvoice);
      let all = ""
      all += `
                <tr class="">
                    <td>${i + 1}</td>
                    <td>${userInvoice.invoice_number}</td>
                    <td>${userInvoice.COL_4}</td>
                    <td>${userInvoice.COL_6}</td>
                    <td>${userInvoice.date_created}</td>
                    <td>${userInvoice.due_date}</td>
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
      $("#showInvoice1").append(all);
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
    let userInfo = JSON.parse(localStorage.getItem("singleUser"))
    const userTax = userInfo.tax_number;
 
    const response = await fetch(`${HOST}?getActivityLoge&userId=${userTax}`)
    const data = await response.json()
console.log(data)
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
