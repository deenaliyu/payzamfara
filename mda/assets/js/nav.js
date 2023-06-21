// let HOST = "http://localhost:8080/primeGuage/php/index.php"
// let HOST = "https://steamledge.com/primeguage/php/index.php";
// let HOST = "http://localhost/primeguagenew/php/index.php";
let HOST = "https://useibs.com/php/index.php";


let MDAINFO = ""
let REVHEADS = null
async function fetchMDAs() {

  const response = await fetch(`${HOST}/?getMDAs`)
  const MDAs = await response.json()

  let USER_SESSION = localStorage.getItem("mdaDataPrime")
  finalUSER_SESSION = JSON.parse(USER_SESSION)
  let mdaID = finalUSER_SESSION.mda_id
  console.log(finalUSER_SESSION)

  if (MDAs.status === 0) {
  } else {
    MDAINFO = MDAs.message.filter(mda => mda.id === mdaID )[0]
    localStorage.setItem("MDAINFO", JSON.stringify(MDAINFO))
    // console.log(MDAINFO)
    $("#mdName").html(MDAINFO.fullname)
console.log(MDAINFO)
    const response = await fetch(`${HOST}/?getMDAsRevenueHeads&mdName=${MDAINFO.fullname}`)
    const REVHEAds = await response.json()

    REVHEADS = REVHEAds
    // console.log(REVHEADS)
    
  }
}

fetchMDAs()

let userDetails
async function fetchUserDetails() {
  const response = await fetch(`${HOST}?userProfileMda&id=${userDATA.id}`)
  const userPrf = await response.json()

  // console.log(userPrf.user)
  userDetails = userPrf.user

  $("#theProfImg").attr("src", userPrf.user.img)
  $("#theProfImg2").attr("src", userPrf.user.img)
  $("#theProfImg1").attr("src", userPrf.user.img)


}

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
      <h4 class="menu-link pl-8 pt-4 pb-2">MENU</h4>
      <li class="menu-item">
        <a href="index.html"  class="menu-link dass">
          
          <iconify-icon icon="material-symbols:dashboard-outline" class = "menu-icon tf-icons"></iconify-icon>
          <div data-i18n="Analytics"  class = "text-[2vh]">Dashboard</div>
        </a>
      </li>
      <li class="menu-item">
        <a href="Revenue.html" class="menu-link das">
          <iconify-icon icon="mdi:file-document-outline" class='menu-icon tf-icons'></iconify-icon>
          <div data-i18n="Basic"  class = "text-[2vh]">Revenue head</div>
        </a>
      </li>
      <li class="menu-item">
        <a href="payment.html" class="menu-link dae">
          <i class='menu-icon tf-icons bx bxs-credit-card'></i>
          <div data-i18n="Basic"  class = "text-[2vh]">Payment</div>
        </a>
      </li>
      <li class="menu-item">
                <a href="Report.html" class="menu-link menu-toggle dggg ">
                <iconify-icon icon="mdi:report-box" class="menu-icon"></iconify-icon>
                
                  <div data-i18n="Form Elements" class = " text-[2vh]">Reports</div>
                </a>
                <ul class="menu-sub ml-[5vh]">
                  <li class="menu-item my-0 py-0">
                    <a href="Report.html" class="menu-link my-0 dggg  text-[2vh]py-0">
                      <div data-i18n="Basic Inputs" class = " text-[2vh] my-0 py-0">Invoice</div>
                    </a>
                  </li>
                  <li class="menu-item my-0">
                    <a href="collectionreport.html" class="menu-link dggg text-[2vh]">
                      <div data-i18n="Input groups" class = " text-[2vh]">Collection report</div>
                    </a>
                  </li>
                </ul>
      </li>
      <li class="menu-item">
        <a href="Users.html" class="menu-link mdd">
        
        <iconify-icon icon="mdi:users-group" class = "menu-icon tf-icons"></iconify-icon>
          <div data-i18n="Basic"  class = "text-[2vh]">Users</div>
        </a>
      </li>
      <li class="menu-item">
        <a href="profile.html" class="menu-link mdo">
        
        <iconify-icon icon="mdi:user" class = "menu-icon tf-icons"></iconify-icon>
          <div data-i18n="Basic"  class = "text-[2vh]">Profile</div>
        </a>
      </li>
      <div class = "mt-[20vh]">
      <h4 class="menu-link pl-8 pt-4 pb-2">YOUR ACCOUNT</h4>
      <div class = " ml-4">
      <li class="menu-item">
        <a href="support.html"  class="menu-link daso">
          
          <iconify-icon icon="ic:baseline-help-outline" class = "menu-icon tf-icon "></iconify-icon>
          <div data-i18n="Analytics" class = "text-[2vh]">Help & Support</div>
        </a>
      </li>
      <li class="menu-item">
        <a href="" id="logout" class="menu-link">
          
          <iconify-icon icon="carbon:logout" class = "menu-icon tf-icons"></iconify-icon>
          <div data-i18n="Basic" class = "text-[2vh]">Log Out</div>
        </a>
      </li>

      </div>
      </div>
    </ul>

