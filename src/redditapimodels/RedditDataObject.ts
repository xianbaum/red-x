export class SubredditKarma {
    sr: string;
    comment_karma: number;
    link_karma: number;
}

export class Trophy {
    icon_70: string;
    name: string;
    url: string | null;
    icon_40: string;
    award_id: null;
    id: null;
    description: string |  null;
}

export class RedditDataObject {
    kind: "KarmaList" | "TrophyList" | "t6";
    data: (SubredditKarma)[] | RedditDataObject[] | Trophy;
}