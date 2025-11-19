// Enemy Data Definitions

const ENEMY_DATA = {
    // ===== ANCIENT CRYPT (Undead) =====
    skeleton: { name: 'Skeleton', char: 's', color: '#ffffff', hp: 15, attack: 4, defense: 2, xp: 10, speed: 90, behavior: 'melee', biome: 'crypt' },
    skeletonWarrior: { name: 'Skeleton Warrior', char: 'S', color: '#cccccc', hp: 30, attack: 8, defense: 5, xp: 25, speed: 85, behavior: 'melee', biome: 'crypt' },
    skeletonArcher: { name: 'Skeleton Archer', char: 's', color: '#aaaaaa', hp: 12, attack: 6, defense: 1, xp: 15, speed: 95, behavior: 'ranged', range: 6, biome: 'crypt' },
    skeletonMage: { name: 'Skeleton Mage', char: 's', color: '#9932cc', hp: 10, attack: 3, defense: 1, xp: 20, speed: 90, behavior: 'caster', spells: ['darkBolt'], biome: 'crypt' },
    zombie: { name: 'Zombie', char: 'z', color: '#556b2f', hp: 25, attack: 5, defense: 3, xp: 12, speed: 60, behavior: 'melee', effect: 'poison', biome: 'crypt' },
    zombieHulk: { name: 'Zombie Hulk', char: 'Z', color: '#3d5c2f', hp: 60, attack: 12, defense: 6, xp: 40, speed: 50, behavior: 'melee', biome: 'crypt' },
    ghoul: { name: 'Ghoul', char: 'g', color: '#8b8b83', hp: 20, attack: 7, defense: 2, xp: 18, speed: 100, behavior: 'melee', effect: 'paralyze', biome: 'crypt' },
    wight: { name: 'Wight', char: 'w', color: '#4a4a4a', hp: 35, attack: 9, defense: 4, xp: 30, speed: 95, behavior: 'melee', drain: true, biome: 'crypt' },
    wraith: { name: 'Wraith', char: 'W', color: '#2f2f4f', hp: 25, attack: 10, defense: 2, xp: 35, speed: 110, behavior: 'melee', phasing: true, biome: 'crypt' },
    vampire: { name: 'Vampire', char: 'V', color: '#8b0000', hp: 45, attack: 12, defense: 5, xp: 50, speed: 105, behavior: 'melee', lifesteal: 0.3, biome: 'crypt' },
    lich: { name: 'Lich', char: 'L', color: '#9400d3', hp: 60, attack: 8, defense: 6, xp: 80, speed: 90, behavior: 'caster', spells: ['darkBolt', 'curse', 'summonUndead'], boss: false, biome: 'crypt' },
    mummy: { name: 'Mummy', char: 'm', color: '#f5deb3', hp: 40, attack: 8, defense: 7, xp: 35, speed: 70, behavior: 'melee', curse: true, biome: 'crypt' },
    bonePile: { name: 'Bone Pile', char: 'p', color: '#f5f5dc', hp: 10, attack: 0, defense: 0, xp: 5, speed: 0, behavior: 'spawner', spawns: 'skeleton', biome: 'crypt' },
    deathKnight: { name: 'Death Knight', char: 'K', color: '#1a1a1a', hp: 55, attack: 14, defense: 8, xp: 65, speed: 80, behavior: 'melee', lifesteal: 0.2, biome: 'crypt' },
    crawlingClaw: { name: 'Crawling Claw', char: 'c', color: '#dcdcdc', hp: 8, attack: 4, defense: 1, xp: 6, speed: 110, behavior: 'melee', swarm: true, biome: 'crypt' },

    // ===== FIRE CAVERNS (Demons & Fire) =====
    imp: { name: 'Imp', char: 'i', color: '#ff4500', hp: 12, attack: 5, defense: 1, xp: 12, speed: 120, behavior: 'caster', spells: ['fireBolt'], biome: 'fire' },
    hellhound: { name: 'Hellhound', char: 'h', color: '#ff6600', hp: 25, attack: 8, defense: 3, xp: 22, speed: 115, behavior: 'melee', fireDamage: 3, biome: 'fire' },
    fireElemental: { name: 'Fire Elemental', char: 'E', color: '#ff4400', hp: 35, attack: 10, defense: 4, xp: 35, speed: 100, behavior: 'melee', fireImmune: true, fireDamage: 5, biome: 'fire' },
    demon: { name: 'Demon', char: 'd', color: '#8b0000', hp: 40, attack: 12, defense: 5, xp: 45, speed: 95, behavior: 'melee', fireRes: 50, biome: 'fire' },
    succubus: { name: 'Succubus', char: 's', color: '#ff69b4', hp: 30, attack: 8, defense: 3, xp: 40, speed: 105, behavior: 'caster', spells: ['charm', 'drainLife'], biome: 'fire' },
    balrog: { name: 'Balrog', char: 'B', color: '#ff0000', hp: 80, attack: 18, defense: 8, xp: 100, speed: 85, behavior: 'melee', fireImmune: true, fireDamage: 10, biome: 'fire' },
    magmaSlime: { name: 'Magma Slime', char: 'j', color: '#ff6600', hp: 20, attack: 6, defense: 2, xp: 15, speed: 70, behavior: 'melee', split: true, fireDamage: 3, biome: 'fire' },
    salamander: { name: 'Salamander', char: 'S', color: '#ff8c00', hp: 35, attack: 10, defense: 4, xp: 30, speed: 100, behavior: 'melee', fireImmune: true, biome: 'fire' },
    phoenixHatchling: { name: 'Phoenix Hatchling', char: 'p', color: '#ffd700', hp: 25, attack: 8, defense: 2, xp: 35, speed: 110, behavior: 'melee', resurrect: true, biome: 'fire' },
    lavaBeast: { name: 'Lava Beast', char: 'L', color: '#ff3300', hp: 45, attack: 11, defense: 5, xp: 38, speed: 85, behavior: 'melee', fireImmune: true, lavaWalk: true, biome: 'fire' },
    ashWraith: { name: 'Ash Wraith', char: 'a', color: '#4a4a4a', hp: 22, attack: 8, defense: 2, xp: 20, speed: 100, behavior: 'melee', phasing: true, fireDamage: 3, biome: 'fire' },

    // ===== FROZEN WASTES (Ice Creatures) =====
    iceSprite: { name: 'Ice Sprite', char: 'i', color: '#00ffff', hp: 10, attack: 4, defense: 1, xp: 10, speed: 125, behavior: 'caster', spells: ['frostBolt'], biome: 'ice' },
    frostWolf: { name: 'Frost Wolf', char: 'w', color: '#87ceeb', hp: 22, attack: 7, defense: 3, xp: 18, speed: 110, behavior: 'melee', pack: true, biome: 'ice' },
    yeti: { name: 'Yeti', char: 'Y', color: '#ffffff', hp: 50, attack: 14, defense: 6, xp: 45, speed: 80, behavior: 'melee', iceDamage: 5, biome: 'ice' },
    iceElemental: { name: 'Ice Elemental', char: 'E', color: '#00ffff', hp: 35, attack: 10, defense: 5, xp: 35, speed: 90, behavior: 'melee', iceImmune: true, iceDamage: 5, biome: 'ice' },
    frostGiant: { name: 'Frost Giant', char: 'G', color: '#b0e0e6', hp: 70, attack: 16, defense: 7, xp: 60, speed: 75, behavior: 'melee', iceDamage: 8, biome: 'ice' },
    iceWyrm: { name: 'Ice Wyrm', char: 'D', color: '#e0ffff', hp: 55, attack: 12, defense: 6, xp: 50, speed: 95, behavior: 'ranged', breath: 'ice', biome: 'ice' },
    wendigo: { name: 'Wendigo', char: 'W', color: '#dcdcdc', hp: 45, attack: 13, defense: 4, xp: 55, speed: 105, behavior: 'melee', fear: true, biome: 'ice' },
    snowman: { name: 'Animated Snowman', char: 's', color: '#ffffff', hp: 15, attack: 5, defense: 2, xp: 12, speed: 85, behavior: 'melee', biome: 'ice' },
    iceMephit: { name: 'Ice Mephit', char: 'm', color: '#b0e0e6', hp: 14, attack: 5, defense: 2, xp: 14, speed: 115, behavior: 'caster', spells: ['frostBolt'], biome: 'ice' },
    polarBear: { name: 'Polar Bear', char: 'B', color: '#fffafa', hp: 40, attack: 11, defense: 5, xp: 32, speed: 90, behavior: 'melee', biome: 'ice' },

    // ===== OVERGROWN RUINS (Plants & Insects) =====
    giantSpider: { name: 'Giant Spider', char: 's', color: '#8b4513', hp: 18, attack: 6, defense: 2, xp: 15, speed: 105, behavior: 'melee', effect: 'poison', web: true, biome: 'ruins' },
    giantAnt: { name: 'Giant Ant', char: 'a', color: '#8b0000', hp: 12, attack: 5, defense: 3, xp: 10, speed: 100, behavior: 'melee', swarm: true, biome: 'ruins' },
    antQueen: { name: 'Ant Queen', char: 'Q', color: '#ff0000', hp: 50, attack: 8, defense: 6, xp: 50, speed: 70, behavior: 'summoner', summons: 'giantAnt', biome: 'ruins' },
    vineCreeper: { name: 'Vine Creeper', char: 'v', color: '#228b22', hp: 25, attack: 7, defense: 3, xp: 18, speed: 80, behavior: 'melee', grapple: true, biome: 'ruins' },
    treant: { name: 'Treant', char: 'T', color: '#006400', hp: 60, attack: 12, defense: 8, xp: 45, speed: 60, behavior: 'melee', fireWeak: true, biome: 'ruins' },
    sporeCloud: { name: 'Spore Cloud', char: 'S', color: '#9acd32', hp: 20, attack: 0, defense: 1, xp: 20, speed: 90, behavior: 'passive', aura: 'poison', biome: 'ruins' },
    mantis: { name: 'Giant Mantis', char: 'M', color: '#00ff00', hp: 30, attack: 12, defense: 3, xp: 30, speed: 110, behavior: 'melee', critBonus: 0.2, biome: 'ruins' },
    beetle: { name: 'Giant Beetle', char: 'b', color: '#4b0082', hp: 35, attack: 8, defense: 7, xp: 25, speed: 75, behavior: 'melee', biome: 'ruins' },
    druid: { name: 'Corrupted Druid', char: 'd', color: '#228b22', hp: 30, attack: 6, defense: 3, xp: 35, speed: 95, behavior: 'caster', spells: ['entangle', 'heal', 'summonBeast'], biome: 'ruins' },

    // ===== CRYSTAL CAVES (Golems & Earth) =====
    stoneGolem: { name: 'Stone Golem', char: 'G', color: '#808080', hp: 50, attack: 10, defense: 10, xp: 40, speed: 60, behavior: 'melee', biome: 'crystal' },
    crystalGolem: { name: 'Crystal Golem', char: 'G', color: '#e0ffff', hp: 45, attack: 12, defense: 8, xp: 45, speed: 70, behavior: 'melee', magicRes: 50, biome: 'crystal' },
    earthElemental: { name: 'Earth Elemental', char: 'E', color: '#8b4513', hp: 40, attack: 10, defense: 9, xp: 35, speed: 65, behavior: 'melee', earthquake: true, biome: 'crystal' },
    gemBeetle: { name: 'Gem Beetle', char: 'b', color: '#00ffff', hp: 20, attack: 6, defense: 6, xp: 20, speed: 90, behavior: 'melee', valuable: true, biome: 'crystal' },
    caveBat: { name: 'Cave Bat', char: 'b', color: '#4a4a4a', hp: 8, attack: 3, defense: 1, xp: 5, speed: 130, behavior: 'melee', swarm: true, biome: 'crystal' },
    rockworm: { name: 'Rockworm', char: 'w', color: '#696969', hp: 30, attack: 8, defense: 5, xp: 25, speed: 75, behavior: 'melee', burrow: true, biome: 'crystal' },
    gargoyle: { name: 'Gargoyle', char: 'g', color: '#808080', hp: 35, attack: 9, defense: 7, xp: 30, speed: 100, behavior: 'melee', flying: true, biome: 'crystal' },

    // ===== HAUNTED LIBRARY (Ghosts & Illusions) =====
    ghost: { name: 'Ghost', char: 'g', color: '#add8e6', hp: 15, attack: 6, defense: 0, xp: 18, speed: 100, behavior: 'melee', phasing: true, biome: 'library' },
    poltergeist: { name: 'Poltergeist', char: 'p', color: '#b0c4de', hp: 20, attack: 8, defense: 0, xp: 25, speed: 110, behavior: 'ranged', telekinesis: true, biome: 'library' },
    phantom: { name: 'Phantom', char: 'P', color: '#778899', hp: 30, attack: 10, defense: 0, xp: 35, speed: 105, behavior: 'melee', phasing: true, drain: true, biome: 'library' },
    animatedBook: { name: 'Animated Book', char: 'b', color: '#8b4513', hp: 12, attack: 4, defense: 2, xp: 10, speed: 100, behavior: 'caster', spells: ['randomSpell'], biome: 'library' },
    illusionist: { name: 'Illusionist', char: 'I', color: '#ff00ff', hp: 25, attack: 5, defense: 2, xp: 30, speed: 95, behavior: 'caster', spells: ['illusion', 'confusion', 'invisibility'], biome: 'library' },
    banshee: { name: 'Banshee', char: 'B', color: '#f0f8ff', hp: 30, attack: 8, defense: 2, xp: 40, speed: 100, behavior: 'caster', spells: ['wail'], fear: true, biome: 'library' },
    specter: { name: 'Specter', char: 'S', color: '#dcdcdc', hp: 25, attack: 9, defense: 0, xp: 35, speed: 115, behavior: 'melee', phasing: true, biome: 'library' },

    // ===== FLOODED DEPTHS (Sea Creatures) =====
    piranha: { name: 'Piranha Swarm', char: 'f', color: '#ff4500', hp: 15, attack: 8, defense: 1, xp: 12, speed: 120, behavior: 'melee', swarm: true, biome: 'flooded' },
    giantCrab: { name: 'Giant Crab', char: 'c', color: '#ff6347', hp: 30, attack: 9, defense: 8, xp: 25, speed: 70, behavior: 'melee', biome: 'flooded' },
    waterElemental: { name: 'Water Elemental', char: 'E', color: '#1e90ff', hp: 35, attack: 8, defense: 4, xp: 30, speed: 100, behavior: 'melee', waterOnly: false, biome: 'flooded' },
    merfolk: { name: 'Merfolk', char: 'm', color: '#20b2aa', hp: 25, attack: 7, defense: 3, xp: 20, speed: 105, behavior: 'melee', biome: 'flooded' },
    merfolkMage: { name: 'Merfolk Mage', char: 'M', color: '#00ced1', hp: 20, attack: 5, defense: 2, xp: 30, speed: 95, behavior: 'caster', spells: ['waterBolt', 'heal'], biome: 'flooded' },
    giantOctopus: { name: 'Giant Octopus', char: 'O', color: '#483d8b', hp: 45, attack: 10, defense: 4, xp: 40, speed: 85, behavior: 'melee', grapple: true, ink: true, biome: 'flooded' },
    seaSerpent: { name: 'Sea Serpent', char: 'S', color: '#2f4f4f', hp: 55, attack: 14, defense: 5, xp: 55, speed: 95, behavior: 'melee', biome: 'flooded' },
    drownedOne: { name: 'Drowned One', char: 'd', color: '#4682b4', hp: 30, attack: 8, defense: 3, xp: 25, speed: 80, behavior: 'melee', undead: true, biome: 'flooded' },

    // ===== CORRUPTED TEMPLE (Cultists & Dark Magic) =====
    cultist: { name: 'Cultist', char: 'c', color: '#800000', hp: 18, attack: 6, defense: 2, xp: 15, speed: 100, behavior: 'melee', biome: 'temple' },
    cultistMage: { name: 'Cultist Mage', char: 'C', color: '#4b0082', hp: 15, attack: 4, defense: 1, xp: 25, speed: 95, behavior: 'caster', spells: ['darkBolt', 'curse'], biome: 'temple' },
    darkPriest: { name: 'Dark Priest', char: 'P', color: '#800080', hp: 30, attack: 6, defense: 3, xp: 40, speed: 90, behavior: 'support', spells: ['heal', 'buff', 'curse'], biome: 'temple' },
    shadowFiend: { name: 'Shadow Fiend', char: 'f', color: '#2f2f2f', hp: 25, attack: 10, defense: 2, xp: 30, speed: 110, behavior: 'melee', biome: 'temple' },
    darkKnight: { name: 'Dark Knight', char: 'K', color: '#1a1a1a', hp: 45, attack: 12, defense: 8, xp: 45, speed: 85, behavior: 'melee', biome: 'temple' },
    demonSummoner: { name: 'Demon Summoner', char: 'S', color: '#8b0000', hp: 25, attack: 5, defense: 2, xp: 50, speed: 90, behavior: 'summoner', summons: 'imp', biome: 'temple' },
    corruptedAngel: { name: 'Corrupted Angel', char: 'A', color: '#4a4a4a', hp: 50, attack: 14, defense: 6, xp: 60, speed: 100, behavior: 'melee', flying: true, biome: 'temple' },
    voidTentacle: { name: 'Void Tentacle', char: 't', color: '#4b0082', hp: 20, attack: 8, defense: 3, xp: 20, speed: 80, behavior: 'melee', grapple: true, biome: 'temple' },

    // ===== MECHANICAL DUNGEON (Constructs) =====
    clockworkSoldier: { name: 'Clockwork Soldier', char: 'C', color: '#b8860b', hp: 30, attack: 8, defense: 6, xp: 25, speed: 90, behavior: 'melee', biome: 'mechanical' },
    steamGolem: { name: 'Steam Golem', char: 'G', color: '#808080', hp: 50, attack: 12, defense: 8, xp: 45, speed: 75, behavior: 'melee', steam: true, biome: 'mechanical' },
    turret: { name: 'Turret', char: 'T', color: '#888888', hp: 25, attack: 10, defense: 10, xp: 30, speed: 0, behavior: 'turret', range: 8, biome: 'mechanical' },
    droneBomber: { name: 'Drone Bomber', char: 'd', color: '#cd853f', hp: 15, attack: 15, defense: 1, xp: 25, speed: 120, behavior: 'suicide', biome: 'mechanical' },
    repairBot: { name: 'Repair Bot', char: 'r', color: '#00ff00', hp: 20, attack: 3, defense: 3, xp: 20, speed: 100, behavior: 'support', heal: true, biome: 'mechanical' },
    shockDrone: { name: 'Shock Drone', char: 'd', color: '#ffff00', hp: 18, attack: 8, defense: 2, xp: 22, speed: 110, behavior: 'ranged', lightningDamage: 5, biome: 'mechanical' },
    giantMech: { name: 'Giant Mech', char: 'M', color: '#696969', hp: 80, attack: 16, defense: 10, xp: 70, speed: 60, behavior: 'melee', biome: 'mechanical' },
    laserDrone: { name: 'Laser Drone', char: 'l', color: '#ff0000', hp: 12, attack: 12, defense: 1, xp: 25, speed: 105, behavior: 'ranged', piercing: true, biome: 'mechanical' },

    // ===== VOID REALM (Cosmic Horrors) =====
    voidling: { name: 'Voidling', char: 'v', color: '#9400d3', hp: 20, attack: 7, defense: 2, xp: 20, speed: 100, behavior: 'melee', biome: 'void' },
    eyeTyrant: { name: 'Eye Tyrant', char: 'e', color: '#ff00ff', hp: 35, attack: 10, defense: 3, xp: 45, speed: 90, behavior: 'caster', spells: ['disintegrate', 'charm', 'fear'], biome: 'void' },
    mindFlayer: { name: 'Mind Flayer', char: 'M', color: '#da70d6', hp: 40, attack: 8, defense: 4, xp: 55, speed: 95, behavior: 'caster', spells: ['mindBlast', 'dominate'], biome: 'void' },
    starSpawn: { name: 'Star Spawn', char: 'S', color: '#9932cc', hp: 50, attack: 14, defense: 5, xp: 60, speed: 85, behavior: 'melee', madness: true, biome: 'void' },
    voidWalker: { name: 'Void Walker', char: 'W', color: '#4b0082', hp: 30, attack: 11, defense: 3, xp: 40, speed: 110, behavior: 'melee', teleport: true, biome: 'void' },
    cosmicHorror: { name: 'Cosmic Horror', char: 'H', color: '#800080', hp: 70, attack: 16, defense: 6, xp: 80, speed: 80, behavior: 'caster', spells: ['tentacles', 'madness', 'voidRift'], biome: 'void' },
    dimensionalShambler: { name: 'Dimensional Shambler', char: 'D', color: '#8b008b', hp: 35, attack: 12, defense: 4, xp: 45, speed: 100, behavior: 'melee', phaseShift: true, biome: 'void' },
    eldritch: { name: 'Eldritch Abomination', char: 'E', color: '#000000', hp: 100, attack: 20, defense: 8, xp: 150, speed: 75, behavior: 'boss', biome: 'void' },

    // ===== BOSSES =====
    // Boss for each biome
    cryptLord: { name: 'Crypt Lord', char: 'L', color: '#9400d3', hp: 150, attack: 15, defense: 8, xp: 200, speed: 85, behavior: 'boss', boss: true, biome: 'crypt', spells: ['summonUndead', 'curse', 'drainLife'], drops: ['legendary'] },
    infernoLord: { name: 'Inferno Lord', char: 'I', color: '#ff0000', hp: 180, attack: 20, defense: 10, xp: 250, speed: 90, behavior: 'boss', boss: true, biome: 'fire', spells: ['meteor', 'fireNova'], fireImmune: true, drops: ['legendary'] },
    frostQueen: { name: 'Frost Queen', char: 'Q', color: '#00ffff', hp: 160, attack: 16, defense: 12, xp: 230, speed: 95, behavior: 'boss', boss: true, biome: 'ice', spells: ['blizzard', 'iceBarrier', 'summonIce'], iceImmune: true, drops: ['legendary'] },
    worldTree: { name: 'Corrupted World Tree', char: 'T', color: '#006400', hp: 200, attack: 14, defense: 15, xp: 240, speed: 60, behavior: 'boss', boss: true, biome: 'ruins', spells: ['summonMinions', 'entangle', 'regenerate'], drops: ['legendary'] },
    crystalKing: { name: 'Crystal King', char: 'K', color: '#e0ffff', hp: 170, attack: 18, defense: 14, xp: 220, speed: 70, behavior: 'boss', boss: true, biome: 'crystal', spells: ['shatter', 'crystalBarrier'], magicRes: 75, drops: ['legendary'] },
    archLibrarian: { name: 'Arch Librarian', char: 'A', color: '#f0f8ff', hp: 140, attack: 12, defense: 6, xp: 210, speed: 100, behavior: 'boss', boss: true, biome: 'library', spells: ['summonBooks', 'mindControl', 'timeStop'], phasing: true, drops: ['legendary'] },
    krakenPrime: { name: 'Kraken Prime', char: 'K', color: '#191970', hp: 220, attack: 22, defense: 10, xp: 280, speed: 80, behavior: 'boss', boss: true, biome: 'flooded', spells: ['tsunami', 'ink', 'grapple'], drops: ['legendary'] },
    highProphet: { name: 'High Prophet', char: 'P', color: '#4b0082', hp: 160, attack: 16, defense: 8, xp: 260, speed: 95, behavior: 'boss', boss: true, biome: 'temple', spells: ['summonDemon', 'darkNova', 'sacrifice'], drops: ['legendary'] },
    primeCore: { name: 'Prime Core', char: 'C', color: '#ffd700', hp: 250, attack: 20, defense: 18, xp: 300, speed: 65, behavior: 'boss', boss: true, biome: 'mechanical', spells: ['laserBarrage', 'summonDrones', 'overload'], drops: ['legendary'] },
    voidEmperor: { name: 'Void Emperor', char: 'V', color: '#000000', hp: 300, attack: 25, defense: 12, xp: 500, speed: 100, behavior: 'boss', boss: true, biome: 'void', spells: ['realityWarp', 'summonHorror', 'cosmicRay'], finalBoss: true, drops: ['artifact'] }
};

