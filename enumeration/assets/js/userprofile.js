let theINFO = JSON.parse(window.localStorage.getItem("enumDataPrime"));

async function getAnalytics() {
  try {
    const response = await fetch(`${HOST}?getEnumerationAgent&id=${theINFO.id}`)
    const data = await response.json()

    // console.log(data)

    if (data.status === 1) {
      $("#theProff").html(`
        <div class="flex justify-between md:w-[550px]">
          <label class="w-[195px]">Email</label>
          <div class="form-group md:w-[454px] w-full">
            <input class="form-control mt-1" type="text" value="${data.message[0].email}" readonly />
          </div>
        </div>
        <div class="flex justify-between md:w-[550px] mt-2 items-center">
          <label class="w-[195px]">Phone number</label>
          <div class="form-group md:w-[454px] w-full">
            <input class="form-control mt-1 regInputs" type="text" value="${data.message[0].phone}" readonly />
          </div>
        </div>
        <div class="flex justify-between md:w-[550px] mt-2 items-center">
          <label class="w-[195px]">State</label>
          <input type="text" class="form-control" value="${data.message[0].state}" readonly />
        </div>
        <div class="flex justify-between md:w-[550px] mt-2 items-center">
          <label class="w-[195px]">Local Govt</label>
          <input type="text" class="form-control" value="${data.message[0].lga}" readonly />
        </div>
        
        <div class="flex justify-between md:w-[550px] mt-2 items-center">
          <label class="w-[195px]">Address</label>
          <input type="text" class="form-control" value="${data.message[0].address}" readonly />
        </div>
      `)
    } else {

    }

  } catch (error) {
    console.log(error)
  }
}

getAnalytics()


$("#showThem2").html(`
  <tr class="text-center">
    <td colspan="5">
      <div class="flex justify-center items-center mb-4">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    </td>
  </tr>
`)

async function fetchUsers() {
  const response = await fetch(`${HOST}?getActivityLogs&userId=${theINFO.id}&user_category=Enum User`);
  const userAudits = await response.json();

  $("#showThem2").html("")

  if (userAudits.status === 0) {
    $("#showThem2").append(`
      <tr>
        <td></td>
        <td>No data available</td>
        <td></td>
      </tr>
    `)
  } else {
    userAudits.message.forEach((audits, i) => {
      $("#showThem2").append(`
      <tr>
        <td>${audits.timeIn}</td>
        <td>${audits.comment}</td>
      </tr>
      `)
    });
  }


}

fetchUsers()

function showPass(pos) {
  let AllF = document.querySelectorAll(".passinput")

  if (AllF[pos].type === "password") {

    AllF[pos].type = "text"

  } else {
    AllF[pos].type = "password"
  }
}

let profImg2 = document.querySelector("#theProfImg2");
let theProfImgg = document.querySelector("#theProfImg")

if (userInfo2.img === "" || userInfo2.img === null) {
  profImg2.src = "./assets/img/userprofile.png"
  theProfImgg.src = "./assets/img/userprofile.png"
} else {
  profImg2.src = userInfo2.img
  theProfImgg.src = userInfo2.img
}

$("#updatePass").on("click", function (e) {

  let passField = document.querySelector("#newPass").value
  let confirmField = document.querySelector("#newPass2").value

  $("#msg_box2").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)
  $("#updatePass").addClass("hidden")

  if (passField === "" || confirmField === "") {

    $("#msg_box2").html(`
      <p class="text-danger text-center">Fields can't be empty!</p>
    `)
    $("#updatePass").removeClass("hidden")

  } else if (passField !== confirmField) {

    $("#msg_box2").html(`
      <p class="text-danger text-center">Confirm password didn't match password!</p>
    `)
    $("#updatePass").removeClass("hidden")

  } else {

    $.ajax({
      type: "GET",
      url: `${HOST}?changePasswordEnum&id=${theINFO.id}&password=${passField}`,
      dataType: 'json',
      success: function (data) {
        console.log(data)
        if (data.status === 1) {
          $("#msg_box2").html(`
            <p class="text-success text-center mt-4 text-lg">Password changed successfully !</p>
          `)


          setTimeout(() => {
            window.location.href = "./index.html"
          }, 1000);
        } else {


        }
      },
      error: function (request, error) {
        console.log(error);
        $("#msg_box2").html(`
          <p class="text-danger text-center mt-4 text-lg">Something went wrong !</p>
        `)
        $("#updatePass").removeClass("hidden")
      }
    });


  }


})


$("#profile_picIn").on("click", function () {

  $("#profile_picIn").addClass("hidden")
  $("#msg_center").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)

  let fileInput = document.querySelector("#picUpload")
  const publitio = new PublitioAPI('ksWdvJ3JjfV5JZnHyRqv', 'ruxLmts4NiupnoddqVi1Z70tnoMmf5yT')

  if (fileInput.value === "") {
    alert("Upload picture first")
  } else {
    let fileUrl = fileInput.files[0]
    const reader = new FileReader()
    reader.readAsBinaryString(fileUrl);

    let obj = {
      "endpoint": "updatePixEnum",
      "data": {
        "id": theINFO.id,
        "img": ""
      }
    }

    publitio.uploadFile(fileUrl, 'file', {
      title: `ENUM_USER - ${theINFO.fullname}`,
      public_id: `ENUM_USER_${theINFO.email
        }`,

    }).then((data) => {
      obj.data["img"] = data.url_preview

      let theImgurl = data.url_preview
      $.ajax({
        type: "POST",
        url: HOST,
        data: JSON.stringify(obj),
        dataType: 'json',
        success: function (data) {
          console.log(data)
          if (data.status === 1) {

            let storedData = JSON.parse(localStorage.getItem("enumDataPrime"))
            storedData.img = theImgurl
            console.log(storedData)
            localStorage.setItem("enumDataPrime", JSON.stringify(storedData))

            $("#msg_center").html(`
              <p class= "text-success"> Picture updated successfully!</p >
            `)
            $("#profile_picIn").removeClass("hidden")
            setTimeout(() => {
              window.location.reload()
            }, 1000);


          } else {
            $("#msg_center").html(`
              <p class= "text-danger"> something went wrong !</p >
              `)
            $("#profile_picIn").removeClass("hidden")

          }
        },
        error: function (request, error) {
          console.log(error);
          $("#msg_center").html(`
            <p class= "text-danger"> something went wrong! Try again</p >
          `)
          $("#profile_picIn").removeClass("hidden")
        }
      });
      // console.log(data.url_preview)
    }).catch((error) => {
      $("#msg_center").html(`
        <p class= "text-danger"> something went wrong while uploading! Try again</p >
      `)
      $("#profile_picIn").removeClass("hidden")

    })

  }





})