import { NextRequest, NextResponse } from "next/server"
import { FieldValue } from "firebase-admin/firestore"
import { createRazorpayOrder, getRazorpayKeyId } from "@/lib/payments/razorpay"
import { db, COLLECTIONS } from "@/lib/firebase"

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

        const rawSubtotal = body.subtotalAmount
        let subtotalAmount = Number(
            rawSubtotal === undefined || rawSubtotal === null ? amount / 100 : rawSubtotal,
        )
        if (!Number.isFinite(subtotalAmount) || subtotalAmount <= 0) {
            subtotalAmount = amount / 100
        }

        const rawDiscount = Number(body.discountAmount ?? subtotalAmount - amount / 100)
        const discountAmount =
            !Number.isFinite(rawDiscount) || rawDiscount <= 0
                ? 0
                : Math.min(subtotalAmount, rawDiscount)

        const couponCode =
            typeof body.couponCode === "string" && body.couponCode.trim()
                ? (body.couponCode as string).trim().toUpperCase()
                : null

        const order = await createRazorpayOrder({
            amount,
            currency,
            receipt,
            notes,
        })

        // Persist a server-side order record and line items for later use
        const userId = (body.userId as string | undefined) ?? null
        const shipping = body.shipping as
            | {
                  fullName: string
                  email: string
                  address: string
                  city: string
                  zip: string
                  country: string
              }
            | undefined
        const items = (body.items as
            | {
                  id: string
                  name: string
                  size: string
                  quantity: number
                  price: number
                  color?: string | null
                  image?: string | null
                  slug?: string | null
              }[]
            | undefined) ?? []

        try {
            const ordersCollection = db.collection(COLLECTIONS.ORDERS)

            const orderDocRef = await ordersCollection.add({
                userId,
                customerEmail: notes.email ?? "",
                customerName: notes.name ?? "",
                status: "PENDING",
                totalAmount: amount / 100,
                subtotalAmount,
                discountAmount,
                couponCode,
                shippingAddress: shipping ?? {
                    fullName: notes.name ?? null,
                    email: notes.email ?? null,
                    address: notes.address ?? null,
                    city: notes.city ?? null,
                    zip: notes.zip ?? null,
                    country: notes.country ?? null,
                },
                paymentId: null,
                currency,
                razorpayOrderId: order.id,
                paymentMethod: "ONLINE",
                createdAt: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp(),
            })

            const orderId = orderDocRef.id

            if (Array.isArray(items) && items.length > 0) {
                const batch = db.batch()
                const orderItemsCollection = db.collection(COLLECTIONS.ORDER_ITEMS)

                for (const item of items) {
                    const itemRef = orderItemsCollection.doc()
                    batch.set(itemRef, {
                        orderId,
                        productId: item.id,
                        designId: item.id,
                        quantity: item.quantity,
                        size: item.size,
                        color: item.color ?? null,
                        unitPrice: item.price,
                        productName: item.name,
                        productImage: item.image ?? null,
                        productSlug: item.slug ?? null,
                    })
                }

                await batch.commit()
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error("Failed to persist order details", err)
        }

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

