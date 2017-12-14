import { DesktopThreadRedditComment }  from "./DesktopThreadRedditComment";
import { RedditComment } from "../RedditComment";

export class DesktopThreadServices {
    constructor() {}
    processRedditThread() {
        this.populateCommentsList();
    }
    private  populateCommentsList() {
        let elements: NodeListOf<HTMLElement> = <NodeListOf<HTMLElement>>document.querySelectorAll("[data-type=comment]");
        for(let element of elements) {
            this.comments.push(new DesktopThreadRedditComment(element));
        }
    }
    comments: RedditComment[] = [];
}