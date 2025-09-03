async function getTaxFiling() {
  let userDATA = JSON.parse(localStorage.getItem("userDataPrime"))

  if (userDATA) {
    try {
      const response = await fetch(`${HOST}?getTaxFilingByUser&id=${userDATA.id}`)
      const data = await response.json()

      $("#eservicesTable").html("")
      if (data.status === 0) {
        $("#eservicesTable").html(`
          <tr>
            <td colspan="5" class="text-center">No Taxfilling records found.</td>
          </tr>
        `)
      } else {
        data.message.forEach(element => {
          $("#eservicesTable").append(`
          <tr>
            <td>${element.created_at.split(" ")[0]}</td>
            <td>${element.created_at.split(" ")[0]}</td>
            <td>${element.tax_filling_refrence}</td>
            <td>${element.tax_to_file}</td>
            <td><span class="badge bg-${element.application_status === "pending" ? 'warning' : 'success'}">${element.application_status}</span></td>
          </tr>
        `)
        });

      }


    } catch (error) {
      console.log(error)
      $("#eservicesTable").html(`
          <tr>
            <td colspan="5" class="text-center">Cannot fetch Taxfilling records.</td>
          </tr>
        `)
    }
  }

}

getTaxFiling()

function formatMoney(amount) {
  return parseFloat(amount).toLocaleString('en-US', {
    style: 'currency',
    currency: 'NGN', // Change this to your desired currency code
    minimumFractionDigits: 2,
  });
}

function populateTable(array, tableId) {
  const tableBody = $("#" + tableId);
  tableBody.empty();

  if (!array || array.length === 0) {
    tableBody.append(`<tr><td colspan="4" class="text-center">No records found</td></tr>`);
    return;
  }

  array.forEach((item, i) => {
    tableBody.append(`
          <tr>
              <!--<td><input class="form-check-input taxChecksAppl" data-thedueamount="${item.amount_paid}" data-thename="${item.revenue_head}" data-theidd="${item.revenue_head_id}" type="checkbox"></td> -->
              <td>${i + 1}</td>
              <td>${item.revenue_head}</td>
              <td>${formatMoney(item.amount_paid)}</td>
              <td><span class='badge bg-${item.payment_status === "paid" ? "success" : "danger"}'>${item.payment_status}</span></td>
              <td>${item.due_date}</td>
              <td>
                ${item.payment_status === 'unpaid' ? `<a class="button btn-sm" href="../viewinvoice.html?invnumber=${item.invoice_number}&load=true">View Invoice</a>` 
                  : `<a class="button btn-sm" href="../viewreceipt.html?invnumber=${item.invoice_number}&load=true">View Receipt</a>` }
              </td>
          </tr>
      `);
  });
}

$(document).ready(function () {
  $.ajax({
    url: `${HOST}?getUserTaxFiling`,
    type: "GET",
    data: { tax_number: userInfo2?.tax_number },
    success: function (res) {
      // If the API returns a string, parse it
      if (typeof res === "string") {
        res = JSON.parse(res);
      }

      if (res.status === 1 && res.filing_details) {
        populateTable(res.filing_details.demand_notice, "demandNoticeTable");
        populateTable(res.filing_details.presumptive, "presumptiveTable");
        populateTable(res.filing_details.direct, "directTable");
        populateTable(res.filing_details.invoice, "invoiceTable");
      } else {
        console.error("Invalid response", res);
      }
    },
    error: function (err) {
      console.error("API error", err);
    }
  });
});

// $("#generateInvoiceBtnFiling").on("click", function () {
//   let allSelected = document.querySelectorAll(".taxChecksAppl");
//   let theArray = [];
//   allSelected.forEach((slt) => {
//     if (slt.checked) {
//       theArray.push({
//         id: slt.dataset.theidd,
//         revenueHead: slt.dataset.thename,
//         revenueAmount: slt.dataset.thedueamount
//       });
//     }
//   });

//   if (theArray.length === 0) {
//     Swal.fire({
//       icon: 'warning',
//       title: 'No Taxes Selected',
//       text: 'Please select at least one tax to generate an invoice.',
//     });
//   } else {
//     Swal.fire({
//       title: 'Generating Invoice',
//       text: 'Please wait while we generate your invoice.',
//       icon: 'info',
//       confirmButtonText: 'Generate Invoice',
//       confirmButtonColor: '#015826',
//       html: `
//         <div>
//           <table class="table">
//             <thead>
//               <tr>
//                 <th>Revenue Head</th>
//                 <th>Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${theArray.map((id, idx) => {
//         return `
//                   <tr>
//                     <td>${id.revenueHead}</td>
//                     <td>
//                       <input type="number" min="0" class="swal2-inpt form-control" id="swal-input-price-${id.id}" value="${id.revenueAmount}" placeholder="${id.revenueAmount}" readonly>
//                     </td>
//                   </tr>
//                 `;
//       }).join('')}
//             </tbody>
//           </table>
//         </div>
//       `,
//       preConfirm: async () => {
//         let revArray = []
//         let prices = theArray.map(id => {
//           revArray.push(id.id)
//           const val = document.getElementById(`swal-input-price-${id.id}`).value;
//           return val ? val : '';
//         });
//         if (prices.some(p => !p || isNaN(p) || Number(p) <= 0)) {
//           Swal.showValidationMessage('Please enter a valid amount for each selected tax.');
//           return false;
//         }
//         try {
//           const response = await fetch(`${HOST}?generateSingleInvoices&tax_number=${tax_numberP}&revenue_head_id=${revArray.join(",")}&price=${prices.join(",")}&zonalOffice=8&lga=Not Assigned&invoice_type=invoice`);
//           if (!response.ok) {
//             throw new Error(response.statusText);
//           }
//           return await response.json();
//         } catch (error) {
//           Swal.showValidationMessage(`Request failed: ${error}`);
//         }
//       },
//       allowOutsideClick: false,
//       showLoaderOnConfirm: true,
//       allowOutsideClick: () => !Swal.isLoading(),
//     }).then((result) => {
//       if (result.isConfirmed) {
//         Swal.fire({
//           icon: 'success',
//           title: 'Invoice Generated Successfully!',
//           text: `Your invoice number is ${result.value.invoice_number}.`,
//           confirmButtonText: 'Open Invoice',
//           confirmButtonColor: '#015826',
//         }).then((result3) => {
//           if (result3.isConfirmed) {
//             window.location.href = `../viewinvoice.html?invnumber=${result.value.invoice_number}&load=true`;
//           }
//         });
//       }
//     });
//   }



// })