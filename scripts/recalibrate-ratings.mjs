/**
 * Recalibrate editorial ratings for clearer spread and tier logic.
 * - capability: smooth steps within each modelLine (by optical watts)
 * - value: relative to price within laser type
 * - overall: weighted blend of sub-scores (keeps ease/build, recalculates value/cap/overall)
 *
 * Run: node scripts/recalibrate-ratings.mjs
 * Dry: node scripts/recalibrate-ratings.mjs --dry-run
 */
import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "content", "machines");
const dryRun = process.argv.includes("--dry-run");

const WEIGHTS = {
  value: 0.28,
  easeOfUse: 0.17,
  capability: 0.35,
  buildQuality: 0.2,
};

const CAP_FLOOR = {
  diode: 6.8,
  co2: 7.2,
  fiber: 7.0,
  uv: 7.2,
  hybrid: 7.4,
};

const CAP_CEILING = {
  diode: 9.0,
  co2: 9.3,
  fiber: 9.4,
  uv: 9.1,
  hybrid: 9.2,
};

function round1(n) {
  return Math.round(n * 10) / 10;
}

function clamp(min, max, n) {
  return Math.min(max, Math.max(min, n));
}

function parseWatts(m) {
  const t = m.powerRating ?? m.specs?.power ?? "";
  const match = String(t).match(/(\d+(?:\.\d+)?)\s*W/i);
  return match ? Number(match[1]) : null;
}

function priceMid(m) {
  const { min, max } = m.priceRange ?? {};
  if (typeof min !== "number" || typeof max !== "number") return null;
  return (min + max) / 2;
}

function loadMachines() {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const filePath = path.join(dir, f);
      const machine = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      return { filePath, machine };
    })
    .filter(({ machine }) => machine.status === "published" && !machine.catalogHidden);
}

function percentileRank(value, sortedValues) {
  if (sortedValues.length <= 1) return 0.5;
  let below = 0;
  for (const v of sortedValues) {
    if (v < value) below++;
  }
  return below / (sortedValues.length - 1);
}

function computeValueScores(machines) {
  const byType = new Map();
  for (const { machine } of machines) {
    const mid = priceMid(machine);
    if (mid == null) continue;
    const list = byType.get(machine.laserType) ?? [];
    list.push(mid);
    byType.set(machine.laserType, list);
  }

  const valueBySlug = new Map();
  for (const { machine } of machines) {
    const mid = priceMid(machine);
    const list = byType.get(machine.laserType);
    if (mid == null || !list?.length) continue;
    const sorted = [...list].sort((a, b) => a - b);
    const p = percentileRank(mid, sorted);
    // Cheaper than peers → higher value (6.2–9.4 spread)
    const target = round1(9.2 - p * 2.8);
    const prev = machine.rating?.value ?? 8;
    const blend = machine.tierEditorialOverride ? 0.45 : 0.7;
    valueBySlug.set(machine.slug, round1(clamp(6, 9.6, prev * (1 - blend) + target * blend)));
  }
  return valueBySlug;
}

function capabilityForLine(tiers) {
  const rated = tiers
    .map(({ machine }) => ({
      machine,
      w: parseWatts(machine),
      cap: machine.rating?.capability ?? 8,
    }))
    .filter((x) => x.w != null);

  if (rated.length === 0) return;

  rated.sort((a, b) => a.w - b.w);
  const laserType = rated[0].machine.laserType ?? "diode";
  const floor = CAP_FLOOR[laserType] ?? 6.8;
  const ceiling = CAP_CEILING[laserType] ?? 9;
  const n = rated.length;

  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.55 : i / (n - 1);
    const target = floor + t * (ceiling - floor);
    const blend = rated[i].machine.tierEditorialOverride ? 0.5 : 0.65;
    let cap = round1(clamp(5.5, 10, rated[i].cap * (1 - blend) + target * blend));
    if (i > 0) cap = Math.max(cap, rated[i - 1].newCap + 0.25);
    cap = Math.min(ceiling + 0.2, cap);
    rated[i].newCap = round1(cap);
  }

  for (const row of rated) {
    row.machine.rating = {
      ...row.machine.rating,
      capability: row.newCap,
    };
  }
}

function overallFrom(rating) {
  const raw =
    WEIGHTS.value * rating.value +
    WEIGHTS.easeOfUse * rating.easeOfUse +
    WEIGHTS.capability * rating.capability +
    WEIGHTS.buildQuality * rating.buildQuality;
  return round1(clamp(5.5, 9.8, raw));
}

function main() {
  const machines = loadMachines();
  const valueBySlug = computeValueScores(machines);

  const byLine = new Map();
  for (const item of machines) {
    const key = item.machine.modelLine ?? item.machine.slug;
    const list = byLine.get(key) ?? [];
    list.push(item);
    byLine.set(key, list);
  }

  let updated = 0;

  for (const [, tiers] of byLine) {
    capabilityForLine(tiers);
  }

  for (const { filePath, machine } of machines) {
    const rating = { ...machine.rating };
    if (valueBySlug.has(machine.slug)) {
      rating.value = valueBySlug.get(machine.slug);
    }

    const computed = overallFrom(rating);
    const prevOverall = rating.overall ?? computed;
    const overallBlend = machine.tierEditorialOverride ? 0.55 : 0.75;
    rating.overall = round1(
      clamp(5.5, 9.8, prevOverall * (1 - overallBlend) + computed * overallBlend),
    );

    // Keep overall within ~1.2 of capability for coherence
    rating.overall = round1(
      clamp(rating.capability - 1.1, rating.capability + 0.85, rating.overall),
    );

    const changed = JSON.stringify(machine.rating) !== JSON.stringify(rating);
    if (!changed) continue;

    machine.rating = rating;
    updated++;

    if (!dryRun) {
      fs.writeFileSync(filePath, `${JSON.stringify(machine, null, 2)}\n`, "utf8");
    }
  }

  const overalls = machines.map(({ machine }) => machine.rating.overall);
  console.log(
    dryRun ? `[dry-run] Would update ${updated} profiles` : `Updated ${updated} profiles`,
  );
  console.log(
    `Overall range after: ${Math.min(...overalls).toFixed(1)} – ${Math.max(...overalls).toFixed(1)} (avg ${(overalls.reduce((a, b) => a + b, 0) / overalls.length).toFixed(2)})`,
  );
}

main();
