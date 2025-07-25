let theRevs = {}
let theCateg = ["", "Individual", "Individual", "Individual", "Individual"]
let AllRevs;
let theMda = {}

const urlParamsGen = new URLSearchParams(window.location.search);

const createdBy = urlParamsGen.get('created_by');
const adminId = urlParamsGen.get('id');

if (createdBy && createdBy === "admin") {
  $("#adminPlace").html(`
        <a href="./admin/presumptive-tax.html" class="button flex gap-3 items-center px-10">Open Presumptive Report</a>
    `)
}

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

let businessTypes = ``

async function fetchBusiness() {
  try {
    const response = await fetch(`${HOST}?getPresumptiveTax`)
    const data = await response.json()

    // console.log(data)

    if (data.status === 1) {

      data.message.forEach(busness => {
        businessTypes += `
          <option value="${busness.business_type}">${busness.business_type}</option>
        `

        $("#busiType").append(`
          <option value="${busness.business_type}">${busness.business_type}</option>
        `)
      })
    }

  } catch (error) {
    console.log(error)
  }
}

fetchBusiness()

$("#developmentLevy").on('change', function () {
  if ($(this).is(":checked")) {
    $("#devLevyContainer").html(`
      <div class="col-md-6">
        <input type="text" class="form-control developlevyInput" value="Development Levy" readonly>
      </div>
      <div class="col-md-6">
        <input type="number" min="1000" class="form-control developlevyAmount enumInputB" placeholder="Enter Amount" required>
        <small class="text-danger d-none" id="levyError">Amount must be at least 1000</small>
      </div>  
    `);

    // Attach validation listener to new input
    $(".developlevyAmount").on("input", function () {
      const value = parseInt($(this).val(), 10);
      if (value < 1000) {
        $("#levyError").removeClass("d-none");
        $(this).addClass("is-invalid");
      } else {
        $("#levyError").addClass("d-none");
        $(this).removeClass("is-invalid");
      }
    });

  } else {
    $("#devLevyContainer").html('');
  }
});

$("#bprCheckInput").on('change', function () {
  if ($(this).is(":checked")) {
    $("#bprCheckContainer").html(`
      <div class="col-md-6">
        <select class="form-select bprSelectInput">
          <option value="306">BPR (MINISTRY OF COMMERCE AND INDUSTRIES)</option>
          <option value="357">BPR (ZAMFARA STATE MARKET DEVELOPMENT AND MANAGEMENT AGENCY)</option>
        </select>
      </div>
      <div class="col-md-6">
        <input type="number" min="1000" class="form-control bprSelectInputAmount enumInputB" placeholder="Enter Amount" required>
        <small class="text-danger d-none" id="bprError">Amount must be at least 1000</small>
      </div>  
    `);

    // Attach validation listener to new input
    $(".bprSelectInputAmount").on("input", function () {
      const value = parseInt($(this).val(), 10);
      if (value < 1000) {
        $("#bprError").removeClass("d-none");
        $(this).addClass("is-invalid");
      } else {
        $("#bprError").addClass("d-none");
        $(this).removeClass("is-invalid");
      }
    });

  } else {
    $("#bprCheckContainer").html('');
  }
});

// function addBusiness() {
//   $("#businessCnt").append(`
//     <div class="businessNums mt-3">
//       <div class="flex justify-end">
//         <button onclick="deleteBusiness(this)">
//           <iconify-icon icon="ic:round-delete"></iconify-icon>
//         </button>
//       </div>

//       <div class="flex gap-3 md:flex-row flex-col mb-3">

//         <div class="form-group md:w-6/12">
//           <label for="">Type of Business*</label>
//           <select class="form-select enumInputB" id="busiType" data-name="business_type" required>
//             ${businessTypes}
//           </select>
//         </div>

//         <div class="form-group md:w-6/12">
//           <label for="">No of Employees*</label>
//           <select class="form-select enumInputB" data-name="staff_quota" required>
//             <option value=""></option>
//             <option value="1-9">1-9</option>
//             <option value="10-29">10-29</option>
//             <option value="30-50">30-50</option>
//           </select>
//         </div>

//       </div>
//       <hr>
//     </div>


//   `)
// }

// function deleteBusiness(e) {
//   let parentss = e.parentElement.parentElement
//   parentss.remove()

