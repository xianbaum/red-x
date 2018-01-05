import { NotImplementedException } from "./NotImplementedException";

export class ModalElement {
    private static modalCount: number;
    constructor(header?: string, message?: string,
        hideX?: boolean, timeoutInMsecs?: number,
        buttons?: (HTMLButtonElement|string)[]) {
        this.element = document.createElement("div");
        this.initStyle();        
        if(header !== undefined) {
            let heading = document.createElement("h3");
            heading.innerHTML = header;
            heading.style.marginLeft = heading.style.marginRight = "auto";
            this.element.appendChild(heading);
        }
        if(!hideX) {
            let xElement = document.createElement("button");
            xElement.style.backgroundColor = "inherit";
            xElement.style.borderWidth = "0";
            xElement.style.cssFloat = "right";
            xElement.style.zIndex = "100";
            xElement.innerHTML = "\uD83D\uDDD9"; /* X symbol */
            xElement.addEventListener("click", () => {
                this.close();
            });
            this.element.appendChild(xElement);
        }
        if(message !== undefined) {
            let messageElement = document.createElement("p");
            this.element.innerHTML = message;
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
            setTimeout(() => {
                this.close();
            }, timeoutInMsecs);
        }
    }
    private element: HTMLDivElement;
    private initStyle() {
        this.element.style.width = "75%";
        this.element.style.height = "100px";
        this.element.style.backgroundColor = "white";
        this.element.style.borderStyle = "solid";
        this.element.style.borderWidth = "1px";
        this.element.style.borderColor = "blue";
        this.element.style.position = "fixed";
        this.element.style.top = "100px";
        this.element.style.marginLeft = this.element.style.marginRight = "auto";        
    }
    open(): ModalElement {
        if(ModalElement.modalCount > 0) {
            throw new NotImplementedException("Find out how to support more than 1 modal dummy");
        }
        ModalElement.modalCount++;
        if(!this.isOpened){
            document.body.appendChild(this.element);      
        }
        return this;
    }
    close(): ModalElement {
        ModalElement.modalCount--;
        if(this.isOpened) {
            document.body.removeChild(this.element);            
        }
        return this;
    }
    toggle(): ModalElement {
        if(this.isOpened) {
            this.close();
        } else {
            this.open();
        }
        return this;
    }
    onButtonClick<T>(index: number, method: () => T) {
        return method();
    }
    public get isOpened() {
        return document.body.contains(this.element);
    }
}