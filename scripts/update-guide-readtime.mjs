#!/usr/bin/env node
/**
 * Sync readTime in guide frontmatter from body word count.
 * ~65 words/min for technical reading pace.
 */
import fs from "fs";
import path from "path";

const ROOT = path.join(import.meta.dirname, "..");
const GUIDES = path.join(ROOT, "content", "guides");
const WPM = 65;

function walk(d, acc = []) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p, acc);
    else if (f.endsWith(".md")) acc.push(p);
  }
  return acc;
}

function wordCount(body) {
  return body.split(/\s+/).filter(Boolean).length;
}

function readTimeFromWords(words) {
  const min = Math.max(6, Math.ceil(words / WPM));
  return `${min} min`;
}

let updated = 0;
for (const file of walk(GUIDES)) {
  const raw = fs.readFileSync(file, "utf8");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) continue;
  const [, fm, body] = m;
  const words = wordCount(body);
  const rt = readTimeFromWords(words);
  const oldRt = fm.match(/^readTime:\s*(.+)$/m)?.[1]?.trim();
  if (oldRt === rt) continue;
  const newFm = fm.replace(/^readTime:\s*.+$/m, `readTime: ${rt}`);
  fs.writeFileSync(file, `---\n${newFm}\n---\n${body}`);
  updated++;
  console.log(`${path.relative(ROOT, file)}: ${oldRt} -> ${rt} (${words} words)`);
}
console.log(`\nUpdated ${updated} files.`);
