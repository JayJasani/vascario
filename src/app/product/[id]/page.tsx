"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { MarqueeStrip } from "@/components/MarqueeStrip"

// Mock product data
const PRODUCTS: Record<
    string,
    {
        id: string
        name: string
        price: number
        description: string
        details: string[]
        sizes: string[]
        colors: { name: string; hex: string }[]
        images: string[]
    }
> = {
    prod_1: {
        id: "prod_1",
        name: "Signature Tee — Onyx",
        price: 85,
        description:
            "The foundation piece. Constructed from 300 GSM Italian cotton with precision chain-stitch embroidery. Each thread placement is mapped digitally and executed by artisan hands. The Onyx colorway absorbs light like nothing else.",
        details: [
            "300 GSM Premium Cotton",
            "Chain-stitch Embroidery",
            "Oversized Fit",
            "Pre-washed & Pre-shrunk",
            "Made in Italy",
        ],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: [
            { name: "Onyx", hex: "#0D0D0D" },
            { name: "Charcoal", hex: "#333333" },
            { name: "Bone", hex: "#E8E4DF" },
        ],
        images: ["/placeholder-tee-black.png"],
    },
    prod_2: {
        id: "prod_2",
        name: "Heavyweight — Charcoal",
        price: 95,
        description:
            "The upgraded silhouette. Double-layered collar, reinforced shoulder seams, and a slightly dropped shoulder for that effortless drape. The charcoal dye is achieved through a proprietary stone-wash process.",
        details: [
            "320 GSM Premium Cotton",
            "Satin-stitch Embroidery",
            "Dropped Shoulder",
            "Double-layered Collar",
            "Stone-washed Finish",
        ],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: [
            { name: "Charcoal", hex: "#333333" },
            { name: "Onyx", hex: "#0D0D0D" },
        ],
        images: ["/placeholder-tee-charcoal.png"],
    },
    prod_3: {
        id: "prod_3",
        name: "Gold Edition",
        price: 120,
        description:
            "The statement. Metallic gold thread embroidery on heavyweight cotton. Limited to 200 units. Each piece individually numbered. When you wear this, people notice.",
        details: [
            "300 GSM Premium Cotton",
            "Metallic Gold Thread",
            "Limited to 200 Units",
            "Individually Numbered",
            "Authentication Certificate",
        ],
        sizes: ["S", "M", "L", "XL"],
        colors: [{ name: "Gold Edition", hex: "#1A1A1A" }],
        images: ["/placeholder-tee-gold.png"],
    },
}

function useProduct(id: string) {
    return PRODUCTS[id] || PRODUCTS.prod_1
}

export default function ProductDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    // For Next.js 16 with async params, we handle with use()
    // But for client component simplicity, extract from URL
    const id =
        typeof window !== "undefined"
            ? window.location.pathname.split("/").pop() || "prod_1"
            : "prod_1"

    const product = useProduct(id)
    const [selectedSize, setSelectedSize] = useState<string>("")
    const [selectedColor, setSelectedColor] = useState(product.colors[0])
    const [quantity, setQuantity] = useState(1)

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
                            href="/#collection"
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
                                    01 / 03
                                </span>
                            </div>
                        </div>

                        {/* Thumbnail strip */}
                        <div className="flex gap-2 mt-2">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className={`flex-1 aspect-square bg-[var(--vsc-gray-900)] border ${i === 1
                                        ? "border-[var(--vsc-accent)]"
                                        : "border-[var(--vsc-gray-700)]"
                                        } cursor-pointer hover:border-[var(--vsc-accent)] transition-colors`}
                                >
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span
                                            className="text-[10px] text-[var(--vsc-gray-600)]"
                                            style={{ fontFamily: "var(--font-space-mono)" }}
                                        >
                                            0{i}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
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
                            <div className="mb-6">
                                <span
                                    className="text-[10px] text-[var(--vsc-accent)] uppercase tracking-[0.3em] block mb-3"
                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                >
                                    Color — {selectedColor.name}
                                </span>
                                <div className="flex gap-2">
                                    {product.colors.map((color) => (
                                        <button
                                            key={color.name}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-10 h-10 border-2 transition-colors ${selectedColor.name === color.name
                                                ? "border-[var(--vsc-accent)]"
                                                : "border-[var(--vsc-gray-700)] hover:border-[var(--vsc-gray-400)]"
                                                }`}
                                            style={{ backgroundColor: color.hex }}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Size selector */}
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

                            {/* Details */}
                            <div className="mt-8 pt-6 border-t border-[var(--vsc-gray-700)]">
                                <span
                                    className="text-[10px] text-[var(--vsc-accent)] uppercase tracking-[0.3em] block mb-4"
                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                >
                                    Details
                                </span>
                                <ul className="space-y-2">
                                    {product.details.map((detail, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <span className="text-[var(--vsc-accent)] text-xs mt-0.5">—</span>
                                            <span
                                                className="text-xs text-[var(--vsc-gray-400)] uppercase tracking-[0.1em]"
                                                style={{ fontFamily: "var(--font-space-mono)" }}
                                            >
                                                {detail}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
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
