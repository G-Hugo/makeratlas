/**
 * @deprecated Use scripts/apply-catalog-metadata.mjs
 * Set catalogPrimary / catalogHidden for multi-power product lines.
 * Run: node scripts/apply-catalog-metadata.mjs
 */

import fs from "fs";
import path from "path";

const machinesDir = path.join(process.cwd(), "content", "machines");

const CATALOG_PRIMARY = new Set([
  "sculpfun-s30-ultra-22w",
  "ortur-laser-master-3-20w",
  "xtool-s1-20w",
]);

const CATALOG_HIDDEN = new Set([
  "xtool-s1",
  "sculpfun-s30-ultra",
  "ortur-laser-master-3",
]);

for (const file of fs.readdirSync(machinesDir).filter((f) => f.endsWith(".json"))) {
  const filePath = path.join(machinesDir, file);
  const m = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const slug = m.slug;

  if (CATALOG_PRIMARY.has(slug)) m.catalogPrimary = true;
  else delete m.catalogPrimary;

  if (CATALOG_HIDDEN.has(slug)) m.catalogHidden = true;
  else delete m.catalogHidden;

  fs.writeFileSync(filePath, `${JSON.stringify(m, null, 2)}\n`);
  if (CATALOG_PRIMARY.has(slug) || CATALOG_HIDDEN.has(slug)) {
    console.log(slug, CATALOG_PRIMARY.has(slug) ? "primary" : "", CATALOG_HIDDEN.has(slug) ? "hidden" : "");
  }
}

console.log("Catalog metadata updated.");
