import { DesktopThreadRedditComment } from "../desktopengine/DesktopThreadRedditComment";
import { RedditComment, RedditCommentTypeId, RedditCommentType, RedditCommentAdapter } from "../interfaces/RedditComment";
import { ApiRedditComment } from "../apiengine/ApiRedditComment";

export class AdaptiveRedditComment {
    id: string;
    readonly typeId: RedditCommentType = RedditCommentType.Adaptive;
    body: string;
    posterName: string;
    score?: number | undefined;
    datePosted: Date;
    isEdited: boolean;
    private isDesktopComment(adapter: RedditCommentAdapter): adapter is DesktopThreadRedditComment {
        return adapter.typeId === RedditCommentType.Desktop
    }
    private isApiComment(adapter: RedditCommentAdapter): adapter is ApiRedditComment {
        return adapter.typeId === RedditCommentType.Api;
    }
    private adapters:  RedditCommentAdapter[]
    constructor(adapters: RedditCommentAdapter[]) {
        
    }
}