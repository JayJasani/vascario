import { NextResponse } from "next/server";
import { getReviewsAction } from "../../actions";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const reviews = await getReviewsAction();
        return NextResponse.json(
            reviews.map((r) => ({
                id: r.id,
                authorName: r.authorName,
                text: r.text,
                rating: r.rating ?? null,
                sortOrder: r.sortOrder,
                isActive: r.isActive,
                createdAt: r.createdAt.toISOString(),
                updatedAt: r.updatedAt.toISOString(),
            }))
        );
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json(
            { error: "Failed to fetch reviews" },
            { status: 500 }
        );
    }
}
