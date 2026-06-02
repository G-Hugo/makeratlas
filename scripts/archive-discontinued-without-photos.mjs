/**
 * Archive discontinued machines that still use SVG placeholders and have no
 * verifiable manufacturer product page (delisted entirely, not just a SKU refresh).
 *
 * Run: node scripts/archive-discontinued-without-photos.mjs
 */

import fs from "fs";
import path from "path";

const machinesDir = path.join(process.cwd(), "content", "machines");

/** Confirmed delisted — no working OEM store listing when last checked (2026-06) */
const VERIFIED_DELISTED = new Set([
  "hawk-20",
  "htouroy-40w",
  "nubur-n4060",
  "nubur-n4060-20w",
  "nubur-n4060-40w",
]);

function isPlaceholderImage(src) {
  return typeof src === "string" && src.endsWith(".svg");
}

function shouldArchive(machine) {
  if (machine.status !== "published") return false;
  if (machine.marketAvailability !== "discontinued") return false;
  if (!isPlaceholderImage(machine.image)) return false;
  if (!VERIFIED_DELISTED.has(machine.slug)) return false;
  return true;
}

let archived = 0;

for (const file of fs.readdirSync(machinesDir).filter((f) => f.endsWith(".json"))) {
  const filePath = path.join(machinesDir, file);
  const machine = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  if (!shouldArchive(machine)) continue;

  machine.status = "archived";
  machine.lastUpdated = "2026-06-01";
  delete machine.catalogPrimary;
  delete machine.catalogHidden;

  fs.writeFileSync(filePath, `${JSON.stringify(machine, null, 2)}\n`);
  console.log(`archived: ${machine.slug}`);
  archived += 1;
}

console.log(`Done. ${archived} profile(s) removed from the public catalog.`);
