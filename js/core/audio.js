// Audio Manager - Web Audio API based
class AudioManager {
    constructor() {
        this.context = null;
        this.masterGain = null;
        this.sfxGain = null;
        this.musicGain = null;
        this.sounds = new Map();
        this.currentMusic = null;
        this.enabled = true;
        this.initialized = false;
    }

    async init() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.context.createGain();
            this.sfxGain = this.context.createGain();
            this.musicGain = this.context.createGain();

            this.sfxGain.connect(this.masterGain);
            this.musicGain.connect(this.masterGain);
            this.masterGain.connect(this.context.destination);

            this.masterGain.gain.value = 0.5;
            this.sfxGain.gain.value = 0.7;
            this.musicGain.gain.value = 0.3;

            this.generateSounds();
            this.initialized = true;
        } catch (e) {
            console.warn('Audio initialization failed:', e);
            this.enabled = false;
        }
    }

    generateSounds() {
        // Generate procedural sound effects
        this.sounds.set('hit', this.createHitSound());
        this.sounds.set('miss', this.createMissSound());
        this.sounds.set('death', this.createDeathSound());
        this.sounds.set('pickup', this.createPickupSound());
        this.sounds.set('drop', this.createDropSound());
        this.sounds.set('step', this.createStepSound());
        this.sounds.set('door', this.createDoorSound());
        this.sounds.set('levelup', this.createLevelUpSound());
        this.sounds.set('gold', this.createGoldSound());
        this.sounds.set('potion', this.createPotionSound());
        this.sounds.set('spell', this.createSpellSound());
        this.sounds.set('crit', this.createCritSound());
        this.sounds.set('block', this.createBlockSound());
        this.sounds.set('trap', this.createTrapSound());
        this.sounds.set('secret', this.createSecretSound());
        this.sounds.set('boss', this.createBossSound());
        this.sounds.set('stairs', this.createStairsSound());
        this.sounds.set('equip', this.createEquipSound());
        this.sounds.set('error', this.createErrorSound());
        this.sounds.set('menu', this.createMenuSound());
    }

    createSound(frequency, duration, type = 'square', envelope = {}) {
        return () => {
            if (!this.enabled || !this.initialized) return;

            const osc = this.context.createOscillator();
            const gain = this.context.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(frequency, this.context.currentTime);

            if (envelope.frequencyEnd) {
                osc.frequency.exponentialRampToValueAtTime(
                    envelope.frequencyEnd,
                    this.context.currentTime + duration
                );
            }

            gain.gain.setValueAtTime(envelope.start || 0.3, this.context.currentTime);
            if (envelope.attack) {
                gain.gain.linearRampToValueAtTime(
                    envelope.peak || 0.3,
                    this.context.currentTime + envelope.attack
                );
            }
            gain.gain.exponentialRampToValueAtTime(
                0.01,
                this.context.currentTime + duration
            );

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start();
            osc.stop(this.context.currentTime + duration);
        };
    }

    createHitSound() {
        return () => {
            if (!this.enabled || !this.initialized) return;
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, this.context.currentTime);
            osc.frequency.exponentialRampToValueAtTime(50, this.context.currentTime + 0.1);
            gain.gain.setValueAtTime(0.3, this.context.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);
            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start();
            osc.stop(this.context.currentTime + 0.1);
        };
    }

    createMissSound() {
        return this.createSound(200, 0.1, 'sine', { frequencyEnd: 100 });
    }

    createDeathSound() {
        return () => {
            if (!this.enabled || !this.initialized) return;
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(200, this.context.currentTime);
            osc.frequency.exponentialRampToValueAtTime(30, this.context.currentTime + 0.5);
            gain.gain.setValueAtTime(0.4, this.context.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.5);
            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start();
            osc.stop(this.context.currentTime + 0.5);
        };
    }

    createPickupSound() {
        return () => {
            if (!this.enabled || !this.initialized) return;
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, this.context.currentTime);
            osc.frequency.setValueAtTime(600, this.context.currentTime + 0.05);
            gain.gain.setValueAtTime(0.2, this.context.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.15);
            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start();
            osc.stop(this.context.currentTime + 0.15);
        };
    }

    createDropSound() {
        return this.createSound(300, 0.1, 'sine', { frequencyEnd: 150 });
    }

    createStepSound() {
        return () => {
            if (!this.enabled || !this.initialized) return;
            const noise = this.context.createBufferSource();
            const buffer = this.context.createBuffer(1, this.context.sampleRate * 0.05, this.context.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < data.length; i++) {
                data[i] = (Math.random() * 2 - 1) * 0.1;
            }
            noise.buffer = buffer;
            const gain = this.context.createGain();
            gain.gain.setValueAtTime(0.1, this.context.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.05);
            noise.connect(gain);
            gain.connect(this.sfxGain);
            noise.start();
        };
    }

    createDoorSound() {
        return this.createSound(100, 0.2, 'square', { frequencyEnd: 80 });
    }

    createLevelUpSound() {
        return () => {
            if (!this.enabled || !this.initialized) return;
            const notes = [400, 500, 600, 800];
            notes.forEach((freq, i) => {
                setTimeout(() => {
                    const osc = this.context.createOscillator();
                    const gain = this.context.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, this.context.currentTime);
                    gain.gain.setValueAtTime(0.2, this.context.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.2);
                    osc.connect(gain);
                    gain.connect(this.sfxGain);
                    osc.start();
                    osc.stop(this.context.currentTime + 0.2);
                }, i * 100);
            });
        };
    }

    createGoldSound() {
        return () => {
            if (!this.enabled || !this.initialized) return;
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(800, this.context.currentTime);
            osc.frequency.setValueAtTime(1000, this.context.currentTime + 0.05);
            osc.frequency.setValueAtTime(1200, this.context.currentTime + 0.1);
            gain.gain.setValueAtTime(0.15, this.context.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.2);
            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start();
            osc.stop(this.context.currentTime + 0.2);
        };
    }

    createPotionSound() {
        return this.createSound(500, 0.3, 'sine', { frequencyEnd: 300, attack: 0.1 });
    }

    createSpellSound() {
        return () => {
            if (!this.enabled || !this.initialized) return;
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(300, this.context.currentTime);
            osc.frequency.exponentialRampToValueAtTime(600, this.context.currentTime + 0.1);
            osc.frequency.exponentialRampToValueAtTime(200, this.context.currentTime + 0.3);
            gain.gain.setValueAtTime(0.3, this.context.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.3);
            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start();
            osc.stop(this.context.currentTime + 0.3);
        };
    }

    createCritSound() {
        return () => {
            if (!this.enabled || !this.initialized) return;
            this.sounds.get('hit')();
            setTimeout(() => {
                const osc = this.context.createOscillator();
                const gain = this.context.createGain();
                osc.type = 'square';
                osc.frequency.setValueAtTime(800, this.context.currentTime);
                gain.gain.setValueAtTime(0.2, this.context.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);
                osc.connect(gain);
                gain.connect(this.sfxGain);
                osc.start();
                osc.stop(this.context.currentTime + 0.1);
            }, 50);
        };
    }

    createBlockSound() {
        return this.createSound(200, 0.15, 'square', { frequencyEnd: 100 });
    }

    createTrapSound() {
        return this.createSound(150, 0.3, 'sawtooth', { frequencyEnd: 50 });
    }

    createSecretSound() {
        return () => {
            if (!this.enabled || !this.initialized) return;
            const notes = [600, 800, 1000];
            notes.forEach((freq, i) => {
                setTimeout(() => {
                    const osc = this.context.createOscillator();
                    const gain = this.context.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(freq, this.context.currentTime);
                    gain.gain.setValueAtTime(0.15, this.context.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.15);
                    osc.connect(gain);
                    gain.connect(this.sfxGain);
                    osc.start();
                    osc.stop(this.context.currentTime + 0.15);
                }, i * 80);
            });
        };
    }

    createBossSound() {
        return () => {
            if (!this.enabled || !this.initialized) return;
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(80, this.context.currentTime);
            osc.frequency.setValueAtTime(100, this.context.currentTime + 0.2);
            osc.frequency.setValueAtTime(60, this.context.currentTime + 0.4);
            gain.gain.setValueAtTime(0.4, this.context.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.6);
            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start();
            osc.stop(this.context.currentTime + 0.6);
        };
    }

    createStairsSound() {
        return this.createSound(200, 0.4, 'triangle', { frequencyEnd: 400 });
    }

    createEquipSound() {
        return this.createSound(300, 0.15, 'square', { frequencyEnd: 400 });
    }

    createErrorSound() {
        return this.createSound(200, 0.2, 'square', { frequencyEnd: 100 });
    }

    createMenuSound() {
        return this.createSound(500, 0.08, 'sine');
    }

    play(soundName) {
        if (!this.enabled || !this.initialized) return;
        const sound = this.sounds.get(soundName);
        if (sound) {
            sound();
        }
    }

    setMasterVolume(value) {
        if (this.masterGain) {
            this.masterGain.gain.value = clamp(value, 0, 1);
        }
    }

    setSfxVolume(value) {
        if (this.sfxGain) {
            this.sfxGain.gain.value = clamp(value, 0, 1);
        }
    }

    setMusicVolume(value) {
        if (this.musicGain) {
            this.musicGain.gain.value = clamp(value, 0, 1);
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    resume() {
        if (this.context && this.context.state === 'suspended') {
            this.context.resume();
        }
    }
}

// Global audio manager
const Audio = new AudioManager();

// Event listeners for audio
Events.on(EVENTS.PLAY_SOUND, (data) => {
    Audio.play(data.sound);
});
