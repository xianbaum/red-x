export interface RedditComment {
    // toggle(): void;
    // reply(): void;
    readonly body: string;
    readonly posterName: string;
    readonly id: string;
    readonly score?: number;
    readonly datePosted: Date;
    readonly edited: boolean;
    // readonly isHidden: boolean;
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