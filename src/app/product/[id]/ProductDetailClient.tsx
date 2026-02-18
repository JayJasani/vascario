"use client"

import { useState, useEffect, type ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { MarqueeStrip } from "@/components/MarqueeStrip"
import { ProductStructuredData, BreadcrumbStructuredData } from "@/components/StructuredData"
import { getImageAlt } from "@/lib/seo-utils"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import { useCurrency } from "@/context/CurrencyContext"
import { useFavourites } from "@/context/FavouritesContext"

export interface StockBySize {
    size: string;
    quantity: number;
}

export interface ProductDetailData {
    id: string;
    name: string;
    price: number;
    description: string;
    sizes: string[];
    colors: string[];
    images: string[];
    sku: string | null;
    totalStock: number;
    stockBySize: StockBySize[];
}

const HEX_COLOR = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/
function isHexColor(s: string) {
    return HEX_COLOR.test(s.trim())
}

function renderDescription(text: string) {
    if (!text) return null

    const lines = text.split(/\r?\n/)
    const blocks: ReactNode[] = []
    let currentList: string[] = []

    const flushList = () => {
        if (!currentList.length) return
        const listIndex = blocks.length
        blocks.push(
            <ul
                key={`ul-${listIndex}`}
                className="list-disc pl-5 space-y-1"
            >
                {currentList.map((item, idx) => (
                    <li key={`li-${listIndex}-${idx}`}>{item}</li>
                ))}
            </ul>
        )
        currentList = []
    }

    lines.forEach((raw, lineIndex) => {
        const line = raw.trim()
        if (!line) {
            flushList()
            return
        }

        // Bullet line: "- point" or "• point"
        if (/^[-•]\s+/.test(line)) {
            const content = line.replace(/^[-•]\s+/, "")
            currentList.push(content)
        } else {
            flushList()
            blocks.push(
                <p key={`p-${lineIndex}`} className="mb-2 last:mb-0">
                    {line}
                </p>
            )
        }
    })

    flushList()
    return blocks
}

export function ProductDetailClient({ product }: { product: ProductDetailData }) {
    const [selectedSize, setSelectedSize] = useState<string>("")
    const [selectedColor, setSelectedColor] = useState(product.colors[0] || "")
    const [quantity, setQuantity] = useState(1)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const { addItem } = useCart()
    const { user, loading } = useAuth()
    const { formatPrice, currencyCode } = useCurrency()
    const { toggleFavourite, isFavourite } = useFavourites()
    const router = useRouter()

    const currentImage = product.images[selectedImageIndex] || product.images[0]
    const hasMultipleImages = product.images.length > 1

    const stockForSelectedSize =
        product.sizes.length > 0 && selectedSize
            ? (product.stockBySize.find((s) => s.size === selectedSize)?.quantity ?? 0)
            : product.totalStock
    const hasRequiredSelections = product.sizes.length === 0 || !!selectedSize
    const canAddToCart =
        hasRequiredSelections && stockForSelectedSize > 0 && quantity <= stockForSelectedSize

    // Cap quantity to available stock when size or stock changes
    useEffect(() => {
        if (stockForSelectedSize > 0 && quantity > stockForSelectedSize) {
            setQuantity(stockForSelectedSize)
        }
    }, [stockForSelectedSize, quantity])

    // Restore cart intent from sessionStorage after login
    useEffect(() => {
        if (loading || !user) return
        
        const intentKey = `vascario:cart-intent:${product.id}`
        if (typeof window === "undefined") return
        
        try {
            const stored = sessionStorage.getItem(intentKey)
            if (stored) {
                const intent = JSON.parse(stored)
                if (intent.size) setSelectedSize(intent.size)
                if (intent.color) setSelectedColor(intent.color)
                if (intent.quantity) setQuantity(intent.quantity)
                // Clear the intent - don't auto-add, let user click button
                sessionStorage.removeItem(intentKey)
            }
        } catch (err) {
            console.error("Failed to restore cart intent", err)
        }
    }, [user, loading, product.id])

    const showPrevImage = () => {
        if (!hasMultipleImages) return
        setSelectedImageIndex((prev) =>
            prev === 0 ? product.images.length - 1 : prev - 1
        )
    }

    const showNextImage = () => {
        if (!hasMultipleImages) return
        setSelectedImageIndex((prev) =>
            prev === product.images.length - 1 ? 0 : prev + 1
        )
    }

    return (
        <main className="min-h-screen">
            <ProductStructuredData product={product} />
            <BreadcrumbStructuredData 
                items={[
                    { name: "Home", url: "/" },
                    { name: "Collection", url: "/collection" },
                    { name: product.name, url: `/product/${product.id}` }
                ]}
            />
            <Navbar />

            {/* Product section */}
            <section className="pt-28 md:pt-36 pb-20 md:pb-32">
                {/* Breadcrumb */}
                <div className="px-6 md:px-12 lg:px-20 mb-8">
                    <div className="flex items-center gap-2">
                        <Link
                            href="/"
                            className="text-[10px] text-[var(--vsc-gray-600)] uppercase tracking-[0.2em] hover:text-[var(--vsc-accent)] transition-colors"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                            Home
                        </Link>
                        <span className="text-[var(--vsc-gray-700)] text-xs">/</span>
                        <Link
                            href="/collection"
                            className="text-[10px] text-[var(--vsc-gray-600)] uppercase tracking-[0.2em] hover:text-[var(--vsc-accent)] transition-colors"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                            Collection
                        </Link>
                        <span className="text-[var(--vsc-gray-700)] text-xs">/</span>
                        <span
                            className="text-[10px] text-[var(--vsc-gray-400)] uppercase tracking-[0.2em]"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                            {product.name}
                        </span>
                    </div>
                </div>

                {/* Main content — layout */}
                <div className="px-4 sm:px-6 md:px-12 lg:px-20 grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 md:gap-8">
                    {/* Left — Image Gallery (slightly wider) */}
                    <div className="md:col-span-4 lg:col-span-4">
                        {/* Main image – slightly smaller so details panel can grow */}
                        <div className="relative aspect-[4/5] max-h-[60vh] sm:max-h-[70vh] bg-[var(--vsc-gray-900)] overflow-hidden border border-[var(--vsc-gray-700)] group">
                            {currentImage ? (
                                <>
                                    <Image
                                        src={currentImage}
                                        alt={getImageAlt("product", product.name, selectedImageIndex, product.images.length)}
                                        fill
                                        className="object-cover"
                                        priority
                                        sizes="(max-width: 768px) 100vw, 60vw"
                                    />
                                    {/* Prev/Next controls */}
                                    {hasMultipleImages && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={showPrevImage}
                                                className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full bg-[var(--vsc-black)]/60 border border-[var(--vsc-gray-600)] text-[var(--vsc-white)] flex items-center justify-center hover:border-[var(--vsc-accent)] hover:text-[var(--vsc-accent)] transition-colors text-lg sm:text-xl md:text-2xl"
                                                aria-label="Previous image"
                                            >
                                                ‹
                                            </button>
                                            <button
                                                type="button"
                                                onClick={showNextImage}
                                                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full bg-[var(--vsc-black)]/60 border border-[var(--vsc-gray-600)] text-[var(--vsc-white)] flex items-center justify-center hover:border-[var(--vsc-accent)] hover:text-[var(--vsc-accent)] transition-colors text-lg sm:text-xl md:text-2xl"
                                                aria-label="Next image"
                                            >
                                                ›
                                            </button>
                                        </>
                                    )}
                                    {/* Image number indicator */}
                                    <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 flex items-center gap-2 z-10 bg-[var(--vsc-black)]/50 px-2 sm:px-3 py-1 sm:py-1.5 backdrop-blur-sm">
                                        <div className="w-6 sm:w-8 h-px bg-[var(--vsc-accent)]" />
                                        <span
                                            className="text-[9px] sm:text-[10px] text-[var(--vsc-white)] uppercase tracking-[0.2em]"
                                            style={{ fontFamily: "var(--font-space-mono)" }}
                                        >
                                            {String(selectedImageIndex + 1).padStart(2, "0")} / {String(Math.max(product.images.length, 1)).padStart(2, "0")}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Placeholder visual */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <div
                                            className="absolute inset-0 opacity-[0.04]"
                                            style={{
                                                backgroundImage: `
                          linear-gradient(45deg, var(--vsc-gray-700) 25%, transparent 25%),
                          linear-gradient(-45deg, var(--vsc-gray-700) 25%, transparent 25%),
                          linear-gradient(45deg, transparent 75%, var(--vsc-gray-700) 75%),
                          linear-gradient(-45deg, transparent 75%, var(--vsc-gray-700) 75%)
                        `,
                                                backgroundSize: "30px 30px",
                                                backgroundPosition: "0 0, 0 15px, 15px -15px, -15px 0px",
                                            }}
                                        />
                                        {/* Product name watermark */}
                                        <span
                                            className="text-[var(--vsc-gray-800)] font-bold z-10 text-center px-4"
                                            style={{
                                                fontFamily: "var(--font-space-grotesk)",
                                                fontSize: "clamp(3rem, 6vw, 6rem)",
                                                lineHeight: 0.9,
                                                letterSpacing: "-0.03em",
                                            }}
                                        >
                                            {product.name.split("—")[0]}
                                        </span>
                                    </div>
                                    {/* Image number indicator */}
                                    <div className="absolute bottom-4 left-4 flex items-center gap-2 z-10">
                                        <div className="w-8 h-px bg-[var(--vsc-accent)]" />
                                        <span
                                            className="text-[10px] text-[var(--vsc-gray-400)] uppercase tracking-[0.2em]"
                                            style={{ fontFamily: "var(--font-space-mono)" }}
                                        >
                                            01 / 01
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Thumbnail strip — smaller images to click through */}
                        {product.images.length > 0 && (
                            <div className="flex gap-2 mt-2 sm:mt-3 overflow-x-auto pb-2">
                                {product.images.map((image, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImageIndex(i)}
                                        className={`relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 shrink-0 overflow-hidden border-2 transition-colors ${selectedImageIndex === i
                                            ? "border-[var(--vsc-accent)]"
                                            : "border-[var(--vsc-gray-700)] hover:border-[var(--vsc-gray-600)]"
                                            }`}
                                    >
                                        <Image
                                            src={image}
                                            alt={getImageAlt("productThumbnail", product.name, i)}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 20vw, 10vw"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right — Product Info (still wide) — Sticky */}
                    <div className="md:col-span-7 lg:col-span-7 mt-4 sm:mt-0">
                        <div className="md:sticky md:top-24">
                            {/* Product name */}
                            <h1
                                className="text-black mb-2 sm:mb-3"
                                style={{
                                    fontFamily: "var(--font-space-grotesk)",
                                    fontSize: "clamp(1.25rem, 4vw, 2.5rem)",
                                    fontWeight: 700,
                                    letterSpacing: "-0.02em",
                                    lineHeight: 1,
                                    textTransform: "uppercase",
                                }}
                            >
                                {product.name}
                            </h1>

                            {/* Price */}
                            <div className="flex items-baseline gap-2 sm:gap-3 mb-4 sm:mb-6">
                                <span
                                    className="text-xl sm:text-2xl text-[var(--vsc-accent)] font-bold"
                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                >
                                    {formatPrice(product.price)}
                                </span>
                                <span
                                    className="text-[9px] sm:text-[10px] text-[var(--vsc-gray-600)] uppercase tracking-[0.2em]"
                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                >
                                    {currencyCode}
                                </span>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-[var(--vsc-gray-700)] mb-4 sm:mb-6" />

                            {/* Description */}
                            <div
                                className="text-xs sm:text-sm text-[var(--vsc-gray-400)] leading-relaxed mb-6 sm:mb-8 space-y-2"
                                style={{ fontFamily: "var(--font-space-mono)" }}
                            >
                                {renderDescription(product.description)}
                            </div>

                            {/* Color selector */}
                            {product.colors.length > 0 && (
                                <div className="mb-6">
                                    <span
                                        className="text-[10px] text-[var(--vsc-accent)] uppercase tracking-[0.3em] block mb-3"
                                        style={{ fontFamily: "var(--font-space-mono)" }}
                                    >
                                        Color — {selectedColor}
                                    </span>
                                    <div className="flex gap-2 flex-wrap items-center">
                                        {product.colors.map((color) => (
                                            isHexColor(color) ? (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`w-8 h-8 shrink-0 border-2 transition-all duration-200 ${selectedColor === color
                                                        ? "border-[var(--vsc-accent)] ring-2 ring-[var(--vsc-accent)] ring-offset-2 ring-offset-[var(--vsc-black)]"
                                                        : "border-[var(--vsc-gray-700)] hover:border-[var(--vsc-gray-500)]"
                                                        }`}
                                                    style={{ backgroundColor: color }}
                                                    title={color}
                                                    aria-label={`Color ${color}`}
                                                />
                                            ) : (
                                                <button
                                                    key={color}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] border transition-all duration-200 ${selectedColor === color
                                                        ? "bg-[var(--vsc-accent)] text-[var(--vsc-black)] border-[var(--vsc-accent)]"
                                                        : "bg-transparent text-[var(--vsc-white)] border-[var(--vsc-gray-700)] hover:border-[var(--vsc-accent)] hover:text-[var(--vsc-accent)]"
                                                        }`}
                                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                                >
                                                    {color}
                                                </button>
                                            )
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Size selector */}
                            {product.sizes.length > 0 && (
                                <div className="mb-6">
                                    <span
                                        className="text-[10px] text-[var(--vsc-accent)] uppercase tracking-[0.3em] block mb-3"
                                        style={{ fontFamily: "var(--font-space-mono)" }}
                                    >
                                        Size {selectedSize && `— ${selectedSize}`}
                                    </span>
                                    <div className="flex gap-2 flex-wrap">
                                        {product.sizes.map((size) => {
                                            const sizeStock = product.stockBySize.find((s) => s.size === size)?.quantity ?? 0
                                            const inStock = sizeStock > 0
                                            return (
                                                <button
                                                    key={size}
                                                    type="button"
                                                    disabled={!inStock}
                                                    onClick={() => inStock && setSelectedSize(size)}
                                                    className={`px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] border-2 transition-all duration-200 ${!inStock
                                                        ? "opacity-50 cursor-not-allowed border-[var(--vsc-gray-700)] text-[var(--vsc-gray-500)]"
                                                        : selectedSize === size
                                                            ? "bg-[var(--vsc-accent)] text-[var(--vsc-black)] border-transparent"
                                                            : "bg-transparent text-[var(--vsc-white)] border-[var(--vsc-gray-700)] hover:border-[var(--vsc-accent)] hover:text-[var(--vsc-accent)]"
                                                        }`}
                                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                                    title={inStock ? `${sizeStock} in stock` : "Out of stock"}
                                                >
                                                    {size}
                                                    {!inStock && " (0)"}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Stock */}
                            <div className="mb-6">
                                <span
                                    className="text-[10px] text-[var(--vsc-accent)] uppercase tracking-[0.3em] block mb-1"
                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                >
                                    Stock
                                </span>
                                <span
                                    className={`text-sm font-bold ${stockForSelectedSize > 0 ? "text-[var(--vsc-accent)]" : "text-[var(--vsc-gray-500)]"}`}
                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                >
                                    {product.sizes.length > 0 && selectedSize
                                        ? stockForSelectedSize > 0
                                            ? `${stockForSelectedSize} in stock for ${selectedSize}`
                                            : `Out of stock for ${selectedSize}`
                                        : product.totalStock > 0
                                            ? `${product.totalStock} in stock`
                                            : "Out of stock"}
                                </span>
                            </div>

                            {/* Quantity */}
                            <div className="mb-6 sm:mb-8">
                                <span
                                    className="text-[10px] text-[var(--vsc-accent)] uppercase tracking-[0.3em] block mb-2 sm:mb-3"
                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                >
                                    Quantity
                                </span>
                                <div className="flex items-center border border-[var(--vsc-gray-700)] inline-flex">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold text-[var(--vsc-white)] hover:text-[var(--vsc-accent)] hover:bg-[var(--vsc-gray-800)] transition-colors duration-200"
                                        style={{ fontFamily: "var(--font-space-mono)" }}
                                    >
                                        −
                                    </button>
                                    <span
                                        className="px-6 sm:px-8 py-2 text-xs sm:text-sm font-bold text-black border-x border-[var(--vsc-gray-700)]"
                                        style={{ fontFamily: "var(--font-space-mono)" }}
                                    >
                                        {String(quantity).padStart(2, "0")}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.min(quantity + 1, stockForSelectedSize))}
                                        disabled={quantity >= stockForSelectedSize}
                                        className="px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold text-[var(--vsc-white)] hover:text-[var(--vsc-accent)] hover:bg-[var(--vsc-gray-800)] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{ fontFamily: "var(--font-space-mono)" }}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Add to Cart */}
                            <button
                                type="button"
                                disabled={!canAddToCart}
                                onClick={() => {
                                    if (!user) {
                                        // Store cart intent before redirecting
                                        const intentKey = `vascario:cart-intent:${product.id}`
                                        if (typeof window !== "undefined") {
                                            try {
                                                sessionStorage.setItem(intentKey, JSON.stringify({
                                                    size: selectedSize,
                                                    color: selectedColor,
                                                    quantity,
                                                }))
                                            } catch (err) {
                                                console.error("Failed to store cart intent", err)
                                            }
                                        }
                                        router.push(`/login?redirect=/product/${product.id}`)
                                        return
                                    }
                                    // Require size selection if sizes are available
                                    if (product.sizes.length > 0 && !selectedSize) {
                                        alert("Please select a size before adding to cart.")
                                        return
                                    }
                                    // Require color selection if colors are available
                                    if (product.colors.length > 0 && !selectedColor) {
                                        alert("Please select a color before adding to cart.")
                                        return
                                    }
                                    if (!canAddToCart) return

                                    addItem({
                                        id: product.id,
                                        name: product.name,
                                        price: product.price,
                                        image: product.images[0] ?? "",
                                        size: selectedSize || "OS", // Only "OS" if no sizes available
                                        quantity,
                                    })
                                }}
                                className={`w-full py-2.5 sm:py-3 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] transition-all duration-200 ${canAddToCart
                                    ? "bg-[var(--vsc-accent)] text-black hover:bg-black hover:text-[var(--vsc-accent)] hover:shadow-[0_0_24px_var(--vsc-accent-dim)] cursor-pointer"
                                    : "bg-[var(--vsc-gray-700)] text-[var(--vsc-gray-500)] cursor-not-allowed"
                                    }`}
                                style={{ fontFamily: "var(--font-space-mono)", border: "2px solid #000" }}
                            >
                                {canAddToCart
                                    ? `Add to Cart — ${formatPrice(product.price * quantity)}`
                                    : !hasRequiredSelections
                                        ? "Select a size"
                                        : stockForSelectedSize === 0
                                            ? "Out of stock"
                                            : `Max ${stockForSelectedSize} available`}
                            </button>

                            {/* Favourite toggle */}
                            <button
                                type="button"
                                onClick={() => {
                                    if (!user) {
                                        router.push(`/login?redirect=/product/${product.id}`)
                                        return
                                    }
                                    toggleFavourite({
                                        id: product.id,
                                        name: product.name,
                                        price: product.price,
                                        image: product.images[0] ?? "",
                                    })
                                }}
                                className="mt-3 w-full py-2 border border-[var(--vsc-gray-700)] text-xs font-bold uppercase tracking-[0.18em] text-[var(--vsc-gray-700)] hover:border-[var(--vsc-accent)] hover:text-[var(--vsc-accent)] transition-colors duration-200"
                                style={{ fontFamily: "var(--font-space-mono)" }}
                            >
                                {isFavourite(product.id) ? "Remove from favourites" : "Add to favourites"}
                            </button>

                            {/* SKU */}
                            {product.sku && (
                                <div className="mt-8 pt-6 border-t border-[var(--vsc-gray-700)]">
                                    <span
                                        className="text-[10px] text-[var(--vsc-accent)] uppercase tracking-[0.3em] block mb-4"
                                        style={{ fontFamily: "var(--font-space-mono)" }}
                                    >
                                        Details
                                    </span>
                                    <div className="flex items-start gap-3">
                                        <span className="text-[var(--vsc-accent)] text-xs mt-0.5">—</span>
                                        <span
                                            className="text-xs text-[var(--vsc-gray-400)] uppercase tracking-[0.1em]"
                                            style={{ fontFamily: "var(--font-space-mono)" }}
                                        >
                                            SKU: {product.sku}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Embroidery detail section */}
            <section className="py-24 md:py-32 border-t border-[var(--vsc-gray-700)]">
                <div className="px-6 md:px-12 lg:px-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                        <div>
                            <span
                                className="text-[10px] text-[var(--vsc-accent)] uppercase tracking-[0.3em] block mb-4"
                                style={{ fontFamily: "var(--font-space-mono)" }}
                            >
                                The Craft
                            </span>
                            <h2
                                className="text-[var(--vsc-white)] mb-6"
                                style={{
                                    fontFamily: "var(--font-space-grotesk)",
                                    fontSize: "clamp(2rem, 4vw, 4rem)",
                                    fontWeight: 700,
                                    letterSpacing: "-0.03em",
                                    lineHeight: 0.95,
                                    textTransform: "uppercase",
                                }}
                            >
                                Every stitch
                                <br />
                                <span className="text-[var(--vsc-accent)]">tells a story</span>
                            </h2>
                            <p
                                className="text-sm text-[var(--vsc-gray-400)] leading-relaxed max-w-md"
                                style={{ fontFamily: "var(--font-space-mono)" }}
                            >
                                Our embroidery process combines digital precision with artisan technique.
                                Each design is first mapped in high-resolution CAD, then executed on
                                commercial-grade embroidery machines with hand-selected thread palettes.
                                The result: a texture you can feel, a quality that lasts.
                            </p>
                        </div>
                        <div className="relative aspect-square bg-[var(--vsc-gray-900)] border border-[var(--vsc-gray-700)]">
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div
                                    className="absolute inset-0 opacity-[0.08]"
                                    style={{
                                        backgroundImage: `radial-gradient(circle at center, var(--vsc-accent) 1px, transparent 1px)`,
                                        backgroundSize: "12px 12px",
                                    }}
                                />
                                <span
                                    className="text-[var(--vsc-gray-600)] text-xs uppercase tracking-[0.4em] z-10"
                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                >
                                    Macro Detail
                                </span>
                                <span
                                    className="text-[var(--vsc-gray-700)] text-6xl font-bold mt-2 z-10"
                                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                                >
                                    ×4
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <MarqueeStrip />
            <Footer />
        </main>
    )
}
