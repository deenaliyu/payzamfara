const urlParams = new URLSearchParams(window.location.search);
const userIdo = urlParams.get('id');
const userTaxnumber = urlParams.get('tax_number')

function formatMoney(amount) {
  return parseFloat(amount).toLocaleString('en-US', {
    style: 'currency',
    currency: 'NGN', // Change this to your desired currency code
    minimumFractionDigits: 2,
  });
}

async function fetchTaxfillers() {
  $("#showdetails").html("");
  $("#loader").css("display", "flex");


  const response = await fetch(`${HOST}?getTaxFilingById&id=${userIdo}`);
  const userInvoices = await response.json();
  $("#loader").css("display", "none");
  if (userInvoices.status === 1) {
    userInvoices.message.reverse().forEach((userInvoice, i) => {
      let addd = "";
      addd += `
          <tr class="relative">
          <td>First Name</td>
          <td>${userInvoice.first_name}</td>
          </tr>
          <tr class="relative">
          <td>Surname</td>
          <td>${userInvoice.surname}</td>
          </tr>
          <tr class="relative">
          <td>Email</td>
          <td>${userInvoice.email}</td>
          </tr>
          <tr class="relative">
          <td>Phone Number</td>
          <td>${userInvoice.phone_number}</td>
          </tr>
          <tr class="relative">
          <td>Category</td>
          <td>${userInvoice.category}</td>
          </tr>
          <tr class="relative">
          <td>Tax to File</td>
          <td>${userInvoice.tax_to_file}</td>
          </tr>
              `;
      if (userInvoice.category === "individual") {
        addd += `
          <tr class="relative">
          <td>Form assessment upload</td>
          <td>${userInvoice.form_assessment_upload}</td>
          </tr>
          <tr class="relative">
          <td>Tax Income Upload</td>
          <td>${userInvoice.tax_income_upload}</td>
          </tr>
          <tr class="relative">
            <td>Evidence of Tax Payment</td>
            <td>${userInvoice.evidence_of_tax_payment} o</td>
          </tr>
                
                `;
      } else {
        addd += `
            <tr class="relative">
              <td>Form assessment upload</td>
              <td><a href="${userInvoice.form_assessment_upload}">${userInvoice.form_assessment_upload}</a></td>
            </tr>
            <tr class="relative">
              <td>Tax Income Upload</td>
              <td><a href="${userInvoice.tax_income_upload}">${userInvoice.tax_income_upload}</a></td>
            </tr>
            <tr class="relative">
              <td>Evidence of Tax Payment</td>
              <td><a href="${userInvoice.evidence_of_tax_payment}">${userInvoice.evidence_of_tax_payment}</a></td>
            </tr>
            <tr class="relative">
              <td>Form HI</td>
              <td><a href="${userInvoice.form_upload_4}">${userInvoice.form_upload_4}</a></td>
            </tr>
            <tr class="relative">
              <td>Schedule of Tax Deduction</td>
              <td><a href="${userInvoice.form_upload_5}">${userInvoice.form_upload_5}</a></td>
            </tr>  
          `;
      }
      $("#showdetails").append(addd);
      if (userInvoice.application_status === "pending") {
        $("#showbtn").append(`
            <div class="text-center mb-2">
            <label for="" class="font-bold">Amount to be paid</label>
            <input type="text" class="form-control rounded-md w-72 mt-2" id="amount" placeholder="0.00">
        </div>
            <button class="button w-72" id="submitApp">Approve</button>
                  `);
      } else {
        $("#showbtn").append(`

                  `);
      }
    });
  } else {
    // $("#showInvoice").html("<tr></tr>");
    $("#dataTable").DataTable();
  }
}

fetchTaxfillers()



$("#submitApp").on("click", (e) => {

  let amount = document.querySelector("#amount").value
  console.log(amount);
  e.preventDefault()
  $("#msg_box").html(`
        <div class="flex justify-center items-center mt-4">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
      `)

  $("#submitApp").addClass("hidden")

  $.ajax({
    type: "GET",
    url: `${HOST}/?approveTaxFiling&id=${userIdo}&amount=${amount}`,
    dataType: 'json',
    success: function (data) {
      if (data.status === 2) {
        $("#msg_box4").html(`
              <p class="text-warning text-center mt-4 text-lg">${data.message}</p>
            `)
        $("#submitApp").removeClass("hidden")

      } else if (data.status === 1) {
        $("#msg_box").html(`
              <p class="text-success text-center mt-4 text-lg">Approved Successfully</p>
            `)
        setTimeout(() => {
          window.location.href = "./service.html"
        }, 1000);

      } else if (data.status === 0) {
        $("#msg_box").html(`
              <p class="text-warning text-center mt-4 text-base">${data.message}</p>
            `)
        $("#submitApp").removeClass("hidden")
      }
    },
    error: function (request, error) {
      console.log(error);
      $("#msg_box").html(`
            <p class="text-danger text-center mt-4 text-lg">Something went wrong try again !</p>
          `)
      $("#submitApp").removeClass("hidden")
    }
  });

})

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
    data: { tax_number: userTaxnumber },
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