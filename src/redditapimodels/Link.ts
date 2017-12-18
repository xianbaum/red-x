import {Votable} from "./Votable";
import {Created} from "./Created";

export type Link = LinkBasic & Votable & Created;

export interface LinkBasic {
    author: string | null;
    author_flair_css_class: string;
    author_flair_text: string;
    clicked: boolean;
    domain: string;
    hidden: boolean;
    is_self: boolean;
    likes: boolean | null;
    link_flair_css_class: string;
    link_flair_text: string;
    locked: boolean;
    media: object;
    media_embed: object;
    num_comments: number;
    over_18: boolean;
    permalink: string;
    saved: boolean;
    score: number;
    selftext: string;
    selftext_html: string | null;
    subreddit: string;
    subreddit_id: string;
    thumbnail: string;
    title: string;
    url: string;
    edited: number;
    distinguished: string | null;
    stickied: boolean;
}