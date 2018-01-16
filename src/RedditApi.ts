import { Http, RequestHeader, ResponseHeader } from "./helpers/Http";
import { StorageManager } from "./StorageManager";
import { AuthorizeResult } from "./redditapimodels/AuthorizeResult";
import { RedditError } from "./redditapimodels/Error";
import { User } from "./redditapimodels/User";
import { UserPrefs, UserPrefKeys } from "./redditapimodels/UserPrefs";
import { Listing } from "./redditapimodels/Listing";
import { Thing } from "./redditapimodels/Thing";
import { SubredditKarma } from "./redditapimodels/SubredditKarma";
import { CommentCompose } from "./redditapimodels/CommentCompose";
import { ApiType } from "./redditapimodels/ApiType";
import {ThingsArray} from "./redditapimodels/ThingsArray";
import { JsonData } from "./redditapimodels/JsonData";
import { JsonResponse } from "./redditapimodels/JsonResponse";
import { CommentModel } from "./redditapimodels/Comment";
import { RawJson } from "./redditapimodels/RawJson";
import { RedditMaster } from "./RedditMaster";
import { DesktopEngine } from "./desktopengine/DesktopEngine";
import { MoreModel } from "./redditapimodels/More";

export namespace AccountApi {
    export const meBase = "/api/v1/me";    
    export function getIdentity(): Promise<User> {
        return Helpers.genericOauthGet(Helpers.oauthBase+AccountApi.meBase);
    }
    export function getKarma(): Promise<Thing<"karma",SubredditKarma[]>> {
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
        return Http.request("PATCH", Helpers.oauthBase+AccountApi.meBase+"/prefs", [Helpers.authorizationHeader(), Helpers.userAgent()]);
    }
    export function getFriends(list?: Listing): Promise<Thing<"friends",any>[]> {
        return Helpers.genericListing(Helpers.oauthBase+"/prefs/friends", list);
    }
    export function getBlocked(list?: Listing) {
        return Helpers.genericListing(Helpers.oauthBase+"/prefs/blocked", list);
    }
    export function getMessaging(list?: Listing) {
        return Helpers.genericListing(Helpers.oauthBase+"/prefs/messaging", list);
    }
    export function getTrusted(list?: Listing) {
        return Helpers.genericListing(Helpers.oauthBase+"/prefs/trusted", list);
    }
    export function getFriendsV1(list?: Listing) {
        return Helpers.genericListing(Helpers.oauthBase+AccountApi.meBase+"/friends", list);
    }
    export function getBlockedV1(list?: Listing) {
        return Helpers.genericListing(Helpers.oauthBase+AccountApi.meBase+"/blocked", list);
    }
}
export class RedditValiationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "Reddit API error";
    }
}
export namespace LinkCommentApi {
    export function postComment(parentId: string, text: string) {
        let comment: CommentCompose | ApiType | RawJson =  {
            parent:  parentId,
            text: text,
            api_type: "json",
            raw_json: 1
        };
        return new Promise<JsonResponse<JsonData<ThingsArray<"t1", CommentModel>>>>((resolve, reject) => {
            Http.post(Helpers.oauthBase+"/api/comment",
            comment,
            [Helpers.authorizationHeader(), Helpers.userAgent(), Helpers.xWwwFormUrlEncodedContentType()],
            true).then((response: JsonResponse<JsonData<ThingsArray<"t1", CommentModel>>>) => {
                if(!Helpers.exceptOnError(response, () => {
                    postComment(parentId, text).then((response) => {
                        resolve(response)
                    }, reject);
                }, reject)) {
                    resolve(response);
                }
            });
        })
    }
    export function vote(fullname: string, dir: -1 | 0 | 1)  {
        let data = {
            dir: dir,
            id: fullname,
            rank: 2
        }
        return new Promise((resolve, reject) => {
            Http.post(Helpers.oauthBase+"/api/vote", data,
            [Helpers.authorizationHeader(), Helpers.userAgent(), Helpers.xWwwFormUrlEncodedContentType()],
            true).then((response: {} ) => {
                if(!Helpers.exceptOnError(response, () => {
                    vote(fullname, dir).then((response: {}) =>{
                        resolve(response);
                    });
                }, reject)) {
                    resolve(response);
                }
            });
        });
    }
    export function deleteThing(fullname: string) {
        let data = {
            id: fullname
        };
        return new Promise<{}>((resolve, reject) => {
                Http.post(Helpers.oauthBase + "/api/del", data,
                [Helpers.authorizationHeader(), Helpers.userAgent(), Helpers.xWwwFormUrlEncodedContentType()],
                true).then((response: {}) => {
                    if(!Helpers.exceptOnError(response, () => {
                        deleteThing(fullname).then((response) => {
                            resolve(response);
                        }, reject);
                    }, reject)) {
                        resolve(response);
                    }
                })
        })
    }
    export function editPost(fullname: string, text: string) {
        let data = {
            api_type: "json",
            return_rtjson: false,
            text: text,
            thing_id: fullname,
            raw_json: 1
        };
        return new Promise<JsonResponse<JsonData<ThingsArray<"t1", CommentModel>>>>((resolve, reject) => {
            Http.post(Helpers.oauthBase+"/api/editusertext", data,
            [Helpers.authorizationHeader(), Helpers.userAgent(), Helpers.xWwwFormUrlEncodedContentType()],
            true).then((response: JsonResponse<JsonData<ThingsArray<"t1", CommentModel>>>) => {
                if(!Helpers.exceptOnError(response, () => {
                    editPost(fullname, text).then((response) => {
                        resolve(response)
                    }, reject);
                }, reject)) {
                    resolve(response);
                }
        });
        })
    }
    export function submitPost(kind: "self" | "link", title: string, linkOrText: string, subreddit: string) {
        let data: any = {
            ad: false,
            api_type: "json",
            kind: kind,
            nsfw: false,
            resubmit: true,
            spoiler: false,
            sr: subreddit,
            title: title
        };
        if(kind == "self") {
            data.text = linkOrText;
        } else {
            data.url = linkOrText;
        }
        return new Promise<any>((resolve, reject) => {
            Http.post(Helpers.oauthBase+"/api/submit", data,
            [Helpers.authorizationHeader(), Helpers.userAgent(), Helpers.xWwwFormUrlEncodedContentType()],
            true).then((response: any) => {
                console.log(response);
                if(!Helpers.exceptOnError(response, () => {
                    submitPost(kind, title, linkOrText, subreddit).then((response) => {
                        resolve(response)
                    }, reject);
                }, reject)) {
                    resolve(response);
                }
            });
        });
    }
    export function getMoreChildren(commaDelimitedChildren: string, linkId: string,  id?: string) {
        let data: any = {
            api_type: "json",
            children: commaDelimitedChildren
        };
        if(id !== undefined) {
            data.id = id;
        }
        data.limit_children = false;
        data.link_id = linkId;
        data.sort = "confidence";
        data.raw_json = 1;
        return new Promise<JsonResponse<JsonData<ThingsArray<"t1"|"more", CommentModel | MoreModel>>>>((resolve, reject) => {
            Http.get(Helpers.oauthBase+"/api/morechildren"+Http.createQueryString(data), [Helpers.authorizationHeader(), Helpers.userAgent()]).then(
            (response: JsonResponse<JsonData<ThingsArray<"t1"|"more", CommentModel | MoreModel>>>) => {
                if(!Helpers.exceptOnError(response, () => {
                    getMoreChildren(commaDelimitedChildren, linkId, id).then((response) =>{
                        resolve(response);
                    }, reject);
                }, reject)) {
                    resolve(response);
                }
            })
        });
    }
}
namespace Helpers {
    export const base = "https://www.reddit.com";
    export const oauthBase = "https://oauth.reddit.com";
    export function isError (response: RedditError): response is RedditError {
        if(response === "Error: URI Too Long" || response.hasOwnProperty("error")) {
            return true;
        }
        return false;
    }
    export function errorToString(e: RedditError) {
        return e.error +  (e.message !== undefined ? ": "+ e.message : "");
    }
    export function exceptOnError(response: any, oldMethod?: () => void, reject?: (reason?: any) => void) {
        if(Helpers.isError(response)) {
            if(response.error === 401) {
                RedditMaster.reRequestAccess(oldMethod, reject);
                return true;
            }
            throw new RedditValiationError(Helpers.errorToString(response));
        }
        return false;
    }
    export function returnExceptOnError(response: any) {
        Helpers.exceptOnError(response);
        return response;
    }
    export function authorizationHeader(): RequestHeader{
        if(StorageManager.getUserAccess(<string>DesktopEngine.username).accessToken == null) {
            throw new ReferenceError("Access token is null - cannot proceed");
        }
        return new ResponseHeader("Authorization","Bearer "+StorageManager.getUserAccess(<string>DesktopEngine.username).accessToken);
    }
    export function userAgent(): RequestHeader {
        navigator.appVersion
        return new ResponseHeader("User-Agent", navigator.appVersion+":red-x:v0.1"+" (by /u/xianbaum)");
    }
    export function genericOauthGet(url: string): Promise<any> {
        return Http.get(url, [Helpers.authorizationHeader(), Helpers.userAgent()])
            .then(Helpers.returnExceptOnError);
    }
    export function genericListing(url: string, list: Listing | undefined){
        let qs = list === undefined ? "" : Http.createQueryString(list);
        return Helpers.genericOauthGet(url+qs);
    }
    export function xWwwFormUrlEncodedContentType() {
        return new ResponseHeader("Content-Type", "application/x-www-form-urlencoded");
    }
}

