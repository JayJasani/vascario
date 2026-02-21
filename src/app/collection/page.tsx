import { Navbar } from "@/components/Navbar"
import { CollectionGrid } from "@/components/CollectionGrid"
import { Footer } from "@/components/Footer"
import { getActiveProducts } from "../storefront-actions"
import { getCollectionMetadata } from "@/lib/seo-config"
import { ItemListStructuredDataServer } from "@/components/StructuredDataServer"
import { SEO_BASE } from "@/lib/seo-config"

export const metadata = getCollectionMetadata()

export default async function CollectionPage() {
  const products = await getActiveProducts()

  // Prepare items for ItemList structured data
  const itemListItems = products.map((product) => ({
    name: product.name,
    description: product.description,
    image: product.images[0],
    url: `/product/${product.slug}`,
    price: product.price,
  }))

  return (
    <main className="min-h-screen">
      <ItemListStructuredDataServer items={itemListItems} />
      <Navbar />
      <CollectionGrid products={products} />
      <Footer />
    </main>
  )
}
