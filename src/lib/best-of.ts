import type { Locale } from "@/i18n/config";
import type { CatalogEntry } from "@/lib/catalog-types";
import { parsePowerWatts } from "@/lib/catalog-display";
import { getCatalogEntries } from "@/lib/content";
import { getMachineWorkFocus } from "@/lib/machine-work-focus";
import type { Machine } from "@/types/machine";

const LIST_SIZE = 7;
export const BEST_OF_YEAR = 2026;

interface BestOfCopy {
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  /** Noun phrase used in generated FAQ questions, e.g. "diode laser". */
  faqSubject: string;
}

export interface BestOfCategory {
  slug: string;
  copy: Record<Locale, BestOfCopy>;
  /** Related guide slugs shown at the bottom of the page. */
  guideSlugs: string[];
  filter: (machine: Machine) => boolean;
  /** Higher score ranks first. Defaults to overall rating. */
  score?: (machine: Machine) => number;
}

function matchesBusinessUse(machine: Machine): boolean {
  const blob = [machine.primaryUse, machine.mainObjective, ...machine.bestFor]
    .join(" ")
    .toLowerCase();
  return /etsy|business|batch|production|sign shop|side hustle|shop/.test(blob);
}

function canMarkMetal(machine: Machine): boolean {
  if (machine.laserType === "fiber" || machine.laserType === "uv") return true;
  if (machine.laserCapabilities?.includes("fiber")) return true;
  if (machine.capabilityTags?.includes("infrared")) return true;
  return false;
}

function isEnclosedLaser(machine: Machine): boolean {
  const blob = [machine.tagline, machine.tldr, machine.primaryUse, ...machine.pros, ...machine.bestFor]
    .join(" ")
    .toLowerCase();
  if (/enclosed|class 1|class-1|class i\b|fully enclosed/.test(blob)) return true;
  return /^(xtool-s1|ortur-h20|sculpfun-icube-pro|glowforge-(aura|pro)|wecreat-vision|acmer-p3)/.test(
    machine.slug,
  );
}

function isPortableMetalMarker(machine: Machine): boolean {
  if (machine.priceRange.min > 4000) return false;
  if (machine.laserType === "fiber" || machine.laserType === "uv") return true;
  return machine.laserType === "hybrid" && canMarkMetal(machine);
}

