// Targeting System for Ranged Attacks and Spells

class TargetingSystem {
    constructor() {
        this.active = false;
        this.cursor = { x: 0, y: 0 };
        this.range = 0;
        this.callback = null;
        this.targetType = 'enemy'; // 'enemy', 'ally', 'tile', 'any'
        this.aoeRadius = 0;
        this.lineOfSight = true;
        this.validTargets = [];
    }

    // Start targeting mode
    start(options = {}) {
        const player = Game.state?.player;
        if (!player) return;

        this.active = true;
        this.cursor = { x: player.x, y: player.y };
        this.range = options.range || 8;
        this.callback = options.callback || null;
        this.targetType = options.targetType || 'enemy';
        this.aoeRadius = options.aoeRadius || 0;
        this.lineOfSight = options.lineOfSight !== false;
        this.message = options.message || 'Select target';

        // Calculate valid targets
        this.calculateValidTargets();

        // Auto-target nearest enemy if targeting enemies
        if (this.targetType === 'enemy' && this.validTargets.length > 0) {
            const nearest = this.getNearestTarget();
            if (nearest) {
                this.cursor = { x: nearest.x, y: nearest.y };
            }
        }

        Input.setMode('targeting');

        Events.emit(EVENTS.MESSAGE_ADD, {
            text: this.message,
            type: 'info'
        });

        Events.emit(EVENTS.TARGETING_START, {
            cursor: this.cursor,
            range: this.range,
            aoeRadius: this.aoeRadius
        });
    }

    // Cancel targeting
    cancel() {
        this.active = false;
        this.callback = null;
        Input.setMode('normal');

        Events.emit(EVENTS.TARGETING_CANCEL, {});
    }

    // Confirm target
    confirm() {
        if (!this.active) return;

        const target = this.getTargetAtCursor();

        // Validate target
        if (!this.isValidTarget(this.cursor.x, this.cursor.y)) {
            Events.emit(EVENTS.MESSAGE_ADD, {
                text: 'Invalid target!',
                type: 'warning'
            });
            return;
        }

        this.active = false;
        Input.setMode('normal');

        Events.emit(EVENTS.TARGETING_CONFIRM, {
            x: this.cursor.x,
            y: this.cursor.y,
            target: target
        });

        if (this.callback) {
            this.callback(target, this.cursor.x, this.cursor.y);
        }
    }

    // Move cursor
    moveCursor(dx, dy) {
        if (!this.active) return;

        const newX = this.cursor.x + dx;
        const newY = this.cursor.y + dy;

        // Clamp to map bounds
        if (newX >= 0 && newX < Game.state.map.width &&
            newY >= 0 && newY < Game.state.map.height) {
            this.cursor.x = newX;
            this.cursor.y = newY;

            Events.emit(EVENTS.TARGETING_MOVE, {
                cursor: this.cursor
            });
        }
    }

    // Cycle to next valid target
    cycleTarget(reverse = false) {
        if (!this.active || this.validTargets.length === 0) return;

        // Find current target index
        let currentIndex = this.validTargets.findIndex(t =>
            t.x === this.cursor.x && t.y === this.cursor.y
        );

        if (currentIndex === -1) currentIndex = 0;

        // Move to next/previous target
        if (reverse) {
            currentIndex = (currentIndex - 1 + this.validTargets.length) % this.validTargets.length;
        } else {
            currentIndex = (currentIndex + 1) % this.validTargets.length;
        }

        const target = this.validTargets[currentIndex];
        this.cursor = { x: target.x, y: target.y };

        Events.emit(EVENTS.TARGETING_MOVE, {
            cursor: this.cursor
        });
    }

