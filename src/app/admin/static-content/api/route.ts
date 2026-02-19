import { NextRequest, NextResponse } from "next/server";
import { getAllStaticContent, getStaticContentByKey, upsertStaticContent, deleteStaticContent } from "@/lib/firebase-helpers";

export async function GET() {
    try {
        const content = await getAllStaticContent();
        return NextResponse.json(content);
    } catch (error) {
        console.error("Error fetching static content:", error);
        return NextResponse.json(
            { error: "Failed to fetch static content" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { key, url, type, redirectUrl } = body;

        if (!key || !url || !type) {
            return NextResponse.json(
                { error: "Missing required fields: key, url, type" },
                { status: 400 }
            );
        }

        if (type !== "video" && type !== "image") {
            return NextResponse.json(
                { error: "Type must be 'video' or 'image'" },
                { status: 400 }
            );
        }

        const content = await upsertStaticContent(key, url, type, redirectUrl || null);
        return NextResponse.json(content);
    } catch (error) {
        console.error("Error upserting static content:", error);
        return NextResponse.json(
            { error: "Failed to save static content" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const key = searchParams.get("key");

        if (!key) {
            return NextResponse.json(
                { error: "Missing key parameter" },
                { status: 400 }
            );
        }

        await deleteStaticContent(key);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting static content:", error);
        return NextResponse.json(
            { error: "Failed to delete static content" },
            { status: 500 }
        );
    }
}
