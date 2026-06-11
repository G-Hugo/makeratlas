import type { Dictionary } from "@/i18n/dictionaries/types";
import type { Locale } from "@/i18n/config";
import { parsePowerWatts } from "@/lib/catalog-display";
import { formatMachineLaserLabel } from "@/lib/laser-capabilities";
import { getMachineWorkFocus } from "@/lib/machine-work-focus";
import { formatDualPriceRange } from "@/lib/pricing";
import type { Machine } from "@/types/machine";

export const MAX_COMPARE_MACHINES = 4;
export const MIN_COMPARE_MACHINES = 2;

export type CompareWinnerRule = "higher" | "lower";

export interface CompareCell {
  text: string;
  /** Plain list items when row is a bullet list */
  items?: string[];
}

export interface CompareRow {
  id: string;
  label: string;
  cells: CompareCell[];
  winnerIndexes: number[];
}

export interface CompareSection {
  id: string;
  title: string;
  rows: CompareRow[];
}

function parsePrecisionMm(value: string): number | null {
  const m = value.match(/([\d.]+)\s*mm/i);
  return m ? Number(m[1]) : null;
}

function parseWorkAreaMm2(value: string): number | null {
  const m = value.match(/([\d.]+)\s*[x×]\s*([\d.]+)\s*mm/i);
  if (!m) return null;
  return Number(m[1]) * Number(m[2]);
}

function numericValues(
  machines: Machine[],
  getter: (m: Machine) => number | null,
): (number | null)[] {
  return machines.map(getter);
}

function winnerIndexes(values: (number | null)[], rule: CompareWinnerRule): number[] {
  const valid = values
    .map((v, i) => (v !== null && !Number.isNaN(v) ? { v, i } : null))
    .filter((x): x is { v: number; i: number } => x !== null);
  if (valid.length < 2) return [];
  const target =
    rule === "higher"
      ? Math.max(...valid.map((x) => x.v))
      : Math.min(...valid.map((x) => x.v));
  const winners = valid.filter((x) => x.v === target).map((x) => x.i);
  if (winners.length === valid.length) return [];
  return winners;
}

function buildRow(
  machines: Machine[],
  id: string,
  label: string,
  cells: CompareCell[],
  values: (number | null)[],
  rule?: CompareWinnerRule,
): CompareRow {
  return {
    id,
    label,
    cells,
    winnerIndexes: rule ? winnerIndexes(values, rule) : [],
  };
}

function exampleCell(example: { description: string; size: string; time: string }): CompareCell {
  const detail =
    example.size && example.size !== "—" ? `${example.time} · ${example.size}` : example.time;
  return { text: `${example.description}\n${detail}` };
}

