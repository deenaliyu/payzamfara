
// Fixed rates for statutory deductions
const PENSION_RATE = 0.08;  // 8%
const NHIS_RATE = 0.05;     // 5%
const NHF_RATE = 0.025;     // 2.5%

// Format number with commas
function formatNumber(num) {
  return num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Parse formatted number
function parseNumber(str) {
  return parseFloat(str.replace(/,/g, '')) || 0;
}

// Update toggle group visual state
function updateToggleGroup(type) {
  const toggle = document.getElementById(`${type}Toggle`);
  const group = document.getElementById(`${type}Group`);
  const rateText = document.getElementById(`${type}RateText`);

  if (toggle.checked) {
    group.classList.add('active');
    rateText.classList.add('active');
  } else {
    group.classList.remove('active');
    rateText.classList.remove('active');
  }
}

// Initialize toggle states on load
document.addEventListener('DOMContentLoaded', function () {
  updateToggleGroup('pension');
  updateToggleGroup('nhis');
  updateToggleGroup('nhf');
  showLaw('old');
});

// Input formatting for currency fields
document.querySelectorAll('.tax-input').forEach(input => {
  input.addEventListener('input', function (e) {
    // Remove non-numeric characters except decimal
    let value = e.target.value.replace(/[^\d.]/g, '');

    // Remove extra decimal points
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }

    e.target.value = value;
  });

  input.addEventListener('blur', function (e) {
    if (e.target.value) {
      e.target.value = formatNumber(parseNumber(e.target.value));
    }
  });
});

/**
 * Calculate Consolidated Relief Allowance (CRA) for Old Law
 * Based on Excel calculation: CRA = 20% of Gross Income
 */
function calculateCRA(grossIncome) {
  return grossIncome * 0.20;  // 20% of Gross Income
}

/**
 * Calculate Rent Relief for New Law
 * Rent Relief = Lower of (20% × annual rent paid) or ₦500,000
 */
function calculateRentRelief(rentPaid) {
  if (rentPaid <= 0) return 0;
  const twentyPercentRent = 0.20 * rentPaid;
  return Math.min(twentyPercentRent, 500000);
}

/**
 * Calculate tax under Old Law
 * Tax bands: 7%, 11%, 15%, 19%, 21%, 24%
 */
function calculateOldTax(taxableIncome) {
  const brackets = [
    { limit: 300000, rate: 0.07, label: 'First ₦300,000' },
    { limit: 300000, rate: 0.11, label: 'Next ₦300,000' },
    { limit: 500000, rate: 0.15, label: 'Next ₦500,000' },
    { limit: 500000, rate: 0.19, label: 'Next ₦500,000' },
    { limit: 1600000, rate: 0.21, label: 'Next ₦1,600,000' },
    { limit: Infinity, rate: 0.24, label: 'Above ₦3,200,000' }
  ];

  let remainingIncome = taxableIncome;
  let totalTax = 0;
  let breakdown = [];

  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;

    const taxableAmount = Math.min(remainingIncome, bracket.limit);
    const bracketTax = taxableAmount * bracket.rate;
    totalTax += bracketTax;

    if (taxableAmount > 0) {
      breakdown.push({
        description: bracket.label,
        calculation: `₦${formatNumber(taxableAmount)} × ${(bracket.rate * 100)}%`,
        amount: bracketTax
      });
    }

    remainingIncome -= taxableAmount;
  }

  return { total: totalTax, breakdown };
}

/**
 * Calculate tax under New Law (2026)
 * Tax bands: 0% (first ₦800,000), 15%, 18%, 21%, 24%
 */
function calculateNewTax(taxableIncome) {
  const brackets = [
    { limit: 800000, rate: 0.00, label: 'First ₦800,000 (Tax-Free)' },
    { limit: 2200000, rate: 0.15, label: 'Next ₦2,200,000' },
    { limit: 9000000, rate: 0.18, label: 'Next ₦9,000,000' },
    { limit: 10000000, rate: 0.21, label: 'Next ₦10,000,000' },
    { limit: Infinity, rate: 0.24, label: 'Above ₦22,000,000' }
  ];

  let remainingIncome = taxableIncome;
  let totalTax = 0;
  let breakdown = [];

  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;

    const taxableAmount = Math.min(remainingIncome, bracket.limit);
    const bracketTax = taxableAmount * bracket.rate;
    totalTax += bracketTax;

    if (taxableAmount > 0) {
      breakdown.push({
        description: bracket.label,
        calculation: `₦${formatNumber(taxableAmount)} × ${(bracket.rate * 100)}%`,
        amount: bracketTax
      });
    }

    remainingIncome -= taxableAmount;
  }

  return { total: totalTax, breakdown };
}

