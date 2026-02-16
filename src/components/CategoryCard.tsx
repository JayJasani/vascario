"use client";

import type { Category } from "@/lib/categories";
import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
  category: Category;
  aspectClass?: string;
}

export function CategoryCard({
  category,
  aspectClass = "aspect-[3/4]",
}: CategoryCardProps) {
  return (
    <Link
      href={`/collection/${category.slug}`}
      className="group relative block w-full overflow-hidden border border-[var(--vsc-gray-700)] hover:border-[var(--vsc-accent)] transition-colors duration-200"
    >
      <div
        className={`relative overflow-hidden bg-[var(--vsc-gray-800)] chromatic-hover ${aspectClass}`}
      >
        <div className="absolute inset-0 bg-[var(--vsc-gray-900)] flex items-center justify-center">
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
          <span
            className="inline-flex w-full items-center justify-center text-center px-2 text-[var(--vsc-gray-600)] text-xs uppercase tracking-[0.3em] z-10"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            {category.name}
          </span>
        </div>

        <div className="absolute inset-0 transform transition-transform duration-150 ease-[var(--ease-out-quart)] group-hover:scale-[1.08]">
          {category.images[0] &&
            !category.images[0].includes("placeholder") && (
              <Image
                src={category.images[0]}
                alt={category.name}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 80vw, 480px"
              />
            )}
        </div>

        {category.tag && (
          <div
            className="absolute top-3 left-3 px-3 py-1 bg-[var(--vsc-accent)] text-[var(--vsc-black)] text-[10px] font-bold uppercase tracking-[0.15em] z-10"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            {category.tag}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-5 py-4 bg-[var(--vsc-gray-900)] group-hover:bg-[var(--vsc-accent)] transition-colors duration-200">
        <h3
          className="text-sm font-bold uppercase tracking-[0.05em] text-[var(--vsc-white)] group-hover:text-[var(--vsc-black)] truncate transition-colors duration-200"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          {category.name}
        </h3>
      </div>
    </Link>
  );
}
