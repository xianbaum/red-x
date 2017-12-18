import {Thing, TypePrefix} from "./Thing"
import {Votable} from "./Votable";
import {Created} from "./Created";

export type CommentModel = CommentBasic & Votable & Created;

interface CommentBasic {
    approved_at_utc: string | null;
    approved_by: string | null;
    archived: boolean;
    author: string;
    author_flair_css_class: string;
    author_flair_text: string;
    banned_at_utc: string| null;
    banned_by: string | null;
    body: string;
    body_html: string;
    can_gild: boolean;
    can_mod_post: boolean;
    collapsed: boolean;
    collapsed_reason: null | string; //?
    controversiality: number;
    edited: boolean | Date;
    gilded: number;
    id: string;
    is_submitter: boolean;
    likes: boolean | null;
    link_author: string;
    link_id: string;
    link_title: string;
    link_url: string;
    mod_note: string | null;
    mod_reason_by: string | null;
    mod_reports: string[] //?
    name: string;
    num_reports: number | null;
    parent_id: string;
    permalink: string;
    removal_reason: string| null;
    replies: Thing<"t1_", Comment>[]
    saved: boolean;
    score: number;
    score_hidden: boolean;
    stickied: boolean;
    subreddit: string;
    subreddit_id: string;
    subreddit_name_prefixed: string;
    subreddit_type: "public" | "private"; //other?
    user_reports: string[];
    distinguished: string | null;
}