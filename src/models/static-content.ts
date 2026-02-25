export interface StaticContent {
    id: string;
    key: string;
    url: string;
    type: "video" | "image";
    redirectUrl?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
