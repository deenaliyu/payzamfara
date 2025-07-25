function formatMoney(amount) {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'NGN', // Change this to your desired currency code
    minimumFractionDigits: 2,
  });
}

function sumArray(numbers) {
  return numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}

var qr_codeScript = document.createElement('script')
qr_codeScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js')
document.head.appendChild(qr_codeScript)

let invoicenum2 = ""

function add30Days(date) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 30);
    
    // Formatting to YYYY-MM-DD
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0'); // Ensure two digits
    const day = String(newDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

let textAssessment =  "If you object to any charges on the consolidated notice of assessment, you have 30 days to submit a written objection. For personal income tax objections, refer to section 54(1) of PITA 2004 as amended. Other objections should be directed to the ZIRS and will be reviewed according to the relevant legislation. Please pay any undisputed charges promptly to avoid accruing interest and penalties"
let textDemand = "You are required to present this Notice at any IGR collecting bank for payment or pay online via the Payzamfara portal. "
    
function displayDemandNotice(demandInvoiceInfo, heading, the_date, the2item) {
    let demandInvoice = ""
    
    demandInvoice += `
        <div class="demanInvoiceBody w-fit bg-white">
            <!--header-->
            <div class="flex justify-between mb-2">
                <div class="flex gap-3 w-7/12">
                    <div>
                        <img src="./assets/img/internalzamfara.png" class='w-[80px] object-cover' alt="" />
                        <h1 class="text-3xl text-center">TO</h1>
                    </div>
                    <div class="h-full border border-2" style="border-color: #000 !important"></div>
                    <div class='w-[50%]'>
                        <h1 class="fontBold text-sm headingdeman">ZAMFARA STATE<br /> INTERNAL REVENUE<br /> SERVICE (ZIRS)</h1>
                        <div class="border border-2 p-2 w-full" style="border-color: #000 !important;">
                            <p class="text-xs"><strong class='fontBold'>BUSINESS TYPE:</strong> <span class="text-xs">${demandInvoiceInfo[0].business_type ? demandInvoiceInfo[0].business_type : '-'}</span></p>
                            <p class="text-xs"><strong class='fontBold'>NAME:</strong> <span class="text-xs">${demandInvoiceInfo[0].first_name} ${demandInvoiceInfo[0].surname}</span></p>
                            <p class="text-xs"><strong class='fontBold'>PHONE:</strong> <span class="text-xss">${demandInvoiceInfo[0].phone}</span></p>
                             <p class="text-xs"><strong class='fontBold'>ADDRESS:</strong> <span class="text-xss">${demandInvoiceInfo[0].address}</span></p>
                        </div>
                    </div>
                </div>
                
                <div class="w-5/12" style="margin-right: 10px !important">
                    <div class="flex justify-center">
                        <img src="./assets/img/coa.png" alt="" />   
                    </div>
                    <h1 class="fontBold text-sm text-center headingdeman">${heading}</h1>
                    <div class="border border-2 p-2 md:pr-[80px] pr-[40px]" style="border-color: #000 !important;">
                        <p class="text-xs"><strong class='fontBold'>TIN NO:</strong> <span class="text-xs">${demandInvoiceInfo[0].tin ? demandInvoiceInfo[0].tin  : '-'}</span></p>
                        <p class="text-xs"><strong class='fontBold'>FILE NO:</strong> <span class="text-xs">${demandInvoiceInfo[0].file_no ? demandInvoiceInfo[0].file_no  : '-'}</span></p>
                        <p class="text-xs"><strong class='fontBold'>DEMAND NOTICE NO:</strong> <span class="text-xs">${demandInvoiceInfo[0].invoice_number}</span></p>
                        <p class="text-xs"><strong class='fontBold'>DATE:</strong> <span class="text-xs">${the_date}</span></p>
                        
                    </div>
                </div>
            </div>
            
            <p class='p-1 bg-[#5B4242] text-white w-fit text-xs fontBold'>IN ACCORDANCE WITH THE PROVISIONS OF RELEVANT LAWS</p>
            <div class="mt-1">
                <p class="text-xs mb-2">Section 88(1a) and 11(f) of Personal Income Tax Act (PITA) 2011 and Section 142 & 143f State Consolidated Revenue Law 2020, as amended First,  Second, Third and Fourth Schedule Approved list of collections.</p>
               
            </div>
            
            <!--body-->
            
            
            <table class="table table-bordered mt-1 invTable">
                <thead>
                    <tr>
                        <th class='text-xs'>S/N</th>
                        <th class='text-xs'>AGENCY</th>
                        <th class='text-xs'>REVENUE ITEM</th>
                        <th class='text-xs'>CURRENT YEAR (${demandInvoiceInfo[0].date_created.split('-')[0]})</th>
                        <th class='text-xs'>OUTSTANDING YEAR (${demandInvoiceInfo[0].previous_year ? demandInvoiceInfo[0].previous_year : '-'})</th>
                        <th class='text-xs'>AGENCY CODE</th>
                        <th class='text-xs'>REVENUE CODE</th>
                    </tr>
                </thead>
                <tbody>
        `     
        TheDemandTotal = []
        demandInvoiceInfo.forEach((demandnot, i) => {
            demandInvoice += `            
                <tr>
                    <td class='text-xs'>${i+1}</td>
                    <td class='text-xs'>${demandnot.COL_3}</td>
                    <td class='text-xs'>${demandnot.COL_4}</td>
                    <td class='text-xs'>${formatMoney(parseFloat(demandnot.amount_paid))}</td>
                    <td class='text-xs'>${demandnot.previous_year_value ? formatMoney(parseFloat(demandnot.previous_year_value)) : 'Nil'}</td>
                    <td class='text-xs'>-</td>
                    <td class='text-xs'>${demandnot['COL_2']}</td>
                </tr>
            ` 
            TheDemandTotal.push(parseFloat(demandnot.amount_paid))
            if(demandnot.previous_year_value && demandnot.previous_year_value > 0) {
                TheDemandTotal.push(parseFloat(demandnot.previous_year_value))  
            }
            
        })           
        demandInvoice +=`            
                    <tr>
                        <td colspan="8">
                            <div class="flex justify-center">
                                <p class=" text-center p-1 bg-[#5B4242] text-white w-[80%] text-xs fontBold">IMPORTANT NOTICE</p>    
                            </div>
                            
                            <ol style='font-size:10px; list-style-type: decimal; padding-left: 20px'>
                                <li> Unless the debt mentioned above is paid within one month from the date hereof, or proof of earlier payment of the said amount is produced as requested , an action will be commenced against you in a court of competent Jurisdiction.</li>
                                <li>${the2item}</li>
                                <li>You are required to obtain a teller from the bank, an E-receipt from the payzamfara portal or any ZIRS Tax Station close to you.</li>
                            </ol>
                        </td>
                    </tr>
                </tbody>
            </table>
            
            <p class="text-danger text-center fontBold -mt-2">IT IS AN OFFENSE TO PAY CASH TO ANYBODY</p>
            
            <table class="table table-bordered invTable">
                <tbody>
                    <tr>
                        <td rowspan="2">
                            <p class=" text-center p-1 bg-[#5B4242] text-white text-xs fontBold">MAKING PAYMENT VIA BANK BRANCH TRANSACTIONS</p> 
                            
                            <ol style='font-size:10px; list-style-type: decimal; padding-left: 20px'>
                                <li>Visit any Bank Branch near you with the Consolidated Demand Notice.</li>
                                <li>Present the consolidated demand notice number to the teller.</li>
                                <li>The teller will enter the demand notice number to validate and load your details.</li>
                                <li>Confirm your details in the preview page.</li>
                                <li>Make your payments via cash or cheque, and ensure it is processed through any of the following gateways: PayDirect, Etransact and Remita.</li>
                                <li>Ensure you obtain a receipt from the bank teller upon completing payment.</li>
                                <li>Bring the receipt to the ZIRS head office or any of our Tax stations to obtain your official ZIRS hardcopy receipt. You can also retrieve your E-receipt on the Payzamfara portal.</li>
                            </ol>
                        </td>
                        <td>
                            
                            <h1 class="text-xl fontBold" id="theBal" data-money="${parseFloat(sumArray(TheDemandTotal))}">TOTAL ${formatMoney(parseFloat( sumArray(TheDemandTotal) )) }</h1>    
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p class=" text-center p-1 bg-[#5B4242] text-white text-xs fontBold">HOW TO PAY ONLINE</p> 
                            <ol style='font-size:10px; list-style-type: decimal; padding-left: 20px'>
                                <li>Visit <span class="underline text-[blue]">www.payzamfara.com</span> from your mobile or Computer.</li>
                                <li>Click on “Pay Now” on the homepage.</li>
                                <li>Enter your Demand Notice Number and click on proceed.</li>
                                <li>Preview the Your CDN and proceed to pay.</li>
                                <li>Select your preferred method and make payment.</li>
                                <li>Your e-receipt is now available.</li>
                            </ol>
                        </td>
                    </tr>
                </tbody>
            </table>
            
            <div class="flex justify-between items-center">
                <div>
                    <div class='flex justify-center'>
                        <img src='./assets/img/rakiya_signature.png' class='w-[200px]' alt='' />
                    </div>
                    <div class="border border-2 w-[200px]" style="border-color: #000 !important"></div>
                    <p class="fontBold text-xs text-center">Rakiya Ahmad Dodo</p>
                    <p class="fontBold text-xs text-center">Executive Chairman</p>
                </div>
                
                <div>
                    <div id="qrContainerDemand" class="w-[150px]"></div>
                </div>
                
                <div class="border border-1 p-2  lg:pr-[100px] pr-[30px]" style="border-color: #000 !important;">
                    <p class="text-xs fontBold text-center">HAVING ISSUES WITH YOUR  PAYMENT,</p>
                    <p class="text-xs fontBold text-center">EMAIL OR CALL </p>
                    <p class="text-xs fontBold text-center">ict@irs.zm.gov.ng</p>
                    <p class="text-xs fontBold text-center">+2347060403146, +2349033509195</p>
                </div>
            </div>
            
            
        </div>
    `
    
    return demandInvoice
}                
async function openInvoice(invoicenum, price) {
  // console.log(price)
  invoicenum2 = invoicenum

  const response = await fetch(
    `${HOST}?getSingleInvoice&invoiceNumber=${invoicenum}`
  );
  const userInvoices = await response.json();
  console.log(userInvoices);

    if (userInvoices.status === 1) {
        let invoice_info = userInvoices.message[0]
    
        // TOTAL INVOICE BEGIN
    
            let TotalInvoice = ""
        
            TotalInvoice += `
                <div class="invoicetop"></div>
            
                <div class="flex px-6 pt-3 items-center justify-between">
            
                    <h1 class="fontBold text-2xl">Invoice</h1>
                
                    
                    <div class="flex items-center gap-1">
                        <img src="./assets/img/vector.png" alt="">
                        <p class="text-2xl fontBold">${invoice_info.invoice_number}</p>
                    </div>
                    
                    
                    
            
                </div>
                
                <div class="flex justify-between">
                    <img src="./assets/img/akwaimage.png" alt="" class="w-[100px] h-[70px]">
                    
                    <div id="qrContainer" class="w-[200px] pr-4 mt-3"></div>
                </div>
            `
        
            if (userInvoices.message.length > 1) { // If invoice has multiple Items
                TotalInvoice += `
                    <div class="flex  justify-between px-6 mt-4">
                        <div class="w-full">
                            <p class="text-[#555555]">FROM :</p>
                            <p class="fontBold">Zamfara State</p>
                        </div>
                
                        <div class="w-full">
                            <p class="text-[#555555]">TO :</p>
                            <p class="fontBold text-left">${invoice_info.surname} ${invoice_info.first_name}</p>
                            <p class="text-[#222234] text-sm md:w-[60%]">${invoice_info.address}, Zamfara</p>
                        </div>
                    </div>
                `
            } else {
                TotalInvoice += `
                    <div class="flex  justify-between px-6 mt-4">
                        <div class="w-full">
                            <p class="text-[#555555]">FROM :</p>
                            <p class="fontBold">${invoice_info.COL_3}</p>
                            <p class="text-[#222234] w-[60%] text-sm">Zamfara</p>
                            </div>
                    
                            <div class="w-full">
                            <p class="text-[#555555]">TO :</p>
                            <p class="fontBold text-left">${invoice_info.surname} ${invoice_info.first_name}</p>
                            <p class="text-[#222234] text-sm md:w-[60%]">${invoice_info.address}, Zamfara</p>
                        </div>
                    </div>
                `
            }
        
            TotalInvoice += `
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
            `
        
            let theTotal = []
            let theOutstandingTotal = []
            let subTotal = []
            TotalInvoice += `
              <div class="px-6">
                <table class="table table-borderless table-sm">
                  <thead>
                    <tr class="bg-[#005826]">
                      <td class="text-[#fff] text-sm">ITEM DESCRIPTION</td>
                      <td class="text-[#fff] text-sm">QTY</td>
                      <td class="text-[#fff] text-sm">RATE</td>
                      <td class="text-[#fff] text-sm">AMOUNT</td>
                    </tr>
                  </thead>
                  <tbody>
             `
    
            userInvoices.message.forEach(element => {
                TotalInvoice += `
                  <tr>
                    <td class="text-sm">${element.COL_4}</td>
                    <td class="text-sm">01</td>
                    <td class="text-sm">${element.amount_paid}</td>
                    <td class="text-sm">${formatMoney(parseFloat(element.amount_paid))}</td>
                  </tr>
                `
                theTotal.push(parseFloat(element.amount_paid))
                subTotal.push(parseFloat(element.amount_paid))
                if(element.invoice_type === "demand notice" && element.previous_year_value && element.previous_year_value > 0) {
                    theTotal.push(parseFloat(element.previous_year_value)) 
                }
                theOutstandingTotal.push(parseFloat(element.previous_year_value))
            });
    
            TotalInvoice += `
                        <tr class="border-t border-[#6F6F84]">
                            <td class="text-[#555555] text-sm">Sub Total</td>
                            <td></td>
                            <td></td>
                            <td class="text-[#000] text-sm fontBold">${formatMoney(sumArray(subTotal))}</td>
                        </tr>
                        ${invoice_info.invoice_type === "demand notice" ? `
                            <tr>
                                <td class="text-[#555555] text-sm">Outstanding</td>
                                <td></td>
                                <td></td>
                                <td class="text-[#000] text-sm">${formatMoney(sumArray(theOutstandingTotal))}</td>
                            </tr>
                        ` : ''}
                        <tr>
                            <td class="text-[#555555] text-sm">Discount</td>
                            <td></td>
                            <td></td>
                            <td class="text-[#000] text-sm">NGN0.00</td>
                        </tr>
                        <tr>
                            <td colspan="3" class="text-[#000]">Grand Total<span class="text-[#555555]"> (NGN)</span></td>
                            <td class="text-[#000] text-xl fontBold">${formatMoney(sumArray(theTotal))}</td>
                            <span class="d-none" id="theBal" data-money="${parseFloat(sumArray(theTotal))}">${formatMoney(sumArray(theTotal))}</span>
                        </tr>
                        <tr>
                            <td colspan="4" class="text-sm text-[#000] pb-0">Amount in words</td>
                        </tr>
                        <tr>
                          <td colspan="4" class="text-sm text-gray-500 pt-0 text-capitalize"><span id="amword">${convertNumberToWords(sumArray(theTotal))} Only</span> </td>
                        </tr>
                    </tbody>
                    </table>  
                </div>
            `
        
        
            TotalInvoice += `
                <hr class="my-4 md:mx-10 mx-4">
            
                <div class="md:px-10 px-2 pb-6">
                    <div class="flex items-center justify-center">
                        <div class="">
                            <img src="./assets/img/akwaimage.png" alt="" class="w-[100px] h-[70px]">
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
            // TOTAL INVOICE END
            
            if  (invoice_info.invoice_type === "demand notice") {
        
                 
                let demandInvoiceInfo = userInvoices.message
                
                let normalDate = demandInvoiceInfo[0].date_created.split(" ")[0]
                
                
                
                $("#invoiceCard").html(displayDemandNotice(demandInvoiceInfo, "CONSOLIDATED <br/> DEMAND NOTICE", add30Days(normalDate), textDemand))
                $("#assessmentDemandNotice").html(displayDemandNotice(demandInvoiceInfo, "CONSOLIDATED NOTICE <br/> OF ASSESSMENT", normalDate, textAssessment))
                
                $("#invoiceCardSecond").html(TotalInvoice)
                
                const qrCodeContainerD = document.getElementById("qrContainerDemand")
                
                const qrCode = new QRCode(qrCodeContainerD, {
                  text: `https://payzamfara.com/admin/viewinvoice.html?invnumber=${invoicenum}&load=true`,
                  colorDark: '#000000',
                  colorLight: '#ffffff',
                  version: 10,
                });
                
                const qrCodeContainerI = document.getElementById("qrContainer")
                
                const qrCodeI = new QRCode(qrCodeContainerI, {
                  text: `https://payzamfara.com/admin/viewinvoice.html?invnumber=${invoicenum}&load=true`,
                  colorDark: '#000000',
                  colorLight: '#ffffff',
                  version: 10,
                });
                
            } else {
                $("#invoiceCard").html(TotalInvoice)
                $("#invoiceCardSecond").html(TotalInvoice)
                
                const qrCodeContainer = document.getElementById("qrContainer")
                
                const qrCode = new QRCode(qrCodeContainer, {
                  text: `https://payzamfara.com/viewinvoice.html?invnumber=${invoicenum}&load=true`,
                  colorDark: '#000000',
                  colorLight: '#ffffff',
                  version: 10,
                });
                
            }
            
        
    
    } else {
        
        // IF  INVOICE IS NOT  FOUND 
        
        $("#invoiceCard").html(`
          <div class="invoicetop"></div>
          <div class="flex justify-center items-center h-[60vh]">
            <p class="fontBold text-xl">Invalid Invoice, or expired invoice</p>
          </div>
        `)
    
        let thePP = document.querySelector('.invoiceContainer')
    
        let thSiblings = thePP.nextElementSibling
        let sesinID = JSON.parse(localStorage.getItem("userDataPrime"))
        if (sesinID) {
          thSiblings.innerHTML = `
            <a href="./dashboard/taxes.html" class="button flex gap-3 items-center px-10 mt-6">
              <span>Regenerate Invoice</span>
              <iconify-icon icon="eva:arrow-forward-outline" class="text-xl"></iconify-icon>
            </a>
          `
        } else {
          thSiblings.innerHTML = `
            <a href="./generateinvoice.html" class="button flex gap-3 items-center px-10 mt-6">
              <span>Regenerate Invoice</span>
              <iconify-icon icon="eva:arrow-forward-outline" class="text-xl"></iconify-icon>
            </a>
          `
    }

  }
}

let urlParams = new URLSearchParams(window.location.search);
const load = urlParams.get('load')
const invoicenumber = urlParams.get('invnumber')

if (load) {
  openInvoice(invoicenumber)
}

function goToPayment() {
  sessionStorage.setItem("invoice_number", invoicenumber)
  nextPrev(1)
}

function goToPayment2() {
  sessionStorage.setItem("invoice_number", invoicenum2)
  nextPrev(1)
}

const paying = urlParams.get('paying')
// if (paying) {
//   $("#thePay").html(`
//     <a href="index.html" class="flex items-center gap-2 w-fit">
//       <iconify-icon icon="eva:arrow-back-outline"></iconify-icon>
//       <span>Go Home</span>
//     </a>
//   `)
// } else {
//   $("#thePay").html(`
//     <a href="./dashboard/taxes.html" class="flex items-center gap-2 w-fit">
//       <iconify-icon icon="eva:arrow-back-outline"></iconify-icon>
//       <span>Go back</span>
//     </a>
//   `)
// }
