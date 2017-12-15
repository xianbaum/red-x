import { RedditComment, RedditCommentTypeId, RedditCommentType } from "../interfaces/RedditComment";

export class ApiRedditComment implements RedditComment, RedditCommentTypeId {
    body: string;
    posterName: string;
    id: string;
    score?: number;
    datePosted: Date;
    edited: boolean;
    readonly typeId: RedditCommentType = RedditCommentType.Adaptive;
}