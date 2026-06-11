"use client";

import { LocaleLink } from "@/components/layout/LocaleLink";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { interpolate, laserTypeLabelLocalized } from "@/lib/i18n-helpers";
import { machineMatchesLaserType } from "@/lib/laser-capabilities";
import { CompareBrowseTray } from "@/components/compare/CompareBrowseTray";
import { ComparePriceCell } from "@/components/pricing/MachinePrice";
import { MAX_COMPARE_MACHINES } from "@/lib/machine-compare";
import { formatMoney, usdToEur } from "@/lib/pricing";
import type { Machine, LaserType } from "@/types/machine";
import { useMemo, useState } from "react";

interface CompareBrowseTableProps {
  machines: Machine[];
  locale: Locale;
  dict: Dictionary;
  selectedSlugs: string[];
  onSelectionChange: (slugs: string[]) => void;
  onCompareNow: () => void;
}

const MAX_PRICE_OPTIONS = [
  { value: "all", usd: null },
  { value: 500, usd: 500 },
  { value: 1000, usd: 1000 },
  { value: 2000, usd: 2000 },
  { value: 5000, usd: 5000 },
] as const;

type MaxPriceFilter = (typeof MAX_PRICE_OPTIONS)[number]["value"];
type SortKey = "score" | "price" | "name";

function exampleSummary(example: { time: string; size: string }) {
  if (example.size === "—") return example.time;
  return `${example.time} (${example.size})`;
}

