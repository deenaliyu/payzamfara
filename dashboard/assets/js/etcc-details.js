const urlParams = new URLSearchParams(window.location.search);
const theid = urlParams.get('theid');
const level = urlParams.get('level');
const thpayer_id = urlParams.get('payer_id');

let userInfo = JSON.parse(window.localStorage.getItem("userDataPrime"));
// userInfo.tax_number
const currentPageURL = window.location.href;

function formatMoney(amount) {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'NGN', // Change this to your desired currency code
    minimumFractionDigits: 2,
  });
}



async function getEtccDetails() {
  const response = await fetch(`${HOST}/?getETCC&type=ref&id=${theid}`)
  const etccDetail = await response.json()

  $("#loader").css("display", "none")

  console.log(etccDetail)
  if (etccDetail.status === 0) {

  } else {

    let theEtcDetail = etccDetail.message[0]

    let allInputs = document.querySelectorAll(".enumInput")

    allInputs.forEach((inpt, i) => {
      inpt.value = theEtcDetail[inpt.dataset.name]
    })

    if (theEtcDetail.app_status === "Declined") {
      $("#deciders").html(``)

      $("#etcDetails").html(`
        <div class="mb-4">
          <h4 class="mb-2 fontBold">Reason for Declining</h4>  
          <textarea id="theTexto" type="text" class="form-control" readonly></textarea>
        </div>
      `)

      $("#theTexto").val(theEtcDetail.decline_reason)
    } else if (theEtcDetail.app_status === "Accepted") {
      $("#deciders").html(`
    `)
    } else {
      $("#deciders").html(`
       <div id="decider" class="mt-5">
          <button class="button" id="theApprBtn" type="button" onclick="aprovethis()">Approve
            Request</button>
        </div>

        <div id="decider2" class="mt-5">
          <button class="btn btn-danger" id="theApprBtn2" type="button" onclick="declineThis()">Decline Request</button>
        </div>
      `)
    }
  }
}

getEtccDetails()

function viewDocument(theElement) {
  let thecall = $(`[data-name="${theElement}"]`).val()
  console.log(thecall)
  window.open(thecall, '_blank')
}

async function fetchPayment() {

  const response = await fetch(
    `${HOST}/php/index.php?fetchPayment&user_id=${userInfo?.tax_number}`
  );
  const userInvoices = await response.json();

  if (userInvoices.status === 1) {

    userInvoices.message.reverse().forEach((userInvoice, i) => {
      $("#showPayment").append(`
        <tr>
          <td>${i + 1}</td>
          <td>${userInvoice.user_id}</td>
          <td>${userInvoice.payment_reference_number}</td>
          <td>${userInvoice["COL_4"]}</td>
          <td>${formatMoney(userInvoice.amount_paid)}</td>
          <td>${userInvoice.payment_channel}</td>
          <td>${userInvoice.timeIn}</td>
          <td><span class="badge bg-success">paid</span></td>
          <td>
          <a href="../viewreceipt.html?invnumber=${userInvoice.invoice_number}&load=true" target="_blank"><iconify-icon class="text-xl" icon="material-symbols:download"></iconify-icon></a>
          </td>
        </tr>
      `);
    });

  }
}

fetchPayment().then(rr => {
  $("#dataTable").DataTable();
})

function aprovethis() {
  if (level == "3") {
    theVerify(4)

  } else if (level == "4") {
    theVerify(5)
  } else if (level == "5") {

    theVerify(1)
  }
}



async function theVerify(thelvl) {
  $("#theApprBtn").addClass("hidden")
  $("#msg_boxx").html(`
    <div class="flex justify-center items-center mb-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)

  try {
    const response = await fetch(`${HOST}/?updateETCC&id=${theid}&set=${thelvl}`)
    const etccDetail = await response.json()

    if (etccDetail.status === 1) {
      Swal.fire({
        title: 'Approved',
        text: "Approved successfully",
        icon: 'success',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ok',
        allowOutsideClick: false
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = `./etcc-management.html`
        }
      });
    }
  } catch (error) {
    console.log(error)
    $("#theApprBtn").removeClass("hidden")
    $("#msg_boxx").html('<p class="text-danger">Something went wrong</p>')
  }
}
async function declineThis() {
  const { value: reason } = await Swal.fire({
    title: 'Decline Request',
    input: 'textarea',
    inputLabel: 'Reason for declining',
    inputPlaceholder: 'Enter your reason here...',
    inputAttributes: {
      'aria-label': 'Enter your reason here'
    },
    showCancelButton: true,
    confirmButtonText: 'Submit',
    cancelButtonText: 'Cancel',
    inputValidator: (value) => {
      if (!value) {
        return 'You need to provide a reason!'
      }
    }
  });

  if (reason) {
    $("#theApprBtn2").addClass("hidden");
    $("#msg_boxx").html(`
      <div class="flex justify-center items-center mb-4">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    `);

    try {
      const response = await fetch(`${HOST}/?updateETCC&id=${theid}&set=2&decline_reason=${encodeURIComponent(reason)}`);
      const etccDetail = await response.json();

      if (etccDetail.status === 1) {
        Swal.fire({
          title: 'Declined',
          text: "Request declined successfully",
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Ok',
          allowOutsideClick: false
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = `./etcc-management.html`;
          }
        });
      }
    } catch (error) {
      console.log(error);
      $("#theApprBtn2").removeClass("hidden");
      $("#msg_boxx").html('<p class="text-danger">Something went wrong</p>');
    }
  }
}



async function unapprove() {
  $("#theApprBtn").addClass("hidden")
  $("#msg_boxx").html(`
    <div class="flex justify-center items-center mb-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)
  try {
    const response = await fetch(`${HOST}/?updateETCC&id=${theid}&set=1`)
    const etccDetail = await response.json()

    if (etccDetail.status === 1) {
      alert("success")
      window.location.href = `./etcc-management.html`

    }
  } catch (error) {
    console.log(error)
  }

}

async function fetchPayment() {
  // $("#showInvoice").html("");
  $("#loader").css("display", "flex");

  const response = await fetch(
    `${HOST}/php/index.php?fetchPayment&user_id=${thpayer_id}`
  );
  const userInvoices = await response.json();
  // console.log(userInvoices);
  $("#loader").css("display", "none");
  if (userInvoices.status === 1) {
    for (let i = 0; i < userInvoices.message.length; i++) {
      const userInvoice = userInvoices.message[i];
      $("#paymentTable").append(`
        <tr>
          <td>${i + 1}</td>
          <td>${userInvoice.user_id}</td>
          <td>${userInvoice.payment_reference_number}</td>
          <td>${userInvoice["COL_4"]}</td>
          <td>&#8358;${userInvoice.amount_paid}</td>
          <td>${userInvoice.payment_channel}</td>
          <td>${userInvoice.timeIn}</td>
          <td><span class="badge bg-success">paid</span></td>
          <td>
          <a href="../viewreceipt.html?invnumber=${userInvoice.invoice_number}&load=true" target="_blank" class="btn btn-primary btn-sm viewUser" >View Receipt</a>
          </td>
        </tr>

        `);

      if (i === 4) {
        break;
      }
    }
  } else {
    // $("#showInvoice").html("<tr></tr>");
    $("#dataTable").DataTable();
  }
}

fetchPayment().then(rr => {
  $("#dataTable").DataTable();
})