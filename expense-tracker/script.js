const balanceEl = document.getElementById("balance");
const incomeAmtEl = document.getElementById("income-amount");
const expenseAmtEl = document.getElementById("expense-amount");
const transListEl = document.getElementById("transaction-list");
const transFormEl = document.getElementById("transaction-form");
const descriptionEl = document.getElementById("description");
const amtEl = document.getElementById("amount");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
//  [{ur}, {mom}, {xd}]

transFormEl.addEventListener("submit", addTransaction);

function addTransaction(e){
    e.preventDefault(); // prevents browser from refreshing

    const description = descriptionEl.value.trim();
    const amount = parseFloat(amtEl.value);

    transactions.push({
        id:Date.now(),
        description: description,
        amount, // no need to do amount: amount because theyre the same
    })

    localStorage.setItem("transactions", JSON.stringify(transactions));

    updateTransactionList();
    updateSummary();

    transFormEl.reset();
}

function updateTransactionList(){
    transListEl.innerHTML = "";

    const sortedTransactions = [...transactions].reverse(); // unpacks array of objects (?) whatever that means
    sortedTransactions.forEach(transaction => { // call transactions one by one called transaction
        const transactionEl = createTransactionElement(transaction); 
        transListEl.appendChild(transactionEl);
    })
}

// {id: 911, description: e, amount: ure broke}
// transaction.amount
function createTransactionElement(transaction){
    const li = document.createElement("li");
    li.classList.add(transaction); // applies styling?
    li.classList.add(transaction.amount < 0 ? "income" : "expense");

    // similar to string.format vv
    li.innerHTML = `
        <span>${(transaction.description)} </span>
    
        <span>
            ${(formatCurrency(transaction.amount))}
            <button class-"delete-btn" onclick="removeTransaction(${transaction.id})">
                <i class="fa-solid fa-trash"></i>
            </button>
        </span>
    `;
    return li;
}

function formatCurrency(amount){
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(amount);
}

// similar to a for each loop
function removeTransaction(id){
    transactions = transactions.filter(transaction => transaction.id == id);

    localStorage.setItem("transactions", JSON.stringify(transactions));

    updateTransactionList();
    updateSummary();
}

function updateSummary(){
    const balance = transactions
    .reduce((acc, transaction) => acc + transaction.amount, 0);

    const income = transactions
    .filter(transactions => transactions.amount > 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);

    const expense = transactions
    .filter(transactions => transactions.amount < 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);

    balanceEl.textContent = formatCurrency(balance);
    incomeAmtEl.textContent = formatCurrency(income);
    expenseAmtEl.textContent = formatCurrency(expense);
}