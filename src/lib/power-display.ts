import type { Locale } from "@/i18n/config";
import type { Machine } from "@/types/machine";
import { parsePowerWatts } from "@/lib/catalog-display";

/** Parenthetical content that is internal/editorial, not for catalog chips. */
const INTERNAL_PAREN_CONTENT =
  /consumer|verify|typical|sku|claimed|optical|class|classe|rated|approx|configuration|depending on|actual|typical entry|platform|module optional|optional\)|Pro model/i;

function isCompactWattLabel(value: string): boolean {
  return /^\d+(?:\.\d+)?\s*W$/i.test(value.trim());
}

function stripInternalPowerNotes(value: string): string {
  let s = value;

  s = s.replace(/\([^)]+\)/g, (paren) => {
    const inner = paren.slice(1, -1);
    if (INTERNAL_PAREN_CONTENT.test(inner)) {
      if (/compress/i.test(inner) && !/optical|class|verify|consumer/i.test(inner)) {
        return " (compressed)";
      }
      return "";
    }
    return paren;
  });

  s = s
    .replace(/\s*—\s*verify\s+sku[^,;)]*/gi, "")
    .replace(/\bconsumer[- ]?rated\b/gi, "")
    .replace(/\bverify\s+sku\b/gi, "")
    .replace(/\btypical\s+sku\b/gi, "")
    .replace(/\boptical\s+class\b/gi, "")
    .replace(/\bcombined\s+optical\s+class\b/gi, "")
    .replace(/\bUV\s+class\b/gi, "UV")
    .replace(/\bCO₂\s+class\b/gi, "CO₂")
    .replace(/\bCO2\s+class\b/gi, "CO₂")
    .replace(/\bfiber\s+class\b/gi, "fiber")
    .replace(/\bdiode\s+class\b/gi, "diode")
    .replace(/\s+\(class\)/gi, "")
    .replace(/\bclass\b/gi, "")
    .replace(/\bclasse\b/gi, "")
    .replace(/\(\s*approx\.?\s*\)/gi, "")
    .replace(/~\s*/g, "")
    .replace(/\bapprox\.?\b/gi, "")
    .replace(/\bdepending on module\b/gi, "")
    .replace(/\bdiode options\b/gi, "diode")
    .replace(/\s+options\b/gi, "")
    .replace(/\bindustrial sheet cutter\b/gi, "");

  return collapsePowerWhitespace(s);
}

function collapsePowerWhitespace(value: string): string {
  return value
    .replace(/\s{2,}/g, " ")
    .replace(/\s+,/g, ",")
    .replace(/\(\s*\)/g, "")
    .replace(/[;,]\s*$/g, "")
    .replace(/\s+—\s*$/g, "")
    .replace(/\s+\/\s+/g, " / ")
    .trim();
}

/** Full FR translation for power strings shown on cards. */
function translatePowerSpecsFr(value: string): string {
  let s = stripInternalPowerNotes(value);

  const replacements: Array<[RegExp, string]> = [
    [/\bblade cutting force\b/gi, "lame de découpe"],
    [/\bcutting force\b/gi, "force de coupe"],
    [/\bfiber marking\b/gi, "marquage fibre"],
    [/\binfrared auxiliary\b/gi, "IR auxiliaire"],
    [/\binfrared laser\b/gi, "laser infrarouge"],
    [/\bIR auxiliary\b/gi, "IR auxiliaire"],
    [/\bdual source\b/gi, "deux sources"],
    [/\bdouble source\b/gi, "deux sources"],
    [/\bglass tube\b/gi, "tube en verre"],
    [/\bdiode laser\b/gi, "diode"],
    [/\bCO₂ laser\b/gi, "CO₂"],
    [/\bCO2 laser\b/gi, "CO₂"],
    [/\bMOPA fiber\b/gi, "fibre MOPA"],
    [/\b(\d+(?:\.\d+)?)\s*W\s+visible\b/gi, "$1W visible"],
    [/\b(\d+(?:\.\d+)?)\s*W\s+infrared\b/gi, "$1W infrarouge"],
    [/\bFiber\b/g, "Fibre"],
    [/\bfiber\b/g, "fibre"],
    [/\bCO2\b/g, "CO₂"],
    [/\binfrared\b/gi, "infrarouge"],
    [/\bhybrid\b/gi, "hybride"],
    [/\bcompressed\b/gi, "compressé"],
    [/\benclosed\b/gi, "fermée"],
    [/\bauxiliary\b/gi, "auxiliaire"],
    [/\boptional\b/gi, "en option"],
    [/\bcombined\b/gi, "combiné"],
    [/\boptical\b/gi, "optique"],
    [/\bmarking\b/gi, "marquage"],
    [/\bvisible\b/gi, "visible"],
    [/\bmodule\b/gi, "module"],
    [/\bor\b/gi, "ou"],
    [/\band\b/gi, "et"],
    [/\blaser\b/gi, ""],
  ];

  for (const [pattern, replacement] of replacements) {
    s = s.replace(pattern, replacement);
  }

  return collapsePowerWhitespace(s);
}

