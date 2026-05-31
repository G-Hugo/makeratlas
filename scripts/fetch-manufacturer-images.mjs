/**
 * Fetch product images from manufacturer websites.
 * 1) Known CDN / product handle map
 * 2) Shopify collection title matching
 * 3) Shopify products.json on product page URL
 * 4) HTML og:image fallback (works even on some 404 pages)
 *
 * Run: npm run fetch:images
 */

import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

const machinesDir = path.join(process.cwd(), "content", "machines");
const imagesDir = path.join(process.cwd(), "public", "machines");

const SKIP_ACCESSORY =
  /module|kit|refurb|accessory|feeder|bundle|board|fan|cable|plate|mat|paper|spray|filter|lens|motor|riser|extension|acrylic|wood pack|course|class|gift|tumbler|puzzle|ring|stamp|foil|pen|software|license|subscription|refill|replacement|part|spare|upgrade|head only|assembly|control board|aftersales|after-sales|warranty|tube|nozzle|belt|switch|sensor|pump|extractor|mirror|lens|motherboard|honeycomb|chiller|power supply|fume|glasses|spray|file|word|graduation|valentine|christmas|pre-owned|pre owned/i;

/** slug → direct image URL (manufacturer CDN) */
const DIRECT_IMAGES = {
  "creality-falcon2-12w":
    "https://cdn.creality.com/ow/product-info/cae43a34-0179-418c-b6f9-e6fa82e0bff8.webp",
  "xtool-p2s": "https://www.xtool.com/cdn/shop/files/20250416-174018_1200x1200.jpg",
  "xtool-f1": "https://www.xtool.com/cdn/shop/files/F1_1200x1200.jpg",
  "glowforge-pro":
    "https://shop.glowforge.com/cdn/shop/files/GF_PDPphotoswvalueprops_Pro2_grande.png",
};

/** slug → { storeKey, handle } for Shopify products.json */
const PRODUCT_HANDLES = {
  "longer-ray5": { store: "longer", handle: "ray5-20w-laser-engraver" },
  "sculpfun-s30-ultra": {
    store: "sculpfun",
    handle: "sculpfun-s30-ultra-22w-laser-engraving-and-cutting-machine-lightburn-core-license-key",
  },
  "sculpfun-icube-pro": {
    store: "sculpfun",
    handle: "sculpfun-icube-pro-5w-portable-laser-engraving-machine",
  },
  "sculpfun-s9": { store: "sculpfun", handle: "sculpfun-s9-pro-10w-laser-engraving-machine" },
  "ortur-laser-master-3": { store: "ortur", handle: "ortur-laser-master-3-engraver-cutter-machine" },
  "ortur-laser-master-h10": { store: "ortur", handle: "ortur-h10-engraver-cutter-machine" },
  "ortur-aufero-al1": { store: "ortur", handle: "aufero-laser1-best-portable-laser-engraver" },
  "atomstack-a5-pro": { store: "atomstack", handle: "atomstack-a5-pro" },
  "atomstack-a40-pro": { store: "atomstack", handle: "atomstack-a40-pro" },
  "atomstack-a20-pro": { store: "atomstack", handle: "atomstack-ace-pro-v2" },
  "longer-laser-b1": { store: "longer", handle: "longer-laser-b1-20w-laser-engraver" },
  "laserpecker-4": { store: "laserpecker", handle: "laserpecker-lp4-portable-ir-diode-dual-laser" },
  "laserpecker-5": { store: "laserpecker", handle: "laserpecker-lp5-smart-20w-fiber-diode-laser-engraver" },
  "algolaser-alpha-mk2": {
    store: "algolaser",
    handle: "algolaser-alpha-mk2-40w-diode-laser-cutter-and-engraver",
  },
  "acmer-p3": { store: "acmer", handle: "acmer-p3-48w-diode-enclosed-laser-engraver" },
  "gweike-cloud-pro": { store: "gweike", handle: "gweike-cloud-pro-bundle" },
  "two-trees-tts-55-pro": {
    store: "twotrees",
    handle: "tts-55-pro-tts-10-pro-diode-laser-engraver-twotrees",
  },
  "twotrees-tts-55": { store: "twotrees", handle: "twotrees-ts2-20w-laser-engraver" },
  "two-trees-ts2-20w": { store: "twotrees", handle: "twotrees-ts2-20w-laser-engraver" },
  "foxaliens-reisler-2": { store: "foxalien", handle: "foxalien-reizer-20w-laser-engraver-1" },
  "glowforge-aura": { store: "glowforge", handle: "glowforge-aura" },
  "glowforge-pro": { store: "glowforge", handle: "glowforge-pro" },
  "omtech-40w-co2": { store: "omtech", handle: "40w-co2-laser-engraver-cutter-usb-032b-us" },
  "omtech-80w-co2": { store: "omtech", handle: "co2-laser-engraver-cutter-usb-8r57-ul" },
  "omtech-polar": { store: "omtech", handle: "omtech-polar-lite-55w-desktop-co2-laser-engraver-and-cutter" },
  "monport-40w-co2": { store: "monport", handle: "monport-40w-lightburn-laser-engraver" },
  "monport-55w-co2": {
    store: "monport",
    handle: "monport-reno65-pro-vision-65w-desktop-co2-laser-engraver-cutter-24-x-16-with-8mp-hd-camera-and-magnetic-assisted-autofocus",
  },
  "creality-falcon2-pro": {
    store: "crealityfalcon",
    handle: "falcon-2-pro-40w-enclosed-laser-engraver-and-cutter",
  },
};

