/** Apply CARD_HERO_MANUAL → DIRECT_GALLERY in manufacturer-sources.mjs */

import fs from "fs";
import path from "path";
import { CARD_HERO_MANUAL } from "./card-hero-manual.mjs";
import { DIRECT_GALLERY } from "./manufacturer-sources.mjs";

const sourcesPath = path.join(process.cwd(), "scripts", "manufacturer-sources.mjs");
const curated = { ...DIRECT_GALLERY };

for (const [slug, urls] of Object.entries(CARD_HERO_MANUAL)) {
  curated[slug] = [...urls];
}

let src = fs.readFileSync(sourcesPath, "utf8");
const start = src.indexOf("export const DIRECT_GALLERY = {");
const end = src.indexOf("\n};", start) + 3;
const sortedKeys = Object.keys(curated).sort();
const newBlock =
  "export const DIRECT_GALLERY = {\n" +
  sortedKeys
    .map((slug) => {
      const lines = curated[slug].map((u) => `    "${u}",`).join("\n");
      return `  "${slug}": [\n${lines}\n  ],`;
    })
    .join("\n") +
  "\n};\n";
fs.writeFileSync(sourcesPath, src.slice(0, start) + newBlock + src.slice(end));
console.log(`Synced ${Object.keys(CARD_HERO_MANUAL).length} manual heroes into DIRECT_GALLERY`);
