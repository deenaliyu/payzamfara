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
  const response = await fetch(`${HOST}?getAllTaxFiling`);
  const userInvoices = await response.json();
  console.log(userInvoices);
  $("#totalInv").html(userInvoices.message.length);
  $("#loader").css("display", "none");
  if (userInvoices.status === 1) {
    userInvoices.message.reverse().forEach((userInvoice, i) => {
      let addd = "";
      addd += `
        <tr class="relative">
        <td>${userInvoice.created_at}</td>
        <td>${userInvoice.due_date}</td>
        <td>${userInvoice.tax_filling_refrence}</td>
        <td>${userInvoice.category}</td>
        <td>${userInvoice.tax_to_file}</td>
            `;
      if (userInvoice.application_status === "approved") {
        addd += `
              <td id="" class="checking">
                <p class='text-success'>${userInvoice.application_status}</p>
              </td>
              
              `;
      } else {
        addd += `
              <td id="" class="checking">
                <p class='text-danger'>${userInvoice.application_status}</p>
              </td>
              `;
      }

      addd += `
          <td>
            <a href="viewtaxfilling.html?id=${userInvoice.id}&load=true" target="_blank" class="btn btn-primary btn-sm viewUser" >View</a>
          </td>
          </tr>
          `;
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


async function fetchTinRequest() {
    $("#showTin").html("");
    $("#loader2").css("display", "flex");
  
    let config = {
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
      },
    };
    const response = await fetch(`${HOST}?getAllTinRequest`);
    const tin = await response.json();
    console.log(tin);
    $("#loader2").css("display", "none");
    if (tin.status === 1) {
        tin.message.reverse().forEach((tins, i) => {
        let addd = "";
        addd += `
          <tr class="relative">
          <td>${tins.created_at}</td>
          <td>${tins.reference_number}</td>
              `;
        if (tins.application_status === "approved") {
          addd += `
                <td id="" class="checking">
                  <p class='text-success'>${tins.application_status}</p>
                </td>
                
                `;
        } else {
          addd += `
                <td id="" class="checking">
                  <p class='text-danger'>${tins.application_status}</p>
                </td>
                `;
        }
  
        addd += `
            <td>
              <a href="viewtinrequest.html?id=${tins.id}&load=true" target="_blank" class="btn btn-primary btn-sm viewUser" >View</a>
            </td>
            </tr>
            `;
        $("#showTin").append(addd);
      });
    } else {
      // $("#showInvoice").html("<tr></tr>");
      $("#dataTable2").DataTable();
    }
  }
  
  fetchTinRequest().then((uu) => {
    $("#dataTable2").DataTable();
  });




  async function fetchTaxClearance() {
    $("#showcert").html("");
    $("#loader3").css("display", "flex");
  
    let config = {
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
      },
    };
    const response = await fetch(`${HOST}?getTaxClearanceCert`);
    const tin = await response.json();
    console.log(tin);
    $("#loader3").css("display", "none");
    if (tin.status === 1) {
        tin.message.reverse().forEach((tins, i) => {
        let addd = "";
        addd += `
          <tr class="relative">
          <td>${tins.created_at}</td>
          <td>${tins.reference_number}</td>
          <td>${tins.category}</td>
              `;
        if (tins.application_status === "approved") {
          addd += `
                <td id="" class="checking">
                  <p class='text-success'>${tins.application_status}</p>
                </td>
                
                `;
        } else {
          addd += `
                <td id="" class="checking">
                  <p class='text-danger'>${tins.application_status}</p>
                </td>
                `;
        }
  
        addd += `
            <td>
              <a href="viewtaxclearance.html?id=${tins.id}&load=true" target="_blank" class="btn btn-primary btn-sm viewUser" >View</a>
            </td>
            `;

            if (tins.application_status === "approved") {
              addd += `
                    <td>
                    <a href="viewtaxclearancecert.html?reference=${tins.reference_number}&load=true" target="_blank" class="text-[#005826]">Preview</a>
                    </td>
                    
                    `;
            } else  {
              addd += `
                    <td>
                    <a href="" class="text-[#005826]" style="pointer-events: none; opacity:0.2">Preview</a>
                    </td>
                    </tr>
                    `;
            }
        $("#showcert").append(addd);
      });
    } else {
      // $("#showInvoice").html("<tr></tr>");
      $("#dataTable3").DataTable();
    }
  }
  
  fetchTaxClearance().then((uu) => {
    $("#dataTable3").DataTable();
  });