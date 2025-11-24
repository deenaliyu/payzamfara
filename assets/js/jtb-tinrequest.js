// Configuration
const JTB_BASE_URL = 'https://payzamfara.com/php/JTB';

// ============= HELPER FUNCTIONS =============

// Show loading state
function showLoading(message = 'Processing...') {
  Swal.fire({
    title: message,
    // html: '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>',
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
}

// Show success message
function showSuccess(title, html) {
  Swal.fire({
    icon: 'success',
    title: title,
    html: html,
    confirmButtonText: 'OK',
    confirmButtonColor: '#28a745'
  });
}

// Show error message
function showError(title, message) {
  Swal.fire({
    icon: 'error',
    title: title,
    text: message,
    confirmButtonText: 'OK',
    confirmButtonColor: '#dc3545'
  });
}

// Show warning message
function showWarning(title, message) {
  Swal.fire({
    icon: 'warning',
    title: title,
    text: message,
    confirmButtonText: 'OK',
    confirmButtonColor: '#ffc107'
  });
}

// Format date to DD-MM-YYYY
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// Convert file to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Get base64 string without the data URL prefix
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

// Parse BVN date format (19-Mar-2003) to YYYY-MM-DD
function parseBvnDate(dateStr) {
  if (!dateStr) return '';
  const months = {
    'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
    'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
  };

  const parts = dateStr.split('-');
  if (parts.length !== 3) return '';

  const day = parts[0].padStart(2, '0');
  const month = months[parts[1]];
  const year = parts[2];

  return `${year}-${month}-${day}`;
}

// Store BVN verification data
let bvnVerificationData = null;

// Verify BVN
async function verifyBVN(bvn) {
  try {
    showLoading('Verifying BVN...');

    const response = await fetch(`${JTB_BASE_URL}/verify-bvn`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ bvn: bvn })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('BVN Verification Response:', result);

    Swal.close();

    if (result.status === 'success') {
      bvnVerificationData = result.data;
      return {
        success: true,
        data: result.data
      };
    } else {
      return {
        success: false,
        message: result.message || 'BVN verification failed. Please check the BVN and try again.'
      };
    }
  } catch (error) {
    Swal.close();
    console.error('Error verifying BVN:', error);
    return {
      success: false,
      message: error.message || 'Network error occurred while verifying BVN. Please check your connection and try again.'
    };
  }
}

// Format phone number to international format
function formatPhoneNumber(phone) {
  // Remove all non-numeric characters except +
  let cleaned = phone.replace(/[^0-9+]/g, '');

  // If starts with 0, replace with +234
  if (cleaned.startsWith('0')) {
    cleaned = '+234' + cleaned.substring(1);
  }

  // If doesn't start with +, add +234
  if (!cleaned.startsWith('+')) {
    cleaned = '+234' + cleaned;
  }

  return cleaned;
}

// ============= VALIDATION FUNCTIONS =============

// Validate BVN (11 digits)
function validateBVN(bvn) {
  const bvnRegex = /^[0-9]{11}$/;
  return bvnRegex.test(bvn);
}

// Validate NIN (11 digits)
function validateNIN(nin) {
  const ninRegex = /^[0-9]{11}$/;
  return ninRegex.test(nin);
}

// Validate email
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone number
function validatePhone(phone) {
  const cleaned = phone.replace(/[^0-9+]/g, '');
  // Should be 14 chars (+234XXXXXXXXXX) or 11 chars (0XXXXXXXXXX)
  return cleaned.length >= 11 && cleaned.length <= 14;
}

// Validate date of birth (must be 18+ years old)
function validateDOB(dob) {
  const birthDate = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1 >= 18;
  }
  return age >= 18;
}

// Validate CAC number format
function validateCACNumber(cacNumber) {
  // CAC numbers typically start with RC, BN, IT, etc.
  const cacRegex = /^[A-Z]{2}[0-9]+$/i;
  return cacRegex.test(cacNumber.replace(/[-\s]/g, ''));
}

// ============= FORM VALIDATION =============

