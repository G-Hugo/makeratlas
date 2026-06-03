import type { Machine } from "@/types/machine";

/** Lowercase copy used for keyword detection (works for EN and FR overlays). */
export function machineCopyText(machine: Machine): string {
  return [
    machine.name,
    machine.tagline,
    machine.tldr,
    machine.primaryUse,
    machine.mainObjective,
    machine.beginnerNotes,
    machine.proTips,
    ...(machine.pros ?? []),
    ...(machine.cons ?? []),
    ...(machine.specs.software ?? []),
    machine.moduleSystem?.headline ?? "",
    machine.moduleSystem?.description ?? "",
    ...(machine.accessories?.map((a) => a.note ?? "") ?? []),
  ]
    .join(" ")
    .toLowerCase();
}

export function copyMentions(machine: Machine, ...patterns: RegExp[]): boolean {
  const text = machineCopyText(machine);
  return patterns.some((p) => p.test(text));
}
