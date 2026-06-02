/**
 * Find catalog-primary machines whose hero URL looks like promo/bundle/accessory.
 * Run: node scripts/audit-bad-card-heroes.mjs
 */

import fs from "fs";
import { DIRECT_GALLERY } from "./manufacturer-sources.mjs";
import { CARD_HERO_MANUAL } from "./card-hero-manual.mjs";

const meta = fs.readFileSync("scripts/apply-catalog-metadata.mjs", "utf8");
const primaries = [
  ...meta.match(/CATALOG_PRIMARY = new Set\(\[([\s\S]*?)\]\)/)[1].matchAll(/"([^"]+)"/g),
].map((m) => m[1]);

const BAD =
  /bundle|gift|promo|comparison|infographic|accessory|module|glasses|goggles|lifestyle|cut_6mm|Better-user|no-installation|steps|Spintrack|national|christmas|valentine|selling|banner|vs\.|All_In|Basic_Pack|Camera_Pack|reno-vision|GT30Bundle|motherboard|rotary|honeycomb|air_assist|conveyor|streamline|colorfulengrave|cuttingcreality|gift.?box|mode.?switch|NationalPet|collection-1600|LP2_PLUS_cut|LP2_plus_4000|Ultra_Fast_Infrared|4000mms|sideview.*promo|engraving-machine-4|Stable_Setup|P3_48W|GT30Bundle|pack-list|package-list/i;

const bad = [];
for (const slug of primaries.sort()) {
  const manual = CARD_HERO_MANUAL[slug]?.[0] || "";
  const gallery = DIRECT_GALLERY[slug]?.[0] || "";
  const src = manual || gallery;
  const srcName = src.split("/").pop()?.split("?")[0] || "";
  if (!src) {
    bad.push({ slug, reason: "no-source", src: "" });
    continue;
  }
  if (BAD.test(src) || BAD.test(srcName)) {
    bad.push({
      slug,
      reason: manual ? "bad-manual" : "bad-gallery-first",
      src: srcName,
      full: src,
    });
  }
}

console.log(`Bad catalog primaries: ${bad.length} / ${primaries.length}\n`);
for (const b of bad) {
  console.log(`${b.slug} [${b.reason}] ${b.src}`);
  if (b.full) console.log(`  ${b.full}`);
}
