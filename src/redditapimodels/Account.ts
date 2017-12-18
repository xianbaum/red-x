import { Created } from "./Created";

interface AccountBasic {
    comment_karma: number;
    has_mail: boolean | null;
    has_mod_mail: boolean | null;
    has_verified_email: boolean;
    id: string;
    inbox_count: number;
    is_friend: boolean;
    is_gold: boolean;
    is_mod: boolean;
    link_karma: number;
    modhash: string | undefined;
    name: string;
    over_18: boolean;
}