/**
 * When a power variant only has 1 OEM photo, copy extra angles from the
 * richest sibling on the same modelLine (same machine body).
 *
 * node scripts/copy-sibling-gallery-extras.mjs
 */

import fs from "fs";
import path from "path";
import { applyHeroSync } from "./lib/machine-hero-sync.mjs";

const machinesDir = path.join(process.cwd(), "content", "machines");
const imagesRoot = path.join(process.cwd(), "public", "machines");
const MAX = 4;

const published = fs
  .readdirSync(machinesDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(machinesDir, f), "utf8")))
  .filter((m) => m.status === "published");

const byLine = new Map();
for (const m of published) {
  const line = m.modelLine;
  if (!line) continue;
  if (!byLine.has(line)) byLine.set(line, []);
  byLine.get(line).push(m);
}

let copied = 0;

for (const machine of published) {
  const n = machine.images?.length || 0;
  if (n >= 2) continue;

  const line = machine.modelLine;
  if (!line) continue;

  const siblings = byLine
    .get(line)
    ?.filter((s) => s.slug !== machine.slug && (s.images?.length || 0) >= 2)
    .sort((a, b) => (b.images?.length || 0) - (a.images?.length || 0));

  const donor = siblings?.[0];
  if (!donor) continue;

  const slug = machine.slug;
  const donorDir = path.join(imagesRoot, donor.slug);
  const destDir = path.join(imagesRoot, slug);
  if (!fs.existsSync(donorDir)) continue;

  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  const gallery = [...(machine.images || [])];
  const heroSrc = gallery[0]?.src;

  for (let i = 1; i < MAX; i++) {
    const donorPhoto = donor.images[i];
    if (!donorPhoto?.src) break;

    const donorRel = donorPhoto.src.replace(/^\//, "");
    const donorPath = path.join(process.cwd(), "public", donorRel);
    if (!fs.existsSync(donorPath)) continue;

    const num = String(gallery.length + 1).padStart(2, "0");
    const ext = path.extname(donorPath).slice(1) || "webp";
    const destRel = `/machines/${slug}/${num}.${ext}`;
    const destPath = path.join(process.cwd(), "public", destRel.replace(/^\//, ""));

    fs.copyFileSync(donorPath, destPath);
    gallery.push({
      src: destRel,
      alt: `${machine.name} laser engraver — ${machine.brand}`,
    });
  }

  if (gallery.length <= n) continue;

  machine.images = gallery;
  machine.image = heroSrc || gallery[0].src;
  applyHeroSync(machine);
  fs.writeFileSync(
    path.join(machinesDir, `${slug}.json`),
    `${JSON.stringify(machine, null, 2)}\n`,
  );
  console.log(`✓ ${slug} ← ${donor.slug} (+${gallery.length - n} photo(s))`);
  copied += 1;
}

console.log(`\nCopied extras for ${copied} variant(s).`);
