let userInformation = null;
let currentAssessmentId = null;
let currentAccessNo = null;

// Get parameters from URL
function getUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const currentInvoiceno = urlParams.get('invoiceno');

  let currentAccessNo = null;
  let currentAssessmentId = null;

  return { accessno: currentAccessNo, invoiceno: currentInvoiceno, id: currentAssessmentId };
}

// Fetch and populate existing assessment data
async function fetchAssessmentData() {
  const params = getUrlParams();

  if (!params.invoiceno) {
    console.error('No invoice number found in URL');
    return;
  }

  try {
    const response = await fetch(`${HOST}?getAllDirectAssessmentss&invoice_number=${params.invoiceno}`);
    const resdata = await response.json();

    if (resdata.status === "success" && resdata.data.direct_assessments.length > 0) {
      const assessment = resdata.data.direct_assessments[0];

      // Populate user information
      userInformation = {
        tax_number: assessment.tax_number,
        first_name: assessment.fullname?.split(' ')[0] || '',
        surname: assessment.fullname?.split(' ').slice(1).join(' ') || '',
        email: assessment.email,
        phone: assessment.phone,
        tin: assessment.tax_number,
        state: "Zamfara", // You might need to get this from another endpoint
        lga: "", // You might need to get this from another endpoint
        address: "" // You might need to get this from another endpoint
      };

      // define the null values of params
      currentAssessmentId = assessment.id || null;
      currentAccessNo = assessment.dAssesment_no || null;
      
      // Populate form fields with existing data
      populateFormFields(assessment);

      // Calculate and display tax liability
      await calculateTaxLiabilityFromAssessment(assessment);

    } else {
      console.error('No assessment data found');
    }
  } catch (error) {
    console.error('Error fetching assessment data:', error);
  }
}

// Populate form fields with assessment data
function populateFormFields(assessment) {
  // Set the basic salary and select annual by default
  $("input[name='grossInptt'][value='annual']").prop('checked', true);

  const basicSalaryInput = document.querySelector(".directInputs[data-name='basic_salary']");
  if (basicSalaryInput) {
    basicSalaryInput.value = assessment.annual_gross_income;
  }

  // Populate description if needed
  const descriptionInput = document.getElementById('description');
  if (descriptionInput) {
    descriptionInput.value = "Direct Assessment Edit - " + assessment.dAssesment_no;
  }

  // Populate user details in the second form
  populateUserDetails();
}

// Populate user details in the second form section
function populateUserDetails() {
  if (!userInformation) return;

  // Populate all user detail fields
  document.querySelector('.payInputs2[data-name="first_name"]').value = userInformation.first_name;
  document.querySelector('.payInputs2[data-name="surname"]').value = userInformation.surname;
  document.querySelector('.payInputs2[data-name="email"]').value = userInformation.email;
  document.querySelector('.payInputs2[data-name="phone"]').value = userInformation.phone;
  document.querySelector('.payInputs2[data-name="tin"]').value = userInformation.tin;
  document.querySelector('.payInputs2[data-name="state"]').value = userInformation.state;
  document.querySelector('.payInputs2[data-name="lga"]').value = userInformation.lga;
  document.querySelector('.payInputs2[data-name="address"]').value = userInformation.address;
}

// Calculate tax liability from existing assessment data
async function calculateTaxLiabilityFromAssessment(assessment) {
  const annualGrossIncome = parseFloat(assessment.annual_gross_income);
  const monthlyTaxPayable = parseFloat(assessment.monthly_tax_payable);
  const consolidatedRelief = parseFloat(assessment.consolidated_relief);
  const chargeableIncome = parseFloat(assessment.chargeable_income);

  taxCalculation = {
    monthlyTaxPayable: monthlyTaxPayable,
    consolidatedRelief: consolidatedRelief,
    chargeableIncome: chargeableIncome,
    annualGrossIncome: annualGrossIncome
  };

  $("#previewBtn").removeClass("hidden");

  let annualTax = monthlyTaxPayable * 12 || 0;
  let monthlyTax = monthlyTaxPayable.toLocaleString() || 0;
  let consolidatedReliefFormatted = consolidatedRelief.toLocaleString() || 0;
  let chargeableIncomeFormatted = chargeableIncome.toLocaleString() || 0;
  let annualGrossIncomeFormatted = annualGrossIncome.toLocaleString() || 0;
  let monthlyGrossIncome = annualGrossIncome / 12 || 0;

  $("#theCalDisContainer").html(`
        <p class="text-lg font-bold mb-4">Tax Calculation</p>

        <div class="form-group w-full mb-4">
          <label for="">Monthly Gross Income</label>
          <input type="text" class="form-control" readonly value="${monthlyGrossIncome.toLocaleString()}">
        </div>

        <div class="flex items-center mb-4 gap-2">
          <div class="form-group w-full">
            <label for="">Monthly Tax Liabilty</label>
            <input type="text" class="form-control" readonly value="${monthlyTax}">
          </div>

          <div class="form-group w-full">
            <label for="">Annual Tax Liabilty</label>
            <input type="text" class="form-control" readonly value="${annualTax.toLocaleString()}">
          </div>
        </div>

        <div class="flex items-center mb-4 gap-2">
          <div class="form-group w-full">
            <label for="">Consolidated Tax Relief</label>
            <input type="text" class="form-control" readonly value="${consolidatedReliefFormatted}">
          </div>

          <div class="form-group w-full">
            <label for="">Taxable Income</label>
            <input type="text" class="form-control" readonly value="${chargeableIncomeFormatted}">
          </div>
        </div>
    `);
}

