"use client";

import { LocaleLink } from "@/components/layout/LocaleLink";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { interpolate } from "@/lib/i18n-helpers";
import {
  MAX_COMPARE_MACHINES,
  MIN_COMPARE_MACHINES,
  serializeCompareIds,
} from "@/lib/machine-compare";

interface CatalogCompareBarProps {
  selectedSlugs: string[];
  locale: Locale;
  dict: Dictionary;
  onClear: () => void;
}

/** Floating pill shown on catalog pages while a compare selection is active. */
export function CatalogCompareBar({
  selectedSlugs,
  locale,
  dict,
  onClear,
}: CatalogCompareBarProps) {
  const c = dict.compare;
  if (selectedSlugs.length === 0) return null;

  const canCompare = selectedSlugs.length >= MIN_COMPARE_MACHINES;

  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full border border-stone-200 bg-white/95 py-2 pl-4 pr-2 shadow-xl backdrop-blur dark:border-stone-700 dark:bg-stone-900/95">
      <p className="text-sm font-medium text-stone-800 dark:text-stone-200">
        {interpolate(c.browseSelectedBar, {
          count: selectedSlugs.length,
          max: MAX_COMPARE_MACHINES,
        })}
      </p>
      <button
        type="button"
        onClick={onClear}
        className="text-xs font-medium text-stone-500 transition hover:text-stone-800 dark:hover:text-stone-200"
      >
        {c.browseClearSelection}
      </button>
      {canCompare ? (
        <LocaleLink
          href={`/compare?ids=${serializeCompareIds(selectedSlugs)}`}
          locale={locale}
          className="rounded-full bg-amber-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-amber-700"
        >
          {c.browseCompareNow}
        </LocaleLink>
      ) : (
        <span className="rounded-full bg-stone-100 px-4 py-1.5 text-xs text-stone-500 dark:bg-stone-800 dark:text-stone-400">
          {c.browseNeedTwoHint}
        </span>
      )}
    </div>
  );
}
