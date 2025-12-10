// =============================
// CONSTANTS & STATE
// =============================

const STORAGE_KEY = "budgetBusterTransactions";

let transactions = [];
let filteredTransactions = [];
let editingId = null;

// Random quotes for "finance pain"
const quotes = [
  "“Salary aati hai, ghuma ke chali jaati hai.”",
  "“I’m not poor, I’m just pre-rich.”",
  "“Budget banaya tha, usne bhi mujhe block kar diya.”",
  "“Zindagi me do hi issues: time kam hai, paise usse bhi kam.”",
  "“EMI wale insaan ko real patience samajh aata hai.”"
];

// =============================
// DOM ELEMENTS
// =============================

// Summary
const totalBalanceEl = document.getElementById("total-balance");
const totalIncomeEl = document.getElementById("total-income");
const totalExpenseEl = document.getElementById("total-expense");
const balanceTagEl = document.getElementById("balance-tag");

// Form fields
const transactionForm = document.getElementById("transaction-form");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const descriptionInput = document.getElementById("description");
const formTitleEl = document.getElementById("form-title");
const submitBtn = document.getElementById("submit-btn");
const cancelEditBtn = document.getElementById("cancel-edit-btn");
const editIndicator = document.getElementById("edit-indicator");

// Filters
const filterTypeSelect = document.getElementById("filter-type");
const filterSearchInput = document.getElementById("filter-search");
const filterFromInput = document.getElementById("filter-from");
const filterToInput = document.getElementById("filter-to");
const resetFiltersBtn = document.getElementById("reset-filters-btn");

// Actions
const exportBtn = document.getElementById("export-btn");
const importFileInput = document.getElementById("import-file");
const clearAllBtn = document.getElementById("clear-all-btn");

// Stats
const statTotalEl = document.getElementById("stat-total");
const statBiggestExpenseEl = document.getElementById("stat-biggest-expense");
const statBiggestExpenseCatEl = document.getElementById("stat-biggest-expense-cat");
const statTopCategoryEl = document.getElementById("stat-top-category");

// Transactions table
const transactionsBody = document.getElementById("transactions-body");
const listCountEl = document.getElementById("list-count");

// Quote box
const randomQuoteEl = document.getElementById("random-quote");
const newQuoteBtn = document.getElementById("new-quote-btn");

// =============================
// LOCAL STORAGE HELPERS
// =============================

function loadTransactions() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      transactions = JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse transactions from localStorage:", e);
      transactions = [];
    }
  } else {
    transactions = [];
  }
}

function saveTransactions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

// =============================
// UTILITY FUNCTIONS
// =============================

function formatCurrency(value) {
  return "₹" + value.toFixed(2);
}

