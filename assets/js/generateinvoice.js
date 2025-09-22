class InvoiceGenerator {
  constructor() {
    // HOST = ''; // Set your API host here
    this.paymentItems = [];
    this.revenueHeads = [];
    this.flatBusinessTypes = []
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
    this.getBusinessType()
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

    document.getElementById('skip-btn')?.addEventListener('click', () => {
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


    $(".checki").on("change", function () {
      let val = $(this).val();

      if (val === "yes") {
        $("#businessType").html(`
          <div class="flex gap-x-10 pt-2 px-3 items-center md:flex-nowrap sm:flex-wrap">
            <p>Type of business</p>
            <div class="form-group mb-2 md:w-[320px] w-full">
              <select class="mt-1 regInputs" required data-name="business_type" id="businessTypeSelect"></select>
              <small class="validate text-[red]"></small>
            </div>
          </div>
        `);
        this.populateBusinessTypeSelect(); // Populate after creating the select
      } else {
        $("#businessType").html(``);
      }
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
      case 'phone_no':
        input.placeholder = 'Enter your Phone (e.g., 08012345678)';
        input.pattern = "\\d{11}"; // 11-digit phone
        break;
      case 'email_or_phone':
        input.placeholder = 'Enter your Email or Phone (e.g., user@email.com or 08012345678)';
        input.pattern = "^(\\d{11}|[\\w.%+-]+@[\\w.-]+\\.[A-Za-z]{2,})$"; // 11-digit phone or email
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

      if ($("#businessTypeSelect").val() === "") {
        const errorElement = document.querySelector(".validate-business")
        if (errorElement && errorElement.classList.contains('validate')) {
          errorElement.textContent = "This field is required";
          errorElement.classList.remove('hidden');
        }
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

        // case 'tin':
        //   if (input.value && !/^\d{10}(-\d{4})?$/.test(input.value)) {
        //     this.showError(input, 'TIN must be 10 digits or 10-4 format');
        //     isValid = false;
        //   }
        //   break;

        // case 'address':
        //   if (input.value.length < 10) {
        //     this.showError(input, 'Address must be at least 10 characters');
        //     isValid = false;
        //   }
        //   break;
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

  async filterRevenueHeadsByMDA() {
    const mdaName = document.getElementById('selectMdaInput').value;

    if (!mdaName || mdaName === '') {
      await this.fetchRevenueHeads();
      this.populateRevenueHeads();
      return;
    }

    try {
      const response = await fetch(`${HOST}/?getMDAsRevenueHeads&mdName=${encodeURIComponent(mdaName)}`);
      const data = await response.json();

      if (data.status === 1) {
        this.revenueHeads = data.message;
        this.populateRevenueHeads();
      } else {
        await this.fetchRevenueHeads();
        this.populateRevenueHeads();
      }
    } catch (error) {
      console.error('Error filtering revenue heads:', error);
      await this.fetchRevenueHeads();
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

      $("#selectMdaInput").selectize({
        create: false,
        // sortField: 'text',
        placeholder: "Select MDA",
        dropdownParent: 'body',
        onChange: function (value) {
          this.filterRevenueHeadsByMDA();
        }.bind(this)
      });



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

  async getBusinessType() {
    try {
      const response = await fetch(`${HOST}?getIndustryHierarchy`);
      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();

      if (data.status === 1) {
        data.data.forEach(industry => {
          industry.sectors.forEach(sector => {
            sector.business_types.forEach(businessType => {
              this.flatBusinessTypes.push({
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

        // Populate any select that's already on the page
        this.populateBusinessTypeSelect();
      }
    } catch (error) {
      console.error(error);
    }
  }

  populateBusinessTypeSelect() {
    const selectEl = document.getElementById('businessTypeSelect');
    if (!selectEl) return;

    selectEl.innerHTML = '<option value="" selected disabled>-Select the type of the business--</option>'
    this.flatBusinessTypes.forEach(type => {
      selectEl.innerHTML += `<option value="${type.business_type_name}">${type.business_type_name}</option>`
    })

    const $select = $(selectEl);
    if ($select[0].selectize) {
      $select[0].selectize.destroy();
    }
    $select.selectize({
      create: false,
      sortField: 'text',
      placeholder: 'Search for your type of business',
      dropdownParent: 'body'
    });
  }

  populateRevenueHeads(container = null) {
    const selects = container ? [container] : document.querySelectorAll('.revHeadsss');

    selects.forEach(select => {
      // Destroy existing Selectize instance if it exists
      if (select.selectize) {
        select.selectize.destroy();
      }

      select.innerHTML = '<option disabled selected>Select--</option>';

      this.revenueHeads.forEach(rev => {
        const option = document.createElement('option');
        option.value = rev.id;
        option.textContent = rev.COL_4;
        select.appendChild(option);
      });

      // Initialize Selectize after populating
      // console.log(select)
      $(select).selectize({
        create: false,
        // sortField: 'text',
        placeholder: "Select revenue head",
        dropdownParent: 'body',
      });

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
      // Use the search parameter instead of method-specific parameters
      const response = await fetch(`https://payzamfara.com/php/JTD/get-taxpayer?search=${encodeURIComponent(value)}`);
      const data = await response.json();

      if (data.status === 'success' && data.data.length === 0) {
        this.handleTaxpayerNotFound();
      } else if (data.status === 'success') {
        this.displayTaxpayerInfo(data.data);
      } else {
        this.handleTaxpayerNotFound();
      }
    } catch (error) {
      console.error('Validation error:', error);
      this.showError('An error occurred while validating. Please try again.');
    } finally {
      this.hideLoader('#validate-btn');
    }
  }

  isIndividualTaxpayer(taxpayer) {
    // Check if this is an individual by looking for individual-specific fields
    return taxpayer.data && taxpayer.data.jtb &&
      (taxpayer.data.jtb.first_name !== undefined &&
        taxpayer.data.jtb.first_name !== null &&
        taxpayer.data.jtb.first_name !== '');
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

  displayTaxpayerInfo(taxpayers) {
    const container = document.getElementById('taxpayer-details');
    const optionsContainer = document.getElementById('taxpayer-options');
    container.innerHTML = '';
    optionsContainer.innerHTML = '';

    // Store the taxpayers data
    this.taxpayerData = taxpayers;

    // If single record, display directly
    if (taxpayers.length === 1) {
      this.renderTaxpayerDetails(taxpayers[0]);
      this.selectedTaxpayer = taxpayers[0];

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

      // Determine if individual or business
      const isIndividual = this.isIndividualTaxpayer(taxpayer);
      const record = taxpayer.data.jtb;

      if (isIndividual) {
        radioLabel.textContent = `${record.first_name} ${record.last_name} (${record.tin})`;
      } else {
        radioLabel.textContent = `${record.registered_name} (${record.tin})`;
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

    const isIndividual = this.isIndividualTaxpayer(taxpayer);
    const record = taxpayer.data.jtb;

    const details = isIndividual ? [
      { label: 'Name', value: `${record.first_name} ${record.last_name}` },
      { label: 'TIN', value: record.tin },
      { label: 'Gender', value: record.GenderName },
      { label: 'Date of Birth', value: this.formatDate(record.date_of_birth) },
      { label: 'Phone', value: record.phone_no_1 },
      { label: 'Email', value: record.email_address },
      { label: 'Address', value: `${record.house_number} ${record.street_name}, ${record.city}` },
      { label: 'LGA', value: record.LGAName },
      { label: 'State', value: record.StateName }
    ] : [
      { label: 'Registered Name', value: record.registered_name },
      { label: 'TIN', value: record.tin },
      { label: 'RC Number', value: record.registration_number },
      { label: 'Phone', value: record.phone_no_1 },
      { label: 'Email', value: record.email_address },
      { label: 'Address', value: `${record.house_number} ${record.street_name}, ${record.city}` },
      { label: 'LGA', value: record.LGAName },
      { label: 'State', value: record.StateName },
      { label: 'Director', value: `${record.director_name || ''} (${record.director_phone || ''})` }
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
    if (!this.taxpayerData || !this.taxpayerData[0].data || !this.taxpayerData[0].data.jtb) return;

    const record = this.taxpayerData[0].data.jtb;

    const categorySelect = document.getElementById('category');

    // Determine if individual or business
    const isIndividual = this.isIndividualTaxpayer(this.taxpayerData);

    if (isIndividual) {
      categorySelect.value = '2'; // 2 = Individual
    } else {
      categorySelect.value = '1'; // 1 = Company
    }
    categorySelect.dispatchEvent(new Event('change'));


    // Fill the form fields
    document.querySelector('.payInputs[data-name="first_name"]').value =
      isIndividual ? record.first_name || '' : record.registered_name || '';
    document.querySelector('.payInputs[data-name="surname"]').value =
      isIndividual ? record.last_name || '' : '';
    document.querySelector('.payInputs[data-name="email"]').value = record.email_address || '';
    document.querySelector('.payInputs[data-name="phone"]').value = record.phone_no_1 || '';
    document.querySelector('.payInputs[data-name="tin"]').value = record.tin || '';
    document.querySelector('.payInputs[data-name="address"]').value =
      `${record.house_number || ''} ${record.street_name || ''}, ${record.city || ''}`.trim();

    // Set state (this is a select element)
    const stateSelect = document.getElementById('selectState');
    if (stateSelect && record.StateName) {
      // Format state name: Capitalize first letter, lowercase the rest
      const formattedState = record.StateName.charAt(0).toUpperCase() +
        record.StateName.slice(1).toLowerCase();
      stateSelect.value = formattedState;
    }

    // Set LGA (this is a select element)
    const lgaSelect = document.getElementById('selectLGA');
    if (lgaSelect && record.LGAName) {
      // Try to find matching option
      const options = lgaSelect.options;
      for (let i = 0; i < options.length; i++) {
        if (options[i].text.toLowerCase() === record.LGAName.toLowerCase()) {
          lgaSelect.value = options[i].value;
          break;
        }
      }

      // If no exact match found, try to set by text content
      if (!lgaSelect.value && record.LGAName) {
        lgaSelect.value = record.LGAName;
      }
    }
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
    newItem.className = 'flex items-center gap-2 mb-4 itemRow';
    newItem.innerHTML = `
      <div class="form-group w-8/12">
        <select class="genInv revHeadsss" required>
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

    // Get the select element and populate it
    const selectElement = newItem.querySelector('.revHeadsss');
    this.populateRevenueHeads(selectElement); // This will now also initialize Select2
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
    const items = Array.from(document.querySelectorAll('.revHeadsss')).map((select) => {
      const selectizeInstance = select.selectize || (select.selectize = $(select)[0].selectize);
      if (!selectizeInstance) return null;

      const revenueHeadId = selectizeInstance.getValue();
      if (!revenueHeadId || revenueHeadId === 'Select--') return null;

      const selectedOption = selectizeInstance.options[revenueHeadId];
      const name = selectedOption ? selectedOption.text : '';

      // ✅ Find the amount input in the same row/parent
      const amountInput = select.closest('.itemRow')?.querySelector('.amountTopay');
      const rawValue = amountInput?.value.replace(/,/g, '') || '0';
      const amount = parseFloat(rawValue);

      if (isNaN(amount) || amount <= 0) return null;

      return {
        name,
        amount,
        revenue_head_id: revenueHeadId
      };
    }).filter(item => item !== null);

    // console.log(items)

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
      // console.log(input, previewInput, name);
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

    const businessTypeVal = $("#businessTypeSelect").val()
    let businessTypedata;

    if (businessTypeVal) {
      businessTypedata = this.flatBusinessTypes.find(ee => ee.business_type_name === businessTypeVal)
    }
    const formData = {
      endpoint: "createPayerAccount",
      data: {
        verification_status: "pending",
        img: "assets/img/userprofile.png",
        category: category,
        "business_type_id": businessTypedata ? businessTypedata.business_type_id : null,
        "industry": businessTypedata ? businessTypedata.industry_name : null,
        "business_type": $("#businessTypeSelect").val() || null,
        created_by: "self",
        by_account: null
      }
    };

    // Add all form data
    inputs.forEach(input => {
      if (input.dataset.name) {
        formData.data[input.dataset.name] = input.value.trim();
      }

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

    $('.amountTopay').each(function () {
      const amountValue = parseFloat($(this).val().replace(/,/g, ''));

      // find the revHeadsss in the same row/container
      const $select = $(this).closest('.itemRow').find('.revHeadsss');
      // ^ adjust `tr` to whatever parent wrapper you’re using

      if ($select.length && $select[0].selectize) {
        const selectedValue = $select[0].selectize.getValue();

        paymentItems.push({
          revenue_head_id: selectedValue,
          amount: amountValue
        });
      }
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