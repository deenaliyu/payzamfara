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

function updateTotalLogins(month, loginsData, htmlID, theType, theType2) {
    const monthData = loginsData.find(data => data[theType] === month);
    if (monthData) {
        
        $("#" + htmlID).html(monthData[theType2]);
    }
}


let monthData

async function getAnalytics() {
  try {
    const response = await fetch(`${HOST}?getTotalUserActivity`)
    const data = await response.json()

    monthData = data[1]
    
    const currentMonth = new Date().getMonth() + 1;
  
    monthData.forEach((categ, i) => {
        const isSelected = parseInt(categ.activity_month) === currentMonth ? 'selected' : '';
        $("#categgg2").append(`
          <option value="${categ.activity_month}" ${isSelected}>${months[parseInt(categ.activity_month) - 1]}</option>
        `)
    });
        
    updateTotalLogins(currentMonth.toString(), monthData, "totalRegis", "activity_month", "total_activity");


  } catch (error) {
    console.log(error)
  }
}
getAnalytics()

function fetchCateg2(e) {
    let theVal = e.value
    let theData = monthData.find(dd => dd.activity_month === theVal)

    if (theData) {
        $("#totalRegis").html(theData.total_activity)
    }

}



let monthData1

async function getAnalytics1() {
    try {
        const response = await fetch(`${HOST}?getTotalUserLogins`)
        const data = await response.json()
        //  console.log(data)
  
        monthData1 = data[1]
        const currentMonth = new Date().getMonth() + 1;
  
        monthData1.forEach((categ, i) => {
            const isSelected = parseInt(categ.logins_month) === currentMonth ? 'selected' : '';
            $("#categgg").append(`
              <option value="${categ.logins_month}" ${isSelected}>${months[parseInt(categ.logins_month) - 1]}</option>
            `)
        });
        
        updateTotalLogins(currentMonth.toString(), monthData1, "totalRegCateg", "logins_month", "total_logins");
  
    } catch (error) {
      console.log(error)
    }
}

getAnalytics1()

function fetchCateg(e) {
    let theVal = e.value
    let theData = monthData1.find(dd => dd.logins_month === theVal)
        
    if (theData) {
        $("#totalRegCateg").html(theData.total_logins)
    }

}
  

let monthData2

async function getAnalytics2() {
    try {
        const response = await fetch(`${HOST}?getTotalUserError`)
        const data = await response.json()
        
        monthData2 = data[1]
        
        const currentMonth = new Date().getMonth() + 1;
  
        monthData2.forEach((categ, i) => {
            const isSelected = parseInt(categ.error_month) === currentMonth ? 'selected' : '';
            $("#categgg3").append(`
              <option value="${categ.error_month}" ${isSelected}>${months[parseInt(categ.error_month) - 1]}</option>
            `)
        });
        
        updateTotalLogins(currentMonth.toString(), monthData2, "totalRegCategRege", "error_month", "total_error");
    
    } catch (error) {
      console.log(error)
    }
}
getAnalytics2();
  
function fetchCateg3(e) {
    let theVal = e.value
    let theData = monthData2.find(dd => dd.error_month === theVal)
  
    if (theData) {
      $("#totalRegCategRege").html(theData.total_users)
    }
}  


  

  





