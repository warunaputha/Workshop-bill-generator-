



/* ===== CALCULATIONS.JS ===== */

/* ===== AUTO TOTAL ===== */

function calculateTotal() {

  let total = 0;

  const rows =
    document.querySelectorAll("#items tr");

  for (let i = 1; i < rows.length; i++) {

    // Skip Add Row button row
    if (
      rows[i].classList.contains("add-row-table")
    ) {
      continue;
    }

    const inputs =
      rows[i].querySelectorAll("input");

    // Safety check
    if (inputs.length < 4) {
      continue;
    }

    const qty =
      Number(inputs[1].value) || 0;

    const rate =
      Number(inputs[2].value) || 0;

    const amount =
      qty * rate;

    // Amount column
    inputs[3].value =
      amount.toFixed(2);

    total += amount;
  }
  
  
  document.getElementById("grandTotal").innerText =
    total.toLocaleString("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });


  // ===== PAYMENT TOTAL =====

  document.getElementById("paymentTotal")
    .textContent =
      total.toLocaleString("en-LK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });


  // ===== UPDATE PAYMENT =====

  updatePaymentUI(total);
}


function updatePaymentUI(currentTotal) {

  // If total was not passed,
  // calculate it from the table
  if (typeof currentTotal !== "number") {

    currentTotal = 0;

    const rows =
      document.querySelectorAll("#items tr");

    for (let i = 1; i < rows.length; i++) {

      if (
        rows[i].classList.contains("add-row-table")
      ) {
        continue;
      }

      const inputs =
        rows[i].querySelectorAll("input");

      if (inputs.length < 4) {
        continue;
      }

      const qty =
        Number(inputs[1].value) || 0;

      const rate =
        Number(inputs[2].value) || 0;

      currentTotal += qty * rate;
    }
  }


  const status =
    document.querySelector(
      'input[name="paymentStatus"]:checked'
    )?.value || "FULL";


  const paidInput =
    document.getElementById("paidAmount");


  let paid = 0;


  // ===== FULL PAYMENT =====

if (status === "FULL") {

  paid = currentTotal;

  paidInput.value =
    currentTotal.toFixed(2);

  paidInput.disabled = false;
  paidInput.readOnly = true;
}


 // ===== HALF PAYMENT =====

else if (status === "HALF") {

  paidInput.disabled = false;
  paidInput.readOnly = false;

  paidInput.placeholder = "0.00";

  paid =
    Number(paidInput.value) || 0;
}


  // ===== NOT PAID =====

else if (status === "NOT PAID") {

  paid = 0;

  paidInput.value = "0.00";

  paidInput.disabled = false;
  paidInput.readOnly = true;
}


  // ===== BALANCE =====

  let balance =
    currentTotal - paid;

  if (balance < 0) {
    balance = 0;
  }


  // ===== DISPLAY TOTAL =====

  document.getElementById("paymentTotal")
    .textContent =
      currentTotal.toLocaleString("en-LK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });


  // ===== DISPLAY BALANCE =====

  document.getElementById("balanceAmount")
    .textContent =
      balance.toLocaleString("en-LK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
}


function handlePaymentStatusChange() {

  const status =
    document.querySelector(
      'input[name="paymentStatus"]:checked'
    )?.value;

  const paidInput =
    document.getElementById("paidAmount");

  if (status === "HALF") {

    paidInput.value = "";
    paidInput.placeholder = "0.00";
  }

  updatePaymentUI();
}

