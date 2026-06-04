import type { Locale } from "@/i18n/config";
import { getCatalogDisplayName, parsePowerWatts } from "@/lib/catalog-display";
import { dedupeBulletList, filterBulletsAgainstDepth } from "@/lib/editorial-dedupe";
import { formatPowerTierChipLabel } from "@/lib/tier-chip";
import { noEmDash } from "@/lib/copy-style";
import type { Machine, MachineEditorialDepth } from "@/types/machine";

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
    enclosed: "Integrated cabinet helps contain the beam and everyday smoke versus open-frame diodes",
    openFrame: "Open-frame : plan laser glasses, exhaust, and workspace rules from day one",
    swappable: "Swappable head on the same chassis : upgrade power without replacing the whole machine",
    upgrade: (hint: string) =>
      hint ? `Higher modules in this line (${hint}) add cut speed and depth` : "",
    skipHigher: (hint: string) =>
      hint ? `Overkill if you only need engraving : compare ${hint} only for heavy cutting` : "",
    fiberNoCut: "Fiber marks metal : does not cut wood or acrylic",
    co2Vent: "CO₂ cutting needs outdoor exhaust or serious filtration : plan before unboxing",
    co2Acrylic: "Strong on acrylic and wood versus diodes on the same budget tier",
    thinCutOnly: (mm: string) => `Targets thin cuts (about ${mm} mm basswood class) : not thick production plywood`,
    thickCut: (mm: string) => `Strongest cut headroom in the line : about ${mm} mm basswood-class stock in benchmarks`,
    mixedCut: (mm: string) => `Everyday engrave and light cut mix : typical ${mm} mm basswood in several passes`,
    tldrLead: "Summary for this exact SKU:",
  },
  fr: {
    bestFor: {
      "engrave-only": ["Gravure fine", "Photo & logo", "Cadeaux & ardoise", "Première machine"],
      "engrave-first": ["Atelier gravure", "Cuir & bois cadeau", "Apprendre la gamme", "Détail prioritaire"],
      mixed: ["Gravure + découpe", "Petite activité", "Enseignes & boîtes", "Petites séries"],
      "cut-strong": ["Découpe plus rapide", "Bois plus épais", "Panneaux", "Montée depuis 10W"],
      "cut-flagship": ["Découpe max. de la gamme", "Atelier vitesse", "Bois épais", "Semaines découpe"],
      "fiber-entry": ["Bijoux & plaques", "Petites pièces métal", "Apprendre la fibre", "Marquage bureau"],
      "fiber-mid": ["Marquage métal quotidien", "Outils & couteaux", "Étiquettes atelier", "Lots"],
      "fiber-pro": ["Gravure métal profonde", "Débit élevé", "Devis prod.", "Grandes surfaces"],
    },
    enclosed: "Cabine intégrée : meilleur confinement du faisceau et des fumées qu’une open-frame",
    openFrame: "Open-frame : prévoyez lunettes, extraction et règles d’atelier dès le premier jour",
    swappable: "Tête interchangeable sur le même châssis : monter en puissance sans racheter la machine",
    upgrade: (hint: string) =>
      hint ? `Modules plus puissants dans la gamme (${hint}) : découpe plus rapide et plus profonde` : "",
    skipHigher: (hint: string) =>
      hint ? `Surdimensionné si vous ne gravez que : comparez ${hint} seulement pour la découpe intensive` : "",
    fiberNoCut: "Fibre = marquage métal : ne découpe pas bois ni acrylique",
    co2Vent: "CO₂ : évacuation extérieure ou filtration sérieuse : à prévoir avant déballage",
    co2Acrylic: "Très bon sur acrylique et bois vs diodes au même budget",
    thinCutOnly: (mm: string) =>
      `Vise les découpes fines (environ ${mm} mm de tilleul) : pas la production épaisse`,
    thickCut: (mm: string) => `Meilleure marge de découpe de la gamme : ~${mm} mm tilleul en benchmark`,
    mixedCut: (mm: string) => `Mix gravure + découpe légère : ~${mm} mm tilleul en plusieurs passes`,
    tldrLead: "Résumé pour ce SKU précis :",
  },
} as const;

function labels(locale: Locale) {
  return locale === "fr" ? COPY.fr : COPY.en;
}

const EN_TIPS_RESIDUE =
  /\b(Use air assist|lower scan speed|Multiple passes|Treat engraving|Run material test|Check the flagship|Everyday engraving|High-quality hobby)\b/i;

function looksEnglishTips(value: string | undefined): boolean {
  return Boolean(value?.trim() && EN_TIPS_RESIDUE.test(value));
}

