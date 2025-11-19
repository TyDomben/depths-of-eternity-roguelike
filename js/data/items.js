// Item Data Definitions

// Item Categories
const ITEM_CATEGORIES = {
    WEAPON: 'weapon',
    ARMOR: 'armor',
    HELM: 'helm',
    GLOVES: 'gloves',
    BOOTS: 'boots',
    RING: 'ring',
    AMULET: 'amulet',
    POTION: 'potion',
    SCROLL: 'scroll',
    FOOD: 'food',
    GOLD: 'gold',
    KEY: 'key',
    WAND: 'wand',
    TOME: 'tome',
    MISC: 'misc'
};

// Base Weapons
const WEAPONS = {
    // Swords
    dagger: { name: 'Dagger', char: '/', color: '#cccccc', damage: '1d4', speed: 120, weight: 1, value: 10, class: ['rogue', 'mage'] },
    shortSword: { name: 'Short Sword', char: '/', color: '#cccccc', damage: '1d6', speed: 110, weight: 2, value: 25, class: ['warrior', 'rogue'] },
    longSword: { name: 'Long Sword', char: '/', color: '#cccccc', damage: '1d8', speed: 100, weight: 4, value: 50, class: ['warrior'] },
    greatSword: { name: 'Great Sword', char: '/', color: '#aaaaaa', damage: '2d6', speed: 80, weight: 8, value: 100, twoHanded: true, class: ['warrior'] },
    rapier: { name: 'Rapier', char: '/', color: '#dddddd', damage: '1d6', speed: 115, weight: 2, value: 40, critBonus: 0.05, class: ['rogue'] },
    scimitar: { name: 'Scimitar', char: '/', color: '#cccccc', damage: '1d6', speed: 105, weight: 3, value: 35, class: ['warrior', 'ranger'] },
    katana: { name: 'Katana', char: '/', color: '#eeeeee', damage: '1d10', speed: 105, weight: 3, value: 80, critBonus: 0.1, class: ['monk', 'warrior'] },

    // Axes
    handAxe: { name: 'Hand Axe', char: ')', color: '#888888', damage: '1d6', speed: 100, weight: 3, value: 20, class: ['warrior', 'ranger'] },
    battleAxe: { name: 'Battle Axe', char: ')', color: '#888888', damage: '1d8', speed: 90, weight: 5, value: 60, class: ['warrior'] },
    greatAxe: { name: 'Great Axe', char: ')', color: '#666666', damage: '1d12', speed: 70, weight: 10, value: 120, twoHanded: true, class: ['warrior'] },

    // Maces
    club: { name: 'Club', char: '!', color: '#8b4513', damage: '1d4', speed: 100, weight: 3, value: 5, class: ['all'] },
    mace: { name: 'Mace', char: '!', color: '#aaaaaa', damage: '1d6', speed: 95, weight: 4, value: 30, class: ['cleric', 'warrior'] },
    morningstar: { name: 'Morningstar', char: '!', color: '#888888', damage: '1d8', speed: 90, weight: 6, value: 70, class: ['cleric', 'warrior'] },
    warhammer: { name: 'Warhammer', char: '!', color: '#666666', damage: '1d10', speed: 80, weight: 8, value: 90, class: ['cleric', 'warrior'] },
    greatHammer: { name: 'Great Hammer', char: '!', color: '#555555', damage: '2d6', speed: 70, weight: 12, value: 150, twoHanded: true, class: ['warrior'] },

    // Polearms
    spear: { name: 'Spear', char: '|', color: '#8b4513', damage: '1d6', speed: 100, weight: 4, value: 15, reach: true, class: ['warrior', 'ranger'] },
    halberd: { name: 'Halberd', char: '|', color: '#888888', damage: '1d10', speed: 85, weight: 8, value: 80, reach: true, twoHanded: true, class: ['warrior'] },
    trident: { name: 'Trident', char: '|', color: '#00aaaa', damage: '1d8', speed: 95, weight: 5, value: 60, reach: true, class: ['warrior'] },

    // Ranged
    shortBow: { name: 'Short Bow', char: '}', color: '#8b4513', damage: '1d6', speed: 110, weight: 2, value: 30, ranged: true, twoHanded: true, class: ['ranger', 'rogue'] },
    longBow: { name: 'Long Bow', char: '}', color: '#8b4513', damage: '1d8', speed: 100, weight: 3, value: 60, ranged: true, twoHanded: true, class: ['ranger'] },
    crossbow: { name: 'Crossbow', char: '}', color: '#888888', damage: '1d10', speed: 80, weight: 5, value: 80, ranged: true, twoHanded: true, class: ['ranger', 'rogue'] },
    sling: { name: 'Sling', char: '(', color: '#8b4513', damage: '1d4', speed: 120, weight: 0, value: 5, ranged: true, class: ['all'] },

    // Staves
    quarterstaff: { name: 'Quarterstaff', char: '/', color: '#8b4513', damage: '1d6', speed: 100, weight: 3, value: 10, twoHanded: true, class: ['mage', 'monk', 'cleric'] },
    magicStaff: { name: 'Magic Staff', char: '/', color: '#9932cc', damage: '1d4', speed: 100, weight: 3, value: 100, mpBonus: 20, twoHanded: true, class: ['mage', 'necromancer'] },
    holyStaff: { name: 'Holy Staff', char: '/', color: '#ffd700', damage: '1d6', speed: 95, weight: 4, value: 120, holyDamage: 5, twoHanded: true, class: ['cleric'] },

    // Monk weapons
    nunchaku: { name: 'Nunchaku', char: '-', color: '#8b4513', damage: '1d6', speed: 125, weight: 1, value: 25, class: ['monk'] },
    kama: { name: 'Kama', char: '7', color: '#888888', damage: '1d4', speed: 120, weight: 1, value: 20, class: ['monk'] },
    bo: { name: 'Bo Staff', char: '|', color: '#8b4513', damage: '1d8', speed: 110, weight: 3, value: 30, twoHanded: true, class: ['monk'] },

    // Special
    whip: { name: 'Whip', char: '~', color: '#8b4513', damage: '1d4', speed: 110, weight: 2, value: 35, reach: true, class: ['bard', 'rogue'] },
    sickle: { name: 'Sickle', char: '?', color: '#888888', damage: '1d4', speed: 105, weight: 2, value: 15, class: ['necromancer'] },
    scythe: { name: 'Scythe', char: '7', color: '#444444', damage: '2d4', speed: 85, weight: 6, value: 100, twoHanded: true, critBonus: 0.15, class: ['necromancer'] }
};

