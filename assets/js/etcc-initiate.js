// let userDATA = JSON.parse(localStorage.getItem("userDataPrime"))

const urlParamsEtcc = new URLSearchParams(window.location.search);
const initiator = urlParamsEtcc.get('initiator');
const adminId = urlParamsEtcc.get('id');

let theFetchedDetails = null


$('.yearlySelect').each(function () {
  const currentYear = new Date().getFullYear();
  for (let year = currentYear - 5; year <= currentYear + 2; year++) {
    $(this).append($('<option>', { value: year, text: year }));
  }
});

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
        theFetchedDetails = data.user
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
              <input type="text" class="form-control payInputs" value="" readonly data-name="surname"
              placeholder="" value="">
            </div>
          `)

          $("#employStatus").html(`
            <label for="">CAC*</label>
            <input type="text" class="form-control enumA payInputs" data-name="cac" />
          `)

          $("#DOBcont").html('')
        }

        allInputs.forEach((inputt, i) => {
          let theValuee = data.user[inputt.dataset.name]
          let theInputt = document.querySelector(`.payInputs[data-name='${inputt.dataset.name}']`)
          if (theInputt) {
            theInputt.value = theValuee
          }
        });

        if (data.user.old_user && data.user.category === "Individual") {
          // if (data.user.state === null) {
          //   selectOptionByText('selectState', "Plateau");
          // }

        } else if (data.user.old_user && data.user.category === "Corporate") {
          document.querySelector(".payInputs[data-name='first_name']").value = data.user.company_name
          document.querySelector(".payInputs[data-name='email']").value = data.user.office_email
          document.querySelector(".payInputs[data-name='phone']").value = data.user.office_number

          // if (data.user.state === null) {
          //   selectOptionByText('selectState', "Plateau");
          // }
        }
        nextPrev(1)

      } else {
        theFetchedDetails = null
        $("#theFetchBtns").removeClass("hidden");
        $("#msg_box001").html(``);

        nextPrev(1)
        // Swal.fire({
        //   title: 'Not Found',
        //   text: "User detail not found in the database! please Register before proceeding!",
        //   icon: 'error',
        //   confirmButtonColor: '#3085d6',
        //   cancelButtonColor: '#3085d6',
        //   confirmButtonText: 'Reister',
        //   allowOutsideClick: false
        // }).then((result) => {
        //   if (result.isConfirmed) {
        //     window.location.href = "../regcategory.html"
        //   }
        // });
      }
    },
    error: function (request, error) {
      theFetchedDetails = null
      $("#msg_box001").html(`
          <p class="text-danger text-center mt-4 text-lg">Something went wrong, Try Again or Fill Details Manually.</p>
        `);
      $("#theFetchBtns").removeClass("hidden");
      console.log(error);
    }
  });
}

$(".selCateg").on("change", function () {
  let value = $(this).val()

  if (value === "2") {
    $(`#theName`).html(`
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

    $("#employStatus").html(`
      <label for="">Employment Status*</label>
      <select class="form-select enumA payInputs" id="employSelect" data-name="employment_type">
        <option value=""  selected disabled>Select --</option>
        <option value="Self Employed">Self Employed</option>
        <option value="Employed">Employed</option>
        <option value="Unemployed">Unemployed</option>
      </select>
    `)
    
    $("#employSelect").on('change', function () {
      let theval = $(this).val()
      console.log(theval)
      if (theval === "Employed") {
        $("#employmentState").html(`
          <div class="form-group mb-3">
            <label for="">Date Employed*</label>
            <input type="date" class="form-control w-full enumInput" data-name="date_of_employment">
          </div>

          <div class="form-group mb-3">
            <label for="">Organization TIN*</label>
            <input type="text" class="form-control w-full enumInput" data-name="org_tin">
          </div>
    
          <div class="form-group mb-3">
            <label for="">Occupation or Kind of work done*</label>
            <input type="text" class="form-control w-full enumInput" data-name="occupation">
          </div>  
        `)
      } else {
        $("#employmentState").html("")
      }
    })

    $("#DOBcont").html(`
      <div class="form-group mb-4">
        <label for="">Date of Birth*</label>
        <input type="date" class="form-control w-full enumA" data-name="DOB" required>
      </div>  
    `)

  } else {
    $(`#theName`).html(`
      <div class="form-group w-full">
        <label for="">Organization Name *</label>
        <input type="text" class="form-control payInputs" data-name="first_name"
        placeholder="" value="">
      </div>

      <div class="form-group w-full hidden">
        <label for="">Surname *</label>
        <input type="text" class="form-control payInputs" value="" readonly data-name="surname"
        placeholder="" value="">
      </div>
    `)

    $("#employStatus").html(`
      <label for="">CAC*</label>
      <input type="text" class="form-control enumA payInputs" data-name="cac" />
    `)

    $("#DOBcont").html('')
  }
})

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

