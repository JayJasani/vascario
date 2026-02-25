import type { DocumentSnapshot } from "firebase-admin/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { generateProductSlug } from "@/lib/seo-utils";
import { isValidId } from "@/lib/parse-form";
import { toDate, toTimestamp } from "./utils";
import type { Product } from "@/models/product";

export async function getProductById(id: string | null | undefined): Promise<Product | null> {
    if (!isValidId(id)) return null;
    const doc: DocumentSnapshot = await db.collection(COLLECTIONS.PRODUCTS).doc(id!).get();
    if (!doc.exists) return null;

    const data = doc.data()!;
    return {
        id: doc.id,
        name: data.name,
        slug: data.slug || (data.name ? data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "") : ""),
        description: data.description,
        price: Number(data.price),
        cutPrice: data.cutPrice != null ? Number(data.cutPrice) : null,
        images: data.images || [],
        colors: data.colors || [],
        sizes: data.sizes || [],
        sku: data.sku || null,
        isActive: data.isActive ?? true,
        isFeatured: (data.isFeatured as boolean) ?? false,
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt),
    } as Product;
}

export async function getProductBySlug(slug: string | null | undefined): Promise<Product | null> {
    if (!slug || typeof slug !== "string" || !slug.trim()) return null;
    const snapshot = await db
        .collection(COLLECTIONS.PRODUCTS)
        .where("slug", "==", slug)
        .limit(1)
        .get();

    if (snapshot.empty) {
        const activeSnapshot = await db
            .collection(COLLECTIONS.PRODUCTS)
            .where("isActive", "==", true)
            .get();

        for (const doc of activeSnapshot.docs) {
            const data = doc.data();
            const name = data.name as string | undefined;
            if (!name) continue;

            const candidate = (data.slug as string | undefined) || generateProductSlug(name);
            if (candidate !== slug) continue;

            if (!data.slug) {
                await doc.ref.update({
                    slug: candidate,
                    updatedAt: toTimestamp(new Date()),
                });
            }

            return {
                id: doc.id,
                name: name,
                slug: candidate,
                description: data.description,
                price: Number(data.price),
                cutPrice: data.cutPrice != null ? Number(data.cutPrice) : null,
                images: data.images || [],
                colors: data.colors || [],
                sizes: data.sizes || [],
                sku: data.sku || null,
                isActive: data.isActive ?? true,
                isFeatured: (data.isFeatured as boolean) ?? false,
                createdAt: toDate(data.createdAt),
                updatedAt: toDate(data.updatedAt),
            } as Product;
        }

        return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
        id: doc.id,
        name: data.name,
        slug: data.slug || slug,
        description: data.description,
        price: Number(data.price),
        cutPrice: data.cutPrice != null ? Number(data.cutPrice) : null,
        images: data.images || [],
        colors: data.colors || [],
        sizes: data.sizes || [],
        sku: data.sku || null,
        isActive: data.isActive ?? true,
        isFeatured: (data.isFeatured as boolean) ?? false,
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt),
    } as Product;
}

export async function getAllProducts(): Promise<Product[]> {
    const snapshot = await db.collection(COLLECTIONS.PRODUCTS).orderBy("createdAt", "desc").get();
    return snapshot.docs.map((doc: DocumentSnapshot) => {
        const data = doc.data();
        if (!data) throw new Error(`Product document ${doc.id} has no data`);
        return {
            id: doc.id,
            name: data.name as string,
            slug: (data.slug as string) || (data.name ? (data.name as string).toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "") : ""),
            description: data.description as string,
            price: Number(data.price),
            cutPrice: data.cutPrice != null ? Number(data.cutPrice) : null,
            images: (data.images as string[]) || [],
            colors: (data.colors as string[]) || [],
            sizes: (data.sizes as string[]) || [],
            sku: (data.sku as string | null) || null,
            isActive: (data.isActive as boolean) ?? true,
            isFeatured: (data.isFeatured as boolean) ?? false,
            createdAt: toDate(data.createdAt),
            updatedAt: toDate(data.updatedAt),
        } as Product;
    });
}

export async function getActiveProducts(): Promise<Product[]> {
    const snapshot = await db
        .collection(COLLECTIONS.PRODUCTS)
        .where("isActive", "==", true)
        .orderBy("createdAt", "desc")
        .get();

    return snapshot.docs.map((doc: DocumentSnapshot) => {
        const data = doc.data();
        if (!data) throw new Error(`Product document ${doc.id} has no data`);
        return {
            id: doc.id,
            name: data.name as string,
            slug: (data.slug as string) || (data.name ? (data.name as string).toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "") : ""),
            description: data.description as string,
            price: Number(data.price),
            cutPrice: data.cutPrice != null ? Number(data.cutPrice) : null,
            images: (data.images as string[]) || [],
            colors: (data.colors as string[]) || [],
            sizes: (data.sizes as string[]) || [],
            sku: (data.sku as string | null) || null,
            isActive: (data.isActive as boolean) ?? true,
            isFeatured: (data.isFeatured as boolean) ?? false,
            createdAt: toDate(data.createdAt),
            updatedAt: toDate(data.updatedAt),
        } as Product;
    });
}

export async function getFeaturedProducts(): Promise<Product[]> {
    const products = await getActiveProducts();
    return products.filter((p) => p.isFeatured);
}

export async function createProduct(
    data: Omit<Product, "id" | "createdAt" | "updatedAt" | "slug"> & { slug?: string }
): Promise<Product> {
    const now = new Date();
    const productRef = db.collection(COLLECTIONS.PRODUCTS).doc();
    const slug = data.slug || generateProductSlug(data.name);

    const productData = {
        name: data.name,
        slug: slug,
        description: data.description,
        price: data.price,
        cutPrice: data.cutPrice ?? null,
        images: data.images,
        colors: data.colors,
        sizes: data.sizes,
        sku: data.sku || null,
        isActive: data.isActive ?? true,
        isFeatured: data.isFeatured ?? false,
        createdAt: toTimestamp(now),
        updatedAt: toTimestamp(now),
    };

    await productRef.set(productData);

    return {
        id: productRef.id,
        ...data,
        slug: slug,
        createdAt: now,
        updatedAt: now,
    };
}

export async function updateProduct(id: string | null | undefined, data: Partial<Product>): Promise<void> {
    if (!isValidId(id)) return;
    const updateData: Record<string, unknown> = {
        ...data,
        updatedAt: toTimestamp(new Date()),
    };
    if (data.name && !data.slug) {
        updateData.slug = generateProductSlug(data.name);
    }
    delete updateData.id;
    delete updateData.createdAt;
    await db.collection(COLLECTIONS.PRODUCTS).doc(id!).update(updateData);
}

export async function deleteProduct(id: string | null | undefined): Promise<void> {
    if (!isValidId(id)) return;
    await db.collection(COLLECTIONS.PRODUCTS).doc(id!).delete();
}
