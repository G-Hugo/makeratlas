/**
 * Audit published machine images after refresh.
 * node scripts/audit-published-images.mjs
 */

import fs from "fs";
import path from "path";

const machinesDir = path.join(process.cwd(), "content", "machines");
const SUSPICIOUS = /bundle|gift|promo|comparison|infographic|accessory only/i;

let published = 0;
const issues = [];

for (const f of fs.readdirSync(machinesDir).filter((x) => x.endsWith(".json"))) {
  const m = JSON.parse(fs.readFileSync(path.join(machinesDir, f), "utf8"));
  if (m.status !== "published") continue;
  published += 1;

  const slug = m.slug;
  const img = m.image || "";
  const first = m.images?.[0]?.src || "";
  const rel = img.replace(/^\//, "");
  const disk = path.join(process.cwd(), "public", rel);
  const flags = [];

  if (img !== first) flags.push("hero-mismatch");
  if (!fs.existsSync(disk)) flags.push("missing-file");
  if (!img.includes(`/${slug}/`)) flags.push("bad-path");
  if (SUSPICIOUS.test(m.images?.[0]?.alt || "") || SUSPICIOUS.test(rel)) flags.push("suspicious");

  if (flags.length) issues.push({ slug, flags, img });
}

console.log(`Published: ${published}`);
console.log(`With issues: ${issues.length}`);
for (const r of issues.slice(0, 40)) {
  console.log(r.slug, r.flags.join(","), r.img);
}
if (issues.length > 40) console.log(`… and ${issues.length - 40} more`);

if (issues.some((r) => r.flags.includes("missing-file") || r.flags.includes("hero-mismatch"))) {
  process.exit(1);
}
