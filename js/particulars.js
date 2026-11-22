

/* ===============================
   PARTICULARS.JS
================================ */


/* ===============================
   WORKSHOP SERVICE SUGGESTIONS
================================ */

const workshopSuggestions = [

  "Engine Oil Change",
  "Engine Oil & Filter Change",
  "Engine Repair",
  "Engine Tune-up",
  "Engine Overhaul",

  "Oil Filter Replacement",
  "Air Filter Replacement",
  "Fuel Filter Replacement",
  "Cabin Filter Replacement",

  "Battery Test",
  "Battery Replacement",
  "Battery Charging",
  "Battery Terminal Cleaning",

  "Brake Pad Replacement",
  "Brake Shoe Replacement",
  "Brake Disc Replacement",
  "Brake Service",
  "Brake Fluid Replacement",

  "Tyre Replacement",
  "Tyre Repair",
  "Tyre Rotation",
  "Wheel Alignment",
  "Wheel Balancing",

  "Vehicle Inspection",
  "Vehicle Service",
  "Full Service",
  "General Repair",

  "Radiator Repair",
  "Coolant Replacement",
  "Cooling System Service",

  "Spark Plug Replacement",
  "Ignition Coil Replacement",

  "AC Service",
  "AC Gas Refill",
  "AC Compressor Repair",

  "Clutch Repair",
  "Clutch Replacement",

  "Suspension Repair",
  "Shock Absorber Replacement",

  "Alternator Repair",
  "Starter Motor Repair",

  "Headlight Repair",
  "Electrical Repair"

];










/* ===============================
   GET RECENT SERVICE SUGGESTIONS
================================ */

function getRecentServiceSuggestions() {

  let bills = [];

  try {

    bills =
      JSON.parse(
        localStorage.getItem("hrmBills")
      ) || [];

    // Ensure valid array
    if (!Array.isArray(bills)) {
      bills = [];
    }

  } catch (error) {

    console.error(
      "Recent Services Loading Error:",
      error
    );

    bills = [];

  }


  const recentServices = [];


  // Newest bills first
  for (
    let i = bills.length - 1;
    i >= 0;
    i--
  ) {

    const bill = bills[i];


    // Validate Bill Object
    if (
      !bill ||
      typeof bill !== "object" ||
      Array.isArray(bill)
    ) {
      continue;
    }


    // Validate Items Array
    if (!Array.isArray(bill.items)) {
      continue;
    }


    bill.items.forEach(function(item) {

      // Validate Item Object
      if (
        !item ||
        typeof item !== "object" ||
        Array.isArray(item)
      ) {
        return;
      }


      // Validate Particulars String
      const service =
        typeof item.particulars === "string"
          ? item.particulars.trim()
          : "";


      // Empty service skip
      if (service === "") {
        return;
      }


      // Duplicate services skip
      const alreadyExists =
        recentServices.some(function(existing) {

          return (
            existing.toLowerCase() ===
            service.toLowerCase()
          );

        });


      if (!alreadyExists) {

        recentServices.push(
          service
        );

      }

    });

  }


  return recentServices;

}



/* ===============================
   CLOSE PARTICULAR SUGGESTIONS
================================ */

function closeParticularSuggestions() {

  const suggestionBox =
    document.querySelector(
      ".particular-suggestion-box"
    );

  if (!suggestionBox) return;

  // Hide shared box
  suggestionBox.style.display = "none";

  // Remove active status
  if (suggestionBox._activeInput) {

    suggestionBox._activeInput
      .removeAttribute(
        "data-suggestion-active"
      );

  }

  // Clear active input
  suggestionBox._activeInput = null;

}


/* ===============================
   SHOW PARTICULAR SUGGESTIONS
================================ */

function showParticularSuggestions(input) {

  const text =
    input.value.trim().toLowerCase();


  // GET SHARED SUGGESTION BOX

  const suggestionBox =
    document.querySelector(
      ".particular-suggestion-box"
    );

  if (!suggestionBox) {
    console.log("Suggestion box not found!");
    return;
  }
  
  
  
  // ENTER KEY - CLOSE SUGGESTION BOX
if (!input._enterKeyReady) {

  input.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

      if (suggestionBox._activeInput === input) {

        event.preventDefault();

        suggestionBox.style.display = "none";

        suggestionBox._activeInput = null;

        input.removeAttribute("data-suggestion-active");

      }

    }

  });

  input._enterKeyReady = true;
}
  
  
  // =================================
