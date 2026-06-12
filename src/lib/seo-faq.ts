import type { FaqItem } from "@/components/seo/SeoFaqSection";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { BEST_OF_YEAR, type BestOfCategory, type RankedEntry } from "@/lib/best-of";
import { interpolate, laserTypeLabelLocalized } from "@/lib/i18n-helpers";
import { getMachineWorkFocus, type MachineWorkFocus } from "@/lib/machine-work-focus";
import { formatMoney } from "@/lib/pricing";
import type { Machine } from "@/types/machine";

function price(amount: number, locale: Locale): string {
  return formatMoney(amount, locale === "fr" ? "EUR" : "USD");
}

function focusLabel(focus: MachineWorkFocus, dict: Dictionary): string {
  const labels: Record<MachineWorkFocus, string> = {
    engrave: dict.workFocus.engrave,
    cut: dict.workFocus.cut,
    both: dict.workFocus.both,
  };
  return labels[focus].toLowerCase();
}

/** Data-driven FAQ for a-vs-b duel pages. */
export function buildDuelFaq(
  machines: [Machine, Machine],
  locale: Locale,
  dict: Dictionary,
): FaqItem[] {
  const c = dict.compare;
  const [a, b] = machines;
  const names = { a: a.name, b: b.name };

  const items: FaqItem[] = [];

  const ratingsEqual = a.rating.overall === b.rating.overall;
  const winner = a.rating.overall >= b.rating.overall ? a : b;
  const loser = winner === a ? b : a;
  items.push({
    question: interpolate(c.faqWhichBetterQ, names),
    answer: ratingsEqual
      ? interpolate(c.faqWhichBetterTieA, { score: a.rating.overall.toFixed(1) })
      : interpolate(c.faqWhichBetterA, {
          winner: winner.name,
          loser: loser.name,
          wScore: winner.rating.overall.toFixed(1),
          lScore: loser.rating.overall.toFixed(1),
        }),
  });

  const cheap = a.priceRange.min <= b.priceRange.min ? a : b;
  const other = cheap === a ? b : a;
  items.push({
    question: interpolate(c.faqCheaperQ, names),
    answer: interpolate(c.faqCheaperA, {
      cheap: cheap.name,
      cheapPrice: price(cheap.priceRange.min, locale),
      other: other.name,
      otherPrice: price(other.priceRange.min, locale),
    }),
  });

  const easeEqual = a.rating.easeOfUse === b.rating.easeOfUse;
  const easier = a.rating.easeOfUse >= b.rating.easeOfUse ? a : b;
  const harder = easier === a ? b : a;
  items.push({
    question: interpolate(c.faqBeginnerQ, names),
    answer: easeEqual
      ? interpolate(c.faqBeginnerTieA, { score: a.rating.easeOfUse.toFixed(1) })
      : interpolate(c.faqBeginnerA, {
          name: easier.name,
          score: easier.rating.easeOfUse.toFixed(1),
          other: harder.name,
          otherScore: harder.rating.easeOfUse.toFixed(1),
        }),
  });

  items.push({
    question: interpolate(c.faqDifferenceQ, names),
    answer: interpolate(c.faqDifferenceA, {
      a: a.name,
      b: b.name,
      typeA: laserTypeLabelLocalized(a.laserType, dict),
      typeB: laserTypeLabelLocalized(b.laserType, dict),
      focusA: focusLabel(getMachineWorkFocus(a), dict),
      focusB: focusLabel(getMachineWorkFocus(b), dict),
    }),
  });

  return items;
}

/** Data-driven FAQ for best-of ranking pages. */
export function buildBestOfFaq(
  category: BestOfCategory,
  ranking: RankedEntry[],
  locale: Locale,
  dict: Dictionary,
): FaqItem[] {
  const b = dict.bestOf;
  const subject = category.copy[locale].faqSubject;
  const top = ranking[0]?.entry.primary;
  if (!top) return [];

  const items: FaqItem[] = [
    {
      question: interpolate(b.faqBestQ, { subject, year: BEST_OF_YEAR }),
      answer: interpolate(b.faqBestA, {
        name: ranking[0].entry.displayName,
        score: top.rating.overall.toFixed(1),
        price: price(top.priceRange.min, locale),
        tldr: top.tldr,
      }),
    },
  ];

  const cheapest = [...ranking].sort(
    (x, y) => x.entry.primary.priceRange.min - y.entry.primary.priceRange.min,
  )[0];
  if (cheapest && cheapest.entry.primary.slug !== top.slug) {
    items.push({
      question: interpolate(b.faqBudgetQ, { subject }),
      answer: interpolate(b.faqBudgetA, {
        name: cheapest.entry.displayName,
        price: price(cheapest.entry.primary.priceRange.min, locale),
        score: cheapest.entry.primary.rating.overall.toFixed(1),
      }),
    });
  }

  items.push({ question: b.faqHowQ, answer: b.faqHowA });

  return items;
}
