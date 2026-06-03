import type { Machine, MachinePhoto } from "@/types/machine";

function heroAlt(machine: Pick<Machine, "name" | "brand">, fallback?: string): string {
  return fallback?.trim() || `${machine.name} laser engraver by ${machine.brand}`;
}

/** Card + detail page hero : same path as `machine.image`. */
export function getPrimaryImage(machine: Pick<Machine, "image" | "images">): string {
  return machine.image || machine.images?.[0]?.src || "";
}

/** Catalog card hero (catalogPrimary tier when present). */
export function getCatalogCardHero(machine: Pick<Machine, "image" | "images">): string {
  return getPrimaryImage(machine);
}

export interface MachinePhotosOptions {
  /** Pin the first slide to this URL (catalog card hero). */
  cardHeroSrc?: string;
}

/**
 * Gallery for the detail page; first slide matches the catalog card hero.
 */
export function getMachinePhotos(
  machine: Pick<Machine, "name" | "brand" | "image" | "images">,
  options?: MachinePhotosOptions,
): MachinePhoto[] {
  const heroSrc = options?.cardHeroSrc ?? getPrimaryImage(machine);
  if (!heroSrc) return [];

  const list = machine.images?.length ? [...machine.images] : [];
  const match = list.find((p) => p.src === heroSrc);
  const heroPhoto: MachinePhoto = match
    ? { ...match, src: heroSrc }
    : {
        src: heroSrc,
        alt: heroAlt(machine, list[0]?.alt),
      };

  const rest = list.filter((p) => p.src !== heroSrc);
  if (rest.length > 0 || match) return [heroPhoto, ...rest];

  return [heroPhoto];
}
