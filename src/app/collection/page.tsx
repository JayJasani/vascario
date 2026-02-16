import { Navbar } from "@/components/Navbar"
import { CollectionGrid } from "@/components/CollectionGrid"
import { Footer } from "@/components/Footer"
import { getActiveProducts } from "../storefront-actions"

export const metadata = {
  title: "Collection — VASCARIO",
  description: "Premium embroidered streetwear. Limited drops. The Drop — Season 1.",
}

export default async function CollectionPage() {
  const products = await getActiveProducts()

  return (
    <main className="min-h-screen">
      <Navbar />
      <CollectionGrid products={products} />
      <Footer />
    </main>
  )
}
