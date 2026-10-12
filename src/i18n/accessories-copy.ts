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
  subtitle: "Typical inclusions and add-ons for this profile : confirm your SKU.",
  tabsAriaLabel: "Accessory categories",
  footnote: "Editorial guidance : not a live parts list. See also:",
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
      "Inline fan + hose to window or wall cap : see ventilation guide.",
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
      "Compressed air at the nozzle : cleaner cuts, less char.",
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
      "Rings and small cylinders : verify mount compatibility.",
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
      "Advanced control software : check controller compatibility.",
    ),
  },
};

export const accessoriesFr: AccessoriesCopy = {
  title: "Accessoires et options",
  subtitle: "Inclus / options courantes pour ce profil : vérifiez votre référence.",
  tabsAriaLabel: "Catégories d’accessoires",
  footnote: "Repères éditoriaux : pas une liste stock en temps réel. Voir aussi :",
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
      "Air comprimé à la buse : coupes plus propres, moins de charbon.",
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
      "Bagues et petits cylindres : vérifier la compatibilité du montage.",
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
      "Logiciel avancé : vérifier la compatibilité de la carte.",
    ),
  },
};

/** French for accessory notes (JSON profiles and machine-accessories.ts), keyed by the English text. */
export const accessoryNotesFr: Record<string, string> = {
  "Often bundled; verify listing": "Souvent inclus dans un pack : vérifiez l’annonce",
  "Class 1 enclosure with lid interlock": "Caisson classe 1 avec verrouillage du capot",
  "AI camera version only: cannot be added after purchase": "Version avec caméra IA uniquement : impossible à ajouter après l’achat",
  "Sold in Creality's Home Clean Kit bundles": "Vendu dans les packs Home Clean Kit de Creality",
  "16 MP full-bed camera, ±1 mm positioning (OMTech figure)": "Caméra 16 Mpx sur tout le plateau, positionnement à ±1 mm (chiffre OMTech)",
  "Built-in pump, 14–17 L/min": "Pompe intégrée, 14 à 17 L/min",
  "Integrated exhaust fan and pipe: duct it outside": "Ventilateur et gaine d’extraction intégrés : évacuez vers l’extérieur",
  "Standard rotary in the package": "Module rotatif standard inclus",
  "LightBurn key in the OMTech package": "Licence LightBurn incluse dans le pack OMTech",
  "16 MP full-bed camera": "Caméra 16 Mpx sur tout le plateau",
  "450 nm diode: verify OD with seller": "Diode 450 nm : vérifiez la densité optique auprès du vendeur",
  "Class 1 enclosure with Hall-sensor lid stop": "Caisson classe 1 avec arrêt du capot par capteur à effet Hall",
  "Air pump in the box": "Pompe à air fournie",
  "Pre-installed": "Préinstallé",
  "Sculpfun SP1 purifier": "Purificateur Sculpfun SP1",
  "Compressor + air assist strongly recommended for acrylic": "Compresseur et assistance d’air vivement conseillés pour l’acrylique",
  "Filter cartridge packs: confirm bundle (Basic vs Pro)": "Cartouches filtrantes : vérifiez le pack (Basic ou Pro)",
  "RA2-class roller sold by xTool for S1": "Rouleau de type RA2 vendu par xTool pour la S1",
  "Apartment setups: enclosure + cartridge packs": "En appartement : caisson et cartouches filtrantes",
  "CO₂ wavelength: match OD rating for 10.6 µm if required by manual": "Longueur d’onde CO₂ : densité optique adaptée à 10,6 µm si le manuel l’exige",
  "Cabinet reduces beam exposure vs open-frame": "Le caisson limite l’exposition au faisceau par rapport à un modèle ouvert",
  "Compressor + nozzle: cleaner acrylic edges": "Compresseur et buse : bords d’acrylique plus nets",
  "Dedicated extractor if you cannot vent outside": "Extracteur dédié si vous ne pouvez pas évacuer dehors",
  "Filter handles light work; vent outside for heavy cutting": "Le filtre suffit pour les petits travaux ; évacuez dehors pour la découpe intensive",
  "Helps engraving clarity; strongly recommended if you cut": "Améliore la netteté de gravure ; vivement conseillé si vous découpez",
  "IR module option for some metals: check bundle": "Module IR en option pour certains métaux : vérifiez le pack",
  "Inline fan + outdoor vent still preferred for production": "Ventilateur en ligne et sortie extérieure restent préférables en production",
  "Often sold as alignment / batch accessory": "Souvent vendu comme accessoire d’alignement ou de production en série",
  "Rings and small cylinders: check thread mount": "Bagues et petits cylindres : vérifiez la fixation filetée",
  "Route hose outdoors for cutting, especially acrylic": "Faites sortir la gaine dehors pour la découpe, surtout l’acrylique",
  "Still useful when servicing or with lid open": "Toujours utiles pour l’entretien ou capot ouvert",
  "Third-party enclosure improves smoke control and safety": "Un caisson tiers améliore l’évacuation des fumées et la sécurité",
  "Tumblers, mugs, cylindrical blanks": "Gobelets, mugs, objets cylindriques",
  "Uses manufacturer app as primary control": "Se pilote d’abord avec l’appli du fabricant",
};
