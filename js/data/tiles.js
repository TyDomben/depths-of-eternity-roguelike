// Tile Data Definitions
const TILE_DATA = {
    [TILE_TYPES.VOID]: {
        name: 'Void',
        char: ' ',
        color: '#000000',
        charColor: '#000000',
        walkable: false,
        transparent: false,
        blocksLight: true
    },
    [TILE_TYPES.FLOOR]: {
        name: 'Floor',
        char: '.',
        color: '#1a1a1a',
        charColor: '#444444',
        walkable: true,
        transparent: true,
        blocksLight: false
    },
    [TILE_TYPES.WALL]: {
        name: 'Wall',
        char: '#',
        color: '#2a2a2a',
        charColor: '#666666',
        walkable: false,
        transparent: false,
        blocksLight: true
    },
    [TILE_TYPES.DOOR_CLOSED]: {
        name: 'Closed Door',
        char: '+',
        color: '#1a1a1a',
        charColor: '#8b4513',
        walkable: false,
        transparent: false,
        blocksLight: true,
        interactable: true,
        action: 'open'
    },
    [TILE_TYPES.DOOR_OPEN]: {
        name: 'Open Door',
        char: '/',
        color: '#1a1a1a',
        charColor: '#8b4513',
        walkable: true,
        transparent: true,
        blocksLight: false,
        interactable: true,
        action: 'close'
    },
    [TILE_TYPES.STAIRS_DOWN]: {
        name: 'Stairs Down',
        char: '>',
        color: '#1a1a1a',
        charColor: '#ffffff',
        walkable: true,
        transparent: true,
        blocksLight: false,
        interactable: true,
        action: 'descend'
    },
    [TILE_TYPES.STAIRS_UP]: {
        name: 'Stairs Up',
        char: '<',
        color: '#1a1a1a',
        charColor: '#ffffff',
        walkable: true,
        transparent: true,
        blocksLight: false,
        interactable: true,
        action: 'ascend'
    },
    [TILE_TYPES.WATER]: {
        name: 'Water',
        char: '~',
        color: '#001a33',
        charColor: '#0066cc',
        walkable: true,
        transparent: true,
        blocksLight: false,
        hazard: true,
        moveCost: 2,
        effect: 'wet'
    },
    [TILE_TYPES.LAVA]: {
        name: 'Lava',
        char: '~',
        color: '#331100',
        charColor: '#ff4400',
        walkable: true,
        transparent: true,
        blocksLight: false,
        hazard: true,
        damage: 20,
        damageType: 'fire'
    },
    [TILE_TYPES.PIT]: {
        name: 'Pit',
        char: ' ',
        color: '#000000',
        charColor: '#000000',
        walkable: false,
        transparent: true,
        blocksLight: false
    },
    [TILE_TYPES.TRAP]: {
        name: 'Trap',
        char: '^',
        color: '#1a1a1a',
        charColor: '#1a1a1a', // Hidden until triggered
        walkable: true,
        transparent: true,
        blocksLight: false,
        interactable: true,
        hidden: true
    },
    [TILE_TYPES.TRAP_TRIGGERED]: {
        name: 'Triggered Trap',
        char: '^',
        color: '#1a1a1a',
        charColor: '#ff0000',
        walkable: true,
        transparent: true,
        blocksLight: false
    },
    [TILE_TYPES.SECRET_WALL]: {
        name: 'Wall',
        char: '#',
        color: '#2a2a2a',
        charColor: '#666666',
        walkable: false,
        transparent: false,
        blocksLight: true,
        secret: true
    },
    [TILE_TYPES.ALTAR]: {
        name: 'Altar',
        char: '_',
        color: '#1a1a1a',
        charColor: '#9932cc',
        walkable: true,
        transparent: true,
        blocksLight: false,
        interactable: true,
        action: 'pray'
    },
    [TILE_TYPES.FOUNTAIN]: {
        name: 'Fountain',
        char: '{',
        color: '#1a1a1a',
        charColor: '#00bfff',
        walkable: true,
        transparent: true,
        blocksLight: false,
        interactable: true,
        action: 'drink'
    },
    [TILE_TYPES.CHEST]: {
        name: 'Chest',
        char: '=',
        color: '#1a1a1a',
        charColor: '#ffd700',
        walkable: false,
        transparent: true,
        blocksLight: false,
        interactable: true,
        action: 'open'
    },
    [TILE_TYPES.CHEST_OPEN]: {
        name: 'Open Chest',
        char: '=',
        color: '#1a1a1a',
        charColor: '#8b4513',
        walkable: false,
        transparent: true,
        blocksLight: false
    },
    [TILE_TYPES.SHOP_FLOOR]: {
        name: 'Shop Floor',
        char: '.',
        color: '#1a1a00',
        charColor: '#444400',
        walkable: true,
        transparent: true,
        blocksLight: false
    },
    [TILE_TYPES.PORTAL]: {
        name: 'Portal',
        char: 'O',
        color: '#1a001a',
        charColor: '#ff00ff',
        walkable: true,
        transparent: true,
        blocksLight: false,
        interactable: true,
        action: 'enter'
    },
    [TILE_TYPES.ICE]: {
        name: 'Ice',
        char: '.',
        color: '#001a1a',
        charColor: '#00ffff',
        walkable: true,
        transparent: true,
        blocksLight: false,
        slippery: true
    },
    [TILE_TYPES.GRASS]: {
        name: 'Grass',
        char: '"',
        color: '#001a00',
        charColor: '#00aa00',
        walkable: true,
        transparent: true,
        blocksLight: false
    },
    [TILE_TYPES.RUBBLE]: {
        name: 'Rubble',
        char: ':',
        color: '#1a1a1a',
        charColor: '#666666',
        walkable: true,
        transparent: true,
        blocksLight: false,
        moveCost: 2
    }
};

