// var flutter_script = document.createElement('script')
// flutter_script.setAttribute('src', 'https://checkout.flutterwave.com/v3.js')
// document.head.appendChild(flutter_script)

var flutter_script = document.createElement('script')
flutter_script.setAttribute('src', 'https://js.paystack.co/v1/inline.js')
document.head.appendChild(flutter_script)

var remita_script = document.createElement('script')
remita_script.setAttribute('src', 'https://login.remita.net/payment/v1/remita-pay-inline.bundle.js')
document.head.appendChild(remita_script)

var qr_codeScript = document.createElement('script')
qr_codeScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js')
document.head.appendChild(qr_codeScript)

// var html2pdff = document.createElement('script')
// html2pdff.setAttribute('src', 'https://raw.githack.com/eKoopmans/html2pdf/master/dist/html2pdf.bundle.js')
// document.head.appendChild(html2pdff)

let urlParamsAnother = new URLSearchParams(window.location.search);
const remitaPage = urlParamsAnother.get('redirected')

function sumArray(numbers) {
  return numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}

if (remitaPage === "remita") {
  $("#makePayment").html(`
    <p class="text-2xl fontBold text-center">Make Payment</p>
    <p class="text-center">Select your preferred method</p>
    
    <div class="flex items-center flex-wrap justify-center mt-4 gap-3 px-5">
    
        
        <div class="payCards active">
            <div class="flex justify-center">
              <img src="./assets/img/remita-icon.png" alt="Remita" width="30" />
            </div>
            <p class="text-center">Remita </p>
        </div>
    
  
    </div>
    
    <div id="tabcontainer" class="mt-10 mb-10">
    
        <div class="px-20 tab_steps active">
            <p class="fontBold text-center text-lg">Follow the steps below to make online payments with Remita</p>
            <div class="flex justify-center mt-2">
              <img src="./assets/img/linebig.png" alt="">
            </div>
        
            <div class="mt-2">
                <div class="mb-2">
                    <h1 class="text-lg fontBold">Step 1</h1>
                    <p>When you click on proceed, you'll be redirected to a secure payment gateway.</p>
                 </div>
                  
                <div class="mb-2">
                    <h1 class="text-lg fontBold">Step 2</h1>
                    <p>Select your preferred payment method from the options provided.</p>
                </div>
                  
                <div class="mb-2">
                    <h1 class="text-lg fontBold">Step 3</h1>
                    <p>Follow the prompt and provide all necessary details as it relates to the payment method chosen.</p>
                </div>
                  
                <div class="mb-2">
                    <h1 class="text-lg fontBold">Step 4</h1>
                    <p>Confirm the payment amount.</p>
                </div>
                  
                <div class="mb-2">
                    <h1 class="text-lg fontBold">Step 5</h1>
                    <p>Once the payment is processed successfully, you will receive a confirmation and and a receipt is generated.</p>
                </div>
                  
                  
                <div class="flex justify-center">
                    <button class="button w-[60%] mt-3" id="makePaymentRemitaMain" onclick="makePaymentRemitaMain()">Proceed</button> 
                </div>
                <div id="msg_boxas"></div>
        </div>
        
    
    
    

    
    </div>
`)

} else {
  $("#makePayment").html(`
    <p class="text-2xl fontBold text-center">Make Payment</p>
    <p class="text-center">Select your preferred method</p>
    
    <div class="flex items-center flex-wrap justify-center mt-4 gap-3 px-5">
    
        <div class="payCards active">
            <div class="flex justify-center">
              <iconify-icon icon="ph:bank-fill" class="textPrimary"></iconify-icon>
            </div>
            <p class="text-center">Bank Branch</p>
        </div>
            
        <div class="payCards">
            <div class="flex justify-center">
              <img src="./assets/img/credo.png" alt="etransact" width="30" />
            </div>
            <p class="text-center">eTransanct</p>
        </div>
        
        <div class="payCards">
            <div class="flex justify-center">
              <img src="./assets/img/interswitch.png" alt="paystack" width="30" />
            </div>
            <p class="text-center">Interswitch</p>
        </div>
      
        <div class="payCards">
            <div class="flex justify-center">
              <img src="./assets/img/paystack.svg" alt="paystack" width="30" />
            </div>
            <p class="text-center">PayStack </p>
        </div>
        
        <div class="payCards">
            <div class="flex justify-center">
              <img src="./assets/img/remita-icon.png" alt="Remita" width="30" />
            </div>
            <p class="text-center">Remita </p>
        </div>
    
        <div class="payCards">
            <div class="flex justify-center">
              <iconify-icon icon="mdi:naira" class="textPrimary"></iconify-icon>
            </div>
            <p class="text-center">e-Naira</p>
        </div>
    
    </div>
    
    <div id="tabcontainer" class="mt-10 mb-10">
    
         <div class="px-20 tab_steps active">
            <p class="fontBold text-center text-lg">Follow the steps below to make Bank Branch payments</p>
            <div class="flex justify-center mt-2">
              <img src="./assets/img/linebig.png" alt="">
            </div>
        
            <div class="mt-10">
              <div class="mb-2">
                <h1 class="text-lg fontBold">Step 1</h1>
                <p class="mt-1">Choose 'Bank Branch' as your preferred method.</p>
              </div>
              
              <div class="mb-2">
                <h1 class="text-lg fontBold">Step 2</h1>
                <p class="mt-1">Visit the designated bank branch.</p>
              </div>
              
              <div class="mb-2">
                <h1 class="text-lg fontBold">Step 3</h1>
                <p class="mt-1">Go to your bank branch and present your invoice number or invoice.</p>
              </div>
              
              <div class="mb-2">
                <h1 class="text-lg fontBold">Step 4</h1>
                <p class="mt-1">Make the payment in person using the invoice number on the invoice.</p>
              </div>
              
              <div class="mb-2">
                <h1 class="text-lg fontBold">Step 5</h1>
                <p class="mt-1">Retain the receipt as proof of payment.</p>
              </div>
              
            </div>
          </div>
          
        <div class="px-20 tab_steps">
            <p class="fontBold text-center text-lg">Follow the steps below to make payments using eTransact.</p>
            <div class="flex justify-center mt-2">
              <img src="./assets/img/linebig.png" alt="">
            </div>
        
            <div class="mt-2">
    
              <div class="mb-2">
                <h1 class="text-lg fontBold">Step 1</h1>
                <p>When you click on proceed, you'll be redirected to a secure payment gateway.</p>
              </div>
              
              <div class="mb-2">
                <h1 class="text-lg fontBold">Step 2</h1>
                <p>Select your preferred payment method from the options provided.</p>
              </div>
              
              <div class="mb-2">
                <h1 class="text-lg fontBold">Step 3</h1>
                <p>Follow the prompt and provide all necessary details as it relates to the payment method chosen.</p>
              </div>
              
              <div class="mb-2">
                <h1 class="text-lg fontBold">Step 4</h1>
                <p>Confirm the payment amount.</p>
              </div>
              
              <div class="mb-2">
                <h1 class="text-lg fontBold">Step 5</h1>
                <p>Once the payment is processed successfully, you will receive a confirmation and and a receipt is generated.</p>
              </div>
            
              <div class="flex justify-center">
                <button class="button w-[60%] mt-3" id="makePBtn" onclick="makePaymentRemita2()">Proceed</button>
              </div>
              
              <div id='msg_boxx'></div>
              
            </div>
          </div>
          
          <div class="px-20 tab_steps">
            <p class="fontBold text-center text-lg">Follow the steps below to make payment using Interswitch</p>
            <div class="flex justify-center mt-2">
              <img src="./assets/img/linebig.png" alt="">
            </div>
        
            <div class="mt-2">
                <div class="mb-2">
                    <h1 class="text-lg fontBold">Step 1</h1>
                    <p>When you click on proceed, you'll be redirected to a secure payment gateway.</p>
                  </div>
                  
                  <div class="mb-2">
                    <h1 class="text-lg fontBold">Step 2</h1>
                    <p>Select your preferred payment method from the options provided.</p>
                  </div>
                  
                  <div class="mb-2">
                    <h1 class="text-lg fontBold">Step 3</h1>
                    <p>Follow the prompt and provide all necessary details as it relates to the payment method chosen.</p>
                  </div>
                  
                  <div class="mb-2">
                    <h1 class="text-lg fontBold">Step 4</h1>
                    <p>Confirm the payment amount.</p>
                  </div>
                  
                  <div class="mb-2">
                    <h1 class="text-lg fontBold">Step 5</h1>
                    <p>Once the payment is processed successfully, you will receive a confirmation and and a receipt is generated.</p>
                  </div>
                  
                  
                  
            </div>
          </div>
    
        <div class="px-20 tab_steps">
            <p class="fontBold text-center text-lg">Follow the steps below to make online payments with PayStack</p>
            <div class="flex justify-center mt-2">
              <img src="./assets/img/linebig.png" alt="">
            </div>
        
            <div class="mt-2">
                <div class="mb-2">
                    <h1 class="text-lg fontBold">Step 1</h1>
                    <p>When you click on proceed, you'll be redirected to a secure payment gateway.</p>
                  </div>
                  
                  <div class="mb-2">
                    <h1 class="text-lg fontBold">Step 2</h1>
                    <p>Select your preferred payment method from the options provided.</p>
                  </div>
                  
                  <div class="mb-2">
                    <h1 class="text-lg fontBold">Step 3</h1>
                    <p>Follow the prompt and provide all necessary details as it relates to the payment method chosen.</p>
                  </div>
                  
                  <div class="mb-2">
                    <h1 class="text-lg fontBold">Step 4</h1>
                    <p>Confirm the payment amount.</p>
                  </div>
                  
                  <div class="mb-2">
                    <h1 class="text-lg fontBold">Step 5</h1>
                    <p>Once the payment is processed successfully, you will receive a confirmation and and a receipt is generated.</p>
                  </div>
                  
                  
                  <div class="flex justify-center mb-4">
                  <button class="button w-[60%] mt-3" id="paystackPayBtn" onclick="makePayment()">Proceed</button>
                  </div>
                  <div id="msg_box_paystack"></div>
            </div>
        
            
    
        </div>
      
        <div class="px-20 tab_steps">
            <p class="fontBold text-center text-lg">Follow the steps below to make online payments with Remita</p>
            <div class="flex justify-center mt-2">
              <img src="./assets/img/linebig.png" alt="">
            </div>
        
            <div class="mt-2">
                <div class="mb-2">
                    <h1 class="text-lg fontBold">Step 1</h1>
                    <p>When you click on proceed, you'll be redirected to a secure payment gateway.</p>
                 </div>
                  
                <div class="mb-2">
                    <h1 class="text-lg fontBold">Step 2</h1>
                    <p>Select your preferred payment method from the options provided.</p>
                </div>
                  
                <div class="mb-2">
                    <h1 class="text-lg fontBold">Step 3</h1>
                    <p>Follow the prompt and provide all necessary details as it relates to the payment method chosen.</p>
                </div>
                  
                <div class="mb-2">
                    <h1 class="text-lg fontBold">Step 4</h1>
                    <p>Confirm the payment amount.</p>
                </div>
                  
                <div class="mb-2">
                    <h1 class="text-lg fontBold">Step 5</h1>
                    <p>Once the payment is processed successfully, you will receive a confirmation and and a receipt is generated.</p>
                </div>
                  
                  
                <div class="flex justify-center">
                    <button class="button w-[60%] mt-3" id="makePaymentRemitaMain" onclick="makePaymentRemitaMain()">Proceed</button> 
                </div>
                <div id="msg_boxas"></div>
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
    
    </div>
`)
}



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


