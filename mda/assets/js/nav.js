// let HOST = "http://localhost:8080/primeGuage/php/index.php"
// let HOST = "https://steamledge.com/primeguage/php/index.php";
// let HOST = "http://localhost/primeguagenew/php/index.php";
let HOST = "https://useibs.com/php/index.php";
let userInfo2 = JSON.parse(window.localStorage.getItem("mdaDataPrime"));

let MDAINFO = ""
let REVHEADS = null

async function fetchMDAs() {

  try {
    const response = await fetch(`${HOST}/?getMDAById&id=${userInfo2.mda_id}`)
    const MDAs = await response.json()

    // console.log(MDAs)


    if (MDAs.status === 0) {
    } else {
      localStorage.setItem("MDAINFO", JSON.stringify(MDAs.message))
      // console.log(MDAINFO)
      $("#mdName").html(MDAs.message.fullname)

      // console.log(MDAINFO)
      const response = await fetch(`${HOST}/?getMDAsRevenueHeads&mdName=${MDAs.message.fullname}`)
      const REVHEAds = await response.json()

      REVHEADS = REVHEAds
      // console.log(REVHEADS)

    }
  } catch (error) {
    console.log(error)
  }

}

fetchMDAs()

let userInf = JSON.parse(window.localStorage.getItem("MDAINFO"));

let payment = userInf.allow_payment;
let create_user = userInf.user_creation

