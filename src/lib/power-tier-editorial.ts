import type { Locale } from "@/i18n/config";
import { getCatalogDisplayName, parsePowerWatts } from "@/lib/catalog-display";
import { formatPowerTierChipLabel } from "@/lib/tier-chip";
import { noEmDash } from "@/lib/copy-style";
import type { Machine } from "@/types/machine";

export type PowerTierRole =
  | "engrave-only"
  | "engrave-first"
  | "mixed"
  | "cut-strong"
  | "cut-flagship"
  | "fiber-entry"
  | "fiber-mid"
  | "fiber-pro";

export interface TierEditorialCopy {
  bestFor: string[];
  pros: string[];
  cons: string[];
  beginnerNotes: string;
  proTips: string;
  mainObjective: string;
  primaryUse: string;
}

function stripTrailingPower(name: string): string {
  return name.replace(/\s+\d+(?:\.\d+)?\s*W\b/i, "").trim();
}

export function getPowerTierRole(machine: Machine): PowerTierRole {
  const w = parsePowerWatts(machine);
  if (machine.laserType === "fiber") {
    if (w == null || w <= 30) return "fiber-entry";
    if (w <= 50) return "fiber-mid";
    return "fiber-pro";
  }
  if (w == null) return "mixed";
  if (w <= 8) return "engrave-only";
  if (w <= 12) return "engrave-first";
  if (w <= 20) return "mixed";
  if (w <= 35) return "cut-strong";
  return "cut-flagship";
}

function enclosureSignals(machine: Machine): string {
  return [machine.name, machine.specs?.power ?? "", machine.tagline, machine.tldr, machine.primaryUse]
    .join(" ")
    .toLowerCase();
}

function isEnclosed(machine: Machine): boolean {
  if (machine.laserType === "co2") return true;
  const t = enclosureSignals(machine);
  if (/\bopen[- ]?frame\b|\bwithout enclosure\b|\bk40\b/.test(t)) return false;
  return /\benclosed\b|\benceinte\b|\bclass[- ]?1\b|\binterlock\b|\(\s*enclosed\s*\)/i.test(t);
}

