import { Http } from "./helpers/Http";
import { RedditError } from "./RedditError";
export class RedditApi {
    private static validateResponse (response: RedditError): boolean {
        if(response.message === "Forbidden" && response.error === 403) {
            return false;
        }
        return true;
    }
    private static get authorizeState() {
        return Math.floor(Math.random()*1000) + "meowmeow" + Date.now()
    }
    private static base = "https://www.reddit.com";
    static get authorizeUrl() {
        return "/api/v1/authorize" +
        Http.createQueryString({
            client_id: "9auOkzXYOjezfQ",
            response_type: "code",
            state: RedditApi.authorizeState,
            redirect_uri: "https://www.github.com/xianbaum/redditx",
            duration: "permanent",
            scope: "identity%20edit%20flair%20history%20modconfig%20modflair%20modlog%20modposts%20modwiki%20mysubreddits%20privatemessages%20read%20report%20save%20submit%20subscribe%20vote%20wikiedit%20wikiread"
        });
    }
    static getIdentity() {
        return Http.get(RedditApi.base+"/api/v1/me").then( (response) => {
            if(RedditApi.validateResponse(response)) {
                return Promise.reject(response.message);
            }
            return response;
        });
    }
}