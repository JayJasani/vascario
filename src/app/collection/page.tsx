import { CollectionGrid } from "@/components/CollectionGrid"
import { getActiveProducts } from "../storefront-actions"
import { getCollectionMetadata } from "@/lib/seo-config"
import { ItemListStructuredDataServer } from "@/components/StructuredDataServer"
import { SEO_BASE } from "@/lib/seo-config"
import { StorefrontShell } from "@/components/layouts/StorefrontShell"

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
    totalStock: product.totalStock,
  }))

  return (
    <StorefrontShell>
      <main className="min-h-screen">
        <ItemListStructuredDataServer items={itemListItems} />
        <CollectionGrid products={products} />
      </main>
    </StorefrontShell>
  )
}
