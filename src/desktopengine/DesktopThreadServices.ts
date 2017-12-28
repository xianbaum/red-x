import { DesktopRedditCommentFromElement }  from "./DesktopRedditCommentFromElement";
import { DesktopRedditComment } from "../interfaces/DesktopRedditComment";
import { RedditElements } from "./RedditElements";

export class DesktopThreadServices {
    static processRedditThread() {
        this.comments = RedditElements.generateCommentList();
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
    static comments: {[id: string] : DesktopRedditComment } = {};
}