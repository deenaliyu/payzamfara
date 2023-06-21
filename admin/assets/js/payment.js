function convertNumberToWords(number) {
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const tens = ['', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const teens = ['eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  
    if (number === 0) {
      return 'zero';
    }
  
    if (number < 0) {
      return 'minus ' + convertNumberToWords(Math.abs(number));
    }
  
    let words = '';
  
    if (Math.floor(number / 1000000) > 0) {
      words += convertNumberToWords(Math.floor(number / 1000000)) + ' million ';
      number %= 1000000;
    }
  
    if (Math.floor(number / 1000) > 0) {
      words += convertNumberToWords(Math.floor(number / 1000)) + ' thousand ';
      number %= 1000;
    }
  
    if (Math.floor(number / 100) > 0) {
      words += convertNumberToWords(Math.floor(number / 100)) + ' hundred ';
      number %= 100;
    }
  
    if (number > 0) {
      if (words !== '') {
        words += 'and ';
      }
  
      if (number < 10) {
        words += ones[number];
      } else if (number < 20) {
        words += teens[number - 11];
      } else {
        words += tens[Math.floor(number / 10)];
        if (number % 10 > 0) {
          words += '-' + ones[number % 10];
        }
      }
    }
  
    return words.trim();
  }


async function openReceipt(invoicenumber) {
  console.log(invoicenumber)

  const response = await fetch(
    `${HOST}/php/index.php?getSingleInvoice&invoiceNumber=${invoicenumber}`
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
                    <td colspan="2" class="text-[#000]">Paid</td>
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
                  <p class="text-xl fontBold pb-0">Pay Zamfara</p>
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

let urlParams = new URLSearchParams(window.location.search);
const load = urlParams.get('load')
const invoicenumber = urlParams.get('invnumber')

openReceipt(invoicenumber) 

function downloadInvoice(thecard) {
  const element = document.getElementById(thecard);

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
    $("#" + thecard).hide();
  });

}


function generateRandomString() {
  const timestamp = new Date().getTime().toString(); // Get current timestamp as a string
  const randomNum = Math.random().toString(36).substr(2, 8); // Generate a random alphanumeric string
  const randomString = timestamp + randomNum; // Combine timestamp and random string
  return randomString;
}