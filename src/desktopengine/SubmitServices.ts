import {Url} from "../helpers/Url";
import {LinkCommentApi} from "../RedditApi";
export class SubmitServices {
    private urlElement:HTMLInputElement;
    get url() {
        if(this.urlElement == null) {
            throw new TypeError("url is null");
        }
        return this.urlElement.value;
    }
    private titleTextElement: HTMLTextAreaElement;
    get titleText() {
        return this.titleTextElement.value;
    }
    private fileUploadElement: HTMLInputElement | null;
    get file(): File | null {
        if(this.fileUploadElement == null) {
            return null;
        }
        return this.fileUploadElement.files == null ? null : this.fileUploadElement.files[0];
    }
    private selftextElement: HTMLTextAreaElement | null;
    get selftext() {
        if(this.selftextElement == null) {
            throw TypeError("Selftext is null")
        }
        return this.selftextElement.value;
    }
    get isSelfText() {
        let selftextQuery = this.pageurl.query("selftext") === "true";
        let hasLinkDesc = this.linkDescriptionDiv != null;
        let hasTextDesc = this.textDescriptionDiv != null;
        if (!hasLinkDesc) {
            return true;
        }
        else if (!hasTextDesc) {
            return false;
        }
        else {
            return selftextQuery;
        }
    }
    set isSelfText(value: boolean) {
        if(value) {
            window.history.replaceState("", "", Url.Current.path + "?selftext=true" )
        } else {
            window.history.replaceState("", "", Url.Current.path )
        }
    }
    private subredditText: HTMLInputElement;
    get subreddit() {
        return this.subredditText.value;
    }
    private sendRepliesToInboxEl: HTMLInputElement;
    public sendRepliesToInbox() {
        return this.sendRepliesToInboxEl.checked;
    }
    static current: SubmitServices;
    constructor() {
        this.pageurl = Url.Current;
        SubmitServices.current = this;
    }
    public initSubmitPage() {
        this.getAndHookPageNodes();
    }
    private getAndHookPageNodes() {
        this.linkButton = document.getElementsByClassName("link-button").length == 0 ? null : <HTMLAnchorElement>document.getElementsByClassName("link-button")[0];
        this.textButton = document.getElementsByClassName("text-button").length == 0 ? null : <HTMLAnchorElement>document.getElementsByClassName("text-button")[0];
        this.linkDescriptionDiv =  <HTMLDivElement>document.getElementById("link-desc");
        this.textDescriptionDiv =  <HTMLDivElement>document.getElementById("text-desc");
        this.urlSubmitDiv =  <HTMLDivElement>document.getElementById("url-field");
        this.titleDiv =  <HTMLDivElement>document.getElementById("title-field");
        this.textDiv =  <HTMLDivElement>document.getElementById("text-field");
        this.imageUploadDiv =  <HTMLDivElement>document.getElementById("image-field");
        this.urlElement =  <HTMLInputElement>document.getElementById("url");
        this.fileUploadElement =  <HTMLInputElement>document.getElementById("image");
        this.urlElement =  <HTMLInputElement>document.getElementById("url");
        this.selftextElement =  document.getElementsByName("text") == null ? null : <HTMLTextAreaElement>document.getElementsByName("text")[0];
        this.titleTextElement =  <HTMLTextAreaElement>document.getElementsByName("title")[0];
        this.subredditText =  <HTMLInputElement>document.getElementsByName("sr")[0];
        this.submitButton = <HTMLButtonElement>document.getElementsByName("submit")[0];
        this.form = <HTMLFormElement>document.getElementById("newlink");
        if(this.linkButton != null) {
            this.linkButton.onclick = () => {
                this.toggleSelfText(false);
            }
        }
        if(this.textButton != null) {
            this.textButton.onclick = () => {
                this.toggleSelfText(true);
            }
        }
        this.form.noValidate = true;
        this.form.onsubmit = () => {
            LinkCommentApi.submitPost(this.isSelfText ? "self" : "link", this.titleText,
                this.isSelfText && this.selftext != null ? this.selftext : this.url, this.subreddit)
                    .then((response: any) => {
                        console.log(response);
                        window.location.href = response.json.data.url;
                    });
            return false;
        }
        this.toggleSelfText(this.isSelfText);
    }
    private toggleSelfText(isSelfText: boolean) {
        var buttons = <HTMLElement | undefined>document.getElementsByClassName("tabmenu formtab")[0];
        if(buttons != undefined) {
            if(isSelfText) {
                buttons.children[0].classList.remove("selected");
                buttons.children[1].classList.add("selected");
            } else {
                buttons.children[1].classList.remove("selected");
                buttons.children[0].classList.add("selected");
            }
        }
        this.isSelfText = isSelfText;
        const linkDisplay = isSelfText ? "none" : "block";
        const selfDisplay = isSelfText ? "block" : "none";
        if(this.imageUploadDiv != null) {
            this.imageUploadDiv.style.display = "none"; //no api for this?
        }
        if(this.linkDescriptionDiv != null)
            this.linkDescriptionDiv.style.display = linkDisplay
        if(this.urlSubmitDiv != null)
            this.urlSubmitDiv.style.display = linkDisplay;
        if(this.textDescriptionDiv != null)
            this.textDescriptionDiv.style.display = selfDisplay
        if(this.textDiv != null)
            this.textDiv.style.display = selfDisplay;
    }
    private form: HTMLFormElement;
    private pageurl: Url;
    private linkButton: HTMLAnchorElement | null;
    private textButton: HTMLAnchorElement | null;
    private linkDescriptionDiv: HTMLElement | null;
    private textDescriptionDiv: HTMLElement | null;
    private urlSubmitDiv: HTMLElement | null;
    private imageUploadDiv: HTMLElement | null;
    private titleDiv: HTMLDivElement;
    private textDiv: HTMLDivElement | null;
    private submitButton: HTMLButtonElement;
}