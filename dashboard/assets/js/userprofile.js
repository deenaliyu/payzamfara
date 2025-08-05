// State Management
let userData = JSON.parse(localStorage.getItem("userDataPrime")) || {};
let industryHierarchy = [];
let businessTypes = [];

// DOM Elements
const elements = {
    mainInfo: document.querySelector(".mainInfo"),
    prof: document.querySelector(".prof"),
    contactInfo: document.querySelector(".contactInfo"),
    updtProfile: document.querySelector("#updtProfile"),
    selectState: document.querySelector("#selectState"),
    selectLGA: document.querySelector("#selectLGA"),
    updateProfile: document.querySelector("#updateProfile"),
    msgBox: document.querySelector("#msg_box"),
    msgBox2: document.querySelector("#msg_box2"),
    updatePass: document.querySelector("#updatePass"),
    profilePicInput: document.querySelector("#profile_picIn"),
    previewImg: document.querySelector("#preview"),
    theProfImg: document.querySelector("#theProfImg"),
    theProfImg2: document.querySelector("#theProfImg2"),
    proffer: document.querySelector("#proffer"),
    updatePic: document.querySelector("#updatePic"),
    msgCenter: document.querySelector("#msg_center")
};

// Utility Functions
const showLoader = (show) => {
    const loader = document.getElementById("globalLoader");
    loader.style.display = show ? "flex" : "none";
};

const displayError = (message, element) => {
    element.innerHTML = `<p class="text-danger text-center mt-4 text-lg">${message}</p>`;
};

const displaySuccess = (message, element) => {
    element.innerHTML = `<p class="text-success text-center mt-4 text-lg">${message}</p>`;
};

// API Functions
const fetchData = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

const fetchUserDetails = async () => {
    try {
        const data = await fetchData(`${HOST}?userProfile&id=${userData.tax_number}`);
        return data.user;
    } catch (error) {
        console.error('Error fetching user details:', error);
        return null;
    }
};

const fetchIndustryHierarchy = async () => {
    try {
        const data = await fetchData(`${HOST}?getIndustryHierarchy`);
        if (data.status === 1) return data.data;
        throw new Error(data.message || 'Failed to load industry hierarchy');
    } catch (error) {
        console.error('Error fetching industry hierarchy:', error);
        return [];
    }
};

// Data Processing
const processIndustryHierarchy = (data) => {
    const industries = [];
    const businessTypes = [];

    data.forEach(industry => {
        industries.push({
            id: industry.industry_id,
            name: industry.industry_name
        });

        industry.sectors.forEach(sector => {
            sector.business_types.forEach(businessType => {
                businessTypes.push({
                    id: businessType.business_type_id,
                    name: businessType.business_type_name,
                    industry_id: industry.industry_id,
                    industry_name: industry.industry_name,
                    sector_id: sector.sector_id,
                    sector_name: sector.sector_name
                });
            });
        });
    });

    return { industries, businessTypes };
};

