var currentTab = 0;
showTab(currentTab);

function showTab(n) {
  var x = document.getElementsByClassName("formTabs");
  x[n].style.display = "block";

  // fixStepIndicator(n)
}

function nextPrev(n) {
  var x = document.getElementsByClassName("formTabs");
  x[currentTab].style.display = "none";
  currentTab = currentTab + n;


  showTab(currentTab);
}

$("#selectAccType").on("change", function () {
  let val = $(this).val()
  if (val === "2") {
    $("#nameCont").html(`
        <div class="form-group md:w-6/12 w-full">
          <label for="">First name*</label>
          <input type="text" class="form-control taxFInput" data-name="first_name" required
            placeholder="Enter your first name">
        </div>

        <div class="form-group  md:w-6/12 w-full">
          <label for="">Surname*</label>
          <input type="text" class="form-control taxFInput" data-name="surname" required
            placeholder="Enter your last name">
        </div>
      `)

    $("#indivCorporate").html(`
      <div class="md:flex gap-3 mt-3">
        <div class="form-group md:w-6/12  w-full">
          <label class="">Self-assessment form upload *</label>
          <input class="form-control mt-1 taxFInput2" data-name="form_assessment_upload" accept=".pdf,.png,.jpg,.jpeg" required type="file" />
        </div>
        <div class="form-group md:w-6/12 w-full">
          <label class="">Income tax form *</label>
          <input class="form-control mt-1 taxFInput2" data-name="tax_income_upload" accept=".pdf,.png,.jpg,.jpeg" required type="file" />
        </div>
      </div>
      <div class="md:flex gap-3 mt-3">
        <div class="form-group md:w-6/12 w-full">
          <label class="">Evidence of tax payment *</label>
          <input class="form-control mt-1 taxFInput2" data-name="evidence_of_tax_payment" accept=".pdf,.png,.jpg,.jpeg" required type="file" />
        </div>
      </div>
    `)

  } else {
    $("#nameCont").html(`
      <div class="form-group w-full">
        <label for="">Organization Name*</label>
        <input type="text" class="form-control taxFInput" data-name="first_name" required
          placeholder="Enter your organization name">
      </div>

      <div class="form-group  md:w-6/12 w-full hidden">
        <label for="">Surname*</label>
        <input type="text" class="form-control taxFInput" data-name="surname"
          placeholder="Enter your last name">
      </div>
    `)

    $("#indivCorporate").html(`
      <div class="md:flex gap-3 mt-3">
        <div class="form-group md:w-6/12  w-full">
          <label class="">Self-assessment form upload *</label>
          <input class="form-control mt-1 taxFInput2" data-name="form_assessment_upload" accept=".pdf,.png,.jpg,.jpeg" required type="file" />
        </div>
        <div class="form-group md:w-6/12 w-full">
          <label class="">Income tax form *</label>
          <input class="form-control mt-1 taxFInput2" data-name="tax_income_upload" accept=".pdf,.png,.jpg,.jpeg" required type="file" />
        </div>
      </div>
      <div class="md:flex gap-3 mt-3">
        <div class="form-group md:w-6/12 w-full">
          <label class="">Evidence of tax payment *</label>
          <input class="form-control mt-1 taxFInput2" data-name="evidence_of_tax_payment" accept=".pdf,.png,.jpg,.jpeg" required type="file" />
        </div>
      </div>

      <div class="md:flex gap-3 mt-3">
        <div class="form-group md:w-6/12 w-full">
          <label class="">Form H1 *</label>
          <input class="form-control mt-1 taxFInput2" data-name="form_upload_4" accept=".pdf,.png,.jpg,.jpeg" type="file" />
        </div>

        <div class="form-group md:w-6/12 w-full">
          <label class="">Schedule of Tax deductions *</label>
          <input class="form-control mt-1 taxFInput2" data-name="form_upload_5" accept=".pdf,.png,.jpg,.jpeg" type="file" />
        </div>
      </div>
  `)

  }
})