function validateIndividualForm(formData) {
  const errors = [];

  // Check if BVN is verified
  if (!bvnVerificationData) {
    errors.push('Please verify your BVN first');
    return errors;
  }

  // Required fields that may be missing from BVN
  if (!formData.get('title')) errors.push('Title is required');

  const email = formData.get('email');
  if (!email) {
    errors.push('Email is required');
  } else if (!validateEmail(email)) {
    errors.push('Please enter a valid email address');
  }

  if (!formData.get('houseNo')?.trim()) errors.push('House Number is required');
  if (!formData.get('streetName')?.trim()) errors.push('Street Name/Address is required');

  // NIN validation
  const nin = formData.get('nin');
  if (!nin) {
    errors.push('NIN is required');
  } else if (!validateNIN(nin)) {
    errors.push('NIN must be exactly 11 digits');
  }

  // Other required fields
  if (!formData.get('occupation')?.trim()) errors.push('Occupation is required');
  if (!formData.get('nationality')?.trim()) errors.push('Nationality is required');
  if (!formData.get('country')?.trim()) errors.push('Country is required');

  return errors;
}

function validateCorporateForm(formData) {
  const errors = [];

  // Required fields validation
  if (!formData.get('organizationType')) errors.push('Organization Type is required');
  if (!formData.get('companyName')?.trim()) errors.push('Company Name is required');

  // CAC validation
  const cacNumber = formData.get('cacNumber');
  if (!cacNumber) {
    errors.push('CAC Registration Number is required');
  } else if (!validateCACNumber(cacNumber)) {
    errors.push('Please enter a valid CAC Registration Number (e.g., RC1234567)');
  }

  // Email validation
  const email = formData.get('email');
  if (!email) {
    errors.push('Email is required');
  } else if (!validateEmail(email)) {
    errors.push('Please enter a valid email address');
  }

  // Phone validation
  const phone = formData.get('phone');
  if (!phone) {
    errors.push('Phone number is required');
  } else if (!validatePhone(phone)) {
    errors.push('Please enter a valid phone number');
  }

  // Address fields
  if (!formData.get('streetName')?.trim()) errors.push('Street Name/Address is required');
  if (!formData.get('city')?.trim()) errors.push('City is required');
  if (!formData.get('lga')?.trim()) errors.push('LGA is required');
  if (!formData.get('state')) errors.push('State is required');

  // Business information
  if (!formData.get('lineOfBusinessName')?.trim()) errors.push('Line of Business is required');
  if (!formData.get('lineOfBusinessCode')) errors.push('Business Code is required');
  if (!formData.get('registrationDate')) errors.push('Registration Date is required');
  if (!formData.get('commencementDate')) errors.push('Commencement Date is required');
  if (!formData.get('incorporationDate')) errors.push('Incorporation Date is required');

  // Director information
  if (!formData.get('directorName')?.trim()) errors.push('Director Name is required');

  const directorEmail = formData.get('directorEmail');
  if (!directorEmail) {
    errors.push('Director Email is required');
  } else if (!validateEmail(directorEmail)) {
    errors.push('Please enter a valid Director Email');
  }

  const directorPhone = formData.get('directorPhone');
  if (!directorPhone) {
    errors.push('Director Phone is required');
  } else if (!validatePhone(directorPhone)) {
    errors.push('Please enter a valid Director Phone number');
  }

  return errors;
}

// ============= TIN GENERATION FUNCTIONS =============