function buildLocalizedMainObjective(machine: Machine, role: PowerTierRole, locale: Locale): string {
  if (locale !== "fr") return machine.mainObjective;
  const byRole: Record<PowerTierRole, string> = {
    "engrave-only": "Gravure fine et cadeaux — découpe légère seulement",
    "engrave-first": "Priorité gravure avec découpe occasionnelle sur petites épaisseurs",
    mixed: "Gravure quotidienne et découpe légère fiable sur bois, cuir et acrylique foncé",
    "cut-strong": "Découpe plus rapide sur bois moyen, gravure toujours utilisable",
    "cut-flagship": "Découpe intensive dans la gamme — gravure correcte en second plan",
    "fiber-entry": "Marquage métal bureau et petites pièces pour apprendre la fibre",
    "fiber-mid": "Marquage métal quotidien, outils et étiquettes atelier",
    "fiber-pro": "Gravure métal profonde et débit pour devis production",
  };
  const generated = byRole[role];
  if (looksEnglishTips(machine.mainObjective) || /\b(everyday|high-quality|reliable light)\b/i.test(machine.mainObjective)) {
    return generated;
  }
  return machine.mainObjective?.trim() ? machine.mainObjective : generated;
}

function buildLocalizedProTips(machine: Machine, role: PowerTierRole, locale: Locale, fallback: string): string {
  if (locale !== "fr") return preserveProTips(machine, fallback);
  const byRole: Partial<Record<PowerTierRole, string>> = {
    "engrave-only":
      "Commencez par des grilles de test en gravure. L’assistance air aide sur les petites découpes. Si la découpe dépasse ~30 % de votre temps, comparez le SKU supérieur via les pastilles.",
    "engrave-first":
      "Optimisez la gravure avant la découpe : vitesse de balayage plus basse pour les photos. L’assistance air reste utile sur le cuir et le bois fin.",
    mixed:
      "Utilisez l’assistance air pour la découpe, ralentissez pour la photo. Plusieurs passes modérées valent mieux qu’une passe agressive. Comparez le benchmark découpe du SKU supérieur pour vos devis.",
    "cut-strong":
      "Priorisez les profils découpe sur chutes épaisses. Pour la gravure photo, acceptez des vitesses plus lentes qu’avec un module 10W dédié.",
    "cut-flagship":
      "Chiffrez vos devis avec les benchmarks découpe de cette fiche. Testez l’évacuation avant les longues sessions sur bois épais.",
  };
  const tips = machine.proTips?.trim();
  if (tips && !looksEnglishTips(tips) && tips.length >= 40) return tips;
  return byRole[role] ?? fallback;
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
  if (tiers.length < 1) return null;

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
    // Diode — lead with SKU-specific lines; enclosure note comes later
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

    if (swappable) pros.push(L.swappable);
    if (enclosed) {
      pros.push(L.enclosed);
    } else if (!enclosed && machine.laserType === "diode") {
      pros.push(L.openFrame);
    }
  }

  // Trim duplicates and cap length
  let uniqPros = [...new Set(pros.filter(Boolean))].slice(0, 6);
  uniqPros = uniqPros.filter((p) => !hasBoilerplatePros([p]));
  const uniqCons = [...new Set(cons.filter(Boolean))].slice(0, 6);

  const bestFor = [...L.bestFor[role]];

  const compareWord = swappable
    ? locale === "fr"
      ? "les autres modules via les pastilles"
      : "other modules via the chips"
    : locale === "fr"
      ? "les autres puissances via les pastilles"
      : "other power options via the chips";

  const beginnerNotes =
    locale === "fr"
      ? `Ce profil décrit le SKU ${wattLabel} de ${shortName}. Lisez le résumé (TL;DR) et les benchmarks ci-dessus, puis comparez ${compareWord} avant d’acheter.`
      : `This profile is the ${wattLabel} SKU on ${shortName}. Read the TL;DR and benchmarks above, then compare ${compareWord} before buying.`;

  const proTipsFallback =
    locale === "fr"
      ? "Utilisez les benchmarks de cette fiche pour chiffrer vos devis. Testez sur chutes avant production."
      : "Use the benchmarks on this profile for quotes. Test on scrap before production.";

  const proTips = buildLocalizedProTips(machine, role, locale, proTipsFallback);

  const genericPrimary =
    /^Engraving-focused diode profile|^Flagship high-power diode for cut-heavy|^Versatile hobby and side-business diode —|\d+W module ·/i;
  const primaryUse =
    locale === "fr" || genericPrimary.test(machine.primaryUse)
      ? locale === "fr"
        ? `Module ${wattLabel} · ${shortName}`
        : `${wattLabel} module · ${shortName}`
      : machine.primaryUse;

  return {
    bestFor,
    pros: dedupeBulletList(uniqPros, 3),
    cons: dedupeBulletList(uniqCons, 2),
    beginnerNotes,
    proTips,
    mainObjective: buildLocalizedMainObjective(machine, role, locale),
    primaryUse,
  };
}

