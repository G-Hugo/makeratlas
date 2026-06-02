/**
 * High-res Shopify URLs + optional top-crop for catalog composites.
 */

import sharp from "sharp";

/**
 * Slug → extract region (fractions of source height).
 * Used when the catalog "hero" is a vertical composite (machine top, promos bottom).
 */
export const HERO_CROP_REGION = {
  "longer-laser-b1": { top: 0, left: 0, width: 1, height: 0.46 },
  "longer-ray5": { top: 0, left: 0, width: 1, height: 0.72 },
  "wecreat-vision": { top: 0, left: 0, width: 1, height: 0.7 },
  /** LP4 Basic.png is a tall composite — keep the unit at the top */
  "laserpecker-4": { top: 0, left: 0, width: 1, height: 0.52 },
  "monport-reno45-pro-45w": { top: 0, left: 0, width: 1, height: 0.52 },
  "laserpecker-lp1-plus": { top: 0, left: 0, width: 1, height: 0.58 },
};

/** Extra white margin so the machine does not fill the entire card (trim was too tight). */
export const CARD_ZOOM_OUT_SLUGS = new Set([
  "omtech-80w-co2",
  "xtool-s1",
  "xtool-s1-10w",
  "xtool-s1-20w",
  "xtool-s1-40w",
  "wecreat-vision",
  "ortur-h20",
  "ortur-h20-10w",
  "ortur-h20-20w",
  "ortur-h20-40w",
  "twotrees-tts-20-pro-20w",
  "omtech-fc-105sat",
  "atomstack-a40-pro",
  "atomstack-a40-pro-20w",
  "atomstack-a40-pro-40w",
]);

/** DIRECT_GALLERY heroes: full product on white, no composite crop */
export const DIRECT_HERO_SLUGS = new Set([
  "monport-gt-30w-fiber",
  "monport-gt-50w-fiber",
  "monport-gt-60w-fiber",
  "monport-gt-100w-fiber",
  "omtech-polar",
  "omtech-40w-co2",
  "acmer-p3",
  "laserpecker-5",
  "glowforge-aura",
  "glowforge-pro",
  "sculpfun-s10-10w",
  "atomstack-hurricane",
  "atomstack-p1",
  "acmer-s2-pro-48w",
  "laserpecker-lp3",
  "longer-nano-6w",
  "longer-nano-pro-12w",
  "creality-falcon-5w",
  "creality-falcon-10w",
  "gweike-cloud-50w",
  "gweike-cloud-55w",
  "laserpecker-lp1-plus",
  "laserpecker-lp2-classic",
  "acmer-p1-10w",
  "acmer-p1-20w",
  "acmer-p2-20w",
  "acmer-p2-33w",
  "ortur-h20-10w",
  "ortur-h20-20w",
  "ortur-h20-40w",
  "ortur-lm2-s2-10w",
  "ortur-lm2-s2-5w",
  "atomstack-x30-pro",
  "atomstack-a24-ultra",
  "atomstack-a24-pro-1064nm",
  "monport-gt-30w-fiber",
  "monport-reno45-pro-45w",
  "monport-ga-100w-fiber",
  "algolaser-delta-22w",
  "foxaliens-reizer-40w",
  "sculpfun-s30-pro-max-20w",
]);

/** Card thumbnail target (matches MachineCard aspect-[16/10]) */
const CARD_WIDTH = 1600;
const CARD_HEIGHT = 1000;
const CARD_BG = { r: 255, g: 255, b: 255 };

const UPSCALE_MIN_WIDTH = 900;
const UPSCALE_TARGET = 1200;
const UPSCALE_SLUGS = new Set(["xtool-d1-pro", "xtool-f1"]);

export function shopifyMaxUrl(url) {
  const clean = url.split("?")[0];
  if (!/(cdn\.shopify\.com|\.alicdn\.com|atomstackshop\.com|acmerlaser\.com)/i.test(clean)) {
    return clean;
  }
  if (clean.includes("cdn.shopify.com")) return `${clean}?width=2400`;
  return clean;
}

async function applyCardZoomOut(buffer, slug) {
  if (!CARD_ZOOM_OUT_SLUGS.has(slug)) return buffer;
  const meta = await sharp(buffer).metadata();
  const base = Math.max(meta.width ?? 0, meta.height ?? 0);
  const pad = Math.round(base * 0.18);
  if (pad < 8) return buffer;
  return sharp(buffer)
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: CARD_BG })
    .toBuffer();
}

export async function processHeroBytes(buffer, slug) {
  let image = sharp(buffer);
  let meta = await image.metadata();
  let width = meta.width ?? 0;
  let height = meta.height ?? 0;

  const region = HERO_CROP_REGION[slug];
  if (region && width >= 200 && height >= 400) {
    const left = Math.round(width * (region.left ?? 0));
    const top = Math.round(height * region.top);
    const cropWidth = Math.min(Math.round(width * (region.width ?? 1)), width - left);
    const cropHeight = Math.min(Math.round(height * region.height), height - top);
    buffer = await sharp(buffer)
      .extract({ left, top, width: cropWidth, height: cropHeight })
      .toBuffer();
    image = sharp(buffer);
    meta = await image.metadata();
    width = meta.width ?? 0;
    height = meta.height ?? 0;
  }

  if (UPSCALE_SLUGS.has(slug) && width > 0 && width < UPSCALE_MIN_WIDTH) {
    buffer = await sharp(buffer)
      .resize(UPSCALE_TARGET, UPSCALE_TARGET, { fit: "inside", withoutEnlargement: true })
      .sharpen({ sigma: 0.6 })
      .toBuffer();
  }

  return buffer;
}

async function trimBorders(buffer) {
  try {
    return await sharp(buffer).trim({ threshold: 14 }).toBuffer();
  } catch {
    return buffer;
  }
}

/**
 * Normalize hero for catalog cards: crop composites, trim, fit 16:10 on white.
 */
/** All catalog cards get breathing room unless the source is already a tight product PNG */
export const CARD_DEFAULT_ZOOM_OUT = true;

export async function processCardHero(buffer, slug) {
  let out = await processHeroBytes(buffer, slug);
  const skipTrim = DIRECT_HERO_SLUGS.has(slug) || CARD_DEFAULT_ZOOM_OUT;
  if (!skipTrim) {
    out = await trimBorders(out);
  }

  const meta = await sharp(out).metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;

  if (w > 0 && h > 0) {
    const ratio = w / h;
    const target = CARD_WIDTH / CARD_HEIGHT;
    if (ratio > target * 1.15) {
      const newW = Math.round(h * target);
      const left = Math.max(0, Math.round((w - newW) / 2));
      out = await sharp(out)
        .extract({ left, top: 0, width: Math.min(newW, w - left), height: h })
        .toBuffer();
    }
  }

  if (CARD_ZOOM_OUT_SLUGS.has(slug) || CARD_DEFAULT_ZOOM_OUT) {
    out = await applyCardZoomOut(out, slug);
  }

  out = await sharp(out)
    .resize(CARD_WIDTH, CARD_HEIGHT, {
      fit: "contain",
      background: CARD_BG,
    })
    .webp({ quality: 90, effort: 4 })
    .toBuffer();

  return out;
}
