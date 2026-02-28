"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { HeartIcon as HeartOutlineIcon } from "@heroicons/react/24/outline"
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid"
import { useCurrency } from "@/context/CurrencyContext"
import { useAuth } from "@/context/AuthContext"
import { useFavourites } from "@/context/FavouritesContext"
import { hasDiscount, getDiscountPercentage } from "@/lib/discount"
import { getImageAlt } from "@/lib/seo-utils"
import { trackAddToWishlist, trackRemoveFromWishlist, trackSelectItem } from "@/lib/analytics"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  /** Original price before discount, shown crossed out when present */
  cutPrice?: number | null
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
  /** When true, renders a static card (no link/tracking) for admin preview */
  preview?: boolean
}

export function ProductCard({ product, variant = "default", aspectClass, href, preview }: ProductCardProps) {
  const router = useRouter()
  const { formatPrice } = useCurrency()
  const { user } = useAuth()
  const { toggleFavourite, isFavourite } = useFavourites()
  const isFeatured = variant === "featured"
  const isGrid = variant === "grid"
  // Only show "Out of stock" when total stock is explicitly 0 (not when undefined). If any size has stock, don't show.
  const outOfStock = product.totalStock !== undefined && product.totalStock <= 0
  const hasTopRightBadge = outOfStock || hasDiscount(product.cutPrice, product.price)

  const linkClass = isGrid
    ? "group relative block w-full overflow-hidden transition-colors duration-200"
    : isFeatured
      ? "group relative block overflow-hidden transition-colors duration-200 w-full sm:min-w-[380px] md:min-w-[480px]"
      : "group relative block overflow-hidden transition-colors duration-200 w-full sm:min-w-[300px] md:min-w-[360px]"

  const aspect = aspectClass ?? "aspect-[3/4]"
  const targetHref = href ?? `/product/${product.slug}`
  const isWishlisted = isFavourite(product.id)

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
    <Link
      href={targetHref}
      className={linkClass}
      onClick={handleClick}
      onMouseEnter={() => router.prefetch(targetHref)}
    >
      {/* Image container — border only around image */}
      <div
        className={`relative overflow-hidden border border-[var(--vsc-gray-700)] transition-colors duration-200 group-hover:border-[var(--vsc-accent)] bg-[var(--vsc-gray-800)] ${aspect}`}
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
            className="absolute top-3 left-3 px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-[0.15em] z-10"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            {product.tag}
          </div>
        )}

        {/* Wishlist (favourites) toggle */}
        {!preview && (
          <button
            type="button"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={`absolute ${hasTopRightBadge ? "top-12" : "top-3"} right-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white border border-white/20 hover:border-[var(--vsc-accent)] hover:text-[var(--vsc-accent)] transition-colors`}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (!user) {
                router.push(`/login?redirect=${encodeURIComponent(targetHref)}`)
                return
              }
              const wasAlreadyFavourite = isWishlisted
              toggleFavourite({
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                cutPrice: product.cutPrice ?? null,
                image: product.images[0] ?? "",
              })
              const wishlistItem = {
                item_id: product.id,
                item_name: product.name,
                price: product.price,
              }
              if (wasAlreadyFavourite) {
                trackRemoveFromWishlist({
                  currency: "INR",
                  value: product.price,
                  items: [wishlistItem],
                })
              } else {
                trackAddToWishlist({
                  currency: "INR",
                  value: product.price,
                  items: [wishlistItem],
                })
              }
            }}
            onMouseDown={(e) => {
              // Prevent link from capturing press -> navigation
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            {isWishlisted ? (
              <HeartSolidIcon className="h-4 w-4" />
            ) : (
              <HeartOutlineIcon className="h-4 w-4" />
            )}
          </button>
        )}

        {/* Discount tag — when cut price > price (top-right, unless out of stock) */}
        {!outOfStock && hasDiscount(product.cutPrice, product.price) && (
          <div
            className="absolute top-3 right-3 px-2 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-[0.12em] z-10"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            {getDiscountPercentage(product.cutPrice!, product.price)}% OFF
          </div>
        )}

        {/* Out of stock / coming soon — top right of full frame */}
        {outOfStock && (
          <div
            className="absolute top-3 right-3 px-2 py-1 rounded bg-[var(--vsc-gray-900)] text-white text-[10px] font-bold uppercase tracking-[0.12em] z-10 border border-[var(--vsc-accent)]/40"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            Coming soon
          </div>
        )}
      </div>

      {/* Info bar — column layout like admin (tile + price) */}
      <div className="flex flex-col space-y-2 pt-2 transition-colors duration-200">
        <h3
          className="text-[10px] md:text-xs font-bold uppercase tracking-[0.05em] text-black truncate transition-colors duration-200"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          {product.name}
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          {hasDiscount(product.cutPrice, product.price) && (
            <span
              className="text-xs text-[var(--vsc-gray-500)] transition-colors duration-200"
              style={{ fontFamily: "var(--font-space-mono)", textDecoration: "line-through" }}
            >
              {formatPrice(product.cutPrice!)}
            </span>
          )}
          <span
            className="text-xs md:text-sm font-bold text-black transition-colors duration-200"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </Link>
  )
}
