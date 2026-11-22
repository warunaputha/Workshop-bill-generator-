
/* ===== draft.js ===== */



/* ===== GET DRAFT ITEMS ===== */

function getDraftItems() {

  const table =
    document.getElementById("items");

  if (!table) {
    return [];
  }

  const rows =
    table.querySelectorAll(
      "tr:not(.add-row-table)"
    );

  const items = [];

  rows.forEach(row => {

    const particulars =
      row.querySelector(".particular-input");

    const cells =
      row.querySelectorAll("td");

    if (!particulars || cells.length < 5) {
      return;
    }

    const qtyInput =
      cells[2].querySelector("input");

    const rateInput =
      cells[3].querySelector("input");

    const amountInput =
      cells[4].querySelector("input");

    if (!qtyInput || !rateInput || !amountInput) {
      return;
    }

    const item = {

      particulars:
        particulars.value.trim(),

      qty:
        Number(qtyInput.value) || 0,

      rate:
        Number(rateInput.value) || 0,

      amount:
        Number(amountInput.value) || 0

    };

    if (
      item.particulars !== "" ||
      item.rate > 0
    ) {

      items.push(item);

    }

  });

  return items;

}




/* =================================
   SAVE BILL DRAFT
================================= */

function saveDraft(event) {

  // PREVENT OVERWRITING DECLINED DRAFT
  if (window.draftRestoreDeclined) {

    // Ignore automatic exit save
    if (!event) {
      return;
    }

    // User changed something
    window.draftRestoreDeclined = false;

  }

  try {

    const draft = {

      version: "1.0",

      savedAt: new Date().toISOString(),

      mode:
        (typeof editingBillIndex !== "undefined" &&
         editingBillIndex >= 0)
          ? "EDIT"
          : "NEW",

      editingBillIndex:
        typeof editingBillIndex !== "undefined"
          ? editingBillIndex
          : -1,

      bill: {

        billNo:
          document.getElementById("billNo")?.value || "",

        billDate:
          document.getElementById("billDate")?.value || "",

        customer:
          document.getElementById("customer")?.value || "",

        customerContact:
          document.getElementById("customerContact")?.value || "",

        vehicle:
          document.getElementById("vehicle")?.value || "",

        jobType:
          document.getElementById("type")?.value || "",

        meter:
          document.getElementById("meter")?.value || "",

        note:
          document.getElementById("note")?.value || "",

        paymentMethod:
          document.querySelector(
            'input[name="paymentMethod"]:checked'
          )?.value || "CASH",

        paymentStatus:
          document.querySelector(
            'input[name="paymentStatus"]:checked'
          )?.value || "FULL",

        paidAmount:
          Number(
            document.getElementById("paidAmount")?.value
          ) || 0,

        items:
          getDraftItems()

      }

    };

    localStorage.setItem(
      "hrmBillDraft",
      JSON.stringify(draft)
    );

    console.log("Draft saved successfully.");

  } catch (error) {

    console.error(
      "Draft Save Error:",
      error
    );

  }

}





/* ===============================
   GET SAVED DRAFT
================================ */

function getSavedDraft() {

  try {

    const savedData =
      localStorage.getItem("hrmBillDraft");

    if (!savedData) {
      return null;
    }

    const draft =
      JSON.parse(savedData);

    if (
      !draft ||
      !draft.bill ||
      !Array.isArray(draft.bill.items)
    ) {
      return null;
    }

    return draft;

  }

  catch (error) {

    console.error(
      "Draft Read Error:",
      error
    );

    return null;

  }

}






/* ===============================
   RESTORE BILL DRAFT
================================ */

