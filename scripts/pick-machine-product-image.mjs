/**
 * Strict OEM image picker — machine product shot only.
 */

const BAD =
  /gift|promo|sale|vs\.|comparison|selling_points|national|christmas|valentine|infographic|lifestyle|accessory|motherboard|tube|lens|belt|filter|paper|mat|course|warranty|replacement|spare|honeycomb|chiller|extension|rotary|air.?assist|purifier|packing|collage|specification|dimension|chart|feature|what.?s in the box|engraving on|cutting on|cuttingcreality|colorfulengrave|sample|project|logo|icon|banner|productivity|jewelry|all-series|collection-1600|-lwh\.|free.?gift|nationalpet|\.gif|hub\.jpg|_hub\.|basic.?pack|refurbish|GT_Fiber|6w_|with_Air_Assist|official-refurbished|listing|Frame\d|controlboard|NationalPetDay|gift.?box|All_In|Conveyor|streamline|Pack\.jpg|mode.?switch|packing|zhutuduibi|gcode|detail\d|after-sales|power.?supply|fume|extractor|laser.?tube|detail-|_AC_SL|wechat|qr.?code|ribbon|months.?warranty|3000bundle|Bundle-rotary|Bundle-honeycomb|Bundle-6W|AllBundle|gcode/i;

/** Bundle filenames that still show the machine (allowed only for these slugs) */
const ALLOW_BUNDLE_FILE = {
  "monport-reno45-pro-45w": /reno-vision-bundle/i,
  "monport-gt-30w-fiber": /GT30Bundle/i,
};

const STRONG_GOOD =
  /engraver|engraving.?machine|laser.?cutter|laser.?machine|co2.?laser|diode.?laser|desktop.?laser|open-frame|sideview|topview|standalone|unibody|no-module|main_pic|main-pic|_basic|basic\.png|white\.webp|1200x1200|1600x1600|product.*shot|machine/i;

const WEAK_GOOD = /\.png$|\.webp$|\.jpg$/i;

const WRONG_FOR_SLUG = {
  "algolaser-alpha-mk2": /\bdelta\b|diy-kit/i,
  "algolaser-alpha-mk2-40w": /\bdelta\b|diy-kit/i,
  "algolaser-alpha-mk2-10w": /\bdelta\b|diy-kit/i,
  "algolaser-alpha-mk2-20w": /\bdelta\b|diy-kit/i,
  "algolaser-delta-22w": /\balpha\b|diy-kit/i,
  "algolaser-diy-kit-mk2-10w": /\balpha\b|\bdelta\b/i,
  "algolaser-diy-kit-mk2": /\balpha\b|\bdelta\b/i,
  "monport-gt-30w-fiber": /\b100w\b|\b200w\b|\b6w\b/i,
  "monport-gt-50w-fiber": /\b100w\b|\b200w\b|\b6w\b|GT30/i,
  "monport-gt-60w-fiber": /\b30w\b|\b200w\b|\b6w\b|GT30/i,
  "monport-gt-100w-fiber": /\b30w\b|\b200w\b|\b6w\b|GT30/i,
  "monport-reno45-pro-45w": /bundle|all-series|vs\./i,
  "longer-nano-pro-12w": /\bb1\b|ray5/i,
  "longer-nano-6w": /\bb1\b|ray5/i,
  "atomstack-x30-pro": /enclosure\.webp$/i,
};

const PREFER_FOR_SLUG = {
  "monport-gt-30w-fiber": /GT30|30w/i,
  "monport-gt-50w-fiber": /GT50|50w/i,
  "monport-gt-60w-fiber": /GT60|60w|mopa/i,
  "monport-gt-100w-fiber": /GT100|100w/i,
  "monport-reno45-pro-45w": /reno45|reno.?45|45vision|desktop.?co2/i,
  "algolaser-alpha-mk2-40w": /alpha.?mk2|alpha-mk2/i,
  "algolaser-alpha-mk2-20w": /alpha.?mk2|alpha-mk2/i,
  "algolaser-alpha-mk2-10w": /alpha.?mk2|alpha-mk2/i,
  "algolaser-diy-kit-mk2-10w": /diy.?kit/i,
  "creality-falcon2-22w": /sideview|22w/i,
  "creality-falcon2-pro-40w": /pro_png|40w.*sideview|enclosed/i,
  "creality-falcon2-pro": /pro_png|pro_22w/i,
};

