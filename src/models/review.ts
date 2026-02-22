export interface Review {
    id: string;
    authorName: string;
    text: string;
    /** 1–5 optional star rating */
    rating?: number | null;
    /** Lower = show first on storefront */
    sortOrder: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type ReviewCreateInput = Pick<Review, "authorName" | "text"> & {
    rating?: number | null;
    sortOrder?: number;
};
export type ReviewUpdateInput = Partial<Pick<Review, "authorName" | "text" | "rating" | "sortOrder" | "isActive">>;
