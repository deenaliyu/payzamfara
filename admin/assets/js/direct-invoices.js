let AllDemanData = {}
let dataToExport;

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
        getAllDirectAssessment: true,
        page: pageNumber,
        limit: data.length,
        invoice_number: $('#invnumberInput').val(),
        payment_status: $('#paymentStatusSelect').val(),
        date_from: $('#fromDateInput').val(),
        date_to: $('#toDateInput').val()
      };

      // Call your API with the calculated page number
      $.ajax({
        url: HOST,
        type: 'GET',
        data: filters,
        success: function (response) {
          // Map the API response to DataTables expected format
          dataToExport = response.data
          callback({
            draw: data.draw, // Pass through draw counter
            recordsTotal: response.total, // Total records in your database
            recordsFiltered: response.total, // Filtered records count
            data: response.data, // The actual data array from your API
          });
        },
        error: function (error, xhr, status) {
          console.log(xhr, 'Failed to fetch data.')
          callback({
            draw: data.draw, // Pass through draw counter
            recordsTotal: 0, // Total records in your database
            recordsFiltered: 0, // Filtered records count
            data: [], // The actual data array from your API
          });
          $("#dataTable2 tbody").html(`
              <tr>
                <td colspan="11" class="text-center">Failed to fetch Data.</td>
              </tr>   
            `)
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
      // { data: 'email' },
      { data: 'invoice_number' },
      {
        data: null,
        render: function (data, type, row) {
          return formatMoney(parseFloat(row.amount_paid));
        }
      },
      // { data: 'sector' },
      { data: 'business_cat' },
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
          return `<a href="./viewinvoice.html?invnumber=${row.invoice_number}&load=true" class="btn btn-primary btn-sm viewUser">View Invoice</a>`;
        }
      },
    ],
  });

}

fetchInvoice()

function formatMoney(amount) {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'NGN', // Change this to your desired currency code
    minimumFractionDigits: 2,
  });
}

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
  a.download = "direct-assessment.csv";
  a.click();
}