import { Dictionary } from "../helpers/Dictionary";
import { RedditElements } from "./RedditElements";
import { DesktopRedditComment } from "../interfaces/DesktopRedditComment";
import { DesktopRedditCommentFromElement } from "./DesktopRedditCommentFromElement";
import { DesktopMessageFromElement } from "./DesktopMessageFromElement";
import { RedditMessage } from "../interfaces/RedditMessage";

export class DesktopMessagesServices {
    static processMessagesPage() {
        DesktopMessagesServices.comments =
            RedditElements.generateListOf<DesktopRedditCommentFromElement>("was-comment",
                DesktopRedditCommentFromElement);
        DesktopMessagesServices.messages = 
            RedditElements.generateListOf<DesktopMessageFromElement>("comment",
                DesktopMessageFromElement);
    }
    static comments: Dictionary<DesktopRedditComment>;
    static messages: Dictionary<RedditMessage>;
    
}