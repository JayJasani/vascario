import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import { SmoothScroller } from "@/components/SmoothScroller";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { FavouritesProvider } from "@/context/FavouritesContext";
import { UserProfileProvider } from "@/context/UserProfileContext";
import { getHomeMetadata } from "@/lib/seo-config";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = getHomeMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${spaceMono.variable}`}
      >
        <SmoothScroller>
          <AuthProvider>
            <UserProfileProvider>
              <CurrencyProvider>
                <CartProvider>
                  <FavouritesProvider>
                    <ScrollToTop />
                    {children}
                  </FavouritesProvider>
                </CartProvider>
              </CurrencyProvider>
            </UserProfileProvider>
          </AuthProvider>
        </SmoothScroller>
      </body>
    </html>
  );
}
