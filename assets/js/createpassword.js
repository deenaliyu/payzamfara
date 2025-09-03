
$("#createPass").on("click", function () {

  const urlParams = new URLSearchParams(window.location.search);
  const userid = urlParams.get('id');
  const verification = urlParams.get('verification');

  let password = document.querySelector("#password").value
  let pass2 = document.querySelector("#password").value

  if (password === "") {
    $("#msg_boxi").html(`<p class="text-danger">Password cant be empty</p>`)
  } else if (password !== pass2) {
    $("#msg_boxi").html(`<p class="text-danger">Confirm passowrd must match password !</p>`)
  } else {
    $("#msg_boxi").html(`
      <div class="flex justify-center items-center mt-4">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    `)
    $.ajax({
      type: "GET",
      url: `${HOST}?verifyAdminUser&code=${verification}&id=${userid}&password=${password}`,
      dataType: 'json',
      // data: StringedData,
      success: function (data) {
        console.log(data)

        if (data.status === 1) {

          $("#msg_boxi").html(`<p class="text-[green]">Password Updated Successfully !</p>`)

          setTimeout(() => {
            window.location.href = "./admin/index.html"
          }, 1000);


        } else {
          $("#msg_boxi").html(`<p class="text-danger">Verification failed !</p>`)
        }
      },
      error: function (request, error) {
        console.log(error);
        $("#msg_boxi").html(`<p class="text-danger">Something went wrong !</p>`)
      }
    });
  }

})

