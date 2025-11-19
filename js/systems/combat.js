// Combat System

class CombatSystem {
    constructor() {
        this.combatLog = [];
    }

    // Calculate attack
    calculateAttack(attacker, defender, options = {}) {
        const result = {
            hit: false,
            damage: 0,
            critical: false,
            blocked: false,
            dodged: false,
            damageType: options.damageType || DAMAGE_TYPES.PHYSICAL,
            effects: []
        };

        // Calculate hit chance
        const accuracy = this.calculateAccuracy(attacker, defender, options);
        const hitRoll = randomFloat();

        if (hitRoll > accuracy) {
            result.dodged = true;
            Events.emit(EVENTS.COMBAT_DODGE, { attacker, defender });
            return result;
        }

        result.hit = true;

        // Calculate base damage
        let damage = this.calculateBaseDamage(attacker, options);

        // Check for critical hit
        const critChance = this.calculateCritChance(attacker, options);
        if (randomBool(critChance)) {
            result.critical = true;
            damage *= GAME_CONSTANTS.CRIT_MULTIPLIER;
            if (attacker.critMultiplier) {
                damage *= attacker.critMultiplier;
            }
            Events.emit(EVENTS.COMBAT_CRIT, { attacker, defender, damage });
        }

        // Check for backstab
        if (options.isBackstab && attacker.backstabBonus) {
            damage *= (1 + attacker.backstabBonus);
            result.effects.push('Backstab!');
        }

        // Apply elemental damage
        if (options.elementalDamage) {
            for (const [element, amount] of Object.entries(options.elementalDamage)) {
                const resist = defender.getResistance ? defender.getResistance(element) : 0;
                damage += amount * (1 - resist / 100);
            }
        }

        // Calculate defense
        let defense = this.calculateDefense(defender, result.damageType);

        // Check for block
        if (defender.blockChance && randomBool(defender.blockChance)) {
            result.blocked = true;
            defense *= 2;
            Events.emit(EVENTS.COMBAT_BLOCK, { attacker, defender });
        }

        // Apply defense
        damage = Math.max(1, damage - defense);

        // Apply damage modifiers
        if (defender.damageTaken) {
            damage *= (1 + defender.damageTaken);
        }

        // Round damage
        result.damage = Math.floor(damage);

        return result;
    }

    calculateAccuracy(attacker, defender, options) {
        let accuracy = 0.85; // Base 85% hit rate

        // Attacker bonuses
        if (attacker.accuracy) accuracy += attacker.accuracy;
        if (attacker.stats && attacker.stats.dex) {
            accuracy += (attacker.stats.dex - 10) * 0.01;
        }

        // Defender dodge
        if (defender.dodge) accuracy -= defender.dodge;
        if (defender.stats && defender.stats.dex) {
            accuracy -= (defender.stats.dex - 10) * 0.005;
        }

        // Status effects
        if (attacker.hasStatus && attacker.hasStatus('BLINDNESS')) accuracy -= 0.3;
        if (defender.hasStatus && defender.hasStatus('STUN')) accuracy += 0.5;

        // Range penalty
        if (options.range && options.range > 1) {
            accuracy -= (options.range - 1) * 0.02;
        }

        return clamp(accuracy, 0.05, 0.95);
    }

    calculateBaseDamage(attacker, options) {
        let damage = 0;

        // Weapon damage
        if (options.weaponDamage) {
            damage = rollDice(options.weaponDamage);
        } else if (attacker.getAttackDamage) {
            damage = attacker.getAttackDamage();
        } else {
            damage = attacker.attack || 5;
        }

        // Stat bonus
        if (attacker.stats) {
            if (options.ranged) {
                damage += Math.floor((attacker.stats.dex - 10) / 2);
            } else {
                damage += Math.floor((attacker.stats.str - 10) / 2);
            }
        }

        // Damage multipliers
        if (options.damageMultiplier) {
            damage *= options.damageMultiplier;
        }

        // Status effects
        if (attacker.hasStatus && attacker.hasStatus('STRENGTH')) {
            damage *= 1.25;
        }
        if (attacker.hasStatus && attacker.hasStatus('WEAKNESS')) {
            damage *= 0.75;
        }

        return damage;
    }

    calculateDefense(defender, damageType) {
        let defense = defender.defense || 0;

        // Equipment defense
        if (defender.getDefense) {
            defense = defender.getDefense();
        }

        // Stat bonus
        if (defender.stats && defender.stats.con) {
            defense += Math.floor((defender.stats.con - 10) / 4);
        }

        // Damage type resistance
        if (damageType !== DAMAGE_TYPES.PHYSICAL) {
            const resistance = defender.getResistance ? defender.getResistance(damageType) : 0;
            defense += resistance / 5;
        }

        return defense;
    }

