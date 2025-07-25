var currentTab = 0;
showTab(currentTab);

function showTab(n) {
  var x = document.getElementsByClassName("formTabs");
  x[n].style.display = "block";

  // fixStepIndicator(n)
}

function nextPrev(n) {
  var x = document.getElementsByClassName("formTabs");
  x[currentTab].style.display = "none";
  currentTab = currentTab + n;


  showTab(currentTab);
}

$("#selectAccType").on("change", function () {
  let val = $(this).val()
  if (val === "2") {
    $("#indivCorporate").html(`
      <div class="md:flex gap-3 mt-3">
        <div class="form-group md:w-6/12  w-full">
          <label class="">Self-assessment form upload *</label>
          <input class="form-control mt-1 taxFInput2" data-name="form_assessment_upload" accept=".pdf,.png,.jpg,.jpeg" required type="file" />
        </div>
        <div class="form-group md:w-6/12 w-full">
          <label class="">Income tax form *</label>
          <input class="form-control mt-1 taxFInput2" data-name="tax_income_upload" accept=".pdf,.png,.jpg,.jpeg" required type="file" />
        </div>
      </div>
      <div class="md:flex gap-3 mt-3">
        <div class="form-group md:w-6/12 w-full">
          <label class="">Evidence of tax payment *</label>
          <input class="form-control mt-1 taxFInput2" data-name="evidence_of_tax_payment" accept=".pdf,.png,.jpg,.jpeg" required type="file" />
        </div>
      </div>
    `)

  } else {

    $("#indivCorporate").html(`
      <div class="md:flex gap-3 mt-3">
        <div class="form-group md:w-6/12  w-full">
          <label class="">Self-assessment form upload *</label>
          <input class="form-control mt-1 taxFInput2" data-name="form_assessment_upload" accept=".pdf,.png,.jpg,.jpeg" required type="file" />
        </div>
        <div class="form-group md:w-6/12 w-full">
          <label class="">Income tax form *</label>
          <input class="form-control mt-1 taxFInput2" data-name="tax_income_upload" accept=".pdf,.png,.jpg,.jpeg" required type="file" />
        </div>
      </div>
      <div class="md:flex gap-3 mt-3">
        <div class="form-group md:w-6/12 w-full">
          <label class="">Evidence of tax payment *</label>
          <input class="form-control mt-1 taxFInput2" data-name="evidence_of_tax_payment" accept=".pdf,.png,.jpg,.jpeg" required type="file" />
        </div>
      </div>

      <div class="md:flex gap-3 mt-3">
        <div class="form-group md:w-6/12 w-full">
          <label class="">Form H1 *</label>
          <input class="form-control mt-1 taxFInput2" data-name="form_upload_4" accept=".pdf,.png,.jpg,.jpeg" type="file" />
        </div>

        <div class="form-group md:w-6/12 w-full">
          <label class="">Schedule of Tax deductions *</label>
          <input class="form-control mt-1 taxFInput2" data-name="form_upload_5" accept=".pdf,.png,.jpg,.jpeg" type="file" />
        </div>
      </div>
  `)

  }
})

$("#generateReferenceNum").on("click", function () {


  // $("#msg_box2").html(`<p class="text-warning text-center mt-4 text-lg">Uploading Files!</p>`)

  let allInputs = document.querySelectorAll(".taxFInput")
  var fileInputs = document.querySelectorAll('.taxFInput2[type="file"]');

  const publitio = new PublitioAPI('ksWdvJ3JjfV5JZnHyRqv', 'ruxLmts4NiupnoddqVi1Z70tnoMmf5yT')

  let user_id = ""
  let userDATA = JSON.parse(localStorage.getItem("userDataPrime"))

  if (userDATA) {
    user_id = userDATA.id
  } else {
    user_id = ""
  }

  let obj = {
    endpoint: "insertTaxFiling",
    data: {
      "user_id": user_id,
      "form_upload_5": "",
      "form_upload_4": "",
      "amount": "0"
    }
  }

  for (let ii = 0; ii < fileInputs.length; ii++) {
    const fileInput = fileInputs[ii];

    if (fileInput.value === "") {
      // console.log(fileInput.value)
      // console.log("empty")
      alert("Upload all required files")
      $("#msg_box").html(``)
      $("#generateReferenceNum").removeClass("hidden")
      $("#msg_box2").html(``)
      break;
      // obj.data[fileInput.dataset.name] = ""
    }
    // else {

    $("#msg_box").html(`
      <div class="flex justify-center items-center mt-4">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    `)
    $("#generateReferenceNum").addClass("hidden")
    $("#msg_box2").html(`<p class="text-warning text-center mt-4 text-lg">Uploading Files!</p>`)

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
        let obbj2 = obj
        let StringedData = JSON.stringify(obbj2)

        console.log(StringedData)
        $.ajax({
          type: "POST",
          url: HOST,
          dataType: 'json',
          data: StringedData,
          success: function (data) {
            $("#msg_box").html(``)
            console.log(data)

            $("#generateReferenceNum").removeClass("hidden")
            $("#msg_box2").html(`<p class="text-succes text-center mt-4 text-lg">Generated : ${data[1].tax_filling_refrence}</p>`)
            $("#referenceNum").html(data[1].tax_filling_refrence)
            $("#refNumberModal").modal("show")

          },
          error: function (request, error) {
            console.log(error);
            $("#msg_box").html(`
              <p class="text-danger text-center mt-4 text-lg">Something went wrong !</p>
            `)
            $("#msg_box2").html(``)
            $("#generateReferenceNum").removeClass("hidden")
          }
        });
      }
    }).catch((error) => {
      console.log(error)
      $("#msg_box2").html(`Error Uploading your files, try again`)
      $("#generateReferenceNum").removeClass("hidden")
    })
    // }


  }




})