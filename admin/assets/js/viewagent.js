const urlPatho = new URLSearchParams(window.location.search)
const agentId = urlPatho.get("id")

async function getEnumerators() {
  try {
    const response = await fetch(`${HOST}?getEnumUser`)
    const data = await response.json()
    const enumerator = data.message.filter(user => user.id === agentId)

    if (enumerator) {
      const user = enumerator[0]
      console.log(user)
      $("#enumId").text(user.agent_id)
      $("#thenameOfAgent").text(user.fullname)

      let userInputs = document.querySelectorAll(".userInputs")
      userInputs.forEach(usrInpt => {
        let theVal = user[usrInpt.dataset.name]
        if (theVal) {
          usrInpt.value = theVal
        }
      })

      // Populate state and LGA¥
      const lgaSelect = document.querySelector("#LGAs2");

      if (lgaSelect) {
        console.log(user)
        lgaSelect.value = user.lga || "";
      }
    } else {
      console.log("No enumerator found with the given ID.")
    }
  } catch (error) {
    console.log(error)
  }
}

getEnumerators()

function updateUser() {
  $("#theButton").addClass("hidden")
  $("#msg_box").html(`
      <div class="flex justify-center items-center mb-4">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    `)

  let EnumData = {
    "endpoint": "updateEnumUser",
    "data": {
      "id": agentId
    }
  }

  let allInputs = document.querySelectorAll(".userInputs")
  allInputs.forEach((inputt, i) => {
    EnumData.data[inputt.dataset.name] = inputt.value
  })

  // console.log(EnumData)

  async function sendToDB() {
    try {
      const response = await fetch(HOST, {
        method: "POST",
        body: JSON.stringify(EnumData),
        headers: {
          "Content-Type": "application/json"
        }
      })
      const data = await response.json()

      if (data.status === 1) {
        $("#theButton").addClass("hidden")
        // nextPrev(1)
        Swal.fire({
          icon: 'success',
          title: 'Complete',
          text: 'User account has been updated successfully',
          confirmButtonColor: '#005826',
          confirmButtonText: 'Close',
          showConfirmButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            // window.location.href = ""
            window.location.reload()
          }
        })

      } else {
        $("#theButton").removeClass("hidden")
        $("#msg_box").html(`
          <p class="text-warning text-center text-lg">${data.message}</p>
        `)
      }


    } catch (error) {
      console.log(error)
      $("#theButton").removeClass("hidden")
      $("#msg_box").html(`
          <p class="text-danger text-center text-lg">Something went wrong ! try again.</p>
        `)
    }
  }
  sendToDB()
}