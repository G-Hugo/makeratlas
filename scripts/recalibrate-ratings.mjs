/**
 * Recalibrate editorial ratings (v2): smoother tiers, price-relative value, coherent overall.
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
  diode: 8.8,
  co2: 9.2,
  fiber: 9.3,
  uv: 9.0,
  hybrid: 9.1,
};

/** Max capability increase between adjacent watt tiers in the same line */
const MAX_CAP_STEP = 0.38;
const MIN_CAP_STEP = 0.18;

/** Nudge value when brand positioning differs from raw price percentile */
const BRAND_VALUE_NUDGE = {
  xtool: 0.35,
  glowforge: 0.25,
  wecreat: 0.15,
  creality: 0.1,
  omtech: 0.1,
  monport: 0.05,
  sculpfun: 0.05,
  twotrees: -0.15,
  "two trees": -0.15,
  ortur: -0.1,
  atomstack: -0.05,
  longer: -0.05,
  comgrow: -0.2,
  acmer: -0.15,
  algolaser: -0.1,
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

function brandNudge(brand) {
  const key = brand.trim().toLowerCase();
  for (const [name, nudge] of Object.entries(BRAND_VALUE_NUDGE)) {
    if (key.includes(name)) return nudge;
  }
  return 0;
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
    let target = 9.1 - p * 2.6 + brandNudge(machine.brand);
    target = round1(clamp(6.2, 9.5, target));

    const prev = machine.rating?.value ?? 8;
    const blend = machine.tierEditorialOverride ? 0.5 : 0.72;
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
    const blend = rated[i].machine.tierEditorialOverride ? 0.55 : 0.7;
    rated[i].newCap = round1(clamp(5.5, 10, rated[i].cap * (1 - blend) + target * blend));
  }

  for (let i = 1; i < n; i++) {
    const prev = rated[i - 1].newCap;
    let next = rated[i].newCap;
    if (next <= prev + MIN_CAP_STEP) next = round1(prev + MIN_CAP_STEP);
    if (next > prev + MAX_CAP_STEP) next = round1(prev + MAX_CAP_STEP);
    rated[i].newCap = round1(clamp(floor, ceiling + 0.1, next));
  }

  for (const row of rated) {
    row.machine.rating = {
      ...row.machine.rating,
      capability: row.newCap,
    };
  }

  for (let i = 1; i < rated.length; i++) {
    const prev = rated[i - 1].machine.rating.capability;
    let next = rated[i].machine.rating.capability;
    if (next <= prev) {
      next = round1(prev + MIN_CAP_STEP);
      rated[i].machine.rating.capability = next;
    }
  }
}

function overallFrom(rating) {
  const raw =
    WEIGHTS.value * rating.value +
    WEIGHTS.easeOfUse * rating.easeOfUse +
    WEIGHTS.capability * rating.capability +
    WEIGHTS.buildQuality * rating.buildQuality;
  return round1(clamp(6, 9.5, raw));
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

  for (const [, tiers] of byLine) {
    const sorted = tiers
      .map(({ machine }) => ({ machine, w: parseWatts(machine) }))
      .filter((x) => x.w != null)
      .sort((a, b) => a.w - b.w);
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1].machine.rating.capability;
      if (sorted[i].machine.rating.capability <= prev) {
        sorted[i].machine.rating.capability = round1(prev + MIN_CAP_STEP);
      }
    }
  }

  for (const { filePath, machine } of machines) {
    const before = JSON.stringify(machine.rating);

    if (valueBySlug.has(machine.slug)) {
      machine.rating.value = valueBySlug.get(machine.slug);
    }

    const computed = overallFrom(machine.rating);
    const prevOverall = machine.rating.overall ?? computed;
    const overallBlend = machine.tierEditorialOverride ? 0.5 : 0.78;
    machine.rating.overall = round1(
      clamp(6, 9.5, prevOverall * (1 - overallBlend) + computed * overallBlend),
    );

    machine.rating.overall = round1(
      clamp(
        machine.rating.capability - 1.0,
        machine.rating.capability + 0.75,
        machine.rating.overall,
      ),
    );

    if (before === JSON.stringify(machine.rating)) continue;

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
    `Overall range: ${Math.min(...overalls).toFixed(1)} – ${Math.max(...overalls).toFixed(1)} (avg ${(overalls.reduce((a, b) => a + b, 0) / overalls.length).toFixed(2)})`,
  );
}

main();
