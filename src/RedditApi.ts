import { Http, RequestHeader } from "./helpers/Http";
import { StorageManager } from "./StorageManager";
import { AuthorizeResult } from "./redditapimodels/AuthorizeResult";
import { RedditError } from "./redditapimodels/Error";
import { User } from "./redditapimodels/User";
import { UserPrefs, UserPrefKeys } from "./redditapimodels/UserPrefs";
import { RedditListing } from "./redditapimodels/RedditListing";
import { RedditDataObject } from "./redditapimodels/RedditDataObject";

class AccountApi {
    private static readonly meBase = "/api/v1/me";    
    getIdentity(): Promise<User> {
        return ApiHelpers.genericOauthGet(ApiHelpers.oauthBase+AccountApi.meBase);
    }
    getKarma(): Promise<RedditDataObject> {
        return ApiHelpers.genericOauthGet(ApiHelpers.oauthBase+AccountApi.meBase+"/karma");
    }
    getPrefs(): Promise<UserPrefs> {
        return ApiHelpers.genericOauthGet(ApiHelpers.oauthBase+AccountApi.meBase+"/prefs");
    }
    setPrefs(pref: UserPrefs | UserPrefKeys, value?: string) {
        let object: any;
        if(typeof pref === "string" && value !== undefined){
            object = {
                pref: value
            };
        } else {
            object = <UserPrefKeys>pref;
        }
        return Http.request("PATCH", ApiHelpers.oauthBase+AccountApi.meBase+"/prefs", [ApiHelpers.authorizationHeader]).then
    }
    getFriends(list?: RedditListing): Promise<RedditDataObject[]> {
        return ApiHelpers.genericListing(ApiHelpers.oauthBase+"/prefs/friends", list);
    }
    getBlocked(list?: RedditListing) {
        return ApiHelpers.genericListing(ApiHelpers.oauthBase+"/prefs/blocked", list);
    }
    getMessaging(list?: RedditListing) {
        return ApiHelpers.genericListing(ApiHelpers.oauthBase+"/prefs/messaging", list);
    }
    getTrusted(list?: RedditListing) {
        return ApiHelpers.genericListing(ApiHelpers.oauthBase+"/prefs/trusted", list);
    }
    get(list?: RedditListing) {
        return ApiHelpers.genericListing(ApiHelpers.oauthBase+"/prefs/trusted", list);
    }
    getFriendsV1(list?: RedditListing) {
        return ApiHelpers.genericListing(ApiHelpers.oauthBase+AccountApi.meBase+"/friends", list);
    }
    getBlockedV1(list?: RedditListing) {
        return ApiHelpers.genericListing(ApiHelpers.oauthBase+AccountApi.meBase+"/blocked", list);
    }
}

class ApiHelpers {
    public static readonly base = "https://www.reddit.com/";
    public static readonly oauthBase = "https://oauth.reddit.com/";    
    public static isError (response: RedditError): response is RedditError {
        if(response.hasOwnProperty("message") && response.hasOwnProperty("error")) {
            return true;
        }
        return false;
    }
    public static get authorizationHeader(): RequestHeader{
        if(StorageManager.getUserAccess().accessToken == null) {
            throw new ReferenceError("Access token is null - cannot proceed");
        }
        return new RequestHeader("Authorization","Bearer "+StorageManager.getUserAccess().accessToken);
    }
    public static genericOauthGet(url: string): Promise<any> {
        return Http.get(url, [ApiHelpers.authorizationHeader]).then( (response) => {
            if(ApiHelpers.isError(response)) {
                return Promise.reject(response.message);
            }
            return response;
        });
    }
    public static genericListing(url: string, list: RedditListing | undefined){
        let qs = list === undefined ? "" : Http.createQueryString(list);
        return ApiHelpers.genericOauthGet(url+qs);
    }
}

export class RedditApi {
    private static get authorizeState() {
        return Math.floor(Math.random()*1000) + "meowmeow" + Date.now()
    }
    static get authorizeUrl() {
        return "/api/v1/authorize" +
        Http.createQueryString({
            client_id: "9auOkzXYOjezfQ",
            response_type: "code",
            state: RedditApi.authorizeState,
            redirect_uri: ApiHelpers.base,
            duration: "permanent",
            scope: "identity edit flair history modconfig modflair modlog modposts modwiki mysubreddits privatemessages read report save submit subscribe vote wikiedit wikiread"
        });
    }
    static getAccessToken(code: string): Promise<AuthorizeResult> {
        return Http.post(ApiHelpers.base+"/api/v1/access_token",
            "grant_type=authorization_code&code="+code+"&redirect_uri="+ApiHelpers.base,
            [new RequestHeader("Authorization", "Basic "+btoa("9auOkzXYOjezfQ:")),
             new RequestHeader("Content-Type", "application/x-www-form-urlencoded")]
        ).then((response) => {
            if(ApiHelpers.isError(response)) {
                return Promise.reject(response.message);
            }
            return response;
        });
    }
    static Account: AccountApi
}