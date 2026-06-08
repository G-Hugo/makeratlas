---
slug: galvo-laser-workstations-explained
title: "Stations laser galvo expliquées : vitesse, champ et modules"
description: "Balayage galvo, limites de champ, vitesses marketing, modulaire vs hybride vs fibre seule, organisation atelier production."
category: specialty
readTime: 22 min
lastUpdated: "2026-06-02"
status: published
---

Sur une graveuse **portique** (diode ou CO₂ classique), la tête laser se déplace sur des rails au-dessus d'un grand plateau, souvent 300 à 400 mm de côté.

Sur une graveuse **galvo**, la tête ne bouge presque pas : des **miroirs motorisés** orientent le faisceau sur une **petite zone** en dessous. C'est l'architecture de presque toutes les machines bureau **fibre, UV et hybride**, et de certaines bases **modulaires** où l'on change la source (diode, fibre, MOPA, UV) sur le même châssis.

La surprise pour les personnes qui passent du portique au galvo n'est généralement pas la puissance affichée. Le vrai sujet est la taille de zone utile. Sur beaucoup de machines de bureau, on travaille dans un carré d'environ 110 à 220 mm. Cela convient très bien aux bagues, plaques et petites pièces, mais pas aux grands panneaux, sauf en tuilage.

Pour choisir entre diode, CO₂, fibre et UV avant d'acheter : [comprendre les types de laser](/guides/understanding-laser-types).


## Référence rapide

| Sujet | Réalité galvo |
|-------|---------------|
| Mouvement | Miroirs motorisés balaient le faisceau |
| Champ typique | Carré compact, souvent 100–220 mm |
| Convient pour | Petites pièces métal, lots, bijouterie |
| Peu adapté à | Portes de meuble, grandes enseignes |
| Types laser | Fibre, UV, hybride, têtes interchangeables |
| Vitesses annoncées | Balayage max, pas durée réelle du travail |
| Classe | Souvent classe 1 si enceinte fermée |


*Résumé des points clés : le détail suit dans les sections ci-dessous.*

---

## Comment fonctionne un galvo

Sur un **portique**, la tête laser se déplace physiquement sur des rails X/Y. Le trajet du faisceau est relativement fixe ; la **masse** de la tête limite l'accélération.

Sur un **galvo**, la source reste fixe et deux miroirs pilotent la direction du faisceau. Comme ces miroirs sont légers, ils peuvent balayer très vite dans un champ compact. On gagne fortement en cadence sur les petites pièces répétitives.

```
PORTIQUE (diode / CO₂)        GALVO (fibre / UV / hybride)

  [Tête laser]                     [Source fixe]
       |  rails X/Y                      |
       v  lit 300-400 mm                 v
  +------------------+            [Miroir X] -> [Miroir Y]
  |    plateau       |                    |
  +------------------+                    v
                                   +-------------+
                                   | ~110-220 mm |
                                   | champ scan  |
                                   +-------------+
```

Le compromis vient de l'optique. Maintenir un point focal correct sur toute la zone impose une limite de champ. On ne transforme pas un galvo compact en grand portique simplement en modifiant un réglage logiciel.

### Pourquoi le champ compte plus que les watts

Deux machines galvo de même wattage peuvent avoir des zones utiles très différentes. Une zone de 110 mm peut suffire pour des bijoux ou des tags, mais pas pour des objets larges.

Avant de comparer les prix, vérifiez toujours la **zone de travail (mm)**. Une machine moins chère mais incompatible avec vos formats réels devient un faux bon plan. Les watts indiquent surtout le rythme de marquage dans le champ. Le champ détermine si votre pièce est exploitable.

→ Comparer sur [fibre](/lasers/type/fiber), [hybride](/lasers/type/hybrid), [UV](/lasers/type/uv).

### Lentille champ plat (en termes simples)

Les miroirs dirigent le faisceau et la lentille F-theta maintient la mise au point sur la zone de balayage. La qualité optique et la taille de champ influencent directement l'uniformité du marquage, surtout dans les coins.

Testez les coins sur chute avant de promettre une profondeur uniforme sur toute la plaque.

---

## Galvo vs portique : comment choisir

| | Galvo | Portique (diode / CO₂) |
|---|-------|------------------------|
| Mouvement | Miroirs | Tête X/Y |
| Champ typique | 100–220 mm | 300–400+ mm |
| Petites marques répétées | Très rapide | Traverses lentes |
| Grande plaque unique | Tuilage ou impraticable | Naturel |
| Types laser | Fibre, UV, hybride, modulaire | Diode, CO₂ |
| Empreinte bureau | Souvent plus petite | Plus grande |

Le galvo est excellent dès que les pièces tiennent dans le carré et que la production se répète en lots. Il réduit les temps morts entre objets et favorise une cadence stable.

