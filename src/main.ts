import { RedditMaster } from "./RedditMaster";
import { AccountApi } from "./RedditApi";
import { DesktopEngine } from "./desktopengine/DesktopEngine";

RedditMaster.verifyCode().then( () => {
    // AccountApi.getIdentity();
    var x = new DesktopEngine();
});