import { DesktopRedditCommentFromElement }  from "./DesktopRedditCommentFromElement";
import { DesktopRedditComment } from "../interfaces/DesktopRedditComment";
import { RedditElements } from "./RedditElements";

export class DesktopThreadServices {
    static processRedditThread() {
        this.populateCommentsList();
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
    private static populateCommentsList() {
        let elements: NodeListOf<HTMLDivElement> = <NodeListOf<HTMLDivElement>>document.querySelectorAll("[data-type=comment]");
        for(let element of elements) {
            let comment = new DesktopRedditCommentFromElement(element);
            this.comments[comment.id] = comment;
        }
    }
    static comments: {[id: string] : DesktopRedditComment } = {};
}