// UI System - Handles all user interface updates

class UIManager {
    constructor() {
        this.elements = {};
        this.tooltip = null;
        this.contextMenu = null;
    }

    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.setupTabs();
    }

    cacheElements() {
        this.elements = {
            // Stats
            healthFill: document.getElementById('health-fill'),
            healthText: document.getElementById('health-text'),
            manaFill: document.getElementById('mana-fill'),
            manaText: document.getElementById('mana-text'),
            hungerFill: document.getElementById('hunger-fill'),
            hungerText: document.getElementById('hunger-text'),
            xpFill: document.getElementById('xp-fill'),

            // Info
            playerClass: document.getElementById('player-class'),
            playerLevel: document.getElementById('player-level'),
            currentFloor: document.getElementById('current-floor'),
            currentBiome: document.getElementById('current-biome'),
            turnCounter: document.getElementById('turn-counter'),

            // Stats
            statStr: document.getElementById('stat-str'),
            statDex: document.getElementById('stat-dex'),
            statInt: document.getElementById('stat-int'),
            statCon: document.getElementById('stat-con'),
            statWis: document.getElementById('stat-wis'),
            statCha: document.getElementById('stat-cha'),
            statAtk: document.getElementById('stat-atk'),
            statDef: document.getElementById('stat-def'),
            statSpd: document.getElementById('stat-spd'),

            // Panels
            statusEffects: document.getElementById('status-effects'),
            inventoryGrid: document.getElementById('inventory-grid'),
            inventoryWeight: document.getElementById('inventory-weight'),
            equipmentSlots: document.getElementById('equipment-slots'),
            skillList: document.getElementById('skill-list'),
            messages: document.getElementById('messages'),
            hotbar: document.getElementById('hotbar'),

            // Tooltip
            tooltip: document.getElementById('tooltip'),
            contextMenu: document.getElementById('context-menu')
        };
    }

    setupEventListeners() {
        Events.on(EVENTS.UI_UPDATE, () => this.update());
        Events.on(EVENTS.MESSAGE_ADD, (data) => this.addMessage(data.text, data.type));
        Events.on(EVENTS.INVENTORY_CHANGE, () => this.updateInventory());

        // Tooltip events
        document.addEventListener('mouseover', (e) => this.handleMouseOver(e));
        document.addEventListener('mouseout', () => this.hideTooltip());
    }

    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                this.switchTab(tab);
            });
        });
    }

    switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('hidden', content.id !== `${tabName}-tab`);
        });
    }

    update() {
        const state = Game.state;
        if (!state || !state.player) return;

        const player = state.player;

        // Update bars
        this.updateBar(this.elements.healthFill, this.elements.healthText, player.hp, player.maxHp);
        this.updateBar(this.elements.manaFill, this.elements.manaText, Math.floor(player.mp), player.maxMp);
        this.updateBar(this.elements.hungerFill, this.elements.hungerText, Math.floor(player.hunger), player.maxHunger);

        // XP bar
        if (this.elements.xpFill) {
            const xpPercent = (player.xp / player.xpToNext) * 100;
            this.elements.xpFill.style.width = `${xpPercent}%`;
        }

        // Info
        if (this.elements.playerClass) this.elements.playerClass.textContent = player.className;
        if (this.elements.playerLevel) this.elements.playerLevel.textContent = `Lv. ${player.level}`;
        if (this.elements.currentFloor) this.elements.currentFloor.textContent = `Floor ${state.floor}`;
        if (this.elements.currentBiome) {
            const biome = getBiomeForFloor(state.floor);
            this.elements.currentBiome.textContent = biome.name;
        }
        if (this.elements.turnCounter) this.elements.turnCounter.textContent = `Turn: ${state.turn}`;

        // Stats
        if (this.elements.statStr) this.elements.statStr.textContent = player.stats.str;
        if (this.elements.statDex) this.elements.statDex.textContent = player.stats.dex;
        if (this.elements.statInt) this.elements.statInt.textContent = player.stats.int;
        if (this.elements.statCon) this.elements.statCon.textContent = player.stats.con;
        if (this.elements.statWis) this.elements.statWis.textContent = player.stats.wis;
        if (this.elements.statCha) this.elements.statCha.textContent = player.stats.cha;
        if (this.elements.statAtk) this.elements.statAtk.textContent = player.getAttackDamage();
        if (this.elements.statDef) this.elements.statDef.textContent = player.getDefense();
        if (this.elements.statSpd) this.elements.statSpd.textContent = player.speed;

        // Status effects
        this.updateStatusEffects(player);

        // Inventory
        this.updateInventory();

        // Equipment
        this.updateEquipment();

        // Skills
        this.updateSkills();
    }

    updateBar(fillEl, textEl, current, max) {
        if (fillEl) {
            const percent = (current / max) * 100;
            fillEl.style.width = `${percent}%`;
        }
        if (textEl) {
            textEl.textContent = `${current}/${max}`;
        }
    }

    updateStatusEffects(player) {
        if (!this.elements.statusEffects) return;

        this.elements.statusEffects.innerHTML = '';
        const effects = StatusEffects.getActiveEffects(player);

        for (const effect of effects) {
            const icon = document.createElement('div');
            icon.className = 'status-icon';
            icon.style.color = effect.color;
            icon.textContent = effect.icon;
            icon.title = `${effect.name} (${effect.duration} turns)`;
            this.elements.statusEffects.appendChild(icon);
        }
    }

    updateInventory() {
        if (!this.elements.inventoryGrid) return;
        const player = Game.state?.player;
        if (!player) return;

        this.elements.inventoryGrid.innerHTML = '';

        // Create inventory slots
        for (let i = 0; i < GAME_CONSTANTS.INVENTORY_SIZE; i++) {
            const slot = document.createElement('div');
            slot.className = 'inventory-slot';
            slot.dataset.index = i;

            const item = player.inventory[i];
            if (item) {
                slot.textContent = item.char || '?';
                slot.style.color = RARITIES[item.rarity]?.color || '#ffffff';

                if (item.count > 1) {
                    const count = document.createElement('span');
                    count.className = 'item-count';
                    count.textContent = item.count;
                    slot.appendChild(count);
                }

                slot.addEventListener('click', () => this.onInventoryClick(i));
                slot.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.showItemContextMenu(e, item, i);
                });
            }

            this.elements.inventoryGrid.appendChild(slot);
        }

        // Update weight
        if (this.elements.inventoryWeight) {
            const weight = Inventory.calculateWeight(player.inventory);
            this.elements.inventoryWeight.textContent = `Weight: ${weight}/${GAME_CONSTANTS.MAX_WEIGHT}`;
        }
    }

    updateEquipment() {
        const player = Game.state?.player;
        if (!player) return;

        for (const slot of EQUIP_SLOTS) {
            const el = document.querySelector(`.equip-slot[data-slot="${slot}"]`);
            if (!el) continue;

            const item = player.equipment[slot];
            if (item) {
                el.textContent = item.name;
                el.style.color = RARITIES[item.rarity]?.color || '#ffffff';
                el.classList.add('equipped');
            } else {
                el.textContent = slot.charAt(0).toUpperCase() + slot.slice(1);
                el.style.color = '';
                el.classList.remove('equipped');
            }
        }
    }

    updateSkills() {
        if (!this.elements.skillList) return;
        const player = Game.state?.player;
        if (!player) return;

        this.elements.skillList.innerHTML = '';
        const skillTree = SKILL_TREES[player.skillTree];
        if (!skillTree) return;

        for (const [skillId, skill] of Object.entries(skillTree)) {
            const rank = player.skills[skillId] || 0;
            if (rank === 0) continue;

            const skillEl = document.createElement('div');
            skillEl.className = 'skill-item';

            const cooldown = player.cooldowns.get(skillId) || 0;
            if (cooldown > 0) {
                skillEl.classList.add('on-cooldown');
            }

            skillEl.innerHTML = `
                <strong>${skill.name}</strong> (${rank}/${skill.maxRank})
                ${cooldown > 0 ? `<br><small>CD: ${cooldown}</small>` : ''}
            `;

            skillEl.addEventListener('click', () => {
                Events.emit('skill:select', { skillId });
            });

            this.elements.skillList.appendChild(skillEl);
        }
    }

    addMessage(text, type = 'info') {
        if (!this.elements.messages) return;

        const msg = document.createElement('div');
        msg.className = `message ${type}`;
        msg.textContent = text;

        this.elements.messages.appendChild(msg);
        this.elements.messages.scrollTop = this.elements.messages.scrollHeight;

        // Limit messages
        while (this.elements.messages.children.length > 100) {
            this.elements.messages.removeChild(this.elements.messages.firstChild);
        }
    }

    showTooltip(content, x, y) {
        if (!this.elements.tooltip) return;

        this.elements.tooltip.innerHTML = content;
        this.elements.tooltip.classList.remove('hidden');

        // Position tooltip
        const rect = this.elements.tooltip.getBoundingClientRect();
        let posX = x + 10;
        let posY = y + 10;

        if (posX + rect.width > window.innerWidth) {
            posX = x - rect.width - 10;
        }
        if (posY + rect.height > window.innerHeight) {
            posY = y - rect.height - 10;
        }

        this.elements.tooltip.style.left = `${posX}px`;
        this.elements.tooltip.style.top = `${posY}px`;
    }

    hideTooltip() {
        if (this.elements.tooltip) {
            this.elements.tooltip.classList.add('hidden');
        }
    }

    handleMouseOver(e) {
        const slot = e.target.closest('.inventory-slot, .equip-slot');
        if (!slot) return;

        const player = Game.state?.player;
        if (!player) return;

        let item = null;

        if (slot.classList.contains('inventory-slot')) {
            const index = parseInt(slot.dataset.index);
            item = player.inventory[index];
        } else if (slot.classList.contains('equip-slot')) {
            const slotName = slot.dataset.slot;
            item = player.equipment[slotName];
        }

        if (item) {
            const itemEntity = new ItemEntity(0, 0, item);
            const tooltipLines = itemEntity.getTooltip();
            const html = tooltipLines.map(line =>
                `<div style="color: ${line.color}; ${line.italic ? 'font-style: italic;' : ''}">${line.text}</div>`
            ).join('');
            this.showTooltip(html, e.clientX, e.clientY);
        }
    }

    onInventoryClick(index) {
        const player = Game.state?.player;
        if (!player) return;

        const item = player.inventory[index];
        if (!item) return;

        // Use or equip item
        if (item.category === ITEM_CATEGORIES.POTION ||
            item.category === ITEM_CATEGORIES.SCROLL ||
            item.category === ITEM_CATEGORIES.FOOD) {
            Inventory.useItem(player, item);
        } else if (Inventory.getEquipSlot(item)) {
            Inventory.equipItem(player, item);
        }
    }

    showItemContextMenu(e, item, index) {
        // Implementation for context menu
    }
}

// Global UI manager
const UI = new UIManager();
