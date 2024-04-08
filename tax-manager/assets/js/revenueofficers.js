let USERINFO = JSON.parse(window.localStorage.getItem("taxManagerDataPrime"));

function formatMoney(amount) {
  return parseFloat(amount).toLocaleString('en-US', {
    style: 'currency',
    currency: 'NGN', // Change this to your desired currency code
    minimumFractionDigits: 2,
  });
}

let ALLMDA = ""

async function fetchTsxOfficers() {
  $("#showreport").html("")
  $("#loader").css("display", "flex")

  const response = await fetch(`${HOST}/?getAllTaxOffices`)
  const taxPayers = await response.json()

  ALLMDA = taxPayers
  // console.log(taxPayers)

  $("#loader").css("display", "none")

  if (taxPayers.status === 0) {

  } else {
    taxPayers.message.reverse().forEach((taxPayer, i) => {

      $("#showTheList").append(`
          <tr>
            <td>${i + 1}</td>
            <td>${taxPayer.office_name}</td>
            <td>${taxPayer.number_of_invoices}</td>
            <td>${formatMoney(taxPayer.value_of_invoices)}</td>
            <td>${taxPayer.time_in.split(' '[0])}</td>
            <td>${taxPayer.number_of_invoices_paid}</td>
            <td>${formatMoney(taxPayer.value_of_invoices_paid)}</td>
            <td>${taxPayer.status === "approved" ? '<span class="badge bg-primary">Active</span>' : '<span class="badge bg-warning">Pending</span>'}</td>
            <td>
              <div>
                <button data-bs-toggle="modal" data-bs-target="#editRev" data-userid="${taxPayer.id}" onclick="editMdaFunc(this)"><iconify-icon class="cursor-pointer" icon="fa6-regular:pen-to-square"></iconify-icon></button>
              </div>
            </td>
          </tr>
        `)

    });

  }

}

fetchTsxOfficers().then(ee => {
  $("#dataTable").DataTable();
})

$("#createTaxOfficers").on("click", () => {

  $("#msg_box").html(`
      <div class="flex justify-center items-center mt-4">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    `)
  $("#createTaxOfficers").addClass("hidden")

  let allInputs = document.querySelectorAll(".taxInput")
  let obj = {
    endpoint: "createTaxOfficers",
    data: {
      tax_office_id: USERINFO.id
    }
  }
  allInputs.forEach(allInput => {
    obj.data[allInput.dataset.name] = allInput.value
  })
  console.log(obj)

  $.ajax({
    type: "POST",
    url: HOST,
    dataType: 'json',
    data: JSON.stringify(obj),
    success: function (data) {
      console.log(data)
      if (data.status === 2) {
        $("#msg_box").html(`
          <p class="text-warning text-center mt-4 text-lg">${data.message}</p>
        `)
        $("#createTaxOfficers").removeClass("hidden")

      } else if (data.status === 1) {
        $("#msg_box").html(`
            <p class="text-success text-center mt-4 text-lg">${data.message}</p>
          `)
        $("#createTaxOfficers").removeClass("hidden")
        setTimeout(() => {
          $('#createTaxOfficers').modal('hide');
          window.location.reload()
        }, 1000);

      }
    },
    error: function (request, error) {
      $("#msg_box").html(`
          <p class="text-danger text-center mt-4 text-lg">An error occured !</p>
        `)
      $("#createTaxOfficers").removeClass("hidden")
      console.log(error);
    }
  });

})

function editMdaFunc(e) {
  let editaID = e.dataset.userid
  sessionStorage.setItem("taxUpdateOff", editaID)

  let theMDA = ALLMDA.message.filter(dd => dd.id === editaID)[0]

  // console.log(theMDA)
  let allInputss = document.querySelectorAll(".taxInput3")

  allInputss.forEach((inpu) => {
    let ddset = inpu.dataset.name
    inpu.value = theMDA[ddset]
  })
}

$("#updateTaxOfficer").on("click", () => {

  let theMdaId = sessionStorage.getItem("taxUpdateOff")

  $("#msg_box2").html(`
      <div class="flex justify-center items-center mt-4">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    `)
  $("#updateTaxOfficer").addClass("hidden")

  let allInputs = document.querySelectorAll(".taxInput3")
  let obj = {
    endpoint: "updateTaxOfficer",
    data: {
      "id": theMdaId
    }
  }
  allInputs.forEach(allInput => {
    obj.data[allInput.dataset.name] = allInput.value
  })
  console.log(obj)

  $.ajax({
    type: "POST",
    url: HOST,
    dataType: 'json',
    data: JSON.stringify(obj),
    success: function (data) {
      console.log(data)
      if (data.status === 2) {
        $("#msg_box2").html(`
            <p class="text-warning text-center mt-4 text-lg">${data.message}</p>
          `)
        $("#updateTaxOfficer").removeClass("hidden")

      } else if (data.status === 1) {
        $("#msg_box2").html(`
            <p class="text-success text-center mt-4 text-lg">${data.message}</p>
          `)
        $("#updateTaxOfficer").removeClass("hidden")
        setTimeout(() => {
          $('#updateTaxOfficer').modal('hide');
          window.location.reload()
        }, 1000);

      }
    },
    error: function (request, error) {
      $("#msg_box2").html(`
          <p class="text-danger text-center mt-4 text-lg">An error occured !</p>
        `)
      $("#updateTaxOfficer").removeClass("hidden")
      console.log(error);
    }
  });

})