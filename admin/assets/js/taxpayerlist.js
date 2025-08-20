const urlParams = new URLSearchParams(window.location.search);
const userIdo = urlParams.get("id");

const enumerated = urlParams.get("enumerated");
let userrrData = {};

async function getTaxPayer() {
  try {
    const response = await fetch(`${HOST}/?userProfile&id=${userIdo}`);
    const data = await response.json();
    localStorage.setItem("singleUser", JSON.stringify(data.user));
    let taxPayerData = data.user;
    userrrData = taxPayerData;
    // console.log(taxPayerData)
    let theimg = taxPayerData.img;
    if (theimg === "") {
      theimg = "./assets/img/avatars/1.png";
    }
    $("#userInfo").html(`
        <div class="flex gap-x-2">
        <img src="${theimg}" class="h-[70px] w-[70px] object-cover rounded-full" />
        <div class="mt-2">
        <h6 class="font-bold text-[20px]">${taxPayerData.first_name} ${taxPayerData.surname
      }</h6>
        <p><span class="font-bold">Payer ID:</span> ${taxPayerData.tax_number
      }</p>
        </div>
        </div>
           
            <div class="flex flex-wrap gap-x-5 gap-y-3 mt-2">
              <p><span class="font-bold">Category:</span> ${taxPayerData.category
      }</p>
              <p><span class="font-bold">State:</span> ${taxPayerData.state}</p>
              <p><span class="font-bold">LGA:</span> ${taxPayerData.lga}</p>
              <p><span class="font-bold">Address:</span> ${taxPayerData.address
      }</p>
              <p><span class="font-bold">Email address:</span> ${taxPayerData.email
      }</p>
              <p><span class="font-bold">Contact:</span> ${taxPayerData.phone
      }</p>
              <p><span class="font-bold">Tin Status:</span> ${taxPayerData.tin_status
      }</p>
              <p><span class="font-bold">Tax Number:</span> ${taxPayerData.tin == "" ? "-" : taxPayerData.tin
      }</p>
              <p><span class="font-bold">Business Type:</span> ${taxPayerData.business_type == ""
        ? "-"
        : taxPayerData.business_type
      }</p>
              <p><span class="font-bold">Employment Status:</span> ${taxPayerData.employment_status == ""
        ? "-"
        : taxPayerData.employment_status
      }</p>
              <p><span class="font-bold">Number of Staff:</span> ${taxPayerData.number_of_staff == ""
        ? "-"
        : taxPayerData.number_of_staff
      }</p>
            </div>

        
        `);
  } catch (error) {
    console.log(error);
  }
}

