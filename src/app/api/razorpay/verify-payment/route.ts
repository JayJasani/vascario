import { NextRequest, NextResponse } from "next/server"
import { FieldValue } from "firebase-admin/firestore"
import { verifyRazorpaySignature } from "@/lib/payments/razorpay"
import { db, COLLECTIONS } from "@/lib/firebase"

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

        let orderDocId: string | null = null

        try {
            const snapshot = await db
                .collection(COLLECTIONS.ORDERS)
                .where("razorpayOrderId", "==", razorpay_order_id)
                .limit(1)
                .get()

            if (!snapshot.empty) {
                const doc = snapshot.docs[0]
                const docRef = doc.ref
                orderDocId = doc.id
                await docRef.update({
                    status: "PAID",
                    paymentId: razorpay_payment_id,
                    updatedAt: FieldValue.serverTimestamp(),
                })
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error("Failed to update order status after Razorpay verification", err)
        }

        return NextResponse.json({ success: true, orderId: orderDocId }, { status: 200 })
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error verifying Razorpay payment", error)
        return NextResponse.json({ error: "Unable to verify Razorpay payment" }, { status: 500 })
    }
}

