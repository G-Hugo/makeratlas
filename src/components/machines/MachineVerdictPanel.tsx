import type { Dictionary } from "@/i18n/dictionaries/types";
import type { MachineEditorialDepth } from "@/types/machine";

interface MachineVerdictPanelProps {
  pros: string[];
  cons: string[];
  labels: Dictionary["machine"];
  depth?: MachineEditorialDepth | null;
}

export function MachineVerdictPanel({ pros, cons, labels, depth }: MachineVerdictPanelProps) {
  return (
    <section
      id="verdict"
      className="scroll-mt-6 rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-700 dark:bg-stone-900 sm:p-6"
    >
      <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
        {labels.verdict}
      </h2>

      {depth && (depth.advantages || depth.limitations) && (
        <div className="mt-4 space-y-4 border-b border-stone-100 pb-5 dark:border-stone-800">
          {depth.advantages && (
            <div>
              <h3 className="text-sm font-semibold text-emerald-800 dark:text-emerald-400">
                {labels.advantagesDetail}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-700 dark:text-stone-300">
                {depth.advantages}
              </p>
            </div>
          )}
          {depth.limitations && (
            <div>
              <h3 className="text-sm font-semibold text-red-800 dark:text-red-400">
                {labels.limitationsDetail}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-700 dark:text-stone-300">
                {depth.limitations}
              </p>
            </div>
          )}
        </div>
      )}

      <div className={`grid gap-6 sm:grid-cols-2 ${depth ? "mt-5" : "mt-4"}`}>
        <div>
          <h3 className="text-sm font-semibold text-emerald-800 dark:text-emerald-400">
            {labels.pros}
          </h3>
          <ul className="mt-2 space-y-1.5 text-sm text-stone-700 dark:text-stone-300">
            {pros.map((pro) => (
              <li key={pro} className="flex gap-2">
                <span className="shrink-0 text-emerald-600" aria-hidden>
                  ✓
                </span>
                {pro}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-red-800 dark:text-red-400">
            {labels.cons}
          </h3>
          <ul className="mt-2 space-y-1.5 text-sm text-stone-700 dark:text-stone-300">
            {cons.map((con) => (
              <li key={con} className="flex gap-2">
                <span className="shrink-0 text-red-500" aria-hidden>
                  ✗
                </span>
                {con}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
