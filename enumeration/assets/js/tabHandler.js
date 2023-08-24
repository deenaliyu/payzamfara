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

function printPreview(thecard) {
  var originalContent = document.body.innerHTML;

  let inputss = document.querySelectorAll("#thePrForm input")

  inputss.forEach(innp => {
    let parentElemet = innp.parentElement
    let newElemet = document.createElement('p')
    newElemet.textContent = innp.value
    newElemet.classList.add("fontBold", "text-lg", "thePss")

    parentElemet.insertAdjacentElement('afterend', newElemet)

    innp.classList.add("hidden")
  })

  var printContent = document.getElementById(thecard).innerHTML;

  document.body.innerHTML = printContent;
  window.print();
  document.body.innerHTML = originalContent;

  let inputts2 = document.querySelectorAll("#thePrForm input")
  inputts2.forEach((innp, i) => {
    innp.value = inputss[i].value

  })



}

// function printPreview(thecard) {
//   var portion = document.getElementById(thecard);
//   var printWindow = window.open('', '_blank');
//   printWindow.document.write('<html><head><title>Print</title></head><body>');
//   printWindow.document.write(portion.innerHTML);
//   printWindow.document.write('</body></html>');
//   printWindow.document.close();
//   printWindow.print();

// }

