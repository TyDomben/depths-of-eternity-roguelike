// Biome Definitions for Dungeon Generation

const BIOME_DATA = {
    crypt: {
        name: 'Ancient Crypt',
        floors: [1, 5],
        description: 'A dark tomb filled with the restless dead',
        theme: {
            wallColor: '#2a2a3a',
            floorColor: '#1a1a2a',
            accentColor: '#4a4a6a',
            ambientLight: 0.3
        },
        tiles: {
            wall: TILE_TYPES.WALL,
            floor: TILE_TYPES.FLOOR,
            special: [TILE_TYPES.ALTAR, TILE_TYPES.CHEST]
        },
        enemies: ['skeleton', 'skeletonWarrior', 'skeletonArcher', 'zombie', 'zombieHulk', 'ghoul', 'wight', 'wraith', 'mummy'],
        eliteChance: 0.1,
        boss: 'cryptLord',
        loot: {
            commonTypes: ['weapon', 'armor', 'potion'],
            specialItems: ['holyWater', 'silverWeapon'],
            goldMultiplier: 1.0
        },
        features: {
            coffins: true,
            cobwebs: true,
            bonesPiles: true,
            candles: true
        },
        hazards: ['trap', 'pit'],
        music: 'crypt_ambient',
        messages: [
            'The air smells of decay...',
            'You hear bones rattling in the distance...',
            'A cold wind chills you to the bone...'
        ]
    },

    fire: {
        name: 'Fire Caverns',
        floors: [6, 10],
        description: 'Volcanic caves filled with demons and flames',
        theme: {
            wallColor: '#3a2a1a',
            floorColor: '#2a1a0a',
            accentColor: '#ff4400',
            ambientLight: 0.5
        },
        tiles: {
            wall: TILE_TYPES.WALL,
            floor: TILE_TYPES.FLOOR,
            special: [TILE_TYPES.LAVA, TILE_TYPES.ALTAR]
        },
        enemies: ['imp', 'hellhound', 'fireElemental', 'demon', 'succubus', 'magmaSlime', 'salamander', 'phoenixHatchling'],
        eliteChance: 0.12,
        boss: 'infernoLord',
        loot: {
            commonTypes: ['weapon', 'armor', 'potion'],
            specialItems: ['fireResistRing', 'flameTongue'],
            goldMultiplier: 1.2
        },
        features: {
            lavaPools: true,
            fireGeysers: true,
            sulfurVents: true,
            obsidian: true
        },
        hazards: ['lava', 'fireGeyser'],
        environmentalDamage: { type: 'fire', damage: 2, message: 'The heat burns you!' },
        music: 'fire_ambient',
        messages: [
            'The heat is unbearable...',
            'Lava bubbles nearby...',
            'You smell sulfur and brimstone...'
        ]
    },

    ice: {
        name: 'Frozen Wastes',
        floors: [11, 15],
        description: 'Icy caverns where frost creatures dwell',
        theme: {
            wallColor: '#2a3a4a',
            floorColor: '#1a2a3a',
            accentColor: '#00ffff',
            ambientLight: 0.6
        },
        tiles: {
            wall: TILE_TYPES.WALL,
            floor: TILE_TYPES.FLOOR,
            special: [TILE_TYPES.ICE, TILE_TYPES.WATER]
        },
        enemies: ['iceSprite', 'frostWolf', 'yeti', 'iceElemental', 'frostGiant', 'iceWyrm', 'wendigo', 'snowman'],
        eliteChance: 0.12,
        boss: 'frostQueen',
        loot: {
            commonTypes: ['weapon', 'armor', 'potion'],
            specialItems: ['iceResistRing', 'frostbrand'],
            goldMultiplier: 1.3
        },
        features: {
            icicles: true,
            frozenPools: true,
            snowDrifts: true,
            iceCrystals: true
        },
        hazards: ['ice', 'freezingWater'],
        slippery: true,
        music: 'ice_ambient',
        messages: [
            'Your breath freezes in the air...',
            'Ice crunches beneath your feet...',
            'A bitter cold seeps into your bones...'
        ]
    },

    ruins: {
        name: 'Overgrown Ruins',
        floors: [16, 20],
        description: 'Ancient ruins reclaimed by nature',
        theme: {
            wallColor: '#2a3a2a',
            floorColor: '#1a2a1a',
            accentColor: '#00ff00',
            ambientLight: 0.4
        },
        tiles: {
            wall: TILE_TYPES.WALL,
            floor: TILE_TYPES.GRASS,
            special: [TILE_TYPES.WATER, TILE_TYPES.FOUNTAIN]
        },
        enemies: ['giantSpider', 'giantAnt', 'antQueen', 'vineCreeper', 'treant', 'sporeCloud', 'mantis', 'beetle', 'druid'],
        eliteChance: 0.12,
        boss: 'worldTree',
        loot: {
            commonTypes: ['weapon', 'armor', 'food'],
            specialItems: ['antidote', 'natureBow'],
            goldMultiplier: 1.1
        },
        features: {
            vines: true,
            mushrooms: true,
            flowers: true,
            roots: true
        },
        hazards: ['poisonPlant', 'web'],
        music: 'nature_ambient',
        messages: [
            'Vines creep along the walls...',
            'Strange plants grow in the darkness...',
            'You hear insects buzzing...'
        ]
    },

    crystal: {
        name: 'Crystal Caves',
        floors: [21, 25],
        description: 'Glittering caverns of gems and stone',
        theme: {
            wallColor: '#3a3a4a',
            floorColor: '#2a2a3a',
            accentColor: '#e0ffff',
            ambientLight: 0.5
        },
        tiles: {
            wall: TILE_TYPES.WALL,
            floor: TILE_TYPES.FLOOR,
            special: [TILE_TYPES.CHEST, TILE_TYPES.ALTAR]
        },
        enemies: ['stoneGolem', 'crystalGolem', 'earthElemental', 'gemBeetle', 'caveBat', 'rockworm', 'gargoyle'],
        eliteChance: 0.15,
        boss: 'crystalKing',
        loot: {
            commonTypes: ['weapon', 'armor', 'ring'],
            specialItems: ['gemstone', 'crystalShard'],
            goldMultiplier: 1.5
        },
        features: {
            crystals: true,
            geodes: true,
            stalactites: true,
            gemDeposits: true
        },
        hazards: ['fallingRocks', 'crystalShards'],
        music: 'crystal_ambient',
        messages: [
            'Crystals glitter in the darkness...',
            'The walls shimmer with gemstones...',
            'You hear stone grinding...'
        ]
    },

    library: {
        name: 'Haunted Library',
        floors: [26, 30],
        description: 'A vast library haunted by spirits',
        theme: {
            wallColor: '#3a2a2a',
            floorColor: '#2a1a1a',
            accentColor: '#f0f8ff',
            ambientLight: 0.3
        },
        tiles: {
            wall: TILE_TYPES.WALL,
            floor: TILE_TYPES.FLOOR,
            special: [TILE_TYPES.CHEST, TILE_TYPES.ALTAR]
        },
        enemies: ['ghost', 'poltergeist', 'phantom', 'animatedBook', 'illusionist', 'banshee', 'specter'],
        eliteChance: 0.15,
        boss: 'archLibrarian',
        loot: {
            commonTypes: ['scroll', 'tome', 'potion'],
            specialItems: ['spellbook', 'enchantedQuill'],
            goldMultiplier: 1.3
        },
        features: {
            bookshelves: true,
            readingDesks: true,
            candelabras: true,
            scrollRacks: true
        },
        hazards: ['cursedBook', 'illusion'],
        music: 'library_ambient',
        messages: [
            'Pages rustle in an unfelt breeze...',
            'Whispers echo from the shadows...',
            'Books float off the shelves...'
        ]
    },

    flooded: {
        name: 'Flooded Depths',
        floors: [31, 35],
        description: 'Submerged passages filled with sea horrors',
        theme: {
            wallColor: '#1a2a3a',
            floorColor: '#0a1a2a',
            accentColor: '#1e90ff',
            ambientLight: 0.3
        },
        tiles: {
            wall: TILE_TYPES.WALL,
            floor: TILE_TYPES.FLOOR,
            special: [TILE_TYPES.WATER, TILE_TYPES.FOUNTAIN]
        },
        enemies: ['piranha', 'giantCrab', 'waterElemental', 'merfolk', 'merfolkMage', 'giantOctopus', 'seaSerpent', 'drownedOne'],
        eliteChance: 0.15,
        boss: 'krakenPrime',
        loot: {
            commonTypes: ['weapon', 'armor', 'potion'],
            specialItems: ['waterBreathing', 'trident'],
            goldMultiplier: 1.4
        },
        features: {
            waterPools: true,
            seaweed: true,
            coral: true,
            shipwrecks: true
        },
        hazards: ['deepWater', 'whirlpool'],
        waterLevel: 0.3,
        music: 'underwater_ambient',
        messages: [
            'Water drips from above...',
            'You hear waves in the distance...',
            'The air is thick with moisture...'
        ]
    },

    temple: {
        name: 'Corrupted Temple',
        floors: [36, 40],
        description: 'A once-holy place now defiled by darkness',
        theme: {
            wallColor: '#2a1a2a',
            floorColor: '#1a0a1a',
            accentColor: '#800080',
            ambientLight: 0.3
        },
        tiles: {
            wall: TILE_TYPES.WALL,
            floor: TILE_TYPES.FLOOR,
            special: [TILE_TYPES.ALTAR, TILE_TYPES.PORTAL]
        },
        enemies: ['cultist', 'cultistMage', 'darkPriest', 'shadowFiend', 'darkKnight', 'demonSummoner', 'corruptedAngel', 'voidTentacle'],
        eliteChance: 0.18,
        boss: 'highProphet',
        loot: {
            commonTypes: ['weapon', 'armor', 'scroll'],
            specialItems: ['darkRelic', 'corruptedIdol'],
            goldMultiplier: 1.5
        },
        features: {
            altars: true,
            bloodStains: true,
            ritual circles: true,
            statues: true
        },
        hazards: ['trap', 'darkMagic'],
        music: 'temple_ambient',
        messages: [
            'Dark whispers fill your mind...',
            'The stench of corruption is overwhelming...',
            'Unholy symbols cover the walls...'
        ]
    },

    mechanical: {
        name: 'Mechanical Dungeon',
        floors: [41, 45],
        description: 'An ancient automated complex',
        theme: {
            wallColor: '#3a3a3a',
            floorColor: '#2a2a2a',
            accentColor: '#ffd700',
            ambientLight: 0.5
        },
        tiles: {
            wall: TILE_TYPES.WALL,
            floor: TILE_TYPES.FLOOR,
            special: [TILE_TYPES.TRAP, TILE_TYPES.CHEST]
        },
        enemies: ['clockworkSoldier', 'steamGolem', 'turret', 'droneBomber', 'repairBot', 'shockDrone', 'giantMech', 'laserDrone'],
        eliteChance: 0.18,
        boss: 'primeCore',
        loot: {
            commonTypes: ['weapon', 'armor', 'misc'],
            specialItems: ['gears', 'powerCore'],
            goldMultiplier: 1.6
        },
        features: {
            gears: true,
            pipes: true,
            conveyorBelts: true,
            terminals: true
        },
        hazards: ['electricFloor', 'steamVent', 'crusher'],
        music: 'mechanical_ambient',
        messages: [
            'Gears grind in the walls...',
            'Steam hisses from pipes...',
            'You hear mechanical whirring...'
        ]
    },

    void: {
        name: 'Void Realm',
        floors: [46, 50],
        description: 'The edge of reality itself',
        theme: {
            wallColor: '#1a0a1a',
            floorColor: '#0a0015',
            accentColor: '#9400d3',
            ambientLight: 0.2
        },
        tiles: {
            wall: TILE_TYPES.WALL,
            floor: TILE_TYPES.FLOOR,
            special: [TILE_TYPES.PORTAL, TILE_TYPES.PIT]
        },
        enemies: ['voidling', 'eyeTyrant', 'mindFlayer', 'starSpawn', 'voidWalker', 'cosmicHorror', 'dimensionalShambler', 'eldritch'],
        eliteChance: 0.2,
        boss: 'voidEmperor',
        loot: {
            commonTypes: ['artifact', 'scroll', 'ring'],
            specialItems: ['voidShard', 'cosmicEssence'],
            goldMultiplier: 2.0
        },
        features: {
            portals: true,
            voidRifts: true,
            floatingRocks: true,
            tentacles: true
        },
        hazards: ['voidRift', 'madness', 'gravity'],
        warpsReality: true,
        music: 'void_ambient',
        messages: [
            'Reality bends around you...',
            'You feel your sanity slipping...',
            'Stars blink in impossible patterns...'
        ]
    }
};

