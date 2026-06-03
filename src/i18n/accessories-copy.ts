import type { AccessoryAvailability } from "@/types/machine";
import type { AccessoryCategory } from "@/lib/machine-accessories";

export type AccessoriesCopy = {
  title: string;
  subtitle: string;
  tabsAriaLabel: string;
  footnote: string;
  ventilationGuide: string;
  safetyGuide: string;
  availability: Record<AccessoryAvailability, string>;
  categories: Record<AccessoryCategory, string>;
  items: Record<
    string,
    {
      name: string;
      description: string;
    }
  >;
};

const item = (name: string, description: string) => ({ name, description });

export const accessoriesEn: AccessoriesCopy = {
  title: "Accessories & add-ons",
  subtitle: "Typical inclusions and add-ons for this profile — confirm your SKU.",
  tabsAriaLabel: "Accessory categories",
  footnote: "Editorial guidance — not a live parts list. See also:",
  ventilationGuide: "Ventilation setup",
  safetyGuide: "Safety basics",
  availability: {
    included: "Included",
    optional: "Optional",
    recommended: "Recommended",
    not_applicable: "—",
  },
  categories: {
    safety: "Safety",
    exhaust: "Ventilation & fumes",
    workflow: "Cutting & marking",
    expansion: "Expansion",
    software: "Software",
  },
  items: {
    enclosure: item(
      "Enclosure / cabinet",
      "Contains smoke and reduces accidental beam exposure.",
    ),
    "safety-glasses": item(
      "Laser safety glasses",
      "Must match laser wavelength and optical density (OD).",
    ),
    "fire-extinguisher": item(
      "Fire extinguisher",
      "Keep within reach whenever cutting combustible materials.",
    ),
    "exhaust-vent": item(
      "Outdoor exhaust / ducting",
      "Inline fan + hose to window or wall cap — see ventilation guide.",
    ),
    "smoke-filter": item(
      "Smoke filter / cartridge packs",
      "HEPA + carbon stages for enclosed or apartment setups.",
    ),
    "fume-extractor": item(
      "Dedicated fume extractor",
      "Standalone unit when outdoor venting is difficult.",
    ),
    "air-assist": item(
      "Air assist",
      "Compressed air at the nozzle — cleaner cuts, less char.",
    ),
    "honeycomb-bed": item(
      "Honeycomb cutting bed",
      "Reduces flashback when cutting sheet goods.",
    ),
    camera: item(
      "Alignment camera",
      "Visual placement and batch alignment in software.",
    ),
    "rotary-roller": item(
      "Rotary roller",
      "Tumblers, mugs, and cylindrical blanks.",
    ),
    "rotary-chuck": item(
      "Rotary chuck",
      "Rings and small cylinders — verify mount compatibility.",
    ),
    "extension-rail": item(
      "Extension rails / pass-through",
      "Longer workpieces on open-frame machines.",
    ),
    "marking-spray": item(
      "Metal marking spray",
      "For diode lasers marking stainless without fiber.",
    ),
    lightburn: item(
      "LightBurn license",
      "Advanced control software — check controller compatibility.",
    ),
  },
};

export const accessoriesFr: AccessoriesCopy = {
  title: "Accessoires et options",
  subtitle: "Inclus / options courantes pour ce profil — vérifiez votre référence.",
  tabsAriaLabel: "Catégories d’accessoires",
  footnote: "Repères éditoriaux — pas une liste stock en temps réel. Voir aussi :",
  ventilationGuide: "Guide ventilation",
  safetyGuide: "Bases sécurité",
  availability: {
    included: "Inclus",
    optional: "En option",
    recommended: "Recommandé",
    not_applicable: "—",
  },
  categories: {
    safety: "Sécurité",
    exhaust: "Ventilation et fumées",
    workflow: "Découpe et marquage",
    expansion: "Extensions",
    software: "Logiciels",
  },
  items: {
    enclosure: item(
      "Enceinte / cabine",
      "Contient les fumées et limite l’exposition au faisceau.",
    ),
    "safety-glasses": item(
      "Lunettes de protection laser",
      "Doivent correspondre à la longueur d’onde et à l’OD indiqués.",
    ),
    "fire-extinguisher": item(
      "Extincteur",
      "À portée de main dès que vous découpez des matériaux combustibles.",
    ),
    "exhaust-vent": item(
      "Évacuation vers l’extérieur",
      "Ventilateur inline + gaine vers fenêtre ou sortie murale.",
    ),
    "smoke-filter": item(
      "Filtre à fumée / cartouches",
      "Étages HEPA + charbon pour appartement ou machine fermée.",
    ),
    "fume-extractor": item(
      "Extracteur de fumées dédié",
      "Unité autonome quand l’évacuation extérieure est difficile.",
    ),
    "air-assist": item(
      "Assist air",
      "Air comprimé à la buse — coupes plus propres, moins de charbon.",
    ),
    "honeycomb-bed": item(
      "Plateau nid d’abeille",
      "Limite le flashback en découpe de plaques.",
    ),
    camera: item(
      "Caméra d’alignement",
      "Placement visuel et séries en logiciel.",
    ),
    "rotary-roller": item(
      "Rouleau rotatif",
      "Gobelets, mugs et pièces cylindriques.",
    ),
    "rotary-chuck": item(
      "Mandrin rotatif",
      "Bagues et petits cylindres — vérifier la compatibilité du montage.",
    ),
    "extension-rail": item(
      "Rails d’extension / pass-through",
      "Pièces longues sur machines open-frame.",
    ),
    "marking-spray": item(
      "Spray de marquage métal",
      "Pour diodes sur inox sans fibre.",
    ),
    lightburn: item(
      "Licence LightBurn",
      "Logiciel avancé — vérifier la compatibilité de la carte.",
    ),
  },
};
