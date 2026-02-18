import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("firebase-token");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to clear token:", error);
    return NextResponse.json({ error: "Failed to clear token" }, { status: 500 });
  }
}
