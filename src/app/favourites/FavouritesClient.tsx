"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useFavourites } from "@/context/FavouritesContext";
import { getImageAlt } from "@/lib/seo-utils";

export function FavouritesClient() {
  const router = useRouter();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const { items } = useFavourites();

  const isEmpty = items.length === 0;

  if (!user) {
    return (
      <section className="pt-32 pb-24 px-6 md:px-12 lg:px-40 max-w-5xl mx-auto">
        <header className="mb-10 md:mb-14">
          <p
            className="text-[10px] text-[var(--vsc-accent)] uppercase tracking-[0.3em] mb-4"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            Saved
          </p>
          <h1
            className="text-3xl md:text-4xl lg:text-5xl text-[var(--vsc-gray-900)] leading-tight mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Favourites
          </h1>
          <p
            className="text-xs md:text-sm text-[var(--vsc-gray-400)] uppercase tracking-[0.2em]"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            Curate the pieces you want to come back to.
          </p>
        </header>

        <div
          className="border border-dashed border-[var(--vsc-gray-700)] rounded-lg px-6 py-10 md:px-10 md:py-14 text-center"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          <p className="text-sm md:text-base text-[var(--vsc-gray-700)] mb-3">
            Sign in to save favourites across devices.
          </p>
          <Link
            href="/login?redirect=/favourites"
            className="inline-flex items-center justify-center px-8 py-4 bg-[var(--vsc-gray-900)] !text-[var(--vsc-cream)] text-xs font-bold uppercase tracking-[0.2em] hover:bg-[var(--vsc-gray-800)] hover:!text-[var(--vsc-white)] border-2 border-[var(--vsc-gray-900)] transition-all duration-200"
          >
            Sign in →
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-32 pb-24 px-6 md:px-12 lg:px-40 max-w-5xl mx-auto">
      <header className="mb-10 md:mb-14">
        <p
          className="text-[10px] text-[var(--vsc-accent)] uppercase tracking-[0.3em] mb-4"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          Saved
        </p>
        <h1
          className="text-3xl md:text-4xl lg:text-5xl text-[var(--vsc-gray-900)] leading-tight mb-4"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Favourites
        </h1>
        <p
          className="text-xs md:text-sm text-[var(--vsc-gray-400)] uppercase tracking-[0.2em]"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          Curate the pieces you want to come back to.
        </p>
      </header>

      {isEmpty ? (
        <div
          className="border border-dashed border-[var(--vsc-gray-700)] rounded-lg px-6 py-10 md:px-10 md:py-14 text-center"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          <p className="text-sm md:text-base text-[var(--vsc-gray-700)] mb-3">
            You don&apos;t have any favourites yet.
          </p>
          <p className="text-[11px] md:text-xs text-[var(--vsc-gray-500)] uppercase tracking-[0.2em] mb-6">
            Discover the collection and save pieces you love.
          </p>
          <Link
            href="/collection"
            className="inline-flex items-center justify-center px-8 py-4 bg-[var(--vsc-accent)] !text-[var(--vsc-white)] text-xs font-bold uppercase tracking-[0.2em] hover:bg-[var(--vsc-gray-900)] hover:!text-[var(--vsc-cream)] border-2 border-[var(--vsc-accent)] transition-all duration-200 hover:shadow-[0_0_20px_var(--vsc-accent-dim)]"
          >
            Browse Collection →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const href = `/product/${item.slug || item.id}`;
            return (
            <Link
              key={item.id}
              href={href}
              className="group border border-[var(--vsc-gray-200)] bg-[var(--vsc-white)] hover:border-[var(--vsc-gray-900)] transition-colors duration-200"
              onMouseEnter={() => router.prefetch(href)}
            >
              <div className="relative aspect-[3/4] bg-[var(--vsc-gray-100)] overflow-hidden">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={getImageAlt("product", item.name)}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    loading="lazy"
                  />
                )}
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <span
                  className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--vsc-gray-900)] truncate"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {item.name}
                </span>
                <span
                  className="text-xs font-bold text-[var(--vsc-gray-900)]"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  {formatPrice(item.price)}
                </span>
              </div>
            </Link>
          );
          })}
        </div>
      )}
    </section>
  );
}

