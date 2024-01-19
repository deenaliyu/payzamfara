let userDATA = JSON.parse(localStorage.getItem("adminDataPrime"))


if (userDATA) {
  $("#mdass").html(`
    <div class="form-group">
    <label for="defaultSelect" class="form-label">MDA</label>
      <select name="" id="getMDAs" class="form-select">
        <option selected value="">--- Select MDA ---</option>
      </select>
      </div>
  `)
  $("#the_rev").html(`
    <div class="form-group">
    <label for="defaultSelect" class="form-label">Revenue Head</label>
      <select name="" id="listOfpayable" class="form-select">
        <option selected value=""></option>
      </select>
      </div>
  `)

} else {
 
}

async function fetchMDAs() {
  let config = {
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*"
    }
  }
  const response = await fetch(`${HOST}/?getMDAs`)
  const MDAs = await response.json()


  if (MDAs.status === 0) {
  } else {
    MDAs.message.forEach((MDA, i) => {
      $("#getMDAs").append(`
        <option value="${MDA.fullname}">${MDA.fullname}</option>
      `)
    });

  }
}

fetchMDAs()

$("#getMDAs").on("change", function () {
  let theRev = $(this).val()
  fetchRevHeads(theRev)
  // console.log(theRev)
})

async function fetchRevHeads(mdn) {
  const response = await fetch(`${HOST}/?getMDAsRevenueHeads&mdName=${mdn}`)
  const revHeads = await response.json()

  if (revHeads.status === 0) {

  } else {
      $("#listOfpayable").html(`
        <option value=""></option>
      `)
    revHeads.message.forEach((revHd, i) => {
      $("#listOfpayable").append(`
      <option value="${revHd["id"]}" id="${revHd["COL_4"]}" >${revHd["COL_4"]}</option>
      `)
    });

  }
}

function removeDoubleSpaces(inputText) {
    return inputText.replace(/ {2,}/g, ' ');
}


$("#filterMda").on('click',  () => {
    const selectedMda = document.getElementById('getMDAs').value;
    const selRevv  = document.getElementById('listOfpayable');
    const selectedRevenueHead = selRevv.options[selRevv.selectedIndex].text;
    
    const selectedPaymentStatus = document.getElementById('paymentStatusSelect').value;
    const fromDate = document.getElementById('fromDateInput').value;
    const toDate = document.getElementById('toDateInput').value;
    
    // console.log(selectedMda, selectedRevenueHead)
    
    const filteredData = AllInvoiceData.filter(item => 
    (!selectedMda || removeDoubleSpaces(item.COL_3.toLowerCase()).includes(removeDoubleSpaces(selectedMda.toLowerCase()))) &&
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
    
    const selectedMda = document.getElementById('getMDAs').value = "";
    const selRevv  = document.getElementById('listOfpayable').value = "";
    
    const selectedPaymentStatus = document.getElementById('paymentStatusSelect').value = "";
    const fromDate = document.getElementById('fromDateInput').value = "";
    const toDate = document.getElementById('toDateInput').value = "";
    
    
}

$("#filterMda2").on('click',  () => {
    const selectedMda = document.getElementById('getMDAs').value;
    const selRevv  = document.getElementById('listOfpayable');
    const selectedRevenueHead = selRevv.options[selRevv.selectedIndex].text;
    
    const fromDate = document.getElementById('fromDateInput').value;
    const toDate = document.getElementById('toDateInput').value;
    
    console.log(selectedMda, selectedRevenueHead)
    
    const filteredData = AllInvoiceData.filter(item => 
    (!selectedMda || removeDoubleSpaces(item.mda_id.toLowerCase()).includes(removeDoubleSpaces(selectedMda.toLowerCase()))) &&
    (!selectedRevenueHead || removeDoubleSpaces(item.COL_4.toLowerCase()).includes(removeDoubleSpaces(selectedRevenueHead.toLowerCase()))) &&
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
    
    const selectedMda = document.getElementById('getMDAs').value = ""
    const selRevv  = document.getElementById('listOfpayable').value = ""
    
    const fromDate = document.getElementById('fromDateInput').value = ""
    const toDate = document.getElementById('toDateInput').value = ""
    
}


