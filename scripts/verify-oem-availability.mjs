/**
 * Check manufacturer Shopify listings for published machines.
 * Run: node scripts/verify-oem-availability.mjs
 * Apply: node scripts/verify-oem-availability.mjs --apply
 */

import fs from "fs";
import path from "path";
import https from "https";
import { PRODUCT_HANDLES, STORES } from "./manufacturer-sources.mjs";

const machinesDir = path.join(process.cwd(), "content", "machines");
const apply = process.argv.includes("--apply");

function get(url) {
  return new Promise((resolve) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0 (MakerAtlas)" } }, (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => resolve({ status: res.statusCode, body: d }));
      })
      .on("error", () => resolve({ status: 0, body: "" }));
  });
}

/** Known delisted — no product.json on OEM store (verified 2026-06) */
export const OEM_DELISTED = new Set([
  "hawk-20",
  "htouroy-40w",
  "nubur-n4060",
  "nubur-n4060-20w",
  "nubur-n4060-40w",
  "ortur-laser-master-2-pro",
  "ortur-lm2-s2-10w",
  "ortur-lm2-s2-5w",
  "ortur-laser-master-2-s2",
  "laserpecker-lp2-classic",
  "laserpecker-lp1-pro",
  "laserpecker-lp1-plus",
  "longer-ray5-20w",
  "wecreat-vision",
]);

/** Umbrella / combined SKU no longer sold as one listing (not current single-SKU products) */
export const OEM_DISCONTINUED_UMBRELLA = new Set([
  "xtool-d1-pro",
  "xtool-p2",
  "glowforge-pro",
  "atomstack-a5-pro",
  "atomstack-a20-pro",
  "atezr-p2",
  "comgrow-z1",
  "sculpfun-s30-ultra",
  "ortur-laser-master-3",
  "algolaser-diy-kit-mini",
]);

const cache = new Map();

async function checkHandle(store, handle) {
  const key = `${store}:${handle}`;
  if (cache.has(key)) return cache.get(key);
  const base = STORES[store];
  if (!base) {
    cache.set(key, { ok: false, reason: "no-store" });
    return cache.get(key);
  }
  const { status, body } = await get(`${base}/products/${handle}.json`);
  if (status !== 200) {
    cache.set(key, { ok: false, reason: `http-${status}` });
    return cache.get(key);
  }
  try {
    const p = JSON.parse(body).product;
    const unavailable =
      p.published_at == null ||
      p.available === false ||
      /sold out|discontinued|archived/i.test(`${p.tags} ${p.title}`);
    cache.set(key, {
      ok: !unavailable,
      reason: unavailable ? "unpublished-or-unavailable" : "ok",
      title: p.title,
    });
  } catch {
    cache.set(key, { ok: false, reason: "parse-error" });
  }
  return cache.get(key);
}

function defaultDiscontinuedNote(brand, name) {
  return `${brand} no longer sells the ${name} as a new product on its official store. Used units may appear on marketplaces — verify optical power, firmware, and accessories.`;
}

const published = fs
  .readdirSync(machinesDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(machinesDir, f), "utf-8")))
  .filter((m) => m.status === "published");

const missingHandle = [];
const delistedLive = [];
const discontinuedNotMarked = [];
const shouldBeCurrent = [];

for (const m of published) {
  const slug = m.slug;
  if (OEM_DELISTED.has(slug)) {
    if (m.marketAvailability !== "discontinued" && m.status === "published") {
      delistedLive.push({ slug, issue: "verified-delisted-not-marked" });
    }
    continue;
  }

  const entry = PRODUCT_HANDLES[slug];
  if (!entry) continue;

  const result = await checkHandle(entry.store, entry.handle);
  await new Promise((r) => setTimeout(r, 120));

  if (!result.ok) {
    if (OEM_DISCONTINUED_UMBRELLA.has(slug)) continue;
    delistedLive.push({ slug, reason: result.reason, title: result.title });
  } else if (m.marketAvailability === "discontinued" && !OEM_DISCONTINUED_UMBRELLA.has(slug)) {
    shouldBeCurrent.push({ slug, title: result.title });
  }
}

for (const m of published) {
  if (!PRODUCT_HANDLES[m.slug] && !OEM_DELISTED.has(m.slug)) {
    missingHandle.push(m.slug);
  }
  if (OEM_DISCONTINUED_UMBRELLA.has(m.slug) && m.marketAvailability !== "discontinued") {
    discontinuedNotMarked.push(m.slug);
  }
}

console.log("=== OEM listing check ===\n");
console.log("Delisted / 404 on OEM store:", delistedLive.length);
delistedLive.forEach((x) => console.log(`  ${x.slug} (${x.reason})`));
console.log("\nDiscontinued umbrella not marked:", discontinuedNotMarked.length);
discontinuedNotMarked.forEach((s) => console.log(`  ${s}`));
console.log("\nMarked discontinued but OEM OK:", shouldBeCurrent.length);
shouldBeCurrent.slice(0, 15).forEach((x) => console.log(`  ${x.slug}`));

if (!apply) {
  console.log("\nRun with --apply to update marketAvailability on verified delisted machines.");
  process.exit(0);
}

let updated = 0;
for (const { slug } of delistedLive) {
  if (OEM_DISCONTINUED_UMBRELLA.has(slug)) continue;
  const filePath = path.join(machinesDir, `${slug}.json`);
  const m = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  if (m.marketAvailability === "discontinued") continue;
  m.marketAvailability = "discontinued";
  m.marketAvailabilityNote = defaultDiscontinuedNote(m.brand, m.name);
  m.lastUpdated = "2026-06-01";
  if (OEM_DELISTED.has(slug) && m.catalogPrimary) {
    delete m.catalogPrimary;
  }
  fs.writeFileSync(filePath, `${JSON.stringify(m, null, 2)}\n`);
  console.log(`marked discontinued: ${slug}`);
  updated++;
}

for (const slug of discontinuedNotMarked) {
  const filePath = path.join(machinesDir, `${slug}.json`);
  const m = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  m.marketAvailability = "discontinued";
  m.marketAvailabilityNote = defaultDiscontinuedNote(m.brand, m.name);
  m.lastUpdated = "2026-06-01";
  fs.writeFileSync(filePath, `${JSON.stringify(m, null, 2)}\n`);
  console.log(`marked discontinued (umbrella): ${slug}`);
  updated++;
}

console.log(`\nDone. ${updated} profile(s) updated.`);
