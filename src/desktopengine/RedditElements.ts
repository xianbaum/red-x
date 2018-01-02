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
        var reply = document.createElement("li");
        reply.classList.add("reply-button", "login-required");
        var replyA = document.createElement("a");
        replyA.classList.add("access-required");
        replyA.href = "javascript:void(0)";
        replyA.setAttribute("data-event-action", "comment");
        replyA.innerText = "reply";
        reply.appendChild(replyA);
        buttons.appendChild(parent);
        buttons.appendChild(edit);
        buttons.appendChild(deleteEl);
        buttons.appendChild(edit);
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
    export function toggleReplyForm(element: HTMLDivElement, fullname: string) {
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
        let hookedElements: HookedCommentElements;
        let voterElement = commentElement.getElementsByClassName("midcol")[0];
        let entryElement = commentElement.getElementsByClassName("entry")[0];
        let deleteToggle = entryElement.getElementsByClassName("del-button")[0];
        let editToggle = entryElement.getElementsByClassName("edit-usertext")[0];
        let replyButton: Element | null = entryElement.getElementsByClassName("reply-button")[0];
        if(replyButton == null) {
            replyButton = entryElement.querySelector("[data-event-action=reply]");
        }
        hookedElements = {
            upvote: <HTMLDivElement>voterElement.getElementsByClassName("arrow")[0] || <HTMLElement>voterElement.getElementsByClassName("upmod")[0],
            downvote:<HTMLDivElement> voterElement.getElementsByClassName("arrow")[1] || <HTMLElement> voterElement.getElementsByClassName("downmod")[0], 
            reply: <HTMLAnchorElement>replyButton,
            collapse:<HTMLAnchorElement> entryElement.getElementsByClassName("expand")[0],
            deleteToggle: deleteToggle != null ? <HTMLAnchorElement>deleteToggle.getElementsByClassName("togglebutton")[0] : null,
            deleteYes: deleteToggle != null ? <HTMLAnchorElement>deleteToggle.getElementsByClassName("yes")[0] : null,
            deleteNo: deleteToggle != null ? <HTMLAnchorElement>deleteToggle.getElementsByClassName("no")[0] : null,
            editToggle: editToggle != null ? <HTMLAnchorElement>editToggle : null,
            editForm: editToggle != null ? <HTMLFormElement>entryElement.getElementsByTagName("form")[0] : null,
            editCancel: editToggle != null ? <HTMLButtonElement>entryElement.getElementsByClassName("cancel")[0] : null
        };
        hookedElements.collapse.addEventListener("click", () => {
            comment.toggle();
        });
        if(comment.isDeleted) {
            return;
        }
        hookedElements.upvote.addEventListener("click", () => {
            if(hookedElements.upvote.classList.contains("upmod")) {
                comment.vote(0);
            } else {
                comment.vote(1);
            }
        });
        hookedElements.downvote.addEventListener("click", () => {
            if(hookedElements.downvote.classList.contains("downmod")) {
                comment.vote(0);
            } else {
                comment.vote(-1);
            }
        });
        if(hookedElements.reply != null) {
            hookedElements.reply.addEventListener("click", () =>{
                comment.toggleReplyForm();
            });
        }
        if(hookedElements.deleteToggle != null && hookedElements.deleteYes != null && hookedElements.deleteNo != null) {
            hookedElements.deleteToggle.href = "javascript:void(0)";                
            hookedElements.deleteToggle.addEventListener("click", () => {
                RedditElements.toggleDeleteElements(commentElement, true);
            });
            hookedElements.deleteNo.addEventListener("click", () => {
                RedditElements.toggleDeleteElements(commentElement, false);
            });
            hookedElements.deleteYes.addEventListener("click", () => {
                LinkCommentApi.deleteThing(comment.fullname).then(() => {
                    RedditElements.deleteElement(commentElement);                    
                })
            });
            if(hookedElements.editCancel != null && hookedElements.editForm != null && hookedElements.editToggle != null) {
                hookedElements.editToggle.addEventListener("click", () => {
                    RedditElements.toggleEditElement(commentElement);
                });
                hookedElements.editCancel.addEventListener("click", () => {
                    RedditElements.toggleEditElement(commentElement, false);
                });
                hookedElements.editForm.onsubmit = () => {
                    LinkCommentApi.editPost(comment.fullname, entryElement.getElementsByTagName("textarea")[0].value).then((response) =>{
                        entryElement.getElementsByClassName("usertext-body")[0].innerHTML =
                            response.json.data.things[0].data.body_html;
                        comment.body = response.json.data.things[0].data.body;
                        comment.bodyHtml = response.json.data.things[0].data.body_html;
                        RedditElements.toggleEditElement(commentElement, false);
                    })
                    return false;
                }
            }
        }
    }
    export function hookVoterElement(element:HTMLElement, comment:Votable) {
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
    export function generateCommentList(was?: boolean) {
        let selector = was ? "was-comment" : "comment";
        let elements: HTMLCollectionOf<HTMLDivElement> = <HTMLCollectionOf<HTMLDivElement>>document.getElementsByClassName(selector);
        let comments: Dictionary<DesktopRedditComment> = {};        
        for(let i = 0; i < elements.length; i++) {
            let comment = new DesktopRedditCommentFromElement(elements[i]);
            if(!comment.isDeleted) {
                comments[comment.id] = comment;
            }
        }
        return comments;
    }
    export function generateLinkList(was?: boolean) {
        let selector = was ? "was-link" : "link";
        let elements: HTMLCollectionOf<HTMLDivElement> = <HTMLCollectionOf<HTMLDivElement>>document.getElementsByClassName(selector);
        let comments: Dictionary<RedditThread> = {};        
        for(let i = 0; i < elements.length; i++) {
            let comment = new DesktopRedditThreadFromElement(elements[i]);
            comments[comment.fullname] = comment;
        }
        return comments;
    }
    export function hookThreadCommentForm() {
        let formTextarea = <HTMLTextAreaElement>document.querySelector("div.usertext-edit:nth-child(2) > div:nth-child(1) > textarea:nth-child(1)");
        let submitButton = <HTMLButtonElement>document.querySelector(".usertext-buttons > button:nth-child(1)");
        let form = <HTMLFormElement>document.querySelector("form.usertext:nth-child(3)");
        form.onsubmit = () => {
            submitButton.disabled = true;
            formTextarea.disabled = true;
            LinkCommentApi.postComment(DesktopThreadServices.thread.fullname, formTextarea.value).then( (commentJson) => {
                formTextarea.style.display = "none";
                submitButton.style.display = "none";
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
}