// Generate TIN for Individual
async function generateIndividualTIN(formData) {
  try {
    // Use photo from BVN verification
    const photoBase64 = bvnVerificationData?.base64Image || "";

    const payload = {
      type: "individual",
      bvn: formData.get('bvn').trim(),
      nin: formData.get('nin').trim(),
      title: formData.get('title'),
      firstName: formData.get('firstName').trim(),
      middleName: formData.get('middleName')?.trim() || "",
      lastName: formData.get('lastName').trim(),
      gender: formData.get('gender'),
      stateOfOrigin: formData.get('stateOfOrigin'),
      dob: formatDate(formData.get('dob')),
      occupation: formData.get('occupation').trim(),
      nationality: formData.get('nationality').trim(),
      email: formData.get('email').trim().toLowerCase(),
      phone1: formData.get('phone1').trim(),
      phone2: formData.get('phone2')?.trim() || "",
      photo: photoBase64,
      houseNo: formData.get('houseNo').trim(),
      streetName: formData.get('streetName').trim(),
      city: formData.get('city').trim(),
      lga: formData.get('lga').trim(),
      state: formData.get('state'),
      country: formData.get('country').trim()
    };

    console.log('Individual TIN Request Payload:', payload);

    const response = await fetch(`${JTB_BASE_URL}/generate-individual-tin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('JTB API Response:', result);

    if (result.status === 'success') {
      return {
        success: true,
        data: result.data
      };
    } else {
      return {
        success: false,
        message: result.message || 'Failed to generate TIN. Please try again.'
      };
    }
  } catch (error) {
    console.error('Error generating individual TIN:', error);
    return {
      success: false,
      message: error.message || 'Network error occurred while generating TIN. Please check your connection and try again.'
    };
  }
}

// Generate TIN for Corporate
async function generateCorporateTIN(formData) {
  try {
    const payload = {
      action: "generate",
      type: "non-individual",
      organizationType: formData.get('organizationType'),
      regNumber: formData.get('cacNumber').trim(),
      cacRegistrationName: formData.get('companyName').trim(),
      email: formData.get('email').trim().toLowerCase(),
      phoneNo1: formatPhoneNumber(formData.get('phone')),
      lineOfBusinessName: formData.get('lineOfBusinessName').trim(),
      lineOfBusinessCode: parseInt(formData.get('lineOfBusinessCode')),
      registrationDate: formatDate(formData.get('registrationDate')),
      commencementDate: formatDate(formData.get('commencementDate')),
      incorporationDate: formatDate(formData.get('incorporationDate')),
      streetName: formData.get('streetName').trim(),
      city: formData.get('city').trim(),
      lga: formData.get('lga').trim(),
      state: formData.get('state'),
      financialYearBegin: formData.get('financialYearBegin') || "01-01",
      financialYearEnd: formData.get('financialYearEnd') || "12-31",
      directorName: formData.get('directorName').trim(),
      directorEmail: formData.get('directorEmail').trim().toLowerCase(),
      directorPhone: formatPhoneNumber(formData.get('directorPhone'))
    };

    console.log('Corporate TIN Request Payload:', payload);

    const response = await fetch(`${JTB_BASE_URL}/generate-company-tin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('JTB API Response:', result);

    if (result.status === 'success') {
      return {
        success: true,
        data: result.data
      };
    } else {
      return {
        success: false,
        message: result.message || 'Failed to generate TIN. Please try again.'
      };
    }
  } catch (error) {
    console.error('Error generating corporate TIN:', error);
    return {
      success: false,
      message: error.message || 'Network error occurred while generating TIN. Please check your connection and try again.'
    };
  }
}

// ============= REGISTRATION FUNCTIONS =============

// Create Payer Account after successful TIN generation
async function createPayerAccount(formData, tinData, entityType) {
  try {
    const isIndividual = entityType === 'Individual';

    let firstName, lastName;
    if (isIndividual) {
      firstName = formData.get('firstName').trim();
      lastName = formData.get('lastName').trim();
    } else {
      firstName = formData.get('companyName').trim();
      lastName = '';
    }

    const registrationPayload = {
      endpoint: "createPayerAccount",
      data: {
        verification_status: "nil",
        surname: lastName,
        img: "assets/img/userprofile.png",
        tax_number: tinData.tin,
        business_type_id: "52",
        industry: formData.get('lineOfBusinessName') || "General",
        category: isIndividual ? 2 : 1, // 1 for corporate, 2 for individual
        numberofstaff: "0",
        created_by: "self",
        by_account: null,
        first_name: firstName,
        business_type: formData.get('lineOfBusinessName') || "General",
        tin: tinData.tin,
        phone: formData.get('phone1')?.trim() || formData.get('phone')?.trim(),
        email: formData.get('email').trim().toLowerCase(),
        state: formData.get('state'),
        lga: formData.get('lga').trim(),
        address: formData.get('streetName').trim(),
        password: "12345678" // Default password
      }
    };

    console.log('Registration Payload:', registrationPayload);

    const response = await fetch(REGISTRATION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registrationPayload)
    });

    const result = await response.json();
    console.log('Registration Response:', result);

    return result;
  } catch (error) {
    console.error('Error creating payer account:', error);
    return {
      status: 0,
      message: 'Network error occurred while creating account. Please try again.'
    };
  }
}

