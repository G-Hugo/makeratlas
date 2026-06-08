---
slug: understanding-laser-types
title: "Comprendre les types de laser: CO₂, diode, fibre et UV"
description: Guide clair et honnête sur chaque type de laser utilisé en desktop. Ce que chaque technologie fait vraiment, pour qui, et ce que le marketing se trompe.
category: laser-types
readTime: 28 min
lastUpdated: "2026-06-02"
status: published
---

Choisir une graveuse laser, c'est d'abord choisir une **longueur d'onde** et une **architecture** (portique, galvo, enceinte…). Ce choix détermine les matériaux réalistes, la qualité de finition, la vitesse et le budget atelier complet.

Le piège le plus fréquent : comparer les annonces sur le seul chiffre de watts. Deux machines affichant le même wattage peuvent donner des résultats opposés si la technologie n'est pas la même.


## Vue d’ensemble, puis guides détaillés

Cette page sert de synthese. Pour approfondir un type precis, ouvrez le guide dedie:

| Type | Guide détaillé |
|------|----------------|
| **Diode** | [Lasers diode expliqués](/guides/diode-lasers-explained) |
| **CO₂** | [Lasers CO₂ expliqués](/guides/co2-lasers-explained) |
| **Fibre** (+ MOPA au catalogue) | [Lasers fibre expliqués](/guides/fiber-lasers-explained) |
| **UV** | [Lasers UV expliqués](/guides/uv-lasers-explained) |
| **Hybride** | [Lasers hybrides expliqués](/guides/hybrid-lasers-explained) |

Specialites liees (même ecosysteme, autre ingénierie):

- [Fibre MOPA](/guides/mopa-fiber-lasers-explained): impulsions et couleur inox (classé en `fibre` au catalogue)
- [Stations galvo](/guides/galvo-laser-workstations-explained): balayage miroir fibre, UV et hybride
- [Modules infrarouges](/guides/infrared-laser-modules-explained): têtes 1064 nm sur machines diode (pas de la fibre)
- [Modules vs hybride](/guides/swappable-laser-modules-explained): S1, T1, F1 : ce que vous changez vraiment
- [Watts optiques vs marketing](/guides/laser-wattage-marketing-explained): pourquoi « 40W » trompe
- [Métal sans fibre](/guides/metal-marking-without-fiber): spray, anodisé, CerMark
- [Ouvert vs enceinte](/guides/open-frame-vs-enclosed-lasers): classe 1 et fumée
- [Matériaux par type](/guides/laser-materials-by-type): tableau rapide
- [LightBurn vs logiciel fabricant](/guides/lightburn-vs-maker-software)
- [Gravure rotative](/guides/rotary-laser-engraving): gobelets et cylindres
- [Tubes CO₂](/guides/co2-laser-tubes-explained): verre vs RF
- [Soufflage d'air & table alvéolée](/guides/air-assist-honeycomb-setup) · [Filtres extraction](/guides/laser-exhaust-filters-explained)

---

## Les quatre types que vous croiserez

| Type | Longueur d'onde | Tres bon sur | Limites principales | Budget machine courant |
|------|------------------|---------------|---------------------|------------------------|
| **Diode** | ~450 nm (bleu) | Bois, cuir, ardoise, anodisé | Acrylique transparent, métal nu direct, découpe épaisse | 200 a 1 500 EUR |
| **CO₂** | ~10 600 nm (IR) | Acrylique, bois, cuir, caoutchouc | Métal nu direct, logistique ventilation plus lourde | 500 a 5 000 EUR et plus |
| **Fibre** | ~1 064 nm (IR) | Marquage métal nu, petites pieces, cadence | Bois/acrylique, grandes zones de travail plates | 1 500 a 10 000 EUR et plus |
| **UV** | ~355 nm (UV) | Plastiques sensibles, verre fin, detail | Découpe de panneaux, retour sur investissement grand public | 2 000 a 15 000 EUR et plus |

---

### Choisir le type par matériau

Matériau principal:

- Bois et cuir, surtout gravure ou petites découpes: **Diode**
- Acrylique transparent et découpe organique reguliere: **CO₂**
- Acier, laiton ou aluminium nus au quotidien: **Fibre**
- Plastiques sensibles a la chaleur, marquage tres fin: **UV**
- Métal et bois dans un seul boîtier compact: **Hybride**

Les fiches machines listent `cutExample` et `engraveExample` par référence. C'est le meilleur point de depart une fois la technologie choisie. Voir aussi le [guide d'achat 2026](/guides/laser-buying-guide-2026).

