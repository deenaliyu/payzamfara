let urlParams = new URLSearchParams(window.location.search);
const referenceNumber = urlParams.get('reference')

async function generateCertificate() {

  const response = await fetch(
    `${HOST}/php/index.php?getTaxClearanceByReference&reference=${referenceNumber}`
  );
  const taxCertificates = await response.json();
  console.log(taxCertificates);

  if (taxCertificates.status === 1) {
    taxCertificates.message.forEach((tax_certificate, i) => {
      $("#taxCertificate").html(`
        <div class="invoicetop"></div>

        <div class="flex justify-center mt-4">
          <div class="flex items-center">
            <img src="./assets/img/akwaimage.png" alt="">
            <h1 class="text-xl">Pay Ibom</h1>
          </div>
        </div>

        <section class="px-3 mt-4">
          <p class="text-lg">TAX CLEARANCE CERTIFICATE</p>

          <div class="flex justify-between items-center">

            <table class="table-sm table-borderless">
              <tr>
                <th>Name of Individual:</th>
                <td>${tax_certificate.surname}, ${tax_certificate.first_name} ${tax_certificate.middle_name}</td>
              </tr>
              <tr>
                <th>RC No.:</th>
                <td>123456</td>
              </tr>
              <tr>
                <th>TIN:</th>
                <td>${tax_certificate.tin}</td>
              </tr>
              <tr>
                <th>Payer ID:</th>
                <td>2015511518497</td>
              </tr>
              <tr>
                <th>Business address:</th>
                <td>${tax_certificate.house_no},${tax_certificate.street_name},
                ${tax_certificate.state}, Nigeria, ${tax_certificate.local_area} L.G.A</td>
              </tr>
              <tr>
                <th>Business Status:</th>
                <td>commenced Business 2023/04/06</td>
              </tr>
            </table>

            <table class="table-sm table-borderless">
              <tr>
                <th>TCC No.:</th>
                <td>000001</td>
              </tr>
              <tr>
                <th>Tax Office:</th>
                <td>AKIRS-IKOT EKPENE</td>
              </tr>
              <tr>
                <th>Date:</th>
                <td>${tax_certificate.created_at.split(" ")[0]}</td>
              </tr>
            </table>


          </div>


          <p class="text-sm text-gray-600 mt-4">This is to certify that the above named company has rendered Income Tax,
            Value Added Tax, Information
            Technology,
            Development Levy, Education Tax, as well as other tax returns and paid the assessed taxes in accordance with
            the
            relevant tax laws for all years including the past three years as detailed hereunder</p>


          <table class="mt-4 table table-borderless">
            <thead class="bgPrimary text-white">
              <th></th>
              <th>Assessment Year 2021</th>
              <th>Assessment Year 2022</th>
              <th>Assessment Year 2023</th>
            </thead>
            <tbody class="text-sm">
              <tr>
                <th>Turnover</th>
                <td>0.00</td>
                <td>0.00</td>
                <td>0.00</td>
              </tr>
              <tr>
                <th>Assessible Profit/loss</th>
                <td>0.00</td>
                <td>0.00</td>
                <td>0.00</td>
              </tr>
              <tr>
                <th>Total Profit</th>
                <td>0.00</td>
                <td>0.00</td>
                <td>0.00</td>
              </tr>
              <tr>
                <th>Tax Payable</th>
                <td>0.00</td>
                <td>0.00</td>
                <td>0.00</td>
              </tr>
              <tr>
                <th>Tax Outstanding (if any)</th>
                <td>0.00</td>
                <td>0.00</td>
                <td>0.00</td>
              </tr>
            </tbody>
          </table>

          <table>
            <tr>
              <th class="text-sm">Source of Income</th>
              <td class="text-gray-500 pl-4 text-sm">other personal services</td>
            </tr>
            <tr>
              <th class="text-sm">Other comments:</th>
              <td class="text-gray-500 pl-4 text-sm">COMPANY HAS COMMENCED BUSINESS IN MARCH 2021</td>
            </tr>
            <tr>
              <th class="text-sm">The certificate expires on:</th>
              <td class="text-gray-500 pl-4 text-sm">31/12/2024</td>
            </tr>
          </table>



          <div class="flex justify-between mt-5 items-center">
            <div>
              <p>&nbsp; <br> &nbsp;</p>
              <hr>
              <p>Official stamp Impression</p>
            </div>

            <div>
              <p class="text-center text-sm text-gray-600">David Adebola<br>
                Tax controller, AKIRS</p>
              <hr>
              <p>Name & Rank of Approving officer</p>
            </div>
          </div>
        </section>

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

  } else {
    $("#taxCertificate").html(`Invalid Number reference number`)
  }
}

generateCertificate()