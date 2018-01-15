import { RedditComment } from "../interfaces/RedditComment";
import { DesktopRedditComment } from "../interfaces/DesktopRedditComment";
import { CommentModel } from "../redditapimodels/Comment";
import { RedditElements } from "../desktopengine/RedditElements";
import { RedditApi, LinkCommentApi } from "../RedditApi";

export class ApiRedditComment implements RedditComment {
    toDesktopRedditComment(): DesktopRedditComment {
        return new DesktopRedditCommentFromApi(this);
    }
    get body() {
        return this.adapter.body;
    }
    set body(value) {
        this.adapter.body = value;
    }
    get bodyHtml() {
        return this.adapter.body_html;
    }
    set bodyHtml(value) {
        this.adapter.body_html = value;
    }
    get author() {
        return this.adapter.author;
    }
    get id() {
        return this.adapter.id;
    }
    get fullname() {
        return this.adapter.name;
    }
    get score() {
        return this.adapter.score;
    }
    private _datePosted?: Date
    get datePosted() {
        if(this._datePosted === undefined) {
            this._datePosted = new Date(0);
            this._datePosted.setUTCSeconds(this.adapter.created);
        }
        return this._datePosted;
    }
    get isEdited() {
        return this.adapter.edited !== false;
    }
    get parentId() {
        return this.adapter.parent_id.replace("t1_","");
    }
    get parentFullname() {
        return this.adapter.parent_id;
    }
    get isDeleted() {
        return this.adapter.body === "deleted";
    }
    constructor(comment: CommentModel) {
        this.adapter = comment;
    }
    private adapter: CommentModel;
}

class DesktopRedditCommentFromApi implements DesktopRedditComment  {
    vote(dir: -1 | 0 | 1) {
        LinkCommentApi.vote(this.fullname, dir).then(() => {
            RedditElements.voteElement(this.element, dir);            
        }) 
    }
    get body() {
        return this.apiAdapter.body;
    }
    set body(value) {
        this.apiAdapter.body = value;
    }
    get author() {
        return this.apiAdapter.author;
    }
    get id() {
        return this.apiAdapter.id;
    }
    get datePosted() {
        return this.apiAdapter.datePosted;
    }
    get isEdited() {
        return this.apiAdapter.isEdited;
    }
    get parentId() {
        return this.apiAdapter.parentId;
    }
    get fullname() {
        return this.apiAdapter.fullname;
    }
    get bodyHtml() {
        return this.apiAdapter.bodyHtml;
    }
    set bodyHtml(value) {
        this.apiAdapter.bodyHtml = value;
    }
    get isDeleted() {
        return false //TODO This
    }
    toggle() {
        RedditElements.toggle(this.element);
    }
    toggleReplyForm() {
        RedditElements.toggleCommentReplyForm(this.element, this.fullname);
    }
    element: HTMLDivElement;        
    constructor(apiComment: ApiRedditComment) {
        this.apiAdapter = apiComment;
        this.element = RedditElements.generateCommentElement(this.apiAdapter);
        RedditElements.hookDesktopCommentElements(this.element, this);
    }
    private apiAdapter: ApiRedditComment;
}