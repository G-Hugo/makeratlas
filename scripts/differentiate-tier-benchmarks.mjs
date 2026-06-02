/**
 * Differentiate performance benchmarks, capability ratings, and cut materials
 * across power tiers in the same modelLine.
 *
 * Run: node scripts/differentiate-tier-benchmarks.mjs
 * Then: node scripts/apply-benchmarks.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { BENCHMARK_TIMES } from "./benchmark-config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const machinesDir = path.join(root, "content", "machines");
const frDir = path.join(root, "content", "translations", "fr", "machines");

const POWER_EXPONENT = 0.62;

function parseWatts(machine) {
  const text = machine.powerRating ?? machine.specs?.power ?? "";
  const m = text.match(/(\d+(?:\.\d+)?)\s*W/i);
  return m ? Number(m[1]) : null;
}

function parseTimeRange(timeStr) {
  if (!timeStr || /not a cutter|n\/a|blade only|production/i.test(timeStr)) return null;
  const nums = [...timeStr.matchAll(/(\d+(?:\.\d+)?)/g)].map((x) => Number(x[1]));
  if (!nums.length) return null;
  if (nums.length === 1) return [nums[0], nums[0]];
  return [nums[0], nums[1]];
}

function formatTimeRange([lo, hi]) {
  const r = (n) => Math.max(1, Math.round(n));
  const a = r(lo);
  const b = r(hi);
  if (a === b) return `~${a} min`;
  return `~${Math.min(a, b)}–${Math.max(a, b)} min`;
}

function scaleTimeRange(range, maxW, watts) {
  if (!range || !maxW || !watts || maxW === watts) return range;
  const ratio = Math.pow(maxW / watts, POWER_EXPONENT);
  return [range[0] * ratio, range[1] * ratio];
}

function parseSpotMm(spotStr) {
  if (!spotStr || spotStr === "—") return null;
  const nums = [...spotStr.matchAll(/(\d+(?:\.\d+)?)/g)].map((x) => Number(x[1]));
  if (!nums.length) return null;
  if (nums.length >= 2) return (nums[0] + nums[1]) / 2;
  return nums[0];
}

/** Lower optical power → slightly finer spot on diode/hybrid lines. */
function spotSizeForTier(watts, maxW, laserType, anchorSpot) {
  const anchorMm = parseSpotMm(anchorSpot);
  if (!anchorMm || !watts || !maxW) return anchorSpot;

  let mm;
  if (laserType === "co2") {
    mm = anchorMm * Math.pow(watts / maxW, 0.05);
  } else if (laserType === "fiber" || laserType === "uv") {
    mm = anchorMm * Math.pow(watts / maxW, 0.04);
  } else {
    mm = anchorMm * Math.pow(watts / maxW, 0.12);
  }

  const rounded = Math.round(mm * 100) / 100;
  if (/×/.test(anchorSpot)) {
    const rect = rounded * 1.15;
    return `~${rounded.toFixed(2)} × ${rect.toFixed(2)} mm`;
  }
  if (laserType === "co2") return `~${rounded.toFixed(2)} mm`;
  return `~${rounded.toFixed(2)} mm spot`;
}

function scaleSpeedString(value, watts, maxW) {
  if (!value || typeof value !== "string" || !maxW || !watts) return value;
  const m = value.match(/^(\d+(?:\.\d+)?)\s*[–-]\s*(\d+(?:\.\d+)?)\s*mm\/s(.*)$/i);
  if (!m) return value;
  const scale = Math.pow(watts / maxW, POWER_EXPONENT);
  let lo = Math.round(Number(m[1]) * scale);
  let hi = Math.round(Number(m[2]) * scale);
  lo = Math.max(2, lo);
  hi = Math.max(lo + 1, hi);
  return `${lo}–${hi} mm/s${m[3]}`;
}

function anchorTimes(tier, laserType) {
  const fromConfig = BENCHMARK_TIMES[tier.slug];
  if (fromConfig) {
    return {
      engrave: parseTimeRange(fromConfig.engraveTime),
      cut: parseTimeRange(fromConfig.cutTime),
      cutType: fromConfig.cutType,
      engraveType: fromConfig.engraveType,
      cutTimeRaw: fromConfig.cutTime,
      engraveTimeRaw: fromConfig.engraveTime,
    };
  }
  const perf = tier.specs?.performance;
  return {
    engrave: parseTimeRange(perf?.engraveExample?.time),
    cut: parseTimeRange(perf?.cutExample?.time),
    cutType: laserType === "co2" ? "acrylic" : laserType === "fiber" || laserType === "uv" ? "none" : "wood",
    cutTimeRaw: perf?.cutExample?.time,
    engraveTimeRaw: perf?.engraveExample?.time,
  };
}

function capabilityForTier(watts, maxW, minW, laserType, base) {
  if (!watts || !maxW) return base;
  const span = maxW - minW || 1;
  const t = (watts - minW) / span;
  const isEngraverOnly = laserType === "fiber" || laserType === "uv";
  const floor = isEngraverOnly ? 7.5 : 7;
  const ceiling = isEngraverOnly ? 9.2 : 9.5;
  const target = floor + t * (ceiling - floor);
  return Math.min(10, Math.max(1, Math.round((base * 0.35 + target * 0.65) * 10) / 10));
}

