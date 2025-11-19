// Meta-Progression System

class MetaProgressionSystem {
    constructor() {
        this.storageKey = 'depths_of_eternity_meta';
        this.data = this.load();
    }

    load() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to load meta progression:', e);
        }

        return this.getDefaultData();
    }

    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        } catch (e) {
            console.error('Failed to save meta progression:', e);
        }
    }

    getDefaultData() {
        return {
            totalRuns: 0,
            totalDeaths: 0,
            totalVictories: 0,
            totalKills: 0,
            totalGold: 0,
            bestFloor: 0,
            bestTime: 0,
            unlockPoints: 0,

            // Class unlocks
            unlockedClasses: [],

            // Achievements
            achievements: [],

            // Bestiary
            discoveredEnemies: [],
            killedEnemies: {},

            // Item collection
            discoveredItems: [],

            // Starting bonuses
            startingBonuses: {
                hp: 0,
                mp: 0,
                gold: 0,
                attack: 0,
                defense: 0
            },

            // Daily challenge
            dailyBestScore: 0,
            lastDailyPlayed: null,

            // Stats per class
            classStats: {}
        };
    }

    getData() {
        return this.data;
    }

    // Record run completion
    recordRun(state, victory = false) {
        this.data.totalRuns++;

        if (victory) {
            this.data.totalVictories++;
        } else {
            this.data.totalDeaths++;
        }

        // Update best floor
        if (state.floor > this.data.bestFloor) {
            this.data.bestFloor = state.floor;
        }

        // Update totals
        this.data.totalKills += state.player.kills;
        this.data.totalGold += state.player.gold;

        // Calculate unlock points
        const points = this.calculateUnlockPoints(state);
        this.data.unlockPoints += points;

        // Record class stats
        const classId = state.player.classId;
        if (!this.data.classStats[classId]) {
            this.data.classStats[classId] = {
                runs: 0,
                victories: 0,
                bestFloor: 0,
                totalKills: 0
            };
        }
        const classStats = this.data.classStats[classId];
        classStats.runs++;
        if (victory) classStats.victories++;
        if (state.floor > classStats.bestFloor) classStats.bestFloor = state.floor;
        classStats.totalKills += state.player.kills;

        // Check achievements
        this.checkAchievements(state, victory);

        // Check class unlocks
        this.checkClassUnlocks();

        this.save();

        return points;
    }

    calculateUnlockPoints(state) {
        let points = 0;

        // Points for floors
        points += state.floor * GAME_CONSTANTS.UNLOCK_POINTS_PER_FLOOR;

        // Bonus for boss kills
        const bossKills = state.enemies.filter(e => e.boss && e.dead).length;
        points += bossKills * GAME_CONSTANTS.UNLOCK_POINTS_PER_BOSS;

        // Bonus for victory
        if (state.victory) {
            points *= 2;
        }

        return points;
    }

    // Class unlocks
    isClassUnlocked(classId) {
        const classData = CLASS_DATA[classId];
        if (classData.unlocked) return true;
        return this.data.unlockedClasses.includes(classId);
    }

    unlockClass(classId) {
        if (!this.data.unlockedClasses.includes(classId)) {
            this.data.unlockedClasses.push(classId);
            this.save();

            Events.emit(EVENTS.CLASS_UNLOCK, { classId });
            Events.emit(EVENTS.MESSAGE_ADD, {
                text: `${CLASS_DATA[classId].name} class unlocked!`,
                type: 'pickup'
            });

            return true;
        }
        return false;
    }

    checkClassUnlocks() {
        for (const [classId, classData] of Object.entries(CLASS_DATA)) {
            if (classData.unlocked || this.isClassUnlocked(classId)) continue;

            // Check unlock points
            if (classData.unlockPoints && this.data.unlockPoints >= classData.unlockPoints) {
                this.unlockClass(classId);
            }
        }
    }

    // Achievements
    hasAchievement(achievementId) {
        return this.data.achievements.includes(achievementId);
    }

    unlockAchievement(achievementId, name) {
        if (!this.hasAchievement(achievementId)) {
            this.data.achievements.push(achievementId);
            this.save();

            Events.emit(EVENTS.ACHIEVEMENT_UNLOCK, { id: achievementId, name });
            Events.emit(EVENTS.MESSAGE_ADD, {
                text: `Achievement unlocked: ${name}`,
                type: 'pickup'
            });
        }
    }

    checkAchievements(state, victory) {
        // First victory
        if (victory && !this.hasAchievement('first_victory')) {
            this.unlockAchievement('first_victory', 'First Victory');
        }

        // Floor achievements
        if (state.floor >= 10 && !this.hasAchievement('floor_10')) {
            this.unlockAchievement('floor_10', 'Deep Descent');
        }
        if (state.floor >= 25 && !this.hasAchievement('floor_25')) {
            this.unlockAchievement('floor_25', 'Depths Explorer');
        }
        if (state.floor >= 50 && !this.hasAchievement('floor_50')) {
            this.unlockAchievement('floor_50', 'Master Delver');
        }

        // Kill achievements
        if (this.data.totalKills >= 100 && !this.hasAchievement('kills_100')) {
            this.unlockAchievement('kills_100', 'Centurion');
        }
        if (this.data.totalKills >= 1000 && !this.hasAchievement('kills_1000')) {
            this.unlockAchievement('kills_1000', 'Mass Extinction');
        }

        // Gold achievements
        if (this.data.totalGold >= 10000 && !this.hasAchievement('gold_10000')) {
            this.unlockAchievement('gold_10000', 'Treasure Hunter');
        }

        // Class achievements
        if (victory) {
            const classId = state.player.classId;
            const achievementId = `victory_${classId}`;
            if (!this.hasAchievement(achievementId)) {
                this.unlockAchievement(achievementId, `${state.player.className} Master`);
            }
        }
    }

    // Bestiary
    discoverEnemy(enemyType) {
        if (!this.data.discoveredEnemies.includes(enemyType)) {
            this.data.discoveredEnemies.push(enemyType);
            this.save();
        }
    }

    recordEnemyKill(enemyType) {
        this.discoverEnemy(enemyType);
        this.data.killedEnemies[enemyType] = (this.data.killedEnemies[enemyType] || 0) + 1;
    }

    // Starting bonuses
    purchaseBonus(bonusType, cost) {
        if (this.data.unlockPoints < cost) return false;

        this.data.unlockPoints -= cost;
        this.data.startingBonuses[bonusType] = (this.data.startingBonuses[bonusType] || 0) + 1;
        this.save();

        return true;
    }

    getStartingBonuses() {
        return { ...this.data.startingBonuses };
    }

    // Reset (for debugging)
    reset() {
        this.data = this.getDefaultData();
        this.save();
    }
}

// Global meta progression
const MetaProgression = new MetaProgressionSystem();
