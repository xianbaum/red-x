import { RedditComment } from "./RedditComment";
import { Votable } from "./Votable";
import { Usertext } from "./Usertext";

export interface DesktopRedditComment extends RedditComment, Votable, Usertext{
    body: string;
    readonly author: string;
    readonly id: string;
    readonly score?: number;
    readonly datePosted: Date;
    readonly isEdited: boolean;
    readonly parentId: string | null;
    readonly fullname: string;
    bodyHtml: string;
    toggle(): void;
    toggleReplyForm(): void;
    vote(dir: -1 | 0 | 1): void;
    element: HTMLDivElement;
}