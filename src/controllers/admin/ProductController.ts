import { revalidatePath, revalidateTag } from "next/cache";
import {
    getString,
    getStringOrNull,
    getFloat,
    getFloatOrNull,
    getStringArray,
    getSizes,
    getBoolean,
    isValidId,
} from "@/lib/parse-form";
import {
    getAllProducts,
    getProductById,
    getStockLevelsByProductId,
    createProduct as createProductRepo,
    updateProduct as updateProductRepo,
    deleteProduct as deleteProductRepo,
    deleteStockLevelsByProductId,
    createStockLevel,
    getNewsletterSubscriptions,
    createAuditLog,
} from "@/lib/firebase-helpers";
import { CACHE_TAGS } from "@/lib/storefront-cache";

export interface AdminProductView {
    id: string;
    name: string;
    description: string;
    price: string;
    cutPrice: string | null;
    images: string[];
    colors: string[];
    sizes: string[];
    sku: string | null;
    isActive: boolean;
    isFeatured: boolean;
    createdAt: string;
    stock: Array<{
        id: string;
        size: string;
        quantity: number;
        lowThreshold: number;
    }>;
}

export async function getProducts(): Promise<AdminProductView[]> {
    const products = await getAllProducts();
    return Promise.all(
        products.map(async (product) => {
            const stock = await getStockLevelsByProductId(product.id);
            return {
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price.toString(),
                cutPrice: product.cutPrice != null ? product.cutPrice.toString() : null,
                images: product.images,
                colors: product.colors,
                sizes: product.sizes,
                sku: product.sku ?? null,
                isActive: product.isActive,
                isFeatured: product.isFeatured ?? false,
                createdAt: product.createdAt.toISOString(),
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

export async function createProduct(formData: FormData): Promise<void> {
    const name = getString(formData, "name");
    const description = getString(formData, "description");
    const price = getFloat(formData, "price");
    const cutPrice = getFloatOrNull(formData, "cutPrice");
    const sku = getStringOrNull(formData, "sku");
    const images = getStringArray(formData, "images");
    const colors = getStringArray(formData, "colors");
    const sizes = getSizes(formData);
    const isFeatured = getBoolean(formData, "isFeatured");

    if (!name.trim() || isNaN(price) || price < 0) {
        throw new Error("Name and price are required.");
    }
    if (colors.length === 0 || sizes.length === 0) {
        throw new Error("At least one color and one size are required.");
    }

    const product = await createProductRepo({
        name,
        description,
        price,
        cutPrice,
        sku,
        images,
        colors,
        sizes,
        isActive: true,
        isFeatured,
    });

    await Promise.all(
        sizes.map((size) =>
            createStockLevel({
                productId: product.id,
                size,
                quantity: 0,
                lowThreshold: 5,
            })
        )
    );

    await createAuditLog({
        action: "PRODUCT_CREATED",
        entity: "Product",
        entityId: product.id,
        details: { name },
    });

    try {
        const subscribers = await getNewsletterSubscriptions();
        const emails = subscribers.map((s) => s.email);
        console.log(
            "[Newsletter] New drop created:",
            name,
            "would be announced to",
            emails.length,
            "subscribers."
        );
    } catch (err) {
        console.error("Failed to load newsletter subscribers for new drop notification:", err);
    }

    revalidatePath("/admin/drops");
    revalidatePath("/admin/inventory");
    revalidatePath("/admin");
    revalidateTag(CACHE_TAGS.activeProducts, "max");
}

export async function toggleProductActive(productId: string): Promise<void> {
    const product = await getProductById(productId);
    if (!product || !isValidId(productId)) return;

    await updateProductRepo(productId, { isActive: !product.isActive });

    revalidatePath("/admin/drops");
    revalidatePath("/admin");
    revalidateTag(CACHE_TAGS.activeProducts, "max");
    revalidateTag(CACHE_TAGS.product(productId), "max");
}

export async function toggleProductFeatured(productId: string): Promise<void> {
    const product = await getProductById(productId);
    if (!product || !isValidId(productId)) return;

    await updateProductRepo(productId, { isFeatured: !(product.isFeatured ?? false) });

    revalidatePath("/admin/drops");
    revalidatePath("/admin");
    revalidateTag(CACHE_TAGS.activeProducts, "max");
    revalidateTag(CACHE_TAGS.product(productId), "max");
}

export async function updateProduct(productId: string, formData: FormData): Promise<void> {
    if (!isValidId(productId)) return;
    const existing = await getProductById(productId);
    if (!existing) return;

    const name = getString(formData, "name").trim() || existing.name;
    const description = getString(formData, "description") || existing.description;
    const price = getFloat(formData, "price");
    const cutPrice = getFloatOrNull(formData, "cutPrice");
    const sku = getStringOrNull(formData, "sku");
    const imagesRaw = getStringArray(formData, "images");
    const images = imagesRaw.length > 0 ? imagesRaw : existing.images;
    const colorsRaw = getStringArray(formData, "colors");
    const colors = colorsRaw.length > 0 ? colorsRaw : existing.colors;
    const sizesRaw = getSizes(formData);
    const sizes = sizesRaw.length > 0 ? sizesRaw : existing.sizes;
    const isFeatured = getBoolean(formData, "isFeatured");

    if (isNaN(price) || price < 0) {
        throw new Error("Valid price is required.");
    }

    await updateProductRepo(productId, {
        name,
        description,
        price,
        cutPrice,
        sku,
        images,
        colors,
        sizes,
        isFeatured,
    });

    const existingStock = await getStockLevelsByProductId(productId);
    const existingSizes = new Set(existingStock.map((s) => s.size));
    for (const size of sizes) {
        if (!existingSizes.has(size)) {
            await createStockLevel({
                productId,
                size,
                quantity: 0,
                lowThreshold: 5,
            });
        }
    }

    await createAuditLog({
        action: "PRODUCT_UPDATED",
        entity: "Product",
        entityId: productId,
        details: { name },
    });

    revalidatePath("/admin/drops");
    revalidatePath("/admin/inventory");
    revalidatePath("/admin");
    revalidateTag(CACHE_TAGS.activeProducts, "max");
    revalidateTag(CACHE_TAGS.product(productId), "max");
}

export async function deleteProduct(productId: string): Promise<void> {
    const product = await getProductById(productId);
    if (!product || !isValidId(productId)) return;

    await deleteStockLevelsByProductId(productId);
    await deleteProductRepo(productId);

    await createAuditLog({
        action: "PRODUCT_DELETED",
        entity: "Product",
        entityId: productId,
        details: { name: product.name },
    });

    revalidatePath("/admin/drops");
    revalidatePath("/admin/inventory");
    revalidatePath("/admin");
    revalidateTag(CACHE_TAGS.activeProducts, "max");
    revalidateTag(CACHE_TAGS.product(productId), "max");
}
