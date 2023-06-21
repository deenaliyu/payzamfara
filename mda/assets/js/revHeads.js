let USER_SESSION = localStorage.getItem("MDAINFO")
  let finalUSER_SESSION = JSON.parse(USER_SESSION)
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  // let mdaID = finalUSER_SESSION.fullname;
  // const mdaId = urlParams.get('id');
// const mdaName = urlParams.get('name');

// const mdaId = urlParams.get('id');
// const mdn = urlParams.get('name');
  let ALLREV = ""

async function fetchRevenueHeads() {

  const response = await fetch(`${HOST}/?getMDAsRevenueHeads&mdaName=AKIRS`)
  const revenues = await response.json();

  // console.log(revenues);

  $("#loader").remove()

  ALLREV = revenues

  if (revenues.status === 0) {
    $('#dataTable').DataTable();
  } else {


    revenues.message.forEach((revenueHead, i) => {
      console.log(revenues)
      $("#showPayment").append(`
      <tr>
        <td>${i + 1}</td>
        <td>${revenueHead.COL_4}</td>
        <td>${revenueHead.COL_5}</td>
        <td>&#8358;${revenueHead.COL_6}</td>
        <td>Monthly</td>
        

        

        <td>
        <div class="bg-orange-200 rounded-2xl py-1 px-3">
          <p class="text-[orange]">Pending</p>
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
//  fetchRevenueHeads().then(res => {
//   $('#dataTable').DataTable();




// })



$("#createRevenue").on("click", () => {

  $("#msg_box").html(`
      <div class="flex justify-center items-center mt-4">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    `)
  $("#createRevenue").addClass("hidden")

  let allInputs = document.querySelectorAll(".revInput")
  let obj = {
    "endpoint": "createMDArHead",
    data: {
      mda_id: 'AKIRS',
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
        $("#msg_box").html(`
          <p class="text-warning text-center mt-4 text-lg">${data.message}</p>
        `)
        $("#createRevenue").removeClass("hidden")

      } else if (data.status === 1) {
        $("#msg_box").html(`
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

  let theREV = ALLREV.message.filter(dd => dd.id === editaID)[0]

  let allInputss = document.querySelectorAll(".revInput2")
  allInputss[0].value = theREV["COL_4"]
  allInputss[1].value = theREV["COL_5"]
  allInputss[2].value = theREV["COL_6"]
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