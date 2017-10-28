import { RedditApi } from "./RedditApi";
import { Modal } from "./helpers/Modal"; 
import { StorageManager } from "./StorageManager";
import { Url } from "./helpers/Url";
export class RedditMaster {
    private static requestAccess() {
        Modal.createYesNo("redditx requires permission from your reddit account. Would you like to grant permissions now?", () => {
            window.location.href = RedditApi.authorizeUrl;
        }).open();
    }
    static verifyCode(): Promise<void> {
        return new Promise<any>( (resolve, reject) => {
            let ua = StorageManager.getUserAccess();
            if(ua.accessToken == null) {
                let code = Url.Current.query("code");
                if(code === undefined) {
                    // RedditApi.getIdentity().then(
                    //     () => {
                    //         settings.hasAcccess = true;
                    //         SettingsManager.saveSettings(settings);
                    //         resolve();
                    //     },
                    //     () => {
                            RedditMaster.requestAccess();
                            reject();
                        // });
                } else {
                    RedditApi.getAccessToken(code).then((result) => {
                        ua.accessToken = result.access_token
                        StorageManager.saveUserAccess(ua);
                        resolve();
                    }, (reason) => {
                        Modal.createToast("Bad error happened: "+reason).open();
                    });
                }
            } else {
                resolve();
            }
        })
    } 
}