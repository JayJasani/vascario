import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getPageMetadata } from "@/lib/seo-config";

export const metadata = getPageMetadata("about");

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--vsc-cream)] text-[var(--vsc-gray-900)]">
      <Navbar />

      <section className="pt-32 pb-24 px-6 md:px-12 lg:px-40 max-w-5xl mx-auto">
        <header className="mb-10 md:mb-14">
          <p
            className="text-[10px] text-[var(--vsc-accent)] uppercase tracking-[0.3em] mb-4"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            Studio
          </p>
          <h1
            className="text-3xl md:text-4xl lg:text-5xl text-[var(--vsc-gray-900)] leading-tight mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            About Vascario
          </h1>
          <p
            className="text-xs md:text-sm text-[var(--vsc-gray-400)] uppercase tracking-[0.2em]"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            Embroidery-first streetwear, built for the culture.
          </p>
        </header>

        <div
          className="space-y-8 text-sm leading-relaxed text-[var(--vsc-gray-600)]"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          <section>
            <p className="mb-3">
              Vascario is a small studio obsessed with texture, typography, and the feeling of
              wearing something that was actually laboured over. Every drop starts as a sketch and
              ends as dense embroidery you can feel with your fingertips.
            </p>
            <p className="mb-3">
              We release in limited runs only, so pieces feel like artifacts from a specific moment
              — not permanent basics that sit in stock forever. When something sells out, we move
              on to the next story.
            </p>
            <p>
              The goal is simple: make garments that can live in loud fits and quiet days, that
              still feel considered years from now.
            </p>
          </section>

          <section>
            <h2 className="text-base md:text-lg text-[var(--vsc-gray-900)] mb-3 uppercase tracking-[0.18em]">
              What to expect from each drop
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Heavyweight blanks chosen for drape and longevity.</li>
              <li>High‑density embroidery with custom thread palettes.</li>
              <li>Color stories that stay wearable, not gimmicky.</li>
              <li>Transparent sizing and fit guidance for each piece.</li>
            </ul>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}

