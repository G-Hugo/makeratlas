/**
 * Re-publish archived machines as discontinued (still on site, not sold new).
 * Run: node scripts/republish-discontinued.mjs
 */

import fs from "fs";
import path from "path";

const machinesDir = path.join(process.cwd(), "content", "machines");

/** Machines no longer sold new by the manufacturer */
const DISCONTINUED_SLUGS = [
  "xtool-d1-pro",
  "xtool-p2",
  "glowforge-pro",
  "atomstack-a5-pro",
  "atomstack-a20-pro",
  "atezr-p2",
  "comgrow-z1",
  "sculpfun-s30-ultra",
  "ortur-laser-master-3",
];

const UMBRELLA_MODEL_LINE = {
  "sculpfun-s30-ultra": "sculpfun-s30-ultra",
  "ortur-laser-master-3": "ortur-laser-master-3",
};

const UMBRELLA_NOTES = {
  "sculpfun-s30-ultra":
    "Sculpfun no longer sells this combined listing — choose a specific power tier: 10W, 20W, or 22W (current SKUs). Older bundled listings may appear used on marketplaces.",
  "ortur-laser-master-3":
    "Ortur now sells the Laser Master 3 as separate 10W and 20W SKUs. Used LM3 machines are common on second-hand marketplaces — verify the optical power before buying.",
};

function defaultNote(brand, name) {
  return `${brand} no longer sells the ${name} as a new product. You may still find used units on eBay, Facebook Marketplace, Craigslist, and similar — verify condition, firmware, and accessories before buying.`;
}

for (const slug of DISCONTINUED_SLUGS) {
  const filePath = path.join(machinesDir, `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    console.warn(`skip missing: ${slug}`);
    continue;
  }

  const m = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  m.status = "published";
  m.marketAvailability = "discontinued";
  m.marketAvailabilityNote = UMBRELLA_NOTES[slug] ?? defaultNote(m.brand, m.name);
  if (UMBRELLA_MODEL_LINE[slug]) m.modelLine = UMBRELLA_MODEL_LINE[slug];
  m.lastUpdated = "2026-06-01";

  if (m.priceRange) {
    const usedHint =
      "Prices reflect typical used-market listings; the manufacturer no longer sells this model new.";
    m.priceRange.note = m.priceRange.note
      ? `${m.priceRange.note} ${usedHint}`
      : usedHint;
  }

  fs.writeFileSync(filePath, `${JSON.stringify(m, null, 2)}\n`);
  console.log(`republished discontinued: ${slug}`);
}

console.log("Done.");
