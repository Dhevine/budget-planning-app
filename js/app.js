"use strict";

class Expense {
  constructor(expense_input, expense_amount, id) {
    this.expense_input = expense_input;
    this.expense_amount = expense_amount;
    this.id = id;
  }
}

// console.log(new Expense);
class UI {
  constructor() {
    this.budgetFeedback = document.querySelector(".budget-feedback");
    this.expenseFeedback = document.querySelector(".expense-feedback");
    this.budgetForm = document.getElementById("budget-form");
    this.budgetInput = document.getElementById("budget-input");
    this.budgetAmount = document.getElementById("budget-amount");
    this.expenseAmount = document.getElementById("expense-amount");
    this.balance = document.getElementById("balance");
    this.balanceAmount = document.getElementById("balance-amount");
    this.expenseForm = document.getElementById("expense-form");
    this.expenseInput = document.getElementById("expense-input");
    this.amountInput = document.getElementById("amount-input");
    this.expenseList = document.getElementById("expense-list");
    this.totalExpense = document.getElementById("expense-amount");
    this.itemList = [];
    this.itemID = 0;
    // Event listeners
    this.budgetForm.addEventListener("submit", this.Submit_Budget.bind(this));
    this.expenseForm.addEventListener("submit", this.Submit_Expense.bind(this));
    this.expenseList.addEventListener("click", this.ExpenseFunc.bind(this)); // event delegation on expense-list
  }

  clearBudgetInput() {
    this.budgetInput.value = "";
  }

  validate_BugdetInput() {
    const budget_value = this.budgetInput.value;
    if (budget_value && budget_value > 0) {
      this.budgetAmount.textContent = budget_value;
      this.balanceAmount.textContent =
        budget_value - parseInt(this.expenseAmount.textContent);
    } else {
      this.budgetFeedback.style.display = "block";
      this.budgetFeedback.textContent = "Value Cannot Be Empty Or Negative";
      // remove after 3 secs
      setTimeout(() => (this.budgetFeedback.style.display = "none"), 3000);
    }
  }

  Submit_Budget(e) {
    e.preventDefault();
    this.validate_BugdetInput();
    this.clearBudgetInput();
  }

  // Expeneses
  clearExpenseFields() {
    this.expenseInput.value = "";
    this.amountInput.value = "";
  }

  Validate_Expense() {
    const expense_input = this.expenseInput.value;
    const expense_amount = +this.amountInput.value;
    //  validate
    if (expense_input && expense_amount) {
      this.itemID++;
      const userExpense = new Expense(
        expense_input,
        expense_amount,
        this.itemID
      );
      this.itemList.push(userExpense);
      this.Create_Expense_Elem(userExpense);
      //  add expenses
      this.totalExpense.textContent =
        parseInt(this.totalExpense.textContent) + expense_amount;
      // subtract balances
      this.balanceAmount.textContent =
        parseInt(this.balanceAmount.textContent) - expense_amount;
    } else {
      this.expenseFeedback.style.display = "block";
      this.expenseFeedback.textContent = "Value Cannot be Empty Or Negative";
      setTimeout(() => (this.expenseFeedback.style.display = "none"), 3000);
    }
  }

  Submit_Expense(e) {
    e.preventDefault();
    this.Validate_Expense();
    this.clearExpenseFields();
  }

  Create_Expense_Elem(detail) {
    const html = `
      <div class="expense">
        <div class="expense-item d-flex justify-content-between align-items-baseline">

         <h6 class="expense-title mb-0 text-uppercase list-item">- ${detail.expense_input}</h6>
         <h5 class="expense-amount mb-0 list-item">${detail.expense_amount}</h5>

         <div class="expense-icons list-item">

          <a href="#" class="edit-icon mx-2" data-id="${detail.id}">
           <i class="fas fa-edit"></i>
          </a>
          <a href="#" class="delete-icon" data-id="${detail.id}">
           <i class="fas fa-trash"></i>
          </a>
         </div>
        </div>

       </div> 
    `;
    this.expenseList.insertAdjacentHTML("beforeend", html);
  }

  Update_ExpenseAmt_And_BalanceAmt(elem1, elem2, elem3, elem4) {
    this.balanceAmount.textContent = elem1 + parseInt(elem2);
    this.totalExpense.textContent = elem1 - parseInt(elem3);
    elem4.remove(); // remove the exact box
  }

  Edit_Expense_Btn(e) {
    const clicked = e.target.closest(".edit-icon");
    const clicked_parent_Elem = e.target.closest(".expense");
    if (!clicked) return; // guard clause

    const expense_input = this.expenseInput.value;
    const expense_amount = +this.amountInput.value;

    // validate the edit buttom
    // expense input and anount must be empty for edit Btn to work in order to prevent double edit operation which could lead to bug
    if (!expense_input && !expense_amount) {
      const [clickedArr] = this.itemList.filter((el) => {
        return el.id === +clicked.dataset.id;
      });
      // Access the values of the clicked Box
      this.expenseInput.value = clickedArr.expense_input;
      this.amountInput.value = clickedArr.expense_amount;

      // update expense amount and balance amount
      this.Update_ExpenseAmt_And_BalanceAmt(
        clickedArr.expense_amount,
        this.balanceAmount.textContent,
        this.totalExpense.textContent,
        clicked_parent_Elem
      );
    } else {
      this.expenseFeedback.style.display = "block";
      this.expenseFeedback.textContent = "Pending Expense To Edit";
      setTimeout(() => (this.expenseFeedback.style.display = "none"), 3000);
    }
  }

  Remove_Btn(e) {
    const clicked = e.target.closest(".delete-icon");
    if (!clicked) return;
    const clicked_parent_Elem = e.target.closest(".expense");
    const clicked_Expenseamount = +e.target
      .closest(".expense-item")
      .querySelector(".expense-amount").textContent;

    // update expense amount and balance amoount
    this.Update_ExpenseAmt_And_BalanceAmt(
      clicked_Expenseamount,
      this.balanceAmount.textContent,
      this.totalExpense.textContent,
      clicked_parent_Elem
    );
  }
  // Event delegation on expense- list
  ExpenseFunc(e) {
    e.preventDefault();
    this.Edit_Expense_Btn(e);
    this.Remove_Btn(e);
  }
}

const Event = new UI();
