import { RedditComment, RedditCommentTypeId, RedditCommentType } from "../interfaces/RedditComment";
import { CommentModel } from "../redditapimodels/Comment";
export class ApiRedditComment implements RedditComment, RedditCommentTypeId {
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
    readonly typeId: RedditCommentType = RedditCommentType.Adaptive;
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