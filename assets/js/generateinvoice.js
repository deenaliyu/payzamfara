let theRevs = {}
let theCateg = ["", "Corporate", "Individual", "State Agency", "Federal Agency"]
let AllRevs;

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

function updateSelectedOption() {
  // Get the select element
  var select = document.getElementById("rev_heads");

  // Update the selected option text
  var selectedOption = select.options[select.selectedIndex];
  // document.getElementById("select-search").value = selectedOption.text;
}

function addInput() {

  let theStrng = generateRandomString()

  $("#moreInput").append(`
    <div class="flex items-center gap-3 mb-4">
      <select onchange="updateSelectedOption()" class="${theStrng} inputClass form-select genInv revHeadsss" required id="rev_heads">

      </select>

      <iconify-icon icon="zondicons:minus-outline" class="cursor-pointer" id="${theStrng}" onclick="removeInpt(this)"></iconify-icon>
    </div>
  `)

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

$(".selCateg").on("change", function () {
  let theVal = $(this).val()

  fetchRevHeads(theCateg[theVal])
})

async function getAllRevH() {
  const response = await fetch(`${HOST}/?getAllRevenueHeads`)
  const revHeads = await response.json()

  if (revHeads.status === 0) {
  } else {
    AllRevs = revHeads.message
  }
}

getAllRevH()

async function fetchRevHeads(categ) {
  const response = await fetch(`${HOST}/?getAllRevenueHeads`)
  const revHeads = await response.json()

  if (revHeads.status === 0) {
  } else {
    theRevs = revHeads.message
    // console.log(theRevs)
    $("#rev_heads").html(`
      <option disabled selected>Select--</option>
    `)
    revHeads.message.forEach((revHd, i) => {
      if (revHd.COL_5 === categ) {
        $("#rev_heads").append(`
        <option value="${revHd["id"]}">${revHd["COL_4"]}</option>
      `)
      }

    });

  }
}
let userInfo = JSON.parse(localStorage.getItem("userDataPrime"));
// console.log(userInfo)
function continuePage() {
  let genInv = document.querySelectorAll(".firstDiv .genInv")

  let theVal = document.querySelector(".selCateg").value
  if(userInfo === null){
    if (theVal === "2") {

      $("#theName").html(`
        <div class="form-group w-full">
          <label for="">First name *</label>
          <input type="text" class="form-control payInputs" required data-name="first_name"
            placeholder="" value="">
        </div>
  
        <div class="form-group w-full">
          <label for="">Surname *</label>
          <input type="text" class="form-control payInputs" required data-name="surname"
          placeholder="" value="">
        </div>
      `)
    } else if (theVal === "1") {
      $("#theName").html(`
        <div class="form-group w-full">
          <label for="">Company Name *</label>
          <input type="text" class="form-control payInputs" required data-name="first_name"
          placeholder="" value="">
        </div>
  
        <div class="form-group w-full hidden">
          <label for="">Surname *</label>
          <input type="text" class="form-control payInputs" value="&nbsp;" required data-name="surname"
          placeholder="" value="">
        </div>
      `)
    } else if (theVal === "3" || theVal === "4") {
      $("#theName").html(`
      <div class="form-group w-full">
        <label for="">Name of Agency *</label>
        <input type="text" class="form-control payInputs" required data-name="first_name"
        placeholder="" value="">
      </div>
  
      <div class="form-group w-full hidden">
        <label for="">Surname *</label>
        <input type="text" class="form-control payInputs" value="&nbsp;" required data-name="surname"
        placeholder="" value="">
      </div>
    `)
    } else {
  
    }
  
    $("#theEmail").html(`
    <div class="form-group w-full">
    <label for="">Email *</label>
    <input type="text" class="form-control payInputs" required data-name="email"
    placeholder="Enter your Email Address" value="
  
  <div class="form-group w-full">
    <label for="">Phone number *</label>
    <input type="number" class="form-control payInputs" minlength="11" maxlength="11" required
      data-name="phone" placeholder="Your 11-digits phone number" value="">
  </div>
    `)
  
    $("#theTin").html(`
    <label for="">TIN (Optional)</label>
    <input type="text" class="form-control payInputs" id="tin" data-name="tin" placeholder="Enter your TIN" value="">
    `)
  
    $("#theLga").html(`
    <input type="text" class="form-control payInputs" minlength="10" required data-name="address"
    placeholder=" Enter your address" value="">
    `)
  }else{
    if (theVal === "2") {

      $("#theName").html(`
        <div class="form-group w-full">
          <label for="">First name *</label>
          <input type="text" class="form-control payInputs" required data-name="first_name"
            placeholder="${userInfo.first_name}" value="${userInfo.first_name}">
        </div>
  
        <div class="form-group w-full">
          <label for="">Surname *</label>
          <input type="text" class="form-control payInputs" required data-name="surname"
          placeholder="${userInfo.surname}" value="${userInfo.surname}">
        </div>
      `)
    } else if (theVal === "1") {
      $("#theName").html(`
        <div class="form-group w-full">
          <label for="">Company Name *</label>
          <input type="text" class="form-control payInputs" required data-name="first_name"
          placeholder="${userInfo.first_name}" value="${userInfo.first_name}">
        </div>
  
        <div class="form-group w-full hidden">
          <label for="">Surname *</label>
          <input type="text" class="form-control payInputs" value="&nbsp;" required data-name="surname"
          placeholder="${userInfo.surname}" value="${userInfo.surname}">
        </div>
      `)
    } else if (theVal === "3" || theVal === "4") {
      $("#theName").html(`
      <div class="form-group w-full">
        <label for="">Name of Agency *</label>
        <input type="text" class="form-control payInputs" required data-name="first_name"
        placeholder="${userInfo.first_name}" value="${userInfo.first_name}">
      </div>
  
      <div class="form-group w-full hidden">
        <label for="">Surname *</label>
        <input type="text" class="form-control payInputs" value="&nbsp;" required data-name="surname"
        placeholder="${userInfo.surname}" value="${userInfo.surname}">
      </div>
    `)
    } else {
  
    }
  
    $("#theEmail").html(`
    <div class="form-group w-full">
    <label for="">Email *</label>
    <input type="text" class="form-control payInputs" required data-name="email"
    placeholder="Enter your Email Address" value="${userInfo.email}">
  </div>
  
  <div class="form-group w-full">
    <label for="">Phone number *</label>
    <input type="number" class="form-control payInputs" minlength="11" maxlength="11" required
      data-name="phone" placeholder="Your 11-digits phone number" value="${userInfo.phone}">
  </div>
    `)
  
    $("#theTin").html(`
    <label for="">TIN (Optional)</label>
    <input type="text" class="form-control payInputs" id="tin" data-name="tin" placeholder="Enter your TIN" value="${userInfo.tin}">
    `)
  
    $("#theLga").html(`
    <input type="text" class="form-control payInputs" minlength="10" required data-name="address"
    placeholder=" Enter your address" value="${userInfo.address}">
    `)
  }
  

  for (let i = 0; i < genInv.length; i++) {
    const genn = genInv[i];

    if (genn.value === "") {
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
$("#rev_heads").on("change", function () {
  let val = $(this).val()
  setPrice(val)
})
let aa = [];
function setPrice(val) {
  let theRevenue = theRevs.filter(rr => rr.id === val)
  console.log(val, theRevenue)
  $("#amountTopay").val(theRevenue[0]["COL_6"])
  the_id = theRevenue[0].id
  aa["message"] = theRevenue;
}


function goToPreviewPage() {
  let payInputs = document.querySelectorAll(".payInputs")
  aa.message.forEach((items, i)=> {
   $("#bill").append(`
   <div class="flex space-x-4">
   <p>Category of Tax:</p>
   <p>${items.COL_5}</p>
 </div>
   <div class="flex space-x-3">
   <p>Name of Tax:</p>
   <p>${items.COL_4}</p>
 </div>
 <div class="flex space-x-3">
   <p>Amount to be Paid:</p>
   <p>${items.COL_6}</p>
 </div>

   `)
  })
  console.log(aa)
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
          "state": "Akwa Ibom",
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
  console.log(taxNumber)
  $.ajax({
    type: "GET",
    url: `${HOST}?generateSingleInvoices&tax_number=${taxNumber}&revenue_head_id=${the_id}`,
    dataType: 'json',
    success: function (data) {
      console.log(data)
      if (data.status === 2) {


      } else if (data.status === 1) {
        $("#generating_inv").removeClass("hidden")

        $("#msg_box").html(``)
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
            nextPrev(1)
            openInvoice(data.invoice_number)
            // window.location.href = `invoice.html?invnum=${data.invoice_number}`
          }
        })


      }
    },
    error: function (request, error) {
      $("#msg_box").html(`
        <p class="text-danger text-center mt-4 text-lg">Something went wrong, Try again.</p>
      `)
      $("#generating_inv").removeClass("hidden")
      console.log(error);
    }
  });
}