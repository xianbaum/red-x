import { RedditElements } from "./RedditElements";
import { RedditThread } from "../interfaces/RedditThread";
import { Dictionary } from "../helpers/Dictionary";

export class SubredditServices {
    static init(){
        this.threads = RedditElements.generateLinkList(false);
    }
    static threads: Dictionary<RedditThread>;
}