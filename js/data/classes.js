// Player Class Definitions

const CLASS_DATA = {
    warrior: {
        name: 'Warrior',
        description: 'A master of weapons and armor, the Warrior excels in direct combat with high health and defense.',
        icon: 'W',
        color: '#ff4444',
        unlocked: true,
        baseStats: { str: 16, dex: 12, int: 8, con: 14, wis: 8, cha: 10 },
        hpPerLevel: 12,
        mpPerLevel: 2,
        startingEquipment: ['longSword', 'chainmail', 'helm'],
        startingItems: ['healthMinor', 'healthMinor', 'bread'],
        skillTree: 'warrior',
        playstyle: 'Tank/Melee DPS',
        difficulty: 'Easy'
    },
    mage: {
        name: 'Mage',
        description: 'A wielder of arcane powers, the Mage can devastate enemies with powerful spells but has low health.',
        icon: 'M',
        color: '#4444ff',
        unlocked: true,
        baseStats: { str: 8, dex: 10, int: 16, con: 8, wis: 14, cha: 12 },
        hpPerLevel: 6,
        mpPerLevel: 8,
        startingEquipment: ['magicStaff', 'robe', 'circlet'],
        startingItems: ['manaMinor', 'manaMinor', 'scrollFireball'],
        skillTree: 'mage',
        playstyle: 'Ranged Spellcaster',
        difficulty: 'Medium'
    },
    rogue: {
        name: 'Rogue',
        description: 'A sneaky assassin who strikes from shadows, dealing massive critical damage and avoiding attacks.',
        icon: 'R',
        color: '#ffff44',
        unlocked: true,
        baseStats: { str: 10, dex: 16, int: 10, con: 10, wis: 10, cha: 12 },
        hpPerLevel: 8,
        mpPerLevel: 4,
        startingEquipment: ['dagger', 'dagger', 'leather', 'hood'],
        startingItems: ['invisibility', 'healthMinor', 'lockpick'],
        skillTree: 'rogue',
        playstyle: 'Stealth/Burst DPS',
        difficulty: 'Hard'
    },
    ranger: {
        name: 'Ranger',
        description: 'A skilled archer and tracker who excels at ranged combat and has affinity with nature.',
        icon: 'A',
        color: '#44ff44',
        unlocked: false,
        unlockCondition: 'Reach floor 10',
        unlockPoints: 500,
        baseStats: { str: 12, dex: 16, int: 10, con: 12, wis: 12, cha: 8 },
        hpPerLevel: 9,
        mpPerLevel: 4,
        startingEquipment: ['longBow', 'studdedLeather', 'boots'],
        startingItems: ['healthMinor', 'antidote', 'bread'],
        skillTree: 'ranger',
        playstyle: 'Ranged DPS/Support',
        difficulty: 'Medium'
    },
    cleric: {
        name: 'Cleric',
        description: 'A holy warrior blessed by the gods, excelling at healing and smiting undead.',
        icon: 'C',
        color: '#ffffff',
        unlocked: false,
        unlockCondition: 'Defeat 100 undead',
        unlockPoints: 600,
        baseStats: { str: 12, dex: 8, int: 10, con: 12, wis: 16, cha: 14 },
        hpPerLevel: 10,
        mpPerLevel: 6,
        startingEquipment: ['mace', 'chainmail', 'holyStaff'],
        startingItems: ['healthMinor', 'scrollRemoveCurse', 'bread'],
        skillTree: 'cleric',
        playstyle: 'Healer/Support Tank',
        difficulty: 'Easy'
    },
    necromancer: {
        name: 'Necromancer',
        description: 'A dark mage who commands the dead and drains life from enemies.',
        icon: 'N',
        color: '#9932cc',
        unlocked: false,
        unlockCondition: 'Kill a boss with poison',
        unlockPoints: 800,
        baseStats: { str: 8, dex: 10, int: 16, con: 10, wis: 12, cha: 8 },
        hpPerLevel: 7,
        mpPerLevel: 7,
        startingEquipment: ['scythe', 'robe', 'hood'],
        startingItems: ['manaMinor', 'scrollSummon', 'corpse'],
        skillTree: 'necromancer',
        playstyle: 'Summoner/Dark Mage',
        difficulty: 'Hard'
    },
    monk: {
        name: 'Monk',
        description: 'A martial artist who fights with fists and inner power, gaining strength without equipment.',
        icon: 'K',
        color: '#ff8c00',
        unlocked: false,
        unlockCondition: 'Win a run without equipping armor',
        unlockPoints: 1000,
        baseStats: { str: 14, dex: 16, int: 10, con: 12, wis: 14, cha: 8 },
        hpPerLevel: 9,
        mpPerLevel: 5,
        startingEquipment: ['monkRobe', 'sandals'],
        startingItems: ['healthMinor', 'bread', 'bread'],
        skillTree: 'monk',
        playstyle: 'Fast Melee DPS',
        difficulty: 'Expert',
        special: 'Unarmed attacks scale with level'
    },
    bard: {
        name: 'Bard',
        description: 'A charismatic performer who uses music to buff allies and debuff enemies.',
        icon: 'B',
        color: '#ff69b4',
        unlocked: false,
        unlockCondition: 'Charm 50 enemies total',
        unlockPoints: 700,
        baseStats: { str: 10, dex: 14, int: 12, con: 10, wis: 10, cha: 16 },
        hpPerLevel: 8,
        mpPerLevel: 6,
        startingEquipment: ['rapier', 'leather', 'lute'],
        startingItems: ['healthMinor', 'manaMinor', 'scrollCharm'],
        skillTree: 'bard',
        playstyle: 'Support/Debuffer',
        difficulty: 'Medium'
    }
};

