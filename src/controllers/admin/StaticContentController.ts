import { revalidatePath, revalidateTag } from "next/cache";
import {
    getAllStaticContent,
    getStaticContentByKey,
    upsertStaticContent,
    deleteStaticContent,
    createAuditLog,
} from "@/lib/firebase-helpers";
import { CACHE_TAGS } from "@/lib/storefront-cache";
import type { StaticContent } from "@/models/static-content";

export async function getStaticContent(): Promise<StaticContent[]> {
    return getAllStaticContent();
}

export async function updateStaticContent(
    key: string,
    url: string,
    type: "video" | "image",
    redirectUrl?: string | null
): Promise<StaticContent | null> {
    const content = await upsertStaticContent(key, url, type, redirectUrl);
    if (!content) return null;

    await createAuditLog({
        action: "STATIC_CONTENT_UPDATED",
        entity: "StaticContent",
        entityId: content.id,
        details: {
            key,
            url,
            type,
            redirectUrl: redirectUrl || null,
        },
    });

    revalidatePath("/admin/static-content");
    revalidatePath("/");
    revalidatePath("/product/[slug]", "page");
    revalidateTag(CACHE_TAGS.STATIC_CONTENT, "max");

    return content;
}

export async function deleteStaticContentAction(key: string): Promise<void> {
    const content = await getStaticContentByKey(key);

    if (content) {
        await deleteStaticContent(key);

        await createAuditLog({
            action: "STATIC_CONTENT_DELETED",
            entity: "StaticContent",
            entityId: content.id,
            details: { key },
        });
    }

    revalidatePath("/admin/static-content");
    revalidatePath("/");
    revalidatePath("/product/[slug]", "page");
    revalidateTag(CACHE_TAGS.STATIC_CONTENT, "max");
}
