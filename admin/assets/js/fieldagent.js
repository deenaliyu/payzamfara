let theInfo = JSON.parse(localStorage.getItem("adminDataPrime"))


let UserDATA = {}
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
  const response = await fetch(`${HOST}?getEnumUser`);
  const getTaxPayer = await response.json();
  UserDATA = getTaxPayer.message
}

getTaxPayers().then((uu) => {
  fetchUsers().then((uu) => {
    $("#dataTable").DataTable();
  });
});

async function fetchUsers() {
  const response = await fetch(`${HOST}?getAllActivityLogs`);
  const userAudits = await response.json();

  let userauditTrail = userAudits.message.filter(audt => audt.user_category === "Enum User")

  const filteredMessage = userauditTrail.reduce((acc, curr) => {
    const isDuplicate = acc.some(
      (msg) => msg.user_id === curr.user_id && msg.user_category === curr.user_category
    );
    if (!isDuplicate) {
      acc.push(curr);
    }
    return acc;
  }, []);

  $("#showThem").html("")
  let number = 0
  filteredMessage.forEach((txpayers, i) => {
    
    let userDetail = UserDATA.find(tt => tt.id === txpayers.user_id)

    if (userDetail) {
      number++
      $("#showThem").append(`
        <tr>
          <td scope="row">${number}</td>
          <td>${userDetail.email}</td>
          <td>${userDetail.fullname}</td>
          <td>
          ${theInfo.audit_trail_access === "full" ?
          `<a href="fieldaudit.html?id=${userDetail.id}&name=${userDetail.fullname}&email=${userDetail.email}" class="btn btn-primary btn-sm">View Activities</a>`
          : ''}
          
          
          </td>
        </tr>
      `)
    }
  });

}


// async function getTaxPayers() {
//     const response = await fetch(`${HOST}?getEnumUser`);
//     const getTaxPayer = await response.json();
  
//     getTaxPayer.message.forEach((txpayers, i) => {
//       $("#showThem").append(`
//         <tr>
//           <td scope="row">${i + 1}</td>
//           <td>${txpayers.email}</td>
//           <td>${txpayers.fullname}</td>
//           <td><a href="fieldaudit.html?id=${txpayers.id}&name=${txpayers.fullname}&email=${txpayers.email}" class="btn btn-primary btn-sm">View Activities</a></td>
//         </tr>
//       `)
//     });
  
//   }
  
//   getTaxPayers().then((uu) => {
//     $("#dataTable").DataTable();
//   });
  
  
  // async function fetchUsers() {
  //   const response = await fetch(`${HOST}?getAllActivityLogs`);
  //   const userAudits = await response.json();
  
  //   userAudits["Payer User"].forEach((audits, i) => {
  //     $("#showThem").append(`
  //       <tr>
  //         <td scope="row">${i + 1}</td>
  //         <td>${audits.payer_id}</td>
  //         <td>Bashir Muhammad</td>
  //         <td>${audits.timeIn}</td>
  //         <td><a href="useraudit.html" class="btn btn-primary btn-sm">View Activities</a></td>
  //       </tr>
  //     `)
  //   });
  
  // }
  
  // fetchUsers()