function mainObjectiveForTier(watts, laserType) {
  if (!watts) return null;
  if (laserType === "fiber" || laserType === "uv") {
    if (watts >= 50) return "Industrial marking and deep engraving on metals and engineered plastics";
    if (watts >= 20) return "Shop marking on metals, plastics, and coated parts with production-friendly speeds";
    return "Benchtop marking on metals, plastics, and coated parts";
  }
  if (laserType === "co2") {
    if (watts >= 80) return "Workshop cutting and engraving — acrylic, wood, and leather at production pace";
    if (watts >= 50) return "Small-business cutting and engraving on acrylic, wood, and leather";
    return "Hobby and light-business engraving with capable acrylic and wood cutting";
  }
  if (watts >= 40) {
    return "Fast hobby engraving and cutting — thicker basswood, dark acrylic, and shorter job times";
  }
  if (watts >= 20) {
    return "Versatile hobby engraving with solid cutting through typical 3–6 mm basswood";
  }
  if (watts >= 10) {
    return "Hobby engraving on wood, leather, and coated metal with light to moderate cutting";
  }
  return "Entry-level hobby engraving on wood, leather, and coated metal with light cutting";
}

function adjustCutMaterials(cutList, watts, maxW) {
  const cuts = [...(cutList || [])];
  const thicknessNote = (mm) => {
    const idx = cuts.findIndex((c) => /mm|millimetre|millimeter/i.test(c));
    const label = (w, mmMax) => {
      if (/tilleul|basswood|plywood|wood/i.test(cuts.join(" "))) {
        return `Basswood (up to ${mmMax} mm)`;
      }
      return null;
    };
    return mm;
  };

  const woodIdx = cuts.findIndex((c) =>
    /basswood|tilleul|plywood|wood|bois/i.test(c),
  );
  if (woodIdx >= 0) {
    let maxMm = 3;
    if (watts >= 40) maxMm = 10;
    else if (watts >= 20) maxMm = 8;
    else if (watts >= 10) maxMm = 5;
    const isFr = /tilleul|bois/i.test(cuts[woodIdx]);
    cuts[woodIdx] = isFr
      ? `Tilleul (jusqu'à ${maxMm} mm)`
      : `Basswood (up to ${maxMm} mm)`;
  } else if (watts >= 10) {
    cuts.unshift(watts >= 20 ? "Basswood (up to 8 mm)" : "Basswood (up to 5 mm)");
  }

  if (watts >= 20 && maxW >= 20) {
    const acrylicIdx = cuts.findIndex((c) => /acrylic|acrylique/i.test(c));
    if (acrylicIdx >= 0 && !/\d/.test(cuts[acrylicIdx])) {
      cuts[acrylicIdx] = /acrylique/i.test(cuts[acrylicIdx])
        ? "Acrylique foncé (jusqu'à 5 mm)"
        : "Dark acrylic (up to 5 mm)";
    }
  }

  return cuts;
}

function loadJson(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8").replace(/^\uFEFF/, "");
  return JSON.parse(raw);
}

function saveJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
}

function loadFrOverlay(slug) {
  const p = path.join(frDir, `${slug}.json`);
  if (!fs.existsSync(p)) return null;
  return loadJson(p);
}

function saveFrOverlay(slug, data) {
  saveJson(path.join(frDir, `${slug}.json`), data);
}

const files = fs.readdirSync(machinesDir).filter((f) => f.endsWith(".json"));
const machines = files.map((f) => loadJson(path.join(machinesDir, f)));

const byLine = new Map();
for (const m of machines) {
  if (!m.modelLine || m.catalogHidden) continue;
  if (!byLine.has(m.modelLine)) byLine.set(m.modelLine, []);
  byLine.get(m.modelLine).push(m);
}

const updatedBenchmarkTimes = { ...BENCHMARK_TIMES };
let linesUpdated = 0;
let tiersUpdated = 0;