// TOUCH SCROLL / TAP SELECTION
// =================================

if (!suggestionBox._pointerSelectionReady) {

  suggestionBox._pointerSelectionReady = true;
  
  
  
  // PREVENT CLICK EVENT FROM REACHING UNDERLYING ELEMENTS
suggestionBox.addEventListener(
  "click",
  function(event) {
    event.preventDefault();
    event.stopPropagation();
  }
);


  // POINTER DOWN
  suggestionBox.addEventListener(
    "pointerdown",
    function(event) {

      const item =
        event.target.closest(
          ".particular-suggestion-item"
        );

      if (!item) return;

      event.preventDefault();

      this._pointerStart = {
        x: event.clientX,
        y: event.clientY,
        pointerId: event.pointerId,
        item: item,
        moved: false
      };

    }
  );


  // POINTER MOVE
  suggestionBox.addEventListener(
    "pointermove",
    function(event) {

      const start = this._pointerStart;

      if (!start) return;

      if (event.pointerId !== start.pointerId) {
        return;
      }

      const dx =
        event.clientX - start.x;

      const dy =
        event.clientY - start.y;

      if (
        Math.abs(dx) > 8 ||
        Math.abs(dy) > 8
      ) {

        start.moved = true;

      }

    }
  );


 
  // POINTER UP
  suggestionBox.addEventListener(
    "pointerup",
    function(event) {

      const start = this._pointerStart;

      this._pointerStart = null;

      if (!start) return;

      if (event.pointerId !== start.pointerId) {
        return;
      }

      // Prevent event from reaching elements below
      event.preventDefault();
      event.stopPropagation();

      // Select only when it was a Tap
      if (!start.moved) {

        selectParticularSuggestion(
          event,
          start.item
        );

      }

    }
  );



  // POINTER CANCEL
  suggestionBox.addEventListener(
    "pointercancel",
    function() {

      this._pointerStart = null;

    }
  );
  
  
  // POINTER LEAVE
suggestionBox.addEventListener(
  "pointerleave",
  function(event) {

    const start = this._pointerStart;

    if (!start) return;

    // Check active Pointer ID
    if (event.pointerId !== start.pointerId) {
      return;
    }

    // Clear Pointer State
    this._pointerStart = null;

  }
);

}


  // CLOSE PREVIOUS ACTIVE INPUT

  if (
    suggestionBox._activeInput &&
    suggestionBox._activeInput !== input
  ) {

    suggestionBox._activeInput
      .removeAttribute(
        "data-suggestion-active"
      );

  }


  // SET NEW ACTIVE INPUT

  suggestionBox._activeInput = input;

  input.setAttribute(
    "data-suggestion-active",
    "true"
  );


  // EMPTY INPUT

  if (text === "") {

    closeParticularSuggestions();
    return;

  }


  // GET RECENT SERVICES

  const recentServices =
    getRecentServiceSuggestions();


  // MATCH RECENT SERVICES

  const recentMatches =
    recentServices.filter(function(service) {

      return service.toLowerCase().includes(text);

    });


  // MATCH DEFAULT SERVICES

  const defaultMatches =
    workshopSuggestions.filter(function(service) {

      return service.toLowerCase().includes(text);

    });


  // REMOVE DUPLICATES

  const allSuggestions = [];

  function addUnique(service, type) {

    const exists =
      allSuggestions.some(function(item) {

        return item.text.toLowerCase() ===
          service.toLowerCase();

      });

    if (!exists) {

      allSuggestions.push({
        text: service,
        type: type
      });

    }

  }


  // RECENT FIRST

  recentMatches.forEach(function(service) {

    addUnique(service, "recent");

  });


  // DEFAULT AFTER

  defaultMatches.forEach(function(service) {

    addUnique(service, "default");

  });


  // NO RESULTS

 if (allSuggestions.length === 0) {

  suggestionBox.replaceChildren();

  suggestionBox.style.display = "none";

  return;

}


  
  // =================================
  // BUILD SUGGESTION UI - DOM SAFE
  // =================================

  const fragment =
    document.createDocumentFragment();

  let recentAdded = false;
  let defaultAdded = false;


  allSuggestions
    .slice(0, 8)
    .forEach(function(item) {

      // ===== RECENT HEADER =====

      if (
        item.type === "recent" &&
        !recentAdded
      ) {

        const recentTitle =
          document.createElement("div");

        recentTitle.className =
          "suggestion-section-title";

        recentTitle.textContent =
          "🕘 Recent Services";

        fragment.appendChild(recentTitle);

        recentAdded = true;

      }


      // ===== DEFAULT HEADER =====

      if (
        item.type === "default" &&
        !defaultAdded
      ) {

        const defaultTitle =
          document.createElement("div");

        defaultTitle.className =
          "suggestion-section-title";

        defaultTitle.textContent =
          "🔧 Workshop Services";

        fragment.appendChild(defaultTitle);

        defaultAdded = true;

      }


      // ===== SUGGESTION ITEM =====

      const suggestionItem =
        document.createElement("div");

      suggestionItem.className =
        "particular-suggestion-item";


      // Store suggestion safely

      suggestionItem.dataset.suggestion =
        item.text;


      // Display icon and text safely

      suggestionItem.textContent =
        (item.type === "recent" ? "🕘 " : "🔧 ") +
        item.text;


      


      fragment.appendChild(
        suggestionItem
      );

    });


  // Replace existing content safely

  suggestionBox.replaceChildren(fragment);
  
  
  

  // MOVE BOX OUTSIDE TABLE

  if (suggestionBox.parentElement !== document.body) {

    document.body.appendChild(suggestionBox);

  }


  // REMEMBER ACTIVE INPUT

  suggestionBox._activeInput = input;


  

  
  // =================================
  // SMART MOBILE VIEWPORT POSITIONING
  // =================================

  // GET INPUT POSITION

  const rect =
    input.getBoundingClientRect();


  // GET VISIBLE VIEWPORT

  const viewport =
    window.visualViewport;


  const viewportTop =
    viewport ? viewport.offsetTop : 0;


  const viewportBottom =
    viewport
      ? viewport.offsetTop + viewport.height
      : window.innerHeight;


  // SET BOX WIDTH

  suggestionBox.style.width =
    rect.width + "px";


  // SHOW BOX

  suggestionBox.style.display = "block";


  // RESET MAX HEIGHT

  suggestionBox.style.maxHeight = "180px";


  // GET NATURAL BOX HEIGHT

  const boxHeight =
    Math.min(suggestionBox.scrollHeight, 180);


  // AVAILABLE SPACE

  const gap = 3;


  const spaceBelow =
    Math.max(0, viewportBottom - rect.bottom - gap);


  const spaceAbove =
    Math.max(0, rect.top - viewportTop - gap);


  // CHOOSE BEST POSITION

  if (spaceBelow >= boxHeight || spaceBelow >= spaceAbove) {

    // SHOW BELOW INPUT

    suggestionBox.style.top =
      (rect.bottom + gap) + "px";


    suggestionBox.style.maxHeight =
      Math.min(180, spaceBelow) + "px";

  } else {

    // SHOW ABOVE INPUT

    suggestionBox.style.maxHeight =
      Math.min(180, spaceAbove) + "px";


    suggestionBox.style.top =
      (rect.top - Math.min(180, spaceAbove) - gap) + "px";

  }


  // SET HORIZONTAL POSITION

  suggestionBox.style.left =
    rect.left + "px";


}















