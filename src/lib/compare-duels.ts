import type { Locale } from "@/i18n/config";
import { getMachineBySlug } from "@/lib/content";
import type { Machine } from "@/types/machine";

/**
 * Curated machine duels published as static SEO pages (/compare/a-vs-b).
 * Slugs must reference indexable (non catalogHidden) machines.
 */
export const COMPARE_DUELS: ReadonlyArray<readonly [string, string]> = [
  ["xtool-s1-20w", "xtool-p2"],
  ["xtool-s1-20w", "glowforge-aura"],
  ["glowforge-aura", "xtool-p2"],
  ["xtool-d1-pro-20w", "ortur-laser-master-3-20w"],
  ["xtool-d1-pro-20w", "xtool-s1-20w"],
  ["xtool-f1", "xtool-f1-ultra"],
  ["xtool-f2", "xtool-f1-ultra"],
  ["xtool-f1-ultra", "commarker-b4-20w"],
  ["omtech-40w-co2", "xtool-p2"],
  ["monport-40w-co2", "omtech-40w-co2"],
  ["omtech-polar", "gweike-cloud-pro"],
  ["sculpfun-s9-10w", "ortur-laser-master-3-20w"],
  ["atomstack-a5-pro-10w", "longer-ray5-20w"],
  ["sculpfun-s30-ultra-22w", "creality-falcon2-22w"],
  ["creality-falcon2-pro-40w", "xtool-s1-20w"],
  // Premium CO₂ and upgrade paths
  ["xtool-p2", "xtool-p2s"],
  ["xtool-p2", "glowforge-pro"],
  ["glowforge-aura", "glowforge-pro"],
  ["gweike-cloud-pro", "xtool-p2"],
  ["xtool-p2s", "monport-55w-co2"],
  // Enclosed and open-frame diode rivals
  ["xtool-s1-20w", "wecreat-vision"],
  ["xtool-s1-40w", "xtool-s1-20w"],
  ["sculpfun-s30-ultra-22w", "ortur-laser-master-3-20w"],
  ["creality-falcon-a1-pro-20w", "xtool-d1-pro-20w"],
  ["creality-falcon2-pro-40w", "sculpfun-s40-max-48w"],
  // Portable metal markers
  ["xtool-f1-ultra", "laserpecker-5"],
  ["atomstack-a24-pro", "xtool-f1-ultra"],
  ["commarker-b4-20w", "commarker-b6-mopa-30w"],
  // Budget diode rivals and power tiers
  ["sculpfun-s30-ultra-22w", "atomstack-a40-pro-40w"],
  ["longer-ray5-40w", "creality-falcon2-pro-40w"],
  ["xtool-d1-pro-40w", "xtool-s1-40w"],
  ["sculpfun-s10-10w", "atomstack-a5-pro-10w"],
  ["foxaliens-reisler-2", "ortur-laser-master-3-20w"],
  ["algolaser-alpha-mk2-20w", "xtool-d1-pro-20w"],
  ["sculpfun-s40-max-48w", "longer-laser-b1-40w"],
  ["monport-40w-co2", "glowforge-aura"],
  // Galvo and fiber
  ["xtool-f2", "xtool-f1"],
  ["gweike-g2-20w", "commarker-b4-20w"],
  ["creality-falcon-t1-60w-mopa", "commarker-b6-mopa-30w"],
];

export function duelParam(slugs: readonly [string, string]): string {
  return `${slugs[0]}-vs-${slugs[1]}`;
}

export function findDuelByParam(param: string): readonly [string, string] | undefined {
  return COMPARE_DUELS.find((pair) => duelParam(pair) === param);
}

export interface ResolvedDuel {
  param: string;
  machines: [Machine, Machine];
}

export function resolveDuel(param: string, locale: Locale): ResolvedDuel | undefined {
  const pair = findDuelByParam(param);
  if (!pair) return undefined;

  const a = getMachineBySlug(pair[0], locale);
  const b = getMachineBySlug(pair[1], locale);
  if (!a || !b) return undefined;

  return { param, machines: [a, b] };
}

/** All duels with machines resolved — used for listings and the sitemap. */
export function getAllResolvedDuels(locale: Locale): ResolvedDuel[] {
  return COMPARE_DUELS.map((pair) => resolveDuel(duelParam(pair), locale)).filter(
    (d): d is ResolvedDuel => Boolean(d),
  );
}