// Update Taxpayer Details
async function updateTaxpayerDetails(formData, tinData, entityType) {
  try {
    const isIndividual = entityType === 'Individual';

    let firstName, lastName;
    if (isIndividual) {
      firstName = formData.get('firstName').trim();
      lastName = formData.get('lastName').trim();
    } else {
      firstName = formData.get('companyName').trim();
      lastName = '';
    }

    const updateParams = {
      tin: tinData.tin,
      first_name: firstName,
      surname: lastName,
      phone: formData.get('phone1')?.trim() || formData.get('phone')?.trim(),
      email: formData.get('email').trim().toLowerCase(),
      state: formData.get('state'),
      lga: formData.get('lga').trim(),
      address: formData.get('streetName').trim(),
      business_type: formData.get('lineOfBusinessName') || "General",
      category: isIndividual ? 2 : 1
    };

    const queryString = new URLSearchParams(updateParams).toString();

    console.log('Update Query String:', queryString);

    const response = await fetch(`${HOST}?updateTaxPayer&${queryString}`, {
      method: 'GET'
    });

    const result = await response.json();
    console.log('Update Response:', result);

    return result;
  } catch (error) {
    console.error('Error updating taxpayer:', error);
    return {
      status: 0,
      message: 'Network error occurred while updating taxpayer details. Please try again.'
    };
  }
}

// ============= MAIN FORM SUBMISSION HANDLER =============

async function handleTINRequestSubmission(event) {
  // Prevent any default form behavior
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const form = document.querySelector('form');
  if (!form) {
    showError('Error', 'Form not found');
    return;
  }

  const formData = new FormData(form);
  const entityType = document.getElementById('selectEntity').value;

  // Validate entity type selection
  if (!entityType) {
    showError('Selection Required', 'Please select a user category (Individual or Corporate)');
    return;
  }

  // Validate form based on entity type
  let validationErrors;
  if (entityType === 'Individual') {
    validationErrors = validateIndividualForm(formData);
  } else {
    validationErrors = validateCorporateForm(formData);
  }

  if (validationErrors.length > 0) {
    const errorList = validationErrors.map(err => `• ${err}`).join('<br>');
    showError('Validation Error', 'Please correct the following errors:<br><br>' + errorList);
    return;
  }

  // Show loading state
  showLoading('Generating TIN from JTB...');

  try {
    // Step 1: Generate TIN
    let tinResult;
    if (entityType === 'Individual') {
      tinResult = await generateIndividualTIN(formData);
    } else {
      tinResult = await generateCorporateTIN(formData);
    }

    if (!tinResult.success) {
      showError('TIN Generation Failed', tinResult.message);
      return;
    }

    const tinData = tinResult.data;

    // Step 2: Create payer account
    showLoading('Creating payer account...');
    const registrationResult = await createPayerAccount(formData, tinData, entityType);

    if (registrationResult.status === 1) {
      // Success - account created
      Swal.close();

      const successMessage = `
                <div class="text-left">
                    <div class="mb-3 text-center">
                        <h3 class="text-success mb-2">Your Tax Identification Number</h3>
                        <h1 class="display-4 text-primary font-weight-bold">${tinData.tin}</h1>
                    </div>
                    <hr class="my-4">
                    <div class="mb-3">
                        <strong>Tax Office:</strong> ${tinData.taxOffice || 'N/A'}
                    </div>
                    <div class="mb-3">
                        <strong>Status:</strong> <span class="badge bg-success">${tinData.tinStatus || 'Active'}</span>
                    </div>
                    ${tinData.jtbReferenceNumber ? `
                    <div class="mb-3">
                        <strong>JTB Reference:</strong><br>
                        <code class="small">${tinData.jtbReferenceNumber}</code>
                    </div>
                    ` : ''}
                    <div class="alert alert-info mt-3">
                        <i class="fas fa-info-circle"></i> Your account has been created successfully. 
                        Default password is <strong>12345678</strong>. Please change it after first login.
                    </div>
                </div>
            `;

      showSuccess('TIN Generated Successfully!', successMessage);

      // Update UI with TIN
      document.getElementById('generatedTIN').textContent = tinData.tin;
      document.getElementById('modalTIN').textContent = tinData.tin;

      // Move to next tab after delay
      setTimeout(() => {
        if (typeof nextPrev === 'function') {
          nextPrev(1);
        }
      }, 2000);

    } else if (registrationResult.status === 2) {
      // User already exists - update taxpayer details
      showLoading('User exists. Updating taxpayer details...');
      const updateResult = await updateTaxpayerDetails(formData, tinData, entityType);

      if (updateResult.status === 1) {
        Swal.close();

        const successMessage = `
                    <div class="text-left">
                        <div class="mb-3 text-center">
                            <h3 class="text-success mb-2">Your Tax Identification Number</h3>
                            <h1 class="display-4 text-primary font-weight-bold">${tinData.tin}</h1>
                        </div>
                        <hr class="my-4">
                        <div class="mb-3">
                            <strong>Tax Office:</strong> ${tinData.taxOffice || 'N/A'}
                        </div>
                        ${tinData.jtbReferenceNumber ? `
                        <div class="mb-3">
                            <strong>JTB Reference:</strong><br>
                            <code class="small">${tinData.jtbReferenceNumber}</code>
                        </div>
                        ` : ''}
                        <div class="alert alert-warning mt-3">
                            <i class="fas fa-info-circle"></i> ${updateResult.message || 'Your taxpayer details have been updated successfully.'}
                        </div>
                    </div>
                `;

        showSuccess('TIN Generated & Account Updated!', successMessage);

        // Update UI with TIN
        document.getElementById('generatedTIN').textContent = tinData.tin;
        document.getElementById('modalTIN').textContent = tinData.tin;

        // Move to next tab after delay
        setTimeout(() => {
          if (typeof nextPrev === 'function') {
            nextPrev(1);
          }
        }, 2000);
      } else {
        showError(
          'Update Failed',
          updateResult.message || 'TIN was generated successfully, but failed to update your taxpayer details. Please contact support with your TIN: ' + tinData.tin
        );
      }
    } else {
      showError(
        'Registration Failed',
        registrationResult.message || 'TIN was generated successfully, but failed to create your account. Please contact support with your TIN: ' + tinData.tin
      );
    }

  } catch (error) {
    console.error('Error in TIN request submission:', error);
    showError('Unexpected Error', 'An unexpected error occurred. Please try again or contact support if the problem persists.');
  }
}

