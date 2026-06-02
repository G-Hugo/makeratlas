import type { Locale } from "@/i18n/config";
import type { Machine } from "@/types/machine";
import type { CatalogEntry } from "@/lib/catalog-types";
import { formatMachinePowerBubble, formatPowerTierChip } from "@/lib/power-display";
import { formatDualPriceRange, formatMoney } from "@/lib/pricing";

export {
  formatMachinePowerBubble,
  formatPowerTierChip,
  sanitizePowerLabel,
} from "@/lib/power-display";

export function parsePowerWatts(machine: Machine): number | null {
  const text = machine.powerRating ?? machine.specs.power ?? "";
  const match = text.match(/(\d+(?:\.\d+)?)\s*W/i);
  return match ? Number(match[1]) : null;
}

export function sortMachinesByPower(machines: Machine[]): Machine[] {
  return [...machines].sort((a, b) => {
    const pa = parsePowerWatts(a) ?? 0;
    const pb = parsePowerWatts(b) ?? 0;
    if (pa !== pb) return pa - pb;
    return a.name.localeCompare(b.name);
  });
}

function stripTrailingPower(name: string): string {
  return name.replace(/\s+\d+(?:\.\d+)?\s*W\b/i, "").trim();
}

export function getCatalogDisplayName(primary: Machine, tierCount: number): string {
  if (tierCount <= 1) return primary.name;
  const stripped = stripTrailingPower(primary.name);
  if (stripped.length >= 3) return stripped;
  return primary.brand ? `${primary.brand} ${primary.modelLine ?? primary.name}` : primary.name;
}

export function formatCatalogPrice(
  entry: CatalogEntry,
  locale: Locale = "en",
): string {
  const primaryCurrency = locale === "fr" ? "EUR" : "USD";
  if (entry.powerTiers.length <= 1) {
    const m = entry.primary;
    if (m.priceRange.min === m.priceRange.max) {
      return formatMoney(m.priceRange.min, primaryCurrency);
    }
    const range = formatDualPriceRange(m.priceRange.min, m.priceRange.max);
    return locale === "fr" ? range.eurApprox : range.usd;
  }
  if (entry.priceMin === entry.priceMax) {
    return formatMoney(entry.priceMin, primaryCurrency);
  }
  const from = locale === "fr" ? "À partir de" : "From";
  return `${from} ${formatMoney(entry.priceMin, primaryCurrency)}`;
}

export function formatCatalogPriceSecondary(
  entry: CatalogEntry,
  locale: Locale,
): string | null {
  if (entry.powerTiers.length <= 1) {
    const m = entry.primary;
    const range = formatDualPriceRange(m.priceRange.min, m.priceRange.max);
    const secondary = locale === "fr" ? range.usd : range.eurApprox;
    if (m.priceRange.min === m.priceRange.max) {
      return `≈ ${secondary}`;
    }
    return `≈ ${secondary}`;
  }
  if (entry.priceMin === entry.priceMax) {
    const amount = locale === "fr" ? formatMoney(entry.priceMin) : formatMoney(entry.priceMin, "EUR");
    return `≈ ${amount}`;
  }
  const from = locale === "fr" ? "≈ dès" : "≈ from";
  const amount =
    locale === "fr" ? formatMoney(entry.priceMin) : formatMoney(entry.priceMin, "EUR");
  return `${from} ${amount}`;
}

export function powerTierLabel(machine: Machine, locale: Locale = "en"): string {
  return formatPowerTierChip(machine, locale);
}