// DOM Rendering
const renderProfileInfo = (userInfo) => {
    if (!userInfo) return;

    // Main Info
    elements.mainInfo.innerHTML = `
        <h4 class="text-[18px] text-[#2E2F5B]">${userInfo.first_name} ${userInfo.surname}</h4>
        <p class="text-[14px] text-[#667085] pt-2">Payer ID: ${userInfo.tax_number}</p>
    `;

    // Profile Info
    elements.prof.innerHTML = `
        <div class="flex justify-between md:w-[550px]">
            <label class="w-[195px]">Tax Identification Number</label>
            <div class="form-group md:w-[454px] w-full">
                <input class="form-control mt-1 regInputs" readonly type="text" value="${userInfo.tin || ''}" maxlength="15" />
            </div>
        </div>
        <div class="flex justify-between md:w-[550px] mt-2 items-center">
            <label class="w-[195px]">Category</label>
            <div class="form-group md:w-[454px] w-full">
                <input class="form-control mt-1 regInputs" readonly type="text" value="${userInfo.category || ''}" maxlength="15" />
            </div>
        </div>
        <div class="flex justify-between md:w-[550px] mt-2 items-center">
            <label class="w-[195px]">Employment status</label>
            <div class="form-group md:w-[454px] w-full">
                <input class="form-control mt-1 regInputs" readonly type="text" value="${userInfo.employment_status || ''}" maxlength="15" />
            </div>
        </div>
        <div class="flex justify-between md:w-[550px] mt-2 items-center">
            <label class="w-[195px]">Type of business</label>
            <div class="form-group md:w-[454px] w-full">
                <input class="form-control mt-1 regInputs" readonly type="text" value="${userInfo.business_type || ''}" maxlength="15" />
            </div>
        </div>
    `;

    // Contact Info
    elements.contactInfo.innerHTML = `
        <div class="flex justify-between md:w-[550px]">
            <label class="w-[195px]">Email</label>
            <div class="form-group md:w-[454px] w-full">
                <input class="form-control mt-1 regInputs" readonly type="text" value="${userInfo.email || ''}" maxlength="15" />
            </div>
        </div>
        <div class="flex justify-between md:w-[550px] mt-2 items-center">
            <label class="w-[195px]">Phone number</label>
            <div class="form-group md:w-[454px] w-full">
                <input class="form-control mt-1 regInputs" readonly type="text" value="${userInfo.phone || ''}" maxlength="15" />
            </div>
        </div>
        <div class="flex justify-between md:w-[550px] mt-2 items-center">
            <label class="w-[195px]">State</label>
            <select class="form-select mt-1 regInputs md:w-[454px]" id="selectState" data-name="state" required>
                <option value="Plateau">Plateau</option>
            </select>
        </div>
        <div class="flex justify-between md:w-[550px] mt-2 items-center">
            <label class="w-[195px]">Local Government Area</label>
            <div class="form-group md:w-[454px] w-full">
                <input class="form-control mt-1 regInputs" readonly type="text" value="${userInfo.lga || ''}" />
            </div>
        </div>
        <div class="flex justify-between md:w-[550px] mt-2 items-center">
            <label class="w-[195px]">Address</label>
            <div class="form-group md:w-[454px] w-full">
                <input class="form-control mt-1" readonly type="text" value="${userInfo.address || ''}" />
            </div>
        </div>
    `;
};

