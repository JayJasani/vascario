import { NextRequest, NextResponse } from "next/server"
import { createRazorpayOrder, getRazorpayKeyId } from "@/lib/payments/razorpay"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        const amount = Number(body.amount)
        const currency = (body.currency as string | undefined) ?? "INR"
        const receipt =
            (body.receipt as string | undefined) ?? `vascario_order_${Date.now().toString(36)}`
        const notes = (body.notes ?? {}) as Record<string, string>

        if (!amount || !Number.isFinite(amount) || amount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
        }

        const order = await createRazorpayOrder({
            amount,
            currency,
            receipt,
            notes,
        })

        return NextResponse.json(
            {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                keyId: getRazorpayKeyId(),
            },
            { status: 200 },
        )
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error creating Razorpay order", error)
        return NextResponse.json({ error: "Unable to create Razorpay order" }, { status: 500 })
    }
}

