// Skill Definitions and Spell Effects

// Spell data for casting
const SPELLS = {
    // Fire spells
    fireBolt: { name: 'Fire Bolt', damage: 12, damageType: 'fire', range: 6, manaCost: 5, projectile: true, color: '#ff4400' },
    fireball: { name: 'Fireball', damage: 30, damageType: 'fire', range: 8, aoeRadius: 2, manaCost: 15, projectile: true, color: '#ff6600' },
    meteor: { name: 'Meteor', damage: 80, damageType: 'fire', range: 10, aoeRadius: 3, manaCost: 40, delay: 1, color: '#ff0000' },
    fireNova: { name: 'Fire Nova', damage: 40, damageType: 'fire', aoeRadius: 3, self: true, manaCost: 25, color: '#ff4400' },

    // Ice spells
    frostBolt: { name: 'Frost Bolt', damage: 10, damageType: 'ice', range: 6, manaCost: 6, slow: true, projectile: true, color: '#00ffff' },
    frostNova: { name: 'Frost Nova', damage: 20, damageType: 'ice', aoeRadius: 3, self: true, manaCost: 15, freeze: true, color: '#00ffff' },
    blizzard: { name: 'Blizzard', damage: 35, damageType: 'ice', range: 6, aoeRadius: 3, manaCost: 25, duration: 3, color: '#87ceeb' },
    iceBarrier: { name: 'Ice Barrier', shield: 50, self: true, manaCost: 20, duration: 20, color: '#e0ffff' },

    // Lightning spells
    lightningBolt: { name: 'Lightning Bolt', damage: 18, damageType: 'lightning', range: 8, manaCost: 10, piercing: true, color: '#ffff00' },
    chainLightning: { name: 'Chain Lightning', damage: 25, damageType: 'lightning', range: 6, jumps: 4, manaCost: 20, color: '#ffff88' },

    // Dark spells
    darkBolt: { name: 'Dark Bolt', damage: 15, damageType: 'dark', range: 6, manaCost: 8, projectile: true, color: '#9932cc' },
    drainLife: { name: 'Drain Life', damage: 20, damageType: 'dark', range: 5, lifesteal: 1.0, manaCost: 12, color: '#ff00ff' },
    curse: { name: 'Curse', range: 6, manaCost: 10, effect: 'CURSED', duration: 20, color: '#800080' },
    fear: { name: 'Fear', range: 5, manaCost: 12, effect: 'FEAR', duration: 8, color: '#4b0082' },

    // Holy spells
    smite: { name: 'Smite', damage: 25, damageType: 'holy', range: 1, manaCost: 8, undeadBonus: 1.0, color: '#ffd700' },
    heal: { name: 'Heal', heal: 40, range: 6, manaCost: 10, color: '#00ff00' },
    bless: { name: 'Bless', range: 0, manaCost: 15, effect: 'BLESSED', duration: 30, self: true, color: '#ffff00' },
    holyNova: { name: 'Holy Nova', damage: 30, heal: 30, damageType: 'holy', aoeRadius: 3, self: true, manaCost: 25, color: '#ffffff' },
    divineShield: { name: 'Divine Shield', invulnerable: true, duration: 5, self: true, manaCost: 30, color: '#ffd700' },

    // Nature spells
    entangle: { name: 'Entangle', range: 6, manaCost: 12, effect: 'root', duration: 5, aoeRadius: 2, color: '#228b22' },
    poisonCloud: { name: 'Poison Cloud', damage: 5, damageType: 'poison', range: 6, aoeRadius: 2, duration: 5, manaCost: 15, color: '#00ff00' },
    summonBeast: { name: 'Summon Beast', summon: 'wolf', manaCost: 20, color: '#8b4513' },

    // Utility spells
    teleport: { name: 'Teleport', range: 8, manaCost: 15, teleport: true, color: '#ff00ff' },
    invisibility: { name: 'Invisibility', effect: 'INVISIBLE', duration: 15, self: true, manaCost: 20, color: '#aaaaff' },
    haste: { name: 'Haste', effect: 'HASTE', duration: 20, self: true, manaCost: 15, color: '#ffaa00' },
    identify: { name: 'Identify', identify: true, manaCost: 5, color: '#ffffff' },
    magicMapping: { name: 'Magic Mapping', revealMap: true, manaCost: 15, color: '#00ff00' },

    // Summoning spells
    summonUndead: { name: 'Summon Undead', summon: 'skeleton', count: 3, manaCost: 20, color: '#9400d3' },
    summonDemon: { name: 'Summon Demon', summon: 'imp', count: 2, manaCost: 25, color: '#ff0000' },

    // Void/Mind spells
    mindBlast: { name: 'Mind Blast', damage: 30, damageType: 'arcane', range: 5, aoeRadius: 2, manaCost: 20, stun: 2, color: '#da70d6' },
    dominate: { name: 'Dominate', range: 5, manaCost: 25, charm: true, duration: 10, color: '#ff00ff' },
    confusion: { name: 'Confusion', range: 6, manaCost: 12, effect: 'CONFUSION', duration: 10, color: '#ff88ff' },
    disintegrate: { name: 'Disintegrate', damage: 100, damageType: 'arcane', range: 8, manaCost: 40, singleTarget: true, color: '#ff0000' },

    // Special boss spells
    timeStop: { name: 'Time Stop', timeStop: 3, self: true, manaCost: 50, color: '#ffffff' },
    voidRift: { name: 'Void Rift', damage: 50, damageType: 'void', range: 8, aoeRadius: 3, teleportRandom: true, manaCost: 35, color: '#4b0082' },
    realityWarp: { name: 'Reality Warp', randomEffect: true, range: 10, aoeRadius: 5, manaCost: 40, color: '#000000' }
};

