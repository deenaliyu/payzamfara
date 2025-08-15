function continueReg() {
  let allInputs = document.querySelectorAll(".enumInput")
  // check for empty fileds

  for (let i = 0; i < allInputs.length; i++) {
    const inpt = allInputs[i];

    if (inpt.required && inpt.value === "") {
      alert("Please fill all required fields")
      inpt.scrollIntoView()
      break;
    }

    if (i === allInputs.length - 1) {
      registerUser()
    }

  }

}

function nhisSelect(e) {
  if (e.checked) {
    $("#employeeNhis").html(`
      <input type="number" class="form-control enumInput" data-name="nhis" placeholder="NHIS amount" />
    `)
  } else {
    $("#employeeNhis").html("")
  }
}

function registerUser() {
  $("#theButton").addClass("hidden")
  $("#msg_box22").html(`
    <div class="flex justify-center items-center mb-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)

  let EnumData = {
    "endpoint": "createSpecialUserEmployee",
    "data": {
      "category_id": userInfo2?.tax_number,
      "new_gross": ''
    }
  }

  let allInputs = document.querySelectorAll(".enumInput")
  let allFormInputs = document.querySelectorAll(".form-check-input")

  allInputs.forEach((inputt, i) => {
    EnumData.data[inputt.dataset.name] = inputt.value
  })

  allFormInputs.forEach(inpt => {
    EnumData.data[inpt.value] = inpt.checked ? 'yes' : 'no'
  })
  // console.log(JSON.stringify(EnumData))
  // console.log(EnumData)


  async function sendToDB() {
    try {
      const response = await fetch(HOST, {
        method: "POST",
        body: JSON.stringify(EnumData),
        headers: {
          "Content-Type": "application/json"
        }
      })
      const data = await response.json()

      if (data.status === 1) {
        $("#addEmployeeModal").modal("hide")
        $("#theButton").removeClass("hidden")
        $("#msg_box22").html("")
        Swal.fire({
          title: 'Success',
          text: "Employee Registered successfully!",
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#025826',
          // cancelButtonColor: '#3085d6',
          confirmButtonText: 'Go to PAYE manager'

        }).then((result) => {
          window.location.href = `./paye-manager.html`
        })

      } else {
        $("#theButton").removeClass("hidden")
        $("#msg_box22").html(`
          <p class="text-warning text-center text-lg">${data.message}</p>
        `)
      }


    } catch (error) {
      console.log(error)
      $("#theButton").removeClass("hidden")
      $("#msg_box22").html(`
        <p class="text-danger text-center text-lg">Something went wrong ! try again.</p>
      `)
    }
  }

  sendToDB()

}

document.querySelector('#downloadTemplate').addEventListener('click', () => {
  const headers = [
    'fullname', 'email', 'phone', 'tin', 'annual_gross_income',
    'basic_salary', 'date_employed', 'housing',
    'others', 'pension', 'nhf', 'nhis', 'Life Premium', 'Voluntary Contribution', 'Percentage if yes', 'is_cons', 'consolidated amount'
  ];


  const csvContent = [headers.join(',')];

  // Add an empty row for template purposes
  const emptyRow = headers.map(() => '').join(',');
  csvContent.push(emptyRow);

  const blob = new Blob([csvContent.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'employee_template.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

function registerUsersFromCSV(file) {
  $("#msg_box").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>  
  `)
  const reader = new FileReader();
  const successfulRegistrations = [];
  const failedRegistrations = [];

  reader.onload = async (e) => {
    const csv = e.target.result;
    const lines = csv.split('\n').map(line => line.trim()).filter(line => line);
    const headers = lines[0].split(',');
    const users = lines.slice(1).map(line => {
      const values = line.split(',');
      return headers.reduce((obj, header, index) => {
        obj[header.trim()] = values[index] ? values[index].trim() : '';
        return obj;
      }, {});
    });

    for (let i = 0; i < users.length; i++) {
      const user = users[i];

      if (user.annual_gross_income === '' && user.basic_salary === '') {
        failedRegistrations.push({ email: user.email, error: 'Both annual gross income and basic salary are empty' });
        continue;
      }
      if (user.annual_gross_income === '' && user.basic_salary !== '') {
        user.annual_gross_income = parseFloat(user.basic_salary) * 12;
      } else if (user.annual_gross_income !== '' && user.basic_salary === '') {
        user.basic_salary = parseFloat(user.annual_gross_income) / 12;
      }

      // Set default values for nhf, nhis, and pension fields
      if (user.nhf === '' || user.nhf === undefined || user.nhf === null) {
        user.nhf = 'no';
      } else {
        user.nhf = 'yes';
      }

      if (user.nhis === '' || user.nhis === undefined || user.nhis === null) {
        user.nhis = 'no';
      } else {
        user.nhis = 'yes';
      }

      if (user.pension === '' || user.pension === undefined || user.pension === null) {
        user.pension = 'no';
      } else {
        user.pension = 'yes';
      }

      // Convert date_employed to proper JavaScript date format
      if (user.date_employed && user.date_employed !== '') {
        try {
          // Try to parse the date and convert to YYYY-MM-DD format
          const date = new Date(user.date_employed);
          if (!isNaN(date.getTime())) {
            // Format as YYYY-MM-DD
            user.date_employed = date.toISOString().split('T')[0];
          } else {
            // If parsing fails, set to current date
            user.date_employed = new Date().toISOString().split('T')[0];
          }
        } catch (error) {
          // If any error occurs, set to current date
          user.date_employed = new Date().toISOString().split('T')[0];
        }
      } else {
        // If date_employed is empty, set to current date
        user.date_employed = new Date().toISOString().split('T')[0];
      }

      const EnumData = {
        endpoint: "createSpecialUserEmployee",
        data: {
          category_id: userInfo2?.tax_number,
          ...user
        }
      };

      $("#msg_box").html(`
        <div class="flex justify-center items-center mt-4">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>  
      `)

      try {
        const response = await fetch(HOST, {
          method: "POST",
          body: JSON.stringify(EnumData),
          headers: {
            "Content-Type": "application/json"
          }
        });
        const data = await response.json();

        if (data.status === 1) {
          console.log(`Success: ${user.fullname} registered.`);
          successfulRegistrations.push(user.email);

        } else {
          failedRegistrations.push({ email: user.email, error: data.message });

        }
      } catch (error) {
        failedRegistrations.push({ email: user.email, error: error.message });
        console.log(`Error registering ${user.fullname}:`, error);
      }
    }

    $("#msg_box").html(`
      <div class="mt-4 flex justify-center items-center flex-col">
        <p>Registration Summary:</p>
        <p>Successful registrations: ${successfulRegistrations.length}</p>
        <p>${successfulRegistrations.join(', ')}</p>
      </div>
    `)

    if (failedRegistrations.length > 0) {
      $("#msg_box").append(`
          <div class="mt-4 flex justify-center items-center flex-col">
          <p>Failed registrations: ${failedRegistrations.length}</p>
          <p>${failedRegistrations.map(fail => `${fail.email}: ${fail.error}`).join('<br>')}</p>
        </div>
      `);
    }

    $("#msg_box").append(`
      <div class="flex justify-center mt-4">
        <a class="button" href="./paye-manager.html">Go Back</a>
      </div>
    `)
  };

  reader.onerror = () => {
    console.error('Failed to read the file');
    alert('Failed to read the file')
  };

  reader.readAsText(file);
}

// Usage example:
// <input type="file" id="csvFile" onchange="handleFileUpload(event)">
function handleFileButtonClick() {
  const fileInput = document.getElementById('csvFile');
  const file = fileInput.files[0];
  if (file) {
    registerUsersFromCSV(file);
  } else {
    console.error('No file selected');
  }
}