function makePaymentRemitaMain() {
  let thePay = document.querySelector("#theBal")
  let finalPay = thePay.dataset.money

  $("#msg_boxas").html(`
        <div class="flex justify-center items-center mt-4">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
    `)
  $("#makePaymentRemitaMain").addClass("hidden")


  async function openInvoice(invoicenum) {
    try {
      const response = await fetch(`${HOST}?getSingleInvoice&invoiceNumber=${invoicenum}`);
      const userInvoices = await response.json();
      console.log(userInvoices);

      if (userInvoices.status === 1) {
        if (userInvoices.message[0].payment_status === "paid") {
          // alert("This Invoice has already been paid")
          $("#msg_boxas").html(`
                    <p class="text-warning text-center mt-4 text-lg">This Invoice has already been paid</p>
                `)
          $("#makePaymentRemitaMain").removeClass("hidden")
        } else {

          let invoiceDetails = userInvoices.message[0]

          var paymentEngine = RmPaymentEngine.init({
            key: "WkFNQklSfDM1Njc5MTEwNzN8MTIwN2U5NDUxOGQxNDhjZmJhMTRiNDQzZDI3MzlmMWU2YjhkZjZjNmIyMjFjOTc1ZjYzZWU0ODE1NGI4YTMxYjk0MWY3ZjNiODM1MGFjYmQyNGVhOWYzODUxNWZmMTY3NGNkYmFkN2E0MGQ2ZGI4MDg3MDI0YzdmMzAwOWYxY2Q=",
            processRrr: true,
            transactionId: Math.floor(Math.random() * 1101233), //you are expected to generate new values for the transactionId for each transaction processing.
            // channel: "Remita", //this field is used to filter what card channels you want enabled on the payment modal
            extendedData: {
              customFields: [
                {
                  name: "rrr",
                  value: invoiceDetails.rrr //rrr to be processed.
                }
              ]
            },
            onSuccess: function (response) {

              alert("payment success")
              nextPrev(1)
              openReceipt(invoicenum)
              // let dataToPush = {
              //   "endpoint": "createInvidualPayment",
              //   "data": {
              //     "invoice_number": invoicenum,
              //     "payment_channel": "Remita",
              //     "payment_reference_number": response.paymentReference,
              //     "receipt_number": response.paymentReference,
              //     "amount_paid": finalPay
              //   }
              // }
              // $.ajax({
              //   type: "POST",
              //   url: HOST,
              //   dataType: 'json',
              //   data: JSON.stringify(dataToPush),
              //   success: function (data) {
              //     console.log(data)
              //     alert("payment success")
              //     nextPrev(1)
              //     openReceipt(invoicenum)
              //   },
              //   error: function (request, error) {
              //     console.log(error)
              //     $("#msg_boxas").html(`
              //         <p class="text-warning text-danger mt-4 text-lg">Payment not processed, contact support if you've been debited.</p>
              //     `)
              //     $("#makePaymentRemitaMain").removeClass("hidden")
              //   }
              // });

            },
            onError: function (response) {
              $("#msg_boxas").html(`
                            <p class="text-warning text-danger mt-4 text-lg text-center">Error while processing payment, try other payment channels.</p>
                        `)
              $("#makePaymentRemitaMain").removeClass("hidden")
            },
            onClose: function () {
              console.log("closed");
              $("#msg_boxas").html("")
              $("#makePaymentRemitaMain").removeClass("hidden")
            }
          });

          paymentEngine.showPaymentWidget();


        }
      } else {
        alert("Wrong Invoice")
        $("#msg_boxas").html("")
        $("#makePaymentRemitaMain").removeClass("hidden")
      }
    } catch (error) {
      // alert('Unable to process Invoice, try other payment channels')
      console.log(error)
      $("#msg_boxas").html(`
            <p class="text-warning text-danger mt-4 text-lg text-center">Unable to process Invoice, try other payment channels.</p>
        `)
      $("#makePaymentRemitaMain").removeClass("hidden")
    }
  }
  let invoicenn = sessionStorage.getItem("invoice_number")
  openInvoice(invoicenn)


}

