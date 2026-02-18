/**
 * Multi-currency support. All prices in the database are stored in INR (base currency).
 * Display conversion uses the rates below (INR → target currency).
 */

export const BASE_CURRENCY = "INR" as const;

export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
  /** Rate to convert from INR to this currency (1 INR = rate * this currency) */
  rateFromINR: number;
  locale: string;
}

export const CURRENCIES: Record<string, CurrencyOption> = {
  INR: {
    code: "INR",
    symbol: "₹",
    name: "Indian Rupee",
    rateFromINR: 1,
    locale: "en-IN",
  },
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    rateFromINR: 0.012,
    locale: "en-US",
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    rateFromINR: 0.011,
    locale: "de-DE",
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    rateFromINR: 0.0095,
    locale: "en-GB",
  },
};

export const CURRENCY_CODES = Object.keys(CURRENCIES) as (keyof typeof CURRENCIES)[];

export function convertFromINR(amountINR: number, currencyCode: string): number {
  const currency = CURRENCIES[currencyCode] ?? CURRENCIES.INR;
  return amountINR * currency.rateFromINR;
}

export function formatPriceInCurrency(
  amountINR: number,
  currencyCode: string,
  options?: { showCode?: boolean }
): string {
  const currency = CURRENCIES[currencyCode] ?? CURRENCIES.INR;
  const amount = convertFromINR(amountINR, currencyCode);
  const formatted = new Intl.NumberFormat(currency.locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    style: "decimal",
  }).format(amount);
  if (options?.showCode && currencyCode !== "INR") {
    return `${currency.symbol}${formatted} ${currencyCode}`;
  }
  return `${currency.symbol}${formatted}`;
}
