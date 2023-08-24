let userDATA = JSON.parse(localStorage.getItem("mdaDataPrime"))

console.log(userDATA)



// $("#logout").on("click", function (e) {
//   e.preventDefault();
//   localStorage.removeItem('mdaDataPrime');
//   window.location.href = "index.html"
// })

function Profile() {
  $(".mainInfo").html(`
    <h4 class="text-[18px] text-[#2E2F5B] mt-2">${userDATA.email}</h4>
  `)
  $(".prof").html(`
    <div class="flex justify-between md:w-[550px] mt-2 items-center">
      <label class="w-[195px]">Email</label>
      <div class="form-group md:w-[454px] w-full">
        <input class="form-control mt-1 regInputs" readonly type="text" value="${userDATA.email}"
          maxlength="15" />
      </div>
    </div>
    <div class="flex justify-between md:w-[550px] mt-2 items-center">
      <label class="w-[195px]">Phone</label>
      <div class="form-group md:w-[454px] w-full">
        <input class="form-control mt-1 regInputs" readonly type="text" value="${userDATA.phone_number}"
        maxlength="15" />
      </div>
    </div>

      `)
  let profilo = ""

  profilo += `
    <div class="flex justify-between mt-2">
      <label class="w-4/12">Email</label>
      <div class="form-group w-8/12">
        <input class="form-control mt-1 updtProf" data-name="email" type="text" value="${userDATA.email}" />
      </div>
    </div>

    <div class="flex justify-between mt-2 items-center">
      <label class="w-4/12">Phone number</label>
      <div class="form-group w-8/12">
        <input class="form-control mt-1 updtProf" data-name="phone_number" type="text" value="${userDATA.phone_number}" maxlength="15" />
      </div>
    </div>
    <div class="flex justify-between mb-3 mt-2 items-center">
    <label class="w-4/12">Old Password</label>
    <div class="form-group w-8/12">
      <input class="form-control mt-1 passinput" id="oldPass" type="text" placeholder="**********" />
    </div>
    <iconify-icon icon="ic:outline-remove-red-eye cursor-pointer" onclick="showPass(0)"></iconify-icon>
  </div>

  <div class="flex justify-between mb-3 items-center ">
  <label class="w-4/12">New Password</label>
    <div class="form-group w-8/12">
      <input class="form-control mt-1 pass passinput updtProf" id="newPass" type="text"
        placeholder="**********" data-name="password"/>
    </div>
    <iconify-icon icon="ic:outline-remove-red-eye cursor-pointer" onclick="showPass(1)"></iconify-icon>
  </div>

  <div class="flex justify-between mb-3 items-center">
  <label class="w-4/12">Confirm New <br>Password</label>
    <div class="form-group w-8/12">
      <input class="form-control mt-1 newpass passinput" id="newPass2" type="text"
        placeholder="**********" />
    </div>
    <iconify-icon icon="ic:outline-remove-red-eye cursor-pointer" onclick="showPass(2)"></iconify-icon>
  </div>
  `

  $("#updtProfile").html(profilo)

}

Profile()

function showPass(pos) {
    let AllF = document.querySelectorAll(".passinput")
  
    if (AllF[pos].type === "password") {
  
      AllF[pos].type = "text"
  
    } else {
      AllF[pos].type = "password"
    }
  }
$("#updateProfile").on("click", function (e) {
  e.preventDefault()

  let allInputs = document.querySelectorAll(".updtProf")
  let allRadioBoxs = document.querySelectorAll(".form-check-input")
  $("#msg_box").html(`
      <div class="flex justify-center items-center mt-4">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    `)
  $("#updateProfile").addClass("hidden")

  let obj = {
    // id: userDATA.id,
    ...userDATA,
         "mda_id": userDATA.mda_id,
          "dashboard_access": "full",
          "revenue_head_access": "full",
          "payment_access": "full",
          "users_access": "full",
          "report_access": "full",

  }
  delete obj.img
  allInputs.forEach(allInput => {
    if (allInput.value === "") {

    } else {
      obj[allInput.dataset.name] = allInput.value
    }

  })

  console.log(obj)
  let queryString = new URLSearchParams(obj).toString();
  console.log(queryString)

  $.ajax({
    type: "GET",
    url: `${HOST}?updateMDAUser&${queryString}`,
    dataType: 'json',
    success: function (data) {
      console.log(data)
      if (data.status === 2) {
        $("#msg_box").html(`
          <p class="text-warning text-center mt-4 text-lg">${data.message}</p>
        `)
        $("#updateProfile").removeClass("hidden")

      } else if (data.status === 1) {
        $("#msg_box").html(`
          <p class="text-success text-center mt-4 text-lg">${data.message}</p>
        `)
        let newObj = obj
        localStorage.setItem("adminDataPrime", JSON.stringify(obj))

        setTimeout(() => {
          window.location.reload()
        }, 1000);

      }
    },
    error: function (request, error) {
      console.log(error);
      $("#msg_box").html(`
        <p class="text-danger text-center mt-4 text-lg">An error occured !</p>
      `)
      $("#updateProfile").removeClass("hidden")
    }
  });

})

let userDetails
async function fetchUserDetails() {
  const response = await fetch(`${HOST}?userProfileMda&mda_id=${userDATA.id}`)
  const userPrf = await response.json()

  console.log(userPrf)
  userDetails = userPrf.user

  $("#theProfImg").attr("src", userPrf.user.img)
  $("#theProfImg2").attr("src", userPrf.user.img)
  $("#theProfImg1").attr("src", userPrf.user.img)


}

fetchUserDetails().then((uu) => {
    Profile()
  });


$("#openUpload").on("click", function (e) {
  document.querySelector("#profile_picIn").click()
})

let input = document.querySelector("#profile_picIn")
let preview = document.querySelector("#preview")
let thePicUrl = ""

function profileChanged() {

  $("#proffer").removeClass("hidden")

  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      preview.src = reader.result;
      thePicUrl = reader.result
    };
  }
}

$("#updatePic").on("click", function () {
  let obj = {
    "endpoint": "updatePixMda",
    "data": {
      "id": userDATA.id,
      "img": thePicUrl
    }

  }

  $("#msg_center").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)
  $("#updatePic").addClass("hidden")
  $.ajax({
    type: "POST",
    url: HOST,
    data: JSON.stringify(obj),
    dataType: 'json',
    success: function (data) {
      console.log(data)
      if (data.status === 1) {

        document.querySelector("#theProfImg").src = thePicUrl

        let storedData = JSON.parse(localStorage.getItem("mdaDataPrime"))
        storedData.img = thePicUrl
        localStorage.setItem("adminDataPrime", JSON.stringify(storedData))

        $("#msg_center").html(`
          <p class="text-success">Picture updated successfully !</p>
        `)

        setTimeout(() => {
          $("#proffer").addClass("hidden")
          $("#msg_center").html(``)
          $("#updatePic").removeClass("hidden")
        }, 1000);

        setTimeout(() => {
          window.location.reload()
        }, 2000);


      } else {
        $("#msg_center").html(`
          <p class="text-danger">Network Error, Try again</p>
        `)
        $("#updatePic").removeClass("hidden")

      }
    },
    error: function (request, error) {
      console.log(error);
      $("#msg_center").html(`
        <p class="text-danger">something went wrong ! Try again</p>
      `)
      $("#updatePic").removeClass("hidden")
    }
  });
})