let userIn = JSON.parse(window.localStorage.getItem("MDAINFO"));
console.log(userIn);
let ALLINV = ""


async function fetchInvoices() {
  $("#showInvoice").html("");


  let config = {
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
    },
  };
  const response = await fetch(
    `${HOST}?getInvoiceByMda&mda_name=${userIn.fullname}`
  );
  const userInvoices = await response.json();

  userInvoices ? $("#loader").remove() : `<h1>failed to fetch data</h1>`
  console.log(userInvoices);

  ALLINV = userInvoices

  if (userInvoices.status === 1) {

    userInvoices.message.forEach((invoice, i) => {
      $('#totalInv').text(userInvoices.message.length);
      // const userInvoice = paymentHistory.message[i];
      $("#showInvoices").append(`
              <tr>
              <td>${i + 1}</td>
              <td>${invoice.COL_4}</td>
              <td>${invoice.first_name} ${invoice.surname} </td>
              <td>${invoice.invoice_number} </td>
               <td>&#8358 ${invoice.COL_6} </td>
              <td>${invoice.due_date} </td>
              <td>
             
              ${invoice.payment_status === 'paid' ? `<div class="bg-[#ECFDF3] rounded-2xl py-1 px-3">
              <p class="text-[#027A48] font-bold">${invoice.payment_status}</p>
            </div>`
          : `<div class="bg-orange-100 rounded-2xl py-1 px-3">
              <p class="text-[#125826] font-bold">${invoice.payment_status}</p>
            </div>`}
              </td>
              
              <td>
              <a href="./viewinvoice.html?invnumber=${invoice.invoice_number}&load=true" target="_blank" class="btn btn-primary btn-sm viewUser" >View Invoice</a>
            </td>
             
              
             
              </tr>
              `);



    })
    //   for (let i = 0; i < userInvoices.message.length; i++) {
    //     const userInvoice = userInvoices.message[i];
    //     $("#showPayment").append(`
    //       <tr>
    //       <td>${userInvoice.user_id}</td>
    //       <td>${userInvoice.payment_reference_number}</td>
    //         <td>${userInvoice["COL_4"]}</td>
    //         <td>&#8358;${userInvoice["COL_6"]}</td>
    //         <td>${userInvoice.payment_channel}</td>
    //         <td>
    //           <p class="text-success">Successful</p>
    //         </td>
    //         <td></td>
    //       </tr>
    //       `);

    //     if (i === 4) {
    //       break;
    //     }
    //   }
  } else {
    // $("#showInvoice").html("<tr></tr>");
    $("#dataTable").DataTable();
  }

  const tttt = document.getElementById("dashboardPie")

  new Chart(tttt, {
    type: 'doughnut',
    data: {
      labels: ['Total Amount Invoiced', 'Total Amount Paid', 'Due Invoices', 'Due Amount'],
      datasets: [{
        label: 'Remittance by user',
        data: [1268703, 43191, 214, 1037834,],
        // sort((a,b) => a - b)
        borderWidth: 5,
        backgroundColor: [
          "purple",
          "blue",
          "yellow",
          "green",
        ],
      }]
    },
    options: {
      plugins: {
        legend: {
          position: "right",
          labels: {
            color: 'black'
          }
        }
      },
      responsive: false,

      // scales: {
      //   y: {
      //     beginAtZero: true
      //   },
      // }
    }
  });
}

// fetchInvoices().then(rr => {
//   // $("#dataTable").DataTable();
// })


