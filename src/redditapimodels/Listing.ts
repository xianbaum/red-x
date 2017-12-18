export interface Listing {
    after: string | null;
    before: string | null;
    count: number;
    limit: number;
    show?: string;
    sr_detail?: string;
}