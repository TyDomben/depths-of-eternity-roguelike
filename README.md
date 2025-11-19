# Depths of Eternity

A deep, replayable roguelike dungeon crawler with procedurally generated dungeons, 8 playable classes, and endless replayability.

## Features

### Core Gameplay
- **Procedurally Generated Dungeons** - 10 unique biomes with distinct themes and enemies
- **Turn-based Combat** - Strategic positioning, flanking, and backstabs matter
- **Grid-based Movement** - Classic roguelike controls
- **Permadeath with Meta-progression** - Unlock classes, bonuses, and achievements

### 8 Playable Classes
1. **Warrior** - Tank/Melee DPS with high HP and defense
2. **Mage** - Ranged spellcaster with devastating magic
3. **Rogue** - Stealth assassin with critical hits and backstabs
4. **Ranger** - Ranged DPS with animal companions
5. **Cleric** - Healer/Support with holy magic
6. **Necromancer** - Summoner with dark magic and undead minions
7. **Monk** - Fast melee fighter using unarmed combat
8. **Bard** - Support/Debuffer with songs and charms

Each class has a unique skill tree with 30+ skills!

### 10 Biomes
1. Ancient Crypt (Floors 1-5) - Undead, skeletons, zombies
2. Fire Caverns (Floors 6-10) - Demons, fire elementals
3. Frozen Wastes (Floors 11-15) - Ice creatures, yetis
4. Overgrown Ruins (Floors 16-20) - Plants, insects
5. Crystal Caves (Floors 21-25) - Golems, earth elementals
6. Haunted Library (Floors 26-30) - Ghosts, illusions
7. Flooded Depths (Floors 31-35) - Sea creatures
8. Corrupted Temple (Floors 36-40) - Cultists, dark magic
9. Mechanical Dungeon (Floors 41-45) - Constructs, traps
10. Void Realm (Floors 46-50) - Cosmic horrors

### Items & Equipment
- 200+ unique items
- Procedurally generated magic items with prefixes/suffixes
- Equipment slots: weapon, armor, helm, boots, gloves, rings, amulet
- Potions, scrolls, food, and consumables
- Artifact weapons with special abilities
- Set items with bonuses
- Cursed items (risk/reward)
- Identification system

### Combat System
- Positioning matters (flanking, backstab bonuses)
- Elemental interactions (fire, ice, lightning, poison, holy, dark)
- Status effects (poison, burning, frozen, blessed, and many more)
- Critical hits and dodge mechanics
- Line of sight matters

### Meta-Progression
- Unlock new classes by playing
- Permanent stat bonuses
- Achievement system (50+ achievements)
- Bestiary completion
- Starting bonuses purchasable with unlock points

## Controls

### Movement
- **Numpad**: 7/8/9/4/6/1/2/3
- **WASD + QEZC**: 8-directional movement
- **Arrow keys**: 4-directional
- **Vi keys**: h/j/k/l/y/u/b/n

### Actions
- **.** - Wait
- **g** - Pick up item
- **i** - Inventory
- **c** - Character sheet
- **k** - Skills
- **x** - Examine
- **s** - Search for secrets
- **r** - Rest
- **>** - Descend stairs
- **<** - Ascend stairs
- **1-0** - Use hotbar items
- **?** - Help

### Mouse
- Click on enemies to attack (if adjacent)
- Click on inventory items to use/equip
- Right-click for context menu

## How to Play

1. **Open** `index.html` in a modern web browser
2. **Select** "New Game" from the main menu
3. **Choose** a class (start with Warrior, Mage, or Rogue)
4. **Explore** the dungeon, kill enemies, collect loot
5. **Descend** deeper by finding stairs down (>)
6. **Survive** to floor 50 to win!

### Tips
- Manage your hunger - eat food regularly
- Rest to recover HP/MP when safe
- Identify items at altars or with scrolls
- Search walls for secret rooms
- Backstab enemies for bonus damage
- Watch your weight limit
- Save often!

## Technical Requirements

- Modern web browser with HTML5 Canvas support
- JavaScript enabled
- ~10MB storage for saves (localStorage)
- 1280x720 minimum resolution recommended

## Game Modes

- **Normal** - Balanced difficulty, learn the game
- **Endless** - See how deep you can go
- **Daily Challenge** - Same seed for everyone, compete for high scores

## Development

This game is built with vanilla JavaScript, HTML5 Canvas, and CSS. No external dependencies.

### Project Structure
```
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styles
└── js/
    ├── utils/          # Helpers, RNG, constants
    ├── core/           # Renderer, input, audio, events
    ├── data/           # Items, enemies, classes, biomes
    ├── systems/        # Combat, AI, pathfinding, FOV
    ├── entities/       # Player, enemy, item classes
    ├── ui/             # UI management
    ├── game/           # Main game loop, state, save
    └── main.js         # Entry point
```

## Debug Commands

Open browser console and use:
```javascript
DepthsOfEternity.debug.giveGold(1000);
DepthsOfEternity.debug.levelUp();
DepthsOfEternity.debug.heal();
DepthsOfEternity.debug.nextFloor();
DepthsOfEternity.debug.revealMap();
DepthsOfEternity.debug.unlockAll();
```

## Credits

Depths of Eternity - A comprehensive roguelike dungeon crawler

Built with love for the roguelike community.

## License

MIT License - Feel free to modify and distribute.
