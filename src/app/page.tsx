import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { MarqueeStrip } from "@/components/MarqueeStrip"
import { ProductShowcase } from "@/components/ProductShowcase"
import { EditorialSection } from "@/components/EditorialSection"
import { Footer } from "@/components/Footer"
import { OrganizationStructuredDataServer, WebsiteStructuredDataServer } from "@/components/StructuredDataServer"
import { getActiveProducts, getStaticContentUrls } from "./storefront-actions"

export default async function Home() {
  const [products, staticContent] = await Promise.all([
    getActiveProducts(),
    getStaticContentUrls(), // Fetch all static content once
  ])
  
  const { 
    onboard1: onboard1Url, 
    onboard2: onboard2Url, 
    tshirtCloseup: tshirtCloseupUrl,
    onboard1Redirect,
    onboard2Redirect,
    tshirtCloseupRedirect,
  } = staticContent

  return (
    <main className="min-h-screen">
      <OrganizationStructuredDataServer />
      <WebsiteStructuredDataServer searchUrl="https://www.vascario.com/collection?search={search_term_string}" />
      <Navbar />
      <Hero onboard1VideoUrl={onboard1Url} redirectUrl={onboard1Redirect || undefined} />
      <MarqueeStrip />
      <ProductShowcase products={products} />
      <EditorialSection 
        onboard2VideoUrl={onboard2Url} 
        tshirtCloseupUrl={tshirtCloseupUrl}
        onboard2RedirectUrl={onboard2Redirect || undefined}
        tshirtCloseupRedirectUrl={tshirtCloseupRedirect || undefined}
      />
      <Footer />
    </main>
  )
}
