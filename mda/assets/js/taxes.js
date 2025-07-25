let userInfo = JSON.parse(localStorage.getItem("userDataPrime"))

async function getTaxes() {
  const response = await fetch(`${HOST}?getAllRevenueHeads`)
  const revenueHeads = await response.json()

  // console.log(revenueHeads)

  let ii = 0
  revenueHeads.message.forEach((revenuehead, i) => {
    // if (revenuehead.COL_5 === userInfo.category) {
    //   ii++
    //   $("#showTaxes").append(`
    //     <tr>
    //       <td>${ii}</td>
    //       <td>${revenuehead["COL_4"]}</td>
    //       <td>Monthly</td>
    //       <td>${revenuehead["COL_6"]}</td>
    //       <td><button class="button text-sm" onclick="generateInv(${revenuehead.id})">Generate Invoice</button></td>
    //     </tr>
    //   `)
    // }
  });

  revenueHeads.message.forEach((revenuehead, i) => {
    $("#showAllTaxes").append(`
      <tr>
        <td>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="">
          </div>
        </td>
        <td>${revenuehead["COL_3"]}</td>
        <td>${revenuehead["COL_4"]}</td>
        <td>GENERAL</td>
        <td>${revenuehead["COL_5"]}</td>
        <td>Yes</td>
        <td>One-off</td>
        <td>${revenuehead["COL_6"]}</td>
      </tr>
    `)
  })

}

getTaxes().then(res => {
  $("#dataTable").DataTable();
  $("#dataTable2").DataTable();
})

function generateInv(revid) {
  let taxNumber = userInfo.tax_number

  Swal.fire({
    title: 'Generating Invoice',
    icon: 'info',
    backdrop: true,
    allowOutsideClick: false,
    showCancelButton: true,
    confirmButtonText: 'Generate Invoice',
    showLoaderOnConfirm: true,
    preConfirm: async () => {
      try {
        const response = await fetch(`${HOST}?generateSingleInvoices&tax_number=${taxNumber}&revenue_head_id=${revid}`)
        if (!response.ok) {
          throw new Error(response.statusText)
        }
        return await response.json()
      } catch (error) {
        Swal.showValidationMessage(
          `Request failed: ${error}`
        )
      }
    },
    allowOutsideClick: () => !Swal.isLoading()
  }).then((result) => {
    console.log(result.value)
    if (result.isConfirmed) {
      Swal.fire({
        icon: "success",
        title: `Invoice Generated successfully !`,
        confirmButtonText: 'Open Invoice',
      }).then((result3) => {
        if (result.isConfirmed) {
          window.location.href = `../viewinvoice.html?invnumber=${result.value.invoice_number}&load=true`
        }
      })
    }
  })

  // $.ajax({
  //   type: "GET",
  //   url: `${HOST}?generateSingleInvoices&tax_number=${taxNumber}&revenue_head_id=${revid}`,
  //   dataType: 'json',
  //   success: function (data) {
  //     console.log(data)
  //     if (data.status === 2) {


  //     } else if (data.status === 1) {
  //       $("#generating_inv").removeClass("hidden")

  //       $("#msg_box").html(``)
  //       Swal.fire({
  //         title: 'Generated',
  //         text: "Invoice has been generated successfully, Invoice details will be sent to your email and phone number!",
  //         icon: 'success',
  //         confirmButtonColor: '#3085d6',
  //         cancelButtonColor: '#3085d6',
  //         confirmButtonText: 'Open Invoice',
  //         allowOutsideClick: false
  //       }).then((result) => {
  //         if (result.isConfirmed) {
  //           nextPrev(1)
  //           openInvoice(data.invoice_number)
  //           // window.location.href = `invoice.html?invnum=${data.invoice_number}`
  //         }
  //       })


  //     }
  //   },
  //   error: function (request, error) {
  //     $("#msg_box").html(`
  //         <p class="text-danger text-center mt-4 text-lg">Something went wrong</p>
  //       `)
  //     $("#generateInvoice").removeClass("hidden")
  //     console.log(error);
  //   }
  // });
}