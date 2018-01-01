import { Votable } from "./Votable";

export interface RedditThread extends Votable{
    //TODO THis
    vote(dir: -1 | 0 | 1): void;
    element: HTMLDivElement;
    fullname: string;
}