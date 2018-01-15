import { DesktopRedditCommentFromElement }  from "./DesktopRedditCommentFromElement";
import { DesktopRedditComment } from "../interfaces/DesktopRedditComment";
import { RedditElements } from "./RedditElements";
import { RedditThread } from "../interfaces/RedditThread";
import { DesktopEngine } from "./DesktopEngine";
import { DesktopRedditThreadFromElement } from "./DesktopRedditThreadFromElement";

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
    }
    public static addComment(comment: DesktopRedditComment) {
        if(this.comments[comment.id] === undefined) {
            this.comments[comment.id] = comment;
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
    static comments: {[id: string] : DesktopRedditComment } = {};
}