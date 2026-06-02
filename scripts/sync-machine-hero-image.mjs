/**
 * Ensure machine.image === images[0].src for every published machine.
 * Run: node scripts/sync-machine-hero-image.mjs
 */

import fs from "fs";
import path from "path";
import { applyHeroSync } from "./lib/machine-hero-sync.mjs";

const machinesDir = path.join(process.cwd(), "content", "machines");
const imagesRoot = path.join(process.cwd(), "public", "machines");

let fixed = 0;

for (const file of fs.readdirSync(machinesDir).filter((f) => f.endsWith(".json"))) {
  const filePath = path.join(machinesDir, file);
  const m = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  if (m.status !== "published") continue;

  const slug = m.slug;
  const dir = path.join(imagesRoot, slug);
  const heroOnDisk = fs.existsSync(dir)
    ? fs.readdirSync(dir).find((f) => /^01\.(webp|jpg|jpeg|png)$/i.test(f))
    : null;
  const diskSrc = heroOnDisk ? `/machines/${slug}/${heroOnDisk}` : null;

  if (diskSrc && m.image !== diskSrc) m.image = diskSrc;

  const before = JSON.stringify({ image: m.image, first: m.images?.[0]?.src });
  applyHeroSync(m);
  const after = JSON.stringify({ image: m.image, first: m.images?.[0]?.src });

  if (before !== after) {
    fs.writeFileSync(filePath, `${JSON.stringify(m, null, 2)}\n`);
    console.log(`✓ ${slug} → ${m.image}`);
    fixed += 1;
  }
}

console.log(`\nDone. ${fixed} profile(s) synced.`);