// Store calculation results globally for toggle switching
let calculationResults = null;

/**
 * Main Tax Calculation Function
 */
function calculateTax() {
  // Get input values
  const income = parseNumber(document.getElementById('annualIncome').value);

  if (!income || income <= 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Invalid Input',
      text: 'Please enter a valid annual income amount.'
    });
    return;
  }

  // Get toggle states
  const pensionEnabled = document.getElementById('pensionToggle').checked;
  const nhisEnabled = document.getElementById('nhisToggle').checked;
  const nhfEnabled = document.getElementById('nhfToggle').checked;

  // Get other deductions
  const rent = parseNumber(document.getElementById('rentPaid').value);
  const insurance = parseNumber(document.getElementById('lifeInsurance').value);
  const others = parseNumber(document.getElementById('otherDeductions').value);

  // Calculate statutory deductions (only if toggled ON)
  const pensionDeduction = pensionEnabled ? income * PENSION_RATE : 0;
  const nhisDeduction = nhisEnabled ? income * NHIS_RATE : 0;
  const nhfDeduction = nhfEnabled ? income * NHF_RATE : 0;

  // ========== OLD LAW CALCULATION ==========
  // Formula: Taxable Income = Gross - CRA - NHF - NHIS - Pension - Life Insurance - Others
  // CRA = 20% of Gross Income
  const cra = calculateCRA(income);
  const oldTotalDeductions = nhfDeduction + nhisDeduction + pensionDeduction + insurance + others;
  const oldTaxableIncome = Math.max(0, income - cra - oldTotalDeductions);

  // Calculate Old Law Tax
  const oldTax = calculateOldTax(oldTaxableIncome);

  // ========== NEW LAW CALCULATION ==========
  // Formula: Taxable Income = Gross - NHF - NHIS - Pension - Rent Relief - Life Insurance - Others
  // NO CRA in New Law!
  // Rent Relief = Min(20% of Rent Paid, ₦500,000)
  const rentRelief = calculateRentRelief(rent);
  const newTotalDeductions = nhfDeduction + nhisDeduction + pensionDeduction + insurance + others;
  const newTaxableIncome = Math.max(0, income - newTotalDeductions - rentRelief);

  // Calculate New Law Tax
  const newTax = calculateNewTax(newTaxableIncome);

  // Calculate effective rates
  const oldEffectiveRate = income > 0 ? (oldTax.total / income) * 100 : 0;
  const newEffectiveRate = income > 0 ? (newTax.total / income) * 100 : 0;

  // Store results for toggle switching
  calculationResults = {
    income,
    pensionDeduction,
    nhisDeduction,
    nhfDeduction,
    insurance,
    others,
    rent,
    cra,
    rentRelief,
    oldTotalDeductions,
    newTotalDeductions,
    oldTaxableIncome,
    newTaxableIncome,
    oldTax,
    newTax,
    oldEffectiveRate,
    newEffectiveRate
  };

  // Display results
  displayResults();
}

/**
 * Display calculation results
 */
function displayResults() {
  if (!calculationResults) return;

  const {
    income, pensionDeduction, nhisDeduction, nhfDeduction, insurance, others, rent,
    cra, rentRelief, oldTotalDeductions, newTotalDeductions,
    oldTaxableIncome, newTaxableIncome, oldTax, newTax,
    oldEffectiveRate, newEffectiveRate
  } = calculationResults;

  // Show results, hide placeholder
  document.getElementById('resultsPlaceholder').style.display = 'none';
  document.getElementById('resultsDisplay').style.display = 'block';

  // Update comparison table
  document.getElementById('oldGrossIncome').textContent = `₦${formatNumber(income)}`;
  document.getElementById('newGrossIncome').textContent = `₦${formatNumber(income)}`;

  // Old Law: Show CRA + Deductions separately
  // New Law: Show only Deductions + Rent Relief
  document.getElementById('oldDeductions').textContent = `₦${formatNumber(oldTotalDeductions)}`;
  document.getElementById('newDeductions').textContent = `₦${formatNumber(newTotalDeductions + rentRelief)}`;

  document.getElementById('oldCRA').textContent = `₦${formatNumber(cra)}`;
  document.getElementById('newCRA').textContent = rentRelief > 0 ? `₦${formatNumber(rentRelief)}` : 'N/A';

  document.getElementById('oldTaxableIncome').innerHTML = `<strong>₦${formatNumber(oldTaxableIncome)}</strong>`;
  document.getElementById('newTaxableIncome').innerHTML = `<strong>₦${formatNumber(newTaxableIncome)}</strong>`;

  // Update tax bands
  updateTaxBands('old', oldTax.breakdown);
  updateTaxBands('new', newTax.breakdown);

  // Update deduction breakdown
  updateDeductionBreakdown(pensionDeduction, nhisDeduction, nhfDeduction, insurance, others, rent, rentRelief);

  // Show Old Law by default
  showLaw('old');
}

