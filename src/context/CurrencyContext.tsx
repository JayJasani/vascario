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

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

const defaultCurrencyValue: CurrencyContextValue = {
  currencyCode: "INR",
  currency: CURRENCIES.INR,
  setCurrency: () => {},
  formatPrice: (amountINR: number, options?: { showCode?: boolean }) =>
    formatPriceInCurrencyUtil(amountINR, "INR", options),
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  // Use "INR" for initial render to avoid hydration mismatch (server has no localStorage)
  const [currencyCode, setCurrencyCodeState] = useState<string>("INR");

  useEffect(() => {
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
  return ctx ?? defaultCurrencyValue;
}

export { CURRENCY_CODES };
