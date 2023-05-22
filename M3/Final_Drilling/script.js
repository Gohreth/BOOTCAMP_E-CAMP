class Person {
  #budget;
  #expenses;
  #balance;
  #expensesListing;
  static #listingId = 1;
  constructor(budget, expenses, balance) {
    this.#budget = budget;
    this.#expenses = expenses;
    this.#balance = balance;
    this.#expensesListing = [];
  }

  //Método privado para calcular el balance
  #calculateBalance() {
    this.#balance = this.#budget - this.#expenses;
  }

  //Método para agregar un gasto y actualizar los gastos totales
  addExpense(name, value) {
    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof value !== "number" ||
      isNaN(value)
    )
      throw new Error(
        "El nombre debe ser un string no vacío y el valor un número"
      );
    const expenseToAdd = {
      id: Person.#listingId,
      name: name,
      value: value,
    };
    this.expenses += expenseToAdd.value;
    this.#expensesListing.push(expenseToAdd);
    Person.#nextId();
  }

  //Método para eliminar un gasto y actualizar los gastos totales
  removeExpense(id) {
    console.log(id, this.#expensesListing);
    if (typeof id !== "number" || isNaN(id))
      throw new Error("El id debe ser un número");
    const index = this.#expensesListing.findIndex(
      (expense) => expense.id === id
    );
    if (index === -1) throw new Error("El id no existe");
    this.expenses -= this.#expensesListing[index].value;
    this.#expensesListing.splice(index, 1);
  }

  //Método estático y privado para incrementar el id
  static #nextId() {
    this.#listingId++;
  }

  set budget(newValue) {
    if (typeof newValue !== "number" || isNaN(newValue))
      throw new Error("El presupuesto debe ser un número");
    if (newValue < 0) throw new Error("El presupuesto no puede ser negativo");
    if (newValue < this.#expenses)
      throw new Error("El presupuesto no puede ser menor a los gastos");
    this.#budget = newValue;
    this.#calculateBalance();
  }

  get budget() {
    return this.#budget;
  }

  set expenses(newValue) {
    if (newValue > this.#budget) throw new Error("Sin fondos");
    this.#expenses = newValue;
    this.#calculateBalance();
  }

  get expenses() {
    return this.#expenses;
  }
  get balance() {
    return this.#balance;
  }
  static get listingId() {
    return this.#listingId;
  }
}

addEventListener("DOMContentLoaded", () => {
  //Instanciación de clase Person con valores por defecto y actualización de UI
  const person = new Person(0, 0, 0);

  const totalBudget = document.getElementById("total-budget");
  const totalExpenses = document.getElementById("total-expenses");
  const totalBalance = document.getElementById("total-balance");

  totalBudget.innerText = person.budget;
  totalExpenses.innerText = person.expenses;
  totalBalance.innerText = person.balance;

  //Ingreso de presupuesto
  const budgetInput = document.getElementById("budget-input");
  const budgetButton = document.getElementById("budget-btn");

  //Ingreso de gasto
  const expenseName = document.getElementById("expense-name");
  const expenseValue = document.getElementById("expense-value");
  const expenseButton = document.getElementById("expense-btn");

  //Listado de gastos
  const expensesListing = document.getElementById("expenses-listing");

  //Eventos de botones
  budgetButton.addEventListener("click", () => {
    try {
      person.budget = parseInt(budgetInput.value);
    } catch (error) {
      alert(error.message);
    } finally {
      totalBudget.innerText = person.budget;
      totalBalance.innerText = person.balance;
    }
  });

  expenseButton.addEventListener("click", () => {
    try {
      const currentId = Person.listingId;
      person.addExpense(expenseName.value, parseInt(expenseValue.value));
      const expenseItem = {
        id: currentId,
        name: expenseName.value,
        value: expenseValue.value,
      };
      appendExpenseItemToDOM(expenseItem);
    } catch (error) {
      alert(error.message);
    } finally {
      totalExpenses.innerText = person.expenses;
      totalBalance.innerText = person.balance;
    }
  });

  //Funciones para manejar el DOM
  function removeExpenseDOMElement(id) {
    expensesListing.removeChild(document.getElementById(`item-${id}`));
  }

  function generateLiHTMLElementTemplate({ id, name, value }) {
    const li = document.createElement("li");
    li.id = "item-" + id;
    li.className = "expenses__item";

    const pName = document.createElement("p");
    pName.innerHTML = name;
    li.appendChild(pName);

    const pValue = document.createElement("p");
    pValue.innerHTML = `$${value}`;
    li.appendChild(pValue);

    const clickableIcon = document.createElement("div");
    clickableIcon.className = "icon-container";
    clickableIcon.addEventListener("click", () => {
      try {
        console.log(id);
        person.removeExpense(id);
        removeExpenseDOMElement(id);
      } catch (error) {
        console.log(error);
      } finally {
        totalExpenses.innerText = person.expenses;
        totalBalance.innerText = person.balance;
      }
    });
    clickableIcon.innerHTML = `
        <svg
            class="icon"
                xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            >
            <!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
            <path
                fill="currentColor"
                d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"
            />
        </svg>
    `;
    li.appendChild(clickableIcon);
    return li;
  }

  function appendExpenseItemToDOM(expenseItem) {
    expensesListing.appendChild(generateLiHTMLElementTemplate(expenseItem));
  }
});
