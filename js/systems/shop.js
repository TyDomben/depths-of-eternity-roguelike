// Shop System

class ShopSystem {
    constructor() {
        this.shops = {};
    }

    // Shop types with their inventory preferences
    static SHOP_TYPES = {
        general: {
            name: 'General Store',
            char: 'S',
            color: '#ffd700',
            categories: ['POTION', 'SCROLL', 'FOOD', 'MISC'],
            priceModifier: 1.0,
            buyModifier: 0.5
        },
        weapons: {
            name: 'Blacksmith',
            char: 'B',
            color: '#888888',
            categories: ['WEAPON'],
            priceModifier: 1.1,
            buyModifier: 0.6
        },
        armor: {
            name: 'Armorer',
            char: 'A',
            color: '#aaaaaa',
            categories: ['ARMOR', 'HELM', 'GLOVES', 'BOOTS'],
            priceModifier: 1.1,
            buyModifier: 0.6
        },
        magic: {
            name: 'Magic Shop',
            char: 'M',
            color: '#9932cc',
            categories: ['SCROLL', 'WAND', 'TOME'],
            priceModifier: 1.2,
            buyModifier: 0.4
        },
        jewelry: {
            name: 'Jeweler',
            char: 'J',
            color: '#00ffff',
            categories: ['RING', 'AMULET'],
            priceModifier: 1.3,
            buyModifier: 0.5
        },
        potion: {
            name: 'Alchemist',
            char: 'P',
            color: '#00ff00',
            categories: ['POTION'],
            priceModifier: 0.9,
            buyModifier: 0.6
        },
        black_market: {
            name: 'Black Market',
            char: '?',
            color: '#4a0080',
            categories: ['WEAPON', 'ARMOR', 'RING', 'AMULET', 'POTION', 'SCROLL'],
            priceModifier: 1.5,
            buyModifier: 0.7,
            sellsCursed: true,
            rare: true
        }
    };

    // Generate shop inventory
    generateInventory(shopType, floor, rng) {
        const shopData = ShopSystem.SHOP_TYPES[shopType];
        if (!shopData) return [];

        const inventory = [];
        const itemCount = rng.int(8, 15);
        const rarityBonus = Math.floor(floor / 10);

        for (let i = 0; i < itemCount; i++) {
            const item = this.generateShopItem(shopData, floor, rarityBonus, rng);
            if (item) {
                // Apply shop price modifier
                item.shopPrice = Math.floor(item.value * shopData.priceModifier);
                inventory.push(item);
            }
        }

        return inventory;
    }

    // Generate a single shop item
    generateShopItem(shopData, floor, rarityBonus, rng) {
        const category = rng.pick(shopData.categories);
        let itemPool = [];

        // Get items from the appropriate category
        switch (category) {
            case 'WEAPON':
                itemPool = Object.entries(WEAPONS).map(([key, data]) => ({ ...data, key, category: 'WEAPON' }));
                break;
            case 'ARMOR':
            case 'HELM':
            case 'GLOVES':
            case 'BOOTS':
                itemPool = Object.entries(ARMORS)
                    .filter(([, data]) => !data.slot || data.slot === category.toLowerCase())
                    .map(([key, data]) => ({ ...data, key, category: 'ARMOR' }));
                break;
            case 'RING':
            case 'AMULET':
                itemPool = Object.entries(JEWELRY)
                    .filter(([, data]) => data.slot === category.toLowerCase())
                    .map(([key, data]) => ({ ...data, key, category: 'JEWELRY' }));
                break;
            case 'POTION':
                itemPool = Object.entries(POTIONS).map(([key, data]) => ({ ...data, key, category: 'POTION' }));
                break;
            case 'SCROLL':
                itemPool = Object.entries(SCROLLS).map(([key, data]) => ({ ...data, key, category: 'SCROLL' }));
                break;
            case 'WAND':
                itemPool = Object.entries(WANDS).map(([key, data]) => ({ ...data, key, category: 'WAND' }));
                break;
            case 'TOME':
                itemPool = Object.entries(TOMES).map(([key, data]) => ({ ...data, key, category: 'TOME' }));
                break;
            case 'FOOD':
                itemPool = Object.entries(FOODS).map(([key, data]) => ({ ...data, key, category: 'FOOD' }));
                break;
            case 'MISC':
                itemPool = Object.entries(MISC_ITEMS).map(([key, data]) => ({ ...data, key, category: 'MISC' }));
                break;
        }

        if (itemPool.length === 0) return null;

        // Pick a random item
        const baseItem = rng.pick(itemPool);
        const item = deepClone(baseItem);

        // Determine rarity
        const rarityRoll = rng.float() + (rarityBonus * 0.1);
        if (rarityRoll > 0.95) {
            item.rarity = 'LEGENDARY';
        } else if (rarityRoll > 0.8) {
            item.rarity = 'EPIC';
        } else if (rarityRoll > 0.6) {
            item.rarity = 'RARE';
        } else if (rarityRoll > 0.3) {
            item.rarity = 'UNCOMMON';
        } else {
            item.rarity = 'COMMON';
        }

        // Generate magic properties for equipment
        if ((category === 'WEAPON' || category === 'ARMOR') && item.rarity !== 'COMMON') {
            return generateMagicItem(item, item.rarity, rng);
        }

        // Set base value
        item.value = item.price || item.value || 10;
        item.identified = true; // Shop items are always identified

        return item;
    }

