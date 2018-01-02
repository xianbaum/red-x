import { RedditElements } from "./RedditElements";

export class LoginServices {
    static current: LoginServices;
    constructor() {
        LoginServices.current = this;
    }
    static addRecaptcha() {
        let captcha = RedditElements.generateNoScriptCaptchaDiv();
        let captchaDiv = document.getElementsByClassName("g-recaptcha")[0];
        captchaDiv.parentNode!.appendChild(captcha);
    }
}