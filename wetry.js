let tripData = {
    totalDays: 0,
    initialBudget: 0,
    currentBudget: 0,
    expenses: []
};

function initializeTrip() {
    tripData.totalDays = parseInt(document.getElementById('totalDays').value);
    tripData.initialBudget = parseFloat(document.getElementById('initialBudget').value);
    tripData.currentBudget = tripData.initialBudget;
    tripData.expenses = [];
    document.getElementById('dailyUpdate').style.display = 'block';
    document.getElementById('expenseTable').style.display = 'table';
    updateResult(`Trip started with $${tripData.initialBudget} for ${tripData.totalDays} days. 
                  Average cost per day: $${(tripData.initialBudget / tripData.totalDays).toFixed(2)}`);
}

function updateDay() {
    const currentDay = parseInt(document.getElementById('currentDay').value);
    const spentToday = parseFloat(document.getElementById('spentToday').value);
    
    if (currentDay < 1 || currentDay > tripData.totalDays || currentDay !== tripData.expenses.length + 1) {
        alert("Please enter the correct day number");
        return;
    }

    const remainingBudget = tripData.currentBudget - spentToday;
    if (remainingBudget < 0) {
        alert("You've overspent your budget!");
        return;
    }

    tripData.currentBudget = remainingBudget;
    const remainingDays = tripData.totalDays - currentDay;
    const newAverage = remainingDays > 0 ? (remainingBudget / remainingDays).toFixed(2) : "N/A";

    tripData.expenses.push({
        day: currentDay,
        spent: spentToday,
        remainingBudget: remainingBudget,
        newAverage: newAverage
    });

    updateTable();
    updateResult(`Day ${currentDay}: Spent $${spentToday}. New average cost per day: $${newAverage}`);
}

function updateTable() {
    const tableBody = document.getElementById('expenseBody');
    tableBody.innerHTML = '';
    tripData.expenses.forEach(expense => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = expense.day;
        row.insertCell(1).textContent = expense.spent.toFixed(2);
        row.insertCell(2).textContent = expense.remainingBudget.toFixed(2);
        row.insertCell(3).textContent = expense.newAverage;
    });
}

function updateResult(message) {
    document.getElementById('result').textContent = message;
}