// Enemy behavior types
const ENEMY_BEHAVIORS = {
    melee: { preferredRange: 1, flees: false },
    ranged: { preferredRange: 6, flees: true, minRange: 3 },
    caster: { preferredRange: 5, flees: true, minRange: 2 },
    support: { preferredRange: 4, flees: true, heals: true },
    summoner: { preferredRange: 6, flees: true, summons: true },
    turret: { preferredRange: 8, stationary: true },
    suicide: { preferredRange: 1, explodesOnDeath: true },
    passive: { preferredRange: 3, aggressive: false },
    boss: { preferredRange: 2, flees: false, multiAttack: true }
};

// Elite/Champion modifiers
const ELITE_MODIFIERS = {
    berserker: { name: 'Berserker', hpMult: 1.5, attackMult: 1.8, speedMult: 1.2, xpMult: 2 },
    armored: { name: 'Armored', hpMult: 2, defenseMult: 2, speedMult: 0.8, xpMult: 2 },
    swift: { name: 'Swift', speedMult: 1.5, dodgeBonus: 0.2, xpMult: 1.8 },
    vampiric: { name: 'Vampiric', hpMult: 1.3, lifesteal: 0.3, xpMult: 2.2 },
    toxic: { name: 'Toxic', poisonDamage: 5, aura: 'poison', xpMult: 1.8 },
    arcane: { name: 'Arcane', spellPower: 1.5, magicRes: 50, xpMult: 2 },
    reflective: { name: 'Reflective', reflect: 0.3, xpMult: 2 },
    regenerating: { name: 'Regenerating', hpRegen: 3, xpMult: 1.8 },
    teleporting: { name: 'Teleporting', teleport: true, xpMult: 2 },
    splitting: { name: 'Splitting', split: true, xpMult: 2.5 }
};

// Function to create elite enemy
function createEliteEnemy(baseEnemy, modifier, rng) {
    const elite = deepClone(baseEnemy);
    const mod = ELITE_MODIFIERS[modifier];

    elite.name = `${mod.name} ${elite.name}`;
    elite.elite = true;
    elite.eliteType = modifier;

    if (mod.hpMult) elite.hp = Math.floor(elite.hp * mod.hpMult);
    if (mod.attackMult) elite.attack = Math.floor(elite.attack * mod.attackMult);
    if (mod.defenseMult) elite.defense = Math.floor(elite.defense * mod.defenseMult);
    if (mod.speedMult) elite.speed = Math.floor(elite.speed * mod.speedMult);
    elite.xp = Math.floor(elite.xp * (mod.xpMult || 2));

    // Copy special properties
    Object.keys(mod).forEach(key => {
        if (!['name', 'hpMult', 'attackMult', 'defenseMult', 'speedMult', 'xpMult'].includes(key)) {
            elite[key] = mod[key];
        }
    });

    return elite;
}
