/**
 * Heuristics to keep only real product photos of the machine — not accessories,
 * bundles, infographics, sample projects, or wrong variants.
 */

const BAD_ALT =
  /\b(camera|8mp|hd camera|autofocus|key features?|highlights?|precision|technology|graphic|smart.?fill|listing|user sweeps|debris|drawer|airflow|studio|suits|design on|engraving on|cutting on|cut.?out|sample project|lifestyle|scene|material stack|accessories?|accessory|bundle|includes?|package contents?|package list|warranty|gift box|free gift|national pet|comparison|specification|dimension|chart|infographic|feature|rotary|extension kit|module kit|air assist|honeycomb|fume|extractor|control board|motherboard|roller|chuck|enclosure|purifier|filter| rail| riser|conveyor|dog design|on wood|on acrylic|printed item|multi.?graphic|red stripe|text on|text highlighting|months warranty|gentle cloud ribbon|etching a|butterfly|design onto|onto metal|onto wood|onto surface|mode switching|packing list|collage|safety protection|magical colorful|thicker cutting|emits a|blue beam|faster than|monitoring systems|demonstrated on|ideal for|real-time preview|offline tf|tank chain|take-up|self-developed|compatible with lasergrbl|perfectly compatible|lasergrbl|lightburn\(|corexy|motion system|faster and more stable|outstanding engraving|visualization|break the limitations|pre-assembled|ready to use|get started|one step|helps you|others\b|versus|vs\.|benchmark|bar chart|world's highest|x-ray|cutting mode|engraving mode|48w high power|6w labels|super power diode|packaging technology|pine board cutting|acrylic sheet cutting|what's in the box|design easier|three laser|LU2-|firmware has optimized|grayscale engraving algorithm)\b/i;

const BAD_URL =
  /(listing|Frame\d|_AC_SL|controlboard|laserengravercutter|infographic|banner|lifestyle|accessory|bundle|warranty|compare|spec.?chart|A-\d+\.png|NationalPetDay|reno-.*-listing|lQDPK|wechat|qr.?code|gift.?box|ribbon|months.?warranty|All_In|Rotary|Conveyor|conveyor|streamline|Pack\.jpg|24W-0|mode.?switch|Motherboard|packing.?list|zhutuduibi|shuangshexiugai|20250416)/i;

const GOOD_ALT =
  /\b(laser engrav|engraving machine|laser cutter|co2 laser|diode laser|enclosed laser|desktop laser|machine|engraver cutter|main.?pic|product|white background|plain white|open-frame|metal frame|sideview|topview|shown in gray)\b/i;

/** Slugs where Shopify product mapping is unreliable — hero only from legacy file */
export const HERO_ONLY_SLUGS = new Set(["monport-55w-co2"]);

/** Per-slug extra rules */
export const GALLERY_RULES = {
  "creality-falcon2-pro": {
    altMustMatch: /22W|Enclosed Diode Laser Engraver.*white background/i,
    altMustNotMatch: /engraves|60W|40W and 22W|studio beside|user sweeps|debris|heart-shaped|offline tf|rotary engraving/i,
    maxImages: 2,
  },
  "creality-falcon2-12w": {
    altMustMatch: /white background|open-frame|metal frame|sideview|topview|shown in gray/i,
    altMustNotMatch: /etching|butterfly|engraves|accessories include|collage|safety protection|emits|blue beam|faster than|demonstrated|ideal for|colour laser|colorful/i,
    maxImages: 3,
  },
  "ortur-aufero-al1": {
    altMustMatch: /Aufero AL1/i,
    altMustNotMatch: /\bLM2\b|\bLM3\b|Laser Master [23]|LightBurn|LaserGRBL|Compatible|LU2-|firmware|Three Laser/i,
    maxImages: 1,
  },
  "ortur-laser-master-h10": {
    altMustMatch: /H10/i,
    altMustNotMatch: /pre-assembled|ready to use|get started|LightBurn|LaserGRBL|PID:/i,
    maxImages: 2,
  },
  "ortur-laser-master-3": {
    altMustMatch: /LM3|Laser Master 3/i,
    altMustNotMatch: /super power diode|packaging technology|pine board|acrylic sheet/i,
    maxImages: 3,
  },
  "atomstack-a40-pro": {
    altMustMatch: /A40 Pro/i,
    altMustNotMatch: /mode switching|wood cutting|tung wood|rotary focus|tank chain|shaft system|500mm|motherboard|packing list|air assist|compatible|lightburn|lasergrbl/i,
    maxImages: 3,
  },
  "acmer-p3": {
    maxImages: 1,
  },
  "sculpfun-s10-10w": { maxImages: 2 },
  "atomstack-hurricane": { maxImages: 2 },
  "atomstack-p1": { maxImages: 2 },
  "acmer-s2-pro-36w": { maxImages: 2 },
  "acmer-s2-pro-48w": { maxImages: 2 },
  "laserpecker-lp3": { maxImages: 2 },
  "longer-nano-6w": { maxImages: 2 },
  "longer-nano-pro-12w": { maxImages: 2 },
  "xtool-p2": { maxImages: 2 },
  "xtool-p2s": { maxImages: 2 },
};

/** Wrong model names appearing in alt text */
const WRONG_MODEL = {
  "ortur-aufero-al1": /\b(LM2|LM3|Laser Master 2|Laser Master 3|Master 2|Master 3)\b/i,
  "sculpfun-s9": /\b(S30|S6|iCube|Ultra)\b/i,
  "twotrees-tts-55": /\b(TS2|TS3|TTS-55 Pro|TTS-20)\b/i,
  "two-trees-ts2-20w": /\b(TTS-55|TTS-10)\b/i,
};

export function slugKeywords(slug, name, brand) {
  const parts = new Set(
    [
      ...slug.split("-"),
      ...name.toLowerCase().split(/\s+/),
      brand.toLowerCase(),
    ].filter((w) => w.length > 2),
  );
  return parts;
}

export function scoreRemoteImage({ alt, url, index }, slug, name, brand) {
  const rules = GALLERY_RULES[slug] || {};
  const maxDefault = HERO_ONLY_SLUGS.has(slug) ? 1 : rules.maxImages || 4;

  if (index >= maxDefault + 4) return -999;

  let score = 0;
  const altText = (alt || "").trim();
  const urlText = url || "";

  if (BAD_URL.test(urlText)) score -= 80;
  if (rules.urlMustNotMatch?.test(urlText)) score -= 100;
  if (BAD_ALT.test(altText)) score -= 100;

  if (altText) {
    if (GOOD_ALT.test(altText)) score += 35;
    const keys = slugKeywords(slug, name, brand);
    for (const k of keys) {
      if (altText.toLowerCase().includes(k)) score += 8;
    }
    if (rules.altMustMatch && !rules.altMustMatch.test(altText)) score -= 60;
    if (rules.altMustNotMatch?.test(altText)) score -= 80;
    if (WRONG_MODEL[slug]?.test(altText)) score -= 120;
  }

  if (index === 0) score += 25;
  if (index === 0 && altText && new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(altText)) {
    score += 40;
  }
  else if (!altText) score -= 40;
  else if (index === 1) score += 5;

  // Without alt, only trust first image
  if (!altText && index > 0) score -= 50;

  return score;
}

export function filterRemoteImages(images, slug, name, brand) {
  const rules = GALLERY_RULES[slug] || {};
  const limit = HERO_ONLY_SLUGS.has(slug) ? 1 : rules.maxImages || 4;

  const scored = images
    .map((img, index) => ({
      ...img,
      index,
      score: scoreRemoteImage({ alt: img.alt, url: img.src, index }, slug, name, brand),
    }))
    .filter((img) => {
      if (img.score < 20 && !(img.index === 0 && img.score >= 0 && !BAD_URL.test(img.src || ""))) {
        return false;
      }
      if (img.index > 0 && img.score < 22 && !rules.altMustMatch) return false;
      if (img.index > 0 && rules.altMustMatch && !rules.altMustMatch.test(img.alt || "")) return false;
      return true;
    })
    .sort((a, b) => a.index - b.index);

  const kept = [];
  for (const img of scored) {
    if (kept.length >= limit) break;
    kept.push(img);
  }

  return kept;
}

export function readImageSize(buffer) {
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let i = 2;
    while (i < buffer.length - 8) {
      if (buffer[i] !== 0xff) break;
      const marker = buffer[i + 1];
      const len = buffer.readUInt16BE(i + 2);
      if (marker === 0xc0 || marker === 0xc2) {
        return { width: buffer.readUInt16BE(i + 7), height: buffer.readUInt16BE(i + 5) };
      }
      i += 2 + len;
    }
  }
  if (buffer.toString("ascii", 1, 4) === "PNG") {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  if (buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") {
    if (buffer.toString("ascii", 12, 16) === "VP8X") {
      return {
        width: 1 + buffer.readUIntLE(24, 3),
        height: 1 + buffer.readUIntLE(27, 3),
      };
    }
  }
  return null;
}

/** Reject downloaded bytes that look like banners / infographics */
export function validateImageBytes(buffer, ext, index, alt = "", options = {}) {
  const size = buffer.length;
  if (size < 3000) return false;

  // Large PNGs after the first image are usually feature collages
  if (ext === "png" && index > 0 && size > 550_000) return false;

  const machineAlt = /\b(machine|engraver|engraving machine|laser engrav)\b/i.test(alt);
  if (index > 0 && (ext === "webp" || ext === "png") && size > (machineAlt ? 520_000 : 400_000)) {
    return false;
  }
  if (index > 0 && ext === "jpg" && size > 550_000 && BAD_ALT.test(alt)) return false;

  const dims = readImageSize(buffer);
  if (dims) {
    const ratio = dims.width / dims.height;
    const maxRatio = options.allowWideHero ? 5 : index > 0 ? 3 : 2.2;
    const minRatio = options.allowWideHero ? 0.2 : index > 0 ? 0.28 : 0.35;
    if (ratio > maxRatio || ratio < minRatio) return false;
    if (dims.width < (index > 0 ? 160 : 200) || dims.height < (index > 0 ? 160 : 200)) {
      return false;
    }
  }

  return true;
}
