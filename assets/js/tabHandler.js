var currentTab = 0;
showTab(currentTab);

function showTab(n) {
    var x = document.getElementsByClassName("formTabs");
    var xx = document.getElementsByClassName("imgTabs");

    xx[n].style.display = "block";
    x[n].style.display = "block";

    // fixStepIndicator(n)
}

function nextPrev(n) {
    var x = document.getElementsByClassName("formTabs");
    var xx = document.getElementsByClassName("imgTabs");

    x[currentTab].style.display = "none";
    xx[currentTab].style.display = "none";

    currentTab = currentTab + n;


    showTab(currentTab);
}
