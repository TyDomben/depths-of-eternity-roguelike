// Procedural Dungeon Generation System

class MapGenerator {
    constructor(width, height, rng) {
        this.width = width;
        this.height = height;
        this.rng = rng;
        this.tiles = [];
        this.rooms = [];
        this.corridors = [];
    }

    generate(floor, biome) {
        // Initialize with walls
        this.tiles = create2DArray(this.width, this.height, TILE_TYPES.WALL);
        this.rooms = [];
        this.corridors = [];

        // Generate rooms
        this.generateRooms();

        // Connect rooms with corridors
        this.connectRooms();

        // Add doors
        this.addDoors();

        // Add special features
        this.addFeatures(floor, biome);

        // Add stairs
        this.addStairs(floor);

        // Place traps
        this.addTraps(floor, biome);

        // Add secret rooms
        if (this.rng.bool(GAME_CONSTANTS.SECRET_ROOM_CHANCE)) {
            this.addSecretRoom();
        }

        // Add shop
        if (this.rng.bool(GAME_CONSTANTS.SHOP_CHANCE) && floor > 1) {
            this.addShop();
        }

        return {
            tiles: this.tiles,
            width: this.width,
            height: this.height,
            rooms: this.rooms,
            corridors: this.corridors,
            startRoom: this.rooms[0],
            endRoom: this.rooms[this.rooms.length - 1]
        };
    }

    generateRooms() {
        const maxAttempts = 100;
        const targetRooms = GAME_CONSTANTS.MAX_ROOMS;

        for (let i = 0; i < maxAttempts && this.rooms.length < targetRooms; i++) {
            const width = this.rng.int(GAME_CONSTANTS.MIN_ROOM_SIZE, GAME_CONSTANTS.MAX_ROOM_SIZE);
            const height = this.rng.int(GAME_CONSTANTS.MIN_ROOM_SIZE, GAME_CONSTANTS.MAX_ROOM_SIZE);
            const x = this.rng.int(1, this.width - width - 1);
            const y = this.rng.int(1, this.height - height - 1);

            const room = { x, y, width, height, center: { x: Math.floor(x + width / 2), y: Math.floor(y + height / 2) } };

            if (!this.roomOverlaps(room)) {
                this.carveRoom(room);
                this.rooms.push(room);
            }
        }
    }

    roomOverlaps(room) {
        const padding = 2;
        for (const other of this.rooms) {
            if (room.x - padding < other.x + other.width &&
                room.x + room.width + padding > other.x &&
                room.y - padding < other.y + other.height &&
                room.y + room.height + padding > other.y) {
                return true;
            }
        }
        return false;
    }

    carveRoom(room) {
        for (let y = room.y; y < room.y + room.height; y++) {
            for (let x = room.x; x < room.x + room.width; x++) {
                this.tiles[y][x] = TILE_TYPES.FLOOR;
            }
        }
    }

    connectRooms() {
        // Connect rooms in sequence with occasional extra connections
        for (let i = 1; i < this.rooms.length; i++) {
            const from = this.rooms[i - 1].center;
            const to = this.rooms[i].center;
            this.carveCorridor(from, to);
        }

        // Add some extra connections for loops
        const extraConnections = this.rng.int(1, Math.floor(this.rooms.length / 3));
        for (let i = 0; i < extraConnections; i++) {
            const roomA = this.rng.pick(this.rooms);
            const roomB = this.rng.pick(this.rooms);
            if (roomA !== roomB) {
                this.carveCorridor(roomA.center, roomB.center);
            }
        }
    }

    carveCorridor(from, to) {
        let x = from.x;
        let y = from.y;

        const corridor = [];

        // Randomly choose horizontal or vertical first
        if (this.rng.bool()) {
            // Horizontal then vertical
            while (x !== to.x) {
                this.tiles[y][x] = TILE_TYPES.FLOOR;
                corridor.push({ x, y });
                x += x < to.x ? 1 : -1;
            }
            while (y !== to.y) {
                this.tiles[y][x] = TILE_TYPES.FLOOR;
                corridor.push({ x, y });
                y += y < to.y ? 1 : -1;
            }
        } else {
            // Vertical then horizontal
            while (y !== to.y) {
                this.tiles[y][x] = TILE_TYPES.FLOOR;
                corridor.push({ x, y });
                y += y < to.y ? 1 : -1;
            }
            while (x !== to.x) {
                this.tiles[y][x] = TILE_TYPES.FLOOR;
                corridor.push({ x, y });
                x += x < to.x ? 1 : -1;
            }
        }

        this.tiles[y][x] = TILE_TYPES.FLOOR;
        corridor.push({ x, y });
        this.corridors.push(corridor);
    }

