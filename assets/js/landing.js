$(".landing_cards").on("mouseover", function () {

  $(".landing_cards").each(function (index) {
    $(this).removeClass("activo")
  });
  $(this).addClass("activo")
})



// $("#verifyInv").on("click", function () {
//   let invoiceNumber = document.querySelector("#invNumm").value
//   if (invoiceNumber === "") {
//     $(".verifiyer").html("<p class='text-[#ff0000] text-sm'>Please insert your Invoice Number</p>")
//   } else (
//     fetch(`${HOST}/index.php?verifyInvoice&invoice_number=${invoiceNumber}`)
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(data)
//         if (data.status === 1) {
//           if (data.message.payment_status == "unpaid") {
//             $("#verifyInvModal").modal("hide")
//             $("#notPaidInvoice").modal("show")

//             $("#procToPay").on("click", function () {
//               window.location.href = `invoice.html?invnum=${invoiceNumber}`
//             })
//           } else if (data.message.payment_status == "paid") {
//             $("#verifyInvModal").modal("hide")
//             $("#paidInvoice").modal("show")
//           }
//         } else if (data.status === 0) {
//           $(".verifiyer").html("<p class='text-[#ff0000] text-sm'>Wrong Invoice Number</p>")
//         }
//       })
//   )

// })

// $("#verifyInvo").on("click", function () {
//   let invoiceNumber = document.querySelector("#invNumme").value
//   if (invoiceNumber === "") {
//     $(".verifiyere").html("<p class='text-[#ff0000] text-sm'>Please insert your Invoice Number</p>")
//   } else (
//     fetch(`${HOST}/index.php?verifyInvoice&invoice_number=${invoiceNumber}`)
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(data)
//         if (data.status === 1) {
//           if (data.message.payment_status == "unpaid") {
//             $("#verifyInvModal").modal("hide")
//             $("#notPaidInvoice").modal("show")
//           } else if (data.message.payment_status == "paid") {
//             $("#verifyInvModal").modal("hide")
//             $("#paidInvoice").modal("show")
//           }
//         } else if (data.status === 0) {
//           $(".verifiyere").html("<p class='text-[#ff0000] text-sm'>Wrong Invoice Number</p>")
//         }
//       })
//   )

// })

// $("#selectAccType").on("change", function () {
//   let val = $(this).val()

//   if (val === "2") {
//     $("#indivCorporate").html(`
//       <div class="row">

//         <div class="col-md-6">
//           <div class="form-group mb-3">
//             <label>First Name</label>
//             <input type="text" placeholder="First Name" class="form-control genInputs" data-name="first_name">
//           </div>
//         </div>

//         <div class="col-md-6">
//           <div class="form-group mb-3">
//             <label>Last Name</label>
//             <input type="text" placeholder="Last Name" class="form-control genInputs" data-name="surname">
//           </div>
//         </div>
//       </div>  
//     `)

//   } else {

//     $("#indivCorporate").html(`
//       <div class="form-group mb-3">
//         <label>Name of Organization <span class="text-[red]">*</span></label>
//         <input class="form-control mt-1 genInputs" data-name="first_name" type="text" placeholder="Enter organization name" required />
//         <small class="validate text-[red]"></small>
//       </div>

//       <div class="form-group mb-3">
//         <label>Industry <span class="text-[red]">*</span></label>
//         <select class="form-select mt-1 genInputs" data-name="industry" required>
//           <option value="Commercial">Commercial</option>
//           <option value="Pool/betting">Pool/betting</option>
//           <option value="Education">Education</option>
//           <option value="Hospitality">Hospitality</option>
//           <option value="Manufacturing">Manufacturing</option>
//           <option value="Retail">Retail</option>
//           <option value="Mining">Mining</option>
//           <option value="Services">Services</option>
//           <option value="Agriculture">Agriculture</option>
//           <option value="Housing/real estate/lands">Housing/real estate/lands</option>
//           <option value="Transporting">Transporting</option>
//           <option value="Legal">Legal</option>
//           <option value="General">General</option>
//         </select>
//         <small class="validate text-[red]"></small>
//       </div>    
//     `)

