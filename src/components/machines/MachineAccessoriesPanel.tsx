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
  if (items.length === 0) return null;

  const grouped = groupAccessoriesByCategory(items);

  const categoryLabel = (cat: AccessoryCategory) => a.categories[cat];

  const itemLabel = (id: string) => a.items[id as keyof typeof a.items]?.name ?? id;

  const itemDesc = (id: string) => a.items[id as keyof typeof a.items]?.description;

  return (
    <section className="mt-10 rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-700 dark:bg-stone-900">
      <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">{a.title}</h2>
      <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">{a.subtitle}</p>

      <div className="mt-6 space-y-8">
        {grouped.map(({ category, items: catItems }) => (
          <div key={category}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {categoryLabel(category)}
            </h3>
            <ul className="mt-3 divide-y divide-stone-100 dark:divide-stone-800">
              {catItems.map((item) => {
                const styles = AVAILABILITY_STYLES[item.availability];
                const availLabel = a.availability[item.availability];
                return (
                  <li
                    key={item.id}
                    className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full ${styles.dot}`}
                          aria-hidden
                        />
                        <p className="font-medium text-stone-900 dark:text-stone-100">
                          {itemLabel(item.id)}
                        </p>
                      </div>
                      {itemDesc(item.id) && (
                        <p className="mt-1 pl-4 text-sm text-stone-600 dark:text-stone-400">
                          {itemDesc(item.id)}
                        </p>
                      )}
                      {item.note && (
                        <p className="mt-1 pl-4 text-sm text-stone-500 dark:text-stone-500">
                          {item.note}
                        </p>
                      )}
                    </div>
                    <span
                      className={`shrink-0 self-start rounded-full px-2.5 py-0.5 text-xs font-medium ${styles.badge}`}
                    >
                      {availLabel}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-6 border-t border-stone-100 pt-4 text-xs text-stone-500 dark:border-stone-800 dark:text-stone-400">
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
