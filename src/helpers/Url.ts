export class Url {
    private _url: string;
    constructor(url: string) {
        this._url = url;
    }
    static get Current(): Url {
        return new Url(window.location.href);
    }
    get hasQueryString(): boolean {
        return this.queryStringIndex >= 0;
    }
    private get queryStringIndex(): number {
        return this._url.indexOf("?");
    }
    get queryString(): string | undefined {
        return this.hasQueryString ? this._url.substr(this.queryStringIndex) : undefined;
    }
    get path(): string {
        let path = this._url.substring(this._url.indexOf("/", 10));
        if(this.hasQueryString) {
            return path.split("?")[0];
        }
        return path;
    }
    query(key: string): string | undefined {
        let qs = this.queryString;
        if(qs === undefined) {
            return undefined;
        }
        let keyIndex = qs.indexOf(key+"=");
        if(keyIndex === -1) {
            return undefined
        }
        keyIndex += key.length + 1;
        let ampIndex = qs.indexOf("&", keyIndex);
        let poundIndex = qs.indexOf("#", keyIndex);
        if(ampIndex === -1 && poundIndex === -1) {
            return qs.substr(keyIndex);
        }
        if(keyIndex === -1 || ampIndex < keyIndex) {
            return qs.substring(keyIndex, keyIndex);
        }
        return qs.substring(keyIndex, ampIndex);
    }
}