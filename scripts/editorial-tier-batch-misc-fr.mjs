/**
 * FR overlays for misc tier packs. Run: node scripts/editorial-tier-batch-misc-fr.mjs
 */
import fs from "fs";
import path from "path";
import { PACKS } from "./editorial-tier-batch-misc.mjs";

const frDir = "content/translations/fr/machines";

/** French pros + editorialDepth keyed like PACKS */
const FR = {
  "acmer-p1-10w": {
    pros: [
      "Palier P1 Acmer le moins cher, orienté gravure",
      "Open-frame plein format compatible LightBurn",
      "Bon départ avant P2 ou P3 enceinte",
    ],
    editorialDepth: {
      advantages: "Le P1 10 W est l’entrée Acmer quand la marque compte plus que l’épaisseur de découpe.",
      limitations: "Boutiques qui découpent : voir P1 20 W ou P3.",
    },
  },
  "acmer-p1-20w": {
    pros: [
      "P1 20 W équilibré gravure et tilleul fin",
      "Fort rapport qualité-prix dans le guide d’achat",
      "Montée vers P2 ou P3 dans la marque",
    ],
    editorialDepth: {
      advantages: "Le P1 20 W est le SKU Acmer à comparer au Ray5 et A5 Pro 20 W.",
      limitations: "Cadre et communauté en retrait d’Ortur. Appartement : Acmer P3.",
    },
  },
  "acmer-s2-pro-36w": {
    pros: [
      "Acmer open-frame milieu-haut entre P2 et le flagship",
      "Diode compressée pour panneaux plus rapides",
      "Grand plateau pour mise en page enseignes",
    ],
    editorialDepth: {
      advantages: "S2 Pro 36 W pour la vitesse Acmer sans le prix du SKU le plus haut.",
      limitations: "Comparez S30 Ultra 22 W et LM3 20 W avant achat.",
    },
  },
  "acmer-s2-pro-48w": {
    pros: [
      "Puissance open-frame Acmer maximale pour lots bois",
      "Option la plus rapide de la ligne S2 Pro",
      "Sous le CO₂ si la ventilation bloquait",
    ],
    editorialDepth: {
      advantages: "S2 Pro 48 W pour le débit sur grand châssis Acmer.",
      limitations: "Enceinte ou CO₂ restent meilleurs pour signalétique appartement.",
    },
  },
  "ortur-lm2-s2-5w": {
    pros: [
      "Prix Ortur le plus bas du catalogue",
      "Communauté LM2 historique pour premiers tests",
      "Plateau suffisant pour ardoises et petits cadeaux",
    ],
    editorialDepth: {
      advantages: "LM2 5 W seulement en forte promo pour apprendre.",
      limitations: "Le guide oriente les acheteurs payants vers des gammes plus récentes.",
    },
  },
  "ortur-lm2-s2-10w": {
    pros: [
      "Ortur 10 W budget orienté gravure",
      "Énorme historique forum pour dépannage",
      "Palier avant LM3 20 W",
    ],
    editorialDepth: {
      advantages: "LM2 10 W viable si bien moins cher que l’équivalent LM3.",
      limitations: "En 2026, comparez d’abord LM3 ou H20.",
    },
  },
  "ortur-laser-master-3-10w": {
    pros: [
      "LM3 gravure avec le même plateau que le 20 W",
      "Bon apprentissage avant de payer des watts de découpe",
      "Montée vers module 20 W sur le même cadre",
    ],
    editorialDepth: {
      advantages: "LM3 10 W pour cadeaux détaillés sur le châssis le plus vendu.",
      limitations: "Activités mixtes : commencez sur le profil 20 W.",
    },
  },
  "ortur-laser-master-h10-10w": {
    pros: [
      "Entrée H10 sur châssis intégré Ortur plus récent",
      "Orienté gravure, style plus industriel que LM2",
      "Ligne modulaire pour monter en puissance",
    ],
    editorialDepth: {
      advantages: "H10 10 W pour gravure cadeaux sur châssis série H.",
      limitations: "Comparez la valeur LM3 10 W avant de choisir H10.",
    },
  },
  "ortur-laser-master-h10-20w": {
    pros: [
      "H10 20 W équilibré pour hobby mixte",
      "Cadre intégré Ortur avec histoire modulaire",
      "Alternative esthétique au LM3 classique",
    ],
    editorialDepth: {
      advantages: "H10 20 W pour fans Ortur du châssis H sans complexité H20.",
      limitations: "Comparez prix et support LM3 20 W côte à côte.",
    },
  },
  "ortur-laser-master-h10-40w": {
    pros: [
      "Tête H10 la plus rapide pour semaines découpe",
      "Vitesse type LM3 sur plateforme H",
      "Montée Ortur sans CO₂",
    ],
    editorialDepth: {
      advantages: "H10 40 W pour la découpe sur plateforme H10.",
      limitations: "Comparez H20 40 W modulaire et Falcon2 Pro 40 W.",
    },
  },
  "ortur-h20-10w": {
    pros: [
      "Module H10 W d’entrée sur plateforme modulaire",
      "Gravure avec montée vers 20 W ou 40 W",
      "Châssis intégré versus esthétique LM classique",
    ],
    editorialDepth: {
      advantages: "H20 10 W si vous voulez la plateforme modulaire sans découpe épaisse.",
      limitations: "La plupart des acheteurs doivent lire H20 20 W d’abord.",
    },
  },
  "ortur-h20-40w": {
    pros: [
      "Tête H20 la plus musclée pour bois",
      "Montées modulaires sans racheter la machine",
      "Écosystème Ortur pour paliers de watts",
    ],
    editorialDepth: {
      advantages: "H20 40 W si vous êtes engagés sur H20 et voulez le maximum diode.",
      limitations: "Vérifiez le module optique dans le bundle.",
    },
  },
  "sculpfun-s9-5w": {
    pros: [
      "Entrée S9 la moins chère pour tests gravure",
      "Immense base connaissance Sculpfun",
      "Grand plateau à prix budget",
    ],
    editorialDepth: {
      advantages: "S9 5 W en forte promo seulement.",
      limitations: "Neufs : comparez S9 10 W et promos S30 Ultra.",
    },
  },
  "sculpfun-s9-10w": {
    pros: [
      "Configuration S9 du guide d’achat",
      "Meilleure gravure par euro chez Sculpfun open",
      "Recettes LightBurn très partagées",
    ],
    editorialDepth: {
      advantages: "S9 10 W pick budget gravure quand la S30 est chère.",
      limitations: "Devis découpe : machines 20 W ou plus.",
    },
  },
  "sculpfun-s30-ultra-10w": {
    pros: [
      "Ultra 10 W gravure sur châssis Sculpfun actuel",
      "Entrée moins chère dans la génération Ultra",
      "Montée vers 22 W sur la même ligne",
    ],
    editorialDepth: {
      advantages: "Ultra 10 W pour cadeaux sur le nouveau cadre Sculpfun.",
      limitations: "Boutiques découpe : profil Ultra 22 W.",
    },
  },
  "sculpfun-s30-ultra-20w": {
    pros: [
      "Ultra 20 W entre gravure 10 W et flagship 22 W",
      "Cadre actuel avec communauté solide",
      "Utile si le 22 W est en rupture",
    ],
    editorialDepth: {
      advantages: "Ultra 20 W : comparez le prix au 22 W avant achat.",
      limitations: "La plupart des acheteurs production visent le 22 W.",
    },
  },
  "sculpfun-icube-pro-5w": {
    pros: [
      "Format Sculpfun compact pour petit bureau",
      "Intéressant pour appartement et mini cadeaux",
      "Entrée écosystème Sculpfun",
    ],
    editorialDepth: {
      advantages: "iCube Pro 5 W pour espaces réduits.",
      limitations: "Comparez S9 10 W sauf contrainte taille.",
    },
  },
  "sculpfun-icube-pro-10w": {
    pros: [
      "iCube 10 W plus capable pour gravure maison",
      "Empreinte plus petite que S30 open",
      "Mods Sculpfun en croissance",
    ],
    editorialDepth: {
      advantages: "iCube Pro 10 W quand la taille bureau prime sur le plateau max.",
      limitations: "Enseignistes : formats plus grands ou CO₂.",
    },
  },
  "two-trees-ts2-20w": {
    pros: [
      "TwoTrees 20 W souvent agressif en specs par euro",
      "Pour hobbyistes chassant les promos bundle",
      "LightBurn pour gravure et découpe modérée",
    ],
    editorialDepth: {
      advantages: "TS2 20 W si le prix bat les marques établies et vous acceptez moins de support.",
      limitations: "Production : LM3 ou S30 pour le dépannage.",
    },
  },
  "two-trees-ts2-40w": {
    pros: [
      "TS2 40 W pour découpe bois plus rapide",
      "Marketing chargé : validez en vrai",
      "Alternative budget au Falcon2 Pro 40 W",
    ],
    editorialDepth: {
      advantages: "TS2 40 W si le prix prime sur la communauté.",
      limitations: "Lisez les avis sur courroies et focus.",
    },
  },
  "twotrees-tts-55-10w": {
    pros: [
      "Entrée TTS-55 sur grand châssis TwoTrees",
      "Gravure sur lit large",
      "Chemin budget vers cadre 55",
    ],
    editorialDepth: {
      advantages: "TTS-55 10 W pour grandes mises en page sans découpe épaisse.",
      limitations: "Comparez Ortur si le support communautaire compte.",
    },
  },
  "twotrees-tts-55-20w": {
    pros: [
      "TTS-55 20 W équilibré sur lit large",
      "Intéressant pour panneaux larges à budget",
      "Souvent vendu avec kits extension",
    ],
    editorialDepth: {
      advantages: "TTS-55 20 W quand la largeur physique prime.",
      limitations: "Qualité montage = coût caché.",
    },
  },
  "twotrees-tts-55-40w": {
    pros: [
      "Meilleur débit TTS-55 pour panneaux bois",
      "Grand lit + haute classe optique en promo",
      "Alternative CO₂ si seuls les organiques paient",
    ],
    editorialDepth: {
      advantages: "TTS-55 40 W quand format large et vitesse battent la marque.",
      limitations: "Pas pour appartement sans vraie extraction.",
    },
  },
  "two-trees-tts-55-pro-10w": {
    pros: [
      "TTS-55 Pro avec composants au-dessus du 55 base",
      "10 W gravure sur châssis large",
      "Vérifiez air assist et taille dans le pack Pro",
    ],
    editorialDepth: {
      advantages: "TTS-55 Pro 10 W pour gravure sur grand format.",
      limitations: "Mixte : comparez Pro 20 W.",
    },
  },
  "two-trees-tts-55-pro-20w": {
    pros: [
      "Palier Pro 55 20 W pour travail large",
      "Souvent vendu avec air assist",
      "Panneaux enseignes hobby à budget",
    ],
    editorialDepth: {
      advantages: "TTS-55 Pro 20 W si les extras Pro justifient le prix.",
      limitations: "Confirmez watts optiques et rails dans les avis.",
    },
  },
  "xtool-d1-pro-5w": {
    pros: [
      "Entrée D1 Pro pour écosystème xTool pas cher",
      "Cadre compatible rehausseur sur certains setups",
      "Prise en main xTool Creative Space",
    ],
    editorialDepth: {
      advantages: "D1 Pro 5 W pour habitudes logiciel xTool à bas coût.",
      limitations: "La plupart des acheteurs : D1 Pro 10 W ou S1.",
    },
  },
  "xtool-d1-pro-10w": {
    pros: [
      "Palier D1 Pro populaire avec support xTool",
      "Écosystème rehausseur pour cylindres",
      "Étape avant D1 Pro 20 W ou S1",
    ],
    editorialDepth: {
      advantages: "D1 Pro 10 W pour fans xTool orientés cadeaux.",
      limitations: "Revenus découpe : 20 W ou lignes fermées.",
    },
  },
  "xtool-d1-pro-20w": {
    pros: [
      "Meilleure diode xTool open-frame avant S1",
      "Logiciel et accessoires xTool intégrés",
      "Découpe 20 W crédible pour side business",
    ],
    editorialDepth: {
      advantages: "D1 Pro 20 W pour écosystème xTool sans prix S1.",
      limitations: "Familles : chiffrez S1 20 W avant achat.",
    },
  },
  "xtool-d1-pro-40w": {
    pros: [
      "Tête D1 Pro la plus rapide pour découpe",
      "Même parcours accessoires que les paliers inférieurs",
      "Maximum débit xTool open-frame",
    ],
    editorialDepth: {
      advantages: "D1 Pro 40 W pour fidèles xTool qui veulent vitesse sans S1.",
      limitations: "Comparez S1 40 W si la fumée doit être confinée.",
    },
  },
  "creality-falcon-a1-10w": {
    pros: [
      "Entrée Falcon A1 fermée pour gravure plus sûre",
      "Moins cher que A1 Pro double source",
      "App Creality pour débutants",
    ],
    editorialDepth: {
      advantages: "Falcon A1 10 W quand la sécurité enceinte prime sur les watts.",
      limitations: "Mixte découpe : A1 Pro 20 W.",
    },
  },
  "commarker-omni-x-uv": {
    pros: [
      "UV bureau pour plastiques et substrats compatibles UV",
      "Unité compacte face à une fibre galvo",
      "Workflow différent des lasers cadeaux diode/CO₂",
    ],
    editorialDepth: {
      advantages: "Omni X UV si vous savez déjà qu’il vous faut du marquage UV.",
      limitations: "Pas comme premier laser bois/enseignes. Testez les substrats.",
    },
  },
  "commarker-omni-xe-uv": {
    pros: [
      "Plateforme UV élargie dans la ligne Omni",
      "Pour ateliers ajoutant l’UV à d’autres outils",
      "Format bureau vs lignes UV industrielles",
    ],
    editorialDepth: {
      advantages: "Omni XE UV comme deuxième machine dédiée UV.",
      limitations: "Makers bois/acrylique : rester sur profils diode ou CO₂.",
    },
  },
};

let n = 0;
for (const slug of Object.keys(PACKS)) {
  const fr = FR[slug];
  if (!fr) continue;
  const p = path.join(frDir, `${slug}.json`);
  if (!fs.existsSync(p)) continue;
  const tr = JSON.parse(fs.readFileSync(p, "utf8"));
  tr.pros = fr.pros;
  if (fr.editorialDepth) tr.editorialDepth = fr.editorialDepth;
  fs.writeFileSync(p, `${JSON.stringify(tr, null, 2)}\n`, "utf8");
  n++;
}
console.log(`Updated ${n} French misc overlays.`);
