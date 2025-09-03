class InvoiceGenerator {
  constructor() {
    // HOST = ''; // Set your API host here
    this.paymentItems = [];
    this.revenueHeads = [];
    this.taxpayerData = null;
    this.currentTab = 0;
    this.formSections = document.querySelectorAll('.formTabs');
    this.zonalOffices = [];
    this.init();
  }

  init() {
    this.fetchZonalOffices();
    this.setupEventListeners();
    this.fetchInitialData();
    this.setupValidationToggle();
    this.showTab(this.currentTab);
  }

  setupEventListeners() {
    // Customer validation form
    document.getElementById('validate-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.validateTaxpayer();
    });

    // Proceed button
    document.getElementById('proceed-btn')?.addEventListener('click', () => {
      this.proceedToBilling();
    });

    // Add payment item button
    document.getElementById('add-item-btn')?.addEventListener('click', () => {
      this.addPaymentItem();
    });

    document.getElementById('continue-btn-personal')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.validatePersonalDetails();
    });

    // Continue to preview button
    document.getElementById('continue-btn')?.addEventListener('click', () => {
      this.validateBillingForm();
    });

    // Continue to preview button
    document.getElementById('generating_inv')?.addEventListener('click', () => {
      this.generateInvoiceNon();
    });


    // Category change
    document.getElementById('category')?.addEventListener('change', (e) => {
      this.updateContactFormLayout(e.target.value);
    });
  }

  async fetchInitialData() {
    try {
      await Promise.all([
        this.fetchRevenueHeads(),
        this.fetchMDAs(),
        this.fetchZonalOffices()
      ]);
    } catch (error) {
      console.error('Initial data fetch error:', error);
      // this.showError('Failed to load initial data. Please refresh the page.');
    }
  }

  setupValidationToggle() {
    // Radio button change listeners
    document.querySelectorAll('input[name="identificationMethod"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.updateInputPlaceholder(e.target.value);
      });
    });

    // Set initial placeholder
    this.updateInputPlaceholder('tin');
  }

  // Updated method to handle input placeholder and validation
  updateInputPlaceholder(method) {
    const input = document.getElementById('validationInput');
    input.dataset.name = method; // Update the data-name attribute

    switch (method) {
      case 'tin':
        input.placeholder = 'Enter your TIN (e.g., 0025152785)';
        input.pattern = "\\d{10}"; // 10-digit TIN pattern
        break;
      case 'registration_number':
        input.placeholder = 'Enter your RC Number (e.g., RC123456)';
        input.pattern = "RC\\d{6}"; // RC followed by 6 digits
        break;
      case 'nin':
        input.placeholder = 'Enter your NIN (e.g., 12345678901)';
        input.pattern = "\\d{11}"; // 11-digit NIN
        break;
      case 'phone_no':
        input.placeholder = 'Enter your Phone (e.g., 08012345678)';
        input.pattern = "\\d{11}"; // 11-digit phone
        break;
    }

    // Clear any previous validation messages
    this.hideError(input);
  }

  validatePersonalDetails() {
    const inputs = document.querySelectorAll('.payInputs[required]');
    let isValid = true;

    inputs.forEach(input => {
      // Clear previous errors
      this.hideError(input);

      // Check empty fields
      if (!input.value.trim()) {
        this.showError(input, 'This field is required');
        isValid = false;
        return;
      }

      // Field-specific validation
      switch (input.dataset.name) {
        case 'phone':
          if (!/^\d{11}$/.test(input.value)) {
            this.showError(input, 'Phone must be 11 digits');
            isValid = false;
          }
          break;

        case 'email':
          if (input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
            this.showError(input, 'Please enter a valid email');
            isValid = false;
          }
          break;

        case 'tin':
          if (input.value && !/^\d{10}(-\d{4})?$/.test(input.value)) {
            this.showError(input, 'TIN must be 10 digits or 10-4 format');
            isValid = false;
          }
          break;

        case 'address':
          if (input.value.length < 10) {
            this.showError(input, 'Address must be at least 10 characters');
            isValid = false;
          }
          break;
      }
    });

    // Validate LGA selection
    const lgaSelect = document.getElementById('selectLGA');
    if (lgaSelect && lgaSelect.value === '') {
      this.showError(lgaSelect, 'Please select an LGA');
      isValid = false;
    }

    if (isValid) {
      // this.prepareInvoicePreview();
      this.nextTab();
    }
  }


  async fetchRevenueHeads() {
    const response = await fetch(`${HOST}/?getAllRevenueHeads`);
    const data = await response.json();

    if (data.status === 1) {
      this.revenueHeads = data.message;
      this.populateRevenueHeads();
    }
  }

  async fetchMDAs() {
    const response = await fetch(`${HOST}/?getMDAs`);
    const data = await response.json();

    if (data.status === 1) {
      const select = document.getElementById('selectMdaInput');
      select.innerHTML = '<option disabled selected>Select MDA</option>';

      data.message.forEach(mda => {
        const option = document.createElement('option');
        option.value = mda.fullname;
        option.textContent = mda.fullname;
        select.appendChild(option);
      });

      select.addEventListener('change', () => this.filterRevenueHeadsByMDA());
    }
  }

  async filterRevenueHeadsByMDA() {
    const mdaName = document.getElementById('selectMdaInput').value;
    if (!mdaName || mdaName === 'Select MDA') {
      this.populateRevenueHeads();
      return;
    }

    try {
      const response = await fetch(`${HOST}/?getMDAsRevenueHeads&mdName=${encodeURIComponent(mdaName)}`);
      const data = await response.json();

      const selects = document.querySelectorAll('.revHeadsss');
      selects.forEach(select => {
        select.innerHTML = '<option disabled selected>Select--</option>';

        if (data.status === 1) {
          data.message.forEach(revHd => {
            const option = document.createElement('option');
            option.value = revHd.id;
            option.textContent = revHd.COL_4;
            select.appendChild(option);
          });
        } else {
          // Fallback to all revenue heads if filtered request fails
          this.revenueHeads.forEach(rev => {
            const option = document.createElement('option');
            option.value = rev.id;
            option.textContent = rev.COL_4;
            select.appendChild(option);
          });
        }
      });
    } catch (error) {
      console.error('Error filtering revenue heads:', error);
      // Fallback to all revenue heads
      this.populateRevenueHeads();
    }
  }

  async fetchZonalOffices() {
    const response = await fetch(`${HOST}/?tax_offices`);
    const data = await response.json();

    if (data.status === 1) {
      this.zonalOffices = data.message;

      // Setup LGA change listener
      document.getElementById('LGAaas')?.addEventListener('change', (e) => {
        this.filterZonalOffices(e.target.value);
      });
    }
  }

  filterZonalOffices(lga) {
    const select = document.getElementById('zonalOff');
    select.innerHTML = '<option disabled selected>Select--</option>';

    if (lga && this.zonalOffices) {
      const filtered = this.zonalOffices.filter(office => office.lga.includes(lga));

      filtered.forEach(office => {
        const option = document.createElement('option');
        option.value = office.id;
        option.selected = true
        option.textContent = office.office_name;
        select.appendChild(option);
      });
    }
  }

  populateRevenueHeads(container = null) {
    const select = container || document.querySelector('#payment-items-container .revHeadsss');
    select.innerHTML = '<option disabled selected>Select--</option>';

    this.revenueHeads.forEach(rev => {
      const option = document.createElement('option');
      option.value = rev.id;
      option.textContent = rev.COL_4;
      select.appendChild(option);
    });
  }

  async validateTaxpayer() {
    const method = document.querySelector('input[name="identificationMethod"]:checked').value;
    const input = document.getElementById('validationInput');
    const value = input.value.trim();

    // Basic validation
    if (!value) {
      this.showError(input, 'This field is required');
      return;
    }

    // Pattern validation
    if (input.pattern && !new RegExp(input.pattern).test(value)) {
      let errorMsg = '';
      switch (method) {
        case 'tin': errorMsg = 'Please enter a valid 10-digit TIN'; break;
        case 'registration_number': errorMsg = 'RC Number should be in format RC123456'; break;
        case 'nin': errorMsg = 'NIN should be 11 digits'; break;
        case 'phone_no': errorMsg = 'Phone number should be 11 digits'; break;
      }
      this.showError(input, errorMsg);
      return;
    }

    this.showLoader('#validate-btn');

    try {
      const response = await fetch(`https://payzamfara.com/php/JTD/get-taxpayer?${method}=${encodeURIComponent(value)}`);
      const data = await response.json();

      if (data.status === 'error') {
        this.handleTaxpayerNotFound();
      } else {
        // console.log(data.data)
        this.displayTaxpayerInfo(data.data);
      }
    } catch (error) {
      console.error('Validation error:', error);
      this.showError('An error occurred while validating. Please try again.');
    } finally {
      this.hideLoader('#validate-btn');
    }
  }

  // Enhanced taxpayer not found handler
  handleTaxpayerNotFound() {
    Swal.fire({
      title: 'Taxpayer Not Found',
      html: `
        <p>No taxpayer record was found with the provided information.</p>
        <p>Would you like to:</p>
      `,
      icon: 'warning',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Try Again',
      denyButtonText: 'Fill Form Manually',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isDenied) {
        // Proceed to manual form
        this.proceedToBilling();
      } else if (result.isConfirmed) {
        // Clear input and focus
        const input = document.getElementById('validationInput');
        input.value = '';
        input.focus();
      }
    });
  }

  // displayTaxpayerInfo(taxpayer) {
  //   this.taxpayerData = taxpayer;
  //   const container = document.getElementById('taxpayer-details');
  //   container.innerHTML = '';

  //   const details = taxpayer.type === 'individual' ? [
  //     { label: 'Name', value: `${taxpayer.record.first_name} ${taxpayer.record.last_name}` },
  //     { label: 'TIN', value: taxpayer.record.tin },
  //     { label: 'Phone', value: taxpayer.record.phone_no_1 },
  //     { label: 'Email', value: taxpayer.record.email_address },
  //     { label: 'Address', value: `${taxpayer.record.house_number} ${taxpayer.record.street_name}, ${taxpayer.record.city}` },
  //     { label: 'LGA', value: taxpayer.record.LGAName }
  //   ] : [
  //     { label: 'Registered Name', value: taxpayer.record.registered_name },
  //     { label: 'TIN', value: taxpayer.record.tin },
  //     { label: 'RC Number', value: taxpayer.record.registration_number },
  //     { label: 'Phone', value: taxpayer.record.phone_no_1 },
  //     { label: 'Email', value: taxpayer.record.email_address },
  //     { label: 'Address', value: `${taxpayer.record.house_number} ${taxpayer.record.street_name}, ${taxpayer.record.city}` }
  //   ];

  //   details.forEach(detail => {
  //     if (detail.value) {
  //       const div = document.createElement('div');
  //       div.className = 'mb-2';

  //       const labelSpan = document.createElement('span');
  //       labelSpan.className = 'font-semibold text-sm';
  //       labelSpan.textContent = `${detail.label}: `;

  //       const valueSpan = document.createElement('span');
  //       valueSpan.className = 'text-sm';
  //       valueSpan.textContent = detail.value;

  //       div.appendChild(labelSpan);
  //       div.appendChild(valueSpan);
  //       container.appendChild(div);
  //     }
  //   });

  //   document.getElementById('taxpayer-summary').classList.remove('hidden');
  // }

  displayTaxpayerInfo(taxpayers) {
    const container = document.getElementById('taxpayer-details');
    const optionsContainer = document.getElementById('taxpayer-options');
    container.innerHTML = '';
    optionsContainer.innerHTML = '';

    // Store the taxpayers data
    this.taxpayerData = taxpayers;

    // If single record, display directly
    if (taxpayers.record) {
      this.renderTaxpayerDetails(taxpayers);
      this.selectedTaxpayer = taxpayers;

      document.getElementById('taxpayer-summary').classList.remove('hidden');
      return;
    }

    // For multiple records, show selection UI
    const selectionDiv = document.createElement('div');
    selectionDiv.className = 'mb-4';

    const label = document.createElement('label');
    label.className = 'block text-sm font-medium text-gray-700 mb-2';
    label.textContent = 'Multiple records found. Please select one:';
    selectionDiv.appendChild(label);

    taxpayers.forEach((taxpayer, index) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'flex items-center mb-2';

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'taxpayerOption';
      radio.id = `taxpayer-${index}`;
      radio.value = index;
      radio.className = 'mr-2';
      radio.addEventListener('change', () => {
        this.selectedTaxpayer = taxpayer;
        this.taxpayerData = taxpayer;
        this.renderTaxpayerDetails(taxpayer);
      });

      // Select first record by default
      if (index === 0) {
        radio.checked = true;
        this.selectedTaxpayer = taxpayer;
        this.taxpayerData = taxpayer;
        this.renderTaxpayerDetails(taxpayer);
      }

      const radioLabel = document.createElement('label');
      radioLabel.htmlFor = `taxpayer-${index}`;
      radioLabel.className = 'text-sm';

      // Create display text based on taxpayer type
      if (taxpayer.type === 'individual') {
        radioLabel.textContent = `${taxpayer.record.first_name} ${taxpayer.record.last_name} (${taxpayer.record.tin})`;
      } else {
        radioLabel.textContent = `${taxpayer.record.registered_name} (${taxpayer.record.tin})`;
      }

      wrapper.appendChild(radio);
      wrapper.appendChild(radioLabel);
      selectionDiv.appendChild(wrapper);
    });

    optionsContainer.appendChild(selectionDiv);
    document.getElementById('taxpayer-summary').classList.remove('hidden');
  }

  renderTaxpayerDetails(taxpayer) {
    const container = document.getElementById('taxpayer-details');
    container.innerHTML = '';

    const details = taxpayer.type === 'individual' ? [
      { label: 'Name', value: `${taxpayer.record.first_name} ${taxpayer.record.last_name}` },
      { label: 'TIN', value: taxpayer.record.tin },
      { label: 'Gender', value: taxpayer.record.GenderName },
      { label: 'Date of Birth', value: this.formatDate(taxpayer.record.date_of_birth) },
      { label: 'Phone', value: taxpayer.record.phone_no_1 },
      { label: 'Email', value: taxpayer.record.email_address },
      { label: 'Address', value: `${taxpayer.record.house_number} ${taxpayer.record.street_name}, ${taxpayer.record.city}` },
      { label: 'LGA', value: taxpayer.record.LGAName },
      { label: 'State', value: taxpayer.record.StateName }
    ] : [
      { label: 'Registered Name', value: taxpayer.record.registered_name },
      { label: 'TIN', value: taxpayer.record.tin },
      { label: 'RC Number', value: taxpayer.record.registration_number },
      { label: 'Phone', value: taxpayer.record.phone_no_1 },
      { label: 'Email', value: taxpayer.record.email_address },
      { label: 'Address', value: `${taxpayer.record.house_number} ${taxpayer.record.street_name}, ${taxpayer.record.city}` },
      { label: 'LGA', value: taxpayer.record.LGAName },
      { label: 'State', value: taxpayer.record.StateName },
      { label: 'Director', value: `${taxpayer.record.director_name} (${taxpayer.record.director_phone})` }
    ];

    details.forEach(detail => {
      if (detail.value) {
        const div = document.createElement('div');
        div.className = 'mb-2';

        const labelSpan = document.createElement('span');
        labelSpan.className = 'font-semibold text-sm';
        labelSpan.textContent = `${detail.label}: `;

        const valueSpan = document.createElement('span');
        valueSpan.className = 'text-sm';
        valueSpan.textContent = detail.value;

        div.appendChild(labelSpan);
        div.appendChild(valueSpan);
        container.appendChild(div);
      }
    });
  }

  formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  proceedToBilling() {
    // if (!this.selectedTaxpayer) {
    //   this.showError('Please select a taxpayer record');
    //   return;
    // }
    this.nextTab();

    // Pre-fill contact form if we have taxpayer data
    if (this.taxpayerData) {
      this.prefillContactForm();
    }
  }

  prefillContactForm() {
    const record = this.taxpayerData.record;
    const categorySelect = document.getElementById('category');
    if (this.taxpayerData.type === 'individual') {
      categorySelect.value = '2'; // 2 = Individual
    } else {
      categorySelect.value = '1'; // 1 = Company
    }
    categorySelect.dispatchEvent(new Event('change'));

    document.querySelector('.payInputs[data-name="first_name"]').value =
      this.taxpayerData.type === 'individual' ? record.first_name : record.registered_name;
    document.querySelector('.payInputs[data-name="surname"]').value =
      this.taxpayerData.type === 'individual' ? record.last_name : '';
    document.querySelector('.payInputs[data-name="email"]').value = record.email_address || '';
    document.querySelector('.payInputs[data-name="phone"]').value = record.phone_no_1 || '';

    document.querySelector('.payInputs[data-name="tin"]').value = record.tin || '';
    document.querySelector('.payInputs[data-name="address"]').value =
      `${record.house_number || ''} ${record.street_name || ''}, ${record.city || ''}`.trim();
  }

  updateContactFormLayout(category) {
    const nameContainer = document.getElementById('theName');

    if (category === '2') {
      nameContainer.innerHTML = `
        <div class="form-group w-full">
          <label>First name *</label>
          <input type="text" class="form-control payInputs" required data-name="first_name" placeholder="">
        </div>
        <div class="form-group w-full">
          <label>Surname *</label>
          <input type="text" class="form-control payInputs" required data-name="surname" placeholder="">
        </div>
      `;
    } else {
      const label = category === '1' ? 'Company Name' : 'Name of Agency';
      nameContainer.innerHTML = `
        <div class="form-group w-full">
          <label>${label} *</label>
          <input type="text" class="form-control payInputs" required data-name="first_name" placeholder="">
        </div>
        <div class="form-group w-full hidden">
          <label>Surname *</label>
          <input type="text" class="form-control payInputs" data-name="surname" value=" ">
        </div>
      `;
    }
  }

  addPaymentItem() {
    const container = document.getElementById('payment-items-container');
    const newItem = document.createElement('div');
    newItem.className = 'flex items-center gap-2 mb-4';
    newItem.innerHTML = `
      <div class="form-group w-8/12">
        <select class="form-select genInv revHeadsss h-[40px]" required>
          <option disabled selected>Select--</option>
        </select>
      </div>
      <div class="form-group w-4/12">
        <input type="text" class="form-control genInv amountTopay h-[40px]" required>
      </div>
      <iconify-icon icon="zondicons:minus-outline" class="cursor-pointer" 
        onclick="this.parentElement.remove()"></iconify-icon>
    `;

    container.appendChild(newItem);
    this.populateRevenueHeads(newItem.querySelector('.revHeadsss'));
  }

  validateBillingForm() {
    const requiredFields = document.querySelectorAll('.genInv[required]');
    let isValid = true;

    for (const field of requiredFields) {
      if (!field.value.trim()) {
        this.showError(field, 'This field is required');
        isValid = false;
        break;
      }

      if (field.classList.contains('amountTopay') && isNaN(parseFloat(field.value))) {
        this.showError(field, 'Please enter a valid amount');
        isValid = false;
        break;
      }
    }

    if (isValid) {
      this.prepareInvoicePreview();
      this.nextTab();
    }
  }

  prepareInvoicePreview() {
    const category = document.querySelector('#category option:checked').textContent;
    const items = Array.from(document.querySelectorAll('.revHeadsss')).map((select, index) => {
      return {
        name: select.options[select.selectedIndex].text,
        amount: parseFloat(document.querySelectorAll('.amountTopay')[index].value.replace(/,/g, ''))
      };
    });

    const total = items.reduce((sum, item) => sum + item.amount, 0);
    const description = document.getElementById('thedescripInput').value;

    // Generate preview HTML
    let previewHTML = `
      <div class="flex space-x-4">
        <p>Category of Tax:</p>
        <p>${category}</p>
      </div>
    `;

    items.forEach((item, index) => {
      previewHTML += `
        <div class="flex space-x-3">
          <p>Item ${index + 1}:</p>
          <p>${item.name}</p>
        </div>  
        <div class="flex space-x-3">
          <p>Amount:</p>
          <p>${this.formatMoney(item.amount)}</p>
        </div>  
      `;
    });

    previewHTML += `
      <div class="flex space-x-3">
        <p>Total Amount:</p>
        <p>${this.formatMoney(total)}</p>
      </div>
      <div class="flex space-x-3">
        <p>Description:</p>
        <p>${description}</p>
      </div>
    `;

    document.getElementById('bill').innerHTML = previewHTML;
    this.paymentItems = items;

    // Populate the preview fields with values from payInputs
    const payInputs = document.querySelectorAll('.payInputs');
    payInputs.forEach(input => {
      const name = input.dataset.name;
      const previewInput = document.querySelector(`.payInputs2[data-name="${name}"]`);
      console.log(previewInput.value, input.value);
      if (previewInput) {
        previewInput.value = input.value;
      }
    });
  }

  async generateInvoiceNon() {
    const btn = document.getElementById('generating_inv');
    const msgBox = document.getElementById('msg_box');

    try {
      // Show loading state
      btn.disabled = true;
      btn.innerHTML = 'Generating...';
      msgBox.innerHTML = `
            <div class="flex justify-center items-center mt-4">
                <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
            </div>
        `;

      // 1. Create or update taxpayer account
      const taxpayerDataa = await this.createTaxpayerAccount();
      // 2. Generate invoice
      const invoiceData = await this.createInvoice(taxpayerDataa.tax_number);

      // 3. Display the invoice
      this.showInvoiceSuccess(invoiceData);
      // this.displayInvoice(invoiceData);

    } catch (error) {
      console.error('Invoice generation error:', error);
      msgBox.innerHTML = `
            <p class="text-danger text-center mt-4 text-lg">
                Error generating invoice: ${error.message || 'Please try again'}
            </p>
        `;
    } finally {
      btn.disabled = false;
      btn.innerHTML = 'Continue';
      msgBox.innerHTML = ""
    }
  }

  async createTaxpayerAccount() {
    // Get all input values
    const inputs = document.querySelectorAll('.payInputs');
    const category = document.getElementById('category').value;
    const formData = {
      endpoint: "createPayerAccount",
      data: {
        verification_status: "pending",
        img: "assets/img/userprofile.png",
        category: category,
        created_by: "self",
        by_account: null
      }
    };

    // Add all form data
    inputs.forEach(input => {
      formData.data[input.dataset.name] = input.value.trim();
    });

    // Handle empty email case
    if (!formData.data.email) {
      formData.data.email = "payzamfarageneraluser@gmail.com";
    }

    // Make API request
    const response = await fetch(HOST, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    // if (data.status !== 1) {
    //   throw new Error(data.message || 'Failed to create taxpayer account');
    // }

    return data.data; // Contains tax_number and other details
  }

  async createInvoice(taxNumber) {
    // Collect all payment items
    const paymentItems = [];
    const revHeadSelects = document.querySelectorAll('.revHeadsss');
    const amountInputs = document.querySelectorAll('.amountTopay');

    revHeadSelects.forEach((select, index) => {
      paymentItems.push({
        revenue_head_id: select.value,
        amount: parseFloat(amountInputs[index].value.replace(/,/g, ''))
      });
    });

    // Prepare invoice data
    const invoiceData = {
      tax_number: taxNumber,
      items: paymentItems,
      description: document.getElementById('thedescripInput').value,
      lga: document.getElementById('LGAaas').value,
      zonalOffice: document.getElementById('zonalOff').value,
    };

    let urlParamsAnotherRemita = new URLSearchParams(window.location.search);
    let remitaPageUrl = urlParamsAnotherRemita.get('redirected')

    // Make API request
    const params = new URLSearchParams();
    params.append('generateSingleInvoices', 'true');
    params.append('tax_number', invoiceData.tax_number);
    params.append('revenue_head_id', invoiceData.items.map(item => item.revenue_head_id).join(','));
    params.append('price', invoiceData.items.map(item => item.amount).join(','));
    params.append('description', invoiceData.description);
    params.append('lga', invoiceData.lga);
    params.append('zonalOffice', invoiceData.zonalOffice);
    params.append('invoice_type', 'invoice');
    // Add remita_redirected param based on remitaPageUrl
    params.append('remita_redirected', remitaPageUrl === "remita" ? 1 : 0);
    // params.append('business_type', invoiceData.business_type);
    // params.append('previous_year', invoiceData.previous_year);
    // params.append('file_no', invoiceData.file_no);

    const response = await fetch(`${HOST}?${params.toString()}`);
    const data = await response.json();

    if (data.status !== 1) {
      throw new Error(data.message || 'Failed to generate invoice');
    }

    return data; // Contains invoice_number and other details
  }

  showInvoiceSuccess(invoiceData) {
    Swal.fire({
      title: 'Invoice Generated',
      text: 'Invoice has been generated successfully!',
      icon: 'success',
      confirmButtonText: 'View Invoice'
    }).then(() => {
      nextPrev(1)
      openInvoice(invoiceData.invoice_number, invoiceData.amount_paid)
      // this.nextTab();
      // this.displayInvoice(invoiceData);
    });
  }

  displayInvoice(invoiceData) {
    window.location.href = `https://payzamfara.com/viewinvoice.html?invnumber=${invoiceData.invoice_number}&load=true`
  }

  // Helper methods
  showTab(index) {
    this.formSections.forEach((section, i) => {
      section.style.display = i === index ? 'block' : 'none';
    });
  }

  nextTab() {
    nextPrev(1);
  }

  prevTab() {
    nextPrev(-1);
  }

  showLoader(buttonId) {
    const button = document.querySelector(buttonId);
    if (button) {
      button.disabled = true;
      button.innerHTML = `
        Processing...
        <iconify-icon icon="eos-icons:loading"></iconify-icon>
      `;
    }
  }

  hideLoader(buttonId) {
    const button = document.querySelector(buttonId);
    if (button) {
      button.disabled = false;
      button.innerHTML = `
      Validate
      <iconify-icon icon="material-symbols:line-end-arrow-notch-sharp"></iconify-icon>`;
    }
  }

  showError(element, message) {
    if (typeof element === 'string') {
      // Global error message
      // Swal.fire({
      //   title: 'Error',
      //   text: element,
      //   icon: 'error'
      // });
    } else {
      // Field-specific error
      const errorElement = element.nextElementSibling;
      if (errorElement && errorElement.classList.contains('validate')) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
        element.classList.add('border-red-500');
      }
    }
  }

  hideError(inputElement) {
    // If passed a string selector, get the element
    const element = typeof inputElement === 'string'
      ? document.querySelector(inputElement)
      : inputElement;

    if (!element) return;

    // Find the error message element (next sibling with .validate class)
    const errorElement = element.nextElementSibling?.classList?.contains('validate')
      ? element.nextElementSibling
      : null;

    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.add('hidden');
    }

    // Remove error styling from input
    element.classList.remove('border-red-500');
    element.classList.remove('ring-1', 'ring-red-500'); // Optional: Remove Tailwind error ring if using
  }

  formatMoney(amount) {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new InvoiceGenerator();
});



async function automatedHook() {
  try {
    const response = await fetch(`https://payzamfara.com/php/payStack/verify_payment_paystackInternal_log.php`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const hook = await response.json();
    console.log(hook);
  } catch (error) {
    console.error('Error fetching hook data:', error);
  }
}

automatedHook();