let adminInfo2 = JSON.parse(localStorage.getItem("adminDataPrime"));

$("#createUser").on("click", function () {
  let emaili = document.querySelector("#email").value;
  function validateEmail(email) {
    // Regular expression pattern for email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Test the email against the pattern
    return emailPattern.test(email);
  }

  // Example usage
  const email = emaili;
  if (validateEmail(email)) {
    let allInputs = document.querySelectorAll(".userInputs");

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
          endpoint: "createAdmin",
          data: {
            password: "",
            img: "",
            verification_status: "",
          },
        };
        allInputs.forEach((allInput) => {
          obj.data[allInput.dataset.name] = allInput.value;
        });

        const checkboxGroups = document.querySelectorAll('.checkbox-group');

        for (let i = 0; i < checkboxGroups.length; i++) {
          const checkboxGroup = checkboxGroups[i];
          const checkboxes = checkboxGroup.querySelectorAll('input[type="checkbox"]');
          const selectedValues = [];

          for (let j = 0; j < checkboxes.length; j++) {
            const checkbox = checkboxes[j];
            if (checkbox.checked) {
              selectedValues.push(checkbox.value);
            }
          }

          if (selectedValues.length > 0) {
            obj.data[checkboxes[0].dataset.name] = selectedValues.join('~');
          }
        }



        console.log(obj)
        let StringedData = JSON.stringify(obj)
        $.ajax({
          type: "POST",
          url: HOST,
          dataType: 'json',
          data: StringedData,
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
                window.location.href = "user.html"
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
  } else {
    $("#msg_box").html(`
    <p class="text-[red] text-center mt-4 text-lg">Invalid email address</p>
  `);
  }
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

  const response = await fetch(`${HOST}/php/index.php?getAdminUser`);
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
          <td>${userInvoice.fullname}</td>
          <td></td>
          <td>${userInvoice.time_in}</td>
          <td>${userInvoice.email}</td>
        `;

      addyus += `  
          
          <td>
            <div class="flex gap-3 align-items-center updateSec">
              <a href="./manageuser.html?id=${userInvoice.id}"><iconify-icon icon="fa6-regular:pen-to-square"></iconify-icon></a>
              <iconify-icon onclick="deleteRev(this)" class="cursor-pointer" data-revid="${userInvoice.id}" icon="material-symbols:delete-outline-sharp"></iconify-icon>

              <a href="./viewuser.html?id=${userInvoice.id}" class="btn btn-primary btn-sm">View</a>
            </div>
          </td>
      `

      addyus += `
        </tr>
      `;
      $("#showUsers").append(addyus);
    });
  } else {
    // $("#showInvoice").html("<tr></tr>");
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
        url: `${HOST}?deleteAdminUser&id=${theRevId}`,
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
