let dataToExport;



$("#initorBtn").attr("href", `../etcc-initiate.html?initiator=admin&id=${userInfo2.id}`)



async function getEtccRequests() {
  const response = await fetch(`${HOST}/?getETCC&type=`)
  const etccReqs = await response.json()

  $("#loader").css("display", "none")

  if (etccReqs.status === 0) {
    $('#dataTable').DataTable();
    return;
  }

  // Configuration object for different status types
  const statusConfig = {
    "Accepted": {
      tableId: "#etccTable4",
      badgeClass: "bg-success",
      badgeText: "Approved",
      showPreview: true,
      level: 3
    },
    "Declined": {
      tableId: "#etccTable5",
      badgeClass: "bg-danger",
      badgeText: "Declined",
      showPreview: false,
      level: 3,
      showDeclineReason: true
    },
    "First Review": {
      tableId: "#etccTable",
      badgeClass: "bg-warning",
      badgeText: "First Review",
      showPreview: false,
      level: 3
    },
    "Second Review": {
      tableId: "#etccTable2",
      badgeClass: "bg-warning",
      badgeText: "Second Review",
      showPreview: false,
      level: 4
    },
    "Third Review": {
      tableId: "#etccTable3",
      badgeClass: "bg-warning",
      badgeText: "Third Review",
      showPreview: false,
      level: 5
    },
    "Fourth Review": {
      tableId: "#etccTable3",
      badgeClass: "bg-warning",
      badgeText: "Fourth Review",
      showPreview: false,
      level: 6
    }
  };

  // Initialize counters
  const counters = {};
  Object.keys(statusConfig).forEach(status => {
    counters[status] = 0;
  });

  dataToExport = etccReqs.message;

  // Helper function to create table row
  const createTableRow = (etcReq, status, counter) => {
    const config = statusConfig[status];
    if (!config) return;

    const rowNumber = ++counters[status];
    const badge = `<span class="badge ${config.badgeClass}">${config.badgeText}</span>`;
    
    let declineReasonCell = '';
    if (config.showDeclineReason) {
      declineReasonCell = `<td>${etcReq.decline_reason}</td>`;
    }

    let previewCell = '';
    if (config.showPreview) {
      previewCell = `<td><a href="./etcc-preview.html?theid=${etcReq.refe}" class="textPrimary fontBold">Preview</a></td>`;
    }

    const row = `
      <tr>
        <td>${rowNumber}</td>
        <td>${etcReq.timeIn}</td>
        <td>${etcReq.refe}</td>
        <td>${etcReq.fullname}</td>
        <td>${etcReq.email}</td>
        <td>${etcReq.category}</td>
        <td>${badge}</td>
        ${declineReasonCell}
        <td>${etcReq.date_approved === "" ? '-' : etcReq.date_approved}</td>
        <td>
          <a href="./etcc-details.html?theid=${etcReq.refe}&level=${config.level}&payer_id=${etcReq.payer_id}" class="button button-sm">View</a>
        </td>
        ${previewCell}
      </tr>
    `;

    $(config.tableId).append(row);
  };

  // Helper function to create main table row
  const createMainTableRow = (etcReq, index) => {
    let allStatusTable = "";
    if (etcReq.app_status === "Accepted") {
      allStatusTable = `<span class="badge bg-success">Approved</span>`;
    } else if (etcReq.app_status === "Declined") {
      allStatusTable = `<span class="badge bg-danger">Declined</span>`;
    } else {
      allStatusTable = `<span class="badge bg-warning">${etcReq.app_status}</span>`;
    }

    const previewLink = etcReq.app_status === "Accepted" 
      ? `<a href="./etcc-preview.html?theid=${etcReq.refe}" class="textPrimary fontBold">Preview</a>` 
      : '-';

    $("#etccTable6").append(`
      <tr>
        <td>${index + 1}</td>
        <td>${etcReq.timeIn}</td>
        <td>${etcReq.refe}</td>
        <td>${etcReq.fullname}</td>
        <td>${etcReq.email}</td>
        <td>${etcReq.category}</td>
        <td>${allStatusTable}</td>
        <td>${etcReq.date_approved === "" ? '-' : etcReq.date_approved}</td>
        <td>${previewLink}</td>
      </tr>
    `);
  };

  // Process each ETCC request
  etccReqs.message.forEach((etcReq, i) => {
    // Add to main table
    createMainTableRow(etcReq, i);

    // Add to status-specific tables
    if (statusConfig[etcReq.app_status]) {
      createTableRow(etcReq, etcReq.app_status);
    }
  });
}



getEtccRequests().then(tt => {

  $('#dataTable').DataTable();

  $('#dataTable2').DataTable();

  $('#dataTable3').DataTable();

  $('#dataTable4').DataTable();

  $('#dataTable5').DataTable();

  $('#dataTable6').DataTable();

  $('#dataTable7').DataTable();
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



function exportData() {

  // console.log(dataToExport)

  const csvRows = [];



  // Extract headers (keys) excluding 'id'

  const headers = Object.keys(dataToExport[0]).filter((key) => key !== "id");

  csvRows.push(headers.join(",")); // Join headers with commas



  // Loop through the data to create CSV rows

  for (const row of dataToExport) {

    const values = headers.map((header) => {

      const value = row[header];

      return `"${value}"`; // Escape values with quotes

    });

    csvRows.push(values.join(","));

  }



  // Combine all rows into a single string

  const csvString = csvRows.join("\n");



  // Export to a downloadable file

  const blob = new Blob([csvString], { type: "text/csv" });

  const a = document.createElement("a");

  a.href = URL.createObjectURL(blob);

  a.download = "etcc_reports.csv";

  a.click();

}