/**
 * User-facing power label for cards/chips. Strips internal notes like
 * consumer-rated, verify SKU, optical class, etc.
 */
export function sanitizePowerLabel(value: string, locale: Locale): string {
  if (locale !== "fr") {
    return stripInternalPowerNotes(value);
  }
  return translatePowerSpecsFr(value);
}

function inferLaserSuffix(machine: Machine, locale: Locale): string | null {
  if (locale !== "fr") {
    const p = machine.specs.power.toLowerCase();
    const type = machine.laserType;
    if (p.includes("+")) return null;
    if (p.includes("co₂") || p.includes("co2") || type === "co2") return "CO₂";
    if (p.includes("fiber") || p.includes("fibre") || type === "fiber") return "fiber";
    if (p.includes("uv") || type === "uv") return "UV";
    if (p.includes("diode") || type === "diode") return "diode";
    return null;
  }

  const p = machine.specs.power.toLowerCase();
  const type = machine.laserType;

  if (p.includes("+")) return null;

  if (p.includes("co₂") || p.includes("co2") || type === "co2") return "CO₂";
  if (p.includes("fibre") || p.includes("fiber") || type === "fiber") return "fibre";
  if (p.includes("uv") || type === "uv") return "UV";
  if (p.includes("infrared") || p.includes("infrarouge") || p.includes("1064")) return "IR";
  if (p.includes("diode") || type === "diode") return "diode";
  if (type === "hybrid") return "hybride";
  return null;
}

function labelIncludesLaserType(label: string): boolean {
  return /co₂|co2|diode|fibre|fiber|\buv\b|infrarouge|\bir\b|hybride|hybrid|1064|visible/i.test(
    label,
  );
}

function formatWattsOnly(machine: Machine): string {
  const rating = machine.powerRating?.trim();
  if (rating && isCompactWattLabel(rating)) return rating;

  const watts = parsePowerWatts(machine);
  if (watts) return `${watts}W`;

  const match = machine.specs.power.match(/(\d+(?:\.\d+)?)\s*W/i);
  return match ? `${match[1]}W` : "—";
}

/** Compact chip for multi-power models: watts only (e.g. 10W, 40W). */
export function formatPowerTierChip(machine: Machine, locale: Locale): string {
  return formatWattsOnly(machine);
}

/**
 * Full power bubble for single-power models: always includes laser type
 * (e.g. 80W CO₂, 20W diode + 20W fibre).
 */
export function formatMachinePowerBubble(machine: Machine, locale: Locale): string {
  const specsPower = machine.specs.power;

  if (locale === "fr") {
    if (specsPower.includes("+")) {
      const hybrid = translatePowerSpecsFr(specsPower);
      if (labelIncludesLaserType(hybrid)) return hybrid;
    }

    const watts = parsePowerWatts(machine);
    const suffix = inferLaserSuffix(machine, locale);

    if (watts && suffix) {
      return translatePowerSpecsFr(`${watts}W ${suffix}`);
    }

    const translated = translatePowerSpecsFr(specsPower);
    if (labelIncludesLaserType(translated)) return translated;

    if (watts && suffix) {
      return translatePowerSpecsFr(`${watts}W ${suffix}`);
    }

    return translated;
  }

  if (specsPower.includes("+")) {
    return stripInternalPowerNotes(specsPower);
  }

  const watts = parsePowerWatts(machine);
  const suffix = inferLaserSuffix(machine, locale);

  if (watts && suffix) {
    return stripInternalPowerNotes(`${watts}W ${suffix}`);
  }

  return stripInternalPowerNotes(specsPower);
}
