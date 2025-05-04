let theRevs = {}
let theCateg = ["", "Corporate", "Individual", "State Agency", "Federal Agency"]
let AllRevs;
let theMda = {}

let userInformation = null

function generateRandomString() {
  var result = '';
  var characters = 'qwertyuiopasdfghjklzxcvbnm';
  var charactersLength = characters.length;

  for (var i = 0; i < 4; i++) {
    var randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }

  return result;
}


async function getAllMda() {
  const response = await fetch(`${HOST}/?getMDAs`)
  const revHeads = await response.json()

  if (revHeads.status === 0) {
  } else {
    theMda = revHeads.message

    // console.log(theMda)
    $("#mda").html(`
      <option disabled selected>Select--</option>
    `)
    revHeads.message.forEach((revHd, i) => {
      $("#mda").append(`
        <option value="${revHd["fullname"]}">${revHd["fullname"]}</option>
      `)

    });

  }
}

getAllMda()

function updateSelectedOption1(selCateg) {
  // Get the select element
  var select1 = document.getElementById("rev_heads");

  // Update the selected option text
  var selectedOption = select1.options[select1.selectedIndex];

  if (selCateg.value === '') {
    $("#otherSec").removeClass("flex")
    $("#otherSec").addClass("hidden")
  } else {
    $("#otherSec").removeClass("hidden")
    $("#otherSec").addClass("flex")
  }
  // document.getElementById("select-search").value = selectedOption.text;
}

function updateSelectedOption() {
  // Get the select element
  var select = document.getElementById("rev_heads");

  // Update the selected option text
  var selectedOption = select.options[select.selectedIndex];
  // document.getElementById("select-search").value = selectedOption.text;
}


async function getAllRevH(theVal) {
  const response = await fetch(`${HOST}/?getMDAsRevenueHeads&mdName=${theVal}`)
  const revHeads = await response.json()

  if (revHeads.status === 0) {
  } else {
    AllRevs = revHeads.message
    //  console.log(revHeads.message)
  }
}

$("input[name='grossInptt']").on("change", function () {
  let val = $(this).val()
  if (val === "monthly") {
    $("#grossContainer").html(`
      <label for="basic_salary">Monthly Gross Income*</label>
      <input type="number" placeholder="Input the monthly gross income" class="form-control genInv directInputs"
        id="basic_salary" required data-name="basic_salary" onblur="calculateTaxLiability('monthly')" data-version="monthly">  
    `)
  } else if (val === "annual") {
    $("#grossContainer").html(`
      <label for="basic_salary">Annual Gross Income*</label>
      <input type="number" placeholder="Input the annual gross income" class="form-control genInv directInputs"
        id="basic_salary" required data-name="basic_salary" onblur="calculateTaxLiability('yearly')" data-version="annual">  
    `)
  } else {
    $("#grossContainer").html(`
      <label for="basic_salary">Tax Liability*</label>
      <input type="number" placeholder="Enter proposed tax liability" class="form-control genInv directInputs"
        id="basic_salary" required data-name="basic_salary" onblur="calculateTaxLiability('tax_liability')" data-version="liability">  
    `)
  }
})

