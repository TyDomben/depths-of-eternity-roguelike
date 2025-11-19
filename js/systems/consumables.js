// Consumable Effects System

const ConsumableEffects = {
    // Use a consumable item
    use(player, item, state) {
        if (!item || !player) return false;

        // Determine item type and call appropriate handler
        if (item.category === 'POTION') {
            return this.usePotion(player, item, state);
        } else if (item.category === 'SCROLL') {
            return this.useScroll(player, item, state);
        } else if (item.category === 'FOOD') {
            return this.useFood(player, item, state);
        } else if (item.category === 'WAND') {
            return this.useWand(player, item, state);
        }

        return false;
    },

    // ===== POTION EFFECTS =====
    usePotion(player, item, state) {
        const effect = item.effect;
        let message = '';
        let success = true;

        switch (effect) {
            case 'heal':
                const healAmount = Combat.heal(player, item.value, null);
                message = `You drink the ${item.name}. Healed ${healAmount} HP.`;
                Audio.play('potion');
                break;

            case 'mana':
                const manaAmount = Math.min(item.value, player.maxMp - player.mp);
                player.mp += manaAmount;
                message = `You drink the ${item.name}. Restored ${manaAmount} MP.`;
                Audio.play('potion');
                break;

            case 'fullRestore':
                player.hp = player.maxHp;
                player.mp = player.maxMp;
                // Remove negative status effects
                StatusEffects.removeNegative(player);
                message = `You drink the ${item.name}. Fully restored!`;
                Audio.play('potion');
                break;

            case 'status':
                StatusEffects.apply(player, item.status, item.duration || 30);
                message = `You drink the ${item.name}. You feel ${this.getStatusDescription(item.status)}!`;
                Audio.play('potion');
                break;

            case 'resist':
                this.applyResistance(player, item.resistType, item.duration || 50);
                message = `You drink the ${item.name}. You feel resistant to ${item.resistType}!`;
                Audio.play('potion');
                break;

            case 'cure':
                if (StatusEffects.has(player, item.cureType)) {
                    StatusEffects.remove(player, item.cureType);
                    message = `You drink the ${item.name}. ${item.cureType} cured!`;
                } else {
                    message = `You drink the ${item.name}. It has no effect.`;
                }
                Audio.play('potion');
                break;

            case 'xp':
                player.grantXp(item.value);
                message = `You drink the ${item.name}. Gained ${item.value} XP!`;
                Audio.play('levelup');
                break;

            case 'multi':
                item.effects.forEach(status => {
                    StatusEffects.apply(player, status, item.duration || 25);
                });
                message = `You drink the ${item.name}. Multiple effects applied!`;
                Audio.play('potion');
                break;

            case 'damage':
                Combat.applyDamage(player, item.value, null, item.damageType);
                message = `You drink the ${item.name}. It burns! Took ${item.value} damage!`;
                Audio.play('trap');
                break;

            case 'polymorph':
                this.applyPolymorph(player, state);
                message = `You drink the ${item.name}. Your form shifts!`;
                Audio.play('magic');
                break;

            case 'identify_all':
                player.inventory.forEach(i => {
                    if (i) i.identified = true;
                });
                message = `You drink the ${item.name}. All items identified!`;
                Audio.play('magic');
                break;

            case 'stat_gain':
                const stat = this.randomStat();
                player.stats[stat] += 1;
                player.recalculateStats();
                message = `You drink the ${item.name}. Your ${stat.toUpperCase()} increased!`;
                Audio.play('levelup');
                break;

            case 'restore_stats':
                this.restoreStats(player);
                message = `You drink the ${item.name}. Stats restored!`;
                Audio.play('potion');
                break;

            default:
                message = `You drink the ${item.name}.`;
                success = false;
        }

        Events.emit(EVENTS.MESSAGE_ADD, { text: message, type: success ? 'pickup' : 'info' });
        return success;
    },

    // ===== SCROLL EFFECTS =====
    useScroll(player, item, state) {
        const effect = item.effect;
        let message = '';
        let success = true;
        let needsTarget = false;

        switch (effect) {
            case 'identify':
                // Show identify UI
                this.showIdentifyUI(player);
                message = `You read the ${item.name}.`;
                Audio.play('scroll');
                break;

            case 'teleport':
                this.teleportRandom(player, state);
                message = `You read the ${item.name}. You teleport!`;
                Audio.play('teleport');
                break;

            case 'map':
                this.revealMap(state);
                message = `You read the ${item.name}. The map is revealed!`;
                Audio.play('scroll');
                break;

            case 'enchant':
                this.showEnchantUI(player);
                message = `You read the ${item.name}.`;
                Audio.play('scroll');
                break;

            case 'removeCurse':
                this.removeCurseFromEquipment(player);
                message = `You read the ${item.name}. Curses removed!`;
                Audio.play('scroll');
                break;

            case 'spell':
                needsTarget = this.castScrollSpell(player, item.spell, state);
                if (!needsTarget) {
                    message = `You read the ${item.name}. ${item.spell} cast!`;
                    Audio.play('magic');
                }
                break;

            case 'summon':
                this.summonAlly(player, state);
                message = `You read the ${item.name}. An ally appears!`;
                Audio.play('summon');
                break;

            case 'fear':
                this.applyAreaEffect(player, state, 'FEAR', 5);
                message = `You read the ${item.name}. Enemies flee in terror!`;
                Audio.play('scroll');
                break;

            case 'confuse':
                this.applyAreaEffect(player, state, 'CONFUSED', 5);
                message = `You read the ${item.name}. Enemies are confused!`;
                Audio.play('scroll');
                break;

            case 'genocide':
                this.showGenocideUI();
                message = `You read the ${item.name}.`;
                Audio.play('scroll');
                break;

            case 'light':
                this.castLight(player, state);
                message = `You read the ${item.name}. The area is illuminated!`;
                Audio.play('scroll');
                break;

            case 'detect_gold':
                this.detectItems(state, 'gold');
                message = `You read the ${item.name}. Gold locations revealed!`;
                Audio.play('scroll');
                break;

            case 'detect_food':
                this.detectItems(state, 'food');
                message = `You read the ${item.name}. Food locations revealed!`;
                Audio.play('scroll');
                break;

            case 'detect_monster':
                this.detectMonsters(state);
                message = `You read the ${item.name}. Monster locations revealed!`;
                Audio.play('scroll');
                break;

            case 'detect_item':
                this.detectItems(state, 'all');
                message = `You read the ${item.name}. Item locations revealed!`;
                Audio.play('scroll');
                break;

            case 'bless':
                this.blessEquipment(player);
                message = `You read the ${item.name}. Equipment blessed!`;
                Audio.play('scroll');
                break;

            case 'protect':
                StatusEffects.apply(player, 'PROTECTED', item.duration || 50);
                message = `You read the ${item.name}. You feel protected!`;
                Audio.play('scroll');
                break;

            case 'banish':
                this.banishEnemies(player, state);
                message = `You read the ${item.name}. Enemies banished!`;
                Audio.play('magic');
                break;

            case 'recharge':
                this.showRechargeUI(player);
                message = `You read the ${item.name}.`;
                Audio.play('scroll');
                break;

            case 'timestop':
                StatusEffects.apply(player, 'TIME_STOP', item.duration || 5);
                message = `You read the ${item.name}. Time stops!`;
                Audio.play('magic');
                break;

            case 'wish':
                this.showWishUI();
                message = `You read the ${item.name}. Make a wish!`;
                Audio.play('magic');
                break;

            case 'create_monster':
                this.createMonsters(player, state);
                message = `You read the ${item.name}. Monsters appear!`;
                Audio.play('summon');
                break;

            case 'destroy_armor':
                this.destroyArmor(player);
                message = `You read the ${item.name}. Your armor crumbles!`;
                Audio.play('trap');
                break;

            case 'amnesia':
                this.causeAmnesia(state);
                message = `You read the ${item.name}. What was I doing?`;
                Audio.play('magic');
                break;

            default:
                message = `You read the ${item.name}.`;
                success = false;
        }

        if (!needsTarget) {
            Events.emit(EVENTS.MESSAGE_ADD, { text: message, type: success ? 'pickup' : 'info' });
        }
        return success && !needsTarget;
    },

    // ===== FOOD EFFECTS =====
    useFood(player, item, state) {
        let message = '';
        let success = true;

        // Apply nutrition
        player.nutrition = Math.min(1000, player.nutrition + item.nutrition);

        // Check for additional effects
        if (item.heal) {
            Combat.heal(player, item.heal, null);
        }

        if (item.hpRegen) {
            StatusEffects.apply(player, 'REGENERATION', 20);
        }

        if (item.poison) {
            StatusEffects.apply(player, 'POISON', 30);
            message = `You eat the ${item.name}. You feel sick!`;
            Audio.play('eat');
        } else if (item.confusion) {
            StatusEffects.apply(player, 'CONFUSED', 10);
            message = `You eat the ${item.name}. You feel dizzy!`;
            Audio.play('eat');
        } else if (item.risky) {
            // Random effect from corpse
            if (RNG.global.bool(0.3)) {
                const effect = RNG.global.pick(['POISON', 'STRENGTH', 'HASTE', 'CONFUSION']);
                StatusEffects.apply(player, effect, 20);
                message = `You eat the ${item.name}. Strange effects...`;
            } else {
                message = `You eat the ${item.name}. Tastes strange.`;
            }
            Audio.play('eat');
        } else {
            // Determine hunger level
            let hungerStatus = 'satisfied';
            if (player.nutrition > 900) hungerStatus = 'bloated';
            else if (player.nutrition > 700) hungerStatus = 'satiated';

            message = `You eat the ${item.name}. You feel ${hungerStatus}.`;
            Audio.play('eat');
        }

        // Bonus effects
        if (item.strBonus) {
            StatusEffects.apply(player, 'STRENGTH', 20);
        }

        Events.emit(EVENTS.MESSAGE_ADD, { text: message, type: success ? 'pickup' : 'warning' });
        return success;
    },

    // ===== WAND EFFECTS =====
    useWand(player, item, state) {
        if (item.charges <= 0) {
            Events.emit(EVENTS.MESSAGE_ADD, {
                text: `The ${item.name} is out of charges!`,
                type: 'warning'
            });
            return false;
        }

        // Most wands need targeting
        const needsTarget = ['fireball', 'icebolt', 'lightning', 'magic_missile', 'polymorph',
            'sleep', 'teleport', 'death', 'slow', 'confuse', 'fear', 'heal', 'drain', 'probe'];

        if (needsTarget.includes(item.effect)) {
            // Enter targeting mode
            Input.setMode('targeting');
            Game.targetingCallback = (target) => {
                this.applyWandEffect(player, item, target, state);
            };
            Events.emit(EVENTS.MESSAGE_ADD, {
                text: 'Select a target...',
                type: 'info'
            });
            return false; // Don't consume yet, wait for target
        }

        // Non-targeted wand effects
        return this.applyWandEffect(player, item, null, state);
    },

    applyWandEffect(player, item, target, state) {
        item.charges--;
        let message = '';
        let success = true;

        switch (item.effect) {
            case 'fireball':
                if (target) {
                    const damage = RNG.global.rollDice(item.damage);
                    Combat.applyDamage(target, damage, player, 'fire');
                    // Area effect
                    this.applyAreaDamage(target.x, target.y, 1, damage / 2, 'fire', state);
                    message = `Fireball hits ${target.name}!`;
                    GameRenderer.addParticleBurst(target.x, target.y, 10, { color: '#ff4400' });
                }
                Audio.play('fire');
                break;

            case 'icebolt':
                if (target) {
                    const damage = RNG.global.rollDice(item.damage);
                    Combat.applyDamage(target, damage, player, 'ice');
                    StatusEffects.apply(target, 'SLOWED', 10);
                    message = `Ice bolt hits ${target.name}!`;
                    GameRenderer.addParticleBurst(target.x, target.y, 8, { color: '#00ffff' });
                }
                Audio.play('ice');
                break;

            case 'lightning':
                if (target) {
                    const damage = RNG.global.rollDice(item.damage);
                    Combat.applyDamage(target, damage, player, 'lightning');
                    message = `Lightning strikes ${target.name}!`;
                    GameRenderer.addParticleBurst(target.x, target.y, 8, { color: '#ffff00' });
                }
                Audio.play('lightning');
                break;

            case 'magic_missile':
                if (target) {
                    const damage = RNG.global.rollDice(item.damage);
                    Combat.applyDamage(target, damage, player, 'magic');
                    message = `Magic missile hits ${target.name}!`;
                }
                Audio.play('magic');
                break;

            case 'polymorph':
                if (target && !target.boss) {
                    this.polymorphEnemy(target, state);
                    message = `${target.name} transforms!`;
                }
                Audio.play('magic');
                break;

            case 'sleep':
                if (target) {
                    StatusEffects.apply(target, 'SLEEP', item.duration);
                    message = `${target.name} falls asleep!`;
                }
                Audio.play('magic');
                break;

            case 'teleport':
                if (target) {
                    this.teleportEntity(target, state);
                    message = `${target.name} teleports away!`;
                }
                Audio.play('teleport');
                break;

            case 'death':
                if (target && !target.boss && RNG.global.bool(0.5)) {
                    target.hp = 0;
                    target.dead = true;
                    message = `${target.name} is slain instantly!`;
                } else {
                    message = `${target.name} resists the death ray!`;
                }
                Audio.play('death');
                break;

            case 'slow':
                if (target) {
                    StatusEffects.apply(target, 'SLOWED', item.duration);
                    message = `${target.name} slows down!`;
                }
                Audio.play('magic');
                break;

            case 'confuse':
                if (target) {
                    StatusEffects.apply(target, 'CONFUSED', item.duration);
                    message = `${target.name} is confused!`;
                }
                Audio.play('magic');
                break;

            case 'fear':
                if (target) {
                    StatusEffects.apply(target, 'FEAR', item.duration);
                    message = `${target.name} flees in terror!`;
                }
                Audio.play('magic');
                break;

            case 'heal':
                if (target) {
                    Combat.heal(target, item.value, player);
                    message = `${target.name} is healed!`;
                }
                Audio.play('heal');
                break;

            case 'drain':
                if (target) {
                    const damage = RNG.global.rollDice(item.damage);
                    Combat.applyDamage(target, damage, player, 'dark');
                    Combat.heal(player, damage, null);
                    message = `Life drained from ${target.name}!`;
                }
                Audio.play('drain');
                break;

            case 'light':
                this.castLight(player, state);
                message = 'The area is illuminated!';
                Audio.play('magic');
                break;

            case 'dig':
                // Would need directional targeting
                message = 'You tunnel through the rock!';
                Audio.play('dig');
                break;

            case 'lock':
            case 'open':
                // Would need door targeting
                message = item.effect === 'lock' ? 'Door locked!' : 'Door opened!';
                Audio.play('door');
                break;

            case 'cancel':
                if (target) {
                    StatusEffects.removeAll(target);
                    message = `${target.name}'s enchantments cancelled!`;
                }
                Audio.play('magic');
                break;

            case 'summon':
                this.summonAlly(player, state);
                message = 'An ally appears!';
                Audio.play('summon');
                break;

            case 'probe':
                if (target) {
                    this.showEnemyInfo(target);
                    message = `Probing ${target.name}...`;
                }
                Audio.play('scroll');
                break;

            default:
                message = `You zap the ${item.name}.`;
                success = false;
        }

        Events.emit(EVENTS.MESSAGE_ADD, { text: message, type: success ? 'pickup' : 'info' });
        return success;
    },

    // ===== HELPER FUNCTIONS =====

    getStatusDescription(status) {
        const descriptions = {
            'STRENGTH': 'stronger',
            'HASTE': 'faster',
            'INVISIBLE': 'invisible',
            'FORTIFIED': 'tougher',
            'REGENERATION': 'regenerating',
            'GIANT_STRENGTH': 'incredibly strong',
            'CONFUSED': 'confused',
            'BLIND': 'blind',
            'PARALYZED': 'paralyzed',
            'LEVITATE': 'light as a feather',
            'SEE_INVISIBLE': 'aware'
        };
        return descriptions[status] || status.toLowerCase();
    },

    applyResistance(player, type, duration) {
        player.tempResistances = player.tempResistances || {};
        player.tempResistances[type] = {
            value: 50,
            duration: duration
        };
    },

    randomStat() {
        const stats = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
        return RNG.global.pick(stats);
    },

    restoreStats(player) {
        // Reset any stat drains
        player.statDrains = {};
        player.recalculateStats();
    },

    teleportRandom(entity, state) {
        const emptyTiles = [];
        for (let y = 0; y < state.map.height; y++) {
            for (let x = 0; x < state.map.width; x++) {
                if (state.map.isWalkable(x, y) && !state.getEnemyAt(x, y)) {
                    emptyTiles.push({ x, y });
                }
            }
        }
        if (emptyTiles.length > 0) {
            const pos = RNG.global.pick(emptyTiles);
            entity.x = pos.x;
            entity.y = pos.y;
        }
    },

    teleportEntity(entity, state) {
        this.teleportRandom(entity, state);
    },

    revealMap(state) {
        for (let y = 0; y < state.map.height; y++) {
            for (let x = 0; x < state.map.width; x++) {
                state.explored.add(posKey(x, y));
            }
        }
    },

    applyAreaEffect(player, state, effect, radius) {
        state.enemies.forEach(enemy => {
            if (!enemy.dead && manhattanDist(enemy.x, enemy.y, player.x, player.y) <= radius) {
                StatusEffects.apply(enemy, effect, 20);
            }
        });
    },

    applyAreaDamage(x, y, radius, damage, type, state) {
        state.enemies.forEach(enemy => {
            if (!enemy.dead && manhattanDist(enemy.x, enemy.y, x, y) <= radius) {
                Combat.applyDamage(enemy, damage, null, type);
            }
        });
    },

    summonAlly(player, state) {
        const neighbors = getNeighbors(player.x, player.y);
        for (const pos of neighbors) {
            if (state.map.isWalkable(pos.x, pos.y) && !state.getEnemyAt(pos.x, pos.y)) {
                // Create a friendly summon
                const ally = {
                    x: pos.x,
                    y: pos.y,
                    friendly: true,
                    name: 'Summoned Creature',
                    hp: 30,
                    attack: 8,
                    defense: 3,
                    duration: 50
                };
                state.summons = state.summons || [];
                state.summons.push(ally);
                break;
            }
        }
    },

    castLight(player, state) {
        const radius = 8;
        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                const x = player.x + dx;
                const y = player.y + dy;
                if (manhattanDist(x, y, player.x, player.y) <= radius) {
                    state.explored.add(posKey(x, y));
                }
            }
        }
    },

    detectItems(state, type) {
        state.items.forEach(item => {
            if (type === 'all' ||
                (type === 'gold' && item.category === 'GOLD') ||
                (type === 'food' && item.category === 'FOOD')) {
                state.explored.add(posKey(item.x, item.y));
                item.detected = true;
            }
        });
    },

    detectMonsters(state) {
        state.enemies.forEach(enemy => {
            if (!enemy.dead) {
                enemy.detected = true;
            }
        });
    },

    blessEquipment(player) {
        Object.values(player.equipment).forEach(item => {
            if (item) {
                item.blessed = true;
                item.cursed = false;
            }
        });
    },

    removeCurseFromEquipment(player) {
        Object.values(player.equipment).forEach(item => {
            if (item) {
                item.cursed = false;
            }
        });
    },

    banishEnemies(player, state) {
        state.enemies.forEach(enemy => {
            if (!enemy.dead && !enemy.boss && manhattanDist(enemy.x, enemy.y, player.x, player.y) <= 5) {
                enemy.hp = 0;
                enemy.dead = true;
                enemy.banished = true;
            }
        });
    },

    createMonsters(player, state) {
        const count = RNG.global.int(3, 6);
        for (let i = 0; i < count; i++) {
            const neighbors = getNeighbors(player.x, player.y);
            for (const pos of neighbors) {
                if (state.map.isWalkable(pos.x, pos.y) && !state.getEnemyAt(pos.x, pos.y)) {
                    // Spawn a random enemy
                    const enemyTypes = Object.keys(ENEMY_DATA);
                    const type = RNG.global.pick(enemyTypes);
                    const enemy = new Enemy(pos.x, pos.y, type);
                    state.enemies.push(enemy);
                    break;
                }
            }
        }
    },

    destroyArmor(player) {
        if (player.equipment.armor) {
            Events.emit(EVENTS.MESSAGE_ADD, {
                text: `Your ${player.equipment.armor.name} crumbles to dust!`,
                type: 'warning'
            });
            player.equipment.armor = null;
            player.recalculateStats();
        }
    },

    causeAmnesia(state) {
        state.explored.clear();
    },

    applyPolymorph(entity, state) {
        // Temporary stat changes
        entity.polymorphed = true;
        entity.originalStats = { ...entity.stats };
        // Random changes
        entity.stats.str = RNG.global.int(5, 20);
        entity.stats.dex = RNG.global.int(5, 20);
        entity.stats.con = RNG.global.int(5, 20);
        entity.recalculateStats();
    },

    polymorphEnemy(enemy, state) {
        const enemyTypes = Object.keys(ENEMY_DATA);
        const newType = RNG.global.pick(enemyTypes);
        const newData = ENEMY_DATA[newType];

        enemy.name = newData.name;
        enemy.hp = newData.hp;
        enemy.attack = newData.attack;
        enemy.defense = newData.defense;
        enemy.char = newData.char;
        enemy.color = newData.color;
    },

    castScrollSpell(player, spellName, state) {
        // Most spells need targeting
        const aoeSpells = ['earthquake', 'firestorm', 'blizzard'];

        if (aoeSpells.includes(spellName)) {
            // Cast AOE spell immediately
            this.castAOESpell(player, spellName, state);
            return false;
        }

        // Need target
        Input.setMode('targeting');
        Game.targetingCallback = (target) => {
            this.castTargetedSpell(player, spellName, target, state);
        };
        Events.emit(EVENTS.MESSAGE_ADD, { text: 'Select a target...', type: 'info' });
        return true;
    },

    castAOESpell(player, spellName, state) {
        switch (spellName) {
            case 'earthquake':
                // Damage all ground enemies, stun
                state.enemies.forEach(enemy => {
                    if (!enemy.dead && !enemy.flying) {
                        Combat.applyDamage(enemy, RNG.global.int(10, 30), player, 'physical');
                        StatusEffects.apply(enemy, 'STUNNED', 3);
                    }
                });
                GameRenderer.shake(10, 15);
                break;

            case 'firestorm':
                state.enemies.forEach(enemy => {
                    if (!enemy.dead && manhattanDist(enemy.x, enemy.y, player.x, player.y) <= 6) {
                        Combat.applyDamage(enemy, RNG.global.int(15, 40), player, 'fire');
                    }
                });
                break;

            case 'blizzard':
                state.enemies.forEach(enemy => {
                    if (!enemy.dead && manhattanDist(enemy.x, enemy.y, player.x, player.y) <= 6) {
                        Combat.applyDamage(enemy, RNG.global.int(10, 30), player, 'ice');
                        StatusEffects.apply(enemy, 'SLOWED', 10);
                    }
                });
                break;
        }
    },

    castTargetedSpell(player, spellName, target, state) {
        if (!target) return;

        switch (spellName) {
            case 'fireball':
                Combat.applyDamage(target, RNG.global.int(20, 50), player, 'fire');
                this.applyAreaDamage(target.x, target.y, 1, 15, 'fire', state);
                break;

            case 'lightning':
                Combat.applyDamage(target, RNG.global.int(25, 60), player, 'lightning');
                break;

            case 'frostNova':
                this.applyAreaDamage(target.x, target.y, 2, 15, 'ice', state);
                state.enemies.forEach(enemy => {
                    if (!enemy.dead && manhattanDist(enemy.x, enemy.y, target.x, target.y) <= 2) {
                        StatusEffects.apply(enemy, 'SLOWED', 15);
                    }
                });
                break;

            case 'chainlightning':
                let targets = [target];
                let current = target;
                for (let i = 0; i < 4; i++) {
                    const nearby = state.enemies.find(e =>
                        !e.dead && !targets.includes(e) &&
                        manhattanDist(e.x, e.y, current.x, current.y) <= 3
                    );
                    if (nearby) {
                        targets.push(nearby);
                        current = nearby;
                    }
                }
                targets.forEach((t, i) => {
                    Combat.applyDamage(t, Math.floor(30 / (i + 1)), player, 'lightning');
                });
                break;

            case 'meteor':
                Combat.applyDamage(target, RNG.global.int(50, 100), player, 'fire');
                this.applyAreaDamage(target.x, target.y, 2, 30, 'fire', state);
                GameRenderer.shake(8, 12);
                break;
        }
    },

    // UI helper stubs
    showIdentifyUI(player) {
        Modals.showItemSelect(player.inventory.filter(i => i && !i.identified), 'Identify which item?', (item) => {
            item.identified = true;
            Events.emit(EVENTS.MESSAGE_ADD, { text: `${item.name} identified!`, type: 'pickup' });
        });
    },

    showEnchantUI(player) {
        const enchantable = player.inventory.filter(i =>
            i && (i.category === 'WEAPON' || i.category === 'ARMOR')
        );
        Modals.showItemSelect(enchantable, 'Enchant which item?', (item) => {
            item.enchantLevel = (item.enchantLevel || 0) + 1;
            item.name = item.name.replace(/\s*\+\d+$/, '') + ` +${item.enchantLevel}`;
            Events.emit(EVENTS.MESSAGE_ADD, { text: `${item.name} enchanted!`, type: 'pickup' });
        });
    },

    showRechargeUI(player) {
        const wands = player.inventory.filter(i => i && i.category === 'WAND');
        Modals.showItemSelect(wands, 'Recharge which wand?', (item) => {
            item.charges = (item.maxCharges || 10);
            Events.emit(EVENTS.MESSAGE_ADD, { text: `${item.name} recharged!`, type: 'pickup' });
        });
    },

    showGenocideUI() {
        // Would show UI to select enemy type to remove
        Events.emit(EVENTS.MESSAGE_ADD, { text: 'Select an enemy type to genocide...', type: 'info' });
    },

    showWishUI() {
        // Would show UI for wish
        Events.emit(EVENTS.MESSAGE_ADD, { text: 'Make your wish wisely...', type: 'info' });
    },

    showEnemyInfo(enemy) {
        Modals.showEnemyInfo(enemy);
    }
};
