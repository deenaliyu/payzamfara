$("#STATES").html(STATES)
$("#STATE").html(STATES)
let adminInfo2 = JSON.parse(localStorage.getItem("adminDataPrime"))


let ALLMDA = ""
async function fetchMDAs() {
  $("#showThem").html("")
  $("#loader").css("display", "flex")

  let config = {
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*"
    }
  }
  const response = await fetch(`${HOST}/?getMDAs`)
  const MDAs = await response.json()
  ALLMDA = MDAs

  $("#loader").css("display", "none")

  if (MDAs.status === 0) {
    $("#showThem").html("<tr></tr>")
    $('#dataTable').DataTable();
  } else {
    MDAs.message.forEach((MDA, i) => {
      let addd = ""
      addd += `
        <tr class="relative">
          <td>${i + 1}</td>
          <td><a class="text-primary" href="./mdadetails.html?id=${MDA.id}&name=${MDA.fullname}">${MDA.fullname}</a></td>
          <td>${MDA.state}</td>
          <td>${MDA["COUNT(*)"]}</td>
          <td>&#8358; ${(MDA.total_gen_revenue === "" ? 0 : MDA.total_gen_revenue.toLocaleString())}</td>
          <td>${MDA.time_in}</td>
          `;
      if (MDA.status === "active") {
        addd += `
          <td class="relative ">
            <small class="text-[#FFFFFF] bg-[#008000] p-1 ">${MDA.status}</small>
          </td>
          `
      } else {
        addd += `
            <td class="relative ">
              <small class="text-[#FFFFFF] bg-[red] p-1 ">${MDA.status}</small>
            </td>
          `}

      if (adminInfo2.mda_access === "view") {
        addd += `
          <td>
            <a href="./mdadetails.html?id=${MDA.id}&name=${MDA.fullname}" class="btn btn-primary btn-sm viewUser" >View</a>
          </td>

          </tr>
        `
      } else {
        addd += `  
          <td> 
            <div class="flex items-center gap-3">
              <div class="dropdown">                  
                <button class="flex gap-1 align-items-center" type="button" id="filtermda"
                  data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <iconify-icon icon="iwwa:option-horizontal" style="font-size: 24px"></iconify-icon>
                </button>
                <div class="dropdown-menu dropdown-menu-end" aria-labelledby="filtermda">
      
                  <button data-bs-toggle="modal" data-bs-target="#editMDA" 
                    class="dropdown-item editMDATog text-[#008000]" 
                    data-userid="${MDA.id}" onclick="editMdaFunc(this)">Edit</button>
      
                  <button class="dropdown-item text-[#DC3545]" data-mdaid="${MDA.id}" onclick="deleteMda(this)">Delete</button>
      
                  
                </div>
              </div>
      
              <div>
                <a href="./mdadetails.html?id=${MDA.id}&name=${MDA.fullname}" class="btn btn-primary btn-sm viewUser">View</a>
              </div>
            </div>
          </td>  

          </tr>
        `
      }


      $("#showThem").append(addd);
      if (i === MDAs.message.length - 1) {
        $('#dataTable').DataTable();
      }
    });

  }

}

fetchMDAs()


async function getAllRevH() {
  const response = await fetch(`${HOST}/?getAllRevenueHeads`)
  const revHeads = await response.json()

  if (revHeads.status === 0) {
  } else {
    let pendingRevs = revHeads.message.filter(rr => rr.status === "pending")

    pendingRevs.forEach((revHd, i) => {

      $("#revHeadsShow2").append(`
        <tr class="relative">
          <td>${i + 1}</td>
          <td>${revHd["COL_3"]} </td>
          <td>${revHd["COL_4"]}</td>
          <td>${revHd["COL_5"]}</td>
          <td>${revHd["frequency"]}</td>
          <td>&#8358; ${revHd["COL_6"]}</td>
          <td>&#8358; ${(revHd.total_gen_revenue === "" ? 0 : revHd.total_gen_revenue.toLocaleString())}</td>
          <td>
            <button onclick="arroveRev(this)" class="button btn" data-revid="${revHd.id}">Approve</button>
          </td>
        </tr>
      `)


    })
  }
}

getAllRevH()