const renderEditProfileForm = (userInfo, businessTypes) => {
    let profileForm = userInfo.tin ? '' : `
        <div class="flex justify-between">
            <label class="w-4/12">Tax Identification Number</label>
            <div class="form-group w-8/12">
                <input class="form-control mt-1 regInputs" type="text" value="${userInfo.tin || ''}" maxlength="15" />
            </div>
        </div>
    `;

    profileForm += `
        <div class="flex justify-between mt-2 items-center">
            <label class="w-4/12">Employment status</label>
            <select class="form-select mt-1 w-8/12 updtProf" data-name="employment_status" required>
                <option value="" ${!userInfo.employment_status ? 'selected' : ''}>-Select--</option>
                <option value="Selfemployed" ${userInfo.employment_status === 'Selfemployed' ? 'selected' : ''}>Self-employed</option>
                <option value="Employee" ${userInfo.employment_status === 'Employee' ? 'selected' : ''}>Employee</option>
                <option value="Worker" ${userInfo.employment_status === 'Worker' ? 'selected' : ''}>Worker</option>
                <option value="Unemployed" ${userInfo.employment_status === 'Unemployed' ? 'selected' : ''}>Unemployed</option>
            </select>
        </div>

        <div class="flex gap-x-10 mt-3 md:flex-nowrap sm:flex-wrap">
            <p>Are you a business owner?</p>
            <div class="form-check">
                <input class="form-check-input" type="radio" value="yes" name="flexRadioDefault" id="flexRadioDefault1" ${userInfo.business_type ? 'checked' : ''}>
                <label class="form-check-label" for="flexRadioDefault1">Yes</label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" value="no" name="flexRadioDefault" id="flexRadioDefault2" ${!userInfo.business_type ? 'checked' : ''}>
                <label class="form-check-label" for="flexRadioDefault2">No</label>
            </div>
        </div>
        <div class="flex justify-between mt-2 items-center">
            <label class="w-4/12">Type of business</label>
            <select class="form-select mt-1 w-8/12 updtProf" data-name="business_type" required>
                <option value="" ${!userInfo.business_type ? 'selected' : ''}>-Select--</option>
                ${businessTypes.map(type => `
                    <option value="${type.name}" ${userInfo.business_type === type.name ? 'selected' : ''}>
                        ${type.name}
                    </option>
                `).join('')}
            </select>
        </div>

        <div class="flex justify-between mt-2">
            <label class="w-4/12">Email</label>
            <div class="form-group w-8/12">
                <input class="form-control mt-1 updtProf" data-name="email" type="text" value="${userInfo.email || ''}" />
            </div>
        </div>

        <div class="flex justify-between mt-2 items-center">
            <label class="w-4/12">Phone number</label>
            <div class="form-group w-8/12">
                <input class="form-control mt-1 updtProf" data-name="phone" type="text" value="${userInfo.phone || ''}" maxlength="15" />
            </div>
        </div>

        <div class="flex justify-between mt-2 items-center">
            <label class="w-4/12">State</label>
            <select class="form-select mt-1 w-8/12 updtProf" id="selectState" data-name="state" required>
                <option value="Plateau">Plateau</option>
            </select>
        </div>

        <div class="flex justify-between mt-2 items-center">
            <label class="w-4/12">Local Government Area</label>
            <select class="form-select mt-1 w-8/12 updtProf" id="selectLGA" data-name="lga" required>
                ${lgaList["Plateau"].map(lga => `
                    <option value="${lga}" ${userInfo.lga === lga ? 'selected' : ''}>${lga}</option>
                `).join('')}
            </select>
        </div>

        <div class="flex justify-between mt-2 items-center">
            <label class="w-4/12">Address</label>
            <div class="form-group w-8/12">
                <input class="form-control mt-1 updtProf" data-name="address" type="text" value="${userInfo.address || ''}" />
            </div>
        </div>
    `;

    elements.updtProfile.innerHTML = profileForm;
};

// Event Handlers
const handleProfileUpdate = async (e) => {
    e.preventDefault();
    showLoader(true);
    elements.msgBox.innerHTML = `
        <div class="flex justify-center items-center mt-4">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
    `;
    elements.updateProfile.classList.add("hidden");

    const allInputs = document.querySelectorAll(".updtProf");
    const updateData = { ...userData };

    // Remove unnecessary fields
    delete updateData.verification_code;
    delete updateData.verification_status;
    delete updateData.timeIn;
    delete updateData.industry;
    delete updateData.img;
    delete updateData.password;

    allInputs.forEach(input => {
        if (input.value) {
            updateData[input.dataset.name] = input.value;
        }
    });

    try {
        const queryString = new URLSearchParams(updateData).toString();
        const data = await fetchData(`${HOST}?updateTaxPayer&${queryString}`);

        if (data.status === 1) {
            displaySuccess(data.message, elements.msgBox);
            localStorage.setItem("userDataPrime", JSON.stringify(updateData));
            setTimeout(() => window.location.reload(), 1000);
        } else {
            displayError(data.message || 'Failed to update profile', elements.msgBox);
            elements.updateProfile.classList.remove("hidden");
        }
    } catch (error) {
        displayError('An error occurred while updating profile', elements.msgBox);
        elements.updateProfile.classList.remove("hidden");
    } finally {
        showLoader(false);
    }
};

