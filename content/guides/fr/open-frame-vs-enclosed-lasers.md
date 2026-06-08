---
slug: open-frame-vs-enclosed-lasers
title: "Portique ouvert vs enceinte fermée"
description: "Guide complet : Ortur vs xTool S1, classe 4 vs 1, fumée, appartements, makerspace et installation en conditions réelles."
category: specialty
readTime: 20 min
lastUpdated: "2026-06-02"
status: published
---

Choisir entre **portique ouvert** et **enceinte fermée**, ce n'est pas une question de design. C'est une question de **qui peut entrer dans la pièce** pendant que la machine tourne, de **combien de fumée** reste dans l'air, et de **quelle classe laser** vous gérez au quotidien.

Les photos marketing montrent de jolies boîtes blanches. La réalité en atelier, c'est l'odeur, les sécurités de capot, les habitudes d'exploitation et les lunettes pour chaque personne présente.

**Portique ouvert** : la tête et le faisceau sont accessibles ; vous travaillez souvent sur une **grande surface** (300 à 400 mm), mais la pièce est en **classe 4** pendant l'usage, donc tout le monde dans la pièce doit être protégé.

**Enceinte fermée** : le laser est dans une boîte avec capot ; en usage normal avec capot fermé, la machine est en **classe 1** pour le faisceau. La fumée doit quand même être évacuée, le capot n'aspire pas l'air à lui seul.

Les graveuses **galvo fibre** (galvo = système à miroirs galvanométriques qui déplacent très vite le faisceau sur une petite zone) forment une troisième catégorie : [stations galvo](/guides/galvo-laser-workstations-explained).


## Référence rapide

| Sujet | Portique ouvert | Enceinte |
|-------|-----------------|----------|
| Faisceau | Classe 4 en marche | Classe 1 capot fermé |
| Surface / euro | Souvent plus grand | Souvent plus petit |
| Fumée en pièce | Exposition directe | Canalisée, pas éliminée |
| Espace idéal | Garage solo | Appart, enfants, bureau partagé |
| Extraction découpe | Obligatoire | Toujours obligatoire |


*Résumé des points clés : le détail suit dans les sections ci-dessous.*

---

## Portique ouvert

**Exemples :** Ortur LM3, Atomstack, TwoTrees, diodes <500 €, beaucoup de CO₂ ouverts.
Le portique ouvert reste populaire parce qu'il donne beaucoup de surface utile pour un budget limité.

### Avantages réels

- Plus de **surface utile par euro** (400 mm courant)  
- Accès matière, gabarits, maintenance simples  
- Écosystème upgrades : air, table alvéolée, rotary, cales  
- Courroies et rails accessibles

### Coûts cachés

- **Classe 4** : lunettes OD pour **toute** personne présente  
- Fumée et particules **dans la pièce** même en gravure  
- Responsabilité enfants, animaux, visiteurs  
- Découpe = surveillance + extincteur
Le coût global d'un portique ne se limite donc pas à la machine : il faut intégrer lunettes, extraction et discipline d'usage.

→ [Sécurité](/guides/laser-safety-basics)

### Quand le portique est le bon choix

Garage solo, lunettes, porte fermable : excellent rapport mm/€. Meilleur accès **rotary gobelets et articles cylindriques** et table alvéolée sans recaler caméra de capot.

Gravure légère + découpes fines surveillées = choix valide avec discipline.
Dans ces conditions, c'est souvent la solution la plus flexible pour apprendre et produire sans surinvestir.

---

## Enceinte bureau (diode ou CO₂)

**Exemples :** xTool S1, Sculpfun iCube, Glowforge, Omtech fermés.
L'enceinte vise surtout une exploitation plus encadrée en environnement partagé.

### Avantages réels

- **Interlock capot** contient le faisceau fermé  
- Moins de **lumière bleue parasite**  
- Souvent meilleure **caméra / autofocus**  
- Plus acceptable en appartement (sans licence de couper acrylique sans extraction)  
- Aspect pro en showroom client

### Limites