Le portique reste préférable quand une seule installation doit traiter de grandes surfaces en une passe logique : panneaux bois, cuir grand format, signalétique acrylique.

Pour bois grand format ou acrylique pleine feuille : [CO₂](/guides/co2-lasers-explained) ou [diode portique](/guides/diode-lasers-explained).

---

## Ce que le galvo fait bien

### Bijouterie et petit métal

La fibre galvo est la référence pour **inox, laiton et alu nu** à vitesse compatible production. Gravure superficielle ou numéros de série plus profonds selon puissance et passes.

### Lots sans repositionner chaque pièce

Avec un gabarit bien conçu, vous pouvez traiter plusieurs pièces en un seul cycle, puis recharger rapidement. Le gain vient moins d'une vitesse de pointe spectaculaire que d'une réduction des déplacements mécaniques et des manipulations.

### Boîtiers classe 1 fermés

De nombreuses stations galvo sont en enceinte fermée avec interverrouillage. Cela simplifie la sécurité opérationnelle au quotidien, mais ne supprime pas le besoin d'extraction adaptée quand on produit de manière régulière.

→ [Ouvert vs enceinte](/guides/open-frame-vs-enclosed-lasers)

### Hybride métal + organique sur un bureau

Les hybrides galvo combinent en général une source métal et une source organique dans une même enveloppe. L'intérêt est de limiter l'encombrement tout en couvrant plus de matériaux, avec les limites de champ propres au galvo.

→ [Hybrides](/guides/hybrid-lasers-explained)

---

## Limites à accepter avant l'achat

### Pas de gravure 300×300 en une passe

Les formats larges imposent souvent du tuilage logiciel. Sans méthode rigoureuse, les raccords peuvent devenir visibles, surtout sur les textures homogènes ou les aplats.

### Vitesse marketing ≠ délai client

Une vitesse affichée comme "10 000 mm/s" décrit un plafond de balayage dans des conditions optimales. Un cycle réel inclut les remplissages, les changements de couches, les temps de préparation et le contrôle qualité.

→ [Watts marketing](/guides/laser-wattage-marketing-explained)

### Pas un substitut CO₂ pour l'acrylique transparent

Même en mode diode sur hybride, vous n'obtenez pas la découpe enseigne CO₂ sur acrylique clair.

---

## Galvo modulaire : un châssis, sources interchangeables

Certains constructeurs vendent une **base galvo** et des **modules source** (diode, fibre, MOPA, UV). **Un seul module actif à la fois.** On échange physiquement la tête ; on ne fait pas tourner fibre et diode dans le même passage.

C'est différent d'un **hybride intégré**, où deux sources cohabitent déjà dans le boîtier et se sélectionnent en logiciel.

Le modulaire convient bien aux ateliers qui veulent étaler l'investissement. Vous commencez avec le module utile immédiatement, puis vous élargissez ensuite selon l'évolution du chiffre d'affaires.

Les noms de produits, le contenu des cartons et les modules disponibles changent chaque année. Comparez les plateformes concrètes dans [modules interchangeables](/guides/swappable-laser-modules-explained). Pour le contrôle d'impulsion MOPA (pas l'achat) : [MOPA expliqué](/guides/mopa-fiber-lasers-explained).

---

## Déroulements de production typiques

### Bijouterie

Préparer un gabarit stable pour les bagues, figer la recette de marquage, puis contrôler un témoin à chaque lot. La documentation de l'alliage et de la finition évite les dérives visuelles entre commandes.

### Tags et petites plaques

Importer un panneau de plusieurs pièces dans le champ, lancer une passe complète, puis recharger. Le vrai gain économique se joue sur le temps d'installation et la régularité, plus que sur la vitesse marketing affichée.

### Hybride petit cadeau

Un atelier peut produire du métal le matin et du bois l'après-midi sur la même machine hybride. Cela reste viable à condition de maintenir deux bibliothèques de réglages bien séparées.

---

## Pour qui ?

**Bon profil :**
- Production **métal** sur petites pièces avec CA récurrent
- Atelier mixte acceptant un **champ compact**
- UV ou MOPA quand le matériau l'exige

**Peu adapté :**
- 80 % du portfolio = grandes surfaces organiques
- Enseignes pleine feuille sans tuilage acceptable

---

## Erreurs fréquentes

- Acheter fibre galvo pour graver des portes de cuisine
- Sous-estimer le tuilage sur logos larges
- Confondre hybride intégré et galvo modulaire à un module actif
- Comparer vitesses constructeur au temps facturable client
- Oublier l'extraction sur boîtier « fermé »

---

## Catalogue

- [Fibre](/lasers/type/fiber)
- [Hybride](/lasers/type/hybrid)
- [UV](/lasers/type/uv)

## Suite

- [Fibre](/guides/fiber-lasers-explained)
- [Hybrides](/guides/hybrid-lasers-explained)
- [MOPA](/guides/mopa-fiber-lasers-explained)
