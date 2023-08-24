// let HOST = "http://localhost:8080/primeGuage/php/index.php"
// let HOST = "https://steamledge.com/primeguage/php/index.php";
// let HOST = "http://localhost/primeguagenew/php/index.php";
let HOST = "https://useibs.com/php/index.php"

$(".aside").html(`
<div class="app-brand demo">
<div class="flex gap-x-2">
<div class="pt-2">
<a href="../index.html">
<img src="./assets/img/logo.png" class="w-[120px] -ml-2" alt="" />
</a>
</div>
  <div class="pt-3 -ml-4 w-full">
  <h5 class="text-[#005826] text-[16px]">Pay Zamfara</h5>
  <p class="text-[#005826] text-[12px] pt-2">Future of tax payment</p>
  </div>
  </div>
  <a href="javascript:void(0);" class="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
    <i class="bx bx-chevron-left bx-sm align-middle"></i>
  </a>
</div>


    <ul class="menu-inner">
      <!-- Dashboard -->
      <h4 class="menu-link pl-8 pt-5">MENU</h4>
      <li class="menu-item">
        <a href="index.html"  class="menu-link dass">
          <i class="menu-icon tf-icons bx bx-home-circle"></i>
          <div data-i18n="Analytics">Dashboard</div>
        </a>
      </li>
      <li class="menu-item">
        <a href="taxes.html" class="menu-link das">
          <i class='menu-icon tf-icons bx bx-buildings' ></i>
          <div data-i18n="Basic">My taxes</div>
        </a>
      </li>
      <li class="menu-item">
        <a href="invoice.html" class="menu-link dae">
          <i class='menu-icon tf-icons bx bxs-credit-card'></i>
          <div data-i18n="Basic">Invoice</div>
        </a>
      </li>
      <li class="menu-item">
        <a href="paymenthistory.html" class="menu-link mdp">
        <i class='menu-icon tf-icons bx bxs-group' ></i>
          <div data-i18n="Basic">Payment history</div>
        </a>
      </li>
      <li class="menu-item">
        <a href="eservice.html" class="menu-link mdd">
        <i class='menu-icon tf-icons bx bxs-group' ></i>
          <div data-i18n="Basic">E-Services</div>
        </a>
      </li>
      <li class="menu-item">
        <a href="profile.html" class="menu-link mdo">
        <i class='menu-icon tf-icons bx bxs-group' ></i>
          <div data-i18n="Basic">Profile</div>
        </a>
      </li>
      <h4 class="menu-link pl-8 mt-5">YOUR ACCOUNT</h4>
      <li class="menu-item">
        <a href="support.html"  class="menu-link daso">
          <i class="menu-icon tf-icons bx bx-home-circle"></i>
          <div data-i18n="Analytics">Help & Support</div>
        </a>
      </li>
      <li class="menu-item">
        <a href="" id="logout" class="menu-link">
          <i class='menu-icon tf-icons bx bx-buildings' ></i>
          <div data-i18n="Basic">Log Out</div>
        </a>
      </li>
    </ul>

`);
let userInfo2 = JSON.parse(window.localStorage.getItem("userDataPrime"));

$(".navi")
  .html(`<div class="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
<a class="nav-item nav-link px-0 me-xl-4" href="javascript:void(0)">
  <i class="bx bx-menu bx-sm"></i>
</a>
</div>

<div class="navbar-nav-right flex items-center justify-between" id="navbar-collapse">
<div class="">
<p class="text-sm text-black" id="datei">-</p>
<h1 class="md:text-[30px] text-[14px] text-[#151515] pt-2">Dashboard</h1>
</div>

                  <div class="mt-4 flex gap-x-5">
                
<a href="taxes.html" class="button ">
              <iconify-icon icon="ic:baseline-plus"></iconify-icon> Generate Invoice</a>
              
                <iconify-icon icon="mdi:bell-notification" data-bs-toggle="modal" data-bs-target="#notiModal" class="hidden md:flex cursor-pointer text-[#005826]" width="32" height="32"></iconify-icon>
                 
                  <div class="avatar avatar-online">
                    <img src="./assets/img/avatars/1.png" alt class="w-px-40 h-auto rounded-circle" />
                  </div>
                </div>
                  
</div>

`);

