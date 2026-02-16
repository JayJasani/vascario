"use client"

import Image from "next/image"
import Link from "next/link"

interface Product {
  id: string
  name: string
  price: number
  images: string[]
  tag?: string
}

interface ProductCardProps {
  product: Product
  variant?: "default" | "featured" | "grid"
  aspectClass?: string
}

export function ProductCard({ product, variant = "default", aspectClass }: ProductCardProps) {
  const isFeatured = variant === "featured"
  const isGrid = variant === "grid"

  const linkClass = isGrid
    ? "group relative block w-full overflow-hidden border border-[var(--vsc-gray-700)] hover:border-[var(--vsc-accent)] transition-colors duration-200"
    : isFeatured
      ? "group relative block overflow-hidden border border-[var(--vsc-gray-700)] hover:border-[var(--vsc-accent)] transition-colors duration-200 min-w-[380px] md:min-w-[480px]"
      : "group relative block overflow-hidden border border-[var(--vsc-gray-700)] hover:border-[var(--vsc-accent)] transition-colors duration-200 min-w-[300px] md:min-w-[360px]"

  const aspect = aspectClass ?? "aspect-[3/4]"

  return (
    <Link href={`/product/${product.id}`} className={linkClass}>
      {/* Image container with chromatic aberration */}
      <div
        className={`relative overflow-hidden bg-[var(--vsc-gray-800)] chromatic-hover ${aspect}`}
      >
        <div className="absolute inset-0 bg-[var(--vsc-gray-900)] flex items-center justify-center">
          {/* Placeholder pattern when no real image is available */}
          <div className="absolute inset-0 opacity-10"
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
          <span
            className="text-[var(--vsc-gray-600)] text-xs uppercase tracking-[0.3em] z-10"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            {product.name}
          </span>
        </div>

        {/* Snap zoom on hover */}
        <div className="absolute inset-0 transform transition-transform duration-150 ease-[var(--ease-out-quart)] group-hover:scale-[1.08]">
          {product.images[0] && !product.images[0].includes("placeholder") && (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 80vw, 480px"
            />
          )}
        </div>

        {/* Tag */}
        {product.tag && (
          <div
            className="absolute top-3 left-3 px-3 py-1 bg-[var(--vsc-accent)] text-[var(--vsc-black)] text-[10px] font-bold uppercase tracking-[0.15em] z-10"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            {product.tag}
          </div>
        )}
      </div>

      {/* Info bar — inverts on hover */}
      <div className="flex items-center justify-between px-5 py-4 bg-[var(--vsc-gray-900)] group-hover:bg-[var(--vsc-accent)] transition-colors duration-200">
        <div className="flex-1 min-w-0">
          <h3
            className="text-sm font-bold uppercase tracking-[0.05em] text-[var(--vsc-white)] group-hover:text-[var(--vsc-black)] truncate transition-colors duration-200"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {product.name}
          </h3>
        </div>
        <div className="flex items-center gap-4 ml-4 shrink-0">
          <span
            className="text-sm font-bold text-[var(--vsc-white)] group-hover:text-[var(--vsc-black)] transition-colors duration-200"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            ${product.price.toFixed(0)}
          </span>
          <span
            className="text-xs font-bold text-[var(--vsc-accent)] group-hover:text-[var(--vsc-black)] tracking-[0.15em] transition-colors duration-200"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            ADD →
          </span>
        </div>
      </div>
    </Link>
  )
}
