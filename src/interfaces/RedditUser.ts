import {RedditComment} from "./RedditComment"

export interface RedditUser {
    readonly comments: RedditComment[];
    readonly username: string;
    readonly isOp?: boolean;
}