    addDoors() {
        // Find corridor-room intersections and add doors
        for (const corridor of this.corridors) {
            for (const point of corridor) {
                if (this.isDoorCandidate(point.x, point.y)) {
                    if (this.rng.bool(0.5)) {
                        this.tiles[point.y][point.x] = TILE_TYPES.DOOR_CLOSED;
                    }
                }
            }
        }
    }

    isDoorCandidate(x, y) {
        // Check if this is a transition between corridor and room
        const horizontal = this.tiles[y][x - 1] === TILE_TYPES.FLOOR &&
                          this.tiles[y][x + 1] === TILE_TYPES.FLOOR &&
                          this.tiles[y - 1][x] === TILE_TYPES.WALL &&
                          this.tiles[y + 1][x] === TILE_TYPES.WALL;

        const vertical = this.tiles[y - 1][x] === TILE_TYPES.FLOOR &&
                        this.tiles[y + 1][x] === TILE_TYPES.FLOOR &&
                        this.tiles[y][x - 1] === TILE_TYPES.WALL &&
                        this.tiles[y][x + 1] === TILE_TYPES.WALL;

        return horizontal || vertical;
    }

    addFeatures(floor, biome) {
        const biomeData = BIOME_DATA[biome];
        if (!biomeData) return;

        for (const room of this.rooms) {
            // Add biome-specific tiles
            if (biomeData.tiles.special) {
                for (const specialTile of biomeData.tiles.special) {
                    if (this.rng.bool(0.15)) {
                        const x = this.rng.int(room.x + 1, room.x + room.width - 2);
                        const y = this.rng.int(room.y + 1, room.y + room.height - 2);
                        this.tiles[y][x] = specialTile;
                    }
                }
            }

            // Random chance for special features
            if (this.rng.bool(0.2)) {
                this.addFountain(room);
            }
            if (this.rng.bool(0.15)) {
                this.addChest(room);
            }
        }
    }

    addFountain(room) {
        const x = room.center.x;
        const y = room.center.y;
        if (this.tiles[y][x] === TILE_TYPES.FLOOR) {
            this.tiles[y][x] = TILE_TYPES.FOUNTAIN;
        }
    }

    addChest(room) {
        // Place chest against a wall
        const walls = [];
        for (let x = room.x; x < room.x + room.width; x++) {
            if (this.tiles[room.y][x] === TILE_TYPES.FLOOR) walls.push({ x, y: room.y });
            if (this.tiles[room.y + room.height - 1][x] === TILE_TYPES.FLOOR) walls.push({ x, y: room.y + room.height - 1 });
        }
        for (let y = room.y; y < room.y + room.height; y++) {
            if (this.tiles[y][room.x] === TILE_TYPES.FLOOR) walls.push({ x: room.x, y });
            if (this.tiles[y][room.x + room.width - 1] === TILE_TYPES.FLOOR) walls.push({ x: room.x + room.width - 1, y });
        }

        if (walls.length > 0) {
            const pos = this.rng.pick(walls);
            this.tiles[pos.y][pos.x] = TILE_TYPES.CHEST;
        }
    }

    addStairs(floor) {
        if (this.rooms.length < 2) return;

        // Stairs up in first room (except floor 1)
        if (floor > 1) {
            const startRoom = this.rooms[0];
            this.tiles[startRoom.center.y][startRoom.center.x] = TILE_TYPES.STAIRS_UP;
        }

        // Stairs down in last room
        const endRoom = this.rooms[this.rooms.length - 1];
        this.tiles[endRoom.center.y][endRoom.center.x] = TILE_TYPES.STAIRS_DOWN;
    }

