import { getPageMetadata } from "@/lib/seo-config";
import { FAQPageStructuredDataServer } from "@/components/StructuredDataServer";
import { StorefrontShell } from "@/components/layouts/StorefrontShell";

export const metadata = getPageMetadata("returns");

export default function ReturnsPage() {
  // FAQ structured data for returns page
  const returnsFAQs = [
    {
      question: "What is the return window?",
      answer: "We accept returns within 7 days of delivery. Items must be new, unworn, and unwashed with original tags and packaging intact.",
    },
    {
      question: "Do you accept returns for defective and non-defective items?",
      answer: "Yes. We accept returns for both defective and non-defective products. Exchanges are also accepted within the 7-day window.",
    },
    {
      question: "How do I start a return?",
      answer: "Email wear@vascario.com with your Order ID, item(s) you'd like to return or exchange, and a short note on the issue (fit, defect, etc.). Returns are by mail; the return label is the customer's responsibility.",
    },
    {
      question: "Is there a restocking fee?",
      answer: "A restocking fee of INR 100 applies per return. Refunds are processed within 5 days once we receive and inspect the item.",
    },
    {
      question: "What items cannot be returned?",
      answer: "We accept new items only. Final-sale items and heavily worn or damaged garments can't be accepted back. If you're unsure, reach out first and we'll help you out.",
    },
  ];

  return (
    <StorefrontShell>
      <main className="min-h-screen bg-[var(--vsc-cream)] text-[var(--vsc-gray-900)]">
        <FAQPageStructuredDataServer faqs={returnsFAQs} />

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
              What happens if the fit or piece isn't right.
            </p>
          </header>

          <div
            className="space-y-8 text-sm leading-relaxed text-[var(--vsc-gray-600)]"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            <section>
              <h2 className="text-base md:text-lg text-[var(--vsc-gray-900)] mb-3 uppercase tracking-[0.18em]">
                Countries & policy
              </h2>
              <p className="mb-2">
                This return policy applies to <strong className="font-bold text-[var(--vsc-gray-900)]">India</strong>.
                Policy URL:{" "}
                <a
                  href="https://www.vascario.com/returns"
                  className="underline hover:text-[var(--vsc-accent)]"
                >
                  https://www.vascario.com/returns
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-base md:text-lg text-[var(--vsc-gray-900)] mb-3 uppercase tracking-[0.18em]">
                Returns & exchanges
              </h2>
              <ul className="list-disc pl-5 space-y-1 mb-2">
                <li>We accept <strong className="font-bold text-[var(--vsc-gray-900)]">returns</strong> for both defective and non-defective products.</li>
                <li>We accept <strong className="font-bold text-[var(--vsc-gray-900)]">exchanges</strong> within the return window.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base md:text-lg text-[var(--vsc-gray-900)] mb-3 uppercase tracking-[0.18em]">
                Product condition & window
              </h2>
              <ul className="list-disc pl-5 space-y-1 mb-2">
                <li><strong className="font-bold text-[var(--vsc-gray-900)]">Product condition:</strong> New only. Items must be unworn, unwashed, with original tags and packaging intact.</li>
                <li><strong className="font-bold text-[var(--vsc-gray-900)]">Window:</strong> <strong className="font-bold text-[var(--vsc-gray-900)]">7 days</strong> from delivery.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base md:text-lg text-[var(--vsc-gray-900)] mb-3 uppercase tracking-[0.18em]">
                Method & fees
              </h2>
              <ul className="list-disc pl-5 space-y-1 mb-2">
                <li><strong className="font-bold text-[var(--vsc-gray-900)]">Method:</strong> By mail.</li>
                <li><strong className="font-bold text-[var(--vsc-gray-900)]">Return label:</strong> Customer responsibility.</li>
                <li><strong className="font-bold text-[var(--vsc-gray-900)]">Restocking fee:</strong> INR 100.</li>
                <li><strong className="font-bold text-[var(--vsc-gray-900)]">Refund processing time:</strong> 5 days.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base md:text-lg text-[var(--vsc-gray-900)] mb-3 uppercase tracking-[0.18em]">
                Return window (summary)
              </h2>
              <p className="mb-3">
                We accept returns on new, unworn, unwashed items within{" "}
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
                We accept new items only. Final‑sale items and heavily worn or damaged garments can&apos;t be accepted back.
                If you&apos;re unsure, reach out first and we&apos;ll help you out.
              </p>
            </section>
          </div>
        </section>
      </main>
    </StorefrontShell>
  );
}
