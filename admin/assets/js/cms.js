let adminInfo2 = JSON.parse(localStorage.getItem("adminDataPrime"))

// SERVICES 
async function fetchServices() {
  const response = await fetch(`${HOST}?getCMS`)
  const data = await response.json()

  // console.log(data)
  theServices = data.message

  data.message.forEach(theservice => {
    if (theservice.page === "news") {
      let added = ""

      added += `
        <div class=" card border border-[#DFDFDF]  mt-3 p-3">
          <div class="flex justify-content-between mb-2">
            <div>
              <p class="text-[#1E1E1E]">${theservice.title}</p>
              <div class="flex items-center gap-2 mt-3">
                <p><iconify-icon icon="uil:calender"></iconify-icon>
                ${theservice.time_in}
                </p>
                <p>Page: ${theservice.page}</p>
              </div>
      
            </div>
            <div class="flex items-center gap-3 cmsBtns">
  
      `
      if (adminInfo2.cms_access === "view") {

      } else {
        added += `

        <button data-theid="${theservice.id}" onclick="editThos(this)" class="EditUser"><iconify-icon
        icon="material-symbols:edit-square-outline"></iconify-icon></button>
        <button data-theid="${theservice.id}" onclick="editN(this)" class="DelUser"> <iconify-icon icon="material-symbols:delete-outline"></iconify-icon></button>
        `
      }

      added += `

            
            </div>
          </div>
        </div>`

      $(".news").append(added)

    } else {
      let added2 = ""

      added2 += `
      <div class=" card border border-[#DFDFDF]  mt-3 p-3">
        <div class="flex justify-content-between mb-2">
          <div>
            <p class="text-[#1E1E1E]">${theservice.title}</p>
            <div class="flex items-center gap-2 mt-3">
              <p><iconify-icon icon="uil:calender"></iconify-icon>
              ${theservice.time_in}
              </p>
              <p>Page: ${theservice.page}</p>
            </div>
    
          </div>
          <div class="flex items-center gap-3 cmsBtns">
      `

      if (adminInfo2.cms_access === "view") {

      } else {
        added2 += `
        <button data-theid="${theservice.id}" onclick="editThis(this)" class="EditUser"><iconify-icon
        icon="material-symbols:edit-square-outline"></iconify-icon></button>
        <button data-theid="${theservice.id}" onclick="editG(this)" class="DelUser"> <iconify-icon icon="material-symbols:delete-outline"></iconify-icon></button>
        `
      }

      added2 += `
        </div >
        </div >
      </div >
      `


      $(".gallery").append(added2)
    }

  })

}

fetchServices()

function editThis(e) {
  let theid = e.dataset.theid
  sessionStorage.setItem("editID", theid)

  $("#editMod").modal("show")
}

function editThos(e) {
  let theid = e.dataset.theid
  sessionStorage.setItem("editID", theid)

  $("#editNews").modal("show")
}

function editG(e) {
  let theid = e.dataset.theid
  sessionStorage.setItem("editID", theid)

  deleteCms();
}

function editN(e) {
  let theid = e.dataset.theid
  sessionStorage.setItem("editID", theid)

  deleteCms();
}

let theeiidd = sessionStorage.getItem("editID")


$("#addImg").click(function () {
  $("#image").click();
});

$("#addImg1").click(function () {
  $("#image1").click();
});

function postCMs(theImagClass, boxi1, boxi2) {
  // $("#msg_box2").html(`<p class="text-warning text-center mt-4 text-lg">Uploading Files!</p>`)

  let allInputs = document.querySelectorAll(".taxReqInput");
  var fileInputs = document.querySelector("#" + theImagClass + '[type="file"]');

  const publitio = new PublitioAPI(
    "ksWdvJ3JjfV5JZnHyRqv",
    "ruxLmts4NiupnoddqVi1Z70tnoMmf5yT"
  );

  let obj = {
    endpoint: "cmsUpdate",
    data: {
      id: theeiidd,
      page: "news",
      content: "jrgdfkkjsdkj",
      title: "memmem",
      image: "sljkdjkfjkkjf",
      caption: "ejkjsjdk",
    },
  };

  if (fileInputs.value === "") {
    // console.log(fileInput.value)
    // console.log("empty")
    alert("Upload all required files");
    $("#" + boxi1).html(``);
    // obj.data[fileInput.dataset.name] = ""
  }
  // else {

  $("#" + boxi1).html(`
      <div class="flex justify-center items-center mt-4">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    `);
  $("#" + boxi2).html(
    `<p class="text-warning text-center mt-4 text-lg">Uploading Files!</p>`
  );

  let fileUrl = fileInputs.files[0];
  const reader = new FileReader();
  console.log(fileUrl);
  reader.readAsBinaryString(fileUrl);

  publitio
    .uploadFile(fileUrl, "file", {
      title: `${fileUrl.name} - ${fileInputs.dataset.name}`,
      public_id: `${fileUrl.name} - ${fileInputs.dataset.name}`,
    })
    .then((data) => {
      obj.data[fileInputs.dataset.name] = data.url_preview;
      // console.log(data.url_preview)
      allInputs.forEach((allInput) => {
        obj.data[allInput.dataset.name] = allInput.value;
      });
      console.log(obj);

      let StringedData = JSON.stringify(obj);
      console.log(StringedData);
      $.ajax({
        type: "POST",
        url: HOST,
        dataType: "json",
        data: StringedData,
        success: function (data) {
          $("#" + boxi1).html(`
            <p class="text-success text-center mt-4 text-lg">${data.message}</p>
            `);
          $("#" + boxi2).html(``);
          $("#publish").addClass("hidden");
          window.location.reload();
          console.log(data);
        },
        error: function (request, error) {
          console.log(error);
          $("#" + boxi1).html(`
              <p class="text-danger text-center mt-4 text-lg">Something went wrong !</p>
            `);
          $("#" + boxi2).html(``);
        },
      });
    })
    .catch((error) => {
      console.log(error);
      $("#msg_box2").html(`Error Uploading your files, try again`);
    });
}

function deleteCms() {
  Swal.fire({
    title: "Are you sure?",
    text: "You want to Delete",
    icon: "error",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes!",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: "GET",
        url: `${HOST}?deleteCMS&cms_id=${theeiidd}`,
        dataType: 'json',
        // data: StringedData,
        success: function (data) {
          console.log(data)
          if (data.status === 1) {
            Swal.fire(`${data.message}`, "success");
            window.location.reload();
          } else {
            Swal.fire(`${data.message}`, "info");
          }
        },
        error: function (request, error) {
          console.log(error)
        }
      });
    }
  });
}