let taxCalculation = null;
async function calculateTaxLiability(version) {

  let requestUrl;
  let basicSalary = document.querySelector(".directInputs[data-name='basic_salary']").value

  if (basicSalary === "") {
    return
  }

  if (version === "yearly") {
    requestUrl = `${HOST}?getMonthlyTaxPay&monthlyIncome=${basicSalary}`
  } else if (version === "monthly") {
    requestUrl = `${HOST}?getMonthlyTaxPay&monthlyIncome=${parseFloat(basicSalary) * 12}`

  } else {
    requestUrl = `${HOST}?getMonthlyTaxPayReverse&monthlyIncome=${basicSalary}`
  }

  //loader
  $("#theCalDisContainer").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)

  try {
    const response = await fetch(requestUrl);
    const resdata = await response.json();

    if (resdata.status === "success") {
      let data = resdata.data;
      taxCalculation = data;

      $("#previewBtn").removeClass("hidden")

      let annualTax = parseFloat(data.monthlyTaxPayable) * 12 || 0
      let monthlyTax = parseFloat(data.monthlyTaxPayable).toLocaleString() || 0
      let consolidatedRelief = parseFloat(data.consolidatedRelief).toLocaleString() || 0
      let chargeableIncome = parseFloat(data.chargeableIncome).toLocaleString() || 0

      let annualGrossIncome = parseFloat(data.annualGrossIncome).toLocaleString() || 0
      let monthlyGrossIncome = parseFloat(data.annualGrossIncome) / 12 || 0


      $("#theCalDisContainer").html(`
        <p class="text-lg font-bold mb-4">Tax Calculation</p>

        ${version === "tax_liability" ? `
            <div class="flex items-center mb-2 gap-2">
              <div class="form-group w-full">
                <label for="">Monthly Gross Income</label>
                <input type="text" class="form-control" readonly value="${monthlyGrossIncome.toLocaleString()}">
              </div>

              <div class="form-group w-full">
                <label for="">Annual Gross Income</label>
                <input type="text" class="form-control" readonly value="${annualGrossIncome}">
              </div>
            </div>
          ` : `

            <div class="form-group w-full mb-2">
              <label for="">${version === 'monthly' ? 'Annual Gross Income' : 'Monthly Gross Income'}</label>
              <input type="text" class="form-control" readonly value="${version === 'monthly' ? annualGrossIncome : monthlyGrossIncome.toLocaleString()}">
            </div>

            <div class="flex items-center mb-2 gap-2">
              <div class="form-group w-full">
                <label for="">Monthly Tax Liabilty</label>
                <input type="text" class="form-control" readonly value="${monthlyTax}">
              </div>

              <div class="form-group w-full">
                <label for="">Annual Tax Liabilty</label>
                <input type="text" class="form-control" readonly value="${annualTax.toLocaleString()}">
              </div>
            </div>
          `}
        

        <div class="flex items-center mb-2 gap-2">
          <div class="form-group w-full">
            <label for="">Consolidated Tax Relief</label>
            <input type="text" class="form-control" readonly value="${consolidatedRelief}">
          </div>

          <div class="form-group w-full">
            <label for="">Taxable Income</label>
            <input type="text" class="form-control" readonly value="${chargeableIncome}">
          </div>
        </div>
        `)




    } else {
      $("#theCalDisContainer").html(`
        <p class="text-danger text-center mt-4 text-lg">Failed to get calculation.</p>
      `);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    $("#theCalDisContainer").html(`
      <p class="text-danger text-center mt-4 text-lg">Failed to get calculation.</p>
    `);
  }
}

