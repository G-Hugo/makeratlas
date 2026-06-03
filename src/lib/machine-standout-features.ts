import type { Locale } from "@/i18n/config";
import { noEmDash } from "@/lib/copy-style";
import {
  getMachineAccessories,
  machineHasCamera,
  machineIsEnclosed,
} from "@/lib/machine-accessories";
import type { Machine, MachineStandoutFeature } from "@/types/machine";

export type StandoutFeatureId =
  | "enclosed-camera"
  | "alignment-camera"
  | "z-probe-autofocus"
  | "enclosed-cabinet"
  | "open-frame-safety"
  | "interchangeable-head"
  | "dual-laser"
  | "co2-production"
  | "fiber-metal"
  | "uv-cold-mark"
  | "fire-safety"
  | "air-assist-included"
  | "lightburn-ready"
  | "galvo-speed";

function machineText(machine: Machine): string {
  return [
    machine.name,
    machine.tagline,
    machine.tldr,
    machine.primaryUse,
    machine.mainObjective,
    machine.beginnerNotes,
    machine.proTips,
    ...(machine.pros ?? []),
    ...(machine.cons ?? []),
    ...(machine.specs.software ?? []),
    machine.moduleSystem?.headline ?? "",
    machine.moduleSystem?.description ?? "",
  ]
    .join(" ")
    .toLowerCase();
}

function mentions(machine: Machine, ...patterns: RegExp[]): boolean {
  const text = machineText(machine);
  return patterns.some((p) => p.test(text));
}

function hasHeightSensing(machine: Machine): boolean {
  return mentions(
    machine,
    /\bz[- ]?probe\b/,
    /\bautofocus\b/,
    /\bauto[- ]?focus\b/,
    /\blidar\b/,
    /\bheight\s*(map|sensor|sensing|measure)/,
    /\bdistance\s*sensor\b/,
    /\bfocus\s*assist\b/,
    /\bauto[- ]?height\b/,
    /\bthickness\s*detect/,
  );
}

function hasFireSafety(machine: Machine): boolean {
  return mentions(
    machine,
    /\bfire\s*(detect|alarm|suppression|sensor)/,
    /\bflame\s*detect/,
    /\bsprinkler\b/,
  );
}

function isGalvo(machine: Machine): boolean {
  return mentions(machine, /\bgalvo\b/, /\bgalvanometer\b/) || machine.laserType === "uv";
}

const FEATURE_COPY: Record<
  StandoutFeatureId,
  { priority: number; en: { title: string; body: string }; fr: { title: string; body: string } }
