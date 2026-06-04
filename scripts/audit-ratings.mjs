/**
 * Audit rating coherence: tier steps, spread, outliers.
 * Run: node scripts/audit-ratings.mjs
 */
import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "content", "machines");

function parseWatts(m) {
  const t = m.powerRating ?? m.specs?.power ?? "";
  const match = String(t).match(/(\d+(?:\.\d+)?)\s*W/i);
  return match ? Number(match[1]) : null;
}

function load() {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8")))
    .filter((m) => m.status === "published" && !m.catalogHidden);
}

const machines = load();
const issues = [];

const overalls = machines.map((m) => m.rating.overall);
console.log(
  `Overall: ${Math.min(...overalls).toFixed(1)} – ${Math.max(...overalls).toFixed(1)} (avg ${(overalls.reduce((a, b) => a + b) / overalls.length).toFixed(2)})`,
);

const byLine = new Map();
for (const m of machines) {
  if (!m.modelLine) continue;
  const list = byLine.get(m.modelLine) ?? [];
  list.push(m);
  byLine.set(m.modelLine, list);
}

for (const [line, tiers] of byLine) {
  const rated = tiers
    .map((m) => ({
      slug: m.slug,
      w: parseWatts(m),
      cap: m.rating?.capability,
      overall: m.rating?.overall,
      value: m.rating?.value,
    }))
    .filter((x) => x.w != null && x.cap != null)
    .sort((a, b) => a.w - b.w);
  if (rated.length < 2) continue;

  for (let i = 1; i < rated.length; i++) {
    const step = rated[i].cap - rated[i - 1].cap;
    if (step < 0) {
      issues.push({ type: "cap-inversion", line, lower: rated[i - 1], higher: rated[i] });
    } else if (step > 0.45) {
      issues.push({ type: "cap-big-step", line, step: step.toFixed(1), lower: rated[i - 1], higher: rated[i] });
    }
  }
}

for (const m of machines) {
  const r = m.rating;
  if (!r) continue;
  if (r.overall > r.capability + 0.9) {
    issues.push({ type: "overall-above-cap", slug: m.slug, overall: r.overall, cap: r.capability });
  }
  if (r.value > r.overall + 1.2) {
    issues.push({ type: "value-outlier-high", slug: m.slug, value: r.value, overall: r.overall });
  }
  if (r.capability > r.buildQuality + 1.5) {
    issues.push({ type: "cap-vs-build-gap", slug: m.slug, cap: r.capability, build: r.buildQuality });
  }
}

const byType = {};
for (const i of issues) byType[i.type] = (byType[i.type] ?? 0) + 1;

console.log(`Issues: ${issues.length}`);
for (const [t, c] of Object.entries(byType).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${t}: ${c}`);
}

for (const type of ["cap-inversion", "cap-big-step", "overall-above-cap"]) {
  const list = issues.filter((i) => i.type === type);
  if (!list.length) continue;
  console.log(`\n--- ${type} (up to 6) ---`);
  for (const i of list.slice(0, 6)) {
    if (i.lower) console.log(`  ${i.line}: ${i.lower.slug} ${i.lower.cap} → ${i.higher.slug} ${i.higher.cap} (+${i.step ?? ""})`);
    else console.log(`  ${JSON.stringify(i)}`);
  }
}

process.exit(issues.filter((i) => i.type === "cap-inversion").length > 0 ? 1 : 0);