if (payment === "yes") {
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
        <a href="dashboard.html"  class="menu-link dass">
          
          <iconify-icon icon="material-symbols:dashboard-outline" class = "menu-icon tf-icons"></iconify-icon>
          <div data-i18n="Analytics"  class = "text-[2vh]">Dashboard</div>
        </a>
      </li>
      <li class="menu-item">
        <a href="revenue.html" class="menu-link das">
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
                <a href="report.html" class="menu-link menu-toggle dggg ">
                <iconify-icon icon="mdi:report-box" class="menu-icon"></iconify-icon>
                
                  <div data-i18n="Form Elements" class = " text-[2vh]">Reports</div>
                </a>
                <ul class="menu-sub ml-[5vh]">
                  <li class="menu-item my-0 py-0">
                    <a href="report.html" class="menu-link my-0 dggg  text-[2vh]py-0">
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
      <a href="offices.html" class="menu-link mdn">
      
      <iconify-icon icon="mdi:users-group" class = "menu-icon tf-icons"></iconify-icon>
        <div data-i18n="Basic"  class = "text-[2vh]">Offices</div>
      </a>
    </li>
      <li class="menu-item">
        <a href="users.html" class="menu-link mdd">
        
        <iconify-icon icon="mdi:users-group" class = "menu-icon tf-icons"></iconify-icon>
          <div data-i18n="Basic"  class = "text-[2vh]">User Management</div>
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
} else if (payment === "no") {
  $(".aside").html(`
  <div class="app-brand demo">
  <div class="flex gap-x-2">
    <a href="dashboard.html">
      <img src="./assets/img/logo.png" class="w-[70px] -ml-2" alt="" />
    </a>
    <div class="pt-3">
    <h5 class="text-[#FFFFFF] text-[16px]">Primegauge IBS</h5>
    <p class="text-[#727283] text-[12px] pt-2">Future of tax payment</p>
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
      <a href="dashboard.html"  class="menu-link dass">
        
        <iconify-icon icon="material-symbols:dashboard-outline" class = "menu-icon tf-icons"></iconify-icon>
        <div data-i18n="Analytics"  class = "text-[2vh]">Dashboard</div>
      </a>
    </li>
    <li class="menu-item">
      <a href="revenue.html" class="menu-link das">
        <iconify-icon icon="mdi:file-document-outline" class='menu-icon tf-icons'></iconify-icon>
        <div data-i18n="Basic"  class = "text-[2vh]">Revenue head</div>
      </a>
    </li>
    <li class="menu-item">
              <a href="report.html" class="menu-link menu-toggle dggg ">
              <iconify-icon icon="mdi:report-box" class="menu-icon"></iconify-icon>
              
                <div data-i18n="Form Elements" class = " text-[2vh]">Reports</div>
              </a>
              <ul class="menu-sub ml-[5vh]">
                <li class="menu-item my-0 py-0">
                  <a href="report.html" class="menu-link my-0 dggg  text-[2vh]py-0">
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
    <a href="offices.html" class="menu-link mdn">
    
    <iconify-icon icon="mdi:users-group" class = "menu-icon tf-icons"></iconify-icon>
      <div data-i18n="Basic"  class = "text-[2vh]">Offices</div>
    </a>
  </li>
    <li class="menu-item">
      <a href="users.html" class="menu-link mdd">
      
      <iconify-icon icon="mdi:users-group" class = "menu-icon tf-icons"></iconify-icon>
        <div data-i18n="Basic"  class = "text-[2vh]">User Management</div>
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
} else if (create_user === "yes") {
  $(".aside").html(`
  <div class="app-brand demo">
  <div class="flex gap-x-2">
    <a href="dashboard.html">
      <img src="./assets/img/logo.png" class="w-[70px] -ml-2" alt="" />
    </a>
    <div class="pt-3">
    <h5 class="text-[#FFFFFF] text-[16px]">Primegauge IBS</h5>
    <p class="text-[#727283] text-[12px] pt-2">Future of tax payment</p>
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
      <a href="dashboard.html"  class="menu-link dass">
        
        <iconify-icon icon="material-symbols:dashboard-outline" class = "menu-icon tf-icons"></iconify-icon>
        <div data-i18n="Analytics"  class = "text-[2vh]">Dashboard</div>
      </a>
    </li>
    <li class="menu-item">
      <a href="revenue.html" class="menu-link das">
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
              <a href="report.html" class="menu-link menu-toggle dggg ">
              <iconify-icon icon="mdi:report-box" class="menu-icon"></iconify-icon>
              
                <div data-i18n="Form Elements" class = " text-[2vh]">Reports</div>
              </a>
              <ul class="menu-sub ml-[5vh]">
                <li class="menu-item my-0 py-0">
                  <a href="report.html" class="menu-link my-0 dggg  text-[2vh]py-0">
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
    <a href="offices.html" class="menu-link mdn">
    
    <iconify-icon icon="mdi:users-group" class = "menu-icon tf-icons"></iconify-icon>
      <div data-i18n="Basic"  class = "text-[2vh]">Offices</div>
    </a>
  </li>
    <li class="menu-item">
      <a href="users.html" class="menu-link mdd">
      
      <iconify-icon icon="mdi:users-group" class = "menu-icon tf-icons"></iconify-icon>
        <div data-i18n="Basic"  class = "text-[2vh]">User Management</div>
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
} else {
  $(".aside").html(`
    <div class="app-brand demo">
    <div class="flex gap-x-2">
      <a href="dashboard.html">
        <img src="./assets/img/logo.png" class="w-[70px] -ml-2" alt="" />
      </a>
      <div class="pt-3">
      <h5 class="text-[#FFFFFF] text-[16px]">Primegauge IBS</h5>
      <p class="text-[#727283] text-[12px] pt-2">Future of tax payment</p>
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
        <a href="dashboard.html"  class="menu-link dass">
          
          <iconify-icon icon="material-symbols:dashboard-outline" class = "menu-icon tf-icons"></iconify-icon>
          <div data-i18n="Analytics"  class = "text-[2vh]">Dashboard</div>
        </a>
      </li>
      <li class="menu-item">
        <a href="revenue.html" class="menu-link das">
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
                <a href="report.html" class="menu-link menu-toggle dggg ">
                <iconify-icon icon="mdi:report-box" class="menu-icon"></iconify-icon>
                
                  <div data-i18n="Form Elements" class = " text-[2vh]">Reports</div>
                </a>
                <ul class="menu-sub ml-[5vh]">
                  <li class="menu-item my-0 py-0">
                    <a href="report.html" class="menu-link my-0 dggg  text-[2vh]py-0">
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
        <a href="users.html" class="menu-link mdd">
        
        <iconify-icon icon="mdi:users-group" class = "menu-icon tf-icons"></iconify-icon>
          <div data-i18n="Basic"  class = "text-[2vh]">User Management</div>
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
}


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
<div class="flex justify-between">
<div class="flex items-center gap-x-3">
  <p class="text-[#1E1E1E] text-[2vh]">Copyright 2023 Primegauge</p>
  <img src="../assets/img/logo1.png" width="50px" alt="">
</div>
<div class="flex items-center gap-x-3">
  <p class="text-[#1E1E1E] text-[2vh] flex items-center gap-x-3"><iconify-icon icon="material-symbols:mail-outline-rounded" width="28" height="28"></iconify-icon> Info@primegauge.com</p>
<h4>|</h4>
  <p class="text-[#1E1E1E] text-[2vh] flex items-center gap-x-3"><iconify-icon icon="ic:baseline-phone-android" width="28" height="28"></iconify-icon> 07007746348243 </p>
</div>
</div>
`);
const currentDate = new Date();
$("#datei").html(currentDate.toLocaleDateString());

let logoutTimeout;

function startLogoutTimer() {
    // Set the timeout to 10 minutes (600,000 milliseconds)
    logoutTimeout = setTimeout(logout, 600000);
}

function resetLogoutTimer() {
    clearTimeout(logoutTimeout);
    startLogoutTimer();
}

function logout() {
  localStorage.removeItem("adminDataPrime");
    // alert('You have been logged out due to inactivity.');
    window.location.href = "./index.html";
}

// Attach event listeners to reset the logout timer on user activity
document.addEventListener('mousemove', resetLogoutTimer);
document.addEventListener('keydown', resetLogoutTimer);

// Start the logout timer when the page loads
startLogoutTimer();


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
      window.location.href = "./index.html";
    }
  });
});

