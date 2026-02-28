import { NextResponse } from "next/server";
import { getCouponsAction } from "../../actions";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const coupons = await getCouponsAction();
    return NextResponse.json(coupons);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching coupons:", error);
    return NextResponse.json(
      { error: "Failed to fetch coupons" },
      { status: 500 },
    );
  }
}