/** Narrative “ideal for / skip if” block for every machine profile */
export function buildEditorialDepth(
  machine: Machine,
  tiers: Machine[],
  locale: Locale = "en",
): MachineEditorialDepth {
  const role = getPowerTierRole(machine);
  const shortName = stripTrailingPower(machine.name);
  const watts = parsePowerWatts(machine);
  const wattLabel = watts != null ? `${watts}W` : machine.specs.power;
  const enclosed = isEnclosed(machine);
  const swappable = hasInterchangeableModule(machine);
  const higher = higherWattHint(machine, tiers, locale);
  const cutMm = cutThicknessHint(machine);
  const fr = locale === "fr";

  if (machine.laserType === "fiber") {
    return {
      advantages: noEmDash(
        fr
          ? `${shortName} ${wattLabel} convient aux ateliers qui marquent inox, aluminium et outils au quotidien sans atelier CO₂. Bon compromis bureau pour bijoux, plaques et petites séries.`
          : `${shortName} ${wattLabel} fits shops that mark stainless, aluminum, and tools daily without a CO₂ bay. A solid bench option for jewelry, tags, and small batches.`,
      ),
      limitations: noEmDash(
        fr
          ? `Passez votre chemin si le bois, le cuir ou l’acrylique coulé sont votre chiffre d’affaires. La découpe métal profonde et les gros formats industriels demandent souvent une fibre plus puissante${higher ? ` (${higher})` : ""} ou une autre machine.`
          : `Skip if wood, leather, or cast acrylic pay your bills. Deep metal cutting and large industrial panels often need more fiber headroom${higher ? ` (${higher})` : ""} or a different machine class.`,
      ),
    };
  }

  if (machine.laserType === "uv") {
    return {
      advantages: noEmDash(
        fr
          ? `${shortName} ${wattLabel} cible verre, films et plastiques sensibles à la chaleur : niche rentable quand vous avez déjà des commandes, pas pour “essayer l’UV”.`
          : `${shortName} ${wattLabel} targets glass, films, and heat-sensitive plastics : profitable when you already sell those jobs, not for casual UV experiments.`,
      ),
      limitations: noEmDash(
        fr
          ? `Inutile comme première machine. Pas de découpe bois/métal. Vérifiez la liste matériaux du module avant d’investir dans le châssis.`
          : `Poor first-laser purchase. No wood or metal cutting. Confirm the module material list before buying the chassis.`,
      ),
    };
  }

  if (machine.laserType === "co2") {
    return {
      advantages: noEmDash(
        fr
          ? `${shortName} est fait pour signalétique acrylique, bois épais et production atelier quand l’évacuation est installée. ${wattLabel} donne de la marge sur les panneaux et les passes multiples.`
          : `${shortName} is built for acrylic signage, thick wood, and shop production once exhaust is sorted. ${wattLabel} adds headroom on panels and multi-pass jobs.`,
      ),
      limitations: noEmDash(
        fr
          ? `À éviter en appartement sans gaine, pour des cadeaux occasionnels, ou si le budget n’inclut pas tube + électricité + place au sol. Le métal nu sans accessoire IR reste hors scope.`
          : `Avoid without ducting, for occasional gifts only, or if budget ignores tube replacement, power, and floor space. Bare metal without an IR accessory stays out of scope.`,
      ),
    };
  }

  if (swappable) {
    const moduleLabel = formatPowerTierChipLabel(machine, locale, tiers);
    const lineName = getCatalogDisplayName(machine, tiers.length);
    if (role === "engrave-only" || role === "engrave-first") {
      return {
        advantages: noEmDash(
          fr
            ? `Le module ${moduleLabel} sur ${lineName} est le bon choix si vous gravez surtout bois, cuir et ardoise et n’achetez pas des watts de découpe inutiles. Même châssis, montée possible plus tard.`
            : `The ${moduleLabel} module on ${lineName} is right when you mostly engrave wood, leather, and slate and should not pay for cut watts you will not use weekly. Same chassis, upgrade path later.`,
        ),
        limitations: noEmDash(
          fr
            ? `Ne prenez pas ce module si vous découpez du ${cutMm} mm+ tous les jours${higher ? ` : ouvrez le profil ${higher}` : ""}. Acrylique coulé et métal sans spray restent frustrants sur diode.`
            : `Skip this module if you cut ${cutMm} mm+ stock daily${higher ? ` : open the ${higher} profile` : ""}. Cast acrylic and bare metal without spray stay frustrating on diode.`,
        ),
      };
    }
    if (role === "cut-flagship" || role === "cut-strong") {
      return {
        advantages: noEmDash(
          fr
            ? `Le module ${moduleLabel} est la tête la plus orientée découpe de ${lineName} : bois plus épais et remplissages plus rapides que les modules d’entrée sur le même châssis.`
            : `The ${moduleLabel} module is the most cut-focused head on ${lineName} : thicker basswood and faster fills than entry modules on the same chassis.`,
        ),
        limitations: noEmDash(
          fr
            ? `Surdimensionné si vous ne faites que gravure fine. Toujours une diode : acrylique transparent = CO₂. Prévoyez lunettes et extraction si le châssis est open-frame.`
            : `Overkill if you only do fine engraving. Still a diode : clear cast acrylic means CO₂. Plan glasses and exhaust if the chassis is open-frame.`,
        ),
      };
    }
    return {
      advantages: noEmDash(
        fr
          ? `Le module ${moduleLabel} équilibre gravure et découpe légère sur ${lineName} : le SKU le plus polyvalent avant de monter en tête plus puissante.`
          : `The ${moduleLabel} module balances engraving and light cutting on ${lineName} : the most versatile SKU before stepping up to a stronger head.`,
      ),
      limitations: noEmDash(
        fr
          ? `Si la découpe épaisse domine votre semaine${higher ? `, comparez ${higher}` : ""}. Vérifiez le module dans la boîte : même châssis, têtes différentes.`
          : `If thick cutting dominates your week${higher ? `, compare ${higher}` : ""}. Verify which module is in the box : same chassis, different heads.`,
      ),
    };
  }

  if (role === "engrave-only" || role === "engrave-first") {
    return {
      advantages: noEmDash(
        fr
          ? `${shortName} ${wattLabel} convient aux makers qui vendent surtout des marques, photos et cadeaux, pas des panneaux découpés chaque jour. ${enclosed ? "Format fermé plus rassurant à la maison." : "Prix d’entrée open-frame raisonnable."}`
          : `${shortName} ${wattLabel} suits makers who sell marks, photos, and gifts more than daily panel cutting. ${enclosed ? "Enclosed format is easier to live with at home." : "Reasonable open-frame entry price."}`,
      ),
      limitations: noEmDash(
        fr
          ? `À éviter si vous quotez déjà de la découpe ${cutMm} mm+ en série${higher ? ` : regardez ${higher} dans la gamme` : ""}. Pas pour l’acrylique coulé ni le métal nu sans spray.`
          : `Skip if you already quote ${cutMm} mm+ cutting in production${higher ? ` : see ${higher} in the line` : ""}. Not for cast acrylic or bare metal without spray.`,
      ),
    };
  }

  if (role === "cut-flagship" || role === "cut-strong") {
    return {
      advantages: noEmDash(
        fr
          ? `${shortName} ${wattLabel} vise les semaines mixtes gravure + découpe bois : moins de passes sur tilleul et acrylique foncé que les SKUs faibles de la même gamme.`
          : `${shortName} ${wattLabel} targets mixed engraving and wood-cutting weeks : fewer passes on basswood and dark acrylic than weaker SKUs in the same line.`,
      ),
      limitations: noEmDash(
        fr
          ? `Mauvais choix si vous ne gravez jamais et vouliez le prix le plus bas. Gravure photo ultra-fine : parfois mieux sur un module gravure-first. ${!enclosed ? "Open-frame : sécurité et fumées à votre charge." : ""}`
          : `Wrong pick if you never engrave and only wanted the lowest price. Ultra-fine photo work can look better on an engraving-first SKU. ${!enclosed ? "Open-frame : safety and smoke are on you." : ""}`,
      ),
    };
  }

  return {
    advantages: noEmDash(
      fr
        ? `${shortName} ${wattLabel} est le SKU polyvalent hobby / petit business : gravure propre et découpes légères sur bois et cuir avec benchmarks comparables sur Maker Atlas.`
        : `${shortName} ${wattLabel} is the versatile hobby / side-business SKU : clean engraving and light wood or leather cuts with comparable benchmarks on Maker Atlas.`,
    ),
    limitations: noEmDash(
      fr
        ? `${enclosed ? "" : "Open-frame : lunettes et extraction obligatoires. "}${higher ? `Montée possible vers ${higher} si la découpe prend le dessus. ` : ""}Pas de remplacement CO₂ pour acrylique transparent ou grosses séries épaisses.`
        : `${enclosed ? "" : "Open-frame : glasses and exhaust required. "}${higher ? `Upgrade path to ${higher} if cutting takes over. ` : ""}Not a CO₂ replacement for clear acrylic or heavy thick-stock production.`,
    ),
  };
}

