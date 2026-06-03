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

/** Catalog card — USD list prices only (hidden on /fr). */
export function CatalogCardPrice({
  entry,
  locale,
  className = "",
}: {
  entry: CatalogEntry;
  locale: Locale;
  className?: string;
}) {
  if (locale !== "en") return null;

  const secondary = formatCatalogPriceSecondary(entry, "en");

  return (
    <div className={className}>
      <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
        {formatCatalogPrice(entry, "en")}
      </p>
      {secondary && (
        <p className="text-xs text-stone-500 dark:text-stone-400">{secondary}</p>
      )}
    </div>
  );
}

/** Detail sidebar — USD + approximate EUR, optional SKU note. */
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
  if (locale !== "en") return null;

  const { min, max, note } = machine.priceRange;
  const { usd, eurApprox } = formatDualPriceRange(min, max);

  if (variant === "inline") {
    return (
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
          {labels.price}
        </p>
        <p className="mt-0.5 text-2xl font-bold text-stone-900 dark:text-stone-100">{usd}</p>
        <p className="text-sm text-stone-500 dark:text-stone-400">≈ {eurApprox}</p>
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
      <p className="mt-1 text-2xl font-bold text-stone-900 dark:text-stone-100">{usd}</p>
      <p className="text-sm text-stone-500 dark:text-stone-400">≈ {eurApprox}</p>
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

/** Compare table cell — compact USD range. */
export function ComparePriceCell({
  machine,
  locale,
}: {
  machine: Machine;
  locale: Locale;
}) {
  if (locale !== "en") return null;

  const { usd } = formatDualPriceRange(machine.priceRange.min, machine.priceRange.max);
  return <span className="font-medium text-stone-900 dark:text-stone-100">{usd}</span>;
}
