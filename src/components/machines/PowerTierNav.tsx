import type { Dictionary } from "@/i18n/dictionaries/types";
import type { Locale } from "@/i18n/config";
import type { Machine } from "@/types/machine";
import { PowerTierChips } from "@/components/machines/PowerTierChips";
import { getTierChipVariant, powerTierLabel } from "@/lib/catalog-display";

interface PowerTierNavProps {
  tiers: Machine[];
  activeSlug: string;
  locale: Locale;
  labels: Dictionary["machine"];
  onSelectTier?: (slug: string) => void;
  compact?: boolean;
}

export function PowerTierNav({
  tiers,
  activeSlug,
  locale,
  labels,
  onSelectTier,
  compact = false,
}: PowerTierNavProps) {
  if (tiers.length <= 1) return null;

  const active = tiers.find((t) => t.slug === activeSlug) ?? tiers[0];
  const activeLabel = powerTierLabel(active, locale, tiers);
  const chipVariant = getTierChipVariant(tiers);
  const isModuleLine = chipVariant === "module";
  const hint = isModuleLine ? labels.powerTierSpecsModule : labels.powerTierSpecsSku;
  const sectionShell = isModuleLine
    ? "border-sky-200 bg-sky-50/80 dark:border-sky-900 dark:bg-sky-950/40"
    : "border-amber-200 bg-amber-50/80 dark:border-amber-900 dark:bg-amber-950/40";

  return (
    <section
      className={
        compact
          ? `rounded-lg border p-3 ${sectionShell}`
          : `rounded-xl border p-4 sm:p-5 ${sectionShell}`
      }
      aria-label={isModuleLine ? labels.powerTierChooseModule : labels.powerTierChoosePower}
    >
      <div
        className={
          compact
            ? "space-y-2"
            : "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        }
      >
        <div>
          <p
            className={`text-xs font-semibold uppercase tracking-wide ${
              isModuleLine
                ? "text-sky-700 dark:text-sky-300"
                : "text-amber-800 dark:text-amber-300"
            }`}
          >
            {isModuleLine ? labels.powerTierChooseModule : labels.powerTierChoosePower}
          </p>
          {!compact && (
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">{hint}</p>
          )}
        </div>
        <p className="text-xs text-stone-700 sm:text-right dark:text-stone-300">
          <span className="font-medium text-stone-900 dark:text-stone-100">
            {isModuleLine ? labels.powerTierActiveModule : labels.powerTierActive}:
          </span>{" "}
          <span
            className={`font-semibold ${
              isModuleLine
                ? "text-sky-800 dark:text-sky-200"
                : "text-amber-900 dark:text-amber-200"
            }`}
          >
            {activeLabel}
          </span>
        </p>
      </div>
      <div className={compact ? "mt-2" : "mt-4"}>
        <PowerTierChips
          tiers={tiers}
          activeSlug={activeSlug}
          linkable={!onSelectTier}
          onSelectTier={onSelectTier}
          variant={chipVariant}
          locale={locale}
          size={compact ? "sm" : "md"}
        />
      </div>
    </section>
  );
}
