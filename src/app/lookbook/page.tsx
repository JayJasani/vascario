import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getActiveProducts } from "../storefront-actions";
import Link from "next/link";
import Image from "next/image";
import { getPageMetadata } from "@/lib/seo-config";
import { getImageAlt } from "@/lib/seo-utils";

export const metadata = getPageMetadata("lookbook");

export default async function LookbookPage() {
  const products = await getActiveProducts();

  return (
    <main className="min-h-screen bg-[var(--vsc-cream)] text-[var(--vsc-gray-900)]">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pb-24 px-6 md:px-12 lg:px-20">
        <p
          className="text-[10px] text-[var(--vsc-accent)] uppercase tracking-[0.3em] mb-4"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          [ 002 ] Lookbook
        </p>
        <h1
          className="text-[var(--vsc-gray-900)] leading-[0.9] mb-4"
          style={{
            fontFamily: "var(--font-space-grotesk)",
            fontSize: "clamp(3rem, 10vw, 8rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
          }}
        >
          WEAR
          <br />
          <span className="text-[var(--vsc-accent)]">THE</span>
          <br />
          CULTURE<span className="text-[var(--vsc-accent)]">.</span>
        </h1>
        <p
          className="text-xs md:text-sm text-[var(--vsc-gray-500)] uppercase tracking-[0.2em] max-w-md"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          Editorial. How the drop looks in motion.
        </p>
      </section>

      {/* Lookbook grid — product-led with editorial feel */}
      <section className="px-6 md:px-12 lg:px-20 pb-24 md:pb-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
          {products.slice(0, 6).map((product, index) => {
            const isLarge = index % 2 === 0;
            const colSpan = isLarge ? "md:col-span-7" : "md:col-span-5";
            const aspect = isLarge ? "aspect-[4/5]" : "aspect-square";
            return (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className={`${colSpan} group block`}
              >
                <div
                  className={`relative ${aspect} bg-[var(--vsc-gray-900)] overflow-hidden border border-[var(--vsc-gray-700)]`}
                >
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={getImageAlt("lookbook", product.name)}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes={isLarge ? "(max-width: 768px) 100vw, 60vw" : "(max-width: 768px) 100vw, 40vw"}
                      loading={index < 2 ? "eager" : "lazy"}
                    />
                  ) : (
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage: `
                          linear-gradient(45deg, var(--vsc-gray-700) 25%, transparent 25%),
                          linear-gradient(-45deg, var(--vsc-gray-700) 25%, transparent 25%),
                          linear-gradient(45deg, transparent 75%, var(--vsc-gray-700) 75%),
                          linear-gradient(-45deg, transparent 75%, var(--vsc-gray-700) 75%)
                        `,
                        backgroundSize: "24px 24px",
                        backgroundPosition: "0 0, 0 12px, 12px -12px, -12px 0px",
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-[var(--vsc-accent)] opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 bg-gradient-to-t from-[var(--vsc-gray-900)]/90 to-transparent">
                    <span
                      className="text-[10px] text-[var(--vsc-accent)] uppercase tracking-[0.25em] block"
                      style={{ fontFamily: "var(--font-space-mono)" }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="text-sm md:text-base font-bold text-[var(--vsc-white)] uppercase tracking-[0.08em]"
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                      {product.name}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA strip */}
        <div className="mt-16 md:mt-24 flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-[var(--vsc-gray-200)]">
          <p
            className="text-[10px] text-[var(--vsc-gray-500)] uppercase tracking-[0.3em]"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            Vascario · S1
          </p>
          <Link
            href="/collection"
            className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--vsc-gray-900)] hover:text-[var(--vsc-accent)] transition-colors duration-200"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            View collection →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
