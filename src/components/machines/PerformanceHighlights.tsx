import type { Dictionary } from "@/i18n/dictionaries/types";
import type { JobExample, MachinePerformance } from "@/types/machine";

type MachineLabels = Dictionary["machine"];

interface PerformanceHighlightsProps {
  performance: MachinePerformance;
  mainObjective: string;
  primaryUse?: string;
  labels: MachineLabels;
  variant?: "hero" | "summary" | "compact";
}

export function PerformanceHighlights({
  performance,
  mainObjective,
  primaryUse,
  labels,
  variant = "hero",
}: PerformanceHighlightsProps) {
  const spotLabel = performance.technical.spotSize || performance.precision;

  if (variant === "summary") {
    return (
      <section className="rounded-xl border border-stone-200 bg-stone-50/80 p-4 dark:border-stone-700 dark:bg-stone-900/60 sm:p-5">
        <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
          {labels.performanceWhatFor}
        </h2>
        <p className="mt-2 text-base font-medium leading-snug text-stone-900 dark:text-stone-100">
          {mainObjective}
        </p>
        {primaryUse?.trim() && primaryUse.trim() !== mainObjective.trim() && (
          <p className="mt-1.5 text-sm text-stone-600 dark:text-stone-400">{primaryUse}</p>
        )}
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <div className="rounded-md border border-amber-200 bg-amber-50/80 px-3 py-2 dark:border-amber-900 dark:bg-amber-950/40">
            <p className="text-[11px] font-medium uppercase tracking-wide text-amber-800 dark:text-amber-300">
              {labels.spotSize}
            </p>
            <p className="mt-0.5 text-sm font-bold text-stone-900 dark:text-stone-100">
              {spotLabel}
            </p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              {labels.motionPrecision}: {performance.precision}
            </p>
          </div>
          <JobExampleBlock
            example={performance.engraveExample}
            kind="engrave"
            labels={labels}
            compact
          />
          <JobExampleBlock
            example={performance.cutExample}
            kind="cut"
            labels={labels}
            compact
          />
        </div>
        <p className="mt-3 text-xs text-stone-500 dark:text-stone-400">
          <span className="font-medium text-stone-600 dark:text-stone-300">
            {labels.performanceBenchmark}:
          </span>{" "}
          {labels.performanceBenchmarkBody} {labels.performanceDisclaimer}
        </p>
      </section>
    );
  }

  if (variant === "compact") {
    return (
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-600 dark:text-stone-400">
        <span>
          <strong className="text-stone-800 dark:text-stone-200">{labels.spotSize}:</strong> {spotLabel}
        </span>
        <span>
          <strong className="text-stone-800 dark:text-stone-200">{labels.motionPrecision}:</strong>{" "}
          {performance.precision}
        </span>
        <span>
          <strong className="text-stone-800 dark:text-stone-200">{labels.sampleEngrave}:</strong>{" "}
          {performance.engraveExample.time}
        </span>
      </div>
    );
  }

  return (
    <section className="rounded-xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-white p-6 shadow-sm dark:border-amber-800 dark:from-amber-950/40 dark:to-stone-900">
      <p className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
        {labels.performanceWhatFor}
      </p>
      <p className="mt-3 text-lg font-semibold leading-snug text-stone-900 dark:text-stone-100">
        {mainObjective}
      </p>
      {primaryUse?.trim() && primaryUse.trim() !== mainObjective.trim() && (
        <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">{primaryUse}</p>
      )}

      <p className="mt-5 rounded-lg bg-white/80 px-3 py-2 text-xs text-stone-600 dark:bg-stone-900/80 dark:text-stone-400">
        <strong className="text-stone-800 dark:text-stone-200">{labels.performanceBenchmark}</strong>{" "}
        {labels.performanceBenchmarkBody}
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-amber-400 bg-amber-100/60 p-4 sm:col-span-1 dark:border-amber-700 dark:bg-amber-950/50">
          <p className="text-xs font-medium text-amber-900 dark:text-amber-200">{labels.spotSize}</p>
          <p className="mt-2 text-2xl font-bold text-stone-900 dark:text-stone-100">{spotLabel}</p>
          <p className="mt-1 text-xs text-stone-600 dark:text-stone-400">{labels.precisionHint}</p>
          <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">
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

      <p className="mt-4 text-xs text-stone-500 dark:text-stone-400">{labels.performanceDisclaimer}</p>
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
      <div className="rounded-md bg-stone-50 px-2.5 py-2 text-xs dark:bg-stone-900">
        <p className="font-medium text-stone-500 dark:text-stone-400">{label}</p>
        {isNA ? (
          <p className="mt-0.5 text-stone-600 dark:text-stone-400">{example.time}</p>
        ) : (
          <>
            <p className="mt-0.5 font-bold text-stone-900 dark:text-stone-100">{example.time}</p>
            <p className="text-stone-600 dark:text-stone-400">{example.size}</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-700 dark:bg-stone-900">
      <p className="text-xs font-medium text-stone-500 dark:text-stone-400">{label}</p>
      {isNA ? (
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">{example.time}</p>
      ) : (
        <>
          <p className="mt-2 text-2xl font-bold text-stone-900 dark:text-stone-100">{example.time}</p>
          <p className="mt-1 text-sm font-medium text-stone-800 dark:text-stone-200">
            {example.description}
          </p>
          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">{example.size}</p>
        </>
      )}
    </div>
  );
}
