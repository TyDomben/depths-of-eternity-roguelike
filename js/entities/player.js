// Player Entity Class

class Player extends Entity {
    constructor(x, y, classData) {
        super(x, y, { name: 'Player', char: '@', color: '#ffffff', hp: GAME_CONSTANTS.BASE_HP });

        this.isPlayer = true;
        this.classId = classData.name.toLowerCase();
        this.className = classData.name;

        // Stats
        this.stats = { ...classData.baseStats };
        this.level = 1;
        this.xp = 0;
        this.xpToNext = xpForLevel(1);

        // Resources
        this.maxHp = this.calculateMaxHp();
        this.hp = this.maxHp;
        this.maxMp = this.calculateMaxMp(classData);
        this.mp = this.maxMp;
        this.hunger = GAME_CONSTANTS.BASE_HUNGER;
        this.maxHunger = GAME_CONSTANTS.BASE_HUNGER;

        // Combat
        this.attack = GAME_CONSTANTS.BASE_ATTACK;
        this.defense = GAME_CONSTANTS.BASE_DEFENSE;
        this.bonusAttack = 0;
        this.bonusDefense = 0;
        this.bonusSpeed = 0;
        this.critChance = GAME_CONSTANTS.CRIT_CHANCE;
        this.dodge = GAME_CONSTANTS.DODGE_BASE;
        this.speed = 100;

        // Modifiers
        this.damageModifier = 1;
        this.speedModifier = 1;
        this.spellPower = 1;

        // Regeneration
        this.hpRegen = 0;
        this.mpRegen = 0;

        // Resistances
        this.resistances = {
            fire: 0,
            ice: 0,
            lightning: 0,
            poison: 0,
            holy: 0,
            dark: 0
        };

        // Equipment
        this.equipment = {
            weapon: null,
            helm: null,
            armor: null,
            gloves: null,
            boots: null,
            ring1: null,
            ring2: null,
            amulet: null
        };

        // Inventory
        this.inventory = [];
        this.gold = 0;
        this.keys = 0;

        // Skills
        this.skills = {};
        this.cooldowns = new Map();
        this.skillTree = classData.skillTree;

        // Status effects
        this.statusEffects = new Map();

        // Stats tracking
        this.kills = 0;
        this.damageDealt = 0;
        this.damageTaken = 0;
        this.itemsFound = 0;
        this.floorsCleared = 0;

        // Vision
        this.fovRadius = GAME_CONSTANTS.FOV_RADIUS;

        // Special abilities
        this.lifesteal = 0;
        this.shield = 0;

        // Setup starting equipment
        this.setupStartingGear(classData);
    }

    setupStartingGear(classData) {
        // Add starting equipment
        for (const itemKey of classData.startingEquipment) {
            const itemData = WEAPONS[itemKey] || ARMORS[itemKey] || {};
            if (itemData) {
                const item = {
                    ...deepClone(itemData),
                    id: generateId(),
                    identified: true,
                    rarity: 'COMMON'
                };
                const slot = Inventory.getEquipSlot(item);
                if (slot) {
                    this.equipment[slot] = item;
                    Inventory.applyItemStats(this, item, true);
                }
            }
        }

        // Add starting items
        for (const itemKey of classData.startingItems) {
            const itemData = POTIONS[itemKey] || SCROLLS[itemKey] || FOODS[itemKey] || {};
            if (itemData) {
                const item = {
                    ...deepClone(itemData),
                    id: generateId(),
                    identified: true,
                    stackable: true,
                    count: 1
                };
                Inventory.addItem(this.inventory, item);
            }
        }
    }

    calculateMaxHp() {
        const classData = CLASS_DATA[this.classId];
        const hpPerLevel = classData ? classData.hpPerLevel : 8;
        const conBonus = Math.floor((this.stats.con - 10) * 2);
        return GAME_CONSTANTS.BASE_HP + (this.level - 1) * hpPerLevel + conBonus;
    }

    calculateMaxMp(classData) {
        if (!classData) classData = CLASS_DATA[this.classId];
        const mpPerLevel = classData ? classData.mpPerLevel : 4;
        const intBonus = Math.floor((this.stats.int - 10) * 1.5);
        return GAME_CONSTANTS.BASE_MP + (this.level - 1) * mpPerLevel + intBonus;
    }

    recalculateStats() {
        const classData = CLASS_DATA[this.classId];

        const oldMaxHp = this.maxHp;
        const oldMaxMp = this.maxMp;

        this.maxHp = this.calculateMaxHp();
        this.maxMp = this.calculateMaxMp(classData);

        // Adjust current values if max changed
        if (this.maxHp !== oldMaxHp) {
            this.hp = Math.min(this.hp, this.maxHp);
        }
        if (this.maxMp !== oldMaxMp) {
            this.mp = Math.min(this.mp, this.maxMp);
        }

        // Calculate speed
        this.speed = 100 + this.bonusSpeed + Math.floor((this.stats.dex - 10) * 2);
        this.speed = Math.floor(this.speed * this.speedModifier);

        Events.emit(EVENTS.UI_UPDATE, {});
    }

    getAttackDamage() {
        let damage = this.attack + this.bonusAttack;

        // Weapon damage
        if (this.equipment.weapon) {
            const weapon = this.equipment.weapon;
            if (weapon.damage) {
                damage += rollDice(weapon.damage);
            }
        }

        // Stat bonus
        damage += Math.floor((this.stats.str - 10) / 2);

        // Apply modifiers
        damage *= this.damageModifier;

        return Math.floor(damage);
    }

