/**
 * Cozy RPG Slot Machine Blueprint - Core Game Loop & Immutable State
 * Zero let keywords, functional property mutations on constant state context.
 */

// RPG symbol configurations with probability weights to yield 26.17% win frequency
const SYMBOLS = [
    { id: 'gem', file: './images/gem.png', fallback: '💎', payout: 50, weight: 1 },
    { id: 'sword', file: './images/sword.png', fallback: '⚔️', payout: 30, weight: 2 },
    { id: 'shield', file: './images/shield.png', fallback: '🛡️', payout: 20, weight: 5 }
];

// Single state object wrapper for active tracking metrics
const gameState = {
    hearts: 10,
    coins: 0
};

// DOM actuator trigger selector
const handleBtn = document.getElementById('handle');

// Game status window selector
const message = document.getElementById('message');

// Heart metrics element selector
const heartsDisplay = document.getElementById('hearts-count');

// Score metrics element selector
const coinsDisplay = document.getElementById('coins-count');

// Cabinet outer chassis selector
const machine = document.getElementById('machine');

// List of all isolated reel elements
const reels = document.querySelectorAll('.reel');

// Get a random symbol based on probability weights
const getRandomSymbol = () => {
    const totalWeight = SYMBOLS.reduce((sum, s) => sum + s.weight, 0);
    const rand = Math.random() * totalWeight;
    return rand < SYMBOLS[0].weight ? SYMBOLS[0] : 
           (rand < SYMBOLS[0].weight + SYMBOLS[1].weight ? SYMBOLS[1] : SYMBOLS[2]);
};

// Assigns active symbol background image with fallback load check
const assignReelSymbol = (reelElement, symbolObj) => {
    const tester = new Image(); // Dynamic image loader element
    
    // Set background layout style on successful load
    tester.onload = () => {
        reelElement.style.backgroundImage = `url('${symbolObj.file}')`;
        reelElement.textContent = '';
        reelElement.classList.remove('image-error');
    };

    // Fall back to clean unicode text if load fails
    tester.onerror = () => {
        reelElement.style.backgroundImage = 'none';
        reelElement.textContent = symbolObj.fallback;
        reelElement.classList.add('image-error');
    };

    tester.src = symbolObj.file; // Trigger network request
};

// Controls rotational frames cycle, returning the resolved symbol object
const spinReelBox = (reelElement, duration) => {
    reelElement.classList.add('spinning'); // Apply motion blur styling

    return new Promise(resolve => {
        const startTime = Date.now(); // Record start time of loop
        const cycleSpeed = 80; // Operational speed interval

        // Rapid asset swapping interval loop
        const interval = setInterval(() => {
            const sym = getRandomSymbol(); // Get weighted symbol
            assignReelSymbol(reelElement, sym);

            // Resolve promise and clear timers on duration match
            if (Date.now() - startTime >= duration) {
                clearInterval(interval);
                reelElement.classList.remove('spinning');
                resolve(sym);
            }
        }, cycleSpeed);
    });
};

// Renders the numerical state object metrics to HUD elements
const syncPlayerHUD = () => {
    heartsDisplay.textContent = gameState.hearts;
    coinsDisplay.textContent = gameState.coins;

    // Toggle button layout text and prompts on death state
    if (gameState.hearts <= 0) {
        handleBtn.textContent = 'RESTART';
        message.textContent = 'GAME OVER! CLICK RESTART';
    } else {
        handleBtn.textContent = 'ROLL';
    }
};

// Automated rolling loop triggered by actuator
const startRoll = async () => {
    if (handleBtn.disabled) return; // Prevent overlapping clicks

    // Reset score parameters if hearts are depleted
    if (gameState.hearts <= 0) {
        gameState.hearts = 10;
        gameState.coins = 0;
        message.textContent = 'HERO REBORN! ROLL TO SPIN';
        machine.classList.remove('win-glow', 'loss-glow');
        syncPlayerHUD();
        return;
    }

    handleBtn.disabled = true; // Lock button access
    gameState.hearts -= 1; // Direct modification on const object property
    syncPlayerHUD(); // Refresh active metrics

    message.textContent = 'ROLLING...';
    machine.classList.remove('win-glow', 'loss-glow');

    // Parallel promise resolutions with staggered delays
    try {
        const results = await Promise.all([
            spinReelBox(reels[0], 1200),
            spinReelBox(reels[1], 1900),
            spinReelBox(reels[2], 2600)
        ]);

        handleBtn.disabled = false; // Unlock actuator button

        // Evaluate matching IDs across results array
        const isMatch = results[0].id === results[1].id && results[1].id === results[2].id;

        // Reward and update score on match
        if (isMatch) {
            const winSymbol = results[0];
            gameState.coins += winSymbol.payout;
            gameState.hearts += 1; // Increment life on victory
            
            message.textContent = `MATCHED ${winSymbol.id.toUpperCase()}S! +${winSymbol.payout} COINS, +1 HEART`;
            machine.classList.add('win-glow');
        } else {
            message.textContent = 'NO MATCH! KEEP EXPLORING';
            machine.classList.add('loss-glow');
        }

        handleBtn.disabled = false; // Ensure button unlocks
        syncPlayerHUD(); // Sync state to screen
    } catch (e) {
        console.error('Spin cycle error:', e);
        handleBtn.disabled = false;
    }
};

// Boot layout elements on screen load
reels.forEach(reel => assignReelSymbol(reel, SYMBOLS[0]));
syncPlayerHUD();

// Register primary roll listener
handleBtn.addEventListener('click', startRoll);