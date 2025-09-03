
let urlParams2 = new URLSearchParams(window.location.search);
const pagePrint = urlParams2.get('page')

if (pagePrint === "paynow") {
  $("#title").html("Pay Now")
}
else if (pagePrint === "continue") {
  $("#title").html("Continue Payment")
} else {
  $("#title").html("Verify Invoice")
}

$("#verifyInvoice").on("click", () => {
  let invoiceNumber = document.querySelector("#invoice_number").value
  $(".verifiyer").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)
  $("#verifyInvoice").addClass("hidden")

  if (invoiceNumber === "") {
    $(".verifiyer").html("<p class='text-[#ff0000] text-sm'>Please insert your Invoice Number</p>")
    $("#verifyInvoice").removeClass("hidden")
  } else (
    fetch(`${HOST}/index.php?verifyInvoice&invoice_number=${invoiceNumber}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        if (data.status === 1) {
          $(".verifiyer").html("")
          nextPrev(1)
          if (data.message.payment_status == "unpaid") {

            $("#verifyInvoice").removeClass("hidden")

            $("#verInvv").html(`
              <h1 class="fontBold text-2xl text-center">Verify Invoice</h1>

              <div class="flex justify-center mt-5">
                <img src="./assets/img/notpaid.png" alt="">
              </div>

              <p class="text-center mt-2 text-xl">This invoice has not been paid!!</p>

              <p class="text-center mt-3 text-sm text-lg">Please pay before the due date</p>

              <div class="flex justify-center">
                <div class="flex justify-between mt-4 gap-3">
                  <a href="index.html" class="outline-btn flex gap-3 items-center px-10" type="button">
                    <span>Return to the homepage</span>
                  </a>

                  <button type="button" id="payNowNow" class="button flex gap-3 items-center px-10">
                    <span>Preview & Pay Now</span>
                  </button>
                </div>
              </div>
            `)
            sessionStorage.setItem("invoice_number", invoiceNumber)

            $("#payNowNow").on("click", function () {
              nextPrev(1)
              openInvoice(invoiceNumber)
            })

          } else if (data.message.payment_status == "paid") {

            // $(".verifiyer").html("<p class='text-[green] text-sm'>Paid</p>")
            $("#verifyInvoice").removeClass("hidden")

            // $("#payment").remove() 
            $("#verInvv").html(`
              <h1 class="fontBold text-2xl text-center">Verify Invoice</h1>

              <div class="flex justify-center mt-5">
                <img src="./assets/img/verify.png" alt="">
              </div>

              <p class="text-center mt-2 text-xl">This invoice has been paid</p>


              <div class="flex justify-center">
                <div class="flex justify-between mt-4 gap-3">
                  <button type="button" class="outline-btn flex gap-3 items-center px-10" id="payNowNow" type="button">
                    <span>View Receipt</span>
                  </button>

                  <a href="index.html" class="button flex gap-3 items-center px-10">
                    <span>Return to home page</span>
                    <iconify-icon icon="eva:arrow-forward-outline" class="text-xl"></iconify-icon>
                  </a>
                </div>
              </div>
            `)
            sessionStorage.setItem("invoice_number", invoiceNumber)

            $("#payNowNow").on("click", function () {
              openReceipt(invoiceNumber)
              nextPrev(3)
              // openInvoice()
            })
          }
        } else if (data.status === 0) {
          $(".verifiyer").html(`<p class='text-[#ff0000] text-sm'>invoice number "<span class="fontBold textPrimary">${invoiceNumber}"</span> was not found</p>`)
          $("#verifyInvoice").removeClass("hidden")
        }
      })
  )


})