import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { ResolvedBrandDuel } from "@/lib/compare-brand-duels";
import { interpolate, laserTypeLabelLocalized } from "@/lib/i18n-helpers";
import { formatPriceRange } from "@/lib/pricing";
import type { BrandProfile } from "@/types/brand";
import type { LaserType } from "@/types/machine";

interface BrandVersusTableProps {
  duel: ResolvedBrandDuel;
  locale: Locale;
  dict: Dictionary;
}

interface CompareRow {
  label: string;
  values: [string, string];
  winner?: 0 | 1 | "tie";
}

function pickWinner(
  values: [string, string],
  scores?: [number, number],
): 0 | 1 | "tie" | undefined {
  if (!scores) return undefined;
  if (scores[0] === scores[1]) return "tie";
  return scores[0] > scores[1] ? 0 : 1;
}

function buildRows(duel: ResolvedBrandDuel, locale: Locale, dict: Dictionary): CompareRow[] {
  const c = dict.brandDuel;
  const [a, b] = duel.brands;
  const currency = locale === "fr" ? "EUR" : "USD";

  const formatTypes = (brand: BrandProfile) =>
    brand.laserTypes
      .map((t) => laserTypeLabelLocalized(t as LaserType, dict))
      .join(" · ");

  const rows: CompareRow[] = [
    {
      label: c.rowKnownFor,
      values: [a.knownFor, b.knownFor],
    },
    {
      label: c.rowCatalogSize,
      values: [
        interpolate(c.modelsCount, { count: a.lineCount }),
        interpolate(c.modelsCount, { count: b.lineCount }),
      ],
      winner: pickWinner(["", ""], [a.lineCount, b.lineCount]),
    },
    {
      label: c.rowLaserTypes,
      values: [formatTypes(a), formatTypes(b)],
      winner: pickWinner(["", ""], [a.laserTypes.length, b.laserTypes.length]),
    },
    {
      label: c.rowPriceRange,
      values: [
        formatPriceRange(a.priceMin, a.priceMax, currency),
        formatPriceRange(b.priceMin, b.priceMax, currency),
      ],
      winner: pickWinner(["", ""], [b.priceMin, a.priceMin]),
    },
    {
      label: c.rowAvgScore,
      values: [`${duel.avgScores[0].toFixed(1)}/10`, `${duel.avgScores[1].toFixed(1)}/10`],
      winner: pickWinner(["", ""], duel.avgScores),
    },
  ];

  if (a.headquarters || b.headquarters) {
    rows.push({
      label: c.rowHeadquarters,
      values: [a.headquarters ?? "—", b.headquarters ?? "—"],
    });
  }

  return rows;
}

function cellClass(winner: CompareRow["winner"], index: 0 | 1): string {
  if (winner === undefined) return "";
  if (winner === "tie") return "";
  if (winner === index) {
    return "bg-amber-50/80 font-semibold text-stone-900 dark:bg-amber-950/30 dark:text-stone-100";
  }
  return "";
}

export function BrandVersusTable({ duel, locale, dict }: BrandVersusTableProps) {
  const [a, b] = duel.brands;
  const rows = buildRows(duel, locale, dict);
  const c = dict.brandDuel;

  return (
    <section>
      <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">{c.tableTitle}</h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-stone-200 dark:border-stone-700">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50 dark:border-stone-700 dark:bg-stone-900/80">
              <th className="px-4 py-3 font-medium text-stone-500 dark:text-stone-400">{c.rowLabel}</th>
              <th className="px-4 py-3 font-semibold text-stone-900 dark:text-stone-100">{a.name}</th>
              <th className="px-4 py-3 font-semibold text-stone-900 dark:text-stone-100">{b.name}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.label}
                className="border-b border-stone-100 last:border-0 dark:border-stone-800"
              >
                <td className="px-4 py-3 font-medium text-stone-600 dark:text-stone-400">
                  {row.label}
                </td>
                <td
                  className={`px-4 py-3 text-stone-700 dark:text-stone-300 ${cellClass(row.winner, 0)}`}
                >
                  {row.values[0]}
                </td>
                <td
                  className={`px-4 py-3 text-stone-700 dark:text-stone-300 ${cellClass(row.winner, 1)}`}
                >
                  {row.values[1]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