export function hasBoilerplatePros(pros: string[]): boolean {
  const patterns = [
    /^Open-frame layout\s*:/i,
    /^Fully enclosed cabinet\s*:/i,
    /^Swappable laser head on the same chassis/i,
    /^Work area \d/i,
    /^Software:/i,
    /^Reference engrave job/i,
    /^Reference cut job/i,
    /^Balanced engrave and cut\s*:/i,
    /^Mixed engrave and cut module\s*:/i,
  ];
  return pros.some((p) => patterns.some((re) => re.test(p)));
}

/** Single-SKU or standalone profile (no multi-tier line) */
export function buildSingleMachineEditorial(
  machine: Machine,
  locale: Locale = "en",
): TierEditorialCopy {
  const tiers = [machine];
  const derived = buildMachineTierEditorial(machine, tiers, locale);
  const role = getPowerTierRole(machine);
  const L = labels(locale);
  const shortName = stripTrailingPower(machine.name);
  const watts = parsePowerWatts(machine);
  const wattLabel = watts != null ? `${watts}W` : machine.specs.power;

  if (derived) {
    const pros = derived.pros.filter(
      (p) => p !== machine.tagline && !/^Work area \d/i.test(p) && !/^Software:/i.test(p),
    );
    while (pros.length < 4) {
      pros.push(
        locale === "fr"
          ? `${shortName} : fiche complète avec limites matériaux et benchmarks sur Maker Atlas`
          : `${shortName} : full profile with material limits and benchmarks on Maker Atlas`,
      );
    }
    return {
      ...derived,
      pros: [...new Set(pros)].slice(0, 6),
      beginnerNotes:
        locale === "fr"
          ? `Cette fiche décrit ${machine.name}. Lisez le résumé (TL;DR) et les benchmarks avant d’acheter, puis comparez des modèles proches via la page Comparer.`
          : `This profile covers ${machine.name}. Read the TL;DR and benchmarks before buying, then compare nearby models on the Compare page.`,
      proTips: preserveProTips(
        machine,
        locale === "fr"
          ? "Faites des tests sur chutes. Utilisez les temps de référence de cette fiche pour vos devis, pas les promesses marketing."
          : "Run scrap tests first. Use this profile’s reference times for quotes, not marketing claims.",
      ),
      primaryUse:
        machine.primaryUse?.trim() && !/^Engraving-focused diode profile/i.test(machine.primaryUse)
          ? machine.primaryUse
          : locale === "fr"
            ? `Profil ${wattLabel} · ${shortName}`
            : `${wattLabel} profile · ${shortName}`,
      bestFor: machine.bestFor?.length ? machine.bestFor : [...L.bestFor[role]],
    };
  }

  return {
    bestFor: machine.bestFor?.length ? machine.bestFor : [...L.bestFor.mixed],
    pros: machine.pros?.length ? machine.pros : [machine.tagline].filter(Boolean),
    cons: machine.cons?.length ? machine.cons : [],
    beginnerNotes: machine.beginnerNotes,
    proTips: machine.proTips,
    mainObjective: machine.mainObjective,
    primaryUse: machine.primaryUse,
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

function finalizeEditorialLists(
  slice: TierEditorialCopy,
  machine: Machine,
): TierEditorialCopy {
  const depth = machine.editorialDepth;
  return {
    ...slice,
    pros: filterBulletsAgainstDepth(slice.pros, depth, "pro"),
    cons: filterBulletsAgainstDepth(slice.cons, depth, "con"),
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
    const base = finalizeEditorialLists(
      normalizeEditorial(machineEditorialSlice(machine)),
      machine,
    );
    if (isInterchangeableModuleLine(tiers)) {
      return finalizeEditorialLists(
        normalizeEditorial(augmentModuleEditorial(base, machine, tiers, locale)),
        machine,
      );
    }
    return base;
  }

  const derived = buildMachineTierEditorial(machine, tiers, locale);
  if (!derived) {
    return finalizeEditorialLists(normalizeEditorial(machineEditorialSlice(machine)), machine);
  }
  return finalizeEditorialLists(normalizeEditorial(derived), machine);
}
