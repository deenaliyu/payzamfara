let hierarchyData = [];
let industries = [];
let sectors = [];
let businessTypes = [];
let revenueRates = [];
let revenueHeads = [];

function showLoader(show) {
  const loader = document.getElementById('globalLoader');
  if (loader) {
    loader.style.display = show ? 'block' : 'none';
  }
}

// Global error handler
function handleApiError(error, action = 'processing') {
  console.error(`Error ${action}:`, error);
  let errorMessage = error.message || `Failed to ${action}. Please try again.`;

  // Check for specific error messages in response
  if (error.response && error.response.message) {
    errorMessage = error.response.message;
  }

  alert(errorMessage);
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', function () {
  fetchHierarchyData();
});

// Fetch hierarchy data from API
async function fetchHierarchyData() {
  try {
    const response = await fetch(`${HOST}?getIndustryHierarchy`);
    const data = await response.json();

    if (data.status === 1) {
      hierarchyData = data.data;
      processHierarchyData();
      renderTables();
    } else {
      console.error('Failed to load hierarchy data');
    }

    const ratesResponse = await fetch('https://payzamfara.com/php/index.php?getRevenueRates');
    const ratesData = await ratesResponse.json();
    if (ratesData.status === 1) {
      revenueRates = ratesData.rates;
    }

    // Fetch revenue heads
    const headsResponse = await fetch('https://payzamfara.com/php/index.php?getAllRevenueHeads');
    const headsData = await headsResponse.json();
    if (headsData.message) {
      revenueHeads = headsData.message;
    }

    processHierarchyData();
    renderTables();
  } catch (error) {
    console.error('Error fetching hierarchy data:', error);
  }
}

// Process the hierarchical data into flat arrays
function processHierarchyData() {
  industries = [];
  sectors = [];
  businessTypes = [];

  hierarchyData.forEach(industry => {
    // Add industry
    industries.push({
      id: industry.industry_id,
      name: industry.industry_name
    });

    // Process sectors
    industry.sectors.forEach(sector => {
      sectors.push({
        id: sector.sector_id,
        name: sector.sector_name,
        industry_id: industry.industry_id,
        industry_name: industry.industry_name
      });

      // Process business types
      sector.business_types.forEach(businessType => {
        businessTypes.push({
          id: businessType.business_type_id,
          name: businessType.business_type_name,
          sector_id: sector.sector_id,
          sector_name: sector.sector_name,
          industry_id: industry.industry_id,
          industry_name: industry.industry_name
        });
      });
    });
  });
}

// Render all tables
function renderTables() {
  renderIndustriesTable();
  renderSectorsTable();
  renderBusinessTypesTable();
  populateIndustryDropdowns();
  renderRevenueRatesTable();
  populateRevenueRateDropdowns().then(() => {
    // if (document.getElementById('revenueRateHead')) {
    //   $("#revenueRateHead").selectize({
    //     create: false,
    //     sortField: 'text',
    //     placeholder: 'Search for revenue head',
    //     // dropdownParent: 'body'
    //   });
    // }

    // if (document.getElementById('revenueRateBusinessType')) {
    //   $("#revenueRateBusinessType").selectize({
    //     create: false,
    //     sortField: 'text',
    //     placeholder: 'Search for your type of business',
    //     // dropdownParent: 'body'
    //   });
    // }
  });
}

// Render industries table
function renderIndustriesTable() {
  const tbody = document.getElementById('industriesTableBody');
  tbody.innerHTML = '';

  industries.forEach((industry, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${industry.name}</td>
                    <td class="action-btns">
                        <button class="btn btn-sm btn-link" onclick="editIndustry('${industry.id}')">
                          <iconify-icon icon="tabler:edit" width="16" height="16"></iconify-icon>
                        </button>
                        <button class="btn btn-sm btn-link" onclick="deleteIndustry('${industry.id}')" disabled>
                          <iconify-icon icon="material-symbols:delete-outline-rounded" width="16" height="16"></iconify-icon>
                        </button>
                    </td>
                `;
    tbody.appendChild(row);
  });
}

// Render sectors table
function renderSectorsTable() {
  const tbody = document.getElementById('sectorsTableBody');
  tbody.innerHTML = '';

  sectors.forEach((sector, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${sector.name}</td>
                    <td>${sector.industry_name}</td>
                    <td class="action-btns">
                        <button class="btn btn-sm btn-link" onclick="editSector('${sector.id}')">
                            <iconify-icon icon="tabler:edit" width="16" height="16"></iconify-icon>
                        </button>
                        <button class="btn btn-sm btn-link" onclick="deleteSector('${sector.id}')" disabled>
                            <iconify-icon icon="material-symbols:delete-outline-rounded" width="16" height="16"></iconify-icon>
                        </button>
                    </td>
                `;
    tbody.appendChild(row);
  });
}