async function getIndustriesSectors() {
  try {
    const response = await fetch(`${HOST}?getIndustriesSectors`);
    const resdata = await response.json();

    if (resdata.status === 1) {
      const data = resdata.message;

      const sectors = [...new Set(data.map(item => item.SectorName))];

      const sectorSelect = document.getElementById('sectorSelect');
      sectors.forEach(sector => {
        const option = document.createElement('option');
        option.value = sector;
        option.textContent = sector;
        sectorSelect.appendChild(option);
      });

      sectorSelect.addEventListener('change', () => {
        const selectedSector = sectorSelect.value;

        const filteredIndustries = data.filter(
          item => item.SectorName === selectedSector
        );

        const industrySelect = document.getElementById('industrySelect');
        industrySelect.innerHTML = '<option value="">Select</option>';

        filteredIndustries.forEach(industry => {
          const option = document.createElement('option');
          option.value = industry.IndustryName;
          option.textContent = industry.IndustryName;
          industrySelect.appendChild(option);
        });
      });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

getIndustriesSectors();

// console.log(AllRevs)
function addInput() {

  let theStrng = generateRandomString()

  $("#moreInput").append(`
    <div class="flex items-center gap-3">
      <div class="form-group w-8/12">
        <label for="">What do you want to pay for?*</label>
        <select onchange="updateSelectedOption()" class="${theStrng} h-[40px] inputClass form-select genInv revHeadsss" required id="rev_heads">
        </select>
      </div>

      <div class="form-group w-4/12">
        <label for="">Amount*</label>
        <input type="text" class="form-control genInv thePaymentInput h-[40px] amountTopay" id="amountTopay">
      </div>

      <iconify-icon icon="zondicons:minus-outline" class="cursor-pointer" id="${theStrng}" onclick="removeInpt(this)"></iconify-icon>
    </div>
 
  `)


  const amountInput = document.querySelectorAll('.amountTopay');
  amountInput.forEach(element => {
    element.addEventListener('input', function (e) {
      let inputVal = e.target.value;

      // Immediately return if the first character is a dot to allow ".xx" inputs
      if (inputVal === '.') {
        return;
      }

      // Normalize the input by removing commas and any non-numeric characters except for the decimal point
      let normalizedInput = inputVal.replace(/,/g, '').replace(/[^0-9.]/g, '');

      // Split the input into whole and decimal parts
      let [whole, decimal] = normalizedInput.split('.');

      // Ensure the whole part is only numeric
      whole = whole.replace(/\D/g, '');

      // If there's a decimal part, limit it to two digits
      if (decimal) {
        decimal = decimal.substring(0, 2); // Limit decimal part to two digits
      }

      // Format the whole part with commas
      let formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      // Reconstruct the formatted value
      e.target.value = decimal !== undefined ? `${formattedWhole}.${decimal}` : formattedWhole;
    })
  });

  AllRevs.forEach(dd => {
    $(`.${theStrng}`).append(`
      <option value="${dd.id}">${dd.COL_4}</option>
    `)
  })
  $(`.${theStrng}`).select2()

}

function removeInpt(theIpt) {
  document.getElementById(theIpt.id).parentElement.remove()
}

$(".mda").on("change", function () {
  let theVal = $(this).val()
  // console.log(theVal)
  fetchRevHeads(theVal)
  getAllRevH(theVal)

})

async function fetchRevHeads(theVal) {
  const response = await fetch(`${HOST}/?getMDAsRevenueHeads&mdName=${theVal}`)
  const revHeads = await response.json()

  if (revHeads.status === 0) {
  } else {
    theRevs = revHeads.message
    // console.log(theRevs)
    $("#rev_heads").html(`
      <option disabled selected>Select--</option>
    `)
    revHeads.message.forEach((revHd, i) => {
      $("#rev_heads").append(`
        <option value="${revHd["id"]}">${revHd["COL_4"]}</option>
      `)

    });

  }
}

let userInfo = JSON.parse(localStorage.getItem("userDataPrime"));
// console.log(userInfo)

async function fetchUserDetails() {
  let tinOrEmail = document.querySelector("#tinOrEmail").value;

  // Check if tinOrEmail is empty
  if (!tinOrEmail) {
    return;
  }

  $("#msg_box001").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)
  $("#theFetchBtns").addClass("hidden")

  $.ajax({
    type: "GET",
    url: `${HOST}?checkUsers&data=${tinOrEmail}`,
    dataType: 'json',
    success: function (data) {

      // console.log(data);
      if (data.user) {
        // if User details exists
        userInformation = data.user
        $("#theFetchBtns").removeClass("hidden");
        $("#msg_box001").html(``);

        let allInputs = document.querySelectorAll(".payInputs")

        function selectOptionByText(selectId, matchText) {
          const selectElement = document.getElementById(selectId);

          for (let i = 0; i < selectElement.options.length; i++) {
            if (selectElement.options[i].text === matchText) {
              selectElement.selectedIndex = i;
              break;
            }
          }
        }
        selectOptionByText('category', data.user.category);

        if (data.user.category === "Individual") {

        } else {
          $(`#theName`).html(`
            <div class="form-group w-full">
              <label for="">Organization Name *</label>
              <input type="text" class="form-control payInputs" data-name="first_name"
              placeholder="" value="">
            </div>
      
            <div class="form-group w-full hidden">
              <label for="">Surname *</label>
              <input type="text" class="form-control payInputs" value="&nbsp;" readonly data-name="surname"
              placeholder="" value="">
            </div>
          `)
        }

        allInputs.forEach((inputt, i) => {
          let theValuee = data.user[inputt.dataset.name]
          let theInputt = document.querySelector(`.payInputs[data-name='${inputt.dataset.name}']`)
          if (theInputt) {
            theInputt.value = theValuee
          }
        });

        if (data.user.old_user && data.user.category === "Individual") {
          if (data.user.state === null) {
            selectOptionByText('selectState', "Plateau");
          }

        } else if (data.user.old_user && data.user.category === "Corporate") {
          document.querySelector(".payInputs[data-name='first_name']").value = data.user.company_name
          document.querySelector(".payInputs[data-name='email']").value = data.user.office_email
          document.querySelector(".payInputs[data-name='phone']").value = data.user.office_number

          if (data.user.state === null) {
            selectOptionByText('selectState', "Plateau");
          }
        }
        nextPrev(1)




      } else {
        userInformation = null
        $("#theFetchBtns").removeClass("hidden");
        $("#msg_box001").html(``);
        Swal.fire({
          title: 'Not Found',
          text: "User detail not found in the database! please go back and fill your details manually",
          icon: 'error',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Fill In Manually',
          allowOutsideClick: false
        }).then((result) => {
          if (result.isConfirmed) {
            nextPrev(1);
          }
        });
      }
    },
    error: function (request, error) {
      userInformation = null
      $("#msg_box001").html(`
          <p class="text-danger text-center mt-4 text-lg">Something went wrong, Try Again or Fill Details Manually.</p>
        `);
      $("#theFetchBtns").removeClass("hidden");
      console.log(error);
    }
  });
}

function fillManually() {
  const inputs = document.querySelectorAll('.payInputs');

  inputs.forEach(input => {
    input.value = '';
  });

  const selects = document.querySelectorAll('select.payInputs');
  selects.forEach(select => {
    select.selectedIndex = 0;
  });

  nextPrev(1)
}

function continuePage() {
  let genInv = document.querySelectorAll(".payInputsSec")

  let phonenumber = document.querySelector("#phonenumber")
  let tin = document.querySelector("#tin")

  if (phonenumber.value.length !== 11) {
    alert("Phone number should be equal to 11")
    return;
  }

  for (let i = 0; i < genInv.length; i++) {
    const genn = genInv[i];

    if (genn.required && genn.value === "") {
      alert("Please fill all required field");
      break;
    }

    if (i === genInv.length - 1) {
      nextPrev(1)
    }
  }
}
// theName


let the_id
$(".revHeadsss").on("change", function () {
  let val = $(this).val()
  // console.log(val)
  setPrice(val)
})

let aa = [];
function setPrice(val) {
  let theRevenue = theRevs.filter(rr => rr.id === val)
  // console.log(val, theRevenue)
  $("#amountTopay").val()
  the_id = theRevenue[0].id
  aa["message"] = theRevenue;
}

function formatMoney(amount) {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'NGN', // Change this to your desired currency code
    minimumFractionDigits: 2,
  });
}

