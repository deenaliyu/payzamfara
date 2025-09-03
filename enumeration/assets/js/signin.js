$("#LoginAmin").on("click", (e) => {
  // alert("done")
  let emailAdd = document.querySelector("#emailAdm").value
  let password = document.querySelector("#passwordm").value
  e.preventDefault()
  $(".msg_box").html(`
      <div class="flex justify-center items-center mt-4">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    `)

  $("#LoginAmin").addClass("hidden")

  $.ajax({
    type: "GET",
    url: `${HOST}/?enumerator_users_login&email=${emailAdd}&password=${password}`,
    dataType: 'json',
    success: function (data) {
      if (data.status === 2) {
        $(".msg_box").html(`
            <p class="text-warning text-center mt-4 text-lg">${data.message}</p>
          `)
        $("#LoginAmin").removeClass("hidden")

      } else if (data.status === 1) {
        $(".msg_box").html(`
            <p class="text-success text-center mt-4 text-lg">${data.message}</p>
          `)

        $("#LoginAmin").removeClass("hidden")

        localStorage.setItem("enumDataPrime", JSON.stringify(data.user))
        setTimeout(() => {
          window.location.href = "./dashboard.html"
        }, 1000);

      } else if (data.status === 0) {
        $(".msg_box").html(`
            <p class="text-warning text-center mt-4 text-base">${data.message}</p>
          `)

        $("#LoginAmin").removeClass("hidden")
      }
    },
    error: function (request, error) {
      console.log(error);
      $(".msg_box").html(`
          <p class="text-danger text-center mt-4 text-lg">An error occured !</p>
        `)

      $("#LoginAmin").removeClass("hidden")
    }
  });

})
