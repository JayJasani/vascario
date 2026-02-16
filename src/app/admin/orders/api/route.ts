import { NextResponse } from "next/server";
import { getOrders } from "../../actions";

export const dynamic = "force-dynamic";

export async function GET() {
    const orders = await getOrders();
    return NextResponse.json(orders);
}
