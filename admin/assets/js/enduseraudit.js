let theInfo = JSON.parse(localStorage.getItem("adminDataPrime"))

let UserDATA = {}
let adminUser = {}
let mdaUserss = {}
let enumUser = {}

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
  const response = await fetch(`${HOST}?getTaxPayer`);
  const getTaxPayer = await response.json();
  UserDATA = getTaxPayer.message
}

async function EnumPayers() {
  const response = await fetch(`${HOST}?getEnumerationTaxPayer`);
  const getTaxPayer = await response.json();
  enumUser = getTaxPayer.message
}

async function mdaUsers() {
  const response = await fetch(`${HOST}?getAllMdaUsers`);
  const getTaxPayer = await response.json();
  mdaUserss = getTaxPayer.message
}

async function adminUsers() {
  const response = await fetch(`${HOST}?getAdminUser`);
  const getTaxPayer = await response.json();
  adminUser = getTaxPayer.message
}

getTaxPayers().then((uu) => {
  EnumPayers()
  mdaUsers()
  adminUsers()
  fetchUsers().then((uu) => {
    $("#dataTable").DataTable();
  });
});

let activityData = {}

async function fetchUsers() {
  const response = await fetch(`${HOST}?getAllActivityLogs`);
  const userAudits = await response.json();

  $("#showThem").html("")

  activityData = userAudits.message
  let iiii = 0
  userAudits.message.reverse().forEach((txpayers, i) => {
    if (txpayers.user_category === "Payer User") {
      let userDetail = UserDATA.find(tt => tt.tax_number === txpayers.user_id)

      if (userDetail) {
        iiii++
        $("#showThem").append(`
          <tr>
            <td scope="row">${iiii}</td>
            <td>${txpayers.timeIn}</td>
            <td>${userDetail.first_name} ${userDetail.surname}</td>
            <td>${txpayers.user_category}</td>
            <td>${txpayers.comment}</td>
            <td>
              <button 
              data-bs-toggle="modal" 
              onclick="viewActii('${txpayers.timeIn}', '${txpayers.comment}','${userDetail.first_name}', '${txpayers.user_category}','${userDetail.surname}', '${txpayers.session_id}',  '${txpayers.ip_address}')" 
              data-bs-target="#viewActivity" 
              class="btn btn-primary btn-sm">View Activities</button>
            </td>
          </tr>
        `)
      }
    } else if (txpayers.user_category === "Admin User") {
      // console.log(adminUser)
      let userDetail = adminUser?.find(tt => tt.id === txpayers.user_id)

      if (userDetail) {
        iiii++
        $("#showThem").append(`
          <tr>
            <td scope="row">${iiii}</td>
            <td>${txpayers.timeIn}</td>
            <td>${userDetail.fullname}</td>
            <td>${txpayers.user_category}</td>
            <td>${txpayers.comment}</td>
            <td>
              <button 
              data-bs-toggle="modal" 
              onclick="viewActii('${txpayers.timeIn}', '${txpayers.comment}','${userDetail.name}', '${txpayers.user_category}','${userDetail.surname}',, '${txpayers.session_id}',  '${txpayers.ip_address}')" 
              data-bs-target="#viewActivity" 
              class="btn btn-primary btn-sm">View Activities</button>
            </td>
          </tr>
        `)
      }

    } else if (txpayers.user_category === "Enum User") {

      let userDetail = null
      if (Object.keys(enumUser).length === 0 && obj.constructor === Object) {

      } else if(enumUser == "failed to load, try again"){
        
      } else {
        userDetail = enumUser?.find(tt => tt.id === txpayers.user_id)
      }

      if (userDetail) {
        iiii++
        $("#showThem").append(`
          <tr>
            <td scope="row">${iiii}</td>
            <td>${txpayers.timeIn}</td>
            <td>${userDetail.first_name} ${userDetail.last_name}</td>
            <td>${txpayers.user_category}</td>
            <td>${txpayers.comment}</td>
            <td>
              <button 
              data-bs-toggle="modal" 
              onclick="viewActii('${txpayers.timeIn}', '${txpayers.comment}','${userDetail.first_name}', '${txpayers.user_category}','${userDetail.surname}', '${txpayers.session_id}',  '${txpayers.ip_address}')" 
              data-bs-target="#viewActivity" 
              class="btn btn-primary btn-sm">View Activities</button>
            </td>
          </tr>
        `)
      }

    } else if (txpayers.user_category === "Mda User") {
      // console.log(mdaUserss)
      let userDetail = mdaUserss?.find(tt => tt.id === txpayers.user_id)

      if (userDetail) {
        iiii++
        $("#showThem").append(`
          <tr>
            <td scope="row">${iiii}</td>
            <td>${txpayers.timeIn}</td>
            <td>${userDetail.name}</td>
            <td>${txpayers.user_category}</td>
            <td>${txpayers.comment}</td>
            <td>
              <button 
              data-bs-toggle="modal" 
              onclick="viewActii('${txpayers.timeIn}', '${txpayers.comment}','${userDetail.name}', '${txpayers.user_category}','${userDetail.surname}', '${txpayers.session_id}',  '${txpayers.ip_address}')" 
              data-bs-target="#viewActivity" 
              class="btn btn-primary btn-sm">View Activities</button>
            </td>
          </tr>
        `)
      }

    }


  });
}

