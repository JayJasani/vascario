import { getPageMetadata } from "@/lib/seo-config"
import CheckoutPageClient from "./CheckoutPageClient"

export const metadata = getPageMetadata("checkout")

export default function CheckoutPage() {
    return <CheckoutPageClient />
}
