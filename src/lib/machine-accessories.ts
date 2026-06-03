import type { AccessoryAvailability, Machine, MachineAccessory } from "@/types/machine";

export const ACCESSORY_ORDER = [
  "enclosure",
  "safety-glasses",
  "exhaust-vent",
  "smoke-filter",
  "fume-extractor",
  "air-assist",
  "honeycomb-bed",
  "camera",
  "rotary-roller",
  "rotary-chuck",
  "extension-rail",
  "marking-spray",
  "lightburn",
  "fire-extinguisher",
] as const;

export type AccessoryId = (typeof ACCESSORY_ORDER)[number];

export type AccessoryCategory = "safety" | "exhaust" | "workflow" | "expansion" | "software";

export const ACCESSORY_CATEGORIES: Record<AccessoryId, AccessoryCategory> = {
  enclosure: "safety",
  "safety-glasses": "safety",
  "fire-extinguisher": "safety",
  "exhaust-vent": "exhaust",
  "smoke-filter": "exhaust",
  "fume-extractor": "exhaust",
  "air-assist": "workflow",
  "honeycomb-bed": "workflow",
  "marking-spray": "workflow",
  camera: "workflow",
  "rotary-roller": "expansion",
  "rotary-chuck": "expansion",
  "extension-rail": "expansion",
  lightburn: "software",
};

const CATEGORY_ORDER: AccessoryCategory[] = [
  "safety",
  "exhaust",
  "workflow",
  "expansion",
  "software",
];

function machineText(machine: Machine): string {
  return [
    machine.tagline,
    machine.tldr,
    machine.primaryUse,
    machine.beginnerNotes,
    machine.proTips,
    ...machine.pros,
    ...machine.cons,
  ]
    .join(" ")
    .toLowerCase();
}

function mentions(machine: Machine, ...patterns: RegExp[]): boolean {
  const text = machineText(machine);
  return patterns.some((p) => p.test(text));
}

function isEnclosed(machine: Machine): boolean {
  if (
    mentions(
      machine,
      /\bopen[- ]?frame\b/,
      /\bwithout enclosure\b/,
      /\bno enclosure\b/,
      /\bk40\b/,
    )
  ) {
    return false;
  }
  return mentions(
    machine,
    /\benclosed\b/,
    /\benceinte\b/,
    /\bclass\s*1\b/,
    /\binterlock/,
    /\bfull(?:y)?\s+enclosed/,
  );
}

function hasCamera(machine: Machine): boolean {
  return mentions(machine, /\bcamera\b/, /\bvision\b/, /\bpreview\b/);
}

function hasFilterCartridge(machine: Machine): boolean {
  return mentions(
    machine,
    /\bfilter\b/,
    /\bcartridge\b/,
    /\bair\s*purif/,
    /\bfume\s*extract/,
  );
}

function hasAirAssistIncluded(machine: Machine): boolean {
  return mentions(
    machine,
    /\bair\s*assist\s*(included|built-?in|standard)/,
    /\bcompressor\s*(included|kit)/,
    /\bwith\s+air\s*assist/,
  );
}

function cutsMaterials(machine: Machine): boolean {
  return machine.materials.cut.length > 0;
}

function marksMetalWithSpray(machine: Machine): boolean {
  const mats = [...machine.materials.engrave, ...machine.materials.cannot].join(" ").toLowerCase();
  return /spray|coated|anodized/.test(mats) && /metal|stainless|steel|aluminum|aluminium/.test(mats);
}

function marksBareMetal(machine: Machine): boolean {
  return (
    machine.laserType === "fiber" ||
    machine.laserCapabilities?.includes("fiber") ||
    mentions(machine, /\bbare\s+metal\b/, /\bmark(?:s|ing)?\s+(?:stainless|steel|metal)\b/)
  );
}

function supportsLightBurn(machine: Machine): boolean {
  return (machine.specs.software ?? []).some((s) => /lightburn/i.test(s));
}

function hasRotaryOption(machine: Machine): boolean {
  return (
    mentions(machine, /\brotary\b/, /\btumbler\b/, /\bmug\b/, /\bcylindrical\b/) ||
    machine.laserType === "fiber" ||
    machine.laserType === "uv"
  );
}

function hasExtensionRail(machine: Machine): boolean {
  return (
    machine.laserType === "diode" &&
    !isEnclosed(machine) &&
    mentions(machine, /\bextension\b/, /\brail\b/, /\bpass-?through\b/)
  );
}

