import { MoreModel } from "../redditapimodels/More";
import { RedditMore } from "../interfaces/RedditMore";
import { DesktopRedditMore } from "../interfaces/DesktopRedditMore";
import { RedditElements } from "../desktopengine/RedditElements";

export class ApiRedditMore implements RedditMore {
    get children() {
        return this.adapter.children;
    }
    get id() {
        return this.adapter.id;
    }
    get fullname() {
        return "t1_"+this.adapter.id; //ok?
    }
    get parentId() {
        return this.adapter.parent_id;
    }
    get count() {
        return this.adapter.count;
    }
    toDesktopRedditMore() {
        return new ApiDesktopRedditMore(this.adapter);
    }
    constructor(private adapter: MoreModel){}
}

class ApiDesktopRedditMore implements DesktopRedditMore {
    get children() {
        return this.adapter.children;
    }
    get id() {
        return this.adapter.id;
    }
    get fullname() {
        return "t1_"+this.adapter.id; //ok?
    }
    get parentId() {
        return this.adapter.parent_id;
    }
    get count() {
        return this.adapter.count;
    }
    public element: HTMLDivElement
    constructor(private adapter: MoreModel){
        this.element = RedditElements.generateMoreElement(this)
        RedditElements.hookMore(this.element, this.children);
    }
}