import { NextResponse } from "next/server";
import { getInvestmentsAction } from "../../actions";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const investments = await getInvestmentsAction();
        return NextResponse.json(investments);
    } catch (error) {
        console.error("Error fetching investments:", error);
        return NextResponse.json(
            { error: "Failed to fetch investments" },
            { status: 500 }
        );
    }
}
