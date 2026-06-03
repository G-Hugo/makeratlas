import type { Locale } from "@/i18n/config";
import type { Machine } from "@/types/machine";
import type { CatalogEntry } from "@/lib/catalog-types";
import { formatMachinePowerBubble } from "@/lib/power-display";
import { formatDualPriceRange, formatMoney } from "@/lib/pricing";
import {
  formatPowerTierChipLabel,
  getTierChipVariant,
  parsePowerWattsFromText,
  type TierChipVariant,
} from "@/lib/tier-chip";

export {
  formatMachinePowerBubble,
  sanitizePowerLabel,
} from "@/lib/power-display";

export {
  formatPowerTierChipLabel,
  formatModuleOptionChipLabel,
  getTierChipVariant,
  isMultiModuleTierLine,
  isMultiPowerTierLine,
  TIER_CHIP_STYLES,
  type TierChipVariant,
} from "@/lib/tier-chip";

export function parsePowerWatts(machine: Machine): number | null {
  return (
    parsePowerWattsFromText(machine.powerRating ?? "") ??
    parsePowerWattsFromText(machine.specs.power ?? "")
  );
}

/** @deprecated Use formatPowerTierChipLabel */
export function formatPowerTierChip(machine: Machine, locale: Locale = "en"): string {
  return formatPowerTierChipLabel(machine, locale);
}

function sortByModuleOptionOrder(machines: Machine[]): Machine[] | null {
  const donor = machines.find((m) => m.moduleSystem?.style === "interchangeable");
  const options = donor?.moduleSystem?.options;
  if (!options?.length) return null;

  const order = new Map(
    options
      .map((opt, index) => (opt.tierSlug ? [opt.tierSlug, index] : null))
      .filter((entry): entry is [string, number] => entry != null),
  );
  if (order.size < 2) return null;

  return [...machines].sort((a, b) => {
    const ia = order.get(a.slug) ?? 999;
    const ib = order.get(b.slug) ?? 999;
    if (ia !== ib) return ia - ib;
    return a.name.localeCompare(b.name);
  });
}

export function sortMachinesByPower(machines: Machine[]): Machine[] {
  const moduleSorted = sortByModuleOptionOrder(machines);
  if (moduleSorted) return moduleSorted;

  const laserRank: Record<string, number> = {
    uv: 0,
    diode: 1,
    co2: 2,
    hybrid: 3,
    fiber: 4,
  };

  return [...machines].sort((a, b) => {
    const pa = parsePowerWatts(a) ?? 0;
    const pb = parsePowerWatts(b) ?? 0;
    if (pa !== pb) return pa - pb;
    const la = laserRank[a.laserType] ?? 9;
    const lb = laserRank[b.laserType] ?? 9;
    if (la !== lb) return la - lb;
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

export function powerTierLabel(
  machine: Machine,
  locale: Locale = "en",
  tiers?: Machine[],
): string {
  return formatPowerTierChipLabel(machine, locale, tiers);
}

/** H1 / breadcrumb for multi-tier detail pages. */
export function getDetailDisplayTitle(
  machine: Machine,
  tiers: Machine[],
  locale: Locale = "en",
): string {
  if (tiers.length <= 1) return machine.name;
  const lineTitle = getCatalogDisplayName(machine, tiers.length);
  return `${lineTitle} · ${powerTierLabel(machine, locale, tiers)}`;
}
