import { RedditElements } from "./RedditElements";

export class LoginServices {
    static current: LoginServices;
    constructor() {
        LoginServices.current = this;
    }
    static addRecaptcha() {
        // let captcha = RedditElements.generateNoScriptCaptchaDiv();
        let warningNode = document.createElement("div");
        warningNode.innerText = "Unfortunately, it is not possible to register on Reddit without using nonfree javascript due to the required captcha. The noscript captcha is not enabled for Reddit either. Contact Reddit admins at contact@reddit.com for assistance.";
        warningNode.style.color = "red";
        let captchaDiv = document.getElementsByClassName("g-recaptcha")[0];
        captchaDiv.parentNode!.appendChild(warningNode);

    }
}