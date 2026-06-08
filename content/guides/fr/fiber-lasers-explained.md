---
slug: fiber-lasers-explained
title: "Lasers fibre expliqués : marquage métal à 1064 nm"
description: "Fibre standard pour inox, alu, laiton, galvo, MOPA, et pourquoi le module IR S1 n'est pas une fibre."
category: laser-types
readTime: 24 min
lastUpdated: "2026-06-02"
status: published
---

Le laser **fibre** autour de 1 064 nm est la technologie la plus directe quand le métal nu est au centre de l'activite. Inox, aluminium, laiton et cuivre peuvent être marques de façon rapide et repetable sans passer par des consommables de marquage.

Cette famille est souvent mal comprise. On la confond avec des modules infrarouges de faible puissance, avec des annonces MOPA peu detaillees, ou avec des boîtiers hybrides qui melangent plusieurs sources. Cette page clarifie le vocabulaire et les limites réelles.


## Référence rapide

| Sujet | Ce qu'il faut retenir |
|-------|-----------------------|
| Longueur d'onde | ~1064 nm (infrarouge) |
| Meilleurs matériaux | Métaux nus et revêtus, certains plastiques (procédé-dépendant) |
| Matériaux faibles | Bois, acrylique, cuir, organiques |
| Optique typique | Champ galvo (souvent 100–220 mm) |
| Classe puissance | Couramment 20W–60W+ marquage bureau |
| Libellé marché | Vendu comme fibre ; MOPA indiqué dans le nom ou specs |


Les sections suivantes detailent les arbitrages de production et d'integration atelier.

---

## Comment le marquage fibre fonctionne

Une **source fibre** utilisé une fibre optique dopee comme milieu amplificateur. Le faisceau infrarouge est ensuite dirige par une tête **galvo**, c'est-a-dire un ensemble de miroirs rapides qui balaient un champ defini.

Ce principe permet des vitesses elevees sur des petites pieces et des marquages repetables en série.

### Pourquoi 1064 nm domine le marquage métal

Les métaux absorbent bien cette longueur d'onde. L'énergie deposee en surface cree des contrastes, des oxydations controlees ou une gravure superficielle selon les réglages.

Le mecanisme differe d'une diode avec spray, ou une couche intermédiaire fait l'essentiel du rendu visuel.

### Marquage vs gravure profonde

Le **marquage** est rapide et peu profond, ideal pour logos, références et codes.

La **gravure profonde** existe, mais le debit d'enlevement matiere reste limite face a une machine d'usinage mecanique. Une fibre ne remplace pas un centre de fraisage.

La qualité finale depend d'un ensemble de paramètres: puissance, vitesse, frequence, hachurage et nombre de passes.

---

## Ce que la fibre fait très bien

### Inox, aluminium, laiton, cuivre

Bijouterie production, lames de couteau, plaques chien, étiquettes industrielles et objets promo métal sont des applications fibre de base. L'aluminium anodisé peut aussi être marqué avec réglage procédé, bien que certains ateliers préfèrent la diode pour grands panneaux anodisés.

### Détail fin dans petits champs

Les petites pieces beneficient fortement du balayage galvo: texte fin, details repetes et cycles courts en lot. Cette logique explique le format compact de nombreuses stations fibre.

### Longue durée de vie source

Les sources fibre annoncent souvent une longue duree de vie comparee aux tubes CO₂ verre. L'entretien se concentre alors sur l'optique, les gabarits et la stabilité process.

---

## Ce que la fibre ne fait pas honnêtement