function restoreDraft(draft) {

  if (!draft || !draft.bill) {
    return false;
  }

  const bill = draft.bill;


  // ===== RESTORE BILL DETAILS =====

  document.getElementById("billNo").value =
    bill.billNo || "";

  document.getElementById("billDate").value =
    bill.billDate || "";

  document.getElementById("customer").value =
    bill.customer || "";

  document.getElementById("customerContact").value =
    bill.customerContact || "";

  document.getElementById("vehicle").value =
    bill.vehicle || "";

  document.getElementById("type").value =
    bill.jobType || "";

  document.getElementById("meter").value =
    bill.meter || "";

  document.getElementById("note").value =
    bill.note || "";


  // ===== RESTORE PAYMENT METHOD =====

  const paymentMethodRadio =
    document.querySelector(
      'input[name="paymentMethod"][value="' +
      (bill.paymentMethod || "CASH") +
      '"]'
    );

  if (paymentMethodRadio) {
    paymentMethodRadio.checked = true;
  }


  // ===== RESTORE PAYMENT STATUS =====

  const paymentStatusRadio =
    document.querySelector(
      'input[name="paymentStatus"][value="' +
      (bill.paymentStatus || "FULL") +
      '"]'
    );

  if (paymentStatusRadio) {
    paymentStatusRadio.checked = true;
  }


  // ===== RESTORE PAID AMOUNT =====

  document.getElementById("paidAmount").value =
    Number(bill.paidAmount || 0).toFixed(2);


  // ===== RESET ITEM TABLE =====

  const table =
    document.getElementById("items");

  if (!table) {
    return false;
  }

  const addRow =
    table.querySelector("tr.add-row-table");

  Array.from(table.querySelectorAll("tr"))
    .forEach(function(row) {

      if (
        row !== addRow &&
        row.querySelectorAll("input").length > 0
      ) {
        row.remove();
      }

    });


  // ===== RESTORE ITEM ROWS =====

  bill.items.forEach(function(item, index) {

    const row =
      table.insertRow(
        addRow
          ? addRow.rowIndex
          : table.rows.length
      );


    // S.NO
    const numberCell =
      document.createElement("td");

    numberCell.textContent =
      index + 1;

    row.appendChild(numberCell);


    // PARTICULARS
    row.appendChild(
      createParticularCell(
        item.particulars || ""
      )
    );


    // QTY
    row.appendChild(
      createEditableNumberCell(
        item.qty ?? 1,
        "1",
        "1"
      )
    );


    // RATE
    row.appendChild(
      createEditableNumberCell(
        item.rate ?? 0,
        "0",
        "0.01"
      )
    );


    // AMOUNT
    const amountCell =
      document.createElement("td");

    const amountInput =
      document.createElement("input");

    amountInput.type = "number";
    amountInput.value = item.amount || 0;
    amountInput.readOnly = true;

    amountCell.appendChild(amountInput);
    row.appendChild(amountCell);

  });


  // ===== RESTORE NEW / EDIT MODE =====

  if (draft.mode === "EDIT") {

    const bills =
      JSON.parse(
        localStorage.getItem("hrmBills")
      ) || [];

    const index =
      Number(draft.editingBillIndex);

    if (
      Number.isInteger(index) &&
      index >= 0 &&
      bills[index]
    ) {

      editingBillIndex = index;

      document.getElementById("saveBillBtn")
        .textContent = "🔄 Update Bill";

    } else {

      editingBillIndex = -1;

      document.getElementById("saveBillBtn")
        .textContent = "💾 Save Bill";

    }

  } else {

    editingBillIndex = -1;

    document.getElementById("saveBillBtn")
      .textContent = "💾 Save Bill";

  }


  // ===== RECALCULATE TOTAL =====

  calculateTotal();


  console.log("Draft restored successfully.");

  return true;

}





/* ===============================
   CHECK PREVIOUS DRAFT
================================ */