async function getTaxPayer2() {
  try {
    const response = await fetch(`${HOST}/?getEnumerationTaxPayer`);
    const data = await response.json();

    let taxPayerData = data.message.find((dd) => dd.userIdo === userIdo);
    userrrData = taxPayerData;
    // console.log(taxPayerData)
    let theimg = taxPayerData.img;
    if (theimg === "") {
      theimg = "./assets/img/avatars/1.png";
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

        
        `);
  } catch (error) {
    console.log(error);
  }
}

if (enumerated) {
  getTaxPayer2().then((thee) => {
    getTaxesCateg().then((res) => {
      $(".dataTable").DataTable();
      $(".dataTable2").DataTable();



    });
  });
} else {
  getTaxPayer().then((thee) => {
    getTaxesCateg().then((res) => {
      $(".dataTable").DataTable();
      $(".dataTable2").DataTable();
    });
  });
}

function exportTablee(element, thetable) {
  $("#" + element).tableHTMLExport({
    // csv, txt, json, pdf
    type: "csv",
    // file name
    filename: "report.csv",
  });
}

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
                  <th></th>
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
                    <td><input class="form-check-input taxChecksDemand" data-thedueamount="${item.amount}" data-thename="${item.revenue_head}" data-theidd="${item.revenue_head_id}" type="checkbox"></td></td>
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

$("#generateInvoiceBtnDemand").on("click", function () {
  let allSelected = document.querySelectorAll(".taxChecksDemand");
  let theArray = [];
  allSelected.forEach((slt) => {
    if (slt.checked) {
      theArray.push({
        id: slt.dataset.theidd,
        revenueHead: slt.dataset.thename,
        revenueAmount: slt.dataset.thedueamount
      });
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
      title: 'Generating Demand Notice',
      text: 'Please wait while we generate your demand notice.',
      icon: 'info',
      confirmButtonText: 'Generate Demand Notice',
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
        return `
                  <tr>
                    <td>${id.revenueHead}</td>
                    <td>
                      <input type="number" min="0" class="swal2-inpt form-control" id="swal-input-price-${id.id}" value="${id.revenueAmount}" placeholder="${id.revenueAmount}" readonly>
                    </td>
                  </tr>
                `;
      }).join('')}
            </tbody>
          </table>
        </div>
      `,
      preConfirm: async () => {
        let revArray = []
        let prices = theArray.map(id => {
          revArray.push(id.id)
          const val = document.getElementById(`swal-input-price-${id.id}`).value;
          return val ? val : '';
        });
        if (prices.some(p => !p || isNaN(p) || Number(p) <= 0)) {
          Swal.showValidationMessage('Please enter a valid amount for each selected tax.');
          return false;
        }
        try {
          const response = await fetch(`${HOST}?generateSingleInvoices&tax_number=${userIdo}&revenue_head_id=${revArray.join(",")}&price=${prices.join(",")}&business_type=${userrrData.business_type}&zonalOffice=8&lga=Not Assigned&invoice_type=demand notice`);
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
          title: 'Demand Notice Generated Successfully!',
          text: `Your demand notice number is ${result.value.invoice_number}.`,
          confirmButtonText: 'Open Demand Notice',
          confirmButtonColor: '#015826',
        }).then((result3) => {
          if (result3.isConfirmed) {
            window.location.href = `./viewinvoice.html?invnumber=${result.value.invoice_number}&load=true`;
          }
        });
      }
    });
  }



})

displayApplicableTaxes(userIdo);

async function getTaxesCateg() {
  const response = await fetch(`${HOST}?getAllRevenueHeads`);
  const revenueHeads = await response.json();

  // console.log(revenueHeads)

  let ii = 0;

  revenueHeads.message.forEach((revenuehead, i) => {
    $("#showAllTaxes").append(`
      <tr>
        <td>
          <div class="form-check">
            <input class="form-check-input revenue-checkbox" type="checkbox" value="" id="${revenuehead.id}">
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
    `);
  });
};

