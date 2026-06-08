import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../content/guides/fr");

const fixes = [
  [/air-assist-table alvéolée-setup/g, "air-assist-honeycomb-setup"],
  [/lightburn-vs-bricoleur-software/g, "lightburn-vs-maker-software"],
  [/slug: air-assist-table alvéolée-setup/g, "slug: air-assist-honeycomb-setup"],
  [/bon installation/g, "bonne installation"],
  [/Job supervisé/g, "Travail supervisé"],
  [/en cours de passage/g, "pendant un travail en cours"],
  [/avant le premier passage/g, "avant le premier travail"],
  [/Checklist avant le premier passage/g, "Checklist avant le premier travail"],
  [/plateau table alvéolée/g, "table alvéolée"],
  [/Soufflage d'air et plateau table alvéolée/g, "Soufflage d'air et table alvéolée"],
];

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
  let c = fs.readFileSync(path.join(dir, file), "utf8");
  for (const [a, b] of fixes) c = c.replace(a, b);
  fs.writeFileSync(path.join(dir, file), c);
}
console.log("links fixed");