// Buff/Debuff definitions
const BUFFS = {
    strength: { name: 'Strength', stat: 'str', bonus: 5, duration: 20 },
    dexterity: { name: 'Dexterity', stat: 'dex', bonus: 5, duration: 20 },
    intelligence: { name: 'Intelligence', stat: 'int', bonus: 5, duration: 20 },
    haste: { name: 'Haste', stat: 'speed', bonusPercent: 0.5, duration: 15 },
    shield: { name: 'Shield', absorb: 50, duration: 20 },
    regeneration: { name: 'Regeneration', hpPerTurn: 3, duration: 20 },
    manaRegen: { name: 'Mana Regen', mpPerTurn: 2, duration: 20 },
    stoneskin: { name: 'Stoneskin', defense: 10, duration: 20 },
    berserk: { name: 'Berserk', attackBonus: 0.5, defensePenalty: 0.3, duration: 15 },
    focus: { name: 'Focus', critBonus: 0.2, duration: 15 }
};

const DEBUFFS = {
    weakness: { name: 'Weakness', stat: 'str', penalty: 5, duration: 15 },
    slow: { name: 'Slow', stat: 'speed', penaltyPercent: 0.3, duration: 10 },
    blind: { name: 'Blind', fovReduction: 0.5, accuracyPenalty: 0.3, duration: 8 },
    root: { name: 'Root', immobile: true, duration: 5 },
    silence: { name: 'Silence', noSpells: true, duration: 8 },
    vulnerability: { name: 'Vulnerability', damageIncrease: 0.25, duration: 10 },
    doom: { name: 'Doom', deathTimer: 10 },
    curse: { name: 'Curse', allStats: -3, duration: 20 }
};

// Skill helper functions
function calculateSkillDamage(skill, caster, rank) {
    const baseEffect = skill.effect;
    let damage = 0;

    if (Array.isArray(baseEffect.damage)) {
        damage = baseEffect.damage[rank - 1];
    } else {
        damage = baseEffect.damage || 0;
    }

    // Apply spell power
    if (caster.stats && skill.type === 'active') {
        const spellPower = caster.getSpellPower ? caster.getSpellPower() : 1;
        damage = Math.floor(damage * spellPower);
    }

    return damage;
}

function calculateSkillManaCost(skill, caster, rank) {
    let cost = skill.manaCost || 0;

    // Apply mana cost reduction
    if (caster.skills && caster.skills.darkPact) {
        const reduction = SKILL_TREES.necromancer.darkPact.effect.manaCostReduction[caster.skills.darkPact - 1];
        cost = Math.floor(cost * (1 - reduction));
    }

    return cost;
}

function getSkillCooldown(skill, caster) {
    let cooldown = skill.cooldown || 0;

    // Apply cooldown reduction effects
    if (caster.buffs && caster.buffs.has('haste')) {
        cooldown = Math.floor(cooldown * 0.7);
    }

    return cooldown;
}

function canUseSkill(skill, caster) {
    // Check mana
    if (caster.mp < calculateSkillManaCost(skill, caster)) {
        return { canUse: false, reason: 'Not enough mana' };
    }

    // Check cooldown
    if (caster.cooldowns && caster.cooldowns.get(skill.name) > 0) {
        return { canUse: false, reason: 'Skill on cooldown' };
    }

    // Check requirements
    if (skill.requires) {
        if (typeof skill.requires === 'string') {
            // Equipment requirement
            if (!caster.equipment || !caster.equipment[skill.requires]) {
                return { canUse: false, reason: `Requires ${skill.requires}` };
            }
        }
    }

    // Check special conditions
    if (skill.effect && skill.effect.requiresStealth && !caster.isInvisible()) {
        return { canUse: false, reason: 'Requires stealth' };
    }

    if (skill.effect && skill.effect.requiresCorpse) {
        // Check for nearby corpse
    }

    return { canUse: true };
}

