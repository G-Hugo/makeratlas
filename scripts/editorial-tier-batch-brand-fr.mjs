/**
 * French overlays for brand tier editorial (pros + editorialDepth).
 * Run after editorial-tier-batch-brand.mjs
 */
import fs from "fs";
import path from "path";

const frDir = "content/translations/fr/machines";

const FR = {
  "longer-ray5-5w": {
    pros: [
      "Prix Ray5 le plus bas pour apprendre LightBurn sur un petit bureau",
      "Focus fixe simple : ardoises, étiquettes et premiers tests",
      "Encombrement minimal pour studio ou appartement avec évacuation fenêtre",
      "Première étape avant Ray5 10 W ou 20 W si la découpe arrive plus tard",
    ],
    editorialDepth: {
      advantages:
        "Le Ray5 5 W sert à tester si le laser vous convient avant d’investir dans la vitesse. Il grave bois, cuir et ardoise correctement si vous acceptez des temps longs.",
      limitations:
        "Les activités qui chiffrent des découpes épaisses doivent viser le Ray5 20 W. Acrylique coulé et métal nu : hors scope. Méfiance des annonces « watts combinés » : vérifiez la puissance optique.",
    },
  },
  "longer-ray5-10w": {
    pros: [
      "Palier Ray5 orienté gravure avec de meilleurs remplissages photo que le 5 W",
      "Reste compact et abordable face à l’Ortur LM3",
      "Bon second laser de secours pour gravure cadeaux",
      "Montée possible vers 20 W ou 40 W sur la même gamme",
    ],
    editorialDepth: {
      advantages:
        "Le 10 W convient aux jobs surtout marqués, pas aux panneaux épais. Vous gardez le format bureau Ray5 avec des remplissages plus propres que le 5 W.",
      limitations:
        "Les ateliers qui découpent du tilleul 6 mm+ chaque jour doivent ouvrir la fiche 20 W. L’acrylique transparent veut du CO₂. Confusion fréquente entre SKU Ray5 sur les marketplaces.",
    },
  },
  "longer-ray5-20w": {
    pros: [
      "Choix Ray5 par défaut pour gravure mixte et découpe bois légère",
      "Souvent en promo sous l’Ortur LM3 20 W",
      "Plateau 375 mm pour enseignes et petites séries cadeaux",
      "Compatible LightBurn après Longer Laser Tool",
      "Alternative budget du guide d’achat milieu de gamme",
    ],
    editorialDepth: {
      advantages:
        "Le Ray5 20 W est la puissance que la plupart des acheteurs cherchent chez Longer. Il équilibre gravure style Etsy et tilleul modéré avec air assist et extraction.",
      limitations:
        "Signalétique acrylique ou bois épais en production : CO₂ ou Ray5 40 W. Communauté plus petite qu’Ortur ou Sculpfun. Les photos ultra fines peuvent préférer un 10 W réglé lentement.",
    },
  },
  "longer-ray5-40w": {
    pros: [
      "Tête Ray5 la plus rapide pour bois et acrylique foncé",
      "Meilleur choix si le format Ray5 convient déjà à votre bureau",
      "Utile quand le 20 W bloque vos soirées de production",
      "Toujours bien moins cher qu’une enceinte ou un CO₂",
    ],
    editorialDepth: {
      advantages:
        "Prenez le 40 W si le châssis Ray5 vous va mais que le débit 20 W freine vos devis. Vous restez sur l’entrée Longer avec le biais découpe maximal.",
      limitations:
        "Flexion châssis et cycle de travail comptent plus à cette puissance. Comparez Longer B1 ou S30 Ultra si vous voulez un plus grand plateau. Pour une enceinte : xTool S1 plutôt que watts sur Ray5.",
    },
  },
  "longer-laser-b1-20w": {
    pros: [
      "Grand format Longer open-frame pour panneaux plus larges que Ray5",
      "20 W : bon palier pour petite activité à budget serré",
      "Montée logique depuis Ray5 quand le plateau bloque",
      "Parcours LightBurn avec groupes Longer documentés",
    ],
    editorialDepth: {
      advantages:
        "Le B1 20 W convient quand vous avez besoin de place physique pour gabarits plus que d’une enceinte. C’est le Longer suivant si le Ray5 375 mm limite vos mises en page.",
      limitations:
        "Moins rigide et moins documenté que l’Ortur LM3 à watts comparables. Acrylique coulé : CO₂. Vérifiez le pack : air assist parfois absent.",
    },
  },
  "longer-laser-b1-30w": {
    pros: [
      "Diode compressée entre 20 W et 40 W sur châssis B1",
      "Découpes soir plus rapides sur tilleul 6–8 mm que le B1 20 W",
      "Grand plateau sans passer au CO₂",
      "Bon milieu si vous avez dépassé Ray5 sans budget enceinte",
    ],
    editorialDepth: {
      advantages:
        "Le B1 30 W vise des semaines découpe sur grand châssis Longer sans payer le pic marketing 40 W.",
      limitations:
        "Limites diode inchangées. Appartement : comparez machines fermées. Vérifiez le module optique livré.",
    },
  },
  "longer-laser-b1-40w": {
    pros: [
      "Palier B1 le plus rapide pour bois tendre épais",
      "Grand plateau pour séries cadeaux en multi-pièces",
      "Bon rapport si vous voulez vitesse sans projet ventilation CO₂",
      "À coupler avec air assist et évacuation extérieure sérieux",
    ],
    editorialDepth: {
      advantages:
        "Le B1 40 W s’adresse aux acheteurs déjà engagés sur le grand open-frame Longer qui veulent le maximum diode sur bois.",
      limitations:
        "Ne remplace pas une boutique enseignes acrylique. Les photos fines peuvent être meilleures en B1 20 W réglé lentement. Prévoyez budget extraction si vous venez du Ray5.",
    },
  },
  "longer-nano-6w": {
    pros: [
      "Graveuse Longer ultra-compacte pour voyage et petits cadeaux",
      "Faible consommation et très petit bureau",
      "Cuir, mini tests bois et apprentissage logiciel",
    ],
    editorialDepth: {
      advantages:
        "Le Nano 6 W vend la portabilité et l’entrée à faible risque avant un grand châssis.",
      limitations:
        "Toute activité de découpe payante : minimum Ray5 20 W. Les temps photo dépendent du format. Méfiance des watts combinés en annonce.",
    },
  },
  "longer-nano-pro-12w": {
    pros: [
      "Au-dessus du Nano avec plus de vitesse gravure, format toujours compact",
      "Portable face aux Ray5 ou B1",
      "Utile pour marchés artisanaux et petits objets personnalisés",
    ],
    editorialDepth: {
      advantages:
        "Le Nano Pro 12 W fait le pont entre graveuses jouet et diodes pleine taille.",
      limitations:
        "Dès que vous chiffrez des découpes, passez au Ray5 20 W. Pas comparable à une enceinte pour la fumée.",
    },
  },
  "creality-falcon2-12w": {
    pros: [
      "Entrée Falcon2 avec logiciel Creality guidé",
      "Air assist intégré sur beaucoup de packs pour premières découpes",
      "Prix gravure sous les paliers 22 W et 40 W",
    ],
    editorialDepth: {
      advantages:
        "Le Falcon2 12 W convient aux utilisateurs Creality 3D qui veulent rester dans la marque. L’air assist bat les open-frame 5 W nus pour débuter la découpe.",
      limitations:
        "Activité découpe quotidienne : comparez 22 W ou LM3. Acrylique transparent : CO₂.",
    },
  },
  "creality-falcon2-22w": {
    pros: [
      "Palier Falcon2 équilibré avant la gamme Pro",
      "Air assist et châssis rigide pour découpe hobby",
      "Marquage couleur utile pour cadeaux métal",
      "Grand plateau face au Ray5",
    ],
    editorialDepth: {
      advantages:
        "Le Falcon2 22 W est le rapport qualité-prix open-frame Creality avec air assist sans surcoût Pro.",
      limitations:
        "Les boutiques production peuvent préférer Sculpfun Ultra ou LM3. La finesse photo peut demander un module gravure plus lent.",
    },
  },
  "creality-falcon2-pro-22w": {
    pros: [
      "Palier 22 W populaire Creality avec air assist d’usine",
      "Gravure couleur utile pour inox cadeau",
      "Plateau ~400 mm pour enseignes",
      "Châssis structuré face aux vieux open-frame",
      "Concurrent crédible de la S30 Ultra 22 W en promo",
    ],
    editorialDepth: {
      advantages:
        "Le Falcon2 Pro 22 W cible l’écosystème Creality avec air assist prêt à l’emploi. Diode orientée découpe avant investissement CO₂.",
      limitations:
        "Le marquage couleur n’est pas une gravure fibre profonde. Moins de recettes communautaires que Sculpfun ou Ortur. Appartement : comparez Falcon A1 Pro fermé.",
    },
  },
  "creality-falcon2-pro-40w": {
    pros: [
      "Diode Creality open-frame la plus musclée pour découpe hobby",
      "Meilleur débit de la ligne Falcon2 Pro sur bois",
      "Air assist et châssis rigide sur la plupart des packs",
      "Sous le prix CO₂ si la ventilation bloquait",
    ],
    editorialDepth: {
      advantages:
        "Le 40 W quand le format Falcon2 Pro convient et que le 22 W freine vos devis. Argument Creality : vitesse sur organiques avec air assist usine.",
      limitations:
        "Enseignes acrylique transparent quotidien : CO₂. Comparez OMTech ou xTool P2 avant de croire qu’une diode 40 W les remplace.",
    },
  },
  "creality-falcon-a1-pro-20w": {
    pros: [
      "Creality fermé diode + IR pour plus de matériaux",
      "Plus sûr en famille que les Falcon2 ouverts",
      "Petit plateau adapté appartement et cadeaux",
      "Double source pour certains métaux/plastiques sans fibre complète",
    ],
    editorialDepth: {
      advantages:
        "L’A1 Pro 20 W convient si vous voulez enceinte et essais matériaux sans tarif xTool. L’IR ajoute du marquage impossible en diode seule.",
      limitations:
        "Le petit plateau bloque les grandes enseignes. Logiciel et support en retrait de xTool. Découpe intense : ventilation malgré l’enceinte.",
    },
  },
  "atomstack-a5-pro-5w": {
    pros: [
      "Entrée Atomstack historique avec grande communauté",
      "Grand plateau à petit prix pour LightBurn",
      "Cadre éprouvé pour ardoises et cuir",
    ],
    editorialDepth: {
      advantages:
        "Le A5 Pro 5 W reste pertinent en forte promo : écosystème et mods documentés au prix d’entrée.",
      limitations:
        "Si le budget permet 10 W, sautez souvent le 5 W. Pas de découpe production. Vérifiez le module livré.",
    },
  },
  "atomstack-a5-pro-10w": {
    pros: [
      "Palier A5 Pro le plus populaire pour gravure hobby",
      "Plateau complet abordable pour ardoise, bois, cuir",
      "Énorme base de mods et réglages en ligne",
    ],
    editorialDepth: {
      advantages:
        "Le 10 W est le sweet spot gravure de la ligne budget Atomstack.",
      limitations:
        "Les activités mixtes découpe/gravure le dépassent vite. Comparez Ortur LM3 10 W pour un châssis plus rigide.",
    },
  },
  "atomstack-a5-pro-20w": {
    pros: [
      "Module A5 Pro le plus fort pour découpe modérée sur cadre classique",
      "Parmi les 20 W plein format les moins chers",
      "Profils LightBurn et firmware largement partagés",
    ],
    editorialDepth: {
      advantages:
        "Le 20 W pour ceux qui connaissent déjà l’A5 et veulent couper sans changer de châssis.",
      limitations:
        "Le A40 Pro est plus rigide à puissance égale. Prévoyez une montée si les devis incluent des panneaux tilleul quotidiens.",
    },
  },
  "atomstack-a40-pro-20w": {
    pros: [
      "Châssis Atomstack plus rigide que A5 Pro en 20 W",
      "Grand plateau pour enseignes et séries",
      "Souvent compétitif avec Ortur LM3 20 W",
      "Bon open-frame avant machines fermées",
    ],
    editorialDepth: {
      advantages:
        "Le A40 Pro 20 W est la recommandation équilibrée Atomstack : meilleure mécanique que A5 avec 20 W optique.",
      limitations:
        "Communauté plus petite qu’Ortur. Acheteurs enceinte : xTool S1 20 W. Confirmez watts optiques, pas seulement « 40 W combinés ».",
    },
  },
  "atomstack-a40-pro-40w": {
    pros: [
      "Tête A40 Pro la plus rapide pour découpe",
      "Cadre rigide pour vitesses plus élevées que la ligne A5",
      "Bon rapport pour lots Etsy bois",
      "Prêt LightBurn pour hobby production",
    ],
    editorialDepth: {
      advantages:
        "Le 40 W pour ceux engagés sur le grand cadre Atomstack qui veulent le maximum diode sans CO₂.",
      limitations:
        "Pas d’équipement enseigne acrylique. Comparez Falcon2 Pro 40 W et S30 Ultra 22 W sur prix pack et air assist.",
    },
  },
  "comgrow-z1-5w": {
    pros: [
      "Prix d’entrée très bas pour tester la gravure",
      "Packs Comgrow souvent pour premiers acheteurs",
      "Plateforme compacte avant Z1 10 W",
    ],
    editorialDepth: {
      advantages:
        "Le Z1 5 W est une machine d’essai avant hardware 20 W.",
      limitations:
        "À éviter si vous savez déjà que vous devez découper. Confusion SKU fréquente. Lunettes et extraction dès le jour 1.",
    },
  },
  "comgrow-z1-10w": {
    pros: [
      "10 W abordable pour cadeaux et apprentissage",
      "Montée depuis 5 W sans prix 20 W complet",
      "Bois, cuir et découpes fines",
    ],
    editorialDepth: {
      advantages:
        "Le Z1 10 W pour graveurs occasionnels sur promo Comgrow.",
      limitations:
        "Devis avec découpes : palier 20 W. Comparez Sculpfun S9 en promo avant achat.",
    },
  },
  "comgrow-z1-20w": {
    pros: [
      "Palier Z1 le plus haut pour gravure et découpe légère budget",
      "Souvent parmi les 20 W les moins chers en ligne",
      "Bon spare ou démarrage micro-boutique",
    ],
    editorialDepth: {
      advantages:
        "Le Z1 20 W si le prix est le seul critère et que vous acceptez un écosystème plus fin.",
      limitations:
        "Les gros utilisateurs dépassent le cadre et le support. Comparez LM3 20 W. Pas pour exigence enceinte appartement.",
    },
  },
  "algolaser-alpha-mk2-10w": {
    pros: [
      "Plateforme Algolaser compacte 10 W orientée gravure",
      "Option pour découvrir une marque plus récente",
      "Cadeaux détaillés et cuir",
    ],
    editorialDepth: {
      advantages:
        "Le MK2 10 W pour curieux du style industriel Algolaser à watts hobby.",
      limitations:
        "Communauté plus petite qu’Ortur ou Sculpfun. Production découpe : paliers supérieurs ou marques établies.",
    },
  },
  "algolaser-alpha-mk2-20w": {
    pros: [
      "Palier MK2 équilibré gravure et découpe hobby",
      "Châssis Algolaser moderne face aux open designs anciens",
      "À comparer en prix avec LM3 et Ray5 20 W",
    ],
    editorialDepth: {
      advantages:
        "Le MK2 20 W est le choix Algolaser raisonnable sans watts flagship.",
      limitations:
        "Vérifiez garantie et support région. Acrylique coulé et profondeur métal : autres catégories laser.",
    },
  },
  "algolaser-alpha-mk2-40w": {
    pros: [
      "Meilleur débit MK2 pour semaines bois",
      "Marketing Algolaser centré vitesse découpe",
      "Alternative aux 40 W Creality ou S30 si bien prixé",
    ],
    editorialDepth: {
      advantages:
        "Le MK2 40 W pour acheteurs déjà convaincus par le design Algolaser qui veulent le maximum diode sur ce châssis.",
      limitations:
        "Pas éprouvé pour enseignes production. Comparez packs 40 W établis avec air assist et retours.",
    },
  },
};

let n = 0;
for (const [slug, pack] of Object.entries(FR)) {
  const p = path.join(frDir, `${slug}.json`);
  if (!fs.existsSync(p)) continue;
  const tr = JSON.parse(fs.readFileSync(p, "utf8"));
  tr.pros = pack.pros;
  if (pack.editorialDepth) tr.editorialDepth = pack.editorialDepth;
  fs.writeFileSync(p, `${JSON.stringify(tr, null, 2)}\n`, "utf8");
  n++;
}
console.log(`Updated ${n} French overlays.`);