/* ===============================
   SELECT PARTICULAR SUGGESTION
================================ */

function selectParticularSuggestion(event, element) {

  event.preventDefault();


  const suggestionBox =
      element.closest(
        ".particular-suggestion-box"
      );


  if (!suggestionBox) {
    return;
  }


  // Get the input that opened this box
  const input =
      suggestionBox._activeInput;


  if (!input) {
    return;
  }
  
  


  const td =
      input.closest("td");


  const preview =
      td.querySelector(
        ".particular-preview"
      );


  const display =
      td.querySelector(
        ".particular-display"
      );


  const suggestion =
      element.dataset.suggestion;


  // Fill input
input.value =
    suggestion;

// Trigger input event
input.dispatchEvent(
    new Event("input", {
        bubbles: true
    })
);
      
      // Update Previous Rate Hint
updatePreviousRateHint(input);


  // Update preview
  if (preview) {

    preview.textContent =
        suggestion;

    preview.style.display =
        "none";

  }


  // Update normal display
  if (display) {

    display.textContent =
        suggestion;

    display.style.display =
        "block";

  }


 // =================================
// CLOSE SHARED SUGGESTION BOX
// =================================

input.removeAttribute(
  "data-suggestion-active"
);

// TEMPORARY TEST
setTimeout(function() {

    suggestionBox.style.display = "none";

    suggestionBox._activeInput = null;

}, 150);

// Hide input
input.style.display = "none";

}



