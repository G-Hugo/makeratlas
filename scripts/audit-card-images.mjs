/**
 * Audit catalog card hero images for published primary machines.
 * Run: node scripts/audit-card-images.mjs
 */

import fs from "fs";
import path from "path";

const machinesDir = path.join(process.cwd(), "content", "machines");
const imagesRoot = path.join(process.cwd(), "public", "machines");
const metaSrc = fs.readFileSync(
  path.join(process.cwd(), "scripts", "apply-catalog-metadata.mjs"),
  "utf8",
);
const primBlock = metaSrc.match(/CATALOG_PRIMARY = new Set\(\[([\s\S]*?)\]\)/)?.[1] || "";
const primary = [...primBlock.matchAll(/"([^"]+)"/g)].map((m) => m[1]);

const SUSPICIOUS_ALT = /bundle|gift|promo|sale|vs\.|comparison|selling.?point|national|christmas|valentine|free.?gift|collection-1600/i;

const rows = [];

for (const slug of primary.sort()) {
  const file = path.join(machinesDir, `${slug}.json`);
  if (!fs.existsSync(file)) {
    rows.push({ slug, issue: "missing-json" });
    continue;
  }
  const m = JSON.parse(fs.readFileSync(file, "utf8"));
  const img = m.image || "";
  const rel = img.replace(/^\//, "").split("?")[0];
  const abs = path.join(process.cwd(), "public", rel);
  const heroDir = path.join(imagesRoot, slug);
  const has01webp = fs.existsSync(path.join(heroDir, "01.webp"));
  const has01jpg =
    fs.existsSync(path.join(heroDir, "01.jpg")) ||
    fs.existsSync(path.join(heroDir, "01.jpeg")) ||
    fs.existsSync(path.join(heroDir, "01.png"));
  const bytes = fs.existsSync(abs) ? fs.statSync(abs).size : 0;
  const alt0 = m.images?.[0]?.alt || "";
  const issues = [];
  if (img.endsWith(".svg")) issues.push("svg");
  if (!has01webp && !has01jpg && !fs.existsSync(abs)) issues.push("no-hero-file");
  if (!img.includes("/01.")) issues.push("image-path-not-hero");
  if (bytes > 0 && bytes < 12_000) issues.push("tiny-hero");
  if (SUSPICIOUS_ALT.test(alt0)) issues.push("suspicious-alt");
  if (!img.includes("/01.webp") && (has01jpg || has01webp)) issues.push("needs-webp-refresh");
  if (issues.length) rows.push({ slug, img, bytes, alt0: alt0.slice(0, 60), issues });
}

console.log(`Primary machines: ${primary.length}`);
console.log(`With issues: ${rows.length}\n`);
for (const r of rows) {
  console.log(r.slug, r.issues.join(","), r.bytes ? `${Math.round(r.bytes / 1024)}kb` : "", r.img);
  if (r.alt0) console.log("  alt:", r.alt0);
}
