---
slug: laser-materials-by-type
title: "Matériaux par type de laser : référence complète"
description: "Tableau honnête diode, CO₂, fibre, UV, hybride, explications physique, scénarios atelier et matériaux interdits."
category: specialty
readTime: 22 min
lastUpdated: "2026-06-02"
status: published
---

Avant d'acheter pour un **matériau précis**, regardez ce tableau : les watts seuls ne battent pas la **physique des longueurs d'onde**. Une diode 40 W ne découpera pas honnêtement l'acrylique transparent. Un CO₂ 55 W ne marquera pas l'inox nu comme une fibre.

Chaque symbole du tableau est expliqué plus loin : pourquoi il s'applique, quels réglages typiques, quelles erreurs d'acheteur. Guides par technologie : [diode](/guides/diode-lasers-explained) · [CO₂](/guides/co2-lasers-explained) · [fibre](/guides/fiber-lasers-explained) · [UV](/guides/uv-lasers-explained) · [hybride](/guides/hybrid-lasers-explained).


## Légende

| Symbole | Sens |
|---------|------|
| **✓** | Usage courant et honnête |
| **~** | Possible avec astuces, lent, résultat variable |
| **✗** | Mauvais outil ou dangereux |

---

## La règle physique derrière le tableau

Le laser repose sur l'**absorption** : les photons doivent interagir avec la matière pour produire un effet utile. La longueur d'onde détermine cette interaction bien plus directement que le wattage marketing.

| Classe λ | Source typique | Histoire absorption |
|----------|----------------|---------------------|
| ~450 nm bleu | Diode | Fort sur organiques foncés, teinte anodisée ; faible sur acrylique clair, métal nu |
| ~10 600 nm IR | CO₂ | Fort sur organiques et plastiques ; faible sur métal nu |
| ~1064 nm proche IR | Fibre, IR | Fort sur métaux ; faible sur organiques clairs |
| ~355 nm UV | Galvo UV | Marquage à froid plastiques/verre ; niche |

Un **hybride** n'invente pas une nouvelle physique : il embarque deux sources et vous passez de l'une à l'autre selon le matériau.

→ [Hybrides](/guides/hybrid-lasers-explained)

### Pièges réflexion et transmission

Les matériaux peuvent transmettre, réfléchir ou absorber le faisceau selon la longueur d'onde. Plus de watts n'annule pas un problème de transmission ou de réflexion. Cela explique pourquoi certains cas restent bloqués même avec des machines plus puissantes.

---

## Organiques et signalétique

| Matériau | Diode | CO₂ | Fibre | UV | Notes |
|----------|-------|-----|-------|-----|-------|
| Bois / CP | ✓ | ✓ | ✗ | ✗ | CO₂ coupe plus épais plus vite |
| Cuir | ✓ | ✓ | ✗ | ~ | Ventiler fort |
| Papier / carton | ✓ | ✓ | ✗ | ~ | Surveillance incendie |
| Acrylique transparent | ✗ | ✓ | ✗ | ~ | Diode : faisceau traverse |
| Acrylique coloré / noir | ~ | ✓ | ✗ | ~ | Diode seulement si pigment absorbant |
| Tampon caoutchouc | ~ | ✓ | ✗ | ✗ | Classique CO₂ |

### Bois et contreplaqué

**Diode (✓) :** Gravure cadeaux, planches à découper, bambou. Découpe fine 3–6 mm possible avec soufflage d'air et passes multiples.

**CO₂ (✓) :** Production plus rapide sur contreplaqué et enseignes. Référence atelier dès que la découpe devient centrale.

**Fibre (✗) :** 1064 nm ne couple pas utilement dans le bois. Erreur d'achat.

