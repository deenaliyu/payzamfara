let USER_SESSION = localStorage.getItem("MDAINFO")
  finalUSER_SESSION = JSON.parse(USER_SESSION)
  let mdaID = finalUSER_SESSION.fullname

async function fetchInvoice() {

  $("#showThem").html("");
  $("#loader").css("display", "flex");

  const response = await fetch(
    `${HOST}/php/index.php?AllInvoices`
  );
  const userInvoices = await response.json();
  console.log(userInvoices);
  $("#loader").css("display", "none");
  if (userInvoices.status === 1) {
    let theMDAInv = userInvoices.message.filter(inv => inv.COL_3 === mdaID)

    theMDAInv.forEach((userInvoice, i) => {
      $("#showInvoices").append(`
        <tr>
          <td>${i + 1}</td>
          <td>${userInvoice.invoice_number}</td>
          <td>${userInvoice.first_name} ${userInvoice.surname}</td>
          <td>${userInvoice.COL_4}</td>
          <td>N${userInvoice.COL_6}</td>
          <td>${userInvoice.first_name} ${userInvoice.surname}</td>
          <td>${userInvoice.time_in.split(" ")[0]}</td>
        </tr>
      `);
    });
  } else {
    // $("#showInvoice").html("<tr></tr>");
    $("#dataTable").DataTable();
  }
}

fetchInvoice().then((uu) => {
  $("#dataTable").DataTable();
});


function exportData() {
  /* Get the HTML data using Element by Id */
  var table = document.querySelector(".invTable");

  /* Declaring array variable */
  var rows = [];

  //iterate through rows of table
  for (var i = 0, row; row = table.rows[i]; i++) {
    //rows would be accessed using the "row" variable assigned in the for loop
    //Get each cell value/column from the row
    column1 = row.cells[0].innerText;
    column2 = row.cells[1].innerText;
    column3 = row.cells[2].innerText;
    column4 = row.cells[3].innerText;
    column5 = row.cells[4].innerText;
    column6 = row.cells[5].innerText;
    column7 = row.cells[6].innerText;

    /* add a new records in the array */
    rows.push(
      [
        column1,
        column2,
        column3,
        column4,
        column5,
        column6,
        column7,
      ]
    );

  }
  csvContent = "data:text/csv;charset=utf-8,";
  /* add the column delimiter as comma(,) and each row splitted by new line character (\n) */
  rows.forEach(function (rowArray) {
    row = rowArray.join(",");
    csvContent += row + "\r\n";
  });

  /* create a hidden <a> DOM node and set its download attribute */
  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "Invoice.csv");
  document.body.appendChild(link);
  /* download the data file named "Stock_Price_Report.csv" */
  link.click();
}