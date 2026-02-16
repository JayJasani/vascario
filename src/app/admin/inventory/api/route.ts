import { NextResponse } from "next/server";
import { getStockLevels } from "../../actions";

export const dynamic = "force-dynamic";

export async function GET() {
    const inventory = await getStockLevels();
    return NextResponse.json(inventory);
}
