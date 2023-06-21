let btn = document.querySelector('#send')

btn.addEventListener('click', e => {
  e.preventDefault();

  let fname = document.querySelector('#fname').value;
  let mail = document.querySelector('#email').value;
  let subject = document.querySelector('#subject').value;
  let message = document.querySelector('#message').value;

  btn.disabled = true
  btn.innerHTML = "Sending...."
  async function sendMail() {

    try {
      let response = await fetch(`http://localhost/tekmateDynamic/php/?sendMail&fullname=${fname}&email=${mail}&subject=${subject}&message=${message}`);
      let data = await response.json();
      console.log(data);

      btn.disabled = false
      btn.innerHTML = "Send"
      Swal.fire({
        title: 'Success',
        text: "Your Message has been sent successfully!",
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: '#6266FF',
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload()
        }
      })
    } catch (error) {
      btn.innerHTML = "Send"
      btn.disabled = false
      Swal.fire({
        title: 'Ooops..',
        text: "There's an error sending message. please try again!",
        icon: 'error',
        showCancelButton: false,
        confirmButtonText: 'Retry!',
        confirmButtonColor: '#6266FF',
      }).then((result) => {
        if (result.isConfirmed) {
          
          Swal.DismissReason.esc
        }
      })
    }


  }
  sendMail()
})



