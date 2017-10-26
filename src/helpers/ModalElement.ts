import { NotImplementedException } from "./NotImplementedException";

export class ModalElement {
    private static modalCount: number;
    constructor(header?: string, message?: string,
        showX?: boolean, timeoutInMsecs?: number,
        buttons?: (HTMLButtonElement|string)[]) {
        this.initStyle();
        this.element = document.createElement("div");
        if(header !== undefined) {
            let heading = document.createElement("h3");
            heading.innerHTML = header;
            heading.style.marginLeft = heading.style.marginRight = "auto";
            this.element.appendChild(heading);
        }
        if(showX) {
            let xElement = document.createElement("button");
            xElement.style.backgroundColor = "inherit";
            xElement.style.borderWidth = "0";
            xElement.style.cssFloat = "right";
            xElement.style.width = "100%";
            xElement.innerHTML = "\uD83D\uDDD9"; /* X symbol */
            this.element.appendChild(xElement);
        }
        if(message !== undefined) {
            let messageElement = document.createElement("p");
            this.element.appendChild(messageElement);
        }
        if(buttons != undefined) {
            let buttonDiv = document.createElement("div");
            buttonDiv.style.bottom = "10px";
            this.element.appendChild(buttonDiv);
            for(let i = 0; i < buttons.length; i++) {
                if(typeof buttons[i] === "string") {
                    let closeButton = document.createElement("button");
                    closeButton.innerHTML = <string>buttons[i];
                    buttonDiv.appendChild(closeButton);
                    closeButton.addEventListener("click", () => {
                        this.close();
                    });     
                } else {
                    buttonDiv.appendChild(<HTMLButtonElement>buttons[i]);
                    (<HTMLButtonElement>buttons[i]).addEventListener("click", () => {
                        this.close();
                    });
                }
            }
        }
        if(timeoutInMsecs !== undefined && timeoutInMsecs > 0) {
            setTimeout(timeoutInMsecs, () => {
                this.close();
            });
        }
    }
    private element: HTMLDivElement;
    private initStyle() {
        this.element.style.width = "75%";
        this.element.style.height = "25%";
        this.element.style.backgroundColor = "white";
        this.element.style.borderStyle = "solid";
        this.element.style.borderWidth = "1px";
        this.element.style.borderColor = "blue";
    }
    open() {
        if(ModalElement.modalCount > 0) {
            throw new NotImplementedException("Find out how to support more than 1 modal dummy");
        }
        ModalElement.modalCount++;
        if(!this.isOpened){
            document.appendChild(this.element);      
        }
    }
    close() {
        ModalElement.modalCount--;
        if(this.isOpened) {
            document.removeChild(this.element);            
        }
    }
    toggle() {
        if(this.isOpened) {
            this.close();
        } else {
            this.open();
        }
    }
    public get isOpened() {
        return document.contains(this.element);
    }
}