// Armor pieces
const ARMORS = {
    // Body armor
    cloth: { name: 'Cloth Armor', char: '[', color: '#666666', defense: 1, weight: 2, value: 10, class: ['all'] },
    leather: { name: 'Leather Armor', char: '[', color: '#8b4513', defense: 2, weight: 5, value: 30, class: ['all'] },
    studdedLeather: { name: 'Studded Leather', char: '[', color: '#a0522d', defense: 3, weight: 7, value: 50, class: ['warrior', 'ranger', 'rogue', 'bard'] },
    chainmail: { name: 'Chainmail', char: '[', color: '#aaaaaa', defense: 5, weight: 15, value: 100, class: ['warrior', 'cleric'] },
    scaleMail: { name: 'Scale Mail', char: '[', color: '#888888', defense: 6, weight: 20, value: 150, class: ['warrior', 'cleric'] },
    plateMail: { name: 'Plate Mail', char: '[', color: '#cccccc', defense: 8, weight: 30, value: 300, speedPenalty: 10, class: ['warrior'] },
    robe: { name: 'Robe', char: '[', color: '#4a4a8a', defense: 1, weight: 3, value: 20, mpBonus: 10, class: ['mage', 'necromancer'] },
    monkRobe: { name: 'Monk Robe', char: '[', color: '#ff8c00', defense: 1, weight: 2, value: 25, dodgeBonus: 0.05, class: ['monk'] },

    // Helmets
    cap: { name: 'Leather Cap', char: ']', color: '#8b4513', defense: 1, weight: 1, value: 15, slot: 'helm', class: ['all'] },
    helm: { name: 'Iron Helm', char: ']', color: '#888888', defense: 2, weight: 3, value: 40, slot: 'helm', class: ['warrior', 'cleric'] },
    greatHelm: { name: 'Great Helm', char: ']', color: '#aaaaaa', defense: 3, weight: 5, value: 80, slot: 'helm', class: ['warrior'] },
    hood: { name: 'Hood', char: ']', color: '#333333', defense: 1, weight: 1, value: 20, slot: 'helm', class: ['rogue', 'ranger', 'mage', 'necromancer'] },
    circlet: { name: 'Circlet', char: ']', color: '#ffd700', defense: 0, weight: 0, value: 50, mpBonus: 5, slot: 'helm', class: ['mage', 'cleric', 'necromancer'] },

    // Gloves
    gloves: { name: 'Leather Gloves', char: '(', color: '#8b4513', defense: 1, weight: 1, value: 15, slot: 'gloves', class: ['all'] },
    gauntlets: { name: 'Iron Gauntlets', char: '(', color: '#888888', defense: 2, weight: 3, value: 50, slot: 'gloves', class: ['warrior', 'cleric'] },
    bracers: { name: 'Bracers', char: '(', color: '#a0522d', defense: 1, weight: 2, value: 30, attackBonus: 1, slot: 'gloves', class: ['warrior', 'ranger', 'monk'] },

    // Boots
    sandals: { name: 'Sandals', char: ':', color: '#8b4513', defense: 0, weight: 1, value: 5, slot: 'boots', class: ['all'] },
    boots: { name: 'Leather Boots', char: ':', color: '#8b4513', defense: 1, weight: 2, value: 20, slot: 'boots', class: ['all'] },
    ironBoots: { name: 'Iron Boots', char: ':', color: '#888888', defense: 2, weight: 5, value: 60, slot: 'boots', class: ['warrior', 'cleric'] }
};

