import { ModalElement } from "./ModalElement";
import { Elements } from "./Elements";

export namespace Modal {
    export function createPopup(message: string): ModalElement {
        return new ModalElement(message, undefined, undefined, undefined, 
            ["OK"]);
    }
    export function createYesNo(message: string, yesCallback: () => void,  noCallback?: () => void): ModalElement {
        return new ModalElement(message, undefined, undefined, undefined, 
        [Elements.createButton("Yes", yesCallback), Elements.createButton("No", noCallback || (() => {}))]);
    }
    export function createToast(message: string): ModalElement {
        return new ModalElement(message, undefined, undefined, 5000);
    }

}