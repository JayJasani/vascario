"use client"

import { useRef, useState, useEffect } from "react"
import { ProductCard } from "@/components/ProductCard"

interface ShowcaseProduct {
    id: string;
    name: string;
    slug: string;
    price: number;
    cutPrice?: number | null;
    images: string[];
    tag?: string;
}

interface ProductShowcaseProps {
    products: ShowcaseProduct[];
}

export function ProductShowcase({ products }: ProductShowcaseProps) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(0)

    // Drag-to-scroll
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return
        setIsDragging(true)
        setStartX(e.pageX - scrollRef.current.offsetLeft)
        setScrollLeft(scrollRef.current.scrollLeft)
    }

    const handleMouseUp = () => setIsDragging(false)
    const handleMouseLeave = () => setIsDragging(false)

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return
        e.preventDefault()
        const x = e.pageX - scrollRef.current.offsetLeft
        const walk = (x - startX) * 1.5
        scrollRef.current.scrollLeft = scrollLeft - walk
    }

    // Scroll reveal
    const sectionRef = useRef<HTMLElement>(null)
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible")
                    }
                })
            },
            { threshold: 0.1 }
        )

        const section = sectionRef.current
        if (section) observer.observe(section)
        return () => { if (section) observer.unobserve(section) }
    }, [])

    return (
        <section id="collection" ref={sectionRef} className="reveal py-24 md:py-32">
            {/* Section header — cropped at edge */}
            <div className="px-6 md:px-12 lg:px-20 mb-14">
                <div className="flex items-end justify-between">
                    <div>
                        <span
                            className="text-[10px] text-[var(--vsc-accent)] uppercase tracking-[0.3em] block mb-3"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                            [ 001 ] Collection
                        </span>
                        <h2
                        className="text-section text-[var(--vsc-gray-900)]"
                            style={{
                                fontFamily: "var(--font-space-grotesk)",
                                marginLeft: "-0.02em",
                            }}
                        >
                            THE
                            <br />
                            <span className="text-[var(--vsc-accent)]">DROP</span>
                        </h2>
                    </div>
                    <p
                        className="hidden md:block text-xs text-[var(--vsc-gray-600)] uppercase tracking-[0.2em] max-w-xs text-right"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                    >
                        Drag to explore →
                        <br />
                        Premium heavyweight cotton.
                        <br />
                        Italian craftsmanship.
                    </p>
                </div>
            </div>

            {/* Horizontal scroll container */}
            <div
                ref={scrollRef}
                className={`flex gap-6 md:gap-10 overflow-x-auto no-scrollbar pl-6 md:pl-12 lg:pl-20 pr-6 md:pr-12 lg:pr-20 pb-4 ${isDragging ? "cursor-grabbing" : "cursor-grab"
                    }`}
                style={{ scrollSnapType: "x mandatory" }}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
            >
                {products.map((product, index) => (
                    <div
                        key={product.id}
                        className="shrink-0"
                        style={{ scrollSnapAlign: "start" }}
                    >
                        <ProductCard
                            product={product}
                            variant={index === 0 || index === 2 ? "featured" : "default"}
                        />
                    </div>
                ))}

                {/* End spacer with CTA */}
                <div className="shrink-0 min-w-[200px] md:min-w-[300px] flex items-center justify-center border border-dashed border-[var(--vsc-gray-700)]">
                    <div className="text-center p-8">
                        <span
                            className="text-xs text-[var(--vsc-gray-600)] uppercase tracking-[0.2em] block mb-2"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                            Coming Soon
                        </span>
                        <span
                            className="text-lg text-[var(--vsc-gray-400)] font-bold"
                            style={{ fontFamily: "var(--font-space-grotesk)" }}
                        >
                            S2 →
                        </span>
                    </div>
                </div>
            </div>

            {/* Scroll indicator line */}
            <div className="px-6 md:px-12 lg:px-20 mt-10">
                <div className="w-full h-px bg-[var(--vsc-gray-800)] relative">
                    <div className="absolute left-0 top-0 w-1/4 h-px bg-[var(--vsc-accent)]" />
                </div>
            </div>
        </section>
    )
}
