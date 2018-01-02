import { Url } from "../helpers/Url";
import { DesktopThreadServices } from "./DesktopThreadServices";
import { DesktopUserPageServices } from "./DesktopUserPageServices";
import { DesktopMessagesServices } from "./DesktopMessagesServices";
import {SubmitServices } from "./SubmitServices";
import {SubredditServices} from "./SubredditServices";
import {LoginServices} from "./LoginServices";

export enum PageType {
    Front,
    Subreddit,
    Thread,
    Submit,
    Search,
    Gilded,
    User,
    Messages
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
            if(DesktopEngine.isLoggedIn) {
                DesktopThreadServices.processRedditThread();
            }
        } else if(this.pageIsUser) {
            this.pageType = PageType.User;
            if(DesktopEngine.isLoggedIn) {
                DesktopUserPageServices.processUserPage();
            }
        } else if(this.pageIsMessages) {
            this.pageType = PageType.Messages;
            if(DesktopEngine.isLoggedIn) {
                DesktopMessagesServices.processMessagesPage();
            }
        } else if(this.pageIsFrontPage || this.pageIsSubreddit) {
            if(DesktopEngine.isLoggedIn) {
                SubredditServices.init();
            }
        } else if(this.pageIsSubmit) {
            if(DesktopEngine.isLoggedIn) {
                new SubmitServices().initSubmitPage();
            }
        } else if(this.pageIsLogin) {
            LoginServices.addRecaptcha();
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
            return !this.pageIsSearch &&
            this.url.path.indexOf("submit") != -1
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
    private get pageIsUser() {
        return !this.pageIsSubreddit && this.url.path.indexOf("/user/") > -1;
    }
    private get pageIsMessages() {
        return !this.pageIsSubreddit && this.url.path.indexOf("/message/") > -1;
    }
    private get pageIsLogin() {
        return  this.url.path == "/login" || this.url.path == "/post/reg";
    }
    public static get isLoggedIn() {
        try {
            return (<HTMLElement>document.getElementsByClassName("user")[0]).innerText != "Want to join? Log in or sign up in seconds.";
        } catch { 
            return false;
        }
    }
    public static get username() {
        try {
            return (<HTMLElement>document.getElementsByClassName("user")[0]).innerText.substr(0,(<HTMLElement>document.getElementsByClassName("user")[0]).innerText.indexOf("(") - 1);
        } catch {
            return undefined;
        }
    }
    public static hookLogoutButton() {
        let logoutButton = (<HTMLFormElement> document.getElementsByClassName("logout")[0]);
        logoutButton.onclick = () => {
            logoutButton.submit();
        }
    }
}