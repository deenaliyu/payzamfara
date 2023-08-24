let userDATA = JSON.parse(localStorage.getItem("enumDataPrime"))


async function getSupport() {
  const response = await fetch(`${HOST}/php/index.php?getSupportByEnumId&id=${userDATA.id}`);
  const supportss = await response.json();

  console.log(supportss)
  if (supportss.status === 1) {

    supportss.message.reverse().forEach((suprt, i) => {
      let theSprt = ""
      theSprt += `
        <tr class="relative">
          <td>${i + 1}</td>
          <td>${suprt.ticket_number}</td>
          <td>${suprt.subject}</td>
          <td>${suprt.time_in.split(" ")[0]}</td>
        `
      if (suprt.status === "pending") {
        theSprt +=
          `  
          <td class="text-danger">${suprt.status}</td>
        <`
      } else {

        theSprt +=
          `  
          <td class="text-success">${suprt.status}</td>
        `
      }

      theSprt +=
        `  
          <td class="text-success"><a href="viewticket.html?ticket_number=${suprt.ticket_number}&id=${suprt.id}" class="btn btn-primary">View</a></td>

          </tr>
        `

      $("#theSupport").append(theSprt)

    });


  } else {

  }
}

getSupport().then((uu) => {
  $("#dataTable").DataTable();
});