let profImg = document.querySelector(".avatar img")
if (profImg) {
  profImg.addEventListener("click", () => {
    window.location.href = "profile.html"
  })
}
async function fetchUserDetails2() {


  // console.log(userPrf.user)
  try {
    const response = await fetch(`${HOST}?userProfile&id=${userInfo2.id}`)
    const userPrf = await response.json()
    userDetails = userPrf.user
    if (profImg) {
      if (userInfo2.img === "") {
        profImg.src = "./assets/img/userprofile.png"
      } else {
        profImg.src = userPrf.user.img
      }
    }
    $("#theProfImg").attr("src", userPrf.user.img)
    $("#theProfImg2").attr("src", userPrf.user.img)
  } catch (error) {

    console.log(error)
  }

}

fetchUserDetails2()



$(".footer").html(`
<div class="flex justify-between">
<div class="flex items-center gap-x-3">
  <p class="text-[#1E1E1E] text-[16px]">Copyright 2023 Primegauge</p>
  <img src="../assets/img/logo1.png" width="50px" alt="">
</div>
<div class="flex items-center gap-x-3">
  <p class="text-[#1E1E1E] text-[16px] flex items-center gap-x-3"><iconify-icon icon="material-symbols:mail-outline-rounded" width="28" height="28"></iconify-icon> Info@primegauge.com</p>
<h4>|</h4>
  <p class="text-[#1E1E1E] text-[16px] flex items-center gap-x-3"><iconify-icon icon="ic:baseline-phone-android" width="28" height="28"></iconify-icon> 07007746348243 </p>
</div>
</div>
`);
const currentDate = new Date();
$("#datei").html(currentDate.toLocaleDateString());


$("#logout").on("click", function (e) {
  e.preventDefault();
  Swal.fire({
    title: 'Are you sure?',
    text: "You want to Logout",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes!'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        'Your Account have been successfully Logged out.',
        'success'
      )
      localStorage.removeItem('userDataPrime');
      window.location.href = "../index.html"
    }
  })

})

function Profile() {
  let userInfo = JSON.parse(window.localStorage.getItem("mdaDataPrime"));
  let allProf = document.querySelector("#profilead");
  if (allProf) {
    allProf.innerHTML = `
    <a class="dropdown-item" href="#" >
    <div class="d-flex">
      <div class="flex-shrink-0 me-3">
        <div class="avatar avatar-online">
          <img src="./assets/img/avatars/1.png" alt class="w-[40px] h-[40px] rounded-circle" />
        </div>
      </div>
      <div class="flex-grow-1">
        <span class="fw-semibold d-block">${userInfo && userInfo.name}</span>
        <small class="text-muted">Admin</small>
      </div>
    </div>
  </a>
        `;
  }

}

Profile();

async function getNotifications() {
  $("#notiModal .modal-body").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)
  try {
    const response = await fetch(`${HOST}?getActivityLogs&userId=${userInfo2.id}`)
    const data = await response.json()

    if (data.status === 0) {
      $("#notiModal .modal-body").html(`
        <div class="flex justify-center">
          <p>No new Notificatiion.</p>
        </div>
      `)

    } else {
      // <button class="text-[#005826] text-[12px] underline underline-offset-1">clear</button>
      $("#notiModal .modal-body").html(``)
      data.message.forEach((notification, i) => {
        $("#notiModal .modal-body").append(`
          <div class="flex justify-between">
            <p class="text-[16px]">${notification.comment}</p>
            <p class="text-sm text-gray-500">${notification.timeIn}</p>
          </div>
          <hr class="text-[#D7D7D7] my-3">
        `)
      });


    }

  } catch (error) {
    console.log(error)
  }

}
getNotifications()