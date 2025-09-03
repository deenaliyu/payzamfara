function formatMoney(amount) {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'NGN', // Change this to your desired currency code
    minimumFractionDigits: 2,
  });
}

$(document).ready(function () {
  getStartedInvoice('https://payzamfara.com/php/index.php')
});

function getStartedInvoice(theUrl) {
  if ($.fn.DataTable.isDataTable('#dataTable')) {
    $('#dataTable').DataTable().destroy();
  }

  // $('#dataTable').empty(); 

  $('#dataTable').DataTable({
    processing: true, // Show processing indicator
    serverSide: true, // Enable server-side processing
    paging: true,     // Enable pagination
    pageLength: 50,   // Number of items per page
    ajax: function (data, callback, settings) {
      // Convert DataTables page number to your API page number
      const pageNumber = Math.ceil(data.start / data.length) + 1;

      // Call your API with the calculated page number
      $.ajax({
        url: theUrl,
        type: 'GET',
        data: {
          fetchAllPayment: true,
          page: pageNumber,
          pageSize: data.length, // Number of rows per page
          search: data.search.value, // Search term
          searchDelay: 1500, // Delay in milliseconds for search
        },
        success: function (response) {
          // Map the API response to DataTables expected format
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
      { data: 'mda_id' },
      { data: 'COL_4' },
      {
        data: null,
        render: function (data, type, row) {
          return `${row.first_name} ${row.surname === '?' ? '' : row.surname}`;
        }
      },
      { data: 'office_name' },
      { data: 'tax_number' },
      { data: 'invoice_number' },
      {
        data: 'amount_paid',
        render: function (data, type, row) {
          return formatMoney(parseFloat(data));
        }
      },
      { data: 'payment_channel' },
      { data: 'payment_method' },
      { data: 'payment_bank' },
      { data: 'payment_reference_number' },
      { data: 'invoice_number' },
      { data: 'timeIn' },
      {
        data: 'invoice_number',
        render: function (data, type, row) {
          return `<a href="./viewreceipt.html?invnumber=${data}&load=true" target="_blank" class="btn btn-primary btn-sm viewUser">View Receipt</a>`;
        }
      }
    ],
  });
}

async function filterTheInvoice() {
  try {
    $("#msg_boxer").html(`
      <div class="flex justify-center items-center mt-4">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    `)

    $("#filterTheInvoice").addClass("hidden")

    let allInputs = document.querySelectorAll(".filterInputs")

    let obj = {}
    allInputs.forEach(allInput => {
      if (allInput.value === "") {

      } else {
        obj[allInput.dataset.name] = allInput.value
      }
    })

    const selectedMda = document.getElementById('getMDAs').value;
    const listOfchannel = document.getElementById('listOfchannel').value;

    const selRevv = document.getElementById('listOfpayable').value;

    let fromDateInput = document.querySelector("#fromDateInput").value
    let toDateInput = document.querySelector("#toDateInput").value

    if (selRevv === "") {

    } else {
      obj.revenue_head = selRevv === "" ? '' : selRevv
    }

    if (selectedMda === "") {

    } else {
      obj.mda_id = selectedMda
    }

    if (listOfchannel === "") {

    } else {
      obj.payment_channel = listOfchannel
    }

    const urlParam = new URLSearchParams(obj).toString()

    getStartedInvoice(`${HOST}?fetchAllPayment&${urlParam}`)

    const response = await fetch(`${HOST}?fetchAllPayment&${urlParam}&pageSize=50`)
    const data = await response.json()

    if (data.status === 1) {
      $("#filterTheInvoice").removeClass("hidden")
      $("#msg_boxer").html('')

      $("#filterInvoice").modal("hide")


    } else {
      $("#msg_boxer").html(`<p class="text-warning text-center">No records found for the selected filters</p>`)

      $("#filterTheInvoice").removeClass("hidden")
    }

  } catch (error) {
    console.log(error)
    $("#msg_boxer").html(`<p class="text-danger text-center">${error.error ? error.error : 'something went wrong, Try Again.'}</p>`)

    $("#filterTheInvoice").removeClass("hidden")
  }
}

async function fetchInvoicee() {
  const response = await fetch(`${HOST}?fetchAllPayment&pageSize=200&page=1`);

  const userInvoices = await response.json();

  if (userInvoices.status === 1) {
    displayDataFilter(userInvoices.message)
  } else {

  }
}

fetchInvoicee()

async function exportData(button) {
  // Change the button state to 'Downloading...'
  const originalText = button.innerHTML;
  button.disabled = true; // Disable the button to prevent multiple clicks
  button.innerHTML = `
        <iconify-icon icon="material-symbols:cloud-download" width="28" height="28"></iconify-icon> Downloading...`;

  let allInputs = document.querySelectorAll(".filterInputs")

  let obj = {}
  allInputs.forEach(allInput => {
    if (allInput.value === "") {

    } else {
      obj[allInput.dataset.name] = allInput.value
    }
  })

  const selectedMda = document.getElementById('getMDAs').value;
  const selRevv = document.getElementById('listOfpayable').value;

  if (selRevv === "") {

  } else {
    obj.revenue_head = selRevv === "" ? '' : selRevv
  }

  if (selectedMda === "") {

  } else {
    obj.mda_id = selectedMda
  }

  const urlParam = new URLSearchParams(obj).toString()

  try {
    // Make the API call
    const response = await fetch(`${HOST}?fetchAllPaymentWithDownload&${urlParam}`);

    // Check if the response is okay
    if (!response.ok) {
      throw new Error("Failed to fetch data. Please try again.");
    }

    // Parse the JSON response
    const data = await response.json();

    // Check if the status is successful and there's a download link
    if (data.status === 1 && data.download_link) {
      // Create a temporary link element to trigger the download
      const link = document.createElement("a");
      link.href = data.download_link;
      link.download = "payment_collection.csv"; // Optional: Specify the file name
      document.body.appendChild(link);
      link.click();

      // Clean up by removing the temporary link
      document.body.removeChild(link);
    } else {
      alert("Failed to fetch the download link. Please try again.");
    }
  } catch (error) {
    console.error("Error downloading the report:", error);
    alert("An error occurred while downloading the report.");
  } finally {
    // Restore the button state
    button.disabled = false;
    button.innerHTML = originalText;
  }
}

function displayDataFilter(userInvoices) {
  $("#showThem2").html('')
  userInvoices.forEach((userInvoice, i) => {
    $("#showThem2").append(`
          <tr class="relative">
              <td>${i + 1}</td>
              <td>${userInvoice.mda_id.replace(/,/g, '')}</td>
              <td>${userInvoice.COL_4.replace(/,/g, '')}</td>
              <td>${userInvoice.first_name?.replace(/,/g, '')} ${userInvoice.surname?.replace(/,/g, '')}</td>
              <td>${userInvoice.tax_number}</td>
              <td>${userInvoice.invoice_number}</td>
              <td>${userInvoice.tin}</td>
              <td>${userInvoice.industry}</td>
              <td>${(parseFloat(userInvoice.amount_paid))}</td>
              <td>${userInvoice.payment_channel}</td>
              <td>${userInvoice.payment_method}</td>
              <td>${userInvoice.payment_bank}</td>
              <td>${userInvoice.payment_reference_number}</td>
              <td>${userInvoice.invoice_number}</td>
              <td>${userInvoice.timeIn}</td>
          </tr>
        `)
  });
}

function clearfilter() {
  if ($.fn.DataTable.isDataTable('#dataTable')) {
    $('#dataTable').DataTable().clear().destroy();
  }

  $("#filterInvoice").modal("hide")

  const selectedMda = document.getElementById('getMDAs').value = ""
  const selRevv = document.getElementById('listOfpayable').value = ""
  const payment = document.getElementById('listOfchannel').value = ""
  const fromDate = document.getElementById('fromDateInput').value = ""
  const toDate = document.getElementById('toDateInput').value = ""

  $("#getMDAs").append(`
  <option selected value="">All</option>
`)
  $("#listOfpayable").html(`
  <option selected value="">All</option>
  `)
  $("#listOfchannel").append(`
  <option selected value="">All</option>
  `)

  fetchInvoicee()
  getStartedInvoice('https://payzamfara.com/php/index.php')
}
