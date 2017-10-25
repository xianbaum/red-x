import {NotImplementedException} from "./NotImplementedException"

export class Http {
    static  checkData(data: any): string|null {
        if(typeof data === "object") {
            return JSON.stringify(data);
        }
        if(typeof data === "number" || typeof data === "boolean") {
            return ""+data;
        }
        if(typeof data === "function" || typeof data === "symbol") {
            throw new NotImplementedException("no!");
        }
        return null;
    }
    static post(url:string, data?: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let dataToSend: string|null;
            try {
                dataToSend = Http.checkData(data);
            } catch(error) {
               return  reject(error.name);
            }
            const xhr = new XMLHttpRequest();            
            xhr.open("POST", url, false);
            xhr.onload = () => resolve(xhr.responseText);
            xhr.onerror = () => reject(xhr.statusText);
            xhr.send(dataToSend);
        });
    }
    static get(url:string, data?: any) {
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
            xhr.onload = () => resolve(xhr.responseText);
            xhr.onerror = () => reject(xhr.statusText);
             xhr.send();
        });
    }
    static createQueryString(data: any): string {
        var isFirst = false;
        var qs = "";
        if(typeof data === "object" && data !== null) {
            Object.keys(data).map(
                e => {
                    if(isFirst) {
                        qs+="?"
                    } else {
                        qs+="&"
                    }
                    qs+=e+"="+data[e];
                }
            )
        }
        return qs;
    }
}