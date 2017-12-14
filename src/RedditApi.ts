import { Http, RequestHeader, ResponseHeader } from "./helpers/Http";
import { StorageManager } from "./StorageManager";
import { AuthorizeResult } from "./redditapimodels/AuthorizeResult";
import { RedditError } from "./redditapimodels/Error";
import { User } from "./redditapimodels/User";
import { UserPrefs, UserPrefKeys } from "./redditapimodels/UserPrefs";
import { RedditListing } from "./redditapimodels/RedditListing";
import { RedditDataObject, SubredditKarma } from "./redditapimodels/RedditDataObject";

export namespace AccountApi {
    export const meBase = "/api/v1/me";    
    export function getIdentity(): Promise<User> {
        return Helpers.genericOauthGet(Helpers.oauthBase+AccountApi.meBase);
    }
    export function getKarma(): Promise<RedditDataObject<"karma",SubredditKarma[]>> {
        return Helpers.genericOauthGet(Helpers.oauthBase+AccountApi.meBase+"/karma");
    }
    export function getPrefs(): Promise<UserPrefs> {
        return Helpers.genericOauthGet(Helpers.oauthBase+AccountApi.meBase+"/prefs");
    }
    export function setPrefs(pref: UserPrefs | UserPrefKeys, value?: string) {
        let object: any;
        if(typeof pref === "string" && value !== undefined){
            object = {
                pref: value
            };
        } else {
            object = <UserPrefKeys>pref;
        }
        return Http.request("PATCH", Helpers.oauthBase+AccountApi.meBase+"/prefs", [Helpers.authorizationHeader()]);
    }
    export function getFriends(list?: RedditListing): Promise<RedditDataObject<"friends",any>[]> {
        return Helpers.genericListing(Helpers.oauthBase+"/prefs/friends", list);
    }
    export function getBlocked(list?: RedditListing) {
        return Helpers.genericListing(Helpers.oauthBase+"/prefs/blocked", list);
    }
    export function getMessaging(list?: RedditListing) {
        return Helpers.genericListing(Helpers.oauthBase+"/prefs/messaging", list);
    }
    export function getTrusted(list?: RedditListing) {
        return Helpers.genericListing(Helpers.oauthBase+"/prefs/trusted", list);
    }
    export function getFriendsV1(list?: RedditListing) {
        return Helpers.genericListing(Helpers.oauthBase+AccountApi.meBase+"/friends", list);
    }
    export function getBlockedV1(list?: RedditListing) {
        return Helpers.genericListing(Helpers.oauthBase+AccountApi.meBase+"/blocked", list);
    }
}

export class RedditValiationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "Reddit API error";
    }
}

namespace Helpers {
    export const base = "https://www.reddit.com/";
    export const oauthBase = "https://oauth.reddit.com/";    
    export function isError (response: RedditError): response is RedditError {
        if(response.hasOwnProperty("error")) {
            return true;
        }
        return false;
    }
    export function errorToString(e: RedditError) {
        return e.error +  (e.message !== undefined ? ": "+ e.message : "");
    }
    export function exceptOnError(response: any) {
        if(Helpers.isError(response)) {
            throw new RedditValiationError(Helpers.errorToString(response));
        }
    }
    export function returnExceptOnError(response: any) {
        Helpers.exceptOnError(response);
        return response;
    }
    export function authorizationHeader(): RequestHeader{
        if(StorageManager.getUserAccess().accessToken == null) {
            throw new ReferenceError("Access token is null - cannot proceed");
        }
        return new ResponseHeader("Authorization","Bearer "+StorageManager.getUserAccess().accessToken);
    }
    export function genericOauthGet(url: string): Promise<any> {
        return Http.get(url, [Helpers.authorizationHeader()])
            .then(Helpers.returnExceptOnError);
    }
    export function genericListing(url: string, list: RedditListing | undefined){
        let qs = list === undefined ? "" : Http.createQueryString(list);
        return Helpers.genericOauthGet(url+qs);
    }
}

export namespace RedditApi {
    export const clientId = "9auOkzXYOjezfQ";
    export const authorizePath = "/api/v1/authorize"
    export function authorizeState() {
        return Math.floor(Math.random()*1000) + "meowmeow" + Date.now()
    }
    export function authorizeUrl() {
        return RedditApi.authorizePath +
        Http.createQueryString({
            client_id: RedditApi.clientId,
            response_type: "code",
            state: RedditApi.authorizeState(),
            redirect_uri: Helpers.base,
            duration: "permanent",
            scope: "identity edit flair history modconfig modflair modlog modposts modwiki mysubreddits privatemessages read report save submit subscribe vote wikiedit wikiread"
        });
    }
    export function getAccessToken(code: string): Promise<AuthorizeResult> {
        return Http.post(Helpers.base+"/api/v1/access_token",
            "grant_type=authorization_code&code="+code+"&redirect_uri="+Helpers.base,
            [new ResponseHeader("Authorization", "Basic "+btoa(RedditApi.clientId+":")),
             new ResponseHeader("Content-Type", "application/x-www-form-urlencoded")]
        ).then(Helpers.returnExceptOnError);
    }
}