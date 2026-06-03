import type { ReactNode } from "react";
import type { Dictionary } from "@/i18n/dictionaries/types";
import type { JobExample, MachinePerformance, MachineSpecs } from "@/types/machine";

type MachineLabels = Dictionary["machine"];

function isJobNotApplicable(example: JobExample): boolean {
  const t = example.time.toLowerCase();
  return (
    example.size === "—" ||
    t.includes("not") ||
    t.includes("use ") ||
    t.includes("engraving-only") ||
    t.includes("n/a") ||
    t.includes("pas de découpe") ||
    t.includes("gravure uniquement")
  );
}

function jobRowValues(example: JobExample): { primary: string; secondary?: string } {
  if (isJobNotApplicable(example)) {
    return { primary: example.time };
  }
  return {
    primary: example.time,
    secondary: example.size !== "—" ? example.size : undefined,
  };
}

interface SpecRowProps {
  label: string;
  primary: string;
  secondary?: string;
  layout?: "inline" | "stacked";
}

function SpecRow({ label, primary, secondary, layout = "inline" }: SpecRowProps) {
  if (layout === "stacked") {
    return (
      <div className="border-b border-stone-100 py-3 last:border-b-0 dark:border-stone-800">
        <dt className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
          {label}
        </dt>
        <dd className="mt-1.5 text-sm font-medium leading-snug text-stone-900 dark:text-stone-100">
          {primary}
        </dd>
        {secondary && (
          <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">{secondary}</p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,9rem)] items-start gap-x-3 border-b border-stone-100 py-3 last:border-b-0 dark:border-stone-800 sm:grid-cols-[minmax(0,1fr)_minmax(0,10rem)]">
      <dt className="text-sm text-stone-500 dark:text-stone-400">{label}</dt>
      <dd className="min-w-0 text-right">
        <p className="text-sm font-medium leading-snug text-stone-900 dark:text-stone-100">
          {primary}
        </p>
        {secondary && (
          <p className="mt-0.5 text-xs leading-snug text-stone-500 dark:text-stone-400">
            {secondary}
          </p>
        )}
      </dd>
    </div>
  );
}

function SpecGroup({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div>
      {title && (
        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-400 dark:text-stone-500">
          {title}
        </h3>
      )}
      <dl>{children}</dl>
    </div>
  );
}

interface MachineQuickSpecsProps {
  specs: MachineSpecs;
  labels: MachineLabels;
  powerLabel: string;
}

/** Hero strip : four key numbers without scrolling the sidebar */
export function MachineAtAGlance({ specs, labels, powerLabel }: MachineQuickSpecsProps) {
  const { performance } = specs;
  const engrave = jobRowValues(performance.engraveExample);
  const workArea = specs.workArea.split(" (")[0];

  const chips = [
    { label: labels.power, value: powerLabel },
    { label: labels.workArea, value: workArea },
    { label: labels.spotSize, value: performance.technical.spotSize },
    { label: labels.sampleEngrave, value: engrave.primary },
  ];

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
        {labels.atAGlance}
      </p>
      <dl className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {chips.map((chip) => (
          <div
            key={chip.label}
            className="rounded-lg border border-stone-200 bg-white px-2.5 py-2 dark:border-stone-700 dark:bg-stone-950"
          >
            <dt className="text-[10px] font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
              {chip.label}
            </dt>
            <dd className="mt-0.5 text-sm font-semibold leading-snug text-stone-900 dark:text-stone-100">
              {chip.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Sidebar spec sheet : grouped, aligned label / value rows */
export function MachineQuickSpecs({ specs, labels, powerLabel }: MachineQuickSpecsProps) {
  const { performance } = specs;
  const engrave = jobRowValues(performance.engraveExample);
  const cut = jobRowValues(performance.cutExample);
  const software =
    specs.software && specs.software.length > 0 ? specs.software.join(", ") : null;

  return (
    <div className="space-y-5">
      <SpecGroup>
        <SpecRow label={labels.power} primary={powerLabel} />
        <SpecRow label={labels.workArea} primary={specs.workArea.split(" (")[0]} />
      </SpecGroup>

      <SpecGroup title={labels.engravingPrecision}>
        <SpecRow label={labels.spotSize} primary={performance.technical.spotSize} />
        <SpecRow label={labels.motionPrecision} primary={performance.precision} />
      </SpecGroup>

      <SpecGroup title={labels.performanceBenchmark}>
        <SpecRow
          label={labels.sampleEngrave}
          primary={engrave.primary}
          secondary={engrave.secondary}
        />
        <SpecRow label={labels.sampleCut} primary={cut.primary} secondary={cut.secondary} />
      </SpecGroup>

      {software && (
        <SpecGroup>
          <SpecRow label={labels.software} primary={software} layout="stacked" />
        </SpecGroup>
      )}
    </div>
  );
}

function TechCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white px-3 py-2.5 dark:border-stone-700 dark:bg-stone-950">
      <dt className="text-xs text-stone-500 dark:text-stone-400">{label}</dt>
      <dd className="mt-0.5 text-sm font-semibold text-stone-900 dark:text-stone-100">{value}</dd>
    </div>
  );
}

interface MachineTechnicalSpecsProps {
  performance: MachinePerformance;
  labels: MachineLabels;
  /** Inside a parent <details> : only the metric grid */
  bare?: boolean;
}

/** Main column : pro speed numbers (no duplicate of sidebar quick specs) */
export function MachineTechnicalSpecs({
  performance,
  labels,
  bare = false,
}: MachineTechnicalSpecsProps) {
  const { technical } = performance;

  const grid = (
    <dl className={bare ? "grid gap-3 sm:grid-cols-2" : "mt-4 grid gap-3 sm:grid-cols-2"}>
      <TechCard label={labels.maxSpeed} value={technical.maxSpeed} />
      <TechCard label={labels.avgEngraveSpeed} value={technical.avgEngraveSpeed} />
      <TechCard label={labels.avgCutSpeed} value={technical.avgCutSpeed} />
    </dl>
  );

  if (bare) return grid;

  return (
    <section className="rounded-xl border border-stone-200 bg-stone-50 p-5 dark:border-stone-700 dark:bg-stone-900 sm:p-6">
      <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
        {labels.technicalSpecs}
      </h2>
      <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
        {labels.technicalSpecsBody}
      </p>
      {grid}
    </section>
  );
}
