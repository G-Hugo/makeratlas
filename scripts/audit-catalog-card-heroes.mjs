/**
 * Compare catalog card hero (machine.image → 01.*) vs gallery slots & manual URL.
 * Run: node scripts/audit-catalog-card-heroes.mjs
 */

import fs from "fs";
import path from "path";
import { CARD_HERO_MANUAL } from "./card-hero-manual.mjs";
import { DIRECT_GALLERY } from "./manufacturer-sources.mjs";

const meta = fs.readFileSync("scripts/apply-catalog-metadata.mjs", "utf8");
const primaries = [
  ...meta.match(/CATALOG_PRIMARY = new Set\(\[([\s\S]*?)\]\)/)[1].matchAll(/"([^"]+)"/g),
].map((m) => m[1]);

const machinesDir = path.join(process.cwd(), "content", "machines");
const imagesRoot = path.join(process.cwd(), "public", "machines");

const issues = [];

for (const slug of primaries.sort()) {
  const m = JSON.parse(fs.readFileSync(path.join(machinesDir, `${slug}.json`), "utf8"));
  const manual = CARD_HERO_MANUAL[slug]?.[0]?.split("?")[0] || "";
  const manualName = manual.split("/").pop() || "";
  const cardSrc = m.image || "";
  const gallery0 = m.images?.[0]?.src || "";
  const gallery1 = m.images?.[1]?.src || "";
  const dir = path.join(imagesRoot, slug);
  const files = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => /^\d{2}\./i.test(f)).sort()
    : [];

  const cardFile = cardSrc.match(/\/(\d{2}\.\w+)$/)?.[1] || "";
  const cardBytes = cardFile && fs.existsSync(path.join(dir, cardFile))
    ? fs.statSync(path.join(dir, cardFile)).size
    : 0;
  const secondFile = files.find((f) => f.startsWith("02."));
  const secondBytes = secondFile ? fs.statSync(path.join(dir, secondFile)).size : 0;

  const flags = [];
  if (cardSrc !== gallery0) flags.push("image≠images[0]");
  if (cardFile && cardFile !== "01.webp" && cardFile !== "01.jpg" && cardFile !== "01.png") {
    flags.push(`card-not-01:${cardFile}`);
  }
  if (!cardBytes) flags.push("missing-card-file");
  if (cardBytes > 0 && cardBytes < 12_000) flags.push(`tiny-card:${Math.round(cardBytes / 1024)}kb`);
  if (secondBytes > cardBytes * 1.8 && cardBytes > 0) flags.push("02-larger-than-01");
  if (manual && !manualName) flags.push("no-manual");

  if (flags.length) {
    issues.push({
      slug,
      flags: flags.join(", "),
      card: cardSrc.split("/").pop(),
      g0: gallery0.split("/").pop(),
      g1: gallery1.split("/").pop(),
      manual: manualName,
      kb: Math.round(cardBytes / 1024),
      kb02: secondFile ? Math.round(secondBytes / 1024) : 0,
    });
  }
}

console.log(`Catalog card issues: ${issues.length} / ${primaries.length}\n`);
for (const r of issues) {
  console.log(
    `${r.slug} [${r.flags}] card=${r.card} g0=${r.g0} g1=${r.g1 || "-"} manual=${r.manual || "-"} ${r.kb}kb/${r.kb02}kb`,
  );
}
