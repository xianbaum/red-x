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
    get bodyHtml() {
        return this.adapter.body_html;
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
    get datePosted() {
        return new Date(this.adapter.created);
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
    constructor(comment: CommentModel) {
        this.adapter = comment;
    }
    private adapter: CommentModel;
}

class DesktopRedditCommentFromApi implements DesktopRedditComment  {
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
    get body() {
        return this.apiAdapter.body;
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
    toggle() {
        RedditElements.toggle(this.element);
    }
    toggleReplyForm() {
        RedditElements.toggleReplyForm(this.element, this.fullname);
    }
    element: HTMLDivElement;        
    constructor(apiComment: ApiRedditComment) {
        this.apiAdapter = apiComment;
        this.element = RedditElements.generateCommentElement(this.apiAdapter);
        RedditElements.hookDesktopCommentElements(this.element, this);
    }
    private apiAdapter: ApiRedditComment;
}