function slugTokens(slug, name = "", brand = "") {
  const stop = new Set(["laser", "engraver", "cutter", "machine", "series", "smart", "desktop"]);
  return [
    ...slug.split("-"),
    ...name.toLowerCase().split(/\s+/),
    brand.toLowerCase(),
  ].filter((w) => w.length > 2 && !stop.has(w));
}

export function scoreMachineImage(url, slug, alt = "", ctx = {}) {
  const lower = (url || "").toLowerCase();
  const altL = (alt || "").toLowerCase();
  let score = 0;

  if (!lower) return -999;
  if (BAD.test(lower) || BAD.test(altL)) {
    const allow = ALLOW_BUNDLE_FILE[slug];
    if (!allow?.test(lower)) return -999;
  }
  if (/bundle/i.test(lower) && !ALLOW_BUNDLE_FILE[slug]?.test(lower)) return -999;

  const wrong = WRONG_FOR_SLUG[slug];
  if (wrong?.test(lower) || wrong?.test(altL)) return -999;

  if (STRONG_GOOD.test(lower) || STRONG_GOOD.test(altL)) score += 50;
  if (WEAK_GOOD.test(lower)) score += 5;

  const prefer = PREFER_FOR_SLUG[slug];
  if (prefer?.test(lower) || prefer?.test(altL)) score += 40;

  for (const t of slugTokens(slug, ctx.name, ctx.brand)) {
    if (lower.includes(t) || altL.includes(t)) score += 12;
  }

  if (/^https:\/\/cdn\.shopify\.com.*\/products\//i.test(url) && !/^\d+_/.test(lower.split("/").pop())) {
    score += 15;
  }

  if (/^[\d]+_[\da-f-]+\.(jpg|png|webp)$/i.test(lower.split("/").pop() || "")) score -= 15;
  if (/camera.?pack|basic.?pack|allbundle/i.test(lower)) score -= 80;

  return score;
}

export function pickMachineProductImage(images, slug, ctx = {}) {
  if (!images?.length) return null;

  const ranked = images
    .map((img, index) => ({
      src: img.src?.split("?")[0],
      alt: img.alt || "",
      index,
      score: scoreMachineImage(img.src || "", slug, img.alt || "", ctx),
    }))
    .filter((x) => x.src && x.score >= 45)
    .sort((a, b) => b.score - a.score || a.index - b.index);

  return ranked[0] ?? null;
}

export function pickMachineGallery(images, slug, ctx = {}, max = 4) {
  const ranked = images
    .map((img, index) => ({
      src: img.src?.split("?")[0],
      alt: img.alt || "",
      index,
      score: scoreMachineImage(img.src || "", slug, img.alt || "", ctx),
    }))
    .filter((x) => x.src && x.score >= 20)
    .sort((a, b) => b.score - a.score || a.index - b.index);

  const urls = [];
  for (const img of ranked) {
    if (urls.includes(img.src)) continue;
    // Hero slot: stricter; extra angles: allow decent product shots
    if (urls.length === 0 && img.score < 40) continue;
    if (urls.length > 0 && img.score < 22) continue;
    urls.push(img.src);
    if (urls.length >= max) break;
  }
  return urls;
}

/**
 * Hero (manual or best pick) + up to `max` OEM product angles.
 */
export function buildMachineGalleryUrls(images, slug, ctx = {}, max = 4, manualHeroUrls = []) {
  const urls = manualHeroUrls.map((u) => u.split("?")[0]).filter(Boolean);

  const fromProduct = pickMachineGallery(images, slug, ctx, max);
  for (const src of fromProduct) {
    if (!urls.includes(src)) urls.push(src);
    if (urls.length >= max) break;
  }

  if (!urls.length) {
    const hero = pickMachineProductImage(images, slug, ctx);
    if (hero?.src) urls.push(hero.src);
  }

  return urls.slice(0, max);
}
