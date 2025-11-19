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
    scythe: { name: 'Scythe', char: '7', color: '#444444', damage: '2d4', speed: 85, weight: 6, value: 100, twoHanded: true, critBonus: 0.15, class: ['necromancer'] },

    // Additional Swords
    gladius: { name: 'Gladius', char: '/', color: '#cccccc', damage: '1d6', speed: 108, weight: 2, value: 30, class: ['warrior', 'rogue'] },
    falchion: { name: 'Falchion', char: '/', color: '#bbbbbb', damage: '1d8', speed: 95, weight: 4, value: 55, class: ['warrior'] },
    claymore: { name: 'Claymore', char: '/', color: '#999999', damage: '2d6', speed: 75, weight: 9, value: 110, twoHanded: true, class: ['warrior'] },
    estoc: { name: 'Estoc', char: '/', color: '#dddddd', damage: '1d8', speed: 105, weight: 3, value: 65, armorPiercing: true, class: ['rogue', 'warrior'] },
    flamberge: { name: 'Flamberge', char: '/', color: '#ff8866', damage: '2d4', speed: 85, weight: 7, value: 95, bleed: true, class: ['warrior'] },
    cutlass: { name: 'Cutlass', char: '/', color: '#aaaaaa', damage: '1d6', speed: 112, weight: 2, value: 35, class: ['rogue', 'bard'] },
    sabre: { name: 'Sabre', char: '/', color: '#cccccc', damage: '1d6', speed: 110, weight: 2, value: 40, critBonus: 0.03, class: ['warrior', 'bard'] },

    // Additional Axes
    tomahawk: { name: 'Tomahawk', char: ')', color: '#8b4513', damage: '1d6', speed: 115, weight: 2, value: 25, throwable: true, class: ['ranger', 'warrior'] },
    pickaxe: { name: 'Pickaxe', char: ')', color: '#666666', damage: '1d6', speed: 90, weight: 4, value: 20, armorPiercing: true, class: ['all'] },
    doubleAxe: { name: 'Double Axe', char: ')', color: '#777777', damage: '1d10', speed: 85, weight: 7, value: 90, class: ['warrior'] },
    executionerAxe: { name: "Executioner's Axe", char: ')', color: '#444444', damage: '2d8', speed: 65, weight: 12, value: 180, critBonus: 0.1, twoHanded: true, class: ['warrior'] },

    // Additional Maces/Hammers
    flail: { name: 'Flail', char: '!', color: '#888888', damage: '1d8', speed: 85, weight: 5, value: 55, ignoreShield: true, class: ['warrior', 'cleric'] },
    scepter: { name: 'Scepter', char: '!', color: '#ffd700', damage: '1d4', speed: 100, weight: 2, value: 80, mpBonus: 10, class: ['cleric', 'mage'] },
    maul: { name: 'Maul', char: '!', color: '#555555', damage: '2d6', speed: 65, weight: 14, value: 140, stun: true, twoHanded: true, class: ['warrior'] },
    holyMace: { name: 'Holy Mace', char: '!', color: '#ffd700', damage: '1d8', speed: 90, weight: 5, value: 100, holyDamage: 3, class: ['cleric'] },

    // Additional Polearms
    pike: { name: 'Pike', char: '|', color: '#888888', damage: '1d8', speed: 90, weight: 6, value: 50, reach: true, twoHanded: true, class: ['warrior'] },
    glaive: { name: 'Glaive', char: '|', color: '#999999', damage: '1d10', speed: 85, weight: 7, value: 85, reach: true, twoHanded: true, class: ['warrior'] },
    lance: { name: 'Lance', char: '|', color: '#aaaaaa', damage: '1d12', speed: 80, weight: 8, value: 100, charge: true, twoHanded: true, class: ['warrior'] },
    pitchfork: { name: 'Pitchfork', char: '|', color: '#8b4513', damage: '1d6', speed: 95, weight: 4, value: 10, reach: true, class: ['all'] },

    // Additional Ranged
    compositeBow: { name: 'Composite Bow', char: '}', color: '#a0522d', damage: '1d8', speed: 105, weight: 3, value: 80, ranged: true, twoHanded: true, class: ['ranger'] },
    recurveBow: { name: 'Recurve Bow', char: '}', color: '#8b4513', damage: '1d6', speed: 115, weight: 2, value: 50, ranged: true, twoHanded: true, class: ['ranger', 'rogue'] },
    heavyCrossbow: { name: 'Heavy Crossbow', char: '}', color: '#666666', damage: '1d12', speed: 70, weight: 7, value: 120, ranged: true, twoHanded: true, armorPiercing: true, class: ['ranger'] },
    handCrossbow: { name: 'Hand Crossbow', char: '}', color: '#888888', damage: '1d6', speed: 100, weight: 2, value: 60, ranged: true, class: ['rogue'] },
    blowgun: { name: 'Blowgun', char: '-', color: '#8b4513', damage: '1d2', speed: 130, weight: 1, value: 15, ranged: true, poison: true, class: ['rogue', 'ranger'] },
    javelin: { name: 'Javelin', char: '|', color: '#8b4513', damage: '1d6', speed: 100, weight: 2, value: 20, ranged: true, throwable: true, class: ['warrior', 'ranger'] },
    throwingKnife: { name: 'Throwing Knife', char: '/', color: '#cccccc', damage: '1d4', speed: 120, weight: 0, value: 10, ranged: true, throwable: true, class: ['rogue'] },
    throwingStar: { name: 'Throwing Star', char: '*', color: '#cccccc', damage: '1d4', speed: 125, weight: 0, value: 12, ranged: true, throwable: true, class: ['monk', 'rogue'] },

    // Additional Staves
    wizardStaff: { name: 'Wizard Staff', char: '/', color: '#4444ff', damage: '1d4', speed: 95, weight: 3, value: 150, mpBonus: 30, intBonus: 2, twoHanded: true, class: ['mage'] },
    wardenStaff: { name: 'Warden Staff', char: '/', color: '#228b22', damage: '1d6', speed: 95, weight: 4, value: 100, wisBonus: 2, twoHanded: true, class: ['cleric', 'ranger'] },
    necroStaff: { name: 'Necromancer Staff', char: '/', color: '#9932cc', damage: '1d4', speed: 95, weight: 3, value: 130, darkDamage: 5, mpBonus: 20, twoHanded: true, class: ['necromancer'] },
    runeStaff: { name: 'Rune Staff', char: '/', color: '#00ffff', damage: '1d6', speed: 90, weight: 4, value: 180, spellPower: 0.1, twoHanded: true, class: ['mage', 'necromancer'] },

    // Exotic/Unique
    chainWhip: { name: 'Chain Whip', char: '~', color: '#888888', damage: '1d6', speed: 105, weight: 3, value: 50, reach: true, disarm: true, class: ['monk', 'bard'] },
    hookSword: { name: 'Hook Sword', char: '/', color: '#888888', damage: '1d6', speed: 105, weight: 3, value: 45, disarm: true, class: ['monk'] },
    warFan: { name: 'War Fan', char: ')', color: '#ff69b4', damage: '1d4', speed: 120, weight: 1, value: 40, parry: true, class: ['monk', 'bard'] },
    tessen: { name: 'Tessen', char: ')', color: '#888888', damage: '1d4', speed: 115, weight: 1, value: 35, class: ['monk', 'rogue'] },
    sai: { name: 'Sai', char: '/', color: '#888888', damage: '1d4', speed: 115, weight: 1, value: 25, parry: true, class: ['monk'] },
    kukri: { name: 'Kukri', char: '/', color: '#888888', damage: '1d6', speed: 108, weight: 2, value: 30, critBonus: 0.05, class: ['rogue', 'ranger'] },
    machete: { name: 'Machete', char: '/', color: '#666666', damage: '1d6', speed: 105, weight: 2, value: 20, class: ['ranger', 'warrior'] }
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
    ironBoots: { name: 'Iron Boots', char: ':', color: '#888888', defense: 2, weight: 5, value: 60, slot: 'boots', class: ['warrior', 'cleric'] },
    platedBoots: { name: 'Plated Boots', char: ':', color: '#aaaaaa', defense: 3, weight: 7, value: 100, slot: 'boots', class: ['warrior'] },
    elfBoots: { name: 'Elven Boots', char: ':', color: '#228b22', defense: 1, weight: 1, value: 80, speedBonus: 10, slot: 'boots', class: ['ranger', 'rogue'] },
    dwarvenBoots: { name: 'Dwarven Boots', char: ':', color: '#cd853f', defense: 2, weight: 4, value: 70, stabilityBonus: true, slot: 'boots', class: ['warrior', 'cleric'] },
    ninjaBoots: { name: 'Ninja Tabi', char: ':', color: '#333333', defense: 0, weight: 1, value: 60, speedBonus: 15, silentMove: true, slot: 'boots', class: ['monk', 'rogue'] },

    // Additional Body Armor
    hideArmor: { name: 'Hide Armor', char: '[', color: '#8b4513', defense: 3, weight: 8, value: 40, class: ['ranger', 'warrior'] },
    brigandine: { name: 'Brigandine', char: '[', color: '#666666', defense: 4, weight: 12, value: 80, class: ['warrior', 'ranger'] },
    splintMail: { name: 'Splint Mail', char: '[', color: '#888888', defense: 7, weight: 25, value: 200, class: ['warrior'] },
    bandedMail: { name: 'Banded Mail', char: '[', color: '#999999', defense: 6, weight: 22, value: 175, class: ['warrior', 'cleric'] },
    elfChain: { name: 'Elven Chain', char: '[', color: '#aaddaa', defense: 5, weight: 10, value: 250, class: ['ranger', 'rogue', 'bard'] },
    mithrilMail: { name: 'Mithril Mail', char: '[', color: '#e0e0e0', defense: 7, weight: 8, value: 500, class: ['all'] },
    dragonScale: { name: 'Dragon Scale', char: '[', color: '#ff4444', defense: 9, weight: 20, value: 800, fireRes: 50, class: ['warrior'] },
    demonHide: { name: 'Demon Hide', char: '[', color: '#880000', defense: 6, weight: 15, value: 400, fireRes: 25, class: ['necromancer', 'warrior'] },
    crystalArmor: { name: 'Crystal Armor', char: '[', color: '#00ffff', defense: 5, weight: 10, value: 350, magicRes: 25, class: ['mage', 'cleric'] },
    shadowArmor: { name: 'Shadow Armor', char: '[', color: '#222222', defense: 4, weight: 6, value: 300, stealthBonus: 20, class: ['rogue', 'necromancer'] },
    battleRobe: { name: 'Battle Robe', char: '[', color: '#4a4a8a', defense: 2, weight: 4, value: 150, mpBonus: 20, class: ['mage', 'necromancer'] },

    // Additional Helmets
    skullCap: { name: 'Skull Cap', char: ']', color: '#666666', defense: 1, weight: 2, value: 25, slot: 'helm', class: ['all'] },
    wartimeHelm: { name: 'Wartime Helm', char: ']', color: '#777777', defense: 2, weight: 4, value: 55, slot: 'helm', class: ['warrior'] },
    hornedHelm: { name: 'Horned Helm', char: ']', color: '#888888', defense: 3, weight: 6, value: 90, intimidation: true, slot: 'helm', class: ['warrior'] },
    wizardHat: { name: 'Wizard Hat', char: ']', color: '#4444ff', defense: 0, weight: 1, value: 60, mpBonus: 10, slot: 'helm', class: ['mage'] },
    tiara: { name: 'Tiara', char: ']', color: '#ffd700', defense: 0, weight: 0, value: 100, chaBonus: 2, mpBonus: 5, slot: 'helm', class: ['bard', 'cleric'] },
    boneHelm: { name: 'Bone Helm', char: ']', color: '#f5f5dc', defense: 2, weight: 3, value: 70, fearImmune: true, slot: 'helm', class: ['necromancer', 'warrior'] },
    dragonHelm: { name: 'Dragon Helm', char: ']', color: '#ff4444', defense: 4, weight: 8, value: 200, fireRes: 25, slot: 'helm', class: ['warrior'] },
    crownOfThorns: { name: 'Crown of Thorns', char: ']', color: '#8b0000', defense: 1, weight: 1, value: 150, thornDamage: 3, slot: 'helm', class: ['cleric'] },

    // Additional Gloves
    silkGloves: { name: 'Silk Gloves', char: '(', color: '#fffafa', defense: 0, weight: 0, value: 30, dexBonus: 1, slot: 'gloves', class: ['mage', 'bard'] },
    steelGauntlets: { name: 'Steel Gauntlets', char: '(', color: '#aaaaaa', defense: 3, weight: 4, value: 80, slot: 'gloves', class: ['warrior'] },
    thiefGloves: { name: 'Thief Gloves', char: '(', color: '#333333', defense: 0, weight: 0, value: 70, lockpickBonus: 20, slot: 'gloves', class: ['rogue'] },
    arcaneGloves: { name: 'Arcane Gloves', char: '(', color: '#9932cc', defense: 0, weight: 0, value: 90, spellPower: 0.05, slot: 'gloves', class: ['mage', 'necromancer'] },
    spikedGauntlets: { name: 'Spiked Gauntlets', char: '(', color: '#666666', defense: 2, weight: 3, value: 65, unarmedBonus: 3, slot: 'gloves', class: ['monk', 'warrior'] },
    healingGloves: { name: 'Gloves of Healing', char: '(', color: '#ffffff', defense: 1, weight: 1, value: 120, healingBonus: 0.2, slot: 'gloves', class: ['cleric'] },

    // Shields
    buckler: { name: 'Buckler', char: ')', color: '#8b4513', defense: 1, weight: 3, value: 20, slot: 'shield', class: ['all'] },
    roundShield: { name: 'Round Shield', char: ')', color: '#888888', defense: 2, weight: 5, value: 45, slot: 'shield', class: ['warrior', 'cleric'] },
    kiteShield: { name: 'Kite Shield', char: ')', color: '#aaaaaa', defense: 3, weight: 8, value: 80, slot: 'shield', class: ['warrior', 'cleric'] },
    towerShield: { name: 'Tower Shield', char: ')', color: '#666666', defense: 5, weight: 15, value: 150, speedPenalty: 10, slot: 'shield', class: ['warrior'] },
    spikedShield: { name: 'Spiked Shield', char: ')', color: '#777777', defense: 2, weight: 6, value: 70, thornDamage: 2, slot: 'shield', class: ['warrior'] },
    magicShield: { name: 'Arcane Barrier', char: ')', color: '#4444ff', defense: 2, weight: 3, value: 120, magicRes: 15, slot: 'shield', class: ['mage', 'cleric'] }
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

    // Additional Rings
    ringEvasion: { name: 'Ring of Evasion', char: '=', color: '#88ff88', dodgeBonus: 0.1, weight: 0, value: 250, slot: 'ring' },
    ringAccuracy: { name: 'Ring of Accuracy', char: '=', color: '#ffaa00', accuracyBonus: 10, weight: 0, value: 180, slot: 'ring' },
    ringMight: { name: 'Ring of Might', char: '=', color: '#ff6600', damageBonus: 3, weight: 0, value: 200, slot: 'ring' },
    ringConstitution: { name: 'Ring of Constitution', char: '=', color: '#00aa00', conBonus: 2, weight: 0, value: 150, slot: 'ring' },
    ringLightningRes: { name: 'Ring of Lightning Resistance', char: '=', color: '#ffff00', lightningRes: 25, weight: 0, value: 200, slot: 'ring' },
    ringDarkRes: { name: 'Ring of Dark Resistance', char: '=', color: '#4a0080', darkRes: 25, weight: 0, value: 200, slot: 'ring' },
    ringFreeAction: { name: 'Ring of Free Action', char: '=', color: '#ffffff', paralyzeImmune: true, weight: 0, value: 350, slot: 'ring' },
    ringSustenance: { name: 'Ring of Sustenance', char: '=', color: '#8b4513', hungerReduction: 0.5, weight: 0, value: 200, slot: 'ring' },
    ringFeatherFall: { name: 'Ring of Feather Fall', char: '=', color: '#aaddff', featherFall: true, weight: 0, value: 180, slot: 'ring' },
    ringWaterWalk: { name: 'Ring of Water Walking', char: '=', color: '#0088ff', waterWalk: true, weight: 0, value: 220, slot: 'ring' },
    ringSpellStoring: { name: 'Ring of Spell Storing', char: '=', color: '#9932cc', spellStorage: 3, weight: 0, value: 400, slot: 'ring' },
    ringWarrior: { name: 'Warrior Ring', char: '=', color: '#cc4400', strBonus: 1, conBonus: 1, weight: 0, value: 180, slot: 'ring' },
    ringScholar: { name: 'Scholar Ring', char: '=', color: '#4444cc', intBonus: 1, wisBonus: 1, weight: 0, value: 180, slot: 'ring' },

    // Amulets
    amuletHealth: { name: 'Amulet of Health', char: '"', color: '#ff4444', hpBonus: 20, weight: 0, value: 200, slot: 'amulet' },
    amuletMana: { name: 'Amulet of Mana', char: '"', color: '#4444ff', mpBonus: 20, weight: 0, value: 200, slot: 'amulet' },
    amuletWisdom: { name: 'Amulet of Wisdom', char: '"', color: '#ffff44', wisBonus: 3, weight: 0, value: 250, slot: 'amulet' },
    amuletLife: { name: 'Amulet of Life Saving', char: '"', color: '#ffffff', lifeSaving: true, weight: 0, value: 1000, slot: 'amulet' },
    amuletReflection: { name: 'Amulet of Reflection', char: '"', color: '#ff88ff', magicReflect: 0.2, weight: 0, value: 600, slot: 'amulet' },
    amuletStrangulation: { name: 'Amulet of Strangulation', char: '"', color: '#880000', cursed: true, damage: 1, weight: 0, value: 0, slot: 'amulet' },
    amuletESP: { name: 'Amulet of ESP', char: '"', color: '#ff00ff', telepathy: true, weight: 0, value: 500, slot: 'amulet' },
    amuletConstitution: { name: 'Amulet of Constitution', char: '"', color: '#00ff00', conBonus: 3, weight: 0, value: 250, slot: 'amulet' },
    amuletSpeed: { name: 'Amulet of Speed', char: '"', color: '#ffff00', speedBonus: 15, weight: 0, value: 400, slot: 'amulet' },
    amuletProtection: { name: 'Amulet of Protection', char: '"', color: '#aaaaaa', defense: 2, weight: 0, value: 300, slot: 'amulet' },
    amuletElements: { name: 'Amulet of Elements', char: '"', color: '#00ffff', fireRes: 15, iceRes: 15, lightningRes: 15, weight: 0, value: 450, slot: 'amulet' },
    amuletUndeath: { name: 'Amulet of Undeath', char: '"', color: '#4a0080', undeadControl: true, darkRes: 50, weight: 0, value: 500, slot: 'amulet' },
    amuletFaith: { name: 'Amulet of Faith', char: '"', color: '#ffd700', wisBonus: 2, healingBonus: 0.15, weight: 0, value: 350, slot: 'amulet' },
    amuletCourage: { name: 'Amulet of Courage', char: '"', color: '#ff8800', fearImmune: true, strBonus: 1, weight: 0, value: 280, slot: 'amulet' },
    amuletNature: { name: 'Amulet of Nature', char: '"', color: '#228b22', poisonRes: 50, regenInWild: true, weight: 0, value: 320, slot: 'amulet' }
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
    experience: { name: 'Potion of Experience', char: '!', color: '#9932cc', effect: 'xp', value: 100, weight: 1, price: 200 },

    // Additional Potions
    defense: { name: 'Potion of Defense', char: '!', color: '#888888', effect: 'status', status: 'FORTIFIED', duration: 40, weight: 1, price: 55 },
    regeneration: { name: 'Potion of Regeneration', char: '!', color: '#00ff88', effect: 'status', status: 'REGENERATION', duration: 30, weight: 1, price: 70 },
    lightningRes: { name: 'Potion of Lightning Resistance', char: '!', color: '#ffff88', effect: 'resist', resistType: 'lightning', duration: 50, weight: 1, price: 40 },
    magicRes: { name: 'Potion of Magic Resistance', char: '!', color: '#ff88ff', effect: 'resist', resistType: 'magic', duration: 50, weight: 1, price: 60 },
    giant: { name: 'Potion of Giant Strength', char: '!', color: '#8b4513', effect: 'status', status: 'GIANT_STRENGTH', duration: 30, weight: 1, price: 100 },
    heroism: { name: 'Potion of Heroism', char: '!', color: '#ffd700', effect: 'multi', effects: ['STRENGTH', 'FORTIFIED'], duration: 25, weight: 1, price: 120 },
    confusion: { name: 'Potion of Confusion', char: '!', color: '#ff88ff', effect: 'status', status: 'CONFUSED', duration: 20, weight: 1, price: 30, cursed: true },
    poison: { name: 'Potion of Poison', char: '!', color: '#00aa00', effect: 'damage', damageType: 'poison', value: 30, weight: 1, price: 25, cursed: true },
    blindness: { name: 'Potion of Blindness', char: '!', color: '#333333', effect: 'status', status: 'BLIND', duration: 30, weight: 1, price: 30, cursed: true },
    paralysis: { name: 'Potion of Paralysis', char: '!', color: '#888888', effect: 'status', status: 'PARALYZED', duration: 10, weight: 1, price: 30, cursed: true },
    levitation: { name: 'Potion of Levitation', char: '!', color: '#aaddff', effect: 'status', status: 'LEVITATE', duration: 50, weight: 1, price: 80 },
    seeinvisible: { name: 'Potion of See Invisible', char: '!', color: '#ddddff', effect: 'status', status: 'SEE_INVISIBLE', duration: 100, weight: 1, price: 60 },
    polymorph: { name: 'Potion of Polymorph', char: '!', color: '#ff00ff', effect: 'polymorph', weight: 1, price: 150 },
    enlightenment: { name: 'Potion of Enlightenment', char: '!', color: '#ffffaa', effect: 'identify_all', weight: 1, price: 200 },
    statGain: { name: 'Potion of Gain Ability', char: '!', color: '#ffffff', effect: 'stat_gain', weight: 1, price: 300 },
    restore: { name: 'Potion of Restore Ability', char: '!', color: '#ffcccc', effect: 'restore_stats', weight: 1, price: 150 }
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
    genocide: { name: 'Scroll of Genocide', char: '?', color: '#000000', effect: 'genocide', weight: 0, price: 1000 },

    // Additional Scrolls
    createMonster: { name: 'Scroll of Create Monster', char: '?', color: '#ff0000', effect: 'create_monster', weight: 0, price: 50, cursed: true },
    destroy: { name: 'Scroll of Destroy Armor', char: '?', color: '#880000', effect: 'destroy_armor', weight: 0, price: 50, cursed: true },
    amnesia: { name: 'Scroll of Amnesia', char: '?', color: '#888888', effect: 'amnesia', weight: 0, price: 50, cursed: true },
    light: { name: 'Scroll of Light', char: '?', color: '#ffffaa', effect: 'light', weight: 0, price: 30 },
    gold: { name: 'Scroll of Gold Detection', char: '?', color: '#ffd700', effect: 'detect_gold', weight: 0, price: 40 },
    food: { name: 'Scroll of Food Detection', char: '?', color: '#8b4513', effect: 'detect_food', weight: 0, price: 40 },
    monster: { name: 'Scroll of Monster Detection', char: '?', color: '#ff4444', effect: 'detect_monster', weight: 0, price: 50 },
    item: { name: 'Scroll of Item Detection', char: '?', color: '#00ff00', effect: 'detect_item', weight: 0, price: 50 },
    blessing: { name: 'Scroll of Blessing', char: '?', color: '#ffd700', effect: 'bless', weight: 0, price: 100 },
    protection: { name: 'Scroll of Protection', char: '?', color: '#aaaaaa', effect: 'protect', duration: 50, weight: 0, price: 80 },
    earthQuake: { name: 'Scroll of Earth Quake', char: '?', color: '#8b4513', effect: 'spell', spell: 'earthquake', weight: 0, price: 100 },
    banishment: { name: 'Scroll of Banishment', char: '?', color: '#ffffff', effect: 'banish', weight: 0, price: 150 },
    charging: { name: 'Scroll of Charging', char: '?', color: '#00ffff', effect: 'recharge', weight: 0, price: 80 },
    blankPaper: { name: 'Blank Scroll', char: '?', color: '#f5f5dc', effect: 'none', weight: 0, price: 10 },
    fireStorm: { name: 'Scroll of Fire Storm', char: '?', color: '#ff6600', effect: 'spell', spell: 'firestorm', weight: 0, price: 150 },
    blizzard: { name: 'Scroll of Blizzard', char: '?', color: '#aaddff', effect: 'spell', spell: 'blizzard', weight: 0, price: 150 },
    chainLightning: { name: 'Scroll of Chain Lightning', char: '?', color: '#ffff00', effect: 'spell', spell: 'chainlightning', weight: 0, price: 150 },
    meteor: { name: 'Scroll of Meteor', char: '?', color: '#ff4400', effect: 'spell', spell: 'meteor', weight: 0, price: 300 },
    timestop: { name: 'Scroll of Time Stop', char: '?', color: '#9932cc', effect: 'timestop', duration: 5, weight: 0, price: 500 },
    wish: { name: 'Scroll of Wishing', char: '?', color: '#ffd700', effect: 'wish', weight: 0, price: 2000 }
};