// Execute skill effect
function executeSkill(skill, caster, target, rank, gameState) {
    const effect = skill.effect;
    const results = [];

    // Damage effects
    if (effect.damage || effect.damageMultiplier) {
        let damage = calculateSkillDamage(skill, caster, rank);

        if (effect.damageMultiplier) {
            const mult = Array.isArray(effect.damageMultiplier)
                ? effect.damageMultiplier[rank - 1]
                : effect.damageMultiplier;
            damage = Math.floor(caster.getAttackDamage() * mult);
        }

        results.push({ type: 'damage', value: damage, target });
    }

    // Healing effects
    if (effect.heal) {
        const heal = Array.isArray(effect.heal) ? effect.heal[rank - 1] : effect.heal;
        results.push({ type: 'heal', value: heal, target: target || caster });
    }

    // Status effects
    if (effect.status) {
        const duration = Array.isArray(effect.duration) ? effect.duration[rank - 1] : effect.duration;
        results.push({ type: 'status', status: effect.status, duration, target: target || caster });
    }

    // Summon effects
    if (effect.summon) {
        const count = Array.isArray(effect.summonCount) ? effect.summonCount[rank - 1] : (effect.summonCount || 1);
        results.push({ type: 'summon', summonType: effect.summonType || effect.summon, count });
    }

    // Movement effects
    if (effect.teleport || effect.teleportBehind) {
        results.push({ type: 'teleport', behind: effect.teleportBehind, target });
    }

    // Shield effects
    if (effect.shield) {
        const shield = Array.isArray(effect.shield) ? effect.shield[rank - 1] : effect.shield;
        results.push({ type: 'shield', value: shield, target: caster });
    }

    // Buff effects
    if (effect.buff) {
        results.push({ type: 'buff', buffType: effect.buff, duration: effect.duration, target: caster });
    }

    // AoE flag
    if (effect.aoe || effect.aoeRadius) {
        results.forEach(r => {
            r.aoe = true;
            r.radius = effect.aoeRadius || 1;
        });
    }

    return results;
}

// Level up stat bonuses per class
const LEVEL_UP_CHOICES = {
    warrior: [
        { name: '+2 Strength', stat: 'str', value: 2 },
        { name: '+2 Constitution', stat: 'con', value: 2 },
        { name: '+1 All Stats', stat: 'all', value: 1 },
        { name: '+10 Max HP', stat: 'maxHp', value: 10 }
    ],
    mage: [
        { name: '+2 Intelligence', stat: 'int', value: 2 },
        { name: '+2 Wisdom', stat: 'wis', value: 2 },
        { name: '+1 All Stats', stat: 'all', value: 1 },
        { name: '+15 Max MP', stat: 'maxMp', value: 15 }
    ],
    rogue: [
        { name: '+2 Dexterity', stat: 'dex', value: 2 },
        { name: '+5% Crit Chance', stat: 'crit', value: 0.05 },
        { name: '+1 All Stats', stat: 'all', value: 1 },
        { name: '+5% Dodge', stat: 'dodge', value: 0.05 }
    ],
    ranger: [
        { name: '+2 Dexterity', stat: 'dex', value: 2 },
        { name: '+2 Wisdom', stat: 'wis', value: 2 },
        { name: '+1 All Stats', stat: 'all', value: 1 },
        { name: '+10% Ranged Damage', stat: 'rangedDamage', value: 0.1 }
    ],
    cleric: [
        { name: '+2 Wisdom', stat: 'wis', value: 2 },
        { name: '+2 Constitution', stat: 'con', value: 2 },
        { name: '+1 All Stats', stat: 'all', value: 1 },
        { name: '+10% Healing Power', stat: 'healPower', value: 0.1 }
    ],
    necromancer: [
        { name: '+2 Intelligence', stat: 'int', value: 2 },
        { name: '+10% Spell Damage', stat: 'spellDamage', value: 0.1 },
        { name: '+1 All Stats', stat: 'all', value: 1 },
        { name: '+1 Summon Limit', stat: 'summonLimit', value: 1 }
    ],
    monk: [
        { name: '+2 Dexterity', stat: 'dex', value: 2 },
        { name: '+2 Wisdom', stat: 'wis', value: 2 },
        { name: '+1 All Stats', stat: 'all', value: 1 },
        { name: '+5 Unarmed Damage', stat: 'unarmedDamage', value: 5 }
    ],
    bard: [
        { name: '+2 Charisma', stat: 'cha', value: 2 },
        { name: '+2 Dexterity', stat: 'dex', value: 2 },
        { name: '+1 All Stats', stat: 'all', value: 1 },
        { name: '+10% Buff Duration', stat: 'buffDuration', value: 0.1 }
    ]
};