// Jewelry
const JEWELRY = {
    // Rings
    ringProtection: { name: 'Ring of Protection', char: '=', color: '#ffd700', defense: 1, weight: 0, value: 100, slot: 'ring' },
    ringStrength: { name: 'Ring of Strength', char: '=', color: '#ff4444', strBonus: 2, weight: 0, value: 150, slot: 'ring' },
    ringDexterity: { name: 'Ring of Dexterity', char: '=', color: '#44ff44', dexBonus: 2, weight: 0, value: 150, slot: 'ring' },
    ringIntelligence: { name: 'Ring of Intelligence', char: '=', color: '#4444ff', intBonus: 2, weight: 0, value: 150, slot: 'ring' },
    ringRegeneration: { name: 'Ring of Regeneration', char: '=', color: '#00ff88', hpRegen: 1, weight: 0, value: 300, slot: 'ring' },
    ringFireRes: { name: 'Ring of Fire Resistance', char: '=', color: '#ff8800', fireRes: 25, weight: 0, value: 200, slot: 'ring' },
    ringIceRes: { name: 'Ring of Ice Resistance', char: '=', color: '#00ffff', iceRes: 25, weight: 0, value: 200, slot: 'ring' },
    ringPoison: { name: 'Ring of Poison Resistance', char: '=', color: '#00ff00', poisonRes: 50, weight: 0, value: 200, slot: 'ring' },
    ringInvisibility: { name: 'Ring of Invisibility', char: '=', color: '#aaaaff', invisible: true, weight: 0, value: 500, slot: 'ring' },
    ringTeleport: { name: 'Ring of Teleportation', char: '=', color: '#ff00ff', teleport: true, weight: 0, value: 400, slot: 'ring' },

    // Amulets
    amuletHealth: { name: 'Amulet of Health', char: '"', color: '#ff4444', hpBonus: 20, weight: 0, value: 200, slot: 'amulet' },
    amuletMana: { name: 'Amulet of Mana', char: '"', color: '#4444ff', mpBonus: 20, weight: 0, value: 200, slot: 'amulet' },
    amuletWisdom: { name: 'Amulet of Wisdom', char: '"', color: '#ffff44', wisBonus: 3, weight: 0, value: 250, slot: 'amulet' },
    amuletLife: { name: 'Amulet of Life Saving', char: '"', color: '#ffffff', lifeSaving: true, weight: 0, value: 1000, slot: 'amulet' },
    amuletReflection: { name: 'Amulet of Reflection', char: '"', color: '#ff88ff', magicReflect: 0.2, weight: 0, value: 600, slot: 'amulet' }
};

