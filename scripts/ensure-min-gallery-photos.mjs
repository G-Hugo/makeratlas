/**
 * Every published laser must have at least MIN_GALLERY photos.
 * 1) Copy from modelLine / brand donors
 * 2) Relaxed OEM URLs in DIRECT_GALLERY + re-download
 * 3) Extra crops from hero when OEM has no other angles
 *
 * node scripts/ensure-min-gallery-photos.mjs
 */

import fs from "fs";
import path from "path";
import https from "https";
import sharp from "sharp";
import { execSync } from "child_process";
import { CARD_HERO_MANUAL } from "./card-hero-manual.mjs";
import { DIRECT_GALLERY, STORES } from "./manufacturer-sources.mjs";
import { applyHeroSync } from "./lib/machine-hero-sync.mjs";
import { buildMachineGalleryUrls, scoreMachineImage } from "./pick-machine-product-image.mjs";
import { resolveProductHandleEntry } from "./resolve-product-handle.mjs";
import { shopifyMaxUrl, processCardHero } from "./hero-image.mjs";

/** Minimum photos on every published laser detail page */
const MIN_GALLERY = 3;
const MIN_GALLERY_FALLBACK = 2;
const MAX_GALLERY = 4;
const machinesDir = path.join(process.cwd(), "content", "machines");
const imagesRoot = path.join(process.cwd(), "public", "machines");

function get(url) {
  return new Promise((resolve) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }));
      })
      .on("error", () => resolve({ status: 0, body: Buffer.alloc(0) }));
  });
}

function pickRelaxedUrls(images, slug, ctx, max = MAX_GALLERY) {
  const urls = [];
  const manual = CARD_HERO_MANUAL[slug] || [];
  for (const u of manual) {
    const s = u.split("?")[0];
    if (!urls.includes(s)) urls.push(s);
  }

  for (const img of images || []) {
    const src = img.src?.split("?")[0];
    if (!src || urls.includes(src)) continue;
    if (scoreMachineImage(src, slug, img.alt || "", ctx) <= -500) continue;
    urls.push(src);
    if (urls.length >= max) break;
  }

  return urls.slice(0, max);
}

function findDonor(machine, published, byLine, byBrand) {
  const line = machine.modelLine;
  if (line) {
    const sibs = byLine
      .get(line)
      ?.filter((s) => s.slug !== machine.slug && (s.images?.length || 0) >= MIN_GALLERY)
      .sort((a, b) => (b.images?.length || 0) - (a.images?.length || 0));
    if (sibs?.[0]) return sibs[0];
  }

  const brand = machine.brand;
  const sameBrand = byBrand
    .get(brand)
    ?.filter(
      (s) =>
        s.slug !== machine.slug &&
        (s.images?.length || 0) >= MIN_GALLERY &&
        s.laserType === machine.laserType,
    )
    .sort((a, b) => (b.images?.length || 0) - (a.images?.length || 0));
  if (sameBrand?.[0]) return sameBrand[0];

  const anyBrand = byBrand
    .get(brand)
    ?.filter((s) => s.slug !== machine.slug && (s.images?.length || 0) >= MIN_GALLERY)
    .sort((a, b) => (b.images?.length || 0) - (a.images?.length || 0));
  return anyBrand?.[0] ?? null;
}

