// const urlParams = new URLSearchParams(window.location.search);
// const category = urlParams.get('categ_id');
let userDATA = JSON.parse(localStorage.getItem("userDataPrime"))
let currentPageURL = window.location.href;

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
      nextPrev(1)
    }

  }
}

function continueReg3() {
  let allInputs = document.querySelectorAll(".enumInputC")
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

function registerUser() {
  $("#theButton").addClass("hidden")
  $("#msg_box").html(`
    <div class="flex justify-center items-center mb-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)

  let EnumData = {
    "endpoint": "createETCC",
    "data": {
      // "category_id": category
      "payer_id": currentPageURL.includes("admin/etcc-initiate") ? "PLI-6028517439" : userDATA?.tax_number,
      "declaration": "I declare...",
      "app_status": "3"
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



  async function doUpload() {
    let uploadInputs = document.querySelectorAll(".uploadInputs")

    const publitio = new PublitioAPI(publitioKey1, publitioKey2)

    for (let ii = 0; ii < uploadInputs.length; ii++) {
      const upInput = uploadInputs[ii];

      if (upInput.value === "") {

      } else {

        $("#msg_box").html(`
          <div class="flex justify-center items-center mb-4 gap-3">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
            <p>Uploading files....</p>
          </div>
        `)

        let fileUrl = upInput.files[0]
        const reader = new FileReader()
        reader.readAsBinaryString(fileUrl);

        publitio.uploadFile(fileUrl, 'file', {
          title: `${fileUrl.name} - ${upInput.dataset.name}`,
          public_id: `${fileUrl.name} - ${upInput.dataset.name}`,

        }).then((data) => {
          EnumData.data[upInput.dataset.name] = data.url_preview



        }).catch((error) => {
          console.log(error)
          $("#msg_box").html(`<p class="text-center text-danger">Error uploading your files...please try again !</p>`)
          $("#theButton").removeClass("hidden")
        })

      }

      // console.log(ii, uploadInputs.length - 1)

    }
  }

  doUpload().then(e => {
    setTimeout(() => {
      sendToDB()
    }, 2000);

  })


  // console.log(JSON.stringify(EnumData))

  async function sendToDB() {
    $("#msg_box").html(`
      <div class="flex justify-center items-center mb-4 gap-3">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
  ` )
    // console.log(JSON.stringify(EnumData))
    // console.log(EnumData)
    try {
      const response = await fetch(HOST, {
        method: "POST",
        body: JSON.stringify(EnumData),
        headers: {
          "Content-Type": "application/json"
        }
      })
      const data = await response.json()


      $("#refNumber").html(data.ref)

      if (data.status === 1) {

        $("#msg_box").html(`
          <div class="flex justify-center items-center mb-4 gap-3">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
            <p>Generating Invoice....</p>
          </div>

         
        `)

        try {
          const response = await fetch(
            `${HOST}?generateSingleInvoices&tax_number=${currentPageURL.includes("admin/etcc-initiate") ? "PLI-6028517439" : userDATA?.tax_number}&revenue_head_id=1357,1358&price=1500`
          );

          const theddata = await response.json()

          if (theddata.status === 1) {
            nextPrev(1)
            openInvoice(theddata.invoice_number)
            sessionStorage.setItem("invoice_number", theddata.invoice_number)
          } else {
            $("#msg_box").html(`
             <p class="text-danger text-center">something went wrong while generating invoice.</p>
            `)
            $("#theButton").removeClass("hidden")
          }

        } catch (error) {
          $("#msg_box").html(`
             <p class="text-danger text-center">something went wrong while generating invoice.</p>             
            `)
          $("#theButton").removeClass("hidden")
        }

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

}
