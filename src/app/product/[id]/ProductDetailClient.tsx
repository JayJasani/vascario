"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { MarqueeStrip } from "@/components/MarqueeStrip"

export interface ProductDetailData {
    id: string;
    name: string;
    price: number;
    description: string;
    sizes: string[];
    colors: string[];
    images: string[];
    sku: string | null;
}

export function ProductDetailClient({ product }: { product: ProductDetailData }) {
    const [selectedSize, setSelectedSize] = useState<string>("")
    const [selectedColor, setSelectedColor] = useState(product.colors[0] || "")
    const [quantity, setQuantity] = useState(1)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    
    const currentImage = product.images[selectedImageIndex] || product.images[0]

    return (
        <main className="min-h-screen">
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

                {/* Main content — asymmetric 2-panel */}
                <div className="px-6 md:px-12 lg:px-20 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                    {/* Left — Image Gallery (7 cols) */}
                    <div className="md:col-span-7">
                        <div className="relative aspect-[3/4] bg-[var(--vsc-gray-900)] overflow-hidden border border-[var(--vsc-gray-700)] group">
                            {currentImage ? (
                                <>
                                    <Image
                                        src={currentImage}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                        priority
                                        sizes="(max-width: 768px) 100vw, 60vw"
                                    />
                                    {/* Image number indicator */}
                                    <div className="absolute bottom-4 left-4 flex items-center gap-2 z-10 bg-[var(--vsc-black)]/50 px-3 py-1.5 backdrop-blur-sm">
                                        <div className="w-8 h-px bg-[var(--vsc-accent)]" />
                                        <span
                                            className="text-[10px] text-[var(--vsc-white)] uppercase tracking-[0.2em]"
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

                        {/* Thumbnail strip */}
                        {product.images.length > 0 && (
                            <div className="flex gap-2 mt-2">
                                {product.images.map((image, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImageIndex(i)}
                                        className={`relative flex-1 aspect-square overflow-hidden border-2 transition-colors ${
                                            selectedImageIndex === i
                                                ? "border-[var(--vsc-accent)]"
                                                : "border-[var(--vsc-gray-700)] hover:border-[var(--vsc-gray-600)]"
                                        }`}
                                    >
                                        <Image
                                            src={image}
                                            alt={`${product.name} - Image ${i + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 20vw, 10vw"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right — Product Info (5 cols) — Sticky */}
                    <div className="md:col-span-5">
                        <div className="md:sticky md:top-24">
                            {/* Product name */}
                            <h1
                                className="text-[var(--vsc-white)] mb-2"
                                style={{
                                    fontFamily: "var(--font-space-grotesk)",
                                    fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                                    fontWeight: 700,
                                    letterSpacing: "-0.02em",
                                    lineHeight: 1,
                                    textTransform: "uppercase",
                                }}
                            >
                                {product.name}
                            </h1>

                            {/* Price */}
                            <div className="flex items-baseline gap-3 mb-6">
                                <span
                                    className="text-2xl text-[var(--vsc-accent)] font-bold"
                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                >
                                    ${product.price}
                                </span>
                                <span
                                    className="text-[10px] text-[var(--vsc-gray-600)] uppercase tracking-[0.2em]"
                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                >
                                    USD
                                </span>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-[var(--vsc-gray-700)] mb-6" />

                            {/* Description */}
                            <p
                                className="text-sm text-[var(--vsc-gray-400)] leading-relaxed mb-8"
                                style={{ fontFamily: "var(--font-space-mono)" }}
                            >
                                {product.description}
                            </p>

                            {/* Color selector */}
                            {product.colors.length > 0 && (
                                <div className="mb-6">
                                    <span
                                        className="text-[10px] text-[var(--vsc-accent)] uppercase tracking-[0.3em] block mb-3"
                                        style={{ fontFamily: "var(--font-space-mono)" }}
                                    >
                                        Color — {selectedColor}
                                    </span>
                                    <div className="flex gap-2">
                                        {product.colors.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] border transition-all duration-200 ${selectedColor === color
                                                    ? "bg-[var(--vsc-accent)] text-[var(--vsc-black)] border-[var(--vsc-accent)]"
                                                    : "bg-transparent text-[var(--vsc-white)] border-[var(--vsc-gray-700)] hover:border-[var(--vsc-accent)] hover:text-[var(--vsc-accent)]"
                                                    }`}
                                                style={{ fontFamily: "var(--font-space-mono)" }}
                                            >
                                                {color}
                                            </button>
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
                                        {product.sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] border transition-all duration-200 ${selectedSize === size
                                                    ? "bg-[var(--vsc-accent)] text-[var(--vsc-black)] border-[var(--vsc-accent)]"
                                                    : "bg-transparent text-[var(--vsc-white)] border-[var(--vsc-gray-700)] hover:border-[var(--vsc-accent)] hover:text-[var(--vsc-accent)]"
                                                    }`}
                                                style={{ fontFamily: "var(--font-space-mono)" }}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity */}
                            <div className="mb-8">
                                <span
                                    className="text-[10px] text-[var(--vsc-accent)] uppercase tracking-[0.3em] block mb-3"
                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                >
                                    Quantity
                                </span>
                                <div className="flex items-center border border-[var(--vsc-gray-700)] inline-flex">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-5 py-4 text-sm font-bold text-[var(--vsc-white)] hover:text-[var(--vsc-accent)] hover:bg-[var(--vsc-gray-800)] transition-colors duration-200"
                                        style={{ fontFamily: "var(--font-space-mono)" }}
                                    >
                                        −
                                    </button>
                                    <span
                                        className="px-8 py-4 text-sm font-bold text-[var(--vsc-white)] border-x border-[var(--vsc-gray-700)]"
                                        style={{ fontFamily: "var(--font-space-mono)" }}
                                    >
                                        {String(quantity).padStart(2, "0")}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-5 py-4 text-sm font-bold text-[var(--vsc-white)] hover:text-[var(--vsc-accent)] hover:bg-[var(--vsc-gray-800)] transition-colors duration-200"
                                        style={{ fontFamily: "var(--font-space-mono)" }}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Add to Cart */}
                            <button
                                className="w-full py-5 bg-[var(--vsc-accent)] text-[var(--vsc-black)] text-sm font-bold uppercase tracking-[0.2em] hover:bg-[var(--vsc-black)] hover:text-[var(--vsc-accent)] border-2 border-[var(--vsc-accent)] transition-all duration-200 hover:shadow-[0_0_24px_var(--vsc-accent-dim)]"
                                style={{ fontFamily: "var(--font-space-mono)" }}
                            >
                                Add to Cart — ${product.price * quantity}
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
