/**
 * Re-process existing 01.* hero files for catalog cards (16:10, trimmed).
 * Run: node scripts/refresh-card-heroes.mjs
 */

import fs from "fs";
import path from "path";
import { processCardHero } from "./hero-image.mjs";
import { applyHeroSync } from "./lib/machine-hero-sync.mjs";

const machinesDir = path.join(process.cwd(), "content", "machines");
const imagesRoot = path.join(process.cwd(), "public", "machines");

for (const file of fs.readdirSync(machinesDir).filter((f) => f.endsWith(".json"))) {
  const machine = JSON.parse(fs.readFileSync(path.join(machinesDir, file), "utf-8"));
  if (machine.status !== "published") continue;

  const slug = machine.slug;
  const dir = path.join(imagesRoot, slug);
  if (!fs.existsSync(dir)) continue;

  const heroFile = fs
    .readdirSync(dir)
    .find((f) => /^01\.(jpg|jpeg|png|webp)$/i.test(f));
  if (!heroFile) continue;

  const heroPath = path.join(dir, heroFile);
  try {
    const raw = fs.readFileSync(heroPath);
    const processed = await processCardHero(raw, slug);
    const outName = "01.webp";
    fs.writeFileSync(path.join(dir, outName), processed);
    if (heroFile !== outName) fs.unlinkSync(heroPath);

    machine.image = `/machines/${slug}/${outName}`;
    applyHeroSync(machine);
    fs.writeFileSync(
      path.join(machinesDir, file),
      `${JSON.stringify(machine, null, 2)}\n`,
    );
    console.log(`✓ ${slug}`);
  } catch (e) {
    console.log(`✗ ${slug}: ${e.message}`);
  }
}
