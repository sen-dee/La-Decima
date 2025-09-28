const itinerary = [
    {
        id: '1100-meetup',
        title: 'Meetup / Shop',
        description: "Let's start the day by meeting here. Will you take me shopping? This also serves as a central spot for most things we could choose to do.",
        options: ['Palladium'],
    },
    {
        id: '1400-lunch',
        title: 'Lunch',
        description: 'Time for a delicious meal to recharge. I know we\'ve talked about Burma Burma a lot, but would you prefer going to Sea Lounge for their Afternoon Tea?',
        options: ['Burma Burma', 'Taj Afternoon Tea'],
    },
    {
        id: '1600-explore',
        title: 'Wander the Streets',
        description: 'An adventure in the city... and if the metro work is still going on, it might also serve as a trek',
        options: ['CSMT Heritage Tour', 'Kitab Khana + Colaba Stroll'],
    },
    {
        id: '1800-drinks',
        title: 'Sunset Views',
        description: "Let's catch the sunset with a drink in hand.",
        options: ['AER', 'Asilo'],
    },
    {
        id: 'stay',
        title: '!! STAY !!',
        description: 'So, I know how you feel about this, but I still want you to give it a thought. You will have your own separate room at St. Regis which hopefully puts you at ease. My intention is to maximize the time we have together, the last thing I want you is to feel rushed on a late night commute. Choosing Yes allows us to get plenty of time late into the night, crash into our own rooms to sleep, and then get back much earlier the next day.',
        options: ['Yes!', 'No']
    },
    {
        id: 'vibe',
        title: "Vibe Check",
        description: 'How are we feeling for dinner?',
        options: ['Mush', 'Guarded'],
    },
    {
        id: 'dinner',
        title: 'Dinner',
        description: 'It irks me that we have never had a proper dinner date. Can we fix this please? Read about Masque before you choose',
        getOptions: (history) => {
            let baseOptions = ['By the Mekong', 'Masque'];
            if (history['stay'] === 'Yes!' && history['vibe'] === 'Mush') {
                baseOptions.push('Private Candlelit table');
            }
            return baseOptions;
        }
    },
    {
        id: 'lounge',
        title: 'The Night is still Young',
        description: 'What should we do to wind down the night?',
        options: ['Marine Drive', 'Take me dancing', 'Find a cozy lounge'],
    },
    {
        id: 'long-night',
        title: 'The Long Night',
        description: 'Spending some quality time like when we find the time for it on the opposite sides of screens... but this time face to face.',
        options: ['Talk time', 'Music Time', 'Game Time']
    },
    {
        id: 'day-break',
        title: 'Day-Break',
        description: 'Good morning! Common, you know how we have talked about hitting the gym one day... here it is, at a top quality gym with views',
        options: ['Gym', 'Sleep-in']
    },
    {
        id: 'brekkie',
        title: 'Morning Chai',
        description: 'Time for the most important meal of the day.',
        options: ['The NutCracker', 'Malabar Hill Elevated Nature Trail']
    },
    {
        id: 'pick-a-place',
        title: 'Open Time',
        description: 'One last stop.',
        options: ['Siddhivinayak']
    },
    {
        id: 'final-lunch',
        title: 'The Last Stop',
        description: 'One final meal to wrap up an amazing time. If we decided to go to Sea Lounge y\'day, maybe d',
        options: ['Kerala Cafe', 'Burma Burma', 'Sardar']
    },
    {
        id: 'goodbye',
        title: 'Goodbye',
        description: 'What a wonderful time! Thank you.',
        options: ['Goodbye hugs'],
        isEnd: true
    },
    {
        id: 'goodnight',
        title: 'Goodnight',
        description: 'Thank you for the wonderful time. Can\'t wait to see you tomorrow!',
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

    // --- BUG FIX IS HERE ---
    // The check was changed from 'stageData.options' to 'stageData.getOptions'
    const options = typeof stageData.getOptions === 'function'
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

    const inputContainer = document.createElement('div');
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.id = 'user-input';
    inputField.placeholder = 'Instead, Dee suggests...';
    inputContainer.appendChild(inputField);

    inputField.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && inputField.value.trim() !== '') {
            handleSelection(stageData.id, inputField.value.trim());
        }
    });

    container.appendChild(inputContainer);

    if (pathHistory.length > 1) {
        const backButton = document.createElement('button');
        backButton.textContent = '← Previous Choice';
        backButton.className = 'back-button';
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
    } else if (stageId === 'dinner' && selectionHistory['stay'] === 'No') {
        nextIndex = itinerary.findIndex(stage => stage.id === 'goodnight');
    } else {
        nextIndex = currentIndex + 1;
    }

    if (nextIndex !== -1) {
        // Prevent adding duplicates to path history if user is just re-selecting
        if (pathHistory[pathHistory.length - 1] !== nextIndex) {
            pathHistory.push(nextIndex);
        }
        currentIndex = nextIndex;
    }

    updateItineraryList();
    renderCurrentStage();
}


