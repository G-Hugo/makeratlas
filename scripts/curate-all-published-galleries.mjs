/**
 * Curate DIRECT_GALLERY URLs for every published machine (OEM product shots).
 * Respects CARD_HERO_MANUAL. Run before fetch-machine-gallery.
 *
 * node scripts/curate-all-published-galleries.mjs
 */

import fs from "fs";
import path from "path";
import https from "https";
import { CARD_HERO_MANUAL } from "./card-hero-manual.mjs";
import { DIRECT_GALLERY, STORES } from "./manufacturer-sources.mjs";
import { buildMachineGalleryUrls } from "./pick-machine-product-image.mjs";
import { filterRemoteImages } from "./gallery-filter.mjs";
import { resolveProductHandleEntry } from "./resolve-product-handle.mjs";

const machinesDir = path.join(process.cwd(), "content", "machines");
const sourcesPath = path.join(process.cwd(), "scripts", "manufacturer-sources.mjs");

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

const published = fs
  .readdirSync(machinesDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => {
    const m = JSON.parse(fs.readFileSync(path.join(machinesDir, f), "utf8"));
    return m.status === "published" ? m : null;
  })
  .filter(Boolean)
  .sort((a, b) => a.slug.localeCompare(b.slug));

const curated = { ...DIRECT_GALLERY };
const failures = [];

for (const machine of published) {
  const { slug, name, brand } = machine;

  const entry = resolveProductHandleEntry(slug, machine);
  if (!entry) {
    if (!curated[slug]?.length) failures.push({ slug, reason: "no-handle" });
    continue;
  }

  const { status, body } = await get(
    `${STORES[entry.store]}/products/${entry.handle}.json`,
  );
  await new Promise((r) => setTimeout(r, 120));

  if (status !== 200) {
    if (!curated[slug]?.length) failures.push({ slug, reason: `http-${status}` });
    continue;
  }

  let product;
  try {
    product = JSON.parse(body).product;
  } catch {
    failures.push({ slug, reason: "parse" });
    continue;
  }

  const ctx = { name, brand };
  const raw = (product.images || [])
    .map((img) => ({ src: img.src?.split("?")[0], alt: img.alt || null }))
    .filter((img) => img.src);

  let urls = buildMachineGalleryUrls(
    raw,
    slug,
    ctx,
    4,
    CARD_HERO_MANUAL[slug] || [],
  );

  if (urls.length < 4) {
    const filtered = filterRemoteImages(raw, slug, name, brand);
    for (const img of filtered) {
      if (!urls.includes(img.src)) urls.push(img.src);
      if (urls.length >= 4) break;
    }
  }

  if (!urls.length) {
    if (!curated[slug]?.length) failures.push({ slug, reason: "no-hero" });
    continue;
  }

  curated[slug] = urls;
  console.log(`✓ ${slug} (${urls.length} url(s))`);
}

let src = fs.readFileSync(sourcesPath, "utf8");
const start = src.indexOf("export const DIRECT_GALLERY = {");
const end = src.indexOf("\n};", start) + 3;
if (start < 0) throw new Error("DIRECT_GALLERY block not found");

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

src = src.slice(0, start) + newBlock + src.slice(end);
fs.writeFileSync(sourcesPath, src);

console.log(`\nDIRECT_GALLERY: ${sortedKeys.length} slugs`);
console.log(`Published curated: ${published.length}`);
if (failures.length) {
  console.log(`Failures (kept previous URLs if any): ${failures.length}`);
  failures.slice(0, 25).forEach((f) => console.log(" ", f.slug, f.reason));
}
