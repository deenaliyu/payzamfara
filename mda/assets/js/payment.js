let THEUSERINFO = JSON.parse(window.localStorage.getItem("mdaDataPrime"));

$("#makePayment").html(`
<p class="text-2xl fontBold text-center">Make Payment</p>
<p class="text-center">Select your preferred method</p>

<div class="flex items-center flex-wrap justify-center mt-4 gap-3 px-5">

  <div class="payCards active">
    <div class="flex justify-center">
      <iconify-icon icon="mdi:credit-card-fast" class="textPrimary"></iconify-icon>
    </div>
    <p class="text-center">Pay Cash</p>
  </div>

  <div class="payCards">
    <div class="flex justify-center">
      <iconify-icon icon="mdi:instant-transfer" class="textPrimary"></iconify-icon>
    </div>
    <p class="text-center">POS</p>
  </div>


</div>

<div id="tabcontainer" class="mt-10 mb-10">

  <div class="px-20 tab_steps active">
    <p class="fontBold text-center text-lg">Follow the steps below to make payment through cash.</p>
    <div class="flex justify-center mt-2">
      <img src="./assets/img/linebig.png" alt="">
    </div>

    <p class="text-[#555555] mt-3 text-center mb-3">After receiving the exact amount from the payer, proceed to generate the receipt</p>

    <div class="flex justify-center">
      <button class="button w-[60%] mt-3" id="createPayment" onclick="printReceipt('createPayment', 'msg_box')">Print Receipt</button>
    </div>
    <div id="msg_box"></div>
  </div>

  

  <div class="px-20 tab_steps">
    <p class="fontBold text-center text-lg">Follow the steps below to make payments through POS</p>
    <div class="flex justify-center mt-2">
      <img src="./assets/img/linebig.png" alt="">
    </div>

    <p class="text-[#555555] text-center mb-3 mt-3">Make payment through the POS machine. After it has been approved, print out the receipt and enter the receipt
    number below</p>

    <div class="mt-10">

      <div class="form-group">
        <label>Reference Number *</label>
        <input class="form-control"  />
      </div>
      <div class="flex justify-center">
        <button class="button w-[60%] mt-3" id="createPayment2" onclick="printReceipt('createPayment2', 'msg_box2')">Print Receipt</button>
      </div>

      <div id="msg_box2"></div>
      
    </div>
  </div>


</div>
`)

let payCards = document.querySelectorAll(".payCards")
let tab_steps = document.querySelectorAll(".tab_steps")
let invoiceDetails
if (payCards) {
  payCards.forEach((payCard, i) => {
    payCard.addEventListener("click", function () {
      payCards.forEach(dd => dd.classList.remove("active"))
      tab_steps.forEach(ff => ff.classList.remove("active"))
      payCard.classList.add("active")
      tab_steps[i].classList.add("active")
    })
  })
}

function continueReg() {
  let allInputs = document.querySelectorAll(".cashInputs")
  // check for empty fileds

  for (let i = 0; i < allInputs.length; i++) {
    const inpt = allInputs[i];

    if (inpt.required && inpt.value === "") {
      alert("Please fill all required fields")
      inpt.scrollIntoView()
      break;
    }

    if (i === allInputs.length - 1) {
      nextPrev(1)
    }
  }
}


function printReceipt(theIDd, theMsgBox) {
  $("#" + theMsgBox).html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)
  $("#" + theIDd).addClass("hidden")

  let allInputs = document.querySelectorAll(".cashInputs")
  let obj = {
    "endpoint": "createCashPayment",
    "data": {
      "mda_id": THEUSERINFO.mda_id,
      "user_id": THEUSERINFO.id,
    }
  }
  allInputs.forEach(allInput => {
    obj.data[allInput.dataset.name] = allInput.value
  })
  let stringedOBJ = JSON.stringify(obj)
  // console.log(stringedOBJ)

  $.ajax({
    type: "POST",
    url: HOST,
    dataType: 'json',
    data: stringedOBJ,
    success: function (data) {
      console.log(data)
      if (data.status === 2) {
        $("#" + theMsgBox).html(`
            <p class="text-warning text-center mt-4 text-lg">${data.message}</p>
          `)
        $("#" + theIDd).removeClass("hidden")

      } else if (data.status === 1) {
        $("#" + theMsgBox).html(`
            <p class="text-success text-center mt-4 text-lg">${data.message}</p>
          `)
        $("#" + theIDd).removeClass("hidden")

        openReceipt(data.data)

      } else {
        $("#" + theMsgBox).html(`
          <p class="text-danger text-center mt-4 text-lg">Something is wrong!</p>
        `)
        $("#" + theIDd).removeClass("hidden")
      }
    },
    error: function (request, error) {
      $("#" + theMsgBox).html(`
          <p class="text-danger text-center mt-4 text-lg">Something is wrong!</p>
        `)
      $("#" + theIDd).removeClass("hidden")
      console.log(error);
    }
  });

}

