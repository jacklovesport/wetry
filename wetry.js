let tripData = {
    totalDays: 0,
    initialBudget: 0,
    currentBudget: 0,
    currentDay: 0,
    expenses: []
};

let chart = null;

function initializeTrip() {
    const newTotalDays = parseInt(document.getElementById('totalDays').value);
    const newInitialBudget = parseFloat(document.getElementById('initialBudget').value);

    // Always reset the trip data
    tripData = {
        totalDays: newTotalDays,
        initialBudget: newInitialBudget,
        currentBudget: newInitialBudget,
        currentDay: 0,
        expenses: []
    };

    document.getElementById('dailyUpdate').style.display = 'block';
    document.getElementById('expenseTable').style.display = 'table';
    document.getElementById('chartContainer').style.display = 'block';
    
    updateResult(`Trip started with $${tripData.initialBudget} for ${tripData.totalDays} days. 
                Average cost per day: $${(tripData.initialBudget / tripData.totalDays).toFixed(2)}`);
    
    updateTable();
    initChart(); // Initialize the chart
}

function initChart() {
    // Destroy the existing chart if it exists
    if (chart) {
        chart.destroy();
    }

    // Clear the canvas
    const canvas = document.getElementById('expenseChart');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create a new chart
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Daily Expenses',
                data: [],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateChart() {
    if (chart) {
        chart.data.labels = tripData.expenses.map(expense => `Day ${expense.day}`);
        chart.data.datasets[0].data = tripData.expenses.map(expense => expense.spent);
        chart.update();
    }
}
function updateDay() {
const spentToday = parseFloat(document.getElementById('spentToday').value);

tripData.currentDay++;

if (tripData.currentDay > tripData.totalDays) {
alert("Trip has ended!");
return;
}

let remainingBudget = tripData.currentBudget - spentToday;

if (remainingBudget < 0) {
// Provide a warning instead of an error
alert("Warning: You've overspent your budget for today!");
}

// Update the current budget even if it goes negative
tripData.currentBudget = remainingBudget;

const remainingDays = tripData.totalDays - tripData.currentDay;

const totalSpent = tripData.initialBudget - remainingBudget;
const averageSpendSoFar = totalSpent / tripData.currentDay;
let newAverage;

if (remainingDays > 0) {
newAverage = (remainingBudget / remainingDays).toFixed(2);
} else {
newAverage = "N/A";
}

tripData.expenses.push({
day: tripData.currentDay,
spent: spentToday,
remainingBudget: remainingBudget,
averageSpendSoFar: averageSpendSoFar.toFixed(2),
newAverage: newAverage
});

updateTable();
updateChart();
updateResult(`Day ${tripData.currentDay}: Spent $${spentToday}. 
        Average spend so far: $${averageSpendSoFar.toFixed(2)}.
        New average for remaining days: $${newAverage}`);
}
function updateTable() {
    const tableBody = document.getElementById('expenseBody');
    tableBody.innerHTML = '';
    if (tripData.expenses.length === 0) {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = "No expenses yet";
        row.insertCell(1).textContent = "-";
        row.insertCell(2).textContent = tripData.initialBudget.toFixed(2);
        row.insertCell(3).textContent = "-";
        row.insertCell(4).textContent = (tripData.initialBudget / tripData.totalDays).toFixed(2);
        row.insertCell(5).textContent = "-";
    } else {
        tripData.expenses.forEach((expense, index) => {
            const row = tableBody.insertRow();
            row.insertCell(0).textContent = expense.day;
            row.insertCell(1).textContent = expense.spent.toFixed(2);
            row.insertCell(2).textContent = expense.remainingBudget.toFixed(2);
            row.insertCell(3).textContent = expense.averageSpendSoFar;
            row.insertCell(4).textContent = expense.newAverage;
            
            const actionsCell = row.insertCell(5);
            actionsCell.innerHTML = `
                <button onclick="editExpense(${index})">Edit</button>
                <button onclick="deleteExpense(${index})">Delete</button>
            `;
        });
    }
}

function editExpense(index) {
    const expense = tripData.expenses[index];
    const newAmount = prompt(`Enter new amount for Day ${expense.day}:`, expense.spent);
    if (newAmount !== null) {
        const difference = parseFloat(newAmount) - expense.spent;
        tripData.expenses[index].spent = parseFloat(newAmount);
        recalculateExpenses(index, difference);
        updateTable();
        updateChart();
    }
}

function deleteExpense(index) {
    if (confirm(`Are you sure you want to delete the expense for Day ${tripData.expenses[index].day}?`)) {
        const deletedAmount = tripData.expenses[index].spent;
        tripData.expenses.splice(index, 1);
        recalculateExpenses(index, -deletedAmount);
        updateTable();
        updateChart();
    }
}

function recalculateExpenses(startIndex, difference) {
    tripData.currentBudget += difference;
    for (let i = startIndex; i < tripData.expenses.length; i++) {
        const expense = tripData.expenses[i];
        expense.remainingBudget = i === startIndex ? expense.remainingBudget - difference : tripData.expenses[i-1].remainingBudget - expense.spent;
        const totalSpent = tripData.initialBudget - expense.remainingBudget;
        expense.averageSpendSoFar = (totalSpent / expense.day).toFixed(2);
        const remainingDays = tripData.totalDays - expense.day;
        expense.newAverage = remainingDays > 0 ? (expense.remainingBudget / remainingDays).toFixed(2) : "N/A";
    }
    tripData.currentDay = tripData.expenses.length;
}

function updateResult(message) {
    document.getElementById('result').textContent = message;
}