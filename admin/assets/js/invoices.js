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
        url: theUrl,
        type: 'GET',
        data: {
          AllInvoices: true,
          invoice_type: "invoice",
          page: pageNumber,
          pageSize: data.length, // Number of rows per page
          search: data.search.value, // Search term
          searchDelay: 1500,
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
      { data: 'payer_id' },
      { data: 'COL_3' },
      { data: 'COL_4' },
      {
        data: null,
        render: function (data, type, row) {
          return `${row.first_name} ${row.surname === '?' ? '' : row.surname}`;
        }
      },
      { data: 'phone' },
      { data: 'office_name' },
      { data: 'invoice_number' },
      { data: 'invoice_type' },
      {
        data: 'amount_paid',
        render: function (data, type, row) {
          return formatMoney(parseFloat(data));
        }
      },
      { data: 'description' },
      { data: 'date_created' },
      { data: 'due_date' },
      {
        data: 'payment_status',
        render: function (data, type, row) {
          if (data === 'paid') {
            return '<span class="badge bg-success">Paid</span>';
          } else if (data === 'unpaid') {
            return '<span class="badge bg-danger">Unpaid</span>';
          }
          // Return default if status is unknown
          return '-';
        }
      },
      {
        data: 'invoice_number',
        render: function (data, type, row) {
          return `<a href="./viewinvoice.html?invnumber=${data}&load=true" target="_blank" class="btn btn-primary btn-sm viewUser">View Invoice</a>`;
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

    // console.log(urlParam)

    getStartedInvoice(`${HOST}?AllInvoices&${urlParam}`)

    const response = await fetch(`${HOST}?AllInvoices&${urlParam}&pageSize=500`)
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

function clearfilter() {
  if ($.fn.DataTable.isDataTable('#dataTable')) {
    $('#dataTable').DataTable().clear().destroy();
  }

  $("#filterInvoice").modal("hide")

  const selectedMda = document.getElementById('getMDAs').value = "";
  const selRevv = document.getElementById('listOfpayable').value = "";

  const selectedPaymentStatus = document.getElementById('paymentStatusSelect').value = "";
  const fromDate = document.getElementById('fromDateInput').value = "";
  const toDate = document.getElementById('toDateInput').value = "";

  $("#getMDAs").append(`
  <option selected value="">All</option>
`)
  $("#listOfpayable").html(`
  <option selected value="">All</option>
  `)
  $("#listOfchannel").append(`
  <option selected value="">All</option>
  `)

  getStartedInvoice('https://payzamfara.com/php/index.php')
}

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
    const response = await fetch(`${HOST}?getAllInvoiceWithDownload&${urlParam}`);

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
      link.download = "invoices.csv"; // Optional: Specify the file name
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

async function fetchAnalytics() {
  try {
    const response = await fetch(
      `${HOST}/php/index.php?getDashboardAnalyticsAdmin`
    );

    const userAnalytics = await response.json();

    $("#totalInv").html(userAnalytics.total_invoice)
    $("#due_amount").html(userAnalytics.due_amount)
    $("#due_invoices").html(userAnalytics.due_invoices)
    $("#total_amount_invoiced").html(userAnalytics.total_amount_invoiced.toLocaleString())
    $("#total_amountP").html(userAnalytics.total_amount_paid.toLocaleString())

    let total = (userAnalytics.total_amount_paid / userAnalytics.total_amount_invoiced) * 100
    $("#Compliance").html(total + "%")
    // console.log(userAnalytics)
  } catch (error) {
    console.log(error)
  }


}

fetchAnalytics()