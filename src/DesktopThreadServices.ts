import { DesktopThreadRedditComment }  from "./DesktopThreadRedditComment";

class DesktopThreadServices {
    static processRedditThread() {
        DesktopThreadServices.populateCommentsList();
    }
    private static populateCommentsList() {
        let elements: NodeListOf<Element> = document.querySelectorAll("[data-type=comment]");
        
    }
    static comments: RedditComment[];
}