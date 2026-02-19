import { getPageMetadata } from "@/lib/seo-config"
import CartPageClient from "./CartPageClient"

export const metadata = getPageMetadata("cart")

export default function CartPage() {
    return <CartPageClient />
}
