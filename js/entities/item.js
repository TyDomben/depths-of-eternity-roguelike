// Item Entity Class (for items on the ground)

class ItemEntity {
    constructor(x, y, itemData) {
        this.id = generateId();
        this.x = x;
        this.y = y;

        // Copy item data
        this.data = itemData;
        this.name = itemData.name;
        this.char = itemData.char || '?';
        this.color = itemData.color || '#ffffff';
        this.rarity = itemData.rarity || 'COMMON';
        this.category = itemData.category;
        this.stackable = itemData.stackable || false;
        this.count = itemData.count || 1;
        this.identified = itemData.identified !== false;
        this.value = itemData.value || 0;
        this.weight = itemData.weight || 0;
    }

    getDisplayName() {
        if (!this.identified) {
            return `Unidentified ${this.category}`;
        }

        let name = this.name;
        if (this.count > 1) {
            name += ` (${this.count})`;
        }
        return name;
    }

    getTooltip() {
        const lines = [];

        // Name with rarity color
        lines.push({ text: this.getDisplayName(), color: RARITIES[this.rarity]?.color || '#ffffff' });

        if (!this.identified) {
            lines.push({ text: 'Needs to be identified', color: '#888888' });
            return lines;
        }

        // Rarity
        lines.push({ text: RARITIES[this.rarity]?.name || 'Common', color: '#888888' });

        // Stats
        if (this.data.damage) lines.push({ text: `Damage: ${this.data.damage}`, color: '#ff8888' });
        if (this.data.defense) lines.push({ text: `Defense: +${this.data.defense}`, color: '#88ff88' });
        if (this.data.speed) lines.push({ text: `Speed: ${this.data.speed}`, color: '#ffff88' });

        // Bonuses
        const bonuses = [];
        if (this.data.strBonus) bonuses.push(`+${this.data.strBonus} STR`);
        if (this.data.dexBonus) bonuses.push(`+${this.data.dexBonus} DEX`);
        if (this.data.intBonus) bonuses.push(`+${this.data.intBonus} INT`);
        if (this.data.conBonus) bonuses.push(`+${this.data.conBonus} CON`);
        if (this.data.wisBonus) bonuses.push(`+${this.data.wisBonus} WIS`);
        if (this.data.chaBonus) bonuses.push(`+${this.data.chaBonus} CHA`);
        if (this.data.hpBonus) bonuses.push(`+${this.data.hpBonus} HP`);
        if (this.data.mpBonus) bonuses.push(`+${this.data.mpBonus} MP`);

        if (bonuses.length > 0) {
            lines.push({ text: bonuses.join(', '), color: '#88ff88' });
        }

        // Special properties
        if (this.data.critBonus) lines.push({ text: `+${Math.floor(this.data.critBonus * 100)}% Crit`, color: '#ffaa88' });
        if (this.data.lifesteal) lines.push({ text: `${Math.floor(this.data.lifesteal * 100)}% Lifesteal`, color: '#ff88ff' });

        // Consumable effects
        if (this.data.effect === 'heal') lines.push({ text: `Heals ${this.data.value} HP`, color: '#ff8888' });
        if (this.data.effect === 'mana') lines.push({ text: `Restores ${this.data.value} MP`, color: '#8888ff' });
        if (this.data.nutrition) lines.push({ text: `Nutrition: ${this.data.nutrition}`, color: '#ffaa88' });

        // Description
        if (this.data.description) {
            lines.push({ text: this.data.description, color: '#aaaaaa', italic: true });
        }

        // Value and weight
        lines.push({ text: `Value: ${this.value}g  Weight: ${this.weight}`, color: '#888888' });

        return lines;
    }

    // Convert to inventory item
    toInventoryItem() {
        return {
            ...deepClone(this.data),
            id: this.id,
            count: this.count
        };
    }

    serialize() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            data: deepClone(this.data),
            count: this.count
        };
    }

    static deserialize(data) {
        const item = new ItemEntity(data.x, data.y, data.data);
        item.id = data.id;
        item.count = data.count;
        return item;
    }
}

// Spawn items for a floor
function spawnItemsForFloor(floor, map, rng) {
    const items = [];
    const biome = getBiomeForFloor(floor);

    // Base item count
    const count = 5 + Math.floor(floor / 3) + rng.int(0, 3);

    for (let i = 0; i < count; i++) {
        const itemData = Inventory.generateRandomItem(floor, rng);
        if (!itemData) continue;

        const item = new ItemEntity(0, 0, itemData);

        // Place in random room
        const room = rng.pick(map.rooms.slice(1));
        if (room) {
            const pos = getItemSpawnPosition(room, map, items, rng);
            item.x = pos.x;
            item.y = pos.y;
        }

        items.push(item);
    }

    // Spawn gold piles
    const goldCount = 3 + rng.int(0, 3);
    for (let i = 0; i < goldCount; i++) {
        const amount = (10 + floor * 5) * rng.int(1, 3);
        const goldItem = new ItemEntity(0, 0, {
            name: 'Gold',
            char: '$',
            color: '#ffd700',
            category: ITEM_CATEGORIES.GOLD,
            value: amount,
            stackable: true,
            count: amount,
            weight: 0
        });

        const room = rng.pick(map.rooms);
        if (room) {
            const pos = getItemSpawnPosition(room, map, items, rng);
            goldItem.x = pos.x;
            goldItem.y = pos.y;
        }

        items.push(goldItem);
    }

    return items;
}

function getItemSpawnPosition(room, map, existingItems, rng) {
    const attempts = 20;

    for (let i = 0; i < attempts; i++) {
        const x = rng.int(room.x + 1, room.x + room.width - 2);
        const y = rng.int(room.y + 1, room.y + room.height - 2);

        const tile = map.tiles[y][x];
        if (tile !== TILE_TYPES.FLOOR && tile !== TILE_TYPES.SHOP_FLOOR) continue;

        const occupied = existingItems.some(item => item.x === x && item.y === y);
        if (occupied) continue;

        return { x, y };
    }

    return room.center;
}
