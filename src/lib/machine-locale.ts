import fs from "fs";
import path from "path";
import type { Locale } from "@/i18n/config";
import { sanitizePowerLabel } from "@/lib/power-display";
import type {
  Machine,
  MachineEditorialDepth,
  MachineFaq,
  MachineMaterials,
  ModuleSystem,
} from "@/types/machine";

const translationsRoot = path.join(process.cwd(), "content", "translations", "fr", "machines");

/** French overlay for a machine profile (English remains source of truth). */
export interface MachineTranslation {
  tagline?: string;
  tldr?: string;
  mainObjective?: string;
  primaryUse?: string;
  beginnerNotes?: string;
  proTips?: string;
  bestFor?: string[];
  pros?: string[];
  cons?: string[];
  materials?: MachineMaterials;
  faq?: MachineFaq[];
  moduleSystem?: Pick<ModuleSystem, "headline" | "description"> & {
    options?: Array<{ label?: string }>;
  };
  specs?: {
    performance?: {
      engraveExample?: { description?: string };
      cutExample?: { description?: string };
    };
  };
  priceRange?: { note?: string };
  images?: Array<{ alt?: string }>;
  editorialDepth?: MachineEditorialDepth;
}

const translationCache = new Map<string, MachineTranslation | null>();

const BROKEN_TRANSLATION = /MYMEMORY WARNING/i;
const ENGLISH_RESIDUE =
  /\b(with|for|and|the|large|frame|open|cutting|engraving|desktop|entry|level|workflow|maker|shop|without|power|series|bed|flagship|upgrade|seeker|seekers|heavy|panels|filled|simple|square|cut-out|updated|improved|original|small business|production|batch|seller|sellers|crafter|crafters|mixed media|sticker makers|sign shops)\b/i;
const FRENCH_MARKERS =
  /\b(avec|pour|et|les|des|découpe|gravure|atelier|puissance|série|haut de gamme|grand format)\b/i;

function isBrokenTranslation(value: string | undefined): boolean {
  return Boolean(value && BROKEN_TRANSLATION.test(value));
}

function looksEnglishResidue(value: string | undefined): boolean {
  if (!value) return false;
  return ENGLISH_RESIDUE.test(value) && !FRENCH_MARKERS.test(value);
}

function normalizeFiberToFibre(value: string): string {
  return value
    .replace(/\bFiber\b/g, "Fibre")
    .replace(/\bfiber\b/g, "fibre");
}

function normalizeCommonEnglishToFrench(value: string): string {
  const replacements: Array<[RegExp, string]> = [
    [/\bwith\b/gi, "avec"],
    [/\bwithout\b/gi, "sans"],
    [/\band\b/gi, "et"],
    [/\bfor\b/gi, "pour"],
    [/\bsmall business(es)?\b/gi, "petite entreprise"],
    [/\bshop(s)?\b/gi, "atelier"],
    [/\bworkflow\b/gi, "flux de travail"],
    [/\bdesktop\b/gi, "bureau"],
    [/\bentry[- ]level\b/gi, "niveau débutant"],
    [/\bupdated\b/gi, "mis à jour"],
    [/\bimproved\b/gi, "amélioré"],
    [/\boriginal\b/gi, "original"],
    [/\bflagship\b/gi, "haut de gamme"],
    [/\bproduction\b/gi, "production"],
    [/\bbatch\b/gi, "lot"],
    [/\bcutting\b/gi, "découpe"],
    [/\bengraving\b/gi, "gravure"],
    [/\bheavy\b/gi, "intensive"],
    [/\blarge\b/gi, "grand"],
    [/\bpanels\b/gi, "panneaux"],
    [/\bmaker(s)?\b/gi, "maker"],
    [/\bcrafter(s)?\b/gi, "créateur"],
    [/\bsticker makers?\b/gi, "créateurs de stickers"],
    [/\bmixed media\b/gi, "multi-matériaux"],
    [/\bsign shops?\b/gi, "ateliers d'enseignes"],
    [/\bsellers?\b/gi, "vendeurs"],
    [/\betsy\b/gi, "Etsy"],
    [/\bpower\b/gi, "puissance"],
    [/\bseries\b/gi, "série"],
    [/\bframe\b/gi, "châssis"],
    [/\bbed\b/gi, "plateau"],
    [/\bupgrade\b/gi, "mise à niveau"],
    [/\bseekers?\b/gi, "utilisateurs"],
    [/\bsimple\b/gi, "simple"],
    [/\bsquare\b/gi, "carrée"],
    [/\bfilled\b/gi, "remplie"],
  ];

  let out = value;
  for (const [pattern, replacement] of replacements) {
    out = out.replace(pattern, replacement);
  }
  return out.replace(/\s{2,}/g, " ").trim();
}

