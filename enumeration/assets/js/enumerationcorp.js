const flatBusinessTypes = [];
const presumptiveBusiness = []

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

            $("#businessTypeSelect").append(`
              <option value="${businessType.business_type_name}">${businessType.business_type_name}</option>
            `)
          });
        });
      });
    }
  } catch (error) {
    console.log(error)
  }
}

// getBusinessType().then(() => {
//   $("#businessTypeSelect").selectize({
//     create: false,
//     sortField: 'text',
//     placeholder: 'Search for your type of business',
//     dropdownParent: 'body'
//   });
// })

async function fetchBusiness() {
  try {
    const response = await fetch(`${HOST}?getPresumptiveTax`)
    const data = await response.json()

    // console.log(data)

    if (data.status === 1) {

      data.message.forEach(dta => {
        presumptiveBusiness.push(dta)
        $("#businessTypeSelect").append(`
              <option value="${dta.business_type}">${dta.business_type}</option>
            `)
      })
      // data.message.forEach(busness => {
      //   businessTypes += `
      //     <option value="${busness.business_type}">${busness.business_type}</option>
      //   `

      //   $("#busiType").append(`
      //     <option value="${busness.business_type}">${busness.business_type}</option>
      //   `)
      // })
    }

  } catch (error) {
    console.log(error)
  }
}

fetchBusiness().then(e => {
  $("#businessTypeSelect").selectize({
    create: false,
    // sortField: 'text',
    placeholder: 'Search for your type of business',
    dropdownParent: 'body'
  });
})


