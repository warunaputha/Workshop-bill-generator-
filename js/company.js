

/* =================================
   COMPANY.JS
================================= */

/* =================================
   GENERATE NEXT BILL NUMBER
================================= */

function generateNextBillNumber() {

  const today = new Date();

  const year =
    today.getFullYear();

  const month =
    String(
      today.getMonth() + 1
    ).padStart(2, "0");


  /* ===== GET COMPANY PREFIX ===== */

  let savedCompany = {};

  try {

    savedCompany =
      JSON.parse(
        localStorage.getItem("companyDetails")
      ) || {};

  } catch (error) {

    console.error(
      "Company Details JSON Error:",
      error
    );

  }


  const prefix =
  String(
    savedCompany.prefix || ""
  )
    .trim()
    .toUpperCase() || "HRM";


  /* ===== GET SAVED BILLS ===== */

  let bills = [];

  try {

    bills =
      JSON.parse(
        localStorage.getItem("hrmBills")
      ) || [];

    if (!Array.isArray(bills)) {
      bills = [];
    }

  } catch (error) {

    console.error(
      "Bill History JSON Error:",
      error
    );

  }
  
  
  
  /* ===== CHECK DUPLICATE BILL NUMBERS ===== */

const seenBillNumbers = new Set();

let hasDuplicate = false;

bills.forEach(function(bill) {

  // Skip invalid bill records
  if (
    !bill ||
    typeof bill !== "object" ||
    Array.isArray(bill)
  ) {
    return;
  }

  const billNo =
    String(
      bill.billNo || ""
    ).trim().toUpperCase();

  if (!billNo) return;

  if (seenBillNumbers.has(billNo)) {

    console.warn(
      "Duplicate Bill Number Found:",
      billNo
    );

    hasDuplicate = true;

  } else {

    seenBillNumbers.add(billNo);

  }

});


if (hasDuplicate) {

  alert(
    "⚠️ Duplicate Bill Numbers Found!\n\n" +
    "Please check your Bill History before generating a new Bill Number."
  );

  return;

}


  /* ===== FIND LAST BILL NUMBER ===== */

  let lastSequence = 0;

const escapedPrefix =
  prefix.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );

const pattern =
  new RegExp(
    "^" +
    escapedPrefix +
    "\\d{6}(\\d{4})$"
  );


  bills.forEach(function(bill) {

  // Skip invalid bill records
  if (
    !bill ||
    typeof bill !== "object" ||
    Array.isArray(bill)
  ) {
    return;
  }

  const billNo =
    String(
      bill.billNo || ""
    ).trim().toUpperCase();

  const match =
    billNo.match(pattern);

  if (match) {

    const sequence =
      Number(match[1]) || 0;

    if (sequence > lastSequence) {

      lastSequence =
        sequence;

    }

  }

});


/* ===== SEQUENCE LIMIT CHECK ===== */

if (lastSequence >= 9999) {

  alert(
    "⚠️ Bill Number Sequence Limit Reached!\n\n" +
    "Maximum sequence number (9999) has been reached.\n\n" +
    "Please review your Bill Number settings."
  );

  return;

}



  /* ===== NEXT SEQUENCE ===== */

  const nextSequence =
    lastSequence + 1;

  const sequence =
    String(nextSequence)
      .padStart(4, "0");


  /* ===== FINAL BILL NUMBER ===== */

  const billNoInput =
    document.getElementById("billNo");

  if (billNoInput) {

    billNoInput.value =
      `${prefix}${year}${month}${sequence}`;

  }

}



/* ===== SAVE COMPANY DETAILS ===== */


