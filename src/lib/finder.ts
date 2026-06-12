import type { Locale } from "@/i18n/config";
import { parsePowerWatts } from "@/lib/catalog-display";
import { getCatalogEntries } from "@/lib/content";
import { getCatalogCardHero } from "@/lib/machine-images";
import { getMachineWorkFocus, type MachineWorkFocus } from "@/lib/machine-work-focus";
import type { LaserType } from "@/types/machine";

/** Slim, serializable machine data for the client-side finder quiz. */
export interface FinderMachine {
  slug: string;
  name: string;
  brand: string;
  laserType: LaserType;
  hero: string;
  tldr: string;
  priceMin: number;
  priceMax: number;
  watts: number | null;
  workFocus: MachineWorkFocus;
  canMetal: boolean;
  rating: {
    overall: number;
    easeOfUse: number;
    value: number;
    capability: number;
  };
}

export function getFinderMachines(locale: Locale): FinderMachine[] {
  return getCatalogEntries(locale).map(({ primary: m, displayName }) => ({
    slug: m.slug,
    name: displayName,
    brand: m.brand,
    laserType: m.laserType,
    hero: getCatalogCardHero(m),
    tldr: m.tldr,
    priceMin: m.priceRange.min,
    priceMax: m.priceRange.max,
    watts: parsePowerWatts(m),
    workFocus: getMachineWorkFocus(m),
    canMetal:
      m.laserType === "fiber" ||
      m.laserType === "uv" ||
      (m.laserCapabilities?.includes("fiber") ?? false) ||
      (m.capabilityTags?.includes("infrared") ?? false),
    rating: {
      overall: m.rating.overall,
      easeOfUse: m.rating.easeOfUse,
      value: m.rating.value,
      capability: m.rating.capability,
    },
  }));
}