/**
 * Update deduction breakdown section
 */
function updateDeductionBreakdown(pension, nhis, nhf, insurance, others, rent, rentRelief) {
  const container = document.getElementById('deductionBreakdown');
  let html = '';

  if (pension > 0) {
    html += `<div class="deduction-item">
          <span>Pension (8%)</span>
          <span>₦${formatNumber(pension)}</span>
        </div>`;
  }

  if (nhis > 0) {
    html += `<div class="deduction-item">
          <span>NHIS (5%)</span>
          <span>₦${formatNumber(nhis)}</span>
        </div>`;
  }

  if (nhf > 0) {
    html += `<div class="deduction-item">
          <span>NHF (2.5%)</span>
          <span>₦${formatNumber(nhf)}</span>
        </div>`;
  }

  if (insurance > 0) {
    html += `<div class="deduction-item">
          <span>Life Insurance</span>
          <span>₦${formatNumber(insurance)}</span>
        </div>`;
  }

  if (others > 0) {
    html += `<div class="deduction-item">
          <span>Other Deductions</span>
          <span>₦${formatNumber(others)}</span>
        </div>`;
  }

  if (rent > 0) {
    html += `<div class="deduction-item">
          <span>Rent Paid (Annual)</span>
          <span>₦${formatNumber(rent)}</span>
        </div>`;
    if (rentRelief > 0) {
      html += `<div class="deduction-item" style="color: #CDA545;">
            <span>→ Rent Relief (New Law: 20%, max ₦500k)</span>
            <span>₦${formatNumber(rentRelief)}</span>
          </div>`;
    }
  }

  const total = pension + nhis + nhf + insurance + others;
  html += `<div class="deduction-item total">
        <span>Total Statutory Deductions</span>
        <span>₦${formatNumber(total)}</span>
      </div>`;

  container.innerHTML = html;
}

/**
 * Update tax bands display
 */
function updateTaxBands(lawType, breakdown) {
  const container = document.getElementById(`${lawType}TaxBands`);
  container.innerHTML = '';

  breakdown.forEach(item => {
    const div = document.createElement('div');
    div.className = 'tax-band-item';
    div.innerHTML = `
          <div class="band-description">${item.description}</div>
          <div class="band-calculation">
            <div class="band-calculation-text">${item.calculation}</div>
            <div class="band-amount">₦${formatNumber(item.amount)}</div>
          </div>
        `;
    container.appendChild(div);
  });
}

/**
 * Law toggle functionality
 */
function showLaw(lawType) {
  const buttons = document.querySelectorAll('.law-toggle-btn');
  buttons.forEach(btn => btn.classList.remove('active'));

  // Activate clicked button
  event.target.classList.add('active');

  // Show/hide columns based on selection
  const oldHeader = document.getElementById('oldLawHeader');
  const newHeader = document.getElementById('newLawHeader');
  const oldCells = document.querySelectorAll('td:nth-child(2), th:nth-child(2)');
  const newCells = document.querySelectorAll('td:nth-child(3), th:nth-child(3)');
  const oldBreakdown = document.getElementById('oldLawBreakdown');
  const newBreakdown = document.getElementById('newLawBreakdown');
  const reliefLabel = document.getElementById('reliefLabel');

  if (lawType === 'old') {
    oldHeader.style.display = '';
    newHeader.style.display = 'none';
    oldCells.forEach(cell => cell.style.display = '');
    newCells.forEach(cell => cell.style.display = 'none');
    oldBreakdown.style.display = '';
    newBreakdown.style.display = 'none';
    if (reliefLabel) reliefLabel.textContent = 'CRA (Consolidated Relief)';

    // Update result boxes with OLD LAW values
    if (calculationResults) {
      document.getElementById('totalAnnualTax').textContent = `₦${formatNumber(calculationResults.oldTax.total)}`;
      document.getElementById('monthlyEquivalent').textContent = `₦${formatNumber(calculationResults.oldTax.total / 12)}`;
      document.getElementById('effectiveTaxRate').textContent = `${calculationResults.oldEffectiveRate.toFixed(2)}%`;

    }

  } else if (lawType === 'new') {
    oldHeader.style.display = 'none';
    newHeader.style.display = '';
    oldCells.forEach(cell => cell.style.display = 'none');
    newCells.forEach(cell => cell.style.display = '');
    oldBreakdown.style.display = 'none';
    newBreakdown.style.display = '';
    if (reliefLabel) reliefLabel.textContent = 'Rent Relief';

    // Update result boxes with NEW LAW values
    if (calculationResults) {
      document.getElementById('totalAnnualTax').textContent = `₦${formatNumber(calculationResults.newTax.total)}`;
      document.getElementById('monthlyEquivalent').textContent = `₦${formatNumber(calculationResults.newTax.total / 12)}`;
      document.getElementById('effectiveTaxRate').textContent = `${calculationResults.newEffectiveRate.toFixed(2)}%`;

    }
  }
}

