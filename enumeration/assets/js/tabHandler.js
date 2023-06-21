var currentTab = 0;
showTab(currentTab);

function showTab(n) {
  var x = document.getElementsByClassName("formTabs");
  var xx = document.getElementsByClassName("imgTabs");

  if (xx[n]) {
    xx[n].style.display = "block";
  }
  x[n].style.display = "block";

  // fixStepIndicator(n)
}

function nextPrev(n) {
  var x = document.getElementsByClassName("formTabs");
  var xx = document.getElementsByClassName("imgTabs");

  x[currentTab].style.display = "none";
  if (xx[currentTab]) {
    xx[currentTab].style.display = "none";
  }

  currentTab = currentTab + n;

  showTab(currentTab);
}
