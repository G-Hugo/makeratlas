/** Normalize inconsistent brand strings from machine JSON. */
const BRAND_CANONICAL: Record<string, string> = {
  Algolaser: "AlgoLaser",
};

export function normalizeBrandName(brand: string): string {
  const trimmed = brand.trim();
  return BRAND_CANONICAL[trimmed] ?? trimmed;
}

export function brandToSlug(brand: string): string {
  return normalizeBrandName(brand)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .replace(/^$/, "unknown");
}
