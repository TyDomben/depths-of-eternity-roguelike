// Enemy Entity Class

class Enemy extends Entity {
    constructor(x, y, data) {
        super(x, y, data);

        this.type = data.type || 'unknown';
        this.data = data;

        // Combat stats
        this.attack = data.attack || 5;
        this.defense = data.defense || 2;
        this.xp = data.xp || 10;
        this.speed = data.speed || 100;

        // Behavior
        this.behavior = data.behavior || 'melee';
        this.range = data.range || 1;
        this.spells = data.spells || [];

        // AI state
        this.alerted = false;
        this.lastSeenPlayer = null;
        this.summoner = null;

        // Special properties
        this.boss = data.boss || false;
        this.elite = data.elite || false;
        this.eliteType = data.eliteType || null;

        // Abilities
        this.phasing = data.phasing || false;
        this.flying = data.flying || false;
        this.teleport = data.teleport || false;
        this.lifesteal = data.lifesteal || 0;

        // Damage types
        this.fireDamage = data.fireDamage || 0;
        this.iceDamage = data.iceDamage || 0;
        this.lightningDamage = data.lightningDamage || 0;
        this.poisonDamage = data.poisonDamage || 0;
        this.holyDamage = data.holyDamage || 0;

        // Resistances/Immunities
        this.fireImmune = data.fireImmune || false;
        this.iceImmune = data.iceImmune || false;
        this.poisonImmune = data.poisonImmune || false;
        this.magicRes = data.magicRes || 0;

        // Status effects
        this.statusEffects = new Map();

        // Loot
        this.drops = data.drops || null;

        // For summons
        this.summons = data.summons || null;
    }

    getAttackDamage() {
        let damage = this.attack;

        // Apply damage modifier
        if (this.damageModifier) {
            damage *= this.damageModifier;
        }

        return Math.floor(damage);
    }

    getElementalDamage() {
        const elemental = {};
        if (this.fireDamage) elemental.fire = this.fireDamage;
        if (this.iceDamage) elemental.ice = this.iceDamage;
        if (this.lightningDamage) elemental.lightning = this.lightningDamage;
        if (this.poisonDamage) elemental.poison = this.poisonDamage;
        if (this.holyDamage) elemental.holy = this.holyDamage;
        return elemental;
    }

    getResistance(damageType) {
        if (damageType === 'fire' && this.fireImmune) return 100;
        if (damageType === 'ice' && this.iceImmune) return 100;
        if (damageType === 'poison' && this.poisonImmune) return 100;

        if (['arcane', 'holy', 'dark'].includes(damageType)) {
            return this.magicRes || 0;
        }

        return 0;
    }

    // Create elite variant
    static createElite(baseData, modifierType, rng) {
        const modifier = ELITE_MODIFIERS[modifierType];
        if (!modifier) return new Enemy(0, 0, baseData);

        const eliteData = deepClone(baseData);
        eliteData.name = `${modifier.name} ${eliteData.name}`;
        eliteData.elite = true;
        eliteData.eliteType = modifierType;

        // Apply modifier stats
        if (modifier.hpMult) eliteData.hp = Math.floor(eliteData.hp * modifier.hpMult);
        if (modifier.attackMult) eliteData.attack = Math.floor(eliteData.attack * modifier.attackMult);
        if (modifier.defenseMult) eliteData.defense = Math.floor(eliteData.defense * modifier.defenseMult);
        if (modifier.speedMult) eliteData.speed = Math.floor(eliteData.speed * modifier.speedMult);
        eliteData.xp = Math.floor(eliteData.xp * (modifier.xpMult || 2));

        // Copy special properties
        if (modifier.lifesteal) eliteData.lifesteal = modifier.lifesteal;
        if (modifier.reflect) eliteData.reflect = modifier.reflect;
        if (modifier.teleport) eliteData.teleport = modifier.teleport;
        if (modifier.split) eliteData.split = modifier.split;

        return new Enemy(0, 0, eliteData);
    }

    // Create scaled enemy for floor
    static createScaled(baseData, floor) {
        const scaledData = deepClone(baseData);
        const scaling = 1 + (floor - 1) * 0.05;

        scaledData.hp = Math.floor(scaledData.hp * scaling);
        scaledData.maxHp = scaledData.hp;
        scaledData.attack = Math.floor(scaledData.attack * scaling);
        scaledData.defense = Math.floor(scaledData.defense * scaling);
        scaledData.xp = Math.floor(scaledData.xp * scaling);

        return new Enemy(0, 0, scaledData);
    }

    serialize() {
        return {
            ...super.serialize(),
            type: this.type,
            attack: this.attack,
            defense: this.defense,
            xp: this.xp,
            speed: this.speed,
            behavior: this.behavior,
            alerted: this.alerted,
            boss: this.boss,
            elite: this.elite,
            eliteType: this.eliteType
        };
    }

    static deserialize(data) {
        const enemyData = ENEMY_DATA[data.type] || {};
        const enemy = new Enemy(data.x, data.y, { ...enemyData, ...data });
        enemy.statusEffects = new Map();
        return enemy;
    }
}

// Enemy spawning helpers
function spawnEnemiesForFloor(floor, map, rng) {
    const biome = getBiomeForFloor(floor);
    const enemies = [];

    // Calculate enemy count based on floor
    const baseCount = 8 + Math.floor(floor / 2);
    const count = baseCount + rng.int(-2, 3);

    // Get valid enemy types for biome
    const enemyTypes = biome.enemies || ['skeleton'];

    for (let i = 0; i < count; i++) {
        const type = rng.pick(enemyTypes);
        const baseData = ENEMY_DATA[type];

        if (!baseData) continue;

        // Scale enemy
        const enemy = Enemy.createScaled({ ...baseData, type }, floor);

        // Chance for elite
        if (rng.bool(biome.eliteChance || 0.1)) {
            const modifierKeys = Object.keys(ELITE_MODIFIERS);
            const modifier = rng.pick(modifierKeys);
            const eliteEnemy = Enemy.createElite(enemy.data, modifier, rng);
            eliteEnemy.x = 0;
            eliteEnemy.y = 0;
            enemies.push(eliteEnemy);
        } else {
            enemies.push(enemy);
        }
    }

    // Place enemies in rooms (not the first room)
    const rooms = map.rooms.slice(1);
    for (const enemy of enemies) {
        const room = rng.pick(rooms);
        if (room) {
            const pos = getSpawnPositionInRoom(room, map, enemies, rng);
            enemy.x = pos.x;
            enemy.y = pos.y;
        }
    }

    return enemies;
}

function spawnBossForFloor(floor, map, rng) {
    const boss = getBossForFloor(floor);
    if (!boss) return null;

    const bossEnemy = new Enemy(0, 0, { ...boss, type: boss.name.toLowerCase().replace(/\s/g, '') });

    // Place boss in last room
    const lastRoom = map.rooms[map.rooms.length - 1];
    if (lastRoom) {
        bossEnemy.x = lastRoom.center.x;
        bossEnemy.y = lastRoom.center.y;
    }

    return bossEnemy;
}

function getSpawnPositionInRoom(room, map, existingEnemies, rng) {
    const attempts = 20;

    for (let i = 0; i < attempts; i++) {
        const x = rng.int(room.x + 1, room.x + room.width - 2);
        const y = rng.int(room.y + 1, room.y + room.height - 2);

        // Check if floor tile
        if (map.tiles[y][x] !== TILE_TYPES.FLOOR) continue;

        // Check if not occupied
        const occupied = existingEnemies.some(e => e.x === x && e.y === y);
        if (occupied) continue;

        return { x, y };
    }

    return room.center;
}
