/**
 * Remove benchmark/spec lines mistakenly stored in machine pros[].
 * Run: node scripts/editorial-strip-tier-pros.mjs
 */
import fs from "fs";
import path from "path";

const dir = "content/machines";
const patterns = [
  /^Reference engrave job/i,
  /^Reference cut job/i,
  /^Exemple gravure de référence/i,
  /^Exemple découpe de référence/i,
  /^Software:/i,
  /^Logiciels :/i,
  /^Work area .+ on this chassis$/i,
  /^Surface utile .+ sur ce châssis$/i,
];

let files = 0;
let removed = 0;
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json"))) {
  const p = path.join(dir, f);
  const m = JSON.parse(fs.readFileSync(p, "utf8"));
  if (!m.pros) continue;
  const before = m.pros.length;
  m.pros = m.pros.filter((line) => !patterns.some((rx) => rx.test(line.trim())));
  if (m.pros.length !== before) {
    fs.writeFileSync(p, `${JSON.stringify(m, null, 2)}\n`, "utf8");
    files++;
    removed += before - m.pros.length;
  }
}
console.log({ filesUpdated: files, linesRemoved: removed });
