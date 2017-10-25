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
            throw new NotImplementedException()
        }
        return null;
    }
    static Post(url:string, data?: any): Promise<any> {
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
}