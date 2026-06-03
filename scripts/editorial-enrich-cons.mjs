/**
 * Add buyer-facing cons to published tier profiles with fewer than 3 cons.
 * Run: node scripts/editorial-enrich-cons.mjs
 */
import fs from "fs";
import path from "path";

const dir = "content/machines";
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));

const pools = {
  diode: [
    "Clear cast acrylic and thick production cutting still favor CO₂, not diode power alone",
    "Deep hardwood cuts need multiple slow passes, air assist, and realistic customer quotes",
    "Optical wattage on listings varies by SKU: confirm the exact module before you buy",
    "Open-frame machines need your own eye protection, exhaust, and workspace rules",
    "Enclosed diode bundles still need filter maintenance or ducting for frequent cutting",
  ],
  co2: [
    "Ventilation to the outside is mandatory for regular cutting, not an optional upgrade",
    "Tube life and replacement cost are part of the true ownership budget",
    "Footprint and weight make this a fixed workshop machine, not a portable engraver",
  ],
  fiber: [
    "Does not cut wood, leather, or acrylic: metal and industrial marking workflows only",
    "Fume extraction still matters for coated metals, plastics, and marking sprays",
    "Rotary work and fixturing are often extra cost when you quote cylinder jobs",
    "Higher wattage tiers on the same chassis mainly help speed on large metal batches",
  ],
  uv: [
    "Material compatibility is narrow: verify substrates with the vendor before quoting jobs",
    "Consumables and maintenance differ from diode or CO₂ workflows",
    "Production throughput is usually lower than fiber for the same shop floor space",
  ],
  hybrid: [
    "You are paying for two workflows: learn both diode and infrared limits before buying",
    "Not a replacement for CO₂ if clear acrylic cutting is your main revenue",
    "Bundle pricing can hide which module is included: read the SKU carefully",
  ],
};

function pickExtras(machine, existing) {
  const type = machine.laserType ?? "diode";
  const pool = pools[type] ?? pools.diode;
  const out = [];
  const joined = existing.join(" ").toLowerCase();
  for (const line of pool) {
    if (out.length >= 3 - existing.length) break;
    const key = line.slice(0, 36).toLowerCase();
    if (joined.includes(key)) continue;
    out.push(line);
  }
  return out;
}

let updated = 0;
for (const file of files) {
  const p = path.join(dir, file);
  const machine = JSON.parse(fs.readFileSync(p, "utf8"));
  if (machine.catalogHidden || machine.status !== "published") continue;
  const cons = [...(machine.cons ?? [])];
  if (cons.length >= 3) continue;
  const extras = pickExtras(machine, cons);
  if (extras.length === 0) continue;
  machine.cons = [...cons, ...extras].slice(0, 5);
  fs.writeFileSync(p, `${JSON.stringify(machine, null, 2)}\n`, "utf8");
  updated++;
}
console.log(`Updated ${updated} machine profiles.`);
