// Seeded Random Number Generator (Mulberry32)
class RNG {
    constructor(seed = null) {
        this.seed = seed || Date.now();
        this.initialSeed = this.seed;
    }

    // Core random function (Mulberry32)
    next() {
        let t = this.seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }

    // Random float between min and max
    float(min = 0, max = 1) {
        return min + this.next() * (max - min);
    }

    // Random integer between min and max (inclusive)
    int(min, max) {
        return Math.floor(this.float(min, max + 1));
    }

    // Random boolean with probability
    bool(probability = 0.5) {
        return this.next() < probability;
    }

    // Pick random element from array
    pick(array) {
        if (!array || array.length === 0) return null;
        return array[this.int(0, array.length - 1)];
    }

    // Pick multiple random elements from array (no duplicates)
    pickMultiple(array, count) {
        if (!array || array.length === 0) return [];
        const copy = [...array];
        const result = [];
        count = Math.min(count, copy.length);
        for (let i = 0; i < count; i++) {
            const idx = this.int(0, copy.length - 1);
            result.push(copy.splice(idx, 1)[0]);
        }
        return result;
    }

    // Shuffle array in place
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = this.int(0, i);
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Weighted random selection
    weighted(items, weights) {
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let random = this.float(0, totalWeight);
        for (let i = 0; i < items.length; i++) {
            random -= weights[i];
            if (random <= 0) return items[i];
        }
        return items[items.length - 1];
    }

    // Pick from object with weight property
    weightedPick(items) {
        const weights = items.map(item => item.weight || 1);
        return this.weighted(items, weights);
    }

    // Gaussian/normal distribution
    gaussian(mean = 0, stdDev = 1) {
        const u1 = this.next();
        const u2 = this.next();
        const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        return z0 * stdDev + mean;
    }

    // Roll dice (e.g., "2d6+3")
    dice(notation) {
        const match = notation.match(/(\d+)?d(\d+)([+-]\d+)?/i);
        if (!match) return 0;
        const count = parseInt(match[1]) || 1;
        const sides = parseInt(match[2]);
        const modifier = parseInt(match[3]) || 0;
        let total = modifier;
        for (let i = 0; i < count; i++) {
            total += this.int(1, sides);
        }
        return total;
    }

    // Reset to initial seed
    reset() {
        this.seed = this.initialSeed;
    }

    // Get current state for saving
    getState() {
        return {
            seed: this.seed,
            initialSeed: this.initialSeed
        };
    }

    // Restore state
    setState(state) {
        this.seed = state.seed;
        this.initialSeed = state.initialSeed;
    }
}

// Global RNG instance
let gameRNG = new RNG();

// Helper functions
function randomInt(min, max) {
    return gameRNG.int(min, max);
}

function randomFloat(min = 0, max = 1) {
    return gameRNG.float(min, max);
}

function randomBool(probability = 0.5) {
    return gameRNG.bool(probability);
}

function randomPick(array) {
    return gameRNG.pick(array);
}

function randomShuffle(array) {
    return gameRNG.shuffle([...array]);
}

function rollDice(notation) {
    return gameRNG.dice(notation);
}

// Generate daily seed based on date
function getDailySeed() {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
        const char = dateStr.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}
