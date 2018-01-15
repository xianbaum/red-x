import { Thingable } from "./Thingable";

export interface Usertext extends Thingable {
    body: string;
    bodyHtml: string;
}