const STORES = {
  xtool: "https://www.xtool.com",
  sculpfun: "https://www.sculpfun.com",
  ortur: "https://ortur.net",
  atomstack: "https://atomstack.com",
  longer: "https://longer3d.com",
  laserpecker: "https://laserpecker.net",
  algolaser: "https://algolaser.com",
  acmer: "https://acmerlaser.com",
  gweike: "https://gweikecloud.com",
  twotrees: "https://twotrees3dofficial.com",
  foxalien: "https://www.foxalien.com",
  glowforge: "https://shop.glowforge.com",
  omtech: "https://omtech.com",
  monport: "https://monportlaser.com",
  crealityfalcon: "https://www.crealityfalcon.com",
  wecreat: "https://wecreat.com",
};

/** slug → title regex for collection scan */
const COLLECTION_MATCH = {
  "xtool-d1-pro": /D1 Pro(?!.*module)/i,
  "xtool-s1": /\bS1\b(?!.*module)/i,
  "xtool-f2-ultra": /F2 Ultra/i,
  "xtool-m1-ultra": /M1 Ultra(?!.*module)/i,
  "xtool-f1": /\bF1\b(?! Ultra)/i,
  "xtool-p2s": /P2S/i,
  "xtool-f1-ultra": /F1 Ultra/i,
  "xtool-p2": /\bP2\b(?!S)/i,
  "wecreat-vision": /Vision/i,
};

/** slug → product page URLs (og:image / json fallback) */
const PRODUCT_PAGES = {
  "xtool-d1-pro": ["https://www.xtool.com/products/xtool-d1-pro-20w-laser-engraver"],
  "xtool-p2": ["https://www.xtool.com/products/xtool-p2-55w-co2-laser-cutter"],
  "xtool-p2s": ["https://www.xtool.com/products/xtool-p2s-55w-co2-laser-cutter"],
  "xtool-s1": ["https://www.xtool.com/products/xtool-s1-20w-enclosed-laser-engraver"],
  "xtool-f1-ultra": ["https://www.xtool.com/products/xtool-f1-ultra-portable-laser-engraver"],
  "xtool-f1": ["https://www.xtool.com/products/xtool-f1-portable-laser-engraver"],
  "xtool-f2-ultra": ["https://www.xtool.com/products/xtool-f2-ultra-portable-laser-engraver"],
  "xtool-m1-ultra": ["https://www.xtool.com/products/xtool-m1-ultra-laser-blade-cutter"],
  "wecreat-vision": ["https://wecreat.com/products/wecreat-vision"],
  "comgrow-z1": ["https://comgrow.com/products/comgrow-z1-laser-engraver"],
  "atezr-p2": ["https://www.atezr.com/products/atezr-p2-laser-engraver"],
  "nubur-n4060": ["https://www.nubur.com/products/n4060-laser-engraver"],
};

function fetchUrl(url, maxRedirects = 5, options = {}) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client
      .get(
        url,
        {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; MakerAtlas/1.0)" },
          rejectUnauthorized: options.rejectUnauthorized !== false,
        },
        (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && maxRedirects > 0) {
            const next = res.headers.location.startsWith("http")
              ? res.headers.location
              : new URL(res.headers.location, url).href;
            fetchUrl(next, maxRedirects - 1, options).then(resolve).catch(reject);
            return;
          }
          const chunks = [];
          res.on("data", (c) => chunks.push(c));
          res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(chunks), url }));
        },
      )
      .on("error", reject);
  });
}

