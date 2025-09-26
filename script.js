// 1. Define your date options
const dateOptions = {
    'Outdoors': 'A day of hiking, park picnics, or something active in the fresh air! 🏞️',
    'Cozy Night': 'Movie marathon, board games, hot chocolate, and maximum snuggle levels. 🛋️',
    'New Flavors': 'Trying that new restaurant, cooking a complicated recipe together, or a wine tasting. 🍷',
    'Creative Fun': 'Visit a museum, attend a show, or paint/create something together. 🎨'
};

const container = document.getElementById('options-container');
const resultContainer = document.getElementById('result-container');
const finalChoiceText = document.getElementById('final-choice');

// 2. Function to create the interactive buttons
function createButtons() {
    container.innerHTML = ''; // Clear existing
    for (const activity in dateOptions) {
        const button = document.createElement('button');
        button.textContent = activity;
        button.className = 'choice-button'; // for styling
        button.onclick = () => showResult(activity); // Call showResult when clicked
        container.appendChild(button);
    }
}

// 3. Function to display the result
function showResult(choice) {
    // Hide the options and show the result
    container.classList.add('hidden');
    resultContainer.classList.remove('hidden');

    const description = dateOptions[choice];
    finalChoiceText.innerHTML = `**We're going with ${choice}!**<br><br>The plan is: ${description}`;
}

// 4. Function to reset the page (called from the HTML button)
function resetPage() {
    container.classList.remove('hidden');
    resultContainer.classList.add('hidden');
    finalChoiceText.textContent = '';
}

// 5. Run the function to create the buttons when the page loads
createButtons();
