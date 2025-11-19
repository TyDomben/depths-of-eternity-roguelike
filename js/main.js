// Main Entry Point - Depths of Eternity

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Depths of Eternity v1.0.0');
    console.log('Initializing game...');

    // Initialize game
    try {
        Game.init();
        console.log('Game initialized successfully!');
    } catch (error) {
        console.error('Failed to initialize game:', error);
        alert('Failed to initialize game. Please refresh the page.');
    }
});

// Prevent context menu on game elements
document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('#game-container')) {
        e.preventDefault();
    }
});

// Handle keyboard shortcuts globally
document.addEventListener('keydown', (e) => {
    // Fullscreen toggle with F11
    if (e.key === 'F11') {
        e.preventDefault();
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen();
        }
    }

    // Quick save with Ctrl+S
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        if (Game.state && Game.running) {
            SaveSystem.save(Game.state);
        }
    }

    // Pause with Escape (when in game)
    if (e.key === 'Escape' && Game.running && Menus.currentScreen === 'game-screen') {
        if (Modals.isOpen) {
            Modals.close();
        } else {
            // Show pause menu or go back to main menu
            if (confirm('Return to main menu? (Game will be saved)')) {
                SaveSystem.save(Game.state);
                Game.running = false;
                Menus.showScreen('main-menu');
                Menus.updateMetaStats();
            }
        }
    }
});

// Handle window resize
window.addEventListener('resize', debounce(() => {
    if (GameRenderer.canvas) {
        GameRenderer.resize();
    }
}, 250));

// Error handling
window.onerror = (msg, url, lineNo, columnNo, error) => {
    console.error('Error:', msg, 'at', url, lineNo, columnNo);
    return false;
};

// Service worker for offline support (optional)
if ('serviceWorker' in navigator) {
    // navigator.serviceWorker.register('/sw.js');
}

// Export for debugging
window.DepthsOfEternity = {
    Game,
    GameRenderer,
    Events,
    SaveSystem,
    MetaProgression,
    // Debug functions
    debug: {
        giveGold: (amount) => {
            if (Game.state?.player) {
                Game.state.player.gold += amount;
                Events.emit(EVENTS.UI_UPDATE, {});
            }
        },
        levelUp: () => {
            if (Game.state?.player) {
                Game.state.player.grantXp(Game.state.player.xpToNext);
            }
        },
        heal: () => {
            if (Game.state?.player) {
                Game.state.player.hp = Game.state.player.maxHp;
                Game.state.player.mp = Game.state.player.maxMp;
                Events.emit(EVENTS.UI_UPDATE, {});
            }
        },
        nextFloor: () => {
            if (Game.state) {
                Game.state.nextFloor();
            }
        },
        killAll: () => {
            if (Game.state) {
                Game.state.enemies.forEach(e => {
                    e.hp = 0;
                    e.dead = true;
                });
            }
        },
        revealMap: () => {
            if (Game.state) {
                for (let y = 0; y < Game.state.map.height; y++) {
                    for (let x = 0; x < Game.state.map.width; x++) {
                        Game.state.explored.add(posKey(x, y));
                    }
                }
            }
        },
        spawnItem: (itemKey) => {
            if (Game.state && Game.state.player) {
                const itemData = WEAPONS[itemKey] || ARMORS[itemKey] || POTIONS[itemKey] || SCROLLS[itemKey];
                if (itemData) {
                    const item = new ItemEntity(Game.state.player.x, Game.state.player.y, {
                        ...deepClone(itemData),
                        id: generateId(),
                        identified: true,
                        rarity: 'LEGENDARY'
                    });
                    Game.state.items.push(item);
                }
            }
        },
        unlockAll: () => {
            Object.keys(CLASS_DATA).forEach(id => {
                MetaProgression.unlockClass(id);
            });
        }
    }
};

console.log('Debug commands available via window.DepthsOfEternity.debug');
