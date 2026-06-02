/**
 * Copy gallery from primary variant to hidden umbrella profiles.
 * Card and detail page on umbrella URLs share the same 01.webp as the tier.
 * Run: node scripts/sync-umbrella-card-images.mjs
 */

import fs from "fs";
import path from "path";
import { applyHeroSync } from "./lib/machine-hero-sync.mjs";

const machinesDir = path.join(process.cwd(), "content", "machines");
const imagesRoot = path.join(process.cwd(), "public", "machines");

const PAIRS = [
  ["acmer-p1", "acmer-p1-10w"],
  ["acmer-p2", "acmer-p2-33w"],
  ["ortur-h20", "ortur-h20-10w"],
  ["algolaser-diy-kit-mk2", "algolaser-diy-kit-mk2-10w"],
  ["sculpfun-s30-pro", "sculpfun-s30-pro-10w"],
  ["ortur-laser-master-2-s2", "ortur-lm2-s2-10w"],
  ["xtool-s1", "xtool-s1-20w"],
  ["atomstack-a40-pro", "atomstack-a40-pro-40w"],
];

function copyGalleryFiles(sourceSlug, targetSlug) {
  const srcDir = path.join(imagesRoot, sourceSlug);
  const dstDir = path.join(imagesRoot, targetSlug);
  if (!fs.existsSync(srcDir)) return false;

  fs.mkdirSync(dstDir, { recursive: true });
  for (const file of fs.readdirSync(dstDir)) {
    fs.unlinkSync(path.join(dstDir, file));
  }

  const copied = [];
  for (const file of fs.readdirSync(srcDir).sort()) {
    if (!/^\d{2}\.(webp|jpg|jpeg|png)$/i.test(file)) continue;
    fs.copyFileSync(path.join(srcDir, file), path.join(dstDir, file));
    copied.push(file);
  }
  return copied.length > 0;
}

for (const [umbrella, source] of PAIRS) {
  const jsonPath = path.join(machinesDir, `${umbrella}.json`);
  const sourcePath = path.join(machinesDir, `${source}.json`);

  if (!fs.existsSync(jsonPath) || !fs.existsSync(sourcePath)) {
    console.log(`= ${umbrella}: skip (missing json)`);
    continue;
  }

  if (!copyGalleryFiles(source, umbrella)) {
    console.log(`= ${umbrella}: skip (no source gallery)`);
    continue;
  }

  const sourceMachine = JSON.parse(fs.readFileSync(sourcePath, "utf-8"));
  const umbrellaMachine = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  const gallery = (sourceMachine.images || []).map((photo) => ({
    ...photo,
    src: photo.src.replace(`/machines/${source}/`, `/machines/${umbrella}/`),
  }));

  if (!gallery.length) {
    gallery.push({
      src: `/machines/${umbrella}/01.webp`,
      alt: `${umbrellaMachine.name} laser engraver — ${umbrellaMachine.brand}`,
    });
  }

  umbrellaMachine.images = gallery;
  umbrellaMachine.image = gallery[0].src;
  applyHeroSync(umbrellaMachine);

  fs.writeFileSync(jsonPath, `${JSON.stringify(umbrellaMachine, null, 2)}\n`);
  console.log(`✓ ${umbrella} ← ${source} (${gallery.length} photo(s))`);
}