    getDefense() {
        let defense = this.defense + this.bonusDefense;

        // Equipment defense
        for (const slot of EQUIP_SLOTS) {
            const item = this.equipment[slot];
            if (item && item.defense) {
                defense += item.defense;
            }
        }

        // Stat bonus
        defense += Math.floor((this.stats.con - 10) / 4);

        return defense;
    }

    getSpellPower() {
        let power = this.spellPower;
        power += (this.stats.int - 10) * 0.02;
        return power;
    }

    grantXp(amount) {
        this.xp += amount;

        while (this.xp >= this.xpToNext && this.level < GAME_CONSTANTS.MAX_LEVEL) {
            this.xp -= this.xpToNext;
            this.levelUp();
        }

        Events.emit(EVENTS.UI_UPDATE, {});
    }

    levelUp() {
        this.level++;
        this.xpToNext = xpForLevel(this.level);

        // Recalculate HP/MP
        const oldMaxHp = this.maxHp;
        const oldMaxMp = this.maxMp;
        this.recalculateStats();

        // Heal for the increase
        this.hp += this.maxHp - oldMaxHp;
        this.mp += this.maxMp - oldMaxMp;

        Events.emit(EVENTS.PLAYER_LEVELUP, { player: this, level: this.level });
        Events.emit(EVENTS.MESSAGE_ADD, {
            text: `Level up! You are now level ${this.level}`,
            type: 'pickup'
        });

        Audio.play('levelup');
    }

    useSkill(skillId, target = null) {
        const skillTree = SKILL_TREES[this.skillTree];
        const skill = skillTree[skillId];
        const rank = this.skills[skillId] || 0;

        if (!skill || rank === 0) return false;

        // Check if can use
        const check = canUseSkill(skill, this);
        if (!check.canUse) {
            Events.emit(EVENTS.MESSAGE_ADD, { text: check.reason, type: 'warning' });
            return false;
        }

        // Spend mana
        const manaCost = calculateSkillManaCost(skill, this, rank);
        this.mp -= manaCost;

        // Set cooldown
        if (skill.cooldown) {
            this.cooldowns.set(skillId, getSkillCooldown(skill, this));
        }

        // Execute skill
        const results = executeSkill(skill, this, target, rank, null);

        Events.emit(EVENTS.SKILL_USE, { player: this, skill, results });

        return true;
    }

    learnSkill(skillId) {
        const skillTree = SKILL_TREES[this.skillTree];
        const skill = skillTree[skillId];

        if (!skill) return false;

        const currentRank = this.skills[skillId] || 0;
        if (currentRank >= skill.maxRank) return false;

        this.skills[skillId] = currentRank + 1;

        Events.emit(EVENTS.SKILL_LEARN, { player: this, skill: skillId, rank: this.skills[skillId] });

        return true;
    }

    tickCooldowns() {
        for (const [skill, cooldown] of this.cooldowns) {
            if (cooldown > 0) {
                this.cooldowns.set(skill, cooldown - 1);
            } else {
                this.cooldowns.delete(skill);
            }
        }
    }

    tickHunger() {
        this.hunger -= GAME_CONSTANTS.HUNGER_RATE;

        if (this.hunger <= 0) {
            this.hunger = 0;
            // Starving - take damage
            this.takeDamage(1, null, 'starvation');
            Events.emit(EVENTS.MESSAGE_ADD, { text: 'You are starving!', type: 'warning' });
        } else if (this.hunger < 20) {
            Events.emit(EVENTS.MESSAGE_ADD, { text: 'You are very hungry!', type: 'warning' });
        }
    }

    tickRegen() {
        // HP regeneration
        if (this.hp < this.maxHp && this.hpRegen > 0) {
            this.hp = Math.min(this.maxHp, this.hp + this.hpRegen);
        }

        // MP regeneration
        if (this.mp < this.maxMp) {
            const baseRegen = 0.5 + Math.floor(this.stats.wis / 10);
            this.mp = Math.min(this.maxMp, this.mp + baseRegen + this.mpRegen);
        }
    }

    eat(food) {
        if (!food.nutrition) return false;

        this.hunger = Math.min(this.maxHunger, this.hunger + food.nutrition);

        Events.emit(EVENTS.MESSAGE_ADD, {
            text: `You eat the ${food.name}`,
            type: 'info'
        });

        // Some food has special effects
        if (food.risky && randomBool(0.2)) {
            StatusEffects.tryApply(this, 'POISON', 10);
        }

        return true;
    }

    rest() {
        // Heal over multiple turns
        if (this.hp < this.maxHp || this.mp < this.maxMp) {
            this.hp = Math.min(this.maxHp, this.hp + 2);
            this.mp = Math.min(this.maxMp, this.mp + 1);
            return true;
        }
        return false;
    }

    serialize() {
        return {
            ...super.serialize(),
            classId: this.classId,
            className: this.className,
            stats: { ...this.stats },
            level: this.level,
            xp: this.xp,
            xpToNext: this.xpToNext,
            maxHp: this.maxHp,
            maxMp: this.maxMp,
            mp: this.mp,
            hunger: this.hunger,
            equipment: deepClone(this.equipment),
            inventory: deepClone(this.inventory),
            gold: this.gold,
            keys: this.keys,
            skills: { ...this.skills },
            cooldowns: Array.from(this.cooldowns.entries()),
            kills: this.kills,
            floorsCleared: this.floorsCleared
        };
    }

    static deserialize(data) {
        const classData = CLASS_DATA[data.classId];
        const player = new Player(data.x, data.y, classData);

        Object.assign(player, data);
        player.cooldowns = new Map(data.cooldowns);
        player.statusEffects = new Map();

        return player;
    }
}
