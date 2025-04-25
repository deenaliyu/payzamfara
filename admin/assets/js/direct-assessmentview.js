// Extract ID and levels from the URL
const urlParams = new URLSearchParams(window.location.search);
const assid = urlParams.get('id');
const levels = urlParams.get('levels');

const thedetailss = null

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
  try {
    const payload = {
      id,
      set: status
    };
    const response = await fetch(`${HOST}/updateDirectAsststatus`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Failed to update status');
    const data = await response.json();
    console.log('Status Update Response:', data);

    if (thenextstat === "Approval") {
      Swal.fire({
        icon: 'success',
        title: 'Status Updated',
        text: 'The status has been successfully updated.',
        confirmButtonText: 'Generate Invoice',
        showCancelButton: true,
        cancelButtonText: 'Close'
      }).then((result) => {
        if (result.isConfirmed) {
          // Logic to generate the invoice
          generateInvoiceNum(detailss.tax_number, detailss.monthly_tax_payable);
        }
      });
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Status Updated',
        text: 'The status has been successfully updated.',
        confirmButtonText: 'OK'
      });
    }


  } catch (error) {
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
    thenextstat = "Second reviewer"
  } else if (levels === "S") {
    thenextstat = "Third reviewer"
  } else if (levels === "T") {
    thenextstat = "Approval"
  }

  await updateStatus(assid, thenextstat);
});

async function declineStatus(id) {
  try {
    const payload = {
      id,
      set: "Disapproved"
    };
    const response = await fetch(`${HOST}/updateDirectAsststatus`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Failed to update status');
    const data = await response.json();
    console.log('Status Update Response:', data);


    Swal.fire({
      icon: 'success',
      title: 'Status Updated',
      text: 'The status has been successfully updated.',
      confirmButtonText: 'OK'
    });


  } catch (error) {
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
    await declineStatus(id);
  } else {
    alert('Decline reason is required');
  }
});



async function generateInvoiceNum(taxNumber, amountCal) {
  let timer;

  // Start a timer that triggers after 15 seconds
  timer = setTimeout(() => {
    Swal.fire({
      title: 'Please Check Your Email',
      text: "The invoice is being generated. Please check your email for the generated invoice.",
      icon: 'info',
      confirmButtonColor: '#3085d6',
      allowOutsideClick: false
    });
    $("#generating_inv").removeClass("hidden");
  }, 15000);

  // let category_pre = $("#category_pre").val();
  // let sectorSelect = $("#sectorSelect").val();
  // let industrySelect = $("#industrySelect").val();

  // let sectorAndIndustry = `${sectorSelect} - ${industrySelect}`;
  // let descriptionVal = $("#description").val();

  $.ajax({
    type: "GET",
    url: `${HOST}?generateSingleInvoices&tax_number=${taxNumber}&revenue_head_id=328&price=${amountCal}&category_pre=Formal&sector=sector&description=description&invoice_type=direct`,
    dataType: 'json',
    success: function (data) {
      clearTimeout(timer); // Clear the timer if the request succeeds

      // console.log(data);
      if (data.status === 2) {
        // Handle status 2
      } else if (data.status === 1) {
        $("#generating_inv").removeClass("hidden");
        $("#msg_box").html(``);
        Swal.fire({
          title: 'Generated',
          text: "Direct Assessment has been generated successfully. Assessment Details will be sent to your mail and phone number. Check your spam junk folder if you can't find the mail.",
          icon: 'success',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Open Assessment',
          allowOutsideClick: false
        }).then((result) => {
          if (result.isConfirmed) {
            nextPrev(1);
            openInvoice(data.invoice_number, data.price);
            // window.location.href = `invoice.html?invnum=${data.invoice_number}`
          }
        });
      }
    },
    error: function (request, error) {
      clearTimeout(timer); // Clear the timer if the request fails

      $("#msg_box").html(`
              <p class="text-danger text-center mt-4 text-lg">Something went wrong, Try again.</p>
            `);
      $("#generating_inv").removeClass("hidden");
      console.log(error);
    }
  });

}