//   }
// })

// let USER_SESION = JSON.parse(localStorage.getItem("userDataPrime"))

// $("#payNowBtn").on("click", function () {
//   if (USER_SESION) {
//     window.location.href = "whattopay.html"
//   } else {
//     window.location.href = "paynow.html"
//   }
// })

// if (USER_SESION) {

//   $("#generating").html(`
//     <div class="form-group">
//       <select name="" id="getMDAs" class="form-select">
//         <option disabled selected>--- Select MDA ---</option>
//       </select>
//       </div>

//       <p class="text-3xl fontBold mt-10">List of Payable Taxes</p>
//       <p class="text-gray-600">Select those applicable</p>

//       <div class="mt-6" id="listOfpayable">

//      </div>
//   `)



//   fetchMDAs()


// } else {

//   $("#generating").html(`
//     <div class="form-group mb-3">
//       <label>Category</label>
//       <select class="form-select mt-1 genInputs" required data-name="category" id="selectAccType">
//         <option value="1">Corporate</option>
//         <option value="2" selected>Individual</option>
//         <option value="3">State Agency</option>
//         <option value="4">Federal Agency</option>
//       </select>
//     </div>

//     <div id="indivCorporate">
//       <div class="row">

//         <div class="col-md-6">
//           <div class="form-group mb-3">
//             <label>First Name</label>
//             <input type="text" placeholder="First Name" class="form-control genInputs" data-name="first_name">
//           </div>
//         </div>

//         <div class="col-md-6">
//           <div class="form-group mb-3">
//             <label>Last Name</label>
//             <input type="text" placeholder="Last Name" class="form-control genInputs" data-name="surname">
//           </div>
//         </div>
//       </div>
//     </div>


//     <div class="form-group mb-3">
//       <label>Email</label>
//       <input type="email" placeholder="johndoe@example.com" class="form-control genInputs" data-name="email">
//     </div>
//     <div class="row">
//       <div class="col-md-6">
//         <div class="form-group mb-3">
//           <label>TIN</label>
//           <input type="number" placeholder="Your 14-digits TIN number E.g 1111111111-0000" class="form-control genInputs" data-name="tax_number">
//         </div>
//       </div>
//       <div class="col-md-6">
//         <div class="form-group mb-3">
//           <label>Phone Number</label>
//           <input type="text" placeholder="2340000000000" class="form-control genInputs" data-name="phone">
//         </div>
//       </div>
//     </div>

//     <div class="form-group">
//       <select name="" id="getMDAs" class="form-select">
//         <option disabled selected>--- Select MDA ---</option>
//       </select>
//     </div>

//     <p class="text-3xl fontBold mt-10">List of Payable Taxes</p>
//     <p class="text-gray-600">Select those applicable</p>
//     <div class="mt-6" id="listOfpayable"></div>

//   `)
//   $("#selectAccType").on("change", function () {
//     let val = $(this).val()

//     if (val === "2") {
//       $("#indivCorporate").html(`
//         <div class="row">

//           <div class="col-md-6">
//             <div class="form-group mb-3">
//               <label>First Name</label>
//               <input type="text" placeholder="First Name" class="form-control genInputs" data-name="first_name">
//             </div>
//           </div>

//           <div class="col-md-6">
//             <div class="form-group mb-3">
//               <label>Last Name</label>
//               <input type="text" placeholder="Last Name" class="form-control genInputs" data-name="surname">
//             </div>
//           </div>
//         </div>  
//       `)

//     } else {

