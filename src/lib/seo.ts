import type { Metadata } from "next";
import type { Machine } from "@/types/machine";
import { getCatalogRedirectSlug } from "@/lib/catalog";

const SITE = "https://makeratlas.com";

export { getCatalogRedirectSlug };

export function machineCanonicalPath(slug: string): string {
  return `/lasers/${slug}`;
}

export function machineCanonicalUrl(slug: string): string {
  return `${SITE}${machineCanonicalPath(slug)}`;
}

/** Pages that should be indexed (excludes catalog-hidden duplicates) */
export function isMachineIndexable(machine: Machine): boolean {
  return !machine.catalogHidden;
}

export function getIndexableMachines(machines: Machine[]): Machine[] {
  return machines.filter(isMachineIndexable);
}

export function buildMachineMetadata(machine: Machine): Metadata {
  const canonical = machineCanonicalPath(machine.slug);
  const indexable = isMachineIndexable(machine);

  return {
    title: `${machine.name} Review & Specs`,
    description: machine.tldr,
    alternates: {
      canonical,
    },
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: {
      title: `${machine.name} | Maker Atlas`,
      description: machine.tldr,
      url: canonical,
      type: "website",
      siteName: "Maker Atlas",
    },
  };
}
