import { Url } from "../helpers/Url";
import { DesktopThreadServices } from "./DesktopThreadServices";

export enum PageType {
    Front,
    Subreddit,
    Thread,
    Submit,
    Search,
    Gilded
}

export class DesktopEngine  {
    private url: Url;
    public pageType: PageType;
    private threadServices: DesktopThreadServices;
    constructor() {
        this.url = new Url(window.location.href);
        if(this.pageIsThread) {
            this.pageType = PageType.Thread;
            this.threadServices = new DesktopThreadServices();
            DesktopThreadServices.processRedditThread();
        }
    }
    private get subredditName() {
        if(this.url.path.indexOf("/r/") == -1) {
            return undefined;
        }
        return this.url.path.substr(this.url.path.indexOf("/r/")+3, (this.url.path.indexOf("/", 
            this.url.path.indexOf("/r/")+3) > -1 ? this.url.path.indexOf("/", 
            this.url.path.indexOf("/r/")+3)-3 : this.url.path.length));
    }
    private get pageIsThread() {
        return this.subredditName !== "comments" &&
            this.url.path.indexOf("/comments/") > -1;
    }
    private get pageIsFrontPage() {
        return this.url.path == "/" || this.url.path == "";
    }
    private get pageIsSubreddit() {
        return this.subredditName !== undefined &&
            !this.pageIsSearch && !this.pageIsSubmit && 
            !this.pageIsGilded && !this.pageIsWiki &&
            !this.pageIsThread; 
    }
    private get pageIsSubmit() {
        if(this.subredditName === undefined) {
            return false;
        }
        return !this.pageIsThread &&
            this.url.path.indexOf("submit",
            this.url.path.indexOf(this.subredditName)+1) != -1
    }
    private get pageIsSearch() {
        if(this.subredditName === undefined) {
            return false;
        }
        return !this.pageIsThread &&           
            this.url.path.indexOf("search",
            this.url.path.indexOf(this.subredditName)+1) != -1
    }
    private get pageIsGilded() {
        if(this.subredditName === undefined) {
            return false;
        }
        return !this.pageIsThread &&        
            this.url.path.indexOf("search",
            this.url.path.indexOf(this.subredditName)+1) != -1
    }
    private get pageIsWiki() {
        if(this.subredditName === undefined) {
            return false;
        }
        return !this.pageIsThread &&
            this.url.path.indexOf("wiki",
            this.url.path.indexOf(this.subredditName)+1) != -1
    }
}