// Food
const FOODS = {
    bread: { name: 'Bread', char: '%', color: '#deb887', nutrition: 30, weight: 1, price: 5 },
    meat: { name: 'Meat', char: '%', color: '#8b0000', nutrition: 50, weight: 2, price: 15 },
    fruit: { name: 'Fruit', char: '%', color: '#ff6347', nutrition: 20, weight: 1, price: 8 },
    cheese: { name: 'Cheese', char: '%', color: '#ffd700', nutrition: 25, weight: 1, price: 10 },
    ration: { name: 'Food Ration', char: '%', color: '#8b4513', nutrition: 100, weight: 3, price: 30 },
    corpse: { name: 'Corpse', char: '%', color: '#660000', nutrition: 60, weight: 5, price: 0, risky: true },

    // Additional Foods
    apple: { name: 'Apple', char: '%', color: '#ff0000', nutrition: 15, weight: 0, price: 3 },
    banana: { name: 'Banana', char: '%', color: '#ffff00', nutrition: 15, weight: 0, price: 3 },
    berries: { name: 'Berries', char: '%', color: '#8b0050', nutrition: 10, weight: 0, price: 5 },
    mushroom: { name: 'Mushroom', char: '%', color: '#f5f5dc', nutrition: 20, weight: 0, price: 8, risky: true },
    cookedMeat: { name: 'Cooked Meat', char: '%', color: '#cd853f', nutrition: 70, weight: 2, price: 25 },
    fish: { name: 'Fish', char: '%', color: '#4682b4', nutrition: 40, weight: 1, price: 12 },
    cookedFish: { name: 'Cooked Fish', char: '%', color: '#ffa500', nutrition: 55, weight: 1, price: 18 },
    pie: { name: 'Meat Pie', char: '%', color: '#cd853f', nutrition: 80, weight: 2, price: 35 },
    stew: { name: 'Stew', char: '%', color: '#8b4513', nutrition: 90, weight: 3, price: 40 },
    waybread: { name: 'Elven Waybread', char: '%', color: '#fffacd', nutrition: 150, weight: 1, price: 100 },
    honeycomb: { name: 'Honeycomb', char: '%', color: '#ffd700', nutrition: 25, weight: 0, price: 15, hpRegen: 2 },
    wine: { name: 'Wine', char: '%', color: '#8b0000', nutrition: 10, weight: 1, price: 20, confusion: true },
    ale: { name: 'Ale', char: '%', color: '#daa520', nutrition: 15, weight: 1, price: 8, strBonus: 1, confusion: true },
    herbs: { name: 'Healing Herbs', char: '%', color: '#228b22', nutrition: 5, weight: 0, price: 30, heal: 10 },
    rottenFood: { name: 'Rotten Food', char: '%', color: '#556b2f', nutrition: 50, weight: 1, price: 0, poison: true }
};

