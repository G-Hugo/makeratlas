import type { Locale } from "@/i18n/config";
import type { Machine, ModuleSystemOption } from "@/types/machine";

export type TierChipVariant = "power" | "module";

export function parsePowerWattsFromText(text: string): number | null {
  const match = text.match(/(\d+(?:\.\d+)?)\s*W/i);
  return match ? Number(match[1]) : null;
}

function parsePowerWatts(machine: Machine): number | null {
  return (
    parsePowerWattsFromText(machine.powerRating ?? "") ??
    parsePowerWattsFromText(machine.specs.power ?? "")
  );
}

function laserKindSuffix(
  kind: ModuleSystemOption["laserKind"],
  locale: Locale,
  hints?: { optionLabel?: string; specsPower?: string },
): string {
  const label = hints?.optionLabel?.toLowerCase() ?? "";
  const specs = hints?.specsPower?.toLowerCase() ?? "";

  if (kind === "infrared") return "IR";
  if (label.includes("mopa") || specs.includes("mopa")) return "MOPA";

  if (kind === "co2") return "CO₂";
  if (kind === "uv") return "UV";
  if (kind === "fiber") return locale === "fr" ? "fibre" : "fiber";
  if (kind === "diode") return "diode";
  if (kind === "hybrid") return locale === "fr" ? "hybride" : "hybrid";
  return kind;
}

function laserKindForTier(machine: Machine): ModuleSystemOption["laserKind"] | Machine["laserType"] {
  const opt = machine.moduleSystem?.options.find((o) => o.tierSlug === machine.slug);
  if (opt) return opt.laserKind;
  return machine.laserType;
}

/** Uniform tier chip: watts first, then laser type (e.g. 20W diode, 80W CO₂). */
export function formatPowerTierChipLabel(
  machine: Machine,
  locale: Locale = "en",
  tiers?: Machine[],
): string {
  const opt = machine.moduleSystem?.options.find((o) => o.tierSlug === machine.slug);
  const watts =
    parsePowerWattsFromText(opt?.power ?? "") ??
    parsePowerWatts(machine);
  const variant = tiers?.length ? getTierChipVariant(tiers) : undefined;

  if (variant === "power" && watts != null) {
    return `${watts}W`;
  }

  const kind = laserKindForTier(machine);
  const suffix = laserKindSuffix(kind, locale, {
    optionLabel: opt?.label,
    specsPower: machine.specs.power,
  });

  if (watts != null && suffix) return `${watts}W ${suffix}`;
  if (watts != null) return `${watts}W`;
  return "—";
}

export function formatModuleOptionChipLabel(
  opt: ModuleSystemOption,
  locale: Locale = "en",
): string {
  const watts = parsePowerWattsFromText(opt.power);
  const suffix = laserKindSuffix(opt.laserKind, locale, { optionLabel: opt.label });
  if (watts != null && suffix) return `${watts}W ${suffix}`;
  if (watts != null) return `${watts}W`;
  return opt.label;
}

/**
 * Multi-module (sky): swappable heads on one chassis (S1, H20, D1 Pro, P3, Falcon T1…).
 * Upgrade = buy a module, not a new machine. Detected via moduleSystem.interchangeable.
 * Multi-power (amber): factory wattage SKUs on the same product line, not swappable heads (Falcon A1, Ray5…).
 */
export function getTierChipVariant(tiers: Machine[]): TierChipVariant {
  if (tiers.length <= 1) return "power";

  if (tiers.some((m) => m.moduleSystem?.style === "interchangeable")) {
    return "module";
  }

  return "power";
}

export function isMultiModuleTierLine(tiers: Machine[]): boolean {
  return getTierChipVariant(tiers) === "module";
}

export function isMultiPowerTierLine(tiers: Machine[]): boolean {
  return tiers.length > 1 && getTierChipVariant(tiers) === "power";
}

export const TIER_CHIP_STYLES: Record<
  TierChipVariant,
  { active: string; idle: string; idleLink: string }
> = {
  power: {
    active: "bg-amber-600 text-white shadow-sm ring-1 ring-amber-700",
    idle:
      "bg-white text-stone-900 ring-1 ring-amber-400 hover:bg-amber-200 hover:text-stone-950 dark:bg-stone-800 dark:text-amber-50 dark:ring-amber-500 dark:hover:bg-amber-300 dark:hover:text-stone-950",
    idleLink:
      "bg-white text-stone-900 ring-1 ring-amber-400 hover:bg-amber-200 hover:text-stone-950 dark:bg-stone-800 dark:text-amber-50 dark:ring-amber-500 dark:hover:bg-amber-300 dark:hover:text-stone-950",
  },
  module: {
    active: "bg-sky-600 text-white shadow-sm ring-1 ring-sky-700",
    idle:
      "bg-white text-stone-900 ring-1 ring-sky-400 hover:bg-sky-200 hover:text-stone-950 dark:bg-stone-800 dark:text-sky-50 dark:ring-sky-500 dark:hover:bg-sky-300 dark:hover:text-stone-950",
    idleLink:
      "bg-white text-stone-900 ring-1 ring-sky-400 hover:bg-sky-200 hover:text-stone-950 dark:bg-stone-800 dark:text-sky-50 dark:ring-sky-500 dark:hover:bg-sky-300 dark:hover:text-stone-950",
  },
};
