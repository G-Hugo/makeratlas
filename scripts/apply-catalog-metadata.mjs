/**
 * Apply catalogPrimary / catalogHidden across the catalog.
 * Run after migrate-all-power-variants.mjs
 */

import fs from "fs";
import path from "path";

const machinesDir = path.join(process.cwd(), "content", "machines");

const CATALOG_PRIMARY = new Set([
  "sculpfun-s30-ultra-22w",
  "ortur-laser-master-3-20w",
  "xtool-s1-20w",
  "longer-ray5-40w",
  "longer-laser-b1-40w",
  "algolaser-alpha-mk2-40w",
  "sculpfun-s9-10w",
  "sculpfun-icube-pro-5w",
  "ortur-laser-master-h10-20w",
  "two-trees-tts-55-pro-20w",
  "two-trees-ts2-20w",
  "atomstack-a40-pro-40w",
  "creality-falcon2-22w",
  "creality-falcon2-pro-40w",
  "gweike-g2-20w",
  "gweike-g6-split-30w",
  "monport-gt-30w-fiber",
  "commarker-b4-20w",
  "commarker-b6-mopa-30w",
  "commarker-omni-1-uv",
  "commarker-omni-x-uv",
  "laserpecker-5",
  "ortur-h20-20w",
  "sculpfun-s10-10w",
  "atomstack-hurricane",
  "atomstack-p1",
  "creality-falcon-a1-10w",
  "creality-falcon-a1-pro-20w",
  "acmer-p1-10w",
  "acmer-p2-33w",
  "acmer-s1-6w",
  "acmer-s2-pro-48w",
  "laserpecker-lp3",
  "longer-nano-pro-12w",
  "longer-nano-6w",
  "sculpfun-s30-pro-max-20w",
  "sculpfun-s30-pro-10w",
  "atomstack-a20-pro-v2",
  "atomstack-a24-pro",
  "atomstack-a24-ultra",
  "atomstack-x30-pro",
  "creality-falcon-10w",
  "longer-nano-duo-ai",
  "laserpecker-lp2-plus-10w",
  "algolaser-delta-22w",
  "foxaliens-reizer-40w",
  "foxaliens-le-4040-pro-20w",
  "omtech-fc-105sa",
  "omtech-fc-44-intelli",
  "monport-reno45-pro-45w",
  "monport-ga-100w-fiber",
  "gweike-cloud-55w",
  "twotrees-tts-20-pro-20w",
  "atomstack-a20-pro-1064nm",
  "creality-falcon-5w",
  "atomstack-a24-pro-1064nm",
  "omtech-fc-510-intelli",
  "omtech-fc-105sat",
  "gweike-cloud-50w",
  "algolaser-diy-kit-mk2-10w",
  "xtool-m2",
  "xtool-f2",
  "creality-falcon-t1",
  "sculpfun-s40-max-48w",
  "sculpfun-s70-max-70w",
  "atomstack-a70-max",
  "sculpfun-s10-10w",
  "xtool-p3",
  "xtool-p2s",
]);

const CATALOG_HIDDEN = new Set([
  "xtool-s1",
  "sculpfun-s30-ultra",
  "ortur-laser-master-3",
  "longer-ray5",
  "longer-laser-b1",
  "algolaser-alpha-mk2",
  "sculpfun-s9",
  "sculpfun-icube-pro",
  "ortur-laser-master-h10",
  "twotrees-tts-55",
  "atomstack-a40-pro",
  "xtool-d1-pro",
  "atomstack-a5-pro",
  "comgrow-z1",
  "creality-falcon2-pro",
  "two-trees-tts-55-pro",
  "ortur-h20",
  "acmer-p1",
  "acmer-p2",
  "sculpfun-s30-pro-max",
  "ortur-laser-master-2-s2",
  "algolaser-diy-kit-mk2",
  "algolaser-diy-kit-mini",
  "sculpfun-s30-pro",
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
}

console.log("Catalog metadata:", CATALOG_PRIMARY.size, "primary,", CATALOG_HIDDEN.size, "hidden umbrellas");
