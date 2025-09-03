let userDATA = JSON.parse(localStorage.getItem("adminDataPrime"))


if (userDATA) {
  $("#mdass").html(`
    <div class="form-group">
    <label for="defaultSelect" class="form-label">MDA</label>
      <select name="" id="getMDAs" class="form-select filterInputs" data-name="mda_id">
        <option selected value="">All</option>
      </select>
    </div>
  `)
  $("#the_rev").html(`
    <div class="form-group">
    <label for="defaultSelect" class="form-label">Revenue Head</label>
      <select name="" id="listOfpayable" class="form-select filterInputs" data-name="revenue_head">
        <option selected value="">All</option>
      </select>
    </div>
  `)

  $("#payment_channel").html(`
    <div class="form-group">
    <label for="defaultSelect" class="form-label">Payment Channel</label>
      <select name="" id="listOfchannel" class="form-select filterInputs" data-name="payment_channel">
        <option selected value="">All</option>
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
       $("#getMDAs").html(`
       <option value="">All</option>
      `)
    MDAs.message.forEach((MDA, i) => {
      $("#getMDAs").append(`
        <option value="${MDA.fullname}">${MDA.fullname}</option>
      `)
    });

  }
}

fetchMDAs()

async function fetchRevHeads(mdn) {
  const response = await fetch(`${HOST}/?getAllRevenueHeads`)
  const revHeads = await response.json()
    
    console.log(revHeads)
  if (revHeads.status === 0) {

  } else {
    $("#listOfpayable").html(`
       <option selected value="">All</option>
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


// DEMAND NOTICE FILTER

let urlPatho = window.location.href
if(urlPatho.includes('demandnotice')) {
    async function fetchRevHeadsAll() {
        const response = await fetch(`${HOST}/?getAllRevenueHeads`)
        const revHeads = await response.json()
    
        if (revHeads.status === 0) {
    
        } else {
            $("#listOfpayable").html(`
                <option selected value="">All</option>
            `)
            revHeads.message.forEach((revHd, i) => {
                $("#listOfpayable").append(`
                    <option value="${revHd["id"]}" id="${revHd["COL_4"]}" >${revHd["COL_4"]}</option>
                `)
            });
        }
    }
    
    fetchRevHeadsAll()
}

$("#filterDemand").on('click', () => {
  const selectedOffice = document.getElementById('getOffice').value;
  const selRevv = document.getElementById('listOfpayable');
  let selectedRevenueHead = selRevv.options[selRevv.selectedIndex].text;

  const selectedPaymentStatus = document.getElementById('paymentStatusSelect').value;
  const fromDate = document.getElementById('fromDateInput').value;
  const toDate = document.getElementById('toDateInput').value;
    
  if(selectedRevenueHead === "All") {
      selectedRevenueHead = ""
  }    
//   console.log(selectedRevenueHead, selectedMda)

    function normalizeDate(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    } 

  const filteredData = AllDemanData.filter(item => {
    const itemDate = normalizeDate(new Date(item.date_created));
    const from = fromDate ? normalizeDate(new Date(fromDate)) : null;
    const to = toDate ? normalizeDate(new Date(toDate)) : null;
      
    return (
        (!selectedOffice || removeDoubleSpaces(item.office_name.toLowerCase()).includes(removeDoubleSpaces(selectedOffice.toLowerCase()))) &&
        (!selectedRevenueHead || removeDoubleSpaces(item.COL_4.toLowerCase()).includes(removeDoubleSpaces(selectedRevenueHead.toLowerCase()))) &&
        (!selectedPaymentStatus || item.payment_status.toLowerCase() === selectedPaymentStatus.toLowerCase()) &&
        (!from || itemDate >= from) &&
        (!to || itemDate <= to)
    )
    
  });

  // console.log(selectedRevenueHead.toLowerCase() )
  // console.log(filteredData)

  $("#dataTable").DataTable().clear().draw()
  $("#dataTable").DataTable().destroy()
  $("#showThem2").html('')
  displayData(filteredData)

  $("#dataTable").DataTable()
  $("#filterInvoice").modal("hide")
})

function clearfilter3() {
  $("#dataTable").DataTable().clear().draw()
  $("#dataTable").DataTable().destroy()
  $("#showThem2").html('')


  displayData(AllDemanData)

  $("#dataTable").DataTable()
  $("#filterInvoice").modal("hide")

  const selectedMda = document.getElementById('getOffice').value = "";
  const selRevv = document.getElementById('listOfpayable').value = "";

  const selectedPaymentStatus = document.getElementById('paymentStatusSelect').value = "";
  const fromDate = document.getElementById('fromDateInput').value = "";
  const toDate = document.getElementById('toDateInput').value = "";

  $("#listOfpayable").html(`
  <option selected value="">All</option>
  `)
  $("#listOfchannel").append(`
  <option selected value="">All</option>
  `)
}


