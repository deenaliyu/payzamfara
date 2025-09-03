let userDATA = JSON.parse(localStorage.getItem("enumDataPrime"))

$(".fullname").val(userDATA.fullname)
$(".tin").val(userDATA.agent_id)
$(".email").val(userDATA.email)


$("#Submitcomplain").on("click", function (e) {
  e.preventDefault()
  const publitio = new PublitioAPI('ksWdvJ3JjfV5JZnHyRqv', 'ruxLmts4NiupnoddqVi1Z70tnoMmf5yT')

  let allInputs = document.querySelectorAll(".suppInput")
  var fileInput = document.querySelector('#imgg');

  for (let index = 0; index < allInputs.length; index++) {
    const inptt = allInputs[index];

    if (inptt.required && inptt.value === "") {
      alert("please fill all required fileds")
      break;
    }

    if (index === allInputs.length - 1) {
      $("#msg_box").html(`
        <div class="flex justify-center items-center mt-4">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
      `)
      $("#Submitcomplain").addClass("hidden")
      let obj = {
        endpoint: "createSupport",
        data: {
          id: 0,
          tin: "",
          img: "",
          enum_id: userDATA.id,
          mda_id: "",
          content: tinymce.get('textarea').getContent()
        }
      }


      if (fileInput.value === "") {
        obj.data.img = ""
        submitt()

      } else {

        let fileUrl = fileInput.files[0]
        const reader = new FileReader()
        // console.log(fileUrl)
        reader.readAsBinaryString(fileUrl);

        publitio.uploadFile(fileUrl, 'file', {
          title: `${fileUrl.name} - ${fileInput.dataset.name}`,
          public_id: `${fileUrl.name} - ${fileInput.dataset.name}`,

        }).then((data) => {
          obj.data["img"] = data.url_preview
          submitt()

        }).catch((error) => {
          console.log(error)

          $("#msg_box").html(`<p class="text-danger">Error Uploading your files, try again</p>`)
          $("#Submitcomplain").removeClass("hidden")
        })

      }

      function submitt() {
        allInputs.forEach(allInput => {
          obj.data[allInput.dataset.name] = allInput.value
        })

        let StringedData = JSON.stringify(obj)
        console.log(obj)
        $.ajax({
          type: "POST",
          url: HOST,
          dataType: 'json',
          data: StringedData,
          success: function (data) {
            // console.log(data)
            if (data.status === 1) {
              $("#msg_box").html(``)
              $("#Submitcomplain").removeClass("hidden")

              Swal.fire({
                icon: "success",
                title: data.message,
                text: 'We will get back to you shortly',
                confirmButtonText: 'OK',
              }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                  window.location.reload()
                }
              })
            } else {

              $("#msg_box").html(`
                <p class="text-danger text-center mt-4 text-lg">${data.message}</p>
              `)
              $("#Submitcomplain").removeClass("hidden")
            }
          },
          error: function (request, error) {
            console.log(error);
            $("#msg_box").html(`
              <p class="text-danger text-center mt-4 text-lg">Message not sent, try again !</p>
            `)
            $("#Submitcomplain").removeClass("hidden")
          }
        });
      }

    }
  }




})