    addTraps(floor, biome) {
        const trapCount = Math.floor(this.rooms.length * GAME_CONSTANTS.TRAP_DENSITY * (1 + floor * 0.1));

        for (let i = 0; i < trapCount; i++) {
            const room = this.rng.pick(this.rooms);
            const x = this.rng.int(room.x + 1, room.x + room.width - 2);
            const y = this.rng.int(room.y + 1, room.y + room.height - 2);

            if (this.tiles[y][x] === TILE_TYPES.FLOOR) {
                this.tiles[y][x] = TILE_TYPES.TRAP;
            }
        }

        // Also add some corridor traps
        for (const corridor of this.corridors) {
            if (this.rng.bool(0.1)) {
                const pos = this.rng.pick(corridor);
                if (this.tiles[pos.y][pos.x] === TILE_TYPES.FLOOR) {
                    this.tiles[pos.y][pos.x] = TILE_TYPES.TRAP;
                }
            }
        }
    }

    addSecretRoom() {
        // Find a wall adjacent to a room
        const room = this.rng.pick(this.rooms);
        const side = this.rng.pick(['north', 'south', 'east', 'west']);

        let secretX, secretY, doorX, doorY;

        switch (side) {
            case 'north':
                secretY = room.y - 6;
                secretX = room.center.x - 2;
                doorY = room.y - 1;
                doorX = room.center.x;
                break;
            case 'south':
                secretY = room.y + room.height + 1;
                secretX = room.center.x - 2;
                doorY = room.y + room.height;
                doorX = room.center.x;
                break;
            case 'east':
                secretX = room.x + room.width + 1;
                secretY = room.center.y - 2;
                doorX = room.x + room.width;
                doorY = room.center.y;
                break;
            case 'west':
                secretX = room.x - 6;
                secretY = room.center.y - 2;
                doorX = room.x - 1;
                doorY = room.center.y;
                break;
        }

        // Check bounds
        if (secretX < 1 || secretX + 5 >= this.width || secretY < 1 || secretY + 5 >= this.height) {
            return;
        }

        // Carve secret room
        for (let y = secretY; y < secretY + 5; y++) {
            for (let x = secretX; x < secretX + 5; x++) {
                this.tiles[y][x] = TILE_TYPES.FLOOR;
            }
        }

        // Add secret door
        this.tiles[doorY][doorX] = TILE_TYPES.SECRET_WALL;

        // Add treasure
        this.tiles[secretY + 2][secretX + 2] = TILE_TYPES.CHEST;

        this.rooms.push({
            x: secretX,
            y: secretY,
            width: 5,
            height: 5,
            center: { x: secretX + 2, y: secretY + 2 },
            secret: true
        });
    }

    addShop() {
        // Create a shop room
        const room = this.rng.pick(this.rooms.slice(1, -1)); // Not start or end room
        if (!room) return;

        // Mark floor as shop
        for (let y = room.y; y < room.y + room.height; y++) {
            for (let x = room.x; x < room.x + room.width; x++) {
                if (this.tiles[y][x] === TILE_TYPES.FLOOR) {
                    this.tiles[y][x] = TILE_TYPES.SHOP_FLOOR;
                }
            }
        }

        room.shop = true;
    }

    // Get valid spawn position in a room
    getSpawnPosition(room) {
        const attempts = 20;
        for (let i = 0; i < attempts; i++) {
            const x = this.rng.int(room.x + 1, room.x + room.width - 2);
            const y = this.rng.int(room.y + 1, room.y + room.height - 2);

            if (this.tiles[y][x] === TILE_TYPES.FLOOR) {
                return { x, y };
            }
        }
        return room.center;
    }

    // Get random floor tile
    getRandomFloorTile() {
        const attempts = 100;
        for (let i = 0; i < attempts; i++) {
            const x = this.rng.int(1, this.width - 1);
            const y = this.rng.int(1, this.height - 1);

            if (this.tiles[y][x] === TILE_TYPES.FLOOR) {
                return { x, y };
            }
        }
        return this.rooms[0].center;
    }
}

// Export for use
function generateMap(floor, biome, rng) {
    const generator = new MapGenerator(
        GAME_CONSTANTS.MAP_WIDTH,
        GAME_CONSTANTS.MAP_HEIGHT,
        rng
    );
    return generator.generate(floor, biome);
}
