import { FavouritesClient } from "./FavouritesClient";
import { getPageMetadata } from "@/lib/seo-config";
import { StorefrontShell } from "@/components/layouts/StorefrontShell";

export const metadata = getPageMetadata("favourites");

export default function FavouritesPage() {
  return (
    <StorefrontShell>
      <main className="min-h-screen bg-[var(--vsc-cream)] text-[var(--vsc-gray-900)]">
        <FavouritesClient />
      </main>
    </StorefrontShell>
  );
}

