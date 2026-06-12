import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { ResolvedBrandDuel } from "@/lib/compare-brand-duels";
import { buildBrandDuelChoices } from "@/lib/seo-brand-faq";
import { interpolate } from "@/lib/i18n-helpers";

interface BrandDuelVerdictProps {
  duel: ResolvedBrandDuel;
  locale: Locale;
  dict: Dictionary;
}

export function BrandDuelVerdict({ duel, locale, dict }: BrandDuelVerdictProps) {
  const c = dict.brandDuel;
  const [choiceA, choiceB] = buildBrandDuelChoices(duel, locale, dict);

  return (
    <section className="rounded-2xl border border-stone-200 bg-stone-50/80 p-6 dark:border-stone-700 dark:bg-stone-900/50">
      <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">{c.chooseTitle}</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {[choiceA, choiceB].map(({ brand, reasons }) => (
          <div
            key={brand.slug}
            className="rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-700 dark:bg-stone-900"
          >
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              {interpolate(c.chooseIf, { brand: brand.name })}
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-stone-700 dark:text-stone-300">
              {reasons.map((reason) => (
                <li key={reason} className="flex gap-2">
                  <span className="text-amber-600 dark:text-amber-400" aria-hidden>
                    →
                  </span>
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
