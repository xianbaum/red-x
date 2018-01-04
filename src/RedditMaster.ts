import { RedditApi } from "./RedditApi";
import { Modal } from "./helpers/Modal"; 
import { StorageManager } from "./StorageManager";
import { Url } from "./helpers/Url";
import { DesktopEngine } from "./desktopengine/DesktopEngine"
export class RedditMaster {
    private static requestAccess() {
        Modal.createYesNo("red-x requires permission from your reddit account. Would you like to grant permissions now?", () => {
            window.location.href = RedditApi.authorizeUrl();
        }).open();
    }
    public static reRequestAccess() {
        StorageManager.clearUserAccess(<string>DesktopEngine.username);
        Modal.createYesNo("red-x got unauthorized (I'm not sure why this happens). Would you like to grant permissions now?", () => {
            window.location.href = RedditApi.authorizeUrl();
        }).open();
    }
    static verifyCode(): Promise<void> {
        return new Promise<any>( (resolve, reject) => {
            if(!DesktopEngine.isLoggedIn) {
                resolve();
            } else {
                if(DesktopEngine.username === undefined) {
                    throw new TypeError("username is undefined!");
                }
                let ua = StorageManager.getUserAccess(DesktopEngine.username);
                if(ua.accessToken == null) {
                    let code = Url.Current.query("code");
                    if(code === undefined) {
                        if(window.location.href.indexOf(RedditApi.authorizePath) === -1) {
                            RedditMaster.requestAccess();                        
                        }
                        reject();
                    } else {
                        RedditApi.getAccessToken(code).then((result) => {
                            ua.accessToken = result.access_token
                            StorageManager.saveUserAccess(ua, <string>DesktopEngine.username);
                            resolve();
                        }, (reason) => {
                            Modal.createToast("Could not verify code: "+reason).open();
                        });
                    }
                } else {
                    resolve();
                }
            }
        });
    }
}