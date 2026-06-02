/**
 * Download multiple product photos per machine from manufacturer Shopify catalogs.
 * Strict filtering — machine product shots only, no accessories or infographics.
 *
 * Run: npm run fetch:gallery
 */

import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import {
  COLLECTION_MATCH,
  CURATED_RAW_HERO,
  DIRECT_GALLERY,
  DIRECT_GALLERY_ONLY,
  PRODUCT_HANDLES,
  SKIP_ACCESSORY,
  STORES,
} from "./manufacturer-sources.mjs";
import {
  filterRemoteImages,
  GALLERY_RULES,
  HERO_ONLY_SLUGS,
  validateImageBytes,
} from "./gallery-filter.mjs";
import {
  DIRECT_HERO_SLUGS,
  compressGallerySlot,
  processCardHero,
  processHeroBytes,
  processManualCardHero,
  shopifyMaxUrl,
} from "./hero-image.mjs";
import { applyHeroSync } from "./lib/machine-hero-sync.mjs";
import { resolveProductHandleEntry } from "./resolve-product-handle.mjs";
import { CARD_HERO_MANUAL } from "./card-hero-manual.mjs";
import { buildMachineGalleryUrls } from "./pick-machine-product-image.mjs";

const MAX_IMAGES = 5;
const TARGET_GALLERY = 4;
const MIN_BYTES = 4000;
const machinesDir = path.join(process.cwd(), "content", "machines");
const imagesRoot = path.join(process.cwd(), "public", "machines");

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

const storeCache = new Map();

async function loadStoreProducts(storeKey) {
  if (!storeCache.has(storeKey)) {
    const base = STORES[storeKey];
    const all = [];
    for (let page = 1; page <= 3; page++) {
      try {
        const { status, body } = await fetchUrl(`${base}/collections/all/products.json?limit=250&page=${page}`);
        if (status !== 200) break;
        const products = JSON.parse(body.toString()).products;
        if (!products?.length) break;
        all.push(...products);
        if (products.length < 250) break;
      } catch {
        break;
      }
    }
    storeCache.set(storeKey, all);
  }
  return storeCache.get(storeKey);
}

async function productFromHandle(storeKey, handle) {
  const base = STORES[storeKey];
  const { status, body } = await fetchUrl(`${base}/products/${handle}.json`);
  if (status !== 200) return null;
  try {
    return JSON.parse(body.toString()).product;
  } catch {
    return null;
  }
}

async function productFromCollection(slug) {
  const rule = COLLECTION_MATCH[slug];
  if (!rule) return null;
  const products = await loadStoreProducts(rule.store);
  return products.find((p) => rule.match.test(p.title) && !SKIP_ACCESSORY.test(p.title)) || null;
}

function extFromUrl(url) {
  if (url.includes(".png")) return "png";
  if (url.includes(".webp")) return "webp";
  return "jpg";
}

function isLikelyProductPhoto(url) {
  const lower = url.toLowerCase();
  return !/(logo|icon|badge|banner|shipping|warranty|certificate|flag|payment|social|qr)/i.test(lower);
}

