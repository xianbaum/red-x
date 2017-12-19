import { LinkCommentApi } from "../RedditApi";
import { RedditComment } from "../interfaces/RedditComment";
import { DesktopThreadServices } from "./DesktopThreadServices";
import { ApiRedditComment } from "../apiengine/ApiRedditComment";
import { CommentModel } from "../redditapimodels/Comment";

export namespace RedditElements {
    export interface HookedCommentElements {
        upvote: HTMLElement;
        downvote: HTMLElement;
        reply: HTMLElement;
        collapse: HTMLElement;
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
                    DesktopThreadServices.addComment(new ApiRedditComment(comment.data));
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

    export function hookCommentElements(commentElement: HTMLDivElement, comment: RedditComment) {
        let hookedElements: HookedCommentElements;
        let voterElement = commentElement.getElementsByClassName("midcol")[0];
        let entryElement = commentElement.getElementsByClassName("entry")[0];
        hookedElements = {
            upvote: <HTMLElement>voterElement.getElementsByClassName("up")[0] || <HTMLElement>voterElement.getElementsByClassName("upmod")[0],
            downvote:<HTMLElement> voterElement.getElementsByClassName("down")[0] || <HTMLElement> voterElement.getElementsByClassName("downmod")[0], 
            reply:<HTMLElement> entryElement.getElementsByClassName("reply-button")[0],
            collapse:<HTMLElement> entryElement.getElementsByClassName("expand")[0]
        };
        hookedElements.collapse.addEventListener("click", () => {
            commentActions.toggle();
        });
        hookedElements.upvote.addEventListener("click", () => {

        });
        hookedElements.downvote.addEventListener("click", () => {

        });
        hookedElements.reply.addEventListener("click", () =>{
            toggleReplyForm();
        })
    }
}