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
    const response = await fetch(`${HOST}?getAllDirectAssessmentss&id=${id}`);
    if (!response.ok) throw new Error('Failed to fetch user details');
    const data = await response.json();

    let detailss = data.data.direct_assessments[0]

    thedetailss = detailss

    $("#payerId").text(detailss.tax_number);
    $("#nameo").text(detailss.fullname);
    $("#thestatus").text(detailss.level);
    $("#date_created").text(detailss.created_date);
    $("#annual_gross").text(formatMoney(detailss.annual_gross_income));
    $("#consolidated_tax").text(formatMoney(detailss.consolidated_relief));
    $("#taxable_income").text(formatMoney(detailss.chargeable_income));

    $("#monthly_liability").text(formatMoney(detailss.monthly_tax_payable));
    $("#annual_liability").text(formatMoney(parseFloat(detailss.monthly_tax_payable) * 12));



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

    const response = await fetch(`${HOST}?updateDirectAsststatus&id=${assid}&set=${status}`);
    if (!response.ok) throw new Error('Failed to update status');
    const data = await response.json();
    // console.log('Status Update Response:', data);

    $("#approveButton").prop('disabled', false)
      .html(
        `<iconify-icon icon="mdi:approve" class="me-2"></iconify-icon> <span>Approve</span>`
      );

    if (data.status === 1) {
      if (status === "4") {
        Swal.fire({
          icon: 'success',
          title: 'Status Updated',
          text: 'The status has been successfully updated.',
          confirmButtonText: 'Generate Invoice',
          showCancelButton: false,
        }).then((result) => {
          if (result.isConfirmed) {
            // Logic to generate the invoice
            generateInvoiceNum(thedetailss.tax_number, thedetailss.monthly_tax_payable);
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
            window.location.href = "direct-assessment.html";
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
    // thenextstat = "3"
    thenextstat = "4"
  } else if (levels === "T") {
    thenextstat = "4"
  }

  await updateStatus(assid, thenextstat);
});

async function declineStatus(id, reason) {
  $("#disapproveButton").prop('disabled', false)
    .html(
      `Declining...`
    );
  try {

    const response = await fetch(`${HOST}?updateDirectAsststatus&id=${assid}&set=5&reason=${reason}`);
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
          window.location.href = "direct-assessment.html";
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

function generateInvoiceNum(taxNumber, amountCal) {
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

        const response = await fetch(
          `${HOST}?generateSingleInvoices&tax_number=${taxNumber}&revenue_head_id=1343&price=${amountCal}&category_pre=Formal&zonalOffice=8&lga=Not Assigned&sector=sector&description=description&invoice_type=direct`
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
    if (result.isConfirmed) {
      Swal.fire({
        icon: "success",
        title: `Invoice Generated successfully!`,
        confirmButtonText: "Go to Direct Assessment Invoices",
      }).then((result3) => {
        if (result3.isConfirmed) {
          window.location.href = `./direct-invoices.html`;
        }
      });
    }
  });


}
