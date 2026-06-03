/**
 * Audit editorial notes across all published machines.
 */
import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "content", "machines");

function load() {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const m = JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8"));
      return { file: f.replace(".json", ""), ...m };
    })
    .filter((m) => m.status === "published" && !m.catalogHidden);
}

function parseWatts(m) {
  const t = m.powerRating ?? m.specs?.power ?? "";
  const match = String(t).match(/(\d+(?:\.\d+)?)\s*W/i);
  return match ? Number(match[1]) : null;
}

const machines = load();
const issues = [];

const BOILERPLATE_PRO = [
  /^Open-frame layout\s*:/i,
  /^Fully enclosed cabinet\s*:/i,
  /^Swappable laser head on the same chassis/i,
  /^Work area \d/i,
  /^Software:/i,
  /^Reference engrave job/i,
  /^Reference cut job/i,
  /^Balanced engrave and cut\s*:/i,
];

for (const m of machines) {
  const slug = m.slug;
  if (!m.tldr?.trim()) issues.push({ type: "missing-tldr", slug });
  if (!m.beginnerNotes?.trim()) issues.push({ type: "missing-beginnerNotes", slug });
  if (!m.proTips?.trim()) issues.push({ type: "missing-proTips", slug });
  if (!m.mainObjective?.trim()) issues.push({ type: "missing-mainObjective", slug });
  if (!m.primaryUse?.trim()) issues.push({ type: "missing-primaryUse", slug });
  if ((m.pros?.length ?? 0) < 3) issues.push({ type: "few-pros", slug, count: m.pros?.length ?? 0 });
  if ((m.cons?.length ?? 0) < 2) issues.push({ type: "few-cons", slug, count: m.cons?.length ?? 0 });

  const isModule = m.moduleSystem?.style === "interchangeable";
  if (isModule && !m.editorialDepth?.advantages?.trim()) {
    issues.push({ type: "module-missing-editorialDepth", slug });
  }
  if (isModule && m.beginnerNotes?.includes("power options") && !m.beginnerNotes.includes("module")) {
    issues.push({ type: "module-wrong-beginner-wording", slug });
  }
  if (isModule && m.primaryUse && !/module|Module|CO₂|IR|fibre|fiber|UV|MOPA/i.test(m.primaryUse)) {
    issues.push({ type: "module-vague-primaryUse", slug, primaryUse: m.primaryUse.slice(0, 60) });
  }

  for (const pro of m.pros ?? []) {
    if (BOILERPLATE_PRO.some((re) => re.test(pro))) {
      issues.push({ type: "boilerplate-pro", slug, pro: pro.slice(0, 70) });
      break;
    }
  }
}

// Per modelLine duplicates
const byLine = new Map();
for (const m of machines) {
  if (!m.modelLine) continue;
  if (!byLine.has(m.modelLine)) byLine.set(m.modelLine, []);
  byLine.get(m.modelLine).push(m);
}

for (const [line, tiers] of byLine) {
  if (tiers.length < 2) continue;
  const notes = new Map();
  for (const m of tiers) {
    const k = (m.beginnerNotes ?? "").trim();
    if (!k) continue;
    if (!notes.has(k)) notes.set(k, []);
    notes.get(k).push(m.slug);
  }
  for (const [note, slugs] of notes) {
    if (slugs.length > 1 && slugs.length === tiers.length) {
      issues.push({ type: "identical-beginnerNotes-line", line, slugs });
    }
  }
  const tips = new Map();
  for (const m of tiers) {
    const k = (m.proTips ?? "").trim();
    if (!k) continue;
    if (!tips.has(k)) tips.set(k, []);
    tips.get(k).push(m.slug);
  }
  for (const [, slugs] of tips) {
    if (slugs.length > 1 && slugs.length === tiers.length) {
      issues.push({ type: "identical-proTips-line", line, slugs });
    }
  }
}

const byType = {};
for (const i of issues) byType[i.type] = (byType[i.type] ?? 0) + 1;

console.log(`Published visible machines: ${machines.length}`);
console.log(`Issues: ${issues.length}\n`);
for (const [t, c] of Object.entries(byType).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${t}: ${c}`);
}

for (const type of Object.keys(byType)) {
  const list = issues.filter((i) => i.type === type);
  console.log(`\n--- ${type} (${list.length}) ---`);
  for (const i of list.slice(0, 25)) {
    console.log(" ", JSON.stringify(i));
  }
  if (list.length > 25) console.log(`  ... +${list.length - 25} more`);
}

process.exit(0);