async function resolveRemoteImages(slug, name, brand, machine = {}) {
  if (HERO_ONLY_SLUGS.has(slug)) {
    return [];
  }

  const limit = Math.min(
    GALLERY_RULES[slug]?.maxImages || TARGET_GALLERY,
    MAX_IMAGES,
  );

  if (DIRECT_GALLERY_ONLY.has(slug) && DIRECT_GALLERY[slug]?.length) {
    return DIRECT_GALLERY[slug].slice(0, limit).map((src, index) => ({
      src: shopifyMaxUrl(src),
      alt: `${name} laser engraver — ${brand}`,
      index,
      score: 100 - index,
    }));
  }

  const ctx = { name, brand };

  const handleEntry = resolveProductHandleEntry(slug, machine);
  let product = null;

  if (handleEntry) {
    product = await productFromHandle(handleEntry.store, handleEntry.handle);
  }
  if (!product) {
    product = await productFromCollection(slug);
  }

  let urlList = [];

  if (product?.images?.length) {
    const raw = product.images
      .map((img) => ({ src: img.src?.split("?")[0], alt: img.alt || null }))
      .filter((img) => img.src && isLikelyProductPhoto(img.src));

    urlList = buildMachineGalleryUrls(
      raw,
      slug,
      ctx,
      limit,
      CARD_HERO_MANUAL[slug] || [],
    );

    if (urlList.length < limit) {
      const filtered = filterRemoteImages(raw, slug, name, brand);
      for (const img of filtered) {
        if (!urlList.includes(img.src)) urlList.push(img.src);
        if (urlList.length >= limit) break;
      }
    }
  }

  if (urlList.length === 0 && DIRECT_GALLERY[slug]?.length) {
    urlList = [...DIRECT_GALLERY[slug]];
  } else if (urlList.length < limit && DIRECT_GALLERY[slug]?.length) {
    const seen = new Set(urlList.map((u) => u.split("?")[0]));
    for (const src of DIRECT_GALLERY[slug]) {
      const base = src.split("?")[0];
      if (!seen.has(base)) {
        seen.add(base);
        urlList.push(src);
      }
      if (urlList.length >= limit) break;
    }
  }

  if (urlList.length === 0) return [];

  return urlList.slice(0, limit).map((src, index) => ({
    src: shopifyMaxUrl(src),
    alt: `${name} laser engraver — ${brand}`,
    index,
    score: 100 - index,
  }));
}

function cleanGalleryDir(slug) {
  const dir = path.join(imagesRoot, slug);
  if (fs.existsSync(dir)) {
    for (const file of fs.readdirSync(dir)) {
      fs.unlinkSync(path.join(dir, file));
    }
  }
}

function manualHeroUrl(slug) {
  return CARD_HERO_MANUAL[slug]?.[0]?.split("?")[0] || "";
}

async function processHeroSlot(body, slug, { isHero, manualHero }) {
  if (isHero && manualHero) return processManualCardHero(body, slug);
  if (isHero && CURATED_RAW_HERO.has(slug)) return body;
  if (isHero) return processCardHero(body, slug, { manualHero });
  return processHeroBytes(body, slug);
}

async function writeGallerySlot(slug, body, fetchSrc, slotIndex, machineName, brand, remoteAlt, options = {}) {
  const { manualHero = false, forceHero = false } = options;
  const dir = path.join(imagesRoot, slug);
  const isHero = slotIndex === 0;
  let processed = body;

  try {
    processed = await processHeroSlot(body, slug, { isHero, manualHero });
  } catch {
    processed = body;
  }

  let ext = isHero ? "webp" : extFromUrl(fetchSrc);
  if (!isHero && processed.length > 380_000) {
    try {
      processed = await compressGallerySlot(processed);
      ext = "webp";
    } catch {
      /* keep original */
    }
  }
  const allowWideHero =
    forceHero ||
    manualHero ||
    Boolean(DIRECT_GALLERY[slug]) ||
    DIRECT_HERO_SLUGS.has(slug) ||
    slotIndex > 0;

  const valid = validateImageBytes(processed, ext, slotIndex, remoteAlt || "", { allowWideHero });
  if (!valid && !(isHero && manualHero && processed.length >= 3000)) {
    return null;
  }

  const num = String(slotIndex + 1).padStart(2, "0");
  const filename = `${num}.${ext}`;
  fs.writeFileSync(path.join(dir, filename), processed);

  return {
    src: `/machines/${slug}/${filename}`,
    alt: remoteAlt?.trim() || `${machineName} laser engraver — ${brand}`,
  };
}

/** Card hero (01.webp) from CARD_HERO_MANUAL — never skipped silently. */
async function downloadManualCardHero(slug, machineName, brand) {
  const manual = manualHeroUrl(slug);
  if (!manual) return null;

  const dir = path.join(imagesRoot, slug);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  try {
    const fetchSrc = shopifyMaxUrl(manual);
    const { status, body } = await fetchUrl(fetchSrc);
    if (status !== 200 || body.length < MIN_BYTES) {
      console.warn(`  ! ${slug}: manual card hero fetch failed (${status}, ${body.length}b)`);
      return null;
    }

    const saved = await writeGallerySlot(slug, body, fetchSrc, 0, machineName, brand, "", {
      manualHero: true,
      forceHero: true,
    });
    if (!saved) {
      console.warn(`  ! ${slug}: manual card hero rejected after processing`);
    }
    return saved;
  } catch (err) {
    console.warn(`  ! ${slug}: manual card hero error — ${err.message}`);
    return null;
  }
}