function sumArray(numbers) {
  // console.log(numbers)
  return numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}

document.getElementById("category").addEventListener("change", function () {
  const selectedValue = this.value;

  if (selectedValue === "") {
    console.log("No category selected");
  } else if (selectedValue === "2") {
    // INDIVIDUAL
    $("#theName").html(`
      <div class="form-group w-full">
        <label for="">First name *</label>
        <input type="text" class="form-control payInputs" required data-name="first_name"
          placeholder="Enter your first name">
      </div>

      <div class="form-group w-full">
        <label for="">Surname *</label>
        <input type="text" class="form-control payInputs" required data-name="surname"
          placeholder="Enter your surname">
      </div>
  `)
  } else {
    $("#theName").html(`
      <div class="form-group w-full">
        <label for="">Organization Name *</label>
        <input type="text" class="form-control payInputs" required data-name="first_name" placeholder="" value="">
      </div>

      <div class="form-group w-full hidden">
        <label for="">Surname *</label>
        <input type="text" class="form-control payInputs" value="&nbsp;" data-name="surname"
        placeholder="" value="">
      </div>
  `)
  }

});


function goToPreviewPage() {
  let categOfTax = document.querySelector(".selCateg option:checked").textContent
  let payInputs = document.querySelectorAll(".payInputs")
  let BasicSalry = document.querySelector(".directInputs[data-name='basic_salary']")

  if (BasicSalry.value === "") {
    alert("Basic Salary cannot be empty")
    return
  }
  if (categOfTax === "Corporate") {
    $("#theName2").html(`
        <div class="form-group w-full">
          <label for="">Organization Name *</label>
          <input type="text" class="form-control payInputs2" readonly data-name="first_name"
          placeholder="" value="">
        </div>
  
        <div class="form-group w-full hidden">
          <label for="">Surname *</label>
          <input type="text" class="form-control payInputs" value="&nbsp;" readonly data-name="surname"
          placeholder="" value="">
        </div>
    `)
  }


  $('#bill').html(`
    <p>Category: ${$("#category_pre").val()}</p>
    <p>Sector: ${$("#sectorSelect").val()}</p>
    <p>Industry: ${$("#industrySelect").val()}</p>
    <p>Description: ${$("#description").val()}</p>
  `)
  for (let i = 0; i < payInputs.length; i++) {
    const payinput = payInputs[i];

    if (payinput.required && payinput.value === "") {
      alert("Please fill all required field");
      break;
    }

    if (i === payInputs.length - 1) {
      let allInputs = document.querySelectorAll(".payInputs")

      allInputs.forEach((inputt, i) => {
        let theInputt = document.querySelector(`.payInputs2[data-name='${inputt.dataset.name}']`)
        if (theInputt) {
          theInputt.value = inputt.value
        }
      });
      nextPrev(1)

    }
  }

}