    // Calculate all valid targets
    calculateValidTargets() {
        this.validTargets = [];
        const player = Game.state?.player;
        if (!player) return;

        const state = Game.state;

        for (let y = 0; y < state.map.height; y++) {
            for (let x = 0; x < state.map.width; x++) {
                if (this.isValidTarget(x, y)) {
                    const target = state.getEnemyAt(x, y);
                    if (target) {
                        this.validTargets.push(target);
                    } else if (this.targetType === 'tile' || this.targetType === 'any') {
                        this.validTargets.push({ x, y, isTile: true });
                    }
                }
            }
        }

        // Sort by distance
        this.validTargets.sort((a, b) => {
            const distA = manhattanDist(a.x, a.y, player.x, player.y);
            const distB = manhattanDist(b.x, b.y, player.x, player.y);
            return distA - distB;
        });
    }

    // Check if position is a valid target
    isValidTarget(x, y) {
        const player = Game.state?.player;
        if (!player) return false;

        const state = Game.state;

        // Check range
        const dist = manhattanDist(x, y, player.x, player.y);
        if (dist > this.range) return false;
        if (dist === 0 && this.targetType === 'enemy') return false;

        // Check line of sight
        if (this.lineOfSight && !this.hasLineOfSight(player.x, player.y, x, y)) {
            return false;
        }

        // Check target type
        switch (this.targetType) {
            case 'enemy':
                const enemy = state.getEnemyAt(x, y);
                return enemy && !enemy.dead && state.fov.has(posKey(x, y));

            case 'ally':
                // Check for allies/summons
                const ally = state.summons?.find(s => s.x === x && s.y === y);
                return ally !== undefined;

            case 'tile':
                return state.map.isWalkable(x, y);

            case 'any':
                return true;

            default:
                return false;
        }
    }

    // Check line of sight between two points
    hasLineOfSight(x0, y0, x1, y1) {
        const line = getLine(x0, y0, x1, y1);

        for (let i = 1; i < line.length - 1; i++) {
            const point = line[i];
            const tile = Game.state.map.tiles[point.y]?.[point.x];
            if (!TILE_DATA[tile]?.transparent) {
                return false;
            }
        }

        return true;
    }

    // Get nearest target
    getNearestTarget() {
        if (this.validTargets.length === 0) return null;
        return this.validTargets[0];
    }

    // Get target at cursor position
    getTargetAtCursor() {
        const state = Game.state;
        if (!state) return null;

        // Check for enemy
        const enemy = state.getEnemyAt(this.cursor.x, this.cursor.y);
        if (enemy) return enemy;

        // Check for ally
        const ally = state.summons?.find(s => s.x === this.cursor.x && s.y === this.cursor.y);
        if (ally) return ally;

        // Return tile position
        return { x: this.cursor.x, y: this.cursor.y, isTile: true };
    }

    // Get tiles affected by AOE
    getAOETiles() {
        if (this.aoeRadius === 0) {
            return [{ x: this.cursor.x, y: this.cursor.y }];
        }

        const tiles = [];
        for (let dy = -this.aoeRadius; dy <= this.aoeRadius; dy++) {
            for (let dx = -this.aoeRadius; dx <= this.aoeRadius; dx++) {
                const x = this.cursor.x + dx;
                const y = this.cursor.y + dy;
                if (manhattanDist(x, y, this.cursor.x, this.cursor.y) <= this.aoeRadius) {
                    tiles.push({ x, y });
                }
            }
        }
        return tiles;
    }

    // Get all targets in AOE
    getAOETargets() {
        const tiles = this.getAOETiles();
        const targets = [];
        const state = Game.state;

        for (const tile of tiles) {
            const enemy = state.getEnemyAt(tile.x, tile.y);
            if (enemy && !enemy.dead) {
                targets.push(enemy);
            }
        }

        return targets;
    }

