import { Created } from "./Created";

export type Message = MessageBasic & Created;

interface MessageBasic {
    author: string;
    body: string;
    body_html: string;
    context: string;
    first_message: Message;
    first_message_name: string | null;
    likes: boolean;
    link_title: string;
    name: string;
    new: boolean;
    parent_id: string | null;
    replies: string;
    subject: string;
    subreddit: string | null;
    was_comment: boolean;
}