// Potions
const POTIONS = {
    healthMinor: { name: 'Minor Health Potion', char: '!', color: '#ff4444', effect: 'heal', value: 25, weight: 1, price: 20 },
    healthMajor: { name: 'Major Health Potion', char: '!', color: '#ff0000', effect: 'heal', value: 75, weight: 1, price: 75 },
    healthGreater: { name: 'Greater Health Potion', char: '!', color: '#cc0000', effect: 'heal', value: 150, weight: 1, price: 150 },
    manaMinor: { name: 'Minor Mana Potion', char: '!', color: '#4444ff', effect: 'mana', value: 20, weight: 1, price: 25 },
    manaMajor: { name: 'Major Mana Potion', char: '!', color: '#0000ff', effect: 'mana', value: 50, weight: 1, price: 80 },
    strength: { name: 'Potion of Strength', char: '!', color: '#ff8844', effect: 'status', status: 'STRENGTH', duration: 50, weight: 1, price: 60 },
    speed: { name: 'Potion of Speed', char: '!', color: '#ffff44', effect: 'status', status: 'HASTE', duration: 30, weight: 1, price: 50 },
    invisibility: { name: 'Potion of Invisibility', char: '!', color: '#aaaaff', effect: 'status', status: 'INVISIBLE', duration: 20, weight: 1, price: 100 },
    fireRes: { name: 'Potion of Fire Resistance', char: '!', color: '#ff4400', effect: 'resist', resistType: 'fire', duration: 50, weight: 1, price: 40 },
    iceRes: { name: 'Potion of Ice Resistance', char: '!', color: '#00ffff', effect: 'resist', resistType: 'ice', duration: 50, weight: 1, price: 40 },
    curePoison: { name: 'Antidote', char: '!', color: '#00ff00', effect: 'cure', cureType: 'POISON', weight: 1, price: 30 },
    fullRestore: { name: 'Elixir of Life', char: '!', color: '#ffffff', effect: 'fullRestore', weight: 1, price: 500 },
    experience: { name: 'Potion of Experience', char: '!', color: '#9932cc', effect: 'xp', value: 100, weight: 1, price: 200 }
};

// Scrolls
const SCROLLS = {
    identify: { name: 'Scroll of Identify', char: '?', color: '#ffffff', effect: 'identify', weight: 0, price: 30 },
    teleport: { name: 'Scroll of Teleportation', char: '?', color: '#ff00ff', effect: 'teleport', weight: 0, price: 50 },
    mapping: { name: 'Scroll of Magic Mapping', char: '?', color: '#00ff00', effect: 'map', weight: 0, price: 100 },
    enchant: { name: 'Scroll of Enchantment', char: '?', color: '#ffd700', effect: 'enchant', weight: 0, price: 200 },
    removeCurse: { name: 'Scroll of Remove Curse', char: '?', color: '#ffff00', effect: 'removeCurse', weight: 0, price: 150 },
    fireball: { name: 'Scroll of Fireball', char: '?', color: '#ff4400', effect: 'spell', spell: 'fireball', weight: 0, price: 80 },
    lightning: { name: 'Scroll of Lightning', char: '?', color: '#ffff00', effect: 'spell', spell: 'lightning', weight: 0, price: 80 },
    frostNova: { name: 'Scroll of Frost Nova', char: '?', color: '#00ffff', effect: 'spell', spell: 'frostNova', weight: 0, price: 80 },
    summon: { name: 'Scroll of Summoning', char: '?', color: '#9932cc', effect: 'summon', weight: 0, price: 120 },
    fear: { name: 'Scroll of Fear', char: '?', color: '#880088', effect: 'fear', weight: 0, price: 60 },
    confusion: { name: 'Scroll of Confusion', char: '?', color: '#ff88ff', effect: 'confuse', weight: 0, price: 60 },
    genocide: { name: 'Scroll of Genocide', char: '?', color: '#000000', effect: 'genocide', weight: 0, price: 1000 }
};

