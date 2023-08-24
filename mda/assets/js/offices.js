let THEUSERINFO = JSON.parse(window.localStorage.getItem("mdaDataPrime"));

$("#createOffice").on("click", () => {

  $("#msg_box").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)
  $("#createOffice").addClass("hidden")

  let allInputs = document.querySelectorAll(".officeInput")
  let obj = {
    "endpoint": "createOffices",
    "data": {
      "mda_id": THEUSERINFO.mda_id,
      "user_id": THEUSERINFO.id,
    }
  }
  allInputs.forEach(allInput => {
    obj.data[allInput.dataset.name] = allInput.value
  })
  let stringedOBJ = JSON.stringify(obj)
  // console.log(stringedOBJ)

  $.ajax({
    type: "POST",
    url: HOST,
    dataType: 'json',
    data: stringedOBJ,
    success: function (data) {
      console.log(data)
      if (data.status === 2) {
        $("#msg_box").html(`
            <p class="text-warning text-center mt-4 text-lg">${data.message}</p>
          `)
        $("#createOffice").removeClass("hidden")

      } else if (data.status === 1) {
        $("#msg_box").html(`
            <p class="text-success text-center mt-4 text-lg">${data.message}</p>
          `)
        $("#createOffice").removeClass("hidden")
        setTimeout(() => {
          $('#crtNewOffice').modal('hide');
          fetchInvoice().then((uu) => {
            $("#dataTable").DataTable();
            $("#dataTable2").DataTable();

          });
        }, 1000);

      } else {
        $("#msg_box").html(`
          <p class="text-danger text-center mt-4 text-lg">Something is wrong!</p>
        `)
        $("#createOffice").removeClass("hidden")
      }
    },
    error: function (request, error) {
      $("#msg_box").html(`
          <p class="text-danger text-center mt-4 text-lg">Something is wrong!</p>
        `)
      $("#createOffice").removeClass("hidden")
      console.log(error);
    }
  });

})

async function fetchInvoice() {
  const response = await fetch(`${HOST}?getOffice&office_type=1`);
  const response2 = await fetch(`${HOST}?getOffice&office_type=2`)

  const Offices1 = await response.json();
  const Offices2 = await response2.json();

  if (Offices1.status === 1) {
    $("#showOffice1").html("")
    Offices1.message.reverse().forEach((office1, i) => {
      $("#showOffice1").append(`
        <tr>
          <td>${i + 1}</td>
          <td>${office1.office_name}</td>
          <td>${office1.state}</td>
          <td>${office1.lga}</td>
          <td>${office1.no_of_users}</td>
        </tr>
      `);
    });
  } else {
    $("#dataTable").DataTable();
  }

  if (Offices2.status === 1) {
    $("#showOffice2").html("")
    Offices2.message.reverse().forEach((office2, i) => {
      $("#showOffice2").append(`
        <tr>
          <td>${i + 1}</td>
          <td>${office2.office_name}</td>
          <td>${office2.state}</td>
          <td>${office2.lga}</td>
          <td>0</td>
        </tr>
      `);
    });
  } else {
    $("#dataTable2").DataTable();
  }
}

fetchInvoice().then((uu) => {
  $("#dataTable").DataTable();
  $("#dataTable2").DataTable();

});