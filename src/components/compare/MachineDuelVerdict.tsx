import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { interpolate } from "@/lib/i18n-helpers";
import { buildMachineCompareSections } from "@/lib/machine-compare";
import type { Machine } from "@/types/machine";

interface MachineDuelVerdictProps {
  machines: [Machine, Machine];
  locale: Locale;
  dict: Dictionary;
}

const MAX_WIN_CHIPS = 4;

/** Server-rendered verdict box summarizing which machine wins which specs. */
export function MachineDuelVerdict({ machines, locale, dict }: MachineDuelVerdictProps) {
  const c = dict.compare;
  const sections = buildMachineCompareSections([...machines], locale, dict);

  const wins: string[][] = [[], []];
  for (const section of sections) {
    for (const row of section.rows) {
      if (row.winnerIndexes.length === 1) {
        wins[row.winnerIndexes[0]].push(row.label);
      }
    }
  }

  const [a, b] = machines;
  const ratingsEqual = a.rating.overall === b.rating.overall;
  const overallWinner = ratingsEqual ? null : a.rating.overall > b.rating.overall ? a : b;
  const overallLoser = overallWinner === a ? b : a;

  return (
    <section className="rounded-2xl border border-stone-200 bg-stone-50 p-5 dark:border-stone-700 dark:bg-stone-900/60 sm:p-6">
      <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">{c.verdictTitle}</h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {machines.map((machine, index) => (
          <div
            key={machine.slug}
            className="rounded-xl border border-stone-200 bg-white p-4 dark:border-stone-700 dark:bg-stone-900"
          >
            <div className="flex items-baseline justify-between gap-2">
              <p className="font-semibold text-stone-900 dark:text-stone-100">{machine.name}</p>
              <p className="shrink-0 text-xs font-medium text-stone-500 dark:text-stone-400">
                {interpolate(c.verdictSpecWins, { count: wins[index].length })}
              </p>
            </div>
            {wins[index].length > 0 && (
              <>
                <p className="mt-2 text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
                  {interpolate(c.verdictWinsOn, { name: machine.name })}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {wins[index].slice(0, MAX_WIN_CHIPS).map((label) => (
                    <span
                      key={label}
                      className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300"
                    >
                      {label}
                    </span>
                  ))}
                  {wins[index].length > MAX_WIN_CHIPS && (
                    <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-600 dark:bg-stone-800 dark:text-stone-400">
                      +{wins[index].length - MAX_WIN_CHIPS}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm font-medium text-stone-800 dark:text-stone-200">
        {overallWinner
          ? interpolate(c.verdictOverall, {
              name: overallWinner.name,
              a: overallWinner.rating.overall.toFixed(1),
              b: overallLoser.rating.overall.toFixed(1),
            })
          : interpolate(c.verdictTie, { score: a.rating.overall.toFixed(1) })}
      </p>
    </section>
  );
}
