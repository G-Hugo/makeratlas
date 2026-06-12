import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { getAllBrandProfiles } from "@/lib/brands";
import { getAllGuidesMeta, getCatalogEntries } from "@/lib/content";
import { laserTypeLabelLocalized } from "@/lib/i18n-helpers";

export type SearchItemKind = "machine" | "brand" | "guide" | "page";

export interface SearchItem {
  kind: SearchItemKind;
  label: string;
  sublabel?: string;
  /** Locale-free app path. */
  href: string;
}

/** Full-site search index, built server-side and passed to the palette. */
export function buildSearchIndex(locale: Locale, dict: Dictionary): SearchItem[] {
  const items: SearchItem[] = [];

  for (const entry of getCatalogEntries(locale)) {
    items.push({
      kind: "machine",
      label: entry.displayName,
      sublabel: `${entry.primary.brand} · ${laserTypeLabelLocalized(entry.primary.laserType, dict)}`,
      href: `/lasers/${entry.primary.slug}`,
    });
  }

  for (const brand of getAllBrandProfiles(locale)) {
    items.push({
      kind: "brand",
      label: brand.name,
      sublabel: brand.knownFor,
      href: `/brands/${brand.slug}`,
    });
  }

  for (const guide of getAllGuidesMeta(locale)) {
    items.push({
      kind: "guide",
      label: guide.title,
      href: `/guides/${guide.slug}`,
    });
  }

  const pages: { label: string; href: string }[] = [
    { label: dict.nav.lasers, href: "/lasers" },
    { label: dict.nav.brands, href: "/brands" },
    { label: dict.nav.guides, href: "/guides" },
    { label: dict.nav.compare, href: "/compare" },
    { label: dict.bestOf.indexTitle, href: "/best" },
    { label: dict.finder.title, href: "/finder" },
    { label: dict.materialsPage.title, href: "/materials" },
    { label: dict.nav.about, href: "/about" },
    { label: dict.methodology.title, href: "/methodology" },
  ];
  for (const page of pages) {
    items.push({ kind: "page", label: page.label, href: page.href });
  }

  return items;
}