## Lasers diode: l’entrée la plus populaire

Une diode semi-conductrice envoie un faisceau bleu focalise. C'est l'entree de gamme la plus repandue en atelier personnel.

### Ce que les diodes font bien

- Gravure bois, cuir, ardoise et pierre sombre
- Marquage direct de l'aluminium anodisé
- Marquage de l'inox avec un spray de marquage adapte
- Découpe de tilleul fin, acrylique noir, papier et tissu en plusieurs passes

### Ce qu’elles ne font pas honnêtement

- **Découpe de l'acrylique transparent**: le faisceau traverse la matiere
- **Marquage métal nu** fiable sans prétraitement
- **Cadence de découpe CO₂** sur panneaux épais
- **Production encadree** sans ajouter extraction et sécurité autour d'un portique ouvert

### La confusion sur les watts (à lire)

Quand vous voyez 20 W ou 40 W sur une diode, verifiez s'il s'agit de:

- **Puissance optique / de sortie**: l'énergie qui atteint reellement la matiere
- **Puissance combinée / électrique**: un chiffre marketing souvent superieur

Un module annonce a 40 W peut sortir autour de 10 a 15 W optiques. Cherchez la puissance optique dans la fiche et validez avec des tests de découpe comparables.

### Pour qui acheter une diode ?

- Débutants qui apprennent les bases
- Activites cadeaux bois et cuir
- Ateliers avec budget limite
- Utilisateurs qui n'ont pas besoin d'acrylique transparent en routine

La diode frustre vite si le coeur du travail est le métal nu, l'acrylique transparent ou la découpe de panneaux en série.

---

## Lasers CO₂: la découpe organique

Le CO₂ utilisé un tube qui emet un faisceau infrarouge autour de 10 600 nm. Cette longueur d'onde est tres bien absorbée par l'acrylique et beaucoup de matieres organiques.

### Ce que les CO₂ font bien

- Découpe et gravure de l'acrylique transparent et colore
- Découpe bois plus rapide et plus profonde qu'une diode
- Gravure cuir, caoutchouc et surfaces revetues
- Production reguliere sur matériaux organiques

### Ce qu’ils ne font pas honnêtement

- **Marquage direct du métal nu**
- **Usage en interieur sans extraction**
- **Exploitation sereine** sans enceinte, filtration et procedures incendie
- **Duree illimitee**: les tubes verre s'usent et se remplacent

### La sécurité n’est pas négociable

Un atelier CO₂ doit inclure:

1. **Extraction** vers l'exterieur ou filtration dimensionnee
2. **Plan incendie** avec surveillance active des découpes
3. **Enceinte** et interverrouillages fonctionnels

### Pour qui acheter un CO₂ ?

- Activites enseigne et objets acrylique
- Petites structures qui decoupent bois et cuir en continu
- Ateliers equipes pour ventilation et sécurité
- Utilisateurs qui ont atteint la limite de découpe d'une diode

Le CO₂ n'est pas coherent si vous ne faites que du métal, si l'extraction est impossible, ou si le budget global est trop serre.

---

## Lasers fibre: le spécialiste métal

La fibre produit un faisceau 1064 nm tres efficace sur les métaux. C'est la technologie de référence pour marquage et gravure métal en petite et moyenne série.

Les variantes **MOPA** gardent la même longueur d'onde mais permettent un contrôle fin des impulsions, utile pour certains rendus couleur sur inox. Voir [MOPA expliqué](/guides/mopa-fiber-lasers-explained). La majorite des machines fibre de bureau sont basees sur une tête **galvo**: [stations galvo](/guides/galvo-laser-workstations-explained).

### Ce que la fibre fait bien

- Marquage inox, aluminium, laiton et cuivre sans spray
- Cadence elevee sur logos, numéros de série et codes
- Detaill fin sur petites pieces métal
- Longue duree de vie de la source

### Ce qu’elle ne fait pas honnêtement

- Découpe productive du bois ou de l'acrylique
- Remplacement d'un CO₂ pour enseigne grand format
- Grande zone de travail plane a faible cout
- Enlevement de matiere type fraisage CNC profond

### Pour qui acheter une fibre ?

- Ateliers dont la matiere principale est le métal
- Production de plaques, outillage, bijouterie et pieces techniques
- Utilisateurs qui priorisent repetition et nettete sur petites pieces