export const BEST_OF_CATEGORIES: BestOfCategory[] = [
  {
    slug: "diode-lasers",
    copy: {
      en: {
        title: `Best Diode Lasers ${BEST_OF_YEAR}`,
        metaTitle: `Best Diode Lasers ${BEST_OF_YEAR}: Tested Rankings`,
        metaDescription: `The best diode laser engravers of ${BEST_OF_YEAR}, ranked by real-world scores: cutting power, ease of use, software, and value for money.`,
        intro:
          "Diode lasers are the most affordable way to engrave and cut wood, leather, and dark acrylic. Here are the models that score highest in our database, ranked by overall rating.",
        faqSubject: "diode laser",
      },
      fr: {
        title: `Meilleurs lasers diode ${BEST_OF_YEAR}`,
        metaTitle: `Meilleurs lasers diode ${BEST_OF_YEAR} : classement honnête`,
        metaDescription: `Les meilleurs graveurs laser diode de ${BEST_OF_YEAR}, classés selon nos notes réelles : puissance de découpe, facilité d'usage, logiciel et rapport qualité-prix.`,
        intro:
          "Les lasers diode sont le moyen le plus abordable de graver et découper le bois, le cuir et l'acrylique foncé. Voici les modèles les mieux notés de notre base, classés par note globale.",
        faqSubject: "laser diode",
      },
    },
    guideSlugs: ["diode-lasers-explained", "laser-buying-guide-2026"],
    filter: (m) => m.laserType === "diode",
  },
  {
    slug: "co2-lasers",
    copy: {
      en: {
        title: `Best CO₂ Lasers ${BEST_OF_YEAR}`,
        metaTitle: `Best CO₂ Laser Cutters ${BEST_OF_YEAR}: Tested Rankings`,
        metaDescription: `The best desktop CO₂ laser cutters of ${BEST_OF_YEAR}, ranked: acrylic and wood cutting performance, work area, reliability, and value.`,
        intro:
          "CO₂ lasers are the standard for cutting acrylic and thick wood cleanly. These are the desktop and mid-size machines that rank highest in our database.",
        faqSubject: "CO₂ laser",
      },
      fr: {
        title: `Meilleurs lasers CO₂ ${BEST_OF_YEAR}`,
        metaTitle: `Meilleures découpeuses laser CO₂ ${BEST_OF_YEAR} : classement`,
        metaDescription: `Les meilleures découpeuses laser CO₂ de bureau de ${BEST_OF_YEAR}, classées : découpe d'acrylique et de bois, surface de travail, fiabilité et prix.`,
        intro:
          "Les lasers CO₂ sont la référence pour découper proprement l'acrylique et le bois épais. Voici les machines de bureau et de milieu de gamme les mieux notées de notre base.",
        faqSubject: "laser CO₂",
      },
    },
    guideSlugs: ["co2-lasers-explained", "co2-laser-tubes-explained"],
    filter: (m) => m.laserType === "co2",
  },
  {
    slug: "metal-engraving",
    copy: {
      en: {
        title: `Best Lasers for Metal Engraving ${BEST_OF_YEAR}`,
        metaTitle: `Best Metal Engraving Lasers ${BEST_OF_YEAR}: Fiber & More`,
        metaDescription: `The best lasers for marking and engraving metal in ${BEST_OF_YEAR}: fiber, MOPA, and hybrid machines ranked for jewelry, tools, and industrial marking.`,
        intro:
          "Marking bare metal needs a 1064 nm source: fiber, MOPA, or an infrared module. These machines rank highest for stainless, aluminum, brass, and jewelry work.",
        faqSubject: "laser for metal engraving",
      },
      fr: {
        title: `Meilleurs lasers pour graver le métal ${BEST_OF_YEAR}`,
        metaTitle: `Meilleurs lasers gravure métal ${BEST_OF_YEAR} : fibre et plus`,
        metaDescription: `Les meilleurs lasers pour marquer et graver le métal en ${BEST_OF_YEAR} : machines fibre, MOPA et hybrides classées pour les bijoux, outils et le marquage industriel.`,
        intro:
          "Marquer du métal nu demande une source 1064 nm : fibre, MOPA ou module infrarouge. Ces machines sont les mieux notées pour l'inox, l'aluminium, le laiton et la bijouterie.",
        faqSubject: "laser pour graver le métal",
      },
    },
    guideSlugs: ["fiber-lasers-explained", "metal-marking-without-fiber", "mopa-fiber-lasers-explained"],
    filter: canMarkMetal,
  },
  {
    slug: "beginners",
    copy: {
      en: {
        title: `Best Lasers for Beginners ${BEST_OF_YEAR}`,
        metaTitle: `Best Laser Engravers for Beginners ${BEST_OF_YEAR}`,
        metaDescription: `The easiest laser engravers to start with in ${BEST_OF_YEAR}: ranked by ease of use, safety, software simplicity, and beginner-friendly pricing.`,
        intro:
          "Starting out? These machines rank highest for ease of use in our database: simple setup, forgiving software, and clear documentation, without a four-figure commitment.",
        faqSubject: "laser for beginners",
      },
      fr: {
        title: `Meilleurs lasers pour débuter ${BEST_OF_YEAR}`,
        metaTitle: `Meilleurs graveurs laser pour débutants ${BEST_OF_YEAR}`,
        metaDescription: `Les graveurs laser les plus simples pour démarrer en ${BEST_OF_YEAR} : classés par facilité d'usage, sécurité, simplicité logicielle et prix accessible.`,
        intro:
          "Vous débutez ? Ces machines obtiennent les meilleures notes de facilité d'usage de notre base : installation simple, logiciel tolérant et documentation claire, sans investir quatre chiffres.",
        faqSubject: "laser pour débuter",
      },
    },
    guideSlugs: ["laser-buying-guide-2026", "laser-safety-basics", "understanding-laser-types"],
    filter: (m) =>
      (m.laserType === "diode" || m.laserType === "co2") && m.priceRange.min <= 1200,
    score: (m) => m.rating.easeOfUse * 0.6 + m.rating.overall * 0.4,
  },
  {
    slug: "budget",
    copy: {
      en: {
        title: `Best Budget Lasers ${BEST_OF_YEAR}`,
        metaTitle: `Best Budget Laser Engravers ${BEST_OF_YEAR} (Under $500)`,
        metaDescription: `The best cheap laser engravers of ${BEST_OF_YEAR} under $500, ranked by value for money: what you actually get, and what corners are cut.`,
        intro:
          "Under $500, every dollar counts. These machines rank highest for value in our database: honest capability for the price, without the marketing inflation.",
        faqSubject: "budget laser",
      },
      fr: {
        title: `Meilleurs lasers petit budget ${BEST_OF_YEAR}`,
        metaTitle: `Meilleurs graveurs laser pas chers ${BEST_OF_YEAR} (moins de 500 $)`,
        metaDescription: `Les meilleurs graveurs laser à moins de 500 $ en ${BEST_OF_YEAR}, classés par rapport qualité-prix : ce que vous obtenez vraiment, et où sont les compromis.`,
        intro:
          "Sous les 500 $, chaque dollar compte. Ces machines obtiennent les meilleures notes de rapport qualité-prix de notre base : des capacités honnêtes pour le prix, sans inflation marketing.",
        faqSubject: "laser petit budget",
      },
    },
    guideSlugs: ["laser-wattage-marketing-explained", "laser-buying-guide-2026"],
    filter: (m) => m.priceRange.min <= 500,
    score: (m) => m.rating.value * 0.6 + m.rating.overall * 0.4,
  },
  {
    slug: "cutting",
    copy: {
      en: {
        title: `Best Lasers for Cutting ${BEST_OF_YEAR}`,
        metaTitle: `Best Laser Cutters ${BEST_OF_YEAR}: Wood & Acrylic Rankings`,
        metaDescription: `The best laser cutters of ${BEST_OF_YEAR} for wood, plywood, and acrylic: high-power diodes and CO₂ machines ranked by real cutting performance.`,
        intro:
          "If cutting shapes and parts is the main job, raw cutting capability matters more than anything. These high-power diodes and CO₂ machines rank highest for cutting work.",
        faqSubject: "laser cutter",
      },
      fr: {
        title: `Meilleurs lasers pour la découpe ${BEST_OF_YEAR}`,
        metaTitle: `Meilleures découpeuses laser ${BEST_OF_YEAR} : bois et acrylique`,
        metaDescription: `Les meilleures découpeuses laser de ${BEST_OF_YEAR} pour le bois, le contreplaqué et l'acrylique : diodes haute puissance et machines CO₂ classées par performances réelles.`,
        intro:
          "Si la découpe de formes et de pièces est l'usage principal, la capacité de coupe prime sur tout. Ces diodes haute puissance et machines CO₂ sont les mieux notées pour la découpe.",
        faqSubject: "laser de découpe",
      },
    },
    guideSlugs: ["open-frame-vs-enclosed-lasers", "laser-materials-by-type"],
    filter: (m) => {
      const focus = getMachineWorkFocus(m);
      if (focus === "engrave") return false;
      if (m.laserType === "co2") return true;
      const watts = parsePowerWatts(m) ?? 0;
      return watts >= 20;
    },
  },
  {
    slug: "small-business",
    copy: {
      en: {
        title: `Best Lasers for Small Business ${BEST_OF_YEAR}`,
        metaTitle: `Best Lasers for Etsy & Small Business ${BEST_OF_YEAR}`,
        metaDescription: `The best laser engravers for Etsy sellers and small workshops in ${BEST_OF_YEAR}: ranked for batch production, reliability, and return on investment.`,
        intro:
          "Selling what you make changes the math: throughput, reliability, and consistency matter as much as quality. These machines rank highest for production and small-business use.",
        faqSubject: "laser for a small business",
      },
      fr: {
        title: `Meilleurs lasers pour petite entreprise ${BEST_OF_YEAR}`,
        metaTitle: `Meilleurs lasers pour Etsy et petite entreprise ${BEST_OF_YEAR}`,
        metaDescription: `Les meilleurs graveurs laser pour vendeurs Etsy et petits ateliers en ${BEST_OF_YEAR} : classés pour la production en série, la fiabilité et la rentabilité.`,
        intro:
          "Vendre ses créations change la donne : cadence, fiabilité et régularité comptent autant que la qualité. Ces machines sont les mieux notées pour la production et les petites entreprises.",
        faqSubject: "laser pour petite entreprise",
      },
    },
    guideSlugs: ["laser-buying-guide-2026", "rotary-laser-engraving"],
    filter: (m) => matchesBusinessUse(m) && m.rating.buildQuality >= 7.5,
    score: (m) => m.rating.overall * 0.5 + m.rating.buildQuality * 0.3 + m.rating.capability * 0.2,
  },
  {
    slug: "enclosed-lasers",
    copy: {
      en: {
        title: `Best Enclosed Lasers ${BEST_OF_YEAR}`,
        metaTitle: `Best Enclosed Laser Engravers ${BEST_OF_YEAR}`,
        metaDescription: `The best enclosed laser engravers of ${BEST_OF_YEAR}: safer home operation, filtered exhaust, and Class-1 cabinets ranked by real scores.`,
        intro:
          "Enclosed cabinets keep smoke contained and reduce stray-beam risk — essential for apartments and family spaces. These machines rank highest for enclosed diode and compact CO₂ options.",
        faqSubject: "enclosed laser",
      },
      fr: {
        title: `Meilleurs lasers fermés ${BEST_OF_YEAR}`,
        metaTitle: `Meilleurs graveurs laser fermés ${BEST_OF_YEAR}`,
        metaDescription: `Les meilleurs graveurs laser fermés de ${BEST_OF_YEAR} : usage domestique plus sûr, filtration des fumées et cabines Classe 1 classées selon nos notes réelles.`,
        intro:
          "Les cabines fermées contiennent les fumées et limitent les risques de faisceau — indispensable en appartement ou avec des enfants. Voici les machines fermées diode et CO₂ compactes les mieux notées.",
        faqSubject: "laser fermé",
      },
    },
    guideSlugs: ["open-frame-vs-enclosed-lasers", "laser-safety-basics", "laser-ventilation-setup"],
    filter: isEnclosedLaser,
  },
  {
    slug: "fiber-lasers",
    copy: {
      en: {
        title: `Best Fiber Lasers ${BEST_OF_YEAR}`,
        metaTitle: `Best Fiber Laser Engravers ${BEST_OF_YEAR}`,
        metaDescription: `The best fiber laser engravers of ${BEST_OF_YEAR}, ranked for metal marking speed, software, build quality, and value across desktop galvo workstations.`,
        intro:
          "Fiber lasers (1064 nm) are the standard for marking stainless steel, aluminum, and brass. These desktop galvo machines rank highest in our database for metal engraving work.",
        faqSubject: "fiber laser",
      },
      fr: {
        title: `Meilleurs lasers fibre ${BEST_OF_YEAR}`,
        metaTitle: `Meilleurs graveurs laser fibre ${BEST_OF_YEAR}`,
        metaDescription: `Les meilleurs graveurs laser fibre de ${BEST_OF_YEAR}, classés pour la vitesse de marquage métal, le logiciel, la qualité de fabrication et le rapport qualité-prix.`,
        intro:
          "Les lasers fibre (1064 nm) sont la référence pour marquer l'inox, l'aluminium et le laiton. Ces postes galvo de bureau sont les mieux notés de notre base pour la gravure métal.",
        faqSubject: "laser fibre",
      },
    },
    guideSlugs: ["fiber-lasers-explained", "mopa-fiber-lasers-explained", "galvo-laser-workstations-explained"],
    filter: (m) => m.laserType === "fiber",
  },
  {
    slug: "portable-metal-markers",
    copy: {
      en: {
        title: `Best Portable Metal Markers ${BEST_OF_YEAR}`,
        metaTitle: `Best Portable Fiber & Hybrid Lasers ${BEST_OF_YEAR}`,
        metaDescription: `The best portable metal marking lasers of ${BEST_OF_YEAR}: compact fiber, hybrid, and UV galvo machines ranked for jewelry, tools, and small-batch metal work.`,
        intro:
          "Need to mark metal without a full workshop? These compact fiber, hybrid, and UV galvo machines rank highest for jewelry, knives, and small metal gifts — all under $4,000.",
        faqSubject: "portable metal marking laser",
      },
      fr: {
        title: `Meilleurs marqueurs métal portables ${BEST_OF_YEAR}`,
        metaTitle: `Meilleurs lasers portables pour le métal ${BEST_OF_YEAR}`,
        metaDescription: `Les meilleurs lasers portables pour marquer le métal en ${BEST_OF_YEAR} : machines fibre, hybrides et UV compactes classées pour bijoux, outils et petites séries.`,
        intro:
          "Besoin de marquer du métal sans un grand atelier ? Ces machines fibre, hybrides et UV compactes sont les mieux notées pour bijoux, couteaux et petits cadeaux métal — toutes sous 4 000 $.",
        faqSubject: "laser portable pour marquer le métal",
      },
    },
    guideSlugs: ["galvo-laser-workstations-explained", "metal-marking-without-fiber", "hybrid-lasers-explained"],
    filter: isPortableMetalMarker,
  },
  {
    slug: "high-power-diodes",
    copy: {
      en: {
        title: `Best 40W+ Diode Lasers ${BEST_OF_YEAR}`,
        metaTitle: `Best High-Power Diode Lasers ${BEST_OF_YEAR} (40W+)`,
        metaDescription: `The best 40W and higher diode lasers of ${BEST_OF_YEAR}, ranked for cutting depth, build quality, and real-world performance on wood and acrylic.`,
        intro:
          "40W diode modules push open-frame cutting closer to entry CO₂ territory. These high-power diodes rank highest for thick wood and everyday production cutting.",
        faqSubject: "40W diode laser",
      },
      fr: {
        title: `Meilleurs lasers diode 40W+ ${BEST_OF_YEAR}`,
        metaTitle: `Meilleurs lasers diode haute puissance ${BEST_OF_YEAR} (40W+)`,
        metaDescription: `Les meilleurs lasers diode 40W et plus de ${BEST_OF_YEAR}, classés pour la profondeur de coupe, la qualité de fabrication et les performances réelles sur bois et acrylique.`,
        intro:
          "Les modules diode 40W rapprochent la découpe open-frame du CO₂ d'entrée de gamme. Ces diodes haute puissance sont les mieux notées pour le bois épais et la découpe quotidienne.",
        faqSubject: "laser diode 40W",
      },
    },
    guideSlugs: ["diode-lasers-explained", "laser-wattage-marketing-explained", "open-frame-vs-enclosed-lasers"],
    filter: (m) => m.laserType === "diode" && (parsePowerWatts(m) ?? 0) >= 40,
    score: (m) => m.rating.capability * 0.5 + m.rating.overall * 0.5,
  },
  {
    slug: "uv-lasers",
    copy: {
      en: {
        title: `Best UV Lasers ${BEST_OF_YEAR}`,
        metaTitle: `Best UV Laser Engravers ${BEST_OF_YEAR}`,
        metaDescription: `The best UV (355 nm) laser engravers of ${BEST_OF_YEAR}, ranked for plastics, glass, ceramics, and fine marking without heat damage.`,
        intro:
          "UV lasers excel on heat-sensitive plastics, glass, and ceramics with minimal thermal damage. Every UV machine in our database, ranked by overall score.",
        faqSubject: "UV laser",
      },
      fr: {
        title: `Meilleurs lasers UV ${BEST_OF_YEAR}`,
        metaTitle: `Meilleurs graveurs laser UV ${BEST_OF_YEAR}`,
        metaDescription: `Les meilleurs graveurs laser UV (355 nm) de ${BEST_OF_YEAR}, classés pour plastiques, verre, céramique et marquage fin sans dommages thermiques.`,
        intro:
          "Les lasers UV excellent sur les plastiques sensibles à la chaleur, le verre et la céramique avec peu de dégâts thermiques. Toutes les machines UV de notre base, classées par note globale.",
        faqSubject: "laser UV",
      },
    },
    guideSlugs: ["uv-lasers-explained", "laser-materials-by-type"],
    filter: (m) => m.laserType === "uv",
  },
];

export function getBestOfCategory(slug: string): BestOfCategory | undefined {
  return BEST_OF_CATEGORIES.find((c) => c.slug === slug);
}

export interface RankedEntry {
  rank: number;
  entry: CatalogEntry;
  score: number;
}

/** Ranked catalog entries (one per model line) for a category. */
export function getBestOfRanking(category: BestOfCategory, locale: Locale): RankedEntry[] {
  const score = category.score ?? ((m: Machine) => m.rating.overall);

  return getCatalogEntries(locale)
    .filter((entry) => category.filter(entry.primary))
    .map((entry) => ({ entry, score: score(entry.primary) }))
    .sort(
      (a, b) =>
        b.score - a.score || b.entry.primary.rating.overall - a.entry.primary.rating.overall,
    )
    .slice(0, LIST_SIZE)
    .map((item, index) => ({ rank: index + 1, ...item }));
}
