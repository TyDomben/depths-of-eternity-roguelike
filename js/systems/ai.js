// Enemy AI System

class AISystem {
    constructor() {
        this.behaviors = new Map();
        this.setupBehaviors();
    }

    setupBehaviors() {
        this.behaviors.set('melee', this.meleeBehavior.bind(this));
        this.behaviors.set('ranged', this.rangedBehavior.bind(this));
        this.behaviors.set('caster', this.casterBehavior.bind(this));
        this.behaviors.set('support', this.supportBehavior.bind(this));
        this.behaviors.set('summoner', this.summonerBehavior.bind(this));
        this.behaviors.set('turret', this.turretBehavior.bind(this));
        this.behaviors.set('suicide', this.suicideBehavior.bind(this));
        this.behaviors.set('boss', this.bossBehavior.bind(this));
    }

    // Process AI for all enemies
    processAll(gameState) {
        const { enemies, player, map } = gameState;
        const actions = [];

        for (const enemy of enemies) {
            if (enemy.dead) continue;

            // Check status effects
            if (enemy.skipTurn) {
                enemy.skipTurn = false;
                continue;
            }

            const action = this.processTurn(enemy, player, map, gameState);
            if (action) {
                actions.push({ enemy, action });
            }
        }

        return actions;
    }

    // Process single enemy turn
    processTurn(enemy, player, map, gameState) {
        // Tick status effects
        StatusEffects.tick(enemy);

        // Get distance to player
        const distToPlayer = manhattanDist(enemy.x, enemy.y, player.x, player.y);
        const canSeePlayer = gameState.fov.has(posKey(enemy.x, enemy.y));

        // Update enemy state
        if (canSeePlayer) {
            enemy.lastSeenPlayer = { x: player.x, y: player.y };
            enemy.alerted = true;
        }

        // Handle special states
        if (enemy.feared) {
            return this.fleeBehavior(enemy, player, map, gameState);
        }

        if (enemy.confused) {
            return this.confusedBehavior(enemy, map);
        }

        // Get behavior function
        const behaviorFn = this.behaviors.get(enemy.behavior) || this.meleeBehavior.bind(this);
        return behaviorFn(enemy, player, map, gameState, distToPlayer, canSeePlayer);
    }

    // Melee enemy behavior
    meleeBehavior(enemy, player, map, gameState, dist, canSee) {
        if (!enemy.alerted) {
            return this.idleBehavior(enemy, map);
        }

        // Adjacent to player - attack
        if (dist === 1) {
            return { type: 'attack', target: player };
        }

        // Move towards player
        if (canSee || enemy.lastSeenPlayer) {
            const target = canSee ? player : enemy.lastSeenPlayer;
            return this.moveTowards(enemy, target.x, target.y, map, gameState);
        }

        return this.idleBehavior(enemy, map);
    }

    // Ranged enemy behavior
    rangedBehavior(enemy, player, map, gameState, dist, canSee) {
        if (!enemy.alerted) {
            return this.idleBehavior(enemy, map);
        }

        const range = enemy.range || 6;
        const minRange = enemy.minRange || 2;

        // In range - attack
        if (canSee && dist <= range && dist >= minRange) {
            if (FOV.hasLineOfSight(map, enemy.x, enemy.y, player.x, player.y)) {
                return { type: 'ranged', target: player };
            }
        }

        // Too close - flee
        if (dist < minRange) {
            return this.fleeBehavior(enemy, player, map, gameState);
        }

        // Too far - move closer
        if (canSee && dist > range) {
            return this.moveTowards(enemy, player.x, player.y, map, gameState);
        }

        // Move to get line of sight
        if (canSee && !FOV.hasLineOfSight(map, enemy.x, enemy.y, player.x, player.y)) {
            return this.moveTowards(enemy, player.x, player.y, map, gameState);
        }

        return { type: 'wait' };
    }

