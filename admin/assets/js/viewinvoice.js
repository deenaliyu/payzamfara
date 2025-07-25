function printInvoice(thecard) {
  var originalContent = document.body.innerHTML;
  var printContent = document.getElementById(thecard).innerHTML;


  document.body.innerHTML = printContent;
  window.print();
  document.body.innerHTML = originalContent;

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
    pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
    for (var i = 1; i <= totalPDFPages; i++) {
      pdf.addPage(PDF_Width, PDF_Height);
      pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
    }
    pdf.save(thecard + ".pdf");
  });

}

let urlParames = new URLSearchParams(window.location.search);
const invoicenumbere = urlParames.get('invnumber')

async function checkTheInvoice() {
    const response = await fetch(`${HOST}?getSingleInvoice&invoiceNumber=${invoicenumbere}`);
    const userInvoices = await response.json();
  
    //   console.log(userInvoices);
    
    if(userInvoices.message[0].invoice_type === "demand notice") {
        $("#normalInvoiceCont").removeClass('hidden')
        $("#myTab").removeClass('hidden')
    } else {
      
    }
}

checkTheInvoice()