function saveCompanyDetails() {

  const logoInput =
    document.getElementById("companyLogo");


  // ===== COMPANY LOGO VALIDATION =====

  if (logoInput.files.length > 0) {

    const file = logoInput.files[0];

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp"
    ];

    if (!allowedTypes.includes(file.type)) {

      alert(
        "Invalid Logo File!\n\n" +
        "Please select PNG, JPG, JPEG or WEBP image."
      );

      logoInput.value = "";
      return;
    }

    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {

      alert(
        "Logo File Too Large!\n\n" +
        "Maximum allowed size is 2 MB."
      );

      logoInput.value = "";
      return;
    }

  }


  // ===== READ PREVIOUS STORAGE DATA =====

  let previousLogo;
  let previousCompanyDetails;

  try {

    previousLogo =
      localStorage.getItem("companyLogo");

    previousCompanyDetails =
      localStorage.getItem("companyDetails");

  } catch (error) {

    console.error(
      "LocalStorage Read Error:",
      error
    );

    alert(
      "Unable to access saved Company Details.\n\n" +
      "Please check your browser storage."
    );

    return;
  }


  // ===== COMPANY DETAILS OBJECT =====

  const companyDetails = {

    name:
      document.getElementById("companyName").value,

    prefix:
      document.getElementById("billPrefix").value
        .trim()
        .toUpperCase(),
        
        
        

    // Selected Business Type
  businessType:
    document.getElementById("companyType").value,

  // Editable Business Description
  type:
    document.getElementById("companyTypeDescription").value.trim(),

    address:
      document.getElementById("companyAddress").value,

    contact:
      document.getElementById("companyContact").value,

    email:
      document.getElementById("companyEmail").value

    

  };


  // ===== UPDATE MAIN COMPANY HEADER =====

  function updateCompanyHeader() {

    document.getElementById("mainCompanyName").textContent =
      companyDetails.name || "HighResist MOTORS";

    document.getElementById("mainCompanyType").textContent =
      companyDetails.type || "";

    document.getElementById("mainCompanyAddress").textContent =
      companyDetails.address || "";

    document.getElementById("mainCompanyContact").textContent =
      "Tel: " + (companyDetails.contact || "-");

    document.getElementById("mainCompanyEmail").textContent =
      "Email: " + (companyDetails.email || "-");

  }


  // ===== RESTORE PREVIOUS STORAGE DATA =====

  function restorePreviousData() {

    try {

      if (previousLogo === null) {

        localStorage.removeItem("companyLogo");

      } else {

        localStorage.setItem(
          "companyLogo",
          previousLogo
        );

      }


      if (previousCompanyDetails === null) {

        localStorage.removeItem("companyDetails");

      } else {

        localStorage.setItem(
          "companyDetails",
          previousCompanyDetails
        );

      }

    } catch (rollbackError) {

      console.error(
        "Storage Rollback Error:",
        rollbackError
      );

    }

  }


  // ===== SAVE WITHOUT NEW LOGO =====

  if (logoInput.files.length === 0) {

    try {

      localStorage.setItem(
        "companyDetails",
        JSON.stringify(companyDetails)
      );

    } catch (error) {

      console.error(
        "Company Details Save Error:",
        error
      );

      restorePreviousData();

      alert(
        "Company Details Save Failed!\n\n" +
        "Your previous saved data has been protected."
      );

      return;
    }


    updateCompanyHeader();

    alert(
      "Company Details Saved Successfully!"
    );

    generateNextBillNumber();

    return;

  }


  // ===== SAVE NEW LOGO =====

  const file =
    logoInput.files[0];

  const reader =
    new FileReader();


  reader.onload = function(e) {

    const newLogo =
      e.target.result;

    try {

      // Save new logo
      localStorage.setItem(
        "companyLogo",
        newLogo
      );

      


      // Save company details
      localStorage.setItem(
        "companyDetails",
        JSON.stringify(companyDetails)
      );


    } catch (error) {

      console.error(
        "Company Details & Logo Save Error:",
        error
      );

      restorePreviousData();

      logoInput.value = "";

      alert(
        "Company Details & Logo Save Failed!\n\n" +
        "Your previous saved data has been protected."
      );

      return;

    }


    // ===== UPDATE HEADER AFTER SUCCESSFUL SAVE =====

    updateCompanyHeader();

    const mainLogo =
      document.getElementById("mainCompanyLogo");

    mainLogo.src =
      newLogo;

    mainLogo.style.display =
      "block";


    alert(
      "Company Details & Logo Saved Successfully!"
    );

    generateNextBillNumber();

  };


  // ===== FILE READER ERROR HANDLING =====

  reader.onerror = function() {

    console.error(
      "Company Logo Read Error:",
      reader.error
    );

    alert(
      "Logo Reading Failed!\n\n" +
      "Please select another image and try again."
    );

    logoInput.value = "";

  };


  reader.readAsDataURL(file);

}




    
    
/* =================================
   GENERATE COMPANY PREFIX
================================= */

function generateCompanyPrefix(companyName) {

  // Convert company name to uppercase
  const name =
    String(companyName || "")
      .trim()
      .toUpperCase();

  // Split company name into words
  const words =
    name
      .split(/\s+/)
      .map(function(word) {
        return word.replace(/[^A-Z0-9]/g, "");
      })
      .filter(Boolean);


  // Empty company name
  if (words.length === 0) {
    return "";
  }


  let prefix = "";


  // One word: First three characters
  if (words.length === 1) {

    prefix =
      words[0].slice(0, 3);

  }


  // Two words: First letter of first word
  // + First two letters of second word
  else if (words.length === 2) {

    prefix =
      words[0].charAt(0) +
      words[1].slice(0, 2);

  }


  // Three or more words:
  // First letter of first three words
  else {

    prefix =
      words
        .slice(0, 3)
        .map(function(word) {
          return word.charAt(0);
        })
        .join("");

  }


  return prefix.slice(0, 3);

}


