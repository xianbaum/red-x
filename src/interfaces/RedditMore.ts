import { Thingable } from  "./Thingable";

export interface RedditMore extends Thingable {
    children: string[];
    count: number;
}