"use strict";
System.register("RedditComment", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("DesktopThreadRedditComment", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var DesktopThreadRedditComment;
    return {
        setters: [],
        execute: function () {
            DesktopThreadRedditComment = class DesktopThreadRedditComment {
                constructor() {
                    this.authorAttribute = "data-author";
                    // get user() {
                    // }
                }
                toggle() {
                    this.element.style.display = "none";
                }
                get authorNode() {
                    return this.element.getElementsByClassName("author")[0];
                }
                get posterName() {
                    return this.element.getAttribute("data-author");
                }
                get id() {
                    return 1;
                }
            };
            exports_2("DesktopThreadRedditComment", DesktopThreadRedditComment);
        }
    };
});
System.register("DesktopThreadServices", [], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var DesktopThreadServices;
    return {
        setters: [],
        execute: function () {
            DesktopThreadServices = class DesktopThreadServices {
                static processRedditThread() {
                    DesktopThreadServices.populateCommentsList();
                }
                static populateCommentsList() {
                    let elements = document.querySelectorAll("[data-type=comment]");
                }
            };
        }
    };
});
System.register("helpers/NotImplementedException", [], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var NotImplementedException;
    return {
        setters: [],
        execute: function () {
            NotImplementedException = class NotImplementedException extends Error {
                constructor(message) {
                    if (message !== undefined) {
                        super("Not implemented: " + message);
                    }
                    else {
                        super();
                    }
                    this.name = "NotImplementedException";
                }
            };
            exports_4("NotImplementedException", NotImplementedException);
        }
    };
});
System.register("helpers/Http", ["helpers/NotImplementedException"], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var NotImplementedException_1, Http;
    return {
        setters: [
            function (NotImplementedException_1_1) {
                NotImplementedException_1 = NotImplementedException_1_1;
            }
        ],
        execute: function () {
            Http = class Http {
                static checkData(data) {
                    if (typeof data === "object") {
                        return JSON.stringify(data);
                    }
                    if (typeof data === "number" || typeof data === "boolean") {
                        return "" + data;
                    }
                    if (typeof data === "function" || typeof data === "symbol") {
                        throw new NotImplementedException_1.NotImplementedException("no!");
                    }
                    return null;
                }
                static post(url, data) {
                    return new Promise((resolve, reject) => {
                        let dataToSend;
                        try {
                            dataToSend = Http.checkData(data);
                        }
                        catch (error) {
                            return reject(error.name);
                        }
                        const xhr = new XMLHttpRequest();
                        xhr.open("POST", url, false);
                        xhr.onload = () => resolve(xhr.responseText);
                        xhr.onerror = () => reject(xhr.statusText);
                        xhr.send(dataToSend);
                    });
                }
                static get(url, data) {
                    return new Promise((resolve, reject) => {
                        let dataToSend;
                        try {
                            dataToSend = Http.checkData(data);
                        }
                        catch (error) {
                            return reject(error.name);
                        }
                        url += dataToSend;
                        const xhr = new XMLHttpRequest();
                        xhr.open("GET", url, false);
                        xhr.onload = () => resolve(xhr.responseText);
                        xhr.onerror = () => reject(xhr.statusText);
                        xhr.send();
                    });
                }
                static createQueryString(data) {
                    var isFirst = false;
                    var qs = "";
                    if (typeof data === "object" && data !== null) {
                        Object.keys(data).map(e => {
                            if (isFirst) {
                                qs += "?";
                            }
                            else {
                                qs += "&";
                            }
                            qs += e + "=" + data[e];
                        });
                    }
                    return qs;
                }
            };
            exports_5("Http", Http);
        }
    };
});
System.register("RedditError", [], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("RedditApi", ["helpers/Http"], function (exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var Http_1, RedditApi;
    return {
        setters: [
            function (Http_1_1) {
                Http_1 = Http_1_1;
            }
        ],
        execute: function () {
            RedditApi = class RedditApi {
                static validateResponse(response) {
                    if (response.message === "Forbidden" && response.error === 403) {
                        return false;
                    }
                    return true;
                }
                static get authorizeState() {
                    return Math.floor(Math.random() * 1000) + "meowmeow" + Date.now();
                }
                static get authorizeUrl() {
                    return "/api/v1/authorize" +
                        Http_1.Http.createQueryString({
                            client_id: "9auOkzXYOjezfQ",
                            response_type: "code",
                            state: RedditApi.authorizeState,
                            redirect_uri: "https://www.github.com/xianbaum/redditx",
                            duration: "permanent",
                            scope: "identity%20edit%20flair%20history%20modconfig%20modflair%20modlog%20modposts%20modwiki%20mysubreddits%20privatemessages%20read%20report%20save%20submit%20subscribe%20vote%20wikiedit%20wikiread"
                        });
                }
                static getIdentity() {
                    return Http_1.Http.get(RedditApi.base + "/api/v1/me").then((response) => {
                        if (RedditApi.validateResponse(response)) {
                            return Promise.reject(response.message);
                        }
                        return response;
                    });
                }
            };
            RedditApi.base = "https://www.reddit.com";
            exports_7("RedditApi", RedditApi);
        }
    };
});
System.register("RedditUser", [], function (exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("helpers/ModalElement", ["helpers/NotImplementedException"], function (exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var NotImplementedException_2, ModalElement;
    return {
        setters: [
            function (NotImplementedException_2_1) {
                NotImplementedException_2 = NotImplementedException_2_1;
            }
        ],
        execute: function () {
            ModalElement = class ModalElement {
                constructor(header, message, showX, timeoutInMsecs, buttons) {
                    this.initStyle();
                    this.element = document.createElement("div");
                    if (header !== undefined) {
                        let heading = document.createElement("h3");
                        heading.innerHTML = header;
                        heading.style.marginLeft = heading.style.marginRight = "auto";
                        this.element.appendChild(heading);
                    }
                    if (showX) {
                        let xElement = document.createElement("button");
                        xElement.style.backgroundColor = "inherit";
                        xElement.style.borderWidth = "0";
                        xElement.style.cssFloat = "right";
                        xElement.style.width = "100%";
                        xElement.innerHTML = "\uD83D\uDDD9"; /* X symbol */
                        this.element.appendChild(xElement);
                    }
                    if (message !== undefined) {
                        let messageElement = document.createElement("p");
                        this.element.appendChild(messageElement);
                    }
                    if (buttons != undefined) {
                        let buttonDiv = document.createElement("div");
                        buttonDiv.style.bottom = "10px";
                        this.element.appendChild(buttonDiv);
                        for (let i = 0; i < buttons.length; i++) {
                            if (typeof buttons[i] === "string") {
                                let closeButton = document.createElement("button");
                                closeButton.innerHTML = buttons[i];
                                buttonDiv.appendChild(closeButton);
                                closeButton.addEventListener("click", () => {
                                    this.close();
                                });
                            }
                            else {
                                buttonDiv.appendChild(buttons[i]);
                                buttons[i].addEventListener("click", () => {
                                    this.close();
                                });
                            }
                        }
                    }
                    if (timeoutInMsecs !== undefined && timeoutInMsecs > 0) {
                        setTimeout(timeoutInMsecs, () => {
                            this.close();
                        });
                    }
                }
                initStyle() {
                    this.element.style.width = "75%";
                    this.element.style.height = "25%";
                    this.element.style.backgroundColor = "white";
                    this.element.style.borderStyle = "solid";
                    this.element.style.borderWidth = "1px";
                    this.element.style.borderColor = "blue";
                }
                open() {
                    if (ModalElement.modalCount > 0) {
                        throw new NotImplementedException_2.NotImplementedException("Find out how to support more than 1 modal dummy");
                    }
                    ModalElement.modalCount++;
                    if (!this.isOpened) {
                        document.appendChild(this.element);
                    }
                }
                close() {
                    ModalElement.modalCount--;
                    if (this.isOpened) {
                        document.removeChild(this.element);
                    }
                }
                toggle() {
                    if (this.isOpened) {
                        this.close();
                    }
                    else {
                        this.open();
                    }
                }
                get isOpened() {
                    return document.contains(this.element);
                }
            };
            exports_9("ModalElement", ModalElement);
        }
    };
});
System.register("helpers/Elements", [], function (exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var Elements;
    return {
        setters: [],
        execute: function () {
            Elements = class Elements {
                static createButton(message, action) {
                    let e = document.createElement("button");
                    e.click = action;
                    e.innerHTML = message;
                    return e;
                }
            };
            exports_10("Elements", Elements);
        }
    };
});
System.register("helpers/Modal", ["helpers/ModalElement", "helpers/Elements"], function (exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    var ModalElement_1, Elements_1, Modal;
    return {
        setters: [
            function (ModalElement_1_1) {
                ModalElement_1 = ModalElement_1_1;
            },
            function (Elements_1_1) {
                Elements_1 = Elements_1_1;
            }
        ],
        execute: function () {
            Modal = class Modal {
                static createPopup(message) {
                    return new ModalElement_1.ModalElement(message, undefined, undefined, undefined, ["OK"]);
                }
                static createYesNo(message, yesCallback) {
                    return new ModalElement_1.ModalElement(undefined, message, undefined, undefined, [Elements_1.Elements.createButton("Yes", yesCallback), "No"]);
                }
                static createToast(message) {
                    return new ModalElement_1.ModalElement(message, undefined, undefined, 5000);
                }
            };
            exports_11("Modal", Modal);
        }
    };
});
// ==UserScript==
// @description An unofficial browser add-on for using Reddit
// @include https://www.reddit.com/*
// @version 0.0.1
// ==/UserScript==
System.register("main", ["RedditApi", "helpers/Modal"], function (exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    var RedditApi_1, Modal_1;
    return {
        setters: [
            function (RedditApi_1_1) {
                RedditApi_1 = RedditApi_1_1;
            },
            function (Modal_1_1) {
                Modal_1 = Modal_1_1;
            }
        ],
        execute: function () {
            console.log("Hello?");
            RedditApi_1.RedditApi.getIdentity().then((response) => {
                console.log("Hello" + response);
            }, (reason) => {
                Modal_1.Modal.createYesNo("redditx requires permission from your reddit account. Would you like to grant permissions now?", () => {
                    window.location.href = RedditApi_1.RedditApi.authorizeUrl;
                });
            });
        }
    };
});