// Render business types table
function renderBusinessTypesTable() {
  const tbody = document.getElementById('businessTypesTableBody');
  tbody.innerHTML = '';

  businessTypes.forEach((businessType, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${businessType.name}</td>
                    <td>${businessType.sector_name}</td>
                    <td>${businessType.industry_name}</td>
                    <td class="action-btns">
                        <button class="btn btn-sm btn-link" onclick="editBusinessType('${businessType.id}')">
                          <iconify-icon icon="tabler:edit" width="16" height="16"></iconify-icon>
                        </button>
                        <button class="btn btn-sm btn-link" onclick="deleteBusinessType('${businessType.id}')" disabled>
                          <iconify-icon icon="material-symbols:delete-outline-rounded" width="16" height="16"></iconify-icon>
                        </button>
                    </td>
                `;
    tbody.appendChild(row);
  });
}

// Render Revenu Rates

function renderRevenueRatesTable() {
  const tbody = document.getElementById('revenueRatesTableBody');
  tbody.innerHTML = '';

  revenueRates.forEach(rate => {
    const businessType = businessTypes.find(b => b.id === rate.business_type_id.toString());
    const revenueHead = revenueHeads.find(h => h.id === rate.revenue_head_id.toString());

    const row = document.createElement('tr');
    row.innerHTML = `
            <td>${rate.id}</td>
            <td>${revenueHead ? revenueHead.COL_4 : 'N/A'}</td>
            <td>${businessType ? businessType.name : 'N/A'}</td>
            <td>Group ${rate.group_id}</td>
            <td>₦${parseFloat(rate.amount).toLocaleString()}</td>
            <td>${rate.frequency}</td>
            <td class="action-btns">
                <button class="btn btn-sm btn-link" onclick="editRevenueRate('${rate.id}')">
                  <iconify-icon icon="tabler:edit" width="16" height="16"></iconify-icon>
                </button>
                <button class="btn btn-sm btn-link" onclick="deleteRevenueRate('${rate.id}')" disabled>
                  <iconify-icon icon="material-symbols:delete-outline-rounded" width="16" height="16"></iconify-icon>
                </button>
            </td>
        `;
    tbody.appendChild(row);
  });
}

// Add this function to populate dropdowns in revenue rate modal
async function populateRevenueRateDropdowns() {
  const revenueHeadSelect = document.getElementById('revenueRateHead');
  const businessTypeSelect = document.getElementById('revenueRateBusinessType');

  revenueHeadSelect.innerHTML = '<option value="">Select Revenue Head</option>';
  revenueHeads.forEach(head => {
    const option = document.createElement('option');
    option.value = head.id;
    option.textContent = head.COL_4;
    revenueHeadSelect.appendChild(option);
  });

  businessTypeSelect.innerHTML = '<option value="">Select Business Type</option>';
  businessTypes.forEach(type => {
    const option = document.createElement('option');
    option.value = type.id;
    option.textContent = type.name;
    businessTypeSelect.appendChild(option);
  });

}

// Add these functions for revenue rate CRUD operations
function showRevenueRateModal(rateId = null) {
  const modal = new bootstrap.Modal(document.getElementById('revenueRateModal'));
  const form = document.getElementById('revenueRateForm');
  form.reset();

  if (rateId) {
    document.getElementById('revenueRateModalTitle').textContent = 'Edit Revenue Rate';
    document.getElementById('revenueRateId').value = rateId;

    const rate = revenueRates.find(r => r.id == rateId);
    if (rate) {
      document.getElementById('revenueRateHead').value = rate.revenue_head_id;
      document.getElementById('revenueRateBusinessType').value = rate.business_type_id;
      document.getElementById('revenueRateGroup').value = rate.group_id;
      document.getElementById('revenueRateAmount').value = rate.amount;
      document.getElementById('revenueRateFrequency').value = rate.frequency;
    }
  } else {
    document.getElementById('revenueRateModalTitle').textContent = 'Create Revenue Rate';
    document.getElementById('revenueRateId').value = '';
  }

  modal.show();
}

// Populate industry dropdowns in modals
function populateIndustryDropdowns() {
  const sectorIndustrySelect = document.getElementById('sectorIndustry');
  sectorIndustrySelect.innerHTML = '<option value="">Select Industry</option>';

  industries.forEach(industry => {
    const option = document.createElement('option');
    option.value = industry.id;
    option.textContent = industry.name;
    sectorIndustrySelect.appendChild(option);
  });

  // When industry changes in business type modal, update sectors dropdown
  document.getElementById('sectorIndustry').addEventListener('change', function () {
    updateSectorsDropdown(this.value);
  });
}

// Update sectors dropdown based on selected industry
function updateSectorsDropdown(industryId) {
  const businessTypeSectorSelect = document.getElementById('businessTypeSector');
  businessTypeSectorSelect.innerHTML = '<option value="">Select Sector</option>';

  if (industryId) {
    const filteredSectors = sectors.filter(sector => sector.industry_id === industryId);
    filteredSectors.forEach(sector => {
      const option = document.createElement('option');
      option.value = sector.id;
      option.textContent = sector.name;
      businessTypeSectorSelect.appendChild(option);
    });
  }
}

// Show industry modal
function showIndustryModal(industryId = null) {
  const modal = new bootstrap.Modal(document.getElementById('industryModal'));
  const form = document.getElementById('industryForm');
  form.reset();

  if (industryId) {
    document.getElementById('industryModalTitle').textContent = 'Edit Industry';
    document.getElementById('industryId').value = industryId;

    const industry = industries.find(i => i.id === industryId);
    if (industry) {
      document.getElementById('industryName').value = industry.name;
    }
  } else {
    document.getElementById('industryModalTitle').textContent = 'Create Industry';
    document.getElementById('industryId').value = '';
  }

  modal.show();
}

// Show sector modal
function showSectorModal(sectorId = null) {
  const modal = new bootstrap.Modal(document.getElementById('sectorModal'));
  const form = document.getElementById('sectorForm');
  form.reset();

  if (sectorId) {
    document.getElementById('sectorModalTitle').textContent = 'Edit Sector';
    document.getElementById('sectorId').value = sectorId;

    const sector = sectors.find(s => s.id === sectorId);
    if (sector) {
      document.getElementById('sectorName').value = sector.name;
      document.getElementById('sectorIndustry').value = sector.industry_id;
    }
  } else {
    document.getElementById('sectorModalTitle').textContent = 'Create Sector';
    document.getElementById('sectorId').value = '';
  }

  modal.show();
}

// Show business type modal
function showBusinessTypeModal(businessTypeId = null) {
  const modal = new bootstrap.Modal(document.getElementById('businessTypeModal'));
  const form = document.getElementById('businessTypeForm');
  form.reset();

  if (businessTypeId) {
    document.getElementById('businessTypeModalTitle').textContent = 'Edit Business Type';
    document.getElementById('businessTypeId').value = businessTypeId;

    const businessType = businessTypes.find(b => b.id === businessTypeId);
    if (businessType) {
      document.getElementById('businessTypeName').value = businessType.name;
      document.getElementById('businessTypeSector').value = businessType.sector_id;
      // Update sectors dropdown based on industry
      const sector = sectors.find(s => s.id === businessType.sector_id);
      if (sector) {
        updateSectorsDropdown(sector.industry_id);
      }
    }
  } else {
    document.getElementById('businessTypeModalTitle').textContent = 'Create Business Type';
    document.getElementById('businessTypeId').value = '';
    document.getElementById('businessTypeSector').innerHTML = '<option value="">Select Sector</option>';
  }

  modal.show();
}

async function saveIndustry() {
  const id = document.getElementById('industryId').value;
  const name = document.getElementById('industryName').value.trim();

  if (!name) {
    alert('Please enter industry name');
    return;
  }

  showLoader(true);

  try {
    const endpoint = id ? 'updateIndustry' : 'createIndustry';
    const payload = {
      endpoint: endpoint,
      data: { name }
    };

    if (id) {
      payload.data.id = id;
    }

    const response = await fetch('https://payzamfara.com/php/index.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.status !== 1) {
      throw new Error(result.message || 'Failed to save industry');
    }

    // Refresh data after successful operation
    await fetchHierarchyData();
    bootstrap.Modal.getInstance(document.getElementById('industryModal')).hide();
  } catch (error) {
    handleApiError(error, 'saving industry');
  } finally {
    showLoader(false);
  }
}

// Updated saveSector function with API integration
async function saveSector() {
  const id = document.getElementById('sectorId').value;
  const name = document.getElementById('sectorName').value.trim();
  const industryId = document.getElementById('sectorIndustry').value;

  if (!name || !industryId) {
    alert('Please fill all required fields');
    return;
  }

  showLoader(true);

  try {
    const endpoint = id ? 'updateSector' : 'createSector';
    const payload = {
      endpoint: endpoint,
      data: {
        name,
        industry_id: industryId
      }
    };

    if (id) {
      payload.data.id = id;
    }

    const response = await fetch('https://payzamfara.com/php/index.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.status !== 1) {
      throw new Error(result.message || 'Failed to save sector');
    }

    await fetchHierarchyData();
    bootstrap.Modal.getInstance(document.getElementById('sectorModal')).hide();
  } catch (error) {
    handleApiError(error, 'saving sector');
  } finally {
    showLoader(false);
  }
}

// Updated saveBusinessType function with API integration
async function saveBusinessType() {
  const id = document.getElementById('businessTypeId').value;
  const name = document.getElementById('businessTypeName').value.trim();
  const sectorId = document.getElementById('businessTypeSector').value;

  if (!name || !sectorId) {
    alert('Please fill all required fields');
    return;
  }

  showLoader(true);

  try {
    const endpoint = id ? 'updateBusinessType' : 'createBusinessType';
    const payload = {
      endpoint: endpoint,
      data: {
        name,
        sector_id: sectorId
      }
    };

    if (id) {
      payload.data.id = id;
    }

    const response = await fetch('https://payzamfara.com/php/index.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.status !== 1) {
      throw new Error(result.message || 'Failed to save business type');
    }

    await fetchHierarchyData();
    bootstrap.Modal.getInstance(document.getElementById('businessTypeModal')).hide();
  } catch (error) {
    handleApiError(error, 'saving business type');
  } finally {
    showLoader(false);
  }
}

// Updated saveRevenueRate function with API integration
async function saveRevenueRate() {
  const id = document.getElementById('revenueRateId').value;
  const revenueHeadId = document.getElementById('revenueRateHead').value;
  const businessTypeId = document.getElementById('revenueRateBusinessType').value;
  const groupId = document.getElementById('revenueRateGroup').value;
  const amount = document.getElementById('revenueRateAmount').value;
  const frequency = document.getElementById('revenueRateFrequency').value;

  if (!revenueHeadId || !businessTypeId || !groupId || !amount || !frequency) {
    alert('Please fill all required fields');
    return;
  }

  showLoader(true);

  try {
    const endpoint = id ? 'updateRevenueRate' : 'createRevenueRate';
    const payload = {
      endpoint: endpoint,
      data: {
        revenue_head_id: revenueHeadId,
        business_type_id: businessTypeId,
        group_id: groupId,
        amount: amount,
        frequency: frequency
      }
    };

    if (id) {
      payload.data.id = id;
    }

    const response = await fetch('https://payzamfara.com/php/index.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.status !== 1) {
      throw new Error(result.message || 'Failed to save revenue rate');
    }

    // Refresh revenue rates data
    const ratesResponse = await fetch('https://payzamfara.com/php/index.php?getRevenueRates');
    const ratesData = await ratesResponse.json();
    if (ratesData.status === 1) {
      revenueRates = ratesData.rates;
      renderRevenueRatesTable();
    }

    bootstrap.Modal.getInstance(document.getElementById('revenueRateModal')).hide();
  } catch (error) {
    handleApiError(error, 'saving revenue rate');
  } finally {
    showLoader(false);
  }
}

// Updated delete functions with API integration
async function deleteIndustry(id) {
  if (!confirm('Are you sure you want to delete this industry? This will also delete all associated sectors and business types.')) {
    return;
  }

  showLoader(true);

  try {
    const response = await fetch('https://payzamfara.com/php/index.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        endpoint: 'deleteIndustry',
        data: { id }
      })
    });

    const result = await response.json();

    if (result.status !== 1) {
      throw new Error(result.message || 'Failed to delete industry');
    }

    await fetchHierarchyData();
  } catch (error) {
    handleApiError(error, 'deleting industry');
  } finally {
    showLoader(false);
  }
}

async function deleteSector(id) {
  if (!confirm('Are you sure you want to delete this sector? This will also delete all associated business types.')) {
    return;
  }

  showLoader(true);

  try {
    const response = await fetch('https://payzamfara.com/php/index.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        endpoint: 'deleteSector',
        data: { id }
      })
    });

    const result = await response.json();

    if (result.status !== 1) {
      throw new Error(result.message || 'Failed to delete sector');
    }

    await fetchHierarchyData();
  } catch (error) {
    handleApiError(error, 'deleting sector');
  } finally {
    showLoader(false);
  }
}

async function deleteBusinessType(id) {
  if (!confirm('Are you sure you want to delete this business type?')) {
    return;
  }

  showLoader(true);

  try {
    const response = await fetch('https://payzamfara.com/php/index.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        endpoint: 'deleteBusinessType',
        data: { id }
      })
    });

    const result = await response.json();

    if (result.status !== 1) {
      throw new Error(result.message || 'Failed to delete business type');
    }

    await fetchHierarchyData();
  } catch (error) {
    handleApiError(error, 'deleting business type');
  } finally {
    showLoader(false);
  }
}

async function deleteRevenueRate(id) {
  if (!confirm('Are you sure you want to delete this revenue rate?')) {
    return;
  }

  showLoader(true);

  try {
    const response = await fetch('https://payzamfara.com/php/index.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        endpoint: 'deleteRevenueRate',
        data: { id }
      })
    });

    const result = await response.json();

    if (result.status !== 1) {
      throw new Error(result.message || 'Failed to delete revenue rate');
    }

    // Refresh revenue rates data
    const ratesResponse = await fetch('https://payzamfara.com/php/index.php?getRevenueRates');
    const ratesData = await ratesResponse.json();
    if (ratesData.status === 1) {
      revenueRates = ratesData.rates;
      renderRevenueRatesTable();
    }
  } catch (error) {
    handleApiError(error, 'deleting revenue rate');
  } finally {
    showLoader(false);
  }
}

// Edit industry
function editIndustry(id) {
  showIndustryModal(id);
}

// Edit sector
function editSector(id) {
  showSectorModal(id);
}

// Edit business type
function editBusinessType(id) {
  showBusinessTypeModal(id);
}

// Delete industry
async function deleteIndustry(id) {
  if (!confirm('Are you sure you want to delete this industry? This will also delete all associated sectors and business types.')) {
    return;
  }

  try {
    // In a real implementation, you would call your API here
    console.log('Deleting industry:', id);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // For demo purposes, we'll just update the local data
    industries = industries.filter(i => i.id !== id);
    sectors = sectors.filter(s => s.industry_id !== id);
    businessTypes = businessTypes.filter(b => b.industry_id !== id);

    renderTables();
  } catch (error) {
    console.error('Error deleting industry:', error);
    alert('Failed to delete industry');
  }
}

// Delete sector
async function deleteSector(id) {
  if (!confirm('Are you sure you want to delete this sector? This will also delete all associated business types.')) {
    return;
  }

  try {
    // In a real implementation, you would call your API here
    console.log('Deleting sector:', id);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // For demo purposes, we'll just update the local data
    sectors = sectors.filter(s => s.id !== id);
    businessTypes = businessTypes.filter(b => b.sector_id !== id);

    renderTables();
  } catch (error) {
    console.error('Error deleting sector:', error);
    alert('Failed to delete sector');
  }
}

// Delete business type
async function deleteBusinessType(id) {
  if (!confirm('Are you sure you want to delete this business type?')) {
    return;
  }

  try {
    // In a real implementation, you would call your API here
    console.log('Deleting business type:', id);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // For demo purposes, we'll just update the local data
    businessTypes = businessTypes.filter(b => b.id !== id);

    renderTables();
  } catch (error) {
    console.error('Error deleting business type:', error);
    alert('Failed to delete business type');
  }
}