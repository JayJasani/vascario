import { NextResponse } from "next/server";
import { getAdminUsers } from "../../actions";

export const dynamic = "force-dynamic";

export async function GET() {
    const users = await getAdminUsers();
    return NextResponse.json(users);
}

