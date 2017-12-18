
export interface Thing<K extends string,D> {
    kind: K;
    data: D;
}

export namespace TypePrefix {
    export const Comment = "t1_";
    export const Account = "t2_";
    export const Link = "t3_";
    export const Message = "t4_";
    export const Subreddit = "t5_";
    export const Award = "t6_";
}