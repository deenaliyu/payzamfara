let userInfo = JSON.parse(window.localStorage.getItem("userDataPrime"));
let currentPageURL = window.location.href;
// userInfo
async function getEtccRequests() {

  const response = await fetch(`${HOST}/?getETCC&type=payer_user&id=${userInfo?.tax_number}`)
  const etccReqs = await response.json()
  $("#loader").css("display", "none")

  //   Accepted: 1
  // Declined: 2
  // First Review: 3
  // Second Review: 4
  // Third Review: 5

  if (etccReqs.status === 0) {
    $('#dataTable').DataTable();

  } else {
    etccReqs.message.forEach((etcReq, i) => {
      let etccStatus = ""

      if (etcReq.app_status === "Declined") {
        etccStatus = `<span class="badge bg-danger">Declined</span>`
      } else if (etcReq.app_status === "Accepted") {
        etccStatus = `<span class="badge bg-success">Approved</span>`
      } else if (etcReq.app_status === "First Review") {
        etccStatus = `<span class="badge bg-warning">First Review</span>`
      } else if (etcReq.app_status === "Second Review") {
        etccStatus = `<span class="badge bg-warning">Second Review</span>`
      } else if (etcReq.app_status === "Third Review") {
        etccStatus = `<span class="badge bg-warning">Third Review</span>`
      } else {
        etccStatus = `<span class="badge bg-warning">Pending</span>`
      }

      $("#etccTable").append(`
        <tr>
          <td>${i + 1}</td>
          <td>${etcReq.timeIn}</td>
          <td>${etcReq.refe}</td>
          <td>${etccStatus}</td>
          <td>${etcReq.date_approved === null ? '-' : etcReq.date_approved}</td>
          <td>
            <a href="./etcc-details.html?theid=${etcReq.refe}&level=3&payer_id=${etcReq.payer_id}" class="button button-sm">View</a>
          </td>
          <td>${etcReq.app_status === "Accepted" ? `<a href="./etcc-preview.html?theid=${etcReq.refe}" class="textPrimary fontBold">Preview</a>` : '-'}</td>
        </tr>
      `)

      $("#etccTable2").append(`
        <tr>
          <td>${i + 1}</td>
          <td>${etcReq.timeIn}</td>
          <td>${etcReq.refe}</td>
          <td>${etccStatus}</td>
          <td>${etcReq.date_approved === "" ? '-' : etcReq.date_approved}</td>
          <td>
            <a href="./etcc-details.html?theid=${etcReq.refe}&level=4&payer_id=${etcReq.payer_id}" class="button button-sm">View</a>
          </td>
          <td>${etcReq.app_status === "Approved" ? `<a href="./etcc-preview.html?theid=${etcReq.refe}" class="textPrimary fontBold">Preview</a>` : '-'}</td>
        </tr>
      `)

      $("#etccTable3").append(`
        <tr>
          <td>${i + 1}</td>
          <td>${etcReq.timeIn}</td>
          <td>${etcReq.refe}</td>
          <td>${etccStatus}</td>
          <td>${etcReq.date_approved === "" ? '-' : etcReq.date_approved}</td>
          <td>
            <a href="./etcc-details.html?theid=${etcReq.refe}&level=5&payer_id=${etcReq.payer_id}" class="button button-sm">View</a>
          </td>
          <td>${etcReq.app_status === "Approved" ? `<a href="./etcc-preview.html?theid=${etcReq.refe}" class="textPrimary fontBold">Preview</a>` : '-'}</td>
        </tr>
      `)

    });
  }
}

getEtccRequests().then(tt => {
  $('#dataTable').DataTable();
  $('#dataTable2').DataTable();
  $('#dataTable3').DataTable();
})


$("#checkStatus").on("click", function () {

  $("#msg_box").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)
  $("#checkStatus").addClass("hidden")

  let therefNumber = document.querySelector("#refNumber").value

  if (therefNumber === "") {
    alert("Field can't be empty.")
    $("#msg_box").html(``)
    $("#checkStatus").removeClass("hidden")
    return
  }

  async function getStatus() {
    try {
      const response = await fetch(`${HOST}?getETCC&type=ref&id=${therefNumber}`)
      const statusData = await response.json()

      console.log(statusData)
      if (statusData.status === 1) {
        $("#msg_box").html(``)
        $("#checkStatus").removeClass("hidden")
        $("#confirmationModal").modal("show")

        if (statusData.message[0].app_status !== "Accepted") {
          $("#modalBody").html(`
          <div class="flex justify-center">
            <img src="./assets/img/review.png" alt="">
          </div>
  
          <p class="text-xl fontBold text-black text-center mb-3 mt-3">Your application is under review.</p>
        `)
        } else {
          $("#modalBody").html(`
            <div class="flex justify-center">
              <img src="./assets/img/verified.png" alt="">
            </div>

            <p class="text-xl fontBold text-black text-center mb-3 mt-3">Your application has been approved.</p>

            <div class="flex justify-center">
              <a class="button" href="./etcc-preview.html?theid=${therefNumber}">View Certificate</a>
            </div>
          `)

        }


      } else {
        alert('Invalid Ref Number')
        $("#msg_box").html(``)
        $("#checkStatus").removeClass("hidden")
      }
    } catch (error) {
      alert('something went wrong')
      $("#msg_box").html(``)
      $("#checkStatus").removeClass("hidden")
    }

  }

  getStatus()

})


async function getSpecialUsersDash1() {

  const response = await fetch(`${HOST}/?getETCCdash`)
  const getDashData = await response.json()


  if (getDashData.status === 0) {
    // $('#dataTable').DataTable();

  } else {
    let dashData = getDashData.message[0]

    $("#sub_num").html(dashData.total_count)
    $("#pending_num").html(dashData.declined_count)
    $("#appr_num").html(dashData.approved_count)
  }

}

getSpecialUsersDash1()