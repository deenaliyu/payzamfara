async function fetchInvoice() {

  $("#showThem").html("");
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
    `${HOST}?getSupport`
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
            <a href="./complain.html?id=${userInvoice.id}&ticket_number=${userInvoice.ticket_number}" class="btn btn-primary btn-sm viewUser" >View Ticket</a>
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