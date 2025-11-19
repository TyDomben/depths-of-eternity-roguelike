// Main Game Controller

class GameController {
    constructor() {
        this.state = null;
        this.mode = GAME_MODES.NORMAL;
        this.running = false;
        this.animating = false;
    }

    init() {
        // Initialize all systems
        GameRenderer.init();
        UI.init();
        Menus.init();
        Modals.init();
        Audio.init();

        // Setup input handlers
        this.setupInputHandlers();

        // Start game loop
        this.gameLoop();
    }

    setupInputHandlers() {
        Events.on('input:move', (dir) => this.handleMove(dir));
        Events.on('input:wait', () => this.handleWait());
        Events.on('input:pickup', () => this.handlePickup());
        Events.on('input:stairs', (data) => this.handleStairs(data.down));
        Events.on('input:rest', () => this.handleRest());
        Events.on('input:search', () => this.handleSearch());
        Events.on('input:inventory', () => this.toggleInventory());
        Events.on('input:character', () => Modals.showCharacterSheet());
        Events.on('input:help', () => Modals.showHelp());
        Events.on('input:hotbar', (data) => this.useHotbarSlot(data.slot));
        Events.on('canvas:click', (data) => this.handleCanvasClick(data));

        Events.on('targeting:confirm', () => this.confirmTarget());
        Events.on('targeting:cancel', () => this.cancelTarget());

        // Save on visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.state && this.state.running) {
                SaveSystem.save(this.state);
            }
        });
    }

    startNewGame(classId) {
        this.state = new GameState();
        this.state.initialize(classId, this.mode);

        // Apply starting bonuses
        const bonuses = MetaProgression.getStartingBonuses();
        if (bonuses.hp) this.state.player.maxHp += bonuses.hp * 5;
        if (bonuses.mp) this.state.player.maxMp += bonuses.mp * 3;
        if (bonuses.gold) this.state.player.gold += bonuses.gold * 20;
        if (bonuses.attack) this.state.player.bonusAttack += bonuses.attack;
        if (bonuses.defense) this.state.player.bonusDefense += bonuses.defense;
        this.state.player.hp = this.state.player.maxHp;
        this.state.player.mp = this.state.player.maxMp;
        this.state.player.recalculateStats();

        Menus.showScreen('game-screen');
        this.running = true;

        Events.emit(EVENTS.UI_UPDATE, {});
        Events.emit(EVENTS.GAME_START, { state: this.state });

        Events.emit(EVENTS.MESSAGE_ADD, {
            text: 'Welcome to the Depths of Eternity!',
            type: 'system'
        });
        Events.emit(EVENTS.MESSAGE_ADD, {
            text: 'Press ? for help.',
            type: 'info'
        });

        Audio.resume();
    }

    loadGame() {
        const loadedState = SaveSystem.load();
        if (loadedState) {
            this.state = loadedState;
            this.running = true;

            Menus.showScreen('game-screen');
            Events.emit(EVENTS.UI_UPDATE, {});
            Events.emit(EVENTS.GAME_LOAD, { state: this.state });

            Events.emit(EVENTS.MESSAGE_ADD, {
                text: 'Game loaded!',
                type: 'system'
            });
        }
    }

    startDailyChallenge() {
        this.mode = GAME_MODES.DAILY;
        const seed = getDailySeed();

        // Use warrior for daily challenge
        this.state = new GameState();
        this.state.initialize('warrior', GAME_MODES.DAILY, seed);

        Menus.showScreen('game-screen');
        this.running = true;

        Events.emit(EVENTS.MESSAGE_ADD, {
            text: 'Daily Challenge started! Seed: ' + seed,
            type: 'system'
        });
    }

    gameLoop() {
        if (this.state && this.running && !this.state.paused) {
            // Center camera on player
            GameRenderer.centerCamera(this.state.player.x, this.state.player.y);

            // Render
            GameRenderer.render(this.state);
        }

        requestAnimationFrame(() => this.gameLoop());
    }

    handleMove(dir) {
        if (!this.state || !this.running || this.animating) return;
        if (this.state.player.dead) return;

        const newX = this.state.player.x + dir.x;
        const newY = this.state.player.y + dir.y;

        // Check for enemy
        const enemy = this.state.getEnemyAt(newX, newY);
        if (enemy) {
            this.attackEnemy(enemy);
            return;
        }

        // Check if walkable
        const tile = this.state.map.tiles[newY]?.[newX];
        const tileData = TILE_DATA[tile];

        if (!tileData) return;

        // Handle doors
        if (tile === TILE_TYPES.DOOR_CLOSED) {
            this.state.map.tiles[newY][newX] = TILE_TYPES.DOOR_OPEN;
            Events.emit(EVENTS.DOOR_OPEN, { x: newX, y: newY });
            Audio.play('door');
            this.endTurn();
            return;
        }

        if (!tileData.walkable) return;

        // Move player
        this.state.player.moveTo(newX, newY);
        Audio.play('step');

        // Check for hazards
        this.checkHazards(newX, newY, tile);

        // Check for items
        const item = this.state.getItemAt(newX, newY);
        if (item) {
            Events.emit(EVENTS.MESSAGE_ADD, {
                text: `You see ${item.getDisplayName()} here`,
                type: 'info'
            });
        }

        // Alert nearby enemies
        AI.alertNearby(newX, newY, 5, this.state.enemies);

        this.endTurn();
    }

    attackEnemy(enemy) {
        const player = this.state.player;
        const isBackstab = Combat.isBackstab(player, enemy);

        const result = Combat.calculateAttack(player, enemy, {
            isBackstab,
            elementalDamage: this.getPlayerElementalDamage()
        });

        if (result.hit) {
            const damage = Combat.applyDamage(enemy, result.damage, player, result.damageType);

            let msg = `You hit ${enemy.name} for ${damage} damage`;
            if (result.critical) msg += ' (CRITICAL!)';
            if (isBackstab) msg += ' (Backstab!)';

            Events.emit(EVENTS.MESSAGE_ADD, { text: msg, type: 'combat' });
            Audio.play(result.critical ? 'crit' : 'hit');

            // Particle effect
            GameRenderer.addParticleBurst(enemy.x, enemy.y, 5, { color: 'rgb(255, 0, 0)' });

            // Lifesteal
            if (player.lifesteal > 0) {
                const heal = Math.floor(damage * player.lifesteal);
                Combat.heal(player, heal, null);
            }

            // Check kill
            if (enemy.dead) {
                player.kills++;
                MetaProgression.recordEnemyKill(enemy.type);

                Events.emit(EVENTS.MESSAGE_ADD, {
                    text: `You killed ${enemy.name}!`,
                    type: 'pickup'
                });

                if (enemy.boss) {
                    Events.emit(EVENTS.BOSS_DEATH, { boss: enemy });
                    Audio.play('boss');
                } else {
                    Audio.play('death');
                }
            }
        } else {
            Events.emit(EVENTS.MESSAGE_ADD, { text: `You miss ${enemy.name}`, type: 'combat' });
            Audio.play('miss');
        }

        this.endTurn();
    }

    getPlayerElementalDamage() {
        const weapon = this.state.player.equipment.weapon;
        if (!weapon) return {};

        const elemental = {};
        if (weapon.fireDamage) elemental.fire = weapon.fireDamage;
        if (weapon.iceDamage) elemental.ice = weapon.iceDamage;
        if (weapon.lightningDamage) elemental.lightning = weapon.lightningDamage;
        if (weapon.poisonDamage) elemental.poison = weapon.poisonDamage;
        if (weapon.holyDamage) elemental.holy = weapon.holyDamage;

        return elemental;
    }

    handleWait() {
        if (!this.state || !this.running) return;
        this.endTurn();
    }

    handlePickup() {
        if (!this.state || !this.running) return;

        const item = this.state.getItemAt(this.state.player.x, this.state.player.y);
        if (!item) {
            Events.emit(EVENTS.MESSAGE_ADD, { text: 'Nothing here to pick up', type: 'info' });
            return;
        }

        // Gold is automatically collected
        if (item.category === ITEM_CATEGORIES.GOLD) {
            this.state.player.gold += item.count;
            this.state.removeItem(item);
            Events.emit(EVENTS.MESSAGE_ADD, {
                text: `Picked up ${item.count} gold`,
                type: 'pickup'
            });
            Audio.play('gold');
            Events.emit(EVENTS.GOLD_CHANGE, { amount: item.count });
        } else {
            // Add to inventory
            const invItem = item.toInventoryItem();
            if (Inventory.addItem(this.state.player.inventory, invItem)) {
                this.state.removeItem(item);
                Events.emit(EVENTS.MESSAGE_ADD, {
                    text: `Picked up ${item.getDisplayName()}`,
                    type: 'pickup'
                });
                Audio.play('pickup');
            }
        }

        this.state.player.itemsFound++;
        Events.emit(EVENTS.UI_UPDATE, {});
    }

    handleStairs(down) {
        if (!this.state || !this.running) return;

        const tile = this.state.map.tiles[this.state.player.y][this.state.player.x];

        if (down && tile === TILE_TYPES.STAIRS_DOWN) {
            this.state.nextFloor();
            Audio.play('stairs');
        } else if (!down && tile === TILE_TYPES.STAIRS_UP) {
            this.state.previousFloor();
            Audio.play('stairs');
        } else {
            Events.emit(EVENTS.MESSAGE_ADD, { text: 'No stairs here', type: 'info' });
        }
    }

    handleRest() {
        if (!this.state || !this.running) return;

        // Check for nearby enemies
        const nearbyEnemy = this.state.enemies.find(e =>
            !e.dead && manhattanDist(e.x, e.y, this.state.player.x, this.state.player.y) <= 5
        );

        if (nearbyEnemy) {
            Events.emit(EVENTS.MESSAGE_ADD, {
                text: 'Cannot rest with enemies nearby!',
                type: 'warning'
            });
            return;
        }

        if (this.state.player.rest()) {
            Events.emit(EVENTS.MESSAGE_ADD, { text: 'Resting...', type: 'info' });
            // Multiple turns of rest
            for (let i = 0; i < 10; i++) {
                this.state.player.rest();
                this.state.player.tickHunger();
            }
            this.state.turn += 10;
            Events.emit(EVENTS.UI_UPDATE, {});
        } else {
            Events.emit(EVENTS.MESSAGE_ADD, { text: 'You are fully rested', type: 'info' });
        }
    }

    handleSearch() {
        if (!this.state || !this.running) return;

        // Search for secret doors
        const neighbors = getNeighbors(this.state.player.x, this.state.player.y);

        let found = false;
        for (const pos of neighbors) {
            const tile = this.state.map.tiles[pos.y]?.[pos.x];
            if (tile === TILE_TYPES.SECRET_WALL) {
                this.state.map.tiles[pos.y][pos.x] = TILE_TYPES.DOOR_CLOSED;
                found = true;
                Events.emit(EVENTS.SECRET_FOUND, { x: pos.x, y: pos.y });
            } else if (tile === TILE_TYPES.TRAP) {
                // Reveal trap
                this.state.map.tiles[pos.y][pos.x] = TILE_TYPES.TRAP_TRIGGERED;
                found = true;
            }
        }

        if (found) {
            Events.emit(EVENTS.MESSAGE_ADD, { text: 'You found something!', type: 'pickup' });
            Audio.play('secret');
        } else {
            Events.emit(EVENTS.MESSAGE_ADD, { text: 'You search but find nothing', type: 'info' });
        }

        this.endTurn();
    }

    checkHazards(x, y, tile) {
        // Traps
        if (tile === TILE_TYPES.TRAP) {
            const trapType = randomPick(Object.values(TRAP_TYPES));
            this.state.map.tiles[y][x] = TILE_TYPES.TRAP_TRIGGERED;

            Events.emit(EVENTS.TRAP_TRIGGER, { x, y, trap: trapType });
            Events.emit(EVENTS.MESSAGE_ADD, { text: trapType.message, type: 'warning' });

            if (trapType.damage) {
                Combat.applyDamage(this.state.player, trapType.damage, null, trapType.damageType);
            }
            if (trapType.effect && STATUS_EFFECTS[trapType.effect]) {
                StatusEffects.apply(this.state.player, trapType.effect, STATUS_EFFECTS[trapType.effect].duration);
            }

            Audio.play('trap');
            GameRenderer.shake(5, 8);
        }

        // Lava
        if (tile === TILE_TYPES.LAVA) {
            Combat.applyDamage(this.state.player, TILE_DATA[tile].damage, null, 'fire');
        }
    }

    handleCanvasClick(data) {
        if (!this.state || !this.running) return;

        // Convert screen to world coordinates
        const worldX = data.x + GameRenderer.camera.x;
        const worldY = data.y + GameRenderer.camera.y;

        // Check if clicking on enemy in range
        const enemy = this.state.getEnemyAt(worldX, worldY);
        if (enemy && this.state.fov.has(posKey(worldX, worldY))) {
            // Click to move adjacent and attack, or examine
            if (manhattanDist(this.state.player.x, this.state.player.y, worldX, worldY) === 1) {
                this.attackEnemy(enemy);
            }
        }
    }

    toggleInventory() {
        UI.switchTab('inventory');
    }

    useHotbarSlot(slot) {
        // Use item in hotbar slot
        const item = this.state?.player?.inventory[slot];
        if (item) {
            Inventory.useItem(this.state.player, item);
        }
    }

    endTurn() {
        if (!this.state) return;

        // Check player death
        if (this.state.player.hp <= 0) {
            this.handlePlayerDeath();
            return;
        }

        // Process turn
        this.state.processTurn();

        // Auto-save periodically
        if (this.state.turn % 100 === 0) {
            SaveSystem.save(this.state);
        }
    }

    handlePlayerDeath() {
        this.running = false;
        this.state.running = false;
        this.state.gameOver = true;

        SaveSystem.deleteSave();

        // Record meta progression
        const points = MetaProgression.recordRun(this.state, false);

        // Show death screen
        Menus.showDeathScreen({
            floor: this.state.floor,
            level: this.state.player.level,
            gold: this.state.player.gold,
            kills: this.state.player.kills,
            cause: 'Combat',
            unlocks: points > 0 ? [`+${points} unlock points`] : []
        });

        Events.emit(EVENTS.GAME_OVER, { state: this.state });
    }

    confirmTarget() {
        // Handle targeting confirmation
    }

    cancelTarget() {
        Input.setMode('normal');
    }
}

// Global game controller
const Game = new GameController();
