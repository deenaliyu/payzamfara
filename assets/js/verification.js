$("#sendEmail").on("click", function (e) {
  e.preventDefault()
  const urlParams = new URLSearchParams(window.location.search);
  const userid = urlParams.get('id');
  const useremail = urlParams.get('email');
  const userphone = urlParams.get('phone');

  $("#msg_boxx").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)

  $("#theMsg").addClass("hidden")
  $.ajax({
    type: "GET",
    url: `${HOST}?sendEmail&id=${userid}`,
    dataType: 'json',
    // data: StringedData,
    success: function (data) {
      console.log(data)
      if (data.status === 1) {

        $("#msg_boxx").html(`
          <p class="text-success text-center mt-5">Verification link has been sent to ${useremail}, check you mail.
           Check your spam/junk folder if you can't mail.</p>
        `)
        $("#theMsg").remove()

      } else {

        $("#msg_boxx").html(`
          <p class="text-danger mt-5">something went wrong. Try again!</p>
        `)
        $("#theMsg").removeClass("hidden")
      }
    },
    error: function (request, error) {
      $("#msg_boxx").html(`
        <p class="text-danger">something went wrong. Try again!</p>
      `)

      $("#msg_boxx").html("")
      $("#theMsg").removeClass("hidden")

    }
  });

})

$("#sendSMS").on("click", function (e) {
  e.preventDefault()

  const urlParams = new URLSearchParams(window.location.search);
  const userid = urlParams.get('id');
  const useremail = urlParams.get('email');
  const userphone = urlParams.get('phone');

  window.location.href = `phoneverification.html?id=${userid}&phone=${userphone}`
})