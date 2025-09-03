let userInfo = JSON.parse(localStorage.getItem("userDataPrime"));
// console.log(userInfo);
let tax_numberP = userInfo.tax_number;

async function getApplicableTaxes() {
  const response = await fetch(
    `${HOST}?getApplicableTaxes&tax_number=${tax_numberP}`
  );
  const revenueHeads = await response.json();

  console.log(revenueHeads);
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
     <div class="table-responsive mt-4">
                  <table class="table">
                    <thead>
                      <tr>
                        <td></th>
                        <td>Description</th>
                        <td>Frequency</th>
                        <td>Amount</th>
                        <td></th>
                      </tr>
                    </thead>
                    <tbody>
    `

    for(const key in item) {

      if(item[key].id) {
        let i = key
        aa += `

                      <tr>
                       <td><input class="form-check-input taxChecks" data-theidd="${item[key].id}" type="checkbox" value="" onchange="checkTax(this)"></td>
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

// console.log(tax_numberP)
async function getTaxes() {
  const response = await fetch(`${HOST}?getAllRevenueHeads`);
  const revenueHeads = await response.json();

  // console.log(revenueHeads)
  $("#loaderr").remove();
  let ii = 0;

  {
    /* <td>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="">
          </div>
        </td> */
  }
  revenueHeads.message.forEach((revenuehead, i) => {
    $("#showAllTaxes").append(`
      <tr>
        <td>${i + 1}</td>
        <td>${revenuehead["COL_3"]}</td>
        <td>${revenuehead["COL_4"]}</td>
        <td>GENERAL</td>
        <td>${revenuehead["COL_5"]}</td>
        <td>Yes</td>
        <td>One-off</td>
        <td>${revenuehead["COL_6"]}</td>
        <td>
          <div class="dropdown ">
            <button class="flex gap-1 align-items-center" type="button" id="filtermda"
              data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <iconify-icon icon="iwwa:option-horizontal" style="font-size: 24px"></iconify-icon>
            </button>
            <div class="dropdown-menu dropdown-menu-end" aria-labelledby="filtermda">
              <button class="dropdown-item" onclick="generateInv(${
                revenuehead.id
              })">Generate Invoice</button>
            </div>
          </div>
        </td>
      </tr>
    `);
  });
}

getTaxes().then((res) => {
  $("#dataTable").DataTable({
    processing: true,
    paging: false,
    serverSide: false,
  });
  $("#dataTable2").DataTable();
});

// async function getPresumptiveTaxes() {
//   const response = await fetch(
//     `${HOST}?getPresumptiveTaxId&tax_number=${tax_numberP}`
//   );
//   const revenueHeads = await response.json();

//   console.log(revenueHeads);

//   $("#loaderr").remove();
//   for (const item of revenueHeads) {

//     let aa = ""

//     for(const key in item) {
// console.log(item[key].id);
//       if(item[key].id) {
//         aa += `

//                       <tr>
//          <td></td>
//        <td>${item[key].id}</td>
//       <td>${item[key].business_type}</td>
//       <td>${item.category}</td>
//       <td>${item[key].frequency}</td>
//       <td>${item[key].minimum}</td>
//       <td>
//         <div class="dropdown">
//           <button class="flex gap-1 align-items-center" type="button" id="filtermda"
//             data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//             <iconify-icon icon="iwwa:option-horizontal" style="font-size: 24px"></iconify-icon>
//           </button>
//           <div class="dropdown-menu dropdown-menu-end" aria-labelledby="filtermda">
//             <button class="dropdown-item" onclick="generateInv(${item[key].id})">Generate Invoice</button>
//           </div>
//         </div>
//       </td>
//       `
//       }
      
//     }
    

//     $("#showPresumptiveTax").append(aa)
//   }
//   // if (revenueHeads.status === 1) {
//   //   $("#showPresumptiveTax").append(`
//   //   <tr>
//   //     <td></td>
//   //      <td>${revenueHeads.message.id}</td>
//   //     <td>${revenueHeads.message.business_type}</td>
//   //     <td>${revenueHeads.message.category}</td>
//   //     <td>${revenueHeads.message.frequency}</td>
//   //     <td>${revenueHeads.message.minimum}</td>
//   //     <td>
//   //       <div class="dropdown">
//   //         <button class="flex gap-1 align-items-center" type="button" id="filtermda"
//   //           data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//   //           <iconify-icon icon="iwwa:option-horizontal" style="font-size: 24px"></iconify-icon>
//   //         </button>
//   //         <div class="dropdown-menu dropdown-menu-end" aria-labelledby="filtermda">
//   //           <button class="dropdown-item" onclick="generateInv(${revenueHeads.message.id})">Generate Invoice</button>
//   //         </div>
//   //       </div>
//   //     </td>
//   //   </tr>
//   // `);
//   // } else {
//   //   $("#showPresumptiveTax").append(`
//   //   <td>No Presumtive Taxes</td>
//   //   `);
//   // }
// }

// getPresumptiveTaxes().then((res) => {
//   $("#dataTable3").DataTable({
//     processing: true,
//     paging: false,
//     serverSide: false,
//   });
//   $("#dataTable3").DataTable();
// });

function generateInv(revid) {
  let taxNumber = userInfo.tax_number;
  Swal.fire({
    title: "Generating Invoice",
    icon: "info",
    backdrop: true,
    allowOutsideClick: false,
    showCancelButton: true,
    confirmButtonText: "Generate Invoice",
    html:
    '<input id="swal-input1" class="swal2-input"  placeholder=" Amount to be paid ">',
    showLoaderOnConfirm: true,
    preConfirm: async () => {
      let price = document.getElementById('swal-input1').value
      try {
        const response = await fetch(
          `${HOST}?generateSingleInvoices&tax_number=${taxNumber}&revenue_head_id=${revid}&price=${price}`
        );
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return await response.json();
      } catch (error) {
        Swal.showValidationMessage(`Request failed: ${error}`);
      }
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then((result) => {
    console.log(result.value);
    if (result.isConfirmed) {
      Swal.fire({
        icon: "success",
        title: `Invoice Generated successfully !`,
        confirmButtonText: "Open Invoice",
      }).then((result3) => {
        if (result.isConfirmed) {
          window.location.href = `../viewinvoice.html?invnumber=${result.value.invoice_number}&load=true`;
        }
      });
    }
  });

  // $.ajax({
  //   type: "GET",
  //   url: `${HOST}?generateSingleInvoices&tax_number=${taxNumber}&revenue_head_id=${revid}`,
  //   dataType: 'json',
  //   success: function (data) {
  //     console.log(data)
  //     if (data.status === 2) {

  //     } else if (data.status === 1) {
  //       $("#generating_inv").removeClass("hidden")

  //       $("#msg_box").html(``)
  //       Swal.fire({
  //         title: 'Generated',
  //         text: "Invoice has been generated successfully, Invoice details will be sent to your email and phone number!",
  //         icon: 'success',
  //         confirmButtonColor: '#3085d6',
  //         cancelButtonColor: '#3085d6',
  //         confirmButtonText: 'Open Invoice',
  //         allowOutsideClick: false
  //       }).then((result) => {
  //         if (result.isConfirmed) {
  //           nextPrev(1)
  //           openInvoice(data.invoice_number)
  //           // window.location.href = `invoice.html?invnum=${data.invoice_number}`
  //         }
  //       })

  //     }
  //   },
  //   error: function (request, error) {
  //     $("#msg_box").html(`
  //         <p class="text-danger text-center mt-4 text-lg">Something went wrong</p>
  //       `)
  //     $("#generateInvoice").removeClass("hidden")
  //     console.log(error);
  //   }
  // });
}

// let theTaxs = []
function checkTax(input) {
  let selectedCheck = document.querySelector(".taxChecks:checked");
  if (selectedCheck) {
    // showButton
    $("#genInv").removeClass("hidden");
  } else {
    // hideButton
    $("#genInv").addClass("hidden");
  }
}

$("#genInv").on("click", function () {
  let allSelected = document.querySelectorAll(".taxChecks");

  // let  = document.querySelectorAll(".")
  let theArray = [];
  allSelected.forEach((slt) => {
    if (slt.checked) {
      theArray.push(slt.dataset.theidd);
      // console.log(slt)
    }
  });
  // console.log()

  generateInv(theArray.join(","));
});
