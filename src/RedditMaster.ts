import { RedditApi } from "./RedditApi";
import { Modal } from "./helpers/Modal"; 
import { StorageManager } from "./StorageManager";
import { Url } from "./helpers/Url";
import { DesktopEngine } from "./desktopengine/DesktopEngine"
export class RedditMaster {
    private static requestAccess() {
        Modal.createYesNo("red-x requires permission from your reddit account. Would you like to grant permissions now?", () => {
            window.open(RedditApi.authorizeUrl(), "_blank");
        }).open();
    }
    public static reRequestAccess(oldMethod?: () => void, reject?: (reason?: any) => void) {
        StorageManager.clearUserAccess(<string>DesktopEngine.username);
        Modal.createYesNo("red-x got unauthorized (I'm not sure why this happens). Would you like to grant permissions now?", () => {
            window.open(RedditApi.authorizeUrl(), "_blank");
            if(oldMethod != null && reject != null) {
                Modal.createYesNo("Would you like to retry the current operation (do this after granting permission)", () => {
                    oldMethod();
                }, () => {
                    reject("User did not choose to retry")
                }).open();
            }
        }, () => {
            if(reject != null) {
                reject("User did not request access")
            }
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
                            ua.accessToken = result.access_token;
                            ua.refreshToken = result.refresh_token;
                            ua.expirationUTC = Math.floor(Date.now()/1000) + result.expires_in;
                            StorageManager.saveUserAccess(ua, <string>DesktopEngine.username);
                            resolve();
                        }, (reason) => {
                            Modal.createToast("Could not verify code: "+reason).open();
                        });
                    }
                } else if(ua.expirationUTC != null && ua.refreshToken != null && Date.now() + 60000 /*1 minute from now*/ > ua.expirationUTC) {
                    RedditApi.refreshAccessToken(ua.refreshToken).then((result) => {
                        ua.accessToken = result.access_token;
                        ua.refreshToken = result.refresh_token;
                        ua.expirationUTC = Math.floor(Date.now()/1000) + result.expires_in;
                        StorageManager.saveUserAccess(ua, <string>DesktopEngine.username);
                        resolve();
                    }, (reason: any) => {
                        Modal.createToast("Could not verify code: "+reason).open();
                    });
                } else {
                    resolve();
                }
            }
        });
    }
}