async function openReceipt(receiptData) {

  $("#receiptCard").html(`
      <div class="invoicetop"></div>

        <div class="flex px-6 pt-3 items-center justify-between">

          <h1 class="fontBold text-2xl">RECEIPT</h1>

          <div class="flex items-center gap-1">
            <img src="./assets/img/vector.png" alt="">
            <p class="text-2xl fontBold">98374952730</p>
          </div>

        </div>

        <div class="row px-6 gy-1 mt-4">
          <div class="col-sm-6">
            <div>
              <p class="text-gray-500">Name: <span class="fontBold text-[black]">${receiptData.first_name} ${receiptData.surname}</span></p>
            </div>
          </div>
          <div class="col-sm-6">
            <div>
              <p class="text-gray-500">Amount Due: <span class="fontBold text-[black]">N0</span></p>
            </div>
          </div>
          <div class="col-sm-6">
            <div>
              <p class="text-gray-500">Phone Number: <span class="fontBold text-[black]">${receiptData.phone}</span></p>
            </div>
          </div>
          <div class="col-sm-6">
            <div>
              <p class="text-gray-500">TIN: <span class="fontBold text-[black]">${receiptData.tin}</span></p>
            </div>
          </div>
          <div class="col-sm-6">
            <div>
              <p class="text-gray-500">MDA: <span class="fontBold text-[black]">AKIRS</span></p>
            </div>
          </div>
          <div class="col-sm-6">
            <div>
              <p class="text-gray-500">Revenue Head: <span class="fontBold text-[black]">${receiptData.revenue_head}</span></p>
            </div>
          </div>

          <div class="col-sm-6">
            <div>
              <p class="text-gray-500">Payment Received by: <span class="fontBold text-[black]">${receiptData.first_name} ${receiptData.surname}</span></p>
            </div>
          </div>
        </div>



        <table class="table table-borderless mt-4">
          <thead class="bgPrimary">
            <tr>
              <td class="text-[#fff] text-sm">Item Description</td>
              <td class="text-[#fff] text-sm">QTY</td>
              <td class="text-[#fff] text-sm">Price</td>
              <td class="text-[#fff] text-sm">Discount</td>
              <td class="text-[#fff] text-sm">Total</td>
            </tr>
          </thead>
  
          <tr class="border-b border-b border-[#6F6F84]">
            <td class="text-sm">${receiptData.revenue_head}</td>
            <td class="text-sm">1</td>
            <td class="text-sm">${thePrice}</td>
            <td class="text-sm"></td>
            <td class="text-sm">${thePrice}</td>
          </tr>
          <tr>
            <td class="text-[#555555] text-sm">Sub Total</td>
            <td></td>
            <td></td>
            <td class="text-[#000] text-sm">${thePrice}</td>
          </tr>
          <tr class="border-b border-b border-[#6F6F84]">
            <td class="text-[#555555] text-sm">Discount</td>
            <td></td>
            <td></td>
            <td class="text-[#000] text-sm">N0.00</td>
          </tr>

          <tr>
            <td colspan="3" class="text-[#000]">Grand Total<span class="text-[#555555]"> (NGN)</span></td>
            <td class="text-[#000] text-xl fontBold">N${thePrice}</td>
          </tr>


          <tr>
            <td colspan="4" class="text-sm text-[#000] pb-0">Amount in words</td>
          </tr>
          <tr>
            <td colspan="4" class="text-sm text-[#555555] pt-0 text-capitalize">
              ${convertNumberToWords(thePrice)} Naira Only</td>
          </tr>

        </table>


        <div class="px-6 mt-5">
          <img src="./assets/img/paid.png" class="w-[300px]" alt="">
        </div>
  `)
  nextPrev(1)
}

function downloadInvoice(thecard) {
  const element = document.getElementById(thecard);
  var originalContent = document.body.innerHTML
  document.querySelector("#editBtn").remove()

  var HTML_Width = $("#" + thecard).width();
  var HTML_Height = $("#" + thecard).height();
  var top_left_margin = 15;
  var PDF_Width = HTML_Width + (top_left_margin * 2);
  var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
  var canvas_image_width = HTML_Width;
  var canvas_image_height = HTML_Height;

  var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

  html2canvas($("#" + thecard)[0]).then(function (canvas) {
    var imgData = canvas.toDataURL("image/jpeg", 1.0);
    var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
    pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
    for (var i = 1; i <= totalPDFPages; i++) {
      pdf.addPage(PDF_Width, PDF_Height);
      pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
    }
    pdf.save(thecard + ".pdf");
    document.body.innerHTML = originalContent;
    // $("#" + thecard).hide();
  });

}

// function printInvoice(thecard) {
//   var originalContent = document.body.innerHTML;
//   // document.querySelector("#editBtn").remove()
//   var printContent = document.getElementById(thecard).innerHTML;


//   document.body.innerHTML = printContent;
//   window.print();
//   document.body.innerHTML = originalContent;

// }


function generateRandomString() {
  const timestamp = new Date().getTime().toString(); // Get current timestamp as a string
  const randomNum = Math.random().toString(36).substr(2, 8); // Generate a random alphanumeric string
  const randomString = timestamp + randomNum; // Combine timestamp and random string
  return randomString;
}