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
    const response = await fetch(`${HOST}?getPayeeAssessment&id=${id}`);
    if (!response.ok) throw new Error('Failed to fetch user details');
    const data = await response.json();

    let detailss = data.message[0]
    thedetailss = detailss
    $("#payerId").text(detailss.tax_number);
    $("#nameo").text(detailss.first_name);
    $("#thestatus").text(detailss.status);
    $("#date_created").text(detailss.time_in);

    let totalStaffAmounts = 0;
    detailss.staff_details.forEach(stf => totalStaffAmounts += parseFloat(stf.monthly));
    $("#totalPayableAmt").text(formatMoney(totalStaffAmounts));
    // Populate the staffListInvoices table
    const staffListInvoices = $("#staffListInvoices");
    staffListInvoices.empty(); // Clear any existing rows

    detailss.staff_details.forEach((staff, index) => {
      const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${staff.fullname}</td>
        <td>${formatMoney(staff.annual_gross_income)}</td>
        <td>${formatMoney(staff.basic_salary)}</td>
        <td>${formatMoney(staff.monthly * 12)}</td>
        <td>${formatMoney(staff.monthly)}</td>
        <td>${staff.timeIn}</td>
      </tr>

      `;
      staffListInvoices.append(row);
    });

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

    const response = await fetch(`${HOST}?updatePayeeAsststatus&id=${assid}&set=${status}`);
    if (!response.ok) throw new Error('Failed to update status');
    const data = await response.json();
    // console.log('Status Update Response:', data);

    $("#approveButton").prop('disabled', false)
      .html(
        `<iconify-icon icon="mdi:approve" class="me-2"></iconify-icon> <span>Approve</span>`
      );


    if (data.status === 1) {
      if (status === "1") {
        Swal.fire({
          icon: 'success',
          title: 'Status Updated',
          text: 'The status has been successfully updated.',
          confirmButtonText: 'Generate Invoice',
          showCancelButton: false,
        }).then((result) => {
          if (result.isConfirmed) {
            // Logic to generate the invoice
            let totalStaffAmounts = 0;
            thedetailss.staff_details.forEach((staff) => {
              totalStaffAmounts += parseFloat(staff.monthly);
            });

            // console.log(thedetailss.tax_number, totalStaffAmounts)
            generateInvoiceNum(thedetailss.tax_number, totalStaffAmounts, thedetailss.staff_id);
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
            window.location.href = "paye-assessments.html";
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
    thenextstat = "4"
  } else if (levels === "S") {
    // thenextstat = "5"
    thenextstat = "1"
  } else if (levels === "T") {
    thenextstat = "1"
  }

  await updateStatus(assid, thenextstat);
});

async function declineStatus(id, reason) {
  $("#disapproveButton").prop('disabled', false)
    .html(
      `Declining...`
    );
  try {

    const response = await fetch(`${HOST}?updatePayeeAsststatus&id=${assid}&set=2&reason=${reason}`);
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
          window.location.href = "paye-assessments.html";
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



function generateInvoiceNum(taxNumber, amountCal, staff_id) {
  Swal.fire({
    title: "Generating Invoice",
    icon: "info",
    backdrop: true,
    allowOutsideClick: false,
    showCancelButton: true,
    confirmButtonText: "Generate Invoice",
    showLoaderOnConfirm: true,
    preConfirm: async () => {
      try {
        const response = await fetch(
          `${HOST}?generateSingleInvoices&tax_number=${taxNumber}&revenue_head_id=59&price=${amountCal}&category_pre=Formal&zonalOffice=8&lga=Not Assigned&sector=sector&description=description&invoice_type=invoice`
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
      registerEmployeesInvoice(amountCal, taxNumber, result.value.invoice_number, staff_id);
      Swal.fire({
        icon: "success",
        title: `Invoice Generated successfully!`,
        confirmButtonText: "Open Invoice",
      }).then((result3) => {
        if (result3.isConfirmed) {
          window.location.href = `./viewinvoice.html?invnumber=${result.value.invoice_number}&load=true`;
        }
      });
    }
  });

}


async function registerEmployeesInvoice(amount, payerID, invoice_num, staff_id) {
  let dataToSend = {
    endpoint: "registerPayeInvoiceStaff",
    data: {
      invoice_number: invoice_num,
      staff_id: staff_id,
      associated_special_user_id: payerID,
      monthly_tax_payable: amount,
    }
  }
  try {
    const response = await fetch(HOST, {
      method: "POST",
      body: JSON.stringify(dataToSend),
      headers: {
        "Content-Type": "application/json"
      }
    })
    const data = await response.json()
    console.log(data)

  } catch (error) {
    console.log(error)
  }
}