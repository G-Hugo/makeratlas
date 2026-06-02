import { formatPriceRange } from "./pricing";

export function formatPrice(min: number, max: number, currency: "USD" | "EUR" = "USD"): string {
  return formatPriceRange(min, max, currency);
}

export { formatReleaseDate } from "./machine-dates";

export function laserTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    diode: "Diode",
    co2: "CO₂",
    fiber: "Fiber",
    uv: "UV",
    hybrid: "Hybrid",
  };
  return labels[type] ?? type;
}

export function laserTypeSlug(type: string): string {
  return type;
}

export function ratingColor(score: number): string {
  if (score >= 8.5) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 7) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

export function ratingBarColor(score: number): string {
  if (score >= 8.5) return "bg-emerald-500 dark:bg-emerald-400";
  if (score >= 7) return "bg-amber-500 dark:bg-amber-400";
  return "bg-red-500 dark:bg-red-400";
}
