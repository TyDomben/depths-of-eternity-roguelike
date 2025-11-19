// Field of View System - Recursive Shadowcasting

class FOVSystem {
    constructor() {
        this.multipliers = [
            [1, 0, 0, -1, -1, 0, 0, 1],
            [0, 1, -1, 0, 0, -1, 1, 0],
            [0, 1, 1, 0, 0, -1, -1, 0],
            [1, 0, 0, 1, -1, 0, 0, -1]
        ];
    }

    compute(map, x, y, radius) {
        const visible = new Set();
        visible.add(posKey(x, y));

        // Cast light in all 8 octants
        for (let octant = 0; octant < 8; octant++) {
            this.castLight(map, visible, x, y, radius, 1, 1.0, 0.0, octant);
        }

        return visible;
    }

    castLight(map, visible, cx, cy, radius, row, startSlope, endSlope, octant) {
        if (startSlope < endSlope) return;

        const xx = this.multipliers[0][octant];
        const xy = this.multipliers[1][octant];
        const yx = this.multipliers[2][octant];
        const yy = this.multipliers[3][octant];

        let newStart = 0;

        for (let j = row; j <= radius; j++) {
            let blocked = false;

            for (let dx = -j, dy = -j; dx <= 0; dx++) {
                const lSlope = (dx - 0.5) / (dy + 0.5);
                const rSlope = (dx + 0.5) / (dy - 0.5);

                if (rSlope > startSlope) continue;
                if (lSlope < endSlope) break;

                const mapX = cx + dx * xx + dy * xy;
                const mapY = cy + dx * yx + dy * yy;

                // Check bounds
                if (mapX < 0 || mapX >= map.width || mapY < 0 || mapY >= map.height) {
                    continue;
                }

                // Check if within radius (circular FOV)
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance <= radius) {
                    visible.add(posKey(mapX, mapY));
                }

                // Check if blocked
                const tile = map.tiles[mapY][mapX];
                const tileData = TILE_DATA[tile];
                const isBlocking = !tileData || tileData.blocksLight;

                if (blocked) {
                    if (isBlocking) {
                        newStart = rSlope;
                        continue;
                    } else {
                        blocked = false;
                        startSlope = newStart;
                    }
                } else if (isBlocking && j < radius) {
                    blocked = true;
                    this.castLight(map, visible, cx, cy, radius, j + 1, startSlope, lSlope, octant);
                    newStart = rSlope;
                }
            }

            if (blocked) break;
        }
    }

    // Check line of sight between two points
    hasLineOfSight(map, x1, y1, x2, y2) {
        const line = getLine(x1, y1, x2, y2);

        for (let i = 1; i < line.length - 1; i++) {
            const point = line[i];
            const tile = map.tiles[point.y]?.[point.x];
            const tileData = TILE_DATA[tile];

            if (!tileData || tileData.blocksLight) {
                return false;
            }
        }

        return true;
    }

    // Get all visible tiles within range
    getVisibleTilesInRange(map, visible, cx, cy, range) {
        const result = [];

        for (const key of visible) {
            const pos = parsePos(key);
            const dist = euclideanDist(cx, cy, pos.x, pos.y);

            if (dist <= range) {
                result.push(pos);
            }
        }

        return result;
    }

    // Check if a specific tile is visible
    isTileVisible(visible, x, y) {
        return visible.has(posKey(x, y));
    }

    // Get distance to nearest visible enemy
    getNearestVisibleEnemy(visible, enemies, px, py) {
        let nearest = null;
        let minDist = Infinity;

        for (const enemy of enemies) {
            if (visible.has(posKey(enemy.x, enemy.y))) {
                const dist = euclideanDist(px, py, enemy.x, enemy.y);
                if (dist < minDist) {
                    minDist = dist;
                    nearest = enemy;
                }
            }
        }

        return nearest;
    }
}

// Global FOV system
const FOV = new FOVSystem();
