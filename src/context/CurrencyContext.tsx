"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import {
  CURRENCY_CODES,
  CURRENCIES,
  formatPriceInCurrency as formatPriceInCurrencyUtil,
  type CurrencyOption,
} from "@/lib/currency";

const STORAGE_KEY = "vascario:currency";

interface CurrencyContextValue {
  currencyCode: string;
  currency: CurrencyOption;
  setCurrency: (code: string) => void;
  /** Format a price stored in INR for the selected currency. */
  formatPrice: (amountINR: number, options?: { showCode?: boolean }) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currencyCode, setCurrencyCodeState] = useState<string>(() => {
    if (typeof window === "undefined") return "INR";
    return window.localStorage.getItem(STORAGE_KEY) || "INR";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && CURRENCIES[stored]) setCurrencyCodeState(stored);
  }, []);

  const setCurrency = useCallback((code: string) => {
    if (!CURRENCIES[code]) return;
    setCurrencyCodeState(code);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, code);
    }
  }, []);

  const currency = CURRENCIES[currencyCode] ?? CURRENCIES.INR;

  const formatPrice = useCallback(
    (amountINR: number, options?: { showCode?: boolean }) =>
      formatPriceInCurrencyUtil(amountINR, currencyCode, options),
    [currencyCode]
  );

  return (
    <CurrencyContext.Provider
      value={{
        currencyCode,
        currency,
        setCurrency,
        formatPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}

export { CURRENCY_CODES };
