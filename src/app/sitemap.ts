import type { MetadataRoute } from "next";
import { getAllGuidesMeta, getAllMachines } from "@/lib/content";

const BASE_URL = "https://makeratlas.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const machines = getAllMachines();
  const guides = getAllGuidesMeta();
  const laserTypes = ["diode", "co2", "fiber", "uv", "hybrid"];

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/lasers`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/guides`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/compare`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const typePages: MetadataRoute.Sitemap = laserTypes.map((type) => ({
    url: `${BASE_URL}/lasers/type/${type}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const machinePages: MetadataRoute.Sitemap = machines.map((m) => ({
    url: `${BASE_URL}/lasers/${m.slug}`,
    lastModified: new Date(m.lastUpdated),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const guidePages: MetadataRoute.Sitemap = guides.map((g) => ({
    url: `${BASE_URL}/guides/${g.slug}`,
    lastModified: new Date(g.lastUpdated),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  return [...staticPages, ...typePages, ...machinePages, ...guidePages];
}
