// 1. MODIFIED: The itinerary array now includes descriptions and conditional logic.
const itinerary = [
    {
        id: '1100-meetup',
        title: '11:00 AM - Meetup and Shop',
        description: "Let's start the day by meeting up and doing a bit of shopping.",
        options: ['Palladium', 'Phoenix Mills'],
    },
    {
        id: '1400-lunch',
        title: '2:00 PM - Luncheon',
        description: 'Time for a delicious meal to recharge.',
        options: ['Burma Burma', 'Taj Afternoon Tea'],
    },
    {
        id: '1600-explore',
        title: '4:00 PM - Explore the Town',
        description: 'An afternoon adventure in the city.',
        options: ['CSMT Heritage Tour', 'Kitab Khana + Colaba Stroll'],
    },
    {
        id: '1800-drinks',
        title: '6:00 PM - Sunset Drinks',
        description: 'Let\'s watch the sunset with a drink in hand.',
        options: ['AER', 'Asilo'],
    },
    {
        id: 'stay',
        title: 'Continue the Night?',
        description: 'Do we want to check into the St. Regis for the night?',
        options: [
            { text: 'Yes, let\'s stay!', nextStageId: 'check-in' },
            { text: 'No, let\'s wrap up after dinner.', nextStageId: 'dinner' }
        ]
    },
    {
        id: 'check-in',
        title: 'Check-in',
        description: 'Time to check in at the St. Regis.',
        options: ['Let\'s check-in'],
    },
    {
        id: 'vibe',
        title: 'What\'s the Vibe?',
        description: 'How are we feeling for dinner?',
        options: ['Mush', 'Guarded'],
    },
    {
        id: 'dinner',
        title: '8:00 PM - Dinner',
        description: 'The main event for the evening.',
        getOptions: (history) => {
            let baseOptions = ['By the Mekong', 'Masque'];
            if (history['stay'] === 'Yes, let\'s stay!' && history['vibe'] === 'Mush') {
                baseOptions.push('In-Room Dining');
            }
            return baseOptions;
        }
    },
    {
        id: 'lounge',
        title: '10:00 PM - After Dinner',
        description: 'What should we do to wind down the night?',
        options: ['Marine Drive', 'Find a cozy Lounge'],
    },
    {
        id: 'long-night',
        title: '11:00 PM - The Long Night',
        description: 'Just spending some quality time together.',
        options: ['Talk time', 'Music Time', 'Game Time']
    },
    {
        id: 'day-break',
        title: 'Day 2 - 7:00 AM',
        description: 'Good morning! How should we start the day?',
        options: ['Gym', 'Sleep-in']
    },
    {
        id: 'brekkie',
        title: 'Day 2 - 9:30 AM - Breakfast',
        description: 'Time for the most important meal of the day.',
        options: ['The NutCracker', 'Malabar Hill Elevated Nature Trail']
    },
    {
        id: 'pick-a-place',
        title: 'Day 2 - 11:00 AM',
        description: 'One last stop.',
        options: ['Siddhivinayak']
    },
    {
        id: 'final-lunch',
        title: 'Day 2 - 1:00 PM - Final Lunch',
        description: 'One final meal to wrap up an amazing time.',
        options: ['Kerala Cafe', 'Sardar']
    },
    {
        id: 'goodbye',
        title: '10:00 PM / 3:00 PM - Goodbye',
        description: 'What a wonderful time! Thank you.',
        options: ['Goodbye hugs'],
        isEnd: true
    }
];


const container = document.getElementById('options-container');
const resultContainer = document.getElementById('result-container');
const finalChoiceText = document.getElementById('final-choice');
const itineraryList = document.getElementById('itinerary-list');

let currentIndex = 0;
let selectionHistory = {};
// NEW: An array to store the user's path through the itinerary indices.
let pathHistory = [0]; 


function renderCurrentStage() {
    if (currentIndex < 0 || currentIndex >= itinerary.length) {
        showFinalResult();
        return;
    }

    const stageData = itinerary[currentIndex];
    container.innerHTML = `<h2>${stageData.title}</h2>`;

    if (stageData.description) {
        const descriptionEl = document.createElement('p');
        descriptionEl.textContent = stageData.description;
        descriptionEl.className = 'event-description';
        container.appendChild(descriptionEl);
    }

    const options = typeof stageData.options === 'function' 
        ? stageData.getOptions(selectionHistory) 
        : stageData.options;

    options.forEach(option => {
        const button = document.createElement('button');
        const buttonText = typeof option === 'object' ? option.text : option;
        button.textContent = buttonText;
        button.className = 'choice-button';

        if (selectionHistory[stageData.id] === buttonText) {
            button.classList.add('selected');
        }

        button.onclick = () => handleSelection(stageData.id, option);
        container.appendChild(button);
    });

    // MODIFIED: Create the 'Go Back' button if we're not on the very first step.
    if (pathHistory.length > 1) {
        const backButton = document.createElement('button');
        backButton.textContent = '← Go Back';
        backButton.className = 'back-button'; // Use a different class for styling
        backButton.onclick = () => goBack();
        container.appendChild(backButton);
    }
}


