let USER_SESSION = localStorage.getItem("MDAINFO")
  finalUSER_SESSION = JSON.parse(USER_SESSION)
  let mdaID = finalUSER_SESSION.fullname

async function fetchRevenueHeads() {

  const response = await fetch(`${HOST}/?getMDAsRevenueHeads&mdName=${mdaID}`)
  const revenues = await response.json()
  $("#loader").remove()

  if (revenues.status === 0) {
  } else {


    revenues.message.forEach((revenueHead, i) => {
      $("#showRevHEads").append(`
      <tr>
        <td>${i + 1}</td>
        <td>${revenueHead.COL_4}</td>
        <td>${revenueHead.COL_6}</td>
        <td><button class="button">Query</button></td>
      </tr>    
    `)
    });

  }
}

fetchRevenueHeads().then(res => {
  $('#dataTable').DataTable();
})

$("#createRevenue").on("click", () => {

  $("#msg_box2").html(`
      <div class="flex justify-center items-center mt-4">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    `)
  $("#createRevenue").addClass("hidden")

  let allInputs = document.querySelectorAll(".revInput")
  let obj = {
    "endpoint": "createMDArHead",
    data: {
      mda_id: mdaID,
      "economicCode": "045RF",
      "adminCode": "22",
    }
  }
  allInputs.forEach(allInput => {
    obj.data[allInput.dataset.name] = allInput.value
  })
  let stringedOBJ = JSON.stringify(obj)
  console.log(stringedOBJ)

  $.ajax({
    type: "POST",
    url: HOST,
    dataType: 'json',
    data: stringedOBJ,
    success: function (data) {
      console.log(data)
      if (data.status === 2) {
        $("#msg_box2").html(`
          <p class="text-warning text-center mt-4 text-lg">${data.message}</p>
        `)
        $("#createRevenue").removeClass("hidden")

      } else if (data.status === 1) {
        $("#msg_box2").html(`
          <p class="text-success text-center mt-4 text-lg">${data.message}</p>
        `)
        $("#createRevenue").removeClass("hidden")
        setTimeout(() => {
          $('#createRevenueHead').modal('hide');
          window.location.reload()
        }, 1000);

      }
    },
    error: function (request, error) {
      $("#msg_box2").html(`
        <p class="text-danger text-center mt-4 text-lg">Something is wrong!</p>
      `)
      $("#createRevenue").removeClass("hidden")
      console.log(error);
    }
  });

})