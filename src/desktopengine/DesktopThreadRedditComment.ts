import { RedditComment, RedditCommentTypeId, RedditCommentType } from "../interfaces/RedditComment";
import { RedditElements } from "./RedditElements";
import { TypePrefix } from "../redditapimodels/Thing";

export class DesktopThreadRedditComment implements RedditComment, RedditCommentTypeId {
    toggle (){
        if(this.element.classList.contains("collapsed")) {
            this.element.classList.remove("collapsed");
            this.element.classList.add("noncollapsed");
        } else {
            this.element.classList.add("collapsed");
            this.element.classList.remove("noncollapsed");
        }
    }
    upvote() {

    }
    downvote() {

    }
    unvote() {
        
    }
    toggleReplyForm() {
        var child = this.element.getElementsByClassName("child")[0];
        var childsChild : Element | undefined = child.children[0];
        if(childsChild !== undefined && childsChild.tagName.toUpperCase() === "FORM") {
            /*remove*/
            child.removeChild(childsChild);
        } else {
            /*add*/
            let formToAdd = RedditElements.generateCommentForm(this.fullname);
            if(childsChild === undefined) {
                child.appendChild(formToAdd);
            } else { /* first tagname is not form */
                child.insertBefore(formToAdd, childsChild);
            }
        }
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
        let voterElement = element.getElementsByClassName("midcol")[0];
        let entryElement = element.getElementsByClassName("entry")[0];
        this.hookedElements = {
            upvote: <HTMLElement>voterElement.getElementsByClassName("up")[0] || <HTMLElement>voterElement.getElementsByClassName("upmod")[0],
            downvote:<HTMLElement> voterElement.getElementsByClassName("down")[0] || <HTMLElement> voterElement.getElementsByClassName("downmod")[0], 
            reply:<HTMLElement> entryElement.getElementsByClassName("reply-button")[0],
            collapse:<HTMLElement> entryElement.getElementsByClassName("expand")[0]
        };
        this.hookedElements.collapse.addEventListener("click", () => {
            this.toggle();
        });
        this.hookedElements.upvote.addEventListener("click", () => {

        });
        this.hookedElements.downvote.addEventListener("click", () => {

        });
        this.hookedElements.reply.addEventListener("click", () =>{
            this.toggleReplyForm();
        })
    }
    private hookedElements: {
        upvote: HTMLElement;
        downvote: HTMLElement;
        reply: HTMLElement;
        collapse: HTMLElement;
    };
}