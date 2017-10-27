import { RedditApi } from "./RedditApi";
import { Modal } from "./helpers/Modal"; 
import { SettingsManager } from "./SettingsManager";
import { Url } from "./helpers/Url";
export class RedditMaster {
    private static requestAccess() {
        Modal.createYesNo("redditx requires permission from your reddit account. Would you like to grant permissions now?", () => {
            window.location.href = RedditApi.authorizeUrl;
        }).open();
    }
    static verifyCode(): Promise<void> {
        return new Promise<any>( (resolve, reject) => {
            let settings = SettingsManager.getSettings();
            if(settings.accessToken == null) {
                let code = Url.Current.query("code");
                if(code === undefined) {
                    RedditMaster.requestAccess();
                    reject();
                } else {
                    RedditApi.getAccessToken(code).then((result) => {
                        settings.accessToken = result.access_token
                        SettingsManager.saveSettings(settings);
                        resolve();
                    }, (reason) => {
                        Modal.createToast("Bad error happened: "+reason).open();
                    });
                }
            }
        })
    } 
}