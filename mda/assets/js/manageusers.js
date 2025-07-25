const urlParams = new URLSearchParams(window.location.search);
const theUserID = urlParams.get('id')
// 

$("#createUser").on("click", function () {
  let allInputs = document.querySelectorAll(".userInputs")
  let allRadioBoxs = document.querySelectorAll(".form-check-input")

  for (let i = 0; i < allInputs.length; i++) {

    if (allInputs[i].value === "") {
      $("#msg_box").html(`
          <p class="text-[red] text-center mt-4 text-lg">All fields are required</p>
        `)
      break;
    } else {
      // e.preventDefault()
      $("#msg_box").html(`
          <div class="flex justify-center items-center mt-4">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
        `)
      $("#createUser").addClass("hidden")

      let obj = {
        "id": theUserID,
      }

      allInputs.forEach(allInput => {
        obj[allInput.dataset.name] = allInput.value
      })
      allRadioBoxs.forEach(allRadioBox => {
        if (allRadioBox.checked) {
          obj[allRadioBox.name] = allRadioBox.value
        }
      })
      // console.log(obj)
      let queryString = new URLSearchParams(obj).toString();
      $.ajax({
        type: "GET",
        url: `${HOST}?updateMDAUser&${queryString}`,
        dataType: 'json',
        // data: StringedData,
        success: function (data) {
          console.log(data)
          if (data.status === 2) {
            $("#msg_box").html(`
              <p class="text-warning text-center mt-4 text-lg">${data.message}</p>
            `)
            $("#createUser").removeClass("hidden")

          } else if (data.status === 1) {
            $("#msg_box").html(`
                  <p class="text-success text-center mt-4 text-lg">${data.message}</p>
                `)

            setTimeout(() => {
              window.location.href = "users.html"
            }, 1000);
          }
        },
        error: function (request, error) {
          console.log(error);
          $("#msg_box").html(`
              <p class="text-danger text-center mt-4 text-lg">An error occured !</p>
            `)
          $("#createUser").removeClass("hidden")
        }
      });
    }
    break;
  }
  return false;


})

async function fetchUSER() {


  const response = await fetch(
    `${HOST}/php/index.php?mda_id=4&usersParticularMDA`
  );
  const userInvoices = await response.json();

  if (userInvoices.status === 1) {

    let theUSER = userInvoices.message.filter(tt => tt.id === theUserID)[0]

    let alluserInputs = document.querySelectorAll(".userInputs")
    alluserInputs.forEach(uu => {
      uu.value = theUSER[uu.dataset.name]
    })


  } else {

  }
}
{/* <td class="text-[#22C55E]">Full access</td> */ }
fetchUSER()

$("#opPas").on("click", function () {
  let pasInp = document.querySelector(".passInput")

  if (pasInp.type === "password") {
    pasInp.type = "text"
  } else {
    pasInp.type = "password"
  }
})
// http://localhost/Primeguage-IBS/php/?updateAdminUser&email=primeguage%40gmail.com&id=1