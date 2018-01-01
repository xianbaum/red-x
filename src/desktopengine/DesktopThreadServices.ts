import { DesktopRedditCommentFromElement }  from "./DesktopRedditCommentFromElement";
import { DesktopRedditComment } from "../interfaces/DesktopRedditComment";
import { RedditElements } from "./RedditElements";
import { RedditThread } from "../interfaces/RedditThread";

export class DesktopThreadServices {
    static processRedditThread() {
        this.comments = RedditElements.generateCommentList();
        let threads = RedditElements.generateLinkList();
        for(var i in threads) {
            this.thread = threads[i];
        }
        RedditElements.hookThreadCommentForm();
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