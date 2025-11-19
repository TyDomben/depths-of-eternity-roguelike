// Inventory Management System

class InventorySystem {
    constructor() {
        this.maxSlots = GAME_CONSTANTS.INVENTORY_SIZE;
        this.maxWeight = GAME_CONSTANTS.MAX_WEIGHT;
    }

    // Add item to inventory
    addItem(inventory, item) {
        // Check if item is stackable and already exists
        if (item.stackable) {
            const existing = inventory.find(i =>
                i.type === item.type && i.name === item.name && !i.identified === !item.identified
            );
            if (existing) {
                existing.count = (existing.count || 1) + (item.count || 1);
                Events.emit(EVENTS.INVENTORY_CHANGE, { action: 'stack', item: existing });
                return true;
            }
        }

        // Check for space
        if (inventory.length >= this.maxSlots) {
            Events.emit(EVENTS.INVENTORY_FULL, {});
            return false;
        }

        // Check weight
        const currentWeight = this.calculateWeight(inventory);
        const itemWeight = (item.weight || 0) * (item.count || 1);
        if (currentWeight + itemWeight > this.maxWeight) {
            Events.emit(EVENTS.MESSAGE_ADD, { text: 'Too heavy to carry!', type: 'warning' });
            return false;
        }

        // Add item
        item.id = item.id || generateId();
        inventory.push(item);
        Events.emit(EVENTS.INVENTORY_CHANGE, { action: 'add', item });
        return true;
    }

    // Remove item from inventory
    removeItem(inventory, item, count = 1) {
        const index = inventory.findIndex(i => i.id === item.id);
        if (index === -1) return false;

        const invItem = inventory[index];

        if (invItem.count && invItem.count > count) {
            invItem.count -= count;
            Events.emit(EVENTS.INVENTORY_CHANGE, { action: 'reduce', item: invItem });
        } else {
            inventory.splice(index, 1);
            Events.emit(EVENTS.INVENTORY_CHANGE, { action: 'remove', item: invItem });
        }

        return true;
    }

    // Calculate total weight
    calculateWeight(inventory) {
        return inventory.reduce((total, item) => {
            return total + (item.weight || 0) * (item.count || 1);
        }, 0);
    }

    // Get items by category
    getItemsByCategory(inventory, category) {
        return inventory.filter(item => item.category === category);
    }

