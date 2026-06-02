/**
 * Keep machine.image and images[0] aligned (card hero = gallery hero).
 */

export function heroAlt(machine, fallbackAlt) {
  return (
    fallbackAlt?.trim() ||
    `${machine.name} laser engraver — ${machine.brand}`
  );
}

/** Canonical hero path: image field wins, then first gallery slot. */
export function getCanonicalHeroSrc(machine) {
  return machine.image || machine.images?.[0]?.src || "";
}

/**
 * Normalize JSON so card (machine.image) and detail page (images[0]) match.
 */
export function applyHeroSync(machine) {
  const heroSrc = getCanonicalHeroSrc(machine);
  if (!heroSrc) return machine;

  const photos = Array.isArray(machine.images) ? [...machine.images] : [];
  const existing = photos.find((p) => p.src === heroSrc);
  const heroPhoto = existing
    ? { ...existing, src: heroSrc }
    : {
        src: heroSrc,
        alt: heroAlt(machine, photos[0]?.alt),
      };

  const rest = photos.filter((p) => p.src !== heroSrc);
  machine.images = [heroPhoto, ...rest];
  machine.image = heroSrc;
  return machine;
}
