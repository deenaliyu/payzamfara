$(".viewUser").each(function () {
    $(this).on("click", function () {
      alert('ltes goo')
      // sessionStorage.setItem("mdaUpdate", taxPayer.id)
      window.location.href = "taxpayerlist.html"
  
    })
  });