$("#generateReferenceNum").on("click", function () {


  // $("#msg_box2").html(`<p class="text-warning text-center mt-4 text-lg">Uploading Files!</p>`)

  let allInputs = document.querySelectorAll(".taxFInput")
  var fileInputs = document.querySelectorAll('.taxFInput2[type="file"]');

  const publitio = new PublitioAPI('ksWdvJ3JjfV5JZnHyRqv', 'ruxLmts4NiupnoddqVi1Z70tnoMmf5yT')

  let user_id = ""
  let userDATA = JSON.parse(localStorage.getItem("userDataPrime"))

  if (userDATA) {
    user_id = userDATA.id
  } else {
    user_id = ""
  }

  let obj = {
    endpoint: "insertTaxFiling",
    data: {
      "user_id": user_id,
      "form_upload_5": "",
      "form_upload_4": "",
      "amount": "0"
    }
  }

  for (let ii = 0; ii < fileInputs.length; ii++) {
    const fileInput = fileInputs[ii];

    if (fileInput.value === "") {
      // console.log(fileInput.value)
      // console.log("empty")
      alert("Upload all required files")
      $("#msg_box").html(``)
      $("#generateReferenceNum").removeClass("hidden")
      $("#msg_box2").html(``)
      break;
      // obj.data[fileInput.dataset.name] = ""
    }
    // else {

    $("#msg_box").html(`
      <div class="flex justify-center items-center mt-4">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    `)
    $("#generateReferenceNum").addClass("hidden")
    $("#msg_box2").html(`<p class="text-warning text-center mt-4 text-lg">Uploading Files!</p>`)

    let fileUrl = fileInput.files[0]
    const reader = new FileReader()
    console.log(fileUrl)
    reader.readAsBinaryString(fileUrl);

    publitio.uploadFile(fileUrl, 'file', {
      title: `${fileUrl.name} - ${fileInput.dataset.name}`,
      public_id: `${fileUrl.name} - ${fileInput.dataset.name}`,

    }).then((data) => {
      obj.data[fileInput.dataset.name] = data.url_preview
      // console.log(data.url_preview)

      if (ii === fileInputs.length - 1) {
        $("#msg_box2").html(`<p class="text-succes text-center mt-4 text-lg">Files Uploaded, Generaring RRR...!</p>`)
        allInputs.forEach(allInput => {
          obj.data[allInput.dataset.name] = allInput.value
        })
        console.log(obj)
        let obbj2 = obj
        let StringedData = JSON.stringify(obbj2)

        console.log(StringedData)
        $.ajax({
          type: "POST",
          url: HOST,
          dataType: 'json',
          data: StringedData,
          success: function (data) {
            $("#msg_box").html(``)
            console.log(data)

            $("#generateReferenceNum").removeClass("hidden")
            $("#msg_box2").html(`<p class="text-succes text-center mt-4 text-lg">Generated : ${data[1].tax_filling_refrence}</p>`)
            $("#referenceNum").html(data[1].tax_filling_refrence)
            $("#refNumberModal").modal("show")

          },
          error: function (request, error) {
            console.log(error);
            $("#msg_box").html(`
              <p class="text-danger text-center mt-4 text-lg">Something went wrong !</p>
            `)
            $("#msg_box2").html(``)
            $("#generateReferenceNum").removeClass("hidden")
          }
        });
      }
    }).catch((error) => {
      console.log(error)
      $("#msg_box2").html(`Error Uploading your files, try again`)
      $("#generateReferenceNum").removeClass("hidden")
    })
    // }


  }




})

