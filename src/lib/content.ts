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

export const LASER_TYPE_INFO: Record<
  LaserType,
  { label: string; description: string; guideAnchor?: string }
> = {
  diode: {
    label: "Diode",
    description:
      "Blue-light semiconductor lasers. Best for wood, leather, and budget hobby work. Cannot cut clear acrylic or mark bare metal without spray.",
    guideAnchor: "diode-lasers--the-popular-entry-point",
  },
  co2: {
    label: "CO₂",
    description:
      "Gas-tube infrared lasers. The standard for cutting acrylic and wood. Requires ventilation. Cannot mark bare metal.",
    guideAnchor: "co-lasers--the-cutting-workhorse",
  },
  fiber: {
    label: "Fiber",
    description:
      "Metal-focused lasers for marking stainless, aluminum, and brass without chemical spray.",
    guideAnchor: "fiber-lasers--the-metal-specialist",
  },
  uv: {
    label: "UV",
    description:
      "Cold laser for plastics, glass, and fine industrial marking. Rare in hobby desktop machines.",
    guideAnchor: "uv-lasers--precision-on-delicate-materials",
  },
  hybrid: {
    label: "Hybrid",
    description:
      "Two laser technologies in one chassis (fiber + diode). Switch modes; not the same as swapping a 10W vs 40W diode head on an S1.",
    guideAnchor: "hybrid-machines--fiber--diode-in-one-box",
  },
};
