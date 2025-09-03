const urlParams = new URLSearchParams(window.location.search);

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

        let allInputs = document.querySelectorAll(".enumInput")
        let allInputs2 = document.querySelectorAll(".enumInputB")

        $('.enumInput[data-name="fullname"]').val(data.user.first_name + " " + data.user.surname);
        $('.enumInput[data-name="staff"]').val(data.user.number_of_staff);



        allInputs.forEach((inputt, i) => {
          let theValuee = data.user[inputt.dataset.name]
          let theInputt = document.querySelector(`.enumInput[data-name='${inputt.dataset.name}']`)
          if (theInputt && theValuee) {
            theInputt.value = theValuee
          }
        });

        allInputs2.forEach((inputt, i) => {
          let theValuee = data.user[inputt.dataset.name]
          let theInputt = document.querySelector(`.enumInputB[data-name='${inputt.dataset.name}']`)
          if (theInputt && theValuee) {
            theInputt.value = theValuee
          }
        });

        if (data.user.old_user && data.user.category === "Individual") {


        } else if (data.user.old_user && data.user.category === "Corporate") {
          document.querySelector(".enumInput[data-name='fullname']").value = data.user.company_name
          document.querySelector(".enumInputB[data-name='email']").value = data.user.office_email
          document.querySelector(".enumInputB[data-name='phone']").value = data.user.office_number

        }
        nextPrev(1)




      } else {
        $("#theFetchBtns").removeClass("hidden");
        $("#msg_box001").html(``);
        Swal.fire({
          title: 'Not Found',
          text: "User detail not found in the database! please go back and fill your details manually",
          icon: 'error',
          confirmButtonColor: '##025826',
          cancelButtonColor: '##025826',
          confirmButtonText: 'Fill In Manually',
          allowOutsideClick: true
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
      Swal.fire({
        title: 'Not Found',
        text: "User detail not found in the database! please go back and fill your details manually",
        icon: 'error',
        confirmButtonColor: '##025826',
        cancelButtonColor: '##025826',
        confirmButtonText: 'Fill In Manually',
        allowOutsideClick: true
      }).then((result) => {
        if (result.isConfirmed) {
          nextPrev(1);
        }
      });
      console.log(error);
    }
  });
}

function fillManually() {
  const inputs = document.querySelectorAll('.payInputs');

  inputs.forEach(input => {
    input.value = '';
  });

  nextPrev(1)
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
      previewPage()
    }
  }
}

function previewPage() {
  let allInputs = document.querySelectorAll(".enumInput")
  let allInputsB = document.querySelectorAll(".enumInputB")

  allInputs.forEach((inputt, i) => {
    let theInputt = document.querySelector(`.enumInput2[data-name='${inputt.dataset.name}']`)
    if (theInputt) {
      theInputt.value = inputt.value
    }
  });

  allInputsB.forEach((inputt, i) => {
    let theInputt = document.querySelector(`.enumInput2[data-name='${inputt.dataset.name}']`)
    if (theInputt) {
      theInputt.value = inputt.value
    }
  });

  nextPrev(1)
}

function registerUser(payer_id) {

  let EnumData = {
    "endpoint": "createSpecialUser",
    "data": {
      "payer_id": payer_id
    }
  }

  let allInputs = document.querySelectorAll(".enumInput")
  let allInputsB = document.querySelectorAll(".enumInputB")

  allInputs.forEach((inputt, i) => {
    EnumData.data[inputt.dataset.name] = inputt.value
  })

  allInputsB.forEach((inputt, i) => {
    EnumData.data[inputt.dataset.name] = inputt.value
  })


  // console.log(EnumData)
  // console.log(JSON.stringify(EnumData))

  async function sendToDB() {
    try {
      const response = await fetch(HOST, {
        method: "POST",
        body: JSON.stringify(EnumData),
        headers: {
          "Content-Type": "application/json"
        }
      })
      const data = await response.json()

      if (data.status === 1) {

        Swal.fire({
          title: 'Success',
          text: "Registered successfully!",
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#025826',
          // cancelButtonColor: '#3085d6',
          confirmButtonText: 'Go to PAYE manager'

        }).then((result) => {
          window.location.href = `./paye-manager.html`
        })

      } else if (data.status === 2) {
        $("#theButton").removeClass("hidden")
        $("#msg_box").html("")
        Swal.fire({
          title: 'Success',
          text: "This email is already registered, Please go Staff manager to register staffs!",
          icon: 'success',
          showCancelButton: true,
          confirmButtonColor: '#025826',
          allowOutsideClick: false,
          confirmButtonText: 'Go to Staff manager'

        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = `paye-details.html?payerID=${data.data.payer_id}`
          }

        })
      } else {
        $("#theButton").removeClass("hidden")
        $("#msg_box").html(`
          <p class="text-warning text-center text-lg">${data.message}</p>
        `)
      }


    } catch (error) {
      console.log(error)
      $("#theButton").removeClass("hidden")
      $("#msg_box").html(`
        <p class="text-danger text-center text-lg">Something went wrong ! try again.</p>
      `)
    }
  }

  sendToDB()

}

async function createUserFirst() {
  $("#theButton").addClass("hidden")
  $("#msg_box").html(`
    <div class="flex justify-center items-center mb-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)

  let fullname = $(".enumInput2[data-name='fullname']").val()
  let email = $(".enumInput2[data-name='email']").val()
  let phone = $(".enumInputB[data-name='phone']").val()
  let state = $(".enumInput2[data-name='state']").val()
  let lga = $(".enumInput2[data-name='lga']").val()
  let address = $(".enumInput2[data-name='address']").val()
  let tin = $(".enumInput2[data-name='tin']").val()
  let staff = $(".enumInput[data-name='staff']").val()

  let obj = {
    "endpoint": "createPayerAccount",
    "data": {
      "category": "Corporate",
      "first_name": fullname,
      "surname": "",
      "email": email,
      "phone": phone,
      "state": state,
      "lga": lga,
      "address": address,
      "employment_status": "",
      "business_type": "",
      "numberofstaff": staff,
      "id_type": "1",
      "id_number": "",
      "img": "assets/img/userprofile.png",
      "tin": tin,
      "password": "12345",
      "verification_status": "1",
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


  let StringedData = JSON.stringify(obj)
  // console.log(obj, StringedData)

  $.ajax({
    type: "POST",
    url: HOST,
    dataType: 'json',
    data: StringedData,
    success: function (data) {
      // console.log(data)

      registerUser(data.data.tax_number)
    },
    error: function (request, error) {
      console.log(error);
      $("#theButton").removeClass("hidden")
      $("#msg_box").html(`
        <p class="text-danger text-center text-lg">Something went wrong ! try again.</p>
      `)
    }
  });
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