function hideParticularSuggestions(input) {

  closeParticularSuggestions();

}



/* ===============================
   SMART WORKSHOP SPELLING SYSTEM
================================ */

const workshopDictionary = {

  // ===== VEHICLE =====
  "vehiical": "Vehicle",
  "vehical": "Vehicle",
  "vehicale": "Vehicle",

  // ===== ENGINE =====
  "engin": "Engine",
  "engien": "Engine",

  // ===== BATTERY =====
  "battary": "Battery",
  "battry": "Battery",

  // ===== BRAKE =====
  "break": "Brake",
  "brakee": "Brake",

  // ===== TYRE =====
  "tyer": "Tyre",
  "tire": "Tyre",

  // ===== SERVICE =====
  "servise": "Service",
  "sevice": "Service",

  // ===== REPAIR =====
  "repaire": "Repair",
  "repir": "Repair",

  // ===== CHANGE =====
  "chenge": "Change",
  "chnage": "Change",

  // ===== OIL =====
  "oill": "Oil",

  // ===== FILTER =====
  "fillter": "Filter",
  "fiter": "Filter",

  // ===== REPLACEMENT =====
  "replcement": "Replacement",
  "replacment": "Replacement"

};




/* ===============================
   AUTOMOTIVE ABBREVIATIONS
================================ */

const abbreviationDictionary = {

  "ac": "AC",
  "abs": "ABS",
  "led": "LED",
  "ecu": "ECU",
  "obd": "OBD",
  "efi": "EFI",
  "ev": "EV",
  "hev": "HEV",
  "hvac": "HVAC",
  "rpm": "RPM",
  "tpms": "TPMS",
  "esp": "ESP"

};


function smartCorrectParticular(input) {

  let text = input.value;

  // Preserve spaces but process words
  const words = text.split(/(\s+)/);

  const correctedWords = words.map(function(word) {

    // Keep spaces unchanged
    if (word.trim() === "") {
      return word;
    }

    // Remove punctuation temporarily
    const match = word.match(/^([^a-zA-Z]*)(.*?)([^a-zA-Z]*)$/);

    if (!match) {
      return word;
    }

    const before = match[1];
    const coreWord = match[2];
    const after = match[3];

    const lowerWord =
      coreWord.toLowerCase();


// Automotive abbreviation correction
if (abbreviationDictionary[lowerWord]) {

  return (
    before +
    abbreviationDictionary[lowerWord] +
    after
  );

}

    // Dictionary correction
    if (workshopDictionary[lowerWord]) {

      return (
        before +
        workshopDictionary[lowerWord] +
        after
      );

    }

    // Unknown word:
    // Capitalize first letter
    if (coreWord.length > 0) {

      return (
        before +
        coreWord.charAt(0).toUpperCase() +
        coreWord.slice(1).toLowerCase() +
        after
      );

    }

    return word;

  });

  input.value =
    correctedWords.join("");

}



function startParticularEdit(input) {

    const td = input.parentElement;

    const preview =
        td.querySelector(".particular-preview");

    const display =
        td.querySelector(".particular-display");

    // Show input
    input.style.display = "block";

    // Hide normal display
    if (display) {
        display.style.display = "none";
    }

    // Show live preview
    if (preview) {
        preview.style.display = "block";
        preview.textContent = input.value;
    }
    
    // Allow suggestions again when editing
input.setAttribute(
    "data-suggestion-active",
    "true"
);
}


function updateParticularPreview(input) {

    const preview =
        input.parentElement.querySelector(".particular-preview");

    if (preview) {
        preview.textContent = input.value;
    }
}


