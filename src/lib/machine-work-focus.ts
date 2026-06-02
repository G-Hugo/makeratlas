import type { Machine } from "@/types/machine";
import { parsePowerWatts } from "@/lib/catalog-display";

export type MachineWorkFocus = "engrave" | "cut" | "both";

export interface WorkFocusMeta {
  focus: MachineWorkFocus;
  label: string;
  shortLabel: string;
  description: string;
}

const FOCUS_META: Record<MachineWorkFocus, Omit<WorkFocusMeta, "focus">> = {
  engrave: {
    label: "Engraving",
    shortLabel: "Engrave",
    description: "Best for marking, logos, and detail work",
  },
  cut: {
    label: "Cutting",
    shortLabel: "Cut",
    description: "Built mainly for cutting shapes and parts",
  },
  both: {
    label: "Engraving & cutting",
    shortLabel: "Both",
    description: "Handles everyday engraving and cutting jobs",
  },
};

export function getWorkFocusMeta(focus: MachineWorkFocus): WorkFocusMeta {
  return { focus, ...FOCUS_META[focus] };
}

function cutExampleUnavailable(machine: Machine): boolean {
  const { cutExample, technical } = machine.specs.performance;
  const time = cutExample.time.toLowerCase();
  if (
    cutExample.size === "—" ||
    time.includes("not a cut") ||
    time.includes("not a cutter") ||
    time.includes("engraving-only") ||
    time.includes("n/a") ||
    time.includes("use engrav")
  ) {
    return true;
  }
  const avgCut = technical.avgCutSpeed.toLowerCase();
  return avgCut === "n/a" || avgCut.includes("not applicable");
}

function textBlob(machine: Machine): string {
  return [
    machine.primaryUse,
    machine.mainObjective,
    machine.tagline,
    machine.tldr,
    ...machine.bestFor,
    ...machine.materials.cut,
    ...machine.cons,
  ]
    .join(" ")
    .toLowerCase();
}

function scoreText(blob: string): { engrave: number; cut: number } {
  let engrave = 0;
  let cut = 0;

  const engravePatterns = [
    /\bengrav(?:ing|e)?[- ]only\b/g,
    /\b(?:metal |fiber |galvo )?mark(?:ing)?\b/g,
    /\bportable engrav/g,
    /\bengraving[- ]focused\b/g,
    /\bprimarily engrav/g,
    /\bmainly engrav/g,
    /\bfocused on engrav/g,
    /\bphoto engrav/g,
    /\bnot a cutting workhorse\b/g,
    /\blight engrav/g,
    /\bgift engrav/g,
    /\bserial numbers?\b/g,
    /\bdeep engrav/g,
  ];

  const cutPatterns = [
    /\bcut(?:ting)?[- ]only\b/g,
    /\bprimarily cut/g,
    /\bmainly cut/g,
    /\bcut[- ]focused\b/g,
    /\blaser cutter\b/g,
    /\bacrylic cut/g,
    /\bproduction cut/g,
    /\bsignage\b/g,
    /\bstrong(?:er)? cut/g,
    /\bcut performance\b/g,
    /\bcut headroom\b/g,
    /\bthick (?:wood|acrylic)\b/g,
  ];

  for (const re of engravePatterns) {
    const hits = blob.match(re);
    if (hits) engrave += hits.length * 2;
  }

  for (const re of cutPatterns) {
    const hits = blob.match(re);
    if (hits) cut += hits.length * 2;
  }

  const engraveWords = blob.match(/\bengrav(?:ing|e)?\b/g)?.length ?? 0;
  const cutWords = blob.match(/\bcut(?:ting)?\b/g)?.length ?? 0;
  engrave += engraveWords;
  cut += cutWords;

  return { engrave, cut };
}

/** Whether the machine can meaningfully cut (vs engrave-only galvo / fiber). */
export function machineCanCut(machine: Machine): boolean {
  if (machine.materials.cut.length === 0) return false;
  return !cutExampleUnavailable(machine);
}

/** Primary job the machine is built for — shown on catalog cards. */
export function getMachineWorkFocus(machine: Machine): MachineWorkFocus {
  const canCut = machineCanCut(machine);
  const canEngrave = machine.materials.engrave.length > 0;

  if (!canCut && canEngrave) return "engrave";
  if (canCut && !canEngrave) return "cut";

  if (!canCut) return "engrave";

  if (machine.laserType === "fiber" || machine.laserType === "uv") {
    return "engrave";
  }

  const blob = textBlob(machine);

  if (
    /\b(?:engrav(?:ing|e)?\s*(?:&|and)\s*cut(?:ting)?|cut(?:ting)?\s*(?:&|and)\s*engrav(?:ing|e)?)\b/i.test(
      blob,
    )
  ) {
    return "both";
  }

  if (machine.laserType === "co2") {
    return "both";
  }

  const { engrave, cut } = scoreText(blob);

  if (engrave >= cut + 3) return "engrave";
  if (cut >= engrave + 3) return "cut";

  const watts = parsePowerWatts(machine);
  if (machine.laserType === "diode" && watts !== null && watts <= 6 && engrave >= cut) {
    return "engrave";
  }

  return "both";
}
