const urlParams = new URLSearchParams(window.location.search);
const theid = urlParams.get('theid');

var qr_codeScript = document.createElement('script')
qr_codeScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js')
document.head.appendChild(qr_codeScript)

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

    $("#previewCard").html(`
      <div class="invoicetop"></div>

      <div class="flex items-center px-6 gap-2 mt-3">
        <img src="./assets/img/akwaimage.png" alt="">
        <div>
          <p class="text-xl fontBold pb-0">Plateau State Internal Revenue Service</p>
        </div>
      </div>

      <div class="flex items-center gap-x-3 flex-wrap mt-4 px-6">
        <p class="text-base flex items-center gap-1 text-[#000]"><iconify-icon
            icon="mdi:address-marker-outline"></iconify-icon><span>No.6 Ban Road P.M.B 2001, Jos, Plateau
            State
            Nigeria.</span></p>
        <p class="text-base flex items-center gap-1 text-[#000]"><iconify-icon
            icon="ic:outline-email"></iconify-icon> <span>Info@psirs.gov.ng</span></p>
        <p class="text-base flex items-center gap-1 text-[#000]"><iconify-icon
            icon="ic:round-phone"></iconify-icon> <span>08031230301, 07056990777</span></p>
        <p class="text-base flex items-center gap-1 text-[#000]"><iconify-icon
            icon="streamline:web"></iconify-icon> <span>www.payzamfara.com</span></p>
      </div>

      <div class="flex justify-between px-6 mt-4">
        <h1 class="text-xl fontBold text-black">TAX CLEARANCE CERTIFICATE</h1>

        <p><span class="text-lg fontBold text-black">Certificate Number:</span> ${theEtcDetail.etcc_no}</p>
      </div>

      <div class="px-6 mt-4">
        <table>
          <tr>
            <th class="fontBold text-black pr-4">Name:</th>
            <td>${theEtcDetail.fullname}</td>
          </tr>
          <!-- <tr>
            <th class="fontBold text-black pr-4">Email:</th>
            <td>gukus@gmail.com</td>
          </tr> -->
          <tr>
            <th class="fontBold text-black pr-4">Address:</th>
            <td>Office: kkk test address</td>
          </tr>
          <tr>
            <th class="fontBold text-black pr-4">TIN:</th>
            <td>${theEtcDetail.applicant_tin}</td>
          </tr>
          <tr>
            <th class="fontBold text-black pr-4">Sector:</th>
            <td>${theEtcDetail.applicant_tin === "1" ? 'Private' : 'Public'}</td>
          </tr>
        </table>
      </div>

      <p class="px-6">This is to certify that Taxpayer with Tax Identification Number <span
          class="text-lg fontBold text-black">${theEtcDetail.applicant_tin}</span> has settled his/her tax
        assessment for the following 2 year(s) for the specified source of income.</p>

      <div class="px-6 mt-4">
        <p class="fontBold text-xl text-black mb-2">Details of Assessment</p>

        <table class="table table-borderless table-sm">
          <thead>
            <tr class="bg-[#CDA545]">
              <td class="text-[#fff] text-sm">Year</td>
              <td class="text-[#fff] text-sm">Total Income</td>
              <td class="text-[#fff] text-sm">Taxable Income </td>
              <td class="text-[#fff] text-sm">Tax Paid</td>
            </tr>
          </thead>
          <tbody>

            <tr>
              <td class="text-sm">${theEtcDetail.year1}</td>
              <td class="text-sm">${formatMoney(theEtcDetail.income1)}</td>
              <td class="text-sm">${formatMoney(theEtcDetail.income1)}</td>
              <td class="text-sm">${formatMoney(theEtcDetail.tax_paid_3)}</td>
            </tr>
            <tr>
              <td class="text-sm">${theEtcDetail.year2}</td>
              <td class="text-sm">${formatMoney(theEtcDetail.income2)}</td>
              <td class="text-sm">${formatMoney(theEtcDetail.income2)}</td>
              <td class="text-sm">${formatMoney(theEtcDetail.tax_paid_3)}</td>
            </tr>
            <tr>
              <td class="text-sm">${theEtcDetail.year3}</td>
              <td class="text-sm">${formatMoney(theEtcDetail.income3)}</td>
              <td class="text-sm">${formatMoney(theEtcDetail.income3)}</td>
              <td class="text-sm">${formatMoney(theEtcDetail.tax_paid_3)}</td>
            </tr>

          </tbody>
        </table>

        <table>
          <tr>
            <th class="text-black fontBold pr-4">Source of Income:</th>
            <td>SALARY</td>
          </tr>
          <tr>
            <th class="text-black fontBold pr-4">Expiry Date:</th>
            <td>Dec 31, 2023</td>
          </tr>
        </table>
      </div>


      <div class="flex justify-around items-center px-6 mt-5">

        <div class="sig1 w-4/12">
          <div class="border-b-2"></div>
          <p class="fontBold text-black text-center mt-1">Official stamp Impression</p>
        </div>

        <div class="w-4/12 flex justify-center">
          <div id="qrContainer" class="w-[100px] h-[100px]"></div>
        </div>

        <div class="sig2 w-4/12">
          <div class="border-b-2"></div>
          <p class="fontBold text-black text-center mt-1">Official date and stamp</p>
        </div>

      </div>

      <p class="text-center mt-2">Three year(s) copies of Official receipts MUST be attached to this certificate to
        make it valid</p>



      <hr class="my-4 md:mx-10 mx-4">

      <div class="md:px-10 px-2 pb-6">
        <div class="flex items-center justify-center gap-2">
          <img src="./assets/img/akwaimage.png" alt="">
          <div>
            <p class="text-md fontBold pb-0">Plateau State Internal Revenue Service</p>
            <div class="flex items-center gap-x-3 flex-wrap">
              <p class="text-sm text-[#6F6F84]">www.payzamfara.com</p>
              <p class="text-sm text-[#6F6F84]">info@psirs.gov.ng</p>
              <p class="text-sm text-[#6F6F84]">07056990777</p>
              <img src="./assets/img/logo1.png" class="h-[30px] w-[70px]" alt="">
            </div>
          </div>
        </div>

      </div>
    `)

    const qrCodeContainer = document.getElementById("qrContainer")

    const qrCode = new QRCode(qrCodeContainer, {
      text: `https://payzamfara.com/dashboard/etcc-preview.html?theid=${theEtcDetail.refe}`,
      colorDark: '#000000',
      colorLight: '#ffffff',
      version: 10,
    });
  }
}


getEtccDetails()

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