function filterData(data, userType, activity, fromDate, toDate) {

  return data.filter((item) => {
    // Filter by userType (if provided)
    if (userType && item.user_category !== userType) {
      return false;
    }

    // Filter by activity (if provided)
    if (activity && item.comment !== activity) {
      return false;
    }

    // Filter by date range (if provided)
    if (fromDate && toDate) {
      const itemDate = new Date(item.timeIn.split(" ")[0]);
      const fromDateObj = new Date(fromDate);
      const toDateObj = new Date(toDate);

      if (itemDate < fromDateObj || itemDate > toDateObj) {
        return false;
      }
    }

    // If all conditions pass, include the item in the filtered result
    return true;
  });
}


async function getFilters() {

  let userTyp = document.querySelector("#userTyp").value
  let actiType = document.querySelector("#actiType").value
  let fromDate = document.querySelector("#fromDate").value
  let toDate = document.querySelector("#toDate").value

  // console.log(userTyp, actiType, fromDate, toDate, activityData)

  const filteredData = filterData(activityData, userTyp, actiType, fromDate, toDate);
  console.log(filteredData);

  if (filteredData.length > 0) {
    $("#showThem").html("")
    filteredData.forEach((txpayers, i) => {
      let userDetail = UserDATA.find(tt => tt.id === txpayers.user_id)
      if (userDetail) {
        $("#showThem").append(`
        <tr>
          <td scope="row">${i + 1}</td>
          <td>${txpayers.timeIn}</td>
          <td>${userDetail.first_name} ${userDetail.surname}</td>
          <td>${txpayers.user_category}</td>
          <td>${txpayers.comment}</td>
          <td>
            <button 
            data-bs-toggle="modal" 
            onclick="viewActii('${txpayers.timeIn}', '${txpayers.comment}','${userDetail.first_name}', '${txpayers.user_category}','${userDetail.surname}', '${txpayers.session_id}',  '${txpayers.ip_address}')" 
            data-bs-target="#viewActivity" 
            class="btn btn-primary btn-sm">View Activities</button>
          </td>
        </tr>
      `)
      }
    });

    $("#filterInvoice").modal("hide")
  }



}



function viewActii(timeIn, comment, first_name, user_category, surname, session_id, ip_address) {
  let names = first_name + " " + surname;
  $("#theRe").html(comment)
  $("#time").html(timeIn)
  $("#theName2").html(names)
  $("#theEm").html(user_category)
  $("#thess").html(session_id)
  $("#theip").html(ip_address)
  // function fetchUsers() {
  //   const response = fetch(`${HOST}?getActivityLogs&userId=${user_id}&user_category=${user_category}`);
  //   const userAudits = response.json();

  //   let number = 0

  //   if (userAudits.status === 0) {
  //     $("#showThem2").append(`
  //       <tr>
  //         <td></td>
  //         <td>No data available</td>
  //         <td></td>
  //       </tr>
  //     `)
  //   } else {
  //     userAudits.message.forEach((audits, i) => {
  //       number++

  //       $("#showThem2").append(`
  //       <tr>
  //         <td>${number}</td>
  //         <td>${audits.timeIn}</td>
  //         <td>${theEmail}</td>
  //         <td>${audits.comment}</td>
  //         <td><button data-bs-toggle="modal" onclick="viewActii('${audits.timeIn}', '${audits.comment}')" data-bs-target="#viewActivity" class="btn btn-primary">View
  //             Activity</button></td>
  //       </tr>
  //       `)
  //     });
  //   }


  // }
}