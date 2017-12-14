export interface SubredditKarma {
    sr: string;
    comment_karma: number;
    link_karma: number;
}

export interface Trophy {
    icon_70: string;
    name: string;
    url: string | null;
    icon_40: string;
    award_id: null;
    id: null;
    description: string |  null;
}

export interface RedditDataObject<K extends string,D> {
    kind: K;
    data: D;
}