// Achievement Definitions

const ACHIEVEMENTS = {
    // ===== PROGRESSION ACHIEVEMENTS =====
    first_victory: {
        id: 'first_victory',
        name: 'First Victory',
        description: 'Complete the game for the first time',
        icon: '🏆',
        points: 100,
        secret: false
    },
    floor_10: {
        id: 'floor_10',
        name: 'Deep Descent',
        description: 'Reach floor 10',
        icon: '⬇️',
        points: 10,
        secret: false
    },
    floor_25: {
        id: 'floor_25',
        name: 'Depths Explorer',
        description: 'Reach floor 25',
        icon: '🕳️',
        points: 25,
        secret: false
    },
    floor_50: {
        id: 'floor_50',
        name: 'Master Delver',
        description: 'Reach the final floor',
        icon: '🌟',
        points: 50,
        secret: false
    },

    // ===== KILL ACHIEVEMENTS =====
    kills_100: {
        id: 'kills_100',
        name: 'Centurion',
        description: 'Kill 100 enemies total',
        icon: '⚔️',
        points: 10,
        secret: false
    },
    kills_1000: {
        id: 'kills_1000',
        name: 'Mass Extinction',
        description: 'Kill 1,000 enemies total',
        icon: '💀',
        points: 30,
        secret: false
    },
    kills_10000: {
        id: 'kills_10000',
        name: 'Genocide',
        description: 'Kill 10,000 enemies total',
        icon: '☠️',
        points: 100,
        secret: false
    },
    first_boss: {
        id: 'first_boss',
        name: 'Boss Slayer',
        description: 'Defeat your first boss',
        icon: '👑',
        points: 15,
        secret: false
    },
    all_bosses: {
        id: 'all_bosses',
        name: 'Champion',
        description: 'Defeat all bosses in a single run',
        icon: '🏅',
        points: 75,
        secret: false
    },
    kill_no_damage: {
        id: 'kill_no_damage',
        name: 'Flawless',
        description: 'Kill a boss without taking damage',
        icon: '✨',
        points: 50,
        secret: false
    },

    // ===== GOLD ACHIEVEMENTS =====
    gold_1000: {
        id: 'gold_1000',
        name: 'Copper Collector',
        description: 'Collect 1,000 gold total',
        icon: '🪙',
        points: 5,
        secret: false
    },
    gold_10000: {
        id: 'gold_10000',
        name: 'Treasure Hunter',
        description: 'Collect 10,000 gold total',
        icon: '💰',
        points: 20,
        secret: false
    },
    gold_100000: {
        id: 'gold_100000',
        name: 'Dragon Hoard',
        description: 'Collect 100,000 gold total',
        icon: '🐉',
        points: 50,
        secret: false
    },
    gold_single_1000: {
        id: 'gold_single_1000',
        name: 'Rich Run',
        description: 'Collect 1,000 gold in a single run',
        icon: '💎',
        points: 15,
        secret: false
    },

    // ===== CLASS MASTERY ACHIEVEMENTS =====
    victory_warrior: {
        id: 'victory_warrior',
        name: 'Warrior Master',
        description: 'Complete the game as a Warrior',
        icon: '🗡️',
        points: 25,
        secret: false
    },
    victory_mage: {
        id: 'victory_mage',
        name: 'Mage Master',
        description: 'Complete the game as a Mage',
        icon: '🔮',
        points: 25,
        secret: false
    },
    victory_rogue: {
        id: 'victory_rogue',
        name: 'Rogue Master',
        description: 'Complete the game as a Rogue',
        icon: '🗝️',
        points: 25,
        secret: false
    },
    victory_ranger: {
        id: 'victory_ranger',
        name: 'Ranger Master',
        description: 'Complete the game as a Ranger',
        icon: '🏹',
        points: 25,
        secret: false
    },
    victory_cleric: {
        id: 'victory_cleric',
        name: 'Cleric Master',
        description: 'Complete the game as a Cleric',
        icon: '✝️',
        points: 25,
        secret: false
    },
    victory_necromancer: {
        id: 'victory_necromancer',
        name: 'Necromancer Master',
        description: 'Complete the game as a Necromancer',
        icon: '💀',
        points: 25,
        secret: false
    },
    victory_monk: {
        id: 'victory_monk',
        name: 'Monk Master',
        description: 'Complete the game as a Monk',
        icon: '👊',
        points: 25,
        secret: false
    },
    victory_bard: {
        id: 'victory_bard',
        name: 'Bard Master',
        description: 'Complete the game as a Bard',
        icon: '🎵',
        points: 25,
        secret: false
    },
    all_classes: {
        id: 'all_classes',
        name: 'Versatile Hero',
        description: 'Win the game with all classes',
        icon: '🌈',
        points: 100,
        secret: false
    },

    // ===== ITEM ACHIEVEMENTS =====
    items_100: {
        id: 'items_100',
        name: 'Collector',
        description: 'Find 100 items total',
        icon: '📦',
        points: 10,
        secret: false
    },
    legendary_find: {
        id: 'legendary_find',
        name: 'Legendary Find',
        description: 'Find a legendary item',
        icon: '⭐',
        points: 20,
        secret: false
    },
    artifact_find: {
        id: 'artifact_find',
        name: 'Artifact Hunter',
        description: 'Find an artifact',
        icon: '🏛️',
        points: 50,
        secret: false
    },
    full_set: {
        id: 'full_set',
        name: 'Set Collector',
        description: 'Equip a complete item set',
        icon: '👔',
        points: 30,
        secret: false
    },
    identify_all: {
        id: 'identify_all',
        name: 'Loremaster',
        description: 'Identify 50 different items',
        icon: '📖',
        points: 25,
        secret: false
    },

    // ===== COMBAT ACHIEVEMENTS =====
    critical_streak: {
        id: 'critical_streak',
        name: 'Critical Master',
        description: 'Land 5 critical hits in a row',
        icon: '💥',
        points: 20,
        secret: false
    },
    dodger: {
        id: 'dodger',
        name: 'Untouchable',
        description: 'Dodge 10 attacks in a row',
        icon: '💨',
        points: 20,
        secret: false
    },
    overkill: {
        id: 'overkill',
        name: 'Overkill',
        description: 'Deal 100 damage in a single hit',
        icon: '💪',
        points: 25,
        secret: false
    },
    comeback: {
        id: 'comeback',
        name: 'Comeback King',
        description: 'Survive with 1 HP',
        icon: '❤️',
        points: 15,
        secret: false
    },
    pacifist_floor: {
        id: 'pacifist_floor',
        name: 'Pacifist',
        description: 'Complete a floor without killing anything',
        icon: '☮️',
        points: 30,
        secret: false
    },

    // ===== EXPLORATION ACHIEVEMENTS =====
    secret_finder: {
        id: 'secret_finder',
        name: 'Secret Seeker',
        description: 'Find 10 secret rooms',
        icon: '🔍',
        points: 15,
        secret: false
    },
    trap_survivor: {
        id: 'trap_survivor',
        name: 'Trap Expert',
        description: 'Trigger 50 traps and survive',
        icon: '⚠️',
        points: 20,
        secret: false
    },
    full_map: {
        id: 'full_map',
        name: 'Cartographer',
        description: 'Fully explore 10 floors',
        icon: '🗺️',
        points: 15,
        secret: false
    },
    biome_master: {
        id: 'biome_master',
        name: 'World Traveler',
        description: 'Visit all biomes',
        icon: '🌍',
        points: 25,
        secret: false
    },

    // ===== CHALLENGE ACHIEVEMENTS =====
    speed_run: {
        id: 'speed_run',
        name: 'Speed Demon',
        description: 'Complete the game in under 1000 turns',
        icon: '⚡',
        points: 75,
        secret: false
    },
    no_potion: {
        id: 'no_potion',
        name: 'Teetotaler',
        description: 'Win without using any potions',
        icon: '🚫',
        points: 50,
        secret: false
    },
    no_armor: {
        id: 'no_armor',
        name: 'Glass Cannon',
        description: 'Win without wearing armor',
        icon: '🔥',
        points: 50,
        secret: false
    },
    level_1: {
        id: 'level_1',
        name: 'Level 1 Challenge',
        description: 'Reach floor 10 at level 1',
        icon: '1️⃣',
        points: 100,
        secret: false
    },
    hardcore: {
        id: 'hardcore',
        name: 'Hardcore',
        description: 'Win on Hard mode',
        icon: '💀',
        points: 75,
        secret: false
    },

    // ===== MISC ACHIEVEMENTS =====
    runs_10: {
        id: 'runs_10',
        name: 'Persistent',
        description: 'Complete 10 runs',
        icon: '🔄',
        points: 10,
        secret: false
    },
    runs_100: {
        id: 'runs_100',
        name: 'Dedicated',
        description: 'Complete 100 runs',
        icon: '💯',
        points: 50,
        secret: false
    },
    deaths_100: {
        id: 'deaths_100',
        name: 'Experience is the Best Teacher',
        description: 'Die 100 times',
        icon: '📚',
        points: 20,
        secret: false
    },
    daily_complete: {
        id: 'daily_complete',
        name: 'Daily Challenger',
        description: 'Complete a daily challenge',
        icon: '📅',
        points: 15,
        secret: false
    },
    daily_streak: {
        id: 'daily_streak',
        name: 'Consistency',
        description: 'Complete 7 daily challenges in a row',
        icon: '🔥',
        points: 50,
        secret: false
    },

    // ===== SECRET ACHIEVEMENTS =====
    secret_death: {
        id: 'secret_death',
        name: 'Death Wisher',
        description: 'Die in an unusual way',
        icon: '❓',
        points: 10,
        secret: true
    },
    secret_npc: {
        id: 'secret_npc',
        name: 'Friend Finder',
        description: 'Find the hidden NPC',
        icon: '❓',
        points: 25,
        secret: true
    },
    secret_combo: {
        id: 'secret_combo',
        name: 'Combo Master',
        description: 'Perform a special item combination',
        icon: '❓',
        points: 30,
        secret: true
    },
    secret_room: {
        id: 'secret_room',
        name: 'Secret Keeper',
        description: 'Find the ultra-secret room',
        icon: '❓',
        points: 50,
        secret: true
    },
    secret_boss: {
        id: 'secret_boss',
        name: 'Hidden Boss',
        description: 'Defeat the secret boss',
        icon: '❓',
        points: 75,
        secret: true
    },
    secret_ending: {
        id: 'secret_ending',
        name: 'True Ending',
        description: 'Discover the true ending',
        icon: '❓',
        points: 100,
        secret: true
    }
};

