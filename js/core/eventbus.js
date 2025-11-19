// Event Bus for game-wide communication
class EventBus {
    constructor() {
        this.listeners = new Map();
        this.onceListeners = new Map();
    }

    on(event, callback, priority = 0) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push({ callback, priority });
        this.listeners.get(event).sort((a, b) => b.priority - a.priority);
        return () => this.off(event, callback);
    }

    once(event, callback) {
        if (!this.onceListeners.has(event)) {
            this.onceListeners.set(event, []);
        }
        this.onceListeners.get(event).push(callback);
    }

    off(event, callback) {
        if (this.listeners.has(event)) {
            const listeners = this.listeners.get(event);
            const index = listeners.findIndex(l => l.callback === callback);
            if (index !== -1) {
                listeners.splice(index, 1);
            }
        }
    }

    emit(event, data = {}) {
        // Call regular listeners
        if (this.listeners.has(event)) {
            for (const listener of this.listeners.get(event)) {
                listener.callback(data);
            }
        }

        // Call once listeners and remove them
        if (this.onceListeners.has(event)) {
            const onceListeners = this.onceListeners.get(event);
            this.onceListeners.delete(event);
            for (const callback of onceListeners) {
                callback(data);
            }
        }
    }

    clear(event = null) {
        if (event) {
            this.listeners.delete(event);
            this.onceListeners.delete(event);
        } else {
            this.listeners.clear();
            this.onceListeners.clear();
        }
    }
}

// Global event bus
const Events = new EventBus();

// Event names
const EVENTS = {
    // Game flow
    GAME_START: 'game:start',
    GAME_OVER: 'game:over',
    GAME_WIN: 'game:win',
    GAME_PAUSE: 'game:pause',
    GAME_RESUME: 'game:resume',
    GAME_SAVE: 'game:save',
    GAME_LOAD: 'game:load',

    // Turn system
    TURN_START: 'turn:start',
    TURN_END: 'turn:end',
    PLAYER_TURN: 'turn:player',
    ENEMY_TURN: 'turn:enemy',

    // Player events
    PLAYER_MOVE: 'player:move',
    PLAYER_ATTACK: 'player:attack',
    PLAYER_DAMAGE: 'player:damage',
    PLAYER_HEAL: 'player:heal',
    PLAYER_DEATH: 'player:death',
    PLAYER_LEVELUP: 'player:levelup',
    PLAYER_REST: 'player:rest',

    // Combat
    COMBAT_HIT: 'combat:hit',
    COMBAT_MISS: 'combat:miss',
    COMBAT_CRIT: 'combat:crit',
    COMBAT_KILL: 'combat:kill',
    COMBAT_BLOCK: 'combat:block',
    COMBAT_DODGE: 'combat:dodge',

    // Items
    ITEM_PICKUP: 'item:pickup',
    ITEM_DROP: 'item:drop',
    ITEM_USE: 'item:use',
    ITEM_EQUIP: 'item:equip',
    ITEM_UNEQUIP: 'item:unequip',
    ITEM_IDENTIFY: 'item:identify',
    ITEM_ENCHANT: 'item:enchant',
    ITEM_DESTROY: 'item:destroy',

    // Inventory
    INVENTORY_CHANGE: 'inventory:change',
    INVENTORY_FULL: 'inventory:full',
    GOLD_CHANGE: 'gold:change',

    // Map
    MAP_GENERATE: 'map:generate',
    MAP_REVEAL: 'map:reveal',
    FLOOR_CHANGE: 'floor:change',
    ROOM_ENTER: 'room:enter',
    DOOR_OPEN: 'door:open',
    TRAP_TRIGGER: 'trap:trigger',
    SECRET_FOUND: 'secret:found',

    // Enemies
    ENEMY_SPAWN: 'enemy:spawn',
    ENEMY_DEATH: 'enemy:death',
    ENEMY_ALERT: 'enemy:alert',
    BOSS_SPAWN: 'boss:spawn',
    BOSS_DEATH: 'boss:death',

    // Status effects
    STATUS_APPLY: 'status:apply',
    STATUS_REMOVE: 'status:remove',
    STATUS_TICK: 'status:tick',

    // Skills
    SKILL_USE: 'skill:use',
    SKILL_LEARN: 'skill:learn',
    SKILL_COOLDOWN: 'skill:cooldown',

    // Shop
    SHOP_ENTER: 'shop:enter',
    SHOP_BUY: 'shop:buy',
    SHOP_SELL: 'shop:sell',

    // UI
    UI_UPDATE: 'ui:update',
    MESSAGE_ADD: 'message:add',
    TOOLTIP_SHOW: 'tooltip:show',
    TOOLTIP_HIDE: 'tooltip:hide',
    MODAL_OPEN: 'modal:open',
    MODAL_CLOSE: 'modal:close',

    // Meta progression
    ACHIEVEMENT_UNLOCK: 'achievement:unlock',
    CLASS_UNLOCK: 'class:unlock',
    UNLOCK_POINTS: 'unlock:points',

    // Audio
    PLAY_SOUND: 'audio:sound',
    PLAY_MUSIC: 'audio:music',
    STOP_MUSIC: 'audio:stop'
};
