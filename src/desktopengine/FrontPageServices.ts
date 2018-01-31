import { RedditElements } from "./RedditElements";
import { RedditThread } from "../interfaces/RedditThread";
import { Dictionary } from "../helpers/Dictionary";
import { DesktopRedditThreadFromElement } from "./DesktopRedditThreadFromElement";

export class FrontPageServices {
    static init(){
        this.threads = 
            RedditElements.generateListOf<DesktopRedditThreadFromElement>("comment",
                DesktopRedditThreadFromElement);
        this.hookSidebar();
        RedditElements.hookSearch();
    }
    static threads: Dictionary<RedditThread>;
    static hookSidebar() {
        let grippy = <HTMLDivElement>document.getElementsByClassName("grippy")[0];
        grippy.onclick = () => {
            if(document.body.classList.contains("listing-chooser-collapsed")) {
                document.body.classList.remove("listing-chooser-collapsed");
            } else {
                document.body.classList.add("listing-chooser-collapsed");
            }
        }
    }
}