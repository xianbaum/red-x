import { ModalElement } from "./ModalElement";
import { Elements } from "./Elements";

export class Modal {
    static createPopup(message: string): ModalElement {
        return new ModalElement(message, undefined, undefined, undefined, 
            ["OK"]);
    }
    static createYesNo(message: string, yesCallback: () => void) {
        return new ModalElement(undefined, message, undefined, undefined, 
        [Elements.createButton("Yes", yesCallback), "No"]);
    }
    static createToast(message: string) {
        return new ModalElement(message, undefined, undefined, 5000);
    }
}