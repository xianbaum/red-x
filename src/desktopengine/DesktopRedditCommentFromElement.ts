import { RedditComment, RedditCommentTypeId, RedditCommentType } from "../interfaces/RedditComment";
import { RedditElements } from "./RedditElements";
import { TypePrefix } from "../redditapimodels/Thing";
import { RedditApi, LinkCommentApi } from "../RedditApi";

export class DesktopRedditCommentFromElement implements RedditComment, RedditCommentTypeId {
    toggle () {
        RedditElements.toggle(this.element);
    }
    vote(dir: -1 | 0 | 1) {
        LinkCommentApi.vote(this.fullname, dir).then(() => {
            switch(dir) {
                case -1:
                RedditElements.downvoteElement(this.element);
                break;
                case 0:
                RedditElements.unvoteElement(this.element);
                break;
                case 1:
                RedditElements.upvoteElement(this.element);
                break;
                default:
                throw new TypeError("dir is never! value is " + dir)
            }
        }) 
    }
    toggleReplyForm() {
        RedditElements.toggleReplyForm(this.element, this.fullname);
    }
    submitReply() {

    }
    typeId: RedditCommentType.Desktop;
    private _posterName?: string;
    get author() {
        if(this._posterName == null) {
            let name = this.element.getAttribute("data-author");
            if(name == null) {
                throw new TypeError("posterName is "+name+"!!!");
            }
            this._posterName = name;
        }
        return this._posterName;
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
    get bodyHtml() {
        return this.body;
    }
    private _id?: string | null;
    get id(): string {
        if(this._id != null) {
            return this._id;
        }
        this._id = this.element.getAttribute("data-fullname");
        if(this._id == null) {
            /* i don't really know if this is a worthy fallback or if this code will even ever execute */
            let parentElement = this.element.getElementsByClassName("parent")[0];
            if(parentElement == null) {
                this._id = this.element.id.replace("this_t1_","");                
            } else {
                this._id = parentElement.children[0].getAttribute("name");
                if(this._id == null) {
                    throw "id is undefined";
                }
            }
        } else {
            this._id = this._id.replace("t1_","");
        }
        return this._id;
    }
    get parentId() {
        return "";
    }
    get fullname(): string {
        return TypePrefix.Comment+this.id;
    }
    get score(): number |  undefined {
        let score: number | undefined;
        let scoreString = this.element.getElementsByClassName("score unvoted")[0].getAttribute("title");
        if(scoreString == null) {
            score = undefined;
        } else {
            score = +scoreString;
        }
        return score;
    }
    private _datePosted?: Date;
    get datePosted() {
        if(this._datePosted == null) {
            let entryElement = this.element.getElementsByClassName("entry")[0];
            let dateE = entryElement.getElementsByClassName("live-timestamp")[0]
            if(dateE == null) {
                throw new TypeError("Date element is null");
            }
            let attr = dateE.getAttribute("datetime");
            if(attr == null) {
                throw new TypeError("Date attr is null");
            }
            let date = Date.parse(attr);
            if(isNaN(date)) {
                throw new TypeError("Date posted is not parsable");
            }
            this._datePosted = new Date(attr);
        }
        return this._datePosted;
    }
    private _dateEdited?: Date;
    get dateEdited(): Date | undefined {
        if(!this.isEdited){
            return undefined;
        }
        if(this._dateEdited == null) {
            let entryElement = this.element.getElementsByClassName("entry")[0];
            let dateE = entryElement.getElementsByClassName("edited-timestamp")[0]
            if(dateE == null) {
                throw new TypeError("edit Date element is null");
            }
            let attr = dateE.getAttribute("datetime");
            if(attr == null) {
                throw new TypeError("edit Date attr is null");
            }
            let date = Date.parse(attr);
            if(isNaN(date)) {
                throw new TypeError("edit Date posted is not parsable");
            }
            this._dateEdited = new Date(attr);
        }
        return this._dateEdited;
    }
    get isEdited() {
        let entryElement = this.element.getElementsByClassName("entry")[0];
        return entryElement.getElementsByClassName("edited-timestamp")[0] != null;
    }
    element: HTMLDivElement;    
    constructor(element: HTMLDivElement) {
        this.element = element;
        RedditElements.hookDesktopCommentElements(this.element, this);
    }
    private hookedElements: RedditElements.HookedCommentElements;
}