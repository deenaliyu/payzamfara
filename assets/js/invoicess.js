let userDATA = JSON.parse(localStorage.getItem("userDataPrime"))

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

// fetchMDAs()

$("#paid").on('click', () => {
  var input, filter, table, tr, td, i;
  input = document.getElementById("paid");
  filter = input.value.toUpperCase();
  table = document.querySelector(".invoiceeTable");
  tr = table.querySelectorAll("tbody tr");
  for (var i = 0; i < tr.length; i++) {
    var tds = tr[i].getElementsByTagName("td");
    var flag = false;
    for (var j = 0; j < tds.length; j++) {
      var td = tds[j];
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        flag = true;
      }
    }
    if (flag) {
      tr[i].style.display = "";
    }
    else {
      tr[i].style.display = "none";
    }
  }
})

$("#unpaid").on('click', () => {
  var input, filter, table, tr, td, i;
  input = document.getElementById("unpaid");
  filter = input.value.toUpperCase();
  table = document.querySelector(".invoiceeTable");
  tr = table.querySelectorAll("tbody tr");
  for (var i = 0; i < tr.length; i++) {
    var tds = tr[i].getElementsByTagName("td");
    var flag = false;
    for (var j = 0; j < tds.length; j++) {
      var td = tds[j];
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        flag = true;
      }
    }
    if (flag) {
      tr[i].style.display = "";
    }
    else {
      tr[i].style.display = "none";
    }
  }
})



$("#getMDAs").on("change", function () {
  let theRev = $(this).val()
  fetchRevHeads(theRev)
  // console.log(theRev)
})

$("#generateInvoice").on("click", function () {
  $("#msg_box").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)
  $("#generateInvoice").addClass("hidden")
  let allRevs = document.querySelectorAll(".revHeadedds")
  let reven = ""
  allRevs.forEach(ddd => {
    if (ddd.checked) {
      reven += ddd.value + ","
    }
  })
  reven = reven.slice(0, -1);
  console.log(reven)

  $.ajax({
    type: "GET",
    url: `${HOST}?generateSingleInvoices&tax_number=${userDATA.tax_number}&revenue_head_id=${reven}`,
    dataType: 'json',
    // data: JSON.stringify(obj),
    success: function (data) {
      console.log(data)
      if (data.status === 2) {


      } else if (data.status === 1) {
        $("#msg_box").html(`
          <p class="text-success text-center mt-4 text-lg">${data.message}</p>
        `)
        $("#createMDA").removeClass("hidden")

        setTimeout(() => {
          $('#generateInvoice').modal('hide');
          window.location.reload()
        }, 1000);

      }
    },
    error: function (request, error) {
      $("#msg_box").html(`
        <p class="text-danger text-center mt-4 text-lg">An error occured !</p>
      `)
      $("#generateInvoice").removeClass("hidden")
      // console.log(error); .
    }
  });
})

async function fetchRevHeads(mdn) {
  const response = await fetch(`${HOST}/?getMDAsRevenueHeads&mdName=${mdn}`)
  const revHeads = await response.json()
  $("#listOfpayable").html("")

  if (revHeads.status === 0) {
  } else {
    revHeads.message.forEach((revHd, i) => {
      $("#listOfpayable").append(`
        <div class="form-check mb-2">
          <input class="form-check-input revHeadedds" type="checkbox" value="${revHd["id"]}" id="${revHd["COL_4"]}">
          <label class="form-check-label text-gray-700" for="${revHd["COL_4"]}">${revHd["COL_4"]}</label>
        </div>
      `)
    });

  }
}

async function fetchInvoices() {
  let userInfo = JSON.parse(window.localStorage.getItem("userDataPrime"));
  // console.log(userInfo.id);
  let userID = ""
  if (userInfo) {
    userID = userInfo.id;
  }
  $(".showInvoice").html("");
  $(".showInvoice2").html("");
  $("#loader").css("display", "flex");

  let config = {
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
    },
  };

  const response = await fetch(
    `${HOST}/php/index.php?userInvoices&payer_id=${userID}`
  );
  const userInvoices = await response.json();
  // console.log(userInvoices);
  $("#loader").css("display", "none");
  if (userInvoices.status === 1) {
    userInvoices.message.reverse().forEach((userInvoice, i) => {
      let addd = ""
      let invo = ""
      addd += `
      <tr class="relative">   

        <td>${userInvoice.tax_number}</td>
        <td>${userInvoice.invoice_number}</td>
        <td>${userInvoice.COL_4}</td>
        <td>${userInvoice.COL_6}</td>
        <td>${userInvoice.COL_6}</td>
        <td>${userInvoice.COL_6 - userInvoice.COL_6}</td>
        <td>${userInvoice["due_date"]}</td>
        <td>${userInvoice["due_date"]}</td>
        `
      if (userInvoice.payment_status === "paid") {
        addd += `
          <td id="" class="checking">
            <p class='text-success'>${userInvoice.payment_status}</p>
          </td>
          <td>
          <div class="flex gap-2 check-bt" id="">
            <a class="px-3 py-1 rounded-lg bgPrimary text-white diasbled" style="opacity: 0.5">Pay</a>
          </div>
          </td>
          `
        invo += `
          <tr class="relative">    
          <td>${userInvoice.tax_number}</td>
          <td>${userInvoice.invoice_number}</td>
          <td>${userInvoice.COL_4}</td>
          <td>${userInvoice.COL_6}</td>
          <td>${userInvoice["due_date"]}</td>
          <td>${userInvoice["due_date"]}</td>
          <td id="" class="checking">
            <p class='text-success'>${userInvoice.payment_status}</p>
          </td>
          <td>
          <div class="flex gap-2 check-bt" id="">
            <a class="px-3 py-1 rounded-lg bg-success text-white diasbled">view</a>
          </div>
          </td>
          </tr>
          `
      } else {
        addd += `
          <td id="" class="checking">
            <p class='text-danger'>${userInvoice.payment_status}</p>
          </td>
          <td>
            <div class="flex gap-2 check-bt" id="">
              <a href="../viewinvoice.html?invnumber=${userInvoice.invoice_number}&load=true" class="px-3 py-1 rounded-lg bgPrimary text-white block">Pay</a>
            </div>
          </td>
          `
      }
      addd += `
          
      </tr>
      `
      $("#showInvoice").append(addd);
      // showInvoice3
    });

    userInvoices.message.reverse().forEach((userInvoice, i) => {
      if (userInvoice.payment_status === "paid") {
        $("#showInvoice3").append(`
          <tr class="relative">    
            <td>${userInvoice.tax_number}</td>
            <td>${userInvoice.invoice_number}</td>
            <td>${userInvoice.COL_4}</td>
            <td>${userInvoice.COL_6}</td>
            <td>${userInvoice["due_date"]}</td>
            <td>${userInvoice["due_date"]}</td>
            <td id="" class="checking">
              <p class='text-success'>${userInvoice.payment_status}</p>
            </td>
          </tr>
        `)
      }
    })


  } else {
    // $(".showInvoice").html("<tr></tr>");
    $(".dataTable").DataTable();
  }
}

fetchInvoices().then((uu) => {
  $(".dataTable").DataTable();
});