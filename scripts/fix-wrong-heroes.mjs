/**
 * Re-curate + re-download heroes for machines with non-product OEM images.
 * Run: node scripts/fix-wrong-heroes.mjs
 */

import fs from "fs";
import path from "path";
import https from "https";
import { execSync } from "child_process";
import { CARD_HERO_MANUAL } from "./card-hero-manual.mjs";
import { DIRECT_GALLERY, STORES } from "./manufacturer-sources.mjs";
import {
  pickMachineGallery,
  pickMachineProductImage,
  scoreMachineImage,
} from "./pick-machine-product-image.mjs";
import { resolveProductHandleEntry } from "./resolve-product-handle.mjs";

const machinesDir = path.join(process.cwd(), "content", "machines");
const sourcesPath = path.join(process.cwd(), "scripts", "manufacturer-sources.mjs");

const BAD_CURRENT =
  /bundle|hub\.jpg|_hub\.|Basic_Pack|refurbish|selling_points|GT30Bundle|6w_|cuttingcreality|with_Air_Assist|official-refurbished|laserengravercutter.*cutting/i;

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

function needsFix(slug, machine) {
  if (CARD_HERO_MANUAL[slug]?.length) {
    const u = CARD_HERO_MANUAL[slug][0];
    return scoreMachineImage(u, slug, "", { name: machine.name, brand: machine.brand }) < 45;
  }
  const cur = DIRECT_GALLERY[slug]?.[0] || "";
  if (!cur) return true;
  if (BAD_CURRENT.test(cur)) return true;
  return scoreMachineImage(cur, slug, "", { name: machine.name, brand: machine.brand }) < 45;
}

const published = fs
  .readdirSync(machinesDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(machinesDir, f), "utf8")))
  .filter((m) => m.status === "published");

const toFix = published.filter((m) => needsFix(m.slug, m));
console.log(`Re-picking OEM images for ${toFix.length} machines…\n`);

const curated = { ...DIRECT_GALLERY };
const failed = [];

for (const machine of toFix) {
  const { slug, name, brand } = machine;

  if (CARD_HERO_MANUAL[slug]?.length && !needsFix(slug, machine)) {
    curated[slug] = [...CARD_HERO_MANUAL[slug]];
    continue;
  }

  const entry = resolveProductHandleEntry(slug, machine);
  if (!entry) {
    failed.push({ slug, reason: "no-handle" });
    continue;
  }

  const { status, body } = await get(
    `${STORES[entry.store]}/products/${entry.handle}.json`,
  );
  await new Promise((r) => setTimeout(r, 120));

  if (status !== 200) {
    failed.push({ slug, reason: `http-${status}` });
    continue;
  }

  let product;
  try {
    product = JSON.parse(body).product;
  } catch {
    failed.push({ slug, reason: "parse" });
    continue;
  }

  const ctx = { name, brand };
  const urls = pickMachineGallery(product.images || [], slug, ctx, 4);
  const hero = pickMachineProductImage(product.images || [], slug, ctx);

  if (!hero?.src && urls.length === 0) {
    failed.push({ slug, reason: "no-pick" });
    continue;
  }

  curated[slug] = urls.length ? urls : [hero.src];
  console.log(`✓ ${slug} → ${curated[slug][0].split("/").pop()}`);
}

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

const slugs = toFix.map((m) => m.slug).join(",");
if (slugs) {
  execSync("node scripts/fetch-machine-gallery.mjs", {
    stdio: "inherit",
    env: { ...process.env, SLUGS: slugs },
  });
  execSync("node scripts/sync-machine-hero-image.mjs", { stdio: "inherit" });
  execSync("node scripts/sync-umbrella-card-images.mjs", { stdio: "inherit" });
}

console.log(`\nFailed: ${failed.length}`);
failed.forEach((f) => console.log(" ", f.slug, f.reason));
