import { NextResponse } from "next/server";
import { getAdminBackInStockNotifications } from "../../actions";

export const dynamic = "force-dynamic";

export async function GET() {
    const notifications = await getAdminBackInStockNotifications();
    return NextResponse.json(notifications);
}
