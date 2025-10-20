// Extract ID and levels from the URL
const urlParams = new URLSearchParams(window.location.search);
const assid = urlParams.get('id');
const levels = urlParams.get('level');

if (levels === "A" || levels === "D") {
  $("#approveButtons").remove("")
}

let thedetailss = null

function formatMoney(amount) {
  return parseFloat(amount).toLocaleString('en-US', {
    style: 'currency',
    currency: 'NGN', // Change this to your desired currency code
    minimumFractionDigits: 2,
  });
}


// Function to fetch user details by ID
async function fetchUserDetailsById(id) {
  try {
    const response = await fetch(`${HOST}?getAllPresumptiveAssessments&id=${id}`);
    if (!response.ok) throw new Error('Failed to fetch user details');
    const data = await response.json();

    let detailss = data.data.presumptive_assessments[0]

    thedetailss = detailss

    $("#payerId").text(detailss.tax_number);
    $("#nameo").text(detailss.fullname);
    $("#emailo").text(detailss.email);
    $("#phonenumber").text(detailss.phone);
    $("#thestatus").text(detailss.level);
    $("#business_type").text(detailss.type_of_business || "N/A");
    $("#date_created").text(detailss.created_at);
    $("#tax_liability").text(formatMoney(detailss.tax_liability));
    $("#bpr_value").text(formatMoney(detailss.bpr_value || 0));
    $("#development_levy_value").text(formatMoney(detailss.development_levy_value || 0));



    return data;
  } catch (error) {
    console.error(error);
    alert('Error fetching user details');
  }
}

fetchUserDetailsById(assid)

// Function to update status
async function updateStatus(id, status) {
  $("#approveButton").prop('disabled', true)
    .html(
      'Approving'
    );
  try {

    const response = await fetch(`${HOST}?updatePresumptiveStatus&id=${assid}&set=${status}`);
    if (!response.ok) throw new Error('Failed to update status');
    const data = await response.json();
    // console.log('Status Update Response:', data);

    $("#approveButton").prop('disabled', false)
      .html(
        `<iconify-icon icon="mdi:approve" class="me-2"></iconify-icon> <span>Approve</span>`
      );

    if (data.status === 1) {
      if (status === "3") {
        Swal.fire({
          icon: 'success',
          title: 'Status Updated',
          text: 'The status has been successfully updated.',
          confirmButtonText: 'Generate Invoice',
          showCancelButton: false,
        }).then((result) => {
          if (result.isConfirmed) {
            // Logic to generate the invoice
            if (thedetailss.invoice_number) {
              updateInvoice(thedetailss.invoice_number);
            } else {
              generateInvoiceNum(thedetailss.tax_number, parseFloat(thedetailss.monthly_tax_payable) * 12);
            }
          }
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Status Updated',
          text: 'The status has been successfully updated.',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "presumptive-tax-assessment.html";
          }
        });
      }
    } else {
      throw new Error('Failed to update status');
    }




  } catch (error) {
    $("#approveButton").prop('disabled', false)
      .html(
        `<iconify-icon icon="mdi:approve" class="me-2"></iconify-icon> <span>Approve</span>`
      );
    console.error(error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to update the status. Please try again later.',
      confirmButtonText: 'OK'
    });
  }
}

// Event listener for approve button
document.getElementById('approveButton').addEventListener('click', async function () {
  let thenextstat = ""

  if (levels === "F") {
    thenextstat = "2"
  } else if (levels === "S") {
    thenextstat = "3"
  }

  await updateStatus(assid, thenextstat);
});