function finishParticular(input) {

  const td =
    input.closest("td");

  const preview =
    td.querySelector(".particular-preview");

  const display =
    td.querySelector(".particular-display");

  // Smart spelling correction
  smartCorrectParticular(input);

  const value =
    input.value.trim();

  // Empty නම් input එකම පෙන්වන්න
  if (value === "") {

    input.style.display = "block";

    if (preview) {
      preview.style.display = "none";
    }

    if (display) {
      display.textContent = "";
      display.style.display = "none";
    }
    
    updatePreviousRateHint(input);

    return;
  }

  // Normal display update
  if (display) {

    display.textContent = value;

    display.style.display = "block";

  }

  // Preview hide
  if (preview) {

    preview.style.display = "none";

  }

  // Input hide
  input.style.display = "none";
  
   // Update Previous Rate Hint
updatePreviousRateHint(input);

}







function editParticular(display) {

  const td = display.parentElement;

  const input =
    td.querySelector(".particular-input");

  if (!input) {
    console.warn("Particular input not found!");
    return;
  }

  display.style.display = "none";
  input.style.display = "block";

  startParticularEdit(input);

  input.focus();

}




function createParticularCell(value = "") {

  const td = document.createElement("td");

  td.style.position = "relative";


  // Particular Input
  const input =
    document.createElement("input");

  input.type = "text";
  input.className = "particular-input";
  input.value = value;
  input.spellcheck = true;
  input.autocomplete = "off";


  input.addEventListener(
    "focus",
    function() {
      startParticularEdit(this);
    }
  );

  
input.addEventListener(
  "input",
  function() {

    updateParticularPreview(this);

    showParticularSuggestions(this);

    

  }
);


  input.addEventListener(
  "blur",
  function() {
    closeParticularSuggestions();
    finishParticular(this);
  }
);

// ENTER KEY - FINISH PARTICULAR
input.addEventListener(
  "keydown",
  function(event) {

    if (event.key === "Enter") {

      event.preventDefault();

      // Trigger existing blur logic
      this.blur();

    }

  }
);




  // Preview
  const preview =
    document.createElement("div");

  preview.className =
    "particular-preview";


  // Suggestion Box
  const suggestionBox =
    document.createElement("div");

  suggestionBox.className =
    "particular-suggestion-box";






  
  
// Display
const display =
  document.createElement("div");

display.className =
  "particular-display";


// =================================
// INITIAL DISPLAY MODE
// =================================

const initialValue =
  String(value ?? "").trim();

if (initialValue !== "") {

  // Show saved Particulars
  display.textContent = initialValue;
  display.style.display = "block";

  // Hide Input
  input.style.display = "none";

} else {

  // Empty row: keep Input visible
  input.style.display = "block";

  // Hide Display
  display.style.display = "none";

}

// Preview hidden initially
preview.style.display = "none";


  display.addEventListener(
    "click",
    function() {
      editParticular(this);
    }
  );


  td.appendChild(input);
td.appendChild(preview);
td.appendChild(suggestionBox);
td.appendChild(display);



return td;
}







/* =================================
   EDITABLE NUMBER CELL
================================= */


