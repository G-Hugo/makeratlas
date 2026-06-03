"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries/types";
import type { Machine } from "@/types/machine";

type MaterialsTab = "engrave" | "cut" | "cannot";

interface MachineMaterialsPanelProps {
  machine: Machine;
  labels: Dictionary["machine"];
}

export function MachineMaterialsPanel({ machine, labels }: MachineMaterialsPanelProps) {
  const [tab, setTab] = useState<MaterialsTab>("engrave");

  useEffect(() => {
    setTab("engrave");
  }, [machine.slug]);

  const tabs: { id: MaterialsTab; label: string; items: string[] }[] = [
    { id: "engrave", label: labels.engraves, items: machine.materials.engrave },
    {
      id: "cut",
      label: labels.cuts,
      items:
        machine.materials.cut.length > 0
          ? machine.materials.cut
          : [labels.limitedCutting],
    },
    { id: "cannot", label: labels.cannotDo, items: machine.materials.cannot },
  ];

  const active = tabs.find((t) => t.id === tab) ?? tabs[0];

  return (
    <section>
      <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
        {labels.materials}
      </h2>
      <div
        className="mt-3 flex gap-1 overflow-x-auto border-b border-stone-200 pb-px dark:border-stone-700"
        role="tablist"
        aria-label={labels.materials}
      >
        {tabs.map((t) => {
          const selected = t.id === active.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-t-md px-3 py-2 text-xs font-medium transition sm:text-sm ${
                selected
                  ? "border-b-2 border-amber-500 text-stone-900 dark:text-stone-100"
                  : "text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
              }`}
            >
              {t.label}
              <span className="ml-1.5 tabular-nums text-stone-400 dark:text-stone-500">
                ({t.items.length})
              </span>
            </button>
          );
        })}
      </div>
      <ul
        role="tabpanel"
        className="mt-3 columns-1 gap-x-6 text-sm text-stone-700 dark:text-stone-300 sm:columns-2"
      >
        {active.items.map((mat) => (
          <li key={mat} className="break-inside-avoid py-0.5">
            · {mat}
          </li>
        ))}
      </ul>
    </section>
  );
}
