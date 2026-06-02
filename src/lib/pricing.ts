/**
 * USD is the source currency in machine JSON.
 * EUR is shown as an approximate guide for EU artisans (fixed rate, not live FX).
 */
export const USD_TO_EUR_RATE = 0.92;

export type DisplayCurrency = "USD" | "EUR";

const LOCALE: Record<DisplayCurrency, string> = {
  USD: "en-US",
  EUR: "de-DE",
};

export function usdToEur(usd: number): number {
  return Math.round(usd * USD_TO_EUR_RATE);
}

export function formatMoney(amount: number, currency: DisplayCurrency = "USD"): string {
  return new Intl.NumberFormat(LOCALE[currency], {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(currency === "EUR" ? usdToEur(amount) : amount);
}

export function formatPriceRange(
  min: number,
  max: number,
  currency: DisplayCurrency = "USD",
): string {
  if (min === max) return formatMoney(min, currency);
  return `${formatMoney(min, currency)} – ${formatMoney(max, currency)}`;
}

/** USD primary range plus approximate EUR (same min/max spread, converted). */
export function formatDualPriceRange(min: number, max: number): {
  usd: string;
  eurApprox: string;
} {
  return {
    usd: formatPriceRange(min, max, "USD"),
    eurApprox: formatPriceRange(min, max, "EUR"),
  };
}

