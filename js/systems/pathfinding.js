// A* Pathfinding System

class PathfindingSystem {
    constructor() {
        this.openSet = [];
        this.closedSet = new Set();
        this.cameFrom = new Map();
        this.gScore = new Map();
        this.fScore = new Map();
    }

    findPath(map, startX, startY, endX, endY, options = {}) {
        const maxIterations = options.maxIterations || 1000;
        const allowDiagonal = options.allowDiagonal !== false;
        const avoidEntities = options.avoidEntities || [];

        // Reset
        this.openSet = [{ x: startX, y: startY }];
        this.closedSet = new Set();
        this.cameFrom = new Map();
        this.gScore = new Map();
        this.fScore = new Map();

        const startKey = posKey(startX, startY);
        this.gScore.set(startKey, 0);
        this.fScore.set(startKey, this.heuristic(startX, startY, endX, endY));

        let iterations = 0;

        while (this.openSet.length > 0 && iterations < maxIterations) {
            iterations++;

            // Get node with lowest fScore
            this.openSet.sort((a, b) => {
                const fA = this.fScore.get(posKey(a.x, a.y)) || Infinity;
                const fB = this.fScore.get(posKey(b.x, b.y)) || Infinity;
                return fA - fB;
            });

            const current = this.openSet.shift();
            const currentKey = posKey(current.x, current.y);

            // Check if reached goal
            if (current.x === endX && current.y === endY) {
                return this.reconstructPath(currentKey);
            }

            this.closedSet.add(currentKey);

            // Check neighbors
            const neighbors = getNeighbors(current.x, current.y, allowDiagonal);

            for (const neighbor of neighbors) {
                const neighborKey = posKey(neighbor.x, neighbor.y);

                // Skip if already evaluated
                if (this.closedSet.has(neighborKey)) continue;

                // Check if walkable
                if (!this.isWalkable(map, neighbor.x, neighbor.y, avoidEntities, endX, endY)) {
                    continue;
                }

                // Calculate tentative gScore
                const moveCost = this.getMoveCost(map, neighbor.x, neighbor.y, allowDiagonal && neighbor.x !== current.x && neighbor.y !== current.y);
                const tentativeG = (this.gScore.get(currentKey) || 0) + moveCost;

                // Check if this is a better path
                const existingG = this.gScore.get(neighborKey);
                if (existingG === undefined || tentativeG < existingG) {
                    this.cameFrom.set(neighborKey, currentKey);
                    this.gScore.set(neighborKey, tentativeG);
                    this.fScore.set(neighborKey, tentativeG + this.heuristic(neighbor.x, neighbor.y, endX, endY));

                    // Add to open set if not already there
                    if (!this.openSet.find(n => n.x === neighbor.x && n.y === neighbor.y)) {
                        this.openSet.push(neighbor);
                    }
                }
            }
        }

        // No path found
        return null;
    }

    isWalkable(map, x, y, avoidEntities, endX, endY) {
        // Check bounds
        if (!inBounds(x, y, map.width, map.height)) return false;

        // Check tile
        const tile = map.tiles[y][x];
        const tileData = TILE_DATA[tile];
        if (!tileData || !tileData.walkable) return false;

        // Allow destination even if entity is there
        if (x === endX && y === endY) return true;

        // Check for entities to avoid
        for (const entity of avoidEntities) {
            if (entity.x === x && entity.y === y) return false;
        }

        return true;
    }

    getMoveCost(map, x, y, diagonal) {
        let cost = diagonal ? 1.414 : 1;

        // Check for terrain modifiers
        const tile = map.tiles[y][x];
        const tileData = TILE_DATA[tile];

        if (tileData && tileData.moveCost) {
            cost *= tileData.moveCost;
        }

        return cost;
    }

    heuristic(x1, y1, x2, y2) {
        // Chebyshev distance for 8-directional movement
        return Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
    }

    reconstructPath(endKey) {
        const path = [];
        let current = endKey;

        while (current) {
            const pos = parsePos(current);
            path.unshift(pos);
            current = this.cameFrom.get(current);
        }

        // Remove starting position
        path.shift();
        return path;
    }

    // Get next step towards target
    getNextStep(map, startX, startY, endX, endY, options = {}) {
        const path = this.findPath(map, startX, startY, endX, endY, options);
        return path && path.length > 0 ? path[0] : null;
    }

    // Check if path exists
    hasPath(map, startX, startY, endX, endY, options = {}) {
        return this.findPath(map, startX, startY, endX, endY, options) !== null;
    }

    // Find nearest reachable point
    findNearestReachable(map, startX, startY, targetX, targetY, options = {}) {
        // Try to find path to target
        let path = this.findPath(map, startX, startY, targetX, targetY, options);
        if (path) return { x: targetX, y: targetY };

        // Find closest walkable tile to target
        const radius = 10;
        let bestPos = null;
        let bestDist = Infinity;

        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                const x = targetX + dx;
                const y = targetY + dy;

                if (!inBounds(x, y, map.width, map.height)) continue;
                if (!this.isWalkable(map, x, y, options.avoidEntities || [], -1, -1)) continue;

                path = this.findPath(map, startX, startY, x, y, options);
                if (path) {
                    const dist = euclideanDist(x, y, targetX, targetY);
                    if (dist < bestDist) {
                        bestDist = dist;
                        bestPos = { x, y };
                    }
                }
            }
        }

        return bestPos;
    }

    // Flee from a position
    findFleePosition(map, startX, startY, fleeFromX, fleeFromY, distance, options = {}) {
        const angle = getAngle(fleeFromX, fleeFromY, startX, startY);
        const targetX = Math.round(startX + Math.cos(angle) * distance);
        const targetY = Math.round(startY + Math.sin(angle) * distance);

        return this.findNearestReachable(map, startX, startY, targetX, targetY, options);
    }
}

// Global pathfinding system
const Pathfinding = new PathfindingSystem();