    // Calculate buy price (player buying from shop)
    getBuyPrice(item, shopType, player) {
        const shopData = ShopSystem.SHOP_TYPES[shopType];
        let price = item.shopPrice || item.value;

        // Apply charisma discount
        const chaModifier = 1 - (player.stats.cha * 0.02);
        price = Math.floor(price * Math.max(0.5, chaModifier));

        return Math.max(1, price);
    }

    // Calculate sell price (player selling to shop)
    getSellPrice(item, shopType, player) {
        const shopData = ShopSystem.SHOP_TYPES[shopType];
        let price = Math.floor((item.value || 10) * shopData.buyModifier);

        // Apply charisma bonus
        const chaModifier = 1 + (player.stats.cha * 0.01);
        price = Math.floor(price * chaModifier);

        // Cursed items have reduced value
        if (item.cursed) {
            price = Math.floor(price * 0.1);
        }

        // Unidentified items have reduced value
        if (!item.identified) {
            price = Math.floor(price * 0.5);
        }

        return Math.max(1, price);
    }

    // Buy item from shop
    buyItem(player, item, shopInventory, shopType) {
        const price = this.getBuyPrice(item, shopType, player);

        if (player.gold < price) {
            return { success: false, message: "You don't have enough gold!" };
        }

        // Check inventory space
        if (!Inventory.hasSpace(player.inventory)) {
            return { success: false, message: "Your inventory is full!" };
        }

        // Remove item from shop
        const itemIndex = shopInventory.findIndex(i => i === item);
        if (itemIndex === -1) {
            return { success: false, message: "Item no longer available!" };
        }

        shopInventory.splice(itemIndex, 1);

        // Deduct gold and add item
        player.gold -= price;
        Inventory.addItem(player.inventory, item);

        Events.emit(EVENTS.GOLD_CHANGE, { amount: -price });
        Events.emit(EVENTS.UI_UPDATE, {});

        return { success: true, message: `Bought ${item.name} for ${price} gold.` };
    }

    // Sell item to shop
    sellItem(player, item, shopType) {
        const price = this.getSellPrice(item, shopType, player);

        // Remove from player inventory
        if (!Inventory.removeItem(player.inventory, item)) {
            return { success: false, message: "Item not found in inventory!" };
        }

        // Add gold
        player.gold += price;

        Events.emit(EVENTS.GOLD_CHANGE, { amount: price });
        Events.emit(EVENTS.UI_UPDATE, {});

        return { success: true, message: `Sold ${item.name} for ${price} gold.` };
    }

    // Identify item (for magic shops)
    identifyItem(player, item, cost = 50) {
        if (item.identified) {
            return { success: false, message: "Item is already identified!" };
        }

        if (player.gold < cost) {
            return { success: false, message: "You don't have enough gold!" };
        }

        player.gold -= cost;
        item.identified = true;

        Events.emit(EVENTS.GOLD_CHANGE, { amount: -cost });
        Events.emit(EVENTS.UI_UPDATE, {});

        return { success: true, message: `Identified ${item.name} for ${cost} gold.` };
    }

