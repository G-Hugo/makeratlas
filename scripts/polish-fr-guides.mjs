/**
 * Passe éditoriale FR : intros naturelles, moins d'anglicismes, blurbs après tableaux.
 * node scripts/polish-fr-guides.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../content/guides/fr");

const intros = {
  "diode-lasers-explained.md": `La graveuse **diode** (lumière bleue, ~450 nm) est le **premier laser** de la plupart des bricoleurs et petites boutiques. Elle est compacte, abordable, et excellente sur le **bois, le cuir et l'aluminium anodisé**. C'est aussi la catégorie au **marketing le plus trompeur** : watts gonflés sur les annonces, démos « gravure métal » avec spray invisible, photos qui cachent la fumée d'une vraie découpe.

Ce guide ne parle **que de la diode bleue** : comment elle fonctionne, ce qu'elle grave vraiment, et où elle s'arrête. Pour la comparer au CO₂, à la fibre et à l'UV : [comprendre les types de laser](/guides/understanding-laser-types).`,

  "co2-lasers-explained.md": `Le laser **CO₂** (~10 600 nm) est le **cheval de bataille** de la signalétique, de l'acrylique et des matériaux organiques épais. Si vos projets incluent de l'**acrylique transparent**, du **bois épais**, des **tampons caoutchouc** ou du **cuir en série**, c'est en général la bonne technologie — pas une diode plus puissante avec de meilleures photos publicitaires.

Attention aux **coûts cachés** : durée de vie du tube, extraction obligatoire, alignement, acrylique qui se fissure si les réglages sont mauvais. Budgétez au-delà du prix affiché. Pour comparer toutes les familles laser : [comprendre les types de laser](/guides/understanding-laser-types).`,

  "fiber-lasers-explained.md": `Le laser **fibre** (~1 064 nm, infrarouge) est l'outil adapté quand le **métal nu** est votre matière du quotidien : inox, aluminium, laiton, cuivre, et beaucoup de revêtements industriels — souvent **sans spray de marquage**.

C'est aussi la catégorie la plus **mal comprise** : on la confond avec les petits modules infrarouges sur graveuses diode, avec le label « MOPA » sur les annonces, ou avec les boîtiers hybrides qui font aussi tourner une diode pour le bois. Ce guide traite **la fibre seule**. Panorama global : [comprendre les types de laser](/guides/understanding-laser-types).`,

  "uv-lasers-explained.md": `Le laser **UV** (~355 nm) occupe une **niche précise** : marquer des matériaux que la diode ou la fibre **brûlent, fondent ou décolorent** — certains plastiques techniques, du verre fin, de l'électronique. Il coûte plus cher, demande une **sécurité stricte** (faisceau invisible), et résout des problèmes que la plupart des premiers acheteurs n'ont pas encore.

Ne l'achetez pas par curiosité. Choisissez l'UV quand votre **liste de matériaux** l'exige déjà. Vue d'ensemble : [comprendre les types de laser](/guides/understanding-laser-types).`,

  "understanding-laser-types.md": `Choisir une graveuse laser, c'est d'abord choisir **quelle technologie** vous convient — et c'est là que beaucoup d'acheteurs se trompent, en se laissant guider par le plus gros chiffre de watts sur l'annonce.

Ce guide présente **chaque type de laser** (diode, CO₂, fibre, UV, hybride) : ce qu'il fait vraiment sur les matériaux, pour qui il est fait, et les pièges du marketing. Pas de liens affiliés : uniquement la physique et l'usage atelier.`,

  "mopa-fiber-lasers-explained.md": `Le **MOPA** (Master Oscillator Power Amplifier) est une **fibre laser à impulsions réglables**. La longueur d'onde reste celle d'une fibre classique (~1 064 nm), mais vous contrôlez **la durée et la fréquence** de chaque impulsion sur le métal. C'est ce réglage fin qui permet, entre autres, des **couleurs sur l'acier inoxydable** et des marques plus homogènes.

Ce n'est pas une famille à côté du CO₂ ou de la diode : c'est du marquage métal par fibre, avec un contrôle d'impulsion plus poussé. Si la fibre vous est nouvelle : [fibre expliquée](/guides/fiber-lasers-explained).`,

  "hybrid-lasers-explained.md": `Une machine **hybride** embarque **deux sources laser complètes** dans un seul boîtier : en général une **fibre** (~1 064 nm) pour le métal et une **diode bleue** (~450 nm) pour le bois, le cuir et les organiques. Vous ne les utilisez pas simultanément : le **logiciel bascule** d'un mode à l'autre. Les deux faisceaux ne fusionnent pas en une « super-longueur d'onde ».

C'est pensé pour les ateliers qui font du métal **et** du bois sans vouloir deux bureaux, deux logiciels et deux extractions. Le compromis : une **zone de travail galvo très petite** (souvent 110 à 200 mm). Ne confondez pas avec les machines à **modules interchangeables** — ce n'est pas la même ingénierie.

Panorama des types : [comprendre les types de laser](/guides/understanding-laser-types). Comparaisons produit par produit : [modules interchangeables](/guides/swappable-laser-modules-explained).`,

  "swappable-laser-modules-explained.md": `Sur les annonces, les mots **module**, **tête**, **hybride** et **Ultra** s'entremêlent — mais derrière, ce ne sont pas les mêmes architectures. Confondre un **hybride intégré** (deux sources, bascule logiciel) avec une **enceinte à têtes diode interchangeables** ou une **base galvo modulaire**, c'est gaspiller budget et place atelier.

Ce guide compare **ce qui change physiquement** quand vous achetez ou upgradez : la longueur d'onde active, le mécanisme de changement, les matériaux possibles. Pour la physique des types laser : [comprendre les types de laser](/guides/understanding-laser-types).`,

  "infrared-laser-modules-explained.md": `Certaines graveuses **diode** (portique ou enceinte) proposent un **accessoire infrarouge** optionnel, autour de **2 W** et **1 064 nm** — la même longueur d'onde qu'une fibre, mais une **toute autre machine** : faible puissance, optiques de portique, plafond de production bien plus bas.

L'erreur la plus coûteuse : acheter ce module en pensant remplacer une station fibre pour de l'**inox en série**. Ce guide décrit ce que l'IR basse puissance marque vraiment, et quand la fibre reste indispensable. Panorama : [comprendre les types de laser](/guides/understanding-laser-types).`,

  "metal-marking-without-fiber.md": `« Je veux graver de l'inox » : cette phrase vend des diodes **et** des fibres, parfois à la même personne la même semaine. Bonne nouvelle : beaucoup de projets métal **n'exigent pas** une station fibre à 2 000 €. Mauvaise nouvelle : le spray, l'anodisation ou les mauvais réglages peuvent **échouer** sur la durabilité promise au client.

Quatre chemins réalistes, avec la physique, le déroulement atelier, le moment de passer à la fibre, et les erreurs qui mènent aux remboursements. Contexte fibre : [fibre expliquée](/guides/fiber-lasers-explained). Bases diode : [diode expliquée](/guides/diode-lasers-explained).`,

  "laser-materials-by-type.md": `Avant d'acheter pour un **matériau précis**, regardez ce tableau — les watts seuls ne battent pas la **physique des longueurs d'onde**. Une diode 40 W ne découpera pas honnêtement l'acrylique transparent. Un CO₂ 55 W ne marquera pas l'inox nu comme une fibre.

Chaque symbole du tableau est expliqué plus loin : pourquoi il s'applique, quels réglages typiques, quelles erreurs d'acheteur. Guides par technologie : [diode](/guides/diode-lasers-explained) · [CO₂](/guides/co2-lasers-explained) · [fibre](/guides/fiber-lasers-explained) · [UV](/guides/uv-lasers-explained) · [hybride](/guides/hybrid-lasers-explained).`,

  "laser-wattage-marketing-explained.md": `Sur les marketplaces, le **plus gros chiffre** est souvent le **moins fiable**. Sur une annonce diode, « 40 W » peut signifier la puissance optique réelle, la somme électrique de plusieurs puces, ou simplement un **nom de module** qui vend bien en bannière.

Voici comment lire une annonce, une fiche technique ou une vidéo YouTube sans confondre marketing et capacité réelle — pièges diode, honnêteté des tubes CO₂, vitesses galvo, scénarios concrets. À lire avec [diode expliquée](/guides/diode-lasers-explained) pour les limites matériaux que les watts ne corrigent pas.`,

  "co2-laser-tubes-explained.md": `Votre CO₂ bureau repose sur un **tube laser** — verre classique ou intégrateur RF métal. Ce tube détermine la **durée de vie**, le **coût de remplacement** et le comportement en découpe, pas seulement le watt sur l'autocollant.

Commencez par [CO₂ expliqué](/guides/co2-lasers-explained) pour les matériaux, l'extraction et le déroulement atelier. Cette page sert à comparer un K40 verre et un intégrateur RF premium, budgéter les remplacements et éviter une mort prématurée du tube.`,

  "laser-buying-guide-2026.md": `Vous n'avez **pas besoin** d'un laser à 3 000 €. La plupart des gens commencent entre **200 et 600 €** pour la machine, plus l'essentiel : lunettes, chutes de test, logiciel gratuit (**LaserGRBL**). Si vous hésitez entre diode, CO₂ et fibre : [comprendre les types de laser](/guides/understanding-laser-types).

> **Transparence :** pas de liens affiliés — les recommandations suivent les capacités réelles et le **coût total atelier** (extraction, accessoires, consommables).`,

  "open-frame-vs-enclosed-lasers.md": `Choisir entre **portique ouvert** et **enceinte fermée**, ce n'est pas une question de design. C'est une question de **qui peut entrer dans la pièce** pendant que la machine tourne, de **combien de fumée** reste dans l'air, et de **quelle classe laser** vous gérez au quotidien.

Les photos marketing montrent de jolies boîtes blanches ; la réalité atelier, c'est l'odeur, les verrous de capot et les lunettes pour chaque personne présente. Les graveuses **galvo fibre** sont une troisième catégorie à part : [stations galvo](/guides/galvo-laser-workstations-explained).`,

  "laser-ventilation-setup.md": `L'extraction n'est pas un accessoire optionnel. C'est ce qui garde **odeurs, particules fines et risque d'incendie** dans une plage tolérable pour votre pièce et vos poumons.

Ce guide s'adresse aux **makers à domicile et petits ateliers** qui préparent l'installation avant (ou juste après) l'arrivée de la machine. À lire avec [bases sécurité laser](/guides/laser-safety-basics) (yeux, incendie, surveillance des découpes).`,

  "laser-exhaust-filters-explained.md": `Dès l'installation d'une graveuse chez soi, la même question revient : **filtre dans la pièce, ou tuyau vers l'extérieur ?** La réponse dépend de **ce que vous découpez**, **combien de temps**, et **où** vous travaillez (appartement, garage, atelier dédié).

Une enceinte fermée protège des **rayons laser** ; elle ne rend pas l'air **respirable** après une découpe d'acrylique ou de contreplaqué. Filtres et évacuation traitent **la fumée** — deux approches différentes, parfois complémentaires.

Si vous n'avez pas encore dimensionné le débit d'air : commencez par [ventilation](/guides/laser-ventilation-setup).`,

  "air-assist-honeycomb-setup.md": `Le **soufflage d'air** (air assist) et la **table alvéolée** (honeycomb) figurent dans presque tous les packs accessoires pour diode. Parfois ils transforment nettement la qualité de découpe sur le bois. Parfois ils finissent sur l'étagère parce que l'extraction manquait déjà.

Ce guide explique **quand** ces accessoires valent leur prix, comment dimensionner une pompe sur une diode d'entrée de gamme, et pourquoi ils ne remplacent ni une bonne extraction ni le **bon type de laser** pour votre matériau.`,

  "lightburn-vs-maker-software.md": `L'application fournie par le constructeur suffit souvent pour **les premiers mois** : presets matériaux, calibration, parfois caméra. **LightBurn** est l'étape suivante pour beaucoup d'ateliers qui veulent des **calques**, une bibliothèque de réglages et un mode **rotary** structuré — à condition que le contrôleur de la machine le supporte.

Avant d'acheter une licence, vérifiez la compatibilité : une licence inutile sur une machine mal supportée, c'est de l'argent et du temps perdus.`,

  "rotary-laser-engraving.md": `Graver un gobelet ou un cylindre a l'air simple en vidéo YouTube. En atelier, les **gobelets coniques**, le **glissement sur les rouleaux** et la **dérive de mise au point** ruinent vite les premières séries — et beaucoup abandonnent le drinkware après une semaine frustrante.

Ce guide détaille **rouleaux vs mandrin**, ce que LightBurn (ou l'app constructeur) doit savoir sur le diamètre, et les réglages qui tiennent sur une production régulière.`,

  "laser-safety-basics.md": `Un laser de bureau peut **détruire définitivement vos yeux** en une fraction de seconde et **déclencher un incendie** sur du contreplaqué mal surveillé. Ce n'est pas de la dramatisation : c'est la physique, et elle s'applique quelle que soit la marque.

Les limites matériaux doivent figurer sur toute fiche sérieuse. Ce guide rappelle ce qui vous protège au quotidien — lunettes, extraction, surveillance — avant le premier job.`,
};

const tableBlurb = `\n\n*Ce tableau résume l'essentiel. Les sections suivantes détaillent chaque point avec des exemples concrets.*\n`;

const globalReplacements = [
  [/Assist air/gi, "Soufflage d'air (air assist)"],
  [/\bshop\b/gi, "atelier"],
  [/\bworkshop\b/gi, "atelier"],
  [/\bheadline\b/gi, "affiche en gros"],
  [/\bbon fit\b/gi, "bon profil"],
  [/\bmauvais fit\b/gi, "peu adapté"],
  [/\bMauvais fit\b/g, "Peu adapté"],
  [/\bBon fit\b/g, "Bon profil"],
  [/\bworkflows?\b/gi, (m) => (m[0] === "W" ? "Déroulement atelier" : m[0] === "w" ? "déroulement atelier" : "Déroulements atelier")],
  [/Ci-dessous\s*:/g, ""],
  [/Tout ce qui suit concerne/g, "La suite traite"],
  [/→ Détail complet\s*:/g, "→ Approfondir :"],
  [/\bopen-frame\b/gi, "portique ouvert"],
  [/\bgantry\b/gi, "portique"],
  [/\bkerf\b/gi, "trait de coupe"],
  [/\bSKU\b/g, "référence"],
  [/\bCFM\b/g, "débit d'air (CFM)"],
  [/\bVOC\b/g, "composés organiques volatils (COV)"],
  [/\bCOV\b/g, "composés organiques volatils (COV)"],
  [/Si vous venez d'un diode/g, "Si vous avez l'habitude d'une graveuse diode"],
  [/un diode/g, "une graveuse diode"],
  [/du diode/g, "de la graveuse diode"],
  [/le diode/g, "la graveuse diode"],
  [/La suite :/g, ""],
  [/→ Suite/g, "→ Aller plus loin"],
  [/## Suite\n/g, "## Aller plus loin\n"],
];

function replaceIntro(content, intro) {
  const norm = content.replace(/\r\n/g, "\n");
  const m = norm.match(/^(---\n[\s\S]*?\n---\n\n)([\s\S]*?)(?=\n## )/);
  if (!m) return content;
  const out = m[1] + intro + "\n\n" + norm.slice(m[0].length);
  return content.includes("\r\n") ? out.replace(/\n/g, "\r\n") : out;
}

function addTableBlurb(content) {
  const norm = content.replace(/\r\n/g, "\n");
  if (norm.includes("Ce tableau résume l'essentiel")) return content;
  const out = norm.replace(/(## Référence rapide\n\n\|[^\n]+\n\|[-| ]+\n(?:\|[^\n]+\n)+)/, `$1${tableBlurb}`);
  return content.includes("\r\n") ? out.replace(/\n/g, "\r\n") : out;
}

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
  let c = fs.readFileSync(path.join(dir, file), "utf8");
  if (intros[file]) c = replaceIntro(c, intros[file]);
  c = addTableBlurb(c);
  for (const [pat, rep] of globalReplacements) {
    c = typeof rep === "function" ? c.replace(pat, rep) : c.replace(pat, rep);
  }
  fs.writeFileSync(path.join(dir, file), c);
  console.log("polished:", file);
}
