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
      `${HOST}/php/index.php?AllInvoices`
    );
    const userInvoices = await response.json();

userInvoices? $("#loader").remove() : `<h1>failed to fetch data</h1>`
    console.log(userInvoices);
   
    if (userInvoices.status === 1) {

        userInvoices.message.forEach((invoice, i) => {
            // const userInvoice = paymentHistory.message[i];
            $("#showInvoices").append(`
              <tr>
              <td>${i + 1}</td>
              <td>${invoice.invoice_number}</td>
              <td>${invoice.tin} </td>
              <td>${invoice.first_name} ${invoice.surname} </td>
              <td>${invoice.revenue_head} </td>
              <td>${invoice.due_date} </td>
              <td></td>
              <td>
             
              ${invoice.payment_status === 'paid'? `<div class="bg-[#ECFDF3] rounded-2xl py-1 px-3">
              <p class="text-[#027A48] font-bold">${invoice.payment_status}</p>
            </div>`
              : `<div class="bg-orange-100 rounded-2xl py-1 px-3">
              <p class="text-[#005826] font-bold">${invoice.payment_status}</p>
            </div>`}
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
  }
  
  fetchInvoices().then(rr => {
    // $("#dataTable").DataTable();
  })



//   fetch Collection Reports
async function featchCollectionReport() {
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
      `${HOST}/php/index.php?fetchAllPayment`
    );
    const allCollections = await response.json();
    console.log(allCollections);
    $("#loader").css("display", "none");
    if (allCollections.status === 1) {

        allCollections.message.forEach((invoice, i) => {
            // const userInvoice = paymentHistory.message[i];
            $("#showCollections").append(`
              <tr>
              <tr class="relative">
              <td>${i + 1}</td>
              <td>${invoice.time_in}</td>
              <td>${invoice.receipt_number}</td>
              <td>${invoice.tin}</td>
              <td>${invoice.mda_id}</td>
              <td>${invoice.revenue_head}</td>
              <td>&#8358;</td>
              <td>&#8358;  ${invoice.COL_6}</td>
              <td>&#8358;</td>
              <td>${invoice.user_id}</td>
              
             
           
              
             
              
             
              </tr>
              `);
      
          })
    
    } else {
      // $("#showInvoice").html("<tr></tr>");
      $("#dataTable").DataTable();
    }
  }
  
  featchCollectionReport().then(rr => {
    // $("#dataTable").DataTable();
    
  })