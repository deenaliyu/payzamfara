let userDATA = JSON.parse(localStorage.getItem("adminDataPrime"))



if (userDATA) {
  $("#mdass").html(`
    <div class="form-group">
    <label for="defaultSelect" class="form-label">MDA</label>
      <select name="" id="getMDAs" class="form-select">
        <option disabled selected>--- Select MDA ---</option>
      </select>
      </div>
  `)
  $("#the_rev").html(`
    <div class="form-group">
    <label for="defaultSelect" class="form-label">Revenue Head</label>
      <select name="" id="listOfpayable" class="form-select">
        <option disabled selected>--- Select RevHead ---</option>
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
    revHeads.message.forEach((revHd, i) => {
      $("#listOfpayable").append(`
      <option value="${revHd["id"]}" id="${revHd["COL_4"]}" >${revHd["COL_4"]}</option>
      `)
    });

  }
}


$("#filterMda").on('click',  () => {
    var input, filter, table, tr, td, i;
    input = document.getElementById("getMDAs");
    filter = input.value.toUpperCase();
    table = document.querySelector("table");
    tr = table.getElementsByTagName("tr");
    for (var i = 0; i < tr.length; i++) {
      var tds = tr[i].getElementsByTagName("td");
      var flag = false;
      for(var j = 0; j < tds.length; j++){
        var td = tds[j];
        if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
          flag = true;
        } 
      }
      if(flag){
          tr[i].style.display = "";
      }
      else {
          tr[i].style.display = "none";
      }
    }
    $('#filterInvoice').modal('hide');
})
