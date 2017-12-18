import {NotImplementedException} from "./NotImplementedException"

export interface RequestHeader {
    header: string;
    value: string
}

export class ResponseHeader implements RequestHeader {
    constructor(public header: string, public value: string){}
}

export namespace Http {
    export function checkData(data: any, xWwwFormUrlencoded?: boolean): string|null {
        if(typeof data === "object") {
            if(xWwwFormUrlencoded) {
                return Http.createxWwwFormUrlEncoded(data);
            }
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
    export function request(method: string, url:string, data?: any, headers?: RequestHeader[],
        xWwwFormUrlencoded?: boolean): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let dataToSend: string|null;
            try {
                dataToSend = Http.checkData(data, xWwwFormUrlencoded);
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
    export function post(url:string, data?: any, headers?: RequestHeader[], xWwwFormUrlencoded?: boolean): Promise<any> {
        return Http.request("POST", url, data, headers, xWwwFormUrlencoded);
    }
    export function get(url:string, headers?: RequestHeader[]) {
        return Http.request("GET", url, undefined, headers);
    }
    export function createQueryString(data: object): string {
        var isFirst = true;
        var qs = "";
        if(data !== null) {
            Object.keys(data).map(
                e => {
                    if(isFirst) {
                        qs+="?"
                        isFirst = false;
                    } else {
                        qs+="&"
                    }
                    qs+=encodeURIComponent(e)+"="+encodeURIComponent((<any>data)[e]);
                }
            )
        }
        return qs;
    }
    export function createxWwwFormUrlEncoded(data: object) {
        var result = "";
        if(data !== null) {
            let length = Object.keys(data).length;
            Object.keys(data).map(
                (e, i) => 
                {
                    result+=encodeURIComponent(e)+"="+encodeURIComponent((<any>data)[e]);
                    if(i < length - 1) {
                        result+="&";
                    }
                }
            )
        }
        return result;
    }
}