    // Caster enemy behavior
    casterBehavior(enemy, player, map, gameState, dist, canSee) {
        if (!enemy.alerted) {
            return this.idleBehavior(enemy, map);
        }

        const range = 6;
        const minRange = 2;

        // Can cast spell
        if (canSee && dist <= range && dist >= minRange && enemy.spells && enemy.spells.length > 0) {
            if (FOV.hasLineOfSight(map, enemy.x, enemy.y, player.x, player.y)) {
                const spell = randomPick(enemy.spells);
                return { type: 'cast', spell, target: player };
            }
        }

        // Too close - flee
        if (dist < minRange) {
            return this.fleeBehavior(enemy, player, map, gameState);
        }

        // Move closer or get LOS
        if (canSee && (dist > range || !FOV.hasLineOfSight(map, enemy.x, enemy.y, player.x, player.y))) {
            return this.moveTowards(enemy, player.x, player.y, map, gameState);
        }

        return { type: 'wait' };
    }

    // Support enemy behavior
    supportBehavior(enemy, player, map, gameState, dist, canSee) {
        // Check for allies to heal
        const allies = gameState.enemies.filter(e =>
            e !== enemy && !e.dead &&
            manhattanDist(enemy.x, enemy.y, e.x, e.y) <= 6 &&
            e.hp < e.maxHp * 0.5
        );

        if (allies.length > 0) {
            const target = allies.sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
            return { type: 'heal', target };
        }

        // Check for allies to buff
        const unbuffed = gameState.enemies.filter(e =>
            e !== enemy && !e.dead &&
            manhattanDist(enemy.x, enemy.y, e.x, e.y) <= 6 &&
            !StatusEffects.has(e, 'STRENGTH')
        );

        if (unbuffed.length > 0 && randomBool(0.3)) {
            return { type: 'buff', target: randomPick(unbuffed) };
        }

        // Fall back to caster behavior
        return this.casterBehavior(enemy, player, map, gameState, dist, canSee);
    }

    // Summoner enemy behavior
    summonerBehavior(enemy, player, map, gameState, dist, canSee) {
        // Count existing summons
        const summonCount = gameState.enemies.filter(e =>
            e.summoner === enemy.id && !e.dead
        ).length;

        // Try to summon if low on minions
        if (summonCount < 3 && randomBool(0.4)) {
            return { type: 'summon', summonType: enemy.summons };
        }

        // Otherwise use caster behavior
        return this.casterBehavior(enemy, player, map, gameState, dist, canSee);
    }

    // Turret behavior (stationary)
    turretBehavior(enemy, player, map, gameState, dist, canSee) {
        const range = enemy.range || 8;

        if (canSee && dist <= range) {
            if (FOV.hasLineOfSight(map, enemy.x, enemy.y, player.x, player.y)) {
                return { type: 'ranged', target: player };
            }
        }

        return { type: 'wait' };
    }

    // Suicide bomber behavior
    suicideBehavior(enemy, player, map, gameState, dist, canSee) {
        if (!enemy.alerted) {
            return this.idleBehavior(enemy, map);
        }

        // Adjacent - explode
        if (dist === 1) {
            return { type: 'explode' };
        }

        // Rush towards player
        if (canSee || enemy.lastSeenPlayer) {
            const target = canSee ? player : enemy.lastSeenPlayer;
            return this.moveTowards(enemy, target.x, target.y, map, gameState);
        }

        return this.idleBehavior(enemy, map);
    }

    // Boss behavior
    bossBehavior(enemy, player, map, gameState, dist, canSee) {
        if (!enemy.alerted && canSee) {
            enemy.alerted = true;
            Events.emit(EVENTS.BOSS_SPAWN, { boss: enemy });
            Audio.play('boss');
        }

        if (!enemy.alerted) {
            return { type: 'wait' };
        }

        // Phase changes based on HP
        const hpPercent = enemy.hp / enemy.maxHp;

        // Enrage at low HP
        if (hpPercent < 0.3 && !enemy.enraged) {
            enemy.enraged = true;
            enemy.attack *= 1.5;
            Events.emit(EVENTS.MESSAGE_ADD, { text: `${enemy.name} becomes enraged!`, type: 'warning' });
        }

        // Use abilities
        if (enemy.spells && enemy.spells.length > 0 && randomBool(0.5)) {
            const spell = randomPick(enemy.spells);
            return { type: 'cast', spell, target: player };
        }

        // Multi-attack
        if (dist === 1 && randomBool(0.3)) {
            return { type: 'multiAttack', target: player, count: 2 };
        }

        // Regular attack if adjacent
        if (dist === 1) {
            return { type: 'attack', target: player };
        }

        // Move towards player
        return this.moveTowards(enemy, player.x, player.y, map, gameState);
    }

