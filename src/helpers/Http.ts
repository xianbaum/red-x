import {NotImplementedException} from "./NotImplementedException"

export interface RequestHeader {
    header: string;
    value: string
}

export class ResponseHeader implements RequestHeader {
    constructor(public header: string, public value: string){}
}

export namespace Http {
    export function checkData(data: any): string|null {
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
    export function request(method: string, url:string, data?: any, headers?: RequestHeader[], contentType?: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let dataToSend: string|null;
            try {
                dataToSend = Http.checkData(data);
            } catch(error) {
               return  reject(error.name);
            }
            const xhr = new XMLHttpRequest();
            xhr.open(method, url, false);
            xhr.onload = () => {
                try{
                    let result = JSON.parse(xhr.responseText);
                    return resolve(result);
                } catch{}
                return resolve(xhr.responseText)
            };
            xhr.onerror = xhr.ontimeout = xhr.onabort = () => {
                console.log("Request to "+url+"failed: "+ xhr.statusText);
                reject(xhr.statusText);
            };
            if(headers !== undefined) {
                for(let i = 0; i < headers.length; i++) {
                    xhr.setRequestHeader(headers[i].header, headers[i].value);
                }
            }
            xhr.send(dataToSend);
        });
    }
    export function post(url:string, data?: any, headers?: RequestHeader[], contentType?: string): Promise<any> {
        return Http.request("POST", url, data, headers);
    }
    export function get(url:string, headers?: RequestHeader[]) {
        return Http.request("GET", url, undefined, headers);
    }
    export function createQueryString(data: any): string {
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