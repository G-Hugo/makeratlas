/**
 * Auto-pick best OEM product photo for every catalogPrimary machine and refresh cards.
 * Manual URLs in card-hero-manual.mjs are never overwritten.
 *
 * Run: node scripts/bootstrap-primary-card-heroes.mjs
 *      node scripts/bootstrap-primary-card-heroes.mjs --fetch
 */

import fs from "fs";
import path from "path";
import https from "https";
import { PRODUCT_HANDLES, STORES } from "./manufacturer-sources.mjs";
import { CARD_HERO_MANUAL } from "./card-hero-manual.mjs";
import { pickBestImage } from "./pick-card-hero-url.mjs";

const machinesDir = path.join(process.cwd(), "content", "machines");
const doFetch = process.argv.includes("--fetch");

const metaSrc = fs.readFileSync(
  path.join(process.cwd(), "scripts", "apply-catalog-metadata.mjs"),
  "utf8",
);
const primBlock = metaSrc.match(/CATALOG_PRIMARY = new Set\(\[([\s\S]*?)\]\)/)?.[1] || "";
const primary = [...primBlock.matchAll(/"([^"]+)"/g)].map((m) => m[1]);

function get(url) {
  return new Promise((resolve) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => resolve({ status: res.statusCode, body: d }));
      })
      .on("error", () => resolve({ status: 0, body: "" }));
  });
}

const picked = { ...CARD_HERO_MANUAL };
const failures = [];

for (const slug of primary.sort()) {
  if (CARD_HERO_MANUAL[slug]) continue;

  const entry = PRODUCT_HANDLES[slug];
  if (!entry) {
    failures.push({ slug, reason: "no-handle" });
    continue;
  }

  const { status, body } = await get(
    `${STORES[entry.store]}/products/${entry.handle}.json`,
  );
  await new Promise((r) => setTimeout(r, 100));

  if (status !== 200) {
    failures.push({ slug, reason: `http-${status}` });
    continue;
  }

  let product;
  try {
    product = JSON.parse(body).product;
  } catch {
    failures.push({ slug, reason: "parse" });
    continue;
  }

  const best = pickBestImage(product.images, slug);
  if (!best) {
    failures.push({ slug, reason: "no-image" });
    continue;
  }

  picked[slug] = [best.src];
  console.log(`+ ${slug} → ${best.src.split("/").pop()}`);
}

// Merge into manufacturer-sources DIRECT_GALLERY
const sourcesPath = path.join(process.cwd(), "scripts", "manufacturer-sources.mjs");
let src = fs.readFileSync(sourcesPath, "utf8");

const start = src.indexOf("export const DIRECT_GALLERY = {");
const end = src.indexOf("\n};", start) + 3;
if (start < 0) throw new Error("DIRECT_GALLERY block not found");

const existing = {};
const block = src.slice(start, end);
for (const m of block.matchAll(/"([^"]+)":\s*\[([\s\S]*?)\]/g)) {
  existing[m[1]] = m[2];
}

for (const [slug, urls] of Object.entries(picked)) {
  const lines = urls.map((u) => `    "${u}",`).join("\n");
  existing[slug] = `\n${lines}\n  `;
}

const sortedKeys = Object.keys(existing).sort();
const newBlock =
  "export const DIRECT_GALLERY = {\n" +
  sortedKeys
    .map((slug) => `  "${slug}": [${existing[slug]}],`)
    .join("\n") +
  "\n};\n";

src = src.slice(0, start) + newBlock + src.slice(end);
fs.writeFileSync(sourcesPath, src);

console.log(`\nDIRECT_GALLERY: ${sortedKeys.length} slugs (${primary.length} primary)`);
if (failures.length) {
  console.log("\nFailures:", failures.length);
  failures.forEach((f) => console.log(" ", f.slug, f.reason));
}

if (doFetch) {
  process.env.SLUGS = primary.join(",");
  const { execSync } = await import("child_process");
  execSync("node scripts/fetch-machine-gallery.mjs", {
    stdio: "inherit",
    env: process.env,
  });
  execSync("node scripts/sync-umbrella-card-images.mjs", { stdio: "inherit" });
}
