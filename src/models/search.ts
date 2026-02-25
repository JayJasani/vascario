export interface SearchItem {
    id: string;
    name: string;
    type: "product";
    url: string;
    image?: string;
    price?: number;
    cutPrice?: number | null;
    tag?: string;
}
