// Status Effects System

class StatusEffectSystem {
    constructor() {
        this.effects = new Map();
    }

    // Apply status effect to entity
    apply(entity, effectType, duration, stacks = 1) {
        const effectData = STATUS_EFFECTS[effectType];
        if (!effectData) return false;

        // Check for immunity
        if (entity.immunities && entity.immunities.includes(effectType.toLowerCase())) {
            Events.emit(EVENTS.MESSAGE_ADD, {
                text: `${entity.name} is immune to ${effectData.name}!`,
                type: 'info'
            });
            return false;
        }

        // Get or create entity's status effects
        if (!entity.statusEffects) {
            entity.statusEffects = new Map();
        }

        const existing = entity.statusEffects.get(effectType);

        if (existing) {
            // Refresh duration or add stacks
            existing.duration = Math.max(existing.duration, duration);
            existing.stacks = Math.min((existing.stacks || 1) + stacks, 5);
        } else {
            // Apply new effect
            entity.statusEffects.set(effectType, {
                type: effectType,
                data: effectData,
                duration: duration,
                stacks: stacks
            });

            // Apply immediate effects
            this.applyImmediate(entity, effectType);
        }

        Events.emit(EVENTS.STATUS_APPLY, { entity, effect: effectType, duration });
        Events.emit(EVENTS.MESSAGE_ADD, {
            text: `${entity.name} is ${effectData.name}!`,
            type: 'warning'
        });

        return true;
    }

    // Remove status effect
    remove(entity, effectType) {
        if (!entity.statusEffects) return false;

        const effect = entity.statusEffects.get(effectType);
        if (!effect) return false;

        // Remove ongoing effects
        this.removeEffects(entity, effectType);

        entity.statusEffects.delete(effectType);
        Events.emit(EVENTS.STATUS_REMOVE, { entity, effect: effectType });

        return true;
    }

    // Clear all negative effects
    clearNegative(entity) {
        if (!entity.statusEffects) return;

        const toRemove = [];
        for (const [type, effect] of entity.statusEffects) {
            if (this.isNegative(type)) {
                toRemove.push(type);
            }
        }

        for (const type of toRemove) {
            this.remove(entity, type);
        }
    }

    // Clear all effects
    clearAll(entity) {
        if (!entity.statusEffects) return;

        for (const type of entity.statusEffects.keys()) {
            this.removeEffects(entity, type);
        }

        entity.statusEffects.clear();
    }

    // Check if entity has effect
    has(entity, effectType) {
        return entity.statusEffects && entity.statusEffects.has(effectType);
    }

    // Get effect duration
    getDuration(entity, effectType) {
        if (!entity.statusEffects) return 0;
        const effect = entity.statusEffects.get(effectType);
        return effect ? effect.duration : 0;
    }

    // Tick all effects (called each turn)
    tick(entity) {
        if (!entity.statusEffects || entity.statusEffects.size === 0) return;

        const toRemove = [];

        for (const [type, effect] of entity.statusEffects) {
            // Apply per-turn effects
            this.applyPerTurn(entity, type, effect);

            // Decrease duration
            effect.duration--;

            if (effect.duration <= 0) {
                toRemove.push(type);
            }
        }

        // Remove expired effects
        for (const type of toRemove) {
            this.remove(entity, type);
            Events.emit(EVENTS.MESSAGE_ADD, {
                text: `${entity.name} is no longer ${STATUS_EFFECTS[type].name}`,
                type: 'info'
            });
        }
    }

    // Apply immediate effects when status is applied
    applyImmediate(entity, effectType) {
        switch (effectType) {
            case 'HASTE':
                entity.speedModifier = (entity.speedModifier || 1) * 1.5;
                break;
            case 'SLOW':
                entity.speedModifier = (entity.speedModifier || 1) * 0.5;
                break;
            case 'STRENGTH':
                entity.damageModifier = (entity.damageModifier || 1) * 1.25;
                break;
            case 'WEAKNESS':
                entity.damageModifier = (entity.damageModifier || 1) * 0.75;
                break;
            case 'SHIELD':
                entity.shield = (entity.shield || 0) + 30;
                break;
            case 'INVISIBLE':
                entity.invisible = true;
                break;
            case 'BLINDNESS':
                entity.fovRadius = Math.floor(entity.fovRadius * 0.5);
                break;
        }
    }