Si votre quotidien est surtout bois, acrylique ou cuir, une autre technologie sera plus pertinente.

---

## Lasers UV: précision sur matériaux délicats

Le laser UV travaille autour de 355 nm. Sur certains matériaux, il retire la matiere avec peu de diffusion thermique. On parle souvent d'ablation "a froid".

### Ce que l’UV fait bien

- Marquage de plastiques sensibles a la chaleur
- Gravure fine sur verre et surfaces delicates
- Applications electroniques et marquages de precision
- Traits tres fins sur petites zones

### Ce qu’il ne fait pas honnêtement

- Découpe de matériaux épais
- Rentabilite rapide pour un usage loisir generaliste
- Remplacement d'une fibre pour gravure métal profonde

### Pour qui acheter un UV ?

- Ateliers avec besoin precis sur plastique technique ou verre
- Activites qui vivent de la finesse de marquage
- Utilisateurs déjà equipes d'une premiere machine plus generaliste

---

## Machines hybrides: fibre + diode dans une boîte

Les **hybrides fixes** combinent deux sources dans un même châssis, en général fibre pour le métal et diode pour les matériaux organiques. Le basculement se fait en logiciel, sans fusion des faisceaux.

Les **systèmes a tête interchangeable** sont differents: on monte un module a la fois. Même châssis, mais une seule source active.

| Point cle | Hybride fixe | Tête interchangeable |
|---|---|---|
| Sources disponibles | Deux sources intégrées | Une source montee a la fois |
| Changement au quotidien | Bascule logicielle | Changement physique de tête |
| Positionnement achat | Poste multi-usage compact | Plateforme evolutive |

Comparaisons par produit (quelle annonce est quoi) : [hybrides](/guides/hybrid-lasers-explained) · [modules interchangeables](/guides/swappable-laser-modules-explained)

En pratique, l'hybride a du sens si vous devez traiter métal et bois sur le même bureau, avec une zone de travail souvent compacte. C'est plus cher. Beaucoup de débutants avancent plus vite avec une seule technologie qui couvre 80 % de leurs commandes.

---

## Gravure vs découpe: la différence

| Critère | Gravure | Découpe |
|---|---|---|
| Objectif | Retirer de la matiere en surface | Traverser la matiere pour separer |
| Réglages usuels | Vitesse plus elevee, énergie plus basse | Vitesse plus basse, énergie plus haute |
| Nombre de passes | Souvent une | Souvent plusieurs |
| Technologie dominante | Diode, CO₂, fibre, UV selon matériau | Surtout CO₂ et diode selon épaisseur |

Beaucoup de mauvais achats viennent d'une confusion entre gravure et découpe. Definissez d'abord votre projet dominant:

- Sous-verres graves: la gravure prime, la diode suffit souvent
- Panneaux acrylique transparent: la découpe prime, CO₂ requis
- Medailles métal nues: fibre recommandee, spray possible en depannage

---

## Arbre de décision rapide

1. Lister les trois matériaux que vous vendez le plus
2. Noter pour chacun: gravure de surface ou découpe traversante
3. Choisir la technologie qui couvre le mieux ces trois cas
4. Verifier ensuite la zone de travail, l'extraction et le budget accessoires

Raccourci utile:

- Bois et cuir cadeau: diode
- Acrylique transparent et découpe reguliere: CO₂
- Métal nu quotidien: fibre
- Matériaux sensibles et marquage tres fin: UV
- Doubles besoins métal + organique sur petit poste: hybride

---

## Glossaire

| Terme | Signification |
|-------|---------------|
| **Puissance optique** | Puissance réelle du faisceau au point d'usage; le chiffre utile pour comparer |
| **Zone de travail** | Dimensions maximales de la piece traitee en un positionnement |
| **Soufflage d'air** | Air envoye pres de la buse pour limiter charbon et flammes |
| **Galvo** | Tête a miroirs rapides qui balaie un petit champ sans deplacer la piece |
| **Passe** | Parcours complet du laser sur le même trace |
| **Mise au point** | Distance optique ou le spot est le plus fin, donc le plus efficace |

---

## Aller plus loin

Lisez le [guide d'achat laser 2026](/guides/laser-buying-guide-2026) pour un parcours par budget. Prévoyez la [ventilation avant l'arrivee de la machine](/guides/laser-ventilation-setup), puis comparez les références dans [toutes les fiches](/lasers).

Le meilleur laser est celui qui correspond a vos matériaux et a votre cadence réelle, pas au plus gros watt affiche.
