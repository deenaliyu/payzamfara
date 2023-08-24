let USER_SESSION2 = localStorage.getItem("mdaDataPrime");
let finalUSER_SESSION = JSON.parse(USER_SESSION2);
let mdaID = finalUSER_SESSION?.mda_id;

let ALLREV = ""
// create new MDA USer

async function fetchRevHeads(categ) {
  const response = await fetch(`${HOST}/?getAllOffice`)
  const revHeads = await response.json()

  if (revHeads.status === 0) {
  } else {
    theRevs = revHeads.message
    // console.log(theRevs)
    $("#rev_heads").html(`
      <option disabled selected>Select--</option>
    `)
    revHeads.message.forEach((revHd, i) => {
      if (revHd.COL_5 === categ) {
        $("#rev_heads").append(`
        <option value="${revHd["office_name"]}">${revHd["office_name"]}</option>
      `)
      }

    });

  }
}

fetchRevHeads();

$("#createUser").on("click", function () {

  // console.log('you cick')
  let allInputs = document.querySelectorAll(".userInputs");
  let allRadioBoxs = document.querySelectorAll(".form-select");


  for (let i = 0; i < allInputs.length; i++) {
    if (allInputs[i].value === "") {
      $("#msg_box").html(`
        <p class="text-[red] text-center mt-4 text-lg">All fields are required</p>
      `);
      break;
    } else {
      // e.preventDefault()
      $("#msg_box").html(`
        <div class="flex justify-center items-center mt-4">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
      `);
      $("#createUser").addClass("hidden");

      let obj = {
        endpoint: "createMDAUser",
        data: {
          mda_id: mdaID,
          dashboard_access: "full",
          revenue_head_access: "full",
          payment_access: "full",
          users_access: "full",
          report_access: "full",

        },
      };


      //   let obj = {
      //     endpoint: "createMDAUser",
      //     data: {
      //         mda_id: "4",
      //         dashboard_access: "0",
      //         revenue_head_access: "1",
      //         payment_access: "1",
      //         users_access: "0",
      //         report_access: "0",
      //         name: "Joohn Testing",
      //         email: "dee.aliyu40@gmail.com",
      //         phone_number: "09043432434",
      //         passwd: "12345"
      //     }
      // }

      allInputs.forEach((allInput) => {
        obj.data[allInput.dataset.name] = allInput.value;
      });
      allRadioBoxs.forEach((allRadioBox) => {
        // if (allRadioBox.select) {
        obj.data[allRadioBox?.name] = allRadioBox.value;
        // }
      });

      console.log(obj)
      let StringedData = JSON.stringify(obj);

      console.log(StringedData)
      $.ajax({
        type: "POST",
        url: HOST,
        // dataType: "json",
        data: StringedData,
        success: function (data) {
          console.log(data);
          if (data.status === 2) {
            $("#msg_box").html(`
            <p class="text-warning text-center mt-4 text-lg">${data.message}</p>
          `);
            $("#createUser").removeClass("hidden");
          } else if (data.status === 1) {
            $("#msg_box").html(`
                <p class="text-success text-center mt-4 text-lg">${data.message}</p>
              `);

            setTimeout(() => {
              window.location.href = "users.html";
            }, 1000);
          }
        },
        error: function (request, error) {
          console.log(error);
          $("#msg_box").html(`
            <p class="text-danger text-center mt-4 text-lg">An error occured !</p>
          `);
          $("#createUser").removeClass("hidden");
        },
      });
    }
    break;
  }
  return false;
});

$("#opPas").on("click", function () {
  let pasInp = document.querySelector(".passInput");
  if (pasInp.type === "password") {
    pasInp.type = "text";
  } else {
    pasInp.type = "password";
  }
});


