const urlParams = new URLSearchParams(window.location.search);
const userIdo = urlParams.get('id');

async function fetchTinSingle() {
   
    $("#loader").css("display", "flex");
    let config = {
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
      },
    };
    const response = await fetch(`${HOST}?getTinRequestById&id=${userIdo}`);
    const tinRequest = await response.json();
    $("#loader").css("display", "none");
    if (tinRequest.status === 1) {
        tinRequest.message.reverse().forEach((tinRequests, i) => {
        $("#maili").html(`
        <div class="form-group mb-2 md:w-[320px] w-full mt-2">
        <label>Reference Number <span class="text-[red]">*</span></label>
        <input class="form-control mt-1 regInputs" required data-name="subject"
          placeholder="${tinRequests.reference_number}" type="text" />
      </div>
    <hr class="mt-3">
    <div class="flex gap-x-5 pt-3 md:flex-nowrap sm:flex-wrap">
        <div class="form-group mb-2 md:w-[320px] w-full">
          <label>Email<span class="text-[red]">*</span></label>
          <input class="form-control mt-1 email" required data-name="email" type="text"
            placeholder="${tinRequests.email}" value="${tinRequests.email}"/>
        </div>

        <div class="form-group mb-2 md:w-[320px] w-full">
          <label>Phone Number <span class="text-[red]">*</span></label>
          <input class="form-control mt-1 regInputs"
          placeholder="${tinRequests.phone_number_1}"  type="text" minlength="11" maxlength="11" />
        </div>
      </div>
      <div class="form-group mb-2 md:w-[320px] w-full mt-2">
        <label>Subject <span class="text-[red]">*</span></label>
        <input class="form-control mt-1"
          placeholder="TIN Request" type="text" />
      </div>
      <div class="form-group mb-2 md:w-[320px] w-full mt-2">
        <label>Message <span class="text-[red]">*</span></label>
        <textarea class="form-control mt-1 message" required 
          placeholder=""></textarea>
      </div>
              `);
      });
    } 
  }
  
  fetchTinSingle().then((uu) => {
    $("#submitmail").on("click", (e) => {

  let email = document.querySelector('.email').value;
  let message = document.querySelector('.message').value;
        e.preventDefault()
        $("#msg_box").html(`
          <div class="flex justify-center items-center mt-4">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
          </div>
        `)
      
        $("#submitmail").addClass("hidden")
      
        $.ajax({
          type: "GET",
          url: `${HOST}/?MailTinRequest&email=${email}&message=${message}`,
          dataType: 'json',
          success: function (data) {
            if (data.status === 2) {
              $("#msg_box4").html(`
                <p class="text-warning text-center mt-4 text-lg">${data.message}</p>
              `)
              $("#submitmail").removeClass("hidden")
      
            } else if (data.status === 1) {
              $("#msg_box").html(`
                <p class="text-success text-center mt-4 text-lg">Approved Successfully</p>
              `)
              setTimeout(() => {
                window.location.href = "./tinrequestmail.html"
              }, 1000);
      
            } else if (data.status === 0) {
              $("#msg_box").html(`
                <p class="text-warning text-center mt-4 text-base">${data.message}</p>
              `)
              $("#submitmail").removeClass("hidden")
            }
          },
          error: function (request, error) {
            console.log(error);
            $("#msg_box").html(`
              <p class="text-danger text-center mt-4 text-lg">Something went wrong try again !</p>
            `)
            $("#submitmail").removeClass("hidden")
          }
        });
      
      })
      

  });