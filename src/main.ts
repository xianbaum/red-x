// ==UserScript==
// @description An unofficial browser add-on for using Reddit
// @include https://www.reddit.com/*
// @version 0.0.1
// ==/UserScript==

import { RedditApi } from "./RedditApi";
import { Modal } from "./helpers/Modal";
console.log("Hello?")
RedditApi.getIdentity().then( ( response) => {
    console.log("Hello" + response);
}, (reason) => {
    Modal.createYesNo("redditx requires permission from your reddit account. Would you like to grant permissions now?", () => {
        window.location.href = RedditApi.authorizeUrl;
    });
});
