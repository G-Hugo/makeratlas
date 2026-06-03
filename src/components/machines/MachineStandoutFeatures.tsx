import type { MachineStandoutFeature } from "@/types/machine";
import type { Dictionary } from "@/i18n/dictionaries/types";

interface MachineStandoutFeaturesProps {
  features: MachineStandoutFeature[];
  labels: Dictionary["machine"];
}

export function MachineStandoutFeatures({ features, labels }: MachineStandoutFeaturesProps) {
  if (features.length === 0) return null;

  return (
    <section className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-5 dark:border-amber-900/60 dark:bg-amber-950/30 sm:p-6">
      <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
        {labels.standoutTitle}
      </h2>
      <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">{labels.standoutSubtitle}</p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {features.map((feature) => (
          <li
            key={feature.id}
            className="rounded-lg border border-amber-200/70 bg-white p-4 dark:border-amber-900/50 dark:bg-stone-900"
          >
            <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-700 dark:text-stone-300">
              {feature.body}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
