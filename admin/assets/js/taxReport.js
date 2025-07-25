let adminInfo2 = JSON.parse(localStorage.getItem("adminDataPrime"))

let ALLTaxP = ""
let dataToExport;

$("#createTaxBtn").on("click", function () {
  window.location.href = `../regcategory.html?createdby=admin&admin_id=${adminInfo2.id}`
})

async function getRegSummary() {

  fetch(`${HOST}?get_Registered_Stats`)
    .then(response => response.json())
    .then(data => {
      // Update the values dynamically
      $('#allregistered').text(data.total_self_registered + data.total_admin_registered || 0)
      $('#selfRegis').text(data.total_self_registered || 0)
      $('#adminReg').text(data.total_admin_registered || 0)
    })
    .catch(error => console.error('Error fetching data:', error));
}

getRegSummary()

function fetchTaxPayers() {
  if ($.fn.DataTable.isDataTable('#dataTable')) {
    $('#dataTable').DataTable().destroy();
  }

  // $('#dataTable').empty(); 

  table = $('#dataTable').DataTable({
    processing: true, // Show processing indicator
    serverSide: true, // Enable server-side processing
    paging: true,     // Enable pagination
    pageLength: 50,   // Number of items per page
    ajax: function (data, callback, settings) {
      // Convert DataTables page number to your API page number
      const pageNumber = Math.ceil(data.start / data.length) + 1;

      // Call your API with the calculated page number
      $.ajax({
        url: HOST,
        type: 'GET',
        data: {
          getTaxPayer: true,
          page: pageNumber,
          pageSize: data.length, // Number of rows per page
          search: data.search.value, // Search term
          searchDelay: 1500,
        },
        success: function (response) {
          // Map the API response to DataTables expected format
          ALLTaxP = response.message
          dataToExport = response.data

          if (response.status === 1) {
            callback({
              draw: data.draw, // Pass through draw counter
              recordsTotal: response.pagination.total, // Total records in your database
              recordsFiltered: response.pagination.total, // Filtered records count
              data: response.message, // The actual data array from your API
            });
          } else {
            callback({
              draw: data.draw, // Pass through draw counter
              recordsTotal: 0, // Total records in your database
              recordsFiltered: 0, // Filtered records count
              data: [], // The actual data array from your API
            });
          }
        },
        error: function () {
          alert('Failed to fetch data.');
        },
      });
    },
    columns: [
      {
        data: null,
        orderable: false, // Disable ordering for the numbering column
        render: function (data, type, row, meta) {
          // Calculate the row number based on the page
          return meta.row + 1 + meta.settings._iDisplayStart;
        },
      },
      {
        data: 'tax_number',
        render: function (data, type, row) {
          return `<a class="text-primary" href="./taxpayerlist.html?id=${data}">${data}</a>`;
        }
      },
      {
        data: null,
        render: function (data, type, row) {
          return `${row.first_name} ${row.surname === '?' ? '' : row.surname}`;
        }
      },
      { data: 'category' },
      { data: 'tin' },
      { data: 'email' },
      { data: 'phone' },
      {
        data: 'created_by',
        render: function (data, type, row) {
          if (data === "admin") {
            return `Admin`
          } else {
            return `Self`
          }
        }
      },
      {
        data: 'tin_status',
        render: function (data, type, row) {
          if (data === "Unverified") {
            return `<span class="badge bg-danger">${data}</span>`
          } else {
            return `<span class="badge bg-success">${data}</span>`
          }
        }
      },
      { data: 'timeIn' },
      {
        data: null,
        render: function (data, type, row) {
          return `
          <div class="flex items-center gap-3">
            <button data-theid="${row.tax_number}" onclick="editThis(this)" data-usertype="payer_user" class="EditUser txView"><iconify-icon icon="material-symbols:edit-square-outline"></iconify-icon></button>
            <a href="./taxpayerlist.html?id=${row.tax_number}" class="btn btn-primary btn-sm viewUser txView">View</a>
          </div>`
        }
      }
    ],
  });
}

fetchTaxPayers()


async function fetchEnutaxP() {
  $("#showreport2").html("")
  $("#loader1").css("display", "flex")
  const response = await fetch(`${HOST}/?getEnumerationTaxPayer`)
  const taxPayers = await response.json()

  $("#loader1").css("display", "none")

  if (taxPayers.status === 0) {
    $("#showreport2").html(``)

  } else {
    $("#enumRegs").html(taxPayers.message.length)

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
  a.download = "taxpayer_report.csv";
  a.click();
}