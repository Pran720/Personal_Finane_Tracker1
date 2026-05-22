// ================= DOM ELEMENTS =================

const balance = document.getElementById("balance");

const income = document.getElementById("income");

const expense = document.getElementById("expense");

const title = document.getElementById("title");

const amount = document.getElementById("amount");

const type = document.getElementById("type");

const addBtn = document.getElementById("addBtn");

const clearBtn = document.getElementById("clearBtn");

const themeToggle = document.getElementById("themeToggle");

const transactionList = document.getElementById("transactionList");

const quote = document.getElementById("quote");

// ================= LOCAL STORAGE =================

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

let selectedTheme = localStorage.getItem("theme") || "light";

// ================= INITIAL LOAD =================

applyTheme(selectedTheme);

showTransactions();

getFinanceQuote();

// ================= EVENT LISTENERS =================

addBtn.addEventListener("click", addTransaction);

clearBtn.addEventListener("click", clearTransactions);

themeToggle.addEventListener("click", toggleTheme);

// ================= THEME =================

function applyTheme(theme) {
  document.body.classList.toggle("dark-mode", theme === "dark");

  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
  );
}

function toggleTheme() {
  selectedTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";

  localStorage.setItem("theme", selectedTheme);

  applyTheme(selectedTheme);
}

// ================= ADD TRANSACTION =================

function addTransaction() {
  const titleValue = title.value.trim();

  const amountValue = Number(amount.value);

  const typeValue = type.value;

  // Validation

  if (titleValue === "" || amountValue <= 0) {
    alert("Please enter valid details");

    return;
  }

  // Create Object

  const transaction = {
    id: Date.now(),

    title: titleValue,

    amount: amountValue,

    type: typeValue,
  };

  // Add To Array

  transactions.push(transaction);

  // Save

  updateLocalStorage();

  // Show

  showTransactions();

  // Clear Inputs

  title.value = "";

  amount.value = "";
}

// ================= SHOW TRANSACTIONS =================

function showTransactions() {
  transactionList.innerHTML = "";

  let totalIncome = 0;

  let totalExpense = 0;

  transactions.forEach((transaction) => {
    const li = document.createElement("li");

    li.classList.add(transaction.type);

    li.innerHTML = `
    
      <div>

        <h4>${transaction.title}</h4>

        <p>₹${transaction.amount}</p>

      </div>

      <button
        class="delete-btn"
        onclick="deleteTransaction(${transaction.id}, this)"
      >
        Delete
      </button>
    `;

    transactionList.appendChild(li);

    // Calculate Totals

    if (transaction.type === "income") {
      totalIncome += transaction.amount;
    } else {
      totalExpense += transaction.amount;
    }
  });

  // Total Balance

  const totalBalance = totalIncome - totalExpense;

  // Update UI

  balance.innerText = `₹${totalBalance}`;

  income.innerText = `₹${totalIncome}`;

  expense.innerText = `₹${totalExpense}`;

  animateTotals();
}

// ================= DELETE TRANSACTION =================

function deleteTransaction(id, button) {
  const row = button ? button.closest("li") : null;

  if (row) {
    row.classList.add("removing");

    setTimeout(() => {
      removeTransaction(id);
    }, 240);

    return;
  }

  removeTransaction(id);
}

function removeTransaction(id) {
  transactions = transactions.filter((transaction) => {
    return transaction.id !== id;
  });

  updateLocalStorage();

  showTransactions();
}

function animateTotals() {
  [balance, income, expense].forEach((element) => {
    element.classList.remove("number-bump");

    void element.offsetWidth;

    element.classList.add("number-bump");
  });
}

// ================= CLEAR ALL =================

function clearTransactions() {
  transactions = [];

  updateLocalStorage();

  showTransactions();
}

// ================= SAVE TO LOCAL STORAGE =================

function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// ================= QUOTE API =================

async function getFinanceQuote() {
  try {
    // FREE API

    const response = await fetch("https://dummyjson.com/quotes/random");

    const data = await response.json();

    quote.innerText = data.quote;
  } catch (error) {
    quote.innerText = "Spend less than you earn.";

    console.log(error);
  }
}
