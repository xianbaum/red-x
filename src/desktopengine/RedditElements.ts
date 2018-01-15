import { LinkCommentApi, RedditApi } from "../RedditApi";
import { DesktopRedditComment } from "../interfaces/DesktopRedditComment";
import { RedditComment } from "../interfaces/RedditComment";
import { DesktopThreadServices } from "./DesktopThreadServices";
import { ApiRedditComment } from "../apiengine/ApiRedditComment";
import { CommentModel } from "../redditapimodels/Comment";
import { DesktopRedditCommentFromElement } from "./DesktopRedditCommentFromElement";
import { Dictionary } from "../helpers/Dictionary";
import {DesktopRedditThreadFromElement} from "./DesktopRedditThreadFromElement";
import { Votable } from "../interfaces/Votable";
import {RedditThread} from "../interfaces/RedditThread";
import { SubredditServices } from "./SubredditServices";
import { DesktopEngine } from "./DesktopEngine";
import { Thingable } from "../interfaces/Thingable";
import { Usertext } from "../interfaces/Usertext";
import { DesktopMessageFromElement } from "./DesktopMessageFromElement";
import { RedditMessage } from "../interfaces/RedditMessage";

export namespace RedditElements {
    export interface HookedCommentElements {
        upvote: HTMLElement;
        downvote: HTMLElement;
        reply: HTMLElement | null;
        collapse: HTMLElement;
        deleteToggle: HTMLAnchorElement | null;
        deleteYes: HTMLAnchorElement | null;
        deleteNo: HTMLAnchorElement | null;
        editToggle: HTMLAnchorElement | null;
        editForm: HTMLFormElement | null;
        editCancel: HTMLButtonElement | null;
    }

/*
Adapted to look similarly to this from reddit:
<form action="#" class="usertext cloneable warn-on-unload">
	<div class="usertext-edit md-container" style="width: 500px;">
		<div class="md">
			<textarea rows="1" cols="1" name="text" class="" data-event-action="comment" data-type="link" style="width: 500px; height: 100px;"></textarea>
		</div>
		<div class="bottom-area">
			<div class="usertext-buttons">
				<button type="submit" class="save">save</button>
				<button type="button" class="cancel" style="">cancel</button>
			</div>
		</div>
	</div>
</form>
*/
    export function generateCommentForm(parentId: string) {
        let formAndTextarea = generateGenericForm()
        let form = formAndTextarea.form;
        let textarea = formAndTextarea.textarea;
        form.onsubmit = () =>{
            LinkCommentApi.postComment(parentId, textarea.value).then((commentJson) => {
                for(var comment of commentJson.json.data.things) {
                    DesktopThreadServices.addComment(new ApiRedditComment(comment.data).toDesktopRedditComment());
                }
                if(form.parentNode != null){
                    form.parentNode.removeChild(form);
                }
            });
            return false;
        };
        return form;
    }
    export function generateGenericForm() {
        let form = document.createElement("form");
        form.classList.add("usertext")
        form.action = "";
        let container = document.createElement("div");
        container.classList.add("usertext-edit", "md-container");
        container.style.width = "500px";
        let top  = document.createElement("div");
        top.classList.add("md");
        let textarea = document.createElement("textarea");
        textarea.rows = 1;
        textarea.cols = 1;
        textarea.name = "text";
        textarea.style.width = "500px";
        textarea.style.height = "100px";
        let bottom = document.createElement("div");
        bottom.classList.add("bottom-area");
        let bottomButtons = document.createElement("div");
        bottomButtons.classList.add("usertext-buttons");
        let submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.classList.add("submit");
        submitButton.innerText="save";
        let cancelButton = document.createElement("button");
        cancelButton.type = "button";
        cancelButton.classList.add("cancel");
        cancelButton.innerText="cancel";
        cancelButton.onclick = () => {
            if(form.parentNode != null){
                form.parentNode.removeChild(form);
            }
        };
        bottomButtons.appendChild(submitButton);
        bottomButtons.appendChild(cancelButton);
        bottom.appendChild(bottomButtons);
        top.appendChild(textarea);
        container.appendChild(top);
        container.appendChild(bottom);
        form.appendChild(container);
        return { form, textarea};
    }
/*
adapted to be identical to a reddit comment
*/
    export function generateCommentElement(comment: RedditComment): HTMLDivElement {
        // var siteTable = document.createElement("div");
        // siteTable.id = "siteTable_"+ comment.fullname;
        // siteTable.classList.add("sitetable", "listing");
        var comEl = document.createElement("div");
        comEl.id = "thing_"+comment.fullname;
        comEl.classList.add("thing", "id-"+comment.fullname, "noncollapsed", "comment")
        comEl.setAttribute("data-fullname", comment.fullname);
        comEl.setAttribute("data-type", "comment");
        //        comEl.setAttribute("data-subreddit", )
        //        comEl.setAttribute("data-subreddit-prefixed")
        //        data-subreddit-fullname
        comEl.setAttribute("data-author", comment.author);
        //data-replies
        //data-permalink
        // siteTable.appendChild(comEl);
        var parentP = document.createElement("p");
        parentP.classList.add("parent");
        var parentPA = document.createElement("a");
        parentPA.name = comment.id;
        parentP.appendChild(parentPA);
        comEl.appendChild(parentP);
        var votes = document.createElement("div");
        votes.classList.add("midcol", "unvoted");
        var upvote = document.createElement("div");
        upvote.classList.add("arrow", "up", "login-required", "access-required");
        upvote.setAttribute("data-event-action", "upvote");
        upvote.setAttribute("role", "button");
        upvote.setAttribute("aria-label", "upvote");
        upvote.tabIndex = 0;
        //TODO: is upvoted?
        var downvote = document.createElement("div");
        downvote.classList.add("arrow", "down", "login-required", "access-required");
        downvote.setAttribute("data-event-action", "downvote");
        downvote.setAttribute("role", "button");
        downvote.setAttribute("aria-label", "downvote");
        //TODO: Is downvotes?
        downvote.tabIndex = 0;
        votes.appendChild(upvote);
        votes.appendChild(downvote);
        comEl.appendChild(votes);
        var entry = document.createElement("div");
        entry.classList.add("entry", "unvoted");
        var tagline = document.createElement("p");
        tagline.classList.add("tagline");
        var toggle = document.createElement("a");
        toggle.classList.add("expand");
        toggle.href = "javascript:void(0)";
        //        toggle.onclick = "no!";
        toggle.innerText="[–]";
        var user = document.createElement("a");
        //Todo: User id to classlist
        user.classList.add("author", "may-blank");
        user.href="https://www.reddit.com/user/"+comment.author;
        user.innerText =  comment.author;
        var userAttrs = document.createElement("span");
        userAttrs.classList.add("userattrs");
        var dislikes = document.createElement("span");
        dislikes.classList.add("score",  "dislikes");
        var unvoted = document.createElement("span");
        unvoted.classList.add("score", "unvoted");
        var likes = document.createElement("span");
        likes.classList.add("score", "likes");
        if(comment.score === undefined)  {
            dislikes.title = 
            dislikes.innerText = 
            unvoted.title = 
            unvoted.innerText =
            likes.title = 
            likes.innerText = "[score hidden]";
        } else {
            dislikes.title = ""+(comment.score-1);
            dislikes.innerText = ""+(comment.score-1)+" points";
            unvoted.title = ""+comment.score;
            unvoted.innerText = ""+comment.score+" points";
            likes.title = ""+(comment.score+1);
            likes.innerText = ""+(comment.score+1)+" points";
        }
        var space = document.createTextNode(" ");
        var time = document.createElement("time");
        time.title = comment.datePosted.toLocaleString();
        time.classList.add("live-timestamp");
        time.innerText = comment.datePosted.toLocaleString();
        var numchildren = document.createElement("a");
        numchildren.classList.add("numchildren");
        numchildren.href="javascript:void(0)";
        //TODO: show number of children
        numchildren.innerText="(X children)";
        tagline.appendChild(toggle);
        tagline.appendChild(user);
        tagline.appendChild(userAttrs);
        tagline.appendChild(dislikes);
        tagline.appendChild(unvoted);
        tagline.appendChild(likes);
        tagline.appendChild(space);
        tagline.appendChild(time);
        tagline.appendChild(numchildren);
        entry.appendChild(tagline);
        var form = document.createElement("form");
        form.id = "form-"+comment.fullname;
        form.classList.add("usertext", "warn-on-unload");
        form.action="#";
        var body = document.createElement("div");
        body.classList.add("usertext-body", "may-blank-within", "md-container");
        body.innerHTML = comment.bodyHtml;
        //TODO: only if it u
        var editDiv = document.createElement("div");
        editDiv.classList.add("usertext-edit", "md-container");
        editDiv.style.display = "none";
        var editMd = document.createElement("div");
        editMd.classList.add("md");
        var editTextArea = document.createElement("textarea");
        editTextArea.rows = 1;
        editTextArea.cols = 1;
        editTextArea.innerText = comment.body;
        editMd.appendChild(editTextArea);
        var editBottom = document.createElement("div");
        editBottom.classList.add("bottom-area");
        var editBottomButtons = document.createElement("div");
        editBottomButtons.classList.add("usertext-buttons");
        var editSave = document.createElement("button");
        editSave.classList.add("save");
        editSave.type = "submit";
        editSave.style.display = "none";
        editSave.innerHTML = "save";
        var editCancel = document.createElement("button");
        editSave.classList.add("cancel");
        editSave.style.display = "none";
        editSave.innerHTML = "save";
        editBottomButtons.appendChild(editSave);
        editBottomButtons.appendChild(editCancel);
        editBottom.appendChild(editBottomButtons);
        editDiv.appendChild(editMd);
        editDiv.appendChild(editBottom);
        form.appendChild(body);
        entry.appendChild(form);
        var buttons = document.createElement("ul");
        buttons.classList.add("flat-list", "buttons");
        // var permalink = document.createElement("li");
        // permalink.classList.add("first");
        // var permalinkA = document.createElement("a");
        // permalinkA.classList.add("bylink")
        // permalinkA.href="#" //TODO: href
        // permalinkA.setAttribute("data-event-action", "permalink");
        // permalink.setAttribute("rel","nofollow");
        //data-href-url
        // //data-inbound-url
        // var embed = document.createElement("li");
        var parent = document.createElement("li");
        parent.classList.add("first");
        var parentA = document.createElement("a");
        parentA.classList.add("bylink");
        parentA.href="#"+comment.parentId;
        parentA.setAttribute("data-event-action", "parent");
        parentA.setAttribute("rel", "nofollow");
        parentA.innerText="parent";
        parent.appendChild(parentA);
        var reply = document.createElement("li");
        reply.classList.add("reply-button", "login-required");
        var replyA = document.createElement("a");
        replyA.classList.add("access-required");
        replyA.href = "javascript:void(0)";
        replyA.setAttribute("data-event-action", "comment");
        replyA.innerText = "reply";
        reply.appendChild(replyA);
        buttons.appendChild(parent);
        if (DesktopEngine.username == comment.author) {
            var edit = document.createElement("li");
            var editA = document.createElement("a");
            editA.classList.add("edit-usertext");
            editA.href = "javascript:void(0)";
            editA.innerText = "edit";
            edit.appendChild(editA);
            var deleteEl = document.createElement("li");
            var deleteElForm = document.createElement("form");
            deleteElForm.classList.add("toggle", "del-button");
            // var deleteElFormA = document.createElement("a");
            // deleteElFormA.classList.add("toglgebutton");
            // deleteElFormA.href="#";
            // deleteElFormA.setAttribute("data-event-action", "delete");
            // deleteElFormA.innerText = "delete";
            // var deleteSpan = document.createElement("span");
            // deleteSpan.classList.add("option", "error");
            // var deleteSpanYes = document.createElement("yes")
            //lol
            deleteElForm.innerHTML = '<span class="option main active"><a href="#" class="togglebutton " data-event-action="delete">delete</a></span><span class="option error">are you sure?  <a href="javascript:void(0)" class="yes">yes</a> / <a href="javascript:void(0)" class="no">no</a></span>'
            deleteEl.appendChild(deleteElForm);
            buttons.appendChild(edit);
            buttons.appendChild(deleteEl);
        }
        buttons.appendChild(reply);
        entry.appendChild(buttons);
        var child = document.createElement("div");
        child.classList.add("child");
        var clearLeft = document.createElement("div");
        clearLeft.classList.add("clearleft");
        comEl.appendChild(entry);
        comEl.appendChild(child);
        comEl.appendChild(clearLeft);
        return comEl;
    }
    export function toggle(element: HTMLDivElement) {
        if(element.classList.contains("collapsed")) {
            element.classList.remove("collapsed");
            element.classList.add("noncollapsed");
        } else {
            element.classList.add("collapsed");
            element.classList.remove("noncollapsed");
        }
    }
    export function toggleNew(element: HTMLDivElement) {
        if(element.classList.contains("m-collapsed")) {
            element.classList.remove("m-collapsed");
        } else {
            element.classList.add("m-collapsed");
        }
    }
    export function toggleCommentReplyForm(element: HTMLDivElement, fullname: string) {
        var child = element.getElementsByClassName("child")[0];
        var childsChild : Element | undefined = child.children[0];
        if(childsChild !== undefined && childsChild.tagName.toUpperCase() === "FORM") {
            /*remove*/
            child.removeChild(childsChild);
        } else {
            /*add*/
            let formToAdd = RedditElements.generateCommentForm(fullname);
            if(childsChild === undefined) {
                child.appendChild(formToAdd);
            } else { /* first tagname is not form */
                child.insertBefore(formToAdd, childsChild);
            }
        }
    }
    export function toggleMessageReplyForm(element: HTMLDivElement, fullname: string) {
        var child = element.getElementsByClassName("child")[0];
        var childsChild : Element | undefined = child.children[0];
        if(childsChild !== undefined && childsChild.tagName.toUpperCase() === "FORM") {
            /*remove*/
            child.removeChild(childsChild);
        } else {
            /*add*/
            let formToAdd = RedditElements.generateCommentForm(fullname);
            if(childsChild === undefined) {
                child.appendChild(formToAdd);
            } else { /* first tagname is not form */
                child.insertBefore(formToAdd, childsChild);
            }
        }
    }
    export function hookDesktopCommentElements(commentElement: HTMLDivElement, comment: DesktopRedditComment) {
        let entryElement = commentElement.getElementsByClassName("entry")[0];
        let replyButton: Element | null = entryElement.getElementsByClassName("reply-button")[0];
        if(replyButton == null) {
            replyButton = entryElement.querySelector("[data-event-action=reply]");
        }
        let hookedElements = {
            reply: <HTMLAnchorElement>replyButton,
            collapse:<HTMLAnchorElement> entryElement.getElementsByClassName("expand")[0],
        };
        hookedElements.collapse.addEventListener("click", () => {
            comment.toggle();
        });
        if(comment.isDeleted || !DesktopEngine.isLoggedIn) {
            return;
        }
        hookVoterElement(commentElement, comment);
        hookDeleteButton(commentElement, comment);
        hookEditButton(commentElement, comment);
        if(hookedElements.reply != null) {
            hookedElements.reply.addEventListener("click", () =>{
                comment.toggleReplyForm();
            });
        }
    }
    export function hookMessageElements(messageElement: HTMLDivElement, message: RedditMessage) {
        hookDeleteButton(messageElement, message);
    }
    export function hookRedditThreadElements(threadElement: HTMLDivElement, thread: RedditThread) {
        hookVoterElement(threadElement, thread);
        hookDeleteButton(threadElement, thread);
        hookEditButton(threadElement, thread);
    }
    export function hookDeleteButton(element: HTMLDivElement, comment: Thingable) {
        let deleteButton = element.getElementsByClassName("del-button")[0];
        let deleteToggleButton =deleteButton != null ? <HTMLAnchorElement>deleteButton.getElementsByClassName("togglebutton")[0] : null;
        let deleteYes = deleteButton != null ? <HTMLAnchorElement>deleteButton.getElementsByClassName("yes")[0] : null;
        let deleteNo = deleteButton != null ? <HTMLAnchorElement>deleteButton.getElementsByClassName("no")[0] : null;
        if(deleteToggleButton != null && deleteYes != null && deleteNo != null) {
            deleteToggleButton.href = "javascript:void(0)";
            deleteToggleButton.addEventListener("click", () => {
                RedditElements.toggleDeleteElements(element, true);
            });
            deleteNo.addEventListener("click", () => {
                RedditElements.toggleDeleteElements(element, false);
            });
            deleteYes.addEventListener("click", () => {
                LinkCommentApi.deleteThing(comment.fullname).then(() => {
                    RedditElements.deleteElement(element);                    
                })
            });
        }
    }
    export function hookEditButton(element: HTMLDivElement, comment: Usertext) {
        let entryElement = element.getElementsByClassName("entry")[0];
        let editToggle = element.getElementsByClassName("edit-usertext")[0];
        let editForm = editToggle != null ? <HTMLFormElement>entryElement.getElementsByTagName("form")[0] : null;
        let editCancel = editToggle != null ? <HTMLButtonElement>entryElement.getElementsByClassName("cancel")[0] : null;
        if (editCancel != null && editForm != null && editToggle != null) {
            editToggle.addEventListener("click", () => {
                RedditElements.toggleEditElement(element);
            });
            editCancel.addEventListener("click", () => {
                RedditElements.toggleEditElement(element, false);
            });
            editForm.onsubmit = () => {
                LinkCommentApi.editPost(comment.fullname, entryElement.getElementsByTagName("textarea")[0].value).then((response) => {
                    entryElement.getElementsByClassName("usertext-body")[0].innerHTML =
                        response.json.data.things[0].data.body_html;
                    comment.body = response.json.data.things[0].data.body;
                    comment.bodyHtml = response.json.data.things[0].data.body_html;
                    RedditElements.toggleEditElement(element, false);
                })
                return false;
            }
        }
    }
    export function hookNewDesktopCommentElements(commentElement: HTMLDivElement, comment: DesktopRedditComment) {
        let headerElement = commentElement.getElementsByClassName("Comment__header")[0];
        let bodyElement = commentElement.getElementsByClassName("Comment__body ")[0];
        let flatListItems = (<NodeListOf<HTMLAnchorElement>>(commentElement.getElementsByClassName("Comment_FlatList")[0].getElementsByClassName("CommentFlastList__item")));
        let saveButton: HTMLAnchorElement | undefined;
        let editButton: HTMLAnchorElement | undefined;
        let deleteButton: HTMLAnchorElement | undefined;
        let replyButton: HTMLAnchorElement | undefined;
        let collapseButton = commentElement.getElementsByClassName("Comment__toggle")[0];
        for(let item of flatListItems) {
            if(item.innerText === "save") {
                saveButton = item;
            } else if(item.innerText === "coment edit") {
                editButton = item;
            } else if(item.innerText === "delete") {
                deleteButton = item;
            } else if(item.innerText === "reply") {
                replyButton = item;
            }
        }
        collapseButton.addEventListener("click", () => {
            comment.toggle();
        });
        if(comment.isDeleted || !DesktopEngine.isLoggedIn) {
            return;
        }
        hookVoterElement(commentElement, comment);
        if(replyButton != null) {
            replyButton.addEventListener("click", () =>{
                comment.toggleReplyForm();
            });
        }
        if(deleteButton != null) {
            LinkCommentApi.deleteThing(comment.fullname).then(() => {
                RedditElements.deleteElement(commentElement);
            });
        }
        if(editButton != null) {
            
        }
    }
    // export function toggleNewEditForm(element: HTMLElement, comment: DesktopRedditComment) {
    //     if(element.getElementsByTagName("Comment__"))
    // }
    export function hookVoterElement(element:HTMLElement, comment:Votable) {
        if(!DesktopEngine.isLoggedIn){
            return;
        }
        let voterElement = element.getElementsByClassName("midcol")[0];
        let upvote = voterElement.getElementsByClassName("arrow")[0] || <HTMLElement>voterElement.getElementsByClassName("upmod")[0];
        let downvote = voterElement.getElementsByClassName("arrow")[1] || <HTMLElement> voterElement.getElementsByClassName("downmod")[0];
        upvote.addEventListener("click", () => {
            if(upvote.classList.contains("upmod")) {
                comment.vote(0);
            } else {
                comment.vote(1);
            }
        });
        downvote.addEventListener("click", () => {
            if(downvote.classList.contains("downmod")) {
                comment.vote(0);
            } else {
                comment.vote(-1);
            }
        });
    }
    export function hookNewVoterCommentElement(element:HTMLElement, comment:Votable) {
        if(!DesktopEngine.isLoggedIn){
            return;
        }
        let voterElement = element.getElementsByClassName("Comment__votes")[0];
        let upvote = voterElement.getElementsByClassName("Comment_upVote")[0];
        let downvote = voterElement.getElementsByClassName("Comment_downVote")[0];
        upvote.addEventListener("click", () => {
            if((<HTMLElement>upvote.firstChild).classList.contains("m-downvoted")) {
                comment.vote(0);
            } else {
                comment.vote(1);
            }
        });
        downvote.addEventListener("click", () => {
            if((<HTMLElement>upvote.firstChild).classList.contains("m-upvoted")) {
                comment.vote(0);
            } else {
                comment.vote(-1);
            }
        });
    }
    export function upvoteElement(element: HTMLDivElement) {
        let midcol = element.getElementsByClassName("midcol")[0];
        midcol.classList.remove("unvoted");
        midcol.classList.remove("dislikes");
        midcol.classList.add("likes");
        let upvote = midcol.getElementsByClassName("arrow")[0];
        upvote.classList.remove("up");
        upvote.classList.add("upmod");
        let downvote = midcol.getElementsByClassName("arrow")[1];
        downvote.classList.remove("downmod");
        downvote.classList.add("down");
        let entry = element.getElementsByClassName("entry")[0];
        entry.classList.remove("dislikes")
        entry.classList.remove("unvoted");
        entry.classList.add("likes");
    }
    export function downvoteElement(element: HTMLDivElement) {
        let midcol = element.getElementsByClassName("midcol")[0];
        midcol.classList.remove("unvoted");
        midcol.classList.remove("likes");
        midcol.classList.add("dislikes");
        let upvote = midcol.getElementsByClassName("arrow")[0];
        upvote.classList.remove("upmod");
        upvote.classList.add("up");
        let downvote = midcol.getElementsByClassName("arrow")[1];
        downvote.classList.remove("down");
        downvote.classList.add("downmod");
        let entry = element.getElementsByClassName("entry")[0];
        entry.classList.remove("likes")
        entry.classList.remove("unvoted");
        entry.classList.add("dislikes");
    }
    export function unvoteElement(element: HTMLDivElement) {
        let midcol = element.getElementsByClassName("midcol")[0];
        midcol.classList.remove("likes");
        midcol.classList.remove("dislikes");
        midcol.classList.add("unvoted");
        let upvote = midcol.getElementsByClassName("arrow")[0];
        upvote.classList.remove("upmod");
        upvote.classList.add("up");
        let downvote = midcol.getElementsByClassName("arrow")[1];
        downvote.classList.remove("downmod");
        downvote.classList.add("down");
        let entry = element.getElementsByClassName("entry")[0];
        entry.classList.remove("likes")
        entry.classList.remove("dislikes");
        entry.classList.add("unvoted");
    }
    export function voteElement(element: HTMLDivElement, dir: -1 | 0 | 1) {
        switch(dir) {
            case -1:
            RedditElements.downvoteElement(element);
            break;
            case 0:
            RedditElements.unvoteElement(element);
            break;
            case 1:
            RedditElements.upvoteElement(element);
            break;
            default:
            throw new TypeError("dir is never! value is " + dir)
        }
    }
    export function toggleDeleteElements(element: HTMLDivElement, showConfirmDialog?: boolean) {
        const deleteElement = element.getElementsByClassName("del-button")[0];
        if(showConfirmDialog !== undefined) {
            if(showConfirmDialog) {
                deleteElement.getElementsByTagName("span")[0].classList.remove("active");
                deleteElement.getElementsByTagName("span")[1].classList.add("active");
            } else {
                deleteElement.getElementsByTagName("span")[0].classList.add("active");             
                deleteElement.getElementsByTagName("span")[1].classList.remove("active");
            }
        }
        else {
            const deleteButton = deleteElement.getElementsByTagName("span")[0].classList;            
            const confirmDialog = deleteElement.getElementsByTagName("span")[1].classList;            
            if(deleteButton.contains("active")) {
                deleteButton.remove("active");
                confirmDialog.add("active");
            } else {
                deleteButton.add("active");
                confirmDialog.remove("active");
            }
        }
    }
    export function deleteElement(element: HTMLDivElement) {
        const deleteElement = element.getElementsByClassName("del-button")[0];
        deleteElement.innerHTML = "deleted";
    }
    export function toggleEditElement(element: HTMLDivElement, toggleEditForm?: boolean) {
        let bod = (<HTMLDivElement>element.getElementsByClassName("usertext-body")[0]);
        let ed = (<HTMLDivElement>element.getElementsByClassName("usertext-edit")[0]);
        //for some reason these are display none on reddit's html
        (<HTMLButtonElement>ed.getElementsByClassName("save")[0]).style.display = "inline";
        (<HTMLButtonElement>ed.getElementsByClassName("cancel")[0]).style.display = "inline";        
        if(typeof toggleEditForm === "boolean") {
            if(toggleEditForm) {
                bod.style.display = "none";
                ed.style.display = "block";
            } else {
                bod.style.display = "block";
                ed.style.display = "none";
            }
        } else {
            if(ed.style.display === "none") {
                bod.style.display = "none";
                ed.style.display = "block";
            } else {
                bod.style.display = "block";
                ed.style.display = "none";
            }
        }
    }
    export function generateListOf<T extends Thingable>(selector: string, type: { new(element: HTMLDivElement): T ;}) {
        let elements: HTMLCollectionOf<HTMLDivElement> = <HTMLCollectionOf<HTMLDivElement>>document.getElementsByClassName(selector);
        let comments: Dictionary<T> = {};        
        for(let i = 0; i < elements.length; i++) {
            let comment = new type(elements[i]);
            if(!(<any>comment).isDeleted) { //bad
                comments[comment.id] = comment;
            }
        }
        return comments;
    }
    export function hookThreadCommentForm() {
        if(!DesktopEngine.isLoggedIn) {
            return;
        }
        let formTextarea = <HTMLTextAreaElement|null>document.querySelector("div.usertext-edit:nth-child(2) > div:nth-child(1) > textarea:nth-child(1)");
        let submitButton = <HTMLButtonElement|null>document.querySelector(".usertext-buttons > button:nth-child(1)");
        let form = <HTMLFormElement|null>document.querySelector("form.usertext:nth-child(3)");
        if(form == null || submitButton == null || formTextarea == null) {
            return;
        }
        form.onsubmit = () => {
            submitButton!.disabled = true;
            formTextarea!.disabled = true;
            LinkCommentApi.postComment(DesktopThreadServices.thread.fullname, formTextarea!.value).then( (commentJson) => {
                formTextarea!.style.display = "none";
                submitButton!.style.display = "none";
                for(var comment of commentJson.json.data.things) {
                    DesktopThreadServices.addComment(new ApiRedditComment(comment.data).toDesktopRedditComment());
                }
            });
            return false;
        }
    }
    export function generateNoScriptCaptchaDiv() {
        let captchaDiv = document.getElementsByClassName("g-recaptcha")[0];
        let sitekey = <string>captchaDiv.getAttribute("data-sitekey");
        let containerDiv = document.createElement("div");
        let iframeContainerDiv1 = document.createElement("div");
        iframeContainerDiv1.style.width = "302px";
        iframeContainerDiv1.style.height = "422px";
        iframeContainerDiv1.style.position = "relative";
        let iframeContainerDiv2 = document.createElement("div");
        iframeContainerDiv2.style.width = "302px";
        iframeContainerDiv2.style.height = "422px";
        iframeContainerDiv2.style.position = "absolute";
        let iframe = document.createElement("iframe");
        iframe.frameBorder = "0";
        iframe.scrolling = "no";
        iframe.style.width = "302px";
        iframe.style.height = "422px";
        iframe.style.borderStyle = "none";
        iframe.src = "https://www.google.com/recaptcha/api/fallback?k="+sitekey;
        iframeContainerDiv2.appendChild(iframe);
        iframeContainerDiv1.appendChild(iframeContainerDiv2);
        containerDiv.appendChild(iframeContainerDiv1);
        let textareaDiv = document.createElement("div");
        textareaDiv.style.width = "300px";
        textareaDiv.style.height = "60px";
        textareaDiv.style.borderStyle = "none";
        textareaDiv.style.bottom = "12px";
        textareaDiv.style.left = "25px";
        textareaDiv.style.margin = "0px";
        textareaDiv.style.padding = "0px";
        textareaDiv.style.right = "25px";
        textareaDiv.style.background = "$f9f9f9";
        textareaDiv.style.border = "1-x solid #c1c1c1";
        textareaDiv.style.borderRadius = "3px";
        let textarea = document.createElement("textarea");
        textarea.id = "g-recaptcha-response";
        textarea.name = "g-recaptcha-response";
        textarea.classList.add("g-recaptcha-response");
        textarea.style.width = "250px";
        textarea.style.height = "40px";
        textarea.style.border = "1px solid $c1c1c1";
        textarea.style.margin = "10px 25px";
        textarea.style.padding = "0px";
        textarea.style.resize = "none";
        textareaDiv.appendChild(textarea);
        containerDiv.appendChild(textareaDiv);
        return containerDiv;
    }
    export function hookMoreComments() {
        let commentdivs = <HTMLCollectionOf<HTMLElement>>document.getElementsByClassName("morechildren");
        for (let i = 0; i < commentdivs.length; i++) {
            let commentdiv = commentdivs[i];
            let span = <HTMLSpanElement>(commentdivs[i].getElementsByClassName("morecomments")[0]);
            let commentCount = 0;
            span.firstChild!.addEventListener("click", () => {
                let click = <string>(<HTMLAnchorElement>span.firstChild!).getAttribute("onclick");
                let firstI = click.indexOf("'")+1;
                let secondI = click.indexOf("'", firstI);
                let thirdI = click.indexOf("'", click.indexOf("'", click.indexOf("'", secondI + 1) + 1) + 1) + 1;
                let fourthI = click.indexOf("'", thirdI);
                let linkId = click.substring(firstI, secondI);
                let allCommaDelimitedComments = click.substring(thirdI, fourthI);
                let loadingSpan = document.createElement("span");
                loadingSpan.innerText = "loading";
                loadingSpan.style.color = "red";
                span.style.display = "none";
                commentdiv.appendChild(loadingSpan);
                let commentsToSend = allCommaDelimitedComments.substr((8)*commentCount,(8)*100-1);
                LinkCommentApi.getMoreChildren(commentsToSend, linkId).then((children) => {
                    commentCount += 100;
                    for(let thing of children.json.data.things) {
                        DesktopThreadServices.addComment(new ApiRedditComment(thing.data).toDesktopRedditComment());
                    }
                    if(allCommaDelimitedComments.substr((8)*commentCount,(8)*100-1) === "") {
                        commentdiv.parentElement!.removeChild(commentdiv);
                    } else {
                        span.style.display = "inline";
                        commentdiv.removeChild(loadingSpan);
                        let parent = commentdiv.parentElement;
                        parent!.removeChild(commentdiv);
                        parent!.appendChild(commentdiv);
                        let gray = <HTMLSpanElement>commentdiv.getElementsByClassName("gray")[0];
                        let numberOfComments = +(gray.innerText.substring(gray.innerText.indexOf("(")+1,
                            gray.innerText.indexOf(" ", gray.innerText.indexOf("("))));
                        gray.innerText = " ("+(numberOfComments-100 < 0 ? 0 : numberOfComments - 100) + " replies)";
                    }
                });
            });
        }
    }
}