// Event listener for gross input type change
$("input[name='grossInptt']").on("change", function () {
  let val = $(this).val();
  if (val === "monthly") {
    $("#grossContainer").html(`
            <label for="basic_salary">Monthly Gross Income*</label>
            <input type="number" placeholder="Input the monthly gross income" class="form-control genInv directInputs"
                id="basic_salary" required data-name="basic_salary" onblur="calculateTaxLiability('monthly')" data-version="monthly">  
        `);
  } else if (val === "annual") {
    $("#grossContainer").html(`
            <label for="basic_salary">Annual Gross Income*</label>
            <input type="number" placeholder="Input the annual gross income" class="form-control genInv directInputs"
                id="basic_salary" required data-name="basic_salary" onblur="calculateTaxLiability('yearly')" data-version="annual">  
        `);
  } else {
    $("#grossContainer").html(`
            <label for="basic_salary">Tax Liability*</label>
            <input type="number" placeholder="Enter proposed tax liability" class="form-control genInv directInputs"
                id="basic_salary" required data-name="basic_salary" onblur="calculateTaxLiability('tax_liability')" data-version="liability">  
        `);
  }
});

let taxCalculation = null;

async function calculateTaxLiability(version) {
  let requestUrl;
  let basicSalary = document.querySelector(".directInputs[data-name='basic_salary']").value;

  if (basicSalary === "") {
    return;
  }

  if (version === "yearly") {
    requestUrl = `${HOST}?getMonthlyTaxPay&monthlyIncome=${basicSalary}`;
  } else if (version === "monthly") {
    requestUrl = `${HOST}?getMonthlyTaxPay&monthlyIncome=${parseFloat(basicSalary) * 12}`;
  } else {
    requestUrl = `${HOST}?getMonthlyTaxPayReverse&monthlyIncome=${basicSalary}`;
  }

  //loader
  $("#theCalDisContainer").html(`
        <div class="flex justify-center items-center mt-4">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
    `);

  try {
    const response = await fetch(requestUrl);
    const resdata = await response.json();

    if (resdata.status === "success") {
      let data = resdata.data;
      taxCalculation = data;

      $("#previewBtn").removeClass("hidden");

      let annualTax = parseFloat(data.monthlyTaxPayable) * 12 || 0;
      let monthlyTax = parseFloat(data.monthlyTaxPayable).toLocaleString() || 0;
      let consolidatedRelief = parseFloat(data.consolidatedRelief).toLocaleString() || 0;
      let chargeableIncome = parseFloat(data.chargeableIncome).toLocaleString() || 0;
      let annualGrossIncome = parseFloat(data.annualGrossIncome).toLocaleString() || 0;
      let monthlyGrossIncome = parseFloat(data.annualGrossIncome) / 12 || 0;

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
            `);
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

async function updateAssessment(tax_number) {
  let basicSalary = document.querySelector(".directInputs[data-name='basic_salary']");
  let basicSalaryVal;

  if (basicSalary.dataset.version === "monthly") {
    basicSalaryVal = parseFloat(basicSalary.value) * 12;
  } else if (basicSalary.dataset.version === "annual") {
    basicSalaryVal = parseFloat(basicSalary.value);
  } else {
    basicSalaryVal = taxCalculation?.annualGrossIncome;
  }

  let userInfo2 = JSON.parse(localStorage.getItem("adminDataPrime"));

  let dataToSend = {
    endpoint: "editEmployeeDirectAssessment",
    data: {
      dAssesment_no: currentAccessNo,
      tax_number: tax_number,
      generatedBy: userInfo2?.id,
      housing: 0,
      transport: 0,
      utility: 0,
      medical: 0,
      entertainment: 0,
      leaves: 0,
      basic_salary: basicSalaryVal,
    },
  };

  $.ajax({
    type: "POST",
    url: HOST,
    dataType: 'json',
    data: JSON.stringify(dataToSend),
    success: function (data) {
      console.log(data);
      if (data.status === "1") {
        Swal.fire({
          title: 'Updated',
          text: "Direct Assessment has been updated successfully.",
          icon: 'success',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Go to Assessments',
          allowOutsideClick: false
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = `direct-assessment.html`;
          }
        });
      } else {
        $("#msg_box").html(`
                    <p class="text-danger text-center mt-4 text-lg">Something went wrong, Try again.</p>
                `);
        $("#generating_inv").removeClass("hidden");
      }
    },
    error: function (request, error) {
      console.log(error);
      $("#msg_box").html(`
                <p class="text-danger text-center mt-4 text-lg">Something went wrong, Try again.</p>
            `);
      $("#generating_inv").removeClass("hidden");
    }
  });
}

async function generateInvoiceNon() {
  $("#msg_box").html(`
        <div class="flex justify-center items-center mt-4">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
    `);

  $("#generating_inv").addClass("hidden");
  updateAssessment(userInformation.tax_number);
}

// Initialize the page when document is ready
$(document).ready(function () {
  // Change selectboxes to selectize mode to be searchable
  $(".revHeadInputSel").select2();

  // Fetch assessment data on page load
  fetchAssessmentData();
});