// Wands
const WANDS = {
    wandFire: { name: 'Wand of Fire', char: '-', color: '#ff4400', effect: 'fireball', charges: 8, damage: '3d6', damageType: 'fire', range: 6, weight: 1, price: 200 },
    wandIce: { name: 'Wand of Ice', char: '-', color: '#00ffff', effect: 'icebolt', charges: 10, damage: '2d6', damageType: 'ice', range: 8, weight: 1, price: 180 },
    wandLightning: { name: 'Wand of Lightning', char: '-', color: '#ffff00', effect: 'lightning', charges: 8, damage: '3d6', damageType: 'lightning', range: 10, weight: 1, price: 200 },
    wandMagicMissile: { name: 'Wand of Magic Missile', char: '-', color: '#ff00ff', effect: 'magic_missile', charges: 15, damage: '2d4', damageType: 'magic', range: 8, weight: 1, price: 150 },
    wandPolymorph: { name: 'Wand of Polymorph', char: '-', color: '#9932cc', effect: 'polymorph', charges: 5, range: 6, weight: 1, price: 300 },
    wandSleep: { name: 'Wand of Sleep', char: '-', color: '#aaaaff', effect: 'sleep', charges: 8, duration: 10, range: 6, weight: 1, price: 180 },
    wandTeleport: { name: 'Wand of Teleportation', char: '-', color: '#ff00ff', effect: 'teleport', charges: 6, range: 6, weight: 1, price: 250 },
    wandDeath: { name: 'Wand of Death', char: '-', color: '#000000', effect: 'death', charges: 3, range: 8, weight: 1, price: 800 },
    wandSlow: { name: 'Wand of Slow Monster', char: '-', color: '#888888', effect: 'slow', charges: 10, duration: 20, range: 6, weight: 1, price: 160 },
    wandConfuse: { name: 'Wand of Confusion', char: '-', color: '#ff88ff', effect: 'confuse', charges: 8, duration: 15, range: 6, weight: 1, price: 150 },
    wandFear: { name: 'Wand of Fear', char: '-', color: '#880088', effect: 'fear', charges: 8, duration: 10, range: 6, weight: 1, price: 160 },
    wandHealing: { name: 'Wand of Healing', char: '-', color: '#00ff00', effect: 'heal', charges: 10, value: 30, range: 4, weight: 1, price: 200 },
    wandDrainLife: { name: 'Wand of Drain Life', char: '-', color: '#8b0000', effect: 'drain', charges: 6, damage: '2d8', range: 6, weight: 1, price: 280 },
    wandLight: { name: 'Wand of Light', char: '-', color: '#ffffaa', effect: 'light', charges: 15, range: 5, weight: 1, price: 80 },
    wandDigging: { name: 'Wand of Digging', char: '-', color: '#8b4513', effect: 'dig', charges: 10, range: 8, weight: 1, price: 120 },
    wandLocking: { name: 'Wand of Locking', char: '-', color: '#aaaaaa', effect: 'lock', charges: 12, range: 4, weight: 1, price: 100 },
    wandOpening: { name: 'Wand of Opening', char: '-', color: '#ffd700', effect: 'open', charges: 12, range: 4, weight: 1, price: 100 },
    wandCancellation: { name: 'Wand of Cancellation', char: '-', color: '#ffffff', effect: 'cancel', charges: 5, range: 6, weight: 1, price: 400 },
    wandSummon: { name: 'Wand of Summoning', char: '-', color: '#9932cc', effect: 'summon', charges: 5, range: 3, weight: 1, price: 350 },
    wandProbing: { name: 'Wand of Probing', char: '-', color: '#00ffaa', effect: 'probe', charges: 15, range: 8, weight: 1, price: 120 }
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
    },
    gungnir: {
        name: 'Gungnir',
        type: 'weapon',
        char: '|',
        color: '#aaaaaa',
        damage: '2d8',
        accuracyBonus: 100,
        returns: true,
        description: 'The spear that never misses',
        special: 'Always hits target'
    },
    stormbringer: {
        name: 'Stormbringer',
        type: 'weapon',
        char: '/',
        color: '#000000',
        damage: '3d6',
        darkDamage: 10,
        lifesteal: 0.3,
        cursed: true,
        description: 'The black sword that drinks souls',
        special: 'Drains life but slowly corrupts wielder'
    },
    vorpalBlade: {
        name: 'Vorpal Blade',
        type: 'weapon',
        char: '/',
        color: '#00ffff',
        damage: '2d6',
        critBonus: 0.25,
        instantKill: 0.05,
        description: 'The blade that goes snicker-snack',
        special: '5% chance to instantly decapitate'
    },
    staffOfAsclepius: {
        name: 'Staff of Asclepius',
        type: 'weapon',
        char: '/',
        color: '#00ff00',
        damage: '1d6',
        healingBonus: 0.5,
        cureAll: true,
        description: 'The symbol of healing',
        special: 'Double healing power, cures all ailments'
    },
    gorgonShield: {
        name: 'Gorgon Shield',
        type: 'armor',
        char: ')',
        color: '#556b2f',
        defense: 8,
        petrify: 0.1,
        description: 'Shield bearing the face of Medusa',
        special: '10% chance to petrify attackers'
    },
    bootsOfHermes: {
        name: 'Boots of Hermes',
        type: 'boots',
        char: ':',
        color: '#ffd700',
        speedBonus: 30,
        featherFall: true,
        description: 'Winged sandals of the messenger god',
        special: 'Extreme speed, immune to falling'
    },
    holyGrail: {
        name: 'Holy Grail',
        type: 'amulet',
        char: '"',
        color: '#ffd700',
        hpRegen: 5,
        mpRegen: 3,
        poisonImmune: true,
        description: 'The cup of eternal life',
        special: 'Rapid regeneration, poison immunity'
    },
    dragonSlayer: {
        name: 'Dragon Slayer',
        type: 'weapon',
        char: '/',
        color: '#ff4444',
        damage: '2d10',
        dragonBane: true,
        description: 'A massive blade forged to kill dragons',
        special: 'Triple damage against dragons'
    },
    armorOfAchilles: {
        name: 'Armor of Achilles',
        type: 'armor',
        char: '[',
        color: '#ffd700',
        defense: 15,
        physicalImmune: 0.3,
        description: 'Divine armor forged by Hephaestus',
        special: '30% physical damage immunity'
    },
    bookOfTheDead: {
        name: 'Book of the Dead',
        type: 'tome',
        char: '+',
        color: '#4a0080',
        necroBonus: 0.5,
        undeadSummon: true,
        description: 'Ancient tome of necromantic power',
        special: '+50% necromancy, summon undead'
    },
    crystalBall: {
        name: 'Crystal Ball',
        type: 'misc',
        char: '*',
        color: '#00ffff',
        telepathy: true,
        mapReveal: true,
        description: 'An orb of scrying',
        special: 'Reveals map and enemy thoughts'
    },
    luckyClover: {
        name: 'Lucky Clover',
        type: 'amulet',
        char: '"',
        color: '#00ff00',
        luckBonus: 10,
        critBonus: 0.1,
        dodgeBonus: 0.1,
        description: 'A four-leaf clover of extreme fortune',
        special: '+10 luck, +10% crit and dodge'
    },
    infinityGauntlet: {
        name: 'Gauntlet of Power',
        type: 'gloves',
        char: '(',
        color: '#ffd700',
        allStats: 5,
        spellPower: 0.5,
        description: 'A gauntlet of immense power',
        special: '+5 all stats, +50% spell power'
    }
};