// }
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
            selectOptionByText('selectState', "Zamfara");
          }

        } else if (data.user.old_user && data.user.category === "Corporate") {
          document.querySelector(".payInputs[data-name='first_name']").value = data.user.company_name
          document.querySelector(".payInputs[data-name='email']").value = data.user.office_email
          document.querySelector(".payInputs[data-name='phone']").value = data.user.office_number

          if (data.user.state === null) {
            selectOptionByText('selectState', "Zamfara");
          }
        }
        nextPrev(1)




      } else {
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
  let genInv = document.querySelectorAll(".payInputs")

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


// let the_id
// $(".revHeadsss").on("change", function () {
//   let val = $(this).val()
//   // console.log(val)
//   setPrice(val)
// })

// let aa = [];
// function setPrice(val) {
//   let theRevenue = theRevs.filter(rr => rr.id === val)
//   // console.log(val, theRevenue)
//   $("#amountTopay").val()
//   the_id = theRevenue[0].id
//   aa["message"] = theRevenue;
// }

// function formatMoney(amount) {
//   return amount.toLocaleString('en-US', {
//     style: 'currency',
//     currency: 'NGN', // Change this to your desired currency code
//     minimumFractionDigits: 2,
//   });
// }

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
  let developlevyAmount = document.querySelector('.developlevyAmount')
  if (developlevyAmount && developlevyAmount.value === "") {
    alert("Amount cannot be empty")
    return;
  }

  let payInputs = document.querySelectorAll(".payInputs")
  let revHeadsss = document.querySelector("#busiType")
  let mdaSelected = document.querySelector("#staffQuota").value
  let obj = {
    "endpoint": "createPresumptive",
    "data": {
      "business_type": revHeadsss.value,
      "staff_quota": mdaSelected
    }
  }

  let StringedData = JSON.stringify(obj)
  // console.log(StringedData)

  $.ajax({
    type: "POST",
    url: HOST,
    dataType: 'json',
    data: StringedData,
    success: function (data) {
      console.log(data)
      if (data.status === 1) {

        let business_type = data.message.business_type
        let amount = data.message.minimum
        let categories = data.message.category
        // console.log(categories)
        displayInfo(business_type, amount, categories)


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



  async function displayInfo(business_type, amount, categories) {
    let categOfTax = document.querySelector(".selCateg option:checked").textContent
    let developmentLevyAmount = document.querySelector(".developlevyAmount")
    let bprSelectInputAmount = document.querySelector(".bprSelectInputAmount")

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

    let theSpace = `
    <div class="flex space-x-4">
      <p>Category of Tax:</p>
      <p>${categOfTax}</p>
    </div>
      <div class="flex space-x-3">
        <p>Type of Business:</p>
        <p>${business_type}</p>
      </div>
       <div class="flex space-x-3">
        <p>Amount:</p>
        <p id="amt">${amount}</p>
      </div>  
       <div class="flex space-x-3 hidden">
        <p>Category:</p>
        <p id="business_class">${categories}</p>
      </div>

  `
    if (developmentLevyAmount) {
      theSpace += `
        <div class="flex space-x-3">
          <p>Development Levy:</p>
          <p>${formatMoney(parseFloat(developmentLevyAmount.value))}</p>
        </div>
      `
    }

    if (bprSelectInputAmount) {
      theSpace += `
        <div class="flex space-x-3">
          <p>${$(".bprSelectInput option:selected").text()}:</p>
          <p>${formatMoney(parseFloat(bprSelectInputAmount.value))}</p>
        </div>
      `
    }

    $("#bill").html(theSpace)
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


}

async function generateInvoiceNon() {

  let payInputs = document.querySelectorAll(".payInputs")

  for (let i = 0; i < payInputs.length; i++) {
    const payinput = payInputs[i];

    if (payinput.required && payinput.value === "") {
      alert("Please fill all required field");
      break;
    }

    if (i === payInputs.length - 1) {
      let inputClass = document.querySelector(".inputClass")


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
          "state": "Zamfara",
          "category": categ,
          "employment_status": "",
          "business_type": "",
          "numberofstaff": "",
          "business_type": "",
          "img": "",
          "tin": tin,
          "lga": "",
          "address": "",
          "password": "12345",
          "verification_status": "grfdses"
        }
      }
      allInputs.forEach(allInput => {
        obj.data[allInput.dataset.name] = allInput.value
      })

      let StringedData = JSON.stringify(obj)
      console.log(StringedData)

      $.ajax({
        type: "POST",
        url: HOST,
        dataType: 'json',
        data: StringedData,
        success: function (data) {
          console.log(data)
          if (data.status === 2) {
            let taxNumber = data.data.tax_number
            // console.log(taxNumber)
            generateInvoiceNum(taxNumber)

          } else {

            let taxNumber = data.data.tax_number
            // console.log(data)
            generateInvoiceNum(taxNumber)

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

async function generateInvoiceNum(taxNumber) {
  let amt = parseFloat(document.querySelector("#amt").textContent.replace(/[^0-9.-]+/g, ""));
  let cati = document.querySelector("#business_class").textContent;
  let the_id = 1340
  invoice_type = "presumptive"

  let description = document.querySelector("#thedescripInput").value
  let developmentLevyAmount = document.querySelector(".developlevyAmount")
  let bprSelectInputAmount = document.querySelector(".bprSelectInputAmount")

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

 let dataToSendOut = {
  generateSingleInvoices: true,
  tax_number: taxNumber,
  revenue_head_id: the_id,
  price: amt,
  description: description || "No description",
  invoice_type: invoice_type,
  category_pre: cati,
  created_by: "admin",
  by_account: adminId || null,
  zonalOffice: 8,
  lga: "Not Assigned" // <-- Required
};

// If development levy is present
let revenueIds = [the_id];
let prices = [amt];

if (developmentLevyAmount && developmentLevyAmount.value !== "") {
  revenueIds.push(800);
  prices.push(developmentLevyAmount.value);
}
if (bprSelectInputAmount && bprSelectInputAmount.value !== "") {
  revenueIds.push($(".bprSelectInput").val());
  prices.push(bprSelectInputAmount.value);
}

dataToSendOut.revenue_head_id = revenueIds.join(",");
dataToSendOut.price = prices.join(",");

  $.ajax({
    type: "GET",
    url: `${HOST}`,
    data: dataToSendOut,
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
          text: "Invoice has been generated successfully. Invoice details will be sent to your email and phone number! Check your spam/junk folder if you can't find the mail.",
          icon: 'success',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Open Invoice',
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