// Food
const FOODS = {
    bread: { name: 'Bread', char: '%', color: '#deb887', nutrition: 30, weight: 1, price: 5 },
    meat: { name: 'Meat', char: '%', color: '#8b0000', nutrition: 50, weight: 2, price: 15 },
    fruit: { name: 'Fruit', char: '%', color: '#ff6347', nutrition: 20, weight: 1, price: 8 },
    cheese: { name: 'Cheese', char: '%', color: '#ffd700', nutrition: 25, weight: 1, price: 10 },
    ration: { name: 'Food Ration', char: '%', color: '#8b4513', nutrition: 100, weight: 3, price: 30 },
    corpse: { name: 'Corpse', char: '%', color: '#660000', nutrition: 60, weight: 5, price: 0, risky: true }
};

// Magic item prefixes
const ITEM_PREFIXES = {
    sharp: { name: 'Sharp', damageBonus: 2, value: 1.3 },
    keen: { name: 'Keen', critBonus: 0.05, value: 1.4 },
    swift: { name: 'Swift', speedBonus: 10, value: 1.3 },
    heavy: { name: 'Heavy', damageBonus: 3, speedPenalty: 10, value: 1.2 },
    vampiric: { name: 'Vampiric', lifesteal: 0.1, value: 2.0 },
    flaming: { name: 'Flaming', fireDamage: 5, value: 1.8 },
    freezing: { name: 'Freezing', iceDamage: 5, value: 1.8 },
    shocking: { name: 'Shocking', lightningDamage: 5, value: 1.8 },
    venomous: { name: 'Venomous', poisonDamage: 3, value: 1.6 },
    holy: { name: 'Holy', holyDamage: 5, value: 2.0 },
    cursed: { name: 'Cursed', damageBonus: 5, cursed: true, value: 0.5 },
    sturdy: { name: 'Sturdy', defenseBonus: 2, value: 1.4 },
    reinforced: { name: 'Reinforced', defenseBonus: 3, value: 1.5 },
    light: { name: 'Light', weightReduction: 0.5, value: 1.3 },
    blessed: { name: 'Blessed', allStats: 1, value: 2.5 }
};

// Magic item suffixes
const ITEM_SUFFIXES = {
    ofPower: { name: 'of Power', strBonus: 2, value: 1.5 },
    ofAgility: { name: 'of Agility', dexBonus: 2, value: 1.5 },
    ofWisdom: { name: 'of Wisdom', wisBonus: 2, value: 1.5 },
    ofIntelligence: { name: 'of Intelligence', intBonus: 2, value: 1.5 },
    ofVitality: { name: 'of Vitality', conBonus: 2, value: 1.5 },
    ofCharisma: { name: 'of Charisma', chaBonus: 2, value: 1.5 },
    ofHealth: { name: 'of Health', hpBonus: 15, value: 1.4 },
    ofMana: { name: 'of Mana', mpBonus: 15, value: 1.4 },
    ofProtection: { name: 'of Protection', defenseBonus: 2, value: 1.5 },
    ofHaste: { name: 'of Haste', speedBonus: 15, value: 1.6 },
    ofRegeneration: { name: 'of Regeneration', hpRegen: 1, value: 1.8 },
    ofTheGiant: { name: 'of the Giant', strBonus: 5, value: 2.5 },
    ofTheFox: { name: 'of the Fox', intBonus: 5, value: 2.5 },
    ofTheMongoose: { name: 'of the Mongoose', dexBonus: 5, value: 2.5 }
};