async function declineStatus(id, reason) {
  $("#disapproveButton").prop('disabled', false)
    .html(
      `Declining...`
    );
  try {

    const response = await fetch(`${HOST}?updatePresumptiveStatus&id=${assid}&set=4&reason=${reason}`);
    if (!response.ok) throw new Error('Failed to update status');

    $("#disapproveButton").prop('disabled', false)
      .html(
        `<iconify-icon icon="carbon:close-outline" class="me-2"></iconify-icon> <span>Decline</span>`
      );
    const data = await response.json();

    if (data.status === 1) {
      Swal.fire({
        icon: 'success',
        title: 'Status Updated',
        text: 'The status has been successfully updated.',
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "presumptive-tax-assessment.html";
        }
      });

    } else {
      throw new Error('Failed to update status');
    }


  } catch (error) {
    $("#disapproveButton").prop('disabled', false)
      .html(
        `<iconify-icon icon="carbon:close-outline" class="me-2"></iconify-icon> <span>Decline</span>`
      );
    console.error(error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to update the status. Please try again later.',
      confirmButtonText: 'OK'
    });
  }
}
// Event listener for disapprove button
document.getElementById('disapproveButton').addEventListener('click', async function () {
  const { value: reason } = await Swal.fire({
    title: 'Reason for Declining',
    input: 'textarea',
    inputPlaceholder: 'Enter your reason here...',
    showCancelButton: true,
  });
  if (reason) {
    await declineStatus(assid, reason);
  } else {
    alert('Decline reason is required');
  }
});

function updateInvoice(invoice_number) {
  Swal.fire({
    title: "Confirm Invoice Reassessment",
    text: "Are you sure you want to update this invoice?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Update Invoice",
    showLoaderOnConfirm: true,
    preConfirm: async () => {
      try {
        const response = await fetch(`${HOST}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            endpoint: "updateInvoice",
            data: { invoice_number }
          })
        });
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const result = await response.json();
        if (result.status !== 1) {
          throw new Error("Failed to update invoice");
        }
        return result;
      } catch (error) {
        Swal.showValidationMessage(`Request failed: ${error}`);
      }
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        icon: "success",
        title: "Invoice Updated Successfully!",
        confirmButtonText: "Go to Presumptive Tax Invoices",
      }).then((result2) => {
        if (result2.isConfirmed) {
          window.location.href = "./presumptive-tax.html";
        }
      });
    }
  });
}

function generateInvoiceNum(taxNumber) {

  let dataToSendOut = {
    generateSingleInvoices: true,
    tax_number: taxNumber,
    description: thedetailss.description || "N/A",
    invoice_type: "presumptive",
    category_pre: thedetailss.category,
    created_by: "admin",
    by_account: userInfo2?.id || null,
    zonalOffice: 8,
    lga: "Not Assigned" // <-- Required
  };

  let revenueIds = [1340];
  let prices = [thedetailss.tax_liability];

  if (thedetailss.development_levy_enabled === "1") {
    revenueIds.push(800);
    prices.push(thedetailss.development_levy_value);
  }
  if (thedetailss.development_levy_enabled === "1") {
    revenueIds.push(thedetailss.bpr_revenue_head_id);
    prices.push(thedetailss.bpr_value);
  }

  dataToSendOut.revenue_head_id = revenueIds.join(",");
  dataToSendOut.price = prices.join(",");

  // console.log(dataToSendOut);

  Swal.fire({
    title: "Generating Invoice",
    icon: "info",
    backdrop: true,
    allowOutsideClick: false,
    showCancelButton: false,
    confirmButtonText: "Generate Invoice",
    showLoaderOnConfirm: true,
    preConfirm: async () => {
      try {

        const response = await fetch(`${HOST}?${new URLSearchParams(dataToSendOut)}`);
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const invoiceData = await response.json();
        console.log(invoiceData);
        if (invoiceData.status === 1 && invoiceData.invoice_number) {
          // Link invoice to direct assessment
          await fetch(`${HOST}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              endpoint: "updatePresumptiveInvoiceNumber",
              data: {
                id: thedetailss.id,
                invoice_number: invoiceData.invoice_number
              }
            })
          });
        }
        return invoiceData;
      } catch (error) {
        Swal.showValidationMessage(`Request failed: ${error}`);
      }
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        icon: "success",
        title: `Invoice Generated successfully!`,
        confirmButtonText: "Go to Presumptive Tax Invoices",
      }).then((result3) => {
        if (result3.isConfirmed) {
          window.location.href = `./presumptive-tax.html`;
        }
      });
    }
  });


}
