const urlParams = new URLSearchParams(window.location.search);
const theUserID = urlParams.get('id')
// 

async function fetchUSER() {


  const response = await fetch(
    `${HOST}/php/index.php?getAdminUser`
  );
  const userInvoices = await response.json();

  if (userInvoices.status === 1) {

    let theUSER = userInvoices.message.filter(tt => tt.id === theUserID)[0]

    $("#accessLevelview").html(`
      <h1 class="text-lg fontBold mb-2">Access Level</h1>

      <table class="table w-[50%]">
        <tr>
          <th>Dashboard Access</th>
          <td>${theUSER.dashboard_access} Access</td>
        </tr>
        <tr>
          <th>Analytics Access</th>
          <td>${theUSER.analytics_access} Access</td>
        </tr>
        <tr>
          <th>Enumeration Access</th>
          <td>${theUSER.enumeration_access} Access</td>
        </tr>
        <tr>
          <th>Audit Trail Access</th>
          <td>${theUSER.audit_trail_access} Access</td>
        </tr>
        <tr>
          <th>Mda Access</th>
          <td>${theUSER.mda_access} Access</td>
        </tr>
        <tr>
          <th>Report Access</th>
          <td>${theUSER.reports_access} Access</td>
        </tr>
        <tr>
          <th>Users Access</th>
          <td>${theUSER.users_access} Access</td>
        </tr>
        <tr>
          <th>Cms Access</th>
          <td>${theUSER.cms_access} Access</td>
        </tr>
        <tr>
          <th>Support Access</th>
          <td>${theUSER.support} Access</td>
        </tr>
      </table>
    `)

    let alluserInputs = document.querySelectorAll(".userInputs")
    alluserInputs.forEach(uu => {
      uu.value = theUSER[uu.dataset.name]
    })

    let allRadioBoxs = document.querySelectorAll(".form-check-input")

    allRadioBoxs.forEach(uu => {
      // uu.checked = theUSER[uu.dataset.name]
      // uu.checked = true;
      // console.log(theUSER[uu.name])
    })
  } else {

  }
}
{/* <td class="text-[#22C55E]">Full access</td> */ }
fetchUSER()

$("#opPas").on("click", function () {
  let pasInp = document.querySelector(".passInput")

  if (pasInp.type === "password") {
    pasInp.type = "text"
  } else {
    pasInp.type = "password"
  }
})