// Tomes (spellbooks)
const TOMES = {
    tomeFireMastery: { name: 'Tome of Fire Mastery', char: '+', color: '#ff4400', skill: 'fire_mastery', skillLevel: 5, weight: 2, price: 500, class: ['mage'] },
    tomeIceMastery: { name: 'Tome of Ice Mastery', char: '+', color: '#00ffff', skill: 'ice_mastery', skillLevel: 5, weight: 2, price: 500, class: ['mage'] },
    tomeLightningMastery: { name: 'Tome of Lightning Mastery', char: '+', color: '#ffff00', skill: 'lightning_mastery', skillLevel: 5, weight: 2, price: 500, class: ['mage'] },
    tomeHealing: { name: 'Tome of Divine Healing', char: '+', color: '#ffffff', skill: 'healing', skillLevel: 5, weight: 2, price: 500, class: ['cleric'] },
    tomeNecromancy: { name: 'Tome of Necromancy', char: '+', color: '#9932cc', skill: 'necromancy', skillLevel: 5, weight: 2, price: 500, class: ['necromancer'] },
    tomeStealth: { name: 'Tome of Shadows', char: '+', color: '#333333', skill: 'stealth', skillLevel: 5, weight: 2, price: 500, class: ['rogue'] },
    tomeMartial: { name: 'Tome of Martial Arts', char: '+', color: '#ff8800', skill: 'martial', skillLevel: 5, weight: 2, price: 500, class: ['monk'] },
    tomeArchery: { name: 'Tome of Archery', char: '+', color: '#8b4513', skill: 'archery', skillLevel: 5, weight: 2, price: 500, class: ['ranger'] },
    tomeBardsong: { name: 'Tome of Bardic Lore', char: '+', color: '#ff69b4', skill: 'bardsong', skillLevel: 5, weight: 2, price: 500, class: ['bard'] },
    tomeWarfare: { name: 'Tome of Warfare', char: '+', color: '#cc4400', skill: 'warfare', skillLevel: 5, weight: 2, price: 500, class: ['warrior'] }
};

