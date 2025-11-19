// Utility Helper Functions

// Distance calculations
function manhattanDist(x1, y1, x2, y2) {
    return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}

function euclideanDist(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

function chebyshevDist(x1, y1, x2, y2) {
    return Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
}

// Clamp value between min and max
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

// Linear interpolation
function lerp(a, b, t) {
    return a + (b - a) * t;
}

// Check if point is in bounds
function inBounds(x, y, width, height) {
    return x >= 0 && x < width && y >= 0 && y < height;
}

// Get direction from point to point
function getDirection(fromX, fromY, toX, toY) {
    const dx = Math.sign(toX - fromX);
    const dy = Math.sign(toY - fromY);
    return { x: dx, y: dy };
}

// Get opposite direction
function oppositeDir(dir) {
    return { x: -dir.x, y: -dir.y };
}

// Get angle between points
function getAngle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
}

// Bresenham's line algorithm
function getLine(x0, y0, x1, y1) {
    const points = [];
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    while (true) {
        points.push({ x: x0, y: y0 });
        if (x0 === x1 && y0 === y1) break;
        const e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }
    return points;
}

// Get all points in a circle
function getCircle(cx, cy, radius) {
    const points = [];
    for (let y = cy - radius; y <= cy + radius; y++) {
        for (let x = cx - radius; x <= cx + radius; x++) {
            if (euclideanDist(cx, cy, x, y) <= radius) {
                points.push({ x, y });
            }
        }
    }
    return points;
}

// Get neighbors of a cell
function getNeighbors(x, y, includeDiagonals = true) {
    const neighbors = [
        { x: x, y: y - 1 },
        { x: x, y: y + 1 },
        { x: x - 1, y: y },
        { x: x + 1, y: y }
    ];
    if (includeDiagonals) {
        neighbors.push(
            { x: x - 1, y: y - 1 },
            { x: x + 1, y: y - 1 },
            { x: x - 1, y: y + 1 },
            { x: x + 1, y: y + 1 }
        );
    }
    return neighbors;
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Format time in mm:ss
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Deep clone object
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// Merge objects deeply
function deepMerge(target, source) {
    const result = { ...target };
    for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            result[key] = deepMerge(result[key] || {}, source[key]);
        } else {
            result[key] = source[key];
        }
    }
    return result;
}

// Generate unique ID
let idCounter = 0;
function generateId() {
    return `entity_${Date.now()}_${++idCounter}`;
}

// Capitalize first letter
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Create 2D array
function create2DArray(width, height, defaultValue = 0) {
    const arr = new Array(height);
    for (let y = 0; y < height; y++) {
        arr[y] = new Array(width).fill(defaultValue);
    }
    return arr;
}

// Flood fill
function floodFill(grid, startX, startY, width, height, checkFn, actionFn, visited = new Set()) {
    const key = `${startX},${startY}`;
    if (visited.has(key)) return;
    if (!inBounds(startX, startY, width, height)) return;
    if (!checkFn(startX, startY)) return;

    visited.add(key);
    actionFn(startX, startY);

    floodFill(grid, startX + 1, startY, width, height, checkFn, actionFn, visited);
    floodFill(grid, startX - 1, startY, width, height, checkFn, actionFn, visited);
    floodFill(grid, startX, startY + 1, width, height, checkFn, actionFn, visited);
    floodFill(grid, startX, startY - 1, width, height, checkFn, actionFn, visited);
}

// Calculate experience needed for level
function xpForLevel(level) {
    return Math.floor(GAME_CONSTANTS.XP_BASE * Math.pow(GAME_CONSTANTS.XP_MULTIPLIER, level - 1));
}

// Calculate total XP needed up to level
function totalXpForLevel(level) {
    let total = 0;
    for (let i = 1; i < level; i++) {
        total += xpForLevel(i);
    }
    return total;
}

// Color manipulation
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = Math.round(x).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

function blendColors(color1, color2, factor) {
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);
    if (!c1 || !c2) return color1;
    return rgbToHex(
        lerp(c1.r, c2.r, factor),
        lerp(c1.g, c2.g, factor),
        lerp(c1.b, c2.b, factor)
    );
}

function darkenColor(hex, factor) {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    return rgbToHex(
        rgb.r * (1 - factor),
        rgb.g * (1 - factor),
        rgb.b * (1 - factor)
    );
}

function lightenColor(hex, factor) {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    return rgbToHex(
        rgb.r + (255 - rgb.r) * factor,
        rgb.g + (255 - rgb.g) * factor,
        rgb.b + (255 - rgb.b) * factor
    );
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Parse item notation (e.g., "Sword of Fire +2")
function parseItemName(name) {
    const match = name.match(/^(.+?)(?:\s+of\s+(.+?))?(?:\s+([+-]\d+))?$/i);
    if (!match) return { base: name, suffix: null, modifier: 0 };
    return {
        base: match[1].trim(),
        suffix: match[2] ? match[2].trim() : null,
        modifier: match[3] ? parseInt(match[3]) : 0
    };
}

// Get ordinal suffix (1st, 2nd, 3rd, etc.)
function getOrdinal(n) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// Check if objects have same position
function samePosition(a, b) {
    return a.x === b.x && a.y === b.y;
}

// Get key for position (for maps/sets)
function posKey(x, y) {
    return `${x},${y}`;
}

// Parse position key
function parsePos(key) {
    const [x, y] = key.split(',').map(Number);
    return { x, y };
}
