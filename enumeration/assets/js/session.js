let USER_SESSION = localStorage.getItem("adminDataPrime")
console.log(USER_SESSION)
let finalUSER_SESSION = ""
let USERID = ""

if (USER_SESSION) {
  finalUSER_SESSION = JSON.parse(USER_SESSION)
  finalUSER_SESSION.id

} else {

  Swal.fire({
    title: "<h5 style='color:red;font-size:50px'> opps! </h5>",
    text: "It looks like you need to log in to view this page. Please sign in to your account to continue or create an account if you don't have one yet.",
    icon: 'warning',
    iconColor: '#ff0000',
    confirmButtonColor: '#125826',
    confirmButtonText: 'Proceed to signin',
    allowOutsideClick: false
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "../signin.html"
    }
  })


}