export function CompareBrowseTable({
  machines,
  locale,
  dict,
  selectedSlugs,
  onSelectionChange,
  onCompareNow,
}: CompareBrowseTableProps) {
  const c = dict.compare;
  const selectedSet = useMemo(() => new Set(selectedSlugs), [selectedSlugs]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<LaserType | "all">("all");
  const [maxPrice, setMaxPrice] = useState<MaxPriceFilter>("all");
  const [sort, setSort] = useState<SortKey>("score");

  const filtered = useMemo(() => {
    const priceCap =
      maxPrice === "all" ? null : MAX_PRICE_OPTIONS.find((o) => o.value === maxPrice)?.usd ?? null;
    const q = search.trim().toLowerCase();

    let result = machines.filter((m) => {
      const typeMatch = typeFilter === "all" || machineMatchesLaserType(m, typeFilter);
      const priceMatch = priceCap === null || m.priceRange.min <= priceCap;
      const searchMatch =
        q === "" ||
        m.name.toLowerCase().includes(q) ||
        m.brand.toLowerCase().includes(q) ||
        m.mainObjective.toLowerCase().includes(q) ||
        m.bestFor.some((b) => b.toLowerCase().includes(q));
      return typeMatch && priceMatch && searchMatch;
    });

    result = [...result].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "price") {
        if (a.priceRange.min !== b.priceRange.min) return a.priceRange.min - b.priceRange.min;
        return b.rating.overall - a.rating.overall;
      }
      return b.rating.overall - a.rating.overall;
    });

    return result;
  }, [machines, search, typeFilter, maxPrice, sort]);

  const selectedMachines = useMemo(
    () =>
      selectedSlugs
        .map((slug) => machines.find((m) => m.slug === slug))
        .filter((m): m is Machine => Boolean(m)),
    [selectedSlugs, machines],
  );

  const atMax = selectedSlugs.length >= MAX_COMPARE_MACHINES;

  function toggleSelection(slug: string) {
    if (selectedSet.has(slug)) {
      onSelectionChange(selectedSlugs.filter((s) => s !== slug));
      return;
    }
    if (atMax) return;
    onSelectionChange([...selectedSlugs, slug]);
  }

  return (
    <div>
      <div className="mb-4 text-sm text-stone-600 dark:text-stone-400">
        <p>{interpolate(c.showingCount, { count: filtered.length })}</p>
      </div>

      <div className="mb-8 flex flex-wrap gap-4 rounded-xl border border-stone-200 bg-white p-4 dark:border-stone-700 dark:bg-stone-900">
        <label className="flex min-w-[200px] flex-1 flex-col gap-1 text-sm">
          <span className="font-medium text-stone-700 dark:text-stone-300">{c.searchLabel}</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={c.searchPlaceholder}
            className="rounded-md border border-stone-300 bg-white px-3 py-2 dark:border-stone-600 dark:bg-stone-950 dark:text-stone-100"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-stone-700 dark:text-stone-300">{c.laserType}</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as LaserType | "all")}
            className="rounded-md border border-stone-300 bg-white px-3 py-2 dark:border-stone-600 dark:bg-stone-950 dark:text-stone-100"
          >
            <option value="all">{c.allTypes}</option>
            <option value="diode">{dict.laserTypes.diode}</option>
            <option value="co2">{dict.laserTypes.co2}</option>
            <option value="fiber">{dict.laserTypes.fiber}</option>
            <option value="uv">{dict.laserTypes.uv}</option>
            <option value="hybrid">{dict.laserTypes.hybrid}</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-stone-700 dark:text-stone-300">{c.maxPrice}</span>
          <select
            value={String(maxPrice)}
            onChange={(e) => {
              const v = e.target.value;
              setMaxPrice(v === "all" ? "all" : (Number(v) as MaxPriceFilter));
            }}
            className="rounded-md border border-stone-300 bg-white px-3 py-2 dark:border-stone-600 dark:bg-stone-950 dark:text-stone-100"
          >
            <option value="all">{c.anyBudget}</option>
            {MAX_PRICE_OPTIONS.filter((o) => o.usd !== null).map((o) => (
              <option key={o.value} value={o.value}>
                {locale === "fr"
                  ? `≤ ${formatMoney(usdToEur(o.usd), "EUR")}`
                  : `≤ $${o.usd}`}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-stone-700 dark:text-stone-300">{c.sortLabel}</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-md border border-stone-300 bg-white px-3 py-2 dark:border-stone-600 dark:bg-stone-950 dark:text-stone-100"
          >
            <option value="score">{c.sortByScore}</option>
            <option value="price">{c.sortByPrice}</option>
            <option value="name">{c.sortByName}</option>
          </select>
        </label>
      </div>

      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-900">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 dark:border-stone-700 dark:bg-stone-950">
            <tr>
              <th className="w-12 px-2 py-3 text-center font-semibold text-stone-700 dark:text-stone-300">
                <span className="sr-only">{c.browseCompareColumn}</span>
              </th>
              <th className="px-4 py-3 font-semibold text-stone-700 dark:text-stone-300">{c.machine}</th>
              <th className="px-4 py-3 font-semibold text-stone-700 dark:text-stone-300">{c.price}</th>
              <th className="px-4 py-3 font-semibold text-stone-700 dark:text-stone-300">{c.mainObjective}</th>
              <th className="px-4 py-3 font-semibold text-stone-700 dark:text-stone-300">{c.precision}</th>
              <th className="px-4 py-3 font-semibold text-stone-700 dark:text-stone-300">{c.sampleEngrave}</th>
              <th className="px-4 py-3 font-semibold text-stone-700 dark:text-stone-300">{c.sampleCut}</th>
              <th className="px-4 py-3 font-semibold text-stone-700 dark:text-stone-300">{c.score}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((machine) => {
              const isSelected = selectedSet.has(machine.slug);
              const isDisabled = !isSelected && atMax;

              return (
              <tr
                key={machine.id}
                role="button"
                tabIndex={isDisabled ? -1 : 0}
                onClick={() => !isDisabled && toggleSelection(machine.slug)}
                onKeyDown={(e) => {
                  if (isDisabled) return;
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleSelection(machine.slug);
                  }
                }}
                aria-pressed={isSelected}
                aria-disabled={isDisabled}
                title={
                  isDisabled
                    ? interpolate(c.browseMaxReached, { max: MAX_COMPARE_MACHINES })
                    : isSelected
                      ? c.removeMachine
                      : c.addToCompare
                }
                className={`border-b border-stone-100 dark:border-stone-800 ${
                  isDisabled
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer"
                } ${
                  isSelected
                    ? "bg-amber-50/80 dark:bg-amber-950/40"
                    : "hover:bg-amber-50/50 dark:hover:bg-amber-950/30"
                }`}
              >
                <td className="px-2 py-3 text-center">
                  <span
                    aria-hidden
                    className={`inline-flex h-5 w-5 items-center justify-center rounded border-2 text-xs font-bold ${
                      isSelected
                        ? "border-amber-600 bg-amber-600 text-white dark:border-amber-500 dark:bg-amber-500"
                        : "border-stone-300 bg-white dark:border-stone-600 dark:bg-stone-950"
                    }`}
                  >
                    {isSelected ? "✓" : ""}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <LocaleLink
                    href={`/lasers/${machine.slug}`}
                    locale={locale}
                    onClick={(e) => e.stopPropagation()}
                    className="font-medium text-amber-700 hover:underline dark:text-amber-400"
                  >
                    {machine.name}
                  </LocaleLink>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {machine.brand} · {laserTypeLabelLocalized(machine.laserType, dict)}
                  </p>
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <ComparePriceCell machine={machine} locale={locale} />
                </td>
                <td className="max-w-[160px] px-4 py-3 text-xs text-stone-700 dark:text-stone-300">
                  {machine.mainObjective}
                </td>
                <td className="px-4 py-3 font-medium text-stone-900 dark:text-stone-100">
                  {machine.specs.performance.precision}
                </td>
                <td className="max-w-[140px] px-4 py-3 text-xs text-stone-700 dark:text-stone-300">
                  {exampleSummary(machine.specs.performance.engraveExample)}
                </td>
                <td className="max-w-[140px] px-4 py-3 text-xs text-stone-700 dark:text-stone-300">
                  {exampleSummary(machine.specs.performance.cutExample)}
                </td>
                <td className="px-4 py-3 font-semibold text-stone-900 dark:text-stone-100">
                  {machine.rating.overall.toFixed(1)}
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <p className="mt-6 text-center text-stone-500 dark:text-stone-400">{c.noResults}</p>
      )}

      <CompareBrowseTray
        selected={selectedMachines}
        dict={dict}
        onRemove={(slug) => onSelectionChange(selectedSlugs.filter((s) => s !== slug))}
        onClear={() => onSelectionChange([])}
        onCompareNow={onCompareNow}
      />
    </div>
  );
}