// Achievement categories for display
const ACHIEVEMENT_CATEGORIES = {
    progression: {
        name: 'Progression',
        achievements: ['first_victory', 'floor_10', 'floor_25', 'floor_50']
    },
    combat: {
        name: 'Combat',
        achievements: ['kills_100', 'kills_1000', 'kills_10000', 'first_boss', 'all_bosses', 'kill_no_damage', 'critical_streak', 'dodger', 'overkill', 'comeback', 'pacifist_floor']
    },
    wealth: {
        name: 'Wealth',
        achievements: ['gold_1000', 'gold_10000', 'gold_100000', 'gold_single_1000']
    },
    classes: {
        name: 'Class Mastery',
        achievements: ['victory_warrior', 'victory_mage', 'victory_rogue', 'victory_ranger', 'victory_cleric', 'victory_necromancer', 'victory_monk', 'victory_bard', 'all_classes']
    },
    items: {
        name: 'Items',
        achievements: ['items_100', 'legendary_find', 'artifact_find', 'full_set', 'identify_all']
    },
    exploration: {
        name: 'Exploration',
        achievements: ['secret_finder', 'trap_survivor', 'full_map', 'biome_master']
    },
    challenges: {
        name: 'Challenges',
        achievements: ['speed_run', 'no_potion', 'no_armor', 'level_1', 'hardcore']
    },
    misc: {
        name: 'Miscellaneous',
        achievements: ['runs_10', 'runs_100', 'deaths_100', 'daily_complete', 'daily_streak']
    },
    secrets: {
        name: 'Secrets',
        achievements: ['secret_death', 'secret_npc', 'secret_combo', 'secret_room', 'secret_boss', 'secret_ending']
    }
};