→ [Soufflage d'air](/guides/air-assist-honeycomb-setup)

### Acrylique : le piège diode le plus clair

**Transparent (✗ diode) :** le bleu traverse. Vous marquez la table avant la feuille.

**CO₂ (✓) :** la catégorie enseigne acrylique existe grâce au 10,6 µm.

---

## Métaux et revêtements

| Matériau | Diode | CO₂ | Fibre | UV | Notes |
|----------|-------|-----|-------|-----|-------|
| Alu anodisé | ✓ | ~ | ✓ | ~ | Diode = gobelets et articles cylindriques |
| Inox nu | ~ | ~ | ✓ | ~ | Diode = [spray](/guides/metal-marking-without-fiber) |
| Laiton / cuivre nu | ~ | ✗ | ✓ | ~ | Fibre primaire |
| Métal peint / revêtu | ~ | ✓ | ✓ | ~ | CerMark CO₂ |
| Usinage métal profond | ✗ | ✗ | ~ | ✗ | Gravure, pas fraisage |

### Aluminium anodisé

**Diode (✓) :** cas d'usage métal le plus accessible en atelier diode, notamment sur gobelets et petites pièces anodisées.

**Fibre (✓) :** production, numéros de série.

### Inox, laiton, cuivre nu

**Fibre (✓) :** outil production vitesse.

**Diode (~) :** possible via spray ou marquage léger, mais pas comparable à une production fibre en série.

**Module IR S1 :** pas débit fibre. Consultez aussi [IR](/guides/infrared-laser-modules-explained).

---

## Plastiques, verre, niche

| Matériau | Diode | CO₂ | Fibre | UV | Notes |
|----------|-------|-----|-------|-----|-------|
| ABS / plastiques tech | ~ | ~ | ~ | ✓ | UV marquage froid |
| Verre | ✗ | ~ | ✗ | ✓ | CO₂ masqué ; UV fin |
| Ardoise / pierre foncée | ✓ | ~ | ✗ | ✗ | Contraste diode |
| Marquage PCB | ✗ | ✗ | ~ | ✓ | Pro / semi-pro |

Un plastique inconnu ne doit pas être gravé sans fiche de sécurité matière du fournisseur.

---

## Ne jamais graver

| Matériau | Pourquoi |
|----------|----------|
| **PVC / vinyle** | Fumées chlore, toxiques |
| **Polycarbonate** | Fumées, fusion sale |
| **Plastique inconnu** | Toxique jusqu'à preuve |
| **Acrylique miroir face faisceau** | Risque réflexion |

---

## Hybride : lire la matrice

| Job | Source active |
|-----|---------------|
| Boîte cadeau bois | Mode diode |
| Plaque acier | Mode fibre |
| Enseigne acrylique claire | Ni mode hybride : il faut CO₂ |

L'hybride combine deux longueurs d'onde dans un champ galvo compact. Cela augmente la polyvalence, mais ne remplace pas la capacité CO₂ sur acrylique transparent.

---

## Raccourci par métier

```
Gravure bois/cuir budget        → Diode
Enseignes acrylique + CP        → CO₂
Métal nu production             → Fibre (+ MOPA si couleur)
Plastique sensible              → UV
Tags métal + cadeaux bois petit → Hybride ou 2 machines
gobelets et articles cylindriques anodisé seul          → Diode (+ rotary)
```

### Scénario Etsy gobelets et articles cylindriques

Pour des gobelets anodisés, la combinaison **diode + rotary** reste souvent la plus rentable. Dès que les tags inox nus deviennent hebdomadaires, la fibre galvo prend l'avantage.

→ [Rotary](/guides/rotary-laser-engraving) · [Métal sans fibre](/guides/metal-marking-without-fiber)

---

## Watts vs longueur d'onde

| Pensée acheteur | Réalité |
|-----------------|---------|
| « Diode 40W = CO₂ 40W » | Longueurs d'onde différentes |
| « Plus watts diode = acrylique » | Toujours ✗ sur transparent |
| « Watts fibre = bois » | Toujours ✗ découpe bois |
| « Hybride = tout » | Pas ligne CO₂ ; champ limité |

→ [Watts marketing](/guides/laser-wattage-marketing-explained)

---

## Erreurs fréquentes

| Erreur | Pourquoi |
|--------|----------|
| Diode pour enseignes acrylique clair | Physique, pas réglages |
| Fibre pour planches à découper | Mauvaise λ |
| Plaque plastique mystère | Fumées toxiques |
| Hybride remplace atelier CO₂ | Épaisseur + acrylique |
| Cuir sans ventilation | Odeur et particules |

---

## Utiliser la matrice pour comparer des machines

Chaque fiche peut lister **limites matériaux** et **cutExample**. Croisez avec ce tableau. Si la fiche déconseille un matériau, c'est autoritatif pour ce référence.

Parcourir : [diode](/lasers/type/diode) · [CO₂](/lasers/type/co2) · [fibre](/lasers/type/fiber) · [UV](/lasers/type/uv) · [hybride](/lasers/type/hybrid)

## Suite

- [Types de laser](/guides/understanding-laser-types)
- [Guide d'achat 2026](/guides/laser-buying-guide-2026)
- [Comparateur](/compare)
