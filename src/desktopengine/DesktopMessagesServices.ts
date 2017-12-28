import { Dictionary } from "../helpers/Dictionary";
import { RedditElements } from "./RedditElements";
import { DesktopRedditComment } from "../interfaces/DesktopRedditComment";

export class DesktopMessagesServices {
    static processMessagesPage() {
        DesktopMessagesServices.comments = RedditElements.generateCommentList(true);
    }
    static comments: Dictionary<DesktopRedditComment>;
}