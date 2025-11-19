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
