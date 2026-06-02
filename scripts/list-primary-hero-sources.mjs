/**
 * List first DIRECT_GALLERY URL for each catalog primary (for manual review).
 */
import fs from "fs";
import { DIRECT_GALLERY } from "./manufacturer-sources.mjs";
import { CARD_HERO_MANUAL } from "./card-hero-manual.mjs";

const meta = fs.readFileSync("scripts/apply-catalog-metadata.mjs", "utf8");
const primaries = [
  ...meta.match(/CATALOG_PRIMARY = new Set\(\[([\s\S]*?)\]\)/)[1].matchAll(/"([^"]+)"/g),
].map((m) => m[1]);

for (const slug of primaries.sort()) {
  const manual = CARD_HERO_MANUAL[slug]?.[0];
  const g0 = DIRECT_GALLERY[slug]?.[0];
  const g1 = DIRECT_GALLERY[slug]?.[1];
  const used = manual ? "MANUAL" : g0 ? "GALLERY" : "NONE";
  const src = (manual || g0 || "").split("/").pop()?.split("?")[0];
  console.log(`${slug}\t${used}\t${src || "-"}`);
  if (!manual && g1) console.log(`  alt: ${g1.split("/").pop()?.split("?")[0]}`);
}
