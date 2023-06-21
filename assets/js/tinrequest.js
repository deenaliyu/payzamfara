


$("#tinRequestBtn").on("click", function () {

  let allInputs = document.querySelectorAll(".tinReqInput")
  var fileInputs = document.querySelectorAll('.tinReqInput2[type="file"]');

  const publitio = new PublitioAPI('ksWdvJ3JjfV5JZnHyRqv', 'ruxLmts4NiupnoddqVi1Z70tnoMmf5yT')

  let obj = {
    "endpoint": "createTINRequest",
    "data": {
      "user_id": "",

    }
  }

  for (let ii = 0; ii < fileInputs.length; ii++) {
    const fileInput = fileInputs[ii];

    if (fileInput.value === "") {
      alert("Upload all required files")
      $("#msg_box").html(``)
      $("#tinRequestBtn").removeClass("hidden")
      $("#msg_box2").html(``)
      break;
    }

    $("#msg_box").html(`
      <div class="flex justify-center items-center mt-4">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    `)
    $("#msg_box2").html(`<p class="text-warning text-center mt-4 text-lg">Uploading Files!</p>`)
    $("#tinRequestBtn").addClass("hidden")

    let fileUrl = fileInput.files[0]
    const reader = new FileReader()
    console.log(fileUrl)
    reader.readAsBinaryString(fileUrl);

    publitio.uploadFile(fileUrl, 'file', {
      title: `${fileUrl.name} - ${fileInput.dataset.name}`,
      public_id: `${fileUrl.name} - ${fileInput.dataset.name}`,

    }).then((data) => {
      obj.data[fileInput.dataset.name] = data.url_preview
      // console.log(data.url_preview)

      if (ii === fileInputs.length - 1) {
        $("#msg_box2").html(`<p class="text-succes text-center mt-4 text-lg">Files Uploaded, Generaring RRR...!</p>`)
        allInputs.forEach(allInput => {
          obj.data[allInput.dataset.name] = allInput.value
        })
        console.log(obj)

        let StringedData = JSON.stringify(obj)
        console.log(StringedData)
        $.ajax({
          type: "POST",
          url: HOST,
          dataType: 'json',
          data: StringedData,
          success: function (data) {
            $("#msg_box").html(``)
            console.log(data[1])

            $("#tinRequestBtn").removeClass("hidden")


            $("#referenceNum").html(data[1].reference_number)
            $("#refNumber").html(data[1].reference_number)
            nextPrev(1)
            $("#refNumberModal").modal("show")

          },
          error: function (request, error) {
            console.log(error);
            $("#msg_box").html(`
                <p class="text-danger text-center mt-4 text-lg">Something went wrong !</p>
              `)
            $("#msg_box2").html(``)
            $("#tinRequestBtn").removeClass("hidden")
          }
        });
      }
    }).catch((error) => {
      console.log(error)
      $("#msg_box2").html(`Error Uploading your files, try again`)
      $("#tinRequestBtn").removeClass("hidden")
    })

  }

})