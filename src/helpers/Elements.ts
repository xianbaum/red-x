export class Elements {
    static createButton(message: string, action: () => void): HTMLButtonElement {
        let e = document.createElement("button");
        e.click = action;
        e.innerHTML = message;
        return e;
    }
}