/** Keep hand-written pro tips when they mention the brand or concrete workflow advice. */
export function preserveProTips(machine: Machine, fallback: string): string {
  const tips = machine.proTips?.trim();
  if (!tips) return fallback;
  if (tips.length >= 90) return tips;
  if (new RegExp(machine.brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(tips)) {
    return tips;
  }
  if (/material test|LightBurn|Facebook|Reddit|firmware|rotary|extension kit|Creative Space/i.test(tips)) {
    return tips;
  }
  return fallback;
}

function hasInterchangeableModule(machine: Machine): boolean {
  return machine.moduleSystem?.style === "interchangeable";
}

function cutThicknessHint(machine: Machine): string {
  const cuts = machine.materials?.cut ?? [];
  const joined = cuts.join(" ");
  const mm = joined.match(/(\d+)\s*mm/gi);
  if (mm?.length) {
    const nums = mm.map((m) => Number(m.replace(/\D/g, "")));
    return String(Math.max(...nums));
  }
  return roleDefaultCutDepth(getPowerTierRole(machine));
}

function roleDefaultCutDepth(role: PowerTierRole): string {
  if (role === "engrave-only" || role === "engrave-first") return "4";
  if (role === "mixed") return "6";
  return "8";
}

function formatWattList(watts: number[], locale: Locale): string {
  if (watts.length === 0) return "";
  const suffix = locale === "fr" ? "W" : "W";
  const parts = watts.map((w) => `${w}${suffix}`);
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return locale === "fr" ? `${parts[0]} ou ${parts[1]}` : `${parts[0]} or ${parts[1]}`;
  return parts.slice(0, -1).join(", ") + (locale === "fr" ? " ou " : " or ") + parts.at(-1);
}

function higherWattHint(machine: Machine, tiers: Machine[], locale: Locale): string {
  const w = parsePowerWatts(machine);
  if (w == null) return "";
  const higher = tiers
    .map((t) => parsePowerWatts(t))
    .filter((x): x is number => x != null && x > w);
  return formatWattList([...new Set(higher)], locale);
}

const COPY = {
  en: {
    bestFor: {
      "engrave-only": ["Fine engraving", "Photo & logo work", "Gifts & coasters", "First machine"],
      "engrave-first": ["Engraving-focused shops", "Leather & wood gifts", "Learning the line", "Detail-heavy work"],
      mixed: ["Mixed engrave & cut", "Hobby side business", "Signs & boxes", "Small-batch gifts"],
      "cut-strong": ["Faster cutting", "Thicker basswood", "Panel work", "Upgrade from 10W"],
      "cut-flagship": ["Maximum cuts in line", "Speed-focused hobby", "Thick soft woods", "Cut-heavy weeks"],
      "fiber-entry": ["Jewelry tags", "Small metal parts", "Learning fiber", "Bench marking"],
      "fiber-mid": ["Daily metal marking", "Tools & knives", "Shop labels", "Batch runs"],
      "fiber-pro": ["Deep metal engraving", "High throughput", "Production quotes", "Large mark jobs"],
    },
    enclosed: "Fully enclosed cabinet : beam containment and smoke control vs open-frame diodes",
    openFrame: "Open-frame layout : laser glasses and ventilation are your responsibility",
    swappable: "Swappable laser head on the same chassis : upgrade wattage without a new machine",
    upgrade: (hint: string) =>
      hint ? `Higher modules in this line (${hint}) add cut speed and depth` : "",
    skipHigher: (hint: string) =>
      hint ? `Overkill if you only need engraving : compare ${hint} only for heavy cutting` : "",
    fiberNoCut: "Fiber marks metal : does not cut wood or acrylic",
    co2Vent: "CO₂ cutting needs outdoor exhaust or serious filtration : plan before unboxing",
    co2Acrylic: "Strong on acrylic and wood versus diodes on the same budget tier",
    thinCutOnly: (mm: string) => `This module targets thin cuts (about ${mm} mm basswood class) : not thick production plywood`,
    thickCut: (mm: string) => `Best cut headroom in the line : benchmarked around ${mm} mm basswood-class stock`,
    mixedCut: (mm: string) => `Balanced engrave and cut : typical ${mm} mm basswood in multiple passes`,
    tldrLead: "Summary for this exact SKU:",
  },
  fr: {
    bestFor: {
      "engrave-only": ["Gravure fine", "Photo & logo", "Cadeaux & ardoise", "Première machine"],
      "engrave-first": ["Atelier gravure", "Cuir & bois cadeau", "Apprendre la gamme", "Détail prioritaire"],
      mixed: ["Gravure + découpe", "Side business", "Enseignes & boîtes", "Petites séries"],
      "cut-strong": ["Découpe plus rapide", "Bois plus épais", "Panneaux", "Montée depuis 10W"],
      "cut-flagship": ["Découpe max. de la gamme", "Atelier vitesse", "Bois épais", "Semaines découpe"],
      "fiber-entry": ["Bijoux & plaques", "Petites pièces métal", "Apprendre la fibre", "Marquage bureau"],
      "fiber-mid": ["Marquage métal quotidien", "Outils & couteaux", "Étiquettes atelier", "Lots"],
      "fiber-pro": ["Gravure métal profonde", "Débit élevé", "Devis prod.", "Grandes surfaces"],
    },
    enclosed: "Cabine fermée : meilleur confinement du faisceau et des fumées qu’une open-frame",
    openFrame: "Open-frame : lunettes laser et ventilation à votre charge",
    swappable: "Tête laser interchangeable sur le même châssis : monter en puissance sans racheter la machine",
    upgrade: (hint: string) =>
      hint ? `Modules plus puissants dans la gamme (${hint}) : découpe plus rapide et plus profonde` : "",
    skipHigher: (hint: string) =>
      hint ? `Surdimensionné si vous ne gravez que : comparez ${hint} seulement pour la découpe intensive` : "",
    fiberNoCut: "Fibre = marquage métal : ne découpe pas bois ni acrylique",
    co2Vent: "CO₂ : évacuation extérieure ou filtration sérieuse : à prévoir avant déballage",
    co2Acrylic: "Très bon sur acrylique et bois vs diodes au même budget",
    thinCutOnly: (mm: string) =>
      `Ce module vise les découpes fines (environ ${mm} mm de tilleul) : pas la production épaisse`,
    thickCut: (mm: string) => `Meilleure marge de découpe de la gamme : benchmark ~${mm} mm tilleul`,
    mixedCut: (mm: string) => `Gravure et découpe équilibrées : ~${mm} mm tilleul en plusieurs passes`,
    tldrLead: "Résumé pour ce SKU précis :",
  },
} as const;

function labels(locale: Locale) {
  return locale === "fr" ? COPY.fr : COPY.en;
}

/**
 * Machine-specific tier copy for multi-power lines. Uses each profile's own
 * tagline, materials, benchmarks, enclosure, and module system : not generic watt templates.
 */
export function buildMachineTierEditorial(
  machine: Machine,
  tiers: Machine[],
  locale: Locale = "en",
): TierEditorialCopy | null {
  if (tiers.length < 2) return null;

  const role = getPowerTierRole(machine);
  const L = labels(locale);
  const shortName = stripTrailingPower(machine.name);
  const watts = parsePowerWatts(machine);
  const wattLabel = watts != null ? `${watts}W` : machine.specs.power;
  const enclosed = isEnclosed(machine);
  const swappable = hasInterchangeableModule(machine);
  const higher = higherWattHint(machine, tiers, locale);
  const cutMm = cutThicknessHint(machine);

  const pros: string[] = [];
  const cons: string[] = [];

  if (machine.tagline) {
    pros.push(machine.tagline);
  }

  if (machine.laserType === "fiber") {
    pros.push(L.fiberNoCut);
    cons.push(
      locale === "fr"
        ? `Fibre ${wattLabel} : plus lent en profondeur que les modules supérieurs de la même gamme si vous marquez de gros inox`
        : `${wattLabel} fiber: slower on deep marks than higher-watt siblings if you run large stainless jobs`,
    );
    if (higher) {
      cons.push(
        locale === "fr"
          ? `Montée possible vers ${higher} si le débit métal devient critique`
          : `Upgrade path to ${higher} if metal throughput becomes the bottleneck`,
      );
    }
  } else if (machine.laserType === "uv") {
    pros.push(
      locale === "fr"
        ? `${wattLabel} UV : marquage froid sur verre et plastiques sensibles à la chaleur`
        : `${wattLabel} UV: cold marking on glass and heat-sensitive plastics`,
    );
    cons.push(
      locale === "fr"
        ? "Pas de découpe bois/métal : installez un autre module sur le châssis pour ces matériaux"
        : "No wood/metal cutting : install another head on the chassis for those materials",
    );
  } else if (machine.laserType === "hybrid" && /ir|1064|infrared/i.test(machine.specs.power)) {
    pros.push(
      locale === "fr"
        ? `${wattLabel} IR : marquage métal sur le même châssis que les autres modules`
        : `${wattLabel} IR: metal marking on the same chassis as other modules`,
    );
    cons.push(
      locale === "fr"
        ? "Nécessite le châssis complet : ce module seul ne remplace pas une machine dédiée"
        : "Requires the full chassis : this module alone does not replace a dedicated machine",
    );
  } else if (machine.laserType === "co2") {
    pros.push(L.co2Acrylic);
    if (enclosed) pros.push(L.enclosed);
    cons.push(L.co2Vent);
    if (higher) cons.push(L.skipHigher(higher));
  } else {
    // Diode
    if (enclosed) {
      pros.push(L.enclosed);
    } else {
      pros.push(L.openFrame);
    }
    if (swappable) pros.push(L.swappable);

    if (role === "engrave-only" || role === "engrave-first") {
      pros.push(
        locale === "fr"
          ? `${wattLabel} sur ${shortName} : priorité gravure : remplissages photo et cuir`
          : `${wattLabel} on ${shortName}: engraving-first : photo fills and leather at moderate speeds`,
      );
      cons.push(L.thinCutOnly(cutMm));
      if (higher) cons.push(L.upgrade(higher));
      cons.push(
        locale === "fr"
          ? `Pas le SKU pour une boutique qui découpe du ${cutMm} mm+ toute la journée`
          : `Not the SKU for a shop cutting ${cutMm} mm+ stock all day`,
      );
    } else if (role === "cut-flagship" || role === "cut-strong") {
      pros.push(L.thickCut(cutMm));
      pros.push(
        locale === "fr"
          ? `${wattLabel} : tête la plus orientée découpe de ${shortName}`
          : `${wattLabel}: the most cut-focused head in the ${shortName} line`,
      );
      cons.push(
        locale === "fr"
          ? `Gravure photo très fine : ralentir vs un module 10W dédié gravure`
          : `Ultra-fine photo engraving may need slower settings than a 10W engraving-first module`,
      );
      if (machine.laserType === "diode") {
        cons.push(
          locale === "fr"
            ? "Toujours une diode : acrylique transparent et prod. acrylique = CO₂"
            : "Still a diode : clear acrylic production wants CO₂",
        );
      }
    } else {
      pros.push(L.mixedCut(cutMm));
      if (higher) cons.push(L.upgrade(higher));
      cons.push(
        locale === "fr"
          ? `Vérifiez le SKU ${wattLabel} : même châssis, modules différents`
          : `Verify the ${wattLabel} SKU : same chassis, different modules`,
      );
    }

    if (!enclosed) {
      cons.push(
        locale === "fr"
          ? "Open-frame : enfants, animaux et fumées non confinées"
          : "Open frame: kids, pets, and smoke are not contained",
      );
    }
  }

  // Trim duplicates and cap length (role lines before benchmarks)
  const uniqPros = [...new Set(pros.filter(Boolean))].slice(0, 7);
  const uniqCons = [...new Set(cons.filter(Boolean))].slice(0, 6);

  const bestFor = [...L.bestFor[role]];

  const beginnerNotes =
    locale === "fr"
      ? `Ce profil décrit le module ${wattLabel} de ${shortName}. Utilisez le résumé (TL;DR) et les benchmarks ci-dessus, puis comparez les autres puissances via les pastilles avant d’acheter.`
      : `This profile is the ${wattLabel} module on ${shortName}. Read the TL;DR and benchmarks above, then compare other power options via the chips before buying.`;

  const proTipsFallback =
    locale === "fr"
      ? "Utilisez les benchmarks de cette fiche pour chiffrer vos devis. Testez sur chutes avant production."
      : "Use the benchmarks on this profile for quotes. Test on scrap before production.";

  const proTips = preserveProTips(machine, proTipsFallback);

  const genericPrimary =
    /^Engraving-focused diode profile|^Flagship high-power diode for cut-heavy|^Versatile hobby and side-business diode —/i;
  const primaryUse = genericPrimary.test(machine.primaryUse)
    ? locale === "fr"
      ? `Module ${wattLabel} · ${shortName}`
      : `${wattLabel} module · ${shortName}`
    : machine.primaryUse;

  return {
    bestFor,
    pros: uniqPros,
    cons: uniqCons,
    beginnerNotes,
    proTips,
    mainObjective: machine.mainObjective,
    primaryUse,
  };
}

function isInterchangeableModuleLine(tiers: Machine[]): boolean {
  return tiers.some((t) => t.moduleSystem?.style === "interchangeable");
}

function augmentModuleEditorial(
  copy: TierEditorialCopy,
  machine: Machine,
  tiers: Machine[],
  locale: Locale,
): TierEditorialCopy {
  const moduleLabel = formatPowerTierChipLabel(machine, locale, tiers);
  const lineName = getCatalogDisplayName(machine, tiers.length);

  const beginnerNotes =
    locale === "fr"
      ? `Cette fiche décrit le module ${moduleLabel} sur ${lineName}. Même châssis pour les autres têtes : comparez via les pastilles avant d’acheter un module.`
      : `This profile is the ${moduleLabel} module on ${lineName}. Same chassis for other heads : compare via the chips before buying a module.`;

  const primaryUse =
    copy.primaryUse?.includes("module") || copy.primaryUse?.includes("Module")
      ? copy.primaryUse
      : locale === "fr"
        ? `Module ${moduleLabel} · ${lineName}`
        : `${moduleLabel} module · ${lineName}`;

  return {
    ...copy,
    beginnerNotes: machine.beginnerNotes?.trim() ? copy.beginnerNotes : beginnerNotes,
    primaryUse,
    mainObjective: machine.mainObjective || copy.mainObjective,
  };
}

function machineEditorialSlice(machine: Machine): TierEditorialCopy {
  return {
    bestFor: machine.bestFor,
    pros: machine.pros,
    cons: machine.cons,
    beginnerNotes: machine.beginnerNotes,
    proTips: machine.proTips,
    mainObjective: machine.mainObjective,
    primaryUse: machine.primaryUse,
  };
}
function normalizeEditorial<T extends TierEditorialCopy>(slice: T): T {
  return {
    ...slice,
    pros: slice.pros.map(noEmDash),
    cons: slice.cons.map(noEmDash),
    beginnerNotes: noEmDash(slice.beginnerNotes),
    proTips: noEmDash(slice.proTips),
    mainObjective: noEmDash(slice.mainObjective),
    primaryUse: noEmDash(slice.primaryUse),
  };
}

/**
 * Multi-power SKU lines without swappable heads: derived watt-role copy when JSON allows.
 * Interchangeable module lines: always use each tier's JSON (specs, materials, benchmarks).
 */
export function resolveMachineEditorial(
  machine: Machine,
  tiers: Machine[],
  locale: Locale,
): Pick<
  Machine,
  "bestFor" | "pros" | "cons" | "beginnerNotes" | "proTips" | "mainObjective" | "primaryUse"
> {
  const useTierJson =
    machine.tierEditorialOverride ||
    (tiers.length > 1 && isInterchangeableModuleLine(tiers));

  if (useTierJson) {
    const base = normalizeEditorial(machineEditorialSlice(machine));
    if (isInterchangeableModuleLine(tiers)) {
      return normalizeEditorial(augmentModuleEditorial(base, machine, tiers, locale));
    }
    return base;
  }

  const derived = buildMachineTierEditorial(machine, tiers, locale);
  if (!derived) {
    return normalizeEditorial(machineEditorialSlice(machine));
  }
  return normalizeEditorial(derived);
}
