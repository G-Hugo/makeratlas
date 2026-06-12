import { LocaleLink } from "@/components/layout/LocaleLink";
import type { Locale } from "@/i18n/config";
import type { MachineCompareDuel } from "@/lib/machine-alternatives";

interface MachineCompareDuelsListProps {
  machineName: string;
  duels: MachineCompareDuel[];
  locale: Locale;
  className?: string;
}

export function MachineCompareDuelsList({
  machineName,
  duels,
  locale,
  className = "",
}: MachineCompareDuelsListProps) {
  if (!duels.length) return null;

  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {duels.map(({ partner, compareHref, isStaticDuel }) => (
        <li key={partner.slug}>
          <LocaleLink
            href={compareHref}
            locale={locale}
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium shadow-sm transition ${
              isStaticDuel
                ? "border-amber-300 bg-amber-50 text-amber-950 hover:border-amber-400 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100 dark:hover:border-amber-600"
                : "border-stone-200 bg-white text-stone-800 hover:border-stone-300 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:border-stone-600"
            }`}
          >
            <span
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-900 text-[9px] font-black uppercase text-white dark:bg-amber-500 dark:text-stone-950"
              aria-hidden
            >
              vs
            </span>
            <span className="truncate">
              {machineName} vs {partner.name}
            </span>
          </LocaleLink>
        </li>
      ))}
    </ul>
  );
}
