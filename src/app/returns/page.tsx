import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Returns & Exchanges — VASCARIO",
  description:
    "Information on Vascario returns, exchanges, and how to reach us if something isn’t right with your order.",
};

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-[var(--vsc-cream)] text-[var(--vsc-gray-900)]">
      <Navbar />

      <section className="pt-32 pb-24 px-6 md:px-12 lg:px-40 max-w-5xl mx-auto">
        <header className="mb-10 md:mb-14">
          <p
            className="text-[10px] text-[var(--vsc-accent)] uppercase tracking-[0.3em] mb-4"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            Info
          </p>
          <h1
            className="text-3xl md:text-4xl lg:text-5xl text-[var(--vsc-gray-900)] leading-tight mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Returns & Exchanges
          </h1>
          <p
            className="text-xs md:text-sm text-[var(--vsc-gray-400)] uppercase tracking-[0.2em]"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            What happens if the fit or piece isn’t right.
          </p>
        </header>

        <div
          className="space-y-8 text-sm leading-relaxed text-[var(--vsc-gray-600)]"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          <section>
            <h2 className="text-base md:text-lg text-[var(--vsc-gray-900)] mb-3 uppercase tracking-[0.18em]">
              Return window
            </h2>
            <p className="mb-3">
              We accept returns on unworn, unwashed items within{" "}
              <strong className="font-bold text-[var(--vsc-gray-900)]">7 days</strong> of delivery,
              with original tags and packaging intact.
            </p>
          </section>

          <section>
            <h2 className="text-base md:text-lg text-[var(--vsc-gray-900)] mb-3 uppercase tracking-[0.18em]">
              How to start a return
            </h2>
            <p className="mb-2">
              Email{" "}
              <a
                href="mailto:wear@vascario.com"
                className="underline hover:text-[var(--vsc-accent)]"
              >
                wear@vascario.com
              </a>{" "}
              with:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Order ID</li>
              <li>Item(s) you&apos;d like to return or exchange</li>
              <li>Short note on the issue (fit, defect, etc.)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base md:text-lg text-[var(--vsc-gray-900)] mb-3 uppercase tracking-[0.18em]">
              Non-returnable items
            </h2>
            <p className="mb-2">
              Final‑sale items and heavily worn or damaged garments can&apos;t be accepted back.
              If you&apos;re unsure, reach out first and we&apos;ll help you out.
            </p>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}

