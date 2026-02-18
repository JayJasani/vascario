import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getPageMetadata } from "@/lib/seo-config";
import { FAQPageStructuredDataServer } from "@/components/StructuredDataServer";

export const metadata = getPageMetadata("shipping");

export default function ShippingPage() {
  // FAQ structured data for shipping page
  const shippingFAQs = [
    {
      question: "How long does order processing take?",
      answer: "Each order is packed in-house. Please allow 2–4 business days for processing before your package is handed off to the carrier.",
    },
    {
      question: "How long does shipping take to India?",
      answer: "India — typically 3–7 business days after dispatch. Tracking details are emailed as soon as your order is scanned by the carrier.",
    },
    {
      question: "How long does international shipping take?",
      answer: "International shipping timing varies by destination and carrier. Tracking details are emailed as soon as your order is scanned by the carrier.",
    },
    {
      question: "Can shipping timelines be affected?",
      answer: "Shipping timelines are estimates and can be affected by carrier delays, weather, or customs. We'll always do our best to keep you updated.",
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--vsc-cream)] text-[var(--vsc-gray-900)]">
      <FAQPageStructuredDataServer faqs={shippingFAQs} />
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
            Shipping
          </h1>
          <p
            className="text-xs md:text-sm text-[var(--vsc-gray-400)] uppercase tracking-[0.2em]"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            How your order leaves the studio and reaches you.
          </p>
        </header>

        <div
          className="space-y-8 text-sm leading-relaxed text-[var(--vsc-gray-600)]"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          <section>
            <h2 className="text-base md:text-lg text-[var(--vsc-gray-900)] mb-3 uppercase tracking-[0.18em]">
              Processing times
            </h2>
            <p className="mb-3">
              Each order is packed in‑house. Please allow{" "}
              <strong className="font-bold text-[var(--vsc-gray-900)]">2–4 business days</strong>{" "}
              for processing before your package is handed off to the carrier.
            </p>
          </section>

          <section>
            <h2 className="text-base md:text-lg text-[var(--vsc-gray-900)] mb-3 uppercase tracking-[0.18em]">
              Transit estimates
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>India — typically 3–7 business days after dispatch.</li>
              <li>International — timing varies by destination and carrier.</li>
            </ul>
            <p className="mt-3">
              Tracking details are emailed as soon as your order is scanned by the carrier.
            </p>
          </section>

          <section>
            <h2 className="text-base md:text-lg text-[var(--vsc-gray-900)] mb-3 uppercase tracking-[0.18em]">
              Notes
            </h2>
            <p className="mb-2">
              Shipping timelines are estimates and can be affected by carrier delays, weather, or
              customs. We&apos;ll always do our best to keep you updated.
            </p>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}

