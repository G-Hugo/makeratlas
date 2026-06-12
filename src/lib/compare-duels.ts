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
