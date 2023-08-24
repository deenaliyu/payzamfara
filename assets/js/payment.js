var flutter_script = document.createElement('script')
flutter_script.setAttribute('src', 'https://js.paystack.co/v1/inline.js')
document.head.appendChild(flutter_script)

var remita_script = document.createElement('script')
remita_script.setAttribute('src', 'https://remitademo.net/payment/v1/remita-pay-inline.bundle.js')
document.head.appendChild(remita_script)

// var html2pdff = document.createElement('script')
// html2pdff.setAttribute('src', 'https://raw.githack.com/eKoopmans/html2pdf/master/dist/html2pdf.bundle.js')
// document.head.appendChild(html2pdff)

$("#makePayment").html(`
<p class="text-2xl fontBold text-center">Make Payment</p>
<p class="text-center">Select your preferred method</p>

<div class="flex items-center flex-wrap justify-center mt-4 gap-3 px-5">

  <div class="payCards active">
    <div class="flex justify-center">
      <iconify-icon icon="mdi:credit-card-fast" class="textPrimary"></iconify-icon>
    </div>
    <p class="text-center">Online <br> Payment</p>
  </div>

  <div class="payCards">
    <div class="flex justify-center">
      <iconify-icon icon="mdi:instant-transfer" class="textPrimary"></iconify-icon>
    </div>
    <p class="text-center">Bank <br> Transfer</p>
  </div>

  <div class="payCards">
    <div class="flex justify-center">
      <iconify-icon icon="ph:bank-fill" class="textPrimary"></iconify-icon>
    </div>
    <p class="text-center">Bank <br> Branch</p>
  </div>

  <div class="payCards">
    <div class="flex justify-center">
      <iconify-icon icon="fontisto:shopping-pos-machine" class="textPrimary"></iconify-icon>
    </div>
    <p class="text-center">POS <br> &nbsp;</p>
  </div>

  <div class="payCards">
    <div class="flex justify-center">
      <iconify-icon icon="material-symbols:phone-android" class="textPrimary"></iconify-icon>
    </div>
    <p class="text-center">USSD <br> &nbsp;</p>
  </div>

  <div class="payCards">
    <div class="flex justify-center">
      <iconify-icon icon="mdi:naira" class="textPrimary"></iconify-icon>
    </div>
    <p class="text-center">e-Naira <br> &nbsp;</p>
  </div>

  <div class="payCards">
    <div class="flex justify-center">
      <iconify-icon icon="mdi:credit-card-fast" class="textPrimary"></iconify-icon>
    </div>
    <p class="text-center">ATM <br> &nbsp;</p>
  </div>

</div>

<div id="tabcontainer" class="mt-10 mb-10">

  <div class="px-20 tab_steps active">
    <p class="fontBold text-center text-lg">Follow the steps below to make online payments</p>
    <div class="flex justify-center mt-2">
      <img src="./assets/img/linebig.png" alt="">
    </div>

    <p class="text-[#555555] mt-3">You can make payment online with your ATM cards (MasterCard, Visa and
      Verve). Click on the
      <span class="fontBold text-[#000]">"Pay Now"</span> button below to proceed.
    </p>

    <div class="flex justify-center">
      <button class="button w-[60%] mt-3" onclick="makePayment()">Pay Now</button>
    </div>

  </div>

  <div class="px-20 tab_steps">
    <p class="fontBold text-center text-lg">Follow the steps below to make payments on your bank's mobile
      banking platform</p>
    <div class="flex justify-center mt-2">
      <img src="./assets/img/linebig.png" alt="">
    </div>



    
    <div class="mt-10">
      <div class="mb-4">
        <h1 class="text-xl fontBold">Step 1</h1>
        <img src="./assets/img/curveline.png" class="-mt-5" alt="">
        <p class="mt-2">log in to your bank mobile application and select transfer to bank.</p>
      </div>

      <div class="mb-4">
        <h1 class="text-xl fontBold">Step 2</h1>
        <img src="./assets/img/curveline.png" class="-mt-5" alt="">
        <p class="mt-2">Select "************" as the receiving bank and input your Invoice number *******as
          the receiving
          bank account number.</p>
      </div>

      <div class="mb-4">
        <h1 class="text-xl fontBold">Step 3</h1>
        <img src="./assets/img/curveline.png" class="-mt-5" alt="">
        <p class="mt-2">Enter the exact amount to pay in the "Amount to transfer" field that is (the system
          will pull users
          invoice
          total and display here” and proceed.</p>
      </div>

    </div>
  </div>

  <div class="px-20 tab_steps">
    <p class="fontBold text-center text-lg">Follow the steps below to make payments at a bank branch</p>
    <div class="flex justify-center mt-2">
      <img src="./assets/img/linebig.png" alt="">
    </div>

    <div class="mt-10">
      <div class="flex justify-center">
        <button class="button w-[60%] mt-3" onclick="makePaymentRemita()">Generate RRR</button>
      </div>
      
    </div>
  </div>

  <div class="px-20 tab_steps">
    <p class="fontBold text-center text-lg">Follow the steps below to make payments through POS</p>
    <div class="flex justify-center mt-2">
      <img src="./assets/img/linebig.png" alt="">
    </div>

    

    <div class="mt-10">
      <p>You can make payment at POS terminals in any of the offices of the Akwa Ibom State Board of Internal
        Revenue
        with your ATM cards (MasterCard, Visa and Verve). You will be required to present your Invoice Number
        and
        input your Pin to approve transaction.</p>
    </div>
  </div>

  <div class="px-20 tab_steps">
    <p class="fontBold text-center text-lg">Follow the steps below to make USSD payments </p>
    <div class="flex justify-center mt-2">
      <img src="./assets/img/linebig.png" alt="">
    </div>

    <div class="mt-10">
      <p>Details coming soon</p>
    </div>
  </div>

  <div class="px-20 tab_steps">
    <p class="fontBold text-center text-lg">Follow the steps below to make e-Naira payments</p>
    <div class="flex justify-center mt-2">
      <img src="./assets/img/linebig.png" alt="">
    </div>

    <div class="mt-10">
      <p>Details coming soon</p>
    </div>
  </div>

  <div class="px-20 tab_steps">
    <p class="fontBold text-center text-lg">Follow the steps below to make payment at the ATM</p>
    <div class="flex justify-center mt-2">
      <img src="./assets/img/linebig.png" alt="">
    </div>

    <div class="mt-10">
      <p>Details coming soon</p>
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


function makePaymentRemita() {
  let thePay = document.querySelector(".theBal").textContent
  console.log(thePay)

  async function openInvoice(invoicenum) {
    const response = await fetch(
      // `${HOST}/php/index.php?getSingleInvoice&invoiceNumber=${invoicenum}`
      `${HOST}/php/index.php?getSingleInvoice&invoiceNumber=${invoicenum}`
    );
    const userInvoices = await response.json();
    console.log(userInvoices);

    if (userInvoices.status === 1) {
      if (userInvoices.message[0].payment_status === "paid") {
        alert("This Invoice has already been paid")
      } else {


        let invoiceDetails = userInvoices.message[0]


        var paymentEngine = RmPaymentEngine.init({
          key: 'QzAwMDAyNzEyNTl8MTEwNjE4NjF8OWZjOWYwNmMyZDk3MDRhYWM3YThiOThlNTNjZTE3ZjYxOTY5NDdmZWE1YzU3NDc0ZjE2ZDZjNTg1YWYxNWY3NWM4ZjMzNzZhNjNhZWZlOWQwNmJhNTFkMjIxYTRiMjYzZDkzNGQ3NTUxNDIxYWNlOGY4ZWEyODY3ZjlhNGUwYTY=',
          transactionId: Math.floor(Math.random() * 1101233), // Replace with a reference you generated or remove the entire field for us to auto-generate a reference for you. Note that you will be able to check the status of this transaction using this transaction Id
          customerId: invoiceDetails.email,
          firstName: invoiceDetails.first_name,
          lastName: invoiceDetails.surname,
          email: invoiceDetails.email,
          amount: parseFloat(thePay),
          narration: invoiceDetails.COL_4,
          onSuccess: function (response) {
            console.log('callback Successful Response', response);

            let dataToPush = {
              "endpoint": "createInvidualPayment",
              "data": {
                "invoice_number": invoicenum,
                "payment_channel": "paystack",
                "payment_reference_number": reference,
                "receipt_number": reference
              }
            }
            $.ajax({
              type: "POST",
              url: HOST,
              dataType: 'json',
              data: JSON.stringify(dataToPush),
              success: function (data) {
                console.log(data)
                alert("payment success")
                nextPrev(1)
                openReceipt(invoicenum)
              },
              error: function (request, error) {
                console.log(error)
              }
            });
          },
          onError: function (response) {
            console.log('callback Error Response', response);

          },
          onClose: function () {
            console.log("closed");
          },
        });
        paymentEngine.showPaymentWidget();
        // let bbButton = document.querySelector("#js-payment-tabs > li.branch.payment-nav > a")
        // if (bbButton) {
        //   bbButton.click()
        // }

      }
    } else {
      alert("Wrong Invoice")
    }
  }
  let invoicenn = sessionStorage.getItem("invoice_number")
  openInvoice(invoicenn)


}

function makePayment() {
  let thePay = document.querySelector(".theBal").textContent
  console.log(thePay)

  async function openInvoice(invoicenum) {
    const response = await fetch(
      // `${HOST}/php/index.php?getSingleInvoice&invoiceNumber=${invoicenum}`
      `${HOST}/php/index.php?getSingleInvoice&invoiceNumber=${invoicenum}`
    );
    const userInvoices = await response.json();
    console.log(userInvoices);

    if (userInvoices.status === 1) {
      if (userInvoices.message[0].payment_status === "paid") {
        alert("This Invoice has already been paid")
      } else {


        let invoiceDetails = userInvoices.message[0]

        var handler = PaystackPop.setup({
          key: 'pk_test_f26de719a48fdedcf6788a6b8bba2d9bd2c3c0a4', // Replace with your public key
          email: invoiceDetails.email,
          amount: parseFloat(thePay) * 100,
          currency: 'NGN', // Use GHS for Ghana Cedis or USD for US Dollars

          callback: function (response) {
            //this happens after the payment is completed successfully
            var reference = response.reference;
            alert('Payment complete! Reference: ' + reference);
            // Make an AJAX call to your server with the reference to verify the transaction
            let dataToPush = {
              "endpoint": "createInvidualPayment",
              "data": {
                "invoice_number": invoicenum,
                "payment_channel": "paystack",
                "payment_reference_number": reference,
                "receipt_number": reference
              }
            }
            $.ajax({
              type: "POST",
              url: HOST,
              dataType: 'json',
              data: JSON.stringify(dataToPush),
              success: function (data) {
                console.log(data)
                alert("payment success")
                nextPrev(1)
                openReceipt(invoicenum)
              },
              error: function (request, error) {
                console.log(error)
              }
            });

          },
          onClose: function () {
            alert('Transaction was not completed, window closed.');
          },
        });
        handler.openIframe();
      }
    } else {
      alert("Wrong Invoice")
    }
  }
  let invoicenn = sessionStorage.getItem("invoice_number")
  openInvoice(invoicenn)


}




async function openReceipt(invoicenum) {
  console.log(invoicenum)

  const response = await fetch(
    `${HOST}/php/index.php?getSingleInvoice&invoiceNumber=${invoicenum}`
  );
  const userInvoices = await response.json();
  console.log(userInvoices);

  if (userInvoices.status === 1) {

    userInvoices.message.forEach((invoice_info, i) => {
      // let address = ""
      // if (user_session) {
      //   address = `${user_session.lga}, ${user_session.state}, Nigeria`
      // } else {
      //   address = "Akwa Ibom, Nigeria"
      // }
      $("#receiptCard").html(`
            <div class="invoicetop"></div>
  
            <div class="flex px-6 pt-3 items-center justify-between">
  
              <h1 class="fontBold text-2xl">RECEIPT</h1>
  
              <div class="flex items-center gap-1">
                <img src="./assets/img/vector.png" alt="">
                <p class="text-2xl fontBold">${invoice_info.invoice_number}</p>
              </div>
  
            </div>
  
            <div class="flex  justify-between px-6 mt-4">
              <div class="w-full">
                <p class="text-[#555555]">FROM :</p>
                <p class="fontBold">${invoice_info.COL_3}</p>
                <p class="text-[#222234] w-[60%] text-sm">Uyo, Akwa Ibom</p>
              </div>
  
              <div class="w-full md:mr-[-10%]">
                <p class="text-[#555555]">TO :</p>
                <p class="fontBold text-left">${invoice_info.surname} ${invoice_info.first_name}</p>
                <p class="text-[#222234] text-sm md:w-[60%]">${invoice_info.address}, Akwa Ibom</p>
              </div>
  
            </div>
  
            <div class="px-6 mt-4">
              <p class="text-[#555555]">INFO :</p>
  
              <table class="table table-borderless invTa md:w-[70%] w-full">
                <tr>
                  <td>
                    <p class="fontBold">Payer ID: ${invoice_info.tax_number}</p>
                  </td>
                  <td>Due Date: ${invoice_info.due_date}</td>
                </tr>
                <tr>
                  <td>Invoice Date: ${invoice_info.date_created}</td>
                  <td>Expiry Date: ${invoice_info.due_date}</td>
                </tr>
              </table>
            </div>
  
            <div class="flex justify-end">
              <div class="md:w-[70%] w-[90%]">
                <table class="table table-borderless">
                  <tr>
                    <td class="text-[#555555] text-sm">ITEM DESCRIPTION</td>
                    <td class="text-[#555555] text-sm">QTY</td>
                    <td class="text-[#555555] text-sm">RATE</td>
                    <td class="text-[#555555] text-sm">AMOUNT</td>
                  </tr>
                  <tr class="border-b border-b border-[#6F6F84]">
                    <td class="text-sm">${invoice_info.COL_4}</td>
                    <td class="text-sm">01</td>
                    <td class="text-sm"></td>
                    <td class="text-sm">${invoice_info.COL_6}</td>
                  </tr>
                  <tr>
                    <td class="text-[#555555] text-sm">Sub Total</td>
                    <td></td>
                    <td></td>
                    <td class="text-[#000] text-sm">${invoice_info.COL_6}</td>
                  </tr>
                  <tr class="border-b border-b border-[#6F6F84]">
                    <td class="text-[#555555] text-sm">Discount</td>
                    <td></td>
                    <td></td>
                    <td class="text-[#000] text-sm">N0.00</td>
                  </tr>
  
                  <tr>
                    <td colspan="3" class="text-[#000]">Grand Total<span class="text-[#555555]"> (NGN)</span></td>
                    <td class="text-[#000] text-xl fontBold">N${invoice_info.COL_6}</td>
                  </tr>
  
                  <tr>
                    <td colspan="2" class="text-[#000]">Paying</td>
                    <td class="textPrimary"></td>
                    <td class="text-xl textPrimary fontBold">
                      <div id="showBal">
                       &#8358; <span class="theBal">${invoice_info.COL_6}</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="4" class="text-sm text-[#000] pb-0">Amount in words</td>
                  </tr>
                  <tr>
                    <td colspan="4" class="text-sm text-[#555555] pt-0 text-capitalize">${convertNumberToWords(invoice_info.COL_6)} Naira Only</td>
                  </tr>

                </table>
  
                <table class="table table-borderless bg-[#FFF3E9]">
                  <tr>
                    <td colspan="3" class="text-[#6F6F84] pb-0">Payment Details</td>
                    <td class="text-right text-uppercase text-[#6F6F84] text-sm pb-0">Online payment </td>
                  </tr>
                  <tr>
                    <td colspan="3"></td>
                    <td class="text-right pt-0">Paystack </td>
                  </tr>
                </table>
              </div>
            </div>
  
  
            <hr class="my-4 md:mx-10 mx-4">
  
            <div class="md:px-10 px-2 pb-6">
              <div class="flex items-center justify-center">
                <img src="./assets/img/akwaimage.png" alt="">
                <div>
                  <p class="text-xl fontBold pb-0">Pay Ibom</p>
                  <div class="flex items-center gap-x-3 flex-wrap">
                    <p class="text-sm text-[#6F6F84]">www.akwaibompay.ng</p>
                    <p class="text-sm text-[#6F6F84]">Info@akwaibompay.com</p>
                    <p class="text-sm text-[#6F6F84]">0800 101 5555</p>
                    <img src="./assets/img/logo1.png" class="h-[30px] w-[50px]" alt="">
                  </div>
                </div>
              </div>
  
            </div>
        `)

    })

    $("#editBtn").on("click", function () {
      editoo();
    });
  } else {
    $("#invoiceCard").html(`Invalid Invoice, or expired invoice`)
  }
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

function printInvoice(thecard) {
  var originalContent = document.body.innerHTML;
  document.querySelector("#editBtn").remove()
  var printContent = document.getElementById(thecard).innerHTML;


  document.body.innerHTML = printContent;
  window.print();
  document.body.innerHTML = originalContent;

}


function generateRandomString() {
  const timestamp = new Date().getTime().toString(); // Get current timestamp as a string
  const randomNum = Math.random().toString(36).substr(2, 8); // Generate a random alphanumeric string
  const randomString = timestamp + randomNum; // Combine timestamp and random string
  return randomString;
}