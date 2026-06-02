import type { Machine, MachinePhoto } from "@/types/machine";

function heroAlt(machine: Pick<Machine, "name" | "brand">, fallback?: string): string {
  return fallback?.trim() || `${machine.name} laser engraver by ${machine.brand}`;
}

/** Card + detail page hero — same path as `machine.image`. */
export function getPrimaryImage(machine: Pick<Machine, "image" | "images">): string {
  return machine.image || machine.images?.[0]?.src || "";
}

/**
 * Gallery for the detail page; first slide is always the catalog card hero.
 */
export function getMachinePhotos(
  machine: Pick<Machine, "name" | "brand" | "image" | "images">,
): MachinePhoto[] {
  const heroSrc = getPrimaryImage(machine);
  if (!heroSrc) return [];

  const list = machine.images?.length ? [...machine.images] : [];
  const match = list.find((p) => p.src === heroSrc);
  const heroPhoto: MachinePhoto = match
    ? { ...match, src: heroSrc }
    : { src: heroSrc, alt: heroAlt(machine, list[0]?.alt) };

  const rest = list.filter((p) => p.src !== heroSrc);
  if (rest.length > 0 || match) return [heroPhoto, ...rest];

  return [heroPhoto];
}
