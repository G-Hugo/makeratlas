import type { Locale } from "@/i18n/config";
import { localizeMachines } from "@/lib/machine-locale";
import { readPublishedMachines } from "@/lib/machines-data";
import {
  getCatalogDisplayName,
  parsePowerWatts,
  sortMachinesByPower,
} from "@/lib/catalog-display";
import type { CatalogEntry } from "@/lib/catalog-types";
import type { Machine } from "@/types/machine";

export type { CatalogEntry } from "@/lib/catalog-types";

function pickCatalogPrimary(pool: Machine[]): Machine {
  const flagged = pool.find((m) => m.catalogPrimary);
  if (flagged) return flagged;

  return [...pool].sort((a, b) => {
    const pa = parsePowerWatts(a) ?? 0;
    const pb = parsePowerWatts(b) ?? 0;
    if (pb !== pa) return pb - pa;
    return b.rating.overall - a.rating.overall;
  })[0];
}

/** Catalog card badge when the primary tier omits moduleSystem but siblings define it. */
function withLineModuleSystem(primary: Machine, powerTiers: Machine[]): Machine {
  if (primary.moduleSystem) return primary;
  const donor = powerTiers.find((m) => m.moduleSystem?.style === "interchangeable");
  if (!donor?.moduleSystem) return primary;
  return { ...primary, moduleSystem: donor.moduleSystem };
}

function buildEntry(primary: Machine, powerTiers: Machine[]): CatalogEntry {
  const cardPrimary = withLineModuleSystem(primary, powerTiers);
  const priceMin = Math.min(...powerTiers.map((m) => m.priceRange.min));
  const priceMax = Math.max(...powerTiers.map((m) => m.priceRange.max));
  return {
    primary: cardPrimary,
    powerTiers,
    displayName: getCatalogDisplayName(primary, powerTiers.length),
    priceMin,
    priceMax,
  };
}

export function getCatalogEntries(locale: Locale = "en"): CatalogEntry[] {
  const all = localizeMachines(readPublishedMachines(), locale);
  const entries: CatalogEntry[] = [];
  const modelLines = new Set(
    all.map((m) => m.modelLine).filter((line): line is string => Boolean(line)),
  );

  for (const machine of all) {
    if (machine.modelLine) continue;
    if (machine.catalogHidden) continue;
    entries.push(buildEntry(machine, [machine]));
  }

  for (const line of modelLines) {
    const group = all.filter((m) => m.modelLine === line);
    const visible = group.filter((m) => !m.catalogHidden);
    if (visible.length === 0) continue;

    const primary = pickCatalogPrimary(visible);
    const powerTiers = sortMachinesByPower(visible);
    entries.push(buildEntry(primary, powerTiers));
  }

  return entries.sort((a, b) => b.primary.rating.overall - a.primary.rating.overall);
}

export function getCatalogRedirectSlug(machine: Machine, locale: Locale = "en"): string | undefined {
  if (!machine.catalogHidden || !machine.modelLine) return undefined;
  const entry = getCatalogEntries(locale).find((e) => e.primary.modelLine === machine.modelLine);
  return entry?.primary.slug;
}

export function getPowerTiersForMachine(machine: Machine, locale: Locale = "en"): Machine[] {
  if (!machine.modelLine) return [];
  const tiers = localizeMachines(readPublishedMachines(), locale).filter(
    (m) => m.modelLine === machine.modelLine && !m.catalogHidden,
  );
  if (tiers.length <= 1) return [];
  return sortMachinesByPower(tiers);
}
