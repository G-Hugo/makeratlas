/**
 * Patch releaseDate onto machine JSON from scripts/machine-release-dates.mjs
 * Run: node scripts/apply-release-dates.mjs
 */

import fs from "fs";
import path from "path";
import { RELEASE_DATES } from "./machine-release-dates.mjs";

const machinesDir = path.join(process.cwd(), "content", "machines");
let updated = 0;

for (const file of fs.readdirSync(machinesDir).filter((f) => f.endsWith(".json"))) {
  const slug = file.replace(/\.json$/, "");
  const date = RELEASE_DATES[slug];
  if (!date) continue;

  const filePath = path.join(machinesDir, file);
  const machine = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  if (machine.releaseDate === date) continue;

  machine.releaseDate = date;
  fs.writeFileSync(filePath, `${JSON.stringify(machine, null, 2)}\n`);
  updated += 1;
}

console.log(`Updated releaseDate on ${updated} machine profile(s).`);
