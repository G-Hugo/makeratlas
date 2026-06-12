import type { Locale } from "@/i18n/config";
import { getBrandBySlug, getCatalogEntriesByBrand } from "@/lib/brands";
import { duelParam, findDuelByParam } from "@/lib/compare-duels";
import { getMachineBySlug } from "@/lib/content";
import { serializeCompareIds } from "@/lib/machine-compare";
import type { BrandProfile } from "@/types/brand";
import type { Machine } from "@/types/machine";

export interface BrandDuelDefinition {
  brands: readonly [string, string];
  /** Indexable machine slugs for the representative product comparison. */
  featuredMachines: readonly [string, string];
}

/** Curated brand-vs-brand SEO pages at /compare/brands/a-vs-b. */
export const BRAND_COMPARE_DUELS: readonly BrandDuelDefinition[] = [
  {
    brands: ["xtool", "glowforge"],
    featuredMachines: ["xtool-s1-20w", "glowforge-aura"],
  },
  {
    brands: ["sculpfun", "ortur"],
    featuredMachines: ["sculpfun-s30-ultra-22w", "ortur-laser-master-3-20w"],
  },
  {
    brands: ["atomstack", "longer"],
    featuredMachines: ["atomstack-a5-pro-10w", "longer-ray5-20w"],
  },
  {
    brands: ["creality", "foxalien"],
    featuredMachines: ["creality-falcon2-22w", "foxaliens-reisler-2"],
  },
  {
    brands: ["commarker", "xtool"],
    featuredMachines: ["commarker-b4-20w", "xtool-f1-ultra"],
  },
  {
    brands: ["gweike", "omtech"],
    featuredMachines: ["gweike-cloud-pro", "omtech-polar"],
  },
  {
    brands: ["wecreat", "xtool"],
    featuredMachines: ["wecreat-vision", "xtool-s1-20w"],
  },
  {
    brands: ["monport", "omtech"],
    featuredMachines: ["monport-55w-co2", "omtech-polar"],
  },
];

export function brandDuelParam(slugs: readonly [string, string]): string {
  return `${slugs[0]}-vs-${slugs[1]}`;
}

export function findBrandDuelByParam(param: string): BrandDuelDefinition | undefined {
  return BRAND_COMPARE_DUELS.find((d) => brandDuelParam(d.brands) === param);
}

export interface ResolvedBrandDuel {
  param: string;
  definition: BrandDuelDefinition;
  brands: [BrandProfile, BrandProfile];
  featuredMachines: [Machine, Machine];
  avgScores: [number, number];
}

export function getBrandAvgScore(brandSlug: string, locale: Locale): number {
  const entries = getCatalogEntriesByBrand(brandSlug, locale);
  if (!entries.length) return 0;
  const sum = entries.reduce((acc, e) => acc + e.primary.rating.overall, 0);
  return Math.round((sum / entries.length) * 10) / 10;
}

export function resolveBrandDuel(param: string, locale: Locale): ResolvedBrandDuel | undefined {
  const definition = findBrandDuelByParam(param);
  if (!definition) return undefined;

  const a = getBrandBySlug(definition.brands[0], locale);
  const b = getBrandBySlug(definition.brands[1], locale);
  if (!a || !b) return undefined;

  const ma = getMachineBySlug(definition.featuredMachines[0], locale);
  const mb = getMachineBySlug(definition.featuredMachines[1], locale);
  if (!ma || !mb) return undefined;

  return {
    param,
    definition,
    brands: [a, b],
    featuredMachines: [ma, mb],
    avgScores: [
      getBrandAvgScore(a.slug, locale),
      getBrandAvgScore(b.slug, locale),
    ],
  };
}

export function getAllResolvedBrandDuels(locale: Locale): ResolvedBrandDuel[] {
  return BRAND_COMPARE_DUELS.map((d) => resolveBrandDuel(brandDuelParam(d.brands), locale)).filter(
    (d): d is ResolvedBrandDuel => Boolean(d),
  );
}

/** Link to a static machine duel page when one exists, otherwise the interactive comparator. */
export function featuredMachineDuelHref(pair: readonly [string, string]): string {
  const forward = duelParam(pair);
  const reverse = duelParam([pair[1], pair[0]]);
  if (findDuelByParam(forward)) return `/compare/${forward}`;
  if (findDuelByParam(reverse)) return `/compare/${reverse}`;
  return `/compare?ids=${serializeCompareIds([pair[0], pair[1]])}`;
}
