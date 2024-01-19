let adminInfo2 = JSON.parse(localStorage.getItem("adminDataPrime"))

let ALLTaxP = ""
let numberOfAll = 0
let numberOfAll2 = 0

async function fetchTaxPayers() {
  $("#showreport").html("")
  $("#loader").css("display", "flex")

  const response = await fetch(`${HOST}/?getTaxPayer`)
  const taxPayers = await response.json()
  ALLTaxP = taxPayers
  console.log(ALLTaxP)

  $("#loader").css("display", "none")

  if (taxPayers.status === 0) {
    $("#showreport").html("<tr></tr>")
    $('#dataTable').DataTable();

    $("#selfRegis").html(0)
    numberOfAll = 0
  } else {
    $("#selfRegis").html(taxPayers.message.length)
    numberOfAll = taxPayers.message.length
    sessionStorage.setItem('numberOfAll', numberOfAll);
    taxPayers.message.reverse().forEach((taxPayer, i) => {
      // let theimg = taxPayer.img
      // if (theimg === "") {
      //   theimg = "./assets/img/avatars/1.png"
      // }
      let showRe = ""

      showRe += `
        <tr class="relative">
          <td>${i + 1}</td>
        `
      // if (taxPayer.img === "") {
      //   showRe += `   
      //   <td>
      //     <img src="./assets/img/avatars/1.png" class="w-[40px] rounded-full h-[40px] object-cover" alt="" />
      //   </td>
      //   `
      // } else {
      //   showRe += ` 
      //   <td> 
      //     <img src="${taxPayer.img}" class="w-[40px] rounded-full h-[40px] object-cover" alt="" />
      //   </td>
      //   `
      // }

      showRe += `
        <td><a class="text-primary" href="./taxpayerlist.html?id=${taxPayer.id}">${taxPayer.tax_number}</a></td>
        <td>${taxPayer.first_name} ${taxPayer.surname}</td>
        <td>${taxPayer.category}</td>
        <td>${taxPayer.tin}</td>
        <td>${taxPayer.email}</td>
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
      showRe += `
        <button data-theid="${taxPayer.id}" onclick="editThis(this)" data-usertype="payer_user" class="EditUser txView"><iconify-icon
        icon="material-symbols:edit-square-outline"></iconify-icon></button>
      `
      showRe += `
      <a href="./taxpayerlist.html?id=${taxPayer.id}" class="btn btn-primary btn-sm viewUser txView">View</a>
          </div>
      
        </tr>
        `

      $("#showreport").append(showRe)

      if (i === taxPayers.message.length - 1) {
        $('#dataTable').DataTable();
      }
    });

  }

}

fetchTaxPayers().then(ee => {
 
})

async function fetchEnutaxP() {
  $("#showreport2").html("")
  $("#loader1").css("display", "flex")
  const response = await fetch(`${HOST}/?getEnumerationTaxPayer`)
  const taxPayers = await response.json()

  $("#loader1").css("display", "none")

  if (taxPayers.status === 0) {
    $("#showreport2").html(``)

    $("#enumRegs").html(0)
    numberOfAll2 = 0
  } else {
    $("#enumRegs").html(taxPayers.message.length)
  
    numberOfAll2 = taxPayers.message.length
    sessionStorage.setItem('numberOfAll2', numberOfAll2);
    taxPayers.message.reverse().forEach((txpayer, i) => {

      let showRe1 = ""

      showRe1 += `<tr>
      <td>${i + 1}</td>
     
      <td><a class="text-primary" href="./taxpayerlist.html?id=${txpayer.id}&enumerated=true">${txpayer.tax_number}</a></td>
      <td>${txpayer.first_name} ${txpayer.last_name}</td>
      <td>${txpayer.email}</td>
      <td>${txpayer.account_type}</td>
      <td>${txpayer.fullname}</td>
      <td>${txpayer.tin}</td>
      <td>
      ${txpayer.tin_status === "Verified" ? `
       <div class="badge bg-success">${txpayer.tin_status}</div>
      ` : `
        <div class="badge bg-danger">${txpayer.tin_status}</div>
      `}
        
      </td>
      <td>${txpayer.timeIn.split(" ")[0]}</td>
      <td>
        <div class="flex gap-3 items-center">
          <button data-theid="${txpayer.id}" onclick="editThis(this)" data-usertype="enumerator_tax_payers" class="txView EditUser"><iconify-icon
          icon="material-symbols:edit-square-outline"></iconify-icon></button>

            <a href="./taxpayerlist.html?id=${txpayer.id}&enumerated=true" class="btn txView btn-primary btn-sm viewUser">View</a>
        </div>
      </td>
      </tr>`


      $("#showreport2").append(showRe1)
    });

  }

}
 // <td>
          //   <img src="${txpayer.img}" class="w-[40px] rounded-full h-[40px] object-cover" alt="" />
          // </td>

fetchEnutaxP().then(dd => {
  $('#dataTable2').DataTable();
})

numberOfAll = JSON.parse(sessionStorage.getItem("numberOfAll"))
numberOfAll2 = JSON.parse(sessionStorage.getItem("numberOfAll2"))
$(".registered").html(numberOfAll + numberOfAll2)

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
let userType = ""

function editThis(e) {
  let theid = e.dataset.theid
  sessionStorage.setItem("editID", theid)

  $("#editMod").modal("show")
  console.log(e.dataset.usertype)
  userType = e.dataset.usertype
}

$("#updateStatus").on("click", function (e) {
  e.preventDefault()

  let theeiidd = sessionStorage.getItem("editID")
  $("#msg_box").html(`
        <div class="flex justify-center items-center mt-4">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
        `)
  $("#updateStatus").addClass("hidden")
  let stts = $("#selectInput").val()

  console.log()
  $.ajax({
    type: "GET",
    url: `${HOST}?UpdateTaxPayersTINStatus&id=${theeiidd}&status=${stts}&userType=${userType}`,
    dataType: 'json',
    // data: StringedData,
    success: function (data) {
      // console.log(data)
      if (data.status === 1) {

        $("#msg_box").html(`
          <p class="text-success text-center mt-4 text-lg">Status Updated succssfully !</p>
        `)

        setTimeout(() => {
          $("#updateStatus").removeClass("hidden")
          $("#editMod").modal("hide")
          // $("#msg_box").html(``)
          // fetchTaxPayers()
          window.location.reload()
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
