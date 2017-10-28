import { RedditMaster } from "./RedditMaster";
import { RedditApi } from "./RedditApi";

RedditMaster.verifyCode().then( () => {
    RedditApi.Account.getIdentity();
});