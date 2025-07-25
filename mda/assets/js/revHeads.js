let USER_SESSION = localStorage.getItem("mdaDataPrime")

let finalUSER_SESSION = JSON.parse(USER_SESSION)
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

let ALLREV = ""
let THEMDAINFO = JSON.parse(localStorage.getItem("MDAINFO"))

async function fetchRevenueHeads() {

  const response = await fetch(`${HOST}/?getMDAsRevenueHeads&mdName=${THEMDAINFO.fullname}`)
  const revenues = await response.json();

  console.log(revenues);

  $("#loader").remove()

  ALLREV = revenues

  if (revenues.status === 0) {
    $('#dataTable').DataTable();
  } else {


    revenues.message.reverse().forEach((revenueHead, i) => {
      // console.log(revenues)
      $("#showPayment").append(`
      <tr>
        <td>${i + 1}</td>
        <td>${revenueHead.COL_4}</td>
        <td>${revenueHead.COL_5}</td>
        <td>&#8358;${revenueHead.COL_6}</td>
        <td>Monthly</td>
        

        

        <td>
        <div class="bg-green-200 rounded-2xl py-1 px-3">
          <p class=${revenueHead.status == 'approved' ? 'text-[green]' : 'text-[orange]'}>${revenueHead.status}</p>
        </div>
      </td>
      
        <td>
                          <div
                            class="flex justify-content-between align-items-center"
                          >
                          <button
                          onclick="editRevFunc(this)" data-revid="${revenueHead.id}" data-bs-toggle="modal"
                          data-bs-target="#editRev"
                          >
                            <iconify-icon
                              icon="fa6-regular:pen-to-square"
                              style="font-size: 2.4vh"
                            ></iconify-icon>
                          </button>
                          <button
                            onclick="deleteRev(this)"
                            data-revid="${revenueHead.id}"
                          >
                            <iconify-icon
                              icon="material-symbols:delete-outline-sharp"
                              style="font-size: 2.4vh"
                            ></iconify-icon>
                          </button>
                          </div>
                        </td>
      </tr>    
    `)
    });

  }
}

fetchRevenueHeads();

$("#createRevenue").on("click", () => {

  $("#msg_box").html(`
      <div class="flex justify-center items-center mt-4">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    `)
  $("#createRevenue").addClass("hidden")

  let allInputs = document.querySelectorAll(".revInput")
  let categInputs = document.querySelectorAll(".form-check-input")

  let obj = {
    "endpoint": "createMDArHead",
    data: {
      mda_id: THEMDAINFO.fullname,
      "economicCode": "045RF",
      "adminCode": "22",
      "date": "",
      "category": ""
    }
  }
  allInputs.forEach(allInput => {
    obj.data[allInput.dataset.name] = allInput.value
  })

  let categga = []
  categInputs.forEach(catego => {
    if (catego.checked) {
      categga.push(catego.value)
    }
  })
  obj.data["category"] = categga.join(",")

  let stringedOBJ = JSON.stringify(obj)
  console.log(stringedOBJ)

  $.ajax({
    type: "POST",
    url: HOST,
    dataType: 'json',
    data: stringedOBJ,
    success: function (data) {
      console.log(data)
      $("#msg_box").html("")

      for (const key in data) {
        const element = data[key];

        if (element.status === 1) {
          $("#msg_box").append(`
            <p class="text-success text-center mt-4 text-lg">${key}: ${element.message}</p>
          `)
        } else {
          $("#msg_box").append(`
            <p class="text-warning text-center mt-4 text-lg">${key}: ${element.message}</p>
          `)
        }


      }
      // $("#createRevenue").removeClass("hidden")
      setTimeout(() => {
        $('#createRevenueHead').modal('hide');
        window.location.reload()
      }, 1000);

    },
    error: function (request, error) {
      $("#msg_box").html(`
        <p class="text-danger text-center mt-4 text-lg">Something is wrong!</p>
      `)
      $("#createRevenue").removeClass("hidden")
      console.log(error);
    }
  });

})



// delete revhead
function deleteRev(e) {
  let theRevId = e.dataset.revid
  console.log(theRevId)
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: "GET",
        url: `${HOST}?deleteRevenueHead&id=${theRevId}`,
        dataType: "json",
        success: function (data) {
          console.log(data)
          if (data.status === 1) {
            Swal.fire(
              'Deleted!',
              'Revenue Head has been deleted.',
              'success'
            )
            setTimeout(() => {
              window.location.reload()
            }, 1000);
          } else {
            Swal.fire(
              'Try again!',
              'Something went wrong, try again !',
              'error'
            )
          }
        },
        error: function (request, error) {
          Swal.fire(
            'Try again!',
            'Something went wrong, try again !',
            'error'
          )
        }
      });

    }
  })
}

function editRevFunc(e) {
  let editaID = e.dataset.revid
  console.log(editaID)
  sessionStorage.setItem("revUpdate", editaID)

  let theREV = ALLREV.message.find(dd => dd.id === editaID)
  console.log(theREV)
  let allInputss = document.querySelectorAll(".revInput2")
  allInputss.forEach(inn => {
    inn.value = theREV[inn.dataset.name]
  })

}

// edit revenue data

$("#editRevenue").on("click", () => {
  let theRevId = sessionStorage.getItem("revUpdate")
  $("#msg_box2").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)
  $("#editRevenue").addClass("hidden")

  let allInputs = document.querySelectorAll(".revInput2")

  let obj = {
    data: {
      id: theRevId,
    }
  }
  allInputs.forEach(allInput => {
    obj.data[allInput.dataset.name] = allInput.value
  })
  let queryString = $.param(obj.data);

  console.log(queryString);

  $.ajax({
    type: "GET",
    url: `${HOST}?updateRevenueHead&` + queryString,
    dataType: "json",
    success: function (data) {
      console.log(data)
      if (data.status === 2) {
        $("#msg_box2").html(`
          <p class="text-warning text-center mt-4 text-lg">${data.message}</p>
        `)
        $("#editRevenue").removeClass("hidden")

      } else if (data.status === 1) {
        $("#msg_box2").html(`
          <p class="text-success text-center mt-4 text-lg">${data.message}</p>
        `)
        $("#editMDAs").removeClass("hidden")
        setTimeout(() => {
          $('#editMda').modal('hide');
          window.location.reload()
        }, 1000);

      }
    },
    error: function (request, error) {
      $("#msg_box2").html(`
        <p class="text-danger text-center mt-4 text-lg">Something went wrong, Try again !</p>
      `)
      $("#editRevenue").removeClass("hidden")
      console.log(error);
    }
  });
})