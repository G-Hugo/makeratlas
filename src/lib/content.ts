import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Locale } from "@/i18n/config";
import { localizeMachine, localizeMachines } from "@/lib/machine-locale";
import { readMachineBySlug, readPublishedMachines } from "@/lib/machines-data";
import type { Guide, GuideMeta, LaserType, Machine } from "@/types/machine";
import {
  getCatalogEntries,
  getPowerTiersForMachine,
} from "@/lib/catalog";
import { catalogEntryMatchesLaserType, countCatalogEntriesByLaserType } from "@/lib/laser-capabilities";
export { getCatalogEntries, getPowerTiersForMachine } from "@/lib/catalog";
export type { CatalogEntry } from "@/lib/catalog-types";

const contentDir = path.join(process.cwd(), "content");

export function getAllMachines(locale: Locale = "en"): Machine[] {
  return localizeMachines(readPublishedMachines(), locale);
}

export function getMachineBySlug(slug: string, locale: Locale = "en"): Machine | undefined {
  const machine = readMachineBySlug(slug);
  if (!machine) return undefined;
  return localizeMachine(machine, locale);
}

/** Resolve similar-model links : drops archived or missing slugs */
export function getSimilarMachines(machine: Machine, locale: Locale = "en"): Machine[] {
  return (machine.similarModels ?? [])
    .map((slug) => getMachineBySlug(slug, locale))
    .filter((m): m is Machine => Boolean(m));
}

/** Other tiers in the line (excludes current machine) */
export function getModelVariants(machine: Machine, locale: Locale = "en"): Machine[] {
  return getPowerTiersForMachine(machine, locale).filter((m) => m.slug !== machine.slug);
}

export function getCatalogMachineCount(locale: Locale = "en"): number {
  return getCatalogEntries(locale).length;
}

export function getCatalogEntriesByLaserType(type: LaserType, locale: Locale = "en") {
  return getCatalogEntries(locale).filter((e) => catalogEntryMatchesLaserType(e, type));
}

/** Published machines eligible for sitemap and Google indexing */
export function getIndexableMachines(locale: Locale = "en"): Machine[] {
  return getAllMachines(locale).filter((m) => !m.catalogHidden);
}

function resolveGuideFile(slug: string, locale: Locale): string | undefined {
  const localized = path.join(contentDir, "guides", locale, `${slug}.md`);
  if (fs.existsSync(localized)) return localized;
  const fallback = path.join(contentDir, "guides", `${slug}.md`);
  if (fs.existsSync(fallback)) return fallback;
  return undefined;
}

export function getAllGuidesMeta(locale: Locale = "en"): GuideMeta[] {
  const scanDir =
    locale === "fr"
      ? path.join(contentDir, "guides", "fr")
      : path.join(contentDir, "guides");
  if (!fs.existsSync(scanDir)) return [];

  return fs
    .readdirSync(scanDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(scanDir, file), "utf-8");
      const { data } = matter(raw);
      return data as GuideMeta;
    })
    .filter((guide) => guide.status === "published")
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getGuideBySlug(slug: string, locale: Locale = "en"): Guide | undefined {
  const filePath = resolveGuideFile(slug, locale);
  if (!filePath) return undefined;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    ...(data as GuideMeta),
    content,
  };
}

export function getLaserTypeCounts(locale: Locale = "en"): Record<string, number> {
  return countCatalogEntriesByLaserType(getCatalogEntries(locale));
}

export function getMachinesByLaserType(type: LaserType, locale: Locale = "en"): Machine[] {
  return getAllMachines(locale).filter((machine) => machine.laserType === type);
}

/** Dedicated deep-dive guide per catalog laser type */
export const LASER_TYPE_GUIDE_SLUG: Record<LaserType, string> = {
  diode: "diode-lasers-explained",
  co2: "co2-lasers-explained",
  fiber: "fiber-lasers-explained",
  uv: "uv-lasers-explained",
  hybrid: "hybrid-lasers-explained",
};

export const SPECIALTY_GUIDE_SLUGS = {
  mopa: "mopa-fiber-lasers-explained",
  galvo: "galvo-laser-workstations-explained",
  infrared: "infrared-laser-modules-explained",
  modules: "swappable-laser-modules-explained",
  wattage: "laser-wattage-marketing-explained",
  metalWithoutFiber: "metal-marking-without-fiber",
  enclosed: "open-frame-vs-enclosed-lasers",
  lightburn: "lightburn-vs-maker-software",
  rotary: "rotary-laser-engraving",
  co2Tubes: "co2-laser-tubes-explained",
  materials: "laser-materials-by-type",
} as const;