let lgaList2 = {
  Abia: [
    "Aba North",
    "Aba South",
    "Arochukwu",
    "Bende",
    "Ikwuano",
    "Isiala Ngwa North",
    "Isiala Ngwa South",
    "Isuikwuato",
    "Obi Ngwa",
    "Ohafia",
    "Osisioma",
    "Ugwunagbo",
    "Ukwa East",
    "Ukwa West",
    "Umuahia North",
    "muahia South",
    "Umu Nneochi"
  ],
  Adamawa: [
    "Demsa",
    "Fufure",
    "Ganye",
    "Gayuk",
    "Gombi",
    "Grie",
    "Hong",
    "Jada",
    "Larmurde",
    "Madagali",
    "Maiha",
    "Mayo Belwa",
    "Michika",
    "Mubi North",
    "Mubi South",
    "Numan",
    "Shelleng",
    "Song",
    "Toungo",
    "Yola North",
    "Yola South"
  ],
  AkwaIbom: [
    "Abak",
    "Eastern Obolo",
    "Eket",
    "Esit Eket",
    "Essien Udim",
    "Etim Ekpo",
    "Etinan",
    "Ibeno",
    "Ibesikpo Asutan",
    "Ibiono-Ibom",
    "Ika",
    "Ikono",
    "Ikot Abasi",
    "Ikot Ekpene",
    "Ini",
    "Itu",
    "Mbo",
    "Mkpat-Enin",
    "Nsit-Atai",
    "Nsit-Ibom",
    "Nsit-Ubium",
    "Obot Akara",
    "Okobo",
    "Onna",
    "Oron",
    "Oruk Anam",
    "Udung-Uko",
    "Ukanafun",
    "Uruan",
    "Urue-Offong Oruko",
    "Uyo"
  ],
  Anambra: [
    "Aguata",
    "Anambra East",
    "Anambra West",
    "Anaocha",
    "Awka North",
    "Awka South",
    "Ayamelum",
    "Dunukofia",
    "Ekwusigo",
    "Idemili North",
    "Idemili South",
    "Ihiala",
    "Njikoka",
    "Nnewi North",
    "Nnewi South",
    "Ogbaru",
    "Onitsha North",
    "Onitsha South",
    "Orumba North",
    "Orumba South",
    "Oyi"
  ],

  Bauchi: [
    "Alkaleri",
    "Bauchi",
    "Bogoro",
    "Damban",
    "Darazo",
    "Dass",
    "Gamawa",
    "Ganjuwa",
    "Giade",
    "Itas-Gadau",
    "Jama are",
    "Katagum",
    "Kirfi",
    "Misau",
    "Ningi",
    "Shira",
    "Tafawa Balewa",
    " Toro",
    " Warji",
    " Zaki"
  ],

  Bayelsa: [
    "Brass",
    "Ekeremor",
    "Kolokuma Opokuma",
    "Nembe",
    "Ogbia",
    "Sagbama",
    "Southern Ijaw",
    "Yenagoa"
  ],
  Benue: [
    "Agatu",
    "Apa",
    "Ado",
    "Buruku",
    "Gboko",
    "Guma",
    "Gwer East",
    "Gwer West",
    "Katsina-Ala",
    "Konshisha",
    "Kwande",
    "Logo",
    "Makurdi",
    "Obi",
    "Ogbadibo",
    "Ohimini",
    "Oju",
    "Okpokwu",
    "Oturkpo",
    "Tarka",
    "Ukum",
    "Ushongo",
    "Vandeikya"
  ],
  Borno: [
    "Abadam",
    "Askira-Uba",
    "Bama",
    "Bayo",
    "Biu",
    "Chibok",
    "Damboa",
    "Dikwa",
    "Gubio",
    "Guzamala",
    "Gwoza",
    "Hawul",
    "Jere",
    "Kaga",
    "Kala-Balge",
    "Konduga",
    "Kukawa",
    "Kwaya Kusar",
    "Mafa",
    "Magumeri",
    "Maiduguri",
    "Marte",
    "Mobbar",
    "Monguno",
    "Ngala",
    "Nganzai",
    "Shani"
  ],
  "Cross River": [
    "Abi",
    "Akamkpa",
    "Akpabuyo",
    "Bakassi",
    "Bekwarra",
    "Biase",
    "Boki",
    "Calabar Municipal",
    "Calabar South",
    "Etung",
    "Ikom",
    "Obanliku",
    "Obubra",
    "Obudu",
    "Odukpani",
    "Ogoja",
    "Yakuur",
    "Yala"
  ],

  Delta: [
    "Aniocha North",
    "Aniocha South",
    "Bomadi",
    "Burutu",
    "Ethiope East",
    "Ethiope West",
    "Ika North East",
    "Ika South",
    "Isoko North",
    "Isoko South",
    "Ndokwa East",
    "Ndokwa West",
    "Okpe",
    "Oshimili North",
    "Oshimili South",
    "Patani",
    "Sapele",
    "Udu",
    "Ughelli North",
    "Ughelli South",
    "Ukwuani",
    "Uvwie",
    "Warri North",
    "Warri South",
    "Warri South West"
  ],

  Ebonyi: [
    "Abakaliki",
    "Afikpo North",
    "Afikpo South",
    "Ebonyi",
    "Ezza North",
    "Ezza South",
    "Ikwo",
    "Ishielu",
    "Ivo",
    "Izzi",
    "Ohaozara",
    "Ohaukwu",
    "Onicha"
  ],
  Edo: [
    "Akoko-Edo",
    "Egor",
    "Esan Central",
    "Esan North-East",
    "Esan South-East",
    "Esan West",
    "Etsako Central",
    "Etsako East",
    "Etsako West",
    "Igueben",
    "Ikpoba Okha",
    "Orhionmwon",
    "Oredo",
    "Ovia North-East",
    "Ovia South-West",
    "Owan East",
    "Owan West",
    "Uhunmwonde"
  ],

  Ekiti: [
    "Ado Ekiti",
    "Efon",
    "Ekiti East",
    "Ekiti South-West",
    "Ekiti West",
    "Emure",
    "Gbonyin",
    "Ido Osi",
    "Ijero",
    "Ikere",
    "Ikole",
    "Ilejemeje",
    "Irepodun-Ifelodun",
    "Ise-Orun",
    "Moba",
    "Oye"
  ],
  Enugu: [
    "Aninri",
    "Awgu",
    "Enugu East",
    "Enugu North",
    "Enugu South",
    "Ezeagu",
    "Igbo Etiti",
    "Igbo Eze North",
    "Igbo Eze South",
    "Isi Uzo",
    "Nkanu East",
    "Nkanu West",
    "Nsukka",
    "Oji River",
    "Udenu",
    "Udi",
    "Uzo Uwani"
  ],
  FCT: [
    "Abaji",
    "Bwari",
    "Gwagwalada",
    "Kuje",
    "Kwali",
    "Municipal Area Council"
  ],
  Gombe: [
    "Akko",
    "Balanga",
    "Billiri",
    "Dukku",
    "Funakaye",
    "Gombe",
    "Kaltungo",
    "Kwami",
    "Nafada",
    "Shongom",
    "Yamaltu-Deba"
  ],
  Imo: [
    "Aboh Mbaise",
    "Ahiazu Mbaise",
    "Ehime Mbano",
    "Ezinihitte",
    "Ideato North",
    "Ideato South",
    "Ihitte-Uboma",
    "Ikeduru",
    "Isiala Mbano",
    "Isu",
    "Mbaitoli",
    "Ngor Okpala",
    "Njaba",
    "Nkwerre",
    "Nwangele",
    "Obowo",
    "Oguta",
    "Ohaji-Egbema",
    "Okigwe",
    "Orlu",
    "Orsu",
    "Oru East",
    "Oru West",
    "Owerri Municipal",
    "Owerri North",
    "Owerri West",
    "Unuimo"
  ],
  Jigawa: [
    "Auyo",
    "Babura",
    "Biriniwa",
    "Birnin Kudu",
    "Buji",
    "Dutse",
    "Gagarawa",
    "Garki",
    "Gumel",
    "Guri",
    "Gwaram",
    "Gwiwa",
    "Hadejia",
    "Jahun",
    "Kafin Hausa",
    "Kazaure",
    "Kiri Kasama",
    "Kiyawa",
    "Kaugama",
    "Maigatari",
    "Malam Madori",
    "Miga",
    "Ringim",
    "Roni",
    "Sule Tankarkar",
    "Taura",
    "Yankwashi"
  ],
  Kaduna: [
    "Birnin Gwari",
    "Chikun",
    "Giwa",
    "Igabi",
    "Ikara",
    "Jaba",
    "Jema a",
    "Kachia",
    "Kaduna North",
    "Kaduna South",
    "Kagarko",
    "Kajuru",
    "Kaura",
    "Kauru",
    "Kubau",
    "Kudan",
    "Lere",
    "Makarfi",
    "Sabon Gari",
    "Sanga",
    "Soba",
    "Zangon Kataf",
    "Zaria"
  ],
  Kano: [
    "Ajingi",
    "Albasu",
    "Bagwai",
    "Bebeji",
    "Bichi",
    "Bunkure",
    "Dala",
    "Dambatta",
    "Dawakin Kudu",
    "Dawakin Tofa",
    "Doguwa",
    "Fagge",
    "Gabasawa",
    "Garko",
    "Garun Mallam",
    "Gaya",
    "Gezawa",
    "Gwale",
    "Gwarzo",
    "Kabo",
    "Kano Municipal",
    "Karaye",
    "Kibiya",
    "Kiru",
    "Kumbotso",
    "Kunchi",
    "Kura",
    "Madobi",
    "Makoda",
    "Minjibir",
    "Nasarawa",
    "Rano",
    "Rimin Gado",
    "Rogo",
    "Shanono",
    "Sumaila",
    "Takai",
    "Tarauni",
    "Tofa",
    "Tsanyawa",
    "Tudun Wada",
    "Ungogo",
    "Warawa",
    "Wudil"
  ],
  Katsina: [
    "Bakori",
    "Batagarawa",
    "Batsari",
    "Baure",
    "Bindawa",
    "Charanchi",
    "Dandume",
    "Danja",
    "Dan Musa",
    "Daura",
    "Dutsi",
    "Dutsin Ma",
    "Faskari",
    "Funtua",
    "Ingawa",
    "Jibia",
    "Kafur",
    "Kaita",
    "Kankara",
    "Kankia",
    "Katsina",
    "Kurfi",
    "Kusada",
    "Mai Adua",
    "Malumfashi",
    "Mani",
    "Mashi",
    "Matazu",
    "Musawa",
    "Rimi",
    "Sabuwa",
    "Safana",
    "Sandamu",
    "Zango"
  ],
  Kebbi: [
    "Aleiro",
    "Arewa Dandi",
    "Argungu",
    "Augie",
    "Bagudo",
    "Birnin Kebbi",
    "Bunza",
    "Dandi",
    "Fakai",
    "Gwandu",
    "Jega",
    "Kalgo",
    "Koko Besse",
    "Maiyama",
    "Ngaski",
    "Sakaba",
    "Shanga",
    "Suru",
    "Wasagu Danko",
    "Yauri",
    "Zuru"
  ],
  Kogi: [
    "Adavi",
    "Ajaokuta",
    "Ankpa",
    "Bassa",
    "Dekina",
    "Ibaji",
    "Idah",
    "Igalamela Odolu",
    "Ijumu",
    "Kabba Bunu",
    "Kogi",
    "Lokoja",
    "Mopa Muro",
    "Ofu",
    "Ogori Magongo",
    "Okehi",
    "Okene",
    "Olamaboro",
    "Omala",
    "Yagba East",
    "Yagba West"
  ],
  Kwara: [
    "Asa",
    "Baruten",
    "Edu",
    "Ekiti",
    "Ifelodun",
    "Ilorin East",
    "Ilorin South",
    "Ilorin West",
    "Irepodun",
    "Isin",
    "Kaiama",
    "Moro",
    "Offa",
    "Oke Ero",
    "Oyun",
    "Pategi"
  ],
  Lagos: [
    "Agege",
    "Ajeromi-Ifelodun",
    "Alimosho",
    "Amuwo-Odofin",
    "Apapa",
    "Badagry",
    "Epe",
    "Eti Osa",
    "Ibeju-Lekki",
    "Ifako-Ijaiye",
    "Ikeja",
    "Ikorodu",
    "Kosofe",
    "Lagos Island",
    "Lagos Mainland",
    "Mushin",
    "Ojo",
    "Oshodi-Isolo",
    "Shomolu",
    "Surulere"
  ],
  Nasarawa: [
    "Akwanga",
    "Awe",
    "Doma",
    "Karu",
    "Keana",
    "Keffi",
    "Kokona",
    "Lafia",
    "Nasarawa",
    "Nasarawa Egon",
    "Obi",
    "Toto",
    "Wamba"
  ],
  Niger: [
    "Agaie",
    "Agwara",
    "Bida",
    "Borgu",
    "Bosso",
    "Chanchaga",
    "Edati",
    "Gbako",
    "Gurara",
    "Katcha",
    "Kontagora",
    "Lapai",
    "Lavun",
    "Magama",
    "Mariga",
    "Mashegu",
    "Mokwa",
    "Moya",
    "Paikoro",
    "Rafi",
    "Rijau",
    "Shiroro",
    "Suleja",
    "Tafa",
    "Wushishi"
  ],
  Ogun: [
    "Abeokuta North",
    "Abeokuta South",
    "Ado-Odo Ota",
    "Egbado North",
    "Egbado South",
    "Ewekoro",
    "Ifo",
    "Ijebu East",
    "Ijebu North",
    "Ijebu North East",
    "Ijebu Ode",
    "Ikenne",
    "Imeko Afon",
    "Ipokia",
    "Obafemi Owode",
    "Odeda",
    "Odogbolu",
    "Ogun Waterside",
    "Remo North",
    "Shagamu"
  ],
  Ondo: [
    "Akoko North-East",
    "Akoko North-West",
    "Akoko South-West",
    "Akoko South-East",
    "Akure North",
    "Akure South",
    "Ese Odo",
    "Idanre",
    "Ifedore",
    "Ilaje",
    "Ile Oluji-Okeigbo",
    "Irele",
    "Odigbo",
    "Okitipupa",
    "Ondo East",
    "Ondo West",
    "Ose",
    "Owo"
  ],
  Osun: [
    "Atakunmosa East",
    "Atakunmosa West",
    "Aiyedaade",
    "Aiyedire",
    "Boluwaduro",
    "Boripe",
    "Ede North",
    "Ede South",
    "Ife Central",
    "Ife East",
    "Ife North",
    "Ife South",
    "Egbedore",
    "Ejigbo",
    "Ifedayo",
    "Ifelodun",
    "Ila",
    "Ilesa East",
    "Ilesa West",
    "Irepodun",
    "Irewole",
    "Isokan",
    "Iwo",
    "Obokun",
    "Odo Otin",
    "Ola Oluwa",
    "Olorunda",
    "Oriade",
    "Orolu",
    "Osogbo"
  ],
  Oyo: [
    "Afijio",
    "Akinyele",
    "Atiba",
    "Atisbo",
    "Egbeda",
    "Ibadan North",
    "Ibadan North-East",
    "Ibadan North-West",
    "Ibadan South-East",
    "Ibadan South-West",
    "Ibarapa Central",
    "Ibarapa East",
    "Ibarapa North",
    "Ido",
    "Irepo",
    "Iseyin",
    "Itesiwaju",
    "Iwajowa",
    "Kajola",
    "Lagelu",
    "Ogbomosho North",
    "Ogbomosho South",
    "Ogo Oluwa",
    "Olorunsogo",
    "Oluyole",
    "Ona Ara",
    "Orelope",
    "Ori Ire",
    "Oyo",
    "Oyo East",
    "Saki East",
    "Saki West",
    "Surulere"
  ],
  Plateau: [
    "Bokkos",
    "Barkin Ladi",
    "Bassa",
    "Jos East",
    "Jos North",
    "Jos South",
    "Kanam",
    "Kanke",
    "Langtang South",
    "Langtang North",
    "Mangu",
    "Mikang",
    "Pankshin",
    "Qua an Pan",
    "Riyom",
    "Shendam",
    "Wase"
  ],
  Rivers: [
    "Port Harcourt",
    "Obio-Akpor",
    "Okrika",
    "Ogu–Bolo",
    "Eleme",
    "Tai",
    "Gokana",
    "Khana",
    "Oyigbo",
    "Opobo–Nkoro",
    "Andoni",
    "Bonny",
    "Degema",
    "Asari-Toru",
    "Akuku-Toru",
    "Abua–Odual",
    "Ahoada West",
    "Ahoada East",
    "Ogba–Egbema–Ndoni",
    "Emohua",
    "Ikwerre",
    "Etche",
    "Omuma"
  ],
  Sokoto: [
    "Binji",
    "Bodinga",
    "Dange Shuni",
    "Gada",
    "Goronyo",
    "Gudu",
    "Gwadabawa",
    "Illela",
    "Isa",
    "Kebbe",
    "Kware",
    "Rabah",
    "Sabon Birni",
    "Shagari",
    "Silame",
    "Sokoto North",
    "Sokoto South",
    "Tambuwal",
    "Tangaza",
    "Tureta",
    "Wamako",
    "Wurno",
    "Yabo"
  ],
  Taraba: [
    "Ardo Kola",
    "Bali",
    "Donga",
    "Gashaka",
    "Gassol",
    "Ibi",
    "Jalingo",
    "Karim Lamido",
    "Kumi",
    "Lau",
    "Sardauna",
    "Takum",
    "Ussa",
    "Wukari",
    "Yorro",
    "Zing"
  ],
  Yobe: [
    "Bade",
    "Bursari",
    "Damaturu",
    "Fika",
    "Fune",
    "Geidam",
    "Gujba",
    "Gulani",
    "Jakusko",
    "Karasuwa",
    "Machina",
    "Nangere",
    "Nguru",
    "Potiskum",
    "Tarmuwa",
    "Yunusari",
    "Yusufari"
  ],
  Zamfara: [
    "Anka",
    "Bakura",
    "Birnin Magaji Kiyaw",
    "Bukkuyum",
    "Bungudu",
    "Gummi",
    "Gusau",
    "Kaura Namoda",
    "Maradun",
    "Maru",
    "Shinkafi",
    "Talata Mafara",
    "Chafe",
    "Zurmi"
  ]
}