    // Repair item (for blacksmiths)
    repairItem(player, item, cost) {
        if (!item.durability || item.durability >= item.maxDurability) {
            return { success: false, message: "Item doesn't need repair!" };
        }

        if (player.gold < cost) {
            return { success: false, message: "You don't have enough gold!" };
        }

        player.gold -= cost;
        item.durability = item.maxDurability;

        Events.emit(EVENTS.GOLD_CHANGE, { amount: -cost });
        Events.emit(EVENTS.UI_UPDATE, {});

        return { success: true, message: `Repaired ${item.name} for ${cost} gold.` };
    }

    // Remove curse service
    removeCurse(player, item, cost = 200) {
        if (!item.cursed) {
            return { success: false, message: "Item is not cursed!" };
        }

        if (player.gold < cost) {
            return { success: false, message: "You don't have enough gold!" };
        }

        player.gold -= cost;
        item.cursed = false;

        Events.emit(EVENTS.GOLD_CHANGE, { amount: -cost });
        Events.emit(EVENTS.UI_UPDATE, {});

        return { success: true, message: `Removed curse from ${item.name} for ${cost} gold.` };
    }

    // Enchant item (magic shop service)
    enchantItem(player, item, cost = 500) {
        if (item.enchantLevel >= 3) {
            return { success: false, message: "Item is at maximum enchantment!" };
        }

        if (player.gold < cost) {
            return { success: false, message: "You don't have enough gold!" };
        }

        player.gold -= cost;
        item.enchantLevel = (item.enchantLevel || 0) + 1;
        item.name = item.name.replace(/\s*\+\d+$/, '') + ` +${item.enchantLevel}`;

        // Boost item stats
        if (item.damage) {
            item.damageBonus = (item.damageBonus || 0) + 2;
        }
        if (item.defense !== undefined) {
            item.defense += 1;
        }

        Events.emit(EVENTS.GOLD_CHANGE, { amount: -cost });
        Events.emit(EVENTS.UI_UPDATE, {});

        return { success: true, message: `Enchanted ${item.name} for ${cost} gold.` };
    }
}

