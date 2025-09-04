const urlParams = new URLSearchParams(window.location.search);
const userid = urlParams.get('id');

$(document).ready(function () {
  $.ajax({
    type: "GET",
    url: `${HOST}?sendEmail&id=${userid}`,
    dataType: "json",
    success: function (data) {
      console.log(data);
      if (data.status === 1) {
        console.log('OTP sent successfully !')
      } else {
        $("#msg_boxx").html(`
          <p class="text-danger mt-5">Something went wrong. Try again!</p>
        `);
        // $("#theMsg").removeClass("hidden");
      }
    },
    error: function (request, error) {
      $("#msg_boxx").html(`
        <p class="text-danger">Something went wrong. Try again!</p>
      `);
      // $("#theMsg").removeClass("hidden");
    }
  });
});




// OTP verification on verification page
$(document).on('click', '#verifyOtpBtn', function (e) {
  e.preventDefault();
  const code = (document.getElementById('otpInput')?.value || '').trim();

  if (!userid || !code) {
    $("#msg_boxx").html(`<p class="text-danger text-center mt-3">Please enter the OTP code.</p>`);
    return;
  }

  $("#msg_boxx").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `);

  $.ajax({
    type: 'GET',
    url: `${HOST}?smsUpdateAccount&id=${userid}&code=${code}`,
    dataType: 'json',
    success: function (data) {
      if (data.status === 1) {
        $("#msg_boxx").html(`<p class="text-success text-center mt-3">Account verified successfully!</p>`);
        setTimeout(() => { window.location.href = 'signin.html'; }, 1000);
      } else {
        $("#msg_boxx").html(`<p class="text-danger text-center mt-3">Invalid OTP. Please try again.</p>`);
      }
    },
    error: function () {
      $("#msg_boxx").html(`<p class="text-danger text-center mt-3">Something went wrong. Try again!</p>`);
    }
  });
});