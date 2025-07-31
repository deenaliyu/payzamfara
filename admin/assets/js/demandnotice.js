function formatMoney(amount) {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'NGN', // Change this to your desired currency code
    minimumFractionDigits: 2,
  });
}

async function fetchRevHeadsAll() {
  const response = await fetch(`${HOST}/?getAllRevenueHeads`)
  const revHeads = await response.json()

  if (revHeads.status === 0) {

  } else {
    $("#getRevs").html(`
        <option selected value="">All</option>
    `)
    revHeads.message.forEach((revHd, i) => {
      $("#getRevs").append(`
          <option value="${revHd["id"]}" id="${revHd["COL_4"]}" >${revHd["COL_4"]}</option>
      `)
    });
  }
}

fetchRevHeadsAll()

let AllDemanData = []

async function fetchInvoice() {
  if ($.fn.DataTable.isDataTable('#dataTable')) {
    $('#dataTable').DataTable().clear().destroy();
  }


  table = $('#dataTable').DataTable({
    processing: true, // Show processing indicator
    serverSide: true, // Enable server-side processing
    paging: true,     // Enable pagination
    searching: false,  // Enable search box
    pageLength: 50,   // Number of items per page
    ajax: function (data, callback, settings) {
      // Convert DataTables page number to your API page number
      const pageNumber = Math.ceil(data.start / data.length) + 1;

      const filters = {
        getAllDemandNotice: true,
        page: pageNumber,
        limit: data.length,
        payment_status: $("#paymentStatusSelect").val(),
        date_from: $("#fromDateInput").val(),
        date_to: $("#toDateInput").val(),
        revenue_head: $("#getRevs").val(),
        payer_id: $("#userPayerId").val()
      };

      // Call your API with the calculated page number
      $.ajax({
        url: HOST,
        type: 'GET',
        data: filters,
        success: function (response) {
          // Map the API response to DataTables expected format
          AllDemanData = response.data

          callback({
            draw: data.draw, // Pass through draw counter
            recordsTotal: response.total, // Total records in your database
            recordsFiltered: response.total, // Filtered records count
            data: response.data, // The actual data array from your API
          });
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
      { data: 'tax_number' },
      // { data: 'COL_3' },
      // { data: 'COL_4' },
      {
        data: null,
        render: function (data, type, row) {
          return row.first_name + " " + row.surname;
        }
      },
      { data: 'category' },
      { data: 'invoice_number' },
      {
        data: null,
        render: function (data, type, row) {
          return formatMoney(row.total_amount_paid);
        }
      },
      { data: 'date_created' },
      { data: 'due_date' },
      {
        data: null,
        render: function (data, type, row) {
          return row.payment_status === "paid" ? `<span class="badge bg-success">Paid</span>` : `<span class="badge bg-danger">Unpaid</span>`;
        }
      },
      {
        data: null,
        render: function (data, type, row) {
          return `<a href="./viewinvoice.html?invnumber=${row.invoice_number}&load=true" class="btn btn-primary btn-sm viewUser">View CDM/Invoice</a>`;
        }
      },
    ],
  });

}

fetchInvoice()

$("#filterDemand").on("click", function () {
  fetchInvoice();

  $("#filterInvoice").modal('hide')
});

$("#clearfilter3").on("click", function () {
  $("#paymentStatusSelect").val('');
  $("#fromDateInput").val('');
  $("#toDateInput").val('');
  $("#getRevs").val('');
  $("#userPayerId").val('')
  fetchInvoice()

  $("#filterInvoice").modal('hide')
});

async function exportData(button) {
  // Change the button state to 'Downloading...'
  const originalText = button.innerHTML;
  button.disabled = true; // Disable the button to prevent multiple clicks
  button.innerHTML = `
        <iconify-icon icon="material-symbols:cloud-download" width="28" height="28"></iconify-icon> Downloading...`;

  let startDate = $("#fromDateInput").val();
  let endDate = $("#toDateInput").val();

  const the_filters = {
    payment_status: $("#paymentStatusSelect").val(),
    date_created_start: $("#fromDateInput").val(),
    date_created_end: $("#toDateInput").val(),
    invoice_type: "demand notice",
    revenue_head: $("#getRevs").val(),
    payer_id: $("#userPayerId").val()
  };

  const urlParamsForFilters = new URLSearchParams(the_filters).toString();

  try {
    // Make the API call
    const response = await fetch(`${HOST}?getAllInvoiceDemandedWithDownload&${urlParamsForFilters}`);

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
      link.download = "demand_notices.csv"; // Optional: Specify the file name
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

  let config = {
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
    },
  };
  try {
    const response = await fetch(
      `${HOST}/php/index.php?dashboardAnalyticsAdminDemandNotice`
    );

    const userAnalytics = await response.json();

    $("#totalInv").html(userAnalytics.total_invoice)
    $("#total_amount_invoiced").html(userAnalytics.total_amount_invoiced.toLocaleString())
    $("#total_amountP").html(userAnalytics.total_amount_paid.toLocaleString())
    $("#total_amountU").html(userAnalytics.due_amount.toLocaleString())

    // let total = (userAnalytics.total_amount_paid / userAnalytics.total_amount_invoiced) * 100
    // $("#Compliance").html(total + "%")
    // console.log(userAnalytics)
  } catch (error) {
    console.log(error)
  }


}

fetchAnalytics()
