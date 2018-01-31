import { DesktopRedditCommentFromElement }  from "./DesktopRedditCommentFromElement";
import { DesktopRedditComment } from "../interfaces/DesktopRedditComment";
import { RedditElements } from "./RedditElements";
import { RedditThread } from "../interfaces/RedditThread";
import { DesktopEngine } from "./DesktopEngine";
import { DesktopRedditThreadFromElement } from "./DesktopRedditThreadFromElement";
import { Thingable } from "../interfaces/Thingable";
import { HasElement } from "../interfaces/HasElement";

export class DesktopThreadServices {
    static processRedditThread() {
        this.comments = 
            RedditElements.generateListOf<DesktopRedditCommentFromElement>("comment",
                DesktopRedditCommentFromElement);
        let threads = 
            RedditElements.generateListOf<DesktopRedditThreadFromElement>("link",
                DesktopRedditThreadFromElement);
        for(var i in threads) {
            this.thread = threads[i];
        }
        if(DesktopEngine.isLoggedIn) {
            RedditElements.hookThreadCommentForm();
            RedditElements.hookMoreComments();
        }
        RedditElements.hookSearch();
    }
    public static addThingable(comment: Thingable & HasElement) {
        if(this.comments[comment.fullname] === undefined) {
            this.comments[comment.fullname] = comment;
        }
        if(comment.parentId === null || this.comments[comment.parentId] === undefined) {
            var comments = document.getElementsByClassName("sitetable nestedlisting")[0]
            comments.appendChild(comment.element);
        }
        else {
            this.comments[comment.parentId].
                element.getElementsByClassName("child")[0].appendChild(comment.element);
        }
    }
    static thread: RedditThread;
    static comments: {[id: string] : Thingable & HasElement } = {};
}