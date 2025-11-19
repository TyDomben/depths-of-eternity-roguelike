// Save/Load System using localStorage

class SaveSystemClass {
    constructor() {
        this.saveKey = 'depths_of_eternity_save';
        this.metaKey = 'depths_of_eternity_meta';
        this.settingsKey = 'depths_of_eternity_settings';
    }

    save(state) {
        try {
            const saveData = state.serialize();
            const compressed = JSON.stringify(saveData);
            localStorage.setItem(this.saveKey, compressed);

            Events.emit(EVENTS.MESSAGE_ADD, { text: 'Game saved!', type: 'system' });
            return true;
        } catch (e) {
            console.error('Save failed:', e);
            Events.emit(EVENTS.MESSAGE_ADD, { text: 'Save failed!', type: 'warning' });
            return false;
        }
    }

    load() {
        try {
            const data = localStorage.getItem(this.saveKey);
            if (!data) return null;

            const saveData = JSON.parse(data);
            return GameState.deserialize(saveData);
        } catch (e) {
            console.error('Load failed:', e);
            return null;
        }
    }

    hasSave() {
        return localStorage.getItem(this.saveKey) !== null;
    }

    deleteSave() {
        localStorage.removeItem(this.saveKey);
    }

    // Settings
    saveSettings(settings) {
        localStorage.setItem(this.settingsKey, JSON.stringify(settings));
    }

    loadSettings() {
        try {
            const data = localStorage.getItem(this.settingsKey);
            return data ? JSON.parse(data) : this.getDefaultSettings();
        } catch (e) {
            return this.getDefaultSettings();
        }
    }

    getDefaultSettings() {
        return {
            soundVolume: 0.7,
            musicVolume: 0.3,
            tileSize: 32,
            showMinimap: true,
            confirmActions: true
        };
    }

    // Export/Import
    exportSave() {
        const data = localStorage.getItem(this.saveKey);
        if (!data) return null;

        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'depths_of_eternity_save.json';
        a.click();

        URL.revokeObjectURL(url);
    }

    importSave(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = e.target.result;
                    JSON.parse(data); // Validate JSON
                    localStorage.setItem(this.saveKey, data);
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }
}

// Global save system
const SaveSystem = new SaveSystemClass();
