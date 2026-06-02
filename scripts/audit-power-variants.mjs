/**
 * Audit: every published machine should have powerRating OR be catalogHidden umbrella.
 * Multi-tier lines should have 2+ visible tiers.
 * Run: node scripts/audit-power-variants.mjs
 */

import fs from "fs";
import path from "path";

const machinesDir = path.join(process.cwd(), "content", "machines");
const machines = fs
  .readdirSync(machinesDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(machinesDir, f), "utf-8")));

const published = machines.filter((m) => m.status === "published");
const issues = [];

for (const m of published) {
  if (!m.catalogHidden && !m.powerRating && !m.modelLine) {
    issues.push(`missing powerRating: ${m.slug}`);
  }
  const multiInSpecs = /\s\/\s|options|SKUs exist/i.test(m.specs?.power || "");
  if (multiInSpecs && !m.modelLine && !m.catalogHidden) {
    issues.push(`multi-power specs but no modelLine: ${m.slug} (${m.specs.power})`);
  }
}

const lines = new Map();
for (const m of published.filter((x) => x.modelLine && !x.catalogHidden)) {
  const arr = lines.get(m.modelLine) || [];
  arr.push(m.slug);
  lines.set(m.modelLine, arr);
}

for (const [line, slugs] of lines) {
  if (slugs.length < 2 && !line.startsWith("commarker-omni-1")) {
    issues.push(`modelLine ${line} only has one visible tier: ${slugs.join(", ")}`);
  }
  const primary = slugs.filter((s) => {
    const m = published.find((x) => x.slug === s);
    return m?.catalogPrimary;
  });
  if (primary.length !== 1) issues.push(`modelLine ${line}: expected 1 catalogPrimary, got ${primary.length} (${primary.join(", ") || "none"})`);
}

const hiddenUmbrellas = published.filter((m) => m.catalogHidden);
for (const m of hiddenUmbrellas) {
  if (!m.modelLine) issues.push(`catalogHidden without modelLine: ${m.slug}`);
}

console.log("Published machines:", published.length);
console.log("Model lines:", lines.size);
console.log("Catalog browse entries (approx):", lines.size + published.filter((m) => !m.modelLine && !m.catalogHidden).length);

if (issues.length === 0) {
  console.log("OK — no audit issues.");
} else {
  console.log("\nIssues (" + issues.length + "):");
  issues.forEach((i) => console.log(" -", i));
  process.exitCode = 1;
}