function isValidDateString(value) {
  if (!value) return false;
  const d = new Date(value);
  return !isNaN(d.getTime());
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// =============================
// QUOTE FEATURE
// =============================

function showRandomQuote() {
  randomQuoteEl.textContent = randomItem(quotes);
}

// =============================
// SUMMARY & STATS
// =============================

function renderSummary() {
  let income = 0;
  let expense = 0;

  transactions.forEach(tx => {
    if (tx.type === "income") {
      income += tx.amount;
    } else if (tx.type === "expense") {
      expense += tx.amount;
    }
  });

  const balance = income - expense;

  totalIncomeEl.textContent = formatCurrency(income);
  totalExpenseEl.textContent = formatCurrency(expense);
  totalBalanceEl.textContent = formatCurrency(balance);

  balanceTagEl.classList.remove("tag-positive", "tag-negative", "tag-neutral");
  if (balance > 0) {
    balanceTagEl.textContent = "Nice, positive!";
    balanceTagEl.classList.add("tag-positive");
  } else if (balance < 0) {
    balanceTagEl.textContent = "Broke mode on";
    balanceTagEl.classList.add("tag-negative");
  } else {
    balanceTagEl.textContent = "Neutral";
    balanceTagEl.classList.add("tag-neutral");
  }
}

function renderStats() {
  const total = transactions.length;
  statTotalEl.textContent = total;

  let biggest = 0;
  let biggestCat = "";

  const categoryCount = {};

  transactions.forEach(tx => {
    if (tx.type === "expense" && tx.amount > biggest) {
      biggest = tx.amount;
      biggestCat = tx.category;
    }

    const key = tx.category.toLowerCase();
    if (!categoryCount[key]) {
      categoryCount[key] = 0;
    }
    categoryCount[key]++;
  });

  statBiggestExpenseEl.textContent = formatCurrency(biggest || 0);
  statBiggestExpenseCatEl.textContent = biggest ? `Category: ${biggestCat}` : "";

  let topCategory = "";
  let topCount = 0;

  Object.entries(categoryCount).forEach(([cat, count]) => {
    if (count > topCount) {
      topCount = count;
      topCategory = cat;
    }
  });

  statTopCategoryEl.textContent = topCategory || "–";
}

// =============================
// FILTER LOGIC
// =============================

function applyFilters() {
  const typeFilter = filterTypeSelect.value;              // "all", "income", "expense"
  const searchQuery = filterSearchInput.value.trim().toLowerCase();
  const fromDate = filterFromInput.value;
  const toDate = filterToInput.value;

  filteredTransactions = transactions.filter(tx => {
    // Type filter
    if (typeFilter !== "all" && tx.type !== typeFilter) {
      return false;
    }

    // Search filter (category + description)
    if (searchQuery) {
      const combined = (tx.category + " " + (tx.description || "")).toLowerCase();
      if (!combined.includes(searchQuery)) {
        return false;
      }
    }

    // Date filter
    if (fromDate && new Date(tx.date) < new Date(fromDate)) {
      return false;
    }

    if (toDate && new Date(tx.date) > new Date(toDate)) {
      return false;
    }

    return true;
  });

  renderTransactionsTable();
}

function resetFilters() {
  filterTypeSelect.value = "all";
  filterSearchInput.value = "";
  filterFromInput.value = "";
  filterToInput.value = "";
  applyFilters();
}

// =============================
// RENDER TABLE
// =============================

function renderTransactionsTable() {
  transactionsBody.innerHTML = "";

  const list = filteredTransactions.length ? filteredTransactions : transactions;

  if (list.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 7;
    cell.textContent = "No transactions found. Gareebi hi life hai currently.";
    cell.style.textAlign = "center";
    cell.style.color = "#6b7280";
    row.appendChild(cell);
    transactionsBody.appendChild(row);
    listCountEl.textContent = "0 items";
    return;
  }

  const sorted = list.slice().sort((a, b) => new Date(b.date) - new Date(a.date));

  sorted.forEach((tx, index) => {
    const row = document.createElement("tr");

    // Index
    const indexCell = document.createElement("td");
    indexCell.textContent = index + 1;
    row.appendChild(indexCell);

    // Type
    const typeCell = document.createElement("td");
    typeCell.textContent = tx.type === "income" ? "Income" : "Expense";
    typeCell.className = tx.type === "income" ? "tag-income" : "tag-expense";
    row.appendChild(typeCell);

    // Category
    const catCell = document.createElement("td");
    catCell.textContent = tx.category;
    row.appendChild(catCell);

    // Amount
    const amtCell = document.createElement("td");
    amtCell.textContent = formatCurrency(tx.amount);
    amtCell.className = "amount";
    row.appendChild(amtCell);

    // Date
    const dateCell = document.createElement("td");
    dateCell.textContent = tx.date;
    row.appendChild(dateCell);

    // Description
    const descCell = document.createElement("td");
    descCell.textContent = tx.description || "-";
    row.appendChild(descCell);

    // Actions
    const actionCell = document.createElement("td");
    const actionsWrapper = document.createElement("div");
    actionsWrapper.className = "action-buttons";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "action-btn edit";
    editBtn.dataset.id = tx.id;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "action-btn delete";
    deleteBtn.dataset.id = tx.id;

    actionsWrapper.appendChild(editBtn);
    actionsWrapper.appendChild(deleteBtn);
    actionCell.appendChild(actionsWrapper);
    row.appendChild(actionCell);

    transactionsBody.appendChild(row);
  });

  listCountEl.textContent = `${list.length} item(s)`;
}

// =============================
// FORM HANDLING (ADD / EDIT)
// =============================

function clearForm() {
  transactionForm.reset();
  typeInput.value = "income";
  const today = new Date().toISOString().slice(0, 10);
  dateInput.value = today;
}

function setEditMode(id) {
  const tx = transactions.find(t => t.id === id);
  if (!tx) return;

  editingId = id;
  formTitleEl.textContent = "Edit Transaction";
  submitBtn.textContent = "Update Transaction";
  cancelEditBtn.classList.remove("hidden");
  editIndicator.classList.remove("hidden");

  typeInput.value = tx.type;
  categoryInput.value = tx.category;
  amountInput.value = tx.amount;
  dateInput.value = tx.date;
  descriptionInput.value = tx.description || "";
}

function exitEditMode() {
  editingId = null;
  formTitleEl.textContent = "Add Transaction";
  submitBtn.textContent = "Add Transaction";
  cancelEditBtn.classList.add("hidden");
  editIndicator.classList.add("hidden");
  clearForm();
}

function handleFormSubmit(event) {
  event.preventDefault();

  const type = typeInput.value;
  const category = categoryInput.value.trim();
  const amountValue = amountInput.value;
  const amount = parseFloat(amountValue);
  const date = dateInput.value;
  const description = descriptionInput.value.trim();

  if (!category || !amountValue || !date) {
    alert("Please fill all required fields.");
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    alert("Amount must be a positive number.");
    return;
  }

  if (!isValidDateString(date)) {
    alert("Please enter a valid date.");
    return;
  }

  if (editingId) {
    // Update existing
    transactions = transactions.map(tx =>
      tx.id === editingId
        ? { ...tx, type, category, amount, date, description }
        : tx
    );
    exitEditMode();
  } else {
    // Add new
    const newTransaction = {
      id: Date.now().toString(),
      type,
      category,
      amount,
      date,
      description
    };
    transactions.push(newTransaction);
  }

  saveTransactions();
  renderSummary();
  renderStats();
  applyFilters();
  clearForm();
}

// =============================
// DELETE & CLEAR
// =============================

function handleTableClick(event) {
  const target = event.target;
  if (target.classList.contains("delete")) {
    const id = target.dataset.id;
    const confirmDelete = confirm("Delete this transaction? Phir wapas nahi aayega.");
    if (!confirmDelete) return;
    transactions = transactions.filter(tx => tx.id !== id);
    saveTransactions();
    renderSummary();
    renderStats();
    applyFilters();
  } else if (target.classList.contains("edit")) {
    const id = target.dataset.id;
    setEditMode(id);
  }
}

function clearAllData() {
  const ok = confirm("Saara data delete ho jayega. Pakka? (JAKE SOCH LE)");
  if (!ok) return;
  transactions = [];
  saveTransactions();
  renderSummary();
  renderStats();
  applyFilters();
  exitEditMode();
  clearForm();
}

// =============================
// EXPORT / IMPORT
// =============================

function exportData() {
  const dataStr = JSON.stringify(transactions, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "budget-buster-data.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!Array.isArray(parsed)) {
        alert("Invalid file format.");
        return;
      }
      transactions = parsed;
      saveTransactions();
      renderSummary();
      renderStats();
      applyFilters();
      exitEditMode();
      clearForm();
      alert("Data imported successfully.");
    } catch (error) {
      console.error("Import error:", error);
      alert("Failed to import file.");
    }
  };
  reader.readAsText(file);
}

// =============================
// INITIALIZATION
// =============================

function init() {
  // default date
  const today = new Date().toISOString().slice(0, 10);
  dateInput.value = today;

  // load + initial render
  loadTransactions();
  renderSummary();
  renderStats();
  applyFilters();
  showRandomQuote();

  // events
  transactionForm.addEventListener("submit", handleFormSubmit);
  cancelEditBtn.addEventListener("click", exitEditMode);
  transactionsBody.addEventListener("click", handleTableClick);
  resetFiltersBtn.addEventListener("click", resetFilters);

  filterTypeSelect.addEventListener("change", applyFilters);
  filterSearchInput.addEventListener("input", applyFilters);
  filterFromInput.addEventListener("change", applyFilters);
  filterToInput.addEventListener("change", applyFilters);

  exportBtn.addEventListener("click", exportData);
  importFileInput.addEventListener("change", importData);
  clearAllBtn.addEventListener("click", clearAllData);

  newQuoteBtn.addEventListener("click", showRandomQuote);
}

document.addEventListener("DOMContentLoaded", init);

