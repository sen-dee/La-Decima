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
