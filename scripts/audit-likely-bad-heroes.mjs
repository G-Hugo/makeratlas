/**
 * Flag catalog primaries whose hero URL or local file looks wrong.
 * Run: node scripts/audit-likely-bad-heroes.mjs
 */

import fs from "fs";
import path from "path";
import { CARD_HERO_MANUAL } from "./card-hero-manual.mjs";
import { DIRECT_GALLERY } from "./manufacturer-sources.mjs";
import { scoreMachineImage } from "./pick-machine-product-image.mjs";

const meta = fs.readFileSync("scripts/apply-catalog-metadata.mjs", "utf8");
const primaries = [
  ...meta.match(/CATALOG_PRIMARY = new Set\(\[([\s\S]*?)\]\)/)[1].matchAll(/"([^"]+)"/g),
].map((m) => m[1]);

const SUSPICIOUS =
  /peijian|shuangshe|module|accessory|bundle|gift|promo|infographic|lifestyle|cut_|Ultra_Fast|1_1\.png|1_1\.jpg|jingxi|yijim|mandup|selling|collection-1600|GT30Bundle|reno-vision|Spintrack|Better-user|no-installation|motherboard|rotary|honeycomb|conveyor|streamline|All_In|Basic_Pack|Camera_Pack|LP2_PLUS_cut|4000mms|Stable_Setup|P3_48W|pack-list|gcode|detail\d|after-sales|6w_2c353|08_bec466|01-2_cca2|with_Air|official-refurb|hub\.jpg|_hub\.|colorfulengrave|cuttingcreality|NationalPet|mode.?switch|zhutuduibi|1600-1\.png|engraving-machine-4|Nano_6W_fe4b|6_e754695b|2_c5e9c2ad|co2_3f2c14ef|G6_\.\.|B4-20w|B6-Mopa|Omni-1|OMNI-X|g2-20w|5W_png|10W_png|Falcon_A1_png|pro_22W_png|S10_main|S9-Pro_main|A05_adbf|0_6660f40a|FC-105-_4|4_72f50e5e|GA100_5aec|1_4bf8e712|00_0ceb23be|chanpinye|danji|function_|peijian_/i;

const machinesDir = path.join(process.cwd(), "content", "machines");
const imagesRoot = path.join(process.cwd(), "public", "machines");

const rows = [];
for (const slug of primaries.sort()) {
  const m = JSON.parse(fs.readFileSync(path.join(machinesDir, `${slug}.json`), "utf8"));
  const manual = CARD_HERO_MANUAL[slug]?.[0] || "";
  const gallery0 = DIRECT_GALLERY[slug]?.[0] || "";
  const src = manual || gallery0 || m.image || "";
  const fname = src.split("/").pop()?.split("?")[0] || "";
  const score = scoreMachineImage(src, slug, "", { name: m.name, brand: m.brand });
  const heroPath = path.join(imagesRoot, slug, "01.webp");
  const bytes = fs.existsSync(heroPath) ? fs.statSync(heroPath).size : 0;
  const galleryDir = path.join(imagesRoot, slug);
  const galleryCount = fs.existsSync(galleryDir) ? fs.readdirSync(galleryDir).length : 0;
  const suspicious = SUSPICIOUS.test(fname) || SUSPICIOUS.test(src);
  const likelyBad = suspicious || score < 30 || (bytes > 0 && bytes < 15_000);
  if (likelyBad) {
    rows.push({ slug, score, suspicious, kb: Math.round(bytes / 1024), fname, galleryCount, hasManual: Boolean(manual) });
  }
}

console.log(`Likely bad: ${rows.length} / ${primaries.length}\n`);
for (const r of rows) {
  console.log(
    `${r.slug} score=${r.score} ${r.suspicious ? "SUSP" : ""} ${r.kb}kb gallery=${r.galleryCount} ${r.fname}`,
  );
}