// Trap types
const TRAP_TYPES = {
    ARROW: {
        name: 'Arrow Trap',
        damage: 10,
        damageType: 'physical',
        message: 'An arrow shoots out from the wall!'
    },
    SPIKE: {
        name: 'Spike Trap',
        damage: 15,
        damageType: 'physical',
        message: 'Spikes shoot up from the floor!'
    },
    POISON_GAS: {
        name: 'Poison Gas Trap',
        damage: 5,
        damageType: 'poison',
        effect: 'POISON',
        message: 'Poison gas sprays from the floor!'
    },
    FIRE: {
        name: 'Fire Trap',
        damage: 20,
        damageType: 'fire',
        effect: 'BURNING',
        message: 'Flames erupt from the floor!'
    },
    TELEPORT: {
        name: 'Teleport Trap',
        damage: 0,
        effect: 'teleport',
        message: 'You are teleported!'
    },
    ALARM: {
        name: 'Alarm Trap',
        damage: 0,
        effect: 'alert',
        message: 'An alarm sounds! Enemies are alerted!'
    },
    PIT: {
        name: 'Pit Trap',
        damage: 25,
        damageType: 'physical',
        message: 'You fall into a pit!'
    },
    CONFUSION: {
        name: 'Confusion Trap',
        damage: 0,
        effect: 'CONFUSION',
        message: 'Strange vapors cloud your mind!'
    },

    // Additional Trap Types
    BEAR_TRAP: {
        name: 'Bear Trap',
        damage: 18,
        damageType: 'physical',
        effect: 'IMMOBILIZED',
        message: 'A bear trap snaps shut on your leg!'
    },
    BLADE: {
        name: 'Blade Trap',
        damage: 22,
        damageType: 'physical',
        message: 'Razor-sharp blades swing from the wall!'
    },
    BOULDER: {
        name: 'Boulder Trap',
        damage: 30,
        damageType: 'physical',
        message: 'A boulder rolls towards you!'
    },
    ACID: {
        name: 'Acid Trap',
        damage: 15,
        damageType: 'acid',
        effect: 'CORRODED',
        message: 'Acid sprays from hidden nozzles!'
    },
    FROST: {
        name: 'Frost Trap',
        damage: 12,
        damageType: 'ice',
        effect: 'SLOWED',
        message: 'A blast of freezing air engulfs you!'
    },
    LIGHTNING: {
        name: 'Lightning Trap',
        damage: 25,
        damageType: 'lightning',
        effect: 'STUNNED',
        message: 'Lightning arcs through your body!'
    },
    BLIND: {
        name: 'Flash Trap',
        damage: 0,
        effect: 'BLIND',
        message: 'A blinding flash of light!'
    },
    SLEEP: {
        name: 'Sleep Gas Trap',
        damage: 0,
        effect: 'SLEEP',
        message: 'Sleeping gas fills the air!'
    },
    WEAKNESS: {
        name: 'Weakness Trap',
        damage: 0,
        effect: 'WEAKENED',
        message: 'Your strength fades away!'
    },
    CURSE: {
        name: 'Curse Trap',
        damage: 0,
        effect: 'CURSED',
        message: 'Dark magic curses you!'
    },
    SUMMON: {
        name: 'Summoning Trap',
        damage: 0,
        effect: 'summon',
        message: 'Enemies are summoned around you!'
    },
    MANA_DRAIN: {
        name: 'Mana Drain Trap',
        damage: 0,
        effect: 'drain_mana',
        message: 'Your magical energy is drained!'
    },
    WEB: {
        name: 'Web Trap',
        damage: 0,
        effect: 'WEBBED',
        message: 'Sticky webs entangle you!'
    },
    EXPLOSION: {
        name: 'Explosive Trap',
        damage: 35,
        damageType: 'fire',
        aoe: true,
        message: 'The floor explodes!'
    },
    CRUSHING_WALL: {
        name: 'Crushing Wall',
        damage: 40,
        damageType: 'physical',
        message: 'The walls close in!'
    },
    DART: {
        name: 'Dart Trap',
        damage: 8,
        damageType: 'physical',
        effect: 'POISON',
        message: 'Poisoned darts shoot from the wall!'
    },
    FALLING_NET: {
        name: 'Net Trap',
        damage: 0,
        effect: 'ENTANGLED',
        message: 'A net falls from above!'
    },
    ROCKFALL: {
        name: 'Rockfall Trap',
        damage: 20,
        damageType: 'physical',
        message: 'Rocks fall from the ceiling!'
    },
    RUST: {
        name: 'Rust Trap',
        damage: 0,
        effect: 'rust',
        message: 'Rust spreads across your equipment!'
    },
    POLYMORPH: {
        name: 'Polymorph Trap',
        damage: 0,
        effect: 'polymorph',
        message: 'Strange magic warps your form!'
    },
    LEVEL_DRAIN: {
        name: 'Level Drain Trap',
        damage: 0,
        effect: 'level_drain',
        message: 'You feel your experience fading!'
    },
    HALLUCINATION: {
        name: 'Hallucination Trap',
        damage: 0,
        effect: 'HALLUCINATING',
        message: 'Strange visions cloud your mind!'
    },
    FEAR: {
        name: 'Fear Trap',
        damage: 0,
        effect: 'FEAR',
        message: 'Terror grips your heart!'
    }
};