class CustomerValidation {
  constructor() {
    this.apiBaseUrl = 'https://payzamfara.com/php/JTD';
    this.form = document.getElementById('validation-form');
    this.validationInput = document.getElementById('validationInput');
    this.validateBtn = document.getElementById('validate-btn');
    this.proceedBtn = document.getElementById('proceed-btn');
    this.skipBtn = document.getElementById('skip-btn');
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
        input.placeholder = 'Enter your JTB TIN (e.g., 0025152785)';
        input.pattern = "\\d{10}"; // 10-digit TIN pattern
        break;
      case 'registration_number':
        input.placeholder = 'Enter your RC Number (e.g., RC123456)';
        input.pattern = ".*"; // Accept any value
        break;
      case 'nin':
        input.placeholder = 'Enter your NIN (e.g., 12345678901)';
        input.pattern = "\\d{11}"; // 11-digit NIN
        break;
      case 'bvn':
        input.placeholder = 'Enter your BVN (e.g., 12345678901)';
        input.pattern = "\\d{11}"; // 11-digit BVN
        break;
      case 'phone_no':
        input.placeholder = 'Enter your Phone (e.g., 08012345678)';
        input.pattern = "\\d{11}"; // 11-digit phone
        break;
      case 'email_or_phone':
        input.placeholder = 'Enter your Email or Phone (e.g., user@email.com or 08012345678)';
        input.pattern = "^(\\d{11}|[\\w.%+-]+@[\\w.-]+\\.[A-Za-z]{2,})$"; // 11-digit phone or email
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
      // Handle BVN validation
      if (method === 'bvn') {
        await this.validateByBVN(value);
        return;
      }

      // Handle NIN validation
      if (method === 'nin') {
        await this.validateByNIN(value);
        return;
      }

      // Use the new API for email_or_phone method
      if (method === 'email_or_phone') {
        const response = await this.fetchUserByEmailOrPhone(value);

        if (response.status === 1) {
          this.displayUserInfo(response.user);
        } else {
          this.handleTaxpayerNotFound();
        }
      } else {
        // Use the original API for other methods
        const response = await this.fetchTaxpayer(method, value);

        if (response.status === 'success' && response.data.length === 0) {
          this.handleTaxpayerNotFound();
        } else if (response.status === 'success' && response.data.length > 0) {
          if (response.data.length > 1) {
            // If multiple records, pick the one that is non-individual (if exists)
            const nonIndividual = response.data.find(taxpayer => taxpayer.data.jtb.first_name === undefined);
            if (nonIndividual) {
              this.displayTaxpayerInfo(nonIndividual);
              return;
            }
          }
          // If only one record or no non-individual found, display the first one
          this.displayTaxpayerInfo(response.data[0]);
        } else {
          this.handleTaxpayerNotFound();
        }
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

  async fetchUserByEmailOrPhone(value) {
    const url = `https://payzamfara.com/php/?checkUsers&data=${encodeURIComponent(value)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  }

  async validateByBVN(bvn) {
    try {
      const response = await fetch('https://payzamfara.com/php/JTB/verify-bvn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bvn })
      });

      const data = await response.json();

      if (data.status === 'success') {
        const bvnData = data.data;
        const state = bvnData.stateOfOrigin ? bvnData.stateOfOrigin.replace(/\s*State\s*/i, '').trim() : '';

        const processedData = {
          fullname: `${bvnData.firstName || ''} ${bvnData.middleName || ''} ${bvnData.lastName || ''}`.trim(),
          address: bvnData.residentialAddress || '',
          phone: bvnData.phoneNumber1 || '',
          email: bvnData.email || '',
          state: state,
          lga: bvnData.lgaOfOrigin || ''
        };

        this.populateContactForm(processedData);
        this.proceedToNextStep();

      } else {
        Swal.fire({
          title: 'BVN Verification Failed',
          text: data.message || 'BVN verification failed. Would you like to register manually?',
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
    } catch (error) {
      console.error('BVN verification error:', error);
      Swal.fire({
        title: 'Error',
        text: 'BVN verification service unavailable. Please try again.',
        icon: 'error'
      });
    } finally {
      this.hideLoader();
    }
  }

  async validateByNIN(nin) {
    try {
      const response = await fetch('https://payzamfara.com/php/JTB/verify-nin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nin })
      });

      const data = await response.json();

      if (data.status === 'success') {
        const ninData = data.data;
        const personal = ninData.personalInfo;
        const contact = ninData.contactInfo;

        const processedData = {
          fullname: `${personal.firstName || ''} ${personal.middleName || ''} ${personal.surName || ''}`.trim(),
          address: contact.residenceAdressLine1 || '',
          phone: personal.phoneNumber || '',
          email: personal.email || '',
          state: contact.birthState || contact.originState || contact.residenceState || '',
          lga: contact.birthLga || contact.originLga || contact.residenceLga || ''
        };

        this.populateContactForm(processedData);
        this.proceedToNextStep();

      } else {
        Swal.fire({
          title: 'NIN Verification Failed',
          text: data.message || 'NIN verification failed. Would you like to register manually?',
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
    } catch (error) {
      console.error('NIN verification error:', error);
      Swal.fire({
        title: 'Error',
        text: 'NIN verification service unavailable. Please try again.',
        icon: 'error'
      });
    } finally {
      this.hideLoader();
    }
  }

  populateContactForm(data) {
    const companyNameInput = document.querySelector('.regInputs[data-name="first_name"]');
    if (companyNameInput && data.fullname) companyNameInput.value = data.fullname;

    const emailInput = document.querySelector('.regInputs[data-name="email"]');
    if (emailInput && data.email) emailInput.value = data.email;

    const phoneInput = document.querySelector('.regInputs[data-name="phone"]');
    if (phoneInput && data.phone) phoneInput.value = data.phone;

    const addressInput = document.querySelector('.regInputs[data-name="address"]');
    if (addressInput && data.address) addressInput.value = data.address;

    const stateSelect = document.getElementById('selectState');
    if (stateSelect && data.state) {
      const formattedState = data.state.charAt(0).toUpperCase() + data.state.slice(1).toLowerCase();
      stateSelect.value = formattedState;
    }

    const lgaSelect = document.getElementById('selectLGA');
    if (lgaSelect && data.lga) {
      const options = lgaSelect.options;
      for (let i = 0; i < options.length; i++) {
        if (options[i].text.toLowerCase() === data.lga.toLowerCase()) {
          lgaSelect.value = options[i].value;
          break;
        }
      }

      if (!lgaSelect.value && data.lga) {
        lgaSelect.value = data.lga;
      }
    }
  }

  displayUserInfo(user) {
    // Show the summary section
    this.taxpayerSummary.classList.remove('hidden');

    // Clear previous content
    this.taxpayerOptions.innerHTML = '';
    this.taxpayerDetails.innerHTML = '';

    // Store the original user data with a flag to identify it's from the new API
    const formattedUser = {
      tin: user.tin,
      data: user, // Store the original user object
      isNewAPI: true // Flag to identify this came from the new API
    };

    this.renderUserDetails(user);
    this.selectedTaxpayer = formattedUser;
  }

  renderUserDetails(user) {
    this.taxpayerDetails.innerHTML = '';

    const details = [
      { label: 'Full Name', value: `${user.first_name || ''} ${user.surname || ''}`.trim() },
      { label: 'TIN', value: user.tin },
      { label: 'Tax Number', value: user.tax_number },
      { label: 'Phone Number', value: user.phone },
      { label: 'Email', value: user.email },
      { label: 'Address', value: user.address },
      { label: 'Business Type', value: user.business_type },
      { label: 'LGA', value: user.lga },
      { label: 'State', value: user.state },
      { label: 'Category', value: user.category },
    ];

    details.forEach(detail => {
      if (detail.value && detail.value !== 'null' && detail.value !== 'None') {
        this.addDetailRow(detail.label, detail.value);
      }
    });
  }

  async fetchTaxpayer(method, value) {
    // const url = `${this.apiBaseUrl}/get-taxpayer?${method}=${encodeURIComponent(value)}`;
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

  displayTaxpayerInfo(taxpayerData) {
    // Show the summary section
    this.taxpayerSummary.classList.remove('hidden');

    // Clear previous content
    this.taxpayerOptions.innerHTML = '';
    this.taxpayerDetails.innerHTML = '';

    // Render the single taxpayer details
    this.renderTaxpayerDetails(taxpayerData);
    this.selectedTaxpayer = taxpayerData;
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

      // Determine if individual or non-individual
      const isIndividual = taxpayer.data.jtb.first_name !== undefined;

      if (isIndividual) {
        label.textContent = `${taxpayer.data.jtb.first_name} ${taxpayer.data.jtb.last_name} (${taxpayer.tin})`;
      } else {
        label.textContent = `${taxpayer.data.jtb.registered_name} (${taxpayer.tin})`;
      }

      div.appendChild(input);
      div.appendChild(label);
      optionsDiv.appendChild(div);
    });

    this.taxpayerOptions.appendChild(optionsDiv);
  }

  renderTaxpayerDetails(taxpayer) {
    this.taxpayerDetails.innerHTML = '';

    const jtbData = taxpayer.data.jtb;
    const isIndividual = jtbData.first_name !== undefined;

    if (isIndividual) {
      const details = [
        { label: 'Full Name', value: `${jtbData.Title || ''} ${jtbData.first_name || ''} ${jtbData.middle_name || ''} ${jtbData.last_name || ''}`.trim() },
        { label: 'TIN', value: taxpayer.tin },
        { label: 'Gender', value: jtbData.GenderName },
        { label: 'Date of Birth', value: this.formatDate(jtbData.date_of_birth) },
        { label: 'Marital Status', value: jtbData.MaritalStatus },
        { label: 'Occupation', value: jtbData.Occupation },
        { label: 'Phone Number', value: jtbData.phone_no_1 },
        { label: 'Email', value: jtbData.email_address },
        { label: 'Address', value: `${jtbData.house_number || ''} ${jtbData.street_name || ''}, ${jtbData.city || ''}`.trim() },
        { label: 'LGA', value: jtbData.LGAName },
        { label: 'State', value: jtbData.StateName },
        { label: 'Tax Authority', value: jtbData.TaxAuthorityName },
      ];

      details.forEach(detail => {
        if (detail.value) {
          this.addDetailRow(detail.label, detail.value);
        }
      });
    } else {
      const details = [
        { label: 'Registered Name', value: jtbData.registered_name },
        { label: 'Trade Name', value: jtbData.main_trade_name },
        { label: 'TIN', value: taxpayer.tin },
        { label: 'RC Number', value: jtbData.registration_number },
        { label: 'Organization Type', value: jtbData.org_type_name },
        { label: 'Phone Number', value: jtbData.phone_no_1 },
        { label: 'Email', value: jtbData.email_address },
        { label: 'Address', value: `${jtbData.house_number || ''} ${jtbData.street_name || ''}, ${jtbData.city || ''}`.trim() },
        { label: 'LGA', value: jtbData.LGAName },
        { label: 'State', value: jtbData.StateName },
        { label: 'Date of Incorporation', value: this.formatDate(jtbData.date_of_incorporation) },
        { label: 'Director', value: jtbData.director_name ? `${jtbData.director_name} (${jtbData.director_phone})` : '' },
      ];

      details.forEach(detail => {
        if (detail.value) {
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
      sessionStorage.setItem('taxpayerData', JSON.stringify(this.selectedTaxpayer));
    }

    // Hide the validation form and show the next section
    document.getElementById('customer-validation').style.display = 'none';
    document.getElementById('corporate-registration').style.display = 'block';

    // If we have taxpayer data, pre-fill the next form
    if (this.selectedTaxpayer) {
      this.prefillNextForm();
    }
  }

  prefillNextForm() {
    const taxpayer = this.selectedTaxpayer;

    console.log(taxpayer)
    if (!taxpayer) return;

    // Handle new API format
    if (taxpayer.isNewAPI) {
      const user = taxpayer.data;

      // Set state and LGA
      if (document.getElementById('STATES') && user.state) {
        let formattedState = user.state.charAt(0).toUpperCase() + user.state.slice(1).toLowerCase();
        let formattedLGA = user.lga
          ? user.lga
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
          : '';

        document.getElementById('STATES').value = formattedState;

        let lgaSelector = document.querySelector('#LGAs')
        if (lgaList[formattedState]) {
          lgaSelector.innerHTML = '<option>--Select LGA--</option>'
          lgaList[formattedState].forEach(lga => {
            lgaSelector.innerHTML += `
            <option value="${lga}">${lga}</option>
            `;
          });
        }

        document.querySelector('.regInputs[data-name="lga"]').value = formattedLGA;
      }

      // Fill form fields
      let the_full_name = `${user.first_name || ''} ${user.surname || ''}`.trim();
      document.querySelector('.regInputs[data-name="first_name"]').value = the_full_name || '';
      // document.querySelector('.regInputs[data-name="surname"]').value = user.surname || '';
      document.querySelector('.regInputs[data-name="email"]').value = user.email || '';
      document.querySelector('.regInputs[data-name="phone"]').value = user.phone || '';
      document.querySelector('.regInputs[data-name="tin"]').value = user.tin || '';
      document.querySelector('.regInputs[data-name="numberofstaff"]').value = user.number_of_staff || '';
      document.querySelector('.regInputs[data-name="business_type"]').value = user.business_type || '';
      // document.querySelector('.regInputs[data-name="tin"]').value = user.tin || '';
      document.querySelector('.regInputs[data-name="address"]').value = user.address || '';

      // For corporate registration, set business type if available
      if (user.business_type && user.business_type !== 'null' && user.business_type !== 'None') {
        // Set the business type in the dropdown after a short delay
        setTimeout(() => {
          const businessTypeSelect = document.getElementById('businessTypeSelect');
          if (businessTypeSelect) {
            businessTypeSelect.value = user.business_type;

            // Trigger change event if needed
            const event = new Event('change', { bubbles: true });
            businessTypeSelect.dispatchEvent(event);
          }
        }, 500);
      }

    } else {
      // Handle old JTB API format (your existing code)
      const jtbData = taxpayer.data.jtb;
      const isIndividual = jtbData.first_name !== undefined;

      // Set state and LGA if available in your form
      if (document.getElementById('STATES')) {
        let formattedState = jtbData.StateName ? jtbData.StateName.charAt(0).toUpperCase() + jtbData.StateName.slice(1).toLowerCase() : '';

        let formattedLGA = jtbData.LGAName
          ? jtbData.LGAName
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
          : '';

        document.getElementById('STATES').value = formattedState;

        let lgaSelector = document.querySelector('#LGAs')
        if (lgaList[formattedState]) {
          lgaSelector.innerHTML = '<option>--Select LGA--</option>'
          lgaList[formattedState].forEach(lga => {
            lgaSelector.innerHTML += `
            <option value="${lga}">${lga}</option>
            `;
          });
        }

        document.querySelector('.regInputs[data-name="lga"]').value = formattedLGA
      }

      if (isIndividual) {
        document.querySelector('.regInputs[data-name="first_name"]').value = jtbData.first_name || '';
        document.querySelector('.regInputs[data-name="surname"]').value = jtbData.last_name || '';
        document.querySelector('.regInputs[data-name="email"]').value = jtbData.email_address || '';
        document.querySelector('.regInputs[data-name="phone"]').value = jtbData.phone_no_1 || '';
        document.querySelector('.regInputs[data-name="tin"]').value = taxpayer.tin || '';

        document.querySelector('.regInputs[data-name="address"]').value =
          `${jtbData.house_number || ''} ${jtbData.street_name || ''}, ${jtbData.city || ''}`.trim();
      } else {
        // For non-individual taxpayers
        document.querySelector('.regInputs[data-name="first_name"]').value = jtbData.registered_name || '';
        document.querySelector('.regInputs[data-name="email"]').value = jtbData.email_address || '';
        document.querySelector('.regInputs[data-name="phone"]').value = jtbData.phone_no_1 || '';
        document.querySelector('.regInputs[data-name="tin"]').value = taxpayer.tin || '';

        document.querySelector('.regInputs[data-name="address"]').value =
          `${jtbData.house_number || ''} ${jtbData.street_name || ''}, ${jtbData.city || ''}`.trim();
      }
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
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new CustomerValidation();
});

class RegistrationForm {
  constructor() {
    this.currentTab = 0;
    this.formSections = document.querySelectorAll('.formTabs');
    this.prevBtns = document.querySelectorAll('.previous-btn')
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
    this.setupPasswordToggle();
    this.setupTINFormatting();
    this.setupPhoneValidation();
  }

  setupEventListeners() {
    // Form submissions
    // document.getElementById('validation-form')?.addEventListener('submit', (e) => this.handleFormSubmit(e, 1));
    document.getElementById('continueBtn')?.addEventListener('click', (e) => this.handleFormSubmit(e, 2));
    document.getElementById('continueBtn2')?.addEventListener('click', (e) => this.handleFormSubmit(e, 1));
    document.getElementById('CreateAccountBtn')?.addEventListener('click', (e) => this.handleFinalSubmit(e));
    document.querySelector(".back-btn")?.addEventListener("click", () => this.nextPrev(-1))

    this.prevBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.nextPrev(-1);
      });
    });
    // Previous button
    document.getElementById('prev-btn')?.addEventListener('click', () => {
      // console.log('Going back');
      this.nextPrev(-1);
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
    console.log(nextStep)
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
      businessTypedata = presumptiveBusiness.find(ee => ee.business_type === businessTypeVal)
    }

    const data = {
      endpoint: "createPayerAccount",
      data: {
        verification_status: "nil",
        surname: "",
        img: "assets/img/userprofile.png",
        tax_number: "",
        business_type_id: businessTypedata ? businessTypedata.id : null,
        industry: null,
        category: this.getCategoryValue(),
        numberofstaff: "",
        created_by: "enumerator",
        by_account: userInfo2?.id || null,
      }
    };

    inputs.forEach(input => {
      let value;
      if (input.dataset.name === 'email') {
        value = input.value.trim() || `payzamfarageneraluser@gmail.com`;
      } else {
        value = input.value;
      }
      data.data[input.dataset.name] = value;
    });
    return data;
  }

  getCategoryValue() {
    switch (this.category) {
      case 'individual': return 2;
      case 'corporate': return 1;
      case 'government': return 6;
      case 'NGO': return 5;
      default: return 1;
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

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Account successfully created!',
        showConfirmButton: true,
        confirmButtonText: 'Go to Taxpayers',
        allowOutsideClick: false
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = `taxpayer.html`;
        }
      });

      // if (this.createdBy === 'admin') {
      //   this.sendAdminEmail(response.id);
      // } else {
      //   setTimeout(() => {
      //     window.location.href = `verification.html?id=${response.id}&email=${response.data.email}&phone=${response.data.phone}`;
      //   }, 1500);
      // }

    } else if (response.status === 2) {
      msgBox.innerHTML = `
        <p class="text-warning text-lg">${response.message}</p>
        <!--<p class="text-success text-lg mt-2">
          <a href="forgetpass.html" class="underline">Click here to reset your password</a>
        </p>-->
      `;
    } else if (response.status === 3) {
      msgBox.innerHTML = `<p class="text-warning text-lg">${response.message}</p>`;
      this.sendAdminEmail(response.id);
    } else {
      msgBox.innerHTML = `<p class="text-error text-lg">${response.message || 'Registration failed. Please try again.'}</p>`;
    }
  }

  async sendAdminEmail(userId) {
    const msgBox = document.getElementById('msg-box');

    try {
      await fetch(`${HOST}?sendEmail&id=${userId}`);
      msgBox.innerHTML += `
        <p class="text-success text-lg mt-2">A verfication mail has been sent to the User.</p>
        <div class="flex justify-center mt-4">
          <a class="button" href="./taxpayer.html">Go to Taxpayer</a>
        </div>
      `;
    } catch (error) {
      console.error('Failed to send email:', error);
      msgBox.innerHTML += `
        <div class="flex justify-center mt-4">
          <a class="button" href="./taxpayer.html">Go to Taxpayer</a>
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