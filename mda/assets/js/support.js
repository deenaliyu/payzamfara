let userDATA = JSON.parse(localStorage.getItem("mdaDataPrime"))

async function fetchInvoice() {

  $("#showThem").html("");
  $("#loader").css("display", "flex");

  const response = await fetch(
    `${HOST}?getSupportByMdaId&mda_id=${userDATA.mda_id}`
  );
  const userInvoices = await response.json();
  console.log(userInvoices);
  $("#loader").css("display", "none");
  if (userInvoices.status === 1) {

    userInvoices.message.reverse().forEach((userInvoice, i) => {
      let addd = ""
      addd += `
        <tr class="relative">
        <td>${i + 1}</td>
        <td>${userInvoice.fullname}</td>
        <td>${userInvoice.email}</td>
        <td>${userInvoice.subject}</td>
        <td>${userInvoice.ticket_number}</td>
        <td>${userInvoice.time_in}</td>
      `
      if (userInvoice.status === "answered") {
        addd += `
          <td id="" class="checking">
            <p class='text-success'>${userInvoice.status}</p>
          </td>
        `
      } else {
        addd += `
        <td id="" class="checking">
          <p class='text-danger'>${userInvoice.status}</p>
        </td>
        `
      }

      addd += `
        <td>
          <a href="./respondticket.html?id=${userInvoice.id}&ticket_number=${userInvoice.ticket_number}" class="btn btn-primary btn-sm viewUser" >View Ticket</a>
        </td>
        </tr>
      `
      $("#showThem").append(addd);
    });
  } else {
    // $("#showInvoice").html("<tr></tr>");
    $("#dataTable").DataTable();
  }
}

fetchInvoice().then((uu) => {
  $("#dataTable").DataTable();
});


async function fetchSupport2() {

  $("#showThem").html("");
  $("#loader").css("display", "flex");

  const response = await fetch(
    `${HOST}?getSupport`
  );
  const userInvoices = await response.json();
  // console.log(userInvoices);



  if (userInvoices.status === 1) {
    let allSuppprt = userInvoices.message.reverse().filter(uu => uu.user_id === "0" && uu.mda_id === userDATA.mda_id)

    if (allSuppprt.length === 0) {
      $("#dataTable2").DataTable();
    } else {
      allSuppprt.forEach((userInvoice, i) => {
        let addd = ""
        addd += `
          <tr class="relative">
          <td>${i + 1}</td>
          <td>${userInvoice.fullname}</td>
          <td>${userInvoice.email}</td>
          <td>${userInvoice.subject}</td>
          <td>${userInvoice.ticket_number}</td>
          <td>${userInvoice.time_in}</td>
        `
        if (userInvoice.status === "answered") {
          addd += `
            <td id="" class="checking">
              <p class='text-success'>${userInvoice.status}</p>
            </td>
          `
        } else {
          addd += `
          <td id="" class="checking">
            <p class='text-danger'>${userInvoice.status}</p>
          </td>
          `
        }

        addd += `
          <td>
            <a href="./viewticket.html?id=${userInvoice.id}&ticket_number=${userInvoice.ticket_number}" class="btn btn-primary btn-sm viewUser" >View Ticket</a>
          </td>
          </tr>
        `
        $("#showThem2").append(addd);
      });
    }


  } else {
    // $("#showInvoice").html("<tr></tr>");
    $("#dataTable2").DataTable();
  }
}
fetchSupport2()