/** Prefer French when present and not a failed API placeholder. */
function pickTranslated(en: string, fr?: string): string {
  if (fr && !isBrokenTranslation(fr)) return fr;
  return en;
}

function pickTranslatedList(en: string[], fr?: string[]): string[] {
  if (!fr?.length) return en;
  return en.map((item, i) => pickTranslated(item, fr[i]));
}

function localizeBestForTag(tag: string): string {
  const lower = tag.trim().toLowerCase();
  const map: Record<string, string> = {
    "small business": "Petite entreprise",
    "etsy sellers": "Vendeurs Etsy",
    "sticker makers": "Créateurs de stickers",
    crafters: "Créateurs",
    "mixed media": "Multi-matériaux",
    "sign shops": "Ateliers d'enseignes",
    "batch production": "Production en série",
    "heavy cutting": "Découpe intensive",
    "large panels": "Grands panneaux",
    "co2 alternative seekers": "Alternative au CO₂",
    "co₂ alternative seekers": "Alternative au CO₂",
    "filled engraving": "Gravure de remplissage",
    "small business workflow": "Flux atelier petite entreprise",
    "maker workshops": "Ateliers makers",
  };
  if (map[lower]) return map[lower];
  if (/cut/i.test(tag)) return "Découpe";
  if (/engrave|engraving/i.test(tag)) return "Gravure";
  if (/panel|large format|large/i.test(tag)) return "Grand format";
  if (/maker|shop|workflow/i.test(tag)) return "Atelier";
  if (/beginner|entry/i.test(tag)) return "Débutant";
  if (/co2|co₂|alternative/i.test(tag)) return "Alternative au CO₂";
  return tag;
}

function inferFrenchLaserLabel(machine: Machine): string {
  const power = machine.specs.power.toLowerCase();
  if (machine.moduleSystem?.style === "dual-laser") return "hybride";
  if (power.includes("co2") || power.includes("co₂") || machine.laserType === "co2") return "CO₂";
  if (power.includes("fiber") || power.includes("fibre") || machine.laserType === "fiber")
    return "fibre";
  if (power.includes("uv") || machine.laserType === "uv") return "UV";
  if (power.includes("infrared") || power.includes("ir")) return "IR";
  return "diode";
}

function inferFrenchUsage(machine: Machine): string {
  const bestFor = machine.bestFor.join(" ").toLowerCase();
  const power = machine.specs.power.toLowerCase();
  if (bestFor.includes("metal") || bestFor.includes("métal")) return "marquage métal";
  if (power.includes("co2") || power.includes("co₂")) return "découpe et gravure d'atelier";
  if (power.includes("70w") || power.includes("80w") || power.includes("60w"))
    return "découpe intensive";
  if (machine.moduleSystem?.style === "interchangeable" || machine.moduleSystem?.style === "dual-laser")
    return "usage polyvalent";
  return "gravure et découpe polyvalentes";
}

function inferFrenchFormat(machine: Machine): string {
  const area = machine.specs.workArea.toLowerCase();
  if (/(8\d{2}|9\d{2})\s*[x×]/.test(area)) return "grand format";
  if (/(6\d{2}|7\d{2})\s*[x×]/.test(area)) return "format atelier";
  if (/(4\d{2}|5\d{2})\s*[x×]/.test(area)) return "format bureau";
  return "format compact";
}

function buildFrenchObjective(machine: Machine): string {
  const laser = inferFrenchLaserLabel(machine);
  const usage = inferFrenchUsage(machine);
  const format = inferFrenchFormat(machine);
  return `${machine.brand} ${machine.name} : ${laser} pour ${usage} en ${format}`;
}

function normalizeArray(values: string[], normalizer: (value: string) => string): string[] {
  return values.map(normalizer);
}

