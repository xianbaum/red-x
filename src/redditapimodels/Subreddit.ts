export interface Subreddit {
    accounts_active: number;
    comment_score_hide_mins: number;
    description: string;
    description_html: string;
    display_name: string;
    header_img: string | null;
    header_size: number[] | null; //?
    header_title: string | null;
    over18: boolean;
    public_description: string;
    public_traffic: boolean;
    subscribers: number;
    submission_type: string;
    submit_link_label: string;
    submit_text_label: string;
    subreddit_type: string;
    title: string;
    url: string;
    user_is_banned: boolean;
    user_is_contributer: boolean;
    user_is_moderator: boolean;

}