const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    showLoader(true);
    elements.msgBox2.innerHTML = `
        <div class="flex justify-center items-center mt-4">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
    `;
    elements.updatePass.classList.add("hidden");

    const oldPass = document.querySelector("#oldPass").value;
    const newPass = document.querySelector("#newPass").value;
    const confirmPass = document.querySelector("#newPass2").value;

    if (!oldPass || !newPass || !confirmPass) {
        displayError("Fields can't be empty!", elements.msgBox2);
        elements.updatePass.classList.remove("hidden");
        showLoader(false);
        return;
    }

    if (oldPass !== userData.password) {
        displayError("Current password not correct!", elements.msgBox2);
        elements.updatePass.classList.remove("hidden");
        showLoader(false);
        return;
    }

    if (newPass !== confirmPass) {
        displayError("Confirm password didn't match password!", elements.msgBox2);
        elements.updatePass.classList.remove("hidden");
        showLoader(false);
        return;
    }

    try {
        const data = await fetchData(`${HOST}?userPassword&id=${userData.id}&password=${newPass}`);
        
        if (data.status === 1) {
            displaySuccess("Password changed successfully!", elements.msgBox2);
            setTimeout(() => {
                localStorage.removeItem('userDataPrime');
                window.location.href = "../signin.html";
            }, 1000);
        } else {
            displayError(data.message || 'Failed to update password', elements.msgBox2);
            elements.updatePass.classList.remove("hidden");
        }
    } catch (error) {
        displayError('Something went wrong!', elements.msgBox2);
        elements.updatePass.classList.remove("hidden");
    } finally {
        showLoader(false);
    }
};

const handleProfilePicChange = () => {
    elements.proffer.classList.remove("hidden");
    const file = elements.profilePicInput.files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            elements.previewImg.src = reader.result;
        };
    }
};

const handleProfilePicUpdate = async () => {
    showLoader(true);
    elements.msgCenter.innerHTML = `
        <div class="flex justify-center items-center mt-4">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
    `;
    elements.updatePic.classList.add("hidden");

    const file = elements.profilePicInput.files[0];
    if (!file) {
        displayError('Please select a file', elements.msgCenter);
        elements.updatePic.classList.remove("hidden");
        showLoader(false);
        return;
    }

    try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        reader.onload = async () => {
            const imgData = reader.result;
            const payload = {
                endpoint: "updatePix",
                data: {
                    id: userData.id,
                    img: imgData
                }
            };

            const response = await fetch(HOST, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            const data = await response.json();

            if (data.status === 1) {
                elements.theProfImg.src = imgData;
                elements.theProfImg2.src = imgData;
                
                const storedData = JSON.parse(localStorage.getItem("userDataPrime"));
                storedData.img = imgData;
                localStorage.setItem("userDataPrime", JSON.stringify(storedData));

                displaySuccess("Picture updated successfully!", elements.msgCenter);
                
                setTimeout(() => {
                    elements.proffer.classList.add("hidden");
                    elements.msgCenter.innerHTML = ``;
                    elements.updatePic.classList.remove("hidden");
                    window.location.reload();
                }, 1000);
            } else {
                displayError("Network Error, Try again", elements.msgCenter);
                elements.updatePic.classList.remove("hidden");
            }
        };
    } catch (error) {
        displayError("Something went wrong! Try again", elements.msgCenter);
        elements.updatePic.classList.remove("hidden");
    } finally {
        showLoader(false);
    }
};

// Initialization
const init = async () => {
    // Load industry hierarchy and business types
    const hierarchyData = await fetchIndustryHierarchy();
    const processedData = processIndustryHierarchy(hierarchyData);
    businessTypes = processedData.businessTypes;

    // Load user details
    const userDetails = await fetchUserDetails();
    if (userDetails) {
        userData = { ...userData, ...userDetails };
        localStorage.setItem("userDataPrime", JSON.stringify(userData));
    }

    // Render profile
    renderProfileInfo(userData);
    renderEditProfileForm(userData, businessTypes);

    // Set up event listeners
    elements.updateProfile.addEventListener("click", handleProfileUpdate);
    elements.updatePass.addEventListener("click", handlePasswordUpdate);
    document.querySelector("#openUpload").addEventListener("click", () => elements.profilePicInput.click());
    elements.profilePicInput.addEventListener("change", handleProfilePicChange);
    elements.updatePic.addEventListener("click", handleProfilePicUpdate);
};

// Start the application
document.addEventListener('DOMContentLoaded', init);