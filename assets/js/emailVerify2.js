const urlParams = new URLSearchParams(window.location.search);
const userid = urlParams.get('id');
const verification = urlParams.get('verification');

$.ajax({
  type: "GET",
  url: `${HOST}?activateAcountEnum&id=${userid}&verification=${verification}`,
  dataType: 'json',
  // data: StringedData,
  success: function (data) {
    console.log(data)
    if (data.status === 1) {
      $("#thetext").html(`Your Account has been verified successfully!`)
      $("#preloader").remove()

    } else {

    }
  },
  error: function (request, error) {
    console.log(error)
  }
});