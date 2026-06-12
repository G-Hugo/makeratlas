import type { Locale } from "@/i18n/config";
import type { LaserType } from "@/types/machine";

export type MaterialCapability = "both" | "engrave" | "no";

type LocalizedText = Record<Locale, string>;

export interface MaterialRow {
  id: string;
  label: LocalizedText;
  note?: LocalizedText;
  capability: Record<LaserType, MaterialCapability>;
}

export const MATERIAL_LASER_TYPES: LaserType[] = ["diode", "co2", "fiber", "uv", "hybrid"];

/**
 * Editorial material compatibility matrix.
 * "hybrid" assumes the common diode + fiber/IR dual-source layout.
 */
export const MATERIALS_MATRIX: MaterialRow[] = [
  {
    id: "wood",
    label: { en: "Wood, plywood & MDF", fr: "Bois, contreplaqué et MDF" },
    capability: { diode: "both", co2: "both", fiber: "engrave", uv: "engrave", hybrid: "both" },
  },
  {
    id: "leather",
    label: { en: "Leather", fr: "Cuir" },
    note: {
      en: "Vegetable-tanned only — chrome-tanned leather releases toxic fumes.",
      fr: "Tannage végétal uniquement — le cuir au chrome dégage des fumées toxiques.",
    },
    capability: { diode: "both", co2: "both", fiber: "engrave", uv: "engrave", hybrid: "both" },
  },
  {
    id: "paper",
    label: { en: "Paper & cardboard", fr: "Papier et carton" },
    capability: { diode: "both", co2: "both", fiber: "no", uv: "engrave", hybrid: "both" },
  },
  {
    id: "clear-acrylic",
    label: { en: "Clear acrylic", fr: "Acrylique transparent" },
    note: {
      en: "Blue diode light passes straight through clear acrylic — CO₂ is the tool for this.",
      fr: "La lumière bleue des diodes traverse l'acrylique transparent — le CO₂ est l'outil adapté.",
    },
    capability: { diode: "no", co2: "both", fiber: "no", uv: "engrave", hybrid: "no" },
  },
  {
    id: "dark-acrylic",
    label: { en: "Dark / opaque acrylic", fr: "Acrylique foncé / opaque" },
    capability: { diode: "both", co2: "both", fiber: "engrave", uv: "engrave", hybrid: "both" },
  },
  {
    id: "glass",
    label: { en: "Glass", fr: "Verre" },
    note: {
      en: "UV gives the cleanest result; diode needs a coated or painted surface.",
      fr: "L'UV donne le résultat le plus propre ; la diode demande une surface peinte ou traitée.",
    },
    capability: { diode: "engrave", co2: "engrave", fiber: "no", uv: "engrave", hybrid: "engrave" },
  },
  {
    id: "coated-metal",
    label: { en: "Anodized / coated metal", fr: "Métal anodisé / revêtu" },
    note: {
      en: "The laser marks the coating, not the metal underneath.",
      fr: "Le laser marque le revêtement, pas le métal en dessous.",
    },
    capability: {
      diode: "engrave",
      co2: "engrave",
      fiber: "engrave",
      uv: "engrave",
      hybrid: "engrave",
    },
  },
  {
    id: "bare-metal",
    label: { en: "Bare metal (stainless, brass, aluminum)", fr: "Métal nu (inox, laiton, aluminium)" },
    note: {
      en: "Needs a 1064 nm source: fiber, MOPA, or an infrared module. Diode and CO₂ can't mark bare metal without spray.",
      fr: "Demande une source 1064 nm : fibre, MOPA ou module infrarouge. Diode et CO₂ ne marquent pas le métal nu sans spray.",
    },
    capability: { diode: "no", co2: "no", fiber: "engrave", uv: "engrave", hybrid: "engrave" },
  },
  {
    id: "stone",
    label: { en: "Stone, slate & ceramic", fr: "Pierre, ardoise et céramique" },
    capability: {
      diode: "engrave",
      co2: "engrave",
      fiber: "engrave",
      uv: "engrave",
      hybrid: "engrave",
    },
  },
  {
    id: "fabric",
    label: { en: "Fabric & felt", fr: "Tissu et feutre" },
    capability: { diode: "both", co2: "both", fiber: "no", uv: "engrave", hybrid: "both" },
  },
  {
    id: "pvc",
    label: { en: "PVC & vinyl", fr: "PVC et vinyle" },
    note: {
      en: "Never laser PVC or vinyl: it releases chlorine gas that is toxic and corrodes the machine.",
      fr: "Ne jamais passer du PVC ou du vinyle au laser : ils dégagent du chlore, toxique et corrosif pour la machine.",
    },
    capability: { diode: "no", co2: "no", fiber: "no", uv: "no", hybrid: "no" },
  },
];
