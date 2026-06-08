---
slug: air-assist-honeycomb-setup
title: "Soufflage d'air et table table alvéolée : coupes plus propres"
description: "Guide complet : quand l'soufflage d'air compte, dimensionnement pompe, tables table alvéolée, diode vs CO₂, erreurs et extraction."
category: setup
readTime: 20 min
lastUpdated: "2026-06-02"
status: published
---

Le **soufflage d'air** et la **table alvéolée** apparaissent dans presque tous les packs d'accessoires pour diode. Bien réglés, ils améliorent clairement la qualité des coupes sur le bois. Mal intégrés, ils deviennent surtout des dépenses de plus, parce que l'extraction et les réglages de base n'étaient pas au niveau.

Voici **quand** ces accessoires valent vraiment leur prix, comment dimensionner une pompe sur une diode d'entrée de gamme, et pourquoi ils ne remplacent ni une bonne extraction ni le **bon type de laser** pour votre matériau.


## Référence rapide

| Accessoire | Bénéfice principal | Ne corrige pas |
|------------|-------------------|----------------|
| Soufflage d'air | coupe plus nette (trait de coupe plus propre), moins de char | Acrylique clair en diode |
| Table table alvéolée | Dos moins marqué, débris | Extraction faible |
| Les deux | Meilleure qualité organiques | Mauvaise longueur d'onde |


*Résumé des points clés : le détail suit dans les sections ci-dessous.*

---

## En deux phrases : à quoi ça sert

Le **soufflage d'air** envoie un jet d'air comprimé juste sous la buse, au point où le faisceau touche la matière. Il **chasse fumée et braises** hors du trait de coupe : bords plus clairs sur le bois, moins de retours de flamme sur les longues lignes.

La **table alvéolée** (table alvéolée) est une grille à trous : la pièce repose dessus. Fumée et débris passent **en dessous** au lieu de rester sous la feuille et de marquer le dos du matériau.

Ni l'un ni l'autre ne remplace une **bonne extraction**. Sans ventilateur vers l'extérieur ou un filtre adapté, vous améliorez la coupe mais la fumée reste dans la pièce.
Le bon réflexe est de voir ces accessoires comme des multiplicateurs de qualité : ils donnent leur plein potentiel quand la ventilation, le focus et les paramètres matériau sont déjà propres.

---

## Soufflage d'air : rôle réel

Un flux d'air (pompe dédiée ou compresseur d'atelier réglé) arrive par une buse fixée près de la tête laser.
Ce flux agit directement dans la zone chaude du trait de coupe (kerf), c'est-à-dire la fente créée par le laser dans la matière.

### Sans soufflage d'air

- Bords plus sombres sur CP et MDF  
- Flamme locale plus facile sur longues lignes  
- Plus de **char** à poncer  
- Lentille qui se salit plus vite

### Avec soufflage d'air

- Coupe plus nette (trait de coupe plus propre) sur bois et contreplaqué  
- Meilleure évacuation des débris fondus dans la coupe  
- Bords acrylique parfois un peu plus propres au CO₂ (selon réglages)  
- Fumée poussée vers le port d'extraction

**Important :** le soufflage d'air **pousse la fumée** vers l'extraction. Il ne filtre pas. Il faut un [plan ventilation](/guides/laser-ventilation-setup) dès que la découpe devient régulière.

---

## Dimensionner une pompe (diode hobby)

Kits budget annoncent souvent 30 L/min. Besoins réels selon matériau et volume.
Retenez qu'un débit annoncé sur la fiche n'est pas forcément le débit réellement disponible à la buse, surtout avec des tuyaux longs ou coudés.

| Usage | Orientation |
|-------|-------------|
| Gravure seule, bois léger | Pompe entrée souvent suffisante |
| Découpe CP 3–6 mm plusieurs fois/semaine | **40–60 L/min** ou compresseur régulé |
| CO₂ 40W+ air intégré | Suivre pression et débit notice |
| MDF épais en production | Débit élevé + extraction forte |

Profils **Sculpfun S40** ou **Atomstack** haut de gamme citent parfois des débits élevés pour coupes annoncées en une passe : l'air n'est pas optionnel sur ces passages.
Si vous cherchez des résultats reproductibles, traitez la pompe comme un composant de base, pas comme un ajout secondaire.

