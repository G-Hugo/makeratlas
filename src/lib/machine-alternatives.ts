import type { Locale } from "@/i18n/config";
import { COMPARE_DUELS, duelParam } from "@/lib/compare-duels";
import { getCatalogEntries, getMachineBySlug, getSimilarMachines } from "@/lib/content";
import { serializeCompareIds } from "@/lib/machine-compare";
import type { Machine } from "@/types/machine";

export interface MachineAlternative {
  machine: Machine;
  /** Static duel page when one exists, otherwise the interactive comparator. */
  compareHref: string;
}

const DEFAULT_COUNT = 3;

function compareHrefFor(a: string, b: string): string {
  const pair = COMPARE_DUELS.find(
    ([x, y]) => (x === a && y === b) || (x === b && y === a),
  );
  if (pair) return `/compare/${duelParam(pair)}`;
  return `/compare?ids=${serializeCompareIds([a, b])}`;
}

/** Other half of every curated duel this machine appears in. */
function duelPartners(machine: Machine, locale: Locale): Machine[] {
  return COMPARE_DUELS.filter((pair) => pair.includes(machine.slug))
    .map((pair) => (pair[0] === machine.slug ? pair[1] : pair[0]))
    .map((slug) => getMachineBySlug(slug, locale))
    .filter((m): m is Machine => Boolean(m));
}

/**
 * Alternatives for a machine detail page: curated duel partners first
 * (they link to static duel pages), then curated `similarModels`,
 * topped up with same-type machines closest in price and rating.
 */
export function getMachineAlternatives(
  machine: Machine,
  locale: Locale,
  count = DEFAULT_COUNT,
): MachineAlternative[] {
  const picked: Machine[] = [];
  const excluded = new Set<string>([machine.slug]);
  if (machine.modelLine) excluded.add(machine.modelLine);

  for (const similar of [...duelPartners(machine, locale), ...getSimilarMachines(machine, locale)]) {
    if (picked.length >= count) break;
    if (excluded.has(similar.slug) || similar.catalogHidden) continue;
    if (similar.modelLine && similar.modelLine === machine.modelLine) continue;
    picked.push(similar);
    excluded.add(similar.slug);
    if (similar.modelLine) excluded.add(similar.modelLine);
  }

  if (picked.length < count) {
    const candidates = getCatalogEntries(locale)
      .map((entry) => entry.primary)
      .filter(
        (candidate) =>
          !excluded.has(candidate.slug) &&
          !(candidate.modelLine && excluded.has(candidate.modelLine)) &&
          candidate.laserType === machine.laserType,
      )
      .sort((a, b) => {
        const priceDeltaA = Math.abs(a.priceRange.min - machine.priceRange.min);
        const priceDeltaB = Math.abs(b.priceRange.min - machine.priceRange.min);
        // Price proximity buckets first, best rating inside a bucket.
        const bucketA = Math.round(priceDeltaA / 250);
        const bucketB = Math.round(priceDeltaB / 250);
        if (bucketA !== bucketB) return bucketA - bucketB;
        return b.rating.overall - a.rating.overall;
      });

    for (const candidate of candidates) {
      if (picked.length >= count) break;
      picked.push(candidate);
      excluded.add(candidate.slug);
      if (candidate.modelLine) excluded.add(candidate.modelLine);
    }
  }

  return picked.map((alt) => ({
    machine: alt,
    compareHref: compareHrefFor(machine.slug, alt.slug),
  }));
}
