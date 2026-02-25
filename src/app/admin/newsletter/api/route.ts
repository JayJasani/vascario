import { NextResponse } from "next/server";
import { getAdminNewsletterSubscriptions } from "../../actions";

export const dynamic = "force-dynamic";

export async function GET() {
    const subscriptions = await getAdminNewsletterSubscriptions();
    return NextResponse.json(subscriptions);
}
