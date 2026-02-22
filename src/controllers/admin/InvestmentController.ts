import { revalidatePath } from "next/cache";
import { getString, getFloat, isValidId } from "@/lib/parse-form";
import {
    getAllInvestments,
    createInvestment as createInvestmentRepo,
    updateInvestment as updateInvestmentRepo,
    deleteInvestment as deleteInvestmentRepo,
    createAuditLog,
} from "@/lib/firebase-helpers";

export interface AdminInvestmentView {
    id: string;
    name: string;
    description: string;
    amount: string;
    createdAt: string;
    updatedAt: string;
}

export async function getInvestments(): Promise<AdminInvestmentView[]> {
    const list = await getAllInvestments();
    return list.map((i) => ({
        id: i.id,
        name: i.name,
        description: i.description,
        amount: i.amount.toString(),
        createdAt: i.createdAt.toISOString(),
        updatedAt: i.updatedAt.toISOString(),
    }));
}

export async function createInvestment(formData: FormData): Promise<void> {
    const name = getString(formData, "name").trim();
    const description = getString(formData, "description").trim() || "";
    const amount = getFloat(formData, "amount");
    if (!name || isNaN(amount) || amount < 0) throw new Error("Name and amount are required.");

    const inv = await createInvestmentRepo({ name, description, amount });
    await createAuditLog({
        action: "INVESTMENT_CREATED",
        entity: "Investment",
        entityId: inv.id,
        details: { name, amount },
    });
    revalidatePath("/admin/investment");
    revalidatePath("/admin");
}

export async function updateInvestment(id: string, formData: FormData): Promise<void> {
    if (!isValidId(id)) return;
    const name = getString(formData, "name").trim();
    const description = getString(formData, "description").trim() || "";
    const amount = getFloat(formData, "amount");
    if (!name || isNaN(amount) || amount < 0) throw new Error("Name and amount are required.");

    const result = await updateInvestmentRepo(id, { name, description, amount });
    if (!result) return;
    await createAuditLog({
        action: "INVESTMENT_UPDATED",
        entity: "Investment",
        entityId: id,
        details: { name, amount },
    });
    revalidatePath("/admin/investment");
    revalidatePath("/admin");
}

export async function deleteInvestment(id: string): Promise<void> {
    if (!isValidId(id)) return;
    await deleteInvestmentRepo(id);
    await createAuditLog({
        action: "INVESTMENT_DELETED",
        entity: "Investment",
        entityId: id,
        details: {},
    });
    revalidatePath("/admin/investment");
    revalidatePath("/admin");
}
