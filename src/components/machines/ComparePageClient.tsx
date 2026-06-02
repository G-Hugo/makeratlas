"use client";

import { LocaleLink } from "@/components/layout/LocaleLink";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { laserTypeLabelLocalized } from "@/lib/i18n-helpers";
import type { Machine, LaserType } from "@/types/machine";
import { useMemo, useState } from "react";

interface ComparePageClientProps {
  machines: Machine[];
  locale: Locale;
  dict: Dictionary;
}

function exampleSummary(example: { time: string; size: string }) {
  if (example.size === "—") return example.time;
  return `${example.time} (${example.size})`;
}

export function ComparePageClient({ machines, locale, dict }: ComparePageClientProps) {
  const c = dict.compare;
  const [typeFilter, setTypeFilter] = useState<LaserType | "all">("all");

  const filtered = useMemo(() => {
    return machines.filter((m) => {
      const typeMatch = typeFilter === "all" || m.laserType === typeFilter;
      return typeMatch;
    });
  }, [machines, typeFilter]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-4 rounded-xl border border-stone-200 bg-white p-4 dark:border-stone-700 dark:bg-stone-900">
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
            <option value="hybrid">{dict.laserTypes.hybrid}</option>
          </select>
        </label>
      </div>

      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-900">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 dark:border-stone-700 dark:bg-stone-950">
            <tr>
              <th className="px-4 py-3 font-semibold text-stone-700 dark:text-stone-300">{c.machine}</th>
              <th className="px-4 py-3 font-semibold text-stone-700 dark:text-stone-300">{c.mainObjective}</th>
              <th className="px-4 py-3 font-semibold text-stone-700 dark:text-stone-300">{c.precision}</th>
              <th className="px-4 py-3 font-semibold text-stone-700 dark:text-stone-300">{c.sampleEngrave}</th>
              <th className="px-4 py-3 font-semibold text-stone-700 dark:text-stone-300">{c.sampleCut}</th>
              <th className="px-4 py-3 font-semibold text-stone-700 dark:text-stone-300">{c.score}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((machine) => (
              <tr
                key={machine.id}
                className="border-b border-stone-100 hover:bg-amber-50/50 dark:border-stone-800 dark:hover:bg-amber-950/30"
              >
                <td className="px-4 py-3">
                  <LocaleLink
                    href={`/lasers/${machine.slug}`}
                    locale={locale}
                    className="font-medium text-amber-700 hover:underline dark:text-amber-400"
                  >
                    {machine.name}
                  </LocaleLink>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {machine.brand} · {laserTypeLabelLocalized(machine.laserType, dict)}
                  </p>
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
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <p className="mt-6 text-center text-stone-500 dark:text-stone-400">{c.noResults}</p>
      )}
    </div>
  );
}
