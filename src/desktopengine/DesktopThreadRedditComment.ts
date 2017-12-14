import { RedditComment, RedditCommentTypeId, RedditCommentType } from "../interfaces/RedditComment";

export class DesktopThreadRedditComment implements RedditComment, RedditCommentTypeId {
    typeId: RedditCommentType.Desktop;
    body: string;
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
    get datePosted(): Date {
        return new Date();
    }
    edited: boolean;
    constructor(element: HTMLElement) {
        this.element = element;
        let voterElement = element.getElementsByClassName("midcol")[0];
        let entryElement = element.getElementsByClassName("entry")[0];
        this.hookedElements = {
            upvote: <HTMLElement>voterElement.getElementsByClassName("up")[0],
            downvote:<HTMLElement> voterElement.getElementsByClassName("down")[0], 
            reply:<HTMLElement> entryElement.getElementsByClassName("reply-button")[0],
            collapse:<HTMLElement> entryElement.getElementsByClassName("expand")[0]
        };
        this.hookedElements.collapse.addEventListener("click", () => {
            this.toggle();
        });
    }
    hookedElements: {
        upvote: HTMLElement;
        downvote: HTMLElement;
        reply: HTMLElement;
        collapse: HTMLElement;
    };
    private element: HTMLElement;
    private static readonly authorAttribute = "data-author"; 
    toggle (){
        if(this.element.classList.contains("collapsed")) {
            this.element.classList.remove("collapsed");
            this.element.classList.add("noncollapsed");
        } else {
            this.element.classList.add("collapsed");
            this.element.classList.remove("noncollapsed");
        }
    }
    get posterName() {
        let name = this.element.getAttribute(DesktopThreadRedditComment.authorAttribute);
        if(name == null) {
            throw new TypeError("posterName is "+name+"!!!");
        }
        return name;
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
            this._id.replace("t1_","");
        }
        return this._id;
    }
    // get user() {
        
    // }
}