function handleSelection(stageId, choice) {
    const choiceText = typeof choice === 'object' ? choice.text : choice;
    selectionHistory[stageId] = choiceText;

    const stageData = itinerary.find(stage => stage.id === stageId);

    if (stageData.isEnd) {
        showFinalResult();
        updateItineraryList();
        return;
    }

    let nextIndex;
    if (typeof choice === 'object' && choice.nextStageId) {
        nextIndex = itinerary.findIndex(stage => stage.id === choice.nextStageId);
    } else {
        nextIndex = currentIndex + 1;
    }
    
    if (nextIndex !== -1) {
        currentIndex = nextIndex;
        // NEW: Add the new stage's index to our path history.
        pathHistory.push(currentIndex);
    }

    updateItineraryList();
    renderCurrentStage();
}

// NEW: The robust goBack function that uses pathHistory.
function goBack() {
    if (pathHistory.length <= 1) return; // Can't go back from the start

    // Remove the current stage from history
    const currentStageIndex = pathHistory.pop();
    const currentStageId = itinerary[currentStageIndex].id;
    delete selectionHistory[currentStageId]; // Clear the choice for the stage we're leaving

    // Get the previous stage's index
    const previousStageIndex = pathHistory[pathHistory.length - 1];
    currentIndex = previousStageIndex;

    updateItineraryList();
    renderCurrentStage();
}


function updateItineraryList() {
    itineraryList.innerHTML = '<h3>Your Selected Itinerary</h3>';
    
    const selectedStageIds = new Set(Object.keys(selectionHistory));
    
    if(currentIndex < itinerary.length) {
      selectedStageIds.add(itinerary[currentIndex].id);
    }
    
    itinerary.forEach(stage => {
        if (selectedStageIds.has(stage.id)) {
            const choice = selectionHistory[stage.id];
            const listItem = document.createElement('li');

            if (choice) {
                listItem.innerHTML = `<strong>${stage.title}:</strong> ${choice}`;
            } else {
                listItem.innerHTML = `<strong>${stage.title}:</strong> <em style="color:#aaa;">(Awaiting Selection)</em>`;
            }
            itineraryList.appendChild(listItem);
        }
    });

    if (Object.keys(selectionHistory).length === 0) {
         itineraryList.innerHTML = '<h3>Your Selected Itinerary</h3><p>Start your selections below!</p>';
    }
}


function showFinalResult() {
    container.innerHTML = '';
    finalChoiceText.innerHTML = "<h1>🎉 Itinerary Complete!</h1><p>Here is your finalized plan:</p>";
    
    const finalPlan = document.createElement('ul');

    for (const stageId in selectionHistory) {
        const stage = itinerary.find(s => s.id === stageId);
        const choice = selectionHistory[stageId];
        if (stage && choice) {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong>${stage.title}:</strong> ${choice}`;
            finalPlan.appendChild(listItem);
        }
    }
    
    finalChoiceText.appendChild(finalPlan);
    
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Start Over';
    resetButton.className = 'reset-button';
    resetButton.onclick = resetPage;
    finalChoiceText.appendChild(resetButton);

    itineraryList.style.display = 'none';
}


function resetPage() {
    currentIndex = 0;
    selectionHistory = {};
    // MODIFIED: Reset the path history to the starting stage.
    pathHistory = [0]; 
    finalChoiceText.innerHTML = '';
    itineraryList.style.display = 'block';

    updateItineraryList();
    renderCurrentStage();
}

// *** NEW CODE STARTS HERE ***

/**
 * Creates and appends a "Reset All Selections" button to the page.
 * This button will reset the entire itinerary and take the user back to the first event.
 */
function addResetButton() {
    const resetButtonContainer = document.getElementById('reset-button-container');
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset All Selections';
    resetButton.className = 'reset-button'; // A class for styling
    resetButton.onclick = resetPage;
    resetButtonContainer.appendChild(resetButton);
}

// Call the initial render and list update
renderCurrentStage();
updateItineraryList();

// Add the reset button when the page first loads
addResetButton();