//       $("#indivCorporate").html(`
//         <div class="form-group mb-3">
//           <label>Name of Organization <span class="text-[red]">*</span></label>
//           <input class="form-control mt-1 genInputs" data-name="first_name" type="text" placeholder="Enter organization name" required />
//           <small class="validate text-[red]"></small>
//         </div>

//         <div class="form-group mb-3">
//           <label>Industry <span class="text-[red]">*</span></label>
//           <select class="form-select mt-1" data-name="industry" required>
//             <option value="Commercial">Commercial</option>
//             <option value="Pool/betting">Pool/betting</option>
//             <option value="Education">Education</option>
//             <option value="Hospitality">Hospitality</option>
//             <option value="Manufacturing">Manufacturing</option>
//             <option value="Retail">Retail</option>
//             <option value="Mining">Mining</option>
//             <option value="Services">Services</option>
//             <option value="Agriculture">Agriculture</option>
//             <option value="Housing/real estate/lands">Housing/real estate/lands</option>
//             <option value="Transporting">Transporting</option>
//             <option value="Legal">Legal</option>
//             <option value="General">General</option>
//           </select>
//           <small class="validate text-[red]"></small>
//         </div>    
//       `)

//     }
//   })

//   fetchMDAs()

// }

// $("#getMDAs").on("change", function () {
//   let theRev = $(this).val()
//   fetchRevHeads(theRev)
//   // console.log(theRev)
// })

// async function fetchRevHeads(mdn) {
//   const response = await fetch(`${HOST}/?getMDAsRevenueHeads&mdName=${mdn}`)
//   const revHeads = await response.json()
//   $("#listOfpayable").html("")

//   if (revHeads.status === 0) {
//   } else {
//     revHeads.message.forEach((revHd, i) => {
//       $("#listOfpayable").append(`
//         <div class="form-check mb-2">
//           <input class="form-check-input revHeadedds" type="checkbox" value="${revHd["id"]}" id="${revHd["COL_4"]}">
//           <label class="form-check-label text-gray-700" for="${revHd["COL_4"]}">${revHd["COL_4"]}</label>
//         </div>
//       `)
//     });

//   }
// }
// async function fetchMDAs() {
//   let config = {
//     mode: 'cors',
//     headers: {
//       'Content-Type': 'application/json',
//       "Access-Control-Allow-Origin": "*",
//       "Access-Control-Allow-Methods": "*"
//     }
//   }
//   const response = await fetch(`${HOST}/?getMDAs`)
//   const MDAs = await response.json()


//   if (MDAs.status === 0) {
//   } else {
//     MDAs.message.forEach((MDA, i) => {
//       $("#getMDAs").append(`
//         <option value="${MDA.fullname}">${MDA.fullname}</option>
//       `)
//     });

//   }
// }

// async function generateInvoiceNon() {
//   let allInputs = document.querySelectorAll(".genInputs")

//   $("#msg_box").html(`
//     <div class="flex justify-center items-center mt-4">
//       <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
//     </div>
//   `)

//   $("#generating_inv").addClass("hidden")



//   let obj = {
//     "endpoint": "createPayerAccount",
//     "data": {
//       "state": "",
//       "lga": "",
//       "address": "",
//       "surname": "",
//       "password": "12345",
//       "verification_status": "grfdses"
//     }
//   }
//   allInputs.forEach(allInput => {
//     obj.data[allInput.dataset.name] = allInput.value
//   })

//   let StringedData = JSON.stringify(obj)


//   $.ajax({
//     type: "POST",
//     url: HOST,
//     dataType: 'json',
//     data: StringedData,
//     success: function (data) {
//       // console.log(data)
//       if (data.status === 2) {

//         let taxNumber = data.data.message.tax_number
//         console.log(taxNumber)
//         generateInvoiceNum(taxNumber, obj.data.phone)

//       } else if (data.status === 1) {

//         let taxNumber = data.data.tax_number
//         console.log(data)
//         generateInvoiceNum(taxNumber, obj.data.phone)

