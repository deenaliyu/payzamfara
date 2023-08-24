let REHEADS = ""

async function getAllRevH() {
  const response = await fetch(`${HOST}/?getAllRevenueHeads`)
  const revHeads = await response.json()

  if (revHeads.status === 0) {
  } else {
    REHEADS = revHeads.message
    revHeads.message.forEach(revH => {
      $("#revSelect").append(`
        <option value="${revH.COL_4}">${revH.COL_4}</option>
      `)
    });
  }
}

getAllRevH()

$("#revSelect").on("change", function () {
  let val = $(this).val()
  setPrice(val)
})

let thePrice = 0
function setPrice(val) {
  let theRevenue = REHEADS.filter(rr => rr.COL_4 === val)
  // console.log(val, theRevenue)
  $("#amountToPay").val(theRevenue[0]["COL_6"])
  thePrice = theRevenue[0]["COL_6"]
  // the_id = theRevenue[0].id

}

function convertNumberToWords(number) {
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const tens = ['', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const teens = ['eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

  if (number === 0) {
    return 'zero';
  }

  if (number < 0) {
    return 'minus ' + convertNumberToWords(Math.abs(number));
  }

  let words = '';

  if (Math.floor(number / 1000000) > 0) {
    words += convertNumberToWords(Math.floor(number / 1000000)) + ' million ';
    number %= 1000000;
  }

  if (Math.floor(number / 1000) > 0) {
    words += convertNumberToWords(Math.floor(number / 1000)) + ' thousand ';
    number %= 1000;
  }

  if (Math.floor(number / 100) > 0) {
    words += convertNumberToWords(Math.floor(number / 100)) + ' hundred ';
    number %= 100;
  }

  if (number > 0) {
    if (words !== '') {
      words += 'and ';
    }

    if (number < 10) {
      words += ones[number];
    } else if (number < 20) {
      words += teens[number - 11];
    } else {
      words += tens[Math.floor(number / 10)];
      if (number % 10 > 0) {
        words += '-' + ones[number % 10];
      }
    }
  }

  return words.trim();

}

function printInvoice(thecard) {
  var originalContent = document.body.innerHTML;
  // document.querySelector("#editBtn").remove()
  var printContent = document.getElementById(thecard).innerHTML;


  document.body.innerHTML = printContent;
  window.print();
  document.body.innerHTML = originalContent;

}
