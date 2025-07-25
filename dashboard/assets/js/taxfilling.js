async function getTaxFiling() {
  let userDATA = JSON.parse(localStorage.getItem("userDataPrime"))

  if (userDATA) {
    try {
      const response = await fetch(`${HOST}?getTaxFilingByUser&id=${userDATA.id}`)
      const data = await response.json()

      $("#eservicesTable").html("")
      if (data.status === 0) {
        $("#eservicesTable").html(`
          <tr>
            <td colspan="5" class="text-center">No Taxfilling records found.</td>
          </tr>
        `)
      } else {
        data.message.forEach(element => {
          $("#eservicesTable").append(`
          <tr>
            <td>${element.created_at.split(" ")[0]}</td>
            <td>${element.created_at.split(" ")[0]}</td>
            <td>${element.tax_filling_refrence}</td>
            <td>${element.tax_to_file}</td>
            <td><span class="badge bg-${element.application_status === "pending" ? 'warning' : 'success'}">${element.application_status}</span></td>
          </tr>
        `)
        });

      }


    } catch (error) {
      console.log(error)
      $("#eservicesTable").html(`
          <tr>
            <td colspan="5" class="text-center">Cannot fetch Taxfilling records.</td>
          </tr>
        `)
    }
  }

}

getTaxFiling()