// Shop UI/Modal handling
const ShopUI = {
    currentShop: null,
    currentInventory: null,
    currentType: null,
    selectedTab: 'buy',

    open(shopType, inventory) {
        this.currentType = shopType;
        this.currentInventory = inventory;
        this.currentShop = ShopSystem.SHOP_TYPES[shopType];
        this.selectedTab = 'buy';
        this.render();

        Events.emit(EVENTS.MODAL_OPEN, { type: 'shop' });
    },

    close() {
        this.currentShop = null;
        this.currentInventory = null;
        this.currentType = null;

        Events.emit(EVENTS.MODAL_CLOSE, {});
    },

    render() {
        const modalContent = document.getElementById('modal-content');
        if (!modalContent || !this.currentShop) return;

        const shopData = this.currentShop;
        const player = Game.state?.player;
        if (!player) return;

        let html = `
            <div class="shop-modal">
                <h2>${shopData.name}</h2>
                <p class="gold-display">Your Gold: <span class="gold">${player.gold}</span></p>

                <div class="shop-tabs">
                    <button class="tab ${this.selectedTab === 'buy' ? 'active' : ''}" onclick="ShopUI.selectTab('buy')">Buy</button>
                    <button class="tab ${this.selectedTab === 'sell' ? 'active' : ''}" onclick="ShopUI.selectTab('sell')">Sell</button>
                    <button class="tab ${this.selectedTab === 'services' ? 'active' : ''}" onclick="ShopUI.selectTab('services')">Services</button>
                </div>

                <div class="shop-content">
        `;

        if (this.selectedTab === 'buy') {
            html += this.renderBuyTab(player);
        } else if (this.selectedTab === 'sell') {
            html += this.renderSellTab(player);
        } else {
            html += this.renderServicesTab(player);
        }

        html += `
                </div>
                <button class="close-btn" onclick="ShopUI.close()">Close</button>
            </div>
        `;

        modalContent.innerHTML = html;
    },

    renderBuyTab(player) {
        if (!this.currentInventory || this.currentInventory.length === 0) {
            return '<p class="empty">Shop has no items for sale.</p>';
        }

        let html = '<div class="item-list">';

        for (const item of this.currentInventory) {
            const price = Shop.getBuyPrice(item, this.currentType, player);
            const canAfford = player.gold >= price;
            const rarityClass = (item.rarity || 'COMMON').toLowerCase();

            html += `
                <div class="shop-item ${canAfford ? '' : 'cannot-afford'}" onclick="ShopUI.buyItem('${item.key}')">
                    <span class="item-char" style="color: ${item.color}">${item.char}</span>
                    <span class="item-name ${rarityClass}">${item.name}</span>
                    <span class="item-price">${price}g</span>
                </div>
            `;
        }

        html += '</div>';
        return html;
    },

    renderSellTab(player) {
        const sellableItems = player.inventory.filter(item =>
            item && item.category !== 'GOLD'
        );

        if (sellableItems.length === 0) {
            return '<p class="empty">You have no items to sell.</p>';
        }

        let html = '<div class="item-list">';

        for (const item of sellableItems) {
            const price = Shop.getSellPrice(item, this.currentType, player);
            const rarityClass = (item.rarity || 'COMMON').toLowerCase();

            html += `
                <div class="shop-item sellable" onclick="ShopUI.sellItem('${item.id}')">
                    <span class="item-char" style="color: ${item.color}">${item.char}</span>
                    <span class="item-name ${rarityClass}">${item.name}</span>
                    <span class="item-price">${price}g</span>
                </div>
            `;
        }

        html += '</div>';
        return html;
    },

    renderServicesTab(player) {
        let html = '<div class="services-list">';

        // Identify service
        html += `
            <div class="service" onclick="ShopUI.showIdentifyList()">
                <span class="service-name">Identify Item</span>
                <span class="service-price">50g</span>
            </div>
        `;

        // Repair service (if blacksmith or armorer)
        if (this.currentType === 'weapons' || this.currentType === 'armor') {
            html += `
                <div class="service" onclick="ShopUI.showRepairList()">
                    <span class="service-name">Repair Item</span>
                    <span class="service-price">varies</span>
                </div>
            `;
        }

        // Remove curse service
        html += `
            <div class="service" onclick="ShopUI.showCurseList()">
                <span class="service-name">Remove Curse</span>
                <span class="service-price">200g</span>
            </div>
        `;

        // Enchant service (magic shop only)
        if (this.currentType === 'magic') {
            html += `
                <div class="service" onclick="ShopUI.showEnchantList()">
                    <span class="service-name">Enchant Item</span>
                    <span class="service-price">500g</span>
                </div>
            `;
        }

        html += '</div>';
        return html;
    },

    selectTab(tab) {
        this.selectedTab = tab;
        this.render();
    },

    buyItem(itemKey) {
        const item = this.currentInventory.find(i => i.key === itemKey);
        if (!item) return;

        const result = Shop.buyItem(Game.state.player, item, this.currentInventory, this.currentType);

        Events.emit(EVENTS.MESSAGE_ADD, {
            text: result.message,
            type: result.success ? 'pickup' : 'warning'
        });

        if (result.success) {
            Audio.play('gold');
        }

        this.render();
    },

    sellItem(itemId) {
        const item = Game.state.player.inventory.find(i => i && i.id === itemId);
        if (!item) return;

        const result = Shop.sellItem(Game.state.player, item, this.currentType);

        Events.emit(EVENTS.MESSAGE_ADD, {
            text: result.message,
            type: result.success ? 'pickup' : 'warning'
        });

        if (result.success) {
            Audio.play('gold');
        }

        this.render();
    },

    showIdentifyList() {
        // Show unidentified items for identification
        const unidentified = Game.state.player.inventory.filter(i => i && !i.identified);
        if (unidentified.length === 0) {
            Events.emit(EVENTS.MESSAGE_ADD, { text: 'No items need identification.', type: 'info' });
            return;
        }
        // Would show a sub-menu here
    },

    showRepairList() {
        // Show damaged items for repair
    },

    showCurseList() {
        // Show cursed items for curse removal
        const cursed = Game.state.player.inventory.filter(i => i && i.cursed);
        if (cursed.length === 0) {
            Events.emit(EVENTS.MESSAGE_ADD, { text: 'No items are cursed.', type: 'info' });
            return;
        }
    },

    showEnchantList() {
        // Show enchantable items
        const enchantable = Game.state.player.inventory.filter(i =>
            i && (i.category === 'WEAPON' || i.category === 'ARMOR') && (!i.enchantLevel || i.enchantLevel < 3)
        );
        if (enchantable.length === 0) {
            Events.emit(EVENTS.MESSAGE_ADD, { text: 'No items can be enchanted.', type: 'info' });
            return;
        }
    }
};

// Global shop instance
const Shop = new ShopSystem();
