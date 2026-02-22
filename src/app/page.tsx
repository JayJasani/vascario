import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { MarqueeStrip } from "@/components/MarqueeStrip"
import { CollectionGrid } from "@/components/CollectionGrid"
import { EditorialSection } from "@/components/EditorialSection"
import { ReviewsSection } from "@/components/ReviewsSection"
import { Footer } from "@/components/Footer"
import { OrganizationStructuredDataServer, WebsiteStructuredDataServer } from "@/components/StructuredDataServer"
import { ResourcePreloader } from "@/components/ResourcePreloader"
import { getActiveProducts, getStaticContentUrls, getReviews } from "./storefront-actions"

export default async function Home() {
  const [products, staticContent, reviews] = await Promise.all([
    getActiveProducts(),
    getStaticContentUrls(), // Fetch all static content once
    getReviews(),
  ])
  
  const { 
    onboard1: onboard1Url, 
    onboard2: onboard2Url, 
    tshirtCloseup: tshirtCloseupUrl,
    onboard1Redirect,
    onboard2Redirect,
    tshirtCloseupRedirect,
  } = staticContent

  // Determine which images are from Firebase Storage (API) vs local
  const isFirebaseUrl = (url: string) => url.startsWith('https://storage.googleapis.com')
  
  // Preload critical Firebase Storage images only
  const criticalImages: string[] = []
  
  if (tshirtCloseupUrl && isFirebaseUrl(tshirtCloseupUrl)) {
    criticalImages.push(tshirtCloseupUrl)
  }

  return (
    <main className="min-h-screen">
      <OrganizationStructuredDataServer />
      <WebsiteStructuredDataServer searchUrl="https://www.vascario.com/collection?search={search_term_string}" />
      <ResourcePreloader images={criticalImages} />
      <Navbar />
      <Hero onboard1VideoUrl={onboard1Url} redirectUrl={onboard1Redirect || undefined} />
      <MarqueeStrip />
      <CollectionGrid products={products} />
      <EditorialSection 
        onboard2VideoUrl={onboard2Url} 
        tshirtCloseupUrl={tshirtCloseupUrl}
        onboard2RedirectUrl={onboard2Redirect || undefined}
        tshirtCloseupRedirectUrl={tshirtCloseupRedirect || undefined}
      />
      <ReviewsSection reviews={reviews} />
      <Footer />
    </main>
  )
}
