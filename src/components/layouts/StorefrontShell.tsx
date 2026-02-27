import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface StorefrontShellProps {
  children: ReactNode;
}

/**
 * Shared shell for all customer-facing pages.
 * Centralizes `Navbar` and `Footer` so individual pages only worry about their content.
 */
export function StorefrontShell({ children }: StorefrontShellProps) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

