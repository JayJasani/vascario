import Link from "next/link"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { ProductCard } from "@/components/ProductCard"
import { CATEGORIES } from "@/lib/categories"

// Simple mock products for all categories for now.
// This mirrors the products used in the homepage showcase.
const PRODUCTS = [
  {
    id: "prod_1",
    name: "Signature Tee — Onyx",
    price: 85,
    images: ["/placeholder-tee-black.png"],
    tag: "Bestseller",
  },
  {
    id: "prod_2",
    name: "Heavyweight — Charcoal",
    price: 95,
    images: ["/placeholder-tee-charcoal.png"],
    tag: "New",
  },
  {
    id: "prod_3",
    name: "Gold Edition",
    price: 120,
    images: ["/placeholder-tee-gold.png"],
    tag: "Limited",
  },
  {
    id: "prod_4",
    name: "Phantom — All Black",
    price: 110,
    images: ["/placeholder-tee-phantom.png"],
  },
  {
    id: "prod_5",
    name: "Archive 001 — Bone",
    price: 130,
    images: ["/placeholder-tee-bone.png"],
    tag: "Archive",
  },
]

export default async function CategoryProductListPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = CATEGORIES.find((c) => c.slug === slug)

  if (!category) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Header / breadcrumb */}
      <section className="pt-32 pb-10 px-6 md:px-12 lg:px-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 text-[10px] uppercase tracking-[0.2em] text-[var(--vsc-gray-600)]">
              <Link
                href="/"
                className="hover:text-[var(--vsc-accent)] transition-colors"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                Home
              </Link>
              <span className="text-[var(--vsc-gray-700)] text-xs">/</span>
              <Link
                href="/collection"
                className="hover:text-[var(--vsc-accent)] transition-colors"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                Collection
              </Link>
              <span className="text-[var(--vsc-gray-700)] text-xs">/</span>
              <span
                className="text-[var(--vsc-gray-400)]"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                Product List
              </span>
            </div>

            <h1
              className="text-section text-[var(--vsc-gray-900)] uppercase"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              {category.name}
            </h1>
            {category.tag && (
              <p
                className="mt-3 text-[10px] text-[var(--vsc-accent)] uppercase tracking-[0.3em]"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                {category.tag} · Product List
              </p>
            )}
          </div>

          <div className="text-xs text-[var(--vsc-gray-500)] uppercase tracking-[0.2em] max-w-xs">
            <p style={{ fontFamily: "var(--font-space-mono)" }}>
              Curated pieces from this collection.
              <br />
              Browse the list, then dive into product detail.
            </p>
          </div>
        </div>
      </section>

      {/* Product list grid */}
      <section className="pb-24 md:pb-32 px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              variant="grid"
              aspectClass="aspect-[3/4]"
            />
          ))}
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-[var(--vsc-gray-800)] pt-6">
          <Link
            href="/collection"
            className="text-[10px] text-[var(--vsc-gray-400)] uppercase tracking-[0.2em] hover:text-[var(--vsc-accent)] transition-colors"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            ← Back to all collections
          </Link>
          <span
            className="text-[10px] text-[var(--vsc-gray-600)] uppercase tracking-[0.2em]"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            {PRODUCTS.length.toString().padStart(2, "0")} products
          </span>
        </div>
      </section>

      <Footer />
    </main>
  )
}
