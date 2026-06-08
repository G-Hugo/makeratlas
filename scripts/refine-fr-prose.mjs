/**
 * Passe prose FR : grammaire, anglicismes, en-têtes de tableaux, tournures télégraphiques.
 * node scripts/refine-fr-prose.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../content/guides/fr");

const replacements = [
  // Grammaire
  [/\bun référence\b/gi, "une référence"],
  [/\bUn référence\b/g, "Une référence"],
  [/\bréférence usine\b/gi, "modèle à puissance fixe en usine"],
  [/\bréférence produit distinct\b/gi, "modèle distinct"],
  [/\bréférence watt\b/gi, "modèle à puissance fixe"],
  [/\bL'S1\b/g, "le S1"],
  [/\bl'S1\b/g, "le S1"],
  [/\bdu S1 qui\b/g, "du S1, qui"],

  // Anglicismes courants
  [/\bpendant le job\b/gi, "pendant le travail"],
  [/\bsans surveillance\*\*:/g, "sans surveillance** :"],
  [/\bun job\b/gi, "un passage"],
  [/\bUn job\b/g, "Un passage"],
  [/\bdu job\b/gi, "du travail"],
  [/\bdu job\b/gi, "du passage"],
  [/\bpar job\b/gi, "par passage"],
  [/\btemps job\b/gi, "durée réelle du travail"],
  [/\btype de job\b/gi, "type de travail"],
  [/\bchoisir le job\b/gi, "choisir le travail"],
  [/\bjob réel\b/gi, "travail réel"],
  [/\bjob supervisé\b/gi, "travail supervisé"],
  [/\bjob sans\b/gi, "travail sans"],
  [/\bjob, pas\b/gi, "travail, pas"],
  [/\bjob du\b/gi, "travail du"],
  [/\bjob en\b/gi, "travail en"],
  [/\bjob =\b/gi, "travail ="],
  [/\bjob\b/g, "passage"],
  [/\bjobs\b/gi, "passages"],
  [/\bbatch les\b/gi, "regrouper les"],
  [/\bBatch\b/g, "Série"],
  [/\bbatch\b/gi, "série"],
  [/\bupgrade\b/gi, "montée en gamme"],
  [/\bswap\b/gi, "échange"],
  [/\bswaps\b/gi, "échanges"],
  [/\bmaker\b/gi, "bricoleur"],
  [/\bmakers\b/gi, "bricoleurs"],
  [/\bfixture\b/gi, "gabarit"],
  [/\bfixtures\b/gi, "gabarits"],
  [/\bdrinkware\b/gi, "gobelets et articles cylindriques"],
  [/\boffset\b/gi, "compensation"],
  [/\bnesting\b/gi, "imbrication"],
  [/\btrait de coupe\b/gi, "trait de coupe"],
  [/\bAir assist\b/g, "Soufflage d'air"],
  [/\bair assist\b/gi, "soufflage d'air"],
  [/\bhoneycomb\b/gi, "table alvéolée"],
  [/\binline\b/gi, "en ligne"],
  [/\bduty cycle\b/gi, "cycle de service"],
  [/\bspot\b/gi, "point focal"],
  [/\bscan field\b/gi, "zone de balayage"],
  [/\bwork area\b/gi, "zone de travail"],
  [/\bfield size\b/gi, "taille du champ"],
  [/\bheadline\b/gi, "affiche en gros"],

  // En-têtes tableaux
  [/\| Idéal pour \|/g, "| Convient pour |"],
  [/\| Faible pour \|/g, "| Peu adapté à |"],
  [/\| Mauvais fit \|/g, "| Peu adapté |"],
  [/\| Bon fit \|/g, "| Bon profil |"],
  [/\| Fort pour \|/g, "| Convient pour |"],
  [/\| Faible sur \|/g, "| Peu adapté à |"],
  [/\| Idéal sur \|/g, "| Convient pour |"],
  [/\| Faible \|/g, "| Limite |"],

  // Tournures télégraphiques
  [/\bPas pour\b/g, "Ne convient pas pour"],
  [/\bN'ajoute pas\b/g, "N'ajoute pas"], // keep
  [/\bCritique :\*\*/g, "**Important :**"],
  [/\bRègle :\*\*/g, "**À retenir :**"],
  [/\bHonest take\b/gi, "En pratique"],
  [/\bAvis honnête :\*\*/g, "**En pratique :**"],
  [/\b→ Approfondir :\s*/g, "Pour aller plus loin : "],
  [/\b→ Comparer\b/g, "Comparer"],
  [/\b→ \[Configuration ventilation\]/g, "Voir [Configuration ventilation]"],
  [/\b→ \[Ventilation\]/g, "Voir [Ventilation]"],
  [/\b→ \[Sécurité\]/g, "Voir [Sécurité]"],
  [/\b→ \[Hybrides\]/g, "Voir [Hybrides]"],
  [/\b→ \[Diode\]/g, "Voir [Diode]"],
  [/\b→ \[CO₂\]/g, "Voir [CO₂]"],
  [/\b→ \[Filtres/g, "Voir [Filtres"],
  [/\b→ \[Ouvert/g, "Voir [Ouvert"],
  [/\b→ \[Watts/g, "Voir [Watts"],
  [/\b→ \[Modules/g, "Voir [Modules"],
  [/\b→ \[Gravure/g, "Voir [Gravure"],
  [/\b→ \[Air assist/g, "Voir [Air assist"],
  [/\b→ \[LightBurn/g, "Voir [LightBurn"],
  [/\b→ \[Rotary/g, "Voir [Rotary"],
  [/\b→ \[Métal/g, "Voir [Métal"],
  [/\b→ \[Marquage/g, "Voir [Marquage"],
  [/\b→ \[Portique/g, "Voir [Portique"],
  [/\b→ \[Hybride/g, "Voir [Hybride"],
  [/\b→ \[Guide/g, "Voir [Guide"],
  [/\b→ \[fibre\]/g, "Voir [fibre]"],
  [/\b→ \[Fibre/g, "Voir [Fibre"],
  [/\b→ Comparer les paliers/g, "Comparez les paliers"],
  [/\b→ \[Hybrides\]/g, "Voir [Hybrides]"],

  // Table blurbs variées
  [
    /\*Ce tableau résume l'essentiel\. Les sections suivantes détaillent chaque point avec des exemples concrets\.\*/g,
    "*Résumé des points clés — le détail suit dans les sections ci-dessous.*",
  ],

  // Descriptions frontmatter trop EN
  [/déroulement atelier/gi, "organisation atelier"],
  [/aménagement atelier réel/g, "installation en conditions réelles"],

  // Champs catalogue en français dans tableaux
  [/\| `diode` \|/g, "| Diode |"],
  [/\| `hybrid` \|/g, "| Hybride |"],
  [/\| `fiber` \|/g, "| Fibre |"],
  [/\| `diode`, `fiber`, etc\. \|/g, "| Selon le module (diode, fibre, etc.) |"],
  [/\| Catalogue \|/g, "| Catégorie |"],
  [/\| En boutique \|/g, "| Catégorie |"],

  // Phrases courtes à lier
  [/\. Voir \[/g, ". Consultez aussi ["],
];

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
  let c = fs.readFileSync(path.join(dir, file), "utf8");
  for (const [a, b] of replacements) c = c.replace(a, b);
  fs.writeFileSync(path.join(dir, file), c);
  console.log("refined:", file);
}
