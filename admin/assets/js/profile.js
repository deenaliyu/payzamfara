
function Profile() {
  let userInfo = JSON.parse(window.localStorage.getItem("adminDataPrime"));
  let allProf = document.querySelector(".prof")
  allProf.innerHTML = `
   
    <div class="flex sm:flex-row flex-col items-center gap-6 mb-3">

    <div class="form-group w-full">
      <label class="sm:mb-2">Username</label>
      <input class="form-control" type="text" value="${userInfo.fullname}" />
    </div>

    <div class="form-group w-full">
      <label class="sm:mb-2">Email</label>
      <input class="form-control" type="text" value="${userInfo.email}" />
    </div>
  </div>
  <div class="flex sm:flex-row flex-col items-center gap-6 mb-3 mt-4">
        
                    <div class="form-group w-full">
                      <label class="sm:mb-2">Password</label>
                      <input class="form-control" type="password" value="98t9373208" placeholder="" />
                    </div>
        
                    <div class="form-group w-full">
                      <label class="sm:mb-2">Confirm password</label>
                      <input class="form-control" type="password" placeholder="Confirm password" />
                    </div>
                  </div>
`
  $("#adminP").html(`


<div class="flex gap-2 card p-4">
<p class="text-xl">User Profile</p>
<hr>
<p class="mainText font-bold">Name</p>
<p class="decis">${userInfo.fullname}</p>


<hr>
<p class="mainText font-bold">Email address</p>
<p class="decis">${userInfo.email}</p>
<hr>
<p class="mainText font-bold">phone</p>
<p class="decis">${userInfo.phone}</p>
<hr>
<p class="mainText font-bold">Analytics Access</p>
<p class="decis">${userInfo.analytics_access}</p>
<hr>
<p class="mainText font-bold">CMS Access</p>
<p class="decis">${userInfo.cms_access}</p>
<hr>
<p class="mainText font-bold">MDA Access</p>
<p class="decis">${userInfo.mda_access}</p>
<hr>
<p class="mainText font-bold">Support Access</p>
<p class="decis">${userInfo.support}</p>
</div>

`)
}

Profile()


