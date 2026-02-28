import { NextRequest, NextResponse } from "next/server"
import { FieldValue } from "firebase-admin/firestore"
import { db, COLLECTIONS } from "@/lib/firebase"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        const totalAmount = Number(body.totalAmount)
        const currency = (body.currency as string | undefined) ?? "INR"

        if (!totalAmount || !Number.isFinite(totalAmount) || totalAmount <= 0) {
            return NextResponse.json({ error: "Invalid total amount" }, { status: 400 })
        }

        const userId = (body.userId as string | undefined) ?? null
        const shipping = body.shipping as
            | {
                  fullName: string
                  email: string
                  phone?: string
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

        const ordersCollection = db.collection(COLLECTIONS.ORDERS)

        const orderDocRef = await ordersCollection.add({
            userId,
            customerEmail: shipping?.email ?? "",
            customerName: shipping?.fullName ?? "",
            status: "PENDING",
            totalAmount,
            shippingAddress: shipping ?? {},
            paymentId: null,
            currency,
            razorpayOrderId: null,
            paymentMethod: "COD",
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

        return NextResponse.json(
            {
                orderId,
                currency,
                totalAmount,
            },
            { status: 200 },
        )
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error creating COD order", error)
        return NextResponse.json({ error: "Unable to create COD order" }, { status: 500 })
    }
}