function inferAccessories(machine: Machine): MachineAccessory[] {
  const enclosed = isEnclosed(machine);
  const type = machine.laserType;
  const list: MachineAccessory[] = [];

  const push = (id: AccessoryId, availability: AccessoryAvailability, note?: string) => {
    list.push({ id, availability, note });
  };

  // Safety
  if (enclosed && type !== "co2") {
    push(
      "enclosure",
      "included",
      mentions(machine, /\benclosed\b/) ? undefined : "Cabinet reduces beam exposure vs open-frame",
    );
    push("safety-glasses", "optional", "Still useful when servicing or with lid open");
  } else if (type === "co2") {
    push("enclosure", "included");
    push("safety-glasses", "optional", "CO₂ wavelength — match OD rating for 10.6 µm if required by manual");
  } else {
    push("enclosure", "optional", "Third-party enclosure improves smoke control and safety");
    push("safety-glasses", "recommended", "~450 nm diode — OD rated for your wavelength");
  }

  push("fire-extinguisher", "recommended");

  // Exhaust
  if (type === "co2") {
    push("exhaust-vent", "recommended", "Route hose outdoors for cutting — especially acrylic");
    push(
      "smoke-filter",
      hasFilterCartridge(machine) ? "included" : "optional",
      hasFilterCartridge(machine) ? undefined : "Inline fan + outdoor vent still preferred for production",
    );
    push("fume-extractor", "optional", "Dedicated extractor if you cannot vent outside");
  } else if (enclosed && hasFilterCartridge(machine)) {
    push("exhaust-vent", "optional", "Filter handles light work; vent outside for heavy cutting");
    push("smoke-filter", "included");
    push("fume-extractor", "not_applicable");
  } else if (enclosed) {
    push("exhaust-vent", "recommended");
    push("smoke-filter", "optional");
    push("fume-extractor", "optional");
  } else {
    push("exhaust-vent", "recommended");
    push("smoke-filter", "optional", "Apartment setups: enclosure + cartridge packs");
    push("fume-extractor", "optional");
  }

  // Workflow
  if (hasAirAssistIncluded(machine)) {
    push("air-assist", "included");
  } else if (type === "co2") {
    push("air-assist", "recommended", "Compressor + nozzle — cleaner acrylic edges");
  } else if (cutsMaterials(machine)) {
    push("air-assist", "recommended");
  } else {
    push("air-assist", "optional", "Helps engraving clarity; strongly recommended if you cut");
  }

  if (cutsMaterials(machine) && type !== "fiber") {
    push("honeycomb-bed", type === "co2" ? "recommended" : "optional");
  } else {
    push("honeycomb-bed", "not_applicable");
  }

  if (hasCamera(machine)) {
    push("camera", "included");
  } else if (enclosed || type === "co2") {
    push("camera", "optional", "Often sold as alignment / batch accessory");
  } else {
    push("camera", "optional");
  }

  if (marksMetalWithSpray(machine) && !marksBareMetal(machine)) {
    push("marking-spray", "recommended");
  } else if (marksBareMetal(machine)) {
    push("marking-spray", "not_applicable");
  } else {
    push("marking-spray", "not_applicable");
  }

  // Expansion
  if (hasRotaryOption(machine)) {
    push("rotary-roller", "optional", "Tumblers, mugs, cylindrical blanks");
    push("rotary-chuck", "optional", "Rings and small cylinders — check thread mount");
  } else if (cutsMaterials(machine) || type === "diode") {
    push("rotary-roller", "optional");
    push("rotary-chuck", "optional");
  } else {
    push("rotary-roller", "not_applicable");
    push("rotary-chuck", "not_applicable");
  }

  if (hasExtensionRail(machine)) {
    push("extension-rail", "optional");
  } else {
    push("extension-rail", "not_applicable");
  }

  // Software
  if (supportsLightBurn(machine)) {
    push(
      "lightburn",
      mentions(machine, /\blasergrbl\b/i) ? "recommended" : "optional",
      "~$60–120 license — worth it for most open-frame and CO₂ workflows",
    );
  } else {
    push("lightburn", "not_applicable", "Uses manufacturer app as primary control");
  }

  // Swappable laser heads (not accessories list item — covered by ModuleSystemNotice)
  if (machine.moduleSystem?.style === "interchangeable") {
    const ir = machine.moduleSystem.options.some((o) => o.laserKind === "infrared");
    if (ir) {
      const existing = list.find((a) => a.id === "marking-spray");
      if (existing && existing.availability === "not_applicable") {
        existing.availability = "optional";
        existing.note = "IR module option for some metals — check bundle";
      }
    }
  }

  return list;
}

function mergeAccessories(
  inferred: MachineAccessory[],
  overrides?: MachineAccessory[],
): MachineAccessory[] {
  const byId = new Map<string, MachineAccessory>();
  for (const item of inferred) {
    byId.set(item.id, item);
  }
  for (const item of overrides ?? []) {
    byId.set(item.id, { ...byId.get(item.id), ...item });
  }
  return ACCESSORY_ORDER.map((id) => byId.get(id)).filter((a): a is MachineAccessory => Boolean(a));
}

/** Resolved accessories for display (inferred + JSON overrides). */
export function getMachineAccessories(machine: Machine): MachineAccessory[] {
  const merged = mergeAccessories(inferAccessories(machine), machine.accessories);
  return merged.filter((a) => a.availability !== "not_applicable");
}

export function groupAccessoriesByCategory(
  items: MachineAccessory[],
): { category: AccessoryCategory; items: MachineAccessory[] }[] {
  const groups = new Map<AccessoryCategory, MachineAccessory[]>();
  for (const item of items) {
    const cat = ACCESSORY_CATEGORIES[item.id as AccessoryId] ?? "workflow";
    const arr = groups.get(cat) ?? [];
    arr.push(item);
    groups.set(cat, arr);
  }
  return CATEGORY_ORDER.filter((c) => groups.has(c)).map((category) => ({
    category,
    items: groups.get(category)!,
  }));
}
