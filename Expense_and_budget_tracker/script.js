let totalBudget = parseFloat(localStorage.getItem('budget')) || 0;
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

const budgetInput = document.getElementById('budget-input');
const setBudgetBtn = document.getElementById('set-budget-btn');
const totalBudgetEl = document.getElementById('total-budget');
const totalExpensesEl = document.getElementById('total-expenses');
const balanceEl = document.getElementById('balance');
const expenseForm = document.getElementById('expense-form');
const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');
const expenseCategoryInput = document.getElementById('expense-category');
const expenseList = document.getElementById('expense-list');

// Update UI on load
updateUI();

// Set Budget
setBudgetBtn.addEventListener('click', () => {
  const value = parseFloat(budgetInput.value);
  if (isNaN(value) || value < 0) {
    alert('Please enter a valid budget amount!');
    return;
  }
  totalBudget = value;
  localStorage.setItem('budget', totalBudget);
  budgetInput.value = '';
  updateUI();
});

// Add Expense
expenseForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = expenseNameInput.value.trim();
  const amount = parseFloat(expenseAmountInput.value);
  const category = expenseCategoryInput.value;

  if (name === '' || isNaN(amount) || amount <= 0) {
    alert('Please enter valid expense details!');
    return;
  }

  const newExpense = {
    id: Date.now(),
    name,
    amount,
    category
  };

  expenses.push(newExpense);
  saveAndRender();

  expenseNameInput.value = '';
  expenseAmountInput.value = '';
});

// Delete Expense
function deleteExpense(id) {
  expenses = expenses.filter(item => item.id !== id);
  saveAndRender();
}

function saveAndRender() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
  updateUI();
}

function updateUI() {
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const balance = totalBudget - totalExpenses;

  totalBudgetEl.textContent = `₹${totalBudget.toFixed(2)}`;
  totalExpensesEl.textContent = `₹${totalExpenses.toFixed(2)}`;
  balanceEl.textContent = `₹${balance.toFixed(2)}`;

  // Change balance color if negative
  balanceEl.style.color = balance < 0 ? '#e74c3c' : '#2ecc71';

  // Render list
  expenseList.innerHTML = '';
  expenses.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="expense-info">
        <span class="expense-title">${item.name}</span>
        <span class="expense-category">${item.category}</span>
      </div>
      <div class="expense-actions">
        <strong>₹${item.amount.toFixed(2)}</strong>
        <button class="delete-btn" onclick="deleteExpense(${item.id})">Delete</button>
      </div>
    `;
    expenseList.appendChild(li);
  });
}