//       }
//     },
//     error: function (request, error) {
//       console.log(error);
//       $("#msg_box").html(`
//         <p class="text-danger text-center mt-4 text-lg">Something went wrong !</p>
//       `)
//       $("#generating_inv").removeClass("hidden")
//     }
//   });

// }

// async function generateInvoiceNum(taxNumber, phoneNum) {
//   console.log(taxNumber)
//   let allRevs = document.querySelectorAll(".revHeadedds")
//   let reven = ""
//   allRevs.forEach(ddd => {
//     if (ddd.checked) {
//       reven += ddd.value + ","
//     }
//   })
//   let rev_id = reven.slice(0, -1);

//   $.ajax({
//     type: "GET",
//     url: `${HOST}?generateSingleInvoices&tax_number=${taxNumber}&revenue_head_id=${rev_id}`,
//     dataType: 'json',
//     success: function (data) {
//       console.log(data)
//       if (data.status === 2) {


//       } else if (data.status === 1) {
//         $("#generating_inv").removeClass("hidden")
//         $("#generateInvModal").modal("hide")

//         let message = `Invoice generated successfully, Your invoice Number : ${data.invoice_number}!`
//         $.ajax({
//           type: "GET",
//           url: `${HOST}?sendSMS&number=${phoneNum}&message=${message}`,
//           dataType: 'json',
//           success: function (data) {
//             console.log(data)
//           },
//           error: function (request, error) {
//             console.log(error);
//           }
//         })

//         Swal.fire({
//           title: 'Generated',
//           text: "Invoice has been generated successfully, Invoice details will be sent to your email and phone number!",
//           icon: 'success',
//           confirmButtonColor: '#3085d6',
//           cancelButtonColor: '#3085d6',
//           confirmButtonText: 'Open Invoice',
//           allowOutsideClick: false
//         }).then((result) => {
//           if (result.isConfirmed) {
//             window.location.href = `invoice.html?invnum=${data.invoice_number}`
//           }
//         })


//       }
//     },
//     error: function (request, error) {
//       $("#msg_box").html(`
//         <p class="text-danger text-center mt-4 text-lg">Something went wrong>
//       `)
//       $("#generateInvoice").removeClass("hidden")
//       console.log(error);
//     }
//   });
// }

// $("#generating_inv").on("click", function (e) {
//   e.preventDefault()

//   if (USER_SESION) {
//     generateInvoiceNum(USER_SESION.tax_number, USER_SESION.phone)
//   } else {
//     generateInvoiceNon()
//   }
// })

function sendMsg(e) {
  // e.preventDefault()
  $("#msg_box").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)
  let theInputs = document.querySelectorAll(".themsgform .form-control")

  for (let i = 0; i < theInputs.length; i++) {
    const inn = theInputs[i];
    if (inn.value === "") {
      alert("All fields are required !")
      break;
    }



    if (i === theInputs.length - 1) {
      let obj = {
        "endpoint": "createSupport",
        "data": {
          "id": 0,
          "tin": "",
          "img": "",
          "mda_id": "",
          "enum_id": ""
        }
      }
      theInputs.forEach(inp => {
        obj.data[inp.dataset.name] = inp.value
      })

      console.log(obj)
      let StringedData = JSON.stringify(obj);
      // console.log(StringedData)

      $.ajax({
        type: "POST",
        url: HOST,
        dataType: 'json',
        data: StringedData,
        success: function (data) {
          $("#msg_box").html(``)
          Swal.fire({
            title: 'Sent',
            text: "Your message has been received, we will get back to you shortly, Thanks !",
            icon: 'success',
            confirmButtonColor: '#3085d6',
            // cancelButtonColor: '#3085d6',
            confirmButtonText: 'Okay',
            allowOutsideClick: false
          })

        },
        error: function (request, error) {
          alert("Can't send your message.")
          $("#msg_box").html(``)
        }
      });

    }


  }


}