function makePaymentRemita2() {
  let thePay = document.querySelector("#theBal")
  let finalPay = thePay.dataset.money

  console.log(finalPay)

  $("#makePBtn").addClass("hidden")
  $("#msg_boxx").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)

  async function openInvoice(invoicenum) {
    try {

      const response = await fetch(
        `${HOST}/php/index.php?getSingleInvoice&invoiceNumber=${invoicenum}`
      );

      const userInvoices = await response.json();
      console.log(userInvoices);

      if (userInvoices.status === 1) {

        if (userInvoices.message[0].payment_status === "paid") {
          alert("This Invoice has already been paid")
          $("#makePBtn").removeClass("hidden")
          $("#msg_boxx").html('')

        } else {
          let invoiceDetails = userInvoices.message[0]

          let PaymentData = {
            "amount": parseFloat(finalPay) * 100,
            // "amount": 200.00,
            "bearer": 1,
            "callbackUrl": `https://payzamfara.com/receipt.html?invoice_num=${invoicenum}&amount=${parseFloat(finalPay)}`,
            "channels": ["card", "bank"],
            "currency": "NGN",
            "customerFirstName": invoiceDetails.first_name + invoiceDetails.surname,
            "customerLastName": invoicenum,
            "customerPhoneNumber": invoiceDetails.phone,
            "email": invoiceDetails.email,
          }

          $.ajax({
            type: "POST",
            url: 'https://api.credocentral.com/transaction/initialize',
            headers: {
              'Authorization': '1PUB1100nLL80S11CMCWH4J93LfQlTwL0rErft',
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            dataType: 'json',
            data: JSON.stringify(PaymentData),
            success: function (data) {
              console.log(data)

              if (data.status === 200) {
                window.location.href = data.data.authorizationUrl
              } else {
                $("#makePBtn").removeClass("hidden")
                $("#msg_boxx").html(`<p class="text-warning text-center mt-4 text-lg">${data.message}</p>`)
              }

            },
            error: function (request, error) {
              console.log(error)
              $("#makePBtn").removeClass("hidden")
              $("#msg_boxx").html(`<p class="text-danger text-center mt-4 text-lg">Error while processing payment, try another payment gateway!</p>`)
            }
          });




        }
      } else {
        alert("Wrong Invoice")
      }

    } catch (error) {
      $("#makePBtn").removeClass("hidden")

      $("#msg_boxx").html(`<p class="text-danger text-center mt-4 text-lg">Network Error, Please Try Again!</p>`)
    }



  }

  let invoicenn = sessionStorage.getItem("invoice_number")
  openInvoice(invoicenn)


}

