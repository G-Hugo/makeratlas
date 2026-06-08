---
slug: rotary-laser-engraving
title: "Gravure laser rotary : gobelets, cylindres et pièces rondes"
description: "Guide complet : rouleaux vs mandrin, réglage LightBurn, gobelets coniques, organisation atelier anodisé et erreurs production."
category: specialty
readTime: 20 min
lastUpdated: "2026-06-02"
status: published
---

Graver un gobelet ou un cylindre a l'air simple en vidéo. En atelier, les **gobelets coniques**, le **glissement sur les rouleaux** et la **dérive de mise au point** ruinent vite les premières séries, et beaucoup abandonnent trop tôt la gravure d'objets cylindriques.

On détaille ici **rouleaux vs mandrin**, ce que LightBurn (ou l'application constructeur) doit savoir sur le diamètre, et les réglages qui tiennent sur une production régulière.


## Référence rapide

| Sujet | Réalité rotary |
|-------|----------------|
| Kits courants | Rotary à rouleaux |
| Logiciel | Diamètre / circonférence corrects |
| Matériau classique | Gobelets alu anodisé |
| Installation début | 5–15 min par gobelet |
| N'ajoute pas | Watts optiques ni nouveau type laser |


*Résumé des points clés : le détail suit dans les sections ci-dessous.*

---

## Pourquoi les gobelets sont plus difficiles qu'ils en ont l'air

Sur une plaque plate, la distance entre la lentille et la surface est constante : le faisceau reste net sur tout le motif. Sur un cylindre, la surface **s'éloigne et se rapproche** de la lentille selon l'angle de rotation. Sur un gobelet **conique** (plus large en haut), le diamètre change aussi le long de la hauteur : un logo « carré » sur l'écran devient étiré ou écrasé si le logiciel ne connaît pas le bon diamètre.

Les kits **rotary à rouleaux** font tourner le gobelet pendant que le laser grave. Si le gobelet glisse, si le diamètre saisi est faux de quelques millimètres, ou si la mise au point était calée pour une autre hauteur, le résultat part en vrille. D'où les 5 à 15 minutes de réglage par pièce au début : ce n'est pas vous qui êtes lent, c'est la géométrie.
La difficulté n'est donc pas seulement logicielle : elle est aussi mécanique et liée à la forme réelle de l'objet.

---

## Rotary rouleaux vs mandrin (chuck)

| Type | Maintien | Convient pour | Peu adapté à |
|------|----------|------------|------------|
| **Rouleaux** | Cylindre sur roues motorisées | Gobelets droits, bouteilles | Forte conicité, anses |
| **Mandrin** | Mâchoires sur l'extrémité | Stylos, bagues, tiges | Gros mugs mal centrés |

La majorité des kits marketplace sont des **rouleaux**. Les mandrins apparaissent plutôt en bijouterie ou métal.
Le choix entre les deux dépend surtout de la stabilité de prise de pièce, pas d'une supériorité absolue de l'un sur l'autre.

### Pourquoi les rouleaux dominent le gobelets et articles cylindriques

Les gobelets sont des cylindres relativement uniformes. Les rouleaux tournent la pièce pendant que le laser tire en coordonnées lit mappées en rotation. Mécanique simple, kits abordables.
Pour un atelier qui démarre, ce format donne souvent le meilleur rapport entre coût, simplicité et résultat.

---

## Ce que le logiciel doit faire

Le mode rotary mappe l'axe **Y** en degrés de rotation. Mauvais diamètre = logo étiré ou compressé.
Cette conversion est le coeur du sujet : une petite erreur de diamètre se voit immédiatement sur la pièce finale.

### Réglage pas à pas dans LightBurn

1. Activer rotary dans les réglages machine  
2. Choisir **rouleaux** ou **mandrin**  
3. Saisir **diamètre rouleau** et **diamètre pièce** (ou circonférence)  
4. Graver une **ligne horizontale test** sur chute ou fond de gobelet  
5. Mesurer longueur ligne vs wrap attendu ; ajuster diamètre  
6. Lancer l'artwork client seulement après validation

Sauter l'étape 4 = apprentissage sur un blank à 25 €.
Prendre trois minutes pour un test de ligne évite les erreurs coûteuses et protège vos délais client.

→ [LightBurn vs apps constructeur](/guides/lightburn-vs-maker-software)

### Apps constructeur (xTool, Ortur…)

Certaines enceintes (P2/P3) incluent assistants rotary avec caméra. D'autres : simple champ diamètre. Lire la **liste compatibilité** avant d'acheter le kit.
Quand l'assistant est limité, il faut compenser avec une méthode de test rigoureuse sur chutes.

---

## Matériaux et type de laser

| Projet | Laser typique | Note |
|--------|---------------|------|
| Gobelets **anodisés** | Diode bleue | Usage courant en boutique Etsy classique |
| gobelets et articles cylindriques poudré | Diode si revêtement absorbe | Tester contraste |
| Verre cylindrique | CO₂ masqué ou UV | Pas premier projet rotary |
| Inox brossé nu | Fibre ou spray + diode | Autre budget |

Le rotary **n'oriente** que la pièce sous le faisceau existant. Il ne remplace pas la fibre pour bagues acier.
C'est une source fréquente de confusion : l'accessoire ajoute un axe de rotation, pas une nouvelle capacité de marquage matière.

### Pourquoi l'anodisé est le sweet point focal

Le bleu absorbe la **couche de teinte anodisée**. Marquage sans spray. Avec rotary, c'est l'un des meilleurs ROI hobby → side-business en laser bureau.
Ce couple matière + procédé est populaire parce qu'il combine lisibilité, vitesse et faible taux d'échec.

---

## Installation physique : hauteur, focus, glissement

### Hauteur Z et cales

Les cylindres élèvent la surface. Les portiques ouverts (D1, Ortur) ont souvent besoin de **cales** ou barres L pour que la buse dégage la couronne du gobelet tout en gardant le focus sur la bande de gravure.

Les enceintes (S1) ont des limites de hauteur interne. Vérifier diamètre max gobelet dans la notice avant achat bulk de blanks.
Valider ces cotes avant commande en volume évite de se retrouver avec un lot inutilisable.

### Éviter le glissement

- Bandes caoutchouc sur rouleaux si fournies  
- Vitesse modérée sur premières passes  
- Éviter gravure trop près de l'anse (couple sur la pièce)

Le glissement = **fantômes** ou doubles lignes. Le client voit tout de suite.
Dès qu'un fantôme apparaît, arrêtez la série et corrigez la prise mécanique avant de continuer.

---

## Gobelets coniques : limites honnêtes

Les formes type chaîne de café **rétrécissent** vers la base. Le diamètre n'est **pas constant** sur la bande de gravure.

Conséquences : focus qui drift, software qui suppose un seul diamètre, anses qui changent la géométrie.
Plus la zone de gravure est large sur la hauteur, plus ce problème s'amplifie.

**Approche production :** un **fournisseur blank** stable, conicité minimale. Tester zone gravure sur gobelets cheap avant de lister formes coniques custom.
La standardisation des références est l'un des leviers les plus puissants pour réduire les rebuts.

---

## Organisation qui tient sur la durée au contact client

La régularité vient davantage de la méthode que de la machine elle-même.

1. **Un fournisseur** gobelet validé (lot anodisé stable)  
2. SVG avec zone sûre testée (hauteur mm sur gobelet)  
3. Fiche réglages par **couleur anodisée**  
4. Ligne test à chaque nouveau lot  
5. **Soufflage d'air** léger + **extraction** même en « simple gravure »  
6. Série modèles identiques : installation une fois, six gobelets

### Devis temps

Budgéter **5–15 min par style** de gobelet au début. Les shops production réduisent avec gabarits dédiés.
Annoncez ce temps dès le devis pour éviter les promesses intenables sur des formes non standard.

---

## Accessoires et hauteur machine

**Cales et barres L** (D1, portiques ouverts) : vérifiez que le faisceau reste perpendiculaire à la zone gravée sur le cylindre. Une inclinaison de quelques degrés étire le texte sur l'avant du gobelet.

**Rotary intégré P2/P3** : lisez la hauteur max gobelet et le dégagement caméra. Un kit rotary tiers sur enceinte non prévue peut heurter le capot.

Vérifiez la compatibilité rotary avec votre référence exact et le vendeur avant commande de blanks en volume.
Une vérification en amont coûte quelques minutes ; un mauvais achat de consommables coûte très vite beaucoup plus.

## Erreurs fréquentes

| Erreur | Résultat |
|--------|----------|
| Rotary avant focus plat maîtrisé | Double frustration |
| Diamètre faux, pas de ligne test | Logo étiré |
| Anse ignorée | Wrap de travers |
| Revêtement sécurité laser inconnu | Risque santé |
| Délais promis sans temps installation | Retards livraison |
Ce tableau résume des erreurs classiques de démarrage. L'objectif est de rendre la production prévisible, pas de chercher la vitesse maximale dès la première semaine.

---

## Suite

- [Soufflage d'air](/guides/air-assist-honeycomb-setup)
- [Diode](/guides/diode-lasers-explained)
- [Ventilation](/guides/laser-ventilation-setup)
