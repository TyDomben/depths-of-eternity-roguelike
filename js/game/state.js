// Game State Management

class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.player = null;
        this.map = null;
        this.enemies = [];
        this.items = [];
        this.floor = 1;
        this.turn = 0;
        this.mode = GAME_MODES.NORMAL;
        this.seed = null;

        // FOV and explored areas
        this.fov = new Set();
        this.explored = new Set();

        // Targeting
        this.targetCursor = null;

        // Game status
        this.running = false;
        this.paused = false;
        this.gameOver = false;
        this.victory = false;

        // Session stats
        this.startTime = null;
        this.playTime = 0;
    }

    initialize(classId, mode = GAME_MODES.NORMAL, seed = null) {
        this.reset();

        this.mode = mode;
        this.seed = seed || Date.now();
        gameRNG = new RNG(this.seed);

        // Create player
        const classData = CLASS_DATA[classId];
        this.player = new Player(0, 0, classData);

        // Generate first floor
        this.generateFloor();

        this.startTime = Date.now();
        this.running = true;
    }

    generateFloor() {
        const biomeKey = getBiomeForFloor(this.floor).key;

        // Generate map
        const mapData = generateMap(this.floor, biomeKey, gameRNG);
        this.map = mapData;

        // Place player at start
        const startRoom = mapData.startRoom;
        if (startRoom) {
            this.player.x = startRoom.center.x;
            this.player.y = startRoom.center.y;
        }

        // Spawn enemies
        this.enemies = spawnEnemiesForFloor(this.floor, mapData, gameRNG);

        // Spawn boss on boss floors
        if (this.floor % GAME_CONSTANTS.BOSS_INTERVAL === 0) {
            const boss = spawnBossForFloor(this.floor, mapData, gameRNG);
            if (boss) {
                this.enemies.push(boss);
            }
        }

        // Spawn items
        this.items = spawnItemsForFloor(this.floor, mapData, gameRNG);

        // Reset explored for new floor
        this.explored = new Set();

        // Update FOV
        this.updateFOV();

        Events.emit(EVENTS.MAP_GENERATE, { floor: this.floor, biome: biomeKey });
        Events.emit(EVENTS.MESSAGE_ADD, {
            text: `You descend to floor ${this.floor} - ${getBiomeForFloor(this.floor).name}`,
            type: 'system'
        });
    }

    updateFOV() {
        this.fov = FOV.compute(this.map, this.player.x, this.player.y, this.player.fovRadius);

        // Add visible tiles to explored
        for (const key of this.fov) {
            this.explored.add(key);
        }
    }

    nextFloor() {
        this.floor++;
        this.player.floorsCleared++;

        // Check for victory
        if (this.floor > GAME_CONSTANTS.TOTAL_FLOORS && this.mode !== GAME_MODES.ENDLESS) {
            this.victory = true;
            this.running = false;
            Events.emit(EVENTS.GAME_WIN, { state: this });
            return;
        }

        this.generateFloor();
        Events.emit(EVENTS.FLOOR_CHANGE, { floor: this.floor });
    }

    previousFloor() {
        if (this.floor > 1) {
            this.floor--;
            this.generateFloor();
        }
    }

    processTurn() {
        this.turn++;

        // Player status effects
        StatusEffects.tick(this.player);

        // Player regeneration
        this.player.tickRegen();

        // Player hunger
        this.player.tickHunger();

        // Cooldowns
        this.player.tickCooldowns();

        // AI turns
        const actions = AI.processAll(this);

        // Execute AI actions
        for (const { enemy, action } of actions) {
            this.executeEnemyAction(enemy, action);
        }

        // Update FOV
        this.updateFOV();

        // Update UI
        Events.emit(EVENTS.UI_UPDATE, {});
        Events.emit(EVENTS.TURN_END, { turn: this.turn });
    }

    executeEnemyAction(enemy, action) {
        switch (action.type) {
            case 'move':
                enemy.moveTo(action.x, action.y);
                break;

            case 'attack':
                this.enemyAttack(enemy, action.target);
                break;

            case 'ranged':
                this.enemyRangedAttack(enemy, action.target);
                break;

            case 'cast':
                this.enemyCast(enemy, action.spell, action.target);
                break;

            case 'heal':
                Combat.heal(action.target, 10, enemy);
                break;

            case 'summon':
                this.spawnSummon(enemy, action.summonType);
                break;

            case 'explode':
                this.enemyExplode(enemy);
                break;

            case 'wait':
            default:
                break;
        }
    }

    enemyAttack(enemy, target) {
        const result = Combat.calculateAttack(enemy, target, {
            elementalDamage: enemy.getElementalDamage()
        });

        if (result.hit) {
            const damage = Combat.applyDamage(target, result.damage, enemy, result.damageType);

            Events.emit(EVENTS.MESSAGE_ADD, {
                text: `${enemy.name} hits you for ${damage} damage!`,
                type: 'combat'
            });

            Audio.play(result.critical ? 'crit' : 'hit');
            GameRenderer.shake(3, 5);

            // Lifesteal
            if (enemy.lifesteal > 0) {
                Combat.heal(enemy, Math.floor(damage * enemy.lifesteal), null);
            }

            // Apply status effects
            if (enemy.poisonDamage > 0) StatusEffects.tryApply(target, 'POISON', 5);
            if (enemy.fireDamage > 0) StatusEffects.tryApply(target, 'BURNING', 3);
            if (enemy.iceDamage > 0) StatusEffects.tryApply(target, 'FROZEN', 2);
        } else {
            Events.emit(EVENTS.MESSAGE_ADD, {
                text: `${enemy.name} misses!`,
                type: 'combat'
            });
            Audio.play('miss');
        }
    }

    enemyRangedAttack(enemy, target) {
        this.enemyAttack(enemy, target);
    }

    enemyCast(enemy, spellName, target) {
        const spell = SPELLS[spellName];
        if (!spell) return;

        const damage = Combat.calculateSpellDamage({ stats: { int: 10 } }, spell, target);

        if (damage > 0) {
            Combat.applyDamage(target, damage, enemy, spell.damageType);
            Events.emit(EVENTS.MESSAGE_ADD, {
                text: `${enemy.name} casts ${spell.name} for ${damage} damage!`,
                type: 'combat'
            });
        }

        Audio.play('spell');
    }

    spawnSummon(summoner, summonType) {
        const summonData = ENEMY_DATA[summonType];
        if (!summonData) return;

        const pos = this.findNearbyEmptyTile(summoner.x, summoner.y);
        if (!pos) return;

        const summon = new Enemy(pos.x, pos.y, { ...summonData, type: summonType });
        summon.summoner = summoner.id;
        summon.alerted = true;

        this.enemies.push(summon);

        Events.emit(EVENTS.MESSAGE_ADD, {
            text: `${summoner.name} summons a ${summon.name}!`,
            type: 'warning'
        });
    }

    enemyExplode(enemy) {
        const damage = enemy.attack * 2;
        const radius = 2;

        // Damage player if in range
        if (manhattanDist(enemy.x, enemy.y, this.player.x, this.player.y) <= radius) {
            Combat.applyDamage(this.player, damage, enemy, DAMAGE_TYPES.FIRE);
        }

        // Visual effect
        GameRenderer.addParticleBurst(enemy.x, enemy.y, 20, { color: 'rgb(255, 100, 0)' });
        GameRenderer.shake(5, 8);

        // Kill the enemy
        enemy.hp = 0;
        enemy.dead = true;
    }

    findNearbyEmptyTile(x, y, radius = 2) {
        const neighbors = getNeighbors(x, y);
        randomShuffle(neighbors);

        for (const pos of neighbors) {
            if (!inBounds(pos.x, pos.y, this.map.width, this.map.height)) continue;
            if (this.map.tiles[pos.y][pos.x] !== TILE_TYPES.FLOOR) continue;
            if (this.enemies.some(e => e.x === pos.x && e.y === pos.y && !e.dead)) continue;
            if (this.player.x === pos.x && this.player.y === pos.y) continue;
            return pos;
        }

        return null;
    }

    getEnemyAt(x, y) {
        return this.enemies.find(e => e.x === x && e.y === y && !e.dead);
    }

    getItemAt(x, y) {
        return this.items.find(i => i.x === x && i.y === y);
    }

    removeItem(item) {
        const index = this.items.indexOf(item);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }

    serialize() {
        return {
            player: this.player.serialize(),
            map: this.map,
            enemies: this.enemies.map(e => e.serialize()),
            items: this.items.map(i => i.serialize()),
            floor: this.floor,
            turn: this.turn,
            mode: this.mode,
            seed: this.seed,
            explored: Array.from(this.explored),
            playTime: this.playTime + (Date.now() - this.startTime)
        };
    }

    static deserialize(data) {
        const state = new GameState();

        state.floor = data.floor;
        state.turn = data.turn;
        state.mode = data.mode;
        state.seed = data.seed;
        state.map = data.map;
        state.explored = new Set(data.explored);
        state.playTime = data.playTime;
        state.startTime = Date.now();

        state.player = Player.deserialize(data.player);
        state.enemies = data.enemies.map(e => Enemy.deserialize(e));
        state.items = data.items.map(i => ItemEntity.deserialize(i));

        state.running = true;
        state.updateFOV();

        return state;
    }
}