- Volume souvent plus petit qu'un ouvert 400 mm  
- Prix plus élevé à watts optiques comparables  
- **Ventilation toujours nécessaire** en découpe  
- Contournement interlocks = danger + garantie perdue  
- Hauteur interne limite certains gobelets rotary

**Classe 1 fermé** = accès faisceau, **pas** qualité de l'air.
Cette distinction évite l'erreur classique "capot fermé = ventilation secondaire".

### Quand l'enceinte se rentabilise

Espace partagé, enfants, clients : l'interlock est une assurance. Vérifier la **zone mm** sur chaque annonce avant de supposer qu'une S1 bat un portique 400 mm.
Si votre contrainte principale est la cohabitation plutôt que la taille des pièces, l'enceinte prend souvent l'avantage.

---

## Classes laser sans mythe

**Classe 1** (interlock OK, capot fermé) : faisceau inaccessible en fonctionnement normal.

**Classe 4** (portique ouvert) : faisceau direct et réflexions spéculaires.

L'enceinte ne rend pas les fumées acrylique saines en intérieur.
Retenez cette logique : classe laser décrit le risque optique, pas la qualité chimique de l'air.

→ [Filtres vs extérieur](/guides/laser-exhaust-filters-explained)

---

## CO₂ : l'enceinte ne remplace pas le tuyau

Découpe acrylique CO₂ = composés organiques volatils (COV) lourds. Boîte fermée **canalise** vers filtre ou extérieur, ne nettoie pas la chimie magiquement.
Sur un rythme régulier, l'évacuation extérieure reste la référence de sécurité et de confort.

→ [Ventilation](/guides/laser-ventilation-setup)

---

## Galvo compact (F1, Omtech FC)

Autre catégorie : petit champ, souvent classe 1, métal/hybride. Ce n'est pas un substitut à un grand portique bois.

---

## Comment choisir (scénarios)

Le bon choix dépend moins de la marque que du contexte réel d'usage : lieu, public, matériaux, fréquence.

| Situation | Orientation |
|-----------|-------------|
| Garage solo, discipline lunettes | Portique |
| Appart, enfants, bureau partagé | Enceinte |
| Volume découpe > gravure | Les deux + extraction sérieuse |
| Makerspace / école | Enceinte + procédure écrite |
| Production gobelets et articles cylindriques rotary | Ouvert souvent plus simple |
| Showroom client | Enceinte plus « pro » |
| Max surface enseigne diode | Portique |

---

## Installation réelle (les deux formats)

Quel que soit le format, l'installation périphérique fait la différence entre un système agréable et un système pénible à exploiter.

- **Soufflage d'air** sur beaucoup de découpes ([guide](/guides/air-assist-honeycomb-setup))  
- **table alvéolée** ou support sacrificiel  
- **Plan extraction** avant volume production  
- **Extincteur** adapté matériaux  
- Lunettes de rechange invités (portique ouvert)

Postes oubliés : ventilateur en ligne, gaine, cartouches filtre, nettoyage rails (plus exposés en ouvert).
Ces postes "invisibles" pèsent plus sur le résultat final que beaucoup d'accessoires marketing.

---

## Témoignages atelier (patterns réels)

**Garage dédié, portique 400 mm :** le bricoleur accepte lunettes et odeur CP occasionnelle. Extraction fenêtre + rideau plastique entre atelier et maison.

**Appartement, S1 20W :** gravure cuir et bois fine avec filtre charbon court ; découpes CP longues déplacées chez un makerspace ou client externe.

**Boutique mixte :** enceinte diode pour démos clients, portique secondaire en arrière-boutique pour grands panneaux. Deux form factors, un seul type laser.

Ces patterns montrent que le choix n'est pas moral : c'est **espace + audience + matériaux**.
La meilleure configuration est souvent hybride quand l'activité mélange démonstration client et production.

## Erreurs fréquentes

- S1 sans plan extraction bois  
- Ortur longue découpe en pièce de vie  
- Capot = plus besoin d'soufflage d'air sur épais  
- Interlock contourné pour « tester vite »  
- Enceinte choisie sans lire zone mm

---

## Suite

- [Diode](/guides/diode-lasers-explained)
- [Ventilation](/guides/laser-ventilation-setup)
- [Catalogue](/lasers)