    // Remove effects when status expires
    removeEffects(entity, effectType) {
        switch (effectType) {
            case 'HASTE':
                entity.speedModifier = (entity.speedModifier || 1) / 1.5;
                break;
            case 'SLOW':
                entity.speedModifier = (entity.speedModifier || 1) / 0.5;
                break;
            case 'STRENGTH':
                entity.damageModifier = (entity.damageModifier || 1) / 1.25;
                break;
            case 'WEAKNESS':
                entity.damageModifier = (entity.damageModifier || 1) / 0.75;
                break;
            case 'INVISIBLE':
                entity.invisible = false;
                break;
            case 'BLINDNESS':
                entity.fovRadius = GAME_CONSTANTS.FOV_RADIUS;
                break;
        }
    }

    // Apply per-turn effects
    applyPerTurn(entity, effectType, effect) {
        const stacks = effect.stacks || 1;

        switch (effectType) {
            case 'POISON':
                const poisonDamage = 2 * stacks;
                Combat.applyDamage(entity, poisonDamage, null, DAMAGE_TYPES.POISON);
                break;

            case 'BURNING':
                const fireDamage = 3 * stacks;
                Combat.applyDamage(entity, fireDamage, null, DAMAGE_TYPES.FIRE);
                break;

            case 'BLEEDING':
                const bleedDamage = 2 * stacks;
                Combat.applyDamage(entity, bleedDamage, null, DAMAGE_TYPES.PHYSICAL);
                break;

            case 'REGENERATION':
                Combat.heal(entity, 2 * stacks, null);
                break;

            case 'FROZEN':
                // Skip turn
                entity.skipTurn = true;
                break;

            case 'STUN':
                entity.skipTurn = true;
                break;

            case 'CONFUSION':
                // Random movement handled in AI/input
                entity.confused = true;
                break;

            case 'FEAR':
                // Flee behavior handled in AI
                entity.feared = true;
                break;

            case 'BLESSED':
                // Small heal and bonus
                if (entity.hp < entity.maxHp) {
                    Combat.heal(entity, 1, null);
                }
                break;

            case 'CURSED':
                // Small damage and penalty
                if (randomBool(0.1)) {
                    Combat.applyDamage(entity, 1, null, DAMAGE_TYPES.DARK);
                }
                break;

            case 'LIFESTEAL':
                // Handled in combat
                break;

            case 'REFLECT':
                // Handled in combat
                break;
        }
    }

    // Check if effect is negative
    isNegative(effectType) {
        const negative = ['POISON', 'BURNING', 'FROZEN', 'CURSED', 'SLOW', 'WEAKNESS',
                         'CONFUSION', 'BLINDNESS', 'FEAR', 'STUN', 'BLEEDING'];
        return negative.includes(effectType);
    }

    // Get all active effects for entity
    getActiveEffects(entity) {
        if (!entity.statusEffects) return [];
        return Array.from(entity.statusEffects.entries()).map(([type, effect]) => ({
            type,
            ...effect.data,
            duration: effect.duration,
            stacks: effect.stacks
        }));
    }

    // Calculate resistance to effect
    calculateResistance(entity, effectType) {
        let resistance = 0;

        // Base resistance from stats
        if (entity.stats) {
            switch (effectType) {
                case 'POISON':
                    resistance += entity.stats.con * 2;
                    break;
                case 'CHARM':
                case 'FEAR':
                    resistance += entity.stats.wis * 2;
                    break;
                case 'CONFUSION':
                    resistance += entity.stats.int * 2;
                    break;
            }
        }

        // Equipment resistance
        if (entity.resistances) {
            if (effectType === 'POISON' && entity.resistances.poison) {
                resistance += entity.resistances.poison;
            }
            if (effectType === 'BURNING' && entity.resistances.fire) {
                resistance += entity.resistances.fire;
            }
            if (effectType === 'FROZEN' && entity.resistances.ice) {
                resistance += entity.resistances.ice;
            }
        }

        return resistance;
    }

    // Try to apply effect with resistance check
    tryApply(entity, effectType, duration, source = null) {
        const resistance = this.calculateResistance(entity, effectType);
        const chance = Math.max(10, 100 - resistance);

        if (randomBool(chance / 100)) {
            return this.apply(entity, effectType, duration);
        } else {
            Events.emit(EVENTS.MESSAGE_ADD, {
                text: `${entity.name} resists ${STATUS_EFFECTS[effectType].name}!`,
                type: 'info'
            });
            return false;
        }
    }
}

// Global status effects system
const StatusEffects = new StatusEffectSystem();
