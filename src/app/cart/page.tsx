import { cookies } from "next/headers"
import { getAuth } from "firebase-admin/auth"
import { db, COLLECTIONS } from "@/lib/firebase"
import { getPageMetadata } from "@/lib/seo-config"
import CartPageClient from "./CartPageClient"
import type { CartItem } from "@/context/CartContext"

export const metadata = getPageMetadata("cart")

async function getInitialCartItems(): Promise<CartItem[]> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("firebase-token")?.value
        if (!token) return []

        const adminAuth = getAuth()
        const decoded = await adminAuth.verifyIdToken(token)
        const uid = decoded.uid

        const cartSnap = await db
            .collection(COLLECTIONS.USERS)
            .doc(uid)
            .collection("cartItems")
            .get()

        const items: CartItem[] = []
        cartSnap.forEach((doc) => {
            const data = doc.data() as {
                productId?: string
                name?: string
                price?: number
                image?: string
                size?: string
                quantity?: number
            }

            if (
                !data.productId ||
                typeof data.productId !== "string" ||
                !data.size ||
                typeof data.size !== "string" ||
                typeof data.price !== "number" ||
                !Number.isFinite(data.price) ||
                typeof data.quantity !== "number" ||
                !Number.isFinite(data.quantity) ||
                data.quantity <= 0
            ) {
                return
            }

            items.push({
                id: data.productId,
                name: typeof data.name === "string" ? data.name : "Unknown item",
                price: data.price,
                image: typeof data.image === "string" ? data.image : "",
                size: data.size,
                quantity: data.quantity,
            })
        })

        return items
    } catch (error) {
        console.error("Failed to load initial cart items:", error)
        return []
    }
}

export default async function CartPage() {
    const initialItems = await getInitialCartItems()
    return <CartPageClient initialItems={initialItems} />
}
