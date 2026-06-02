/**
 * Re-translate machine fields that contain MyMemory quota errors.
 * Reads English source from content/machines/, writes fixed overlays.
 * Usage: node scripts/repair-fr-translations.mjs [--force]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const machinesDir = path.join(root, "content", "machines");
const outDir = path.join(root, "content", "translations", "fr", "machines");
const cachePath = path.join(root, "content", "translations", ".translate-cache.json");

const BROKEN = /MYMEMORY WARNING/i;
const force = process.argv.includes("--force");

function loadCache() {
  if (fs.existsSync(cachePath)) {
    return JSON.parse(fs.readFileSync(cachePath, "utf-8"));
  }
  return {};
}

function saveCache(cache) {
  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2));
}

function walkStrings(obj, fn) {
  if (typeof obj === "string") return fn(obj);
  if (Array.isArray(obj)) return obj.map((v) => walkStrings(v, fn));
  if (obj && typeof obj === "object") {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      out[k] = walkStrings(v, fn);
    }
    return out;
  }
  return obj;
}

function hasBroken(obj) {
  let broken = false;
  walkStrings(obj, (s) => {
    if (BROKEN.test(s)) broken = true;
    return s;
  });
  return broken;
}

async function translateText(text, cache) {
  if (!text?.trim() || !BROKEN.test(text)) return text;
  if (cache[text] && !BROKEN.test(cache[text])) return cache[text];

  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|fr`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.quotaFinished || BROKEN.test(data.responseData?.translatedText ?? "")) {
    throw new Error("Translation quota exhausted — retry later");
  }
  const translated = data.responseData.translatedText;
  cache[text] = translated;
  await new Promise((r) => setTimeout(r, 400));
  return translated;
}

async function repairOverlay(en, overlay, cache) {
  const enFlat = {};
  const mapPaths = [];

  function collect(enVal, trVal, pathKey) {
    if (typeof enVal === "string" && typeof trVal === "string") {
      if (BROKEN.test(trVal)) {
        enFlat[pathKey] = enVal;
        mapPaths.push(pathKey);
      }
    } else if (Array.isArray(enVal) && Array.isArray(trVal)) {
      enVal.forEach((item, i) => collect(item, trVal[i], `${pathKey}[${i}]`));
    } else if (enVal && trVal && typeof enVal === "object") {
      for (const k of Object.keys(enVal)) {
        collect(enVal[k], trVal[k], pathKey ? `${pathKey}.${k}` : k);
      }
    }
  }

  collect(en, overlay, "");

  for (const pathKey of mapPaths) {
    const enText = enFlat[pathKey];
    const frText = await translateText(enText, cache);
    setByPath(overlay, pathKey, frText);
  }

  return overlay;
}

function setByPath(obj, pathKey, value) {
  const parts = pathKey.replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean);
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
}

function buildEnOverlay(machine) {
  return {
    tagline: machine.tagline,
    tldr: machine.tldr,
    mainObjective: machine.mainObjective,
    primaryUse: machine.primaryUse,
    beginnerNotes: machine.beginnerNotes,
    proTips: machine.proTips,
    bestFor: machine.bestFor,
    pros: machine.pros,
    cons: machine.cons,
    materials: machine.materials,
    faq: machine.faq,
    priceRange: machine.priceRange?.note ? { note: machine.priceRange.note } : undefined,
    specs: machine.specs?.performance
      ? {
          performance: {
            engraveExample: machine.specs.performance.engraveExample?.description
              ? { description: machine.specs.performance.engraveExample.description }
              : undefined,
            cutExample: machine.specs.performance.cutExample?.description
              ? { description: machine.specs.performance.cutExample.description }
              : undefined,
          },
        }
      : undefined,
    images: machine.images?.map((img) => ({ alt: img.alt })),
    moduleSystem: machine.moduleSystem
      ? {
          headline: machine.moduleSystem.headline,
          description: machine.moduleSystem.description,
          options: machine.moduleSystem.options?.map((o) => ({ label: o.label })),
        }
      : undefined,
  };
}

async function main() {
  const cache = loadCache();
  const files = fs.readdirSync(outDir).filter((f) => f.endsWith(".json"));
  let repaired = 0;

  for (const file of files) {
    const overlay = JSON.parse(fs.readFileSync(path.join(outDir, file), "utf-8"));
    if (!force && !hasBroken(overlay)) continue;

    const enPath = path.join(machinesDir, file);
    if (!fs.existsSync(enPath)) continue;

    const machine = JSON.parse(fs.readFileSync(enPath, "utf-8"));
    console.log(`Repairing ${machine.slug}…`);
    const enOverlay = buildEnOverlay(machine);
    const fixed = await repairOverlay(enOverlay, overlay, cache);
    fs.writeFileSync(path.join(outDir, file), JSON.stringify(fixed, null, 2) + "\n");
    saveCache(cache);
    repaired++;
  }

  saveCache(cache);
  console.log(`Repaired ${repaired} file(s).`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
