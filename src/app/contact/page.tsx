import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { ContactForm } from "./ContactForm"

export const metadata = {
  title: "Contact — VASCARIO",
  description:
    "Get in touch with Vascario. Questions, orders, or collabs — we're here for it.",
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[var(--vsc-cream)] text-[var(--vsc-gray-900)]">
      <Navbar />

      <section className="pt-32 pb-24 px-6 md:px-12 lg:px-40 max-w-5xl mx-auto">
        <header className="mb-10 md:mb-14">
          <p
            className="text-[10px] text-[var(--vsc-accent)] uppercase tracking-[0.3em] mb-4"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            Get in touch
          </p>
          <h1
            className="text-3xl md:text-4xl lg:text-5xl text-[var(--vsc-gray-900)] leading-tight mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Contact
          </h1>
          <p
            className="text-xs md:text-sm text-[var(--vsc-gray-400)] uppercase tracking-[0.2em]"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            Questions, orders, or collabs — we&apos;re here for it.
          </p>
        </header>

        <div
          className="space-y-10 text-sm leading-relaxed text-[var(--vsc-gray-300)]"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          <section>
            <h2 className="text-base md:text-lg text-[var(--vsc-gray-900)] mb-4 uppercase tracking-[0.18em]">
              Send a message
            </h2>
            <ContactForm />
          </section>

          <section>
            <h2 className="text-base md:text-lg text-[var(--vsc-gray-900)] mb-3 uppercase tracking-[0.18em]">
              Or email us
            </h2>
            <p className="mb-4">
              For orders, sizing, returns, or anything else — hit us at:
            </p>
            <a
              href="mailto:wear@vascario.com"
              className="inline-block px-6 py-4 bg-[var(--vsc-gray-900)] text-xs font-bold tracking-[0.08em] hover:bg-[var(--vsc-gray-800)] transition-colors duration-200"
              style={{ fontFamily: "var(--font-space-mono)", color: "white", textTransform: "none" }}
            >
              wear@vascario.com
            </a>
          </section>

          <section>
            <h2 className="text-base md:text-lg text-[var(--vsc-gray-900)] mb-3 uppercase tracking-[0.18em]">
              Response time
            </h2>
            <p>
              We usually reply within 24–48 hours. For order-related queries,
              please include your order number so we can help you faster.
            </p>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  )
}