// Environmental Hazards
const HAZARD_TYPES = {
    LAVA: {
        name: 'Lava',
        damage: 25,
        damageType: 'fire',
        message: 'The lava burns you!',
        continuous: true
    },
    DEEP_WATER: {
        name: 'Deep Water',
        damage: 5,
        damageType: 'drown',
        effect: 'SLOWED',
        message: 'You struggle in deep water!',
        continuous: true
    },
    ACID_POOL: {
        name: 'Acid Pool',
        damage: 15,
        damageType: 'acid',
        message: 'The acid burns!',
        continuous: true
    },
    TOXIC_GAS: {
        name: 'Toxic Gas',
        damage: 3,
        damageType: 'poison',
        effect: 'POISON',
        message: 'Toxic fumes fill your lungs!',
        continuous: true
    },
    FIRE: {
        name: 'Fire',
        damage: 10,
        damageType: 'fire',
        effect: 'BURNING',
        message: 'The flames burn you!',
        continuous: true
    },
    ICE: {
        name: 'Ice',
        damage: 0,
        effect: 'slippery',
        message: 'You slip on the ice!',
        continuous: false
    },
    THORNS: {
        name: 'Thorns',
        damage: 5,
        damageType: 'physical',
        message: 'Thorns scratch you!',
        continuous: true
    },
    QUICKSAND: {
        name: 'Quicksand',
        damage: 0,
        effect: 'SLOWED',
        message: 'You sink into quicksand!',
        continuous: true
    },
    STEAM_VENT: {
        name: 'Steam Vent',
        damage: 8,
        damageType: 'fire',
        message: 'Scalding steam erupts!',
        continuous: false,
        periodic: true
    },
    ELECTRIC_FLOOR: {
        name: 'Electric Floor',
        damage: 12,
        damageType: 'lightning',
        message: 'Electricity courses through the floor!',
        continuous: false,
        periodic: true
    },
    VOID_RIFT: {
        name: 'Void Rift',
        damage: 15,
        damageType: 'dark',
        effect: 'drain_mana',
        message: 'The void drains your essence!',
        continuous: true
    },
    HOLY_GROUND: {
        name: 'Holy Ground',
        damage: 0,
        effect: 'heal_undead_damage',
        message: 'Holy energy radiates from the ground!',
        healLiving: 2,
        damageUndead: 10
    },
    CURSED_GROUND: {
        name: 'Cursed Ground',
        damage: 0,
        effect: 'WEAKENED',
        message: 'Dark energy weakens you!',
        continuous: true
    },
    CRYSTAL_SHARD: {
        name: 'Crystal Shards',
        damage: 8,
        damageType: 'magic',
        message: 'Crystal shards cut you!',
        continuous: true
    }
};

// Fountain effects
const FOUNTAIN_EFFECTS = [
    { name: 'Healing', effect: 'heal', value: 30, message: 'The water heals your wounds!', weight: 30 },
    { name: 'Mana', effect: 'mana', value: 20, message: 'You feel magically refreshed!', weight: 25 },
    { name: 'Poison', effect: 'poison', message: 'The water is poisoned!', weight: 10 },
    { name: 'Blessing', effect: 'bless', message: 'You feel blessed!', weight: 15 },
    { name: 'Curse', effect: 'curse', message: 'You feel cursed!', weight: 5 },
    { name: 'Strength', effect: 'strength', message: 'You feel stronger!', weight: 10 },
    { name: 'Nothing', effect: 'none', message: 'The water tastes normal.', weight: 5 }
];

// Altar effects
const ALTAR_EFFECTS = [
    { name: 'Blessing', effect: 'bless', message: 'The gods smile upon you!', weight: 25 },
    { name: 'Healing', effect: 'fullHeal', message: 'Divine light heals you completely!', weight: 20 },
    { name: 'Identify', effect: 'identifyAll', message: 'Your items glow with knowledge!', weight: 15 },
    { name: 'Remove Curse', effect: 'removeCurse', message: 'Dark energy dissipates from your items!', weight: 15 },
    { name: 'Wrath', effect: 'damage', value: 30, message: 'The gods are displeased!', weight: 10 },
    { name: 'Nothing', effect: 'none', message: 'The altar is silent.', weight: 15 }
];
