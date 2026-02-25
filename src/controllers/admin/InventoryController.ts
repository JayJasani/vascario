import { revalidatePath } from "next/cache";
import { isValidId } from "@/lib/parse-form";
import {
    getAllProducts,
    getStockLevelsByProductId,
    updateStockLevel,
    createAuditLog,
} from "@/lib/firebase-helpers";

export interface AdminStockView {
    id: string;
    name: string;
    sku: string | null;
    sizes: string[];
    stock: Array<{
        id: string;
        size: string;
        quantity: number;
        lowThreshold: number;
    }>;
}

export async function getStockLevels(): Promise<AdminStockView[]> {
    const products = await getAllProducts();
    const activeProducts = products.filter((p) => p.isActive);
    activeProducts.sort((a, b) => a.name.localeCompare(b.name));

    return Promise.all(
        activeProducts.map(async (product) => {
            const stock = await getStockLevelsByProductId(product.id);
            return {
                id: product.id,
                name: product.name,
                sku: product.sku ?? null,
                sizes: product.sizes,
                stock: stock.map((s) => ({
                    id: s.id,
                    size: s.size,
                    quantity: s.quantity,
                    lowThreshold: s.lowThreshold,
                })),
            };
        })
    );
}

export async function updateStock(stockLevelId: string, quantity: number): Promise<void> {
    if (!isValidId(stockLevelId)) return;
    const stockLevel = await updateStockLevel(stockLevelId, quantity);
    if (!stockLevel) return;

    await createAuditLog({
        action: "STOCK_UPDATED",
        entity: "StockLevel",
        entityId: stockLevelId,
        details: {
            newQuantity: quantity,
            productId: stockLevel.productId,
            size: stockLevel.size,
        },
    });

    revalidatePath("/admin/inventory");
    revalidatePath("/admin");
}