    calculateCritChance(attacker, options) {
        let critChance = GAME_CONSTANTS.CRIT_CHANCE;

        // Attacker bonuses
        if (attacker.critChance) critChance += attacker.critChance;
        if (attacker.stats && attacker.stats.dex) {
            critChance += (attacker.stats.dex - 10) * 0.005;
        }

        // Weapon crit bonus
        if (options.critBonus) critChance += options.critBonus;

        return clamp(critChance, 0, 0.75);
    }

    // Apply damage to entity
    applyDamage(entity, damage, source, damageType = DAMAGE_TYPES.PHYSICAL) {
        const oldHp = entity.hp;

        // Check for shields
        if (entity.shield && entity.shield > 0) {
            const absorbed = Math.min(entity.shield, damage);
            entity.shield -= absorbed;
            damage -= absorbed;
            if (absorbed > 0) {
                this.addMessage(`Shield absorbs ${absorbed} damage`, 'info');
            }
        }

        // Apply damage
        entity.hp = Math.max(0, entity.hp - damage);
        const actualDamage = oldHp - entity.hp;

        // Trigger damage event
        Events.emit(EVENTS.COMBAT_HIT, {
            target: entity,
            source,
            damage: actualDamage,
            damageType
        });

        // Check for death
        if (entity.hp <= 0) {
            this.handleDeath(entity, source);
        }

        return actualDamage;
    }

    // Handle entity death
    handleDeath(entity, killer) {
        // Check for cheat death abilities
        if (entity.cheatDeath && !entity.cheatDeathUsed) {
            entity.hp = 1;
            entity.cheatDeathUsed = true;
            this.addMessage(`${entity.name} narrowly escapes death!`, 'warning');
            return;
        }

        entity.dead = true;

        if (entity.isPlayer) {
            Events.emit(EVENTS.PLAYER_DEATH, { player: entity, killer });
        } else {
            Events.emit(EVENTS.ENEMY_DEATH, { enemy: entity, killer });

            // Grant XP
            if (killer && killer.grantXp) {
                killer.grantXp(entity.xp || 0);
            }

            // Drop loot
            if (entity.drops) {
                Events.emit('loot:drop', { entity, drops: entity.drops });
            }
        }
    }

    // Heal entity
    heal(entity, amount, source) {
        const oldHp = entity.hp;
        entity.hp = Math.min(entity.maxHp, entity.hp + amount);
        const actualHeal = entity.hp - oldHp;

        if (actualHeal > 0) {
            Events.emit(EVENTS.PLAYER_HEAL, { entity, amount: actualHeal, source });
        }

        return actualHeal;
    }

    // Check if attack is backstab
    isBackstab(attacker, defender) {
        const dir = getDirection(attacker.x, attacker.y, defender.x, defender.y);
        const defenderDir = defender.facing || { x: 0, y: 1 };

        // Check if attacking from behind
        return dir.x === defenderDir.x && dir.y === defenderDir.y;
    }

    // Check if entities are flanking target
    isFlanking(attacker, defender, allies) {
        for (const ally of allies) {
            if (ally === attacker || ally.dead) continue;

            const dist = manhattanDist(ally.x, ally.y, defender.x, defender.y);
            if (dist === 1) {
                // Check if on opposite side
                const attackDir = getDirection(attacker.x, attacker.y, defender.x, defender.y);
                const allyDir = getDirection(ally.x, ally.y, defender.x, defender.y);

                if (attackDir.x === -allyDir.x && attackDir.y === -allyDir.y) {
                    return true;
                }
            }
        }
        return false;
    }

    // Calculate spell damage
    calculateSpellDamage(caster, spell, target) {
        let damage = spell.damage || 0;

        // Apply spell power
        if (caster.getSpellPower) {
            damage *= caster.getSpellPower();
        }

        // Apply intelligence bonus
        if (caster.stats && caster.stats.int) {
            damage += Math.floor((caster.stats.int - 10) / 2);
        }

        // Apply target resistance
        if (spell.damageType && target) {
            const resist = target.getResistance ? target.getResistance(spell.damageType) : 0;
            damage *= (1 - resist / 100);
        }

        return Math.floor(damage);
    }

    // Add combat message
    addMessage(text, type = 'combat') {
        this.combatLog.push({ text, type, time: Date.now() });
        Events.emit(EVENTS.MESSAGE_ADD, { text, type });
    }

    // Get recent combat messages
    getRecentMessages(count = 10) {
        return this.combatLog.slice(-count);
    }

    // Clear combat log
    clearLog() {
        this.combatLog = [];
    }
}

// Global combat system
const Combat = new CombatSystem();
