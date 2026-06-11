"use client";

import { Fragment } from "react";
import { LocaleLink } from "@/components/layout/LocaleLink";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { buildMachineCompareSections } from "@/lib/machine-compare";
import type { Machine } from "@/types/machine";

interface MachineVersusViewProps {
  machines: Machine[];
  locale: Locale;
  dict: Dictionary;
}

function CellContent({ text, items }: { text: string; items?: string[] }) {
  if (items && items.length > 0) {
    return (
      <ul className="space-y-1 text-sm leading-relaxed">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-stone-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  const parts = text.split("\n").filter(Boolean);
  if (parts.length <= 1) {
    return <span className="text-sm leading-relaxed">{text || "—"}</span>;
  }

  return (
    <div className="space-y-1 text-sm leading-relaxed">
      <p className="font-medium text-stone-900 dark:text-stone-100">{parts[0]}</p>
      {parts.slice(1).map((line) => (
        <p key={line} className="text-stone-600 dark:text-stone-400">
          {line}
        </p>
      ))}
    </div>
  );
}

export function MachineVersusView({ machines, locale, dict }: MachineVersusViewProps) {
  const c = dict.compare;
  const sections = buildMachineCompareSections(machines, locale, dict);
  const colCount = machines.length;

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-950">
              <th className="sticky left-0 z-10 w-40 min-w-[9rem] bg-stone-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:bg-stone-950 dark:text-stone-400 sm:w-48">
                {c.specLabel}
              </th>
              {machines.map((m) => (
                <th
                  key={m.slug}
                  className="min-w-[11rem] px-4 py-3 text-sm font-semibold text-stone-900 dark:text-stone-100"
                >
                  <LocaleLink
                    href={`/lasers/${m.slug}`}
                    locale={locale}
                    className="hover:text-amber-700 dark:hover:text-amber-400"
                  >
                    {m.name}
                  </LocaleLink>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sections.map((section) => (
              <Fragment key={section.id}>
                <tr className="bg-amber-50/80 dark:bg-amber-950/25">
                  <td
                    colSpan={colCount + 1}
                    className="sticky left-0 px-4 py-3 text-xs font-bold uppercase tracking-widest text-amber-900 dark:text-amber-200"
                  >
                    {section.title}
                  </td>
                </tr>
                {section.rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-stone-100 dark:border-stone-800/80"
                  >
                    <td className="sticky left-0 z-10 bg-white px-4 py-4 text-sm font-medium text-stone-600 dark:bg-stone-900 dark:text-stone-400">
                      {row.label}
                    </td>
                    {row.cells.map((cell, i) => {
                      const isWinner = row.winnerIndexes.includes(i);
                      return (
                        <td
                          key={`${row.id}-${i}`}
                          className={`px-4 py-4 align-top ${
                            isWinner
                              ? "bg-emerald-50/90 ring-1 ring-inset ring-emerald-200/80 dark:bg-emerald-950/30 dark:ring-emerald-900/50"
                              : ""
                          }`}
                        >
                          {isWinner && (
                            <span className="mb-1.5 inline-block rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                              {c.winnerBadge}
                            </span>
                          )}
                          <CellContent text={cell.text} items={cell.items} />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t border-stone-200 px-4 py-3 text-xs text-stone-500 dark:border-stone-800 dark:text-stone-400">
        {c.winnerDisclaimer}
      </p>
    </div>
  );
}
