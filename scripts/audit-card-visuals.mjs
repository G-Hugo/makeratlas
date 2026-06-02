/**
 * Visual heuristics for card heroes (aspect ratio, size, duplicates).
 * Run: node scripts/audit-card-visuals.mjs
 */

import fs from "fs";
import path from "path";
import sharp from "sharp";
import crypto from "crypto";

const machinesDir = path.join(process.cwd(), "content", "machines");
const imagesRoot = path.join(process.cwd(), "public", "machines");
const metaSrc = fs.readFileSync(
  path.join(process.cwd(), "scripts", "apply-catalog-metadata.mjs"),
  "utf8",
);
const primBlock = metaSrc.match(/CATALOG_PRIMARY = new Set\(\[([\s\S]*?)\]\)/)?.[1] || "";
const primary = [...primBlock.matchAll(/"([^"]+)"/g)].map((m) => m[1]);

const hashes = new Map();
const rows = [];

for (const slug of primary) {
  const heroPath = path.join(imagesRoot, slug, "01.webp");
  if (!fs.existsSync(heroPath)) {
    rows.push({ slug, issue: "missing-01.webp" });
    continue;
  }
  const buf = fs.readFileSync(heroPath);
  const hash = crypto.createHash("md5").update(buf).digest("hex").slice(0, 8);
  if (!hashes.has(hash)) hashes.set(hash, []);
  hashes.get(hash).push(slug);

  const meta = await sharp(buf).metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  const aspect = w / h;
  const cardAspect = 16 / 10;
  const mismatch = Math.abs(aspect - cardAspect) > 0.35;
  const tall = h > w * 1.15;
  const tiny = buf.length < 15_000;
  const issues = [];
  if (mismatch) issues.push(`aspect-${aspect.toFixed(2)}`);
  if (tall) issues.push("tall-source");
  if (tiny) issues.push(`small-${Math.round(buf.length / 1024)}kb`);
  if (issues.length) rows.push({ slug, w, h, kb: Math.round(buf.length / 1024), issues });
}

console.log("Visual flags:", rows.length);
for (const r of rows.sort((a, b) => a.slug.localeCompare(b.slug))) {
  console.log(r.slug, r.issues?.join(" ") || r.issue, r.w ? `${r.w}x${r.h}` : "", r.kb ? `${r.kb}kb` : "");
}

console.log("\nDuplicate heroes (same file hash):");
for (const [hash, slugs] of hashes) {
  if (slugs.length > 1) console.log(hash, slugs.join(", "));
}