/**
 * Reset form
 */
function resetForm() {
  document.getElementById('annualIncome').value = '';
  document.getElementById('pensionToggle').checked = true;
  document.getElementById('nhisToggle').checked = true;
  document.getElementById('nhfToggle').checked = true;
  document.getElementById('rentPaid').value = '';
  document.getElementById('lifeInsurance').value = '';
  document.getElementById('otherDeductions').value = '';

  // Update toggle visual states
  updateToggleGroup('pension');
  updateToggleGroup('nhis');
  updateToggleGroup('nhf');

  // Clear calculation results
  calculationResults = null;

  // Show placeholder, hide results
  document.getElementById('resultsPlaceholder').style.display = 'block';
  document.getElementById('resultsDisplay').style.display = 'none';

  // Reset law toggle to Old Tax Law
  const buttons = document.querySelectorAll('.law-toggle-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  buttons[0].classList.add('active');
}

/**
 * Print results
 */
function printResults() {
  if (document.getElementById('resultsDisplay').style.display === 'none') {
    Swal.fire({
      icon: 'warning',
      title: 'No Results',
      text: 'Please calculate tax first before printing.'
    });
    return;
  }

  window.print();
}

/**
 * Copy breakdown to clipboard
 */
function copyBreakdown() {
  const resultsElement = document.getElementById('resultsDisplay');

  if (resultsElement.style.display === 'none') {
    Swal.fire({
      icon: 'warning',
      title: 'No Results',
      text: 'Please calculate tax first to copy breakdown.'
    });
    return;
  }

  if (!calculationResults) return;

  const activeLaw = document.querySelector('.law-toggle-btn.active').textContent;
  const isOldLaw = activeLaw.includes('Old');

  // Create text version
  const text = `
Payzamfara TAX CALCULATION
=======================
Date: ${new Date().toLocaleDateString()}
Law Applied: ${activeLaw}

Income Details:
Annual Gross Income: ₦${formatNumber(calculationResults.income)}
Pension (8%): ${document.getElementById('pensionToggle').checked ? '₦' + formatNumber(calculationResults.pensionDeduction) : 'Disabled'}
NHIS (5%): ${document.getElementById('nhisToggle').checked ? '₦' + formatNumber(calculationResults.nhisDeduction) : 'Disabled'}
NHF (2.5%): ${document.getElementById('nhfToggle').checked ? '₦' + formatNumber(calculationResults.nhfDeduction) : 'Disabled'}
Rent Paid: ₦${formatNumber(calculationResults.rent)}
Life Insurance: ₦${formatNumber(calculationResults.insurance)}
Other Deductions: ₦${formatNumber(calculationResults.others)}

${isOldLaw ? 'CRA' : 'Rent Relief'}: ₦${formatNumber(isOldLaw ? calculationResults.cra : calculationResults.rentRelief)}
Taxable Income: ₦${formatNumber(isOldLaw ? calculationResults.oldTaxableIncome : calculationResults.newTaxableIncome)}

Results:
Total Annual Tax: ${document.getElementById('totalAnnualTax').textContent}
Monthly Equivalent: ${document.getElementById('monthlyEquivalent').textContent}
Effective Tax Rate: ${document.getElementById('effectiveTaxRate').textContent}
      `.trim();

  navigator.clipboard.writeText(text).then(() => {
    Swal.fire({
      icon: 'success',
      title: 'Copied!',
      text: 'Tax breakdown copied to clipboard.',
      timer: 1500
    });
  }).catch(err => {
    console.error('Copy failed:', err);
    Swal.fire({
      icon: 'error',
      title: 'Copy Failed',
      text: 'Please try again or use Ctrl+C.'
    });
  });
}

/**
 * Download PDF (placeholder - would need a PDF library)
 */
function downloadPDF() {
  Swal.fire({
    icon: 'info',
    title: 'Coming Soon',
    text: 'PDF download feature will be available soon. For now, please use the Print option.'
  });
}
