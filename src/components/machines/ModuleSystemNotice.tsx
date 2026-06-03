import type { Dictionary } from "@/i18n/dictionaries/types";
import type { Locale } from "@/i18n/config";
import { LocaleLink } from "@/components/layout/LocaleLink";
import type { Machine, ModuleSystem } from "@/types/machine";
import {
  formatModuleOptionChipLabel,
  getTierChipVariant,
  type TierChipVariant,
} from "@/lib/catalog-display";

type MachineLabels = Dictionary["machine"];

interface ModuleSystemNoticeProps {
  machine: Machine;
  powerTierCount: number;
  /** When set, avoids recomputing; otherwise derived from tiers if provided */
  tierChipVariant?: TierChipVariant;
  tiers?: Machine[];
  locale: Locale;
  labels: MachineLabels;
}

export function ModuleSystemNotice({
  machine,
  powerTierCount,
  tierChipVariant: variantProp,
  tiers,
  locale,
  labels,
}: ModuleSystemNoticeProps) {
  const config = machine.moduleSystem;
  if (!config) return null;

  const tierChipVariant =
    variantProp ?? (tiers?.length ? getTierChipVariant(tiers) : "power");
  const isMultiModule = tierChipVariant === "module";

  if (config.style === "interchangeable") {
    // Multi-tier lines use PowerTierNav; avoid duplicate module picker + footnote.
    if (powerTierCount > 1) return null;

    const shell = isMultiModule
      ? "border-sky-200 bg-sky-50 dark:border-sky-900 dark:bg-sky-950/50"
      : "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/50";
    const title = isMultiModule
      ? "text-sky-900 dark:text-sky-200"
      : "text-amber-900 dark:text-amber-200";
    const body = isMultiModule
      ? "text-sky-950/90 dark:text-sky-100/90"
      : "text-amber-950/90 dark:text-amber-100/90";
    const footnote = isMultiModule
      ? "text-sky-800 dark:text-sky-300"
      : "text-amber-800 dark:text-amber-300";
    const chipIdle = isMultiModule
      ? "border-sky-400 bg-white text-stone-900 ring-sky-300 hover:border-sky-500 hover:bg-sky-200 hover:text-stone-950 dark:border-sky-500 dark:bg-stone-800 dark:text-sky-50 dark:ring-sky-600 dark:hover:bg-sky-300 dark:hover:text-stone-950"
      : "border-amber-400 bg-white text-stone-900 ring-amber-300 hover:border-amber-500 hover:bg-amber-200 hover:text-stone-950 dark:border-amber-500 dark:bg-stone-800 dark:text-amber-50 dark:ring-amber-600 dark:hover:bg-amber-300 dark:hover:text-stone-950";
    return (
      <div className={`mt-4 rounded-xl border p-4 ${shell}`}>
        <p className={`text-sm font-semibold ${title}`}>{config.headline}</p>
        <p className={`mt-2 text-sm ${body}`}>{config.description}</p>
        {powerTierCount <= 1 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {config.options.map((opt) => {
              const chipLabel = formatModuleOptionChipLabel(opt, locale);
              const chipClass = `inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ring-1 transition ${chipIdle}`;
              return (
                <li key={opt.label}>
                  {opt.tierSlug ? (
                    <LocaleLink
                      href={`/lasers/${opt.tierSlug}`}
                      locale={locale}
                      className={chipClass}
                    >
                      {chipLabel}
                    </LocaleLink>
                  ) : (
                    <span className={chipClass}>{chipLabel}</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        {powerTierCount > 1 && (
          <p className={`mt-3 text-xs ${footnote}`}>
            {isMultiModule
              ? labels.moduleInterchangeableFootnote
              : labels.powerTierSwappableFootnote}
          </p>
        )}
      </div>
    );
  }

  if (config.style === "dual-laser") {
    return (
      <div className="mt-4 rounded-xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-900 dark:bg-violet-950/50">
        <p className="text-sm font-semibold text-violet-900 dark:text-violet-200">{config.headline}</p>
        <p className="mt-2 text-sm text-violet-950/90 dark:text-violet-100/90">{config.description}</p>
        <ul className="mt-3 space-y-1.5 text-sm text-violet-950 dark:text-violet-100">
          {config.options.map((opt) => (
            <li key={opt.label} className="flex gap-2">
              <span className="font-medium text-violet-900 dark:text-violet-200">
                {formatModuleOptionChipLabel(opt, locale)}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-violet-800 dark:text-violet-300">{labels.moduleHybridFootnote}</p>
      </div>
    );
  }

  return null;
}
