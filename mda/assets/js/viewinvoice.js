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
  
  function editoo() {
    let theBal = $(".theBal").text();
  
    $(".showEorAp").html(`
      <button class="textPrimary gap-2 flex items-center" id="applyBtn">
        <i class="fas fa-check"></i>
        <span>Apply</span>
      </button>
    `);
  
    $("#showBal").html(`
        <input type="number" id="inpBal" class="p-[5px] outline-none w-[100px] rounded-lg border border-gray-500" value="${theBal}" />
      `);
  
    $("#applyBtn").on("click", function () {
      $(".showEorAp").html(`
          <button class="textPrimary gap-2 flex items-center" id="editBtn">
            <i class="fas fa-pen"></i>
            <span>Edit</span>
          </button>
        `);
      $("#editBtn").on("click", function () {
        editoo();
      });
      let theFBal = $("#inpBal").val();
  
      $("#showBal").html(`
          &#8358; <span class="theBal">${theFBal}</span>
        `);
      $("#amword").html(convertNumberToWords(theFBal))
      $("#balancing").html("N" + (theBal - theFBal))
      $("#balancing").removeClass("hidden")
      $("#balancingBB").removeClass("hidden")
    });
  }
  
  async function openInvoice(invoicenum) {
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
        $("#invoiceCard").html(`
            <div class="invoicetop"></div>
  
            <div class="flex px-6 pt-3 items-center justify-between">
  
              <h1 class="fontBold text-2xl">Invoice</h1>
  
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
                    <td class="textPrimary">
                    </td>
                    <td class="text-xl textPrimary fontBold">
                      <div id="showBal">
                       &#8358; <span class="theBal">${invoice_info.COL_6}</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2"></td>
                    <td></td>
                    <td id="balancing" class="hidden text-lg textPrimary fontBold pb-0 text-right"></td>
                  </tr>
                  <tr>
                    <td colspan="2"></td>
                    <td></td>
                    <td id="balancingBB" class="hidden text-lg fontBold pb-0 text-right">Balance</td>
                  </tr>
                  <tr>
                    <td colspan="4" class="text-sm text-[#000] pb-0">Amount in words</td>
                  </tr>
                  <tr>
                    <td colspan="4" class="text-sm text-[#555555] pt-0 text-capitalize"><span id="amword">${convertNumberToWords(invoice_info.COL_6)}</span> Naira Only</td>
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
  
  
  
  let urlParams = new URLSearchParams(window.location.search);
  const load = urlParams.get('load')
  const invoicenumber = urlParams.get('invnumber')
  

    openInvoice(invoicenumber)

  