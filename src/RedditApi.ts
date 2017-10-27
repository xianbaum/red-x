import { Http, RequestHeader } from "./helpers/Http";

export interface AuthorizeResult {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
}

export interface RedditError {
    message?: string;
    error?: number;
}

export class RedditApi {
    private static isError (response: RedditError): response is RedditError {
        if(response.hasOwnProperty("message") && response.hasOwnProperty("error")) {
            return true;
        }
        return false;
    }
    private static get authorizeState() {
        return Math.floor(Math.random()*1000) + "meowmeow" + Date.now()
    }
    private static base = "https://www.reddit.com/";
    static get authorizeUrl() {
        return "/api/v1/authorize" +
        Http.createQueryString({
            client_id: "9auOkzXYOjezfQ",
            response_type: "code",
            state: RedditApi.authorizeState,
            redirect_uri: RedditApi.base,
            duration: "permanent",
            scope: "identity edit flair history modconfig modflair modlog modposts modwiki mysubreddits privatemessages read report save submit subscribe vote wikiedit wikiread"
        });
    }
    static getAccessToken(code: string): Promise<AuthorizeResult> {
        return Http.post(RedditApi.base+"/api/v1/access_token",
            "grant_type=authorization_code&code="+code+"&redirect_uri="+RedditApi.base,
            [new RequestHeader("Authorization", "Basic "+btoa("9auOkzXYOjezfQ:")),
             new RequestHeader("Content-Type", "application/x-www-form-urlencoded")]
        ).then((response) => {
            if(RedditApi.isError(response)) {
                return Promise.reject(response.message);
            }
            return response;
        });
    }
    static getIdentity() {
        return Http.get(RedditApi.base+"/api/v1/me").then( (response) => {
            if(RedditApi.isError(response)) {
                return Promise.reject(response.message);
            }
            return response;
        });
    }
}