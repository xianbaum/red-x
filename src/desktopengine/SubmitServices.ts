import {Url} from "../helpers/Url";
import {LinkCommentApi} from "../RedditApi";
export class SubmitServices {
    private urlElement:HTMLInputElement;
    get url() {
        return this.urlElement.value;
    }
    private titleTextElement: HTMLTextAreaElement;
    get titleText() {
        return this.titleTextElement.value;
    }
    private fileUploadElement: HTMLInputElement;
    get file(): File | null {
        return this.fileUploadElement.files == null ? null : this.fileUploadElement.files[0];
    }
    private selftextElement: HTMLTextAreaElement;
    get selftext() {
        return this.selftextElement.value;
    }
    private _isSelfText?: boolean;
    get isSelfText() {
        if(this._isSelfText !== undefined) {
            return this._isSelfText;
        }
        return this.pageurl.query("selftext") === "true";
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
        this.linkButton = <HTMLAnchorElement>document.getElementsByClassName("link-button")[0];
        this.textButton = <HTMLAnchorElement>document.getElementsByClassName("text-button")[0];
        this.linkDescriptionDiv =  <HTMLDivElement>document.getElementById("link-desc");
        this.textDescriptionDiv =  <HTMLDivElement>document.getElementById("text-desc");
        this.urlSubmitDiv =  <HTMLDivElement>document.getElementById("url-field");
        this.titleDiv =  <HTMLDivElement>document.getElementById("title-field");
        this.textDiv =  <HTMLDivElement>document.getElementById("text-field");
        this.imageUploadDiv =  <HTMLDivElement>document.getElementById("image-field");
        this.urlElement =  <HTMLInputElement>document.getElementById("url");
        this.fileUploadElement =  <HTMLInputElement>document.getElementById("image");
        this.urlElement =  <HTMLInputElement>document.getElementById("url");
        this.selftextElement =  <HTMLTextAreaElement>document.getElementsByName("text")[0];
        this.titleTextElement =  <HTMLTextAreaElement>document.getElementsByName("title")[0];
        this.subredditText =  <HTMLInputElement>document.getElementsByName("sr")[0];
        this.submitButton = <HTMLButtonElement>document.getElementsByName("submit")[0];
        this.form = <HTMLFormElement>document.getElementById("newlink");
        this.linkButton.onclick = () => {
            this.toggleSelfText(false);
        }
        this.textButton.onclick = () => {
            this.toggleSelfText(true);
        }
        this.form.noValidate = true;
        this.form.onsubmit = () => {
            LinkCommentApi.submitPost(this.isSelfText ? "self" : "link", this.titleText,
                this.isSelfText ? this.selftext : this.url, this.subreddit)
                    .then((response: any) => {
                        console.log(response);
                        window.location.href = response.json.data.url;
                    });
            return false;
        }
        this.toggleSelfText(this.isSelfText);
    }
    private toggleSelfText(isSelfText: boolean) {
        var buttons= document.getElementsByClassName("tabmenu formtab")[0];
        if(isSelfText) {
            buttons.children[0].classList.remove("selected");
            buttons.children[1].classList.add("selected");
        } else {
            buttons.children[1].classList.remove("selected");
            buttons.children[0].classList.add("selected");
        }
        this._isSelfText = isSelfText;
        const linkDisplay = isSelfText ? "none" : "block";
        const selfDisplay = isSelfText ? "block" : "none";
        this.imageUploadDiv.style.display = "none"; //no api for this?
        this.linkDescriptionDiv.style.display = 
            this.urlSubmitDiv.style.display = 
                // this.imageUploadDiv.style.display = 
                    linkDisplay;
        this.textDescriptionDiv.style.display = 
            // this.titleDiv.style.display = 
                this.textDiv.style.display = selfDisplay;
    }
    private form: HTMLFormElement;
    private pageurl: Url;
    private linkButton: HTMLAnchorElement;
    private textButton: HTMLAnchorElement;
    private linkDescriptionDiv: HTMLElement;
    private textDescriptionDiv: HTMLElement;
    private urlSubmitDiv: HTMLElement;
    private imageUploadDiv: HTMLElement;
    private titleDiv: HTMLDivElement;
    private textDiv: HTMLDivElement;
    private submitButton: HTMLButtonElement;
}