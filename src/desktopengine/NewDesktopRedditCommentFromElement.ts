import { RedditComment, RedditCommentTypeId, RedditCommentType } from "../interfaces/RedditComment";
import { RedditElements } from "./RedditElements";
import { TypePrefix } from "../redditapimodels/Thing";
import { RedditApi, LinkCommentApi } from "../RedditApi";
import { NotImplementedException } from "../helpers/NotImplementedException";

export class NewDesktopRedditCommentFromElement implements RedditComment, RedditCommentTypeId {
    toggle () {
        RedditElements.toggleNew(this.element);
    }
    vote(dir: -1 | 0 | 1) {
        LinkCommentApi.vote(this.fullname, dir).then(() => {
            // RedditElements.voteNewElement(this.element, dir);
        }) 
    }
    toggleReplyForm() {
        RedditElements.toggleCommentReplyForm(this.element, this.fullname);
    }
    submitReply() {

    }
    typeId: RedditCommentType.Desktop;
    private _posterName?: string;
    get author() {
        if(this._posterName == null) {
            let name = <HTMLElement>this.element.getElementsByClassName("Comment__author")[0];
            if(name == null) {
                throw new TypeError("posterName is "+name+"!!!");
            }
            this._posterName = name.innerText;
        }
        return this._posterName;
    }
    private _body?: string;
    get body() {
        if(this._body == null) {
            let e1 = this.element.getElementsByClassName("Comment__body")[0];
            if(e1 == null) {
                throw new TypeError("body e1 is "+e1+"!");
            }
            let e2 = <HTMLElement>e1.firstChild
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
    private _id?: string | null;
    get id(): string {
        if(this._id == null) {
            this._id = this.element.getElementsByClassName("Comment")[0].id
        }
        return this._id;
    }
    get parentId() {
        return "";
    }
    get fullname(): string {
        return TypePrefix.Comment+this.id;
    }
    private _score?: number | undefined;
    get score(): number |  undefined {
        if(this._score == undefined) {
            let e = <HTMLDivElement>this.element.getElementsByClassName("Comment__metadata")[0];
            if(e == null) {
                return undefined;
            }
            let text = e.innerText;
            let pointIndex = text.indexOf(" point")
            if(pointIndex > -1) {
                this._score = +text.substring(0, pointIndex);
            }
        }
        return this._score;
    }
    private _datePosted?: Date;
    get datePosted() {
        if(this._datePosted == null) {
            let e = <HTMLDivElement>this.element.getElementsByClassName("Comment__metadata")[0];
            //idk if this works!
            if(e.innerText.indexOf("just now") > -1) {
                this._datePosted = new Date(Date.now());
            } else if(e.innerText.indexOf("second") > -1) {
                let end = e.innerText.lastIndexOf("second");
                let start = e.innerText.lastIndexOf(" ", end-2);
                this._datePosted = new Date(Date.now() - (+e.innerText.substring(start, end)));
            } else if(e.innerText.indexOf("minute") > -1) {
                let end = e.innerText.lastIndexOf("minute");
                let start = e.innerText.lastIndexOf(" ", end-2);
                this._datePosted = new Date(Date.now() - (+e.innerText.substring(start, end) * 60 /*1 minute*/));
            } else if(e.innerText.indexOf("minute") > -1) {
                let end = e.innerText.lastIndexOf("hour");
                let start = e.innerText.lastIndexOf(" ", end-2);
                this._datePosted = new Date(Date.now() - (+e.innerText.substring(start, end) * 3600 /*1 hour*/));
            } else if(e.innerText.indexOf("day") > -1) {
                let end = e.innerText.lastIndexOf("day");
                let start = e.innerText.lastIndexOf(" ", end-2);
                this._datePosted = new Date(Date.now() - (+e.innerText.substring(start, end) * 25200 /*1 day*/));
            } else if(e.innerText.indexOf("week") > -1) {
                let end = e.innerText.lastIndexOf("week");
                let start = e.innerText.lastIndexOf(" ", end-2);
                this._datePosted = new Date(Date.now() - (+e.innerText.substring(start, end) * 176400 /* 1 week*/));
            } else if(e.innerText.indexOf("month") > -1) {
                let end = e.innerText.lastIndexOf("month");
                let start = e.innerText.lastIndexOf(" ", end-2);
                this._datePosted = new Date(Date.now() - (+e.innerText.substring(start, end) * 756000 /* 30 days */));
            } else if(e.innerText.indexOf("year") > -1) {
                let end = e.innerText.lastIndexOf("year");
                let start = e.innerText.lastIndexOf(" ", end-2);
                this._datePosted = new Date(Date.now() - (+e.innerText.substring(start, end) * 9198000 /*365 days*/));
            }
        }
        return this._datePosted;
    }
    private _dateEdited?: Date;
    get dateEdited(): Date | undefined {
        throw new NotImplementedException("dateEdited is not implemented.");
    }
    get isEdited(): boolean {
        throw new NotImplementedException("isEdited is not implemented.");
    }
    get isDeleted() {
        return this.element.classList.contains("deleted");
    }
    element: HTMLDivElement;    
    constructor(element: HTMLDivElement) {
        this.element = element;
        RedditElements.hookDesktopCommentElements(this.element, this);
    }
    private hookedElements: RedditElements.HookedCommentElements;
}