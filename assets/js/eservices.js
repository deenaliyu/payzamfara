let theObj = ""
$("#checkStatus").on("click", function () {

  $("#msg_box").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)
  $("#checkStatus").addClass("hidden")

  let therefNumber = document.querySelector("#refNumber").value

  if (therefNumber === "") {
    alert("Field can't be empty.")
    $("#msg_box").html(``)
    $("#checkStatus").removeClass("hidden")
    return
  }

  async function getStatus() {
    const response = await fetch(`${HOST}?checkStatus&reference=${therefNumber}`)
    const statusData = await response.json()

    console.log(statusData)
    if (statusData.status === 0) {
      $("#msg_box").html(``)
      $("#checkStatus").removeClass("hidden")
      $("#confirmationModal").modal("show")

      $("#modalBody").html(`
        <div class="flex justify-center">
          <img src="./assets/img/notpaid.png" alt="">
        </div>

        <p class="text-lg fontBold text-center mb-3 mt-5">${statusData.message}</p>
      `)

    } else if (statusData.status === 1 && statusData.request_status === "pending") {
      $("#msg_box").html(``)
      $("#checkStatus").removeClass("hidden")
      $("#confirmationModal").modal("show")

      $("#modalBody").html(`
      <div class="flex justify-center">
        <img src="./assets/img/notpaid.png" alt="">
      </div>

      <p class="text-lg fontBold text-center mb-3 mt-5">Your application has not been approved.</p>
      <p class="text-center mb-5">Please check back later</p>
      
    `)

    } else if (statusData.status === 1 && statusData.request_status === "approved") {
      $("#msg_box").html(``)
      $("#checkStatus").removeClass("hidden")
      $("#confirmationModal").modal("show")
      theObj = statusData.data
      let modalBB = ""

      let obj = {
        "TaxFilling": "Tax Filling",
        "TinRequest": "TIN Request",
        "TaxClearance": "Tax Clearance Certificate"
      }

      let obj2 = {
        "TaxFilling": "Please proceed to generate invoice and pay your tax",
        "TinRequest": "Your TIN has been successfully generated and sent to the email you provided",
        "TaxClearance": "Please proceed to download your certificate"
      }

      let obj3 = {
        "TaxFilling": `<button onclick="generateInvoice()" data-thedata="" id="generating_inv" class='button'>Generate Invoice</button>`,
        "TinRequest": "<p></p>",
        "TaxClearance": `<a href='taxcertificate.html?reference=${therefNumber}' class='button'>Download</a>`
      }

      modalBB += `
        <div class="flex justify-center">
          <img src="./assets/img/verify.png" alt="">
        </div>

        <p class="text-lg fontBold text-center mb-3 mt-5">Your ${obj[statusData.service_type]} application has been approved </p>
        <p class="text-center mb-2">${obj2[statusData.service_type]}</p>

        <div class="flex justify-center mb-4 mt-3">
          ${obj3[statusData.service_type]}
        </div>
      `
      $("#modalBody").html(modalBB)

    }
  }

  getStatus()

})

async function generateInvoice(data) {
  // let allInputs = document.querySelectorAll(".payInputs")
  // let categ = document.querySelector("#category").value
  // let tin = document.querySelector("#tin").value
  console.log(theObj)
  $("#msg_boxx").html(`
      <div class="flex justify-center items-center mt-4">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    `)

  $("#generating_inv").addClass("hidden")



  let obj = {
    "endpoint": "createPayerAccount",
    "data": {
      "state": "Akwa Ibom",
      "category": theObj.category,
      "employment_status": "",
      "first_name": theObj.first_name,
      "surname": theObj.surname,
      "email": theObj.email,
      "phone": theObj.phone_number,
      "tax_number": "",
      "lga": "",
      "address": "",
      "business_type": "",
      "numberofstaff": "",
      "business_type": "",
      "img": "",
      "tin": "",
      "lga": "",
      "address": "",
      "password": "12345",
      "verification_status": "grfdses"
    }
  }

  let StringedData = JSON.stringify(obj)
  console.log(StringedData)

  $.ajax({
    type: "POST",
    url: HOST,
    dataType: 'json',
    data: StringedData,
    success: function (data) {
      // console.log(data)
      if (data.status === 2) {

        let taxNumber = data.data.tax_number
        console.log(taxNumber)
        generateInvoiceNum(taxNumber)

      } else if (data.status === 1) {

        let taxNumber = data.data.tax_number
        console.log(data)
        generateInvoiceNum(taxNumber)

      }
    },
    error: function (request, error) {
      console.log(error);
      $("#msg_boxx").html(`
          <p class="text-danger text-center mt-4 text-lg">Something went wrong !</p>
        `)
      $("#generating_inv").removeClass("hidden")
    }
  });


}

async function generateInvoiceNum(taxNumber) {
  console.log(taxNumber)
  $.ajax({
    type: "GET",
    url: `${HOST}?generateSingleInvoices&tax_number=${taxNumber}&revenue_head_id=3`,
    dataType: 'json',
    success: function (data) {
      console.log(data)
      if (data.status === 2) {


      } else if (data.status === 1) {
        $("#generating_inv").removeClass("hidden")

        $("#msg_boxx").html(``)
        Swal.fire({
          title: 'Generated',
          text: "Invoice has been generated successfully, Invoice details will be sent to your email and phone number! check your spam/junk folder if you can't mail.",
          icon: 'success',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Open Invoice',
          allowOutsideClick: false
        }).then((result) => {
          if (result.isConfirmed) {
            // nextPrev(1)
            // openInvoice(data.invoice_number)
            window.location.href = `viewinvoice.html?invnumber=${data.invoice_number}&load=true`
          }
        })


      }
    },
    error: function (request, error) {
      $("#msg_boxx").html(`
        <p class="text-danger text-center mt-4 text-lg">Something went wrong</p>
      `)
      $("#generating_inv").removeClass("hidden")
      console.log(error);
    }
  });
}

async function getTaxFiling() {
  let userDATA = JSON.parse(localStorage.getItem("userDataPrime"))

  if (userDATA) {
    try {
      const response = await fetch(`${HOST}?getTaxFilingByUser&id=${userDATA.id}`)
      const data = await response.json()

      if (data.status === 0) {

      } else {
        data.message.forEach(element => {
          $("#eservicesTable").append(`
          <tr>
            <td>${element.created_at.split(" ")[0]}</td>
            <td>${element.created_at.split(" ")[0]}</td>
            <td>${element.tax_filling_refrence}</td>
            <td>${element.tax_to_file}</td>
            <td>${element.application_status}</td>
          </tr>
        `)
        });

      }


    } catch (error) {
      console.log(error)
    }
  }

}

getTaxFiling()