function normalizeFaq(
  faq: MachineFaq[] | undefined,
  normalizer: (value: string) => string,
): MachineFaq[] | undefined {
  if (!faq?.length) return faq;
  return faq.map((item) => ({
    question: normalizer(item.question),
    answer: normalizer(item.answer),
  }));
}

function normalizeModuleSystem(
  moduleSystem: Machine["moduleSystem"],
  normalizer: (value: string) => string,
): Machine["moduleSystem"] {
  if (!moduleSystem) return moduleSystem;
  return {
    ...moduleSystem,
    headline: normalizer(moduleSystem.headline),
    description: normalizer(moduleSystem.description),
    options: moduleSystem.options.map((opt) => ({
      ...opt,
      label: normalizer(opt.label),
    })),
  };
}

function normalizeSpecs(
  specs: Machine["specs"],
  textNormalizer: (value: string) => string,
): Machine["specs"] {
  const normalizedSpecs: Machine["specs"] = {
    ...specs,
    power: sanitizePowerLabel(specs.power, "fr"),
  };

  if (specs.performance) {
    normalizedSpecs.performance = {
      ...specs.performance,
      engraveExample: {
        ...specs.performance.engraveExample,
        description: textNormalizer(specs.performance.engraveExample.description),
      },
      cutExample: {
        ...specs.performance.cutExample,
        description: textNormalizer(specs.performance.cutExample.description),
      },
    };
  }

  return normalizedSpecs;
}

function normalizeMachineText(
  machine: Machine,
  normalizer: (value: string) => string,
  normalizeName = false,
): Machine {
  const normalized: Machine = {
    ...machine,
    ...(normalizeName ? { name: normalizer(machine.name) } : {}),
    tagline: normalizer(machine.tagline),
    tldr: normalizer(machine.tldr),
    mainObjective: normalizer(machine.mainObjective),
    primaryUse: normalizer(machine.primaryUse),
    beginnerNotes: normalizer(machine.beginnerNotes),
    proTips: normalizer(machine.proTips),
    bestFor: normalizeArray(machine.bestFor, normalizer),
    pros: normalizeArray(machine.pros, normalizer),
    cons: normalizeArray(machine.cons, normalizer),
    materials: {
      engrave: normalizeArray(machine.materials.engrave, normalizer),
      cut: normalizeArray(machine.materials.cut, normalizer),
      cannot: normalizeArray(machine.materials.cannot, normalizer),
    },
    faq: normalizeFaq(machine.faq, normalizer),
    moduleSystem: normalizeModuleSystem(machine.moduleSystem, normalizer),
    specs: normalizeSpecs(machine.specs, normalizer),
    images: machine.images?.map((img) => ({
      ...img,
      alt: normalizer(img.alt),
    })),
  };

  if (normalized.powerRating) {
    normalized.powerRating = sanitizePowerLabel(normalized.powerRating, "fr");
  }

  return normalized;
}

function sanitizeFrenchResiduals(machine: Machine): Machine {
  let localized = { ...machine };
  // Last-pass cleanup for French cards/detail pages: prevent residual English strings.
  if (looksEnglishResidue(localized.tagline)) {
    localized.tagline = `Graveuse laser ${machine.brand} ${machine.name}`;
  }
  if (looksEnglishResidue(localized.mainObjective)) {
    localized.mainObjective = buildFrenchObjective(machine);
  }
  if (looksEnglishResidue(localized.tldr)) {
    localized.tldr =
      "Machine orientée gravure et découpe, adaptée aux ateliers selon la puissance et le format de travail.";
  }
  localized.bestFor = localized.bestFor.map((tag) =>
    looksEnglishResidue(tag) ? localizeBestForTag(tag) : tag,
  );

  localized = normalizeMachineText(localized, normalizeFiberToFibre, true);
  localized = normalizeMachineText(localized, normalizeCommonEnglishToFrench);
  return localized;
}

function pickMaterials(en: MachineMaterials, fr?: MachineMaterials): MachineMaterials {
  if (!fr) return en;
  return {
    engrave: pickTranslatedList(en.engrave, fr.engrave),
    cut: pickTranslatedList(en.cut, fr.cut),
    cannot: pickTranslatedList(en.cannot, fr.cannot),
  };
}

function pickFaq(en: MachineFaq[], fr?: MachineFaq[]): MachineFaq[] {
  if (!fr?.length) return en;
  return en.map((item, i) => ({
    question: pickTranslated(item.question, fr[i]?.question),
    answer: pickTranslated(item.answer, fr[i]?.answer),
  }));
}

