import { RedditElements } from "./RedditElements";
import { RedditThread } from "../interfaces/RedditThread";
import { Dictionary } from "../helpers/Dictionary";
import { DesktopRedditThreadFromElement } from "./DesktopRedditThreadFromElement";

export class SubredditServices {
    static init(){
        this.threads = 
            RedditElements.generateListOf<DesktopRedditThreadFromElement>("comment",
                DesktopRedditThreadFromElement);
        RedditElements.hookSearch();
    }
    static threads: Dictionary<RedditThread>;
}