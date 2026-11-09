import type { FaqItem } from "@/components/seo/SeoFaqSection";
import type { Locale } from "@/i18n/config";

/**
 * Hand-written take for duels that people actually search for (Search Console),
 * shown under the generated intro. Facts must match the machine profiles.
 */
export interface DuelNote {
  /** One or two short paragraphs: what really separates the two machines. */
  take: Record<Locale, string[]>;
  /** Questions searchers type for this pair, placed before the generated ones. */
  faq?: Record<Locale, FaqItem[]>;
  /** Another duel people confuse with this one (duel param). */
  seeAlso?: string;
}

export const DUEL_NOTES: Record<string, DuelNote> = {
  "xtool-m2-vs-xtool-s1-20w": {
    take: {
      en: [
        "Both are enclosed xTool diode lasers, but they answer different needs. The M2 (May 2026) adds inkjet color printing to the laser in a compact cabinet with a 426 × 320 mm bed: 10W from $499, 20W from $899, 40W from $1,299 on xTool's store. The S1 20W has no printer, but a larger 498 × 330 mm bed and a cabinet built for longer cutting sessions, from $1,299.",
        "Pick the M2 if you sell printed, personalised items (cards, tags, coasters with color). Pick the S1 if you mostly engrave large panels or cut basswood up to about 8 mm.",
      ],
      fr: [
        "Ce sont deux lasers à diode fermés de xTool, mais ils ne répondent pas au même besoin. La M2 (mai 2026) ajoute l'impression couleur à jet d'encre au laser, dans un caisson compact avec un plateau de 426 × 320 mm : 10 W dès 499 $, 20 W dès 899 $, 40 W dès 1 299 $ sur la boutique xTool. La S1 20 W n'imprime pas, mais elle a un plateau plus grand (498 × 330 mm) et un caisson fait pour de longues découpes, dès 1 299 $.",
        "Prenez la M2 si vous vendez des objets personnalisés imprimés (cartes, étiquettes, dessous de verre en couleur). Prenez la S1 si vous gravez surtout de grands panneaux ou découpez du tilleul jusqu'à 8 mm environ.",
      ],
    },
    faq: {
      en: [
        {
          question: "Does the xTool S1 print in color like the M2?",
          answer:
            "No. The S1 is a laser only. Color printing comes from the M2's built-in inkjet module, which is the main reason to choose the M2 over a larger diode laser.",
        },
        {
          question: "xTool M2 10W vs 20W: which one?",
          answer:
            "The 10W ($499) is enough for engraving and cutting 3 mm basswood in a few passes. The 20W ($899) cuts the same wood faster and handles thicker stock. If cutting matters more than printing, compare it with the S1 20W ($1,299), which keeps a larger bed.",
        },
      ],
      fr: [
        {
          question: "La xTool S1 imprime-t-elle en couleur comme la M2 ?",
          answer:
            "Non. La S1 est uniquement un laser. L'impression couleur vient du module jet d'encre intégré à la M2, et c'est la principale raison de la préférer à une diode plus grande.",
        },
        {
          question: "xTool M2 10 W ou 20 W : laquelle choisir ?",
          answer:
            "La 10 W (499 $) suffit pour graver et découper du tilleul de 3 mm en quelques passes. La 20 W (899 $) découpe le même bois plus vite et passe des épaisseurs plus fortes. Si la découpe compte plus que l'impression, comparez-la à la S1 20 W (1 299 $), qui garde un plus grand plateau.",
        },
      ],
    },
  },
  "xtool-f2-vs-xtool-f1-ultra": {
    take: {
      en: [
        "Both are compact xTool galvo lasers, but they mark metal with different sources. The F1 Ultra pairs a 20W fiber with a 20W diode over a 100 × 100 mm field, from $2,999: the fiber engraves bare stainless steel, aluminum and brass deeply. The F2 pairs a 15W diode with a 5W infrared (1064 nm) over a 220 × 220 mm field with a 50 MP camera, from $1,299: the infrared marks metal, but more lightly than a 20W fiber.",
        "Pick the F1 Ultra for jewelry, knives and deep metal work. Pick the F2 for mixed wood, leather and light metal marking at less than half the price, with a field twice as wide.",
      ],
      fr: [
        "Ce sont deux lasers galvo compacts de xTool, mais ils marquent le métal avec des sources différentes. La F1 Ultra associe une fibre de 20 W à une diode de 20 W sur un champ de 100 × 100 mm, dès 2 999 $ : la fibre grave en profondeur l'inox, l'aluminium et le laiton nus. La F2 associe une diode de 15 W à un infrarouge de 5 W (1 064 nm) sur un champ de 220 × 220 mm, avec une caméra de 50 Mpx, dès 1 299 $ : l'infrarouge marque le métal, mais plus légèrement qu'une fibre de 20 W.",
        "Prenez la F1 Ultra pour les bijoux, les couteaux et le métal en profondeur. Prenez la F2 pour le bois, le cuir et le marquage léger du métal, à moins de la moitié du prix et avec un champ deux fois plus large.",
      ],
    },
    faq: {
      en: [
        {
          question: "Is the xTool F2 Ultra the same machine as the F2?",
          answer:
            "No. The F2 Ultra (from $4,299) has a 60W MOPA fiber and a 40W diode; the F2 (from $1,299) has a 15W diode and a 5W infrared. If you are weighing the F1 Ultra against the F2 Ultra, see that duel instead.",
        },
      ],
      fr: [
        {
          question: "La xTool F2 Ultra est-elle la même machine que la F2 ?",
          answer:
            "Non. La F2 Ultra (dès 4 299 $) a une fibre MOPA de 60 W et une diode de 40 W ; la F2 (dès 1 299 $) a une diode de 15 W et un infrarouge de 5 W. Si vous hésitez entre la F1 Ultra et la F2 Ultra, voyez plutôt ce duel-là.",
        },
      ],
    },
    seeAlso: "xtool-f2-ultra-vs-xtool-f1-ultra",
  },
  "xtool-f2-ultra-vs-xtool-f1-ultra": {
    take: {
      en: [
        "The F2 Ultra is the step up from the F1 Ultra in every number: a 60W MOPA fiber and a 40W diode over a 220 × 220 mm field, against a 20W fiber and a 20W diode over 100 × 100 mm. MOPA lets you tune the pulse, which gives more control over color marking on stainless steel and deeper engraving, and the wider field takes larger plates without the conveyor.",
        "The F1 Ultra starts at $2,999. The F2 Ultra starts at $4,299 with the MOPA source only, or $5,299 with the 40W diode as well. For gifts and jewelry, the F1 Ultra already does the job; the F2 Ultra pays off for a small business that marks metal every day.",
      ],
      fr: [
        "La F2 Ultra dépasse la F1 Ultra sur tous les chiffres : une fibre MOPA de 60 W et une diode de 40 W sur un champ de 220 × 220 mm, contre une fibre de 20 W et une diode de 20 W sur 100 × 100 mm. La MOPA permet de régler l'impulsion, ce qui donne plus de contrôle sur le marquage couleur de l'inox et la gravure profonde, et le champ plus large accepte de plus grandes plaques sans convoyeur.",
        "La F1 Ultra démarre à 2 999 $. La F2 Ultra démarre à 4 299 $ avec la seule source MOPA, ou 5 299 $ avec la diode de 40 W en plus. Pour des cadeaux et des bijoux, la F1 Ultra suffit ; la F2 Ultra se rentabilise dans une petite entreprise qui marque du métal tous les jours.",
      ],
    },
    faq: {
      en: [
        {
          question: "xTool F2 Ultra single or dual laser?",
          answer:
            "The MOPA-only version ($4,299) marks metal and plastics. The dual version ($5,299) adds the 40W diode for wood, leather and other organic materials. Take the dual only if those materials are part of your regular work.",
        },
      ],
      fr: [
        {
          question: "xTool F2 Ultra : simple ou double laser ?",
          answer:
            "La version MOPA seule (4 299 $) marque le métal et les plastiques. La version double (5 299 $) ajoute la diode de 40 W pour le bois, le cuir et les autres matières organiques. Ne prenez la double que si ces matières font partie de votre travail courant.",
        },
      ],
    },
    seeAlso: "xtool-f2-vs-xtool-f1-ultra",
  },
  "sculpfun-g20-vs-commarker-b4-20w": {
    take: {
      en: [
        "Same class on paper: two open 20W fiber galvos (1064 nm) for marking and engraving stainless steel, aluminum, brass and gold. The Sculpfun G20 (August 2026, $1,499) has the larger 150 × 150 mm field, a motorized Z column, dual red-dot focusing and Wi-Fi. The ComMarker B4 20W (from $1,399) has a 110 × 110 mm field, but years of user settings and reviews behind it.",
        "Pick the G20 for larger plates and less manual focusing. Pick the B4 if you want a machine whose results are already well documented by its users. On either one, wear goggles rated for 1064 nm: fiber light is invisible and reflects off metal.",
      ],
      fr: [
        "Même catégorie sur le papier : deux galvos fibre ouvertes de 20 W (1 064 nm) pour marquer et graver l'inox, l'aluminium, le laiton et l'or. La Sculpfun G20 (août 2026, 1 499 $) a le champ le plus grand (150 × 150 mm), une colonne Z motorisée, une double visée laser rouge et le Wi-Fi. La ComMarker B4 20 W (dès 1 399 $) a un champ de 110 × 110 mm, mais des années de réglages et d'avis d'utilisateurs derrière elle.",
        "Prenez la G20 pour de plus grandes plaques et moins de mise au point à la main. Prenez la B4 si vous voulez une machine dont les résultats sont déjà bien documentés par ses utilisateurs. Sur l'une comme sur l'autre, portez des lunettes prévues pour le 1 064 nm : la lumière de la fibre est invisible et se reflète sur le métal.",
      ],
    },
    faq: {
      en: [
        {
          question: "Can the G20 or the B4 cut metal?",
          answer:
            "No. Both mark and engrave metal; Sculpfun claims engraving up to 1.5 mm deep with the G20. Cutting sheet metal takes a much more powerful fiber cutter.",
        },
      ],
      fr: [
        {
          question: "La G20 ou la B4 peuvent-elles découper du métal ?",
          answer:
            "Non. Les deux marquent et gravent le métal ; Sculpfun annonce une gravure jusqu'à 1,5 mm de profondeur avec la G20. Découper de la tôle demande une découpeuse fibre bien plus puissante.",
        },
      ],
    },
  },
  "xtool-f2-ultra-uv-vs-creality-falcon-t1-5w-uv": {
    take: {
      en: [
        "Two 5W UV galvo lasers for cold marking: glass, crystal, plastics and ceramics that burn or melt under other lasers. The xTool F2 Ultra UV ($4,299) is a dedicated enclosed machine with a 200 × 200 mm field, two 48 MP cameras and a second lens for 3D images inside crystal blocks up to 70 × 70 mm. The Creality Falcon T1 UV ($3,999, or $2,599 as a module for an existing T1) has a 220 × 220 mm field and also ships with an internal-engraving lens.",
        "Pick the F2 Ultra UV if crystal and glass are your main product and you want the most documented workflow. Pick the T1 UV if you already own a Falcon T1, or if UV is one job among others in your shop.",
      ],
      fr: [
        "Deux lasers galvo UV de 5 W pour le marquage à froid : verre, cristal, plastiques et céramiques qui brûlent ou fondent sous les autres lasers. La xTool F2 Ultra UV (4 299 $) est une machine fermée dédiée, avec un champ de 200 × 200 mm, deux caméras de 48 Mpx et une seconde lentille pour graver des images en 3D dans des blocs de cristal jusqu'à 70 × 70 mm. La Creality Falcon T1 UV (3 999 $, ou 2 599 $ en module pour une T1 déjà achetée) a un champ de 220 × 220 mm et est elle aussi livrée avec une lentille de gravure interne.",
        "Prenez la F2 Ultra UV si le cristal et le verre sont votre produit principal et que vous voulez la méthode la mieux documentée. Prenez la T1 UV si vous avez déjà une Falcon T1, ou si l'UV n'est qu'un travail parmi d'autres dans votre atelier.",
      ],
    },
  },
};

export function getDuelNote(param: string): DuelNote | undefined {
  return DUEL_NOTES[param];
}
