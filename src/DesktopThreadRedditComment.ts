import {RedditComment} from "./RedditComment"

export class DesktopThreadRedditComment implements RedditComment {
    private element: HTMLElement;
    private readonly authorAttribute = "data-author"; 
    toggle (){
        this.element.style.display = "none";
    }
    private get authorNode(): HTMLElement {
        return <HTMLElement>this.element.getElementsByClassName("author")[0];
    } 
    get posterName() {
        return this.element.getAttribute("data-author");
    }
    get id() {
        return 1;
    }
    // get user() {
        
    // }
}