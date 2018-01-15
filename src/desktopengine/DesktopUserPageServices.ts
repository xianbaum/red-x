import { Dictionary } from "../helpers/Dictionary";
import { RedditElements } from "./RedditElements";
import { DesktopRedditComment } from "../interfaces/DesktopRedditComment";
import { Url } from "../helpers/Url";
import { DesktopRedditCommentFromElement } from "./DesktopRedditCommentFromElement";

export class DesktopUserPageServices {
    static processUserPage() {
        if(DesktopUserPageServices.isNewUserPage) {
            window.location.href = "/user/" + DesktopUserPageServices.username + "/overview/";
        }
        if(!DesktopUserPageServices.isNewUserPage) {
            DesktopUserPageServices.comments = 
                RedditElements.generateListOf<DesktopRedditCommentFromElement>("comment",
                    DesktopRedditCommentFromElement);
        } else {

        }
    }
    static comments: Dictionary<DesktopRedditComment>;
    static get isNewUserPage() {
        return document.getElementsByClassName("ProfileTemplate")[0] != null;
    }
    static hookElements() {
        let modalClose = document.getElementsByClassName("icon-close")[0];
        if(modalClose != null) {
            modalClose.addEventListener("click", () => {
                modalClose!.parentElement!.parentElement!.parentElement!
                    .removeChild(modalClose!.parentElement!.parentElement!);
            });
        }
    }
    static get username() {
        let start = Url.Current.path.indexOf("/user/")+6;
        let end = Url.Current.path.indexOf("/", start);
        if(end == -1) {
            return Url.Current.path.substring(start);
        }
        return Url.Current.path.substring(start, end);
    }
}