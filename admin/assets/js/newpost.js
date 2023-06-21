function getpost(e) {
  let theVal = e.value;

  let AllPosts = document.querySelectorAll(".newpostCards");
  AllPosts.forEach((allpost) => {
    allpost.classList.add("hidden");
  });

  $("#" + theVal).removeClass("hidden");
}

$("#addImg").click(function () {
  $("#image").click();
});

$("#addImg1").click(function () {
  $("#image1").click();
});

// ;

function postCMs(theImagClass, boxi1, boxi2, theTiny) {
  // $("#msg_box2").html(`<p class="text-warning text-center mt-4 text-lg">Uploading Files!</p>`)

  let allInputs = document.querySelectorAll(".taxReqInput");
  var fileInputs = document.querySelector("#" + theImagClass + '[type="file"]');

  var myContent = tinymce.get(theTiny).getContent();
  console.log(myContent)

  const publitio = new PublitioAPI(
    "ksWdvJ3JjfV5JZnHyRqv",
    "ruxLmts4NiupnoddqVi1Z70tnoMmf5yT"
  );

  let obj = {
    endpoint: "createCMS",
    data: {
      page: "news",
      content: myContent,
      title: "memmem",
      image: "",
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
