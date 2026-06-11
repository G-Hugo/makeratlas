"use client";

import { useEffect, useMemo, useRef } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";
import { interpolate } from "@/lib/i18n-helpers";
import { normalizeBrandName } from "@/lib/brand-slug";
import type { Machine } from "@/types/machine";

const PICKER_RESULT_LIMIT = 50;

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

interface ComparePickerModalProps {
  open: boolean;
  machines: Machine[];
  selectedSlugs: Set<string>;
  query: string;
  setQuery: (q: string) => void;
  dict: Dictionary;
  replacing?: Machine | null;
  onPick: (slug: string) => void;
  onClose: () => void;
}

export function ComparePickerModal({
  open,
  machines,
  selectedSlugs,
  query,
  setQuery,
  dict,
  replacing,
  onPick,
  onClose,
}: ComparePickerModalProps) {
  const c = dict.compare;
  const inputRef = useRef<HTMLInputElement>(null);
  const hasQuery = query.trim().length > 0;

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const available = useMemo(() => {
    const excluded = new Set(selectedSlugs);
    if (replacing) excluded.delete(replacing.slug);
    return machines.filter((m) => !excluded.has(m.slug));
  }, [machines, selectedSlugs, replacing]);

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

  if (!open) return null;

  const title = replacing ? c.pickerModalTitleChange : c.pickerModalTitleAdd;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label={c.closePicker}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="compare-picker-title"
        className="relative z-10 flex max-h-[min(90vh,42rem)] w-full flex-col overflow-hidden rounded-t-2xl border border-stone-200 bg-white shadow-2xl dark:border-stone-700 dark:bg-stone-900 sm:max-w-lg sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-stone-200 px-4 py-4 dark:border-stone-800">
          <div className="min-w-0">
            <h2
              id="compare-picker-title"
              className="text-base font-semibold text-stone-900 dark:text-stone-100"
            >
              {title}
            </h2>
            {replacing && (
              <p className="mt-0.5 truncate text-sm text-stone-500 dark:text-stone-400">
                {replacing.name}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100 hover:text-stone-800 dark:hover:bg-stone-800 dark:hover:text-stone-200"
            aria-label={c.closePicker}
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={c.searchPlaceholder}
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm shadow-sm dark:border-stone-600 dark:bg-stone-950 dark:text-stone-100"
          />

          {!hasQuery && (
            <p className="mt-2 text-xs leading-relaxed text-stone-500 dark:text-stone-400">
              {c.pickerTypeToSearch}
            </p>
          )}

          <div className="mt-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
              {c.pickerBrandsLabel}
            </p>
            <div className="mt-2 flex max-h-28 flex-wrap gap-1.5 overflow-y-auto">
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

          <ul className="mt-4 divide-y divide-stone-100 rounded-xl border border-stone-200 dark:divide-stone-800 dark:border-stone-700">
            {!hasQuery ? (
              <li className="px-4 py-10 text-center text-sm text-stone-500 dark:text-stone-400">
                {interpolate(c.pickerCatalogCount, { count: available.length })}
              </li>
            ) : suggestions.length === 0 ? (
              <li className="px-4 py-8 text-center text-sm text-stone-500">{c.noPickerResults}</li>
            ) : (
              suggestions.map((m) => (
                <li key={m.slug}>
                  <button
                    type="button"
                    onClick={() => onPick(m.slug)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-amber-50 dark:hover:bg-amber-950/30"
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
            <p className="mt-3 text-center text-xs text-stone-500 dark:text-stone-400">
              {interpolate(c.pickerShowingMatches, {
                shown: suggestions.length,
                total: totalMatches,
              })}
              {totalMatches > PICKER_RESULT_LIMIT ? "+" : ""}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