function makePayment() {
  $("#paystackPayBtn").prop("disabled", true).text("Processing Payment...");

  async function openInvoice(invoicenum) {
    try {
      const response = await fetch(`${HOST}/php/index.php?getSingleInvoice&invoiceNumber=${invoicenum}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const userInvoices = await response.json();

      if (userInvoices.status !== 1) {
        alert("Invoice Not Found, Please check your invoice number.");
        return;
      }

      const invoice = userInvoices.message[0];

      if (invoice.payment_status === "paid") {
        alert("This Invoice has already been paid");
        return;
      }

      const userHasEmail = invoice.email;

      let full_amount_paid = 0
      userInvoices.message.forEach(usr => full_amount_paid += parseFloat(usr.amount_paid))

      let invoiceDetails = invoice;

      var handler = PaystackPop.setup({
        key: 'pk_live_b9406bc825d388d331131ec1627ae65ef7ad6a8a', // Replace with your public key
        // key: 'pk_test_a00bd73aad869339803b75183303647b5dcd8305',
        email: invoiceDetails.email,
        amount: full_amount_paid * 100,
        currency: 'NGN',
        metadata: {
          custom_fields: [
            {
              display_name: "Invoice Number",
              variable_name: "invoice_number",
              value: invoicenum
            }
          ]
        },
        callback: function (response) {
          var reference = response.reference;
          alert('Payment complete! Reference: ' + reference);

          $("#paystackPayBtn").prop("disabled", true).text("Approving Payment...");

          $.ajax({
            type: "POST",
            url: "https://payzamfara.com/php/payStack/payment_logs.php",
            dataType: 'json',
            data: JSON.stringify({
              "gateway": "paystack",
              "invoice_number": invoicenum,
              "transac_ref": reference,
              "gateway_status": response.status,
              "inhouse_status": "unsuccessful"
            }),
            success: function (data) {
              console.log("Logged to payment_logs.php:", data);
            },
            error: function (request, error) {
              console.error("Error logging to payment_logs.php:", error);
            }
          });

          $.ajax({
            type: "POST",
            url: HOST,
            dataType: 'json',
            data: JSON.stringify({
              "endpoint": "createInvidualPayment",
              "data": {
                "invoice_number": invoicenum,
                "payment_channel": "paystack",
                "payment_reference_number": reference,
                "receipt_number": reference,
                "amount_paid": full_amount_paid
              }
            }),
            success: function (data) {
              // console.log("Payment recorded:", data);
              // Only proceed after createInvidualPayment succeeds
              $("#paystackPayBtn").prop("disabled", false).text("Proceed");
              nextPrev(1);
              openReceipt(invoicenum);
            },
            error: function (request, error) {
              console.error("Error sending to createInvidualPayment:", error);
              // Optional: re-enable the button or handle UI fallback here
              $("#paystackPayBtn").prop("disabled", false).text("Proceed");
              throw new Error(`There was an issue approving your payment. Please try again. Please contact Support`);
            }
          });

        },
        onClose: function () {
          alert('Transaction was not completed, window closed.');
          $("#paystackPayBtn").prop("disabled", false).text("Proceed");
        }
      });

      handler.openIframe();



    } catch (error) {
      console.error("An error occurred:", error);
      $("#paystackPayBtn").prop("disabled", false).text("Proceed");
      $("#msg_box_paystack").html(`
            <p class="text-center text-danger">${error.message ? `Ooops ${error.message}` : `Something's not right, please try another payment gateway!`}</p>
        `)
    }
  }

  let invoicenn = sessionStorage.getItem("invoice_number")
  openInvoice(invoicenn)


}


function formatMoney(amount) {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'NGN', // Change this to your desired currency code
    minimumFractionDigits: 2,
  });
};

async function openReceipt(invoicenum) {
  console.log(invoicenum)

  const response = await fetch(
    `${HOST}/php/index.php?getSingleInvoice&invoiceNumber=${invoicenum}`
  );
  const userInvoices = await response.json();
  //   console.log(userInvoices);

  if (userInvoices.status === 1) {
    let invoice_info = userInvoices.message[0]

    let hardCopyReceipt = ""
    let receiptCardMain = ""

    receiptCardMain = `
        <div class="invoicetop"></div>

        <div class="flex px-6 pt-3 items-center justify-between">

          <h1 class="fontBold text-2xl">RECEIPT</h1>

          <div class="flex items-center gap-1">
            <img src="./assets/img/vector.png" alt="">
            <p class="text-2xl fontBold">${invoice_info.invoice_number}</p>
          </div>

        </div>
        
        <div class="mt-2 px-2 flex justify-between">
            <img src="./assets/img/logo.png" alt="" class="w-[100px] h-[70px]">
            
            <div id="qrContainer1st" class="w-[200px] mt-3"></div>
        </div>
        
        <div class="flex  justify-between px-6 mt-4">
          <div class="w-full">
            <p class="text-[#555555]">FROM :</p>
            <p class="fontBold">${invoice_info.COL_3}</p>
            <p class="text-[#222234] w-[60%] text-sm">Zamfara State</p>
          </div>

          <div class="w-full md:mr-[-10%]">
            <p class="text-[#555555]">TO :</p>
            <p class="fontBold text-left">${invoice_info.surname} ${invoice_info.first_name}</p>
            <p class="text-[#222234] text-sm md:w-[60%]">${invoice_info.address}, Zamfara</p>
          </div>

        </div>

        <div class="px-6 mt-4">
          <p class="text-[#555555]">INFO :</p>

          <table class="table table-borderless invTa md:w-[70%] w-full">
            <tr>
              <td>
                <p class="fontBold">Payer ID: ${invoice_info.tax_number}</p>
                <p class="fontBold">TIN: ${invoice_info.tin}</p>
              </td>
              <td>Due Date: ${invoice_info.due_date}</td>
            </tr>
            <tr>
              <td>Invoice Date: ${invoice_info.date_created}</td>
              <td>Expiry Date: ${invoice_info.due_date}</td>
            </tr>
            <tr>
              <td><span class="fontBold">Description:</span> ${invoice_info.description ? invoice_info.description : '-'}</td>
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
        `
    let theTotal = []
    userInvoices.message.forEach(element => {
      receiptCardMain += `
              <tr class="border-b border-b border-[#6F6F84]">
                <td class="text-sm">${element.COL_4}</td>
                <td class="text-sm">01</td>
                <td class="text-sm"></td>
                <td class="text-sm">${formatMoney(parseFloat(element.amount_paid))}</td>
              </tr>
            `
      theTotal.push(parseFloat(element.amount_paid))
    });

    receiptCardMain += `          
              <tr>
                <td class="text-[#555555] text-sm">Sub Total</td>
                <td></td>
                <td></td>
                <td class="text-[#000] text-sm">${formatMoney(sumArray(theTotal))}</td>
              </tr>
              <tr class="border-b border-b border-[#6F6F84]">
                <td class="text-[#555555] text-sm">Discount</td>
                <td></td>
                <td></td>
                <td class="text-[#000] text-sm">N0.00</td>
              </tr>

              <tr>
                <td colspan="3" class="text-[#000]">Grand Total<span class="text-[#555555]"> (NGN)</span></td>
                <td class="text-[#000] text-xl fontBold">${formatMoney(sumArray(theTotal))}</td>
              </tr>

              <tr>
                <td colspan="4" class="text-sm text-[#000] pb-0">Amount in words</td>
              </tr>
              <tr>
                <td colspan="4" class="text-sm text-[#555555] pt-0 text-capitalize">${convertNumberToWords(sumArray(theTotal))} Only</td>
              </tr>

            </table>

            <table class="table table-borderless bg-[#FFF3E9]">
              <tr>
                <td colspan="3" class="text-[#6F6F84] pb-0">Payment Details</td>
                <td class="text-right text-uppercase text-[#6F6F84] text-sm pb-0">Online payment </td>
              </tr>
              <tr>
                <td colspan="3"></td>
                <td class="text-right pt-0">Online payment </td>
              </tr>
            </table>
          </div>
        </div>


        <hr class="my-4 md:mx-10 mx-4">

        <div class="md:px-10 px-2 pb-6" id="invtopp">
            <div class="flex items-center justify-center">
            <div class="">
                <img src="./assets/img/logo.png" alt="" class="w-[70px] h-[70px]">
            </div>
         
          <div>
            <p class="text-xl fontBold pb-0">Pay Zamfara</p>
            <div class="flex items-center gap-x-3 flex-wrap">
              <p class="text-sm text-[#6F6F84]">www.payzamfara.com</p>
              <p class="text-sm text-[#6F6F84]">Info@payzamfara.com</p>
              <p class="text-sm text-[#6F6F84]">0800 101 5555</p>
              <img src="./assets/img/logo1.png" class="h-[30px] w-[70px]" alt="">
            </div>
          </div>
          
        </div>

      </div>
    `

    $("#receiptCard").html(receiptCardMain)

    const qrCodeContainer1st = document.getElementById("qrContainer1st")

    const qrCode1st = new QRCode(qrCodeContainer1st, {
      text: `https://payzamfara.com/viewreceipt.html?invnumber=${invoicenum}&load=true`,
      colorDark: '#000000',
      width: 100,
      height: 100,
      colorLight: '#ffffff',
      version: 10,
    });

    let theDatooo = new Date()
    let nowDate = theDatooo.toISOString().split('T')[0]


    hardCopyReceipt += `
        <div class="hardReceiptCopy p-1">
            <div class="flex justify-between mt-4">
                <div>
                    <p class="fontBold text-lg">Transaction Details</p>
                    <p class="text-sm">Transaction ID: <span class="fontBold">${invoice_info.invoice_number}</span></p>
                    <p class="text-sm">Transaction Date: <span class="fontBold">${invoice_info.date_created}</span></p>
                    <p class="text-sm">Payment Channel: <span class="fontBold">Paystack</span></p>
                </div>

                <div>
                    <div>
                        <p class="mb-0 px-6 py-2 rounded-full theheaders -mt-6">PAYMENT RECEIPT</p>
                    </div>
                    
                </div>
            </div>
            
            <div class="flex justify-between items-center">
                <div>
                    <p class="text-sm">This is from: <span class="fontBold">${invoice_info.COL_3}</span></p>
                    <p class="text-sm">This is to: <span class="fontBold">${invoice_info.surname} ${invoice_info.first_name} PHONE: ${invoice_info.phone}</span></p>
                </div>
                <div>
                    <div><span class="text-3xl text-sm fontBold">ZS</span>&nbsp;&nbsp;&nbsp; <span class="text-lg">${invoice_info.invoice_number}</span></div>
                    <div class="" id="qrContainer"></div>
                    <div class="mb-4 text-xs">Date: ${formatDate(invoice_info.date_created)}</div>
                </div>
            </div>
            
            <table class="table table-borderless">
                <thead class="theheaders">
                    <tr>
                        <th>ITEM</th>
                        <th>DESCRIPTION</th>
                        <th>PRICE</th>
                        <th>AMOUNT</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1.</td>
                        <td>${invoice_info.COL_4}</td>
                        <td>${parseFloat(invoice_info.amount_paid).toLocaleString()}</td>
                        <td>${parseFloat(invoice_info.amount_paid).toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td><span class="fontBold">TOTAL</span></td>
                        <td><span class="fontBold">${formatMoney(parseFloat(invoice_info.amount_paid))}</span></td>
                        <td><span class="fontBold">${formatMoney(parseFloat(invoice_info.amount_paid))}</span></td>
                    </tr>
                </tbody>
            </table>
            
            <div class="flex justify-between mt-5 items-center">
                <div>
                    <p class="capitalize fontBold">Amount In Words</p>
                    <p class="text-sm capitalize">${convertNumberToWords(invoice_info.amount_paid)} </p>
                </div>
                <div>
                    <div class="border-b border-gray-400 w-[300px]"></div>
                    <p class="text-sm text-center">Authorized By</p>
                </div>
            </div>
            
        </div>    
    `

    $("#receiptHardCopy").html(hardCopyReceipt)
    const qrCodeContainer = document.getElementById("qrContainer")

    const qrCode = new QRCode(qrCodeContainer, {
      text: `https://payzamfara.com/viewreceipt.html?invnumber=${invoicenum}&load=true`,
      colorDark: '#000000',
      width: 100,
      height: 100,
      colorLight: '#ffffff',
      version: 10,
    });

  } else {
    $("#invoiceCard").html(`Invalid Invoice, or expired invoice`)
  }
}

