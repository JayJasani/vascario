import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { CollectionGrid } from "@/components/CollectionGrid"
import { getActiveProducts } from "../../storefront-actions"
import Link from "next/link"

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const products = await getActiveProducts()

  // For now, show all products. In the future, you can filter by category/slug
  // const filteredProducts = products.filter(product => product.category === slug)

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="py-12 md:py-16 px-6 md:px-12 lg:px-20">
        <div className="mb-8">
          <Link
            href="/collection"
            className="inline-flex items-center gap-2 text-[10px] text-[var(--vsc-gray-600)] uppercase tracking-[0.2em] hover:text-[var(--vsc-accent)] transition-colors mb-6"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            ← Back to Collection
          </Link>
          <h1
            className="text-section text-[var(--vsc-white)] uppercase"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ")}
          </h1>
        </div>
        <CollectionGrid products={products} />
      </section>
      <Footer />
    </main>
  )
}
