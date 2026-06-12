import { LocaleLink } from "@/components/layout/LocaleLink";
import type { Locale } from "@/i18n/config";
import type { ResolvedBrandDuel } from "@/lib/compare-brand-duels";

interface BrandDuelsListProps {
  duels: ResolvedBrandDuel[];
  locale: Locale;
  /** Highlight the named brand first in each chip label when present in the duel. */
  highlightBrandSlug?: string;
  className?: string;
}

function duelLabel(duel: ResolvedBrandDuel, highlightBrandSlug?: string): string {
  const [a, b] = duel.brands;
  if (highlightBrandSlug === b.slug) return `${b.name} vs ${a.name}`;
  return `${a.name} vs ${b.name}`;
}

export function BrandDuelsList({
  duels,
  locale,
  highlightBrandSlug,
  className = "",
}: BrandDuelsListProps) {
  if (!duels.length) return null;

  return (
    <ul className={`space-y-2.5 ${className}`}>
      {duels.map((duel) => (
        <li key={duel.param}>
          <LocaleLink
            href={`/compare/brands/${duel.param}`}
            locale={locale}
            className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm transition hover:border-amber-300 hover:bg-amber-50 dark:border-stone-700 dark:bg-stone-900 dark:hover:border-amber-600 dark:hover:bg-amber-950/30"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-600 text-[10px] font-black uppercase text-white dark:bg-amber-500 dark:text-stone-950">
              vs
            </span>
            <span className="min-w-0 truncate font-medium text-stone-800 dark:text-stone-100">
              {duelLabel(duel, highlightBrandSlug)}
            </span>
          </LocaleLink>
        </li>
      ))}
    </ul>
  );
}
