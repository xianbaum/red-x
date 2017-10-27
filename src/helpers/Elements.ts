export class Elements {
    static createButton(message: string, action: () => void): HTMLButtonElement {
        let e = document.createElement("button");
        e.addEventListener("click", action);
        e.innerHTML = message;
        return e;
    }
}