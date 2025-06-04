let dataToExport;

function formatMoney(amount) {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'NGN', // Change this to your desired currency code
    minimumFractionDigits: 2,
  });
}

$("#generatePresumptiveBtn").attr('href', `../generatepresumptiveinvoice.html?created_by=admin&id=${userInfo2?.id}`);

let AllDemanData = {}

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
        getAllPresumptive: true,
        page: pageNumber,
        limit: data.length,
      };

      // Call your API with the calculated page number
      $.ajax({
        url: HOST,
        type: 'GET',
        data: filters,
        success: function (response) {
            dataToExport = response.data
          // Map the API response to DataTables expected format
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
      { data: 'COL_3' },
      { data: 'COL_4' },
      {
        data: null,
        render: function (data, type, row) {
          return row.first_name + " " + row.surname;
        }
      },
      { data: 'invoice_number' },
      { data: 'business_cat' },
      {
        data: null,
        render: function (data, type, row) {
          return formatMoney(row.amount_paid);
        }
      },
      { data: 'admin_email', 
        render: function (data, type, row) {
          return `${data ? data : "self"}`;
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
          return ` <a href="./viewinvoice.html?invnumber=${row.invoice_number}&load=true" target="_blank" class="btn btn-primary btn-sm viewUser" >View Invoice</a>`;
        }
      },
    ],
  });

}

fetchInvoice()

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
      `${HOST}/php/index.php?getDashboardAnalyticsPresumptive`
    );

    const userAnalytics = await response.json();
    $("#totalInv").html(userAnalytics.total_invoice)
    $("#due_amount").html(userAnalytics.due_amount)
    $("#due_invoices").html(userAnalytics.due_invoices)
    $("#total_amount_invoiced").html(userAnalytics.total_amount_invoiced.toLocaleString())
    $("#total_amountP").html(userAnalytics.total_amount_paid.toLocaleString())

    // console.log(userAnalytics)
  } catch (error) {
    console.log(error)
  }


}

fetchAnalytics()

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
  a.download = "presumptive_reports.csv";
  a.click();
}