function createEditableNumberCell(
  value = 0,
  min = "0",
  step = "0.01",
  enablePreviousRates = false
) {

  const td =
    document.createElement("td");


  // Number Input
  const input =
    document.createElement("input");

  input.type = "number";
  input.min = min;
  input.step = step;


  // Set Initial Value Safely
  const initialValue =
    value === "" ||
    value === null ||
    value === undefined ||
    !Number.isFinite(Number(value))
      ? (min === "1" ? "1" : "0")
      : String(value);

  input.value = initialValue;


  // Display Element
const display =
  document.createElement("div");

display.className =
  "editable-number-display";

display.textContent =
  initialValue;

display.style.cursor = "pointer";


// ===== PREVIOUS RATE HINT =====

if (enablePreviousRates) {

  const row =
    td.closest("tr");

  const particularInput =
    row?.querySelector(".particular-input");

  const particulars =
    particularInput?.value.trim() || "";

  const previousRates =
    getPreviousRates(particulars);

  if (previousRates.length > 0) {

    display.textContent =
      Number(previousRates[0]).toLocaleString(
        "en-LK",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      );

    display.style.color = "#999";

  }

}


  // Previous Rates Dropdown
  const previousRateSelect =
    document.createElement("select");

  previousRateSelect.className =
    "previous-rate-select";

  previousRateSelect.style.display =
    "none";


  // Initial Display Mode
  input.style.display = "none";
  display.style.display = "block";
  
  
  // Track Previous Rate Dropdown Interaction
let isSelectingPreviousRate = false;


// Detect Previous Rate Dropdown Touch
previousRateSelect.addEventListener(
  "pointerdown",
  function() {
    isSelectingPreviousRate = true;
  }
);
  
  
  
  


  // Enter Edit Mode
  display.addEventListener(
    "click",
    function() {

      display.style.display = "none";
      input.style.display = "block";
      
      // Use Previous Rate Hint
if (enablePreviousRates) {

  const hintValue =
    display.textContent.replace(/,/g, "").trim();

  const numericHint =
    Number(hintValue);

  if (
    hintValue !== "" &&
    Number.isFinite(numericHint) &&
    numericHint > 0
  ) {

    input.value =
      String(numericHint);

  }

}
      
      

      // Previous Rates - Rate Cell Only
      if (enablePreviousRates) {

        const row =
          td.closest("tr");

        const particularInput =
          row?.querySelector(".particular-input");

        const particulars =
          particularInput?.value.trim() || "";

        const rates =
          getPreviousRates(particulars);

        previousRateSelect.innerHTML = "";

        
if (rates.length > 0) {

  previousRateSelect.disabled = false;

  const firstOption =
    document.createElement("option");

  firstOption.value = "";
  firstOption.textContent =
    "Previous Rates - Select";

  previousRateSelect.appendChild(
    firstOption
  );

  rates.forEach(function(rate, index) {

    const option =
      document.createElement("option");

    option.value = rate;

    const formattedRate =
      Number(rate).toLocaleString(
        "en-LK",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      );

    option.textContent =
      "Rs. " + formattedRate +
      (index === 0 ? " - Last Used" : "");

    previousRateSelect.appendChild(
      option
    );

  });

} else {

  const noHistoryOption =
    document.createElement("option");

  noHistoryOption.value = "";
  noHistoryOption.textContent =
    "No Previous Rates";

  noHistoryOption.disabled = true;
  noHistoryOption.selected = true;

  previousRateSelect.appendChild(
    noHistoryOption
  );

  previousRateSelect.disabled = true;

}

previousRateSelect.style.display =
  "block";


      }

      input.focus();
      input.select();

    }
  );


  // Calculate While Editing
  input.addEventListener(
    "input",
    calculateTotal
  );
  
 // ENTER KEY - FINISH RATE EDIT
input.addEventListener(
  "keydown",
  function(event) {

    if (event.key === "Enter") {

      event.preventDefault();
      event.stopPropagation();

      console.log("RATE ENTER DETECTED");

      console.log(
        "Current Rate:",
        input.value
      );

      finishNumberEdit();

    }

  }
);


 
// Return To Display Mode
input.addEventListener(
  "blur",
  function() {

    // Allow Previous Rate Selection
    if (isSelectingPreviousRate) {
      return;
    }

    // Finish Editing
    finishNumberEdit();

  }
);


  // Select Previous Rate
previousRateSelect.addEventListener(
  "change",
  function() {

    if (this.value === "") return;

    isSelectingPreviousRate = false;

    input.value = this.value;

    finishNumberEdit();

  }
);


  // Close Editor When Dropdown Loses Focus
previousRateSelect.addEventListener(
  "blur",
  function() {

    isSelectingPreviousRate = false;

    if (input.style.display !== "none") {
      finishNumberEdit();
    }

  }
);


  // Finish Editing
  function finishNumberEdit() {

    if (input.value === "") {

      input.value =
        min === "1" ? "1" : "0";

    }

    display.textContent =
      input.value;

    input.style.display = "none";

    previousRateSelect.style.display =
      "none";

    display.style.display = "block";

    calculateTotal();

  }


  td.appendChild(input);
  td.appendChild(display);
  td.appendChild(previousRateSelect);

  return td;

}



/* =================================
   INITIALIZE NEW BILL TABLE
================================= */