### Compresseur vs pompe laser

Compresseur atelier possible à **basse pression** régulée. Trop de pression perturbe le focus. Pompes dédiées laser = plus simple pour débuter.
L'objectif n'est pas de souffler le plus fort possible, mais d'envoyer un flux stable et contrôlé exactement au bon endroit.

### Entretien

- Nettoyer **embout buse** régulièrement  
- Gaine pliée ou longue = perte de débit  
- Eau dans l'air compresseur = humidité vers optique
Un entretien simple et constant évite la baisse progressive de qualité que l'on remarque souvent trop tard.

---

## Table table alvéolée

Grille alu ou acier à alvéoles. La feuille repose sur la grille au lieu d'un plateau plein.
C'est un changement mécanique simple, mais qui améliore souvent le dessous des pièces dès les premiers essais.

### Pourquoi les ateliers l'utilisent

- Fumée et débris tombent **sous** la pièce  
- Moins de marque **brune au dos** bois/cuir  
- Découpes traversantes accrochent moins sur plaque chaude  
- Air circule sous la feuille (avec assist + extraction)

### Compromis

- Petites pièces **tombent** dans les alvéoles  
- Lignes de grille fantômes sur matériaux très légers  
- table alvéolée cheap **se déforme** à la chaleur

### table alvéolée + soufflage d'air ensemble

Standard sur beaucoup de CO₂ et diodes haut de gamme : le soufflage nettoie le trait de coupe, table alvéolée laisse sortir débris et flux vers collection.
Ce duo fonctionne bien parce qu'il traite à la fois le dessus et le dessous de la coupe, ce qui réduit les reprises manuelles.

---

## CO₂ vs diode

**CO₂** sur acrylique et CP : fort gain avec assist + table alvéolée.

**Diode** sur bois fin : gain notable. N'ajoute pas d'absorption sur acrylique transparent.
Autrement dit, ces accessoires optimisent le procédé, mais ils ne changent pas la physique d'absorption de la matière.

→ [Diode](/guides/diode-lasers-explained)

---

## Hauteur de focus

Mauvais Z ruine la coupe même avec air parfait. table alvéolée ajoute de l'épaisseur sous la pièce. Recalculer cales et jauges de focus après changement de table.
Prenez l'habitude de refaire un test de focus dès que vous changez de support, même si vos réglages semblaient stables la veille.

---

## Ordre d'achat budget nouveau propriétaire

1. **Extraction basique** (ventilateur de fenêtre) avant les découpes ambitieuses  
2. **Soufflage d'air** avant de chercher pourquoi le CP charbonne  
3. **table alvéolée** quand les découpes marquent le plateau  
4. **Meilleure pompe** quand le volume production le justifie

Maxer l'air sans extraction = parfumer la fumée sans l'enlever.
Cet ordre d'achat limite les erreurs coûteuses et donne des gains visibles à chaque étape.

---

## Réglages pratiques à tester sur chute

1. **Assist ON vs OFF** sur même ligne de découpe CP 3 mm : photographier trait de coupe et dos  
2. **Débit air** mini / médian / max (si réglable) : trop d'air peut souffler la flamme et ralentir la coupe  
3. **table alvéolée vs plateau plein** sur cuir fin : marque dorsale souvent réduite avec grille  
4. Noter dans votre fiche matériau : air + table alvéolée + vitesse/puissance ensemble

Une session de 30 minutes sur chutes évite des semaines de « pourquoi c'est sale ».
Documenter ces essais dans une fiche claire vous fera gagner beaucoup de temps sur les prochaines commandes.

## Erreurs fréquentes

- CP sur plateau acier plein sans assist (char haut et bas)  
- table alvéolée sans extraction en dessous  
- Accessoires pour remplacer CO₂ sur enseignes acrylique  
- Bois résineux longue gravure sans assist (salissure lentille)
La plupart de ces erreurs viennent d'une attente irréaliste : les accessoires améliorent le résultat, mais ne compensent pas une installation inadaptée.

---

## Suite

- [Ventilation](/guides/laser-ventilation-setup)
- [CO₂](/guides/co2-lasers-explained)
- [Filtres](/guides/laser-exhaust-filters-explained)
