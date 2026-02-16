import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import Link from "next/link"

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="py-32 px-6 md:px-12 lg:px-20 text-center">
        <h1
          className="text-section text-[var(--vsc-white)] uppercase mb-6"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Category
        </h1>
        <p
          className="text-[var(--vsc-gray-400)] uppercase tracking-[0.2em] mb-8"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          Products coming soon
        </p>
        <Link
          href="/collection"
          className="inline-block px-8 py-4 bg-[var(--vsc-accent)] text-[var(--vsc-black)] text-xs font-bold uppercase tracking-[0.2em] hover:bg-[var(--vsc-black)] hover:text-[var(--vsc-white)] border-2 border-[var(--vsc-accent)] transition-all duration-200"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          ← Back to Collection
        </Link>
      </section>
      <Footer />
    </main>
  )
}