function initializeInitialItemRows() {

  const table =
    document.getElementById("items");

  if (!table) return;


  const rows =
    Array.from(table.querySelectorAll("tr"));


  rows.forEach(function(row) {

    // Skip Header and Add Row
 if (
  row.querySelector("th") ||
  row.classList.contains("add-row-table") ||
  row.cells.length < 5
) {
  return;
}

    // Get Existing Values
    const particulars =
      row.cells[1].querySelector("input")
        ?.value || "";

    const qty =
      row.cells[2].querySelector("input")
        ?.value || 1;

    const rate =
      row.cells[3].querySelector("input")
        ?.value ?? 0;


    // Replace Particulars
    row.replaceChild(
      createParticularCell(particulars),
      row.cells[1]
    );


    // Replace Qty
    row.replaceChild(
      createEditableNumberCell(
        qty,
        "1",
        "1"
      ),
      row.cells[2]
    );


   // Replace Rate
row.replaceChild(
  createEditableNumberCell(
    rate,
    "0",
    "0.01",
    true
  ),
  row.cells[3]
);
  });


  calculateTotal();

}





/* =================================
   GET PREVIOUS SERVICE RATES
================================= */

function getPreviousRates(particulars) {

  // GET EXISTING BILLS
  let bills = [];

  try {

    bills =
      JSON.parse(
        localStorage.getItem("hrmBills")
      ) || [];

  } catch (error) {

    console.error(
      "Unable to read Bill History:",
      error
    );

    return [];
  }


  // VALIDATE BILL DATA
  if (!Array.isArray(bills)) {
    return [];
  }


  // NORMALIZE PARTICULARS NAME
  const searchName =
    String(particulars || "")
      .trim()
      .toLowerCase();


  if (searchName === "") {
    return [];
  }


  // SORT BILLS BY LATEST SAVED DATE
  const sortedBills =
  bills
    .filter(function(bill) {

      return (
        bill &&
        typeof bill === "object" &&
        !Array.isArray(bill)
      );

    })
    .sort(function(a, b) {

      const dateA =
        new Date(a.savedAt || 0).getTime() || 0;

      const dateB =
        new Date(b.savedAt || 0).getTime() || 0;

      return dateB - dateA;

    });


  // COLLECT UNIQUE RATES
  const previousRates = [];


  for (const bill of sortedBills) {

    if (!Array.isArray(bill.items)) {
      continue;
    }


    for (const item of bill.items) {

  // Validate Item Object
  if (
    !item ||
    typeof item !== "object" ||
    Array.isArray(item)
  ) {
    continue;
  }

  const itemName =
    String(item.particulars || "")
      .trim()
      .toLowerCase();


      // MATCH PARTICULARS
      if (itemName !== searchName) {
        continue;
      }


      const rate =
        Number(item.rate);


      // VALIDATE RATE
      if (
        !Number.isFinite(rate) ||
        rate <= 0
      ) {
        continue;
      }


      // SKIP DUPLICATE RATES
      if (previousRates.includes(rate)) {
        continue;
      }


      previousRates.push(rate);


      // GET ONLY 3 UNIQUE RATES
      if (previousRates.length === 3) {
        return previousRates;
      }

    }

  }


  return previousRates;

}






/* ===============================
   UPDATE PREVIOUS RATE HINT
================================ */

function updatePreviousRateHint(input) {

  const row =
    input.closest("tr");

  if (!row) return;

  const rateCell =
    row.cells[3];

  if (!rateCell) return;

  const rateDisplay =
    rateCell.querySelector(
      ".editable-number-display"
    );

  if (!rateDisplay) return;

  const particulars =
    input.value.trim();

  const previousRates =
    getPreviousRates(particulars);

  if (previousRates.length > 0) {

    rateDisplay.textContent =
      Number(previousRates[0]).toLocaleString(
        "en-LK",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      );

    rateDisplay.style.color = "#999";

  } else {

    rateDisplay.textContent = "";

  }

}







/* =================================
   SHOW PREVIOUS RATE SUGGESTIONS
================================= */

