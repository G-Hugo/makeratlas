/**
 * Audit multi-power SKUs: copy-paste, wrong wattage in text, identical benchmarks.
 */
import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "content", "machines");

function parseWatts(m) {
  const t = m.powerRating ?? m.specs?.power ?? "";
  const match = String(t).match(/(\d+(?:\.\d+)?)\s*W/i);
  return match ? Number(match[1]) : null;
}

function loadMachines() {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const m = JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8"));
      return { file: f.replace(".json", ""), ...m };
    })
    .filter((m) => m.status === "published" && m.modelLine);
}

function textBlob(m) {
  return [
    m.tagline,
    m.tldr,
    m.mainObjective,
    m.primaryUse,
    m.beginnerNotes,
    m.proTips,
    ...(m.pros ?? []),
    ...(m.cons ?? []),
  ].join(" ");
}

function benchKey(m) {
  const p = m.specs?.performance;
  if (!p) return "";
  return JSON.stringify({
    engrave: p.engraveExample,
    cut: p.cutExample,
    precision: p.precision,
    spot: p.technical?.spotSize,
  });
}

const machines = loadMachines();
const byLine = new Map();
for (const m of machines) {
  const line = m.modelLine;
  if (!byLine.has(line)) byLine.set(line, []);
  byLine.get(line).push(m);
}

const issues = [];

for (const [line, tiers] of byLine) {
  const visible = tiers.filter((t) => !t.catalogHidden);
  if (visible.length < 2) continue;

  visible.sort((a, b) => (parseWatts(a) ?? 0) - (parseWatts(b) ?? 0));

  for (const m of visible) {
    const w = parseWatts(m);
    const blob = textBlob(m).toLowerCase();
    if (w == null) continue;

    // Other wattages mentioned outside intentional upgrade guidance
    const upgradeOk =
      /\b(higher modules|upgrade path|compare|modules? plus puissants|montée possible|passez au|skip to|open the higher|20W\+|40W\+)\b/i.test(
        blob,
      );
    if (!upgradeOk) {
      for (const other of visible) {
        if (other.slug === m.slug) continue;
        const ow = parseWatts(other);
        if (ow == null || ow === w) continue;
        const re = new RegExp(`\\b${ow}\\s*W\\b`, "i");
        if (re.test(blob)) {
          issues.push({
            type: "wrong-watt-mention",
            line,
            slug: m.slug,
            watts: w,
            mentions: `${ow}W`,
            hint: "Text references another tier's wattage",
          });
        }
      }
    }

    // Generic "20W marketing" on non-20W SKUs
    if (w !== 20 && /\b20\s*W\s+marketing\b/i.test(blob)) {
      issues.push({
        type: "stale-20w-copy",
        line,
        slug: m.slug,
        watts: w,
      });
    }
  }

  // Identical TL;DR across tiers
  const tldrs = new Map();
  for (const m of visible) {
    const k = (m.tldr ?? "").trim();
    if (!k) continue;
    if (!tldrs.has(k)) tldrs.set(k, []);
    tldrs.get(k).push(m.slug);
  }
  for (const [tldr, slugs] of tldrs) {
    if (slugs.length > 1 && slugs.length === visible.length) {
      issues.push({
        type: "identical-tldr-all-tiers",
        line,
        slugs,
      });
    }
  }

  // Identical benchmark block across different watts
  const benches = new Map();
  for (const m of visible) {
    const k = benchKey(m);
    if (!k) continue;
    if (!benches.has(k)) benches.set(k, []);
    benches.get(k).push({ slug: m.slug, w: parseWatts(m) });
  }
  for (const [, group] of benches) {
    const watts = new Set(group.map((g) => g.w).filter(Boolean));
    if (group.length > 1 && watts.size > 1) {
      issues.push({
        type: "identical-benchmarks",
        line,
        slugs: group.map((g) => g.slug),
        watts: [...watts],
      });
    }
  }

  // Identical pros+cons hash
  const prose = new Map();
  for (const m of visible) {
    const k = JSON.stringify({ pros: m.pros, cons: m.cons });
    if (!prose.has(k)) prose.set(k, []);
    prose.get(k).push({ slug: m.slug, w: parseWatts(m) });
  }
  for (const [, group] of prose) {
    const watts = new Set(group.map((g) => g.w).filter(Boolean));
    if (group.length > 1 && watts.size > 1) {
      issues.push({
        type: "identical-pros-cons",
        line,
        slugs: group.map((g) => g.slug),
      });
    }
  }

  // Capability rating flat or inverted across power steps
  const rated = visible
    .map((m) => ({ slug: m.slug, w: parseWatts(m), cap: m.rating?.capability }))
    .filter((x) => x.w != null && x.cap != null)
    .sort((a, b) => a.w - b.w);
  for (let i = 1; i < rated.length; i++) {
    if (rated[i].cap > rated[i - 1].cap + 0.5) {
      issues.push({
        type: "capability-drop",
        line,
        lower: rated[i - 1],
        higher: rated[i],
      });
    }
  }
}

const byType = {};
for (const i of issues) {
  byType[i.type] = (byType[i.type] ?? 0) + 1;
}

console.log(`Multi-power lines audited: ${[...byLine.values()].filter((t) => t.filter((m) => !m.catalogHidden).length >= 2).length}`);
console.log(`Issues found: ${issues.length}\n`);
for (const [type, count] of Object.entries(byType).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${type}: ${count}`);
}

const show = (type, limit = 12) => {
  const list = issues.filter((i) => i.type === type);
  if (!list.length) return;
  console.log(`\n--- ${type} (showing up to ${limit}) ---`);
  for (const i of list.slice(0, limit)) {
    if (i.slug) console.log(`  ${i.line}: ${i.slug}${i.watts != null ? ` (${i.watts}W)` : ""}${i.mentions ? ` → cites ${i.mentions}` : ""}`);
    else if (i.slugs) console.log(`  ${i.line}: ${i.slugs.join(", ")}`);
    else if (i.lower) console.log(`  ${i.line}: ${i.lower.slug} cap ${i.lower.cap} < ${i.higher.slug} cap ${i.higher.cap}`);
  }
};

show("wrong-watt-mention");
show("stale-20w-copy");
show("identical-tldr-all-tiers");
show("identical-benchmarks");
show("identical-pros-cons");
show("capability-drop", 8);

process.exit(issues.length > 0 ? 1 : 0);
