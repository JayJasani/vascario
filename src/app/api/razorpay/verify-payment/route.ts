import { NextRequest, NextResponse } from "next/server"
import { verifyRazorpaySignature } from "@/lib/payments/razorpay"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const razorpay_order_id = body.razorpay_order_id as string | undefined
        const razorpay_payment_id = body.razorpay_payment_id as string | undefined
        const razorpay_signature = body.razorpay_signature as string | undefined

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json(
                { error: "Missing Razorpay payment details" },
                { status: 400 },
            )
        }

        const isValid = verifyRazorpaySignature({
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            signature: razorpay_signature,
        })

        if (!isValid) {
            return NextResponse.json(
                { success: false, error: "Invalid payment signature" },
                { status: 400 },
            )
        }

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error verifying Razorpay payment", error)
        return NextResponse.json({ error: "Unable to verify Razorpay payment" }, { status: 500 })
    }
}

