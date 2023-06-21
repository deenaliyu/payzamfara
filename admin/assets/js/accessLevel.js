let adminInfo = JSON.parse(localStorage.getItem("adminDataPrime"))

if (adminInfo.mda_access === "view") {
  $("#createCard").remove()
  $("#createRevCont").html(``)
} else {
  $("#createRevCont").html(`
    <div class="input-group input-group-merge md:w-72 hidden md:flex ">
        <span class="input-group-text rounded-full" id="basic-addon-search31"><i
            class="bx bx-search"></i></span>
        <input type="text" class="form-control rounded-full" placeholder="Search..." aria-label="Search..."
        aria-describedby="basic-addon-search31">
    </div>

    <button class="button" data-bs-toggle="modal" data-bs-target="#createRevenueHead">Create</button>
    <button class="button-secondary" data-bs-toggle="modal" data-bs-target="#bulkCreateRevModal">Create
        Bulk</button>
    `)
}

if (adminInfo.cms_access === "view") {
  $("#theCms").html(``)

} else {
  $("#theCms").html(`
    <div class="input-group input-group-merge md:w-72 hidden md:flex ">
      <span class="input-group-text rounded-full" id="basic-addon-search31"><i
          class="bx bx-search"></i></span>
      <input type="text" class="form-control rounded-full" placeholder="Search..." aria-label="Search..."
        aria-describedby="basic-addon-search31">
    </div>
    <a href="newpost.html" class="button">New Post</a>
  `)
}

if (adminInfo.users_access === "view") {
  $("#userAccessor").html(``)

} else {
  $("#userAccessor").html(`
    <div class="input-group input-group-merge md:w-72 hidden md:flex ">
      <span class="input-group-text rounded-full" id="basic-addon-search31"><i
          class="bx bx-search"></i></span>
      <input type="text" class="form-control rounded-full" placeholder="Search..." aria-label="Search..."
        aria-describedby="basic-addon-search31">
    </div>
    <a href="createuser.html" class="button">Create new User</a>
  `)
}




// function removeEdit() {
//     let editTds = document.querySelectorAll(".editTd")
//     console.log(editTds)
//     document.querySelectorAll(".editTd").forEach(edita => {
//         edita.style.display = "none"
//     })
// }