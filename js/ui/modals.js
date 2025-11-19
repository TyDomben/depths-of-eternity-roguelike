// Modal System

class ModalManager {
    constructor() {
        this.overlay = null;
        this.content = null;
        this.isOpen = false;
    }

    init() {
        this.overlay = document.getElementById('modal-overlay');
        this.content = document.getElementById('modal-body');

        document.getElementById('modal-close')?.addEventListener('click', () => this.close());
        this.overlay?.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.close();
        });

        Events.on(EVENTS.PLAYER_LEVELUP, (data) => this.showLevelUp(data));
    }

    open(content) {
        if (!this.overlay || !this.content) return;

        this.content.innerHTML = content;
        this.overlay.classList.remove('hidden');
        this.isOpen = true;
        Input.disable();
    }

    close() {
        if (!this.overlay) return;

        this.overlay.classList.add('hidden');
        this.isOpen = false;
        Input.enable();
    }

    showLevelUp(data) {
        const player = data.player;
        const level = data.level;

        const statChoices = LEVEL_UP_CHOICES[player.classId] || LEVEL_UP_CHOICES.warrior;

        let html = `
            <h2 style="color: #ffd700; text-align: center;">Level ${level}!</h2>
            <p style="text-align: center;">Choose a stat bonus:</p>
            <div id="levelup-choices" style="display: flex; flex-direction: column; gap: 0.5rem; margin: 1rem 0;">
        `;

        statChoices.forEach((choice, i) => {
            html += `
                <button class="levelup-choice" data-index="${i}" style="
                    padding: 0.8rem;
                    background: #1a1a2e;
                    border: 2px solid #3a3a5e;
                    color: #e0e0e0;
                    cursor: pointer;
                    font-family: inherit;
                ">${choice.name}</button>
            `;
        });

        html += '</div>';

        // Available skill points
        const skillTree = SKILL_TREES[player.skillTree];
        if (skillTree) {
            html += `
                <p style="text-align: center; margin-top: 1rem;">Choose a skill to learn/upgrade:</p>
                <div id="skill-choices" style="display: flex; flex-direction: column; gap: 0.5rem; max-height: 200px; overflow-y: auto;">
            `;

            for (const [skillId, skill] of Object.entries(skillTree)) {
                const currentRank = player.skills[skillId] || 0;
                if (currentRank >= skill.maxRank) continue;

                // Check requirements
                let canLearn = true;
                if (skill.requires && typeof skill.requires === 'object') {
                    for (const [reqSkill, reqRank] of Object.entries(skill.requires)) {
                        if ((player.skills[reqSkill] || 0) < reqRank) {
                            canLearn = false;
                            break;
                        }
                    }
                }

                if (!canLearn) continue;

                html += `
                    <button class="skill-choice" data-skill="${skillId}" style="
                        padding: 0.8rem;
                        background: #1a1a2e;
                        border: 2px solid #3a3a5e;
                        color: #e0e0e0;
                        cursor: pointer;
                        font-family: inherit;
                        text-align: left;
                    ">
                        <strong>${skill.name}</strong> (${currentRank}/${skill.maxRank})<br>
                        <small style="color: #888">${skill.description}</small>
                    </button>
                `;
            }

            html += '</div>';
        }

        this.open(html);

        // Event listeners for choices
        document.querySelectorAll('.levelup-choice').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                const choice = statChoices[index];
                this.applyStatChoice(player, choice);

                // Highlight selection
                document.querySelectorAll('.levelup-choice').forEach(b => {
                    b.style.borderColor = '#3a3a5e';
                });
                btn.style.borderColor = '#ffd700';
            });
        });

        document.querySelectorAll('.skill-choice').forEach(btn => {
            btn.addEventListener('click', () => {
                const skillId = btn.dataset.skill;
                player.learnSkill(skillId);
                this.close();
                Events.emit(EVENTS.UI_UPDATE, {});
            });
        });
    }

    applyStatChoice(player, choice) {
        if (choice.stat === 'all') {
            player.stats.str += choice.value;
            player.stats.dex += choice.value;
            player.stats.int += choice.value;
            player.stats.con += choice.value;
            player.stats.wis += choice.value;
            player.stats.cha += choice.value;
        } else if (choice.stat === 'maxHp') {
            player.maxHp += choice.value;
            player.hp += choice.value;
        } else if (choice.stat === 'maxMp') {
            player.maxMp += choice.value;
            player.mp += choice.value;
        } else if (choice.stat === 'crit') {
            player.critChance += choice.value;
        } else if (choice.stat === 'dodge') {
            player.dodge += choice.value;
        } else if (player.stats[choice.stat] !== undefined) {
            player.stats[choice.stat] += choice.value;
        }

        player.recalculateStats();
    }

    showCharacterSheet() {
        const player = Game.state?.player;
        if (!player) return;

        const html = `
            <h2 style="color: #ffd700;">${player.className} - Level ${player.level}</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div>
                    <h3>Stats</h3>
                    <div>Strength: ${player.stats.str}</div>
                    <div>Dexterity: ${player.stats.dex}</div>
                    <div>Intelligence: ${player.stats.int}</div>
                    <div>Constitution: ${player.stats.con}</div>
                    <div>Wisdom: ${player.stats.wis}</div>
                    <div>Charisma: ${player.stats.cha}</div>
                </div>
                <div>
                    <h3>Combat</h3>
                    <div>Attack: ${player.getAttackDamage()}</div>
                    <div>Defense: ${player.getDefense()}</div>
                    <div>Speed: ${player.speed}</div>
                    <div>Crit Chance: ${Math.floor(player.critChance * 100)}%</div>
                    <div>Dodge: ${Math.floor(player.dodge * 100)}%</div>
                </div>
            </div>
            <div style="margin-top: 1rem;">
                <h3>Progress</h3>
                <div>XP: ${player.xp}/${player.xpToNext}</div>
                <div>Gold: ${player.gold}</div>
                <div>Kills: ${player.kills}</div>
                <div>Floors Cleared: ${player.floorsCleared}</div>
            </div>
        `;

        this.open(html);
    }

    showHelp() {
        const html = `
            <h2 style="color: #ffd700;">How to Play</h2>
            <h3>Movement</h3>
            <p>Use numpad, WASD + QEZC, arrow keys, or vi keys (hjklyubn)</p>
            <h3>Actions</h3>
            <div>. - Wait</div>
            <div>g - Pick up item</div>
            <div>i - Inventory</div>
            <div>c - Character sheet</div>
            <div>x - Examine</div>
            <div>s - Search for secrets</div>
            <div>r - Rest</div>
            <div>> - Descend stairs</div>
            <div>1-0 - Use hotbar items</div>
            <h3>Tips</h3>
            <p>- Manage your hunger by eating food</p>
            <p>- Identify items at altars or with scrolls</p>
            <p>- Backstab enemies for bonus damage</p>
            <p>- Rest to recover HP/MP between fights</p>
        `;

        this.open(html);
    }
}

// Global modal manager
const Modals = new ModalManager();
