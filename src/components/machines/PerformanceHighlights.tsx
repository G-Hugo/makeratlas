import type { JobExample, MachinePerformance } from "@/types/machine";

interface PerformanceHighlightsProps {
  performance: MachinePerformance;
  mainObjective: string;
  variant?: "card" | "hero" | "compact";
}

export function PerformanceHighlights({
  performance,
  mainObjective,
  variant = "hero",
}: PerformanceHighlightsProps) {
  if (variant === "compact") {
    return (
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-600">
        <span>
          <strong className="text-stone-800">Precision:</strong>{" "}
          {performance.precision}
        </span>
        <span>
          <strong className="text-stone-800">Engrave:</strong>{" "}
          {performance.engraveExample.time}
        </span>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className="space-y-3">
        <div className="rounded-lg border border-amber-200 bg-amber-50/80 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-800">
            Main objective
          </p>
          <p className="mt-0.5 text-sm font-medium leading-snug text-stone-900">
            {mainObjective}
          </p>
        </div>
        <div className="rounded-md border border-stone-200 bg-stone-50 px-2.5 py-2">
          <p className="text-[10px] font-medium uppercase text-stone-500">
            Engraving precision
          </p>
          <p className="text-sm font-bold text-stone-900">{performance.precision}</p>
        </div>
        <JobExampleBlock example={performance.engraveExample} kind="engrave" compact />
        <JobExampleBlock example={performance.cutExample} kind="cut" compact />
      </div>
    );
  }

  return (
    <section className="rounded-xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-white p-6 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
        What this machine is for
      </p>
      <p className="mt-3 text-lg font-semibold leading-snug text-stone-900">
        {mainObjective}
      </p>

      <p className="mt-5 rounded-lg bg-white/80 px-3 py-2 text-xs text-stone-600">
        <strong className="text-stone-800">Reference benchmark</strong> — same
        job size on every machine so you can compare times fairly.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-amber-400 bg-amber-100/60 p-4 sm:col-span-1">
          <p className="text-xs font-medium text-amber-900">Engraving precision</p>
          <p className="mt-2 text-2xl font-bold text-stone-900">
            {performance.precision}
          </p>
          <p className="mt-1 text-xs text-stone-600">
            Lower = finer detail in your designs
          </p>
        </div>
        <JobExampleBlock example={performance.engraveExample} kind="engrave" />
        <JobExampleBlock example={performance.cutExample} kind="cut" />
      </div>

      <p className="mt-4 text-xs text-stone-500">
        Times are estimates for the reference job above — your design complexity
        and settings will change them.
      </p>
    </section>
  );
}

function JobExampleBlock({
  example,
  kind,
  compact = false,
}: {
  example: JobExample;
  kind: "engrave" | "cut";
  compact?: boolean;
}) {
  const isNA =
    example.size === "—" ||
    example.time.toLowerCase().includes("not") ||
    example.time.toLowerCase().includes("use ") ||
    example.time.toLowerCase().includes("engraving-only") ||
    example.time.toLowerCase().includes("n/a");

  const label = kind === "engrave" ? "Sample engrave job" : "Sample cut job";

  if (compact) {
    return (
      <div className="rounded-md bg-stone-50 px-2.5 py-2 text-xs">
        <p className="font-medium text-stone-500">{label}</p>
        {isNA ? (
          <p className="mt-0.5 text-stone-600">{example.time}</p>
        ) : (
          <>
            <p className="mt-0.5 font-bold text-stone-900">{example.time}</p>
            <p className="text-stone-600">{example.size}</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4">
      <p className="text-xs font-medium text-stone-500">{label}</p>
      {isNA ? (
        <p className="mt-2 text-sm text-stone-600">{example.time}</p>
      ) : (
        <>
          <p className="mt-2 text-2xl font-bold text-stone-900">{example.time}</p>
          <p className="mt-1 text-sm font-medium text-stone-800">
            {example.description}
          </p>
          <p className="mt-1 text-xs text-stone-500">{example.size}</p>
        </>
      )}
    </div>
  );
}

export function TechnicalSpecs({ performance }: { performance: MachinePerformance }) {
  const { technical } = performance;
  return (
    <section className="mt-6 rounded-xl border border-stone-200 bg-stone-50 p-6">
      <h2 className="text-lg font-bold text-stone-900">Pro / technical specs</h2>
      <p className="mt-1 text-sm text-stone-500">
        Raw numbers for experienced users comparing machines.
      </p>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <TechRow label="Laser spot size" value={technical.spotSize} />
        <TechRow label="Max speed (spec)" value={technical.maxSpeed} />
        <TechRow label="Avg engrave speed" value={technical.avgEngraveSpeed} />
        <TechRow label="Avg cut speed" value={technical.avgCutSpeed} />
        <TechRow label="Motion precision" value={performance.precision} />
      </dl>
    </section>
  );
}

function TechRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-stone-200 bg-white px-3 py-2.5">
      <dt className="text-xs text-stone-500">{label}</dt>
      <dd className="mt-0.5 text-sm font-semibold text-stone-900">{value}</dd>
    </div>
  );
}
