"use client";

import { useMemo, useState } from "react";
import { LocaleLink } from "@/components/layout/LocaleLink";
import { MachineImage } from "@/components/machines/MachineImage";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { FinderMachine } from "@/lib/finder";
import { interpolate, laserTypeLabelLocalized } from "@/lib/i18n-helpers";
import { serializeCompareIds } from "@/lib/machine-compare";
import { formatPriceRange } from "@/lib/pricing";
import { ratingColor } from "@/lib/utils";

type Usage = "engrave" | "cut" | "both";
type Materials = "wood" | "acrylic" | "metal" | "mixed";
type Budget = "low" | "mid" | "high" | "max";
type Experience = "none" | "some" | "pro";

interface Answers {
  usage?: Usage;
  materials?: Materials;
  budget?: Budget;
  experience?: Experience;
}

const BUDGET_CAP: Record<Budget, number> = {
  low: 500,
  mid: 1500,
  high: 4000,
  max: Infinity,
};

const RESULT_COUNT = 3;

function scoreMachine(m: FinderMachine, answers: Required<Answers>): number | null {
  if (m.priceMin > BUDGET_CAP[answers.budget]) return null;

  let score = m.rating.overall;

  if (answers.usage === "engrave") {
    if (m.workFocus === "engrave") score += 2;
    else if (m.workFocus === "both") score += 1;
  } else if (answers.usage === "cut") {
    if (m.workFocus === "cut") score += 2.5;
    else if (m.workFocus === "both") score += 1.5;
    else score -= 4;
  } else {
    if (m.workFocus === "both") score += 2;
    else score -= 1;
  }

  switch (answers.materials) {
    case "wood":
      if (m.laserType === "diode") score += 2;
      else if (m.laserType === "co2") score += 1.5;
      else if (m.laserType === "hybrid") score += 1;
      else score -= 3;
      break;
    case "acrylic":
      if (m.laserType === "co2") score += 3;
      else if (m.laserType === "diode") score += (m.watts ?? 0) >= 20 ? 0.5 : -1;
      else if (m.laserType === "fiber") score -= 4;
      else score -= 1;
      break;
    case "metal":
      score += m.canMetal ? 4 : -6;
      break;
    case "mixed":
      if (m.laserType === "hybrid") score += 3;
      else if (m.laserType === "co2") score += 1.5;
      if (m.canMetal) score += 0.5;
      break;
  }

  if (answers.experience === "none") {
    score += m.rating.easeOfUse - 7;
    if (m.laserType === "fiber" || m.laserType === "uv") score -= 1;
  } else if (answers.experience === "some") {
    score += (m.rating.easeOfUse - 7) * 0.3;
  } else {
    score += (m.rating.capability - 7) * 0.5;
  }

  if (answers.budget === "low") {
    score += (m.rating.value - 7) * 0.5;
  }

  return score;
}

interface LaserFinderQuizProps {
  machines: FinderMachine[];
  locale: Locale;
  dict: Dictionary;
}