/* =================================
   HANDLE COMPANY NAME CHANGE
================================= */

function handleCompanyNameChange() {

  const companyName =
    document.getElementById("companyName").value;

  const prefixInput =
    document.getElementById("billPrefix");

  if (!prefixInput) return;

  prefixInput.value =
    generateCompanyPrefix(companyName);

}

    
    
    
    /* =================================
   UPDATE COMPANY TYPE DESCRIPTION
================================= */

function updateCompanyTypeDescription() {

  const companyType =
    document.getElementById("companyType");

  const description =
    document.getElementById("companyTypeDescription");

  if (!companyType || !description) return;

  description.value =
    companyType.value;
    
    
    
    // UPDATE HEADER BACKGROUND
    updateCompanyHeaderBackground();

}





/* =================================
   COMPANY HEADER BACKGROUND
================================= */

function updateCompanyHeaderBackground() {

  const header =
    document.querySelector(".main-company-header");

  const companyType =
    document.getElementById("companyType");


  // DOM SAFETY CHECK

  if (!header || !companyType) {
    return;
  }


  // BUSINESS TYPE IMAGE MAPPING

  const backgroundImages = {

    "Automotive Electrical Repair & Service Station":
      "assets/images/automotive-electrical.webp",

    "All Car Repair & Service Station":
      "assets/images/automotive-workshop.webp"

  };


  // SELECT IMAGE

  const selectedImage =
    backgroundImages[companyType.value] ||
   "assets/images/header-bg.jpg";


  // APPLY BACKGROUND IMAGE

  header.style.backgroundImage =

    `linear-gradient(
      rgba(255, 255, 255, 0.82),
      rgba(255, 255, 255, 0.82)
    ),
    url("${selectedImage}")`;

}



    
        
    /* ===== COMPANY LOGO PREVIEW ===== */

function previewCompanyLogo(event) {

  const file = event.target.files[0];

  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.onload = function(e) {

    const logoPreview =
      document.getElementById("logoPreview");

    logoPreview.src = e.target.result;
    logoPreview.style.display = "inline-block";

  };

  reader.readAsDataURL(file);
}
    
    
    
/* =================================
   COMPANY DETAILS COMPLETION
================================= */

function updateCompanyCompletion() {

  const fields = [
  "companyName",
  "billPrefix",
  "companyType",
  "companyAddress",
  "companyContact",
  "companyEmail",
  "companyLogo"
];

  let completedFields = 0;

  fields.forEach(function(id) {

  const field =
    document.getElementById(id);

  if (!field) return;

  if (id === "companyLogo") {

    if (
      field.files.length > 0 ||
      localStorage.getItem("companyLogo")
    ) {

      completedFields++;

    }

  } else if (field.value.trim() !== "") {

    completedFields++;

  }

});


  const percentage =
    Math.round(
      (completedFields / fields.length) * 100
    );


  const display =
    document.getElementById(
      "companyCompletion"
    );

  if (display) {

  display.style.background =
    `conic-gradient(
      #16a34a ${percentage}%,
      #e5e7eb ${percentage}%
    )`;

  document.getElementById(
    "companyCompletionText"
  ).textContent =
    percentage + "%";

}

}





/* ===== COMPLETION AUTO UPDATE ===== */

[
  "companyName",
  "billPrefix",
  "companyType",
  "companyAddress",
  "companyContact",
  "companyEmail",
  "companyLogo"
].forEach(function(id) {

  const field =
    document.getElementById(id);

  if (field) {

    field.addEventListener(
      "input",
      updateCompanyCompletion
    );

    field.addEventListener(
      "change",
      updateCompanyCompletion
    );

  }

});

    
    
    
function toggleCompanyDetails() {

  const content =
    document.getElementById(
      "companyDetailsContent"
    );

  const arrow =
    document.getElementById(
      "companyDetailsArrow"
    );

  content.classList.toggle("collapsed");


  if (content.classList.contains("collapsed")) {

    arrow.textContent = "+";

    arrow.classList.remove("open");

  } else {

    arrow.textContent = "×";

    arrow.classList.add("open");

  }

}



/* ===== INITIAL COMPLETION CHECK ===== */

window.addEventListener(
  "load",
  function() {

    updateCompanyCompletion();

  }
);
