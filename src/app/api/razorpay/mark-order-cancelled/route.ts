import { NextRequest, NextResponse } from "next/server"
import { FieldValue } from "firebase-admin/firestore"
import { db, COLLECTIONS } from "@/lib/firebase"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const razorpayOrderId =
            (body.razorpayOrderId as string | undefined) ??
            (body.razorpay_order_id as string | undefined)

        if (!razorpayOrderId) {
            return NextResponse.json(
                { error: "Missing Razorpay order id" },
                { status: 400 },
            )
        }

        const snapshot = await db
            .collection(COLLECTIONS.ORDERS)
            .where("razorpayOrderId", "==", razorpayOrderId)
            .limit(1)
            .get()

        if (snapshot.empty) {
            return NextResponse.json(
                { success: false, error: "Order not found for Razorpay id" },
                { status: 404 },
            )
        }

        const docRef = snapshot.docs[0].ref

        try {
            await docRef.update({
                status: "CANCELLED",
                updatedAt: FieldValue.serverTimestamp(),
            })
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error("Failed to mark order as cancelled", err)
            return NextResponse.json(
                { error: "Unable to update order status" },
                { status: 500 },
            )
        }

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error handling Razorpay order cancel", error)
        return NextResponse.json(
            { error: "Unable to process cancel request" },
            { status: 500 },
        )
    }
}

