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
        options: ['CSMT Heritage Tour (4PM)', 'Kitab Khana + Colaba Stroll'],
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
        description: 'I know how you feel about this, but I still want you to give it a thought. You will have your own separate room at St. Regis which hopefully puts you at ease. This maximizes the time we have together, without a late night commute. We will have plenty of time late into the night at the lounges here or in the mall, crash into our own rooms to sleep, and then meetup much earlier tomorrow.',
        options: ['🐶Yes🐶', 'No']
    },
    {
        id: 'dinner',
        title: 'Dinner',
        description: 'It irks me that we have never had a proper dinner date. Can we fix this please? Read about Masque before you choose',
        getOptions: (history) => {
            let baseOptions = ['By the Mekong', 'Masque'];
            if (history['stay'] === '🐶Yes🐶') {
                baseOptions.push('Private Candlelit table');
            }
            return baseOptions;
        }
    },
    {
        id: 'lounge',
        title: 'The Night is still Young',
        description: 'What should we do to wind down the night?',
        options: ['Marine Drive', 'Go dancing', 'Find a place to lounge'],
    },
    {
        id: 'long-night',
        title: 'The Long Night',
        description: 'Making some quality HP and Dee time in the same timezone face to face for once, instead of opposite sides of a phone.',
        options: ['Talk/Music/Game time']
    },
    {
        id: 'day-break',
        title: 'Day-Break',
        description: 'Good morning Dee! We\'ve talked about hitting the gym together one day... let\'s do this.',
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
        description: 'One final meal to wrap up an amazing time. If we decided to go to Sea Lounge y\'day, we should go to Burma today',
        options: ['Kerala Cafe', 'Burma Burma', 'Sardar'],
        isEnd: true
    },
    {
        id: 'goodnight',
        title: 'Goodnight',
        description: 'Can\'t wait to see you tomorrow!',
        options: [], 
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

    const options = typeof stageData.getOptions === 'function'
        ? stageData.getOptions(selectionHistory)
        : stageData.options;

    if (options && options.length > 0) {
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
    }

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

    const currentStageData = itinerary.find(stage => stage.id === stageId);

    if (currentStageData.isEnd) {
        showFinalResult();
        updateItineraryList();
        return;
    }

    let nextIndex;

    if (stageId === 'stay') {
        if (choiceText === 'No') {
            nextIndex = itinerary.findIndex(stage => stage.id === 'goodnight');
        } else {
            // MODIFICATION: Popup added here for the 'Yes' path.
            alert("thanks, it means so much");
            nextIndex = currentIndex + 1;
        }
    } else if (typeof choice === 'object' && choice.nextStageId) {
        nextIndex = itinerary.findIndex(stage => stage.id === choice.nextStageId);
    } else {
        nextIndex = currentIndex + 1;
    }


    if (nextIndex !== -1) {
        if (pathHistory[pathHistory.length - 1] !== currentIndex) {
             pathHistory.push(currentIndex);
        }
        currentIndex = nextIndex;
    }

    updateItineraryList();
    renderCurrentStage();
}


function goBack() {
    if (pathHistory.length <= 1) return;

    const currentStageId = itinerary[currentIndex].id;
    delete selectionHistory[currentStageId];

    pathHistory.pop();
    currentIndex = pathHistory[pathHistory.length - 1];
    
    const newCurrentStageId = itinerary[currentIndex].id;
    delete selectionHistory[newCurrentStageId];

    updateItineraryList();
    renderCurrentStage();
}


function updateItineraryList() {
    itineraryList.innerHTML = '<h3>HP and Dee\'s Day Out</h3>';

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
        itineraryList.innerHTML = '<h3>My ideas for our day. Add your magic touch</h3>';
    }
}


function showFinalResult() {
    container.style.display = 'none';
    resultContainer.classList.remove('hidden');
    
    finalChoiceText.innerHTML = "<h1>💜 Choices Complete 💜</h1><p>Here is our day:</p>";
    const finalPlan = document.createElement('ul');
    
    for (const stageId in selectionHistory) {
        const stage = itinerary.find(s => s.id === stageId);
        const choice = selectionHistory[stageId];
        if (stage && choice && !stage.isEnd) {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong>${stage.title}:</strong> ${choice}`;
            finalPlan.appendChild(listItem);
        }
    }

    finalChoiceText.appendChild(finalPlan);
    itineraryList.style.display = 'none';
}


function resetPage() {
    currentIndex = 0;
    selectionHistory = {};
    pathHistory = [0];
    
    resultContainer.classList.add('hidden');
    container.style.display = 'block';
    itineraryList.style.display = 'block';

    updateItineraryList();
    renderCurrentStage();
}

function addResetButton() {
    const resetButtonContainer = document.getElementById('reset-button-container');
    if (resetButtonContainer) {
        resetButtonContainer.innerHTML = '';
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Start Over';
        resetButton.className = 'reset-button';
        resetButton.onclick = resetPage;
        resetButtonContainer.appendChild(resetButton);
    }
}

// --- Initial Setup ---
renderCurrentStage();
updateItineraryList();
addResetButton();
