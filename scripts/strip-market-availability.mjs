/**
 * Remove marketAvailability fields and used-market price note suffixes.
 * Run: node scripts/strip-market-availability.mjs
 */

import fs from "fs";
import path from "path";

const machinesDir = path.join(process.cwd(), "content", "machines");

const NOTE_SUFFIXES = [
  /\s*Prices reflect typical used-market listings[^.]*\./gi,
  /\s*the manufacturer no longer sells this model new\.?/gi,
  /\s*Used-market pricing[^.]*\./gi,
  /\s*Ortur no longer sells new\.?/gi,
];

function cleanNote(note) {
  if (!note || typeof note !== "string") return note;
  let out = note;
  for (const re of NOTE_SUFFIXES) {
    out = out.replace(re, "").trim();
  }
  return out.length > 0 ? out : undefined;
}

let updated = 0;

for (const file of fs.readdirSync(machinesDir).filter((f) => f.endsWith(".json"))) {
  const filePath = path.join(machinesDir, file);
  const m = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  let changed = false;

  if (m.marketAvailability) {
    delete m.marketAvailability;
    changed = true;
  }
  if (m.marketAvailabilityNote) {
    delete m.marketAvailabilityNote;
    changed = true;
  }

  if (m.priceRange?.note) {
    const cleaned = cleanNote(m.priceRange.note);
    if (cleaned !== m.priceRange.note) {
      if (cleaned) m.priceRange.note = cleaned;
      else delete m.priceRange.note;
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, `${JSON.stringify(m, null, 2)}\n`);
    updated++;
    console.log(m.slug);
  }
}

console.log(`\nUpdated ${updated} files.`);
