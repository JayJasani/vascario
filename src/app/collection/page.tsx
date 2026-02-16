import { Navbar } from "@/components/Navbar"
import { CollectionGrid } from "@/components/CollectionGrid"
import { Footer } from "@/components/Footer"

export const metadata = {
  title: "Collection — VASCARIO",
  description: "Premium embroidered streetwear. Limited drops. The Drop — Season 1.",
}

export default function CollectionPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <CollectionGrid />
      <Footer />
    </main>
  )
}
