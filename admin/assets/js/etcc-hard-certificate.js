const urlParamshard = new URLSearchParams(window.location.search);
const theid2 = urlParamshard.get('theid');

async function getEtccDetailsHard() {
    const response = await fetch(`${HOST}/?getETCC&type=ref&id=${theid2}`)
    const etccDetail = await response.json()

    $("#loader").css("display", "none")

    console.log(etccDetail)
    if (etccDetail.status === 0) {

    } else {

        let theEtcDetail = etccDetail.message[0]

        $("#receiptHardCopy").html(`
  
            <div class="px-6" style="height: 260px">
                <div class="flex justify-end mt-5">
                    <div>
                        <div>
                            <p class="text-sm text-center">Certificate Number</p>
                            <div class="border border-2 p-2" style="border: 2px solid #000 !important">
                                <p class"text-xs" style="color: brown">${theEtcDetail.etcc_no}</p>
                            </div>
                        </div>

                        <div class="flex justify-center mt-4">
                            <div id="qrContainer" class="w-[100px] h-[100px]"></div>
                        </div>

                    </div>
                </div>
            </div>
    
            <div class="px-6 mt-4">
            <table>
                <tr>
                <th class="fontBold text-black pr-4">Name:</th>
                <td>${theEtcDetail.fullname}</td>
                </tr>
                <tr>
                <th class="fontBold text-black pr-4">Email:</th>
                <td>${theEtcDetail.email}</td>
                </tr>
                <tr>
                <th class="fontBold text-black pr-4">Address:</th>
                <td>${theEtcDetail.address}</td>
                </tr>
                <tr>
                <th class="fontBold text-black pr-4">TIN:</th>
                <td>${theEtcDetail.applicant_tin}</td>
                </tr>
                <tr>
                <th class="fontBold text-black pr-4">Sector:</th>
                <td>${theEtcDetail.sector}</td>
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
                <tr>
                    <td class="text-sm">Year</td>
                    <td class="text-sm">Total Income</td>
                    <td class="text-sm">Taxable Income </td>
                    <td class="text-sm">Tax Paid</td>
                </tr>
                </thead>
                <tbody>
    
                <tr>
                    <td class="text-sm">${theEtcDetail.year1}</td>
                    <td class="text-sm">₦ ${parseFloat(theEtcDetail.income1).toLocaleString()}</td>
                    <td class="text-sm">₦ ${parseFloat(theEtcDetail.income1).toLocaleString()}</td>
                    <td class="text-sm">₦ ${parseFloat(theEtcDetail.tax_paid_3).toLocaleString()}</td>
                </tr>
                <tr>
                    <td class="text-sm">${theEtcDetail.year2}</td>
                    <td class="text-sm">₦ ${parseFloat(theEtcDetail.income2).toLocaleString()}</td>
                    <td class="text-sm">₦ ${parseFloat(theEtcDetail.income2).toLocaleString()}</td>
                    <td class="text-sm">₦ ${parseFloat(theEtcDetail.tax_paid_3).toLocaleString()}</td>
                </tr>
                <tr>
                    <td class="text-sm">${theEtcDetail.year3}</td>
                    <td class="text-sm">₦ ${parseFloat(theEtcDetail.income3).toLocaleString()}</td>
                    <td class="text-sm">₦ ${parseFloat(theEtcDetail.income3).toLocaleString()}</td>
                    <td class="text-sm">₦ ${parseFloat(theEtcDetail.tax_paid_3).toLocaleString()}</td>
                </tr>
    
                </tbody>
            </table>
    
            <table>
                <tr>
                <th class="text-black fontBold pr-4">Source of Income:</th>
                <td>${theEtcDetail.sector ? theEtcDetail.sector : ''}</td>
                </tr>
                <tr>
                <th class="text-black fontBold pr-4">Expiry Date:</th>
                <td>Dec 31, 2024</td>
                </tr>
            </table>
            </div>
    
    
            <div class="flex justify-around items-center px-6 mt-5">
    
            <div class="sig1 w-4/12">
                <div class="border-b-2"></div>
                <p class="fontBold text-black text-center mt-1">Official date and stamp</p>
            </div>
    
    
            <div class="sig2 w-4/12">
                <div class="border-b-2"></div>
                <p class="fontBold text-black text-center mt-1">Official date and stamp</p>
            </div>
    
            </div>
    
            <p class="text-center">Three yeas(s) copies of Official receipts MUST be attached to this certificate to
            make it valid</p>
    
            <hr class="my-3 md:mx-10 mx-4">
            <p class="text-center text-xs fontBold">NB: ANY CORRECTION OR ALTERATION MAKE THIS CERTIFICATE INVALID</p>
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


getEtccDetailsHard()

function printInvoiceHard(thecard) {
    var originalContent = document.body.innerHTML;
  
    document.querySelector("#receiptHardCopy").classList.remove('hidden')
  
    var printContent = document.getElementById(thecard).innerHTML;
  
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
  
  }