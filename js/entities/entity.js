// Base Entity Class

class Entity {
    constructor(x, y, data = {}) {
        this.id = generateId();
        this.x = x;
        this.y = y;
        this.name = data.name || 'Entity';
        this.char = data.char || '?';
        this.color = data.color || '#ffffff';

        this.hp = data.hp || 10;
        this.maxHp = data.maxHp || data.hp || 10;
        this.dead = false;

        this.facing = { x: 0, y: 1 };
        this.visible = true;
    }

    moveTo(x, y) {
        const oldX = this.x;
        const oldY = this.y;

        this.x = x;
        this.y = y;

        // Update facing direction
        const dx = x - oldX;
        const dy = y - oldY;
        if (dx !== 0 || dy !== 0) {
            this.facing = { x: Math.sign(dx), y: Math.sign(dy) };
        }
    }

    distanceTo(other) {
        return manhattanDist(this.x, this.y, other.x, other.y);
    }

    isAdjacentTo(other) {
        return this.distanceTo(other) === 1;
    }

    takeDamage(amount, source = null, damageType = 'physical') {
        return Combat.applyDamage(this, amount, source, damageType);
    }

    heal(amount, source = null) {
        return Combat.heal(this, amount, source);
    }

    hasStatus(effectType) {
        return StatusEffects.has(this, effectType);
    }

    applyStatus(effectType, duration) {
        return StatusEffects.apply(this, effectType, duration);
    }

    removeStatus(effectType) {
        return StatusEffects.remove(this, effectType);
    }

    getResistance(damageType) {
        if (!this.resistances) return 0;
        return this.resistances[damageType] || 0;
    }

    serialize() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            name: this.name,
            hp: this.hp,
            maxHp: this.maxHp,
            dead: this.dead
        };
    }
}
