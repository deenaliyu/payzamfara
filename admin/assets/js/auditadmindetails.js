const urlParams = new URLSearchParams(window.location.search);
const theUserID = urlParams.get('id')
const theName = urlParams.get('name')
const theEmail = urlParams.get('email')

$("#theName").html(theName)
$("#theEm").html(theEmail)
$("#theName2").html(theName)


async function fetchUsers() {
  const response = await fetch(`${HOST}?getActivityLogs&userId=${theUserID}&user_category=Admin User`);
  const userAudits = await response.json();
  let number = 0

  if (userAudits.status === 0) {
    $("#showThem2").append(`
      <tr>
        <td></td>
        <td>No data available</td>
        <td></td>
      </tr>
    `)
  } else {
    userAudits.message.forEach((audits, i) => {
      number++
      $("#showThem2").append(`
      <tr>
        <td>${number}</td>
        <td>${audits.timeIn}</td>
        <td>${theEmail}</td>
        <td>${audits.comment}</td>
        <td><button data-bs-toggle="modal" onclick="viewActii('${audits.timeIn}', '${audits.comment}')" data-bs-target="#viewActivity" class="btn btn-primary">View
            Activity</button></td>
      </tr>
      `)
    });
  }


}

fetchUsers()

function viewActii(timeIn, comment) {
  $("#theRe").html(comment)
  $("#time").html(timeIn)
}