// fetch All MDA Users
async function fetchUSERS() {
  $("#showUsers").html("");
  $("#loader").css("display", "flex");

  const response = await fetch(
    `${HOST}/php/index.php?mda_id=${mdaID}&usersParticularMDA`
  );
  const allMDAUsers = await response.json();
  console.log(allMDAUsers);
  ALLREV = allMDAUsers;
  $("#loader").css("display", "none");
  if (allMDAUsers.status === 1) {
    allMDAUsers.message.forEach((MDAUSer, i) => {
      // let hr = []
      let addyus = "";
      addyus += `
        <tr class="">
          <td>${i + 1}</td>
          <td>  <div class="">
          <img
            src="${MDAUSer.img}"
            alt =''
            class="md:w-[5vh] w-10 h-auto rounded-circle"
          />
        </div></td>
          <td>${MDAUSer.name}</td>
          <td>${MDAUSer.created_at}</td>
          <td>${MDAUSer.email}</td>
          <td></td>
          <td></td>
          <td>${MDAUSer.payment_access}</td>
          
          
        `;
      addyus += `  
          
          <td>
            <div class="flex gap-3 align-items-center">
              <button onclick="editMDAFunc(this)" data-revid="${MDAUSer.id}" data-bs-target="#editMDAUser"  data-bs-toggle="modal"><iconify-icon icon="fa6-regular:pen-to-square" width="25"
                  height="25"></iconify-icon></button>
              <iconify-icon onclick="deleteRev(this)" class="cursor-pointer" data-revid="${MDAUSer.id}" icon="material-symbols:delete-outline-sharp" width="25"
                height="25"></iconify-icon>
            </div>
          </td>
        </tr>
      `;
      $("#showUsers").append(addyus);
    });
  } else {
    $("#showInvoice").html("");
    $("#dataTable").DataTable();
  }
}
// {/* <td class="text-[#22C55E]">Full access</td> */}

fetchUSERS().then((uu) => {
  $("#dataTable").DataTable();
});


// delete MDA User
function deleteRev(e) {
  let theRevId = e.dataset.revid;
  console.log(theRevId);
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: "GET",
        url: `${HOST}?deleteMDAUser&id=${theRevId}`,
        dataType: "json",
        success: function (data) {
          // console.log(data);
          Swal.fire("Deleted!", "User has been deleted.", "success");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          // if (data.status === 1) {
          //   Swal.fire("Deleted!", "User has been deleted.", "success");
          //   setTimeout(() => {
          //     window.location.reload();
          //   }, 1000);
          // } else {
          //   Swal.fire(
          //     "Try again!",
          //     "Something went wrong, try again !",
          //     "error"
          //   );
          // }
        },
        error: function (request, error) {
          Swal.fire("Try again!", "Something went wrong, try again !", "error");
        },
      });
    }
  });
}


// edit MDA User

// edit revenue data

function editMDAFunc(e) {
  let editaID = e.dataset.revid
  console.log(editaID)
  sessionStorage.setItem("userUpdate", editaID)

  let theREV = ALLREV.message.filter(dd => dd.id === editaID)[0]

  let allInputs = document.querySelectorAll(".userInput")
  // let allAccess = document.querySelectorAll(".form-select")
  allInputs[0].value = theREV["name"]
  allInputs[1].value = theREV["email"]
  allInputs[2].value = theREV["phone_number"]

  // allAccess[0].value = theREV["dashboard_access"]
  // allAccess[1].value = theREV[" revenue_head_access"]
  // allAccess[2].value = theREV[" payment_access"]
  // allAccess[3].value = theREV[" user_access"]
  // allAccess[4].value = theREV[" report_access"]

}

$("#editMDA").on("click", () => {
  let theRevId = sessionStorage.getItem("userUpdate")

  $("#msg_box2").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)
  $("#editMDA").addClass("hidden")

  let allInputs = document.querySelectorAll(".userInput")
  let allSelectBoxes = document.querySelectorAll(".form-select");

  let obj = {
    data: {
      id: theRevId,
    }
  }
  allInputs.forEach(allInput => {
    obj.data[allInput.dataset.name] = allInput.value
  });

  console.log(obj.data);

  allSelectBoxes.forEach((allSelected) => {

    if (allSelected.name != 'dataTable_length') {
      obj.data[allSelected?.name] = allSelected.value;
    }



  });



  let queryString = $.param(obj.data);

  console.log(queryString)

  $.ajax({
    type: "GET",
    url: `${HOST}?updateMDAUser&` + queryString,
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