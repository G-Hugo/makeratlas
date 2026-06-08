/**
 * Remove em-dash "AI voice" patterns from guides and EN machine JSON.
 * Run: node scripts/polish-guide-prose.mjs
 */
import fs from "fs";
import path from "path";

const root = process.cwd();

function polishText(text) {
  let t = text;
  t = t.replace(/\*\*([^*]+)\*\* — /g, "**$1**: ");
  t = t.replace(/^(\s*[-*] [^\n]*?) — /gm, "$1: ");
  t = t.replace(/ — /g, ", ");
  t = t.replace(/—/g, ", ");
  t = t.replace(/, ,/g, ",");
  t = t.replace(/,\s*,/g, ",");
  t = t.replace(/:\s*,/g, ":");
  return t;
}

function walkMd(dir) {
  let n = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      n += walkMd(p);
    } else if (entry.name.endsWith(".md")) {
      const raw = fs.readFileSync(p, "utf8");
      const next = polishText(raw);
      if (next !== raw) {
        fs.writeFileSync(p, next);
        n++;
      }
    }
  }
  return n;
}

function polishEnMachines() {
  const dir = path.join(root, "content", "machines");
  let n = 0;
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".json")) continue;
    const p = path.join(dir, file);
    const raw = fs.readFileSync(p, "utf8");
    const next = raw.replace(/ : /g, ": ");
    if (next !== raw) {
      fs.writeFileSync(p, next);
      n++;
    }
  }
  return n;
}

const md = walkMd(path.join(root, "content", "guides"));
const machines = polishEnMachines();
console.log(`Polished ${md} guide files, ${machines} EN machine JSON files.`);