let STATES2 = `
  <option value="Abia">Abia</option>
  <option value="Adamawa">Adamawa</option>
  <option value="Akwa Ibom" selected>Akwa Ibom</option>
  <option value="Anambra">Anambra</option>
  <option value="Bauchi">Bauchi</option>
  <option value="Bayelsa">Bayelsa</option>
  <option value="Benue">Benue</option>
  <option value="Borno">Borno</option>
  <option value="Cross River">Cross River</option>
  <option value="Delta">Delta</option>
  <option value="Ebonyi">Ebonyi</option>
  <option value="Edo">Edo</option>
  <option value="Ekiti">Ekiti</option>
  <option value="Enugu">Enugu</option>
  <option value="FCT">Federal Capital Territory</option>
  <option value="Gombe">Gombe</option>
  <option value="Imo">Imo</option>
  <option value="Jigawa">Jigawa</option>
  <option value="Kaduna">Kaduna</option>
  <option value="Kano">Kano</option>
  <option value="Katsina">Katsina</option>
  <option value="Kebbi">Kebbi</option>
  <option value="Kogi">Kogi</option>
  <option value="Kwara">Kwara</option>
  <option value="Lagos">Lagos</option>
  <option value="Nasarawa">Nasarawa</option>
  <option value="Niger">Niger</option>
  <option value="Ogun">Ogun</option>
  <option value="Ondo">Ondo</option>
  <option value="Osun">Osun</option>
  <option value="Oyo">Oyo</option>
  <option value="Plateau">Plateau</option>
  <option value="Rivers">Rivers</option>
  <option value="Sokoto">Sokoto</option>
  <option value="Taraba">Taraba</option>
  <option value="Yobe">Yobe</option>
  <option value="Zamfara">Zamfara</option>
`
let stateSelect2 = document.querySelector("#selectState")
let lgaSelect2 = document.querySelector('#selectLGA')



if (stateSelect2) {
  // lgaSelect = ""
  stateSelect2.innerHTML = STATES2

  if (lgaSelect2) {
    lgaList2["AkwaIbom"].forEach(lga => {
      lgaSelect2.innerHTML += `
    <option value="${lga}">${lga}</option>
  `
    })
  }

  stateSelect2.addEventListener('change', function () {
    let selectedState = $(this).val()

    let arrStates = Object.values(lgaList2)
    let finalarrState = arrStates[stateSelect2.selectedIndex]

    lgaSelect2.innerHTML = ''

    finalarrState.forEach((opt, ii) => {
      lgaSelect2.innerHTML += `
        <option value="${opt}">${opt}</option>
      `
    })


  })

}