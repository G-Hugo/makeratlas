/**
 * Score Shopify product images for catalog card hero (machine only).
 * Used by curate-primary-card-heroes.mjs
 */

const BAD_FILE =
  /bundle|gift|promo|sale|vs\.|comparison|selling|national|christmas|valentine|infographic|lifestyle|accessory|module|motherboard|tube|lens|belt|filter|paper|mat|course|warranty|replacement|spare|honeycomb|chiller|extension|rotary only|air assist|purifier|enclosure only|packing|collage|specification|dimension|chart|feature|what.?s in the box|engraving on|cutting on|sample|project|logo|icon|banner|productivity|higher-speed|jewelry|all-series|collection-1600|-lwh\.|free.?gift|nationalpet|\.gif$/i;

/** Filename must not suggest a different product line */
const WRONG_FOR_SLUG = {
  "algolaser-alpha-mk2": /\bdelta\b/i,
  "algolaser-alpha-mk2-40w": /\bdelta\b/i,
  "algolaser-alpha-mk2-10w": /\bdelta\b/i,
  "algolaser-alpha-mk2-20w": /\bdelta\b/i,
  "longer-nano-pro-12w": /\bb1\b|laser-b1|ray5/i,
  "longer-nano-6w": /\bb1\b|ray5/i,
  "atomstack-x30-pro": /enclosure\.webp$/i,
  "monport-gt-30w-fiber": /\b100w\b|\b200w\b|\b6w\b/i,
  "monport-gt-50w-fiber": /\b30w\b|\b100w\b|\b200w\b|\b6w\b|GT30/i,
  "monport-gt-60w-fiber": /\b30w\b|\b100w\b|\b200w\b|\b6w\b|GT30/i,
  "monport-gt-100w-fiber": /\b30w\b|\b200w\b|\b6w\b|GT30/i,
};

const PREFER_FOR_SLUG = {
  "monport-gt-30w-fiber": /GT30|30w/i,
  "monport-gt-50w-fiber": /GT50|50w/i,
  "monport-gt-60w-fiber": /GT60|60w|mopa/i,
  "monport-gt-100w-fiber": /GT100|100w/i,
  "monport-reno45-pro-45w": /reno45|reno.?45|45vision/i,
};

const GOOD_FILE =
  /basic\.png|_basic|main-pic|main_pic|product|machine|engraver\.(png|jpg|webp)|white\.webp|1600x1600|1200x1200|sideview|topview|standalone|no-module/i;

export function scoreHeroUrl(url, slug) {
  const lower = url.toLowerCase();
  let score = 50;
  if (BAD_FILE.test(lower)) score -= 80;
  const wrongPat = WRONG_FOR_SLUG[slug];
  if (wrongPat?.test(lower)) score -= 100;
  const preferPat = PREFER_FOR_SLUG[slug];
  if (preferPat?.test(lower)) score += 45;
  if (GOOD_FILE.test(lower)) score += 35;
  if (lower.includes(slug.split("-")[0])) score += 5;
  const slugParts = slug.split("-").filter((p) => p.length > 2);
  for (const p of slugParts) {
    if (lower.includes(p)) score += 8;
  }
  if (/\.png$|\.webp$/i.test(lower)) score += 5;
  if (/\.gif$/i.test(lower)) score -= 40;
  return score;
}

export function pickBestImage(images, slug) {
  if (!images?.length) return null;
  const ranked = images
    .map((img, index) => ({
      src: img.src?.split("?")[0],
      index,
      score: scoreHeroUrl(img.src || "", slug),
    }))
    .filter((x) => x.src && x.score > 0)
    .sort((a, b) => b.score - a.score);
  return ranked[0] ?? null;
}