export function loadMachineTranslation(slug: string): MachineTranslation | null {
  if (translationCache.has(slug)) {
    return translationCache.get(slug) ?? null;
  }

  const filePath = path.join(translationsRoot, `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    translationCache.set(slug, null);
    return null;
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8")) as MachineTranslation;
    translationCache.set(slug, data);
    return data;
  } catch {
    translationCache.set(slug, null);
    return null;
  }
}

export function hasMachineTranslation(slug: string): boolean {
  const tr = loadMachineTranslation(slug);
  if (!tr) return false;
  const sample = tr.tagline ?? tr.tldr ?? tr.mainObjective;
  return Boolean(sample && !isBrokenTranslation(sample));
}

function mergeImages(
  base: Machine["images"],
  tr?: MachineTranslation["images"],
): Machine["images"] {
  if (!base?.length || !tr?.length) return base;
  return base.map((img, i) => ({
    ...img,
    alt: pickTranslated(img.alt, tr[i]?.alt),
  }));
}

/** Apply French overlay when locale is fr and a translation file exists. */
export function localizeMachine(machine: Machine, locale: Locale): Machine {
  if (locale !== "fr") return machine;

  const tr = loadMachineTranslation(machine.slug);
  if (!tr) return sanitizeFrenchResiduals(machine);

  const localized: Machine = {
    ...machine,
    tagline: pickTranslated(machine.tagline, tr.tagline),
    tldr: pickTranslated(machine.tldr, tr.tldr),
    mainObjective: pickTranslated(machine.mainObjective, tr.mainObjective),
    primaryUse: pickTranslated(machine.primaryUse, tr.primaryUse),
    beginnerNotes: pickTranslated(machine.beginnerNotes, tr.beginnerNotes),
    proTips: pickTranslated(machine.proTips, tr.proTips),
    bestFor: pickTranslatedList(machine.bestFor, tr.bestFor),
    pros: pickTranslatedList(machine.pros, tr.pros),
    cons: pickTranslatedList(machine.cons, tr.cons),
    materials: pickMaterials(machine.materials, tr.materials),
    faq: machine.faq ? pickFaq(machine.faq, tr.faq) : machine.faq,
    images: mergeImages(machine.images, tr.images),
    ...(machine.editorialDepth || tr.editorialDepth
      ? {
          editorialDepth: {
            advantages: pickTranslated(
              machine.editorialDepth?.advantages ?? "",
              tr.editorialDepth?.advantages,
            ),
            limitations: pickTranslated(
              machine.editorialDepth?.limitations ?? "",
              tr.editorialDepth?.limitations,
            ),
          },
        }
      : {}),
    priceRange: {
      ...machine.priceRange,
      ...(machine.priceRange.note || tr.priceRange?.note
        ? {
            note: pickTranslated(
              machine.priceRange.note ?? "",
              tr.priceRange?.note,
            ),
          }
        : {}),
    },
    specs: {
      ...machine.specs,
      performance: {
        ...machine.specs.performance,
        engraveExample: {
          ...machine.specs.performance.engraveExample,
          description: pickTranslated(
            machine.specs.performance.engraveExample.description,
            tr.specs?.performance?.engraveExample?.description,
          ),
        },
        cutExample: {
          ...machine.specs.performance.cutExample,
          description: pickTranslated(
            machine.specs.performance.cutExample.description,
            tr.specs?.performance?.cutExample?.description,
          ),
        },
      },
    },
  };

  if (tr.moduleSystem && machine.moduleSystem) {
    localized.moduleSystem = {
      ...machine.moduleSystem,
      headline: pickTranslated(machine.moduleSystem.headline, tr.moduleSystem.headline),
      description: pickTranslated(machine.moduleSystem.description, tr.moduleSystem.description),
      options: machine.moduleSystem.options.map((opt, i) => ({
        ...opt,
        label: pickTranslated(opt.label, tr.moduleSystem?.options?.[i]?.label),
      })),
    };
  }

  return sanitizeFrenchResiduals(localized);
}

export function localizeMachines(machines: Machine[], locale: Locale): Machine[] {
  return machines.map((m) => localizeMachine(m, locale));
}
