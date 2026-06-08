import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../content/guides/fr");

const introFixes = {
  "laser-safety-basics.md": {
    old: /Les limites matériaux doivent figurer sur toute fiche sérieuse\. Ce guide rappelle ce qui vous protège au quotidien, avant le premier passage sur la machine : lunettes adaptées, extraction correcte, surveillance continue et bons réflexes de base\./,
    new: `Avant le premier travail sur la machine, vérifiez trois choses : des **lunettes** adaptées à votre longueur d'onde, une **extraction** qui évacue vraiment la fumée, et la **surveillance** de chaque découpe. Les limites matériaux doivent figurer sur toute fiche sérieuse ; ce qui suit détaille les réflexes qui tiennent dans la durée.`,
  },
  "laser-ventilation-setup.md": {
    old: /Ce guide s'adresse aux \*\*bricoleurs à domicile et petits ateliers\*\* qui préparent l'installation avant \(ou juste après\) l'arrivée de la machine\. À lire avec \[bases sécurité laser\]/,
    new: `Pour les **bricoleurs à domicile et petits ateliers** qui préparent l'installation avant (ou juste après) l'arrivée de la machine. À lire avec [bases sécurité laser]`,
  },
  "air-assist-honeycomb-setup.md": {
    old: /Ce guide explique \*\*quand\*\* ces accessoires valent vraiment leur prix/,
    new: `Voici **quand** ces accessoires valent vraiment leur prix`,
  },
  "rotary-laser-engraving.md": {
    old: /Ce guide détaille \*\*rouleaux vs mandrin\*\*/,
    new: `On détaille ici **rouleaux vs mandrin**`,
  },
  "infrared-laser-modules-explained.md": {
    old: /Ce guide décrit ce que l'IR basse puissance marque vraiment/,
    new: `La suite décrit ce que l'IR basse puissance marque vraiment`,
  },
  "swappable-laser-modules-explained.md": {
    old: /Ce guide compare \*\*ce qui change physiquement\*\* quand vous achetez ou upgradez/,
    new: `On compare ici **ce qui change physiquement** quand vous achetez ou montez en gamme`,
  },
  "mopa-fiber-lasers-explained.md": {
    old: /Ce guide traite la logique procédé/,
    new: `La logique procédé se comprend ici`,
  },
  "diode-lasers-explained.md": {
    old: /Ce guide detaille ce que la diode fait bien/,
    new: `La suite détaille ce que la diode fait bien`,
  },
};

const global = [
  [/\bn'upgradez pas\b/gi, "ne montez pas en gamme par"],
  [/\| peu adapté \|/g, "| Peu adapté à |"],
  [/\bun bonne installation\b/g, "une bonne installation"],
  [/\bavec un bonne installation\b/g, "avec une bonne installation"],
];

for (const [file, fix] of Object.entries(introFixes)) {
  const p = path.join(dir, file);
  let c = fs.readFileSync(p, "utf8");
  c = c.replace(fix.old, fix.new);
  fs.writeFileSync(p, c);
}

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
  let c = fs.readFileSync(path.join(dir, file), "utf8");
  for (const [a, b] of global) c = c.replace(a, b);
  fs.writeFileSync(path.join(dir, file), c);
}
console.log("intros fixed");
