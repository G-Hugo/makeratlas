import type { Dictionary } from "@/i18n/dictionaries/types";
import type { Locale } from "@/i18n/config";
import type { Machine } from "@/types/machine";
import { PowerTierChips } from "@/components/machines/PowerTierChips";
import { powerTierLabel } from "@/lib/catalog-display";

interface PowerTierNavProps {
  tiers: Machine[];
  activeSlug: string;
  locale: Locale;
  labels: Dictionary["machine"];
  onSelectTier?: (slug: string) => void;
}

export function PowerTierNav({
  tiers,
  activeSlug,
  locale,
  labels,
  onSelectTier,
}: PowerTierNavProps) {
  if (tiers.length <= 1) return null;

  const active = tiers.find((t) => t.slug === activeSlug) ?? tiers[0];
  const activeLabel = powerTierLabel(active, locale);
  const isModuleLine = tiers.some((t) => t.moduleSystem?.style === "interchangeable");
  const hint = isModuleLine ? labels.powerTierSpecsModule : labels.powerTierSpecsSku;

  return (
    <section
      className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5 dark:border-slate-700 dark:bg-slate-900/50"
      aria-label={labels.powerTierChoosePower}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {isModuleLine ? labels.powerTierChooseModule : labels.powerTierChoosePower}
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{hint}</p>
        </div>
        <p className="text-sm text-slate-700 sm:text-right dark:text-slate-300">
          <span className="font-medium text-slate-900 dark:text-slate-100">{labels.powerTierActive}:</span>{" "}
          <span className="font-semibold text-slate-900 dark:text-slate-100">{activeLabel}</span>
        </p>
      </div>
      <div className="mt-4">
        <PowerTierChips
          tiers={tiers}
          activeSlug={activeSlug}
          linkable={!onSelectTier}
          onSelectTier={onSelectTier}
          locale={locale}
          size="md"
        />
      </div>
    </section>
  );
}