> = {
  "enclosed-camera": {
    priority: 1,
    en: {
      title: "Enclosed + alignment camera",
      body:
        "This machine pairs a closed cabinet with a live alignment camera : still uncommon on hobby diodes. You see the job on screen before firing, which saves ruined plywood on batch Etsy work, and the enclosure contains smoke and accidental beam exposure far better than an open frame on the same desk.",
    },
    fr: {
      title: "Enceinte fermée + caméra d’alignement",
      body:
        "Cette machine combine une cabine fermée et une caméra d’alignement en direct : encore rare sur les diodes hobby. Vous voyez le travail à l’écran avant de lancer, ce qui évite les plaques gâchées en série Etsy, et l’enceinte confine fumées et faisceau bien mieux qu’une open-frame au même format.",
    },
  },
  "alignment-camera": {
    priority: 3,
    en: {
      title: "Alignment camera",
      body:
        "A built-in camera lets you overlay your design on the real material instead of guessing placement. That matters for repeat products, irregular blanks, and anyone who has wasted stock on a misaligned first run.",
    },
    fr: {
      title: "Caméra d’alignement",
      body:
        "Une caméra intégrée permet de superposer le motif sur la pièce réelle au lieu de viser à l’œil. C’est décisif pour les séries, les blanks irréguliers et tous ceux qui ont déjà jeté une plaque sur un premier essai mal calé.",
    },
  },
  "z-probe-autofocus": {
    priority: 2,
    en: {
      title: "Autofocus / height sensing (Z-style)",
      body:
        "The machine measures material height (autofocus, LiDAR, or probe-style sensing) so the lens sits at the right distance before the job starts : you are not dialing focus by hand on every new thickness. Huge time saver on mixed scrap, warped boards, and CO₂ beds with varying acrylic sheets.",
    },
    fr: {
      title: "Autofocus / mesure de hauteur (type Z)",
      body:
        "La machine mesure la hauteur du matériau (autofocus, LiDAR ou sonde) pour placer la tête à la bonne distance avant chaque travail : fini le réglage manuel à chaque épaisseur. Un vrai gain de temps sur chutes mixtes, planches voilées et feuilles d’acrylique de épaisseurs différentes en CO₂.",
    },
  },
  "enclosed-cabinet": {
    priority: 5,
    en: {
      title: "Fully enclosed cabinet",
      body:
        "A closed cabinet with interlocks means the beam stays inside during normal use : closer to Class 1 workflow than an open-frame diode where safety glasses and discipline are doing all the work. Ventilation still matters, but smoke and noise are easier to manage.",
    },
    fr: {
      title: "Cabinet entièrement fermé",
      body:
        "Une cabine fermée avec verrouillages garde le faisceau à l’intérieur en usage normal : plus proche d’un usage type Classe 1 qu’une open-frame où lunettes et discipline font tout le travail. La ventilation reste indispensable, mais fumées et bruit sont plus faciles à maîtriser.",
    },
  },
  "open-frame-safety": {
    priority: 12,
    en: {
      title: "Open-frame : plan safety first",
      body:
        "There is no factory enclosure: you wear OD-rated glasses, control smoke, and keep kids/pets away. You trade cabinet convenience for price and access : fine in a dedicated workshop, stressful in a living room without a plan.",
    },
    fr: {
      title: "Open-frame : sécurité à anticiper",
      body:
        "Pas d’enceinte d’usine : lunettes OD, gestion des fumées, enfants et animaux tenus à distance. Vous échangez le confort d’une cabine contre le prix et l’accès : OK dans un atelier dédié, stressant au salon sans plan clair.",
    },
  },
  "interchangeable-head": {
    priority: 6,
    en: {
      title: "Swappable laser module",
      body:
        "You can upgrade optical power (or add an infrared module on some lines) by swapping the laser head on the same chassis : not buying a whole new machine. Check connector compatibility and firmware before assuming your future 40W module fits today’s 10W purchase.",
    },
    fr: {
      title: "Tête laser interchangeable",
      body:
        "Vous pouvez monter en puissance (ou ajouter un module infrarouge sur certaines gammes) en changeant la tête sur le même châssis : sans racheter toute la machine. Vérifiez connectique et firmware avant de supposer qu’un module 40W s’installera sur un achat 10W actuel.",
    },
  },
  "dual-laser": {
    priority: 7,
    en: {
      title: "Dual laser sources",
      body:
        "Two laser technologies share one machine (for example diode + infrared or hybrid CO₂/IR). You switch modes in software instead of owning separate boxes : great for mixed shops, but read which materials each source actually handles.",
    },
    fr: {
      title: "Double source laser",
      body:
        "Deux technologies laser partagent la même machine (ex. diode + infrarouge ou hybride CO₂/IR). Vous changez de mode dans le logiciel plutôt que d’empiler les machines : idéal pour l’atelier mixte, à condition de lire quels matériaux chaque source traite vraiment.",
    },
  },
  "co2-production": {
    priority: 8,
    en: {
      title: "Real CO₂ cutting",
      body:
        "A glass-tube CO₂ laser cuts cast acrylic and thick soft woods in ways diodes cannot match at the same price tier. Budget for outdoor exhaust or serious filtration : the cutting advantage is real, the ventilation homework is too.",
    },
    fr: {
      title: "Vraie découpe CO₂",
      body:
        "Un tube CO₂ découpe l’acrylique coulé et les bois épais d’une façon que les diodes n’égaleront pas au même budget. Prévoyez évacuation extérieure ou filtration sérieuse : l’avantage découpe est réel, les devoirs ventilation aussi.",
    },
  },
  "fiber-metal": {
    priority: 9,
    en: {
      title: "Fiber metal marking",
      body:
        "A fiber source marks bare and stainless steel without spray : the right tool for tools, jewelry, and industrial tags. It will not cut wood or acrylic; pair it with a diode or CO₂ if your shop needs organics too.",
    },
    fr: {
      title: "Marquage métal fibre",
      body:
        "Une source fibre marque l’acier brut et l’inox sans spray : le bon outil pour outils, bijoux et plaques pro. Elle ne découpe ni bois ni acrylique ; ajoutez une diode ou un CO₂ si l’atelier traite aussi les matériaux organiques.",
    },
  },
  "uv-cold-mark": {
    priority: 10,
    en: {
      title: "UV cold marking",
      body:
        "UV lasers mark plastics, some metals, and delicate parts with minimal heat : useful for cables, small electronics, and fine labels. Different safety and material prep than diode or CO₂; not a general-purpose cutter.",
    },
    fr: {
      title: "Marquage UV « froid »",
      body:
        "Les UV marquent plastiques, certains métaux et pièces fragiles avec peu de chaleur : utile pour câbles, petits électroniques et étiquettes fines. Sécurité et préparation matériau différentes d’une diode ou d’un CO₂ ; ce n’est pas une découpe polyvalente.",
    },
  },
  "fire-safety": {
    priority: 11,
    en: {
      title: "Fire detection / suppression",
      body:
        "Built-in flame monitoring or suppression is rare on desktop lasers and matters when you cut cardboard, thick wood, or run unattended-ish batch jobs. It does not replace a nearby extinguisher and human judgment.",
    },
    fr: {
      title: "Détection / extinction incendie",
      body:
        "La surveillance ou extinction intégrée reste rare sur les lasers bureau et compte quand vous découpez carton, bois épais ou lancez des lots quasi automatiques. Cela ne remplace ni extincteur à portée ni votre jugement.",
    },
  },
  "air-assist-included": {
    priority: 13,
    en: {
      title: "Air assist included",
      body:
        "Factory air assist blows smoke out of the kerf for cleaner cuts : especially acrylic and dark wood. If it is included, you skip the first upgrade most open-frame owners buy separately.",
    },
    fr: {
      title: "Air assist inclus",
      body:
        "L’air assist d’usine chasse les fumées du trait de coupe : surtout acrylique et bois foncé. S’il est inclus, vous évitez la première upgrade que les open-frame achètent à part.",
    },
  },
  "lightburn-ready": {
    priority: 14,
    en: {
      title: "LightBurn compatible",
      body:
        "LightBurn support means advanced layers, camera tools, and workflows many makers outgrow the stock app with. Confirm your exact controller board before assuming full features : some machines need a paid license separately.",
    },
    fr: {
      title: "Compatible LightBurn",
      body:
        "Le support LightBurn ouvre calques avancés, outils caméra et flux que beaucoup dépassent dans l’app constructeur. Confirmez la carte contrôleur exacte avant de supposer toutes les fonctions : licence parfois en sus.",
    },
  },
  "galvo-speed": {
    priority: 15,
    en: {
      title: "Galvo speed class",
      body:
        "Galvo mirrors move the beam instead of a heavy gantry : engraving speeds that feel instant on small fields. Trade-off: tiny work area versus a flatbed diode; ideal for jewelry, tags, and batch marking, not large signs.",
    },
    fr: {
      title: "Classe vitesse galvo",
      body:
        "Les galvos déplacent le faisceau sans chariot lourd : des vitesses de gravure quasi instantanées sur petit champ. Contrepartie : surface utile minuscule vs une diode plateau ; idéal bijoux, plaques et séries, pas grandes enseignes.",
    },
  },
};