async function fetchInvoicess() {
  const response = await fetch(
    `${HOST}/php/index.php?AllInvoices`
  );
  const userInvoices = await response.json();
    
  if (userInvoices.status === 1) {
    let theMDAInv = userInvoices.message.filter(inv => inv.COL_3 === userIn.fullname)
    
    console.log(theMDAInv)
    
    theMDAInv.forEach((invoice, i) => {
      $('#totalInv').text(userInvoices.message.length);
      // const userInvoice = paymentHistory.message[i];
      $("#showInvoices").append(`
              <tr>
              <td>${i + 1}</td>
              <td>${invoice.COL_4}</td>
              <td>${invoice.first_name} ${invoice.surname} </td>
              <td>${invoice.invoice_number} </td>
               <td>&#8358 ${invoice.COL_6} </td>
              <td>${invoice.due_date} </td>
              <td>
             
              ${invoice.payment_status === 'paid' ? `<div class="bg-[#ECFDF3] rounded-2xl py-1 px-3">
              <p class="text-[#027A48] font-bold">${invoice.payment_status}</p>
            </div>`
          : `<div class="bg-orange-100 rounded-2xl py-1 px-3">
              <p class="text-[#125826] font-bold">${invoice.payment_status}</p>
            </div>`}
              </td>
              
              <td>
              <a href="./viewinvoice.html?invnumber=${invoice.invoice_number}&load=true" target="_blank" class="btn btn-primary btn-sm viewUser" >View Invoice</a>
            </td>
             
              
             
              </tr>
              `);



    })
  
  } else {

  }
}
fetchInvoicess()





//   fetch Collection Reports
async function featchCollectionReport() {
  $("#showInvoice").html("");
  $("#loader").css("display", "flex");

  const response = await fetch(
    `${HOST}?getPaymentByMda&mda_name=${userIn.fullname}`
  );
  const allCollections = await response.json();
  console.log(allCollections);
  $("#loader").css("display", "none");
  if (allCollections.status === 1) {

    allCollections.message.forEach((invoice, i) => {
      // $('#totalRem').text(allCollections.message.length);
      // const userInvoice = paymentHistory.message[i];
      var date = new Date(invoice.timeIn);
      var year = date.getFullYear();
      var month = ('0' + (date.getMonth() + 1)).slice(-2);
      var day = ('0' + date.getDate()).slice(-2);

      var formattedDate = year + '-' + month + '-' + day;
      $("#showCollections").append(`
              <tr>
              <tr class="relative">
              <td>${i + 1}</td>
              <td>${invoice.revenue_head}</td>
              <td>${invoice.first_name} ${invoice.surname} </td>
              <td>${invoice.invoice_number}</td>
              <td>&#8358 ${invoice.COL_6}</td>
              <td>${formattedDate}</td>
              <td>${invoice.payment_channel}</td>
              <td>${invoice.payment_reference_number}</td>
              <td>
              <a href="./viewreceipt.html?invnumber=${invoice.invoice_number}&load=true" target="_blank" class="btn btn-primary btn-sm viewUser" >View Receipt</a>
            </td> 
              </tr>
              `);

    })

  } else {
    // $("#showInvoice").html("<tr></tr>");
    $("#dataTable").DataTable();
  }
}


function editRevFunc(e) {
  let viewID = e.dataset.revid
  console.log(viewID)
  sessionStorage.setItem("revUpdate", viewID)

  let theInv = ALLINV.message.filter(dd => dd.id === viewID)[0]

  let allInputss = document.querySelectorAll(".revInput2")
  allInputss[0].value = theInv["COL_4"]
  allInputss[1].value = theInv["COL_5"]
  allInputss[2].value = theInv["COL_6"]
}


// delete revhead
function deleteRev(e) {
  let theInvId = e.dataset.revid
  console.log(theInvId)
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: "GET",
        url: `${HOST}?deleteRevenueHead&id=${theInvId}`,
        dataType: "json",
        success: function (data) {
          console.log(data)
          if (data.status === 1) {
            Swal.fire(
              'Deleted!',
              'Revenue Head has been deleted.',
              'success'
            )
            setTimeout(() => {
              window.location.reload()
            }, 1000);
          } else {
            Swal.fire(
              'Try again!',
              'Something went wrong, try again !',
              'error'
            )
          }
        },
        error: function (request, error) {
          Swal.fire(
            'Try again!',
            'Something went wrong, try again !',
            'error'
          )
        }
      });

    }
  })
}

featchCollectionReport().then(rr => {
  // $("#dataTable").DataTable();

})