let urlParams22 = new URLSearchParams(window.location.search);
const load2 = urlParams22.get('load')
const invoicenumber2 = urlParams22.get('invnumber')

if (load2) {
  openReceipt(invoicenumber2)
}

function downloadInvoice(thecard) {
  const element = document.getElementById(thecard);
  var originalContent = document.body.innerHTML

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
    pdf.addImage(imgData, 'JPEG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
    for (var i = 1; i <= totalPDFPages; i++) {
      pdf.addPage(PDF_Width, PDF_Height);
      pdf.addImage(imgData, 'JPEG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
    }
    pdf.save(thecard + ".pdf");
    document.body.innerHTML = originalContent;
    // $("#" + thecard).hide();
  });

}

function printInvoice(thecard) {
  var originalContent = document.body.innerHTML;
  var printContent = document.getElementById(thecard).innerHTML;


  document.body.innerHTML = printContent;
  window.print();
  document.body.innerHTML = originalContent;

}

function printInvoiceHard(thecard) {
  var originalContent = document.body.innerHTML;

  document.querySelector("#receiptHardCopy").classList.remove('hidden')

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

function formatDate(inputDate) {
  // Parse the input date string
  const parsedDate = new Date(inputDate.replace(/-/g, '/'));

  // Options for formatting the date
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  // Format the date using the options
  const formattedDate = parsedDate.toLocaleDateString('en-US', options);

  // Extract the day and add the appropriate suffix
  const dayWithSuffix = addSuffix(parsedDate.getDate());

  // Construct the final formatted date string
  const finalFormattedDate = `${formattedDate}`;

  return finalFormattedDate;
}

// Function to add suffix to day
function addSuffix(day) {
  if (day >= 11 && day <= 13) {
    return `${day}th`;
  }
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}