function hasCameraForStandout(machine: Machine): boolean {
  if (machineHasCamera(machine)) return true;
  return getMachineAccessories(machine).some(
    (a) => a.id === "camera" && a.availability === "included",
  );
}

function detectFeatureIds(machine: Machine): StandoutFeatureId[] {
  const enclosed = machineIsEnclosed(machine);
  const camera = hasCameraForStandout(machine);
  const ids: StandoutFeatureId[] = [];

  if (enclosed && camera) ids.push("enclosed-camera");
  else if (camera) ids.push("alignment-camera");
  else if (enclosed) ids.push("enclosed-cabinet");
  else if (machine.laserType === "diode") ids.push("open-frame-safety");

  if (hasHeightSensing(machine)) ids.push("z-probe-autofocus");

  if (machine.moduleSystem?.style === "interchangeable") ids.push("interchangeable-head");
  if (machine.moduleSystem?.style === "dual-laser" || machine.laserType === "hybrid") {
    ids.push("dual-laser");
  }

  if (machine.laserType === "co2") ids.push("co2-production");
  if (machine.laserType === "fiber") ids.push("fiber-metal");
  if (machine.laserType === "uv") ids.push("uv-cold-mark");

  if (hasFireSafety(machine)) ids.push("fire-safety");

  if (
    mentions(
      machine,
      /\bair\s*assist\s*(included|built-?in|standard)/,
      /\bwith\s+air\s*assist/,
    )
  ) {
    ids.push("air-assist-included");
  }

  if ((machine.specs.software ?? []).some((s) => /lightburn/i.test(s))) {
    ids.push("lightburn-ready");
  }

  if (isGalvo(machine)) ids.push("galvo-speed");

  return [...new Set(ids)];
}

export function getMachineStandoutFeatures(
  machine: Machine,
  locale: Locale,
): MachineStandoutFeature[] {
  if (machine.standoutFeatures?.length) {
    return machine.standoutFeatures.map((f) => ({
      ...f,
      title: noEmDash(f.title),
      body: noEmDash(f.body),
    }));
  }

  const lang = locale === "fr" ? "fr" : "en";
  const ids = detectFeatureIds(machine);

  const toFeature = (id: StandoutFeatureId): MachineStandoutFeature & { priority: number } => {
    const copy = FEATURE_COPY[id][lang];
    return {
      id,
      title: noEmDash(copy.title),
      body: noEmDash(copy.body),
      priority: FEATURE_COPY[id].priority,
    };
  };

  let features = ids.map(toFeature).sort((a, b) => a.priority - b.priority);

  const hasCameraCard = features.some(
    (f) => f.id === "enclosed-camera" || f.id === "alignment-camera",
  );
  if (hasCameraForStandout(machine) && !hasCameraCard) {
    const id: StandoutFeatureId = machineIsEnclosed(machine)
      ? "enclosed-camera"
      : "alignment-camera";
    features = [toFeature(id), ...features].sort((a, b) => a.priority - b.priority);
  }

  return features.slice(0, 4).map(({ id, title, body }) => ({ id, title, body }));
}