export function buildMachineCompareSections(
  machines: Machine[],
  locale: Locale,
  dict: Dictionary,
): CompareSection[] {
  const c = dict.compare;
  const wf = dict.workFocus;

  const sections: CompareSection[] = [];

  sections.push({
    id: "overview",
    title: c.sectionOverview,
    rows: [
      buildRow(
        machines,
        "brand",
        c.rowBrand,
        machines.map((m) => ({ text: m.brand })),
        [],
      ),
      buildRow(
        machines,
        "laserType",
        c.rowLaserType,
        machines.map((m) => ({ text: formatMachineLaserLabel(m, locale) })),
        [],
      ),
      buildRow(
        machines,
        "workFocus",
        c.rowWorkFocus,
        machines.map((m) => {
          const focus = getMachineWorkFocus(m);
          const desc =
            focus === "engrave" ? wf.engraveDesc : focus === "cut" ? wf.cutDesc : wf.bothDesc;
          return { text: desc };
        }),
        [],
      ),
      buildRow(
        machines,
        "objective",
        c.mainObjective,
        machines.map((m) => ({ text: m.mainObjective })),
        [],
      ),
      buildRow(
        machines,
        "bestFor",
        c.rowBestFor,
        machines.map((m) => ({ text: "", items: m.bestFor.slice(0, 4) })),
        [],
      ),
    ],
  });

  sections.push({
    id: "scores",
    title: c.sectionScores,
    rows: [
      ["overall", c.score] as const,
      ["value", c.rowScoreValue] as const,
      ["easeOfUse", c.rowScoreEase] as const,
      ["capability", c.rowScoreCapability] as const,
      ["buildQuality", c.rowScoreBuild] as const,
    ].map(([key, label]) =>
      buildRow(
        machines,
        `score-${key}`,
        label,
        machines.map((m) => ({ text: m.rating[key].toFixed(1) })),
        numericValues(machines, (m) => m.rating[key]),
        "higher",
      ),
    ),
  });

  sections.push({
    id: "pricing",
    title: c.sectionPricing,
    rows: [
      buildRow(
        machines,
        "price",
        c.price,
        machines.map((m) => {
          const { min, max } = m.priceRange;
          const { usd, eurApprox } = formatDualPriceRange(min, max);
          const primary = locale === "fr" ? eurApprox : usd;
          const secondary = locale === "fr" ? usd : eurApprox;
          const note = m.priceRange.note ? `\n${m.priceRange.note}` : "";
          return { text: `${primary}\n${secondary}${note}` };
        }),
        numericValues(machines, (m) => m.priceRange.min),
        "lower",
      ),
    ],
  });

  const perf = machines[0]?.specs.performance;
  const tech = perf?.technical;

  sections.push({
    id: "hardware",
    title: c.sectionHardware,
    rows: [
      buildRow(
        machines,
        "power",
        dict.machine.power,
        machines.map((m) => ({ text: m.specs.power })),
        numericValues(machines, (m) => parsePowerWatts(m)),
        "higher",
      ),
      buildRow(
        machines,
        "workArea",
        dict.machine.workArea,
        machines.map((m) => ({ text: m.specs.workArea.split(" (")[0] ?? m.specs.workArea })),
        numericValues(machines, (m) => parseWorkAreaMm2(m.specs.workArea)),
        "higher",
      ),
      buildRow(
        machines,
        "precision",
        c.precision,
        machines.map((m) => ({ text: m.specs.performance.precision })),
        numericValues(machines, (m) => parsePrecisionMm(m.specs.performance.precision)),
        "lower",
      ),
      ...(machines.some((m) => m.specs.dimensions)
        ? [
            buildRow(
              machines,
              "dimensions",
              c.rowDimensions,
              machines.map((m) => ({ text: m.specs.dimensions ?? "—" })),
              [],
            ),
          ]
        : []),
      ...(machines.some((m) => m.specs.weight)
        ? [
            buildRow(
              machines,
              "weight",
              c.rowWeight,
              machines.map((m) => ({ text: m.specs.weight ?? "—" })),
              [],
            ),
          ]
        : []),
    ],
  });

  sections.push({
    id: "performance",
    title: c.sectionPerformance,
    rows: [
      buildRow(
        machines,
        "engrave",
        c.sampleEngrave,
        machines.map((m) => exampleCell(m.specs.performance.engraveExample)),
        [],
      ),
      buildRow(
        machines,
        "cut",
        c.sampleCut,
        machines.map((m) => exampleCell(m.specs.performance.cutExample)),
        [],
      ),
      ...(tech
        ? [
            buildRow(
              machines,
              "spot",
              c.rowSpotSize,
              machines.map((m) => ({ text: m.specs.performance.technical.spotSize })),
              [],
            ),
            buildRow(
              machines,
              "maxSpeed",
              c.rowMaxSpeed,
              machines.map((m) => ({ text: m.specs.performance.technical.maxSpeed })),
              [],
            ),
          ]
        : []),
    ],
  });

  sections.push({
    id: "materials",
    title: dict.machine.materials,
    rows: [
      buildRow(
        machines,
        "engraveMat",
        dict.machine.engraves,
        machines.map((m) => ({ text: "", items: m.materials.engrave.slice(0, 6) })),
        numericValues(machines, (m) => m.materials.engrave.length),
        "higher",
      ),
      buildRow(
        machines,
        "cutMat",
        dict.machine.cuts,
        machines.map((m) => ({ text: "", items: m.materials.cut.slice(0, 6) })),
        numericValues(machines, (m) => m.materials.cut.length),
        "higher",
      ),
      buildRow(
        machines,
        "cannot",
        dict.machine.cannotDo,
        machines.map((m) => ({ text: "", items: m.materials.cannot.slice(0, 5) })),
        [],
      ),
    ],
  });

  if (machines.some((m) => m.specs.software?.length || m.specs.connectivity?.length)) {
    sections.push({
      id: "software",
      title: c.sectionSoftware,
      rows: [
        ...(machines.some((m) => m.specs.software?.length)
          ? [
              buildRow(
                machines,
                "software",
                dict.machine.software,
                machines.map((m) => ({ text: (m.specs.software ?? []).join(", ") || "—" })),
                [],
              ),
            ]
          : []),
        ...(machines.some((m) => m.specs.connectivity?.length)
          ? [
              buildRow(
                machines,
                "connectivity",
                c.rowConnectivity,
                machines.map((m) => ({ text: (m.specs.connectivity ?? []).join(", ") || "—" })),
                [],
              ),
            ]
          : []),
      ],
    });
  }

  sections.push({
    id: "verdict",
    title: c.sectionVerdict,
    rows: [
      buildRow(
        machines,
        "tldr",
        dict.machine.tldr,
        machines.map((m) => ({ text: m.tldr })),
        [],
      ),
      buildRow(
        machines,
        "pros",
        dict.machine.pros,
        machines.map((m) => ({ text: "", items: m.pros.slice(0, 5) })),
        numericValues(machines, (m) => m.pros.length),
        "higher",
      ),
      buildRow(
        machines,
        "cons",
        dict.machine.cons,
        machines.map((m) => ({ text: "", items: m.cons.slice(0, 5) })),
        [],
      ),
    ],
  });

  return sections;
}

export function parseCompareIdsParam(raw: string | null | undefined): string[] {
  if (!raw) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of raw.split(",")) {
    const slug = part.trim();
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    out.push(slug);
    if (out.length >= MAX_COMPARE_MACHINES) break;
  }
  return out;
}

export function serializeCompareIds(slugs: string[]): string {
  return slugs.slice(0, MAX_COMPARE_MACHINES).join(",");
}
