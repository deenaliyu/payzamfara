let userDATA = JSON.parse(localStorage.getItem("MDAINFO"))
console.log(userDATA.fullname)

if (userDATA) {
  $("#the_rev").html(`
    <div class="form-group">
    <label for="defaultSelect" class="form-label">Revenue Head</label>
      <select name="" id="listOfpayable" class="form-select">
        <option selected value="">All</option>
      </select>
      </div>
  `)

  $("#payment_channel").html(`
    <div class="form-group">
    <label for="defaultSelect" class="form-label">Payment Channel</label>
      <select name="" id="listOfchannel" class="form-select">
        <option selected value="">All</option>
      </select>
      </div>
  `)


  
} else {

}



async function fetchRevHeads() {
  const response = await fetch(`${HOST}/?getMDAsRevenueHeads&mdName=${userDATA.fullname}`)
  const revHeads = await response.json()
  console.log(revHeads)

  if (revHeads.status === 0) {

  } else {
    $("#listOfpayable").html(`
        <option value="">All</option>
      `)
    revHeads.message.forEach((revHd, i) => {
      $("#listOfpayable").append(`
      <option value="${revHd["id"]}" id="${revHd["COL_4"]}" >${revHd["COL_4"]}</option>
      `)
    });

  }
}

fetchRevHeads()


async function fetchPayment() {
  let config = {
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*"
    }
  }
  const response = await fetch(`${HOST}/?getPaymentChannel`)
  const MDAs = await response.json()


  if (MDAs.status === 0) {
  } else {
    MDAs.message.forEach((MDA, i) => {
      $("#listOfchannel").append(`
        <option value="${MDA.payment_channel}">${MDA.payment_channel}</option>
      `)
    });

  }
}

fetchPayment()

function removeDoubleSpaces(inputText) {
  return inputText.replace(/ {2,}/g, ' ');
}


$("#filterMda").on('click', () => {
  const selRevv = document.getElementById('listOfpayable');
  const selectedRevenueHead = selRevv.options[selRevv.selectedIndex].text;

  const selectedPaymentStatus = document.getElementById('paymentStatusSelect').value;
  const fromDate = document.getElementById('fromDateInput').value;
  const toDate = document.getElementById('toDateInput').value;

  // console.log(selectedMda, selectedRevenueHead)

  const filteredData = AllInvoiceData.filter(item =>
    (!selectedRevenueHead || removeDoubleSpaces(item.COL_4.toLowerCase()).includes(removeDoubleSpaces(selectedRevenueHead.toLowerCase()))) &&
    (!selectedPaymentStatus || item.payment_status.toLowerCase() === selectedPaymentStatus.toLowerCase()) &&
    (!fromDate || item.date_created >= fromDate) &&
    (!toDate || item.date_created <= toDate)
  );

  // console.log(selectedRevenueHead.toLowerCase() )
  // console.log(filteredData)

  $("#dataTable").DataTable().clear().draw()
  $("#dataTable").DataTable().destroy()
  $("#showThem2").html('')
  displayData(filteredData.reverse())

  $("#dataTable").DataTable()
  $("#filterInvoice").modal("hide")
})

function clearfilter() {
  $("#dataTable").DataTable().clear().draw()
  $("#dataTable").DataTable().destroy()
  $("#showThem2").html('')


  displayData(AllInvoiceData.reverse())

  $("#dataTable").DataTable()
  $("#filterInvoice").modal("hide")

  const selRevv = document.getElementById('listOfpayable').value = "";

  const selectedPaymentStatus = document.getElementById('paymentStatusSelect').value = "";
  const fromDate = document.getElementById('fromDateInput').value = "";
  const toDate = document.getElementById('toDateInput').value = "";

  $("#getMDAs").append(`
  <option selected value="">All</option>
`)
  $("#listOfpayable").append(`
  <option selected value="">All</option>
  `)
  $("#listOfchannel").append(`
  <option selected value="">All</option>
  `)
}

$("#filterMda2").on('click', () => {
  const selRevv = document.getElementById('listOfpayable');
  const selectedRevenueHead = selRevv.options[selRevv.selectedIndex].text;
  const payment = document.getElementById('listOfchannel').value;
  const fromDate = document.getElementById('fromDateInput').value;
  const toDate = document.getElementById('toDateInput').value;


  const filteredData = AllInvoiceData.filter(item =>
    (!selectedRevenueHead || removeDoubleSpaces(item.COL_4.toLowerCase()).includes(removeDoubleSpaces(selectedRevenueHead.toLowerCase()))) &&
    (!payment || removeDoubleSpaces(item.payment_channel.toLowerCase()).includes(removeDoubleSpaces(payment.toLowerCase()))) &&
    (!fromDate || item.timeIn >= fromDate) &&
    (!toDate || item.timeIn <= toDate)
  );


  $("#dataTable").DataTable().clear().draw()
  $("#dataTable").DataTable().destroy()
  $("#showThem2").html('')
  displayData(filteredData.reverse())

  $("#dataTable").DataTable()
  $("#filterInvoice").modal("hide")
})


function clearfilter2() {
  $("#dataTable").DataTable().clear().draw()
  $("#dataTable").DataTable().destroy()
  $("#showThem2").html('')

  displayData(AllInvoiceData.reverse())

  $("#dataTable").DataTable()
  $("#filterInvoice").modal("hide")

  const selRevv = document.getElementById('listOfpayable').value = ""
  const payment = document.getElementById('listOfchannel').value = ""
  const fromDate = document.getElementById('fromDateInput').value = ""
  const toDate = document.getElementById('toDateInput').value = ""

  $("#getMDAs").append(`
  <option selected value="">All</option>
`)
  $("#listOfpayable").append(`
  <option selected value="">All</option>
  `)
  $("#listOfchannel").append(`
  <option selected value="">All</option>
  `)

}


