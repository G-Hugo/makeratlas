/**
 * Replace gallery extras that were copied from another brand with hero crops.
 * node scripts/fix-cross-brand-gallery-copies.mjs
 */

import fs from "fs";
import path from "path";
import sharp from "sharp";
import { applyHeroSync } from "./lib/machine-hero-sync.mjs";
import { processCardHero } from "./hero-image.mjs";

const machinesDir = path.join(process.cwd(), "content", "machines");
const imagesRoot = path.join(process.cwd(), "public", "machines");
const MIN = 3;
const MAX = 4;

async function cropExtras(machine) {
  const slug = machine.slug;
  const heroRel = machine.images?.[0]?.src;
  if (!heroRel) return false;

  const heroPath = path.join(process.cwd(), "public", heroRel.replace(/^\//, ""));
  if (!fs.existsSync(heroPath)) return false;

  const dir = path.join(imagesRoot, slug);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  for (const f of fs.readdirSync(dir)) {
    if (!/^0[2-9]\./i.test(f)) continue;
    fs.unlinkSync(path.join(dir, f));
  }

  const buf = fs.readFileSync(heroPath);
  const meta = await sharp(buf).metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  if (w < 300) return false;

  const gallery = [{ ...machine.images[0] }];
  const crops = [
    { left: 0, top: 0, width: w, height: Math.min(h, Math.round(h * 0.72)) },
    {
      left: Math.round(w * 0.06),
      top: Math.round(h * 0.05),
      width: Math.round(w * 0.88),
      height: Math.round(h * 0.88),
    },
    {
      left: Math.max(0, Math.round(w * 0.12)),
      top: 0,
      width: Math.min(w, Math.round(w * 0.76)),
      height: h,
    },
  ];

  for (const region of crops) {
    if (gallery.length >= MIN) break;
    try {
      const cropped = await sharp(buf).extract(region).webp({ quality: 88 }).toBuffer();
      let processed = cropped;
      try {
        processed = await processCardHero(cropped, slug);
      } catch {
        /* keep raw crop */
      }
      const num = String(gallery.length + 1).padStart(2, "0");
      const destRel = `/machines/${slug}/${num}.webp`;
      fs.writeFileSync(path.join(dir, `${num}.webp`), processed);
      gallery.push({
        src: destRel,
        alt: `${machine.name} laser engraver — ${machine.brand}`,
      });
    } catch (err) {
      console.log("  crop skip", slug, err.message);
    }
  }

  if (gallery.length < MIN) return false;

  machine.images = gallery.slice(0, MAX);
  machine.image = heroRel;
  applyHeroSync(machine);
  return true;
}

const slugs = [
  "atezr-p2",
  "comgrow-z1",
  "comgrow-z1-5w",
  "comgrow-z1-10w",
  "comgrow-z1-20w",
  "monport-40w-co2",
  "monport-55w-co2",
  "monport-ga-100w-fiber",
  "monport-reno45-pro-45w",
];

for (const slug of slugs) {
  const fp = path.join(machinesDir, `${slug}.json`);
  if (!fs.existsSync(fp)) continue;
  const m = JSON.parse(fs.readFileSync(fp, "utf8"));
  if (await cropExtras(m)) {
    fs.writeFileSync(fp, `${JSON.stringify(m, null, 2)}\n`);
    console.log(`✓ ${slug} (${m.images.length} crops from hero)`);
  } else {
    console.log(`✗ ${slug}`);
  }
}
