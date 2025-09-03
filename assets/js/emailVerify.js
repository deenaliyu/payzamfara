const urlParams = new URLSearchParams(window.location.search);
const userid = urlParams.get('id');
const verification = urlParams.get('verification');

$.ajax({
  type: "GET",
  url: `${HOST}?activateAcount&id=${userid}&verification=${verification}`,
  dataType: 'json',
  // data: StringedData,
  success: function (data) {
    console.log(data)
    if (data.status === 1) {
      $("#thetext").html(`
        <div class="flex justify-center">
          <iconify-icon icon="material-symbols:check-circle" class="text-[#00AF52]" width="42"
            height="42"></iconify-icon>
        </div>  
        
        <p class="text-center text-xl mb-2">Congratulations!</p>
        <p class="text-sm text-gray-600 text-center">Your account has been successfully verified.</p>
      `)
      $("#preloader").remove()

    } else {

    }
  },
  error: function (request, error) {
    console.log(error)
  }
});