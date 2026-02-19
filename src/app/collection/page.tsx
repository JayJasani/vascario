import { Navbar } from "@/components/Navbar"
import { CollectionGrid } from "@/components/CollectionGrid"
import { Footer } from "@/components/Footer"
import { getActiveProducts } from "../storefront-actions"
import { getCollectionMetadata } from "@/lib/seo-config"
import { getCollectionIntroText } from "@/lib/seo-utils"
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
      {/* SEO-friendly intro text */}
      <section className="pt-28 md:pt-36 pb-8 px-6 md:px-12 lg:px-20 max-w-4xl">
        <div className="prose prose-sm max-w-none">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--vsc-gray-900)] mb-4 md:mb-6" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            Vascario Embroidered Streetwear Collection
          </h1>
          <p className="text-sm md:text-base text-[var(--vsc-gray-600)] leading-relaxed mb-6" style={{ fontFamily: "var(--font-space-mono)" }}>
            {getCollectionIntroText()}
          </p>
        </div>
      </section>
      <CollectionGrid products={products} />
      <Footer />
    </main>
  )
}
