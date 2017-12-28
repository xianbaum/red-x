import { CommentModel } from "../redditapimodels/Comment";
export type RedditComment = RedditCommentProperties;

export interface RedditCommentProperties {
    body: string;
    readonly author: string;
    readonly id: string;
    readonly score?: number;
    readonly datePosted: Date;
    readonly isEdited: boolean;
    readonly parentId: string | null;
    readonly fullname: string;
    bodyHtml: string;
    readonly isDeleted: boolean;
}

export enum RedditCommentType {
    Desktop,
    Api,
    Adaptive
}

export interface RedditCommentTypeId {
    typeId: RedditCommentType;
}

export type RedditCommentAdapter = RedditComment & RedditCommentTypeId;