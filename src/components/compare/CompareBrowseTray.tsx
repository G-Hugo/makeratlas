"use client";

import type { Dictionary } from "@/i18n/get-dictionary";
import { interpolate } from "@/lib/i18n-helpers";
import { MAX_COMPARE_MACHINES, MIN_COMPARE_MACHINES } from "@/lib/machine-compare";
import type { Machine } from "@/types/machine";

interface CompareBrowseTrayProps {
  selected: Machine[];
  dict: Dictionary;
  onRemove: (slug: string) => void;
  onClear: () => void;
  onCompareNow: () => void;
}

export function CompareBrowseTray({
  selected,
  dict,
  onRemove,
  onClear,
  onCompareNow,
}: CompareBrowseTrayProps) {
  const c = dict.compare;
  const canCompare = selected.length >= MIN_COMPARE_MACHINES;
  const slots = Array.from({ length: MAX_COMPARE_MACHINES }, (_, i) => selected[i] ?? null);

  return (
    <div className="fixed bottom-4 right-4 z-30 w-[min(100vw-2rem,20rem)] rounded-2xl border border-stone-200 bg-white/95 p-3 shadow-xl backdrop-blur dark:border-stone-700 dark:bg-stone-900/95">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
          {interpolate(c.browseSelectedBar, {
            count: selected.length,
            max: MAX_COMPARE_MACHINES,
          })}
        </p>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-medium text-stone-500 transition hover:text-stone-800 dark:hover:text-stone-200"
          >
            {c.browseClearSelection}
          </button>
        )}
      </div>

      <ul className="space-y-1.5">
        {slots.map((machine, index) =>
          machine ? (
            <li
              key={machine.slug}
              className="flex items-center gap-2 rounded-lg bg-amber-50 px-2 py-1.5 dark:bg-amber-950/50"
            >
              <span className="min-w-0 flex-1 truncate text-xs font-medium text-stone-800 dark:text-stone-100">
                {machine.name}
              </span>
              <button
                type="button"
                onClick={() => onRemove(machine.slug)}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-stone-400 transition hover:bg-white hover:text-rose-600 dark:hover:bg-stone-800"
                aria-label={`${c.removeMachine}: ${machine.name}`}
              >
                ×
              </button>
            </li>
          ) : (
            <li
              key={`empty-${index}`}
              className="rounded-lg border border-dashed border-stone-200 px-2 py-1.5 text-xs text-stone-400 dark:border-stone-700 dark:text-stone-500"
            >
              {c.browseTrayEmptySlot}
            </li>
          ),
        )}
      </ul>

      <p className="mt-2 text-[11px] leading-snug text-stone-500 dark:text-stone-400">
        {selected.length === 0 ? c.browseTrayHint : !canCompare ? c.browseNeedTwoHint : c.browseTrayReady}
      </p>

      <button
        type="button"
        onClick={onCompareNow}
        disabled={!canCompare}
        className="mt-3 w-full rounded-lg bg-amber-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {c.browseCompareNow}
      </button>
    </div>
  );
}
