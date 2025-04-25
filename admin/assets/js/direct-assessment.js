function formatMoney(amount) {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'NGN', // Change this to your desired currency code
    minimumFractionDigits: 2,
  });
}

let AllDemanData = {}
let dataToExport;

async function fetchInvoice() {
  if ($.fn.DataTable.isDataTable('#dataTable2')) {
    $('#dataTable2').DataTable().clear().destroy();
  }

  table2 = $('#dataTable2').DataTable({
    processing: true, // Show processing indicator
    serverSide: true, // Enable server-side processing
    paging: true,     // Enable pagination
    searching: false,  // Enable search box
    pageLength: 50,   // Number of items per page
    ajax: function (data, callback, settings) {
      // Convert DataTables page number to your API page number
      const pageNumber = Math.ceil(data.start / data.length) + 1;

      const filters = {
        getAllDirectAssessmentss: true,
      };

      // Call your API with the calculated page number
      $.ajax({
        url: HOST,
        type: 'GET',
        data: filters,
        success: function (response) {
          // Map the API response to DataTables expected format
          callback({
            draw: data.draw, // Pass through draw counter
            recordsTotal: response.data.total_records, // Total records in your database
            recordsFiltered: response.data.total_records, // Filtered records count
            data: response.data.direct_assessments, // The actual data array from your API
          });
        },
        error: function (error) {
          console.log(error, 'Failed to fetch data.')
          // alert('Failed to fetch data.');
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
      { data: 'fullname' },
      {
        data: 'level',
        render: function (data, type, row) {
          return getStatusBadge(data);
        }
      },
      {
        data: null,
        render: function (data, type, row) {
          return formatMoney(parseFloat(row.annual_gross_income));
        }
      },
      {
        data: null,
        render: function (data, type, row) {
          return formatMoney(parseFloat(row.consolidated_relief));
        }
      },
      {
        data: null,
        render: function (data, type, row) {
          return formatMoney(parseFloat(row.chargeable_income));
        }
      },
      {
        data: null,
        render: function (data, type, row) {
          return formatMoney(parseFloat(row.monthly_tax_payable));
        }
      },

      {
        data: null,
        render: function (data, type, row) {
          return formatMoney(parseFloat(row.monthly_tax_payable * 12));
        }
      },
      { data: 'created_date' },

    ],
  });

}
fetchInvoice()


async function fetchForSpecificLevels(level) {
  if ($.fn.DataTable.isDataTable('#dataTable3')) {
    $('#dataTable3').DataTable().clear().destroy();
  }

  table3 = $('#dataTable3').DataTable({
    processing: true, // Show processing indicator
    serverSide: true, // Enable server-side processing
    paging: true,     // Enable pagination
    searching: false,  // Enable search box
    pageLength: 50,   // Number of items per page
    ajax: function (data, callback, settings) {
      // Convert DataTables page number to your API page number
      const pageNumber = Math.ceil(data.start / data.length) + 1;

      const filters = {
        getAllDirectAssessmentss: true,
        level: level, // Add the selected level as a filter
      };

      // Call your API with the calculated page number
      $.ajax({
        url: HOST,
        type: 'GET',
        data: filters,
        success: function (response) {
          // Filter the data based on the selected level
          const filteredData = response.data.direct_assessments.filter(item => item.level === level);

          // Map the API response to DataTables expected format
          callback({
            draw: data.draw, // Pass through draw counter
            recordsTotal: filteredData.length, // Total records after filtering
            recordsFiltered: filteredData.length, // Filtered records count
            data: filteredData, // The filtered data array
          });
        },
        error: function (error) {
          console.log(error, 'Failed to fetch data.');
          callback({
            draw: data.draw, // Pass through draw counter
            recordsTotal: 0, // Total records in your database
            recordsFiltered: 0, // Filtered records count
            data: [], // The actual data array from your API
          });
          $("#dataTable3 tbody").html(`
              <tr>
                <td colspan="11" class="text-center">Failed to fetch Data.</td>
              </tr>   
            `);
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
      { data: 'fullname' },
      {
        data: 'level',
        render: function (data, type, row) {
          return getStatusBadge(data);
        }
      },
      {
        data: null,
        render: function (data, type, row) {
          return formatMoney(parseFloat(row.annual_gross_income));
        }
      },
      {
        data: null,
        render: function (data, type, row) {
          return formatMoney(parseFloat(row.consolidated_relief));
        }
      },
      {
        data: null,
        render: function (data, type, row) {
          return formatMoney(parseFloat(row.chargeable_income));
        }
      },
      {
        data: null,
        render: function (data, type, row) {
          return formatMoney(parseFloat(row.monthly_tax_payable));
        }
      },
      {
        data: null,
        render: function (data, type, row) {
          return formatMoney(parseFloat(row.monthly_tax_payable * 12));
        }
      },
      { data: 'created_date' },
      {
        data: null,
        render: function (data, type, row) {
          return `
            <a href="direct-assessmentview.html?id=${row.id}&level=${level.split("")[0]}" class="btn btn-primary btn-sm">View</a>
          `;
        },
      },
    ],
  });
}

$(document).ready(function () {
  $(".levels-navo").each(function () {
    $(this).on("click", function () {
      const level = $(this).data("note"); // Get the desired level text from data-note attribute
      fetchForSpecificLevels(level); // Call the function with the selected level
    });
  });
});

// Example usage: Call this function with the desired level
// fetchForSpecificLevels('First reviewer');
// fetchForSpecificLevels('Second reviewer');
// fetchForSpecificLevels('Approval');
// fetchForSpecificLevels('Disapproved');


function getStatusBadge(status) {
  const statusClass = {
    'First reviewer': 'bg-warning',
    'Second reviewer': 'bg-warning',
    'Third reviewer': 'bg-warning',
    'Approval': 'bg-success',
    'Disapproved': 'bg-danger',
  }[status] || 'bg-secondary';

  return `<span class="badge ${statusClass} rounded-pill">${status === 'Approval' ? 'Approved' : status}</span>`;
}

$("#filterDemand").on('click', function () {
  $("#filterInvoice").modal('hide')
  fetchInvoice()
})

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
      `${HOST}?getDashboardAnalyticsDirect`
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
  a.download = "direct-assessment.csv";
  a.click();
}

function clearfilter3() {
  $('#sectorFil').val('')
  $('#invnumberInput').val('')
  $('#paymentStatusSelect').val('')
  $('#fromDateInput').val('')
  $('#toDateInput').val('')

  $('#filterInvoice').modal('hide')
  fetchInvoice()
}