// ============= INITIALIZATION =============

document.addEventListener('DOMContentLoaded', function () {
  console.log('JTB TIN Request module initialized');

  // Prevent form submission on enter key
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    });
  }

  // Find the submit button and attach the handler
  const submitButton = document.getElementById('submitTINRequest');
  if (submitButton) {
    // Remove any existing onclick handlers
    submitButton.removeAttribute('onclick');

    // Attach click handler
    submitButton.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      handleTINRequestSubmission(e);
    });
  }

  // BVN Verification Handler
  const verifyBvnBtn = document.getElementById('verifyBvnBtn');
  const bvnVerifyInput = document.getElementById('bvnVerify');

  if (verifyBvnBtn && bvnVerifyInput) {
    // Only allow numbers in BVN input
    bvnVerifyInput.addEventListener('input', function (e) {
      this.value = this.value.replace(/[^0-9]/g, '').slice(0, 11);
    });

    verifyBvnBtn.addEventListener('click', async function () {
      const bvn = bvnVerifyInput.value.trim();

      if (!bvn) {
        showError('Validation Error', 'Please enter your BVN');
        return;
      }

      if (!validateBVN(bvn)) {
        showError('Validation Error', 'BVN must be exactly 11 digits');
        return;
      }

      const result = await verifyBVN(bvn);

      if (result.success) {
        const data = result.data;

        // Show verification result
        document.getElementById('verifiedName').textContent =
          `${data.firstName} ${data.middleName || ''} ${data.lastName}`.trim();
        document.getElementById('verifiedDob').textContent = data.dateOfBirth;
        document.getElementById('verifiedGender').textContent = data.gender;
        document.getElementById('bvnVerificationResult').style.display = 'block';

        // Auto-fill form fields with exact BVN data
        document.getElementById('bvn').value = data.bvn;
        document.getElementById('title').value = data.title || '';
        document.getElementById('firstName').value = data.firstName || '';
        document.getElementById('middleName').value = data.middleName || '';
        document.getElementById('lastName').value = data.lastName || '';
        document.getElementById('gender').value = data.gender || '';
        document.getElementById('dob').value = parseBvnDate(data.dateOfBirth);
        document.getElementById('phone1').value = data.phoneNumber1 || '';
        document.getElementById('phone2').value = data.phoneNumber2 || '';
        document.getElementById('email').value = data.email || '';
        document.getElementById('stateOfOrigin').value = data.stateOfOrigin || '';
        document.getElementById('lga').value = data.lgaOfOrigin || '';
        document.getElementById('state').value = data.stateOfOrigin || '';
        document.getElementById('city').value = data.lgaOfOrigin || '';
        document.getElementById('streetName').value = data.residentialAddress || '';
        document.getElementById('houseNo').value = '';

        // Show main form and submit section
        document.querySelector('.form-section-main').style.display = 'block';
        document.getElementById('submitSection').style.display = 'block';

        showSuccess('BVN Verified!', 'Your information has been auto-filled. Please complete the remaining fields.');
      } else {
        showError('Verification Failed', result.message);
      }
    });
  }

  // Validate BVN input (11 digits only) - Hidden field
  const bvnInput = document.getElementById('bvn');
  if (bvnInput) {
    bvnInput.addEventListener('input', function (e) {
      this.value = this.value.replace(/[^0-9]/g, '').slice(0, 11);
    });
  }

  // Validate NIN input (11 digits only)
  const ninInput = document.getElementById('nin');
  if (ninInput) {
    ninInput.addEventListener('input', function (e) {
      this.value = this.value.replace(/[^0-9]/g, '').slice(0, 11);

      // Show validation feedback
      if (this.value.length === 11) {
        this.classList.remove('is-invalid');
        this.classList.add('is-valid');
      } else if (this.value.length > 0) {
        this.classList.remove('is-valid');
        this.classList.add('is-invalid');
      } else {
        this.classList.remove('is-valid', 'is-invalid');
      }
    });
  }

  // Validate phone input
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach(phoneInput => {
    phoneInput.addEventListener('input', function (e) {
      // Allow +, digits, spaces, and hyphens
      let value = this.value.replace(/[^0-9+\s-]/g, '');
      this.value = value;
    });

    phoneInput.addEventListener('blur', function (e) {
      const formatted = formatPhoneNumber(this.value);
      if (validatePhone(formatted)) {
        this.classList.remove('is-invalid');
        this.classList.add('is-valid');
      } else if (this.value.length > 0) {
        this.classList.remove('is-valid');
        this.classList.add('is-invalid');
      }
    });
  });

  // Validate email input
  const emailInputs = document.querySelectorAll('input[type="email"]');
  emailInputs.forEach(emailInput => {
    emailInput.addEventListener('blur', function (e) {
      if (validateEmail(this.value)) {
        this.classList.remove('is-invalid');
        this.classList.add('is-valid');
      } else if (this.value.length > 0) {
        this.classList.remove('is-valid');
        this.classList.add('is-invalid');
      }
    });
  });

  // Validate DOB
  const dobInput = document.getElementById('dob');
  if (dobInput) {
    dobInput.addEventListener('change', function (e) {
      if (validateDOB(this.value)) {
        this.classList.remove('is-invalid');
        this.classList.add('is-valid');
      } else {
        this.classList.remove('is-valid');
        this.classList.add('is-invalid');
      }
    });
  }

  // Validate CAC Number
  const cacInput = document.getElementById('cacNumber');
  if (cacInput) {
    cacInput.addEventListener('input', function (e) {
      this.value = this.value.toUpperCase();
    });

    cacInput.addEventListener('blur', function (e) {
      if (validateCACNumber(this.value)) {
        this.classList.remove('is-invalid');
        this.classList.add('is-valid');
      } else if (this.value.length > 0) {
        this.classList.remove('is-valid');
        this.classList.add('is-invalid');
      }
    });
  }

  // Auto-sync registration and incorporation dates with commencement date
  const commencementInput = document.getElementById('commencementDate');
  const registrationInput = document.getElementById('registrationDate');
  const incorporationInput = document.getElementById('incorporationDate');

  if (commencementInput && registrationInput && incorporationInput) {
    commencementInput.addEventListener('change', function () {
      if (!registrationInput.value) {
        registrationInput.value = this.value;
      }
      if (!incorporationInput.value) {
        incorporationInput.value = this.value;
      }
    });
  }
});

// Export functions for external use if needed
window.JTBTINRequest = {
  generateIndividualTIN,
  generateCorporateTIN,
  createPayerAccount,
  updateTaxpayerDetails,
  handleTINRequestSubmission,
  validateBVN,
  validateEmail,
  validatePhone,
  validateDOB,
  validateCACNumber
};

console.log('JTB TIN Request Module Loaded Successfully');