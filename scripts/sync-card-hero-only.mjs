/**
 * Refresh catalog card hero (01.webp) from CARD_HERO_MANUAL without wiping gallery 02+.
 * Run: node scripts/sync-card-hero-only.mjs
 * Env: SLUGS=slug1,slug2 (defaults to CARD_HERO_FIX_SLUGS)
 */

import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import { CARD_HERO_FIX_SLUGS, CARD_HERO_MANUAL } from "./card-hero-manual.mjs";
import { applyHeroSync } from "./lib/machine-hero-sync.mjs";
import { processManualCardHero, shopifyMaxUrl } from "./hero-image.mjs";

const machinesDir = path.join(process.cwd(), "content", "machines");
const imagesRoot = path.join(process.cwd(), "public", "machines");
const MIN_BYTES = 4000;

function fetchUrl(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client
      .get(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; MakerAtlas/1.0)" } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && maxRedirects > 0) {
          const next = res.headers.location.startsWith("http")
            ? res.headers.location
            : new URL(res.headers.location, url).href;
          fetchUrl(next, maxRedirects - 1).then(resolve).catch(reject);
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }));
      })
      .on("error", reject);
  });
}

const filterSlugs = process.env.SLUGS?.split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const slugs = filterSlugs?.length ? filterSlugs : CARD_HERO_FIX_SLUGS;

let updated = 0;

for (const slug of slugs) {
  const manual = CARD_HERO_MANUAL[slug]?.[0];
  if (!manual) {
    console.log(`= ${slug}: no CARD_HERO_MANUAL entry`);
    continue;
  }

  const jsonPath = path.join(machinesDir, `${slug}.json`);
  if (!fs.existsSync(jsonPath)) {
    console.log(`= ${slug}: missing json`);
    continue;
  }

  const machine = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  const dir = path.join(imagesRoot, slug);
  fs.mkdirSync(dir, { recursive: true });

  const fetchSrc = shopifyMaxUrl(manual);
  const { status, body } = await fetchUrl(fetchSrc);
  if (status !== 200 || body.length < MIN_BYTES) {
    console.log(`✗ ${slug}: fetch failed (${status})`);
    continue;
  }

  let processed = body;
  try {
    processed = await processManualCardHero(body, slug);
  } catch (err) {
    console.warn(`  ! ${slug}: card hero processing failed — ${err.message}`);
    processed = body;
  }

  const heroPath = path.join(dir, "01.webp");
  fs.writeFileSync(heroPath, processed);
  const heroSrc = `/machines/${slug}/01.webp`;

  machine.image = heroSrc;
  applyHeroSync(machine);
  fs.writeFileSync(jsonPath, `${JSON.stringify(machine, null, 2)}\n`);

  const kb = Math.round(processed.length / 1024);
  console.log(`✓ ${slug}: card hero ${kb}kb ← ${manual.split("/").pop()}`);
  updated += 1;
}

console.log(`\nDone. ${updated} card hero(s) refreshed.`);
