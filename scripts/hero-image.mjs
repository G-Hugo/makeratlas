/**
 * High-res Shopify URLs + optional top-crop for catalog composites.
 */

import sharp from "sharp";
import { CURATED_RAW_HERO } from "./manufacturer-sources.mjs";

/**
 * Slug → extract region (fractions of source height).
 * Used when the catalog "hero" is a vertical composite (machine top, promos bottom).
 */
export const HERO_CROP_REGION = {
  "wecreat-vision": { top: 0, left: 0, width: 1, height: 0.7 },
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
  "acmer-p3",
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
  "xtool-s1",
  "xtool-s1-10w",
  "xtool-s1-20w",
  "xtool-s1-40w",
  "xtool-d1-pro",
  "xtool-d1-pro-5w",
  "xtool-d1-pro-10w",
  "xtool-d1-pro-20w",
  "xtool-m1-ultra",
  "ortur-laser-master-h10",
  "ortur-laser-master-h10-10w",
  "ortur-laser-master-h10-20w",
  "ortur-laser-master-h10-40w",
  "longer-laser-b1",
  "longer-laser-b1-20w",
  "longer-laser-b1-30w",
  "longer-laser-b1-40w",
  "longer-ray5",
  "longer-ray5-40w",
  "longer-nano-duo-ai",
  "ortur-h20",
  "acmer-p1",
  "laserpecker-4",
  "laserpecker-lp2-plus-10w",
  "atomstack-a40-pro",
  "atomstack-a40-pro-20w",
  "atomstack-a40-pro-40w",
  "foxaliens-le-4040-pro-20w",
]);

/** Card thumbnail target (matches MachineCard aspect-[16/10]) */
const CARD_WIDTH = 1600;
const CARD_HEIGHT = 1000;
const CARD_BG = { r: 255, g: 255, b: 255 };

const UPSCALE_MIN_WIDTH = 900;
const UPSCALE_TARGET = 1200;
const UPSCALE_SLUGS = new Set(["xtool-d1-pro", "xtool-f1"]);

/** Extra white margin around the machine (fraction of max side). Default 0.18. */
const CARD_ZOOM_OUT_RATIO = {
  "acmer-p3": 0,
};

/** Shrink machine inside frame before card fit (catalog cards only). */
const CARD_MACHINE_SCALE = {
  "acmer-p3": 0.7,
};

/** Output frame — match MachineCard aspect when it differs from 16:10. */
const CARD_FRAME = {
  "acmer-p3": { width: 1200, height: 900 },
};

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
  const padRatio = CARD_ZOOM_OUT_RATIO[slug] ?? 0.18;
  const pad = Math.round(base * padRatio);
  if (pad < 8) return buffer;
  return sharp(buffer)
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: CARD_BG })
    .toBuffer();
}

async function shrinkMachineOnCanvas(buffer, scale) {
  const meta = await sharp(buffer).metadata();
  const w = meta.width ?? 1;
  const h = meta.height ?? 1;
  const nw = Math.max(1, Math.round(w * scale));
  const nh = Math.max(1, Math.round(h * scale));
  const shrunk = await sharp(buffer).resize(nw, nh, { fit: "inside" }).png().toBuffer();
  return sharp({
    create: {
      width: w,
      height: h,
      channels: 3,
      background: CARD_BG,
    },
  })
    .composite([{ input: shrunk, gravity: "center" }])
    .png()
    .toBuffer();
}

function cardFrame(slug) {
  return CARD_FRAME[slug] ?? { width: CARD_WIDTH, height: CARD_HEIGHT };
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
/** Composite / promo heroes need extra margin; product-on-white shots do not. */
export const CARD_DEFAULT_ZOOM_OUT = true;

function shouldZoomOutCard(slug, { manualHero = false } = {}) {
  if (CARD_ZOOM_OUT_SLUGS.has(slug)) return true;
  if (manualHero || DIRECT_HERO_SLUGS.has(slug)) return false;
  return CARD_DEFAULT_ZOOM_OUT;
}

export async function processCardHero(buffer, slug, options = {}) {
  const { manualHero = false } = options;
  let out = await processHeroBytes(buffer, slug);
  const skipTrim = DIRECT_HERO_SLUGS.has(slug) || manualHero || CARD_DEFAULT_ZOOM_OUT;
  if (!skipTrim) {
    out = await trimBorders(out);
  }

  const meta = await sharp(out).metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;

  if (w > 0 && h > 0 && !manualHero && !DIRECT_HERO_SLUGS.has(slug)) {
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

  if (shouldZoomOutCard(slug, { manualHero })) {
    out = await applyCardZoomOut(out, slug);
  }

  out = await sharp(out)
    .resize(CARD_WIDTH, CARD_HEIGHT, {
      fit: "contain",
      background: CARD_BG,
    })
    .webp({ quality: 92, effort: 4 })
    .toBuffer();

  return out;
}

/** Gallery slots 02+ — compress large OEM PNGs so validation passes. */
export async function compressGallerySlot(buffer) {
  return sharp(buffer)
    .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 88, effort: 4 })
    .toBuffer();
}
export async function processManualCardHero(buffer, slug) {
  if (CURATED_RAW_HERO.has(slug)) {
    const meta = await sharp(buffer).metadata();
    if (meta.format === "webp") return buffer;
    return sharp(buffer).webp({ quality: 93, effort: 4 }).toBuffer();
  }

  let out = await processHeroBytes(buffer, slug);
  const meta = await sharp(out).metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  const maxDim = Math.max(w, h);

  if (maxDim > 2000) {
    out = await sharp(out)
      .resize(2000, 2000, { fit: "inside", withoutEnlargement: true })
      .toBuffer();
  }

  if (shouldZoomOutCard(slug, { manualHero: true })) {
    const machineScale = CARD_MACHINE_SCALE[slug];
    if (machineScale && machineScale < 1) {
      out = await shrinkMachineOnCanvas(out, machineScale);
    }
    out = await applyCardZoomOut(out, slug);
    const frame = cardFrame(slug);
    out = await sharp(out)
      .resize(frame.width, frame.height, {
        fit: "contain",
        background: CARD_BG,
      })
      .toBuffer();
  }

  return sharp(out).webp({ quality: 93, effort: 4 }).toBuffer();
}
