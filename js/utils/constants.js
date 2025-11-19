// Game Constants
const GAME_CONSTANTS = {
    // Display
    TILE_SIZE: 32,
    VIEWPORT_WIDTH: 21,
    VIEWPORT_HEIGHT: 15,
    MINIMAP_SIZE: 150,

    // Map
    MAP_WIDTH: 80,
    MAP_HEIGHT: 50,
    MAX_ROOMS: 15,
    MIN_ROOM_SIZE: 5,
    MAX_ROOM_SIZE: 15,

    // Player
    BASE_HP: 100,
    BASE_MP: 50,
    BASE_HUNGER: 100,
    HUNGER_RATE: 0.1,
    INVENTORY_SIZE: 40,
    MAX_WEIGHT: 100,
    MAX_LEVEL: 20,

    // Combat
    BASE_ATTACK: 5,
    BASE_DEFENSE: 5,
    CRIT_CHANCE: 0.05,
    CRIT_MULTIPLIER: 2.0,
    DODGE_BASE: 0.05,
    BACKSTAB_MULTIPLIER: 1.5,
    FLANK_BONUS: 1.25,

    // Game
    FLOORS_PER_BIOME: 5,
    TOTAL_FLOORS: 50,
    BOSS_INTERVAL: 5,
    SHOP_CHANCE: 0.3,
    SECRET_ROOM_CHANCE: 0.2,
    TRAP_DENSITY: 0.05,

    // FOV
    FOV_RADIUS: 8,
    TORCH_RADIUS: 5,

    // Timers
    TURN_DELAY: 100,
    ANIMATION_SPEED: 150,
    MESSAGE_FADE: 5000,

    // Experience
    XP_BASE: 100,
    XP_MULTIPLIER: 1.5,

    // Meta progression
    UNLOCK_POINTS_PER_FLOOR: 10,
    UNLOCK_POINTS_PER_BOSS: 50
};

// Directions
const DIRECTIONS = {
    N: { x: 0, y: -1 },
    S: { x: 0, y: 1 },
    E: { x: 1, y: 0 },
    W: { x: -1, y: 0 },
    NE: { x: 1, y: -1 },
    NW: { x: -1, y: -1 },
    SE: { x: 1, y: 1 },
    SW: { x: -1, y: 1 }
};

const DIR_KEYS = {
    // Numpad
    '7': 'NW', '8': 'N', '9': 'NE',
    '4': 'W',  '5': null, '6': 'E',
    '1': 'SW', '2': 'S', '3': 'SE',
    // WASD + QE/ZC for diagonals
    'w': 'N', 'a': 'W', 's': 'S', 'd': 'E',
    'q': 'NW', 'e': 'NE', 'z': 'SW', 'c': 'SE',
    // Arrow keys
    'ArrowUp': 'N', 'ArrowDown': 'S', 'ArrowLeft': 'W', 'ArrowRight': 'E',
    // Vi keys
    'h': 'W', 'j': 'S', 'k': 'N', 'l': 'E',
    'y': 'NW', 'u': 'NE', 'b': 'SW', 'n': 'SE'
};

// Tile Types
const TILE_TYPES = {
    VOID: 0,
    FLOOR: 1,
    WALL: 2,
    DOOR_CLOSED: 3,
    DOOR_OPEN: 4,
    STAIRS_DOWN: 5,
    STAIRS_UP: 6,
    WATER: 7,
    LAVA: 8,
    PIT: 9,
    TRAP: 10,
    TRAP_TRIGGERED: 11,
    SECRET_WALL: 12,
    ALTAR: 13,
    FOUNTAIN: 14,
    CHEST: 15,
    CHEST_OPEN: 16,
    SHOP_FLOOR: 17,
    PORTAL: 18,
    ICE: 19,
    GRASS: 20,
    RUBBLE: 21
};

