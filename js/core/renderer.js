// Game Renderer
class Renderer {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.minimapCanvas = null;
        this.minimapCtx = null;
        this.tileSize = GAME_CONSTANTS.TILE_SIZE;
        this.viewportWidth = GAME_CONSTANTS.VIEWPORT_WIDTH;
        this.viewportHeight = GAME_CONSTANTS.VIEWPORT_HEIGHT;
        this.camera = { x: 0, y: 0 };
        this.animations = [];
        this.particles = [];
        this.screenShake = { x: 0, y: 0, intensity: 0, duration: 0 };
    }

    init() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.minimapCanvas = document.getElementById('minimap-canvas');
        this.minimapCtx = this.minimapCanvas.getContext('2d');

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        const container = document.getElementById('canvas-container');
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        // Calculate optimal viewport size
        const maxTilesX = Math.floor(containerWidth / this.tileSize);
        const maxTilesY = Math.floor(containerHeight / this.tileSize);

        this.viewportWidth = Math.min(maxTilesX, 25) | 1; // Odd number for centering
        this.viewportHeight = Math.min(maxTilesY, 19) | 1;

        this.canvas.width = this.viewportWidth * this.tileSize;
        this.canvas.height = this.viewportHeight * this.tileSize;

        this.minimapCanvas.width = GAME_CONSTANTS.MINIMAP_SIZE;
        this.minimapCanvas.height = GAME_CONSTANTS.MINIMAP_SIZE;
    }

    centerCamera(x, y) {
        this.camera.x = x - Math.floor(this.viewportWidth / 2);
        this.camera.y = y - Math.floor(this.viewportHeight / 2);
    }

    worldToScreen(x, y) {
        return {
            x: (x - this.camera.x) * this.tileSize + this.screenShake.x,
            y: (y - this.camera.y) * this.tileSize + this.screenShake.y
        };
    }

    screenToWorld(x, y) {
        return {
            x: Math.floor(x / this.tileSize) + this.camera.x,
            y: Math.floor(y / this.tileSize) + this.camera.y
        };
    }

    clear() {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    render(gameState) {
        this.clear();
        this.updateScreenShake();

        if (!gameState || !gameState.map) return;

        this.renderMap(gameState);
        this.renderItems(gameState);
        this.renderEntities(gameState);
        this.renderPlayer(gameState);
        this.renderParticles();
        this.renderAnimations();
        this.renderTargeting(gameState);
        this.renderMinimap(gameState);
    }

    renderMap(gameState) {
        const { map, fov, explored } = gameState;

        for (let y = 0; y < this.viewportHeight; y++) {
            for (let x = 0; x < this.viewportWidth; x++) {
                const worldX = x + this.camera.x;
                const worldY = y + this.camera.y;

                if (!inBounds(worldX, worldY, map.width, map.height)) {
                    continue;
                }

                const tile = map.tiles[worldY][worldX];
                const visible = fov.has(posKey(worldX, worldY));
                const wasExplored = explored.has(posKey(worldX, worldY));

                if (!visible && !wasExplored) continue;

                const screenPos = this.worldToScreen(worldX, worldY);
                const tileData = TILE_DATA[tile] || TILE_DATA[TILE_TYPES.VOID];

                // Draw tile
                let color = tileData.color;
                if (!visible) {
                    color = darkenColor(color, 0.6);
                }

                this.ctx.fillStyle = color;
                this.ctx.fillRect(screenPos.x, screenPos.y, this.tileSize, this.tileSize);

                // Draw character
                if (tileData.char) {
                    this.ctx.fillStyle = visible ? tileData.charColor : darkenColor(tileData.charColor, 0.5);
                    this.ctx.font = `${this.tileSize - 4}px monospace`;
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.fillText(
                        tileData.char,
                        screenPos.x + this.tileSize / 2,
                        screenPos.y + this.tileSize / 2
                    );
                }
            }
        }
    }

    renderItems(gameState) {
        const { items, fov } = gameState;

        for (const item of items) {
            if (!fov.has(posKey(item.x, item.y))) continue;

            const screenPos = this.worldToScreen(item.x, item.y);
            const itemData = item.data || {};

            // Draw item
            this.ctx.fillStyle = itemData.color || RARITIES[item.rarity]?.color || '#ffffff';
            this.ctx.font = `${this.tileSize - 4}px monospace`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(
                itemData.char || '?',
                screenPos.x + this.tileSize / 2,
                screenPos.y + this.tileSize / 2
            );
        }
    }

    renderEntities(gameState) {
        const { enemies, fov } = gameState;

        for (const enemy of enemies) {
            if (!fov.has(posKey(enemy.x, enemy.y))) continue;

            const screenPos = this.worldToScreen(enemy.x, enemy.y);
            const enemyData = enemy.data || {};

            // Draw enemy
            this.ctx.fillStyle = enemyData.color || '#ff0000';
            this.ctx.font = `bold ${this.tileSize - 2}px monospace`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(
                enemyData.char || 'e',
                screenPos.x + this.tileSize / 2,
                screenPos.y + this.tileSize / 2
            );

            // Health bar
            if (enemy.hp < enemy.maxHp) {
                const barWidth = this.tileSize - 4;
                const barHeight = 3;
                const hpPercent = enemy.hp / enemy.maxHp;

                this.ctx.fillStyle = '#333';
                this.ctx.fillRect(screenPos.x + 2, screenPos.y, barWidth, barHeight);
                this.ctx.fillStyle = hpPercent > 0.5 ? '#0f0' : hpPercent > 0.25 ? '#ff0' : '#f00';
                this.ctx.fillRect(screenPos.x + 2, screenPos.y, barWidth * hpPercent, barHeight);
            }
        }
    }

    renderPlayer(gameState) {
        const { player } = gameState;
        if (!player) return;

        const screenPos = this.worldToScreen(player.x, player.y);

        // Draw player
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = `bold ${this.tileSize - 2}px monospace`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(
            '@',
            screenPos.x + this.tileSize / 2,
            screenPos.y + this.tileSize / 2
        );
    }

    renderTargeting(gameState) {
        if (Input.mode !== 'targeting' && Input.mode !== 'examine') return;

        const { targetCursor, player } = gameState;
        if (!targetCursor) return;

        const screenPos = this.worldToScreen(targetCursor.x, targetCursor.y);

        // Draw targeting reticle
        this.ctx.strokeStyle = Input.mode === 'targeting' ? '#ff0000' : '#00ff00';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(
            screenPos.x + 2,
            screenPos.y + 2,
            this.tileSize - 4,
            this.tileSize - 4
        );

        // Draw line from player to target
        if (Input.mode === 'targeting' && player) {
            const playerPos = this.worldToScreen(player.x, player.y);
            this.ctx.beginPath();
            this.ctx.moveTo(
                playerPos.x + this.tileSize / 2,
                playerPos.y + this.tileSize / 2
            );
            this.ctx.lineTo(
                screenPos.x + this.tileSize / 2,
                screenPos.y + this.tileSize / 2
            );
            this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
            this.ctx.stroke();
        }
    }

    renderMinimap(gameState) {
        const { map, explored, player, enemies, items } = gameState;
        if (!map) return;

        this.minimapCtx.fillStyle = '#000';
        this.minimapCtx.fillRect(0, 0, this.minimapCanvas.width, this.minimapCanvas.height);

        const scale = Math.min(
            this.minimapCanvas.width / map.width,
            this.minimapCanvas.height / map.height
        );

        // Draw explored tiles
        for (const key of explored) {
            const pos = parsePos(key);
            const tile = map.tiles[pos.y]?.[pos.x];
            if (tile === undefined) continue;

            const tileData = TILE_DATA[tile];
            if (!tileData || !tileData.walkable) {
                this.minimapCtx.fillStyle = '#333';
            } else {
                this.minimapCtx.fillStyle = '#666';
            }

            this.minimapCtx.fillRect(
                pos.x * scale,
                pos.y * scale,
                Math.max(1, scale),
                Math.max(1, scale)
            );
        }

        // Draw items
        this.minimapCtx.fillStyle = '#ff0';
        for (const item of items) {
            if (explored.has(posKey(item.x, item.y))) {
                this.minimapCtx.fillRect(
                    item.x * scale,
                    item.y * scale,
                    Math.max(1, scale),
                    Math.max(1, scale)
                );
            }
        }

        // Draw player
        if (player) {
            this.minimapCtx.fillStyle = '#fff';
            this.minimapCtx.fillRect(
                player.x * scale - 1,
                player.y * scale - 1,
                3,
                3
            );
        }
    }

    renderParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.life -= 1;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            const alpha = p.life / p.maxLife;
            this.ctx.fillStyle = p.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
            this.ctx.fillRect(p.x, p.y, p.size, p.size);

            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity || 0;
        }
    }

    renderAnimations() {
        for (let i = this.animations.length - 1; i >= 0; i--) {
            const anim = this.animations[i];
            anim.update();

            if (anim.finished) {
                this.animations.splice(i, 1);
            }
        }
    }

    addParticle(x, y, options = {}) {
        const screenPos = this.worldToScreen(x, y);
        this.particles.push({
            x: screenPos.x + this.tileSize / 2,
            y: screenPos.y + this.tileSize / 2,
            vx: options.vx || (Math.random() - 0.5) * 4,
            vy: options.vy || (Math.random() - 0.5) * 4,
            size: options.size || 3,
            color: options.color || 'rgb(255, 255, 255)',
            life: options.life || 30,
            maxLife: options.life || 30,
            gravity: options.gravity || 0
        });
    }

    addParticleBurst(x, y, count, options = {}) {
        for (let i = 0; i < count; i++) {
            this.addParticle(x, y, options);
        }
    }

    shake(intensity = 5, duration = 10) {
        this.screenShake.intensity = intensity;
        this.screenShake.duration = duration;
    }

    updateScreenShake() {
        if (this.screenShake.duration > 0) {
            this.screenShake.x = (Math.random() - 0.5) * this.screenShake.intensity;
            this.screenShake.y = (Math.random() - 0.5) * this.screenShake.intensity;
            this.screenShake.duration--;
        } else {
            this.screenShake.x = 0;
            this.screenShake.y = 0;
        }
    }

    flash(color = '#fff', duration = 100) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${color};
            pointer-events: none;
            opacity: 0.5;
        `;
        this.canvas.parentElement.appendChild(overlay);
        setTimeout(() => overlay.remove(), duration);
    }
}

// Global renderer
const GameRenderer = new Renderer();
