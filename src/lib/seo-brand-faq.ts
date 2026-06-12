import type { FaqItem } from "@/components/seo/SeoFaqSection";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { interpolate } from "@/lib/i18n-helpers";
import type { ResolvedBrandDuel } from "@/lib/compare-brand-duels";
import { formatPriceRange } from "@/lib/pricing";
import type { BrandProfile } from "@/types/brand";

function priceRange(brand: BrandProfile, locale: Locale): string {
  return formatPriceRange(
    brand.priceMin,
    brand.priceMax,
    locale === "fr" ? "EUR" : "USD",
  );
}

function laserTypesLabel(brand: BrandProfile, dict: Dictionary): string {
  const labels = dict.laserTypes;
  const map: Record<string, string> = {
    diode: labels.diode,
    co2: labels.co2,
    fiber: labels.fiber,
    uv: labels.uv,
    hybrid: labels.hybrid,
  };
  return brand.laserTypes.map((t) => map[t] ?? t).join(", ");
}

/** Data-driven FAQ for brand-vs-brand pages. */
export function buildBrandDuelFaq(
  duel: ResolvedBrandDuel,
  locale: Locale,
  dict: Dictionary,
): FaqItem[] {
  const c = dict.brandDuel;
  const [a, b] = duel.brands;
  const [scoreA, scoreB] = duel.avgScores;
  const names = { a: a.name, b: b.name };

  const items: FaqItem[] = [];
  const scoresEqual = scoreA === scoreB;
  const winner = scoreA >= scoreB ? a : b;
  const loser = winner === a ? b : a;
  const wScore = winner === a ? scoreA : scoreB;
  const lScore = loser === a ? scoreA : scoreB;

  items.push({
    question: interpolate(c.faqWhichBrandQ, names),
    answer: scoresEqual
      ? interpolate(c.faqWhichBrandTieA, { score: scoreA.toFixed(1) })
      : interpolate(c.faqWhichBrandA, {
          winner: winner.name,
          loser: loser.name,
          wScore: wScore.toFixed(1),
          lScore: lScore.toFixed(1),
        }),
  });

  const cheap = a.priceMin <= b.priceMin ? a : b;
  const other = cheap === a ? b : a;
  items.push({
    question: interpolate(c.faqCheaperBrandQ, names),
    answer: interpolate(c.faqCheaperBrandA, {
      cheap: cheap.name,
      cheapFrom: priceRange(cheap, locale),
      other: other.name,
      otherFrom: priceRange(other, locale),
    }),
  });

  items.push({
    question: interpolate(c.faqDifferenceBrandQ, names),
    answer: interpolate(c.faqDifferenceBrandA, {
      a: a.name,
      aKnown: a.knownFor,
      b: b.name,
      bKnown: b.knownFor,
      aTypes: laserTypesLabel(a, dict),
      bTypes: laserTypesLabel(b, dict),
    }),
  });

  const [ma, mb] = duel.featuredMachines;
  items.push({
    question: interpolate(c.faqFlagshipQ, names),
    answer: interpolate(c.faqFlagshipA, {
      a: a.name,
      aModel: ma.name,
      b: b.name,
      bModel: mb.name,
    }),
  });

  return items;
}

export interface BrandDuelChoice {
  brand: BrandProfile;
  reasons: string[];
}

/** “Choose X if…” bullets derived from brand positioning. */
export function buildBrandDuelChoices(
  duel: ResolvedBrandDuel,
  locale: Locale,
  dict: Dictionary,
): [BrandDuelChoice, BrandDuelChoice] {
  const [a, b] = duel.brands;
  const [scoreA, scoreB] = duel.avgScores;
  const c = dict.brandDuel;

  const reasonsFor = (brand: BrandProfile, other: BrandProfile, score: number, otherScore: number): string[] => {
    const reasons: string[] = [];
    if (brand.priceMin < other.priceMin) {
      reasons.push(interpolate(c.reasonBudget, { brand: brand.name }));
    }
    if (brand.laserTypes.length > other.laserTypes.length) {
      reasons.push(interpolate(c.reasonBreadth, { types: brand.laserTypes.length }));
    }
    if (score > otherScore) {
      reasons.push(interpolate(c.reasonAvgScore, { score: score.toFixed(1) }));
    }
    if (brand.lineCount > other.lineCount) {
      reasons.push(interpolate(c.reasonCatalog, { count: brand.lineCount }));
    }
    reasons.push(...brand.strengths.slice(0, 2).map((s) => s));
    return reasons.slice(0, 4);
  };

  return [
    { brand: a, reasons: reasonsFor(a, b, scoreA, scoreB) },
    { brand: b, reasons: reasonsFor(b, a, scoreB, scoreA) },
  ];
}
