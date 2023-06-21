const urlParams = new URLSearchParams(window.location.search);
const userIdo = urlParams.get('id');

async function fetchTaxfillers() {
    $("#showdetails").html("");
    $("#loader").css("display", "flex");
  
    let config = {
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
      },
    };
    const response = await fetch(`${HOST}?getTaxFilingById&id=${userIdo}`);
    const userInvoices = await response.json();
    $("#loader").css("display", "none");
    if (userInvoices.status === 1) {
      userInvoices.message.reverse().forEach((userInvoice, i) => {
        let addd = "";
        addd += `
          <tr class="relative">
          <td>First Name</td>
          <td>${userInvoice.first_name}</td>
          </tr>
          <tr class="relative">
          <td>Surname</td>
          <td>${userInvoice.surname}</td>
          </tr>
          <tr class="relative">
          <td>Email</td>
          <td>${userInvoice.email}</td>
          </tr>
          <tr class="relative">
          <td>Phone Number</td>
          <td>${userInvoice.phone_number}</td>
          </tr>
          <tr class="relative">
          <td>Category</td>
          <td>${userInvoice.category}</td>
          </tr>
          <tr class="relative">
          <td>Tax to File</td>
          <td>${userInvoice.tax_to_file}</td>
          </tr>
              `;
        if (userInvoice.category === "individual") {
          addd += `
          <tr class="relative">
          <td>Form assessment upload</td>
          <td>${userInvoice.form_assessment_upload}</td>
          </tr>
          <tr class="relative">
          <td>Tax Income Upload</td>
          <td>${userInvoice.tax_income_upload}</td>
          </tr>
          <tr class="relative">
          <td>Evidence of Tax Payment</td>
          <td>${userInvoice.evidence_of_tax_payment}</td>
          </tr>
                
                `;
        } else {
          addd += `
          <tr class="relative">
          <td>Form assessment upload</td>
          <a href="${userInvoice.form_assessment_upload}">${userInvoice.form_assessment_upload}</a>
          </tr>
          <tr class="relative">
          <td>Tax Income Upload</td>
          <a href="${userInvoice.tax_income_upload}">${userInvoice.tax_income_upload}</a>
          </tr>
          <tr class="relative">
          <td>Evidence of Tax Payment</td>
          <a href="${userInvoice.evidence_of_tax_payment}">${userInvoice.evidence_of_tax_payment}</a>
          </tr>
          <tr class="relative">
          <td>Form HI</td>
          <a href="${userInvoice.form_upload_4}">${userInvoice.form_upload_4}</a>
          </tr>
          <tr class="relative">
          <td>Schedule of Tax Deduction</td>
          <a href="${userInvoice.form_upload_5}">${userInvoice.form_upload_5}</a>
                `;
        }
        $("#showdetails").append(addd);
        if (userInvoice.application_status === "pending") {
            $("#showbtn").append(`
            <div class="text-center mb-2">
            <label for="" class="font-bold">Amount to be paid</label>
            <input type="text" class="form-control rounded-md w-72 mt-2" id="amount" placeholder="0.00">
        </div>
            <button class="button w-72" id="submitApp">Approve</button>
                  `);
          } else {
            $("#showbtn").append(`

                  `);
          }
      });
    } else {
      // $("#showInvoice").html("<tr></tr>");
      $("#dataTable").DataTable();
    }
  }
  
  fetchTaxfillers().then((uu) => {
    $("#dataTable").DataTable();


    $("#submitApp").on("click", (e) => {

        let amount = document.querySelector("#amount").value
      console.log(amount);
        e.preventDefault()
        $("#msg_box").html(`
          <div class="flex justify-center items-center mt-4">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
          </div>
        `)
      
        $("#submitApp").addClass("hidden")
      
        $.ajax({
          type: "GET",
          url: `${HOST}/?approveTaxFiling&id=${userIdo}&amount=${amount}`,
          dataType: 'json',
          success: function (data) {
            if (data.status === 2) {
              $("#msg_box4").html(`
                <p class="text-warning text-center mt-4 text-lg">${data.message}</p>
              `)
              $("#submitApp").removeClass("hidden")
      
            } else if (data.status === 1) {
              $("#msg_box").html(`
                <p class="text-success text-center mt-4 text-lg">Approved Successfully</p>
              `)
              setTimeout(() => {
                window.location.href = "./service.html"
              }, 1000);
      
            } else if (data.status === 0) {
              $("#msg_box").html(`
                <p class="text-warning text-center mt-4 text-base">${data.message}</p>
              `)
              $("#submitApp").removeClass("hidden")
            }
          },
          error: function (request, error) {
            console.log(error);
            $("#msg_box").html(`
              <p class="text-danger text-center mt-4 text-lg">Something went wrong try again !</p>
            `)
            $("#submitApp").removeClass("hidden")
          }
        });
      
      })
      

  });

  async function fetchTinSingle() {
    $("#showtinRequest").html("");
    $("#loader2").css("display", "flex");
  
    let config = {
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
      },
    };
    const response = await fetch(`${HOST}?getTinRequestById&id=${userIdo}`);
    const tinRequest = await response.json();
    $("#loader2").css("display", "none");
    if (tinRequest.status === 1) {
        tinRequest.message.reverse().forEach((tinRequests, i) => {
        let addd = "";
        let dd = "";
        addd += `
        <div>
        <h6 class="font-bold mb-1">Title</h6>
        <p>${tinRequests.title}</p>
        </div>
          <div class="flex justify-between mt-2">
          <div>
          <h6 class="font-bold mb-1">First Name</h6>
          <p>${tinRequests.first_name}</p>
          </div>
          <div>
          <h6 class="font-bold mb-1">Surname</h6>
          <p>${tinRequests.surname}</p>
          </div>
          <div>
          <h6 class="font-bold mb-1">Middle Name</h6>
          <p>${tinRequests.middle_name}</p>
          </div>
          </div>
          <div class="flex justify-between mt-3">
          <div>
          <h6 class="font-bold mb-1">Natioality</h6>
          <p>${tinRequests.natioality}</p>
          </div>
          <div>
          <h6 class="font-bold mb-1">Phone Number_1</h6>
          <p>${tinRequests.phone_number_1}</p>
          </div>
          <div>
          <h6 class="font-bold mb-1">Phone Number_2</h6>
          <p>${tinRequests.phone_number_2}</p>
          </div>
          </div>
          <div class="flex justify-between mt-3">
          <div>
          <h6 class="font-bold mb-1">State of Origin</h6>
          <p>${tinRequests.state_of_origin}</p>
          </div>
          <div>
          <h6 class="font-bold mb-1">Marital Status</h6>
          <p>${tinRequests.marital_status}</p>
          </div>
          <div>
          <h6 class="font-bold mb-1">Birthday</h6>
          <p>${tinRequests.birthday}</p>
          </div>
          </div>
          <div class="flex justify-between mt-3">
          <div>
          <h6 class="font-bold mb-1">Occupation</h6>
          <p>${tinRequests.occupation}</p>
          </div>
          <div>
          <h6 class="font-bold mb-1">Gender</h6>
          <p>${tinRequests.gender}</p>
          </div>
          <div>
          <h6 class="font-bold mb-1">Email</h6>
          <p>${tinRequests.email}</p>
          </div>
          </div>
          <div class="flex justify-between mt-3">
          <div>
          <h6 class="font-bold mb-1">Mother Maiden Name</h6>
          <p>${tinRequests.mother_maiden_name}</p>
          </div>
          <div class="">
          <h6 class="font-bold mb-1">Mother Name</h6>
          <p>${tinRequests.mother_name}</p>
          </div>
          <div>
          </div>
          </div>
          <hr/ class="my-3">

         <div class="flex justify-between mt-3">
          <div>
          <h6 class="font-bold mb-1">Id Card</h6>
          <p>${tinRequests.id_card}</p>
          </div>
          <div class="">
          <h6 class="font-bold mb-1">Id Number</h6>
          <p>${tinRequests.id_number}</p>
          </div>
          <div class="">
          <h6 class="font-bold mb-1">Date Issue</h6>
          <p>${tinRequests.date_issue}</p>
          </div>
          <div>
          </div>
          </div>
          <div class="flex justify-between mt-3">
          <div>
          <h6 class="font-bold mb-1">Expiring Date</h6>
          <p>${tinRequests.expiring_date}</p>
          </div>
          <div class="">
          <h6 class="font-bold mb-1">Place of Issue</h6>
          <p>${tinRequests.place_of_issue}</p>
          </div>
          <div class="">
          <h6 class="font-bold mb-1">Id_issuing_authority</h6>
          <p>${tinRequests.id_issuing_authority}</p>
          </div>
          <div>
          </div>
          </div>
          <hr/ class="my-3">

          <div class="flex justify-between mt-3">
          <div>
          <h6 class="font-bold mb-1">Last_assessment_date</h6>
          <p>${tinRequests.last_assessment_date}</p>
          </div>
          <div class="">
          <h6 class="font-bold mb-1">Last_assessment_amount</h6>
          <p>${tinRequests.last_assessment_amount}</p>
          </div>
          <div class="">
          <h6 class="font-bold mb-1">Last_payment_date</h6>
          <p>${tinRequests.last_payment_date}</p>
          </div>
          <div>
          </div>
          </div>
          <div class="flex justify-between mt-3">
          <div>
          <h6 class="font-bold mb-1">Last_payment_amount</h6>
          <p>${tinRequests.last_payment_amount}</p>
          </div>
          <div class="">
          <h6 class="font-bold mb-1">Tax_type</h6>
          <p>${tinRequests.tax_type}</p>
          </div>
          <div>
          </div>
          </div>
          <hr/ class="my-3">
          <div class="flex justify-between mt-3">
          <div>
          <h6 class="font-bold mb-1">first_year</h6>
          <p>${tinRequests.First_year}</p>
          </div>
          <div class="">
          <h6 class="font-bold mb-1">first_income</h6>
          <p>${tinRequests.First_income}</p>
          </div>
          <div>
          </div>
          </div>
          <div class="flex justify-between mt-3">
          <div>
          <h6 class="font-bold mb-1">Second_year</h6>
          <p>${tinRequests.second_year}</p>
          </div>
          <div class="">
          <h6 class="font-bold mb-1">Second_income</h6>
          <p>${tinRequests.second_income}</p>
          </div>
          <div>
          </div>
          </div>
          <div class="flex justify-between mt-3">
          <div>
          <h6 class="font-bold mb-1">Third_year</h6>
          <p>${tinRequests.third_year}</p>
          </div>
          <div class="">
          <h6 class="font-bold mb-1">Third_income</h6>
          <p>${tinRequests.third_income}</p>
          </div>
          </div>
              `;
        $("#showtinRequest").append(addd);
        $("#showtinRequest2").html(`
        <div>
        <h6 class="font-bold mb-1">Tax Representative Details</h6>
        </div>
          <div class="flex justify-between mt-2">
          <div>
          <h6 class="font-bold mb-1">Name</h6>
          <p>${tinRequests.name}</p>
          </div>
          <div>
          <h6 class="font-bold mb-1">Tin</h6>
          <p>${tinRequests.tin}</p>
          </div>
          <div>
          <h6 class="font-bold mb-1">Rep-Type</h6>
          <p>${tinRequests.retyp}</p>
          </div>
          </div>
          <div class="flex justify-between mt-3">
          <div>
          <h6 class="font-bold mb-1">Reason</h6>
          <p>${tinRequests.reason}</p>
          </div>
          <div>
          <h6 class="font-bold mb-1">State</h6>
          <p>${tinRequests.state}</p>
          </div>
          <div>
          <h6 class="font-bold mb-1">Local gvt</h6>
          <p>${tinRequests.local_gvt}</p>
          </div>
          </div>
          <div class="flex justify-between mt-3">
          <div>
          <h6 class="font-bold mb-1">Ward</h6>
          <p>${tinRequests.ward}</p>
          </div>
          <div>
          <h6 class="font-bold mb-1">City</h6>
          <p>${tinRequests.city}</p>
          </div>
          <div>
          <h6 class="font-bold mb-1">Street_name</h6>
          <p>${tinRequests.street_name}</p>
          </div>
          </div>
          <div class="flex justify-between mt-3">
          <div>
          <h6 class="font-bold mb-1">House_no</h6>
          <p>${tinRequests.house_no}</p>
          </div>
          <div>
          <h6 class="font-bold mb-1">Source_of_income</h6>
          <p>${tinRequests.source_of_income}</p>
          </div>
          <div>
          <h6 class="font-bold mb-1">Employer_name</h6>
          <p>${tinRequests.employer_name}</p>
          </div>
          </div>
          <div class="flex justify-between mt-3">
          <div>
          <h6 class="font-bold mb-1">Employer_tin</h6>
          <p>${tinRequests.employer_tin}</p>
          </div>
          <div class="">
          <h6 class="font-bold mb-1">Start_date_of_employment</h6>
          <p>${tinRequests.start_date_of_employment}</p>
          </div>
          
          </div>
          <hr/ class="my-3">

         <div class="flex justify-between mt-3">
          <div>
          <h6 class="font-bold mb-1">Dep_child_first_name</h6>
          <p>${tinRequests.dep_child_first_name}</p>
          </div>
          <div class="">
          <h6 class="font-bold mb-1">Dep_child_surname</h6>
          <p>${tinRequests.dep_child_surname}</p>
          </div>
          <div class="">
          <h6 class="font-bold mb-1">Dep_child_middle_name</h6>
          <p>${tinRequests.dep_child_middle_name}</p>
          </div>
         
          </div>
          <div class="flex justify-between mt-3">
          <div>
          <h6 class="font-bold mb-1">Dep_child_state</h6>
          <p>${tinRequests.dep_child_state}</p>
          </div>
          <div class="">
          <h6 class="font-bold mb-1">Dep_child_birthday</h6>
          <p>${tinRequests.dep_child_birthday}</p>
          </div>
          <div class="">
          <h6 class="font-bold mb-1">Dep_child_tin</h6>
          <p>${tinRequests.dep_child_tin}</p>
          </div>
        
          </div>
          <hr/ class="my-3">

          <div class="flex justify-between mt-3">
          <div>
          <h6 class="font-bold mb-1">Dep_child_relationship_type</h6>
          <p>${tinRequests.dep_child_relationship_type}</p>
          </div>
          <div class="">
          <h6 class="font-bold mb-1">Sponser_first_name</h6>
          <p>${tinRequests.sponser_first_name}</p>
          </div>
          <div class="">
          <h6 class="font-bold mb-1">Sponser_surname</h6>
          <p>${tinRequests.sponser_surname}</p>
          </div>
          
          </div>
          <div class="flex justify-between mt-3">
          <div>
          <h6 class="font-bold mb-1">Sponser_middle_name</h6>
          <p>${tinRequests.sponser_middle_name}</p>
          </div>
          <div class="">
          <h6 class="font-bold mb-1">Start_date</h6>
          <p>${tinRequests.start_date}</p>
          </div>
          <div>
          <h6 class="font-bold mb-1">Sponser_tin</h6>
          <p>${tinRequests.sponser_tin}</p>
          </div>  
        `);
        dd += `
          <div class="flex justify-between mt-2">
          <div>
          <h6 class="font-bold mb-1">Form assessment upload</h6>
          <a href="${tinRequests.form_assessment_upload}">${tinRequests.form_assessment_upload}</a>
          </div>
          <div>
          <h6 class="font-bold mb-1">Tax Income Upload</h6>
          <a href="${tinRequests.tax_income_upload}">${tinRequests.tax_income_upload}</a>
          </div>
          </div>
          <div class="flex justify-between mt-3">
          <div>
          <h6 class="font-bold mb-1">Form HI</h6>
          <a href="${tinRequests.form_upload_4}">${tinRequests.form_upload_4}</a>
          </div>
          <div>
          <h6 class="font-bold mb-1">Schedule of Tax Deduction</h6>
          <a href="${tinRequests.form_upload_5}">${tinRequests.form_upload_5}</a>
          </div>
          </div>
        `
        $("#showtinRequest3").append(dd);
        if (tinRequests.application_status === "pending") {
            $("#showbt").append(`
            <button class="button w-72" id="submitAppi">Approve</button>
                  `);
          } else {
            $("#showbt").append(`

                  `);
          }
          
      });
    } else {
      // $("#showInvoice").html("<tr></tr>");
      $("#dataTable2").DataTable();
    }
  }
  
  fetchTinSingle().then((uu) => {
    $("#dataTable2").DataTable();


    $("#submitAppi").on("click", (e) => {

  
        e.preventDefault()
        $("#msg_box").html(`
          <div class="flex justify-center items-center mt-4">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
          </div>
        `)
      
        $("#submitAppi").addClass("hidden")
      
        $.ajax({
          type: "GET",
          url: `${HOST}/?approveTinRequest&id=${userIdo}`,
          dataType: 'json',
          success: function (data) {
            if (data.status === 2) {
              $("#msg_box4").html(`
                <p class="text-warning text-center mt-4 text-lg">${data.message}</p>
              `)
              $("#submitAppi").removeClass("hidden")
      
            } else if (data.status === 1) {
              $("#msg_box").html(`
                <p class="text-success text-center mt-4 text-lg">Approved Successfully</p>
              `)
              setTimeout(() => {
                window.location.href = `./tinrequestmail.html?id=${userIdo}`
              }, 1000);
      
            } else if (data.status === 0) {
              $("#msg_box").html(`
                <p class="text-warning text-center mt-4 text-base">${data.message}</p>
              `)
              $("#submitAppi").removeClass("hidden")
            }
          },
          error: function (request, error) {
            console.log(error);
            $("#msg_box").html(`
              <p class="text-danger text-center mt-4 text-lg">Something went wrong try again !</p>
            `)
            $("#submitAppi").removeClass("hidden")
          }
        });
      
      })
      

  });

  let reference_number = ""
  async function fetchTaxSingle() {
   
    $("#showtaxclearance").html("");
    $("#loader2").css("display", "flex");
    const response = await fetch(`${HOST}?getTaxClearanceById&id=${userIdo}`);
    const taxRequest = await response.json();
    $("#loader2").css("display", "none");
    if (taxRequest.status === 1) {
      taxRequest.message.reverse().forEach((taxRequests, i) => {
        let addd = "";
        let dd = "";
        addd += `
        <div>
        <h6 class="font-bold mb-1">Title</h6>
        <p>${taxRequests.title}</p>
        </div>
          <div class="flex justify-between mt-2">
          <div>
          <h6 class="font-bold mb-1">First Name</h6>
          <p>${taxRequests.first_name}</p>
          </div>
          <div>
          <h6 class="font-bold mb-1">Surname</h6>
          <p>${taxRequests.surname}</p>
          </div>
          <div>
          <h6 class="font-bold mb-1">Middle Name</h6>
          <p>${taxRequests.middle_name}</p>
          </div>
          </div>
          <div class="flex justify-between mt-3">
          <div>
          <h6 class="font-bold mb-1">Date_of_birth</h6>
          <p>${taxRequests.date_of_birth}</p>
          </div>
          <div>
          <h6 class="font-bold mb-1">Gender</h6>
          <p>${taxRequests.gender}</p>
          </div>
          <div>
          <h6 class="font-bold mb-1">Merital_status</h6>
          <p>${taxRequests.merital_status}</p>
          </div>
          </div>
          <div class="flex justify-between mt-3">
          <div>
          <h6 class="font-bold mb-1">Tin</h6>
          <p>${taxRequests.tin}</p>
          </div>
          <div>
          <h6 class="font-bold mb-1">Bvn</h6>
          <p>${taxRequests.bvn}</p>
          </div>
          <div>
          <h6 class="font-bold mb-1">State</h6>
          <p>${taxRequests.state}</p>
          </div>
          </div>
          <div class="flex justify-between mt-3">
          <div>
          <h6 class="font-bold mb-1">Local_govt_area</h6>
          <p>${taxRequests.local_area}</p>
          </div>
          <div>
          <h6 class="font-bold mb-1">Ward</h6>
          <p>${taxRequests.ward}</p>
          </div>
          <div>
          <h6 class="font-bold mb-1">City</h6>
          <p>${taxRequests.city}</p>
          </div>
          </div>
          <div class="flex justify-between mt-3">
          <div>
          <h6 class="font-bold mb-1">Street_name</h6>
          <p>${taxRequests.street_name}</p>
          </div>
          <div class="">
          <h6 class="font-bold mb-1">House_no</h6>
          <p>${taxRequests.house_no}</p>
          </div>
          </div>
          <hr/ class="my-3">

         <div class="flex justify-between mt-3">
          <div>
          <h6 class="font-bold mb-1">National_id_no</h6>
          <p>${taxRequests.national_id_no}</p>
          </div>
          <div class="">
          <h6 class="font-bold mb-1">Phone Number</h6>
          <p>${taxRequests.phone}</p>
          </div>
          <div class="">
          <h6 class="font-bold mb-1">Natioality</h6>
          <p>${taxRequests.natioality}</p>
          </div>
          </div>
          <div class="flex justify-between mt-3">
          <div>
          <h6 class="font-bold mb-1">Tax_station_name</h6>
          <p>${taxRequests.tax_station_name}</p>
          </div>
          <div class="">
          <h6 class="font-bold mb-1">Employment_type</h6>
          <p>${taxRequests.employment_type}</p>
          </div>
          <div class="">
          <h6 class="font-bold mb-1">Occupation</h6>
          <p>${taxRequests.occupation}</p>
          </div>
          <div>
          </div>
          </div>
          <hr/ class="my-3">

          <div class="flex justify-between mt-3">
          <div>
          <h6 class="font-bold mb-1">Profession</h6>
          <p>${taxRequests.profession}</p>
          </div>
          <div>
          <h6 class="font-bold mb-1">Tax_paid</h6>
          <p>${taxRequests.tax_paid}</p>
          </div>
          </div>
          <hr/ class="my-3">
          <div class="flex justify-between mt-3">
          <div>
          <h6 class="font-bold mb-1">first_year</h6>
          <p>${taxRequests.First_year}</p>
          </div>
          <div class="">
          <h6 class="font-bold mb-1">first_income</h6>
          <p>${taxRequests.First_income}</p>
          </div>
          <div>
          </div>
          </div>
          <div class="flex justify-between mt-3">
          <div>
          <h6 class="font-bold mb-1">Second_year</h6>
          <p>${taxRequests.second_year}</p>
          </div>
          <div class="">
          <h6 class="font-bold mb-1">Second_income</h6>
          <p>${taxRequests.second_income}</p>
          </div>
          <div>
          </div>
          </div>
          <div class="flex justify-between mt-3">
          <div>
          <h6 class="font-bold mb-1">Third_year</h6>
          <p>${taxRequests.third_year}</p>
          </div>
          <div class="">
          <h6 class="font-bold mb-1">Third_income</h6>
          <p>${taxRequests.third_income}</p>
          </div>
          <div>
          </div>
          </div>
              `;
        $("#showtaxclearance").append(addd);
        $("#showtaxclearance2").html(`
        <div>
        <h6 class="font-bold mb-1">Tax Representative Details</h6>
        </div>
          <div class="flex justify-between mt-2">
          <div>
          <h6 class="font-bold mb-1">Cop_rep_authorization</h6>
          <p>${taxRequests.cop_rep_authorization}</p>
          </div>
          <div>
          <h6 class="font-bold mb-1">Head_tax_station_authorization</h6>
          <p>${taxRequests.head_tax_station_authorization}</p>
          </div>
          <div>
          <h6 class="font-bold mb-1">Email</h6>
          <p>${taxRequests.emai_address}</p>
          </div>
          </div>
          <div class="flex justify-between mt-3">
          <div>
          <h6 class="font-bold mb-1">State_of_origin</h6>
          <p>${taxRequests.state_of_origin}</p>
          </div>
          <div>
          <h6 class="font-bold mb-1">Company_name</h6>
          <p>${taxRequests.company_name}</p>
          </div>
          <div>
          <h6 class="font-bold mb-1">Company_branch</h6>
          <p>${taxRequests.company_branch}</p>
          </div>
          </div>
          <div class="flex justify-between mt-3">
          <div>
          <h6 class="font-bold mb-1">Company_address</h6>
          <p>${taxRequests.company_address}</p>
          </div>
          <div>
          <h6 class="font-bold mb-1">Web_address</h6>
          <p>${taxRequests.web_address}</p>
          </div>
          <div>
          <h6 class="font-bold mb-1">Official_position</h6>
          <p>${taxRequests.official_position}</p>
          </div>
          </div>
          <div class="flex justify-between mt-3">
          <div>
          <h6 class="font-bold mb-1">International_passport_no</h6>
          <p>${taxRequests.international_passport_no}</p>
          </div>
          <div>
          <h6 class="font-bold mb-1">Alien_negistration_no</h6>
          <p>${taxRequests.alien_negistration_no}</p>
          </div>
          <div>
          <h6 class="font-bold mb-1">Sponsor_name</h6>
          <p>${taxRequests.sponsor_name}</p>
          </div>
          </div>
          <div class="flex justify-between mt-3">
          <div>
          <h6 class="font-bold mb-1">Sponsor_occupation</h6>
          <p>${taxRequests.sponsor_occupation}</p>
          </div>
          <div class="">
          <h6 class="font-bold mb-1">Sponsor_business</h6>
          <p>${taxRequests.sponsor_business}</p>
          </div>
          </div>
          <hr/ class="my-3">

         <div class="flex justify-between mt-3">
          <div>
          <h6 class="font-bold mb-1">Employment_from_1</h6>
          <p>${taxRequests.employment_from_1}</p>
          </div>
          <div class="">
          <h6 class="font-bold mb-1">Employment_to_1</h6>
          <p>${taxRequests.employment_to_1}</p>
          </div>
          <div>
          </div>
          </div>

          <div class="flex justify-between mt-3">
          <div>
          <h6 class="font-bold mb-1">Employment_from_2</h6>
          <p>${taxRequests.employment_from_2}</p>
          </div>
          <div class="">
          <h6 class="font-bold mb-1">Employment_to_2</h6>
          <p>${taxRequests.employment_to_2}</p>
          </div>
          <div>
          </div>
          </div>
          <div class="flex justify-between mt-3">
          <div>
          <h6 class="font-bold mb-1">Employment_from_3</h6>
          <p>${taxRequests.employment_from_3}</p>
          </div>
          <div class="">
          <h6 class="font-bold mb-1">Employment_to_3</h6>
          <p>${taxRequests.employment_to_3}</p>
          </div>
          <div>
          </div>
          </div>
        `);
        dd += `
          <div class="flex justify-between mt-2">
          <div>
          <h6 class="font-bold mb-1">Audit_report</h6>
          <a href="${taxRequests.audit_report}">${taxRequests.audit_report}</a>
          </div>
          <div>
          <h6 class="font-bold mb-1">Evidence_of_payment</h6>
          <a href="${taxRequests.evidence_of_payment}">${taxRequests.evidence_of_payment}</a>
          </div>
          <div>
          </div>
          </div>
          <div class="flex justify-between mt-3">
          <div>
          <h6 class="font-bold mb-1">Signature</h6>
          <a href="${taxRequests.signature}">${taxRequests.signature}</a>
          </div>
          <div>
          <h6 class="font-bold mb-1">Passport</h6>
          <a href="${taxRequests.passport}">${taxRequests.passport}</a>
          </div>
          <div>
          </div>
          </div>
        `
        $("#showtaxclearance3").append(dd);
        if (taxRequests.application_status === "pending") {
            $("#showbut").append(`
            <button class="button w-72" id="submitAppa">Proceed to TCC</button>
                  `);
          } else {
            $("#showbt").append(`

                  `);
          }
          reference_number = taxRequests.reference_number
      });
    } else {
      // $("#showInvoice").html("<tr></tr>");
      $("#dataTable2").DataTable();
    }
  }
  
  fetchTaxSingle().then((uu) => {
    $("#dataTable2").DataTable();


    $("#submitAppa").on("click", (e) => {

  
        e.preventDefault()
        $("#msg_box").html(`
          <div class="flex justify-center items-center mt-4">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
          </div>
        `)
      
        $("#submitAppa").addClass("hidden")
      
        $.ajax({
          type: "GET",
          url: `${HOST}/?approveTaxcert&id=${userIdo}`,
          dataType: 'json',
          success: function (data) {
            if (data.status === 2) {
              $("#msg_box4").html(`
                <p class="text-warning text-center mt-4 text-lg">${data.message}</p>
              `)
              $("#submitAppa").removeClass("hidden")
      
            } else if (data.status === 1) {
              $("#msg_box").html(`
                <p class="text-success text-center mt-4 text-lg">Approved Successfully</p>
              `)
              setTimeout(() => {
                window.location.href = `./viewtaxclearancecert.html?reference=${reference_number}`
              }, 1000);
      
            } else if (data.status === 0) {
              $("#msg_box").html(`
                <p class="text-warning text-center mt-4 text-base">${data.message}</p>
              `)
              $("#submitAppa").removeClass("hidden")
            }
          },
          error: function (request, error) {
            console.log(error);
            $("#msg_box").html(`
              <p class="text-danger text-center mt-4 text-lg">Something went wrong try again !</p>
            `)
            $("#submitAppa").removeClass("hidden")
          }
        });
      
      })
      

  });

 