export namespace RedditApi {
    export const clientId = "kjbqRmcCWosaig";
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
            redirect_uri: Helpers.base+"/",
            duration: "permanent",
            scope: "identity edit flair history modconfig modflair modlog modposts modwiki mysubreddits privatemessages read report save submit subscribe vote wikiedit wikiread"
        });
    }
    export function getAccessToken(code: string): Promise<AuthorizeResult> {
        return Http.post(Helpers.base+"/api/v1/access_token",
            "grant_type=authorization_code&code="+code+"&redirect_uri="+Helpers.base+"/",
            [new ResponseHeader("Authorization", "Basic "+btoa(RedditApi.clientId+":")),
             Helpers.userAgent(),
             new ResponseHeader("Content-Type", "application/x-www-form-urlencoded")]
        ).then(Helpers.returnExceptOnError);
    }
    export function refreshAccessToken(refreshToken: string) {
        return Http.post(Helpers.base+"/api/v1/access_token",
            "grant_type=refresh_token&refresh_token="+refreshToken,
            [new ResponseHeader("Authorization", "Basic "+btoa(RedditApi.clientId+":")),
            Helpers.userAgent(),
            new ResponseHeader("Content-Type", "application/x-www-form-urlencoded")]
        ).then(Helpers.returnExceptOnError);
    }
}

//uncomment for testing api
declare var cloneInto: any;
cloneInto( AccountApi, window, {cloneFunctions: true, wrapReflectors: true});
cloneInto( RedditApi, window, {cloneFunctions: true, wrapReflectors: true});
cloneInto( Helpers, window, {cloneFunctions: true, wrapReflectors: true});