import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { localizedPath } from "@/i18n/navigation";
import { getAllGuidesMeta, getIndexableMachines } from "@/lib/content";
import { SITE_URL } from "@/lib/site-url";

const BASE_URL = SITE_URL;
const laserTypes = ["diode", "co2", "fiber", "uv", "hybrid"];

export default function sitemap(): MetadataRoute.Sitemap {
  const machines = getIndexableMachines();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    const guides = getAllGuidesMeta(locale);

    entries.push(
      { url: `${BASE_URL}${localizedPath(locale, "/")}`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
      { url: `${BASE_URL}${localizedPath(locale, "/lasers")}`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
      { url: `${BASE_URL}${localizedPath(locale, "/guides")}`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
      { url: `${BASE_URL}${localizedPath(locale, "/compare")}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
      { url: `${BASE_URL}${localizedPath(locale, "/about")}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
      { url: `${BASE_URL}${localizedPath(locale, "/methodology")}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
      { url: `${BASE_URL}${localizedPath(locale, "/transparency")}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
      { url: `${BASE_URL}${localizedPath(locale, "/legal")}`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
      { url: `${BASE_URL}${localizedPath(locale, "/privacy")}`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
      { url: `${BASE_URL}${localizedPath(locale, "/cookies")}`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    );

    for (const type of laserTypes) {
      entries.push({
        url: `${BASE_URL}${localizedPath(locale, `/lasers/type/${type}`)}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.85,
      });
    }

    for (const m of machines) {
      entries.push({
        url: `${BASE_URL}${localizedPath(locale, `/lasers/${m.slug}`)}`,
        lastModified: new Date(m.lastUpdated),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }

    for (const g of guides) {
      entries.push({
        url: `${BASE_URL}${localizedPath(locale, `/guides/${g.slug}`)}`,
        lastModified: new Date(g.lastUpdated),
        changeFrequency: "monthly",
        priority: 0.85,
      });
    }
  }

  return entries;
}
