export interface Investment {
    id: string;
    name: string;
    description: string;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
}

export type InvestmentCreateInput = Omit<Investment, "id" | "createdAt" | "updatedAt">;
export type InvestmentUpdateInput = Partial<Pick<Investment, "name" | "description" | "amount">>;
