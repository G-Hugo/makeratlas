"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LocaleLink } from "@/components/layout/LocaleLink";
import { MachineImage } from "@/components/machines/MachineImage";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { interpolate, laserTypeLabelLocalized } from "@/lib/i18n-helpers";
import { MAX_COMPARE_MACHINES } from "@/lib/machine-compare";
import { normalizeBrandName } from "@/lib/brand-slug";
import { ratingColor } from "@/lib/utils";
import type { Machine } from "@/types/machine";

const PICKER_RESULT_LIMIT = 50;

interface MachineComparePickerProps {
  machines: Machine[];
  selected: Machine[];
  locale: Locale;
  dict: Dictionary;
  onChange: (slugs: string[]) => void;
  onShare?: () => void;
  shareCopied?: boolean;
}

function machineMatchesQuery(machine: Machine, q: string): boolean {
  if (!q) return false;
  const haystack = [
    machine.name,
    machine.brand,
    machine.slug,
    machine.powerRating ?? "",
    machine.mainObjective,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

export function MachineComparePicker({
  machines,
  selected,
  locale,
  dict,
  onChange,
  onShare,
  shareCopied,
}: MachineComparePickerProps) {
  const c = dict.compare;
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeSlot !== null) inputRef.current?.focus();
  }, [activeSlot]);

  const selectedSlugs = new Set(selected.map((m) => m.slug));
  const available = useMemo(
    () => machines.filter((m) => !selectedSlugs.has(m.slug)),
    [machines, selectedSlugs],
  );

  const brandFilters = useMemo(() => {
    const counts = new Map<string, number>();
    for (const m of available) {
      const brand = normalizeBrandName(m.brand);
      counts.set(brand, (counts.get(brand) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([brand, count]) => ({ brand, count }));
  }, [available]);

  const { suggestions, totalMatches } = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = available.filter((m) => (q ? machineMatchesQuery(m, q) : false));
    const sorted = [...pool].sort((a, b) => {
      const byRating = b.rating.overall - a.rating.overall;
      if (byRating !== 0) return byRating;
      return a.name.localeCompare(b.name);
    });
    return {
      suggestions: sorted.slice(0, PICKER_RESULT_LIMIT),
      totalMatches: sorted.length,
    };
  }, [available, query]);

  function addMachine(slug: string) {
    if (selected.length >= MAX_COMPARE_MACHINES) return;
    onChange([...selected.map((m) => m.slug), slug]);
    setQuery("");
    setActiveSlot(null);
  }

  function removeAt(index: number) {
    const next = selected.filter((_, i) => i !== index).map((m) => m.slug);
    onChange(next);
  }

  function replaceAt(index: number, slug: string) {
    const slugs = selected.map((m) => m.slug);
    slugs[index] = slug;
    onChange(slugs);
    setQuery("");
    setActiveSlot(null);
  }

  const slots = Array.from({ length: MAX_COMPARE_MACHINES }, (_, i) => selected[i] ?? null);

  const dropdownProps = {
    inputRef,
    query,
    setQuery,
    suggestions,
    totalMatches,
    catalogCount: available.length,
    brandFilters,
    locale,
    dict,
    onClose: () => setActiveSlot(null),
    placeholder: c.searchPlaceholder,
  };

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-stone-600 dark:text-stone-400">
          <p>{c.pickerHint}</p>
          <p className="mt-1 text-xs text-stone-500 dark:text-stone-500">
            {interpolate(c.pickerCatalogCount, { count: machines.length })}
          </p>
        </div>
        {onShare && selected.length >= 2 && (
          <button
            type="button"
            onClick={onShare}
            className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-700 transition hover:border-amber-400 hover:text-amber-800 dark:border-stone-600 dark:text-stone-200 dark:hover:border-amber-600"
          >
            {shareCopied ? c.shareCopied : c.shareLink}
          </button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {slots.map((machine, index) => {
          const isOpen = activeSlot === index;

          if (machine) {
            return (
              <div
                key={machine.slug}
                className="relative flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-stone-50 dark:border-stone-700 dark:bg-stone-950"
              >
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-stone-500 shadow ring-1 ring-stone-200 hover:text-rose-600 dark:bg-stone-900 dark:ring-stone-700"
                  aria-label={c.removeMachine}
                >
                  ×
                </button>
                <LocaleLink href={`/lasers/${machine.slug}`} locale={locale} className="block">
                  <MachineImage machine={machine} className="aspect-[4/3] w-full" sizes="200px" />
                </LocaleLink>
                <div className="flex flex-1 flex-col gap-1 p-3">
                  <p className={`text-lg font-bold ${ratingColor(machine.rating.overall)}`}>
                    {machine.rating.overall.toFixed(1)}
                  </p>
                  <LocaleLink
                    href={`/lasers/${machine.slug}`}
                    locale={locale}
                    className="line-clamp-2 text-sm font-semibold text-stone-900 hover:text-amber-700 dark:text-stone-100 dark:hover:text-amber-400"
                  >
                    {machine.name}
                  </LocaleLink>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {machine.brand} · {laserTypeLabelLocalized(machine.laserType, dict)}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSlot(index);
                      setQuery("");
                    }}
                    className="mt-auto pt-2 text-left text-xs font-medium text-amber-700 hover:underline dark:text-amber-400"
                  >
                    {c.changeMachine}
                  </button>
                </div>
                {isOpen && (
                  <PickerDropdown
                    {...dropdownProps}
                    onPick={(slug) => replaceAt(index, slug)}
                  />
                )}
              </div>
            );
          }

          return (
            <div key={`empty-${index}`} className="relative">
              <button
                type="button"
                onClick={() => {
                  setActiveSlot(index);
                  setQuery("");
                }}
                className="flex h-full min-h-[220px] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-300 bg-stone-50/50 px-4 py-8 text-center transition hover:border-amber-400 hover:bg-amber-50/50 dark:border-stone-600 dark:bg-stone-950/50 dark:hover:border-amber-700 dark:hover:bg-amber-950/20"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-xl font-light text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  +
                </span>
                <span className="mt-3 text-sm font-medium text-stone-700 dark:text-stone-300">
                  {c.addMachine}
                </span>
              </button>
              {isOpen && <PickerDropdown {...dropdownProps} onPick={addMachine} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PickerDropdown({
  inputRef,
  query,
  setQuery,
  suggestions,
  totalMatches,
  catalogCount,
  brandFilters,
  dict,
  onPick,
  onClose,
  placeholder,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
  query: string;
  setQuery: (q: string) => void;
  suggestions: Machine[];
  totalMatches: number;
  catalogCount: number;
  brandFilters: { brand: string; count: number }[];
  dict: Dictionary;
  onPick: (slug: string) => void;
  onClose: () => void;
  placeholder: string;
}) {
  const c = dict.compare;
  const hasQuery = query.trim().length > 0;

  return (
    <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-xl border border-stone-200 bg-white p-3 shadow-xl dark:border-stone-700 dark:bg-stone-900">
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm dark:border-stone-600 dark:bg-stone-950 dark:text-stone-100"
      />

      {!hasQuery && (
        <p className="mt-2 text-xs leading-relaxed text-stone-500 dark:text-stone-400">
          {c.pickerTypeToSearch}
        </p>
      )}

      <div className="mt-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
          {c.pickerBrandsLabel}
        </p>
        <div className="mt-1.5 flex max-h-24 flex-wrap gap-1.5 overflow-y-auto">
          {brandFilters.map(({ brand, count }) => (
            <button
              key={brand}
              type="button"
              onClick={() => setQuery(brand)}
              className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-medium text-stone-700 transition hover:border-amber-300 hover:bg-amber-50 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-300 dark:hover:border-amber-800"
            >
              {brand}
              <span className="ml-1 text-stone-400">({count})</span>
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-3 max-h-64 overflow-y-auto border-t border-stone-100 pt-2 dark:border-stone-800">
        {!hasQuery ? (
          <li className="px-2 py-6 text-center text-sm text-stone-500 dark:text-stone-400">
            {interpolate(c.pickerCatalogCount, { count: catalogCount })}
          </li>
        ) : suggestions.length === 0 ? (
          <li className="px-2 py-4 text-sm text-stone-500">{c.noPickerResults}</li>
        ) : (
          suggestions.map((m) => (
            <li key={m.slug}>
              <button
                type="button"
                onClick={() => onPick(m.slug)}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm hover:bg-amber-50 dark:hover:bg-amber-950/30"
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-stone-900 dark:text-stone-100">
                    {m.name}
                  </span>
                  <span className="text-xs text-stone-500">
                    {m.brand}
                    {m.powerRating ? ` · ${m.powerRating}` : ""} · {m.rating.overall.toFixed(1)}
                  </span>
                </span>
              </button>
            </li>
          ))
        )}
      </ul>

      {hasQuery && totalMatches > 0 && (
        <p className="mt-2 text-center text-xs text-stone-500 dark:text-stone-400">
          {interpolate(c.pickerShowingMatches, {
            shown: suggestions.length,
            total: totalMatches,
          })}
          {totalMatches > PICKER_RESULT_LIMIT ? "+" : ""}
        </p>
      )}

      <button
        type="button"
        onClick={onClose}
        className="mt-2 w-full rounded-lg py-1.5 text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
      >
        {c.closePicker}
      </button>
    </div>
  );
}