function arroveRev(e) {
  let theRevId = e.dataset.revid
  // console.log(theRevId)
  Swal.fire({
    title: 'Request Approval',
    text: "Do you want to approve this request",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, approve it!'
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: "GET",
        url: `${HOST}?ApproveRevenueHeadStatus&id=${theRevId}`,
        dataType: "json",
        success: function (data) {
          console.log(data)
          if (data.status === 1) {
            Swal.fire(
              'Approved!',
              'Revenue Head has been approved.',
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

function editMdaFunc(e) {
  let editaID = e.dataset.userid
  sessionStorage.setItem("mdaUpdate", editaID)
  let theMDA = ALLMDA.message.filter(dd => dd.id === editaID)[0]
  let allInputss = document.querySelectorAll(".mdaInput3")

  allInputss.forEach((inpu) => {
    let ddset = inpu.dataset.name
    inpu.value = theMDA[ddset]
  })
}
function deleteMda(e) {
  let themdaId = e.dataset.mdaid
  console.log(themdaId)
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
        url: `${HOST}?deleteMDA&mda_id=${themdaId}`,
        dataType: "json",
        success: function (data) {
          console.log(data)
          if (data.status === 1) {
            Swal.fire(
              'Deleted!',
              'MDA has been deleted.',
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

$("#createMDA").on("click", () => {

  $("#msg_box").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)
  $("#createMDA").addClass("hidden")

  let allInputs = document.querySelectorAll(".mdaInput")
  let obj = {
    endpoint: "createMDA",
    data: {
      "industry": "",
      "geolocation": "",
      "address": "",
      "status": "1"
    }
  }
  allInputs.forEach(allInput => {
    obj.data[allInput.dataset.name] = allInput.value
  })
  console.log(obj)
  var switchInput = document.getElementById("switchInput");
  var switchValue = switchInput.checked;

  // Process the switch value
  if (switchValue) {
    obj.data.allow_payment = 1;
  } else {
    obj.data.allow_payment = 2;
  }

  var switchInput1 = document.getElementById("switchInput1");
  var switchValue1 = switchInput1.checked;

  if (switchValue1) {
    obj.data.office_creation = 1;
  } else {
    obj.data.office_creation = 2;
  }

  $.ajax({
    type: "POST",
    url: HOST,
    dataType: 'json',
    data: JSON.stringify(obj),
    success: function (data) {
      console.log(data)
      if (data.status === 2) {
        $("#msg_box").html(`
          <p class="text-warning text-center mt-4 text-lg">${data.message}</p>
        `)
        $("#createMDA").removeClass("hidden")

      } else if (data.status === 1) {
        $("#msg_box").html(`
          <p class="text-success text-center mt-4 text-lg">${data.message}</p>
        `)
        $("#createMDA").removeClass("hidden")
        setTimeout(() => {
          $('#createMda').modal('hide');
          window.location.reload()
        }, 1000);

      }
    },
    error: function (request, error) {
      $("#msg_box").html(`
        <p class="text-danger text-center mt-4 text-lg">An error occured !</p>
      `)
      $("#createMDA").removeClass("hidden")
      console.log(error);
    }
  });

})

$("#editMDAs").on("click", (e) => {
  let theMdaId = sessionStorage.getItem("mdaUpdate")
  console.log(theMdaId)
  $("#msg_box2").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)
  $("#editMDAs").addClass("hidden")

  let allInputs = document.querySelectorAll(".mdaInput2")
  let obj = {
    data: {
      "industry": "nil",
      "geolocation": "nil",
      "address": "nil",
      "status": "1",
      "mda_id": theMdaId
    }
  }

  allInputs.forEach(allInput => {
    obj.data[allInput.dataset.name] = allInput.value
  })
  var switchInput = document.getElementById("switchInput");
  var switchValue = switchInput.checked;

  // Process the switch value
  if (switchValue) {
    obj.data.allow_payment = 1;
  } else {
    obj.data.allow_payment = 2;
  }

  var switchInput1 = document.getElementById("switchInput1");
  var switchValue1 = switchInput1.checked;

  if (switchValue1) {
    obj.data.office_creation = 1;
  } else {
    obj.data.office_creation = 2;
  }
  let queryString = $.param(obj.data);
  console.log(queryString);
  $.ajax({
    type: "GET",
    url: `${HOST}?updateMDA&` + queryString,
    dataType: "json",
    success: function (data) {
      console.log(data)
      if (data.status === 2) {
        $("#msg_box2").html(`
          <p class="text-warning text-center mt-4 text-lg">${data.message}</p>
        `)
        $("#createMDA").removeClass("hidden")

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
      $("#editMDAs").removeClass("hidden")
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

$("#bulkCreate").on("click", function () {
  let lastObj = theMDAData[theMDAData.length - 1]
  console.log(lastObj)

  if (!lastObj.status) {
    theMDAData.splice(theMDAData.length - 1, 1);
  }

  console.log(theMDAData)
  let datatoPush = {
    endpoint: "createMultipleMDA",
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
        $("#bulkCreate").removeClass("hidden")

      } else if (data.status === 1) {
        $("#msg_box22").html(`
          <p class="text-success text-center mt-4 text-lg">${data.message}</p>
        `)
        $("#bulkCreate").removeClass("hidden")

        setTimeout(() => {
          $('#bulkCreateMda').modal('hide');
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

