import { revalidatePath, revalidateTag } from "next/cache";
import {
    getAllReviews,
    createReview as createReviewRepo,
    updateReview as updateReviewRepo,
    deleteReview as deleteReviewRepo,
    createAuditLog,
} from "@/lib/firebase-helpers";
import { CACHE_TAGS } from "@/lib/storefront-cache";
import type { Review } from "@/models/review";

export type ReviewUpdateInput = {
    authorName?: string;
    text?: string;
    rating?: number | null;
    sortOrder?: number;
    isActive?: boolean;
};

export async function getReviews(): Promise<Review[]> {
    return getAllReviews();
}

export async function createReview(
    authorName: string,
    text: string,
    rating?: number | null,
    sortOrder?: number
): Promise<Review> {
    const review = await createReviewRepo(authorName, text, rating, sortOrder);
    await createAuditLog({
        action: "REVIEW_CREATED",
        entity: "Review",
        entityId: review.id,
        details: { authorName, text: text.slice(0, 80) },
    });
    revalidatePath("/admin/reviews");
    revalidatePath("/");
    revalidateTag(CACHE_TAGS.reviews, "max");
    return review;
}

export async function updateReview(id: string, updates: ReviewUpdateInput): Promise<Review | null> {
    const review = await updateReviewRepo(id, updates);
    if (!review) return null;
    await createAuditLog({
        action: "REVIEW_UPDATED",
        entity: "Review",
        entityId: id,
        details: updates,
    });
    revalidatePath("/admin/reviews");
    revalidatePath("/");
    revalidateTag(CACHE_TAGS.reviews, "max");
    return review;
}

export async function deleteReview(id: string): Promise<void> {
    await deleteReviewRepo(id);
    await createAuditLog({
        action: "REVIEW_DELETED",
        entity: "Review",
        entityId: id,
        details: {},
    });
    revalidatePath("/admin/reviews");
    revalidatePath("/");
    revalidateTag(CACHE_TAGS.reviews, "max");
}