    // Render targeting overlay
    render(ctx) {
        if (!this.active) return;

        const player = Game.state?.player;
        if (!player) return;

        const tileSize = GameRenderer.tileSize;
        const camera = GameRenderer.camera;

        // Draw range indicator
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = '#ffff00';

        for (let dy = -this.range; dy <= this.range; dy++) {
            for (let dx = -this.range; dx <= this.range; dx++) {
                const x = player.x + dx;
                const y = player.y + dy;
                if (manhattanDist(x, y, player.x, player.y) <= this.range) {
                    const screenX = (x - camera.x) * tileSize;
                    const screenY = (y - camera.y) * tileSize;
                    ctx.fillRect(screenX, screenY, tileSize, tileSize);
                }
            }
        }

        // Draw AOE indicator
        if (this.aoeRadius > 0) {
            ctx.fillStyle = '#ff4400';
            const aoeTiles = this.getAOETiles();
            for (const tile of aoeTiles) {
                const screenX = (tile.x - camera.x) * tileSize;
                const screenY = (tile.y - camera.y) * tileSize;
                ctx.fillRect(screenX, screenY, tileSize, tileSize);
            }
        }

        ctx.globalAlpha = 1.0;

        // Draw line to cursor
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 2;
        ctx.beginPath();

        const startX = (player.x - camera.x + 0.5) * tileSize;
        const startY = (player.y - camera.y + 0.5) * tileSize;
        const endX = (this.cursor.x - camera.x + 0.5) * tileSize;
        const endY = (this.cursor.y - camera.y + 0.5) * tileSize;

        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Draw cursor
        const cursorX = (this.cursor.x - camera.x) * tileSize;
        const cursorY = (this.cursor.y - camera.y) * tileSize;

        // Cursor color based on validity
        const isValid = this.isValidTarget(this.cursor.x, this.cursor.y);
        ctx.strokeStyle = isValid ? '#00ff00' : '#ff0000';
        ctx.lineWidth = 3;
        ctx.strokeRect(cursorX + 2, cursorY + 2, tileSize - 4, tileSize - 4);

        // Draw distance
        const dist = manhattanDist(this.cursor.x, this.cursor.y, player.x, player.y);
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px monospace';
        ctx.fillText(`${dist}`, cursorX + 2, cursorY + tileSize - 4);

        // Draw target info
        const target = this.getTargetAtCursor();
        if (target && !target.isTile) {
            const info = `${target.name} (HP: ${target.hp}/${target.maxHp || target.hp})`;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(cursorX, cursorY - 20, ctx.measureText(info).width + 8, 18);
            ctx.fillStyle = '#ffffff';
            ctx.fillText(info, cursorX + 4, cursorY - 6);
        }
    }
}

// Targeting presets for common actions
const TargetingPresets = {
    // Single target ranged attack
    rangedAttack(callback, range = 8) {
        Targeting.start({
            range: range,
            targetType: 'enemy',
            callback: callback,
            message: 'Select target for attack'
        });
    },

    // AOE spell
    aoeSpell(callback, range = 6, aoeRadius = 2) {
        Targeting.start({
            range: range,
            targetType: 'tile',
            aoeRadius: aoeRadius,
            callback: callback,
            message: 'Select center of effect'
        });
    },

    // Single target spell
    targetSpell(callback, range = 8) {
        Targeting.start({
            range: range,
            targetType: 'enemy',
            callback: callback,
            message: 'Select target for spell'
        });
    },

    // Teleport location
    teleport(callback, range = 10) {
        Targeting.start({
            range: range,
            targetType: 'tile',
            lineOfSight: false,
            callback: callback,
            message: 'Select destination'
        });
    },

    // Healing ally
    healAlly(callback, range = 6) {
        Targeting.start({
            range: range,
            targetType: 'any',
            callback: callback,
            message: 'Select target to heal'
        });
    },

    // Direction (for digging, etc.)
    direction(callback) {
        Targeting.start({
            range: 1,
            targetType: 'tile',
            lineOfSight: false,
            callback: callback,
            message: 'Select direction'
        });
    }
};

// Global targeting system instance
const Targeting = new TargetingSystem();

// Input handler for targeting mode
Events.on('input:move', (dir) => {
    if (Targeting.active) {
        Targeting.moveCursor(dir.x, dir.y);
    }
});

Events.on('input:confirm', () => {
    if (Targeting.active) {
        Targeting.confirm();
    }
});

Events.on('input:cancel', () => {
    if (Targeting.active) {
        Targeting.cancel();
    }
});

Events.on('input:cycle', () => {
    if (Targeting.active) {
        Targeting.cycleTarget();
    }
});
