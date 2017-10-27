import {NotImplementedException} from "./NotImplementedException"

export class RequestHeader {
    constructor(public header: string, public value: string){
    }
}

export class Http {
    static  checkData(data: any): string|null {
        if(typeof data === "object") {
            return JSON.stringify(data);
        }
        if(typeof data === "number" || typeof data === "boolean" || typeof data === "string") {
            return ""+data;
        }
        if(typeof data === "function" || typeof data === "symbol") {
            throw new NotImplementedException("no!");
        }
        return null;
    }
    static post(url:string, data?: any, headers?: RequestHeader[], contentType?: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let dataToSend: string|null;
            try {
                dataToSend = Http.checkData(data);
            } catch(error) {
               return  reject(error.name);
            }
            const xhr = new XMLHttpRequest();
            xhr.open("POST", url, false);
            xhr.onload = () => {
                try{
                    let result = JSON.parse(xhr.responseText);
                    return resolve(result);
                } catch{}
                return resolve(xhr.responseText)
            };            xhr.onerror = () => reject(xhr.statusText);
            if(headers !== undefined) {
                for(let i = 0; i < headers.length; i++) {
                    xhr.setRequestHeader(headers[i].header, headers[i].value);
                }
            }
            xhr.send(dataToSend);
        });
    }
    static get(url:string, data?: any, headers?: RequestHeader[]) {
        return new Promise<any>((resolve, reject) => {
            let dataToSend: string|null;
            try {
                dataToSend = Http.checkData(data);
            } catch(error) {
               return  reject(error.name);
            }
            url += dataToSend;
            const xhr = new XMLHttpRequest();            
            xhr.open("GET", url, false);
            xhr.onload = () => { 
                try{
                    let result = JSON.parse(xhr.responseText);
                    return resolve(result);
                } catch{}
                return resolve(xhr.responseText)
            };
            xhr.onerror = () => reject(xhr.statusText);
            if(headers !== undefined) {
                for(let i = 0; i < headers.length; i++) {
                    xhr.setRequestHeader(headers[i].header, headers[i].value);
                }
            }
            xhr.send();
        });
    }
    static createQueryString(data: any): string {
        var isFirst = true;
        var qs = "";
        if(typeof data === "object" && data !== null) {
            Object.keys(data).map(
                e => {
                    if(isFirst) {
                        qs+="?"
                        isFirst = false;
                    } else {
                        qs+="&"
                    }
                    qs+=encodeURIComponent(e)+"="+encodeURIComponent(data[e]);
                }
            )
        }
        return qs;
    }
}