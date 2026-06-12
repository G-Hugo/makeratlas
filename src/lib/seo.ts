import type { Metadata } from "next";
import type { Machine } from "@/types/machine";
import { defaultLocale, locales, type Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/navigation";
import { getCatalogRedirectSlug } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site-url";

export { getCatalogRedirectSlug };

/** App path without locale prefix (must start with `/`). */
export type AppPath = `/${string}`;

export function buildAlternates(locale: Locale, path: AppPath): NonNullable<Metadata["alternates"]> {
  const canonical = localizedPath(locale, path);
  const languages: Record<string, string> = {
    "x-default": localizedPath(defaultLocale, path),
  };
  for (const loc of locales) {
    languages[loc] = localizedPath(loc, path);
  }
  return { canonical, languages };
}

const INDEXABLE_ROBOTS: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: { index: true, follow: true },
};

const NOINDEX_ROBOTS: Metadata["robots"] = {
  index: false,
  follow: true,
  googleBot: { index: false, follow: true },
};

export function buildPageMetadata(options: {
  locale: Locale;
  path: AppPath;
  title: string;
  description: string;
  robots?: Metadata["robots"];
  openGraph?: Partial<NonNullable<Metadata["openGraph"]>>;
  titleAbsolute?: boolean;
}): Metadata {
  const { locale, path, title, description, robots, openGraph, titleAbsolute } = options;
  const canonical = localizedPath(locale, path);

  return {
    title: titleAbsolute ? { absolute: title } : title,
    description,
    alternates: buildAlternates(locale, path),
    robots: robots ?? INDEXABLE_ROBOTS,
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      siteName: "Maker Atlas",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      alternateLocale: locale === "fr" ? ["en_US"] : ["fr_FR"],
      ...openGraph,
    },
  };
}

export function machineCanonicalPath(slug: string, locale: Locale): string {
  return localizedPath(locale, `/lasers/${slug}`);
}

export function machineCanonicalUrl(slug: string, locale: Locale): string {
  return absoluteUrl(machineCanonicalPath(slug, locale));
}

/** Pages that should be indexed (excludes catalog-hidden duplicates) */
export function isMachineIndexable(machine: Machine): boolean {
  return !machine.catalogHidden;
}

export function getIndexableMachines(machines: Machine[]): Machine[] {
  return machines.filter(isMachineIndexable);
}

export function buildMachineMetadata(machine: Machine, locale: Locale): Metadata {
  const path = `/lasers/${machine.slug}` as AppPath;
  const indexable = isMachineIndexable(machine);
  const title =
    locale === "fr"
      ? `${machine.name} : avis et fiches techniques`
      : `${machine.name} Review & Specs`;

  return buildPageMetadata({
    locale,
    path,
    title,
    description: machine.tldr,
    robots: indexable ? INDEXABLE_ROBOTS : NOINDEX_ROBOTS,
    openGraph: {
      title: `${machine.name} | Maker Atlas`,
    },
  });
}

export function buildGuideMetadata(
  guide: { title: string; description: string; slug: string },
  locale: Locale,
): Metadata {
  return buildPageMetadata({
    locale,
    path: `/guides/${guide.slug}` as AppPath,
    title: guide.title,
    description: guide.description,
    openGraph: { type: "article" },
  });
}
