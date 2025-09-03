let userIn = JSON.parse(window.localStorage.getItem("MDAINFO"));
// console.log(userIn);
let ALLINV = ""

let AllInvoiceData = {}


async function featchCollectionReport() {
    $("#showInvoice").html("");
    $("#loader").css("display", "flex");
  
    const response = await fetch(
      `${HOST}?getPaymentByMda&mda_name=${userIn.fullname}`
    );
    const allCollections = await response.json();
    AllInvoiceData =  allCollections.message
// console.log(AllInvoiceData)
    $("#loader").css("display", "none");
    if (allCollections.status === 1) {
     
        displayData(allCollections.message.reverse())
    } else {
      // $("#showInvoice").html("<tr></tr>");
      $("#dataTable").DataTable();
    }
  }

  featchCollectionReport().then(rr => {
    // $("#dataTable").DataTable();
  
  })


  function displayData(allCollections) {
    allCollections.forEach((invoice, i) => {
        var date = new Date(invoice.timeIn);
        var year = date.getFullYear();
        var month = ('0' + (date.getMonth() + 1)).slice(-2);
        var day = ('0' + date.getDate()).slice(-2);
  
        var formattedDate = year + '-' + month + '-' + day;
        $("#showCollections").append(`
                <tr class="relative">
                <td>${i + 1}</td>
                <td>${invoice.COL_4}</td>
                <td>${invoice.first_name} ${invoice.surname} </td>
                <td>${invoice.invoice_number}</td>
                <td>&#8358 ${invoice.amount_paid}</td>
                <td>${formattedDate}</td>
                <td>${invoice.payment_channel}</td>
                <td>${invoice.payment_reference_number}</td>
                <td>
                <a href="./viewreceipt.html?invnumber=${invoice.invoice_number}&load=true" target="_blank" class="btn btn-primary btn-sm viewUser" >View Receipt</a>
              </td> 
                </tr>
                `);
  
      })
  }