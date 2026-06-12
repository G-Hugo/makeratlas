import type { MetadataRoute } from "next";
import { defaultLocale, locales, type Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/navigation";
import { getAllGuidesMeta, getIndexableMachines } from "@/lib/content";
import { getAllBrandProfiles } from "@/lib/brands";
import { BEST_OF_CATEGORIES } from "@/lib/best-of";
import { COMPARE_DUELS, duelParam } from "@/lib/compare-duels";
import type { AppPath } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-url";

const BASE_URL = SITE_URL;
const laserTypes = ["diode", "co2", "fiber", "uv", "hybrid"];

type SitemapEntry = MetadataRoute.Sitemap[number];

function hreflangAlternates(path: string): NonNullable<SitemapEntry["alternates"]> {
  const languages: Record<string, string> = {
    "x-default": `${BASE_URL}${localizedPath(defaultLocale, path)}`,
  };
  for (const loc of locales) {
    languages[loc] = `${BASE_URL}${localizedPath(loc, path)}`;
  }
  return { languages };
}

function sitemapUrl(locale: Locale, path: string): string {
  return `${BASE_URL}${localizedPath(locale, path)}`;
}

function localizedEntry(
  locale: Locale,
  path: string,
  rest: Omit<SitemapEntry, "url" | "alternates">,
): SitemapEntry {
  return {
    url: sitemapUrl(locale, path),
    alternates: hreflangAlternates(path),
    ...rest,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const machines = getIndexableMachines();
  const brands = getAllBrandProfiles("en");
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    const guides = getAllGuidesMeta(locale);

    const staticPaths: { path: AppPath; rest: Omit<SitemapEntry, "url" | "alternates"> }[] = [
      { path: "/", rest: { lastModified: new Date(), changeFrequency: "weekly", priority: 1 } },
      { path: "/lasers", rest: { lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 } },
      { path: "/brands", rest: { lastModified: new Date(), changeFrequency: "weekly", priority: 0.88 } },
      { path: "/guides", rest: { lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 } },
      { path: "/compare", rest: { lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 } },
      { path: "/best", rest: { lastModified: new Date(), changeFrequency: "weekly", priority: 0.88 } },
      { path: "/finder", rest: { lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 } },
      { path: "/materials", rest: { lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 } },
      { path: "/about", rest: { lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 } },
      { path: "/methodology", rest: { lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 } },
      { path: "/transparency", rest: { lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 } },
      { path: "/legal", rest: { lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 } },
      { path: "/privacy", rest: { lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 } },
      { path: "/cookies", rest: { lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 } },
    ];

    for (const { path, rest } of staticPaths) {
      entries.push(localizedEntry(locale, path, rest));
    }

    for (const type of laserTypes) {
      entries.push(
        localizedEntry(locale, `/lasers/type/${type}`, {
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.85,
        }),
      );
    }

    for (const category of BEST_OF_CATEGORIES) {
      entries.push(
        localizedEntry(locale, `/best/${category.slug}`, {
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.85,
        }),
      );
    }

    for (const pair of COMPARE_DUELS) {
      entries.push(
        localizedEntry(locale, `/compare/${duelParam(pair)}`, {
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.75,
        }),
      );
    }

    for (const brand of brands) {
      entries.push(
        localizedEntry(locale, `/brands/${brand.slug}`, {
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.82,
        }),
      );
    }

    for (const m of machines) {
      entries.push(
        localizedEntry(locale, `/lasers/${m.slug}`, {
          lastModified: new Date(m.lastUpdated),
          changeFrequency: "monthly",
          priority: 0.8,
        }),
      );
    }

    for (const g of guides) {
      entries.push(
        localizedEntry(locale, `/guides/${g.slug}`, {
          lastModified: new Date(g.lastUpdated),
          changeFrequency: "monthly",
          priority: 0.85,
        }),
      );
    }
  }

  return entries;
}
