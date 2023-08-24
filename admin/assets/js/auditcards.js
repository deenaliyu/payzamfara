let THEUSERINFO = JSON.parse(window.localStorage.getItem("enumDataPrime"));
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];



let monthData


async function getAnalytics() {
  try {
    const response = await fetch(`${HOST}?getTotalUserActivity`)
    const data = await response.json()
    // console.log(data)
    // getTotalUserActivity

    monthData = data[1]

    monthData.forEach((categ, i) => {
      $("#categgg2").append(`
        <option value="${categ.activity_month}">${months[parseInt(categ.activity_month) - 1]}</option>
      `)
    });
    $("#totalRegis").html(data[1][0].total_activity)


  } catch (error) {
    console.log(error)
  }
}

let monthData1

async function getAnalytics1() {
    try {
      const response = await fetch(`${HOST}?getTotalUserLogins`)
      const data = await response.json()
      console.log(data)
      // getTotalUserActivity
  
      monthData1 = data[1]
  
      monthData1.forEach((categ, i) => {
        $("#categgg").append(`
          <option value="${categ.logins_month}">${months[parseInt(categ.logins_month) - 1]}</option>
        `)
      });
      $("#totalRegCateg").html(data[1][0].total_logins)
  
  
    } catch (error) {
      console.log(error)
    }
  }
  

  let monthData2
  async function getAnalytics2() {
    try {
      const response = await fetch(`${HOST}?getTotalUserError`)
      const data = await response.json()
    //   console.log(data)
      // getTotalUserActivity
  
      monthData2 = data[1]
  
      monthData2.forEach((categ, i) => {
        $("#categgg3").append(`
          <option value="${categ.error_month}">${months[parseInt(categ.error_month) - 1]}</option>
        `)
      });
      $("#totalRegCategRege").html(data[1][0].total_error)
  
  
    } catch (error) {
      console.log(error)
    }
  }
 
  getAnalytics()
  getAnalytics1()
  getAnalytics2()

  

  

function fetchCateg(e) {
  let theVal = e.value
  let theData = monthData1.find(dd => dd.logins_month === theVal)

  if (theData) {
    $("#totalRegCateg").html(theData.total_users)
  }

}

function fetchCateg2(e) {
  let theVal = e.value
  let theData = monthData.find(dd => dd.activity_month === theVal)

  if (theData) {
    $("#totalRegis").html(theData.total_activity)
  }

}

function fetchCateg3(e) {
    let theVal = e.value
    let theData = monthData2.find(dd => dd.error_month === theVal)
  
    if (theData) {
      $("#totalRegCategRege").html(theData.total_users)
    }
  
  }