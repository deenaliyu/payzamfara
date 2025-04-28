const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('categ_id');

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
      registerUser()
    }

  }

}

function nhisSelect(e) {
  if (e.checked) {
    $("#employeeNhis").html(`
      <input type="number" class="form-control enumInput" data-name="nhis" placeholder="NHIS amount" />
    `)
  } else {
    $("#employeeNhis").html("")
  }
}

function registerUser() {
  $("#theButton").addClass("hidden")
  $("#msg_box22").html(`
    <div class="flex justify-center items-center mb-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)

  let EnumData = {
    "endpoint": "createSpecialUserEmployee",
    "data": {
      "category_id": category,
      "new_gross": ''
    }
  }

  let allInputs = document.querySelectorAll(".enumInput")
  let allFormInputs = document.querySelectorAll(".form-check-input")

  allInputs.forEach((inputt, i) => {
    EnumData.data[inputt.dataset.name] = inputt.value
  })

  allFormInputs.forEach(inpt => {
    EnumData.data[inpt.value] = inpt.checked ? 'yes' : 'no'
  })
  // console.log(JSON.stringify(EnumData))
  // console.log(EnumData)


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
        $("#addEmployeeModal").modal("hide")
        $("#theButton").removeClass("hidden")
        $("#msg_box22").html("")
        Swal.fire({
          title: 'Success',
          text: "Employee Registered successfully!",
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#025826',
          // cancelButtonColor: '#3085d6',
          confirmButtonText: 'Go to PAYE manager'

        }).then((result) => {
          window.location.href = `./paye-details.html?payerID=${category}`
        })

      } else {
        $("#theButton").removeClass("hidden")
        $("#msg_box22").html(`
          <p class="text-warning text-center text-lg">${data.message}</p>
        `)
      }


    } catch (error) {
      console.log(error)
      $("#theButton").removeClass("hidden")
      $("#msg_box22").html(`
        <p class="text-danger text-center text-lg">Something went wrong ! try again.</p>
      `)
    }
  }

  sendToDB()

}