async function calculateAssessment(tax_number) {

  let basicSalary = document.querySelector(".directInputs[data-name='basic_salary']")
  let basicSalaryVal;

  if (basicSalary.dataset.version === "monthly") {
    basicSalaryVal = parseFloat(basicSalary.value) * 12
  } else if (basicSalary.dataset.version === "annual") {
    basicSalaryVal = parseFloat(basicSalary.value)
  } else {
    basicSalaryVal = taxCalculation?.annualGrossIncome
  }
  let userInfo2 = JSON.parse(localStorage.getItem("adminDataPrime"));

  let dataToSend = {
    endpoint: "registerEmployeeDirectAssessment",
    data: {
      tax_number: tax_number,
      generatedBy: userInfo2?.id,
      housing: 0,
      transport: 0,
      utility: 0,
      medical: 0,
      entertainment: 0,
      leaves: 0,
      date_employed: "",
      basic_salary: basicSalaryVal,
    },
  }

  // console.log(dataToSend, taxCalculation)
  $.ajax({
    type: "POST",
    url: HOST,
    dataType: 'json',
    data: JSON.stringify(dataToSend),
    success: function (data) {
      console.log(data)
      if (data.status === "1") {

        // generateInvoiceNum(tax_number, data.monthly_tax_payable)
        Swal.fire({
          title: 'Generated',
          text: "Direct Assessment has been generated successfully. Assessment Details will be sent to your mail and phone number. Check your spam junk folder if you can't find the mail.",
          icon: 'success',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Go to Assessments',
          allowOutsideClick: false
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = `direct-assessment.html`
          }
        });
      } else {
        $("#msg_box").html(`
          <p class="text-danger text-center mt-4 text-lg">Something went wrong, Try again.</p>
        `)
        $("#generating_inv").removeClass("hidden")
      }
    },
    error: function (request, error) {
      console.log(error);
      $("#msg_box").html(`
          <p class="text-danger text-center mt-4 text-lg">Something went wrong, Try again.</p>
        `)
      $("#generating_inv").removeClass("hidden")
    }
  });
}

