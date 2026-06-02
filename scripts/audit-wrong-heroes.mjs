/**
 * Find published machines whose hero likely isn't the laser unit.
 * node scripts/audit-wrong-heroes.mjs
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { DIRECT_GALLERY } from "./manufacturer-sources.mjs";

const machinesDir = path.join(process.cwd(), "content", "machines");

const BAD_SOURCE =
  /(?:^|[^a-z])bundle(?:[^a-z]|$)|gift|promo|comparison|infographic|accessory|motherboard|tube|lens|belt|filter|hub\.jpg|selling_points|collection-1600|all-series|nationalpet|(?:^|[^a-z])6w_|GT_Fiber|reno-vision-bundle|laser.?tube|power.?supply|fume|extractor|rotary|honeycomb|packing|specification|chart|banner|lifestyle|sample|engraving.?on|cutting.?on|vs\.|benchmark|controlboard|listing|Frame\d|_AC_SL|colorfulengrave|cuttingcreality|NationalPetDay|gift.?box|All_In|Conveyor|streamline|Pack\.jpg|mode.?switch|zhutuduibi|air_assist|gcode|detail-|Detail\d|after-sales|replacement|refurb|Basic_Pack|Camera_Pack/i;

function slugTokens(slug, name, brand) {
  const stop = new Set([
    "laser", "engraver", "cutter", "machine", "series", "pro", "plus", "ultra", "max",
    "smart", "desktop", "portable", "diode", "fiber", "co2", "the", "and", "for",
  ]);
  const parts = new Set(
    [
      ...slug.split("-"),
      ...name.toLowerCase().split(/\s+/),
      brand.toLowerCase(),
    ].filter((w) => w.length > 2 && !stop.has(w)),
  );
  return parts;
}

function sourceMatchesSlug(slug, name, brand, srcUrl) {
  if (!srcUrl) return true;
  const lower = srcUrl.toLowerCase();
  const tokens = slugTokens(slug, name, brand);
  let hits = 0;
  for (const t of tokens) {
    if (lower.includes(t)) hits += 1;
  }
  return hits >= 1 || /engraver|machine|laser|co2|fiber|sideview|topview|basic|_basic|main-pic|product/i.test(lower);
}

const flagged = [];
const byHash = new Map();

for (const f of fs.readdirSync(machinesDir).filter((x) => x.endsWith(".json"))) {
  const m = JSON.parse(fs.readFileSync(path.join(machinesDir, f), "utf8"));
  if (m.status !== "published") continue;

  const slug = m.slug;
  const img = m.image || "";
  const rel = img.replace(/^\//, "");
  const disk = path.join(process.cwd(), "public", rel);
  const reasons = [];

  const gallerySrc = DIRECT_GALLERY[slug]?.[0] || "";
  if (BAD_SOURCE.test(gallerySrc)) reasons.push("bad-oem-url");
  if (!sourceMatchesSlug(slug, m.name, m.brand, gallerySrc)) reasons.push("url-no-slug-match");

  if (!fs.existsSync(disk)) {
    reasons.push("missing-file");
  } else {
    const buf = fs.readFileSync(disk);
    const hash = crypto.createHash("md5").update(buf).digest("hex").slice(0, 8);
    if (!byHash.has(hash)) byHash.set(hash, []);
    byHash.get(hash).push({ slug, brand: m.brand });

    if (buf.length < 18_000) reasons.push(`small-${Math.round(buf.length / 1024)}kb`);
  }

  if (m.catalogPrimary && reasons.length) reasons.push("PRIMARY");

  if (reasons.length) {
    flagged.push({ slug, name: m.name, brand: m.brand, reasons, img, gallerySrc: gallerySrc.split("/").pop() });
  }
}

console.log(`Flagged: ${flagged.length} / published\n`);
for (const r of flagged.sort((a, b) => a.slug.localeCompare(b.slug))) {
  console.log(`${r.slug} [${r.reasons.join(", ")}]`);
  console.log(`  ${r.name} (${r.brand})`);
  if (r.gallerySrc) console.log(`  oem: ${r.gallerySrc}`);
}

console.log("\n--- Same image, different brands (likely wrong reuse) ---");
for (const [hash, entries] of byHash) {
  const brands = new Set(entries.map((e) => e.brand));
  if (entries.length > 1 && brands.size > 1) {
    console.log(hash, entries.map((e) => e.slug).join(", "));
  }
}

console.log("\n--- Same image, 3+ unrelated slugs ---");
for (const [hash, entries] of byHash) {
  if (entries.length >= 3) {
    const lines = new Set(entries.map((e) => e.slug.replace(/-\d+w$/, "").replace(/-(10|20|40|5)w$/, "")));
    if (lines.size >= 3) console.log(hash, entries.map((e) => e.slug).join(", "));
  }
}
