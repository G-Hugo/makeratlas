"use client";

import { useEffect, useMemo, useState } from "react";
import { LocaleLink } from "@/components/layout/LocaleLink";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/types";
import {
  groupAccessoriesByCategory,
  getMachineAccessories,
  type AccessoryCategory,
} from "@/lib/machine-accessories";
import type { AccessoryAvailability, Machine } from "@/types/machine";

interface MachineAccessoriesPanelProps {
  machine: Machine;
  locale: Locale;
  dict: Dictionary;
}

const AVAILABILITY_STYLES: Record<
  AccessoryAvailability,
  { badge: string; dot: string }
> = {
  included: {
    badge:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
    dot: "bg-emerald-500",
  },
  optional: {
    badge: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
    dot: "bg-stone-400",
  },
  recommended: {
    badge: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
    dot: "bg-amber-500",
  },
  not_applicable: {
    badge: "bg-stone-50 text-stone-400 dark:bg-stone-900 dark:text-stone-600",
    dot: "bg-stone-300",
  },
};

export function MachineAccessoriesPanel({
  machine,
  locale,
  dict,
}: MachineAccessoriesPanelProps) {
  const a = dict.accessories;
  const items = getMachineAccessories(machine);
  const grouped = useMemo(() => groupAccessoriesByCategory(items), [machine]);
  const [activeCategory, setActiveCategory] = useState<AccessoryCategory | null>(
    null,
  );

  useEffect(() => {
    setActiveCategory(grouped[0]?.category ?? null);
  }, [machine.slug, grouped]);

  if (items.length === 0 || grouped.length === 0) return null;

  const categoryLabel = (cat: AccessoryCategory) => a.categories[cat];
  const itemLabel = (id: string) => a.items[id as keyof typeof a.items]?.name ?? id;
  const activeGroup =
    grouped.find((g) => g.category === activeCategory) ?? grouped[0];

  return (
    <section className="mt-8 rounded-xl border border-stone-200 bg-white p-4 dark:border-stone-700 dark:bg-stone-900 sm:p-5">
      <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
        {a.title}
      </h2>
      <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
        {a.subtitle}
      </p>

      <div
        className="mt-4 flex gap-1 overflow-x-auto border-b border-stone-200 pb-px dark:border-stone-700"
        role="tablist"
        aria-label={a.tabsAriaLabel}
      >
        {grouped.map(({ category, items: catItems }) => {
          const selected = category === activeGroup.category;
          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`accessories-panel-${category}`}
              id={`accessories-tab-${category}`}
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 rounded-t-md px-3 py-2 text-xs font-medium transition sm:text-sm ${
                selected
                  ? "border-b-2 border-amber-500 text-stone-900 dark:text-stone-100"
                  : "text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
              }`}
            >
              {categoryLabel(category)}
              <span className="ml-1.5 tabular-nums text-stone-400 dark:text-stone-500">
                ({catItems.length})
              </span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`accessories-panel-${activeGroup.category}`}
        aria-labelledby={`accessories-tab-${activeGroup.category}`}
        className="pt-3"
      >
        <ul className="divide-y divide-stone-100 dark:divide-stone-800">
          {activeGroup.items.map((item) => {
            const styles = AVAILABILITY_STYLES[item.availability];
            const availLabel = a.availability[item.availability];
            return (
              <li
                key={item.id}
                className="flex items-start justify-between gap-3 py-2.5 text-sm first:pt-0 last:pb-0"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${styles.dot}`}
                      aria-hidden
                    />
                    <p className="font-medium text-stone-900 dark:text-stone-100">
                      {itemLabel(item.id)}
                    </p>
                  </div>
                  {item.note && (
                    <p className="mt-0.5 pl-3.5 text-xs text-stone-500 dark:text-stone-500">
                      {item.note}
                    </p>
                  )}
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium leading-tight ${styles.badge}`}
                >
                  {availLabel}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="mt-3 text-xs text-stone-500 dark:text-stone-400">
        {a.footnote}{" "}
        <LocaleLink
          href="/guides/laser-ventilation-setup"
          locale={locale}
          className="font-medium text-amber-700 hover:underline dark:text-amber-400"
        >
          {a.ventilationGuide}
        </LocaleLink>
        {" · "}
        <LocaleLink
          href="/guides/laser-safety-basics"
          locale={locale}
          className="font-medium text-amber-700 hover:underline dark:text-amber-400"
        >
          {a.safetyGuide}
        </LocaleLink>
      </p>
    </section>
  );
}