function continuePage() {
  let genInv = document.querySelectorAll(".payInputs")

  // let tin = document.querySelector("#tin")

  // if (tin.value === "") {
  //   $("#popUpModal").modal("show")
  //   return;
  // }


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

function continueReg() {
  let allInputs = document.querySelectorAll(".enumInput")
  // check for empty fileds

  for (let i = 0; i < allInputs.length; i++) {
    const inpt = allInputs[i];

    if (inpt.required && inpt.value === "") {
      alert("Please fill all required fields")
      inpt.scrollIntoView()
      break;
    }

    if (i === allInputs.length - 1) {
      nextPrev(1)
    }

  }

}

function continueReg2() {
  let allInputs = document.querySelectorAll(".enumInputB")
  // check for empty fileds

  for (let i = 0; i < allInputs.length; i++) {
    const inpt = allInputs[i];

    if (inpt.required && inpt.value === "") {
      alert("Please fill all required fields")
      inpt.scrollIntoView()
      break;
    }

    if (i === allInputs.length - 1) {
      registerUser()
    }

  }
}

// I certify
$('#certify').on('change', function () {
  if ($(this).is(':checked')) {
    $('#theButton').prop('disabled', false);
    $("#theButton").removeClass('disabled')
  } else {
    $('#theButton').prop('disabled', true);
    $("#theButton").addClass('disabled')
  }
});

$("#employSelect").on('change', function () {
  let theval = $(this).val()
  console.log(theval)
  if (theval === "Employed") {
    $("#employmentState").html(`
      <div class="form-group mb-3">
        <label for="">Date Employed*</label>
        <input type="date" class="form-control w-full enumInput" data-name="date_of_employment">
      </div>

      <div class="form-group mb-3">
        <label for="">Organization TIN*</label>
        <input type="text" class="form-control w-full enumInput" data-name="org_tin">
      </div>

      <div class="form-group mb-3">
        <label for="">Occupation or Kind of work done*</label>
        <input type="text" class="form-control w-full enumInput" data-name="occupation">
      </div>  
    `)
  } else {
    $("#employmentState").html("")
  }
})

// function continueReg3() {
//   let allInputs = document.querySelectorAll(".enumInputC")
//   // check for empty fileds

//   for (let i = 0; i < allInputs.length; i++) {
//     const inpt = allInputs[i];

//     if (inpt.required && inpt.value === "") {
//       alert("Please fill all required fields")
//       inpt.scrollIntoView()
//       break;
//     }

//     if (i === allInputs.length - 1) {
//       registerUser()
//     }

//   }
// }

function registerUser() {
  $("#theButton").addClass("hidden")
  $("#msg_box").html(`
    <div class="flex justify-center items-center mb-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)

  let fname = $('[data-name="first_name"]').val()
  let sname = $('[data-name="surname"]').val()
  let addressN = $('[data-name="address"]').val()
  let emailN = $('[data-name="email"]').val()
  let phoneN = $('[data-name="phone"]').val()
  let theCategory = $('#category').val()

  let thefullname = `${fname} ${sname}`
  
  let EnumData = {
    "endpoint": "createETCC",
    "data": {
      "payer_id": theFetchedDetails ? theFetchedDetails.tax_number : "null",
      "category": theCategory,
      "declaration": "I declare...",
      "applicant_tin": $("#tin").val(),
      "org_tin": $("#tin").val(),
      "fullname": thefullname,
      "organisation": thefullname,
      "email": emailN,
      "phone": phoneN,
      "date_of_employment": new Date(new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 365))).toISOString().split('T')[0],
      "recommendation": "recommendation",
      "address": addressN,
      "app_status": "3",
      "created_by": initiator ? "admin" : "self",
      "by_account": adminId || null,
    }
  }

  let allInputs = document.querySelectorAll(".enumInput")
  let allInputsB = document.querySelectorAll(".enumInputB")
  let allInputsA = document.querySelectorAll(".enumA")

  allInputs.forEach((inputt, i) => {
    EnumData.data[inputt.dataset.name] = inputt.value
  })

  allInputsB.forEach((inputt, i) => {
    EnumData.data[inputt.dataset.name] = inputt.value
  })

  allInputsA.forEach((inputt, i) => {
    EnumData.data[inputt.dataset.name] = inputt.value
  })

  async function doUpload() {
    let uploadInputs = document.querySelectorAll(".uploadInputs");

    const publitio = new PublitioAPI(publitioKey1, publitioKey2);

    for (let ii = 0; ii < uploadInputs.length; ii++) {
      const upInput = uploadInputs[ii];

      if (!upInput.files.length) {
        EnumData.data[upInput.dataset.name] = "";

        if (upInput.required) {
          alert("Please upload the required files");
          $("#msg_box").html("");
          $("#theButton").removeClass("hidden");
          return;
        }

        continue;
      }

      // Show uploading status
      $("#msg_box").html(`
        <div class="flex justify-center items-center mb-4 gap-3">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
          <p>Uploading files....</p>
        </div>
      `);

      let file = upInput.files[0];

      try {
        let uploadResponse = await publitio.uploadFile(file, "file", {
          title: `${file.name} - ${upInput.dataset.name}`,
          public_id: `${file.name} - ${upInput.dataset.name}`,
        });

        EnumData.data[upInput.dataset.name] = uploadResponse.url_preview;
      } catch (error) {
        console.error(error);
        $("#msg_box").html(`<p class="text-center text-danger">Error uploading files... Please try again!</p>`);
        $("#theButton").removeClass("hidden");
        return;
      }
    }

    // Proceed to send data to database after all uploads are completed
    await sendToDB(EnumData);
  }

  // Call the upload function and ensure it's completed before sending data
  doUpload();

  /**
   * Function to send data to database
   */
  async function sendToDB(enumData) {
    $("#msg_box").html(`
      <div class="flex justify-center items-center mb-4 gap-3">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    `);

    console.log("Final Data:", enumData);

    try {
      const response = await fetch(HOST, {
        method: "POST",
        body: JSON.stringify(enumData), // Ensure all fields are included
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.status === 1) {
        $("#theButton").removeClass("hidden");
        $("#msg_box").html(`<p class="text-success text-center text-lg">ETCC generated Successfully!</p>`);

        if (initiator === "admin") {
          // callbackBtn
          $("#callbackBtn").attr("href", "./admin/etcc-management.html").text("Return to Admin");
        }

        $("#refNumber").html(data.ref);
        $("#refNumberModal").modal("show");


      } else {
        $("#theButton").removeClass("hidden");
        $("#msg_box").html(`<p class="text-warning text-center text-lg">${data.message}</p>`);
      }
    } catch (error) {
      console.error(error);
      $("#theButton").removeClass("hidden");
      $("#msg_box").html(`<p class="text-danger text-center text-lg">Something went wrong! Try again.</p>`);
    }
  }


}