function checkPreviousDraft() {

  const draft =
    getSavedDraft();

  if (!draft) {
    return;
  }


  // GET POPUP
  const popup =
    document.getElementById(
      "draftRestorePopup"
    );

  const restoreBtn =
    document.getElementById(
      "restoreDraftBtn"
    );

  const skipBtn =
    document.getElementById(
      "skipDraftBtn"
    );


  if (!popup || !restoreBtn || !skipBtn) {
    return;
  }


  // SHOW POPUP
  popup.style.display = "flex";


  // RESTORE BUTTON
  restoreBtn.onclick = function() {

    restoreDraft(draft);

    window.draftRestoreDeclined = false;

    popup.style.display = "none";

  };


  // NOT NOW BUTTON
  skipBtn.onclick = function() {

    window.draftRestoreDeclined = true;

    popup.style.display = "none";

  };

}



/* =================================
   INITIALIZE DRAFT AUTO SAVE
================================= */

function initializeDraftAutoSave() {

  const fieldIDs = [

    "billDate",
    "customer",
    "customerContact",
    "vehicle",
    "type",
    "meter",
    "note"

  ];

  fieldIDs.forEach(function(id) {

    const field =
      document.getElementById(id);

    if (!field) return;

    // Prevent duplicate listeners
    if (field.dataset.draftListener === "true") {
      return;
    }

    field.dataset.draftListener = "true";

    // Save while typing
    if (field.type === "date") {

      field.addEventListener(
        "change",
        saveDraft
      );

    } else {

      field.addEventListener(
        "input",
        saveDraft
      );

    }

  });
  
  
  
  // PAYMENT METHOD AUTO SAVE

  document
    .querySelectorAll(
      'input[name="paymentMethod"]'
    )
    .forEach(function(input) {

      if (input.dataset.draftListener === "true") {
        return;
      }

      input.dataset.draftListener = "true";

      input.addEventListener(
        "change",
        saveDraft
      );

    });


  // PAYMENT STATUS AUTO SAVE

  document
    .querySelectorAll(
      'input[name="paymentStatus"]'
    )
    .forEach(function(input) {

      if (input.dataset.draftListener === "true") {
        return;
      }

      input.dataset.draftListener = "true";

      input.addEventListener(
        "change",
        saveDraft
      );

    });


  // PAID AMOUNT AUTO SAVE

  const paidAmount =
    document.getElementById("paidAmount");

  if (
    paidAmount &&
    paidAmount.dataset.draftListener !== "true"
  ) {

    paidAmount.dataset.draftListener = "true";

    paidAmount.addEventListener(
      "input",
      saveDraft
    );

  }



    
    // ===== PARTICULARS AUTO SAVE =====

const itemsTable =
  document.getElementById("items");

if (
  itemsTable &&
  itemsTable.dataset.draftListener !== "true"
) {

  itemsTable.dataset.draftListener = "true";

  
itemsTable.addEventListener(
  "input",
  function(event) {

    const target =
      event.target;

    // PARTICULARS
    if (
      target.classList.contains(
        "particular-input"
      )
    ) {

      saveDraft();

      return;
    }


    // QTY & RATE
    if (
      target.type === "number" &&
      target.closest("td") &&
      (
        target.closest("td").cellIndex === 2 ||
        target.closest("td").cellIndex === 3
      )
    ) {

      saveDraft();

    }

  }
);


}

    
      // ===== APP EXIT SAFETY AUTO SAVE =====

  const root =
    document.documentElement;

  if (
    root.dataset.draftExitListener !== "true"
  ) {

    root.dataset.draftExitListener = "true";


    // APP GOES TO BACKGROUND

    document.addEventListener(
      "visibilitychange",
      function() {

        if (
          document.visibilityState === "hidden"
        ) {

          saveDraft();

        }

      }
    );


    // PAGE HIDE / NAVIGATION

    window.addEventListener(
      "pagehide",
      function() {

        saveDraft();

      }
    );

  }

    
    

    
      // ===== STARTUP DRAFT RESTORE =====

  checkPreviousDraft();
}





/* ===== START DRAFT AUTO SAVE ===== */

if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    initializeDraftAutoSave
  );

} else {

  initializeDraftAutoSave();

}


