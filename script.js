// 1. Define the full itinerary structure (time, activity options)
const itinerary = {
    // Stage 1: 1100
    '1100': {
        options: ['Palladium (shop)', 'Phoenix (shop)'],
        next: '1400'
    },
    // Stage 2: 1400
    '1400': {
        options: ['Burma Burma', 'Taj Afternoon Tea'],
        prev: '1100', // Added previous stage link
        next: '1600'
    },
    // Stage 3: 1600
    '1600': {
        options: ['Inside CSMT Heritage Tour', 'Kitab Khana + Colaba explore'],
        prev: '1400',
        next: '1800'
    },
    // Stage 4: 1800
    '1800': {
        options: ['Sunset Drinks at Aer (4 seasons)', 'Sunset Drinks at Asilo (St. Regis)'],
        prev: '1600',
        next: '2000'
    },
    // Stage 5: 2000
    '2000': {
        options: ['Dinner at Masque', 'Dinner at By the Mekong'],
        prev: '1800',
        next: '2130'
    },
    // Stage 6: 2130
    '2130': {
        options: ['Leave/ check-in'],
        prev: '2000',
        next: '2200'
    },
    // Stage 7: 2200
    '2200': {
        options: ['Lounge', 'Marine Drive Promenade'],
        prev: '2130',
        next: '0700'
    },
    // Stage 8: 0700
    '0700': {
        options: ['Gym', 'Sleep-in', 'Malabar Hill Elevated Nature Trail'],
        prev: '2200',
        next: '0900'
    },
    // Stage 9: 0900
    '0900': {
        options: ['Brekkie at Nutcracker'],
        prev: '0700',
        next: '1100-Day2' // Using a unique key for the second 1100 event
    },
    // Stage 10: 1100 (Day 2)
    '1100-Day2': {
        options: ['Siddhivinayak'],
        prev: '0900',
        next: '1300'
    },
    // Stage 11: 1300 (Final Stage)
    '1300': {
        options: ['Sardar Pav Bhaji'],
        prev: '1100-Day2',
        next: null // End of the itinerary
    }
};

const container = document.getElementById('options-container');
const resultContainer = document.getElementById('result-container');
const finalChoiceText = document.getElementById('final-choice');
const itineraryList = document.getElementById('itinerary-list'); // New element for the side list

// State variable to track the user's progress and choices
let currentStage = '1100'; // Start at the first stage
let selectionHistory = {}; // Stores chosen activity for each stage: {'1100': 'Palladium (shop)', ...}

// 2. Function to create the interactive buttons for the current stage
function createButtons(stageKey) {
    const stageData = itinerary[stageKey];
    if (!stageData) {
        // If there's no next stage, show the final result
        showFinalResult();
        return;
    }

    container.innerHTML = `<h2>Select the activity for ${stageKey}</h2>`; // Title for current stage

    // Create the activity choice buttons
    stageData.options.forEach(activity => {
        const button = document.createElement('button');
        button.textContent = activity;
        button.className = 'choice-button';
        // Highlight the previously selected choice, if any
        if (selectionHistory[stageKey] === activity) {
             button.classList.add('selected');
        }
        button.onclick = () => handleSelection(stageKey, activity, stageData.next);
        container.appendChild(button);
    });

    // Create the 'Go Back' button if not the first stage
    if (stageData.prev) {
        const backButton = document.createElement('button');
        backButton.textContent = '← Go Back';
        backButton.className = 'back-button';
        backButton.onclick = () => goBack(stageData.prev);
        container.appendChild(backButton);
    }
}

// 3. Function to handle a selection
function handleSelection(stageKey, choice, nextStageKey) {
    selectionHistory[stageKey] = choice; // Store the selection
    currentStage = nextStageKey;         // Update the current stage

    updateItineraryList();               // Update the running list on the side

    // Re-render buttons for the next stage
    createButtons(currentStage);
}

// 4. Function to go back to a previous stage
function goBack(previousStageKey) {
    currentStage = previousStageKey;
    // Remove the selection from the stage we're going *from* (to visually clear it)
    const stageToClear = itinerary[previousStageKey].next;
    delete selectionHistory[stageToClear];

    updateItineraryList(); // Update the running list
    createButtons(currentStage);
}

// 5. Function to update the running list of selections
function updateItineraryList() {
    itineraryList.innerHTML = '<h3>Your Selected Itinerary</h3>';
    let hasSelections = false;

    // Iterate through the stages in order, including the new '1100-Day2' key
    const orderedStages = Object.keys(itinerary);

    orderedStages.forEach(stageKey => {
        const time = stageKey.replace('-Day2', ''); // Display time without the day identifier
        const choice = selectionHistory[stageKey];

        if (choice) {
            hasSelections = true;
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong>${time}:</strong> ${choice}`;
            itineraryList.appendChild(listItem);
        } else {
             // Display pending stages to show progress
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong>${time}:</strong> <em style="color:#aaa;">(Awaiting Selection)</em>`;
            itineraryList.appendChild(listItem);
        }
    });
    
    // Simple message if nothing is selected yet
    if (!hasSelections) {
         itineraryList.innerHTML = '<h3>Your Selected Itinerary</h3><p>Start your selections below!</p>';
    }
}

// 6. Function to display the final result (when all stages are complete)
function showFinalResult() {
    container.innerHTML = '';
    
    // Display a final summary message
    finalChoiceText.innerHTML = "<h1>🎉 Itinerary Complete!</h1><p>Below is your finalized, amazing date plan:</p>";
    
    // Move the itinerary list content into the main result area for final display
    const finalPlan = document.createElement('ul');
    finalPlan.innerHTML = itineraryList.innerHTML;
    finalChoiceText.appendChild(finalPlan);
    
    // Add a reset button
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Start Over';
    resetButton.className = 'reset-button';
    resetButton.onclick = resetPage;
    finalChoiceText.appendChild(resetButton);
}

// 7. Function to reset the page
function resetPage() {
    currentStage = '1100';
    selectionHistory = {};
    updateItineraryList();
    createButtons(currentStage);
}

// 8. Initial setup when the page loads
createButtons(currentStage);
updateItineraryList(); // Initialize the list area
