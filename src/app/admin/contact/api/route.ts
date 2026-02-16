import { NextResponse } from "next/server";
import { getAdminContactSubmissions } from "../../actions";

export const dynamic = "force-dynamic";

export async function GET() {
    const submissions = await getAdminContactSubmissions();
    return NextResponse.json(submissions);
}
