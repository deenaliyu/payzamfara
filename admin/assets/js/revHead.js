const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const mdaId = urlParams.get('id');
const mdn = urlParams.get('name');
let ALLREV = ""
let adminInfo2 = JSON.parse(localStorage.getItem("adminDataPrime"))

async function fetchRevHeads() {
  $("#revHeadsShow").html("")
  $("#loader").css("display", "flex")
  const response = await fetch(`${HOST}/?getMDAsRevenueHeads&mdName=${mdn}`)
  const revHeads = await response.json()
  ALLREV = revHeads

  $("#loader").css("display", "none")

  if (revHeads.status === 0) {
    // $("#revHeadsShow").html("<tr></tr>")
    $('#dataTable').DataTable();
  } else {
    revHeads.message.forEach((revHd, i) => {
      let addd = ""

      addd += `
        <tr class="relative">
          <td>${i + 1}</td>
          <td>${revHd["COL_4"]}</td>
          <td>${revHd["COL_5"]}</td>
          <td></td>
          <td>&#8358; ${revHd["COL_6"]}</td>
          
          <td>&#8358; ${(revHd.total_gen_revenue === "" ? 0 : revHd.total_gen_revenue.toLocaleString())}</td>
          <td>
            <div class="flex items-center gap-3">
            `
      if (adminInfo2.mda_access === "view") {

      } else {
        addd += `
        <button onclick="deleteRev(this)" data-revid="${revHd.id}"><iconify-icon icon="material-symbols:delete-outline-rounded"></iconify-icon></button>
          <button onclick="editRevFunc(this)" data-revid="${revHd.id}" data-bs-toggle="modal" data-bs-target="#editRev"><iconify-icon 
          icon="material-symbols:edit-square-outline"></iconify-icon></button>
        `
      }

      addd + `
            </div>
          </td>
        </tr>
      `

      $("#revHeadsShow").append(addd)

      if (i === revHeads.message.length - 1) {
        $('#dataTable').DataTable();
      }
    });

  }

}

fetchRevHeads()
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
  allInputss[1].value = theREV["COL_6"]
  allInputss[2].value = theREV["COL_5"]
}


async function fetchMDAs() {
  $("#showThem").html("")
  $("#loader").css("display", "flex")
  const response = await fetch(`${HOST}/?getMDAs`)
  const MDAs = await response.json()

  $("#loader").css("display", "none")

  if (MDAs.status === 0) {

  } else {
    let theMDA = MDAs.message.filter(mda => mda.id === mdaId)
    // $("#titleThe").html(theMDA[0].fullname)
    $("#industryy").html(theMDA[0].fullname)

    $("#otherInfo").html(`
      <h1 class="text-2xl">${theMDA[0].fullname}</h1>
      <p><span class="font-bold">Email Address:</span> <span>${theMDA[0].email}</span></p>
      <p><span class="font-bold">LGA:</span> <span>${theMDA[0].lga}</span></p>
      <p><span class="font-bold">Number of Revenue heads:</span> <span>${theMDA[0]["COUNT(*)"]}</span></p>
      <p><span class="font-bold">Date created:</span> <span>${theMDA[0]["time_in"]}</span></p>
      <p><span class="font-bold">Contact:</span> <span>${theMDA[0]["phone"]}</span></p>
      
    `)


    if (theMDA[0].status === "active") {
      $("#actBtn").html(`
        <button class="btn btn-danger">Deactivate</button>
      `)
      $("#otherInfo").append(`
        <p><span class="font-bold">Status:</span> <span class="badge bg-primary">active</span></p>
      `)
    } else {
      $("#actBtn").html(`
       <button class="btn btn-success">Activate</button>
      `)
      $("#otherInfo").append(`
      <p><span class="font-bold">Status:</span> <span class="badge bg-danger">Inactive</span></p>
      `)
    }

  }

}
fetchMDAs()


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
      mda_id: mdn,
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

const input = document.getElementById('csv-file');
let theMDAData = {}
input.addEventListener('change', (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (event) => {
    const contents = event.target.result;

    // Parse the CSV data into an array of objects
    const parsedData = Papa.parse(contents, { header: true }).data;

    // Convert the array of objects to a JSON string
    const jsonData = JSON.stringify(parsedData);

    // Output the JSON string to the console
    theMDAData = JSON.parse(jsonData)
    console.log(jsonData);
  };

  reader.readAsText(file);
});

$("#bulkCreateRev").on("click", function () {
  let lastObj = theMDAData[theMDAData.length - 1]
  console.log(lastObj)

  if (!lastObj.status) {
    theMDAData.splice(theMDAData.length - 1, 1);
  }

  console.log(theMDAData)
  let datatoPush = {
    endpoint: "createMultplerHead",
    data: theMDAData
  }

  $.ajax({
    type: "POST",
    url: HOST,
    dataType: 'json',
    data: JSON.stringify(datatoPush),
    success: function (data) {
      console.log(data)
      if (data.status === 2) {
        $("#msg_box22").html(`
          <p class="text-warning text-center mt-4 text-lg">${data.message}</p>
        `)
        $("#bulkCreateRev").removeClass("hidden")

      } else if (data.status === 1) {
        $("#msg_box22").html(`
          <p class="text-success text-center mt-4 text-lg">${data.message}</p>
        `)
        $("#bulkCreateRev").removeClass("hidden")

        setTimeout(() => {
          $('#bulkCreateRevModal').modal('hide');
          window.location.reload()
        }, 1000);

      }
    },
    error: function (request, error) {
      $("#msg_box22").html(`
        <p class="text-danger text-center mt-4 text-lg">An error occured !</p>
      `)
      $("#bulkCreate").removeClass("hidden")
      console.log(error);
    }
  });

})