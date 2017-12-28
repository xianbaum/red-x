import { Dictionary } from "../helpers/Dictionary";
import { RedditElements } from "./RedditElements";
import { DesktopRedditComment } from "../interfaces/DesktopRedditComment";

export class DesktopUserPageServices {
    static processUserPage() {
        DesktopUserPageServices.comments = RedditElements.generateCommentList();
    }
    static comments: Dictionary<DesktopRedditComment>;
}