- Découper bois ou acrylique de façon productive (mauvaise absorption longueur d'onde)
- Remplacer le CO₂ pour enseignes et découpe organique épaisse
- Graver des **pleines feuilles** sans tuilage dans un petit champ galvo
- Égaler les débits d'enlèvement métal CNC pour poches 3D profondes
- Tourner sans **extraction fumées** même enceinte (particules métal et odeurs)

---

## Taille du champ galvo : le choc ergonomique

La plupart des fibres de bureau utilisent une **tête galvo**. Le faisceau balaie une zone de travail carree pendant que la piece reste fixe.

Les valeurs courantes tournent autour de 100 a 220 mm de cote selon la lentille. Dans cette zone, la cadence est elevee. En dehors, il faut tuiler le motif ou repositionner.

Ce point est central pour l'achat: une fibre peut être excellente pour des lots de petites pieces, moins adaptee aux grandes surfaces en une passe.

→ [Stations galvo expliquées](/guides/galvo-laser-workstations-explained)

---

## Fibre vs diode + spray vs CO₂ + CerMark

| Approche | Convient pour | Compromis |
|----------|------------|-----------|
| **Fibre** | Production métal quotidienne, bijouterie, outils | Prix d'entrée plus élevé, champ petit |
| **Diode + spray** | Cadeaux métal occasionnels, faible volume | Consommables, plus lent, durabilité variable |
| **CO₂ + CerMark** | Ateliers déjà CO₂ pour organiques | Étape supplémentaire, pas natif métal nu |

Regle empirique: quand le métal represente la majorite du temps machine, la fibre devient vite plus rentable et plus stable. Si le métal reste occasionnel, les solutions a spray peuvent suffire.

→ [Marquage métal sans fibre](/guides/metal-marking-without-fiber)

---

## MOPA : même longueur d'onde, autre moteur d'impulsion

Le **MOPA** (Master Oscillator Power Amplifier) garde la même longueur d'onde mais ajoute un contrôle plus fin des impulsions. Ce contrôle ouvre des fenêtres process utiles, notamment pour certains rendus couleur sur inox.

Un MOPA reste une fibre. Le surcout paie surtout la flexibilite process, pas un changement de famille laser.

Quand payer le premium :
- La couleur inox fait partie de votre marque
- Vous faites des lots production et le réglage impulsion réduit la retouche

Quand passer :
- Premier laser pour cadeaux bois
- Marques acier niveaux de gris sur fibre standard suffisent

→ [Fibre MOPA expliquée](/guides/mopa-fiber-lasers-explained)

---

## Pas la même chose que les modules IR sur enceintes diode

Des accessoires IR de faible puissance peuvent aussi afficher 1064 nm. Cela ne suffit pas a les assimiler a une station fibre.

La différence porte sur la puissance utile, l'optique, la cadence et la repetition process.

→ [Modules infrarouges expliqués](/guides/infrared-laser-modules-explained)

---

## Hybrides et plateformes modulaires

Les **hybrides intégrés** embarquent fibre + diode dans un boîtier galvo et basculent en logiciel.

Les **bases galvo modulaires** permettent d'installer **un module source à la fois** (diode, fibre, MOPA ou UV) sur un même châssis.

Les deux touchent l'économie de la fibre mais servent des agencements différents. Comparaisons produit par produit :

→ [Hybrides expliqués](/guides/hybrid-lasers-explained)  
→ [Modules interchangeables](/guides/swappable-laser-modules-explained)

---

## Configuration atelier pour une fibre

La fibre est compacte mais demande de la rigueur:
- Gabarits adaptes pour repetabilite
- Mise au point stable sur chaque référence
- Extraction dimensionnee pour les emissions de marquage

Mesurer la plus grande piece en amont permet d'éviter une mauvaise surprise de zone de travail.

→ [Configuration ventilation](/guides/laser-ventilation-setup)  
→ [LightBurn vs logiciel fabricant](/guides/lightburn-vs-maker-software)

---

## Premier mois en atelier

**Semaine 1 :** Valider enceinte, interlocks et extraction avant marquage client.

**Semaine 2 :** Tests sur chutes de chaque alliage cible (inox 304, laiton, alu anodisé).

**Semaine 3 :** Construire presets par matière : vitesse, fréquence, hachure, passes.

**Semaine 4 :** Lancer un lot pilote de 20 pièces identiques pour mesurer dérive et temps réel.

**En continu :** Re-tester quand le fournisseur change de nuance métal ; les alliages changent le contraste sans prévenir.

→ [Gravure rotative](/guides/rotary-laser-engraving)

---

## Scénarios concrets : fibre ou alternative ?

| Scénario | Fibre pertinente ? | Alternative |
|----------|-------------------|-------------|
| 50 bagues inox par semaine | Oui | Hybride si aussi bois petit format |
| 5 gobelets alu anodisé par mois | Non obligatoire | Diode sur anodisé |
| Enseignes acrylique 400 mm | Non | CO₂ |
| Plaques industrielles DataMatrix | Oui | Service sous-traité si volume faible |
| Couteaux gravés + planches bois | Hybride ou deux machines | Fibre seule si bois délégué |

---

## Sécurité et extraction

Les boîtiers fibre enceinte atteignent souvent **classe 1 capot fermé**. Le marquage métal produit quand même des **particules et parfois des odeurs** sur métaux revêtus. Évacuez vers filtre ou extérieur pour longues sessions.

Ne contournez jamais les interlocks. Les faisceaux infrarouge invisibles ne sont pas des avertissements visuels.

→ [Bases sécurité laser](/guides/laser-safety-basics)

---

## Pour qui acheter une fibre ?

**Bon profil :**
- Bijouterie, couteaux, outils, produits promo métal
- Marquage métal nu quotidien sans spray
- Tailles de lots qui tiennent dans les champs galvo
- Budget pour machine **et** extraction **et** temps gabarits

**Mauvais profil :**
- Revenu principal enseignes acrylique ou planches à découper bois
- Besoin de gravures pleine image 300 mm sans tuilage
- Métal occasionnel seulement (spray sur diode peut suffire)

---

## Erreurs fréquentes

| Erreur | Réalité |
|--------|---------|
| Acheter fibre pour atelier bois+acrylique | Mauvaise longueur d'onde ; prenez CO₂ ou diode |
| Attendre ergonomie grand lit | Le champ galvo est la contrainte produit |
| Confondre accessoire IR basse puissance et fibre galvo | Même nm sur papier, pas même capacité |
| Sauter les échantillons matière | Alliage et finition changent la qualité de marque |
| Ignorer extraction parce que « c'est enceinte » | Poussière et fumées métal demandent quand même gestion |

---

## Avant d'acheter : dimensionner le passage, puis filtrer les annonces

1. Mesurer la **plus grande pièce** ; au-delà de ~150–200 mm, prévoir tuilage ([galvo](/guides/galvo-laser-workstations-explained))  
2. Ouvrir le [catalogue fibre](/lasers/type/fiber) et filtrer par **zone (mm)** et watts  
3. Pour **couleur inox**, chercher MOPA dans le nom ou specs; voir [MOPA](/guides/mopa-fiber-lasers-explained) pour le procédé, pas l'achat  
4. Si vous vendez aussi du bois sur le même bureau, comparer [hybride](/guides/hybrid-lasers-explained) vs fibre seule  
5. Lire exemples gravure sur chaque fiche ; l'alliage compte

→ [Métal sans fibre](/guides/metal-marking-without-fiber)

## Parcourir profils fibre et MOPA

Voir les [machines type fibre](/lasers/type/fiber). Filtrez par zone de travail, MOPA dans le nom et notes logiciel.

## Suite

- [Fibre MOPA expliquée](/guides/mopa-fiber-lasers-explained)  
- [Stations galvo expliquées](/guides/galvo-laser-workstations-explained)  
- [Guide d'achat 2026](/guides/laser-buying-guide-2026)
