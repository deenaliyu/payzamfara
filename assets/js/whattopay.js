let userDATA = JSON.parse(localStorage.getItem("userDataPrime"))

$("#selCateg").on("change", function () {
  let valuee = $(this).val()
  console.log(valuee)
  if (valuee === "Corporate") {

    $("#formShower").html(`
      <div class="col-md-6">
        <div class="form-group">
          <label>Industry</label>
          <select class="form-select mt-1">
            <option>Bakery</option>
            <option>Information Technology</option>
          </select>
        </div>
      </div>

      <div class="col-md-6">
        <div class="form-group">
          <label>Name of Organization</label>
          <input type="email" class="form-control mt-1" placeholder="" />
        </div>
      </div>
    `)


  } else {

    $("#formShower").html(`
      <div class="col-md-6">
        <div class="form-group">
          <label>Full Name</label>
          <input class="form-control mt-1" placeholder="Your Full Name" />
        </div>
      </div>

      <div class="col-md-6">
        <div class="form-group">
          <label>Email Address</label>
          <input class="form-control mt-1" placeholder="Your email Address" />
        </div>
      </div>
    `)


  }
})

if (userDATA) {
  $("#the_generating").html(`
    <div class="form-group">
      <select name="" id="getMDAs" class="form-select">
        <option disabled selected>--- Select MDA ---</option>
      </select>
      </div>

      <p class="text-3xl fontBold mt-10">List of Payable Taxes</p>
      <p class="text-gray-600">Select those applicable</p>

      <div class="mt-6" id="listOfpayable">

    </div>
  `)

} else {
  $("#the_generating").html(`
    <div class="form-group mb-4">
      <label>Category</label>
      <select class="form-select mt-1 payInputs" data-name="category" id="selCateg">
        <option value="Individual">Individual</option>
        <option value="Corporate">Corporate</option>
      </select>
    </div>

    <div id="formShower" class="row mb-4">
      <div class="col-md-6">
        <div class="form-group">
          <label>First Name</label>
          <input class="form-control mt-1 payInputs" data-name="first_name" placeholder="First Name" />
        </div>
      </div>

      <div class="col-md-6">
        <div class="form-group">
          <label>Last Name</label>
          <input class="form-control mt-1 payInputs" data-name="surname" placeholder="Your Last Name" />
        </div>
      </div>
      
    </div>

    <div class="form-group mb-4">
      <label>Email Address</label>
      <input class="form-control mt-1 payInputs" data-name="email" placeholder="Your email Address" />
    </div>

    <div class="row gy-3">
      <div class="col-md-6">
        <div class="form-group">
          <label>TIN</label>
          <input class="form-control mt-1 payInputs" data-name="tax_number" maxlength="15" placeholder="Your 14-digits TIN number E.g 1111111111-0000" />
        </div>
      </div>

      <div class="col-md-6">
        <div class="form-group">
          <label>Phone No.</label>
          <input class="form-control mt-1 payInputs" data-name="phone" placeholder="11 digits phone number e.g 08032434354" maxlength="11" />
        </div>
      </div>
    </div>

    <div class="form-group mt-3">
      <label for="">Select MDA</label>
      <select name="" id="getMDAs" class="form-select  mt-1 payInputs" data-name="mda">
        <option disabled selected>--- Select MDA ---</option>
      </select>
    </div>

    <p class="text-3xl fontBold mt-10">List of Payable Taxes</p>
    <p class="text-gray-600 mt-4">Select those applicable</p>

    <div class="mt-6" id="listOfpayable">

    </div>
  `)
}

async function fetchMDAs() {
  let config = {
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*"
    }
  }
  const response = await fetch(`${HOST}/?getMDAs`)
  const MDAs = await response.json()


  if (MDAs.status === 0) {
  } else {
    MDAs.message.forEach((MDA, i) => {
      $("#getMDAs").append(`
        <option value="${MDA.fullname}">${MDA.fullname}</option>
      `)
    });

  }
}

fetchMDAs()

$("#getMDAs").on("change", function () {
  let theRev = $(this).val()
  fetchRevHeads(theRev)
  // console.log(theRev)
})

async function fetchRevHeads(mdn) {
  const response = await fetch(`${HOST}/?getMDAsRevenueHeads&mdName=${mdn}`)
  const revHeads = await response.json()
  $("#listOfpayable").html("")

  if (revHeads.status === 0) {
  } else {
    revHeads.message.forEach((revHd, i) => {
      $("#listOfpayable").append(`
        <div class="form-check mb-2">
          <input class="form-check-input revHeadedds" type="checkbox" value="${revHd["id"]}" id="${revHd["COL_4"]}">
          <label class="form-check-label text-gray-700" for="${revHd["COL_4"]}">${revHd["COL_4"]}</label>
        </div>
      `)
    });

  }
}

async function generateInvoiceNon() {
  let allInputs = document.querySelectorAll(".payInputs")

  $("#msg_box").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)

  $("#generating_inv").addClass("hidden")



  let obj = {
    "endpoint": "createPayerAccount",
    "data": {
      "state": "",
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


  $.ajax({
    type: "POST",
    url: HOST,
    dataType: 'json',
    data: StringedData,
    success: function (data) {
      // console.log(data)
      if (data.status === 2) {

        let taxNumber = data.data.message.tax_number
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
      $("#msg_box").html(`
        <p class="text-danger text-center mt-4 text-lg">Something went wrong !</p>
      `)
      $("#generating_inv").removeClass("hidden")
    }
  });

}

async function generateInvoiceNum(taxNumber) {
  console.log(taxNumber)
  let allRevs = document.querySelectorAll(".revHeadedds")
  let reven = ""
  allRevs.forEach(ddd => {
    if (ddd.checked) {
      reven += ddd.value + ","
    }
  })
  let rev_id = reven.slice(0, -1);

  $.ajax({
    type: "GET",
    url: `${HOST}?generateSingleInvoices&tax_number=${taxNumber}&revenue_head_id=${rev_id}`,
    dataType: 'json',
    success: function (data) {
      console.log(data)
      if (data.status === 2) {


      } else if (data.status === 1) {
        $("#generating_inv").removeClass("hidden")
        $("#generateInvModal").modal("hide")

        Swal.fire({
          title: 'Generated',
          text: "Invoice has been generated successfully, Invoice details will be sent to your email and phone number!",
          icon: 'success',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Open Invoice',
          allowOutsideClick: false
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = `invoice.html?invnum=${data.invoice_number}`
          }
        })


      }
    },
    error: function (request, error) {
      $("#msg_box").html(`
        <p class="text-danger text-center mt-4 text-lg">Something went wrong>
      `)
      $("#generateInvoice").removeClass("hidden")
      console.log(error);
    }
  });
}

$("#generating_inv").on("click", function (e) {
  e.preventDefault()

  if (userDATA) {
    generateInvoiceNum(userDATA.tax_number)
  } else {
    generateInvoiceNon()
  }
})
