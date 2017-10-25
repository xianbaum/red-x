export class NotImplementedException extends Error {
    constructor(message?: string) {
        if(message !== undefined) {
            super("Not implemented: "+message);
        } else {
            super();
        }
        this.name = "NotImplementedException";
    }
}