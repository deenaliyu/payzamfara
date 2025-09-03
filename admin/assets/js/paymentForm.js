
async function fetchMDAs() {
  const response = await fetch(`${HOST}/?getMDAs`)
  const MDAs = await response.json()

  if (MDAs.status === 0) {

  } else {
    MDAs.message.forEach(MDA => {
      $("#mdaDropdown").append(`
        <option value="${MDA.id}">${MDA.fullname}</option>
      `)
    });
  }

}
fetchMDAs()

$("#addInput").on("click", () => {
  $("#moreOptions").append(`
    <div class="flex gap-2 items-center paymentInput">
      <div class="col mb-0">
        <div class="mb-3">
          <label for="defaultSelect" class="form-label">Add input </label>
          <select id="defaultSelect" class="form-select">
            <option value="text">Text</option>
            <option value="number">Number</option>
          </select>
        </div>
      </div>
      <div class="col mb-3">
        <label for="nameLarge" class="form-label">Input title</label>
        <input type="text" id="nameLarge" class="form-control" placeholder="" />
      </div>
      <button class="" onclick="closeCont(this)"><iconify-icon icon="ph:x-thin"></iconify-icon></button>
    </div>
  `)
})

function closeCont(e) {
  e.parentElement.remove()
}

$("#createForm").on("click", () => {
  $("#msg_box").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)
  $("#createForm").addClass("hidden")
  let allPaymInputs = document.querySelectorAll(".paymentInput")
  let theContent = ""
  let obj = {
    "endpoint": "createMDAPaymentForm",
    "data": {
      "mda_id": $("#mdaDropdown").val(),
    }
  }

  allPaymInputs.forEach(paymntInpt => {
    let theSelect = paymntInpt.querySelector("select").value
    let thePuter = paymntInpt.querySelector("input").value
    let theValue = thePuter + "^" + theSelect
    theContent += theValue + ","
  })

  obj.data["content"] = theContent
  console.log(JSON.stringify(obj))
  $.ajax({
    type: "POST",
    url: HOST,
    dataType: 'json',
    data: JSON.stringify(obj),

    success: function (data) {
      console.log(data)
      if (data.status === 1) {
        $("#msg_box").html(`
          <p class="text-success text-center">${data.message}</p>
        `)
        $("#createForm").removeClass("hidden")
        setTimeout(() => {
          $("#createform").modal("hide")
        }, 1000);
      } else {
        $("#msg_box").html(`
          <p class="text-info text-center">${data.message}</p>
        `)
        $("#createForm").removeClass("hidden")
      }

    },
    error: function (request, error) {
      console.log(error)
      $("#msg_box").html(`
          <p class="text-danger text-center">An error occured !</p>
        `)
      $("#createForm").removeClass("hidden")
    }
  });


})