function goBack() {
    if (pathHistory.length <= 1) return;

    pathHistory.pop(); // Remove the current stage from the path
    const previousStageIndex = pathHistory[pathHistory.length - 1];
    
    // Also remove the choice for the stage we are leaving
    const abandonedStageId = itinerary[currentIndex].id;
    delete selectionHistory[abandonedStageId];
    
    currentIndex = previousStageIndex;

    updateItineraryList();
    renderCurrentStage();
}


function updateItineraryList() {
    itineraryList.innerHTML = '<h3>HP and Dee\'s Day Out</h3>';

    // Use the pathHistory to build the list in the correct order
    const uniqueStageIndices = [...new Set(pathHistory)];

    uniqueStageIndices.forEach(stageIndex => {
        const stage = itinerary[stageIndex];
        if (stage) {
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
        itineraryList.innerHTML = '<h3>HP\'s vetted list. DN\'s writes-in or Click!</p>';
    }
}


function showFinalResult() {
    container.style.display = 'none'; // Hide the options container
    resultContainer.classList.remove('hidden'); // Show the results container
    
    finalChoiceText.innerHTML = "<h1>💜 Choices Complete 💜</h1><p>Here is the plan:</p>";
    const finalPlan = document.createElement('ul');

    // Use pathHistory to ensure the final list is in the correct order
    const finalPath = [...new Set(pathHistory.map(index => itinerary[index].id))];
    finalPath.forEach(stageId => {
        const stage = itinerary.find(s => s.id === stageId);
        const choice = selectionHistory[stageId];
        if (stage && choice && !stage.isEnd) { // Don't show the "goodbye" choice
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong>${stage.title}:</strong> ${choice}`;
            finalPlan.appendChild(listItem);
        }
    });

    finalChoiceText.appendChild(finalPlan);

  //  const resetButton = document.createElement('button');
  //  resetButton.textContent = 'Start Over';
   // resetButton.className = 'reset-button';
   // resetButton.onclick = resetPage;
  //  finalChoiceText.appendChild(resetButton);

    itineraryList.style.display = 'none';
}


function resetPage() {
    currentIndex = 0;
    selectionHistory = {};
    pathHistory = [0];
    
    finalChoiceText.innerHTML = '';
    resultContainer.classList.add('hidden');
    container.style.display = 'block';
    itineraryList.style.display = 'block';

    updateItineraryList();
    renderCurrentStage();
}

function addResetButton() {
    const resetButtonContainer = document.getElementById('reset-button-container');
    resetButtonContainer.innerHTML = ''; // Clear previous button if any
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Start Over';
    resetButton.className = 'reset-button';
    resetButton.onclick = resetPage;
    resetButtonContainer.appendChild(resetButton);
}

// Initial setup
renderCurrentStage();
updateItineraryList();
addResetButton();