async function generateInvoiceNon() {
  if (userInformation) {
    $("#msg_box").html(`
      <div class="flex justify-center items-center mt-4">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    `)

    $("#generating_inv").addClass("hidden")
    calculateAssessment(userInformation.tax_number)
  } else {

    let payInputs = document.querySelectorAll(".payInputs")

    for (let i = 0; i < payInputs.length; i++) {
      const payinput = payInputs[i];

      if (payinput.required && payinput.value === "") {
        alert("Please fill all required field");
        break;
      }

      if (i === payInputs.length - 1) {
        let inputClass = document.querySelector(".inputClass")

        if (inputClass) {
          let revHeadsss = document.querySelectorAll(".revHeadsss")
          let theArrr = []
          revHeadsss.forEach(reaa => {
            theArrr.push(reaa.value)
          })

          the_id = theArrr.join(",")
          // window.location.href = "./multipleinvoice.html?invnumber=7426359108&load=true"
        }

        let allInputs = document.querySelectorAll(".payInputs")
        let categ = document.querySelector("#category").value
        let tin = document.querySelector("#tin").value

        $("#msg_box").html(`
          <div class="flex justify-center items-center mt-4">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
          </div>
        `)

        $("#generating_inv").addClass("hidden")

        let obj = {
          "endpoint": "createPayerAccount",
          "data": {
            "state": "Plateau",
            "category": categ,
            "employment_status": "",
            "business_type": "",
            "numberofstaff": "",
            "id_type": "1",
            "id_number": "",
            "img": "assets/img/userprofile.png",
            "tin": tin,
            "lga": "",
            "address": "",
            "password": "12345",
            "verification_status": "grfdses",
            "business_own": "2",
            "industry": "",
            "bvn": "",
            "nin": "",
            "annual_revenue": "",
            "value_business": "",
            "rep_firstname": "",
            "rep_surname": "",
            "rep_email": "",
            "rep_phone": "",
            "rep_position": "",
            "rep_state": "",
            "rep_state": "",
            "rep_lga": "",
            "rep_address": "",
          }
        }
        allInputs.forEach(allInput => {
          obj.data[allInput.dataset.name] = allInput.value
        })

        let StringedData = JSON.stringify(obj)
        // console.log(StringedData)

        $.ajax({
          type: "POST",
          url: HOST,
          dataType: 'json',
          data: StringedData,
          success: function (data) {
            // console.log(data)
            if (data.status === 2) {

              let taxNumber = data.data.tax_number
              // console.log(taxNumber)
              // generateInvoiceNum(taxNumber)
              calculateAssessment(taxNumber)

            } else {

              let taxNumber = data.data.tax_number
              // console.log(data)
              // generateInvoiceNum(taxNumber)
              calculateAssessment(taxNumber)

            }
          },
          error: function (request, error) {
            console.log(error);
            $("#msg_box").html(`
              <p class="text-danger text-center mt-4 text-lg">Something went wrong, Try again.</p>
            `)
            $("#generating_inv").removeClass("hidden")
          }
        });
      }
    }
  }

}



async function generateInvoiceNum(taxNumber, amountCal) {
  let timer;

  // Start a timer that triggers after 15 seconds
  timer = setTimeout(() => {
    Swal.fire({
      title: 'Please Check Your Email',
      text: "The invoice is being generated. Please check your email for the generated invoice.",
      icon: 'info',
      confirmButtonColor: '#3085d6',
      allowOutsideClick: false
    });
    $("#generating_inv").removeClass("hidden");
  }, 15000);

  let category_pre = $("#category_pre").val();
  let sectorSelect = $("#sectorSelect").val();
  let industrySelect = $("#industrySelect").val();

  let sectorAndIndustry = `${sectorSelect} - ${industrySelect}`;
  let descriptionVal = $("#description").val();

  $.ajax({
    type: "GET",
    url: `${HOST}?generateSingleInvoices&tax_number=${taxNumber}&revenue_head_id=328&price=${amountCal}&category_pre=${category_pre}&sector=${sectorAndIndustry}&description=${descriptionVal}&invoice_type=direct`,
    dataType: 'json',
    success: function (data) {
      clearTimeout(timer); // Clear the timer if the request succeeds

      // console.log(data);
      if (data.status === 2) {
        // Handle status 2
      } else if (data.status === 1) {
        $("#generating_inv").removeClass("hidden");
        $("#msg_box").html(``);
        Swal.fire({
          title: 'Generated',
          text: "Direct Assessment has been generated successfully. Assessment Details will be sent to your mail and phone number. Check your spam junk folder if you can't find the mail.",
          icon: 'success',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Open Assessment',
          allowOutsideClick: false
        }).then((result) => {
          if (result.isConfirmed) {
            nextPrev(1);
            openInvoice(data.invoice_number, data.price);
            // window.location.href = `invoice.html?invnum=${data.invoice_number}`
          }
        });
      }
    },
    error: function (request, error) {
      clearTimeout(timer); // Clear the timer if the request fails

      $("#msg_box").html(`
              <p class="text-danger text-center mt-4 text-lg">Something went wrong, Try again.</p>
            `);
      $("#generating_inv").removeClass("hidden");
      console.log(error);
    }
  });

}