// Get biome for floor number
function getBiomeForFloor(floor) {
    for (const [key, biome] of Object.entries(BIOME_DATA)) {
        if (floor >= biome.floors[0] && floor <= biome.floors[1]) {
            return { key, ...biome };
        }
    }
    return { key: 'void', ...BIOME_DATA.void };
}

// Get enemies for biome with depth scaling
function getEnemiesForFloor(floor, rng) {
    const biome = getBiomeForFloor(floor);
    const baseEnemies = biome.enemies;

    // Scale enemy count and types based on floor within biome
    const floorInBiome = floor - biome.floors[0];
    const enemies = [];

    // More enemies on later floors
    const count = 8 + Math.floor(floorInBiome * 1.5) + rng.int(0, 3);

    for (let i = 0; i < count; i++) {
        const enemyType = rng.pick(baseEnemies);
        const enemy = deepClone(ENEMY_DATA[enemyType]);

        // Scale stats based on floor
        const scaling = 1 + (floor - 1) * 0.05;
        enemy.hp = Math.floor(enemy.hp * scaling);
        enemy.attack = Math.floor(enemy.attack * scaling);
        enemy.defense = Math.floor(enemy.defense * scaling);
        enemy.xp = Math.floor(enemy.xp * scaling);

        // Chance for elite
        if (rng.bool(biome.eliteChance)) {
            const modifierKeys = Object.keys(ELITE_MODIFIERS);
            enemy.elite = rng.pick(modifierKeys);
        }

        enemies.push(enemy);
    }

    return enemies;
}

// Get boss for floor
function getBossForFloor(floor) {
    const biome = getBiomeForFloor(floor);
    if (floor === biome.floors[1] && biome.boss) {
        return deepClone(ENEMY_DATA[biome.boss]);
    }
    return null;
}
