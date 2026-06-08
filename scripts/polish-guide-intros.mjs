/**
 * Strip meta openings ("This guide explains", Maker Atlas taxonomy in intros)
 * and fix common body phrases. Run: node scripts/polish-guide-intros.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const guidesDir = path.join(__dirname, "../content/guides");

const bodyReplacements = [
  // EN body
  [/In Maker Atlas, always check \*\*work area \(mm\)\*\* on each profile before comparing price\./g,
    "Before you compare prices, check **work area (mm)** on each listing. A cheap machine you cannot fit your parts on is not a deal."],
  [/In Maker Atlas, MOPA machines remain type \*\*`fiber`\*\*\. Buying MOPA is not buying a new laser category; it is buying \*\*pulse control\*\* on top of 1064 nm metal marking\./g,
    "MOPA is still a **fiber laser** in shops and ads: same ~1064 nm wavelength. You are paying for **pulse control** on top of standard metal marking, not a new laser family."],
  [/Compare \*\*cut examples\*\* in Maker Atlas profiles rather than assuming watts translate 1:1 across brands\./g,
    "Compare **cut examples** on the same material thickness across brands rather than assuming watts translate 1:1."],
  [/Compare \*\*work area mm\*\* in Maker Atlas before assuming S1 beats an open 400 mm machine for your SKU sizes\./g,
    "Compare **work area mm** on each listing before assuming an enclosed S1 beats an open 400 mm machine for your part sizes."],
  [/Maker Atlas tags these as \*\*`infrared`\*\* module options\*\*, not `fiber` galvo machines\. This guide prevents the expensive mistake of buying an IR head expecting ComMarker-grade metal production\./g,
    "These are **low-power IR accessories** on diode platforms, not fiber galvo workstations. The expensive mistake: buying a 2W IR head expecting ComMarker-grade stainless throughput."],
  [/Maker Atlas separates catalog types \(`diode`, `fiber`, `hybrid`, `uv`\) so comparisons stay honest\. This guide maps \*\*vendor language\*\* to those types\./g,
    "Ads blur four different engineering patterns. The table below maps **vendor language** to what actually changes: wavelength, swap mechanics, and what you can mark."],
  [/Manufacturers use \*\*module\*\*, \*\*head\*\*, \*\*hybrid\*\*, and \*\*Ultra\*\* interchangeably in ads\. They mean different engineering, and different catalog types on Maker Atlas\./g,
    "Manufacturers throw around **module**, **head**, **hybrid**, and **Ultra** in the same sentence. They are not the same engineering — confusing them wastes money and bench space."],
  [/Every Maker Atlas machine profile includes material limits\. This guide covers what keeps you safe regardless of brand\./g,
    "Material limits belong on every serious spec sheet. Below: what keeps you safe regardless of brand."],
  [/\| Catalog type \| `fiber` \(MOPA noted in name or features\) \|/g,
    "| Market label | Sold as fiber laser; MOPA in name or specs |"],
  [/\| Catalog note \| MOPA machines listed under `fiber` type \|/g,
    "| Market label | Sold as fiber; MOPA called out in name or specs |"],
  [/## MOPA: same catalog type, different pulse engine/g,
    "## MOPA: same wavelength, different pulse engine"],
  [/This guide explains \*\*pulse control and color process\*\*\. When a listing shows a low entry price, check the \*\*machine profile\*\* for whether MOPA is built in or listed as a separate module\. That detail changes every quarter by brand\./g,
    "Pulse control and color process live here. Whether MOPA ships in the box or as a separate module is a **listing detail** — check before you compare prices."],
  [/This guide gives you a practical method to read an ad, a Maker Atlas profile, or a YouTube cut test without confusing marketing with real capacity\. It covers diode traps, CO₂ tube honesty, fiber\/galvo speed bait, and buyer scenarios\./g,
    "Below: a practical method to read an ad, a spec sheet, or a YouTube cut test without confusing marketing with real capacity — diode traps, CO₂ tube honesty, fiber/galvo speed bait, and buyer scenarios."],
  [/\*\*MOPA variants\*\* share the same 1064 nm wavelength and catalog type \(`fiber`\) but add adjustable pulses/g,
    "**MOPA variants** share the same 1064 nm wavelength as standard fiber but add adjustable pulses"],
  [/are canonical examples in Maker Atlas\./g, "are common fixed-hybrid examples."],
  [/\| \*\*Catalog type\*\* \| `hybrid` \| `diode`, `fiber`, `uv` per active module \|/g,
    "| **What changes** | Two sources, firmware switch | One module at a time; swap changes source type |"],
  [/A true hybrid desktop laser contains \*\*two complete source chains\*\* aimed into a shared optical path or alternate paths selected by firmware\. \*\*xTool F1 Ultra \/ F2 Ultra\*\* and \*\*LaserPecker LP5\*\* are canonical examples in Maker Atlas\./g,
    "A true hybrid desktop laser contains **two complete source chains** aimed into a shared optical path or alternate paths selected by firmware. **xTool F1 Ultra / F2 Ultra** and **LaserPecker LP5** are the usual references."],

  // FR body
  [/Sur Maker Atlas, vérifiez toujours \*\*zone de travail \(mm\)\*\* avant de comparer les prix\./g,
    "Avant de comparer les prix, vérifiez la **zone de travail (mm)** sur chaque annonce. Une machine pas chère où vos pièces ne rentrent pas n'est pas une bonne affaire."],
  [/Dans Maker Atlas, les machines MOPA restent type \*\*`fiber`\*\*\. Acheter MOPA n'est pas acheter une nouvelle catégorie laser ; c'est acheter le \*\*contrôle d'impulsion\*\* en plus du marquage métal 1064 nm\./g,
    "Le MOPA reste un **laser fibre** dans les boutiques et annonces : même longueur d'onde ~1064 nm. Vous payez le **contrôle d'impulsion** en plus du marquage métal standard, pas une nouvelle famille laser."],
  [/Comparez les \*\*exemples de découpe\*\* dans les profils Maker Atlas plutôt que d'assumer que les watts se traduisent 1:1 entre marques\./g,
    "Comparez les **exemples de découpe** sur la même épaisseur entre marques plutôt que d'assumer que les watts se traduisent 1:1."],
  [/Les fiches Maker Atlas signalent le marketing « puissance combinée » quand on le voit\./g,
    "Les bonnes fiches techniques signalent le marketing « puissance combinée » quand il apparaît."],
  [/Chaque fiche Maker Atlas indique les limites matériaux\. Ce guide couvre ce qui vous protège, quelle que soit la marque\./g,
    "Les limites matériaux doivent figurer sur toute fiche sérieuse. Ci-dessous : ce qui vous protège, quelle que soit la marque."],
  [/\| Type catalogue \| `fiber` \(MOPA dans le nom ou les specs\) \|/g,
    "| Libellé marché | Vendu comme laser fibre ; MOPA dans le nom ou specs |"],
  [/\| Note catalogue \| Machines MOPA classées sous type `fiber` \|/g,
    "| Libellé marché | Vendu comme fibre ; MOPA indiqué dans le nom ou specs |"],
  [/## MOPA : même type catalogue, autre moteur d'impulsion/g,
    "## MOPA : même longueur d'onde, autre moteur d'impulsion"],
  [/Ce guide explique \*\*impulsions et procédé couleur\*\*\. Si une annonce affiche un prix d'entrée bas, vérifiez sur la \*\*fiche machine\*\* si le MOPA est inclus ou listé comme module à part\. Ça change selon les marques et les trimestres\./g,
    "Impulsions et procédé couleur : ici. MOPA inclus ou module à part : **détail d'annonce** — à vérifier avant de comparer les prix."],
  [/Ce guide donne une méthode pratique pour lire une annonce, une fiche Maker Atlas ou une vidéo YouTube sans confondre marketing et capacité réelle\. Diode, CO₂, fibre, vitesses galvo : tout est là\./g,
    "Ci-dessous : une méthode pratique pour lire une annonce, une fiche technique ou une vidéo YouTube sans confondre marketing et capacité réelle — pièges diode, honnêteté tube CO₂, vitesses galvo, scénarios acheteur."],
  [/Les variantes \*\*MOPA\*\* partagent la longueur d'onde 1064 nm et le type catalogue `fibre`, avec des impulsions réglables/g,
    "Les variantes **MOPA** partagent la longueur d'onde 1064 nm avec la fibre standard, avec des impulsions réglables"],
  [/sont des exemples canoniques dans Maker Atlas\./g, "sont les références hybrides fixes habituelles."],
  [/\| \*\*Type catalogue\*\* \| `hybrid` \| `diode`, `fiber`, `uv` par module actif \|/g,
    "| **Ce qui change** | Deux sources, bascule logiciel | Un module à la fois ; le swap change le type de source |"],
  [/Les fabricants mélangent \*\*module\*\*, \*\*tête\*\*, \*\*hybride\*\* et \*\*Ultra\*\* dans les annonces\. Ce n'est pas la même ingénierie, ni le même type au catalogue Maker Atlas\./g,
    "Les fabricants mélangent **module**, **tête**, **hybride** et **Ultra** dans les mêmes annonces. Ce n'est pas la même ingénierie — confondre les schémas gaspille budget et place atelier."],
  [/Maker Atlas sépare les types \(`diode`, `fiber`, `hybrid`, `uv`\) pour des comparaisons honnêtes\. Ce guide traduit le \*\*langage constructeur\*\* vers ces types\./g,
    "Les annonces mélangent quatre schémas d'ingénierie différents. Le tableau ci-dessous traduit le **langage constructeur** vers ce qui change vraiment : longueur d'onde, mécanique de swap, matériaux possibles."],
  [/## Utiliser la matrice avec Maker Atlas/g, "## Utiliser la matrice pour comparer des machines"],
  [/Utiliser la matrice avec Maker Atlas/g, "Utiliser la matrice pour comparer des machines"],
  [/## Using this matrix with Maker Atlas profiles/g, "## Using this matrix when comparing machines"],
  [/## Maker Atlas profiles: what we flag/g, "## What to verify on any listing"],
  [/\| Ignoring catalog type on Maker Atlas \|/g, "| Comparing unlike machine types |"],
  [/Maker Atlas profiles flag combined-power marketing where we see it\./g,
    "Good spec sheets flag combined-power marketing when it appears."],
  [/Maker Atlas lists editorial accessory notes; verify stock with vendors separately\./g,
    "Verify rotary compatibility with your exact SKU and vendor before bulk blank orders."],
  [/\*\*Maker Atlas\*\* note les accessoires éditorialement ; confirmez compatibilité SKU avec le vendeur avant commande bulk blanks\./g,
    "Vérifiez la compatibilité rotary avec votre SKU exact et le vendeur avant commande de blanks en volume."],
  [/LightBurn is the default upgrade for many \*\*GRBL\*\*, \*\*Smoothieware\*\*, and \*\*Ruida\*\* controllers\. Maker Atlas `software` fields note LightBurn compatibility per profile\./g,
    "LightBurn is the default upgrade for many **GRBL**, **Smoothieware**, and **Ruida** controllers. Check LightBurn compatibility on the spec sheet before you buy a license."],
  [/Upgrade par défaut pour beaucoup de contrôleurs \*\*GRBL\*\*, \*\*Smoothieware\*\*, \*\*Ruida\*\*\. Champ `software` sur Maker Atlas\./g,
    "Upgrade par défaut pour beaucoup de contrôleurs **GRBL**, **Smoothieware**, **Ruida**. Vérifiez la compatibilité LightBurn sur la fiche avant d'acheter une licence."],
  [/Profiles like \*\*Comgrow Z1\*\*, \*\*Ortur H20\*\*, and \*\*Atomstack A5 Pro\*\* call this out on Maker Atlas:/g,
    "Listings like **Comgrow Z1**, **Ortur H20**, and **Atomstack A5 Pro** often show this trap:"],
  [/Les fiches \*\*Comgrow Z1\*\*, \*\*Ortur H20\*\*, \*\*Atomstack A5 Pro\*\* signalent ce piège sur Maker Atlas :/g,
    "Les annonces **Comgrow Z1**, **Ortur H20**, **Atomstack A5 Pro** illustrent souvent ce piège :"],
  [/On Maker Atlas, compare \*\*cutExample\*\* fields on the same thickness/g,
    "Compare **cut examples** on the same thickness across listings"],
  [/Sur Maker Atlas, comparer \*\*cutExample\*\* sur même épaisseur/g,
    "Comparer les **exemples de découpe** sur la même épaisseur entre annonces"],
  [/Compare \*\*cutExample\*\* Maker Atlas plutôt que l'autocollant\./g,
    "Comparez les **exemples de découpe** sur la même épaisseur plutôt que l'autocollant."],
  [/Vérifier \*\*zone mm\*\* Maker Atlas avant de supposer qu'une S1 bat un portique 400 mm\./g,
    "Vérifier la **zone mm** sur chaque annonce avant de supposer qu'une S1 bat un portique 400 mm."],
  [/Fiber is listed for comparison\. This guide focuses on the first three rows\./g,
    "Fiber is listed for comparison. The focus below is on paths without a fiber station."],
  [/La fibre est listée pour comparaison\. Ce guide se concentre sur les trois premières lignes\./g,
    "La fibre est listée pour comparaison. Le focus ci-dessous : les chemins sans station fibre."],
  [/Maker Atlas classe ces têtes comme accessoire \*\*`infrared`\*\*, pas comme laser `fiber`\. Ce guide évite l'erreur la plus coûteuse :/g,
    "Ces têtes sont des **accessoires IR basse puissance**, pas des lasers fibre galvo. L'erreur la plus coûteuse :"],
  [/\| Type catalogue \| `diode` \+ option \| `fiber` \|/g, "| Catégorie en boutique | Diode + accessoire IR | Laser fibre |"],
  [/\| Catalogue \| `diode` \+ IR \| `fiber` \|/g, "| Catégorie en boutique | Diode + IR | Fibre |"],
  [/\| \*\*Catalog type\*\* \| `diode` \+ IR accessory \| `fiber` \|/g, "| **Market category** | Diode + IR accessory | Fiber laser |"],
  [/Le type catalogue reste \*\*`diode`\*\*\./g, "Une seule source active à la fois — toujours du terrain **diode**."],
  [/They also create \*\*catalog confusion\*\* with modular platforms \(S1, Falcon T1\) that use the word "module" differently\. This guide separates fixed hybrids from swappable modules\./g,
    "Marketing also blurs them with modular platforms (S1, Falcon T1) that use \"module\" differently — see [swappable modules](/guides/swappable-laser-modules-explained)."],
  [/Ils créent aussi une \*\*confusion catalogue\*\* avec les plateformes modulaires \(S1, Falcon T1\) qui utilisent le mot « module » différemment\. Ce guide sépare hybrides fixes et modules interchangeables\./g,
    "Le marketing les confond aussi avec les plateformes modulaires (S1, Falcon T1) — voir [modules interchangeables](/guides/swappable-laser-modules-explained)."],
  [/Les variantes \*\*MOPA\*\* partagent la longueur d'onde 1064 nm et le type catalogue `fibre`, avec des impulsions réglables/g,
    "Les variantes **MOPA** partagent la longueur d'onde 1064 nm avec la fibre standard, avec des impulsions réglables"],
  [/- \*\*Station intégrée :\*\* source MOPA dans un boîtier galvo complet \(fiche catalogue `fiber` typique\)\./g,
    "- **Station intégrée :** source MOPA dans un boîtier galvo complet (vendu comme laser fibre)."],
  [/You stay in \*\*`diode`\*\* catalog land unless you add the \*\*IR module\*\* \(still not `fiber`\)\./g,
    "You stay on **diode** wavelength unless you add the **IR module** (still not a fiber galvo)."],
  [/Vous restez en terrain \*\*`diode`\*\* sauf ajout \*\*module IR\*\* \(toujours pas `fiber`\)\./g,
    "Vous restez en **diode** sauf ajout **module IR** (toujours pas une fibre galvo)."],
  [/- \*\*Catalog type\*\* \(`diode`, `co2`, `fiber`\) so you do not compare unlike machines/g,
    "- **Laser type** (diode, CO₂, fiber) so you do not compare unlike machines"],
];

const introReplacements = {
  "mopa-fiber-lasers-explained.md": {
    en: `**MOPA** (Master Oscillator Power Amplifier) is a **fiber laser variant** with adjustable pulse width and frequency. Same ~1064 nm beam as standard fiber, but you control **how long and how often** each pulse hits the metal. That is what unlocks color on stainless and tighter branding recipes.

It is not a separate laser family beside CO₂ or diode. If fiber is new to you, read [fiber lasers explained](/guides/fiber-lasers-explained) first. Below: pulse control, color workflows, and when the MOPA premium pays back.`,
    fr: `Le **MOPA** (Master Oscillator Power Amplifier) est une **variante de laser fibre** à impulsions réglables (largeur et fréquence). Même faisceau ~1064 nm que la fibre standard, mais vous contrôlez **durée et fréquence** de chaque impulsion sur le métal. C'est ce qui débloque la couleur sur inox et des recettes de marque plus fines.

Ce n'est pas une famille à côté du CO₂ ou de la diode. Si la fibre vous est nouvelle, lisez [fibre expliquée](/guides/fiber-lasers-explained) d'abord. Ci-dessous : contrôle d'impulsions, workflows couleur, et quand le premium MOPA se rentabilise.`,
  },
  "fiber-lasers-explained.md": {
    en: `Fiber lasers are the **right tool when bare metal is your daily material**. They deliver a **~1,064 nm infrared** beam that couples efficiently into stainless steel, aluminum, brass, copper, and many industrial coatings without marking spray.

They are also the category most confused with **IR modules on diode machines**, **MOPA marketing**, and **hybrid boxes** that also run a blue diode for wood. Do not let ads blur those lines. For the full map across technologies, see [understanding laser types](/guides/understanding-laser-types). Below: fiber only — physics, galvo fields, and buyer traps.`,
    fr: `Les lasers **fibre** sont l'outil adapté quand le **métal nu** est votre matière quotidienne. Ils délivrent un faisceau **infrarouge ~1 064 nm** qui se couple efficacement à l'inox, l'aluminium, le laiton, le cuivre et beaucoup de revêtements industriels, sans spray de marquage obligatoire.

C'est aussi la catégorie la plus confondue avec les **modules IR sur machines diode**, le **marketing MOPA** et les **boîtiers hybrides** qui font aussi tourner une diode bleue pour le bois. Ne laissez pas les annonces tout mélanger. Pour la carte complète : [comprendre les types de laser](/guides/understanding-laser-types). Ci-dessous : la fibre seule — physique, champs galvo, pièges acheteur.`,
  },
  "diode-lasers-explained.md": {
    en: `Diode lasers are the **default first laser** for most hobby makers. They are affordable, compact, and excellent on wood and leather. They are also the category with the **worst marketing**: inflated watt numbers, metal engraving demos with hidden spray, and photos that hide how much smoke a cut produces.

For how diode fits next to CO₂, fiber, and UV, see [understanding laser types](/guides/understanding-laser-types). Everything below is **blue-light diode** only — real watts, real materials, real limits.`,
    fr: `Les lasers **diode** sont le **premier laser** de la majorité des makers. Compacts, abordables, excellents sur bois et cuir. C'est aussi la catégorie au **marketing le plus trompeur** : watts gonflés, démos métal avec spray caché, photos qui minimisent la fumée réelle d'une découpe.

Pour placer la diode face au CO₂, la fibre et l'UV : [comprendre les types de laser](/guides/understanding-laser-types). Tout ce qui suit concerne uniquement la **diode bleue** — watts réels, matériaux réels, limites réelles.`,
  },
  "co2-lasers-explained.md": {
    en: `CO₂ lasers are the **workhorse of sign making and acrylic products**. If your projects include clear acrylic, thick wood cuts, rubber stamps, or batch leather work, this is usually the right technology, not a higher-watt diode with better marketing photos.

Hidden costs show up fast: tube life, exhaust, alignment, cracked acrylic from wrong settings. Budget beyond the sticker price before you commit. For comparing laser families, see [understanding laser types](/guides/understanding-laser-types).`,
    fr: `Les lasers **CO₂** sont le **cheval de bataille** de la signalétique et des produits acrylique. Si vos projets incluent acrylique transparent, bois épais, tampons caoutchouc ou cuir en série, c'est en général la bonne technologie — pas une diode plus wattée avec de meilleures photos marketing.

Les coûts cachés arrivent vite : durée de vie du tube, extraction, alignement, acrylique fissuré par de mauvais réglages. Budgétez au-delà du prix affiché avant de vous engager. Pour comparer les familles laser : [comprendre les types de laser](/guides/understanding-laser-types).`,
  },
  "galvo-laser-workstations-explained.md": {
    en: `**Galvo** lasers steer the beam with motorized mirrors instead of moving the head on rails. Almost every desktop **fiber, UV, and hybrid** machine works this way, plus modular bases like the **Creality Falcon T1**.

If you come from gantry diode or CO₂, the biggest shock is not power. It is **usable field size**. Below: galvo physics, real workflows, modular platforms, and how to read the speed numbers vendors quote. For the full laser-type map, see [understanding laser types](/guides/understanding-laser-types).`,
    fr: `Les lasers **galvo** dirigent le faisceau avec des miroirs motorisés au lieu de déplacer la tête sur des rails. Presque toute machine bureau **fibre, UV et hybride** fonctionne ainsi, ainsi que des bases modulaires comme la **Creality Falcon T1**.

Si vous venez d'un diode ou CO₂ portique, le choc principal n'est pas la puissance : c'est la **taille du champ utile**. Ci-dessous : physique galvo, workflows réels, plateformes modulaires, et comment lire les vitesses que les constructeurs citent. Pour la carte des types : [comprendre les types de laser](/guides/understanding-laser-types).`,
  },
  "hybrid-lasers-explained.md": {
    en: `Hybrid machines pack **two laser technologies** in one chassis, typically **fiber at ~1064 nm for metal** and **diode at ~450 nm for wood and organics**. You switch modes in software. The beams do not combine into one super-wavelength.

Mixed-material shops hate owning two desks, two apps, and two exhaust paths — hybrids trade that for one compact galvo field and marketing that blurs into "modular" machines that work completely differently. See [understanding laser types](/guides/understanding-laser-types) for the technology map. Below: **true hybrids** (two sources, firmware switch) vs [swappable modules](/guides/swappable-laser-modules-explained).`,
    fr: `Les machines **hybrides** embarquent **deux technologies laser** dans un châssis, en général **fibre ~1064 nm pour le métal** et **diode ~450 nm pour bois et organiques**. Vous basculez en logiciel. Les faisceaux ne fusionnent pas en une super-longueur d'onde.

Les ateliers multi-matériaux détestent posséder deux bureaux, deux apps et deux extractions — l'hybride échange ça contre un champ galvo compact et un marketing qui se confond avec des machines « modulaires » au fonctionnement différent. Carte des technologies : [comprendre les types de laser](/guides/understanding-laser-types). Ci-dessous : **vrais hybrides** (deux sources, bascule firmware) vs [modules interchangeables](/guides/swappable-laser-modules-explained).`,
  },
  "swappable-laser-modules-explained.md": {
    en: `**xTool S1**, **Falcon T1**, **F1 Ultra**, **D1 Pro**, watt-tier SKUs like Comgrow Z1: each pattern changes what you can mark, what you swap, and what you pay over time. Wrong pattern choice wastes money and shelf space.

For wavelength and material physics, see [understanding laser types](/guides/understanding-laser-types). Below: **what physically changes** when you buy or upgrade — not catalog labels.`,
    fr: `**xTool S1**, **Falcon T1**, **F1 Ultra**, **D1 Pro**, SKU par paliers de watts (Comgrow Z1, etc.) : chaque schéma change ce que vous marquez, ce que vous échangez, et ce que vous payez dans le temps. Le mauvais choix gaspille budget et place atelier.

Pour la physique des longueurs d'onde : [types de laser](/guides/understanding-laser-types). Ci-dessous : **ce qui change physiquement** à l'achat ou à l'upgrade — pas des étiquettes de catalogue.`,
  },
  "infrared-laser-modules-explained.md": {
    en: `Some **diode platforms** sell an optional **1064 nm infrared module**, often around **2W**. Same wavelength as fiber lasers, completely different machine: low power, different optics, different production ceiling.

Buyers who expect ComMarker-grade stainless throughput from a 2W IR head get disappointed fast. For the full technology map, see [understanding laser types](/guides/understanding-laser-types). Below: **low-power IR accessories** on diode ecosystems only.`,
    fr: `Certaines **plateformes diode** proposent un **module infrarouge 1064 nm** optionnel, souvent autour de **2W**. Même longueur d'onde que la fibre, machine complètement différente : faible puissance, autres optiques, autre plafond de production.

Les acheteurs qui attendent un débit inox type ComMarker avec une tête IR 2W se déçoivent vite. Carte des technologies : [comprendre les types de laser](/guides/understanding-laser-types). Ci-dessous : **accessoires IR basse puissance** sur écosystèmes diode uniquement.`,
  },
  "uv-lasers-explained.md": {
    en: `UV lasers (~355 nm) occupy a **narrow but valuable niche**: marking materials that diode or fiber lasers **burn, melt, or discolor**. They cost more, require disciplined safety (invisible beam), and solve problems most first-time buyers do not have yet.

Read [understanding laser types](/guides/understanding-laser-types) for the four-type overview. Commit to UV only when your **material list** already includes technical plastics, fine glass, or electronics marking.`,
    fr: `Les lasers **UV** (~355 nm) occupent une **niche étroite mais précieuse** : marquer des matériaux que diode ou fibre **brûlent, fondent ou décolorent**. Plus chers, sécurité stricte (faisceau invisible), et des problèmes que la plupart des premiers acheteurs n'ont pas encore.

Lisez [comprendre les types de laser](/guides/understanding-laser-types) pour la vue d'ensemble. Choisissez l'UV seulement si votre **liste matériaux** inclut déjà plastiques techniques, verre fin ou marquage électronique.`,
  },
  "metal-marking-without-fiber.md": {
    en: `"I want to engrave stainless" sells diodes **and** fiber lasers, sometimes to the same person in one week. Plenty of metal projects **do not need** a $2,000 fiber station — but spray and anodize workflows still fail client durability promises if you pick the wrong path.

Four realistic routes below: physics, shop workflows, when to upgrade, and mistakes that turn into refund calls. Baseline fiber context: [fiber lasers explained](/guides/fiber-lasers-explained). Diode basics: [diode lasers explained](/guides/diode-lasers-explained).`,
    fr: `« Je veux graver de l'inox » vend des diodes **et** des fibres, parfois à la même personne la même semaine. Beaucoup de projets métal **n'ont pas besoin** d'une station fibre à 2 000 $ — mais spray et anodisation échouent quand même sur la durabilité client si vous choisissez le mauvais chemin.

Quatre routes réalistes ci-dessous : physique, workflows atelier, moment d'upgrade, erreurs qui mènent aux remboursements. Contexte fibre : [fibre expliquée](/guides/fiber-lasers-explained). Bases diode : [diode expliquée](/guides/diode-lasers-explained).`,
  },
  "understanding-laser-types.md": {
    en: `Choosing a laser engraver starts with one decision most buyers get wrong: **which type of laser you actually need**.

Manufacturers love big watt numbers and vague claims. Below: how each technology couples into materials, who each one is for, and the marketing traps that send buyers to the wrong checkout.`,
    fr: `Choisir une graveuse laser commence par une décision que beaucoup d'acheteurs ratent : **quel type de laser vous avez vraiment besoin**.

Les fabricants adorent les gros chiffres de watts et les promesses vagues. Ci-dessous : comment chaque technologie agit sur les matériaux, pour qui, et les pièges marketing qui envoient vers le mauvais panier.`,
  },
  "laser-wattage-marketing-explained.md": {
    en: `On marketplaces, the biggest number is usually **the least trustworthy**. In diode listings, "40W" might mean **optical output**, **combined electrical chip rating**, or a **module name** that looks good in a banner.

Below: how to read an ad, a spec sheet, or a YouTube cut test without confusing marketing with real capacity — diode traps, CO₂ tube honesty, fiber/galvo speed bait, and buyer scenarios. Pair with [diode lasers explained](/guides/diode-lasers-explained) for material limits watts cannot fix.`,
    fr: `Sur les marketplaces, le plus gros chiffre est souvent **le moins fiable**. Sur une annonce diode, « 40W » peut signifier **puissance optique**, **somme électrique des puces**, ou un **nom de module** qui vend bien en bannière.

Ci-dessous : lire une annonce, une fiche technique ou une vidéo YouTube sans confondre marketing et capacité réelle — pièges diode, honnêteté tube CO₂, vitesses galvo, scénarios acheteur. À lire avec [diode expliquée](/guides/diode-lasers-explained) pour les limites matériaux que les watts ne corrigent pas.`,
  },
  "laser-materials-by-type.md": {
    en: `Use this table before buying a machine for a **specific material**. Wattage alone does not override wavelength physics. A 40W diode still cannot cut clear acrylic honestly. A 55W CO₂ still cannot mark bare stainless like fiber.

The matrix below is a **quick honest reference** plus longer explanations of **why** each symbol applies, typical workflows, and buyer mistakes. Deep dives per technology: [diode](/guides/diode-lasers-explained) · [CO₂](/guides/co2-lasers-explained) · [fiber](/guides/fiber-lasers-explained) · [UV](/guides/uv-lasers-explained) · [hybrid](/guides/hybrid-lasers-explained)`,
    fr: `Utilisez ce tableau avant d'acheter pour un **matériau précis**. Les watts seuls ne battent pas la physique des longueurs d'onde. Une diode 40W ne découpe pas honnêtement l'acrylique transparent. Un CO₂ 55W ne marque pas l'inox nu comme une fibre.

La matrice ci-dessous est une **référence rapide honnête** plus des explications **pourquoi** chaque symbole s'applique, workflows typiques et erreurs acheteur. Guides par technologie : [diode](/guides/diode-lasers-explained) · [CO₂](/guides/co2-lasers-explained) · [fibre](/guides/fiber-lasers-explained) · [UV](/guides/uv-lasers-explained) · [hybride](/guides/hybrid-lasers-explained)`,
  },
  "co2-laser-tubes-explained.md": {
    en: `Desktop CO₂ machines use one of two tube families. The tube drives **lifespan, replacement cost, and pulse behavior**, not just the watt number on the sticker.

Start with [CO₂ lasers explained](/guides/co2-lasers-explained) for materials, exhaust, and workflows. This page is for comparing K40-class glass to premium RF integrators, planning tube replacement budgets, and avoiding early tube death.`,
    fr: `Les CO₂ bureau utilisent l'une de deux familles de tubes. Le tube détermine **durée de vie, coût de remplacement et comportement d'impulsion**, pas seulement le watt sur l'autocollant.

Commencez par [CO₂ expliqué](/guides/co2-lasers-explained) pour matériaux, extraction et workflows. Cette page sert à comparer K40 verre vs intégrateurs RF premium, budgéter les remplacements et éviter la mort prématurée du tube.`,
  },
  "laser-safety-basics.md": {
    en: `Lasers can **permanently damage your eyes** and **start fires**. This is not fear-messaging: it is physics.

Material limits belong on every serious spec sheet. Below: what keeps you safe regardless of brand.`,
    fr: `Les lasers peuvent **endommager vos yeux de façon permanente** et **déclencher des incendies**. Ce n'est pas de la peur : c'est la physique.

Les limites matériaux doivent figurer sur toute fiche sérieuse. Ci-dessous : ce qui vous protège, quelle que soit la marque.`,
  },
  "laser-ventilation-setup.md": {
    en: `Ventilation is not an accessory. It is what keeps **odor, particulates, and fire risk** inside a range your room and lungs can tolerate.

Written for **home makers and small shops** setting up before or right after the machine arrives. Pairs with [laser safety basics](/guides/laser-safety-basics) (eyes, fire, supervision).`,
    fr: `La ventilation n'est pas un accessoire. C'est ce qui garde **odeurs, particules et risque incendie** dans une plage tolérable pour la pièce et vos poumons.

Pour les **makers à domicile et petits ateliers** qui préparent l'installation avant (ou juste après) l'arrivée de la machine. À lire avec [bases sécurité laser](/guides/laser-safety-basics) (yeux, incendie, supervision).`,
  },
  "laser-exhaust-filters-explained.md": {
    en: `Outdoor ducting is the gold standard when you can run it. Filter cartridges exist for apartments, HOAs, and winters when punching a wall hole is not an option.

This page compares **outdoor exhaust** and **filter cartridges** with honest rules for apartments, garages, and small shops. Start with [ventilation setup](/guides/laser-ventilation-setup) if you have not sized airflow yet.`,
    fr: `L'évacuation extérieure reste la référence quand c'est possible. Les cartouches filtrantes existent pour appartements, copropriétés et hivers où percer un mur n'est pas une option.

Cette page compare **évacuation extérieure** et **cartouches** avec des règles honnêtes pour appartements, garages et petits ateliers. Commencez par [ventilation](/guides/laser-ventilation-setup) si vous n'avez pas encore dimensionné le débit.`,
  },
  "air-assist-honeycomb-setup.md": {
    en: `Air assist and honeycomb beds show up in every diode accessory bundle. Sometimes they transform cut quality. Sometimes they are shelf weight.

When they earn their cost, how to size pumps on budget diodes, honeycomb ergonomics, and why they never replace ventilation or the correct laser type.`,
    fr: `Assist air et plateaux honeycomb apparaissent dans chaque pack accessoires diode. Parfois ils transforment la qualité de découpe. Parfois ils prennent la poussière sur l'étagère.

Quand ils valent leur prix, dimensionner une pompe sur diode budget, ergonomie honeycomb, et pourquoi ils ne remplacent ni ventilation ni le bon type de laser.`,
  },
  "lightburn-vs-maker-software.md": {
    en: `Vendor apps get you cutting on day one. **LightBurn** is what most serious shops graduate to for layout, layers, and camera workflows — if your controller supports it.

What you gain by paying, what you lose staying vendor-only forever, and how to avoid buying a license for a machine LightBurn does not drive well.`,
    fr: `Les apps constructeur font démarrer le jour J. **LightBurn** est ce vers quoi la plupart des ateliers sérieux évoluent pour mise en page, calques et workflows caméra — si le contrôleur le permet.

Ce que vous gagnez en payant, ce que vous perdez en restant 100 % constructeur, et comment éviter d'acheter une licence pour une machine mal supportée.`,
  },
  "rotary-laser-engraving.md": {
    en: `Drinkware and cylindrical gifts look simple in demo videos. In practice, tapered cups, slip on rollers, and focus drift ruin batches.

Rollers vs chucks, what LightBurn and vendor apps require, tapered cup physics, and the mistakes that make shops quit drinkware after one frustrating week.`,
    fr: `Gobelets et cadeaux cylindriques ont l'air simples en démo. En pratique, cônes, glissement sur rouleaux et dérive de focus ruinent les séries.

Rouleaux vs mandrins, exigences LightBurn et apps constructeur, physique des gobelets coniques, et les erreurs qui font abandonner le drinkware après une semaine frustrante.`,
  },
  "open-frame-vs-enclosed-lasers.md": {
    en: `The open vs enclosed debate is not cosmetic. It is **beam access**, **room odor**, and **who is allowed in the garage** while the machine runs.

Marketing photos love clean white enclosures. Shop reality is smoke smell, lid interlocks, and whether you trust everyone in the room to wear the right glasses. Below: **open gantry diodes/CO₂** (Ortur, Atomstack) vs **enclosed desktops** (xTool S1, iCube, Glowforge-class). Fiber galvo boxes are a different category: [galvo workstations](/guides/galvo-laser-workstations-explained).`,
    fr: `Le débat ouvert vs fermé n'est pas esthétique. C'est l'**accès au faisceau**, les **odeurs en pièce**, et **qui a le droit d'être dans le garage** pendant la machine.

Les photos marketing adorent les enceintes blanches. La réalité atelier : odeur de fumée, verrous de capot, et confiance dans les lunettes de chacun. Ci-dessous : **portiques ouverts** (Ortur, Atomstack) vs **bureaux fermés** (xTool S1, iCube, Glowforge). Les galvo fibre sont une autre catégorie : [galvo](/guides/galvo-laser-workstations-explained).`,
  },
  "laser-buying-guide-2026.md": {
    en: `You do **not** need a $3,000 laser. Most people start between **$200 and $600** for the machine, plus basics (glasses, scraps, free **LaserGRBL**). Skim [Understanding Laser Types](/guides/understanding-laser-types) if you are unsure whether you need **diode, CO₂, or fiber**.

> **Transparency:** No affiliate links: recommendations follow capability and value.`,
    fr: `Vous n'avez **pas besoin** d'un laser à 3 000 $. La plupart commencent entre **200 et 600 $** pour la machine, plus l'essentiel (lunettes, chutes, **LaserGRBL** gratuit). Parcourez [comprendre les types de laser](/guides/understanding-laser-types) si vous hésitez entre **diode, CO₂ ou fibre**.

> **Transparence :** pas de liens affiliés — les recommandations suivent les capacités réelles et le coût total atelier.`,
  },
};

function replaceIntro(content, newIntro) {
  const normalized = content.replace(/\r\n/g, "\n");
  const match = normalized.match(/^---\n[\s\S]*?\n---\n\n([\s\S]*?)(?=\n## )/);
  if (!match) return content;
  const out = normalized.replace(match[1], newIntro + "\n\n");
  return content.includes("\r\n") ? out.replace(/\n/g, "\r\n") : out;
}

function walk(dir, locale = "en") {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, entry.name === "fr" ? "fr" : locale);
      continue;
    }
    if (!entry.name.endsWith(".md")) continue;

    let content = fs.readFileSync(full, "utf8");
    const key = entry.name;
    const loc = path.dirname(full).endsWith("fr") ? "fr" : "en";

    if (introReplacements[key]?.[loc]) {
      content = replaceIntro(content, introReplacements[key][loc]);
    }

    for (const [pattern, replacement] of bodyReplacements) {
      content = content.replace(pattern, replacement);
    }

    // Strip standalone meta lines anywhere in intro block (before first ##)
    const norm = content.replace(/\r\n/g, "\n");
    const introMatch = norm.match(/^(---\n[\s\S]*?\n---\n\n)([\s\S]*?)(?=\n## )/);
    if (introMatch) {
      const cleaned = introMatch[2]
        .replace(/^This guide explains [^\n]+\n\n/gm, "")
        .replace(/^This guide is [^\n]+\n\n/gm, "")
        .replace(/^This guide compares [^\n]+\n\n/gm, "")
        .replace(/^Ce guide explique [^\n]+\n\n/gm, "")
        .replace(/^Ce guide est [^\n]+\n\n/gm, "")
        .replace(/^Ce guide compare [^\n]+\n\n/gm, "")
        .replace(/^Ce guide s'adresse[^\n]+\n\n/gm, "")
        .replace(/^Ce guide couvre[^\n]+\n\n/gm, "")
        .replace(/^Ce guide complète[^\n]+\n\n/gm, "")
        .replace(/^Ce guide parcourt[^\n]+\n\n/gm, "")
        .replace(/^This guide sits beside[^\n]+\n\n/gm, "")
        .replace(/^This guide complements[^\n]+\n\n/gm, "")
        .replace(/^This guide walks through[^\n]+\n\n/gm, "")
        .replace(/^This guide combines[^\n]+\n\n/gm, "")
        .replace(/^This guide gives you[^\n]+\n\n/gm, "")
        .replace(/\. This guide explains [^.]+\./g, ".")
        .replace(/\. This guide goes deep on [^.]+\./g, ".")
        .replace(/\. Ce guide explique [^.]+\./g, ".")
        .replace(/ This guide separates [^.]+\./g, ".")
        .replace(/ Ce guide sépare [^.]+\./g, ".");
      const out = introMatch[1] + cleaned + norm.slice(introMatch[0].length);
      content = content.includes("\r\n") ? out.replace(/\n/g, "\r\n") : out;
    }

    fs.writeFileSync(full, content);
    console.log("polished:", path.relative(guidesDir, full));
  }
}

walk(guidesDir);
