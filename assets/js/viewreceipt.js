const urlParams = new URLSearchParams(window.location.search);
const invoicenum = urlParams.get('invoice_num');
const finalPay = urlParams.get('amount');
const reference = urlParams.get('reference');

$(document).ready(function() {
	sendPaymentToDb()
});

async function sendPaymentToDb(referencee) {
    let dataToPush = {
      "endpoint": "createInvidualPayment",
      "data": {
        "invoice_number": invoicenum,
        "payment_channel": "Credo",
        "payment_reference_number": reference,
        "receipt_number": reference,
        "amount_paid": finalPay
      }
    }
      
    $.ajax({
      type: "POST",
      url: HOST,
      dataType: 'json',
      data: JSON.stringify(dataToPush),
      success: function (data) {
        // console.log(data)
        
        openReceipt(invoicenum)
      },
      error: function (request, error) {
        console.log(error)
        $("#invoiceCard").html(`A system error occured.....please report this issue.`)
      }
    });
}


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
    pdf.addImage(imgData, 'JPEG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
    for (var i = 1; i <= totalPDFPages; i++) {
      pdf.addPage(PDF_Width, PDF_Height);
      pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
    }
    pdf.save(thecard + ".pdf");
    $("#" + thecard).hide();
  });

}


function printInvoice(thecard) {
  var originalContent = document.body.innerHTML;
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