// Item Rarities
const RARITIES = {
    COMMON: { name: 'Common', color: '#ffffff', weight: 60 },
    UNCOMMON: { name: 'Uncommon', color: '#1eff00', weight: 25 },
    RARE: { name: 'Rare', color: '#0070dd', weight: 10 },
    EPIC: { name: 'Epic', color: '#a335ee', weight: 4 },
    LEGENDARY: { name: 'Legendary', color: '#ff8000', weight: 0.9 },
    ARTIFACT: { name: 'Artifact', color: '#e6cc80', weight: 0.1 }
};

// Equipment Slots
const EQUIP_SLOTS = ['weapon', 'helm', 'armor', 'gloves', 'boots', 'ring1', 'ring2', 'amulet'];

// Status Effects
const STATUS_EFFECTS = {
    POISON: { name: 'Poison', icon: 'P', color: '#00ff00', duration: 10 },
    BURNING: { name: 'Burning', icon: 'B', color: '#ff4400', duration: 5 },
    FROZEN: { name: 'Frozen', icon: 'F', color: '#00ffff', duration: 3 },
    BLESSED: { name: 'Blessed', icon: '+', color: '#ffff00', duration: 20 },
    CURSED: { name: 'Cursed', icon: '-', color: '#800080', duration: 20 },
    HASTE: { name: 'Haste', icon: 'H', color: '#ffaa00', duration: 15 },
    SLOW: { name: 'Slow', icon: 'S', color: '#808080', duration: 10 },
    INVISIBLE: { name: 'Invisible', icon: 'I', color: '#aaaaff', duration: 10 },
    REGENERATION: { name: 'Regen', icon: 'R', color: '#00ff88', duration: 15 },
    STRENGTH: { name: 'Strength', icon: '^', color: '#ff0000', duration: 20 },
    WEAKNESS: { name: 'Weakness', icon: 'v', color: '#880000', duration: 15 },
    CONFUSION: { name: 'Confusion', icon: '?', color: '#ff00ff', duration: 8 },
    BLINDNESS: { name: 'Blindness', icon: 'X', color: '#444444', duration: 10 },
    FEAR: { name: 'Fear', icon: '!', color: '#ffff88', duration: 6 },
    STUN: { name: 'Stun', icon: '*', color: '#ffffff', duration: 2 },
    BLEEDING: { name: 'Bleeding', icon: 'b', color: '#cc0000', duration: 8 },
    SHIELD: { name: 'Shield', icon: 'O', color: '#4488ff', duration: 10 },
    REFLECT: { name: 'Reflect', icon: 'M', color: '#ff88ff', duration: 8 },
    LIFESTEAL: { name: 'Lifesteal', icon: 'L', color: '#ff4488', duration: 12 }
};

// Damage Types
const DAMAGE_TYPES = {
    PHYSICAL: 'physical',
    FIRE: 'fire',
    ICE: 'ice',
    LIGHTNING: 'lightning',
    POISON: 'poison',
    HOLY: 'holy',
    DARK: 'dark',
    ARCANE: 'arcane'
};

// AI States
const AI_STATES = {
    IDLE: 'idle',
    PATROL: 'patrol',
    CHASE: 'chase',
    ATTACK: 'attack',
    FLEE: 'flee',
    SUPPORT: 'support',
    SUMMON: 'summon'
};

// Game Modes
const GAME_MODES = {
    NORMAL: 'normal',
    HARD: 'hard',
    ENDLESS: 'endless',
    DAILY: 'daily',
    CUSTOM: 'custom',
    TUTORIAL: 'tutorial'
};

// Message Types
const MSG_TYPES = {
    COMBAT: 'combat',
    PICKUP: 'pickup',
    INFO: 'info',
    WARNING: 'warning',
    SYSTEM: 'system'
};

// Key Bindings
const KEY_BINDINGS = {
    INVENTORY: 'i',
    CHARACTER: 'c',
    SKILLS: 'k',
    MAP: 'm',
    EXAMINE: 'x',
    SEARCH: 's',
    REST: 'r',
    WAIT: '.',
    PICKUP: 'g',
    DROP: 'd',
    USE: 'u',
    THROW: 't',
    FIRE: 'f',
    STAIRS: '>',
    HELP: '?',
    CANCEL: 'Escape',
    CONFIRM: 'Enter'
};
