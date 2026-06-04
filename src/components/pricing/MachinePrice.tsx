import { LocaleLink } from "@/components/layout/LocaleLink";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/types";
import {
  formatCatalogPrice,
  formatCatalogPriceSecondary,
} from "@/lib/catalog-display";
import type { CatalogEntry } from "@/lib/catalog-types";
import { formatDualPriceRange } from "@/lib/pricing";
import type { Machine } from "@/types/machine";

type MachineLabels = Dictionary["machine"];

/** Catalog card : primary currency by locale (USD en, EUR indicatif fr). */
export function CatalogCardPrice({
  entry,
  locale,
  className = "",
}: {
  entry: CatalogEntry;
  locale: Locale;
  className?: string;
}) {
  const primary = formatCatalogPrice(entry, locale);
  const secondary = formatCatalogPriceSecondary(entry, locale);

  return (
    <div className={className}>
      <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{primary}</p>
      {secondary && (
        <p className="text-xs text-stone-500 dark:text-stone-400">{secondary}</p>
      )}
    </div>
  );
}

/** Detail sidebar : indicative range + secondary currency, optional SKU note. */
export function MachineDetailPrice({
  machine,
  locale,
  labels,
  variant = "card",
}: {
  machine: Machine;
  locale: Locale;
  labels: MachineLabels;
  variant?: "card" | "inline";
}) {
  const { min, max, note } = machine.priceRange;
  const { usd, eurApprox } = formatDualPriceRange(min, max);
  const primary = locale === "fr" ? eurApprox : usd;
  const secondary = locale === "fr" ? usd : eurApprox;

  if (variant === "inline") {
    return (
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
          {labels.price}
        </p>
        <p className="mt-0.5 text-2xl font-bold text-stone-900 dark:text-stone-100">{primary}</p>
        <p className="text-sm text-stone-500 dark:text-stone-400">≈ {secondary}</p>
        {note?.trim() && (
          <p className="mt-1 max-w-xs text-xs text-stone-600 dark:text-stone-400">{note}</p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-700 dark:bg-stone-900">
      <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
        {labels.price}
      </p>
      <p className="mt-1 text-2xl font-bold text-stone-900 dark:text-stone-100">{primary}</p>
      <p className="text-sm text-stone-500 dark:text-stone-400">≈ {secondary}</p>
      {note?.trim() && (
        <p className="mt-2 text-xs leading-relaxed text-stone-600 dark:text-stone-400">
          {note}
        </p>
      )}
      <p className="mt-3 text-xs text-stone-500 dark:text-stone-400">
        {labels.pricingNote}{" "}
        <LocaleLink
          href="/methodology"
          locale={locale}
          className="font-medium text-amber-700 hover:underline dark:text-amber-400"
        >
          {labels.pricingMethodology}
        </LocaleLink>
        .
      </p>
    </div>
  );
}

/** Compare table cell : compact indicative range. */
export function ComparePriceCell({
  machine,
  locale,
}: {
  machine: Machine;
  locale: Locale;
}) {
  const { usd, eurApprox } = formatDualPriceRange(
    machine.priceRange.min,
    machine.priceRange.max,
  );
  const primary = locale === "fr" ? eurApprox : usd;
  return <span className="font-medium text-stone-900 dark:text-stone-100">{primary}</span>;
}
