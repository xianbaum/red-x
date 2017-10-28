import { Features } from "./Features";

export interface User {
    comment_karma: number;
    created: number;
    created_utc: number;
    features: Features;
    gold_creddits: number;
    gold_expiration: null
    has_mail: boolean
    has_mod_mail: boolean
    has_subscribed: boolean
    has_verified_email: boolean
    hide_from_robots: boolean
    id: string
    in_beta: boolean
    inbox_count: number;
    is_employee: boolean
    is_gold: boolean
    is_mod: boolean
    is_sponsor: boolean
    is_suspended: boolean
    link_karma: number
    name: string
    new_modmail_exists: boolean | null;
    oauth_client_id: string
    over_18: boolean
    pref_geopopular: null
    pref_no_profanity: boolean
    pref_show_snoovatar: boolean
    pref_top_karma_subreddits: null
    subreddit: null
    suspension_expiration_utc: null | number;
    verified: boolean;
}