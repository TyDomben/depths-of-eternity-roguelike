// Input Handler
class InputManager {
    constructor() {
        this.keys = new Map();
        this.mouse = { x: 0, y: 0, button: -1, down: false };
        this.enabled = true;
        this.mode = 'normal'; // normal, targeting, examine, inventory
        this.targetCallback = null;
        this.setupListeners();
    }

    setupListeners() {
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));
        document.addEventListener('mousedown', (e) => this.onMouseDown(e));
        document.addEventListener('mouseup', (e) => this.onMouseUp(e));
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('contextmenu', (e) => e.preventDefault());
        document.addEventListener('wheel', (e) => this.onWheel(e));
    }

    onKeyDown(e) {
        if (!this.enabled) return;
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        this.keys.set(e.key, true);

        // Handle based on current mode
        switch (this.mode) {
            case 'normal':
                this.handleNormalInput(e);
                break;
            case 'targeting':
                this.handleTargetingInput(e);
                break;
            case 'examine':
                this.handleExamineInput(e);
                break;
            case 'inventory':
                this.handleInventoryInput(e);
                break;
        }
    }

    onKeyUp(e) {
        this.keys.set(e.key, false);
    }

    onMouseDown(e) {
        if (!this.enabled) return;
        this.mouse.button = e.button;
        this.mouse.down = true;

        const canvas = document.getElementById('game-canvas');
        if (e.target === canvas) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.handleCanvasClick(x, y, e.button);
        }
    }

    onMouseUp(e) {
        this.mouse.button = -1;
        this.mouse.down = false;
    }

    onMouseMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;

        const canvas = document.getElementById('game-canvas');
        if (e.target === canvas) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            Events.emit('canvas:hover', { x, y });
        }
    }

    onWheel(e) {
        Events.emit('input:wheel', { delta: e.deltaY });
    }

    handleNormalInput(e) {
        const key = e.key;

        // Movement
        if (DIR_KEYS[key]) {
            e.preventDefault();
            const dir = DIRECTIONS[DIR_KEYS[key]];
            if (dir) {
                Events.emit('input:move', dir);
            }
            return;
        }

        // Actions
        switch (key) {
            case KEY_BINDINGS.WAIT:
                e.preventDefault();
                Events.emit('input:wait');
                break;
            case KEY_BINDINGS.PICKUP:
                e.preventDefault();
                Events.emit('input:pickup');
                break;
            case KEY_BINDINGS.INVENTORY:
                e.preventDefault();
                Events.emit('input:inventory');
                break;
            case KEY_BINDINGS.CHARACTER:
                e.preventDefault();
                Events.emit('input:character');
                break;
            case KEY_BINDINGS.SKILLS:
                e.preventDefault();
                Events.emit('input:skills');
                break;
            case KEY_BINDINGS.MAP:
                e.preventDefault();
                Events.emit('input:map');
                break;
            case KEY_BINDINGS.EXAMINE:
                e.preventDefault();
                this.setMode('examine');
                Events.emit('input:examine');
                break;
            case KEY_BINDINGS.SEARCH:
                e.preventDefault();
                Events.emit('input:search');
                break;
            case KEY_BINDINGS.REST:
                e.preventDefault();
                Events.emit('input:rest');
                break;
            case KEY_BINDINGS.STAIRS:
            case '<':
                e.preventDefault();
                Events.emit('input:stairs', { down: key === '>' });
                break;
            case KEY_BINDINGS.USE:
                e.preventDefault();
                Events.emit('input:use');
                break;
            case KEY_BINDINGS.DROP:
                e.preventDefault();
                Events.emit('input:drop');
                break;
            case KEY_BINDINGS.THROW:
                e.preventDefault();
                this.setMode('targeting');
                Events.emit('input:throw');
                break;
            case KEY_BINDINGS.FIRE:
                e.preventDefault();
                this.setMode('targeting');
                Events.emit('input:fire');
                break;
            case KEY_BINDINGS.HELP:
                e.preventDefault();
                Events.emit('input:help');
                break;
            case KEY_BINDINGS.CANCEL:
                e.preventDefault();
                Events.emit('input:cancel');
                break;
            case ' ':
                e.preventDefault();
                Events.emit('input:space');
                break;
            default:
                // Number keys for hotbar
                if (key >= '0' && key <= '9') {
                    e.preventDefault();
                    Events.emit('input:hotbar', { slot: key === '0' ? 9 : parseInt(key) - 1 });
                }
                break;
        }
    }

    handleTargetingInput(e) {
        const key = e.key;

        if (key === KEY_BINDINGS.CANCEL) {
            e.preventDefault();
            this.setMode('normal');
            Events.emit('targeting:cancel');
            return;
        }

        if (key === KEY_BINDINGS.CONFIRM || key === ' ') {
            e.preventDefault();
            Events.emit('targeting:confirm');
            return;
        }

        // Move cursor
        if (DIR_KEYS[key]) {
            e.preventDefault();
            const dir = DIRECTIONS[DIR_KEYS[key]];
            if (dir) {
                Events.emit('targeting:move', dir);
            }
        }

        // Tab to cycle targets
        if (key === 'Tab') {
            e.preventDefault();
            Events.emit('targeting:cycle');
        }
    }

    handleExamineInput(e) {
        const key = e.key;

        if (key === KEY_BINDINGS.CANCEL || key === KEY_BINDINGS.EXAMINE) {
            e.preventDefault();
            this.setMode('normal');
            Events.emit('examine:end');
            return;
        }

        // Move examine cursor
        if (DIR_KEYS[key]) {
            e.preventDefault();
            const dir = DIRECTIONS[DIR_KEYS[key]];
            if (dir) {
                Events.emit('examine:move', dir);
            }
        }
    }

    handleInventoryInput(e) {
        const key = e.key;

        if (key === KEY_BINDINGS.CANCEL || key === KEY_BINDINGS.INVENTORY) {
            e.preventDefault();
            this.setMode('normal');
            Events.emit('inventory:close');
            return;
        }

        // Letter selection
        if (key >= 'a' && key <= 'z') {
            e.preventDefault();
            const index = key.charCodeAt(0) - 'a'.charCodeAt(0);
            Events.emit('inventory:select', { index });
        }
    }

    handleCanvasClick(x, y, button) {
        const tileX = Math.floor(x / GAME_CONSTANTS.TILE_SIZE);
        const tileY = Math.floor(y / GAME_CONSTANTS.TILE_SIZE);

        if (button === 0) { // Left click
            if (this.mode === 'targeting') {
                Events.emit('targeting:click', { x: tileX, y: tileY });
            } else if (this.mode === 'examine') {
                Events.emit('examine:click', { x: tileX, y: tileY });
            } else {
                Events.emit('canvas:click', { x: tileX, y: tileY });
            }
        } else if (button === 2) { // Right click
            Events.emit('canvas:rightclick', { x: tileX, y: tileY });
        }
    }

    setMode(mode) {
        this.mode = mode;
        Events.emit('input:mode', { mode });
    }

    isKeyDown(key) {
        return this.keys.get(key) || false;
    }

    enable() {
        this.enabled = true;
    }

    disable() {
        this.enabled = false;
    }

    startTargeting(callback, options = {}) {
        this.setMode('targeting');
        this.targetCallback = callback;
        Events.emit('targeting:start', options);
    }

    endTargeting() {
        this.setMode('normal');
        this.targetCallback = null;
        Events.emit('targeting:end');
    }
}

// Global input manager
const Input = new InputManager();
