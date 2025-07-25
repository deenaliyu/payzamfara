async function fetchServices() {
  const response = await fetch(`${HOST}?getCMS`)
  const data = await response.json()

  $(".newsContainer").html(``)
  $(".galleryContainer").html(``)

  if (data.status === 0) {
    $(".newsContainer").html(`
      <div class="flex justify-center mt-10">
        <p class="text-2xl fontBold text-center">No Contents available</p>
      </div>
    `)

    $(".galleryContainer").html(`
      <div class="flex justify-center mt-10">
        <p class="text-2xl fontBold text-center">No Contents available.</p>
      </div>
    `)


  } else {
    data.message.forEach(theservice => {
      if (theservice.page === "news") {

        $(".newsContainer").append(`
          <div class="col-md-4">
            <div class="news mb-5 card">
              <img src="${theservice.image}" class="h-[200px] object-cover" alt=""> 

              <div class="card-body">
                <h1 class="text-lg fontBold">${theservice.title}</h1>
                <div class="text-container text-sm mt-1 text-gray-400 h-[90px]">
                  ${theservice.content}
                </div>
                <div class="flex justify-between mt-2">
                  
                  <a class="text-xs text-[blue] readmoreBtns" data-newsid="${theservice.id}" href="#modal" >Read more</a>
                  <p class="text-xs">${theservice.time_in}</p>
                </div>
              </div>   

            </div>
          </div>
          
        `)

      } else {
        $(".galleryContainer").append(`
          <div class="news mb-5">
            <div class="h-[280px]">
              <img src="${theservice.image}" class="h-full object-cover" />
            </div>
            <p class="text-[#555555] text-sm mt-1">${theservice.caption}</p>
          </div>
        `)
      }

    })

    let readmoreBtns = document.querySelectorAll(".readmoreBtns")

    readmoreBtns.forEach(readmoreBtn => {
      readmoreBtn.addEventListener("click", function () {
        let theNews = data.message.filter(dta => dta.id === readmoreBtn.dataset.newsid)[0]
        let imgg
        if (theNews.image === "") {
          imgg = "https://via.placeholder.com/350x150"
        } else {
          imgg = theNews.image
        }
        $("#thenewsCont").html(`
          <h1 class="fontBold text-xl mb-4">${theNews.title}</h1>
          <img src="${imgg}" class="h-[250px] mb-2" alt="">

          <p>${theNews.content}</p>
        `)
        $("#newsModal").modal("show")
        console.log(theNews)
      })

    })

  }


}
fetchServices()