$(document).ready(function () {
  const assignTaxBtn = $('#assign-tax');

  // Tax payer information
  const taxPayerInfo = {
    tax_number: userIdo,
    assigned_by: userInfo2?.id
  };

  // Assign tax button click handler
  assignTaxBtn.on('click', async function () {
    const checkboxes = $('.revenue-checkbox');

    const selectedRevenues = checkboxes.filter(':checked').map(function () {
      return $(this).attr('id');
    }).get();

    if (selectedRevenues.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Selection',
        text: 'Please select at least one revenue head to assign.',
        confirmButtonColor: '#0d6efd'
      });
      return;
    }

    // Disable button during processing
    assignTaxBtn.prop('disabled', true);
    assignTaxBtn.text('Processing...');

    try {
      let successCount = 0;
      let errorCount = 0;
      const errorMessages = [];

      // Process each selected revenue head
      for (const revenueId of selectedRevenues) {
        const payload = {
          endpoint: "assignTaxToPayer",
          data: {
            tax_number: taxPayerInfo.tax_number,
            revenue_head_id: parseInt(revenueId),
            assigned_by: taxPayerInfo.assigned_by,
            remarks: "Assigned based on new compliance review"
          }
        };

        try {
          const response = await callAssignTaxApi(payload);

          if (response.status === 1) {
            successCount++;
          } else {
            errorCount++;
            errorMessages.push({
              revenueId: revenueId,
              message: response.error || 'Unknown error'
            });
          }
        } catch (error) {
          errorCount++;
          errorMessages.push({
            revenueId: revenueId,
            message: error.message || 'API call failed'
          });
        }
      }

      // Show summary alert
      if (errorCount === 0) {
        await Swal.fire({
          icon: 'success',
          title: 'Success',
          html: `All ${successCount} tax assignments completed successfully!`,
          confirmButtonColor: '#0d6efd'
        });
      } else if (successCount === 0) {
        let errorList = errorMessages.map(e =>
          `<li>Revenue ID ${e.revenueId}: ${e.message}</li>`
        ).join('');

        await Swal.fire({
          icon: 'error',
          title: 'All Assignments Failed',
          html: `<p>No taxes were assigned successfully. Errors:</p><ul>${errorList}</ul>`,
          confirmButtonColor: '#0d6efd'
        });
      } else {
        let errorList = errorMessages.map(e =>
          `<li>Revenue ID ${e.revenueId}: ${e.message}</li>`
        ).join('');

        await Swal.fire({
          icon: 'warning',
          title: 'Partial Success',
          html: `
                                <p>${successCount} tax assignments succeeded, ${errorCount} failed.</p>
                                <p>Errors:</p>
                                <ul>${errorList}</ul>
                            `,
          confirmButtonColor: '#0d6efd'
        });
      }

      // Clear selections
      checkboxes.prop('checked', false);

    } catch (error) {
      console.error('Unexpected error:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An unexpected error occurred. Please try again.',
        confirmButtonColor: '#0d6efd'
      });
    } finally {
      assignTaxBtn.prop('disabled', false);
      assignTaxBtn.text('Assign Tax');
    }
  });

  // API call function using jQuery
  function callAssignTaxApi(payload) {
    return new Promise((resolve, reject) => {
      // Mock API response - replace with actual AJAX call
      setTimeout(() => {
        // Simulate different responses
        const randomResponse = Math.random() > 0.3 ?
          { status: 1, message: "Tax successfully assigned to taxpayer." } :
          { status: 0, error: "Duplicate entry: this tax has already been assigned to this taxpayer." };

        resolve(randomResponse);


        // Actual AJAX call would look like:
        $.ajax({
          url: HOST,
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(payload),
          success: function (response) {
            resolve(response);
          },
          error: function (xhr, status, error) {
            reject(new Error(error || 'API call failed'));
          }
        });

      }, 800);
    });
  }
});

async function assignedTaxesBody() {
  try {
    const response = await fetch(`${HOST}?fetchAssignedTaxesByTaxNumber&tax_number=${userIdo}`);
    const theassignData = await response.json();

    theassignData.data.forEach((item, i) => {
      $("#assignedTaxesBody").append(`
        <tr>
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
  $("#dataTable5").DataTable()
})

async function getAnalytics() {
  try {
    let userInfo = JSON.parse(localStorage.getItem("singleUser"));
    const userTax = userInfo.tax_number;
    let cat = "Payer User";
    const response = await fetch(
      `${HOST}?inAppNotification&user_id=${userIdo}`
    );
    const data = await response.json();
    console.log(data);
    if (data.status === 0) {
      $("#ActivityLogs").html(``);
    } else {
      // <button class="text-[#005826] text-[12px] underline underline-offset-1">clear</button>

      data.message.forEach((notification, i) => {
        $("#ActivityLogs").append(`
        <tr>
          <td>${notification.timeIn}</td>
          <td>${notification.comment}</td>
        </tr>
      `);
      });
    }
  } catch (error) {
    console.log(error);
  }
}

getAnalytics().then((ee) => {
  $("#dataTable77").DataTable();
});


