// Menu System

class MenuManager {
    constructor() {
        this.currentScreen = 'main-menu';
        this.selectedClass = null;
    }

    init() {
        this.setupMainMenu();
        this.setupClassSelection();
        this.setupDeathScreen();
        this.updateMetaStats();
    }

    setupMainMenu() {
        document.getElementById('btn-new-game')?.addEventListener('click', () => {
            this.showScreen('class-selection');
            this.populateClassList();
        });

        document.getElementById('btn-continue')?.addEventListener('click', () => {
            if (SaveSystem.hasSave()) {
                Game.loadGame();
            }
        });

        document.getElementById('btn-daily-challenge')?.addEventListener('click', () => {
            Game.startDailyChallenge();
        });

        document.getElementById('btn-endless-mode')?.addEventListener('click', () => {
            this.showScreen('class-selection');
            this.populateClassList();
            Game.mode = GAME_MODES.ENDLESS;
        });

        // Update continue button
        const continueBtn = document.getElementById('btn-continue');
        if (continueBtn) {
            continueBtn.disabled = !SaveSystem.hasSave();
        }
    }

    setupClassSelection() {
        document.getElementById('btn-start-run')?.addEventListener('click', () => {
            if (this.selectedClass) {
                Game.startNewGame(this.selectedClass);
            }
        });

        document.getElementById('btn-back-to-menu')?.addEventListener('click', () => {
            this.showScreen('main-menu');
        });
    }

    setupDeathScreen() {
        document.getElementById('btn-try-again')?.addEventListener('click', () => {
            this.showScreen('class-selection');
            this.populateClassList();
        });

        document.getElementById('btn-return-menu')?.addEventListener('click', () => {
            this.showScreen('main-menu');
            this.updateMetaStats();
        });
    }

    showScreen(screenId) {
        document.querySelectorAll('.menu-screen, #game-screen').forEach(screen => {
            screen.classList.add('hidden');
        });

        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.remove('hidden');
        }

        this.currentScreen = screenId;
    }

    populateClassList() {
        const classList = document.getElementById('class-list');
        if (!classList) return;

        classList.innerHTML = '';

        for (const [id, classData] of Object.entries(CLASS_DATA)) {
            const option = document.createElement('div');
            option.className = 'class-option';
            option.dataset.classId = id;

            const unlocked = classData.unlocked || MetaProgression.isClassUnlocked(id);
            if (!unlocked) {
                option.classList.add('locked');
            }

            option.innerHTML = `
                <div class="class-icon" style="color: ${classData.color}">${classData.icon}</div>
                <div>${classData.name}</div>
                ${!unlocked ? '<div style="font-size: 0.7em; color: #888">Locked</div>' : ''}
            `;

            option.addEventListener('click', () => {
                if (unlocked) {
                    this.selectClass(id);
                }
            });

            classList.appendChild(option);
        }
    }

    selectClass(classId) {
        const classData = CLASS_DATA[classId];
        if (!classData) return;

        this.selectedClass = classId;

        // Update selection UI
        document.querySelectorAll('.class-option').forEach(opt => {
            opt.classList.toggle('selected', opt.dataset.classId === classId);
        });

        // Update details
        document.getElementById('class-name').textContent = classData.name;
        document.getElementById('class-description').textContent = classData.description;

        const statsEl = document.getElementById('class-stats');
        if (statsEl) {
            statsEl.innerHTML = `
                <div>STR: ${classData.baseStats.str}</div>
                <div>DEX: ${classData.baseStats.dex}</div>
                <div>INT: ${classData.baseStats.int}</div>
                <div>CON: ${classData.baseStats.con}</div>
                <div>WIS: ${classData.baseStats.wis}</div>
                <div>CHA: ${classData.baseStats.cha}</div>
            `;
        }

        const abilitiesEl = document.getElementById('class-abilities');
        if (abilitiesEl) {
            abilitiesEl.innerHTML = `
                <div>Playstyle: ${classData.playstyle}</div>
                <div>Difficulty: ${classData.difficulty}</div>
                ${classData.special ? `<div style="color: #ffd700">${classData.special}</div>` : ''}
            `;
        }

        document.getElementById('btn-start-run').disabled = false;
    }

    showDeathScreen(stats) {
        this.showScreen('death-screen');

        document.getElementById('death-floor').textContent = stats.floor;
        document.getElementById('death-level').textContent = stats.level;
        document.getElementById('death-gold').textContent = stats.gold;
        document.getElementById('death-kills').textContent = stats.kills;
        document.getElementById('death-cause').textContent = stats.cause || 'Unknown';

        // Show unlocks earned
        const unlocksEl = document.getElementById('unlocks-earned');
        if (unlocksEl && stats.unlocks && stats.unlocks.length > 0) {
            unlocksEl.innerHTML = '<h3>Unlocks Earned:</h3>' +
                stats.unlocks.map(u => `<div>${u}</div>`).join('');
        }
    }

    showVictoryScreen(stats) {
        this.showScreen('victory-screen');

        const statsEl = document.getElementById('victory-stats');
        if (statsEl) {
            statsEl.innerHTML = `
                <p>Class: ${stats.className}</p>
                <p>Level: ${stats.level}</p>
                <p>Gold Collected: ${stats.gold}</p>
                <p>Enemies Slain: ${stats.kills}</p>
                <p>Time: ${formatTime(stats.time)}</p>
            `;
        }
    }

    updateMetaStats() {
        const meta = MetaProgression.getData();

        const totalRuns = document.getElementById('total-runs');
        const bestDepth = document.getElementById('best-depth');
        const classesUnlocked = document.getElementById('classes-unlocked');

        if (totalRuns) totalRuns.textContent = meta.totalRuns || 0;
        if (bestDepth) bestDepth.textContent = meta.bestFloor || 0;

        const unlocked = Object.keys(CLASS_DATA).filter(id =>
            CLASS_DATA[id].unlocked || MetaProgression.isClassUnlocked(id)
        ).length;
        if (classesUnlocked) classesUnlocked.textContent = `${unlocked}/8`;
    }
}

// Global menu manager
const Menus = new MenuManager();