    // Idle behavior (patrol or wait)
    idleBehavior(enemy, map) {
        if (randomBool(0.3)) {
            // Random movement
            const dirs = Object.values(DIRECTIONS);
            const dir = randomPick(dirs);
            const newX = enemy.x + dir.x;
            const newY = enemy.y + dir.y;

            if (this.canMoveTo(map, newX, newY)) {
                return { type: 'move', x: newX, y: newY };
            }
        }

        return { type: 'wait' };
    }

    // Flee behavior
    fleeBehavior(enemy, player, map, gameState) {
        const fleeDir = oppositeDir(getDirection(enemy.x, enemy.y, player.x, player.y));
        const newX = enemy.x + fleeDir.x;
        const newY = enemy.y + fleeDir.y;

        if (this.canMoveTo(map, newX, newY, gameState.enemies)) {
            return { type: 'move', x: newX, y: newY };
        }

        // Try adjacent tiles
        const neighbors = getNeighbors(enemy.x, enemy.y);
        for (const neighbor of randomShuffle(neighbors)) {
            if (this.canMoveTo(map, neighbor.x, neighbor.y, gameState.enemies)) {
                const distFromPlayer = manhattanDist(neighbor.x, neighbor.y, player.x, player.y);
                if (distFromPlayer > manhattanDist(enemy.x, enemy.y, player.x, player.y)) {
                    return { type: 'move', x: neighbor.x, y: neighbor.y };
                }
            }
        }

        return { type: 'wait' };
    }

    // Confused behavior
    confusedBehavior(enemy, map) {
        const dirs = Object.values(DIRECTIONS);
        const dir = randomPick(dirs);
        const newX = enemy.x + dir.x;
        const newY = enemy.y + dir.y;

        if (this.canMoveTo(map, newX, newY)) {
            return { type: 'move', x: newX, y: newY };
        }

        return { type: 'wait' };
    }

    // Move towards target
    moveTowards(enemy, targetX, targetY, map, gameState) {
        const nextStep = Pathfinding.getNextStep(
            map,
            enemy.x,
            enemy.y,
            targetX,
            targetY,
            { avoidEntities: gameState.enemies.filter(e => e !== enemy && !e.dead) }
        );

        if (nextStep) {
            return { type: 'move', x: nextStep.x, y: nextStep.y };
        }

        // Direct approach if pathfinding fails
        const dir = getDirection(enemy.x, enemy.y, targetX, targetY);
        const newX = enemy.x + dir.x;
        const newY = enemy.y + dir.y;

        if (this.canMoveTo(map, newX, newY, gameState.enemies)) {
            return { type: 'move', x: newX, y: newY };
        }

        return { type: 'wait' };
    }

    // Check if position is walkable
    canMoveTo(map, x, y, entities = []) {
        if (!inBounds(x, y, map.width, map.height)) return false;

        const tile = map.tiles[y][x];
        const tileData = TILE_DATA[tile];
        if (!tileData || !tileData.walkable) return false;

        // Check for other entities
        for (const entity of entities) {
            if (entity.x === x && entity.y === y && !entity.dead) return false;
        }

        return true;
    }

    // Alert nearby enemies
    alertNearby(x, y, radius, enemies) {
        for (const enemy of enemies) {
            if (enemy.dead || enemy.alerted) continue;

            const dist = manhattanDist(x, y, enemy.x, enemy.y);
            if (dist <= radius) {
                enemy.alerted = true;
                Events.emit(EVENTS.ENEMY_ALERT, { enemy });
            }
        }
    }
}

// Global AI system
const AI = new AISystem();