function showPreviousRateSuggestions(
  particularInput,
  previousRateBox
) {
    
    console.log("INPUT DISPLAY:",
    getComputedStyle(particularInput).display
  );

  console.log("INPUT RECT:",
    particularInput.getBoundingClientRect()
  );

  console.log("TD RECT:",
    particularInput.closest("td").getBoundingClientRect()
    );

  // GET PARTICULARS NAME
  const particulars =
    particularInput.value.trim();


  // CLEAR OLD SUGGESTIONS
  previousRateBox.innerHTML = "";

  


  // CHECK PARTICULARS
  if (particulars === "") {
    return;
  }


  // GET PREVIOUS RATES
  const rates =
    getPreviousRates(particulars);
    
    
    console.log(
  "Search Name:",
  particulars
);

console.log(
  "Found Rates:",
  rates
);


  // CHECK AVAILABLE RATES
  if (rates.length === 0) {
    return;
  }


  // CREATE TITLE
  const title =
    document.createElement("div");

  title.textContent =
    "Previous Rates";

  title.className =
    "previous-rate-title";

  previousRateBox.appendChild(title);


  // CREATE RATE OPTIONS
  rates.forEach(function(rate) {

    const option =
      document.createElement("div");

    option.className =
      "previous-rate-option";


    const rateText =
      document.createElement("span");

    rateText.textContent =
      "Rs. " +
      rate.toLocaleString(
        "en-LK",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      );


    const useText =
      document.createElement("span");

    useText.textContent =
      "Use this rate";


    option.appendChild(rateText);
    option.appendChild(useText);


    // APPLY RATE ON CLICK
    option.addEventListener(
      "pointerdown",
      function(event) {

        event.preventDefault();

        const row =
          particularInput.closest("tr");

        if (!row) return;


        const inputs =
          row.querySelectorAll("input");

        if (inputs.length < 3) return;


        const rateInput =
          inputs[2];

        const rateCell =
          rateInput.parentElement;

        const rateDisplay =
          rateCell.querySelector(
            ".editable-number-display"
          );


        // SET RATE
        rateInput.value = rate;


        // UPDATE DISPLAY
        if (rateDisplay) {

          rateDisplay.textContent =
            rate;

        }


        // KEEP DISPLAY MODE
        rateInput.style.display =
          "none";

        if (rateDisplay) {

          rateDisplay.style.display =
            "block";

        }


        // RECALCULATE TOTAL
        calculateTotal();


        // CLOSE PREVIOUS RATE BOX
        previousRateBox.innerHTML = "";

        previousRateBox.style.display =
          "none";

      }
    );


    previousRateBox.appendChild(option);

  });


 // =================================
// POSITION PREVIOUS RATE BOX
// =================================

const inputRect =
  particularInput.getBoundingClientRect();

previousRateBox.style.left =
  inputRect.left + "px";

previousRateBox.style.top =
  inputRect.bottom + "px";

previousRateBox.style.width =
  inputRect.width + "px";


// SHOW BOX
previousRateBox.style.display =
  "block";

}




// Initialize New Bill Table

if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    initializeInitialItemRows
  );

} else {

  initializeInitialItemRows();

}







/* ===== ADD ROW BUTTON FUNCTION ===== */


function addRow() {

  const table =
    document.getElementById("items");


  // Safety Check
  if (!table) {
    console.warn("Items table not found!");
    return;
  }


  // Find Add Row button row
  const addRowButton =
    table.querySelector(".add-row-table");


  // Count Actual Item Rows Only
  const itemRows =
    Array.from(
      table.querySelectorAll("tr")
    ).filter(function(itemRow) {

      return (
        !itemRow.classList.contains("add-row-table") &&
        !itemRow.querySelector("th")
      );

    });

  const rowCount =
    itemRows.length;


  // Create New Row
  const row =
    table.insertRow(
      addRowButton
        ? addRowButton.rowIndex
        : table.rows.length
    );


  // S.No
  const numberCell =
    document.createElement("td");

  numberCell.textContent =
    rowCount + 1;

  row.appendChild(numberCell);


  // Particulars
  row.appendChild(
    createParticularCell()
  );


  // Qty
  row.appendChild(
    createEditableNumberCell(1, "1", "1")
  );


  // Rate
row.appendChild(
  createEditableNumberCell(
    0,
    "0",
    "0.01",
    true
  )
);


  // Amount
  const amountCell =
    document.createElement("td");

  const amountInput =
    document.createElement("input");

  amountInput.type = "number";
  amountInput.readOnly = true;

  amountCell.appendChild(amountInput);
  row.appendChild(amountCell);


  // Auto Focus Particulars
  const input =
    row.querySelector(".particular-input");

  if (input) {
    input.focus();
  }

}











