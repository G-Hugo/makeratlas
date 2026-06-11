import fs from "fs";
import path from "path";
import type { Locale } from "@/i18n/config";
import { brandToSlug, normalizeBrandName } from "@/lib/brand-slug";
import { getBrandLogoSrc } from "@/lib/brand-logos";
import { getCatalogEntries } from "@/lib/catalog";
import type { CatalogEntry } from "@/lib/catalog-types";
import { machineMatchesLaserType } from "@/lib/laser-capabilities";
import type { BrandEditorial, BrandFlagship, BrandProfile } from "@/types/brand";
import type { LaserType } from "@/types/machine";

const brandsFile = path.join(process.cwd(), "content", "brands", "catalog.json");
const frOverlayFile = path.join(process.cwd(), "content", "translations", "fr", "brands", "catalog.json");

type BrandCatalogFile = { brands: BrandEditorial[] };
type BrandFrOverlay = Record<
  string,
  Partial<
    Pick<
      BrandEditorial,
      "tagline" | "knownFor" | "overview" | "strengths" | "weaknesses" | "flagship"
    >
  >
>;

function readJsonFile<T>(filePath: string): T | undefined {
  if (!fs.existsSync(filePath)) return undefined;
  const raw = fs.readFileSync(filePath, "utf-8").replace(/^\uFEFF/, "");
  return JSON.parse(raw) as T;
}

function readBrandEditorials(): BrandEditorial[] {
  const data = readJsonFile<BrandCatalogFile>(brandsFile);
  return (data?.brands ?? []).filter((b) => b.status === "published");
}

function readFrBrandOverlays(): BrandFrOverlay {
  return readJsonFile<BrandFrOverlay>(frOverlayFile) ?? {};
}

function localizeBrandEditorial(brand: BrandEditorial, locale: Locale): BrandEditorial {
  if (locale !== "fr") return brand;
  const overlay = readFrBrandOverlays()[brand.slug];
  if (!overlay) return brand;
  return {
    ...brand,
    tagline: overlay.tagline ?? brand.tagline,
    knownFor: overlay.knownFor ?? brand.knownFor,
    overview: overlay.overview ?? brand.overview,
    strengths: overlay.strengths ?? brand.strengths,
    weaknesses: overlay.weaknesses ?? brand.weaknesses,
    flagship: overlay.flagship
      ? { ...brand.flagship, ...overlay.flagship }
      : brand.flagship,
  };
}

function entryMatchesBrand(entry: CatalogEntry, brandSlug: string): boolean {
  return brandToSlug(entry.primary.brand) === brandSlug;
}

export function getCatalogEntriesByBrand(brandSlug: string, locale: Locale = "en"): CatalogEntry[] {
  return getCatalogEntries(locale).filter((e) => entryMatchesBrand(e, brandSlug));
}

function buildProfileFromCatalog(
  editorial: BrandEditorial,
  entries: CatalogEntry[],
  locale: Locale,
): BrandProfile {
  const localized = localizeBrandEditorial(editorial, locale);
  const laserTypes = [
    ...new Set(
      entries.flatMap((e) => {
        const types: LaserType[] = [];
        for (const t of ["diode", "co2", "fiber", "uv", "hybrid"] as LaserType[]) {
          if (machineMatchesLaserType(e.primary, t)) types.push(t);
        }
        return types;
      }),
    ),
  ];

  return {
    ...localized,
    lineCount: entries.length,
    laserTypes,
    priceMin: entries.length ? Math.min(...entries.map((e) => e.priceMin)) : 0,
    priceMax: entries.length ? Math.max(...entries.map((e) => e.priceMax)) : 0,
    logoSrc: getBrandLogoSrc(localized.slug),
  };
}

function fallbackFlagship(name: string, entries: CatalogEntry[], locale: Locale): BrandFlagship {
  const top = entries[0]?.primary;
  return {
    name: top?.name ?? name,
    machineSlug: top?.slug ?? "",
    summary:
      locale === "fr"
        ? `Notre référence ${name} sur Maker Atlas : la gamme la mieux notée du catalogue pour débuter votre comparaison.`
        : `Our top-rated ${name} line on Maker Atlas — start your comparison here.`,
  };
}

function fallbackEditorial(
  slug: string,
  name: string,
  entries: CatalogEntry[],
  locale: Locale,
): BrandEditorial {
  return {
    slug,
    name,
    tagline:
      locale === "fr"
        ? `${name} sur Maker Atlas : fiches et gammes laser.`
        : `${name} on Maker Atlas: laser lines, specs, and honest limits.`,
    knownFor:
      locale === "fr"
        ? `Graveuses laser ${name} référencées sur Maker Atlas`
        : `${name} laser engravers in the Maker Atlas catalog`,
    overview: [
      locale === "fr"
        ? `${name} propose ${entries.length} gamme${entries.length > 1 ? "s" : ""} sur Maker Atlas. Consultez les fiches pour comparer puissance, surface utile et matériaux réalistes.`
        : `${name} has ${entries.length} catalog line${entries.length === 1 ? "" : "s"} on Maker Atlas. Use the profiles below to compare power tiers, work area, and honest material limits.`,
    ],
    strengths: [],
    weaknesses: [],
    flagship: fallbackFlagship(name, entries, locale),
    status: "published",
  };
}

/** Brands with at least one catalog line, merged with editorial content when available. */
export function getAllBrandProfiles(locale: Locale = "en"): BrandProfile[] {
  const entries = getCatalogEntries(locale);
  const editorialBySlug = new Map(readBrandEditorials().map((b) => [b.slug, b]));

  const slugToEntries = new Map<string, CatalogEntry[]>();
  for (const entry of entries) {
    const slug = brandToSlug(entry.primary.brand);
    const list = slugToEntries.get(slug) ?? [];
    list.push(entry);
    slugToEntries.set(slug, list);
  }

  const profiles: BrandProfile[] = [];

  for (const [slug, brandEntries] of slugToEntries) {
    const name = normalizeBrandName(brandEntries[0]!.primary.brand);
    const editorial = editorialBySlug.get(slug) ?? fallbackEditorial(slug, name, brandEntries, locale);
    profiles.push(buildProfileFromCatalog(editorial, brandEntries, locale));
  }

  return profiles.sort((a, b) => b.lineCount - a.lineCount || a.name.localeCompare(b.name));
}

export function getBrandBySlug(slug: string, locale: Locale = "en"): BrandProfile | undefined {
  return getAllBrandProfiles(locale).find((b) => b.slug === slug);
}

export function getBrandSlugForMachine(brand: string): string {
  return brandToSlug(brand);
}

export function machineBrandMatchesSlug(machineBrand: string, brandSlug: string): boolean {
  return brandToSlug(machineBrand) === brandSlug;
}
