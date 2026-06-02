import type { LaserType, Machine } from "@/types/machine";
import type { CatalogEntry } from "@/lib/catalog-types";
import type { Locale } from "@/i18n/config";

/** Non-laser capability shown in labels (blade cutter, IR module, etc.) */
export type CapabilityTag = LaserType | "blade" | "infrared";

export const LASER_TYPES_ORDER: LaserType[] = ["diode", "co2", "fiber", "uv", "hybrid"];

export function capabilityTagLabel(tag: CapabilityTag): string {
  const labels: Record<CapabilityTag, string> = {
    diode: "diode",
    co2: "CO₂",
    fiber: "fiber",
    uv: "UV",
    hybrid: "hybrid",
    blade: "blade",
    infrared: "IR",
  };
  return labels[tag] ?? tag;
}

/** Laser types used for /lasers/type/* browse (excludes blade-only extras) */
export function getMachineLaserCapabilities(machine: Machine): LaserType[] {
  if (machine.laserCapabilities?.length) {
    return machine.laserCapabilities.filter((t): t is LaserType =>
      LASER_TYPES_ORDER.includes(t as LaserType),
    );
  }

  if (machine.laserType === "hybrid" && machine.moduleSystem?.style === "dual-laser") {
    const kinds = new Set<LaserType>();
    for (const opt of machine.moduleSystem.options) {
      if (opt.laserKind === "infrared") continue;
      if (LASER_TYPES_ORDER.includes(opt.laserKind as LaserType)) {
        kinds.add(opt.laserKind as LaserType);
      }
    }
    if (kinds.size > 0) return [...kinds];
    return ["fiber", "diode"];
  }

  if (machine.laserType === "hybrid") {
    const tags = getCapabilityTags(machine);
    const lasers = tags.filter((t): t is LaserType =>
      LASER_TYPES_ORDER.includes(t as LaserType),
    );
    if (lasers.length > 0) return lasers;
    return ["diode"];
  }

  return [machine.laserType];
}

export function getCapabilityTags(machine: Machine): CapabilityTag[] {
  if (machine.capabilityTags?.length) return machine.capabilityTags;

  if (machine.moduleSystem?.style === "dual-laser") {
    const tags: CapabilityTag[] = [];
    for (const opt of machine.moduleSystem.options) {
      if (opt.laserKind === "infrared") tags.push("infrared");
      else if (LASER_TYPES_ORDER.includes(opt.laserKind as LaserType)) {
        tags.push(opt.laserKind as LaserType);
      }
    }
    return [...new Set(tags)];
  }

  if (machine.moduleSystem?.style === "interchangeable") {
    const tags: CapabilityTag[] = ["diode"];
    if (machine.moduleSystem.options.some((o) => o.laserKind === "infrared")) {
      tags.push("infrared");
    }
    return tags;
  }

  if (machine.laserType === "hybrid" && /blade/i.test(machine.specs?.power ?? "")) {
    return ["diode", "blade"];
  }

  return [machine.laserType];
}

export function machineMatchesLaserType(machine: Machine, type: LaserType): boolean {
  if (type === "hybrid") return machine.laserType === "hybrid";
  return getMachineLaserCapabilities(machine).includes(type);
}

export function catalogEntryMatchesLaserType(entry: CatalogEntry, type: LaserType): boolean {
  return machineMatchesLaserType(entry.primary, type);
}

/** Brand line label: "Hybrid (diode + fiber)" or "Diode" */
export function formatMachineLaserLabel(machine: Machine, locale: Locale = "en"): string {
  const tags = getCapabilityTags(machine);
  const frLabels: Record<CapabilityTag, string> = {
    diode: "diode",
    co2: "CO₂",
    fiber: "fibre",
    uv: "UV",
    hybrid: "hybride",
    blade: "lame",
    infrared: "IR",
  };
  const localize = (tag: CapabilityTag) =>
    locale === "fr" ? (frLabels[tag] ?? capabilityTagLabel(tag)) : capabilityTagLabel(tag);

  if (machine.laserType === "hybrid" && tags.length > 1) {
    return `${locale === "fr" ? "Hybride" : "Hybrid"} (${tags.map(localize).join(" + ")})`;
  }

  if (machine.moduleSystem?.style === "interchangeable" && tags.length > 1) {
    const base =
      machine.laserType === "co2"
        ? "CO₂"
        : locale === "fr" && machine.laserType === "fiber"
          ? "Fibre"
          : machine.laserType.charAt(0).toUpperCase() + machine.laserType.slice(1);
    return `${base} (${tags.map(localize).join(" + ")})`;
  }

  const single = machine.laserType;
  if (single === "co2") return "CO₂";
  if (locale === "fr" && single === "fiber") return "Fibre";
  if (locale === "fr" && single === "hybrid") return "Hybride";
  return single.charAt(0).toUpperCase() + single.slice(1);
}

export function countCatalogEntriesByLaserType(
  entries: CatalogEntry[],
): Record<LaserType, number> {
  const counts: Record<LaserType, number> = {
    diode: 0,
    co2: 0,
    fiber: 0,
    uv: 0,
    hybrid: 0,
  };

  for (const entry of entries) {
  for (const type of LASER_TYPES_ORDER) {
    if (catalogEntryMatchesLaserType(entry, type)) {
      counts[type] += 1;
    }
  }
  }

  return counts;
}
