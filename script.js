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
    // NEW: Conditional "STAY!" event that branches the itinerary.
    {
        id: 'stay',
        title: 'Continue the Night?',
        description: 'Do we want to check into the St. Regis for the night?',
        options: [
            { text: 'Yes, let\'s stay!', nextStageId: 'check-in' }, // Jumps to 'check-in'
            { text: 'No, let\'s wrap up after dinner.', nextStageId: 'dinner' } // Jumps to 'dinner'
        ]
    },
    // NEW: This stage only appears if the user chose "Yes" to stay.
    {
        id: 'check-in',
        title: 'Check-in',
        description: 'Time to check in at the St. Regis.',
        options: ['Let\'s check-in'],
    },
    // NEW: Vibe check after checking in.
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
        // MODIFIED: Options are now a function to allow for dynamic choices.
        getOptions: (history) => {
            let baseOptions = ['By the Mekong', 'Masque'];
            // If we stayed AND the vibe is "Mush", add an "In-Room" dining option.
            if (history['stay'] === 'Yes, let\'s stay!' && history['vibe'] === 'Mush') {
                baseOptions.push('In-Room Dining');
            }
            return baseOptions;
        }
    },
    // NEW: This stage only appears if the user chose "Yes" to stay.
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
    // NEW: The "Goodbye" stage, which can be an endpoint.
    {
        id: 'goodbye',
        title: '10:00 PM / 3:00 PM - Goodbye',
        description: 'What a wonderful time! Thank you.',
        options: ['Goodbye hugs'],
        isEnd: true // NEW: A flag to mark this as a final state.
    }
];


const container = document.getElementById('options-container');
const resultContainer = document.getElementById('result-container');
const finalChoiceText = document.getElementById('final-choice');
const itineraryList = document.getElementById('itinerary-list');

let currentIndex = 0;
let selectionHistory = {};

// MODIFIED: This function is now more powerful.
function renderCurrentStage() {
    if (currentIndex < 0 || currentIndex >= itinerary.length) {
        showFinalResult();
        return;
    }

    const stageData = itinerary[currentIndex];
    container.innerHTML = `<h2>${stageData.title}</h2>`;

    // NEW: Add the description text below the title.
    if (stageData.description) {
        const descriptionEl = document.createElement('p');
        descriptionEl.textContent = stageData.description;
        descriptionEl.className = 'event-description';
        container.appendChild(descriptionEl);
    }

    // MODIFIED: Handle both simple string options and dynamic/conditional options.
    const options = typeof stageData.options === 'function' 
        ? stageData.getOptions(selectionHistory) 
        : stageData.options;

    options.forEach(option => {
        const button = document.createElement('button');
        // MODIFIED: An option can be a string or an object with text.
        const buttonText = typeof option === 'object' ? option.text : option;
        button.textContent = buttonText;
        button.className = 'choice-button';

        if (selectionHistory[stageData.id] === buttonText) {
            button.classList.add('selected');
        }

        button.onclick = () => handleSelection(stageData.id, option);
        container.appendChild(button);
    });

    // We don't need a back button for this conditional logic model for now,
    // as going back would be complex. It can be added later if needed.
}


// MODIFIED: This function now handles branching logic.
function handleSelection(stageId, choice) {
    const choiceText = typeof choice === 'object' ? choice.text : choice;
    selectionHistory[stageId] = choiceText;

    const stageData = itinerary.find(stage => stage.id === stageId);

    // If the current stage is a final one, end the itinerary.
    if (stageData.isEnd) {
        showFinalResult();
        updateItineraryList();
        return;
    }

    // If the chosen option has a "nextStageId", we jump to that stage.
    if (typeof choice === 'object' && choice.nextStageId) {
        const nextIndex = itinerary.findIndex(stage => stage.id === choice.nextStageId);
        if (nextIndex !== -1) {
            currentIndex = nextIndex;
        } else {
            // Fallback: if we can't find the stage, just go to the next one.
            currentIndex++;
        }
    } else {
        // Otherwise, just go to the next stage in the array.
        currentIndex++;
    }

    updateItineraryList();
    renderCurrentStage();
}


// This function is largely the same but now iterates through the more complex data.
function updateItineraryList() {
    itineraryList.innerHTML = '<h3>Your Selected Itinerary</h3>';
    
    // Create a set of all stages that have been selected so far.
    const selectedStageIds = new Set(Object.keys(selectionHistory));
    
    // Also include the current stage to show it's awaiting selection.
    if(currentIndex < itinerary.length) {
      selectedStageIds.add(itinerary[currentIndex].id);
    }
    
    itinerary.forEach(stage => {
        // Only display stages that are part of the user's path.
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
    // We iterate through history to show the choices in the order they were made.
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
    // MODIFIED: Find the index of the very first stage to reset correctly.
    currentIndex = 0;
    selectionHistory = {};
    finalChoiceText.innerHTML = '';
    itineraryList.style.display = 'block';

    updateItineraryList();
    renderCurrentStage();
}

renderCurrentStage();
updateItineraryList();