// Keys and misc items
const MISC_ITEMS = {
    goldKey: { name: 'Gold Key', char: '~', color: '#ffd700', keyType: 'gold', weight: 0, price: 100 },
    silverKey: { name: 'Silver Key', char: '~', color: '#c0c0c0', keyType: 'silver', weight: 0, price: 50 },
    bossKey: { name: 'Boss Key', char: '~', color: '#ff0000', keyType: 'boss', weight: 0, price: 500 },
    lockpick: { name: 'Lockpick', char: '~', color: '#888888', uses: 5, weight: 0, price: 30 },
    torch: { name: 'Torch', char: '(', color: '#ff8800', lightRadius: 5, duration: 100, weight: 1, price: 10 },
    lantern: { name: 'Lantern', char: '(', color: '#ffff00', lightRadius: 7, duration: 500, weight: 2, price: 50 },
    rope: { name: 'Rope', char: '~', color: '#8b4513', uses: 3, weight: 2, price: 20 },
    pickaxe: { name: 'Mining Pick', char: ')', color: '#888888', uses: 10, weight: 4, price: 40 },
    campKit: { name: 'Camp Kit', char: '=', color: '#8b4513', uses: 5, weight: 3, price: 60 },
    compass: { name: 'Compass', char: '*', color: '#ffd700', mapBonus: true, weight: 0, price: 80 },
    spyglass: { name: 'Spyglass', char: '(', color: '#8b4513', sightBonus: 3, weight: 1, price: 100 },
    gemRuby: { name: 'Ruby', char: '*', color: '#ff0000', value: 200, weight: 0, price: 200 },
    gemSapphire: { name: 'Sapphire', char: '*', color: '#0000ff', value: 200, weight: 0, price: 200 },
    gemEmerald: { name: 'Emerald', char: '*', color: '#00ff00', value: 200, weight: 0, price: 200 },
    gemDiamond: { name: 'Diamond', char: '*', color: '#ffffff', value: 500, weight: 0, price: 500 }
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
