const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const mdaId = urlParams.get('id');
const mdn = urlParams.get('name');
let ALLREV = [];
let ALLREVS = [];

const adminInfo2 = JSON.parse(localStorage.getItem("adminDataPrime")) || {};

// Utility function to format currency
function formatMoney(amount) {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  });
}

// Cache DOM elements
const elements = {
  loader: $("#loader"),
  revHeadsShow: $("#revHeadsShow"),
  revHeadsShow2: $("#revHeadsShow2"),
  msgBox: $("#msg_box"),
  msgBox2: $("#msg_box2"),
  msgBox22: $("#msg_box22"),
  createRevenueBtn: $("#createRevenue"),
  editRevenueBtn: $("#editRevenue"),
  bulkCreateRevBtn: $("#bulkCreateRev"),
  dataTable: $('#dataTable'),
  dataTable1: $('#dataTable1')
};

// Generic error handler
function handleError(error, element, originalText = "") {
  console.error(error);
  if (element) {
    element.html(`<p class="text-danger text-center mt-4 text-lg">Something went wrong!</p>`);
    if (originalText) element.removeClass("hidden");
  }
}

// Fetch revenue heads with status
async function fetchRevenueHeads(status) {
  try {
    const targetElement = status === 'approved' ? elements.revHeadsShow : elements.revHeadsShow2;
    targetElement.html("");
    elements.loader.css("display", "flex");

    const response = await fetch(`${HOST}/?getRevenueHeadByStatus&mdaName=${mdn}&status=${status}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const revHeads = await response.json();
    if (status === 'approved') {
      ALLREV = revHeads;
    } else {
      ALLREVS = revHeads;
    }

    if (revHeads.status === 0) {
      status === 'approved' ? elements.dataTable.DataTable() : elements.dataTable1.DataTable();
    } else {
      renderRevenueHeads(revHeads.message, status);
    }
  } catch (error) {
    handleError(error, elements.loader);
  } finally {
    elements.loader.css("display", "none");
  }
}

// Render revenue heads to the table
function renderRevenueHeads(revHeads, status) {
  const targetElement = status === 'approved' ? elements.revHeadsShow : elements.revHeadsShow2;
  const isAdmin = adminInfo2.mda_access !== "view";

  revHeads.forEach((revHd, i) => {
    const row = `
      <tr class="relative">
        <td>${i + 1}</td>
        <td>${revHd.COL_4 || ''}</td>
        <td>${revHd.COL_5 || ''}</td>
        ${status === 'approved' ? `<td>${revHd.demand_notice || ''}</td>` : ''}
        <td>${revHd.remita_code || ''}</td>
        <td>${revHd.frequency || ''}</td>
        <td>${formatMoney(parseInt(revHd.COL_6) || 0)}</td>
        <td>${revHd.total_gen_revenue ? formatMoney(parseInt(revHd.total_gen_revenue)) : '₦ 0'}</td>
        <td>
          <div class="flex items-center gap-3">
            ${isAdmin ? `
              <button onclick="deleteRev(this)" data-revid="${revHd.id}">
                <iconify-icon icon="material-symbols:delete-outline-rounded"></iconify-icon>
              </button>
              <button onclick="editRevFunc(this)" data-revid="${revHd.id}" data-bs-toggle="modal" data-bs-target="#editRev">
                <iconify-icon icon="material-symbols:edit-square-outline"></iconify-icon>
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
    targetElement.append(row);
  });

  status === 'approved' ? elements.dataTable.DataTable() : elements.dataTable1.DataTable();
}

// Delete revenue head
function deleteRev(e) {
  const theRevId = e.dataset.revid;
  
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: "GET",
        url: `${HOST}?deleteRevenueHead&id=${theRevId}`,
        dataType: "json",
        success: (data) => {
          if (data.status === 1) {
            Swal.fire('Deleted!', 'Revenue Head has been deleted.', 'success');
            setTimeout(() => window.location.reload(), 1000);
          } else {
            Swal.fire('Error!', 'Something went wrong, try again!', 'error');
          }
        },
        error: () => Swal.fire('Error!', 'Something went wrong, try again!', 'error')
      });
    }
  });
}

// Edit revenue function
function editRevFunc(e) {
  const editaID = e.dataset.revid;
  sessionStorage.setItem("revUpdate", editaID);

  const allItems = [...(ALLREV.message || []), ...(ALLREVS.message || [])];
  const theREV = allItems.find(dd => dd.id === editaID);
  
  if (theREV) {
    const allInputss = document.querySelectorAll(".revInput2");
    const fields = [
      theREV.COL_4,        // 0
      theREV.COL_6,        // 1
      theREV.remita_code,  // 2
      theREV.COL_2,        // 3
      theREV.COL_5,        // 4
      theREV.demand_notice,// 5
      theREV.status,       // 6
      theREV.frequency     // 7
    ];
    
    allInputss.forEach((input, index) => {
      if (fields[index]) input.value = fields[index];
    });
  }
}

// Fetch MDA information
async function fetchMDAs() {
  try {
    $("#showThem").html("");
    elements.loader.css("display", "flex");

    const response = await fetch(`${HOST}/?getMDAs`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const MDAs = await response.json();
    elements.loader.css("display", "none");

    if (MDAs.status !== 0) {
      const theMDA = MDAs.message.find(mda => mda.id === mdaId);
      if (theMDA) {
        renderMDAInfo(theMDA);
      }
    }
  } catch (error) {
    handleError(error, elements.loader);
  }
}

// Render MDA information
function renderMDAInfo(mda) {
  $("#industryy").html(mda.fullname);
  
  $("#otherInfo").html(`
    <h1 class="text-2xl">${mda.fullname}</h1>
    <p><span class="font-bold">Email Address:</span> <span>${mda.email || 'N/A'}</span></p>
    <p><span class="font-bold">LGA:</span> <span>${mda.lga || 'N/A'}</span></p>
    <p><span class="font-bold">Number of Revenue heads:</span> <span>${mda.total_count || 0}</span></p>
    <p><span class="font-bold">Date created:</span> <span>${mda.time_in || 'N/A'}</span></p>
    <p><span class="font-bold">Contact:</span> <span>${mda.phone || 'N/A'}</span></p>
    <p><span class="font-bold">Status:</span> <span class="badge ${mda.status === "active" ? 'bg-primary' : 'bg-danger'}">${mda.status}</span></p>
  `);

  $("#actBtn").html(mda.status === "active" 
    ? `<button class="btn btn-danger">Deactivate</button>`
    : `<button class="btn btn-success">Activate</button>`
  );

  renderToggle("#allow_payment", mda.allow_payment === "yes");
  renderToggle("#user_creation", mda.office_creation === "yes");
}

function renderToggle(selector, isChecked) {
  $(selector).html(`
    <p>No</p>
    <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" ${isChecked ? 'checked' : ''}>
    <p>Yes</p>
  `);
}

// Create revenue head
function createRevenueHead() {
  elements.msgBox.html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `);
  elements.createRevenueBtn.addClass("hidden");

  const allInputs = document.querySelectorAll(".revInput");
  const categInputs = document.querySelectorAll(".form-check-input");
  
  const obj = {
    endpoint: "createMDArHead",
    data: {
      mda_id: mdn,
      economicCode: "045RF",
      adminCode: "22",
      status: "active"
    }
  };

  allInputs.forEach(input => {
    obj.data[input.dataset.name] = input.value;
  });

  const categories = Array.from(categInputs)
    .filter(input => input.checked)
    .map(input => input.value);
  obj.data.category = categories.join(",");

  $.ajax({
    type: "POST",
    url: HOST,
    dataType: 'json',
    data: JSON.stringify(obj),
    success: (data) => {
      elements.msgBox.html("");
      
      for (const [key, value] of Object.entries(data)) {
        const className = value.status === 1 ? "text-success" : "text-warning";
        elements.msgBox.append(`<p class="${className} text-center mt-4 text-lg">${key}: ${value.message}</p>`);
      }
      
      setTimeout(() => {
        $('#createRevenueHead').modal('hide');
        window.location.reload();
      }, 1000);
    },
    error: (error) => {
      handleError(error, elements.msgBox, "Create Revenue");
    }
  });
}

// Update revenue head
function updateRevenueHead() {
  const theRevId = sessionStorage.getItem("revUpdate");
  elements.msgBox2.html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `);
  elements.editRevenueBtn.addClass("hidden");

  const allInputs = document.querySelectorAll(".revInput2");
  const data = { id: theRevId };

  allInputs.forEach(input => {
    data[input.dataset.name] = input.value;
  });

  const queryString = $.param(data);

  $.ajax({
    type: "GET",
    url: `${HOST}?updateRevenueHead&${queryString}`,
    dataType: "json",
    success: (data) => {
      if (data.status === 2) {
        elements.msgBox2.html(`<p class="text-warning text-center mt-4 text-lg">${data.message}</p>`);
        elements.editRevenueBtn.removeClass("hidden");
      } else if (data.status === 1) {
        elements.msgBox2.html(`<p class="text-success text-center mt-4 text-lg">${data.message}</p>`);
        setTimeout(() => {
          $('#editMda').modal('hide');
          window.location.reload();
        }, 1000);
      }
    },
    error: (error) => {
      handleError(error, elements.msgBox2, "Edit Revenue");
    }
  });
}

// Handle CSV file upload
function handleCSVUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const parsedData = Papa.parse(event.target.result, { header: true }).data;
      // Remove empty last row if exists
      if (parsedData.length > 0 && !parsedData[parsedData.length - 1].status) {
        parsedData.pop();
      }
      window.theMDAData = parsedData;
    } catch (error) {
      console.error("Error parsing CSV:", error);
    }
  };
  reader.readAsText(file);
}

// Bulk create revenue heads
function bulkCreateRevenueHeads() {
  if (!window.theMDAData || window.theMDAData.length === 0) {
    elements.msgBox22.html(`<p class="text-warning text-center mt-4 text-lg">No data to upload!</p>`);
    return;
  }

  elements.msgBox22.html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `);
  elements.bulkCreateRevBtn.addClass("hidden");

  const datatoPush = {
    endpoint: "createMultplerHead",
    data: window.theMDAData
  };

  $.ajax({
    type: "POST",
    url: HOST,
    dataType: 'json',
    data: JSON.stringify(datatoPush),
    success: (data) => {
      if (data.status === 2) {
        elements.msgBox22.html(`<p class="text-warning text-center mt-4 text-lg">${data.message}</p>`);
      } else if (data.status === 1) {
        elements.msgBox22.html(`<p class="text-success text-center mt-4 text-lg">${data.message}</p>`);
        setTimeout(() => {
          $('#bulkCreateRevModal').modal('hide');
          window.location.reload();
        }, 1000);
      }
      elements.bulkCreateRevBtn.removeClass("hidden");
    },
    error: (error) => {
      handleError(error, elements.msgBox22, "Bulk Create");
    }
  });
}

// Event listeners
document.getElementById('csv-file')?.addEventListener('change', handleCSVUpload);
elements.createRevenueBtn.on("click", createRevenueHead);
elements.editRevenueBtn.on("click", updateRevenueHead);
elements.bulkCreateRevBtn.on("click", bulkCreateRevenueHeads);

// Initial data loading
$(document).ready(() => {
  fetchRevenueHeads('approved');
  fetchRevenueHeads('pending');
  fetchMDAs();
});