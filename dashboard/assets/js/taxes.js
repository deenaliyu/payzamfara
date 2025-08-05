let userInfo = JSON.parse(localStorage.getItem("userDataPrime"));
// console.log(userInfo);
let tax_numberP = userInfo.tax_number;

// async function getApplicableTaxes() {
//   const response = await fetch(
//     `${HOST}?getApplicableTaxes&tax_number=${tax_numberP}`
//   );
//   const revenueHeads = await response.json();

//   console.log(revenueHeads);
//   $("#loaderr").remove();

//   if (revenueHeads.length === 0) {
//     $(".apt").html(`
//       <div class="text-center mt-4">
//         <p class="text-lg text-gray-500">No applicable taxes found for your tax number.</p>
//       </div>
//       `)
//   } else {
//     for (const item of revenueHeads) {

//       let aa = ""

//       aa += `
//     <div class="accordion-item">
//       <h2 class="accordion-header" id="headingOne">
//       <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${item.business_type_id}" aria-expanded="true" aria-controls="collapseOne">
//           ${item.business_type}
//       </button>
//     </h2>
//      <div id="collapse${item.business_type_id}" class="accordion-collapse collapse mee" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
//      <div class="accordion-body">
//      <div class="table-responsive mt-4">
//                   <table class="table">
//                     <thead>
//                       <tr>
//                         <td></th>
//                         <td>Description</th>
//                         <td>Frequency</th>
//                         <td>Amount</th>
//                         <td></th>
//                       </tr>
//                     </thead>
//                     <tbody>
//     `

//       for (const key in item) {

//         if (item[key].id) {
//           let i = key
//           aa += `

//                       <tr>
//                        <td><input class="form-check-input taxChecks" data-theidd="${item[key].id}" type="checkbox" value="" onchange="checkTax(this)"></td>
//                        <td>${item[key].COL_4}</td>
//                        <td>Monthly</td>
//                        <td>${item[key].COL_6}</td>
//                        <td><button class="button text-sm" onclick="generateInv(${item[key].id})">Generate Invoice</button></td>
//                        </tr>
//       `
//         } else {
//           aa += `


// `
//         }

//       }


//       aa += `
//     </tbody>
//     </table>
//   </div>

// </div>
//       </div>
//       </div>
//     `

//       $(".apt").append(aa)
//     }
//   }

// }

// getApplicableTaxes().then((res) => {
//   // $("#dataTable3").DataTable({
//   //   'processing': true,
//   //   'paging': false,
//   //   'serverSide': false,
//   // });
//   // $("#dataTable3").DataTable();
// });

// console.log(tax_numberP)

async function displayApplicableTaxes(taxNumber) {
  try {
    const response = await fetch(`https://payzamfara.com/php/index.php?calculateApplicableTaxesCompliance&tax_number=${taxNumber}`);
    const data = await response.json();

    if (data.status === 1) {
      const taxesContainer = document.getElementById('taxes-container');

      console.log(taxesContainer)
      taxesContainer.innerHTML = `
        <div class="applicable-taxes-container">
          <h4>Applicable Taxes for Payer ID: ${data.tax_number}</h4>

          <div class="table-responsive mt-5">
            <table class="table">
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Revenue Head</th>
                  <th>Frequency</th>
                  <th>Amount (₦)</th>
                  <th>Periods Due</th>
                  <th>Total Due (₦)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${data.revenue_breakdown.map((item, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${item.revenue_head}</td>
                    <td>${item.frequency}</td>
                    <td>₦ ${item.amount.toLocaleString()}</td>
                    <td>${item.non_compliant_periods.join(', ')}</td>
                    <td>₦ ${item.total_due.toLocaleString()}</td>
                    <td>
                      <span class="badge ${item.status === 'Non-compliant' ? 'bg-danger' : 'bg-success'}">
                        ${item.status}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

         ${data.total_due > 0 ? `
            <div class="alert alert-danger text-center mt-4">
              <i class="fas fa-exclamation-triangle"></i> 
              You have outstanding taxes totaling ₦${data.total_due.toLocaleString()}
            </div>
          ` : `
            <div class="alert alert-success text-center mt-4">
              <i class="fas fa-check-circle"></i> 
              You are fully compliant with all tax obligations
            </div>
          `}
      `;
    } else {
      document.getElementById('taxes-container').innerHTML = `
        <div class="alert alert-primary text-center">No tax information found for this tax number</div>
      `;
    }
  } catch (error) {
    document.getElementById('taxes-container').innerHTML = `
      <div class="alert alert-danger">Error loading tax information: ${error.message}</div>
    `;
  }
}

// function showPeriodDetails(index, item) {
//   const modalBody = document.getElementById('periodsModalBody');
//   const isCompliant = item.status === 'Compliant';

//   modalBody.innerHTML = `
//     <div class="container-fluid">
//       <div class="row mb-3">
//         <div class="col-md-6">
//           <h5>${item.revenue_head}</h5>
//           <p><strong>Frequency:</strong> ${item.frequency}</p>
//         </div>
//         <div class="col-md-6 text-right">
//           <span class="badge ${isCompliant ? 'badge-success' : 'badge-warning'} p-2">
//             ${item.status}
//           </span>
//         </div>
//       </div>
      
