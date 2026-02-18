import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { MarqueeStrip } from "@/components/MarqueeStrip"
import { ProductShowcase } from "@/components/ProductShowcase"
import { EditorialSection } from "@/components/EditorialSection"
import { Footer } from "@/components/Footer"
import { OrganizationStructuredDataServer, WebsiteStructuredDataServer } from "@/components/StructuredDataServer"
import { getActiveProducts } from "./storefront-actions"

export default async function Home() {
  const products = await getActiveProducts()

  return (
    <main className="min-h-screen">
      <OrganizationStructuredDataServer />
      <WebsiteStructuredDataServer searchUrl="https://www.vascario.com/collection?search={search_term_string}" />
      <Navbar />
      <Hero />
      <MarqueeStrip />
      <ProductShowcase products={products} />
      <EditorialSection />
      <Footer />
    </main>
  )
}
