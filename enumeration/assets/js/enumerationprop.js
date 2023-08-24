let USERINFO3 = JSON.parse(window.localStorage.getItem("enumDataPrime"));

let theIDD

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
  let allInputs = document.querySelectorAll(".enumInput2")


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

let password = generateRandomString()

function previewPage() {
  let allInputs = document.querySelectorAll(".enumInput")
  let allInputs2 = document.querySelectorAll(".enumInput2")

  $("#password").val(password)
  allInputs.forEach((inputt, i) => {

    let theInputt = document.querySelector(`.enumPrev1[data-name='${inputt.dataset.name}']`)
    if (theInputt) {
      theInputt.value = inputt.value
    }
  });

  allInputs2.forEach((inputt, i) => {

    let theInputt = document.querySelector(`.enumPrev2[data-name='${inputt.dataset.name}']`)
    if (theInputt) {
      theInputt.value = inputt.value
    }

    if (i === allInputs.length - 1) {
      nextPrev(1)
    }
  });



}

function registerUser() {
  $("#theButton").addClass("hidden")
  $("#msg_box").html(`
        <div class="flex justify-center items-center mb-4">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
      `)

  let EnumData = {
    "endpoint": "createEnumTaxPayer",
    "data": [
      {
        "category": "properties"
      },
      {
        "account_type": "3",
        "by_account": USERINFO3.id
      }
    ]
  }

  let allInputs = document.querySelectorAll(".enumInput")
  let allInputs2 = document.querySelectorAll(".enumInput2")


  allInputs.forEach((inputt, i) => {
    EnumData.data[0][inputt.dataset.name] = inputt.value
  })

  allInputs2.forEach((inputt, i) => {
    EnumData.data[1][inputt.dataset.name] = inputt.value
  })

  // console.log(EnumData)

  const publitio = new PublitioAPI('ksWdvJ3JjfV5JZnHyRqv', 'ruxLmts4NiupnoddqVi1Z70tnoMmf5yT')
  let theImageSrc = document.querySelector("#theImageThing").src
  let fileInput = document.querySelector(".imgUpl")

  if (fileInput.value === "") {
    EnumData.data[0]["img"] = theImageSrc
    sendToDB()

  } else {
    let fileUrl = fileInput.files[0]
    const reader = new FileReader()
    reader.readAsBinaryString(fileUrl);

    publitio.uploadFile(fileUrl, 'file', {
      title: `ENUMTAXPAYER - ${EnumData.data[0].first_name} ${EnumData.data[0].last_name}`,
      public_id: `${EnumData.data[0].email}`,

    }).then((data) => {
      EnumData.data[0]["img"] = data.url_preview
      // console.log(data.url_preview)
      sendToDB()
    }).catch((error) => {
      sendToDB()
    })
  }


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
        // $("#theButton").addClass("hidden")
        if (data.id) {
          theIDD = data.id
        }
        nextPrev(1)
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
  // sendToDB()
}

function generateRandomString() {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;

  for (var i = 0; i < 8; i++) {
    var randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }

  return result;
}

function getLatsAndLng() {
  if ("geolocation" in navigator) {
    // Request the user's location
    navigator.geolocation.getCurrentPosition(function (position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;

      $("#latitude").val(latitude)
      $("#longitude").val(longitude)

      // console.log("Latitude: " + latitude + ", Longitude: " + longitude);
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

getLatsAndLng()

function emailVerifcation() {
  $("#sendMailBtnCont").addClass("hidden")
  $("#msg_box2").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)

  $.ajax({
    type: "GET",
    url: `${HOST}?sendEmailEnum&id=${theIDD}`,
    dataType: 'json',
    // data: StringedData,
    success: function (data) {

      $("#sendMailBtnCont").removeClass("hidden")
      $("#msg_box2").html(`
        <div class="flex justify-center items-center mt-4">
          <p class="text-success">Email sent successfully !</p>
        </div>
      `)
      nextPrev(3)
    },
    error: function (request, error) {
      console.log(error)
      $("#sendMailBtnCont").removeClass("hidden")
      $("#msg_box2").html(`
        <div class="flex justify-center items-center mt-4">
          <p class="text-warning">Something went wrong, try SMS verification!</p>
        </div>
      `)
    }
  });
}

function phoneVerifcation() {
  $("#sendMailBtnCont").addClass("hidden")
  $("#msg_box2").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)

  $.ajax({
    type: "GET",
    url: `${HOST}?smsVerifyEnum&id=${theIDD}&num=1`,
    dataType: 'json',
    // data: StringedData,
    success: function (data) {

      $("#sendMailBtnCont").removeClass("hidden")
      $("#msg_box2").html(`
        <div class="flex justify-center items-center mt-4">
          <p class="text-success">message sent successfully !</p>
        </div>
      `)
      nextPrev(1)
      startTimer()
    },
    error: function (request, error) {
      console.log(error)
      $("#sendMailBtnCont").removeClass("hidden")
      $("#msg_box2").html(`
        <div class="flex justify-center items-center mt-4">
          <p class="text-warning">Something went wrong, try SMS verification!</p>
        </div>
      `)
    }
  });
}

function resend() {
  $("#resCont").addClass("hidden")
  $("#msg_box3").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)

  $.ajax({
    type: "GET",
    url: `${HOST}?smsVerifyEnum&id=${theIDD}&num=6`,
    dataType: 'json',
    // data: StringedData,
    success: function (data) {

      $("#resCont").removeClass("hidden")
      $("#msg_box3").html(`
        <div class="flex justify-center items-center mt-4">
          <p class="text-success">message sent successfully !</p>
        </div>
      `)
      startTimer()
    },
    error: function (request, error) {
      console.log(error)
      $("#resCont").removeClass("hidden")
      $("#msg_box3").html(`
        <div class="flex justify-center items-center mt-4">
          <p class="text-warning">Something went wrong, try email verification!</p>
        </div>
      `)
    }
  });
}


function startTimer() {
  var button = document.getElementById("resend");
  button.disabled = true;
  button.classList.add("disabled")

  var timeLeft = 60;
  var timer = setInterval(function () {
    document.getElementById("countdown").innerHTML = "resend in: " + timeLeft + "s";
    timeLeft--;

    if (timeLeft < 0) {
      clearInterval(timer);
      button.disabled = false;
      button.classList.remove("disabled")
      document.getElementById("countdown").innerHTML = "";
    }
  }, 1000);
}

function verifyAccounttt() {
  let codee = document.querySelector("#codeee").value
  $("#theVerifyy").addClass("hidden")
  $("#msg_boxx").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)

  $.ajax({
    type: "GET",
    url: `${HOST}?smsUpdateAccountEnum&id=${theIDD}&code=${codee}`,
    dataType: 'json',
    // data: StringedData,
    success: function (data) {

      if (data.status === 1) {
        $("#theVerifyy").removeClass("hidden")
        $("#msg_boxx").html(`
          <div class="flex justify-center items-center mt-4">
            <p class="text-success">${data.message}</p>
          </div>
        `)
        nextPrev(1)
      } else {
        $("#theVerifyy").removeClass("hidden")
        $("#msg_boxx").html(`
          <div class="flex justify-center items-center mt-4">
            <p class="text-warning">${data.message}!</p>
          </div>
        `)
      }

    },
    error: function (request, error) {
      console.log(error)
      $("#theVerifyy").removeClass("hidden")
      $("#msg_boxx").html(`
        <div class="flex justify-center items-center mt-4">
          <p class="text-danger">Failed to Activate Account</p>
        </div>
      `)
    }
  });
}