for (const [line, tiers] of byLine) {
  if (tiers.length < 2) continue;

  const withWatts = tiers
    .map((t) => ({ tier: t, watts: parseWatts(t) }))
    .filter((x) => x.watts != null);
  if (withWatts.length < 2) continue;

  const maxW = Math.max(...withWatts.map((x) => x.watts));
  const minW = Math.min(...withWatts.map((x) => x.watts));
  const anchorTier =
    withWatts.find((x) => x.watts === maxW)?.tier ??
    withWatts[withWatts.length - 1].tier;
  const laserType = anchorTier.laserType;
  const anchor = anchorTimes(anchorTier, laserType);
  const anchorSpot =
    anchorTier.specs?.performance?.technical?.spotSize ?? "~0.08 mm spot";

  if (!anchor.engrave) continue;

  linesUpdated++;

  for (const { tier, watts } of withWatts) {
    const engraveRange = scaleTimeRange(anchor.engrave, maxW, watts);
    const cutRange =
      anchor.cut && !/not|n\/a|blade|production/i.test(anchor.cutTimeRaw ?? "")
        ? scaleTimeRange(anchor.cut, maxW, watts)
        : null;

    const engraveTime = formatTimeRange(engraveRange);
    const cutTime = cutRange
      ? formatTimeRange(cutRange)
      : anchor.cutTimeRaw ?? "Not a cutter";

    updatedBenchmarkTimes[tier.slug] = {
      engraveTime,
      cutTime,
      cutType: anchor.cutType ?? "wood",
      ...(anchor.engraveType ? { engraveType: anchor.engraveType } : {}),
    };

    const filePath = path.join(machinesDir, `${tier.slug}.json`);
    const machine = loadJson(filePath);
    const perf = machine.specs.performance;
    const tech = perf.technical || {};

    machine.specs.performance = {
      ...perf,
      engraveExample: {
        ...perf.engraveExample,
        time: engraveTime,
      },
      cutExample: {
        ...perf.cutExample,
        time: cutTime,
      },
      technical: {
        ...tech,
        avgEngraveSpeed: scaleSpeedString(
          tech.avgEngraveSpeed || "80–180 mm/s fill",
          watts,
          maxW,
        ),
        avgCutSpeed: scaleSpeedString(
          tech.avgCutSpeed || "4–12 mm/s on 3 mm wood",
          watts,
          maxW,
        ),
        spotSize: spotSizeForTier(watts, maxW, laserType, anchorSpot),
      },
    };

    const baseCap = machine.rating?.capability ?? 8;
    machine.rating = {
      ...machine.rating,
      capability: capabilityForTier(watts, maxW, minW, laserType, baseCap),
    };

    const objective = mainObjectiveForTier(watts, laserType);
    if (objective) machine.mainObjective = objective;

    if (machine.materials?.cut) {
      machine.materials.cut = adjustCutMaterials(machine.materials.cut, watts, maxW);
    }

    saveJson(filePath, machine);
    tiersUpdated++;

    const fr = loadFrOverlay(tier.slug);
    if (fr) {
      let frChanged = false;
      if (objective) {
        const frObjective = mainObjectiveForTier(watts, laserType);
        if (frObjective && fr.mainObjective) {
          fr.mainObjective =
            watts >= 40
              ? "Gravure et découpe rapides — tilleul plus épais, acrylique foncé, jobs plus courts"
              : watts >= 20
                ? "Gravure polyvalente avec découpe correcte du tilleul 3–6 mm typique"
                : watts >= 10
                  ? "Gravure loisir bois, cuir et métal revêtu avec découpe légère à modérée"
                  : "Gravure loisir bois, cuir et métal revêtu avec découpe légère";
          frChanged = true;
        }
      }
      if (fr.materials?.cut && machine.materials?.cut) {
        fr.materials.cut = machine.materials.cut.map((en) => {
          if (/Basswood \(up to/i.test(en)) {
            const mm = en.match(/(\d+)/)?.[1];
            return `Tilleul (jusqu'à ${mm} mm)`;
          }
          if (/Dark acrylic \(up to/i.test(en)) {
            const mm = en.match(/(\d+)/)?.[1];
            return `Acrylique foncé (jusqu'à ${mm} mm)`;
          }
          return en;
        });
        frChanged = true;
      }
      if (frChanged) saveFrOverlay(tier.slug, fr);
    }
  }
}

function benchmarkLine(slug, entry) {
  const parts = [
    `engraveTime: ${JSON.stringify(entry.engraveTime)}`,
    `cutTime: ${JSON.stringify(entry.cutTime)}`,
    `cutType: ${JSON.stringify(entry.cutType)}`,
  ];
  if (entry.engraveType) parts.push(`engraveType: ${JSON.stringify(entry.engraveType)}`);
  return `  ${JSON.stringify(slug)}: { ${parts.join(", ")} },`;
}

function upsertBenchmarkConfig(configText, slug, entry) {
  const line = benchmarkLine(slug, entry);
  const escaped = slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`\\n  "${escaped}": \\{[^\\n]+\\},?`);
  if (re.test(configText)) return configText.replace(re, `\n${line}`);
  return configText.replace(
    /\n\};\s*\n\nexport function buildExamples/,
    `\n${line}\n};\n\nexport function buildExamples`,
  );
}

const configPath = path.join(__dirname, "benchmark-config.mjs");
let configText = fs.readFileSync(configPath, "utf-8");
let configPatches = 0;

for (const [line, tiers] of byLine) {
  if (tiers.length < 2) continue;
  for (const t of tiers) {
    const entry = updatedBenchmarkTimes[t.slug];
    if (!entry) continue;
    const next = upsertBenchmarkConfig(configText, t.slug, entry);
    if (next !== configText) {
      configText = next;
      configPatches++;
    }
  }
}
fs.writeFileSync(configPath, configText);

console.log(`Model lines updated: ${linesUpdated}`);
console.log(`Tier files updated: ${tiersUpdated}`);
console.log(`benchmark-config patches: ${configPatches}`);
console.log("Done.");
