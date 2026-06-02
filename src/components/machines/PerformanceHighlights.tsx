import type { Dictionary } from "@/i18n/dictionaries/types";
import type { JobExample, MachinePerformance } from "@/types/machine";

type MachineLabels = Dictionary["machine"];

interface PerformanceHighlightsProps {
  performance: MachinePerformance;
  mainObjective: string;
  labels: MachineLabels;
  variant?: "hero" | "compact";
}

export function PerformanceHighlights({
  performance,
  mainObjective,
  labels,
  variant = "hero",
}: PerformanceHighlightsProps) {
  const spotLabel = performance.technical.spotSize || performance.precision;

  if (variant === "compact") {
    return (
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-600">
        <span>
          <strong className="text-stone-800">{labels.spotSize}:</strong> {spotLabel}
        </span>
        <span>
          <strong className="text-stone-800">{labels.motionPrecision}:</strong>{" "}
          {performance.precision}
        </span>
        <span>
          <strong className="text-stone-800">{labels.sampleEngrave}:</strong>{" "}
          {performance.engraveExample.time}
        </span>
      </div>
    );
  }

  return (
    <section className="rounded-xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-white p-6 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
        {labels.performanceWhatFor}
      </p>
      <p className="mt-3 text-lg font-semibold leading-snug text-stone-900">
        {mainObjective}
      </p>

      <p className="mt-5 rounded-lg bg-white/80 px-3 py-2 text-xs text-stone-600">
        <strong className="text-stone-800">{labels.performanceBenchmark}</strong>{" "}
        {labels.performanceBenchmarkBody}
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-amber-400 bg-amber-100/60 p-4 sm:col-span-1">
          <p className="text-xs font-medium text-amber-900">{labels.spotSize}</p>
          <p className="mt-2 text-2xl font-bold text-stone-900">{spotLabel}</p>
          <p className="mt-1 text-xs text-stone-600">{labels.precisionHint}</p>
          <p className="mt-2 text-xs text-stone-500">
            {labels.motionPrecision}: {performance.precision}
          </p>
        </div>
        <JobExampleBlock
          example={performance.engraveExample}
          kind="engrave"
          labels={labels}
        />
        <JobExampleBlock
          example={performance.cutExample}
          kind="cut"
          labels={labels}
        />
      </div>

      <p className="mt-4 text-xs text-stone-500">{labels.performanceDisclaimer}</p>
    </section>
  );
}

function JobExampleBlock({
  example,
  kind,
  labels,
  compact = false,
}: {
  example: JobExample;
  kind: "engrave" | "cut";
  labels: MachineLabels;
  compact?: boolean;
}) {
  const isNA =
    example.size === "—" ||
    example.time.toLowerCase().includes("not") ||
    example.time.toLowerCase().includes("use ") ||
    example.time.toLowerCase().includes("engraving-only") ||
    example.time.toLowerCase().includes("n/a") ||
    example.time.toLowerCase().includes("pas de découpe") ||
    example.time.toLowerCase().includes("gravure uniquement");

  const label = kind === "engrave" ? labels.jobEngrave : labels.jobCut;

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

export function TechnicalSpecs({
  performance,
  labels,
}: {
  performance: MachinePerformance;
  labels: MachineLabels;
}) {
  const { technical } = performance;
  return (
    <section className="mt-6 rounded-xl border border-stone-200 bg-stone-50 p-6">
      <h2 className="text-lg font-bold text-stone-900">{labels.technicalSpecs}</h2>
      <p className="mt-1 text-sm text-stone-500">{labels.technicalSpecsBody}</p>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <TechRow label={labels.spotSize} value={technical.spotSize} />
        <TechRow label={labels.maxSpeed} value={technical.maxSpeed} />
        <TechRow label={labels.avgEngraveSpeed} value={technical.avgEngraveSpeed} />
        <TechRow label={labels.avgCutSpeed} value={technical.avgCutSpeed} />
        <TechRow label={labels.motionPrecision} value={performance.precision} />
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
