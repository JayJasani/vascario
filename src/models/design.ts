export interface Design {
    id: string;
    imageUrl: string;
    placement: { x: number; y: number; scale: number };
    createdAt: Date;
}

export type DesignCreateInput = Omit<Design, "id" | "createdAt">;
