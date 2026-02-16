"use client"

import { useRef, useEffect } from "react"
import { CategoryCard } from "@/components/CategoryCard"
import { CATEGORIES } from "@/lib/categories"

// Varying aspect ratios for staggered masonry effect
const ASPECTS = ["aspect-[3/4]", "aspect-[4/5]", "aspect-square", "aspect-[5/6]", "aspect-[2/3]"]

export function CollectionGrid() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible")
        })
      },
      { threshold: 0.1 }
    )
    const section = sectionRef.current
    if (section) observer.observe(section)
    return () => { if (section) observer.unobserve(section) }
  }, [])

  return (
    <section ref={sectionRef} className="reveal py-24 md:py-32">
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
              style={{ fontFamily: "var(--font-space-grotesk)", marginLeft: "-0.02em" }}
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
            Staggered grid.
            <br />
            Premium heavyweight cotton.
            <br />
            Italian craftsmanship.
          </p>
        </div>
      </div>

      {/* Masonry / staggered grid */}
      <div
        className="columns-2 md:columns-3 lg:columns-4 gap-6 px-6 md:px-12 lg:px-20"
        style={{ columnFill: "balance" }}
      >
        {CATEGORIES.map((category, index) => (
          <div key={category.id} className="break-inside-avoid mb-6">
            <CategoryCard
              category={category}
              aspectClass={ASPECTS[index % ASPECTS.length]}
            />
          </div>
        ))}
        {/* Coming Soon placeholder */}
        <div className="break-inside-avoid mb-6">
          <div className="w-full min-h-[280px] flex flex-col items-center justify-center border border-dashed border-[var(--vsc-gray-700)] p-8">
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

      <div className="px-6 md:px-12 lg:px-20 mt-10">
        <div className="w-full h-px bg-[var(--vsc-gray-800)] relative">
          <div className="absolute left-0 top-0 w-1/4 h-px bg-[var(--vsc-accent)]" />
        </div>
      </div>
    </section>
  )
}
