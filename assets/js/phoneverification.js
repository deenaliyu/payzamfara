const inputFields = document.querySelectorAll(".wrapper input.field");
const urlParams = new URLSearchParams(window.location.search);
const userid = urlParams.get('id');
const phonenumber = urlParams.get('phone');

if (inputFields) {
  inputFields.forEach((field) => {
    field.addEventListener("input", handleInput);
  });
}

function handleInput(e) {
  let inputField = e.target;
  if (inputField.value.length >= 1) {
    let nextField = inputField.nextElementSibling;
    // nextField.focus();

    if (nextField === null) {
      $("#msg_box").html(`
        <div class="flex justify-center items-center mt-4">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
      `)
      $("#countdown").addClass("hidden")
      $("#resend").addClass("hidden")

      let code = ""
      inputFields.forEach(hh => {
        code += hh.value
      })

      $.ajax({
        type: "GET",
        url: `${HOST}?smsUpdateAccount&id=${userid}&code=${code}`,
        dataType: 'json',
        // data: StringedData,
        success: function (data) {
          console.log(data)
          if (data.status === 1) {

            $("#msg_box").html(`
              <p class="text-success text-center">Account verified successfully !</p>
            `)
            setTimeout(() => {
              window.location.href = "signin.html"
            }, 1000);
          } else {
            $("#countdown").removeClass("hidden")
            $("#resend").removeClass("hidden")

            $("#msg_box").html(`
              <p class="text-danger text-center">Code didn't match!</p>
            `)
          }
        },
        error: function (request, error) {
          console.log(error)
          $("#countdown").removeClass("hidden")
          $("#resend").removeClass("hidden")

          $("#msg_box").html(`
            <p class="text-danger text-center">Code didn't match!</p>
          `)
        }
      });

    } else {
      return nextField && nextField.focus();
    }
  }
}

function sendSMS(numm) {
  $("#resend").addClass("hidden")
  $("#msg_box").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)

  $.ajax({
    type: "GET",
    url: `${HOST}?smsVerify&id=${userid}&num=${numm}`,
    dataType: 'json',
    // data: StringedData,
    success: function (data) {
      console.log(data)
      if (data.status === 1) {
        // $("#thetext").html(`Your Account has been verified successfully!`)
        $("#preloader").remove()
        $("#resend").removeClass("hidden")
        $("#msg_box").html(``)
        startTimer()
      } else {

      }
    },
    error: function (request, error) {
      console.log(error)
      $("#msg_box").html(``)
    }
  });
}

sendSMS(1)
$("#resend").on("click", function () {
  sendSMS(6)
})

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
