/**
 * Generate French overlay JSON for machine profiles.
 * Usage: node scripts/generate-machine-fr-translations.mjs [--force] [--slug=name]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const machinesDir = path.join(root, "content", "machines");
const outDir = path.join(root, "content", "translations", "fr", "machines");
const cachePath = path.join(root, "content", "translations", ".translate-cache.json");

const force = process.argv.includes("--force");
const slugArg = process.argv.find((a) => a.startsWith("--slug="))?.split("=")[1];

const GLOSSARY = [
  ["laser engraver", "graveuse laser"],
  ["laser engraver —", "graveuse laser —"],
  ["engraver", "graveuse"],
  ["engraving", "gravure"],
  ["engrave", "graver"],
  ["Engrave", "Gravure"],
  ["cutting", "découpe"],
  ["cut", "découper"],
  ["Cut", "Découpe"],
  ["cutter", "découpeuse"],
  ["budget", "petit budget"],
  ["Budget", "Petit budget"],
  ["hobby", "loisir"],
  ["hobbyist", "amateur"],
  ["hobbyists", "amateurs"],
  ["maker", "maker"],
  ["makers", "makers"],
  ["wood", "bois"],
  ["Wood", "Bois"],
  ["leather", "cuir"],
  ["Leather", "Cuir"],
  ["acrylic", "acrylique"],
  ["Acrylic", "Acrylique"],
  ["clear acrylic", "acrylique transparent"],
  ["bare metal", "métal nu"],
  ["Bare metal", "Métal nu"],
  ["stainless", "inox"],
  ["aluminum", "aluminium"],
  ["Anodized aluminum", "Aluminium anodisé"],
  ["plywood", "contreplaqué"],
  ["birch plywood", "contreplaqué de bouleau"],
  ["basswood", "tilleul"],
  ["paper", "papier"],
  ["Paper", "Papier"],
  ["fabric", "tissu"],
  ["slate", "ardoise"],
  ["Slate", "Ardoise"],
  ["glass", "verre"],
  ["metal", "métal"],
  ["open frame", "structure ouverte"],
  ["open-frame", "structure ouverte"],
  ["air assist", "assistance air"],
  ["LightBurn", "LightBurn"],
  ["LaserGRBL", "LaserGRBL"],
  ["value", "rapport qualité-prix"],
  ["reliable", "fiable"],
  ["community", "communauté"],
  ["upgrade path", "chemin de montée en gamme"],
  ["full-size bed", "plateau grand format"],
  ["not recommended", "déconseillé"],
  ["Not recommended", "Déconseillé"],
  ["engraving-only", "gravure uniquement"],
  ["Engraving-only", "Gravure uniquement"],
  ["not a cutting machine", "pas une machine de découpe"],
  ["Not a cutting machine", "Pas une machine de découpe"],
  ["Use engraving", "Privilégier la gravure"],
  ["use engraving", "privilégier la gravure"],
  ["N/A", "N/A"],
  ["diode", "diode"],
  ["CO₂", "CO₂"],
  ["fiber", "fibre"],
  ["hybrid", "hybride"],
  ["Tight budget", "Budget serré"],
  ["Engraving-first hobby", "Loisir orienté gravure"],
  ["Learning LightBurn", "Apprendre LightBurn"],
  ["Thick hardwood", "Bois dur épais"],
  ["Thin basswood", "Tilleul fin"],
  ["High-volume production", "Production en volume"],
  ["production", "production"],
  ["Pro ", "Pro "],
  [" pro ", " pro "],
];

function applyGlossary(text) {
  if (!text || typeof text !== "string") return text;
  let out = text;
  for (const [en, fr] of GLOSSARY) {
    out = out.split(en).join(fr);
  }
  return out;
}

function loadCache() {
  if (fs.existsSync(cachePath)) {
    return JSON.parse(fs.readFileSync(cachePath, "utf-8"));
  }
  return {};
}

function saveCache(cache) {
  fs.mkdirSync(path.dirname(cachePath), { recursive: true });
  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2));
}

async function translateText(text, cache) {
  if (!text?.trim()) return text;
  const key = text.trim();
  if (cache[key]) return cache[key];

  const glossed = applyGlossary(text);
  if (glossed !== text) {
    cache[key] = glossed;
    return glossed;
  }

  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|fr`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.quotaFinished) {
    throw new Error("MyMemory quota finished — rerun later or use --slug for batches");
  }
  const translated = data.responseData?.translatedText ?? text;
  cache[key] = translated;
  await sleep(200);
  return translated;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function translateList(items, cache) {
  return Promise.all(items.map((item) => translateText(item, cache)));
}

async function translateMaterials(materials, cache) {
  if (!materials) return undefined;
  return {
    engrave: await translateList(materials.engrave ?? [], cache),
    cut: await translateList(materials.cut ?? [], cache),
    cannot: await translateList(materials.cannot ?? [], cache),
  };
}

async function translateFaq(faq, cache) {
  if (!faq?.length) return undefined;
  const out = [];
  for (const item of faq) {
    out.push({
      question: await translateText(item.question, cache),
      answer: await translateText(item.answer, cache),
    });
  }
  return out;
}

async function buildTranslation(machine, cache) {
  const perf = machine.specs?.performance;
  const tr = {
    tagline: await translateText(machine.tagline, cache),
    tldr: await translateText(machine.tldr, cache),
    mainObjective: await translateText(machine.mainObjective, cache),
    primaryUse: await translateText(machine.primaryUse, cache),
    beginnerNotes: await translateText(machine.beginnerNotes, cache),
    proTips: await translateText(machine.proTips, cache),
    bestFor: await translateList(machine.bestFor ?? [], cache),
    pros: await translateList(machine.pros ?? [], cache),
    cons: await translateList(machine.cons ?? [], cache),
    materials: await translateMaterials(machine.materials, cache),
    faq: await translateFaq(machine.faq, cache),
    priceRange: machine.priceRange?.note
      ? { note: await translateText(machine.priceRange.note, cache) }
      : undefined,
    specs: perf
      ? {
          performance: {
            engraveExample: perf.engraveExample?.description
              ? {
                  description: await translateText(perf.engraveExample.description, cache),
                }
              : undefined,
            cutExample: perf.cutExample?.description
              ? {
                  description: await translateText(perf.cutExample.description, cache),
                }
              : undefined,
          },
        }
      : undefined,
    images: machine.images?.length
      ? await Promise.all(
          machine.images.map(async (img) => ({
            alt: img.alt
              ? await translateText(
                  img.alt.replace(/laser engraver/gi, "graveuse laser"),
                  cache,
                )
              : undefined,
          })),
        )
      : undefined,
  };

  if (machine.moduleSystem) {
    tr.moduleSystem = {
      headline: await translateText(machine.moduleSystem.headline, cache),
      description: await translateText(machine.moduleSystem.description, cache),
      options: await Promise.all(
        (machine.moduleSystem.options ?? []).map(async (opt) => ({
          label: opt.label ? await translateText(opt.label, cache) : undefined,
        })),
      ),
    };
  }

  return tr;
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const cache = loadCache();
  const files = fs
    .readdirSync(machinesDir)
    .filter((f) => f.endsWith(".json"))
    .filter((f) => !slugArg || f === `${slugArg}.json`);

  let done = 0;
  let skipped = 0;

  for (const file of files) {
    const machine = JSON.parse(fs.readFileSync(path.join(machinesDir, file), "utf-8"));
    if (machine.status !== "published") continue;

    const outPath = path.join(outDir, file);
    if (!force && fs.existsSync(outPath)) {
      skipped++;
      continue;
    }

    console.log(`Translating ${machine.slug}…`);
    const tr = await buildTranslation(machine, cache);
    fs.writeFileSync(outPath, JSON.stringify(tr, null, 2) + "\n");
    saveCache(cache);
    done++;
  }

  saveCache(cache);
  console.log(`Done: ${done} translated, ${skipped} skipped.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
