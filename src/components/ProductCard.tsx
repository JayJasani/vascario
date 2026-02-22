"use client"

import Image from "next/image"
import Link from "next/link"
import { useCurrency } from "@/context/CurrencyContext"
import { getImageAlt } from "@/lib/seo-utils"
import { trackSelectItem } from "@/lib/analytics"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
  tag?: string
  /** Total stock across all sizes. If 0, card shows "Out of stock". */
  totalStock?: number
}

interface ProductCardProps {
  product: Product
  variant?: "default" | "featured" | "grid"
  aspectClass?: string
  href?: string
}

export function ProductCard({ product, variant = "default", aspectClass, href }: ProductCardProps) {
  const { formatPrice } = useCurrency()
  const isFeatured = variant === "featured"
  const isGrid = variant === "grid"
  // Only show "Out of stock" when total stock is explicitly 0 (not when undefined). If any size has stock, don't show.
  const outOfStock = product.totalStock !== undefined && product.totalStock <= 0

  const linkClass = isGrid
    ? "group relative block w-full overflow-hidden border border-[var(--vsc-gray-700)] hover:border-[var(--vsc-accent)] transition-colors duration-200"
    : isFeatured
      ? "group relative block overflow-hidden border border-[var(--vsc-gray-700)] hover:border-[var(--vsc-accent)] transition-colors duration-200 w-full sm:min-w-[380px] md:min-w-[480px]"
      : "group relative block overflow-hidden border border-[var(--vsc-gray-700)] hover:border-[var(--vsc-accent)] transition-colors duration-200 w-full sm:min-w-[300px] md:min-w-[360px]"

  const aspect = aspectClass ?? "aspect-[3/4]"
  const targetHref = href ?? `/product/${product.slug}`

  const handleClick = () => {
    trackSelectItem({
      item_list_id: "collection",
      item_list_name: "Collection",
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
      }],
    })
  }

  return (
    <Link href={targetHref} className={linkClass} onClick={handleClick}>
      {/* Image container */}
      <div
        className={`relative overflow-hidden bg-[var(--vsc-gray-800)] ${aspect}`}
      >
        <div className="absolute inset-0 bg-[var(--vsc-gray-900)]">
          {/* Placeholder pattern when no real image is available */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(45deg, var(--vsc-gray-700) 25%, transparent 25%),
                linear-gradient(-45deg, var(--vsc-gray-700) 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, var(--vsc-gray-700) 75%),
                linear-gradient(-45deg, transparent 75%, var(--vsc-gray-700) 75%)
              `,
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
            }}
          />
        </div>

        {/* Snap zoom on hover */}
        <div className="absolute inset-0 transform transition-transform duration-150 ease-[var(--ease-out-quart)] group-hover:scale-[1.08]">
          {product.images[0] && !product.images[0].includes("placeholder") && (
            <Image
              src={product.images[0]}
              alt={getImageAlt("product", product.name)}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 80vw, 480px"
              loading="lazy"
            />
          )}
        </div>

        {/* Tag */}
        {product.tag && (
          <div
            className="absolute top-3 left-3 px-3 py-1 bg-[var(--vsc-accent)] text-[var(--vsc-white)] text-[10px] font-bold uppercase tracking-[0.15em] z-10"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            {product.tag}
          </div>
        )}
        {/* Out of stock overlay */}
        {outOfStock && (
          <div
            className="absolute inset-0 bg-[var(--vsc-gray-900)]/70 flex items-center justify-center z-10"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            <span className="text-[var(--vsc-white)] text-xs font-bold uppercase tracking-[0.2em]">
              Out of stock
            </span>
          </div>
        )}
      </div>

      {/* Info bar — stays dark with white text on hover */}
      <div className="flex items-center justify-between px-4 py-3 md:px-5 md:py-4 bg-[var(--vsc-gray-900)] transition-colors duration-200">
        <div className="flex-1 min-w-0">
          <h3
            className="text-xs md:text-sm font-bold uppercase tracking-[0.05em] text-[var(--vsc-white)] truncate transition-colors duration-200"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {product.name}
          </h3>
        </div>
        <div className="flex items-center gap-2 md:gap-4 ml-3 md:ml-4 shrink-0">
          <span
            className="text-xs md:text-sm font-bold text-[var(--vsc-white)] transition-colors duration-200"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            {formatPrice(product.price)}
          </span>
          <span
            className={`text-[10px] md:text-xs font-bold tracking-[0.12em] md:tracking-[0.15em] transition-colors duration-200 ${outOfStock ? "text-[var(--vsc-gray-500)]" : "text-[var(--vsc-white)] group-hover:text-[var(--vsc-white)]"}`}
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            {outOfStock ? "OUT OF STOCK" : "ADD →"}
          </span>
        </div>
      </div>
    </Link>
  )
}