// Skill trees for each class
const SKILL_TREES = {
    warrior: {
        // Tier 1 (Level 1-5)
        powerStrike: { name: 'Power Strike', tier: 1, maxRank: 5, type: 'active', manaCost: 5, cooldown: 3, description: 'A powerful melee attack dealing 150%/175%/200%/225%/250% damage', effect: { damageMultiplier: [1.5, 1.75, 2.0, 2.25, 2.5] } },
        toughness: { name: 'Toughness', tier: 1, maxRank: 5, type: 'passive', description: '+4%/8%/12%/16%/20% max HP', effect: { hpBonus: [0.04, 0.08, 0.12, 0.16, 0.20] } },
        shieldBlock: { name: 'Shield Block', tier: 1, maxRank: 3, type: 'passive', description: '+5%/10%/15% block chance with shield', effect: { blockChance: [0.05, 0.10, 0.15] }, requires: 'shield' },

        // Tier 2 (Level 6-10)
        cleave: { name: 'Cleave', tier: 2, maxRank: 3, type: 'active', manaCost: 8, cooldown: 4, description: 'Attack all adjacent enemies for 80%/100%/120% damage', effect: { aoe: true, damageMultiplier: [0.8, 1.0, 1.2] }, requires: { powerStrike: 3 } },
        ironSkin: { name: 'Iron Skin', tier: 2, maxRank: 5, type: 'passive', description: '+2/4/6/8/10 defense', effect: { defenseBonus: [2, 4, 6, 8, 10] }, requires: { toughness: 3 } },
        battleCry: { name: 'Battle Cry', tier: 2, maxRank: 3, type: 'active', manaCost: 15, cooldown: 20, description: 'Boost attack by 20%/30%/40% for 10 turns', effect: { buff: 'strength', duration: 10, attackBonus: [0.2, 0.3, 0.4] } },

        // Tier 3 (Level 11-15)
        whirlwind: { name: 'Whirlwind', tier: 3, maxRank: 3, type: 'active', manaCost: 15, cooldown: 6, description: 'Spin attack hitting all nearby for 100%/125%/150% damage', effect: { aoeRadius: 1, damageMultiplier: [1.0, 1.25, 1.5] }, requires: { cleave: 2 } },
        lastStand: { name: 'Last Stand', tier: 3, maxRank: 1, type: 'passive', description: 'When below 25% HP, gain +50% damage and defense', effect: { threshold: 0.25, bonuses: { damage: 0.5, defense: 0.5 } }, requires: { ironSkin: 3 } },
        shieldBash: { name: 'Shield Bash', tier: 3, maxRank: 3, type: 'active', manaCost: 10, cooldown: 5, description: 'Bash enemy, dealing damage and stunning 1/2/3 turns', effect: { damageMultiplier: 1.0, stun: [1, 2, 3] }, requires: 'shield' },

        // Tier 4 (Level 16-20)
        berserkerRage: { name: 'Berserker Rage', tier: 4, maxRank: 1, type: 'active', manaCost: 30, cooldown: 30, description: '+100% attack, -50% defense for 15 turns', effect: { attackBonus: 1.0, defensePenalty: 0.5, duration: 15 } },
        executioner: { name: 'Executioner', tier: 4, maxRank: 3, type: 'passive', description: 'Deal 10%/20%/30% bonus damage to enemies below 30% HP', effect: { executeDamage: [0.1, 0.2, 0.3], threshold: 0.3 }, requires: { powerStrike: 5 } },
        unbreakable: { name: 'Unbreakable', tier: 4, maxRank: 1, type: 'passive', description: 'Once per floor, survive lethal damage with 1 HP', effect: { cheatDeath: true }, requires: { lastStand: 1 } }
    },

    mage: {
        // Tier 1
        fireBolt: { name: 'Fire Bolt', tier: 1, maxRank: 5, type: 'active', manaCost: 5, cooldown: 0, range: 6, description: 'Fire projectile dealing 8/12/16/20/24 fire damage', effect: { damage: [8, 12, 16, 20, 24], damageType: 'fire' } },
        frostBolt: { name: 'Frost Bolt', tier: 1, maxRank: 5, type: 'active', manaCost: 6, cooldown: 0, range: 6, description: 'Ice projectile dealing 6/9/12/15/18 damage, slowing target', effect: { damage: [6, 9, 12, 15, 18], damageType: 'ice', slow: true } },
        arcaneMastery: { name: 'Arcane Mastery', tier: 1, maxRank: 5, type: 'passive', description: '+5%/10%/15%/20%/25% spell damage', effect: { spellPower: [0.05, 0.1, 0.15, 0.2, 0.25] } },

        // Tier 2
        fireball: { name: 'Fireball', tier: 2, maxRank: 3, type: 'active', manaCost: 15, cooldown: 4, range: 8, description: 'Exploding fireball dealing 20/30/40 AoE fire damage', effect: { damage: [20, 30, 40], damageType: 'fire', aoeRadius: 2 }, requires: { fireBolt: 3 } },
        iceBarrier: { name: 'Ice Barrier', tier: 2, maxRank: 3, type: 'active', manaCost: 20, cooldown: 15, description: 'Shield absorbing 30/50/70 damage', effect: { shield: [30, 50, 70] }, requires: { frostBolt: 3 } },
        manaShield: { name: 'Mana Shield', tier: 2, maxRank: 3, type: 'toggle', description: 'Damage taken from mana instead (2/1.5/1 mana per damage)', effect: { manaPerDamage: [2, 1.5, 1] } },

        // Tier 3
        chainLightning: { name: 'Chain Lightning', tier: 3, maxRank: 3, type: 'active', manaCost: 20, cooldown: 5, range: 6, description: 'Lightning jumping to 3/4/5 targets', effect: { damage: 25, jumps: [3, 4, 5], damageType: 'lightning' }, requires: { arcaneMastery: 3 } },
        blizzard: { name: 'Blizzard', tier: 3, maxRank: 3, type: 'active', manaCost: 25, cooldown: 8, range: 6, description: 'Ice storm in area for 15/25/35 damage', effect: { damage: [15, 25, 35], damageType: 'ice', aoeRadius: 3, freeze: true }, requires: { iceBarrier: 2 } },
        teleport: { name: 'Teleport', tier: 3, maxRank: 1, type: 'active', manaCost: 15, cooldown: 10, range: 8, description: 'Instantly teleport to target location', effect: { teleport: true } },

        // Tier 4
        meteor: { name: 'Meteor', tier: 4, maxRank: 1, type: 'active', manaCost: 40, cooldown: 15, range: 10, description: 'Call down meteor for 80 fire damage in large area', effect: { damage: 80, damageType: 'fire', aoeRadius: 3 }, requires: { fireball: 3 } },
        arcaneOrb: { name: 'Arcane Orb', tier: 4, maxRank: 3, type: 'passive', description: '15%/25%/35% chance to restore mana on kill', effect: { manaOnKill: [0.15, 0.25, 0.35] } },
        timeStop: { name: 'Time Stop', tier: 4, maxRank: 1, type: 'active', manaCost: 50, cooldown: 50, description: 'Freeze time for 3 turns (you act, enemies dont)', effect: { timeStop: 3 } }
    },

    rogue: {
        // Tier 1
        backstab: { name: 'Backstab', tier: 1, maxRank: 5, type: 'passive', description: '+50%/75%/100%/125%/150% damage from behind', effect: { backstabBonus: [0.5, 0.75, 1.0, 1.25, 1.5] } },
        evasion: { name: 'Evasion', tier: 1, maxRank: 5, type: 'passive', description: '+3%/6%/9%/12%/15% dodge chance', effect: { dodgeBonus: [0.03, 0.06, 0.09, 0.12, 0.15] } },
        poisonBlade: { name: 'Poison Blade', tier: 1, maxRank: 3, type: 'active', manaCost: 8, cooldown: 10, description: 'Coat weapon with poison for 5/8/12 attacks', effect: { poisonDamage: 3, charges: [5, 8, 12] } },

        // Tier 2
        shadowStep: { name: 'Shadow Step', tier: 2, maxRank: 3, type: 'active', manaCost: 12, cooldown: 6, range: 5, description: 'Teleport behind target, next attack is backstab', effect: { teleportBehind: true, guaranteedBackstab: true }, requires: { backstab: 3 } },
        dualWield: { name: 'Dual Wield', tier: 2, maxRank: 3, type: 'passive', description: '+20%/35%/50% damage with two weapons', effect: { dualWieldBonus: [0.2, 0.35, 0.5] } },
        lockpicking: { name: 'Lockpicking', tier: 2, maxRank: 3, type: 'passive', description: 'Open locks, +20%/35%/50% trap detection', effect: { lockpick: true, trapDetection: [0.2, 0.35, 0.5] } },

        // Tier 3
        smokeBomb: { name: 'Smoke Bomb', tier: 3, maxRank: 3, type: 'active', manaCost: 15, cooldown: 12, description: 'Blind nearby enemies 2/3/4 turns, become invisible', effect: { blindDuration: [2, 3, 4], invisible: true }, requires: { evasion: 3 } },
        assassinate: { name: 'Assassinate', tier: 3, maxRank: 3, type: 'active', manaCost: 20, cooldown: 8, description: 'Massive damage (300%/400%/500%) to unaware enemies', effect: { damageMultiplier: [3.0, 4.0, 5.0], requiresStealth: true }, requires: { shadowStep: 2 } },
        cripple: { name: 'Cripple', tier: 3, maxRank: 3, type: 'active', manaCost: 10, cooldown: 5, description: 'Slow enemy by 30%/40%/50% for 5 turns', effect: { slowAmount: [0.3, 0.4, 0.5], duration: 5 } },

        // Tier 4
        deathMark: { name: 'Death Mark', tier: 4, maxRank: 1, type: 'active', manaCost: 25, cooldown: 20, description: 'Mark target, all attacks crit for 8 turns', effect: { guaranteedCrit: true, duration: 8 }, requires: { assassinate: 2 } },
        shadowCloak: { name: 'Shadow Cloak', tier: 4, maxRank: 1, type: 'passive', description: 'Become invisible when standing still for 2 turns', effect: { autoInvisible: true, delay: 2 } },
        venomMaster: { name: 'Venom Master', tier: 4, maxRank: 3, type: 'passive', description: 'Poison damage +50%/75%/100%, immune to poison', effect: { poisonBonus: [0.5, 0.75, 1.0], poisonImmune: true }, requires: { poisonBlade: 3 } }
    },

    ranger: {
        // Tier 1
        preciseShot: { name: 'Precise Shot', tier: 1, maxRank: 5, type: 'passive', description: '+5%/10%/15%/20%/25% ranged accuracy', effect: { rangedAccuracy: [0.05, 0.1, 0.15, 0.2, 0.25] } },
        quickDraw: { name: 'Quick Draw', tier: 1, maxRank: 3, type: 'passive', description: '+10%/20%/30% ranged attack speed', effect: { rangedSpeed: [0.1, 0.2, 0.3] } },
        tracking: { name: 'Tracking', tier: 1, maxRank: 3, type: 'passive', description: 'See enemies on minimap within 10/15/20 tiles', effect: { trackRange: [10, 15, 20] } },

        // Tier 2
        multishot: { name: 'Multishot', tier: 2, maxRank: 3, type: 'active', manaCost: 10, cooldown: 4, description: 'Fire 2/3/4 arrows in a cone', effect: { projectiles: [2, 3, 4] }, requires: { preciseShot: 3 } },
        animalCompanion: { name: 'Animal Companion', tier: 2, maxRank: 3, type: 'active', manaCost: 20, cooldown: 30, description: 'Summon wolf/bear/eagle companion', effect: { summon: ['wolf', 'bear', 'eagle'] } },
        natureResist: { name: 'Nature Resist', tier: 2, maxRank: 3, type: 'passive', description: '+15%/30%/45% poison/nature resistance', effect: { poisonRes: [15, 30, 45], natureRes: [15, 30, 45] } },

        // Tier 3
        explosiveArrow: { name: 'Explosive Arrow', tier: 3, maxRank: 3, type: 'active', manaCost: 15, cooldown: 6, range: 8, description: 'Arrow explodes for 15/25/35 AoE damage', effect: { damage: [15, 25, 35], aoeRadius: 2 }, requires: { multishot: 2 } },
        camouflage: { name: 'Camouflage', tier: 3, maxRank: 1, type: 'active', manaCost: 12, cooldown: 15, description: 'Become invisible until you attack', effect: { invisibleUntilAttack: true } },
        markPrey: { name: 'Mark Prey', tier: 3, maxRank: 3, type: 'active', manaCost: 8, cooldown: 0, description: 'Mark target for +20%/30%/40% damage from all sources', effect: { damageAmplify: [0.2, 0.3, 0.4], duration: 10 } },

        // Tier 4
        rainOfArrows: { name: 'Rain of Arrows', tier: 4, maxRank: 1, type: 'active', manaCost: 30, cooldown: 12, range: 10, description: 'Rain arrows on large area for 50 damage', effect: { damage: 50, aoeRadius: 4 }, requires: { explosiveArrow: 2 } },
        hawkEye: { name: 'Hawk Eye', tier: 4, maxRank: 1, type: 'passive', description: '+50% crit chance on ranged attacks', effect: { rangedCritBonus: 0.5 } },
        beastMaster: { name: 'Beast Master', tier: 4, maxRank: 1, type: 'passive', description: 'Can have 2 animal companions', effect: { maxCompanions: 2 }, requires: { animalCompanion: 3 } }
    },

    cleric: {
        // Tier 1
        heal: { name: 'Heal', tier: 1, maxRank: 5, type: 'active', manaCost: 8, cooldown: 3, description: 'Restore 15/25/35/45/55 HP', effect: { heal: [15, 25, 35, 45, 55] } },
        smite: { name: 'Smite', tier: 1, maxRank: 5, type: 'active', manaCost: 6, cooldown: 2, range: 1, description: 'Holy attack dealing 10/15/20/25/30 (+50% vs undead)', effect: { damage: [10, 15, 20, 25, 30], holyDamage: true, undeadBonus: 0.5 } },
        divineProtection: { name: 'Divine Protection', tier: 1, maxRank: 3, type: 'passive', description: '+5%/10%/15% all resistances', effect: { allRes: [5, 10, 15] } },

        // Tier 2
        bless: { name: 'Bless', tier: 2, maxRank: 3, type: 'active', manaCost: 15, cooldown: 20, description: 'Gain blessed status for 20/30/40 turns', effect: { status: 'BLESSED', duration: [20, 30, 40] } },
        turnUndead: { name: 'Turn Undead', tier: 2, maxRank: 3, type: 'active', manaCost: 12, cooldown: 8, description: 'Fear undead in 3/4/5 tile radius', effect: { radius: [3, 4, 5], fear: true, undeadOnly: true }, requires: { smite: 3 } },
        sanctuary: { name: 'Sanctuary', tier: 2, maxRank: 3, type: 'active', manaCost: 20, cooldown: 30, description: 'Create safe zone, heal 5/10/15 per turn', effect: { healPerTurn: [5, 10, 15], radius: 2, duration: 5 }, requires: { heal: 3 } },

        // Tier 3
        holyNova: { name: 'Holy Nova', tier: 3, maxRank: 3, type: 'active', manaCost: 25, cooldown: 8, description: 'AoE damage 20/30/40 to enemies, heal allies same', effect: { damage: [20, 30, 40], heal: [20, 30, 40], radius: 3 } },
        divineShield: { name: 'Divine Shield', tier: 3, maxRank: 1, type: 'active', manaCost: 30, cooldown: 60, description: 'Immunity to damage for 5 turns', effect: { invulnerable: true, duration: 5 } },
        resurrection: { name: 'Resurrection', tier: 3, maxRank: 1, type: 'passive', description: 'Once per floor, revive with 50% HP when killed', effect: { autoRevive: true, reviveHp: 0.5 } },

        // Tier 4
        angelicForm: { name: 'Angelic Form', tier: 4, maxRank: 1, type: 'active', manaCost: 40, cooldown: 50, description: 'Transform: fly, +50% holy damage, regen for 15 turns', effect: { flying: true, holyBonus: 0.5, regen: 5, duration: 15 } },
        massHeal: { name: 'Mass Heal', tier: 4, maxRank: 1, type: 'active', manaCost: 35, cooldown: 15, description: 'Heal all allies in sight for 50 HP', effect: { heal: 50, aoe: true }, requires: { sanctuary: 2 } },
        judgment: { name: 'Judgment', tier: 4, maxRank: 1, type: 'active', manaCost: 45, cooldown: 20, range: 8, description: 'Massive holy damage (100) to single target', effect: { damage: 100, holyDamage: true }, requires: { holyNova: 2 } }
    },

    necromancer: {
        // Tier 1
        drainLife: { name: 'Drain Life', tier: 1, maxRank: 5, type: 'active', manaCost: 8, cooldown: 2, range: 5, description: 'Steal 8/12/16/20/24 HP from target', effect: { damage: [8, 12, 16, 20, 24], lifesteal: 1.0 } },
        raiseDead: { name: 'Raise Dead', tier: 1, maxRank: 3, type: 'active', manaCost: 15, cooldown: 10, description: 'Raise 1/2/3 skeleton from corpses', effect: { summonCount: [1, 2, 3], summonType: 'skeleton' } },
        darkPact: { name: 'Dark Pact', tier: 1, maxRank: 3, type: 'passive', description: 'Spells cost 10%/20%/30% less mana', effect: { manaCostReduction: [0.1, 0.2, 0.3] } },

        // Tier 2
        curseWeakness: { name: 'Curse of Weakness', tier: 2, maxRank: 3, type: 'active', manaCost: 10, cooldown: 8, range: 6, description: 'Reduce target attack by 20%/35%/50%', effect: { attackReduction: [0.2, 0.35, 0.5], duration: 10 } },
        boneArmor: { name: 'Bone Armor', tier: 2, maxRank: 3, type: 'active', manaCost: 15, cooldown: 20, description: 'Absorb next 3/5/7 hits', effect: { charges: [3, 5, 7] }, requires: { raiseDead: 2 } },
        corpseExplosion: { name: 'Corpse Explosion', tier: 2, maxRank: 3, type: 'active', manaCost: 12, cooldown: 5, range: 8, description: 'Explode corpse for 20/35/50 AoE damage', effect: { damage: [20, 35, 50], aoeRadius: 2, requiresCorpse: true } },

        // Tier 3
        summonGolem: { name: 'Summon Golem', tier: 3, maxRank: 3, type: 'active', manaCost: 30, cooldown: 30, description: 'Summon bone/blood/iron golem', effect: { summonType: ['boneGolem', 'bloodGolem', 'ironGolem'] }, requires: { raiseDead: 3 } },
        deathCoil: { name: 'Death Coil', tier: 3, maxRank: 3, type: 'active', manaCost: 15, cooldown: 4, range: 6, description: 'Dark bolt dealing 25/35/45, heals undead', effect: { damage: [25, 35, 45], healsUndead: true } },
        auraOfDecay: { name: 'Aura of Decay', tier: 3, maxRank: 3, type: 'toggle', manaCost: 3, description: 'Nearby enemies take 3/5/7 poison per turn', effect: { poisonPerTurn: [3, 5, 7], radius: 2 } },

        // Tier 4
        armyOfDead: { name: 'Army of the Dead', tier: 4, maxRank: 1, type: 'active', manaCost: 50, cooldown: 60, description: 'Raise 8 powerful undead warriors', effect: { summonCount: 8, summonType: 'undeadWarrior' }, requires: { summonGolem: 2 } },
        lichForm: { name: 'Lich Form', tier: 4, maxRank: 1, type: 'active', manaCost: 40, cooldown: 50, description: 'Transform into lich: +100% spell damage, immune to death', effect: { spellBonus: 1.0, deathImmune: true, duration: 20 } },
        soulHarvest: { name: 'Soul Harvest', tier: 4, maxRank: 1, type: 'passive', description: 'Killing enemies restores 10% max HP and MP', effect: { hpOnKill: 0.1, mpOnKill: 0.1 } }
    },

    monk: {
        // Tier 1
        flurryOfBlows: { name: 'Flurry of Blows', tier: 1, maxRank: 5, type: 'active', manaCost: 6, cooldown: 3, description: 'Attack 2/3/3/4/4 times rapidly', effect: { attacks: [2, 3, 3, 4, 4] } },
        ironFist: { name: 'Iron Fist', tier: 1, maxRank: 5, type: 'passive', description: 'Unarmed damage +2/4/6/8/10', effect: { unarmedBonus: [2, 4, 6, 8, 10] } },
        deflect: { name: 'Deflect', tier: 1, maxRank: 3, type: 'passive', description: '+10%/20%/30% chance to deflect projectiles', effect: { deflectChance: [0.1, 0.2, 0.3] } },

        // Tier 2
        ki: { name: 'Ki Focus', tier: 2, maxRank: 5, type: 'passive', description: '+3/6/9/12/15 max MP, MP regen +1/2/3/4/5', effect: { mpBonus: [3, 6, 9, 12, 15], mpRegen: [1, 2, 3, 4, 5] } },
        stunningFist: { name: 'Stunning Fist', tier: 2, maxRank: 3, type: 'active', manaCost: 10, cooldown: 5, description: 'Stun target for 2/3/4 turns', effect: { stunDuration: [2, 3, 4] }, requires: { ironFist: 3 } },
        innerPeace: { name: 'Inner Peace', tier: 2, maxRank: 3, type: 'passive', description: 'Regen 1/2/3 HP per turn when not in combat', effect: { outOfCombatRegen: [1, 2, 3] } },

        // Tier 3
        thousandPalms: { name: 'Thousand Palms', tier: 3, maxRank: 3, type: 'active', manaCost: 20, cooldown: 8, description: 'Hit all adjacent enemies 2/3/4 times each', effect: { attacksPerTarget: [2, 3, 4], aoe: true }, requires: { flurryOfBlows: 3 } },
        diamondBody: { name: 'Diamond Body', tier: 3, maxRank: 3, type: 'passive', description: '+10%/20%/30% physical resistance, poison immunity', effect: { physRes: [10, 20, 30], poisonImmune: true }, requires: { deflect: 2 } },
        dash: { name: 'Dash', tier: 3, maxRank: 3, type: 'active', manaCost: 8, cooldown: 4, description: 'Move 3/4/5 tiles instantly', effect: { distance: [3, 4, 5] } },

        // Tier 4
        quiveringPalm: { name: 'Quivering Palm', tier: 4, maxRank: 1, type: 'active', manaCost: 30, cooldown: 30, description: 'Mark enemy to die after 5 turns', effect: { delayedDeath: 5 }, requires: { stunningFist: 2 } },
        enlightenment: { name: 'Enlightenment', tier: 4, maxRank: 1, type: 'passive', description: 'All stats +3, see invisible enemies', effect: { allStats: 3, seeInvisible: true }, requires: { ki: 3 } },
        masterOfElements: { name: 'Master of Elements', tier: 4, maxRank: 1, type: 'active', manaCost: 25, cooldown: 15, description: 'Imbue attacks with chosen element for 10 turns', effect: { elementChoice: true, duration: 10 } }
    },

    bard: {
        // Tier 1
        inspiringTune: { name: 'Inspiring Tune', tier: 1, maxRank: 5, type: 'active', manaCost: 8, cooldown: 5, description: 'Boost ally attack by 10%/15%/20%/25%/30%', effect: { attackBonus: [0.1, 0.15, 0.2, 0.25, 0.3], duration: 10 } },
        discordantNote: { name: 'Discordant Note', tier: 1, maxRank: 5, type: 'active', manaCost: 6, cooldown: 3, range: 5, description: 'Deal 6/10/14/18/22 sonic damage', effect: { damage: [6, 10, 14, 18, 22], damageType: 'sonic' } },
        silverTongue: { name: 'Silver Tongue', tier: 1, maxRank: 3, type: 'passive', description: '+10%/20%/30% better shop prices', effect: { shopDiscount: [0.1, 0.2, 0.3] } },

        // Tier 2
        charmPerson: { name: 'Charm', tier: 2, maxRank: 3, type: 'active', manaCost: 15, cooldown: 10, range: 5, description: 'Charm enemy for 5/8/12 turns', effect: { charmDuration: [5, 8, 12] } },
        songOfRest: { name: 'Song of Rest', tier: 2, maxRank: 3, type: 'active', manaCost: 20, cooldown: 20, description: 'Heal all allies 15/25/35 over time', effect: { healOverTime: [15, 25, 35], duration: 5 }, requires: { inspiringTune: 3 } },
        taunt: { name: 'Taunt', tier: 2, maxRank: 3, type: 'active', manaCost: 8, cooldown: 5, range: 5, description: 'Force enemy to attack you for 3/4/5 turns', effect: { tauntDuration: [3, 4, 5] } },

        // Tier 3
        harmonic: { name: 'Harmonic Resonance', tier: 3, maxRank: 3, type: 'active', manaCost: 20, cooldown: 8, description: 'All nearby allies get your current buff', effect: { shareBuffs: true, radius: [3, 4, 5] }, requires: { songOfRest: 2 } },
        dissonance: { name: 'Dissonance', tier: 3, maxRank: 3, type: 'active', manaCost: 15, cooldown: 6, description: 'Confuse enemies in area for 3/4/5 turns', effect: { confuseDuration: [3, 4, 5], aoeRadius: 3 }, requires: { discordantNote: 3 } },
        countercharm: { name: 'Countercharm', tier: 3, maxRank: 1, type: 'passive', description: 'Immune to charm, fear, and confusion', effect: { immunities: ['charm', 'fear', 'confusion'] } },

        // Tier 4
        epicSong: { name: 'Epic Song', tier: 4, maxRank: 1, type: 'active', manaCost: 40, cooldown: 30, description: '+50% all stats for party for 15 turns', effect: { allStatBonus: 0.5, duration: 15, aoe: true }, requires: { harmonic: 2 } },
        massCharm: { name: 'Mass Charm', tier: 4, maxRank: 1, type: 'active', manaCost: 35, cooldown: 20, description: 'Charm all enemies in sight for 5 turns', effect: { charmDuration: 5, aoe: true }, requires: { charmPerson: 3 } },
        legendaryPerformance: { name: 'Legendary Performance', tier: 4, maxRank: 1, type: 'passive', description: 'All songs/charms last 50% longer', effect: { durationBonus: 0.5 } }
    }
};
