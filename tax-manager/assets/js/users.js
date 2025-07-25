let USER_SESSION2 = localStorage.getItem("MDAINFO");
finalUSER_SESSION = JSON.parse(USER_SESSION2);
let mdaID = finalUSER_SESSION.id;

$("#createUser").on("click", function () {
  let allInputs = document.querySelectorAll(".userInputs");
  let allRadioBoxs = document.querySelectorAll(".form-check-input");

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

      allInputs.forEach((allInput) => {
        obj.data[allInput.dataset.name] = allInput.value;
      });
      allRadioBoxs.forEach((allRadioBox) => {
        if (allRadioBox.checked) {
          obj.data[allRadioBox.name] = allRadioBox.value;
        }
      });
      // console.log(obj)
      let StringedData = JSON.stringify(obj);
      $.ajax({
        type: "POST",
        url: HOST,
        dataType: "json",
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

async function fetchUSERS() {
  $("#showUsers").html("");
  $("#loader").css("display", "flex");

  const response = await fetch(
    `${HOST}/php/index.php?mda_id=${mdaID}&usersParticularMDA`
  );
  const userInvoices = await response.json();
  console.log(userInvoices);
  $("#loader").css("display", "none");
  if (userInvoices.status === 1) {
    userInvoices.message.forEach((userInvoice, i) => {
      // let hr = []
      let addyus = "";
      addyus += `
        <tr class="">
          <td>${i + 1}</td>
          <td>${userInvoice.name}</td>
          <td>12.09.2023 9:00am</td>
          <td>${userInvoice.email}</td>
        `;
      addyus += `  
          
          <td>
            <div class="flex gap-3 align-items-center">
              <a href="./manageuser.html?id=${userInvoice.id}"><iconify-icon icon="fa6-regular:pen-to-square" width="25"
                  height="25"></iconify-icon></a>
              <iconify-icon onclick="deleteRev(this)" class="cursor-pointer" data-revid="${userInvoice.id}" icon="material-symbols:delete-outline-sharp" width="25"
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
          console.log(data);
          if (data.status === 1) {
            Swal.fire("Deleted!", "User has been deleted.", "success");
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            Swal.fire(
              "Try again!",
              "Something went wrong, try again !",
              "error"
            );
          }
        },
        error: function (request, error) {
          Swal.fire("Try again!", "Something went wrong, try again !", "error");
        },
      });
    }
  });
}
