let selectcategory = $(".cardi");
const flatBusinessTypes = [];

async function getBusinessType() {
  try {
    const response = await fetch(`${HOST}?getIndustryHierarchy`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    if (data.status === 1) {
      data.data.forEach(industry => {
        industry.sectors.forEach(sector => {
          sector.business_types.forEach(businessType => {
            // Optionally store this info for lookup later
            flatBusinessTypes.push({
              business_type_id: businessType.business_type_id,
              business_type_name: businessType.business_type_name,
              sector_id: sector.sector_id,
              sector_name: sector.sector_name,
              industry_id: industry.industry_id,
              industry_name: industry.industry_name,
            });
          });
        });
      });
    }
  } catch (error) {
    console.log(error)
  }
}

selectcategory.each(function () {
  $(this).on("click", function () {
    selectcategory.removeClass("selectedcat");
    $(this).addClass("selectedcat");
    let btnclicked = $(".bb");
    btnclicked.removeClass("disabled");
    let dataId = $(this).attr("data-name");
    let urlParams = `category=${dataId}`;

    if (typeof createdBy !== "undefined" && createdBy) {
      urlParams += `&createdby=${createdBy}`;
    }
    if (typeof adminId !== "undefined" && adminId) {
      urlParams += `&admin_id=${adminId}`;
    }

    btnclicked.off("click").on("click", function () {
      if (dataId === "individual") {
        window.location.href = `register.html?${urlParams}`;
      } else {
        window.location.href = `registerform.html?${urlParams}`;
      }
    });
  });
});

class CustomerValidation {
  constructor() {
    this.apiBaseUrl = 'https://payzamfara.com/php/JTD';
    this.form = document.getElementById('validation-form');
    this.validationInput = document.getElementById('validationInput');
    this.validateBtn = document.getElementById('validate-btn');
    this.skipBtn = document.getElementById('skip-btn');
    this.proceedBtn = document.getElementById('proceed-btn');
    this.taxpayerSummary = document.getElementById('taxpayer-summary');
    this.taxpayerOptions = document.getElementById('taxpayer-options');
    this.taxpayerDetails = document.getElementById('taxpayer-details');
    this.selectedTaxpayer = null;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateInputPlaceholder();
  }

  setupEventListeners() {
    // Radio button change
    document.querySelectorAll('input[name="identificationMethod"]').forEach(radio => {
      radio.addEventListener('change', () => this.updateInputPlaceholder());
    });

    // Form submission
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.validateTaxpayer();
    });

    // Proceed button
    this.proceedBtn.addEventListener('click', () => this.proceedToNextStep());
    this.skipBtn.addEventListener('click', () => this.proceedToNextStep());
  }

  updateInputPlaceholder() {
    const method = document.querySelector('input[name="identificationMethod"]:checked').value;
    const input = this.validationInput;

    switch (method) {
      case 'tin':
        input.placeholder = 'Enter your TIN (e.g., 0123456789)';
        input.dataset.name = 'tin';
        break;
      case 'registration_number':
        input.placeholder = 'Enter your RC Number (e.g., RC123456)';
        input.dataset.name = 'registration_number';
        break;
      case 'nin':
        input.placeholder = 'Enter your NIN (e.g., 12345678901)';
        input.dataset.name = 'nin';
        break;
      case 'phone_no':
        input.placeholder = 'Enter your Phone (e.g., 08012345678)';
        input.dataset.name = 'phone_no';
        break;
    }
  }

  async validateTaxpayer() {
    const method = document.querySelector('input[name="identificationMethod"]:checked').value;
    const value = this.validationInput.value.trim();

    if (!value) {
      this.showError(this.validationInput, 'This field is required');
      return;
    }

    this.showLoader();

    try {
      const response = await this.fetchTaxpayer(method, value);

      if (response.status === 'error' || response.data.length === 0) {
        this.handleTaxpayerNotFound();
      } else {
        this.displayTaxpayerInfo(response.data); // response.data is now an array
      }

    } catch (error) {
      console.error('Validation error:', error);
      Swal.fire({
        title: 'Error',
        text: 'An error occurred while validating. Please try again.',
        icon: 'error'
      });
    } finally {
      this.hideLoader();
    }
  }

  async fetchTaxpayer(method, value) {
    const url = `${this.apiBaseUrl}/get-taxpayer?search=${encodeURIComponent(value)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  }

  handleTaxpayerNotFound() {
    Swal.fire({
      title: 'Taxpayer Not Found',
      text: 'No taxpayer record was found with the provided information. Would you like to register manually?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Register Manually',
      cancelButtonText: 'Try Again'
    }).then((result) => {
      if (result.isConfirmed) {
        this.proceedToNextStep();
      }
    });
  }

  displayTaxpayerInfo(taxpayers) {
    // Show the summary section
    this.taxpayerSummary.classList.remove('hidden');

    // Clear previous content
    this.taxpayerOptions.innerHTML = '';
    this.taxpayerDetails.innerHTML = '';

    if (taxpayers.length === 1) {
      // Single taxpayer found
      this.renderTaxpayerDetails(taxpayers[0]);
      this.selectedTaxpayer = taxpayers[0];
    } else {
      // Multiple taxpayers found
      this.renderTaxpayerOptions(taxpayers);
    }
  }

  renderTaxpayerOptions(taxpayers) {
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'mb-4';

    const label = document.createElement('label');
    label.className = 'block text-sm font-medium text-gray-700 mb-2';
    label.textContent = 'Multiple records found. Please select one:';
    optionsDiv.appendChild(label);

    taxpayers.forEach((taxpayer, index) => {
      const div = document.createElement('div');
      div.className = 'flex items-center mb-2';

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'taxpayerOption';
      input.id = `taxpayer-${index}`;
      input.value = index;
      input.className = 'mr-2';
      input.addEventListener('change', () => {
        this.selectedTaxpayer = taxpayer;
        this.renderTaxpayerDetails(taxpayer);
      });

      if (index === 0) {
        input.checked = true;
        this.selectedTaxpayer = taxpayer;
        this.renderTaxpayerDetails(taxpayer);
      }

      const label = document.createElement('label');
      label.htmlFor = `taxpayer-${index}`;
      label.className = 'text-sm';

      // Determine if individual or business
      const isIndividual = this.isIndividualTaxpayer(taxpayer);

      if (isIndividual) {
        const record = taxpayer.data.jtb;
        label.textContent = `${record.first_name} ${record.last_name} (${record.tin})`;
      } else {
        const record = taxpayer.data.jtb;
        label.textContent = `${record.registered_name} (${record.tin})`;
      }

      div.appendChild(input);
      div.appendChild(label);
      optionsDiv.appendChild(div);
    });

    this.taxpayerOptions.appendChild(optionsDiv);
  }

  isIndividualTaxpayer(taxpayer) {
    // Check if this is an individual by looking for individual-specific fields
    return taxpayer.data.jtb &&
      (taxpayer.data.jtb.first_name !== undefined &&
        taxpayer.data.jtb.first_name !== null);
  }

  renderTaxpayerDetails(taxpayer) {
    this.taxpayerDetails.innerHTML = '';

    const isIndividual = this.isIndividualTaxpayer(taxpayer);
    const record = taxpayer.data.jtb;

    if (isIndividual) {
      const details = [
        { label: 'Full Name', value: `${record.Title || ''} ${record.first_name || ''} ${record.middle_name || ''} ${record.last_name || ''}`.trim() },
        { label: 'TIN', value: record.tin },
        { label: 'Gender', value: record.GenderName },
        { label: 'Date of Birth', value: this.formatDate(record.date_of_birth) },
        { label: 'Marital Status', value: record.MaritalStatus },
        { label: 'Occupation', value: record.Occupation },
        { label: 'Phone Number', value: record.phone_no_1 },
        { label: 'Email', value: record.email_address },
        { label: 'Address', value: `${record.house_number || ''} ${record.street_name || ''}, ${record.city || ''}`.trim() },
        { label: 'LGA', value: record.LGAName },
        { label: 'State', value: record.StateName },
        { label: 'Tax Authority', value: record.TaxAuthorityName },
      ];

      details.forEach(detail => {
        if (detail.value) {
          this.addDetailRow(detail.label, detail.value);
        }
      });
    } else {
      const details = [
        { label: 'Registered Name', value: record.registered_name },
        { label: 'Trade Name', value: record.main_trade_name },
        { label: 'TIN', value: record.tin },
        { label: 'RC Number', value: record.registration_number },
        { label: 'Organization Type', value: record.org_type_name },
        { label: 'Phone Number', value: record.phone_no_1 },
        { label: 'Email', value: record.email_address },
        { label: 'Address', value: `${record.house_number || ''} ${record.street_name || ''}, ${record.city || ''}`.trim() },
        { label: 'LGA', value: record.LGAName },
        { label: 'State', value: record.StateName },
        { label: 'Date of Incorporation', value: this.formatDate(record.date_of_incorporation) },
        { label: 'Director', value: `${record.director_name || ''} (${record.director_phone || ''})`.trim() },
      ];

      details.forEach(detail => {
        if (detail.value && detail.value !== ' ()' && detail.value !== 'null') {
          this.addDetailRow(detail.label, detail.value);
        }
      });
    }
  }

  addDetailRow(label, value) {
    const div = document.createElement('div');
    div.className = 'mb-2';

    const labelSpan = document.createElement('span');
    labelSpan.className = 'font-semibold text-sm';
    labelSpan.textContent = `${label}: `;

    const valueSpan = document.createElement('span');
    valueSpan.className = 'text-sm';
    valueSpan.textContent = value;

    div.appendChild(labelSpan);
    div.appendChild(valueSpan);
    this.taxpayerDetails.appendChild(div);
  }

  proceedToNextStep() {
    // Store the taxpayer data for use in the next steps
    if (this.selectedTaxpayer) {
      // Add a type property to maintain compatibility with existing code
      const taxpayerWithType = {
        ...this.selectedTaxpayer,
        type: this.isIndividualTaxpayer(this.selectedTaxpayer) ? 'individual' : 'business'
      };
      sessionStorage.setItem('taxpayerData', JSON.stringify(taxpayerWithType));
    }

    // Hide the validation form and show the next section
    document.getElementById('customer-validation').style.display = 'none';
    document.getElementById('contact-info').style.display = 'block';

    // If we have taxpayer data, pre-fill the next form
    if (this.selectedTaxpayer) {
      this.prefillNextForm();
    }
  }

  prefillNextForm() {
    const taxpayer = this.selectedTaxpayer;
    const isIndividual = this.isIndividualTaxpayer(taxpayer);
    const record = taxpayer.data.jtb;

    // Set state and LGA if available in your form
    if (document.getElementById('selectState')) {
      let formattedState = record.StateName ? record.StateName.charAt(0).toUpperCase() + record.StateName.slice(1).toLowerCase() : '';

      let formattedLGA = record.LGAName
        ? record.LGAName
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
        : '';

      document.getElementById('selectState').value = formattedState;

      let lgaSelector = document.querySelector('#selectLGA')
      if (lgaList2[formattedState]) {
        lgaSelector.innerHTML = '<option>--Select LGA--</option>'
        lgaList2[formattedState].forEach(lga => {
          lgaSelector.innerHTML += `
              <option value="${lga}">${lga}</option>
              `;
        });
      }

      document.querySelector('.regInputs[data-name="lga"]').value = formattedLGA
    }

    if (isIndividual) {
      document.querySelector('.regInputs[data-name="first_name"]').value = record.first_name || '';
      document.querySelector('.regInputs[data-name="surname"]').value = record.last_name || '';
      document.querySelector('.regInputs[data-name="email"]').value = record.email_address || '';
      document.querySelector('.regInputs[data-name="phone"]').value = record.phone_no_1 || '';
      document.querySelector('.regInputs[data-name="tin"]').value = record.tin || '';

      document.querySelector('.regInputs[data-name="address"]').value =
        `${record.house_number || ''} ${record.street_name || ''}, ${record.city || ''}`.trim();
    } else {
      // For non-individual taxpayers
      document.querySelector('.regInputs[data-name="first_name"]').value = record.registered_name || '';
      document.querySelector('.regInputs[data-name="surname"]').value = record.main_trade_name || '';
      document.querySelector('.regInputs[data-name="email"]').value = record.email_address || '';
      document.querySelector('.regInputs[data-name="phone"]').value = record.phone_no_1 || '';
      document.querySelector('.regInputs[data-name="tin"]').value = record.tin || '';

      // Set business type to "yes" and select appropriate type
      document.getElementById('businessOwnerYes').checked = true;
      this.toggleBusinessType();

      document.querySelector('.regInputs[data-name="address"]').value =
        `${record.house_number || ''} ${record.street_name || ''}, ${record.city || ''}`.trim();
    }
  }

  showLoader() {
    this.validateBtn.disabled = true;
    this.validateBtn.innerHTML = `
      Validating...
      <iconify-icon icon="eos-icons:loading"></iconify-icon>
    `;
  }

  hideLoader() {
    this.validateBtn.disabled = false;
    this.validateBtn.innerHTML = `
      Validate
      <iconify-icon icon="material-symbols:line-end-arrow-notch-sharp"></iconify-icon>
    `;
  }

  showError(input, message) {
    const errorElement = input.nextElementSibling;
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
    input.classList.add('border-red-500');
  }

  hideError(input) {
    const errorElement = input.nextElementSibling;
    errorElement.textContent = '';
    errorElement.classList.add('hidden');
    input.classList.remove('border-red-500');
  }

  formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  toggleBusinessType() {
    // Implementation from previous code
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new CustomerValidation();
});

class RegistrationForm {
  constructor() {
    this.currentTab = 0;
    this.formSections = document.querySelectorAll('.formTabs');
    this.urlParams = new URLSearchParams(window.location.search);
    this.category = this.urlParams.get('category');
    this.createdBy = this.urlParams.get('createdby');
    this.adminId = this.urlParams.get('admin_id');
    // this.HOST = ''; // Set your API host here

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.showTab(this.currentTab);
    this.setupBusinessOwnerToggle();
    this.setupPasswordToggle();
    this.setupTINFormatting();
    this.setupPhoneValidation();
  }

  setupEventListeners() {
    // Form submissions
    // document.getElementById('validation-form')?.addEventListener('submit', (e) => this.handleFormSubmit(e, 1));
    document.getElementById('contact-form')?.addEventListener('submit', (e) => this.handleFormSubmit(e, 2));
    document.getElementById('CreateAccountBtn')?.addEventListener('click', (e) => this.handleFinalSubmit(e));
    document.querySelector(".back-btn")?.addEventListener("click", () => this.nextPrev(-1))

    // Previous button
    document.getElementById('prev-btn')?.addEventListener('click', () => {
      // console.log('Going back');
      this.nextPrev(-1);
    });

    // Business owner toggle
    document.querySelectorAll('.checki').forEach(radio => {
      radio.addEventListener('change', () => this.toggleBusinessType());
    });
  }

  showTab(n) {
    this.formSections.forEach((section, index) => {
      section.style.display = index === n ? 'block' : 'none';
    });
  }

  nextPrev(n) {
    if (n < 0) {
      this.formSections[this.currentTab].style.display = 'none';
      this.currentTab += n;
      if (this.currentTab < 0) this.currentTab = 0;
      this.showTab(this.currentTab);
      return;
    }

    if (this.validateCurrentTab()) {
      this.formSections[this.currentTab].style.display = 'none';
      this.currentTab += n;

      if (this.currentTab >= this.formSections.length) {
        return false;
      }

      this.showTab(this.currentTab);
    }
  }

  validateCurrentTab() {
    const currentSection = this.formSections[this.currentTab];
    const inputs = currentSection.querySelectorAll('.regInputs[required]');
    let isValid = true;

    inputs.forEach(input => {
      const errorElement = input.nextElementSibling;

      if (!input.value.trim()) {
        this.showError(input, 'This field is required');
        isValid = false;
      } else if (input.type === 'email' && !this.validateEmail(input.value)) {
        this.showError(input, 'Please enter a valid email address');
        isValid = false;
      } else if (input.id === 'phonenumber' && !this.validatePhone(input.value)) {
        this.showError(input, 'Phone number must be 11 digits');
        isValid = false;
      } else if (input.id === 'tinInput' && input.value && !this.validateTIN(input.value)) {
        this.showError(input, 'Please enter a valid TIN (format: 1234567890)');
        isValid = false;
      } else {
        this.hideError(input);
      }
    });

    return isValid;
  }

  handleFormSubmit(e, nextStep) {
    e.preventDefault();

    if (this.validateCurrentTab()) {
      this.nextPrev(nextStep);
    }
  }

  async handleFinalSubmit(e) {
    e.preventDefault();

    const password = document.getElementById('pps').value;
    const confirmPassword = document.getElementById('pps2').value;
    const msgBox = document.getElementById('msg-box');

    // Clear previous messages
    msgBox.innerHTML = '';

    // Validate password
    if (!password) {
      this.showError(document.getElementById('pps-cont'), 'Password cannot be empty');
      return;
    }

    // if (password.length < 8) {
    //   this.showError(document.getElementById('pps'), 'Password must be at least 8 characters');
    //   return;
    // }

    // if (!/[A-Z]/.test(password)) {
    //   this.showError(document.getElementById('pps'), 'Password must contain at least one uppercase letter');
    //   return;
    // }

    // if (!/[a-z]/.test(password)) {
    //   this.showError(document.getElementById('pps'), 'Password must contain at least one lowercase letter');
    //   return;
    // }

    // if (!/[0-9]/.test(password)) {
    //   this.showError(document.getElementById('pps'), 'Password must contain at least one number');
    //   return;
    // }

    if (password !== confirmPassword) {
      this.showError(document.getElementById('pps2-cont'), 'Passwords do not match');
      return;
    }

    // All validations passed - proceed with registration
    this.showLoader();
    $("#createAccountBtn").prop('disabled', true);
    try {
      const formData = this.collectFormData();

      const response = await this.submitForm(formData);


      this.handleRegistrationResponse(response);
    } catch (error) {
      this.showMessage('An error occurred. Please try again.', 'error');
      console.error('Registration error:', error);
    } finally {
      this.hideLoader();
      $("#createAccountBtn").prop('disabled', false);
    }
  }

  collectFormData() {
    const inputs = document.querySelectorAll('.regInputs');

    const businessTypeVal = $("#businessTypeSelect").val()
    let businessTypedata;

    if (businessTypeVal) {
      businessTypedata = flatBusinessTypes.find(ee => ee.business_type_name === businessTypeVal)
    }
    const data = {
      endpoint: "createPayerAccount",
      data: {
        verification_status: "nil",
        surname: "",
        img: "assets/img/userprofile.png",
        tax_number: "",
        business_type_id: businessTypedata.business_type_id || null,
        industry: businessTypedata.industry_name || null,
        category: this.getCategoryValue(),
        numberofstaff: "",
        created_by: this.createdBy || "self",
        by_account: this.adminId || null,
      }
    };

    inputs.forEach(input => {
      const value = input.dataset.name === 'email' ? input.value.trim() : input.value;
      data.data[input.dataset.name] = value;
    });

    console.log(data)
    return data;
  }

  getCategoryValue() {
    switch (this.category) {
      case 'individual': return 2;
      case 'corporate': return 1;
      case 'state': return 3;
      case 'NGO': return 5;
      default: return 4;
    }
  }

  async submitForm(data) {
    const response = await fetch(HOST, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  }

  handleRegistrationResponse(response) {
    const msgBox = document.getElementById('msg-box');

    if (response.status === 1) {
      msgBox.innerHTML = `<p class="text-success text-lg">${response.message}</p>`;

      if (this.createdBy === 'admin') {
        this.sendAdminEmail(response.id);
      } else {
        setTimeout(() => {
          window.location.href = `verification.html?id=${response.id}&email=${response.data.email}&phone=${response.data.phone}`;
        }, 1500);
      }

    } else if (response.status === 2) {
      msgBox.innerHTML = `
        <p class="text-warning text-lg">${response.message}</p>
        <p class="text-success text-lg mt-2">
          <a href="forgetpass.html" class="underline">Click here to reset your password</a>
        </p>
      `;
    } else {
      msgBox.innerHTML = `<p class="text-warning text-lg">${response.message}</p>`;
    }
  }

  async sendAdminEmail(userId) {
    const msgBox = document.getElementById('msg-box');

    try {
      await fetch(`${HOST}?sendEmail&id=${userId}`);
      msgBox.innerHTML += `
        <p class="text-success text-lg mt-2">An email has been sent to the User.</p>
        <div class="flex justify-center mt-4">
          <a class="button" href="admin/taxpayer.html">Go to Taxpayer</a>
        </div>
      `;
    } catch (error) {
      console.error('Failed to send email:', error);
      msgBox.innerHTML += `
        <div class="flex justify-center mt-4">
          <a class="button" href="admin/taxpayer.html">Go to Taxpayer</a>
        </div>
      `;
    }
  }

  // Helper methods
  showError(input, message) {
    const errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains('validate')) {
      errorElement.textContent = message;
      errorElement.classList.remove('hidden');
      input.classList.add('border-red-500');
    }
  }

  hideError(input) {
    const errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains('validate')) {
      errorElement.textContent = '';
      errorElement.classList.add('hidden');
      input.classList.remove('border-red-500');
    }
  }

  showLoader() {
    const msgBox = document.getElementById('msg-box');
    const loaderTemplate = document.getElementById('loader-template').cloneNode(true);
    loaderTemplate.classList.remove('hidden');
    msgBox.appendChild(loaderTemplate);
    document.getElementById('CreateAccountBtn').disabled = true;
  }

  hideLoader() {
    document.getElementById('CreateAccountBtn').disabled = false;
  }

  showMessage(message, type = 'success') {
    const msgBox = document.getElementById('msg-box');
    msgBox.innerHTML = `<p class="text-${type} text-lg">${message}</p>`;
  }

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  validatePhone(phone) {
    return /^\d{11}$/.test(phone);
  }

  validateTIN(tin) {
    return /^\d{10,}$/.test(tin);
  }

  setupBusinessOwnerToggle() {
    this.toggleBusinessType(); // Initialize on load

    document.querySelectorAll('.checki').forEach(radio => {
      radio.addEventListener('change', () => this.toggleBusinessType());
    });
  }



  toggleBusinessType() {
    const businessType = document.getElementById('businessType');
    const isBusinessOwner = document.getElementById('businessOwnerYes').checked;

    getBusinessType().then(() => {
      if (isBusinessOwner) {
        businessType.innerHTML = `
        <div class="flex gap-x-10 pt-2 px-3 items-center md:flex-nowrap sm:flex-wrap">
          <p>Type of business</p>
          <div class="form-group mb-2 md:w-[320px] w-full">
            <select class="mt-1 regInputs" required data-name="business_type" id="businessTypeSelect">
              <option value="" selected disabled>-Select the type of the business--</option>
              ${flatBusinessTypes.map(type => `
                <option value="${type.business_type_name}">${type.business_type_name}</option>
              `).join('')}
            </select>
            <small class="validate text-red-500 hidden"></small>
          </div>
        </div>
      `;

        $("#businessTypeSelect").selectize({
          create: false,
          sortField: 'text',
          placeholder: 'Search for your type of business',
          dropdownParent: 'body'
        });
      } else {
        businessType.innerHTML = '<div></div>';
      }
    })

  }

  setupPasswordToggle() {
    document.querySelectorAll('.togglePassword').forEach(icon => {
      icon.addEventListener('click', function () {
        const input = this.previousElementSibling;
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        this.classList.toggle('bi-eye');
        this.classList.toggle('bi-eye-slash');
      });
    });
  }

  setupTINFormatting() {
    const tinInput = document.getElementById('tinInput');
    if (tinInput) {
      tinInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 10) {
          value = value.slice(0, 10) + '-' + value.slice(10, 14);
        }
        e.target.value = value;
      });
    }
  }

  setupPhoneValidation() {
    const phoneInput = document.getElementById('phonenumber');
    if (phoneInput) {
      phoneInput.addEventListener('input', function (e) {
        this.value = this.value.replace(/\D/g, '').slice(0, 11);
      });
    }
  }
}

// Initialize the form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new RegistrationForm();
});