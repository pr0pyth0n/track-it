let totalPoints = parseInt(localStorage.getItem('pointstorage'), 10) || 0;
let assignments = [];
let currentTheme = 'light'; // Initial theme
window.totalPoints = totalPoints;

document.addEventListener('DOMContentLoaded', function() {
    loadTotalPoints();  // Load total points first to fix point bug
    loadAssignments();
});

function changeTheme() {
    const themeCost = 25;

    if (totalPoints >= themeCost) {
        const confirmed = confirm(`Are you sure you want to change the theme? This will cost ${themeCost} points.`);

        if (confirmed) {
            totalPoints -= themeCost;
            document.getElementById('totalPoints').innerText = totalPoints;

            // Toggle between 'light' and 'dark'
            currentTheme = (currentTheme === 'light') ? 'dark' : 'light';

            // Update the body class to apply the theme styles
            updateThemeClass();

            saveTheme(); // Save the current theme to local storage
            updateTotalPoints(0);
        }
    } else {
        alert('Insufficient points to change theme.');
    }
}

function updateThemeClass() {
    const body = document.body;
    body.classList.toggle('dark-mode', currentTheme === 'dark');
}

function saveTheme() {
    localStorage.setItem('currentTheme', currentTheme);
}

function loadAssignments() {
    const storedAssignments = localStorage.getItem('assignments');
    if (storedAssignments) {
        assignments = JSON.parse(storedAssignments);
        displayAssignments();
    }
}

function loadTotalPoints() {
    const storedTotalPoints = localStorage.getItem('totalPoints');
    if (storedTotalPoints) {
        totalPoints = parseInt(storedTotalPoints, 10);
        document.getElementById('totalPoints').innerText = totalPoints;
    }
}

function addAssignment() {
    const assignmentName = document.getElementById('assignmentName').value;
    const assignmentType = document.getElementById('assignmentType').value;
    const subject = document.getElementById('subject').value;

    if (assignmentName.trim() === '') {
        alert('Please enter assignment name.');
        return;
    }

    const points = calculatePoints(assignmentType);

    const newAssignment = {
        name: assignmentName,
        type: assignmentType,
        subject: subject,
        points: points,
        completed: false,
    };

    assignments.push(newAssignment);
    displayAssignments();
    saveAssignments();
    clearInputFields();
    //updateTotalPoints(points);
}

function completeAssignment(index) {
    if (!assignments[index].completed) {
        totalPoints += assignments[index].points;
        assignments[index].completed = true;
        displayAssignments();
        updateTotalPoints(0);  // Update the total points only when an assignment is completed
        saveAssignments();
    }
}

function removeAssignment(index) {
    if (confirm('Are you sure you want to remove this assignment?')) {
        const assignmentCard = document.querySelectorAll('.assignment-card')[index];
        assignmentCard.classList.add('fade-out');

        setTimeout(() => {
            assignments.splice(index, 1);
            displayAssignments();
            saveAssignments();
        }, 300); // Wait for the animation to complete (300ms) before removing the assignment
    }
}

function resetAssignments() {
    if (confirm('Are you sure you want to reset all assignments?')) {
        assignments = [];
        totalPoints = 0;
        displayAssignments();
        updateTotalPoints(0);
        localStorage.removeItem('assignments');
    }
}

function displayAssignments() {
    const assignmentList = document.getElementById('assignmentList');
    assignmentList.innerHTML = '';

    assignments.forEach((assignment, index) => {
        const assignmentCard = document.createElement('div');
        assignmentCard.className = 'assignment-card';
        assignmentCard.innerHTML = `
            <span>${assignment.name} - ${assignment.type} - Subject: ${assignment.subject}</span>
            <button onclick="completeAssignment(${index})" ${assignment.completed ? 'disabled' : ''}>Mark Complete</button>
            <button onclick="removeAssignment(${index})">Remove</button>
        `;
        assignmentList.appendChild(assignmentCard);
    });
}

function updateTotalPoints(change) {
    totalPoints += change;
    document.getElementById('totalPoints').innerText = totalPoints;
    localStorage.setItem('totalPoints', totalPoints);
}

function calculatePoints(assignmentType) {
    switch (assignmentType) {
        case 'test':
            return 50;
        case 'quiz':
            return 30;
        case 'assignment':
            return 20;
        default:
            return 0;
    }
}

function saveAssignments() {
    localStorage.setItem('assignments', JSON.stringify(assignments));
}

function clearInputFields() {
    document.getElementById('assignmentName').value = '';
    document.getElementById('assignmentType').selectedIndex = 0;
    document.getElementById('subject').selectedIndex = 0;
}

function gamblePoints(probability) {
    const gambleAmount = parseInt(prompt('Enter the amount of points to gamble:', '0'));
    if (isNaN(gambleAmount) || gambleAmount < 0 || gambleAmount > totalPoints) {
        alert('Invalid input. Please enter a valid amount.');
        return;
    }

    const reciprocal = 1 / probability;
    const gambleResult = Math.random() < probability;
    const resultMessage = gambleResult ? 'You won!' : 'You lost!';

    if (gambleResult) {
        totalPoints += gambleAmount * reciprocal;
    } else {
        totalPoints -= gambleAmount;
        if (totalPoints < 0) {
            totalPoints = 0;
        }
    }

    document.getElementById('totalPoints').innerText = totalPoints;
    alert(`${resultMessage} Points: ${gambleResult ? gambleAmount * reciprocal : -gambleAmount}`);
}

function gamblePrompt() {
    let answer = prompt("(0) 1/2 chance of doubling your points \n(1) 1/3 chance of tripling your points \n(2) 1/4 chance of quadrupling your points \n(3) 1/5 chance of x5 points \n(4) 1/6 chance of x6 points \n(5) 1/7 chance of x7 points \n(6) 1/8 chance of x8 points \n(7) 1/9 chance of x9 points \n(8) 1/10 chance of x10 points \nAnything else to cancel");

    const option = parseInt(answer, 10);

    if (!isNaN(option) && option >= 0 && option <= 8) {
        const probabilities = [0.5, 1 / 3, 0.25, 0.2, 1 / 6, 1 / 7, 0.125, 1 / 9, 0.1];
        gamblePoints(probabilities[option]);
    } else {
        alert('Invalid input. Please enter a valid option.');
    }
}