// Artifact weapons (unique legendary items)
const ARTIFACTS = {
    excalibur: {
        name: 'Excalibur',
        type: 'weapon',
        char: '/',
        color: '#ffd700',
        damage: '2d8',
        holyDamage: 10,
        strBonus: 5,
        defense: 3,
        description: 'The legendary sword of kings',
        special: 'Glows in the presence of enemies'
    },
    mjolnir: {
        name: 'Mjolnir',
        type: 'weapon',
        char: '!',
        color: '#87ceeb',
        damage: '2d6',
        lightningDamage: 15,
        returns: true,
        description: 'The hammer of the thunder god',
        special: 'Returns when thrown'
    },
    deathsScythe: {
        name: "Death's Scythe",
        type: 'weapon',
        char: '7',
        color: '#000000',
        damage: '3d6',
        critBonus: 0.25,
        lifesteal: 0.2,
        description: 'The weapon of the reaper',
        special: 'Instant kill on critical hits'
    },
    aegisShield: {
        name: 'Aegis',
        type: 'armor',
        char: '[',
        color: '#ffd700',
        defense: 10,
        magicReflect: 0.3,
        description: 'The shield of the gods',
        special: 'Reflects magical attacks'
    },
    ringOfPower: {
        name: 'Ring of Power',
        type: 'ring',
        char: '=',
        color: '#ffd700',
        allStats: 3,
        invisible: true,
        cursed: true,
        description: 'One ring to rule them all',
        special: 'Grants invisibility but corrupts the wearer'
    }
};

// Set items
const ITEM_SETS = {
    shadowSet: {
        name: 'Shadow Set',
        pieces: ['Shadow Hood', 'Shadow Cloak', 'Shadow Boots', 'Shadow Dagger'],
        bonuses: {
            2: { dexBonus: 3, description: '+3 Dexterity' },
            3: { invisible: true, description: 'Invisibility in shadows' },
            4: { critBonus: 0.2, backstabBonus: 2, description: '+20% Crit, +2x Backstab' }
        }
    },
    dragonSet: {
        name: 'Dragon Set',
        pieces: ['Dragon Helm', 'Dragon Armor', 'Dragon Gauntlets', 'Dragon Boots'],
        bonuses: {
            2: { fireRes: 50, description: '+50% Fire Resistance' },
            3: { strBonus: 5, description: '+5 Strength' },
            4: { fireDamage: 20, fireImmune: true, description: 'Fire attacks, Fire immunity' }
        }
    },
    archmageSet: {
        name: 'Archmage Set',
        pieces: ['Archmage Crown', 'Archmage Robe', 'Archmage Ring', 'Archmage Staff'],
        bonuses: {
            2: { mpBonus: 50, description: '+50 Mana' },
            3: { spellPower: 0.25, description: '+25% Spell Power' },
            4: { mpRegen: 5, noCost: 0.2, description: '+5 MP Regen, 20% no mana cost' }
        }
    }
};

// Generate random magic item
function generateMagicItem(baseItem, rarity, rng) {
    const item = deepClone(baseItem);
    item.rarity = rarity;

    // Add prefix based on rarity
    if (rarity !== 'COMMON' && rng.bool(0.7)) {
        const prefixKeys = Object.keys(ITEM_PREFIXES);
        const prefix = ITEM_PREFIXES[rng.pick(prefixKeys)];
        item.prefix = prefix;
        item.name = `${prefix.name} ${item.name}`;
        Object.assign(item, prefix);
    }

    // Add suffix based on rarity
    if ((rarity === 'RARE' || rarity === 'EPIC' || rarity === 'LEGENDARY') && rng.bool(0.6)) {
        const suffixKeys = Object.keys(ITEM_SUFFIXES);
        const suffix = ITEM_SUFFIXES[rng.pick(suffixKeys)];
        item.suffix = suffix;
        item.name = `${item.name} ${suffix.name}`;
        Object.assign(item, suffix);
    }

    // Bonus enchantment for epic+
    if (rarity === 'EPIC' || rarity === 'LEGENDARY') {
        item.enchantLevel = rng.int(1, rarity === 'LEGENDARY' ? 3 : 2);
        item.name = `${item.name} +${item.enchantLevel}`;
    }

    return item;
}
