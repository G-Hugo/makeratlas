/**
 * Report product lines that still mention multiple wattages without tier profiles.
 * Run: node scripts/audit-missing-power-variants.mjs
 */

import fs from "fs";
import path from "path";

const machinesDir = path.join(process.cwd(), "content", "machines");

const machines = fs
  .readdirSync(machinesDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(machinesDir, f), "utf-8")))
  .filter((m) => m.status === "published");

const EXPECTED_TIERS = {
  "sculpfun-s30-ultra": ["10W", "20W", "22W"],
  "xtool-s1": ["10W", "20W", "40W"],
  "ortur-laser-master-3": ["10W", "20W"],
  "longer-ray5": ["5W", "10W", "20W", "40W"],
  "longer-laser-b1": ["20W", "30W", "40W"],
  "algolaser-alpha-mk2": ["10W", "20W", "40W"],
  "xtool-d1-pro": ["5W", "10W", "20W", "40W"],
  "sculpfun-s9": ["5W", "10W"],
  "sculpfun-icube-pro": ["5W", "10W"],
  "ortur-laser-master-h10": ["10W", "20W", "40W"],
  "twotrees-tts-55": ["10W", "20W", "40W"],
  "two-trees-tts-55-pro": ["10W", "20W"],
  "two-trees-ts2": ["20W", "40W"],
  "atomstack-a40-pro": ["20W", "40W"],
  "creality-falcon2": ["12W", "22W"],
  "creality-falcon2-pro": ["22W", "40W"],
  "gweike-g2": ["20W", "30W", "50W"],
  "gweike-g6-split": ["30W", "50W", "70W", "100W"],
  "monport-gt": ["30W", "50W", "60W", "100W"],
  "atomstack-a5-pro": ["5W", "10W", "20W"],
  "comgrow-z1": ["5W", "10W", "20W"],
  "nubur-n4060": ["20W", "40W"],
};

const issues = [];

for (const [line, expected] of Object.entries(EXPECTED_TIERS)) {
  const tiers = machines.filter(
    (m) => m.modelLine === line && !m.catalogHidden && m.powerRating,
  );
  const have = new Set(tiers.map((t) => t.powerRating));
  const missing = expected.filter((w) => !have.has(w));
  if (missing.length) {
    issues.push({ line, missing, have: [...have] });
  }
}

const multiNoLine = machines.filter((m) => {
  if (m.modelLine || m.catalogHidden) return false;
  const p = m.specs?.power ?? "";
  return /\s\/\s|options|SKUs exist/i.test(p);
});

console.log("=== Expected tier gaps ===");
if (issues.length === 0) console.log("None — all expected tiers present.");
else issues.forEach((i) => console.log(`${i.line}: missing ${i.missing.join(", ")} (have ${i.have.join(", ")})`));

console.log("\n=== Published multi-power, no modelLine ===");
multiNoLine.forEach((m) => console.log(` - ${m.slug}: ${m.specs.power}`));

console.log("\n=== Single-tier model lines ===");
const lines = new Map();
for (const m of machines.filter((x) => x.modelLine && !x.catalogHidden)) {
  const arr = lines.get(m.modelLine) ?? [];
  arr.push(m.slug);
  lines.set(m.modelLine, arr);
}
for (const [line, slugs] of lines) {
  if (slugs.length === 1) console.log(` - ${line}: ${slugs[0]}`);
}

if (issues.length || multiNoLine.length) process.exitCode = 1;
