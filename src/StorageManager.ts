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
}

export class StorageManager {
    private static readonly settingsKey = "redditxsettings"    
    private static readonly userAccessKey = "redditxuseraccess"
    private static _lsSettings?: Settings;
    static getSettings(): Settings {
        if(StorageManager._lsSettings === undefined) {
            let storage = localStorage.getItem(StorageManager.settingsKey);
            if(storage == null || storage === "undefined") {
                StorageManager._lsSettings = new Settings();
            } else {
                StorageManager._lsSettings = JSON.parse(storage);
            }
        }
        return <Settings>StorageManager._lsSettings;
    }
    static saveSettings(value: Settings) {
        StorageManager._lsSettings = value;
        localStorage.setItem(StorageManager.settingsKey,
            JSON.stringify(StorageManager._lsSettings));
    }
    private static _lsUser?: UserAccess;
    static getUserAccess(): UserAccess {
        if(StorageManager._lsUser === undefined) {
            let storage = localStorage.getItem(StorageManager.userAccessKey);
            if(storage == null || storage === "undefined") {
                StorageManager._lsUser = new UserAccess();
            } else {
                StorageManager._lsUser = JSON.parse(storage);
            }
        }
        return <UserAccess>StorageManager._lsUser;
    }
    static saveUserAccess(value: UserAccess) {
        StorageManager._lsUser = value;
        localStorage.setItem(StorageManager.userAccessKey,
            JSON.stringify(StorageManager._lsUser));
    }
}