async function downloadGallery(slug, remoteImages, machineName, brand) {
  const dir = path.join(imagesRoot, slug);
  cleanGalleryDir(slug);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const saved = [];
  const manual = manualHeroUrl(slug);
  const manualBase = manual.split("?")[0];

  const cardHero = await downloadManualCardHero(slug, machineName, brand);
  if (cardHero) saved.push(cardHero);

  let slotIndex = saved.length;

  for (const remote of remoteImages) {
    if (saved.length >= MAX_IMAGES) break;
    const remoteBase = remote.src.split("?")[0];
    if (manualBase && remoteBase === manualBase) continue;

    try {
      const fetchSrc = shopifyMaxUrl(remote.src);
      const { status, body } = await fetchUrl(fetchSrc);
      if (status !== 200 || body.length < MIN_BYTES) continue;

      const entry = await writeGallerySlot(
        slug,
        body,
        fetchSrc,
        slotIndex,
        machineName,
        brand,
        remote.alt || "",
        { manualHero: false },
      );
      if (!entry) continue;

      slotIndex += 1;
      saved.push(entry);
    } catch {
      /* try next */
    }
  }

  return saved;
}

/** Fall back to a single existing flat file (pre-gallery layout) */
function bootstrapFromLegacyFile(slug, machine) {
  const candidates = [
    machine.image,
    `/machines/${slug}.webp`,
    `/machines/${slug}.jpg`,
    `/machines/${slug}.png`,
  ].filter(Boolean);

  for (const src of candidates) {
    if (src.includes(`/${slug}/`) || src.endsWith(".svg")) continue;
    const diskPath = path.join(process.cwd(), "public", src.replace(/^\//, ""));
    if (fs.existsSync(diskPath) && fs.statSync(diskPath).size >= MIN_BYTES) {
      return [
        {
          src,
          alt: `${machine.name} laser engraver by ${machine.brand}`,
        },
      ];
    }
  }
  return [];
}

const allSlugs = fs
  .readdirSync(machinesDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(".json", ""));
const filterSlugs = process.env.SLUGS?.split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const slugs = filterSlugs?.length
  ? filterSlugs.filter((s) => allSlugs.includes(s))
  : allSlugs;

let updated = 0;
let multi = 0;

for (const slug of slugs) {
  const filePath = path.join(machinesDir, `${slug}.json`);
  const machine = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const remote = await resolveRemoteImages(slug, machine.name, machine.brand, machine);
  let gallery = remote.length ? await downloadGallery(slug, remote, machine.name, machine.brand) : [];

  if (gallery.length === 0) {
    gallery = bootstrapFromLegacyFile(slug, machine);
  }

  if (gallery.length > 0 && gallery[0].src && !gallery[0].src.includes(`/${slug}/`)) {
    const legacyPath = path.join(process.cwd(), "public", gallery[0].src.replace(/^\//, ""));
    const dir = path.join(imagesRoot, slug);
    if (fs.existsSync(legacyPath)) {
      cleanGalleryDir(slug);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const ext = path.extname(legacyPath).slice(1) || "jpg";
      const dest = `/machines/${slug}/01.${ext}`;
      fs.copyFileSync(legacyPath, path.join(process.cwd(), "public", dest.replace(/^\//, "")));
      gallery = [{ src: dest, alt: gallery[0].alt }];
    }
  }

  if (gallery.length === 0) {
    console.log(`✗ ${slug}: no gallery images`);
    continue;
  }

  machine.images = gallery;
  machine.image = gallery[0].src;
  applyHeroSync(machine);
  fs.writeFileSync(filePath, JSON.stringify(machine, null, 2) + "\n");

  const tag = gallery.length > 1 ? `${gallery.length} photos` : "1 photo (hero)";
  console.log(`✓ ${slug}: ${tag}`);
  updated += 1;
  if (gallery.length > 1) multi += 1;
}

console.log(`Done. ${updated} machines updated, ${multi} with multiple photos.`);
