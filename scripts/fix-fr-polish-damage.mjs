import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../content/guides/fr");

const fixes = [
  [/category: installation/g, "category: setup"],
  [/laser-ventilation-installation/g, "laser-ventilation-setup"],
  [/air-assist-honeycomb-installation/g, "air-assist-honeycomb-setup"],
  [/composés organiques volatils \(composés organiques volatils \(COV\)\)/g, "composés organiques volatils (COV)"],
  [/Déroulement atelier atelier/g, "Déroulement atelier"],
  [/installation atelier réelle/g, "aménagement atelier réel"],
  [/offset trait de coupe/g, "compensation de trait de coupe (kerf)"],
  [/vaporisant un trait de coupe/g, "vaporisant le matériau le long de la coupe"],
  [/## Déroulement atelier production typiques/g, "## Déroulements de production typiques"],
  [/Déroulement atelier LightBurn/g, "Réglage pas à pas dans LightBurn"],
  [/Déroulement atelier hybride/g, "Organisation atelier hybride"],
  [/Déroulement atelier typique sur xTool S1/g, "Exemple pas à pas sur une enceinte diode à têtes interchangeables"],
  [/Déroulement atelier Etsy/g, "Usage courant en boutique Etsy"],
  [/Déroulement atelier qui survit/g, "Organisation qui tient sur la durée"],
  [/Déroulement atelier de swap/g, "Ce que change un swap physique"],
  [/Déroulement atelier typique du premier mois/g, "Premier mois en atelier"],
  [/Déroulement atelier typique après installation UV/g, "Premières semaines avec un laser UV"],
  [/Déroulement atelier typique du premier mois hybride/g, "Premier mois avec un hybride"],
  [/Déroulement atelier atelier réel/g, "Premières semaines en atelier réel"],
  [/Déroulement atelier atelier/g, "Organisation atelier"],
  [/\| Air assist \|/g, "| Soufflage d'air |"],
  [/assist nettoie le trait de coupe/g, "le soufflage nettoie le trait de coupe"],
  [/trait de coupe plus propre/g, "coupe plus nette (trait de coupe plus propre)"],
];

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
  let c = fs.readFileSync(path.join(dir, file), "utf8");
  for (const [a, b] of fixes) c = c.replace(a, b);
  fs.writeFileSync(path.join(dir, file), c);
  console.log("fixed:", file);
}
