let urlParams = new URLSearchParams(window.location.search);
const ticket_number = urlParams.get('ticket_number')
const ticketId = urlParams.get('id')

$("#ticketNumb").html(ticket_number)

async function fetchTicket() {

  const response = await fetch(`${HOST}?getSupportById&id=${ticketId}`);
  const userInvoices = await response.json();

  console.log(userInvoices)
  if (userInvoices.status === 1) {
    $("#ticketInfo").html(`
      <div class="border-b border-gray-300 p-1 mb-2" >
        <p class="font-bold text-[#000] text-base">Full Name</p>
        <p class="text-base">${userInvoices.message.email}</p>
      </div>    

      <div class="border-b border-gray-300 p-1 mb-2" >
        <p class="font-bold text-[#000] text-base">User ID</p>
        <p class="text-base">${userInvoices.message.enum_id}</p>
      </div>    

      <div class="border-b border-gray-300 p-1 mb-2" >
        <p class="font-bold text-[#000] text-base">Email Address</p>
        <p class="text-base">${userInvoices.message.fullname}</p>
      </div>    

      <div class="border-b border-gray-300 p-1 mb-2" >
        <p class="font-bold text-[#000] text-base">Category</p>
        <p class="text-base">${userInvoices.message.category}</p>
      </div>    

      <div class="border-b border-gray-300 p-1 mb-2" >
        <p class="font-bold text-[#000] text-base">Subject</p>
        <p class="text-base">${userInvoices.message.subject}</p>
      </div>    

      <div class="border-b border-gray-300 p-1 mb-2" >
        <p class="font-bold text-[#000] text-base">Message</p>
        <p class="text-base">${userInvoices.message.content}</p>
      </div>   
      
      <div id="convoMgs"></div>
    `)



  } else {

  }
}

fetchTicket().then(msg => {
  getConvo()
})

async function getConvo() {
  try {
    const response = await fetch(`${HOST}?getChat&ticket_number=${ticket_number}`);
    const userMessages = await response.json();

    if (userMessages.status === 0) {

      $("#convoMgs").html(`
        <div class="border-b border-gray-300 p-1 mb-2" >
          <p class="font-bold text-[#000] text-base">Conversations </p>
          <p class="text-base">No conversation yet.</p>
        </div>   
      `)

    } else {
      let aa = `
        <div class="border-b border-gray-300 p-1 mb-2" >
          <p class="font-bold text-[#000] text-base">Conversations <span class="cursor-pointer" onclick='getConvo()'><iconify-icon icon="solar:refresh-linear"></iconify-icon></span></p>
          <div class="conversation-container">
      `



      userMessages.message.forEach(message => {
        if (message.type_of_user === "user") {
          aa += `
            <div class="flex justify-end">
              <div class="message sent">
                <div class="content">${message.content}</div>
                <div class="timestamp">${message.time_in}</div>
              </div>
            </div>
          `

        } else {
          aa += `
            <div class="flex justify-start">
              <div class="message received">
                <div class="content">${message.content}</div>
                <div class="timestamp">${message.time_in}</div>
              </div>
            </div>
          `
        }

      });

      aa += `
          </div>
        </div>   
      `
      $("#convoMgs").html(aa)

    }

  } catch (error) {
    console.error(error);
  }
}

$(".send-button").on("click", function () {

  let theMsg = document.querySelector(".message-input").value

  $(".send-button").html("Sending...")

  if (theMsg === "") {
    alert("cannot be empty !")
    $(".send-button").html("Send")
  } else {

    let dataToSend = {
      "endpoint": "chat",
      "data": {
        "ticket_number": ticket_number,
        "content": theMsg,
        "type_of_user": "user"
      }
    }
    async function sendMsg() {
      try {
        const response = await fetch(HOST, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(dataToSend)
        });

        const userMessage = await response.json();
        $(".send-button").html("Send")

        if (userMessage.status === 1) {
          theMsg.value === ""
          getConvo()

        } else {
          alert("can't send your message, try again.")
          $(".send-button").html("Send")
        }

      } catch (error) {
        console.error(error); // Handle any errors that occur during the async operation
        $(".send-button").html("Send")
        alert("can't send your message, try again.")
      }
    }
    sendMsg()
  }
})