`);
let userInfo2 = JSON.parse(window.localStorage.getItem("mdaDataPrime"));

$(".navi")
  .html(`<div class="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
<a class="nav-item nav-link px-0 me-xl-4" href="javascript:void(0)">
  <i class="bx bx-menu bx-sm"></i>
</a>
</div>

<div class="navbar-nav-right flex items-center justify-between" id="navbar-collapse">
<div class="">
<p class="text-sm text-black" id="datei">-</p>
<h1 class="md:text-[26px] text-[18px] text-[#151515] pt-2 s">Dashboard</h1>
</div>

                  <div class="mt-4 flex gap-x-2">
                  <div class="input-group input-group-merge md:w-72 hidden md:flex ">
<span class="input-group-text rounded-2xl" id="basic-addon-search31"><i class="bx bx-search"></i></span>
<input type="text" class="form-control rounded-2xl " placeholder="Search..." aria-label="Search..."
  aria-describedby="basic-addon-search31">
</div>
</div>






<a href = "./cashpayment.html" class = "md:text-[2.2vh] text-[2vh] hover:text-white">

</a>              
<a class="mt-4 flex flex-row gap-2" href = "./profile.html">
                <div class="">
                <img src="./assets/img/userprofile.png"
                    alt
                    class="md:w-[5vh] w-10 h-auto rounded-circle"
                    id="theProfImg1"
                  />
                </div>
                  <p id="mdName"></p>
              </a>
                
                 

                
                  
</div>

`);


// <button class = "button mt-[3.2vh] md:py-0 py-2 w-[30vh] mx-3  md:w-[40vh]">
// Cash Payment
// </button>

let theURl = window.location.href
let splitted = theURl.split("/")
let theAtive = document.querySelector(`a[href^='${splitted[splitted.length - 1]}']`)
if (theAtive) {
  theAtive.parentElement.classList.add("active")
}

$("#logout").on("click", function (e) {
  e.preventDefault();
  localStorage.removeItem('mdaDataPrime');
  localStorage.removeItem('MDAINFO');
  window.location.href = "../signin.html"
})

let profImg = document.querySelector(".avatar img");
// console.log(userInfo2.img)
if (profImg) {
  if (userInfo2.img === "") {
    profImg.src = "./assets/img/userprofile.png";
  } else {
    profImg.src = userInfo2.img;
  }
}

$(".footer").html(`
<div class="flex justify-between flex-wrap md:flex-nowrap ">
<div class="flex items-center gap-x-3">
  <p class="text-[#1E1E1E] text-[2vh]">Copyright 2023 Primegauge</p>
  <img src="../assets/img/logo1.png" width="50px" alt="">
</div>
<div class="flex items-center gap-x-3">
  <p class="text-[#1E1E1E] text-[2vh] flex items-center gap-x-3"><iconify-icon icon="material-symbols:mail-outline-rounded" width="28" height="28"></iconify-icon> Info@primegauge.com</p>
<h4>|</h4>
  <p class="text-[#1E1E1E] text-[2vh] flex items-center gap-x-3"><iconify-icon icon="ic:baseline-phone-android" width="28" height="28"></iconify-icon> 0800 101 5555</p>
</div>
</div>
`);
const currentDate = new Date();
$("#datei").html(currentDate.toLocaleDateString());

$("#logout").on("click", function (e) {
  e.preventDefault();
  Swal.fire({
    title: "Are you sure?",
    text: "You want to Logout",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire("Your Account have been successfully Logged out.", "success");
      localStorage.removeItem("mdaDataPrime");
      window.location.href = "../index.html";
    }
  });
});

