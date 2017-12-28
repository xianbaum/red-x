import { RedditComment } from "./RedditComment";

export interface DesktopRedditComment extends RedditComment{
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