import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FavouritesClient } from "./FavouritesClient";
import { getPageMetadata } from "@/lib/seo-config";

export const metadata = getPageMetadata("favourites");

export default function FavouritesPage() {
  return (
    <main className="min-h-screen bg-[var(--vsc-cream)] text-[var(--vsc-gray-900)]">
      <Navbar />
      <FavouritesClient />
      <Footer />
    </main>
  );
}