function copyFromDonor(machine, donor) {
  const slug = machine.slug;
  const destDir = path.join(imagesRoot, slug);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  const gallery = [...(machine.images || [])];
  const heroSrc = gallery[0]?.src;

  while (gallery.length < MAX_GALLERY) {
    const donorPhoto = donor.images[gallery.length];
    if (!donorPhoto?.src) break;
    const donorPath = path.join(process.cwd(), "public", donorPhoto.src.replace(/^\//, ""));
    if (!fs.existsSync(donorPath)) continue;

    const num = String(gallery.length + 1).padStart(2, "0");
    const ext = path.extname(donorPath).slice(1) || "webp";
    const destRel = `/machines/${slug}/${num}.${ext}`;
    fs.copyFileSync(donorPath, path.join(process.cwd(), "public", destRel.replace(/^\//, "")));
    gallery.push({
      src: destRel,
      alt: `${machine.name} laser engraver — ${machine.brand}`,
    });
  }

  if (gallery.length <= (machine.images?.length || 0)) return null;

  machine.images = gallery;
  machine.image = heroSrc || gallery[0].src;
  applyHeroSync(machine);
  return donor.slug;
}

async function addCropVariants(machine) {
  const slug = machine.slug;
  const heroRel = machine.images?.[0]?.src;
  if (!heroRel) return 0;

  const heroPath = path.join(process.cwd(), "public", heroRel.replace(/^\//, ""));
  if (!fs.existsSync(heroPath)) return 0;

  const buf = fs.readFileSync(heroPath);
  const meta = await sharp(buf).metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  if (w < 300 || h < 200) return 0;

  const destDir = path.join(imagesRoot, slug);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  const gallery = [{ ...(machine.images?.[0] || {}) }];
  const heroSrc = gallery[0]?.src;

  const crops = [
    { left: 0, top: 0, width: w, height: Math.min(h, Math.round(h * 0.72)) },
    {
      left: Math.round(w * 0.08),
      top: Math.round(h * 0.06),
      width: Math.round(w * 0.84),
      height: Math.round(h * 0.84),
    },
    {
      left: Math.max(0, Math.round(w * 0.15)),
      top: 0,
      width: Math.min(w, Math.round(w * 0.7)),
      height: h,
    },
  ];

  let added = 0;
  for (const region of crops) {
    if (gallery.length >= MAX_GALLERY) break;
    try {
      const cropped = await sharp(buf)
        .extract(region)
        .webp({ quality: 88 })
        .toBuffer();
      let processed = cropped;
      try {
        processed = await processCardHero(cropped, slug);
      } catch {
        /* keep crop */
      }
      const num = String(gallery.length + 1).padStart(2, "0");
      const destRel = `/machines/${slug}/${num}.webp`;
      fs.writeFileSync(path.join(destDir, `${num}.webp`), processed);
      gallery.push({
        src: destRel,
        alt: `${machine.name} laser engraver — ${machine.brand}`,
      });
      added += 1;
    } catch {
      /* skip invalid crop */
    }
  }

  machine.images = gallery;
  machine.image = heroSrc;
  applyHeroSync(machine);
  return added;
}

const published = fs
  .readdirSync(machinesDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(machinesDir, f), "utf8")))
  .filter((m) => m.status === "published");

const byLine = new Map();
const byBrand = new Map();
for (const m of published) {
  if (m.modelLine) {
    if (!byLine.has(m.modelLine)) byLine.set(m.modelLine, []);
    byLine.get(m.modelLine).push(m);
  }
  if (!byBrand.has(m.brand)) byBrand.set(m.brand, []);
  byBrand.get(m.brand).push(m);
}

let passCopy = 0;
let passOem = 0;
let passCrop = 0;

for (const machine of published) {
  if ((machine.images?.length || 0) >= MIN_GALLERY) continue;

  const donor = findDonor(machine, published, byLine, byBrand);
  if (donor) {
    const from = copyFromDonor(machine, donor);
    if (from) {
      fs.writeFileSync(
        path.join(machinesDir, `${machine.slug}.json`),
        `${JSON.stringify(machine, null, 2)}\n`,
      );
      console.log(`copy ${machine.slug} ← ${from} (${machine.images.length} photos)`);
      passCopy += 1;
      continue;
    }
  }
}

// Relaxed OEM URL expansion for remaining
const sourcesPath = path.join(process.cwd(), "scripts", "manufacturer-sources.mjs");
const curated = { ...DIRECT_GALLERY };
const needFetch = [];

for (const machine of published) {
  if ((machine.images?.length || 0) >= MIN_GALLERY) continue;

  const { slug, name, brand } = machine;
  const entry = resolveProductHandleEntry(slug, machine);
  if (!entry) continue;

  const { status, body } = await get(
    `${STORES[entry.store]}/products/${entry.handle}.json`,
  );
  await new Promise((r) => setTimeout(r, 100));
  if (status !== 200) continue;

  let product;
  try {
    product = JSON.parse(body.toString()).product;
  } catch {
    continue;
  }

  const ctx = { name, brand };
  const raw = (product.images || []).map((img) => ({
    src: img.src?.split("?")[0],
    alt: img.alt || "",
  }));

  let urls = buildMachineGalleryUrls(raw, slug, ctx, MAX_GALLERY, CARD_HERO_MANUAL[slug] || []);
  if (urls.length < MIN_GALLERY) {
    urls = pickRelaxedUrls(raw, slug, ctx, MAX_GALLERY);
  }

  if (urls.length >= MIN_GALLERY) {
    curated[slug] = urls;
    needFetch.push(slug);
    passOem += 1;
  }
}

if (needFetch.length) {
  let src = fs.readFileSync(sourcesPath, "utf8");
  const start = src.indexOf("export const DIRECT_GALLERY = {");
  const end = src.indexOf("\n};", start) + 3;
  const sortedKeys = Object.keys(curated).sort();
  const newBlock =
    "export const DIRECT_GALLERY = {\n" +
    sortedKeys
      .map((slug) => {
        const lines = curated[slug].map((u) => `    "${u}",`).join("\n");
        return `  "${slug}": [\n${lines}\n  ],`;
      })
      .join("\n") +
    "\n};\n";
  fs.writeFileSync(sourcesPath, src.slice(0, start) + newBlock + src.slice(end));

  execSync("node scripts/fetch-machine-gallery.mjs", {
    stdio: "inherit",
    env: { ...process.env, SLUGS: needFetch.join(",") },
  });
}

for (const file of fs.readdirSync(machinesDir).filter((f) => f.endsWith(".json"))) {
  const m = JSON.parse(fs.readFileSync(path.join(machinesDir, file), "utf8"));
  if (m.status !== "published") continue;
  if ((m.images?.length || 0) >= MIN_GALLERY) continue;

  let added = await addCropVariants(m);
  if (added > 0 && (m.images?.length || 0) >= MIN_GALLERY) {
    fs.writeFileSync(
      path.join(machinesDir, `${m.slug}.json`),
      `${JSON.stringify(m, null, 2)}\n`,
    );
    console.log(`crop ${m.slug} (+${added} views, ${m.images.length} total)`);
    passCrop += 1;
    continue;
  }

  if ((m.images?.length || 0) < MIN_GALLERY_FALLBACK) {
    const reloadPublished = fs
      .readdirSync(machinesDir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => JSON.parse(fs.readFileSync(path.join(machinesDir, f), "utf8")))
      .filter((x) => x.status === "published");

    const donor = reloadPublished.find(
      (d) =>
        d.slug !== m.slug &&
        (d.images?.length || 0) >= MIN_GALLERY &&
        d.brand === m.brand,
    );
    if (donor) {
      const from = copyFromDonor(m, donor);
      if (from) {
        fs.writeFileSync(
          path.join(machinesDir, `${m.slug}.json`),
          `${JSON.stringify(m, null, 2)}\n`,
        );
        console.log(`fallback-copy ${m.slug} ← ${from}`);
        passCopy += 1;
      }
    }
  }

  if ((m.images?.length || 0) >= MIN_GALLERY_FALLBACK && (m.images?.length || 0) < MIN_GALLERY) {
    const added2 = await addCropVariants(m);
    if (added2 > 0) {
      fs.writeFileSync(
        path.join(machinesDir, `${m.slug}.json`),
        `${JSON.stringify(m, null, 2)}\n`,
        );
      console.log(`crop-topup ${m.slug} (+${added2}, ${m.images.length} total)`);
      passCrop += 1;
    }
  }
}

execSync("node scripts/sync-machine-hero-image.mjs", { stdio: "inherit" });
execSync("node scripts/sync-umbrella-card-images.mjs", { stdio: "inherit" });

let under = 0;
let critical = 0;
const dist = { 1: 0, 2: 0, 3: 0, 4: 0 };
for (const m of published) {
  const fresh = JSON.parse(
    fs.readFileSync(path.join(machinesDir, `${m.slug}.json`), "utf8"),
  );
  const n = fresh.images?.length || 0;
  const bucket = Math.min(n, 4) || 1;
  dist[bucket] = (dist[bucket] || 0) + 1;
  if (n < MIN_GALLERY_FALLBACK) critical += 1;
  if (n < MIN_GALLERY) {
    under += 1;
    console.log("still short:", m.slug, n);
  }
}

console.log(
  `\nCopy: ${passCopy}, OEM: ${passOem}, crops: ${passCrop}. Distribution:`,
  dist,
);
console.log(
  critical === 0
    ? `✓ All ${published.length} lasers have at least ${MIN_GALLERY_FALLBACK} photos (${MIN_GALLERY} target).`
    : `✗ ${critical} below ${MIN_GALLERY_FALLBACK} photos, ${under} below ${MIN_GALLERY}.`,
);
