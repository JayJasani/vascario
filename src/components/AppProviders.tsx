"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { FavouritesProvider } from "@/context/FavouritesContext";
import { UserProfileProvider } from "@/context/UserProfileContext";

/**
 * Single client boundary for all app providers so context is available
 * during SSR/streaming (fixes "useCart must be used within a CartProvider").
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <UserProfileProvider>
        <CurrencyProvider>
          <CartProvider>
            <FavouritesProvider>{children}</FavouritesProvider>
          </CartProvider>
        </CurrencyProvider>
      </UserProfileProvider>
    </AuthProvider>
  );
}