//       <div class="row">
//         <div class="col-md-6">
//           <div class="card ${isCompliant ? 'border-success' : 'border-warning'}">
//             <div class="card-header ${isCompliant ? 'bg-success text-white' : 'bg-warning text-dark'}">
//               <h6 class="mb-0">${isCompliant ? 'Paid Periods' : 'Due Periods'}</h6>
//             </div>
//             <div class="card-body">
//               ${(isCompliant ? item.paid_periods : item.non_compliant_periods).length > 0 ?
//       `<ul class="list-group">
//                   ${(isCompliant ? item.paid_periods : item.non_compliant_periods).map(period => `
//                     <li class="list-group-item d-flex justify-content-between align-items-center">
//                       ${period}
//                       ${isCompliant ?
//           '<span class="badge badge-success badge-pill"><i class="fas fa-check"></i></span>' :
//           '<span class="badge badge-danger badge-pill"><i class="fas fa-exclamation"></i></span>'
//         }
//                     </li>
//                   `).join('')}
//                 </ul>` :
//       `<p class="text-muted">No ${isCompliant ? 'paid' : 'due'} periods</p>`
//     }
//             </div>
//           </div>
//         </div>
        
//         <div class="col-md-6">
//           <div class="card border-info">
//             <div class="card-header bg-info text-white">
//               <h6 class="mb-0">Summary</h6>
//             </div>
//             <div class="card-body">
//               <p><strong>Amount per period:</strong> ₦${item.amount.toLocaleString()}</p>
//               <p><strong>Total due:</strong> ₦${item.total_due.toLocaleString()}</p>
//               <p><strong>Total periods:</strong> ${item.total_expected_periods}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   `;

//   $('#periodsModal').modal('show');
// }
// Example usage:
displayApplicableTaxes('ZAI-0000061743');

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
              <button class="dropdown-item" onclick="generateInv(${revenuehead.id
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


async function assignedTaxesBody() {
  try {
    const response = await fetch(`${HOST}?fetchAssignedTaxesByTaxNumber&tax_number=${tax_numberP}`);
    const theassignData = await response.json();

    theassignData.data.forEach((item, i) => {
      $("#assignedTaxesBody").append(`
        <tr>
          <td><input class="form-check-input taxCheckso" data-thename="${item.revenue_head_name}" data-theidd="${item.revenue_head_id}" type="checkbox"></td>
          <td>${i + 1}</td>
          <td>${item.revenue_head_name}</td>
          <td>Individual</td>
          <td>${item.assignment_date}</td>
        </tr>
      `);
    })

  } catch (error) {
    console.log(error)
  }
}
assignedTaxesBody().then(res => {
  $("#dataTable4").DataTable()
})

$("#generateInvoiceBtn").on("click", function () {
  let allSelected = document.querySelectorAll(".taxCheckso");
  let theArray = [];
  allSelected.forEach((slt) => {
    if (slt.checked) {
      theArray.push(slt.dataset.theidd);
    }
  });

  if (theArray.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'No Taxes Selected',
      text: 'Please select at least one tax to generate an invoice.',
    });
  } else {
    Swal.fire({
      title: 'Generating Invoice',
      text: 'Please wait while we generate your invoice.',
      icon: 'info',
      confirmButtonText: 'Generate Invoice',
      confirmButtonColor: '#015826',
      html: `
        <div>
          <table class="table">
            <thead>
              <tr>
                <th>Revenue Head</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${theArray.map((id, idx) => {
        const revenueHead = $(`#assignedTaxesBody input[data-theidd="${id}"]`).closest('tr').find('td').eq(2).text();
        return `
                  <tr>
                    <td>${revenueHead}</td>
                    <td>
                      <input type="number" min="0" class="swal2-input form-control" id="swal-input-price-${id}" placeholder="Enter amount for ${revenueHead}">
                    </td>
                  </tr>
                `;
      }).join('')}
            </tbody>
          </table>
        </div>
      `,
      preConfirm: async () => {
        let prices = theArray.map(id => {
          const val = document.getElementById(`swal-input-price-${id}`).value;
          return val ? val : '';
        });
        if (prices.some(p => !p || isNaN(p) || Number(p) <= 0)) {
          Swal.showValidationMessage('Please enter a valid amount for each selected tax.');
          return false;
        }
        try {
          const response = await fetch(`${HOST}?generateSingleInvoices&tax_number=${tax_numberP}&revenue_head_id=${theArray.join(",")}&price=${prices.join(",")}&zonalOffice=8&lga=Not Assigned&invoice_type=invoice`);
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return await response.json();
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error}`);
        }
      },
      allowOutsideClick: false,
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Invoice Generated Successfully!',
          text: `Your invoice number is ${result.value.invoice_number}.`,
          confirmButtonText: 'Open Invoice',
          confirmButtonColor: '#015826',
        }).then((result3) => {
          if (result3.isConfirmed) {
            window.location.href = `../viewinvoice.html?invnumber=${result.value.invoice_number}&load=true`;
          }
        });
      }
    });
  }



})

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
