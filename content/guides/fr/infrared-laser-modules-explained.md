---
slug: infrared-laser-modules-explained
title: "Modules infrarouges (1064 nm) expliqués : pas la même chose que la fibre"
description: "Guide complet : têtes IR xTool S1, ce qu'un 2W marque vraiment, vs fibre galvo et MOPA, organisation atelier et erreurs d'achat."
category: specialty
readTime: 21 min
lastUpdated: "2026-06-02"
status: published
---

Certaines graveuses **diode** (portique ou enceinte) proposent un **accessoire infrarouge** optionnel, autour de **2 W** et **1 064 nm**, soit la même longueur d'onde qu'une fibre, mais avec une machine très différente : faible puissance, optiques de portique, plafond de production bien plus bas.

L'erreur la plus coûteuse : acheter ce module en pensant remplacer une station fibre pour de l'**inox en série**. La suite décrit ce que l'IR basse puissance marque vraiment, et quand la fibre reste indispensable. Panorama : [comprendre les types de laser](/guides/understanding-laser-types).


## Référence rapide

| Sujet | Module IR (~2W) | Fibre / MOPA galvo |
|-------|-----------------|-------------------|
| Plateforme | Enceinte diode, tête interchangeable | Station métal dédiée |
| Puissance | Basse (~2W) | 20–60W+ typique |
| Champ | Lit diode | Galvo optimisé métal |
| Usage | Tests, plastiques, marquage léger | Production métal |
| Catégorie en boutique | Diode + accessoire IR | Laser fibre |


*Résumé des points clés : le détail suit dans les sections ci-dessous.*

---

## Pourquoi 1064 nm sur l'étiquette ne suffit pas

Beaucoup d'acheteurs lisent les spécifications comme s'il s'agissait d'imprimantes, en supposant qu'un même chiffre produit forcément le même résultat. En laser, la longueur d'onde compte, mais elle ne suffit jamais à elle seule pour prédire les performances.

Il faut aussi prendre en compte :

- **Puissance optique** à la pièce
- **Qualité du point focal** et profondeur de champ
- **Vitesse de balayage** (galvo vs portique lent sur métal)
- **Refroidissement** et cycle de service de la source

Sur **xTool S1**, le module IR apporte bien du 1064 nm dans une machine pensée d'abord pour la diode bleue. Cela élargit la plage d'essais, mais ne transforme pas la plateforme en station fibre de production.

→ [Modules interchangeables](/guides/swappable-laser-modules-explained)

---

## Module IR vs fibre galvo

| | Module IR (ex. S1 2W) | Fibre / MOPA galvo |
|---|----------------------|-------------------|
| Plateforme | Enceinte diode | Station métal |
| Puissance | ~2W | 20–60W+ |
| Vitesse métal | Lente, passes multiples | Rapide en champ |
| Profondeur inox | Légère | Production bijou |
| Couleur inox type MOPA | Non | Oui (MOPA) |
| Catégorie en boutique | Diode + IR | Fibre |

Un module IR doit être considéré comme un complément d'expérimentation, pas comme un remplacement d'une vraie station fibre orientée production.

---

## Ce que le module IR fait bien

### Plastiques techniques

Certains polymères réagissent mieux au 1064 nm qu'au bleu. Les résultats restent variables selon la charge, la couleur et l'épaisseur. Des essais systématiques sur chutes restent indispensables.

### Marquage métal léger

Le marquage superficiel est possible sur certains aciers et alliages avec des réglages prudents et des cycles plus lents. Ce n'est pas la profondeur ni la vitesse d'une fibre 20W, mais cela peut convenir à des essais ou à de petites séries non critiques.

### Pont avant achat fibre

Pour un atelier déjà équipé d'un **xTool S1**, le module IR peut servir de validation commerciale avant un investissement fibre. C'est un outil de transition et de test de marché, pas la solution finale d'une production bijou soutenue.

### Extension sans deuxième enceinte

Si vous avez déjà le S1 pour le bois et le cuir, l'IR peut éviter une deuxième machine au démarrage pour des tests métal ou plastiques. Le coût caché reste le temps de changement de tête, de recalage et de maintenance de profils séparés.

---

## Ce qu'il ne fera pas

- Graver de l'**inox** rapidement et en profondeur comme une fibre 20W
- Produire des **couleurs MOPA** stables
- Remplacer un galvo ComMarker pour un flux Etsy métal quotidien
- Découper du métal (hors scope fibre bureau aussi)

Si le métal est votre revenu principal : [fibre](/guides/fiber-lasers-explained) et [métal sans fibre](/guides/metal-marking-without-fiber).

---

## Module IR vs MOPA

**MOPA** = source fibre haute puissance, **impulsions réglables**, couleur inox, fenêtre matériaux élargie sur métal.

**Module IR** = accessoire **basse puissance** sur lit diode. Pas de chaîne galvo métal, pas de réglage d'impulsions comparable.

→ [MOPA](/guides/mopa-fiber-lasers-explained)

Même longueur d'onde sur une fiche technique ne signifie pas même catégorie de machine ni même rendement atelier.

---

## Exemple pas à pas sur une enceinte diode à têtes interchangeables

1. **Gravure bois / cuir** avec tête diode standard (réglages bleus)
2. **Arrêt machine**, changement physique vers tête IR (temps atelier réel : 15 à 30 min selon habitude)
3. **Recalage focus** et origine ; réglages LightBurn ou xTool **séparés**
4. Tests sur chute plastique ou petite plaque métal
5. Si le métal devient **une série hebdomadaire** : planifier la migration fibre, ne pas empiler les passes IR

Documentez deux jeux de presets. Mélanger les réglages diode et IR dans un même profil crée des écarts difficiles à reproduire.

---

## Qui devrait ajouter l'IR ?

**Bon profil :**
- **Déjà propriétaire S1** (ou plateforme compatible)
- Expérimentation avant fibre
- Marquage occasionnel, pas bijou production

**Peu adapté :**
- Acheter S1 **uniquement** pour l'IR alors que le métal domine → [fibre](/guides/fiber-lasers-explained) directement
- Attendre couleur inox → MOPA ou fibre, pas IR 2W
- Production tags acier avec promesse durabilité type bijou

---

## Erreurs fréquentes

| Erreur | Réalité |
|--------|---------|
| Comparer « 1064 nm » sans lire les watts | IR ≠ fibre |
| Vendre des bagues IR comme « gravure laser permanente » | Tester usure et profondeur |
| Oublier le temps de changement de tête | Coût caché en production |
| Pas d'extraction sur tests plastique | Fumées possibles |
| Confondre P3 IR et fibre galvo | Lire la fiche catalogue |

---

## Machines avec option IR

Chercher les fiches avec note **module infrarouge** : variantes **xTool S1 2W IR**, configs **P3 IR**, etc. Parcourir le [catalogue diode](/lasers/type/diode) et filtrer les features.

## Suite

- [Diode](/guides/diode-lasers-explained)
- [Types de laser](/guides/understanding-laser-types)
- [Métal sans fibre](/guides/metal-marking-without-fiber)
