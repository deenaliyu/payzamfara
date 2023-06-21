let adminInfo2 = JSON.parse(localStorage.getItem("adminDataPrime"))

let ALLTaxP = ""
async function fetchTaxPayers() {
  $("#showreport").html("")
  $("#loader").css("display", "flex")

  let config = {
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*"
    }
  }
  const response = await fetch(`${HOST}/?getTaxPayer`)
  const taxPayers = await response.json()
  ALLTaxP = taxPayers
  console.log(ALLTaxP)

  $("#loader").css("display", "none")

  if (taxPayers.status === 0) {
    $("#showreport").html("<tr></tr>")
    $('#dataTable').DataTable();
  } else {
    taxPayers.message.reverse().forEach((taxPayer, i) => {
      let theimg = taxPayer.img
      if (theimg === "") {
        theimg = "./assets/img/avatars/1.png"
      }
      let showRe = ""

      showRe += `
        <tr class="relative">
          <td>${i + 1}</td>
        `
      if (taxPayer.img === "") {
        showRe += `   
        <td>
          <img src="./assets/img/avatars/1.png" class="w-[40px] rounded-full h-[40px] object-cover" alt="" />
        </td>
        `
      } else {
        showRe += ` 
        <td> 
          <img src="${taxPayer.img}" class="w-[40px] rounded-full h-[40px] object-cover" alt="" />
        </td>
        `
      }

      showRe += `
        <td><a class="text-primary" href="./taxpayerlist.html?id=${taxPayer.id}">${taxPayer.tax_number}</a></td>
        <td>${taxPayer.first_name} ${taxPayer.surname}</td>
        <td>${taxPayer.category}</td>
        <td>${taxPayer.tin}</td>
        <td>${taxPayer.phone}</td>
      `
      if (taxPayer.tin_status === "Unverified") {
        showRe += `
          <td class="text-danger">${taxPayer.tin_status}</td>
        `
      } else if (taxPayer.tin_status === "Verified") {
        showRe += `
          <td class="text-success">${taxPayer.tin_status}</td>
        `
      }


      showRe += `
          <td>${taxPayer.timeIn}</td>
          <td>
          <div class="flex items-center gap-3">
       `
      if (adminInfo2.tax_payer_access === "view") {

      } else {
        showRe += `
          <button data-theid="${taxPayer.id}" onclick="editThis(this)" class="EditUser"><iconify-icon
          icon="material-symbols:edit-square-outline"></iconify-icon></button>
        `
      }

      showRe += `
      <a href="./taxpayerlist.html?id=${taxPayer.id}" class="btn btn-primary btn-sm viewUser" >View</a>
          </div >
      
        </tr >
        `

      $("#showreport").append(showRe)

      if (i === taxPayers.message.length - 1) {
        $('#dataTable').DataTable();
      }
    });

  }

}

fetchTaxPayers()


$("#Individual").on('click', () => {
  var input, filter, table, tr, td, i;
  input = document.getElementById("Individual");
  filter = input.value.toUpperCase();
  table = document.querySelector("table");
  tr = table.getElementsByTagName("tr");
  for (var i = 0; i < tr.length; i++) {
    var tds = tr[i].getElementsByTagName("td");
    var flag = false;
    for (var j = 0; j < tds.length; j++) {
      var td = tds[j];
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        flag = true;
      }
    }
    if (flag) {
      tr[i].style.display = "";
    }
    else {
      tr[i].style.display = "none";
    }
  }
})

$("#Corporate").on('click', () => {
  var input, filter, table, tr, td, i;
  input = document.getElementById("Corporate");
  filter = input.value.toUpperCase();
  table = document.querySelector("table");
  tr = table.getElementsByTagName("tr");
  for (var i = 0; i < tr.length; i++) {
    var tds = tr[i].getElementsByTagName("td");
    var flag = false;
    for (var j = 0; j < tds.length; j++) {
      var td = tds[j];
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        flag = true;
      }
    }
    if (flag) {
      tr[i].style.display = "";
    }
    else {
      tr[i].style.display = "none";
    }
  }
})


// id=1&status=0&UpdateTaxPayersTINStatus

function editThis(e) {
  let theid = e.dataset.theid
  sessionStorage.setItem("editID", theid)

  $("#editMod").modal("show")
}

$("#updateStatus").on("click", function (e) {
  e.preventDefault()

  let theeiidd = sessionStorage.getItem("editID")
  $("#msg_box").html(`
        < div class="flex justify-center items-center mt-4" >
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div >
        `)
  $("#updateStatus").addClass("hidden")
  let stts = $("#selectInput").val()

  console.log()
  $.ajax({
    type: "GET",
    url: `${HOST} /?UpdateTaxPayersTINStatus&id=${theeiidd}&status=${stts}`,
    dataType: 'json',
    // data: StringedData,
    success: function (data) {
      // console.log(data)
      if (data.status === 1) {

        $("#msg_box").html(`
          <p class="text-success text-center mt-4 text-lg">Status Updated succssfully !</p>
        `)

        setTimeout(() => {
          $("#editMod").modal("hide")
          fetchTaxPayers()
          // window.location.reload()
        }, 1000);
      }
    },
    error: function (request, error) {
      console.log(error);
      $("#msg_box").html(`
        <p class="text-danger text-center mt-4 text-lg">Something went wrong !</p>
      `)
      $("#updateStatus").removeClass("hidden")
    }
  });

})
