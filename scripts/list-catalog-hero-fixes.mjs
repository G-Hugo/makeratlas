/**
 * List catalog-primary machines that need a better card hero (machine-only).
 * Run: node scripts/list-catalog-hero-fixes.mjs
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

const BAD_NAME =
  /GT30Bundle|reno-vision-bundle|1600-1\.png|08_bec466d5|01-2_cca2c928|1_1\.png|jingxiqiege|yijimandupendiao|peijian_|selling_points|collection-1600|Better-user|cut_6mm|Spintrack|Ultra_Fast_Infrared|6w_2c353289/i;

const machinesDir = path.join(process.cwd(), "content", "machines");
const imagesRoot = path.join(process.cwd(), "public", "machines");

const needFix = [];
const ok = [];

for (const slug of primaries.sort()) {
  const m = JSON.parse(fs.readFileSync(path.join(machinesDir, `${slug}.json`), "utf8"));
  const src = CARD_HERO_MANUAL[slug]?.[0] || DIRECT_GALLERY[slug]?.[0] || m.image || "";
  const ctx = { name: m.name, brand: m.brand };
  const score = scoreMachineImage(src, slug, "", ctx);
  const heroPath = path.join(imagesRoot, slug, "01.webp");
  const bytes = fs.existsSync(heroPath) ? fs.statSync(heroPath).size : 0;
  const badName = BAD_NAME.test(src);
  const tiny = bytes > 0 && bytes < 15_000;

  if (score < 45 || badName || tiny) {
    needFix.push({
      slug,
      score,
      badName,
      tiny,
      kb: bytes ? Math.round(bytes / 1024) : 0,
      src: src.split("/").pop()?.split("?")[0] || "",
    });
  } else {
    ok.push(slug);
  }
}

console.log(`Need fix: ${needFix.length} / ${primaries.length}\n`);
for (const r of needFix) {
  const flags = [
    r.score < 45 ? `score=${r.score}` : null,
    r.badName ? "bad-name" : null,
    r.tiny ? `tiny-${r.kb}kb` : null,
  ]
    .filter(Boolean)
    .join(", ");
  console.log(`${r.slug} [${flags}] ${r.src}`);
}

console.log(`\nOK (${ok.length}): not touching these.`);