// Helper function to check achievement requirements
function checkAchievementRequirement(achievementId, state, metaData) {
    switch (achievementId) {
        // Kill achievements
        case 'kills_100':
            return metaData.totalKills >= 100;
        case 'kills_1000':
            return metaData.totalKills >= 1000;
        case 'kills_10000':
            return metaData.totalKills >= 10000;

        // Gold achievements
        case 'gold_1000':
            return metaData.totalGold >= 1000;
        case 'gold_10000':
            return metaData.totalGold >= 10000;
        case 'gold_100000':
            return metaData.totalGold >= 100000;
        case 'gold_single_1000':
            return state && state.player.gold >= 1000;

        // Floor achievements
        case 'floor_10':
            return metaData.bestFloor >= 10;
        case 'floor_25':
            return metaData.bestFloor >= 25;
        case 'floor_50':
            return metaData.bestFloor >= 50;

        // Run achievements
        case 'runs_10':
            return metaData.totalRuns >= 10;
        case 'runs_100':
            return metaData.totalRuns >= 100;
        case 'deaths_100':
            return metaData.totalDeaths >= 100;

        // Class victories
        case 'all_classes':
            const classes = ['warrior', 'mage', 'rogue', 'ranger', 'cleric', 'necromancer', 'monk', 'bard'];
            return classes.every(c => metaData.achievements.includes(`victory_${c}`));

        // Item achievements
        case 'items_100':
            return metaData.discoveredItems && metaData.discoveredItems.length >= 100;

        // Exploration
        case 'biome_master':
            const biomes = ['crypt', 'fire', 'ice', 'ruins', 'crystal', 'library', 'flooded', 'temple', 'mechanical', 'void'];
            return biomes.every(b => metaData.visitedBiomes && metaData.visitedBiomes.includes(b));

        default:
            return false;
    }
}

// Get total achievement points earned
function getTotalAchievementPoints(unlockedAchievements) {
    return unlockedAchievements.reduce((total, achId) => {
        const achievement = ACHIEVEMENTS[achId];
        return total + (achievement ? achievement.points : 0);
    }, 0);
}

// Get achievement progress percentage
function getAchievementProgress(unlockedAchievements) {
    const total = Object.keys(ACHIEVEMENTS).length;
    const unlocked = unlockedAchievements.length;
    return Math.floor((unlocked / total) * 100);
}
