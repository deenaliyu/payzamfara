let userDATA = JSON.parse(localStorage.getItem("userDataPrime"))

$("#openTicket").on("click", function () {
    $crisp.push(["do", "chat:open"])

    if (userDATA) {
        $crisp.push(["set", "user:email", [userDATA.email]]);
    }

})

$('body').delegate('.c-faq', 'click', function () {
    $('.c-faq').removeClass('c-faq--active');
    $(this).addClass('c-faq--active');
});