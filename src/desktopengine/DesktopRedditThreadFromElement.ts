import { RedditThread } from "../interfaces/RedditThread";
import { LinkCommentApi } from "../RedditApi";
import {RedditElements } from "./RedditElements";
export class DesktopRedditThreadFromElement implements RedditThread {
    vote(dir: -1 | 0 | 1) {
        LinkCommentApi.vote(this.fullname, dir).then(() => {
            if(dir == 1)  {
                RedditElements.upvoteElement(this.element);
            } else if(dir == 0) {
                RedditElements.unvoteElement(this.element);
            } else {
                RedditElements.downvoteElement(this.element);
            }
        })
    }
    constructor(element: HTMLDivElement) {
        this.element = element;
        RedditElements.hookVoterElement(this.element, this);
    }
    public get fullname() {
        return <string>this.element.getAttribute("data-fullname");
    }
    public element: HTMLDivElement;
}