function proceedToFile() {
  // Check login status
  const userDATA = JSON.parse(localStorage.getItem("userDataPrime"));
  if (!userDATA || !userDATA.id || !userDATA.tax_number) {
    Swal.fire({
      icon: 'warning',
      title: 'Not logged in',
      text: 'Please sign in to continue.',
      confirmButtonText: 'Go to Sign in',
      confirmButtonColor: '#015826'
    }).then(() => {
      window.location.href = './signin.html';
    });
    return;
  }

  const today = new Date();

  const fetchApplicableTaxes = () =>
    fetch(`${HOST}?calculateApplicableTaxesCompliance&tax_number=${userDATA.tax_number}`)
      .then(r => r.json())
      .catch(() => ({ status: 0 }));

  const fetchUserFiling = () =>
    fetch(`${HOST}?getUserTaxFiling&tax_number=${userDATA.tax_number}`)
      .then(r => r.json())
      .catch(() => ({ status: 0 }));

  const formatMoney = (amount) => {
    const num = Number(amount || 0);
    return num.toLocaleString('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 2 });
  };

  const rowsHtml = (items) => items.map((it, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${it.revenue_head || it.revenueHead || it.COL_4 || '-'}</td>
        <td>${it.invoice_number || '-'}</td>
        <td>${formatMoney(it.amount_paid)}</td>
        <td>${it.due_date || '-'}</td>
        <td>${it.payment_status || '-'}</td>
      </tr>
    `).join('');

  Swal.fire({
    title: 'Checking your status…',
    html: '<div class="flex justify-center items-center mt-2"><div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div></div>',
    showConfirmButton: false,
    allowOutsideClick: false,
    didOpen: async () => {
      try {
        const [applicableRes, filingRes] = await Promise.all([
          fetchApplicableTaxes(),
          fetchUserFiling()
        ]);

        // Parse compliance response
        const compliance = (applicableRes && applicableRes.status === 1) ? applicableRes : null;
        const breakdown = Array.isArray(compliance?.revenue_breakdown) ? compliance.revenue_breakdown : [];
        const complianceDue = Number(compliance?.total_due || 0);

        // Parse invoices/filing response
        const filing = (filingRes && filingRes.status === 1 && filingRes.filing_details) ? filingRes.filing_details : {};
        const allBuckets = ['demand_notice', 'presumptive', 'direct', 'invoice'];
        const allItems = allBuckets.flatMap(k => Array.isArray(filing[k]) ? filing[k] : []);

        const unpaid = allItems.filter(x => String(x.payment_status).toLowerCase() !== 'paid');
        const overdue = unpaid.filter(x => {
          const d = x.due_date ? new Date(x.due_date) : null;
          return d && d < today;
        });

        // If user is non-compliant on applicable taxes, show a detailed modal
        if (complianceDue > 0 && breakdown.length > 0) {
          const bdRows = breakdown.map((b, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>${b.revenue_head}</td>
              <td>${b.frequency}</td>
              <td>${formatMoney(b.amount)}</td>
              <td>${(b.non_compliant_periods || []).join(', ') || '-'}</td>
              <td>${formatMoney(b.total_due)}</td>
              <td><span class="badge ${String(b.status).toLowerCase() === 'non-compliant' ? 'bg-danger' : 'bg-success'}">${b.status}</span></td>
            </tr>
          `).join('');

          await Swal.fire({
            icon: 'warning',
            title: 'Compliance Required',
            width: '900px',
            html: `
              <div class="text-left">
                <p class="mb-2">You have outstanding compliance items totalling <strong>${formatMoney(complianceDue)}</strong>.</p>
                <p class="mb-2">Please resolve your Applicable Taxes before filing.</p>
                <div class="table-responsive">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Revenue Head</th>
                        <th>Frequency</th>
                        <th>Amount</th>
                        <th>Non-compliant Periods</th>
                        <th>Total Due</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>${bdRows}</tbody>
                  </table>
                </div>
              </div>
            `,
            showCancelButton: true,
            cancelButtonText: 'Close',
            confirmButtonText: 'Open Applicable Taxes',
            confirmButtonColor: '#015826'
          }).then((r) => {
            if (r.isConfirmed) {
              window.location.href = './dashboard/taxes.html';
            }
          });
          return; // Block proceeding when there are due compliances
        }

        // Only handle unpaid invoices (includes any overdue ones)

        // If there are any unpaid invoices (including overdue), ask user to pay
        if (unpaid.length > 0) {
          await Swal.fire({
            icon: 'info',
            title: 'Unpaid invoices',
            width: '900px',
            html: `
              <div class="text-left">
                <p class="mb-2">You have unpaid invoices. Please pay before filing your tax.</p>
                <div class="table-responsive">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Revenue Head</th>
                        <th>Invoice No</th>
                        <th>Amount</th>
                        <th>Due Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${rowsHtml(unpaid)}
                    </tbody>
                  </table>
                </div>
              </div>
            `,
            showCancelButton: true,
            cancelButtonText: 'Close',
            confirmButtonText: 'View Invoices',
            confirmButtonColor: '#015826'
          }).then((r) => {
            if (r.isConfirmed) {
              const first = unpaid[0];
              if (first && first.invoice_number) {
                window.location.href = `./dashboard/invoice.html`;
              }
            }
          });
          return; // stop here; cannot proceed to file
        }

        // No unpaid invoices; allow filing
        const { isConfirmed, isDenied } = await Swal.fire({
          icon: 'success',
          title: 'All clear!',
          text: 'You have no unpaid invoices. You can proceed to file your tax.',
          confirmButtonText: 'Proceed',
          confirmButtonColor: '#015826',
          showDenyButton: true,
          denyButtonText: 'Apply for ETCC',
          denyButtonColor: '#AB0304'
        });

        // Handle button clicks
        if (isConfirmed) {
          try {
            nextPrev(1);
          } catch (e) {
            console.error("Error advancing wizard:", e);
          }
        } else if (isDenied) {
          window.location.href = "./etcc-initiate.html"; // change to your desired route
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Unable to check status',
          text: 'Please try again later.'
        });
      }
    }
  });
}