export const SETUP_GUIDE_SLUGS = {
  safety: "laser-safety-basics",
  ventilation: "laser-ventilation-setup",
  airAssist: "air-assist-honeycomb-setup",
  exhaustFilters: "laser-exhaust-filters-explained",
} as const;

export const SPECIALTY_TECH_SLUGS: string[] = [
  SPECIALTY_GUIDE_SLUGS.modules,
  SPECIALTY_GUIDE_SLUGS.wattage,
  SPECIALTY_GUIDE_SLUGS.mopa,
  SPECIALTY_GUIDE_SLUGS.galvo,
  SPECIALTY_GUIDE_SLUGS.infrared,
  SPECIALTY_GUIDE_SLUGS.co2Tubes,
];

export const SPECIALTY_BUYER_SLUGS: string[] = [
  SPECIALTY_GUIDE_SLUGS.metalWithoutFiber,
  SPECIALTY_GUIDE_SLUGS.enclosed,
  SPECIALTY_GUIDE_SLUGS.materials,
  SPECIALTY_GUIDE_SLUGS.lightburn,
  SPECIALTY_GUIDE_SLUGS.rotary,
];

export const SETUP_GUIDE_ORDER: string[] = [
  SETUP_GUIDE_SLUGS.safety,
  SETUP_GUIDE_SLUGS.ventilation,
  SETUP_GUIDE_SLUGS.airAssist,
  SETUP_GUIDE_SLUGS.exhaustFilters,
];

export type SpecialtyGuideKey = keyof typeof SPECIALTY_GUIDE_SLUGS;

/** Related specialty topics shown on type browse pages */
export const SPECIALTY_GUIDES_BY_LASER_TYPE: Partial<
  Record<LaserType, SpecialtyGuideKey[]>
> = {
  diode: ["wattage", "metalWithoutFiber", "enclosed", "modules", "infrared", "lightburn", "rotary", "materials"],
  co2: ["enclosed", "co2Tubes", "materials", "lightburn"],
  fiber: ["mopa", "galvo", "metalWithoutFiber", "materials"],
  hybrid: ["galvo", "mopa", "modules", "materials", "lightburn"],
  uv: ["galvo", "materials"],
};

export const GUIDE_INDEX_SECTIONS = [
  "overview",
  "byType",
  "specialtyTech",
  "specialtyBuyer",
  "buying",
  "safetySetup",
] as const;

export type GuideIndexSection = (typeof GUIDE_INDEX_SECTIONS)[number];

const OVERVIEW_GUIDE_SLUG = "understanding-laser-types";

export function guideIndexSectionFor(meta: GuideMeta): GuideIndexSection {
  if (meta.slug === OVERVIEW_GUIDE_SLUG) return "overview";
  if (meta.category === "specialty") {
    if (SPECIALTY_BUYER_SLUGS.includes(meta.slug)) return "specialtyBuyer";
    return "specialtyTech";
  }
  if (meta.category === "laser-types") return "byType";
  if (meta.category === "buying-guide") return "buying";
  return "safetySetup";
}

export const LASER_TYPE_INFO: Record<
  LaserType,
  { label: string; description: string; guideSlug: string }
> = {
  diode: {
    label: "Diode",
    description:
      "Blue-light semiconductor lasers. Best for wood, leather, and budget hobby work. Cannot cut clear acrylic or mark bare metal without spray.",
    guideSlug: LASER_TYPE_GUIDE_SLUG.diode,
  },
  co2: {
    label: "CO₂",
    description:
      "Gas-tube infrared lasers. The standard for cutting acrylic and wood. Requires ventilation. Cannot mark bare metal.",
    guideSlug: LASER_TYPE_GUIDE_SLUG.co2,
  },
  fiber: {
    label: "Fiber",
    description:
      "Metal-focused 1064 nm lasers for marking stainless, aluminum, and brass. Includes standard fiber and MOPA variants (see specialty guides).",
    guideSlug: LASER_TYPE_GUIDE_SLUG.fiber,
  },
  uv: {
    label: "UV",
    description:
      "Cold laser for plastics, glass, and fine industrial marking. Rare in hobby desktop machines.",
    guideSlug: LASER_TYPE_GUIDE_SLUG.uv,
  },
  hybrid: {
    label: "Hybrid",
    description:
      "Two laser technologies in one chassis (fiber + diode). Switch modes; not the same as swapping a 10W vs 40W diode head on an S1.",
    guideSlug: LASER_TYPE_GUIDE_SLUG.hybrid,
  },
};
