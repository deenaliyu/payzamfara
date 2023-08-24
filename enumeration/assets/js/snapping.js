$('#snapBtn').on('click', function () {
  Webcam.set({
    width: 190,
    height: 190,
    image_format: 'jpeg',
    jpeg_quality: 90
  });

  Webcam.attach('#live_camera');


})
function capture_web_snapshot() {
  Webcam.snap(function (site_url) {
    $(".image-tag").val(site_url);

    $("#imageTag").html(`
      <img src="${site_url}" class="w-[150px] h-[150px] object-cover rounded-full" id="theImageThing" alt="">
    `)
    document.getElementById('preview').innerHTML = '<img src="' + site_url + '"/>';
  });
}
// Upload Image
let ImGURL = ""
function encodeImageFileAsURL(element) {
  var file = element.files[0];
  var reader = new FileReader();
  reader.onloadend = function () {
    // console.log('RESULT', reader.result)
    ImGURL = reader.result
    $(".image-tag").val(ImGURL);

    $("#imageTag").html(`
      <img src="${ImGURL}" class="w-[150px] h-[150px] object-cover rounded-full" id="theImageThing" alt="">
    `)
  }
  reader.readAsDataURL(file);

}
