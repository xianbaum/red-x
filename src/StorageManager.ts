export class Settings {
    constructor() {
        this.hasAcccess = false;
    }
    hasAcccess: boolean;
}

export class UserAccess {
    constructor() {
        this.accessToken = null;
    }
    accessToken: string | null;
    refreshToken: string | null;
    expirationUTC: number | null; 
}

export class StorageManager {
    private static readonly settingsKey = "redxsettings"    
    private static readonly userAccessKey = "redxuseraccess"
    static getSettings(): Settings {
        let storage = localStorage.getItem(StorageManager.settingsKey);
        if (storage == null || storage === "undefined") {
            return new Settings();
        }
        return JSON.parse(storage);
    }
    static saveSettings(value: Settings) {
        localStorage.setItem(StorageManager.settingsKey,
            JSON.stringify(value));
    }
    static getUserAccess(username: string): UserAccess {
        let storage = localStorage.getItem(StorageManager.userAccessKey + "_" + username);
        if(storage == null || storage === "undefined") {
            return new UserAccess();
        }
        return JSON.parse(storage);
    }
    static saveUserAccess(value: UserAccess, username: string) {
        localStorage.setItem(StorageManager.userAccessKey + "_" + username,
            JSON.stringify(value));
    }
    static clearUserAccess(username: string) {
        localStorage.removeItem(StorageManager.userAccessKey  + "_" + username)
    }
}