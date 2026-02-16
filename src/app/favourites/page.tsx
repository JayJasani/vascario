import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

export const metadata = {
  title: "Favourites — VASCARIO",
  description: "View the pieces you've marked as favourites.",
}

export default function FavouritesPage() {
  return (
    <main className="min-h-screen bg-[var(--vsc-black)] text-[var(--vsc-gray-200)]">
      <Navbar />

      <section className="pt-32 pb-24 px-6 md:px-12 lg:px-40 max-w-5xl mx-auto">
        <header className="mb-10 md:mb-14">
          <p
            className="text-[10px] text-[var(--vsc-accent)] uppercase tracking-[0.3em] mb-4"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            Saved
          </p>
          <h1
            className="text-3xl md:text-4xl lg:text-5xl text-[var(--vsc-white)] leading-tight mb-4"
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
          <p className="text-sm md:text-base text-[var(--vsc-gray-300)] mb-3">
            You don&apos;t have any favourites yet.
          </p>
          <p className="text-[11px] md:text-xs text-[var(--vsc-gray-500)] uppercase tracking-[0.2em] mb-6">
            Discover the collection and save pieces you love.
          </p>
          <a
            href="/collection"
            className="inline-flex items-center justify-center px-8 py-3 bg-[var(--vsc-accent)] text-[var(--vsc-black)] text-xs font-bold uppercase tracking-[0.2em] hover:bg-[var(--vsc-black)] hover:text-[var(--vsc-white)] border-2 border-[var(--vsc-accent)] transition-all duration-200 hover:shadow-[0_0_20px_var(--vsc-accent-dim)]"
          >
            Browse Collection →
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}