    // Sort inventory
    sortInventory(inventory, sortBy = 'type') {
        return inventory.sort((a, b) => {
            switch (sortBy) {
                case 'type':
                    return (a.category || '').localeCompare(b.category || '');
                case 'name':
                    return (a.name || '').localeCompare(b.name || '');
                case 'rarity':
                    const rarityOrder = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'ARTIFACT'];
                    return rarityOrder.indexOf(b.rarity) - rarityOrder.indexOf(a.rarity);
                case 'value':
                    return (b.value || 0) - (a.value || 0);
                default:
                    return 0;
            }
        });
    }

    // Equip item
    equipItem(player, item) {
        const slot = this.getEquipSlot(item);
        if (!slot) {
            Events.emit(EVENTS.MESSAGE_ADD, { text: 'Cannot equip this item', type: 'warning' });
            return false;
        }

        // Check class restrictions
        if (item.class && !item.class.includes('all') && !item.class.includes(player.classId)) {
            Events.emit(EVENTS.MESSAGE_ADD, { text: `${player.className} cannot use this item`, type: 'warning' });
            return false;
        }

        // Unequip current item in slot
        const currentItem = player.equipment[slot];
        if (currentItem) {
            this.unequipItem(player, slot);
        }

        // Handle rings (two slots)
        if (slot === 'ring') {
            if (!player.equipment.ring1) {
                slot = 'ring1';
            } else if (!player.equipment.ring2) {
                slot = 'ring2';
            } else {
                this.unequipItem(player, 'ring1');
                slot = 'ring1';
            }
        }

        // Remove from inventory
        this.removeItem(player.inventory, item);

        // Equip
        player.equipment[slot] = item;
        this.applyItemStats(player, item, true);

        Events.emit(EVENTS.ITEM_EQUIP, { player, item, slot });
        Events.emit(EVENTS.MESSAGE_ADD, { text: `Equipped ${item.name}`, type: 'info' });

        // Check for cursed items
        if (item.cursed && !item.identified) {
            item.identified = true;
            Events.emit(EVENTS.MESSAGE_ADD, { text: 'The item is cursed!', type: 'warning' });
        }

        return true;
    }

    // Unequip item
    unequipItem(player, slot) {
        const item = player.equipment[slot];
        if (!item) return false;

        // Check for cursed items
        if (item.cursed) {
            Events.emit(EVENTS.MESSAGE_ADD, { text: 'The cursed item is stuck!', type: 'warning' });
            return false;
        }

        // Remove stats
        this.applyItemStats(player, item, false);

        // Add to inventory
        if (!this.addItem(player.inventory, item)) {
            // Inventory full, drop item
            Events.emit('item:drop', { item, x: player.x, y: player.y });
        }

        player.equipment[slot] = null;
        Events.emit(EVENTS.ITEM_UNEQUIP, { player, item, slot });

        return true;
    }

    // Get equipment slot for item
    getEquipSlot(item) {
        if (item.slot) return item.slot;

        switch (item.category) {
            case ITEM_CATEGORIES.WEAPON: return 'weapon';
            case ITEM_CATEGORIES.ARMOR: return 'armor';
            case ITEM_CATEGORIES.HELM: return 'helm';
            case ITEM_CATEGORIES.GLOVES: return 'gloves';
            case ITEM_CATEGORIES.BOOTS: return 'boots';
            case ITEM_CATEGORIES.RING: return 'ring';
            case ITEM_CATEGORIES.AMULET: return 'amulet';
            default: return null;
        }
    }

    // Apply or remove item stats
    applyItemStats(player, item, apply) {
        const mult = apply ? 1 : -1;

        // Basic stats
        if (item.strBonus) player.stats.str += item.strBonus * mult;
        if (item.dexBonus) player.stats.dex += item.dexBonus * mult;
        if (item.intBonus) player.stats.int += item.intBonus * mult;
        if (item.conBonus) player.stats.con += item.conBonus * mult;
        if (item.wisBonus) player.stats.wis += item.wisBonus * mult;
        if (item.chaBonus) player.stats.cha += item.chaBonus * mult;
        if (item.allStats) {
            player.stats.str += item.allStats * mult;
            player.stats.dex += item.allStats * mult;
            player.stats.int += item.allStats * mult;
            player.stats.con += item.allStats * mult;
            player.stats.wis += item.allStats * mult;
            player.stats.cha += item.allStats * mult;
        }

        // Combat stats
        if (item.defense) player.bonusDefense = (player.bonusDefense || 0) + item.defense * mult;
        if (item.defenseBonus) player.bonusDefense = (player.bonusDefense || 0) + item.defenseBonus * mult;
        if (item.attackBonus) player.bonusAttack = (player.bonusAttack || 0) + item.attackBonus * mult;
        if (item.speedBonus) player.bonusSpeed = (player.bonusSpeed || 0) + item.speedBonus * mult;
        if (item.speedPenalty) player.bonusSpeed = (player.bonusSpeed || 0) - item.speedPenalty * mult;

        // HP/MP
        if (item.hpBonus) {
            player.maxHp += item.hpBonus * mult;
            if (apply) player.hp += item.hpBonus;
            else player.hp = Math.min(player.hp, player.maxHp);
        }
        if (item.mpBonus) {
            player.maxMp += item.mpBonus * mult;
            if (apply) player.mp += item.mpBonus;
            else player.mp = Math.min(player.mp, player.maxMp);
        }

        // Regen
        if (item.hpRegen) player.hpRegen = (player.hpRegen || 0) + item.hpRegen * mult;
        if (item.mpRegen) player.mpRegen = (player.mpRegen || 0) + item.mpRegen * mult;

        // Crit
        if (item.critBonus) player.critChance = (player.critChance || GAME_CONSTANTS.CRIT_CHANCE) + item.critBonus * mult;

        // Dodge
        if (item.dodgeBonus) player.dodge = (player.dodge || GAME_CONSTANTS.DODGE_BASE) + item.dodgeBonus * mult;

        // Resistances
        if (item.fireRes) player.resistances.fire = (player.resistances.fire || 0) + item.fireRes * mult;
        if (item.iceRes) player.resistances.ice = (player.resistances.ice || 0) + item.iceRes * mult;
        if (item.poisonRes) player.resistances.poison = (player.resistances.poison || 0) + item.poisonRes * mult;

        // Special abilities
        if (item.lifesteal) player.lifesteal = (player.lifesteal || 0) + item.lifesteal * mult;

        // Recalculate derived stats
        player.recalculateStats();
    }

    // Use consumable item
    useItem(player, item, target = null) {
        if (!item.effect) {
            Events.emit(EVENTS.MESSAGE_ADD, { text: 'Nothing happens', type: 'info' });
            return false;
        }

        let used = false;

        switch (item.effect) {
            case 'heal':
                const healed = Combat.heal(player, item.value, item);
                Events.emit(EVENTS.MESSAGE_ADD, { text: `Healed ${healed} HP`, type: 'pickup' });
                used = true;
                break;

            case 'mana':
                const restored = Math.min(item.value, player.maxMp - player.mp);
                player.mp += restored;
                Events.emit(EVENTS.MESSAGE_ADD, { text: `Restored ${restored} MP`, type: 'pickup' });
                used = true;
                break;

            case 'status':
                StatusEffects.apply(player, item.status, item.duration);
                used = true;
                break;

            case 'identify':
                Events.emit('ui:identifyPrompt', { callback: (targetItem) => {
                    if (targetItem && !targetItem.identified) {
                        targetItem.identified = true;
                        Events.emit(EVENTS.ITEM_IDENTIFY, { item: targetItem });
                    }
                }});
                used = true;
                break;

            case 'teleport':
                Events.emit('player:randomTeleport', {});
                used = true;
                break;

            case 'xp':
                player.grantXp(item.value);
                used = true;
                break;

            case 'fullRestore':
                player.hp = player.maxHp;
                player.mp = player.maxMp;
                StatusEffects.clearNegative(player);
                Events.emit(EVENTS.MESSAGE_ADD, { text: 'Fully restored!', type: 'pickup' });
                used = true;
                break;
        }

        if (used) {
            this.removeItem(player.inventory, item, 1);
            Events.emit(EVENTS.ITEM_USE, { item });
            Audio.play('potion');
        }

        return used;
    }

    // Generate random loot
    generateLoot(floor, biome, rng) {
        const items = [];
        const lootCount = rng.int(3, 6);

        for (let i = 0; i < lootCount; i++) {
            const item = this.generateRandomItem(floor, rng);
            if (item) items.push(item);
        }

        return items;
    }

    // Generate single random item
    generateRandomItem(floor, rng) {
        // Determine rarity
        const rarityRoll = rng.float(0, 100);
        let rarity = 'COMMON';
        let accumulated = 0;

        for (const [key, data] of Object.entries(RARITIES)) {
            accumulated += data.weight;
            if (rarityRoll <= accumulated) {
                rarity = key;
                break;
            }
        }

        // Higher floor = better rarity chance
        if (floor > 20 && rarity === 'COMMON' && rng.bool(0.3)) rarity = 'UNCOMMON';
        if (floor > 30 && rarity === 'UNCOMMON' && rng.bool(0.2)) rarity = 'RARE';

        // Choose item type
        const types = ['weapon', 'armor', 'potion', 'scroll', 'food', 'ring'];
        const type = rng.pick(types);

        let item;

        switch (type) {
            case 'weapon':
                const weaponKeys = Object.keys(WEAPONS);
                const baseWeapon = WEAPONS[rng.pick(weaponKeys)];
                item = generateMagicItem(baseWeapon, rarity, rng);
                item.category = ITEM_CATEGORIES.WEAPON;
                break;

            case 'armor':
                const armorKeys = Object.keys(ARMORS);
                const baseArmor = ARMORS[rng.pick(armorKeys)];
                item = generateMagicItem(baseArmor, rarity, rng);
                item.category = baseArmor.slot ? ITEM_CATEGORIES[baseArmor.slot.toUpperCase()] : ITEM_CATEGORIES.ARMOR;
                break;

            case 'potion':
                const potionKeys = Object.keys(POTIONS);
                item = deepClone(POTIONS[rng.pick(potionKeys)]);
                item.category = ITEM_CATEGORIES.POTION;
                item.stackable = true;
                item.count = 1;
                break;

            case 'scroll':
                const scrollKeys = Object.keys(SCROLLS);
                item = deepClone(SCROLLS[rng.pick(scrollKeys)]);
                item.category = ITEM_CATEGORIES.SCROLL;
                item.stackable = true;
                item.count = 1;
                break;

            case 'food':
                const foodKeys = Object.keys(FOODS);
                item = deepClone(FOODS[rng.pick(foodKeys)]);
                item.category = ITEM_CATEGORIES.FOOD;
                item.stackable = true;
                item.count = 1;
                break;

            case 'ring':
                const jewelryKeys = Object.keys(JEWELRY);
                item = deepClone(JEWELRY[rng.pick(jewelryKeys)]);
                item.category = item.slot === 'amulet' ? ITEM_CATEGORIES.AMULET : ITEM_CATEGORIES.RING;
                break;
        }

        if (item) {
            item.id = generateId();
            item.rarity = item.rarity || rarity;
            item.identified = rarity === 'COMMON' || rng.bool(0.3);
        }

        return item;
    }
}

// Global inventory system
const Inventory = new InventorySystem();
