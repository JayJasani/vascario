import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { MarqueeStrip } from "@/components/MarqueeStrip"
import { ProductShowcase } from "@/components/ProductShowcase"
import { EditorialSection } from "@/components/EditorialSection"
import { Footer } from "@/components/Footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <MarqueeStrip />
      <ProductShowcase />
      <EditorialSection />
      <Footer />
    </main>
  )
}
