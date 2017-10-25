import { Http } from "./helpers/Http";
import { RedditError } from "./helpers/RedditError";
export class RedditApi {
    validateResponse (response: RedditError): boolean {
        if(response.message === "Forbidden" && response.error === 403) {
            return false;
        }
        return true;
    }
    authorize(): void {
        
    }
    getIdentity(): void {
        
    }
}