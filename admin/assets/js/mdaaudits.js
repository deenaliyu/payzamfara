let theInfo = JSON.parse(localStorage.getItem("adminDataPrime"))


$("#showThem").html(`
<tr class="text-center">
  <td colspan="5">
    <div class="flex justify-center items-center mb-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  </td>
</tr>
`)

async function getTaxPayers() {
  const response = await fetch(`${HOST}?getMDAs`);
  const getTaxPayer = await response.json();

  $("#showThem").html("")

  getTaxPayer.message.forEach((txpayers, i) => {
    $("#showThem").append(`
      <tr>
        <td scope="row">${i + 1}</td>
        <td>${txpayers.fullname}</td>
        <td>-</td>
        <td><button data-bs-toggle="modal" data-theid="${txpayers.id}" onclick="openModal(${txpayers.id})"
            class="btn btn-primary btn-sm">View Users</button></td>
      </tr>
    `)
  });

}

getTaxPayers().then((uu) => {
  $("#dataTable").DataTable();
});

async function openModal(theid) {
  $('#viewUsers').modal('show');
  $("#showThemmmm").html(`
    <tr class="text-center">
      <td colspan="5">
        <div class="flex justify-center items-center mb-4">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
      </td>
    </tr>
  `)
  try {
    const response = await fetch(`${HOST}?mda_id=${theid}&usersParticularMDA`);
    const getTaxPayer = await response.json();

    $("#showThemmmm").html("")

    if (getTaxPayer.status === 1) {
      getTaxPayer.message.forEach((txpayers, i) => {
        $("#showThemmmm").append(`
          <tr>
            <td scope="row">${i + 1}</td>
            <td>${txpayers.id}</td>
            <td>${txpayers.email}</td>
            <td>${txpayers.name}</td>
            <td>
            ${theInfo.audit_trail_access === "full" ?
            `<a href="mdasauditdetails.html?id=${txpayers.id}&name=${txpayers.name}&email=${txpayers.email}" class="btn btn-primary btn-sm">View Activities</a>`
            : ''}
              
            
            </td>
          </tr>
        `)
      });
    } else {

      $("#showThemmmm").html(`
        <tr>
          <td></td>
          <td></td>
          <td>No data available</td>
          <td></td>
          <td></td>
        </tr>
      `)
    }

  } catch (error) {
    console.log(error)
  }


}