async function loadStoreProducts(storeKey, pages = 3) {
  const base = STORES[storeKey];
  if (!base) return [];
  const all = [];
  for (let page = 1; page <= pages; page++) {
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
  return all;
}

const storeCache = new Map();

async function getStoreProducts(storeKey) {
  if (!storeCache.has(storeKey)) {
    storeCache.set(storeKey, loadStoreProducts(storeKey));
  }
  return storeCache.get(storeKey);
}

function imageFromHtml(html) {
  const patterns = [
    /property=["']og:image:secure_url["']\s+content=["']([^"']+)["']/i,
    /content=["']([^"']+)["']\s+property=["']og:image:secure_url["']/i,
    /property=["']og:image["']\s+content=["']([^"']+)["']/i,
    /content=["']([^"']+)["']\s+property=["']og:image["']/i,
    /"featured_image"\s*:\s*"([^"]+)"/,
    /"src"\s*:\s*"(https:\/\/cdn\.shopify\.com[^"]+\.(?:jpg|jpeg|png|webp))"/i,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return m[1].replace(/\\u0026/g, "&").split("?")[0];
  }
  return null;
}

async function imageFromShopifyHandle(storeKey, handle) {
  const base = STORES[storeKey];
  if (!base) return null;
  const { status, body } = await fetchUrl(`${base}/products/${handle}.json`);
  if (status !== 200) return null;
  try {
    const data = JSON.parse(body.toString());
    const src = data.product?.featured_image || data.product?.images?.[0]?.src;
    return src?.split("?")[0] || null;
  } catch {
    return null;
  }
}

async function imageFromShopifyJson(pageUrl) {
  const jsonUrl = pageUrl.replace(/\/?$/, ".json");
  const { status, body } = await fetchUrl(jsonUrl);
  if (status !== 200) return null;
  try {
    const data = JSON.parse(body.toString());
    const src = data.product?.featured_image || data.product?.images?.[0]?.src || data.product?.image?.src;
    return src?.split("?")[0] || null;
  } catch {
    return null;
  }
}

async function resolveImageFromPage(pageUrl) {
  const fromJson = await imageFromShopifyJson(pageUrl);
  if (fromJson) return fromJson;

  const { body } = await fetchUrl(pageUrl, 5, { rejectUnauthorized: pageUrl.includes("nubur.com") ? false : true });
  return imageFromHtml(body.toString());
}

async function findInCollection(slug) {
  const re = COLLECTION_MATCH[slug];
  if (!re) return null;

  const storeKey = slug.startsWith("xtool") ? "xtool" : slug.startsWith("wecreat") ? "wecreat" : null;
  if (!storeKey) return null;

  const products = await getStoreProducts(storeKey);
  const product = products.find((p) => re.test(p.title) && !SKIP_ACCESSORY.test(p.title));
  return product?.images?.[0]?.src?.split("?")[0] || null;
}

async function resolveImageUrl(slug) {
  if (DIRECT_IMAGES[slug]) return DIRECT_IMAGES[slug];

  const handleEntry = PRODUCT_HANDLES[slug];
  if (handleEntry) {
    const img = await imageFromShopifyHandle(handleEntry.store, handleEntry.handle);
    if (img) return img;
  }

  const fromCollection = await findInCollection(slug);
  if (fromCollection) return fromCollection;

  for (const page of PRODUCT_PAGES[slug] || []) {
    try {
      const img = await resolveImageFromPage(page);
      if (img && !img.includes("logo_") && !img.includes("Frame_88013506")) return img;
    } catch {
      /* next */
    }
  }

  return null;
}

async function downloadImage(imageUrl, slug) {
  const { status, body } = await fetchUrl(imageUrl, 5, {
    rejectUnauthorized: !imageUrl.includes("nubur.com"),
  });
  if (status !== 200 || body.length < 1500) return null;

  const ext = imageUrl.includes(".png")
    ? "png"
    : imageUrl.includes(".webp")
      ? "webp"
      : "jpg";
  const filename = `${slug}.${ext}`;
  fs.writeFileSync(path.join(imagesDir, filename), body);
  return `/machines/${filename}`;
}

if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

const slugs = fs
  .readdirSync(machinesDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(".json", ""));

let fetched = 0;
let skipped = 0;
let failed = 0;

for (const slug of slugs) {
  const machinePath = path.join(machinesDir, `${slug}.json`);
  const machine = JSON.parse(fs.readFileSync(machinePath, "utf-8"));

  const current = machine.image || "";
  if (/\.(jpg|jpeg|png|webp)$/i.test(current)) {
    const diskPath = path.join(process.cwd(), "public", current.replace(/^\//, ""));
    if (fs.existsSync(diskPath) && fs.statSync(diskPath).size > 1500) {
      console.log(`○ ${slug}: already has photo`);
      skipped++;
      continue;
    }
  }

  const imageUrl = await resolveImageUrl(slug);
  if (!imageUrl) {
    console.log(`✗ ${slug}: no image found`);
    failed++;
    continue;
  }

  try {
    const localPath = await downloadImage(imageUrl, slug);
    if (!localPath) {
      console.log(`✗ ${slug}: download failed (${imageUrl.slice(0, 60)}…)`);
      failed++;
      continue;
    }
    machine.image = localPath;
    fs.writeFileSync(machinePath, JSON.stringify(machine, null, 2) + "\n");
    console.log(`✓ ${slug}`);
    fetched++;
  } catch (e) {
    console.log(`✗ ${slug}: ${e.message}`);
    failed++;
  }
}

console.log(`Done. ${fetched} fetched, ${skipped} skipped, ${failed} failed.`);
