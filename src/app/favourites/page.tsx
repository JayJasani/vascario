import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FavouritesClient } from "./FavouritesClient";

export const metadata = {
  title: "Favourites — VASCARIO",
  description: "View the pieces you've marked as favourites.",
};

export default function FavouritesPage() {
  return (
    <main className="min-h-screen bg-[var(--vsc-cream)] text-[var(--vsc-gray-900)]">
      <Navbar />
      <FavouritesClient />
      <Footer />
    </main>
  );
}

