import { Votable } from "./Votable";
import { Usertext } from "./Usertext";
import { Thingable } from "./Thingable";

export interface RedditThread extends Thingable, Usertext{
    //TODO THis
    vote(dir: -1 | 0 | 1): void;
    element: HTMLDivElement;
    fullname: string;
}
