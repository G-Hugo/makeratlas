/**
 * Migrates machine JSON to new performance + image + mainObjective schema.
 * Run once: node scripts/migrate-machines.mjs
 */

import fs from "fs";
import path from "path";

const machinesDir = path.join(process.cwd(), "content", "machines");

/** @type {Record<string, { mainObjective: string, performance: object }>} */
const OVERRIDES = {
  "xtool-d1-pro": {
    mainObjective: "Hobby engraving on wood, leather & coated metal with light cutting",
    performance: {
      precision: "0.01 mm",
      spotSize: "~0.08 mm spot at focus",
      maxSpeed: "400 mm/s",
      avgEngraveSpeed: "80–180 mm/s (wood fill)",
      avgCutSpeed: "4–12 mm/s (3 mm basswood, multi-pass)",
    },
  },
  "xtool-p2": {
    mainObjective: "Professional cutting of acrylic, wood & leather for small businesses",
    performance: {
      precision: "0.01 mm",
      spotSize: "~0.15 mm CO₂ spot",
      maxSpeed: "600 mm/s",
      avgEngraveSpeed: "150–300 mm/s (wood/acrylic fill)",
      avgCutSpeed: "15–40 mm/s (3 mm acrylic, single pass)",
    },
  },
  "xtool-f1-ultra": {
    mainObjective: "Direct bare-metal marking for jewelry, tools & personalization",
    performance: {
      precision: "0.00199 mm",
      spotSize: "~0.02 mm fiber spot",
      maxSpeed: "15,000 mm/s",
      avgEngraveSpeed: "500–2,000 mm/s (metal marking)",
      avgCutSpeed: "Not designed for cutting",
    },
  },
  "xtool-s1": {
    mainObjective: "Safer enclosed home engraving with cleaner smoke control",
    performance: {
      precision: "0.01 mm",
      spotSize: "~0.08 mm spot at focus",
      maxSpeed: "400 mm/s",
      avgEngraveSpeed: "80–180 mm/s (wood fill)",
      avgCutSpeed: "4–12 mm/s (3 mm basswood, multi-pass)",
    },
  },
  "xtool-m1-ultra": {
    mainObjective: "Vinyl & paper cutting plus light laser engraving in one machine",
    performance: {
      precision: "0.01 mm",
      spotSize: "~0.08 mm laser spot",
      maxSpeed: "400 mm/s",
      avgEngraveSpeed: "60–120 mm/s (wood fill)",
      avgCutSpeed: "Blade: 30–80 mm/s · Laser: 3–8 mm/s thin wood",
    },
  },
  "ortur-laser-master-3": {
    mainObjective: "Best-value first laser for wood engraving & learning the craft",
    performance: {
      precision: "0.01 mm",
      spotSize: "~0.1 mm spot at focus",
      maxSpeed: "333 mm/s",
      avgEngraveSpeed: "70–150 mm/s (wood fill)",
      avgCutSpeed: "3–10 mm/s (3 mm basswood, multi-pass)",
    },
  },
  "sculpfun-s30-ultra": {
    mainObjective: "Strong diode cutting & engraving without CO₂ pricing",
    performance: {
      precision: "0.01 mm",
      spotSize: "~0.08 mm compressed beam",
      maxSpeed: "167 mm/s",
      avgEngraveSpeed: "80–160 mm/s (wood fill)",
      avgCutSpeed: "5–14 mm/s (3–6 mm basswood, multi-pass)",
    },
  },
  "atomstack-a5-pro": {
    mainObjective: "Cheapest entry point to try laser engraving at home",
    performance: {
      precision: "0.01 mm",
      spotSize: "~0.1 mm spot at focus",
      maxSpeed: "200 mm/s",
      avgEngraveSpeed: "50–120 mm/s (wood fill)",
      avgCutSpeed: "2–6 mm/s (2–3 mm basswood, multi-pass)",
    },
  },
  "glowforge-aura": {
    mainObjective: "Easiest CO₂ setup for crafters who want zero tinkering",
    performance: {
      precision: "0.025 mm",
      spotSize: "~0.2 mm CO₂ spot",
      maxSpeed: "300 mm/s",
      avgEngraveSpeed: "100–200 mm/s (thin wood fill)",
      avgCutSpeed: "8–20 mm/s (3 mm plywood, single pass)",
    },
  },
  "omtech-40w-co2": {
    mainObjective: "Budget CO₂ cutting for makers willing to upgrade and maintain",
    performance: {
      precision: "0.01 mm",
      spotSize: "~0.2 mm CO₂ spot",
      maxSpeed: "400 mm/s",
      avgEngraveSpeed: "120–250 mm/s (wood fill)",
      avgCutSpeed: "10–30 mm/s (3 mm acrylic, single pass)",
    },
  },
  "monport-55w-co2": {
    mainObjective: "Mid-range CO₂ production for signs, acrylic & wood shops",
    performance: {
      precision: "0.01 mm",
      spotSize: "~0.15 mm CO₂ spot",
      maxSpeed: "500 mm/s",
      avgEngraveSpeed: "150–300 mm/s (wood/acrylic fill)",
      avgCutSpeed: "15–45 mm/s (3 mm acrylic, single pass)",
    },
  },
  "creality-falcon2-pro": {
    mainObjective: "High-power diode with built-in air assist & color metal effects",
    performance: {
      precision: "0.01 mm",
      spotSize: "~0.06 mm compressed spot",
      maxSpeed: "417 mm/s",
      avgEngraveSpeed: "90–180 mm/s (wood fill)",
      avgCutSpeed: "6–15 mm/s (3–6 mm basswood, multi-pass)",
    },
  },
  "longer-ray5": {
    mainObjective: "Compact desk engraver for small wood & leather gifts",
    performance: {
      precision: "0.01 mm",
      spotSize: "~0.1 mm spot at focus",
      maxSpeed: "200 mm/s",
      avgEngraveSpeed: "60–130 mm/s (wood fill)",
      avgCutSpeed: "3–8 mm/s (2–4 mm basswood, multi-pass)",
    },
  },
  "laserpecker-4": {
    mainObjective: "Portable on-site engraving for events and small items",
    performance: {
      precision: "0.05 mm",
      spotSize: "~0.12 mm portable spot",
      maxSpeed: "200 mm/s",
      avgEngraveSpeed: "30–80 mm/s (small wood items)",
      avgCutSpeed: "Not designed for cutting",
    },
  },
  "wecreat-vision": {
    mainObjective: "AI-guided enclosed engraving for visual, beginner-friendly workflow",
    performance: {
      precision: "0.01 mm",
      spotSize: "~0.08 mm spot at focus",
      maxSpeed: "350 mm/s",
      avgEngraveSpeed: "75–160 mm/s (wood fill)",
      avgCutSpeed: "4–10 mm/s (3 mm basswood, multi-pass)",
    },
  },
};

for (const file of fs.readdirSync(machinesDir).filter((f) => f.endsWith(".json"))) {
  const filePath = path.join(machinesDir, file);
  const machine = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const override = OVERRIDES[machine.slug];

  if (!override) {
    console.warn(`No override for ${machine.slug}, skipping`);
    continue;
  }

  machine.image = `/machines/${machine.slug}.svg`;
  machine.mainObjective = override.mainObjective;

  const { speed, precision, ...restSpecs } = machine.specs;
  machine.specs = {
    ...restSpecs,
    performance: override.performance,
  };

  fs.writeFileSync(filePath, JSON.stringify(machine, null, 2) + "\n");
  console.log(`Migrated ${machine.slug}`);
}

console.log("Migration complete.");
