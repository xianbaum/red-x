import { Settings } from "./SettingsObject";

export class SettingsManager {
    private static _lsSettings?: Settings;
    static getSettings(): Settings {
        if(SettingsManager._lsSettings === undefined) {
            let storage = localStorage.getItem("redditxsettings");
            if(storage == null) {
                SettingsManager._lsSettings = new Settings();
            } else {
                SettingsManager._lsSettings = JSON.parse(storage);
            }
        }
        return <Settings>SettingsManager._lsSettings;
    }
    static saveSettings(value: Settings) {
        SettingsManager._lsSettings = value;
        localStorage.setItem("redditxsettings",
            JSON.stringify(SettingsManager._lsSettings));
    }
}