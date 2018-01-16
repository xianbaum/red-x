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
    delete() {

    }
    constructor(element: HTMLDivElement) {
        this.element = element;
        RedditElements.hookRedditThreadElements(this.element, this);
    }
    public get id() {
        return this.fullname.substring(3, this.fullname.length);
    }
    public get fullname() {
        return <string>this.element.getAttribute("data-fullname");
    }
    private _body?: string;
    get body() {
        if(this._body == null) {
            let e1 = this.element.getElementsByClassName("usertext-body")[0];
            if(e1 == null) {
                throw new TypeError("body e1 is "+e1+"!");
            }
            let e2 = e1.getElementsByTagName("p")[0];
            if(e2 == null) {
                throw new TypeError("body e2 is "+e2);
            }
            this._body = e2.innerHTML;
        }
        return this._body;
    }
    set body(value) {
        this._body = value;
    }
    private _bodyHtml?: string ;
    get bodyHtml() {
        if(this._bodyHtml !== undefined) {
            return this._bodyHtml;
        }
        return this.body;
    }
    set bodyHtml(value) {
        this._bodyHtml = value;
    }
    get parentId() {
        return null;
    }
    public element: HTMLDivElement;
}