import { DesktopThreadRedditComment }  from "./DesktopThreadRedditComment";
import { RedditComment } from "../interfaces/RedditComment";
import { RedditElements } from "./RedditElements";

export class DesktopThreadServices {
    static processRedditThread() {
        this.populateCommentsList();
    }
    public static addComment(comment: RedditComment) {
        if(this.comments[comment.id] === undefined) {
            this.comments[comment.id] = comment;
        }
        let stel: HTMLElement = RedditElements.generateCommentElement(comment);
        if(this.commentElements[comment.id] === undefined) {
            this.commentElements[comment.id] = <HTMLDivElement>stel.firstChild;
        }
        if(comment.parentId === null || this.comments[comment.parentId] === undefined) {
            var comments = document.getElementsByClassName("sitetable nestedlisting")[0]
            comments.appendChild(stel);
        }
        else {
            this.commentElements[comment.parentId].getElementsByClassName("child")[0].appendChild(stel);
        }
    }
    private static populateCommentsList() {
        let elements: NodeListOf<HTMLDivElement> = <NodeListOf<HTMLDivElement>>document.querySelectorAll("[data-type=comment]");
        for(let element of elements) {
            let comment = new DesktopThreadRedditComment(element);
            this.comments[comment.id] = comment;
            this.commentElements[comment.id] = element;
        }
    }
    static comments: {[id: string] : RedditComment } = {};
    static commentElements: {[id: string] : HTMLDivElement} = {};
}