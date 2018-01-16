export interface MoreModel {
    children: string[];
    count: number;
    depth: number;
    id: string;
    name: string;
    parent_id: string;
}

export function isMore(object: any): object is MoreModel  {
    return typeof object.children === "object" &&
        typeof object.count === "number" &&
        typeof object.depth === "number" &&
        typeof object.id === "string" &&
        typeof object.name === "string" &&
        typeof object.parent_id === "string";
}