export function LaserFinderQuiz({ machines, locale, dict }: LaserFinderQuizProps) {
  const f = dict.finder;
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);

  const steps: {
    key: keyof Answers;
    question: string;
    options: { value: string; label: string }[];
  }[] = [
    {
      key: "usage",
      question: f.qUsage,
      options: [
        { value: "engrave", label: f.usageEngrave },
        { value: "cut", label: f.usageCut },
        { value: "both", label: f.usageBoth },
      ],
    },
    {
      key: "materials",
      question: f.qMaterials,
      options: [
        { value: "wood", label: f.matWood },
        { value: "acrylic", label: f.matAcrylic },
        { value: "metal", label: f.matMetal },
        { value: "mixed", label: f.matMixed },
      ],
    },
    {
      key: "budget",
      question: f.qBudget,
      options: [
        { value: "low", label: f.budgetLow },
        { value: "mid", label: f.budgetMid },
        { value: "high", label: f.budgetHigh },
        { value: "max", label: f.budgetMax },
      ],
    },
    {
      key: "experience",
      question: f.qExperience,
      options: [
        { value: "none", label: f.expNone },
        { value: "some", label: f.expSome },
        { value: "pro", label: f.expPro },
      ],
    },
  ];

  const isDone = step >= steps.length;

  const results = useMemo(() => {
    if (!isDone) return [];
    const complete = answers as Required<Answers>;
    const scored = machines
      .map((m) => ({ machine: m, score: scoreMachine(m, complete) }))
      .filter((r): r is { machine: FinderMachine; score: number } => r.score !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, RESULT_COUNT);

    const top = scored[0]?.score ?? 1;
    return scored.map((r) => ({
      ...r,
      percent: Math.min(99, Math.max(50, Math.round((r.score / top) * 99))),
    }));
  }, [isDone, answers, machines]);

  function pick(key: keyof Answers, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setStep((s) => s + 1);
  }

  function restart() {
    setAnswers({});
    setStep(0);
  }

  if (!isDone) {
    const current = steps[step];
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-700 dark:bg-stone-900 sm:p-8">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
            {interpolate(f.stepLabel, { step: step + 1, total: steps.length })}
          </p>
          <div className="flex gap-1" aria-hidden>
            {steps.map((s, i) => (
              <span
                key={s.key}
                className={`h-1.5 w-6 rounded-full ${
                  i < step
                    ? "bg-amber-500"
                    : i === step
                      ? "bg-amber-300"
                      : "bg-stone-200 dark:bg-stone-700"
                }`}
              />
            ))}
          </div>
        </div>

        <h2 className="mt-4 text-xl font-semibold text-stone-900 dark:text-stone-100">
          {current.question}
        </h2>

        <div className="mt-5 space-y-2.5">
          {current.options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => pick(current.key, option.value)}
              className="block w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-left text-sm font-medium text-stone-800 transition hover:border-amber-400 hover:bg-amber-50 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:hover:border-amber-500 dark:hover:bg-amber-950/40"
            >
              {option.label}
            </button>
          ))}
        </div>

        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="mt-5 text-sm font-medium text-stone-500 transition hover:text-stone-800 dark:hover:text-stone-200"
          >
            ← {f.back}
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            {f.resultsTitle}
          </h2>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            {interpolate(f.resultsSubtitle, { count: machines.length })}
          </p>
        </div>
        <button
          type="button"
          onClick={restart}
          className="text-sm font-medium text-amber-700 hover:underline dark:text-amber-400"
        >
          ↻ {f.restart}
        </button>
      </div>

      {results.length === 0 ? (
        <p className="mt-8 rounded-xl border border-stone-200 bg-white p-6 text-stone-600 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300">
          {f.noResults}
        </p>
      ) : (
        <>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map(({ machine, percent }, index) => (
              <div
                key={machine.slug}
                className={`relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm dark:bg-stone-900 ${
                  index === 0
                    ? "border-amber-400 ring-2 ring-amber-200 dark:border-amber-600 dark:ring-amber-900/60"
                    : "border-stone-200 dark:border-stone-700"
                }`}
              >
                <LocaleLink href={`/lasers/${machine.slug}`} locale={locale} className="block">
                  <MachineImage
                    machine={{
                      name: machine.name,
                      brand: machine.brand,
                      slug: machine.slug,
                      image: machine.hero,
                      laserType: machine.laserType,
                    }}
                    heroSrc={machine.hero}
                    className="aspect-[4/3] w-full"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                </LocaleLink>
                <span className="absolute left-3 top-3 rounded-full bg-stone-900/90 px-2.5 py-1 text-xs font-bold text-white backdrop-blur dark:bg-amber-500 dark:text-stone-950">
                  {interpolate(f.matchLabel, { percent })}
                </span>
                <div className="flex flex-1 flex-col gap-1.5 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <LocaleLink
                      href={`/lasers/${machine.slug}`}
                      locale={locale}
                      className="font-semibold leading-snug text-stone-900 hover:text-amber-700 dark:text-stone-100 dark:hover:text-amber-400"
                    >
                      {machine.name}
                    </LocaleLink>
                    <span className={`text-lg font-bold ${ratingColor(machine.rating.overall)}`}>
                      {machine.rating.overall.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {machine.brand} · {laserTypeLabelLocalized(machine.laserType, dict)} ·{" "}
                    {formatPriceRange(machine.priceMin, machine.priceMax, locale === "fr" ? "EUR" : "USD")}
                  </p>
                  <p className="line-clamp-3 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
                    {machine.tldr}
                  </p>
                  <LocaleLink
                    href={`/lasers/${machine.slug}`}
                    locale={locale}
                    className="mt-auto pt-2 text-sm font-medium text-amber-700 hover:underline dark:text-amber-400"
                  >
                    {dict.brands.flagshipCta} →
                  </LocaleLink>
                </div>
              </div>
            ))}
          </div>

          {results.length >= 2 && (
            <div className="mt-8 flex justify-center">
              <LocaleLink
                href={`/compare?ids=${serializeCompareIds(results.map((r) => r.machine.slug))}`}
                locale={locale}
                className="rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700"
              >
                {f.compareCta}
              </LocaleLink>
            </div>
          )}
        </>
      )}
    </div>
  );
}
