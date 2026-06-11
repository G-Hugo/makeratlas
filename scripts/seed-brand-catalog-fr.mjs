import fs from "fs";

const fr = {
  xtool: {
    tagline: "Diode, CO₂, fibre et plateformes galvo modulaires premium pour makers et petits ateliers.",
    knownFor: "Lasers grand public soignés, logiciel solide et l'un des catalogues maker les plus larges.",
    overview: [
      "xTool a démarré avec des graveuses diode accessibles avant de devenir une marque laser complète : portiques, P-series fermées, CO₂ série F, bundles fibre/MOPA et plateforme galvo modulaire T1.",
      "La marque est reconnue pour associer matériel et logiciel utilisable (xTool Creative Space, LightBurn sur beaucoup de SKU) et pour livrer des packs prêts à graver plutôt que de simples châssis nus.",
    ],
    strengths: [
      "Catalogue le plus large côté maker : diode, CO₂, fibre, UV et galvo modulaire",
      "UX et documentation plus cohérentes que beaucoup d'OEM budget",
      "Forte communauté et mises à jour firmware sur les gammes phares",
      "Options fermées (P, S, F) pour un usage plus sûr à la maison ou en classe",
    ],
    weaknesses: [
      "Prix premium face aux portiques chinois à wattage comparable",
      "La feuille de route modules T1 peut coûter plus qu'un hybride intégré si vous achetez toutes les têtes",
      "Workflows propriétaires sur certains modèles ; vérifiez le support LightBurn",
      "Pièces et modules officiels plus chers que les marques DIY",
    ],
    flagship: {
      summary:
        "Le D1 Pro est la diode portique de référence xTool : plusieurs paliers de puissance, grande communauté, et le modèle que la plupart des makers citent quand ils disent avoir un xTool. Bon équilibre surface utile, vitesse et finition sans passer au prix CO₂ fermé.",
    },
  },
  atomstack: {
    tagline: "Decoupeuses diode agressives sur le prix/watt, plus fibre et hybrides.",
    knownFor: "Rapport puissance/prix sur diode et renouvellements produits rapides sous les marques premium.",
    overview: [
      "Atomstack s'est fait connaître avec des lasers portiques à wattage marketing et promotions fréquentes. Les séries A et X visent Etsy, hobby et gravure bois/cuir/acrylique.",
      "Le catalogue inclut aussi fibre galvo et machines hybrides fermées, mais la plupart des acheteurs comparent Atomstack à Sculpfun/Ortur à prix inférieur.",
    ],
    strengths: [
      "Excellent rapport prix/watt sur portiques diode",
      "Large choix de puissances et formats de plateau",
      "Fibre et hybrides sans prix industriel",
      "LightBurn sur beaucoup de modèles récents",
    ],
    weaknesses: [
      "Rigidité du châssis et alignement long terme variables selon les générations",
      "Documentation et SAV moins soignés que xTool ou Glowforge",
      "Le wattage annoncé demande de lire puissance optique vs électrique",
      "Sécurité et fumées en portique ouvert : responsabilité de l'utilisateur",
    ],
    flagship: {
      summary:
        "La gamme A24 Pro est le sweet spot Atomstack : grand plateau diode et puissance élevée sans prix enclosure. Comparez air assist et format face au Sculpfun S30 avant d'acheter.",
    },
  },
  creality: {
    tagline: "Graveuses Falcon de la diode budget au galvo modulaire et hybrides.",
    knownFor: "Réutiliser le réseau Creality (impression 3D) pour vendre des lasers accessibles à grande échelle.",
    overview: [
      "Creality est entré sur le laser sous Falcon, en s'appuyant sur ses canaux retail et son expérience firmware. De la diode entrée de gamme au T1 modulaire et Falcon 2 Pro hybride.",
      "On choisit Creality pour la disponibilité et les bundles — pas toujours pour la meilleure optique sur chaque SKU.",
    ],
    strengths: [
      "Facile à trouver en ligne et en magasin",
      "Bundles Falcon compétitifs pour débuter",
      "T1 modulaire et Falcon 2 Pro pour workflows avancés",
      "Large base utilisateurs pour le dépannage",
    ],
    weaknesses: [
      "Ligne laser plus jeune que l'impression 3D ; QC variable",
      "Temps mort au changement de module T1 vs hybride intégré",
      "Logiciel partagé entre écosystème Creality et outils tiers",
      "Moins bon rapport qualité/prix une fois fibre et MOPA ajoutés",
    ],
    flagship: {
      summary:
        "Le Falcon T1 est le pari galvo modulaire de Creality : une base, têtes diode/fibre/MOPA/UV interchangeables. Phare pour grandir vers le métal ou l'UV sans racheter toute la machine — à condition de chiffrer tous les modules dès le départ.",
    },
  },
  ortur: {
    tagline: "Portiques diode qui ont structuré le marché hobby.",
    knownFor: "Les Laser Master abordables qui ont introduit des milliers de makers à la gravure diode.",
    overview: [
      "Ortur a massifié les lasers portiques avec la série Laser Master. Le catalogue reste 100 % diode : LM, H et Aufero pour débutants et upgraders.",
      "Marque de premier laser si vous acceptez portique ouvert, réglages manuels et entraide communautaire plutôt qu'un écosystème enclosure premium.",
    ],
    strengths: [
      "Prix d'entrée bas et gros marché d'occasion",
      "Gamme diode simple, sans hybrides confus",
      "Communauté active mods/firmware",
      "Plusieurs paliers sur des châssis éprouvés",
    ],
    weaknesses: [
      "Pas de CO₂ ni fibre pour découpe épaisse ou marquage métal profond",
      "Qualité et SAV en retrait des marques premium",
      "Fumées et sécurité oculaire en portique ouvert",
      "Noms LM/H entre générations déroutants pour les débutants",
    ],
    flagship: {
      summary:
        "Laser Master 3 est le portique moderne de référence Ortur : électronique à jour, paliers 10–20W courants, et le modèle comparé à Sculpfun/Atomstack sur le prix.",
    },
  },
  sculpfun: {
    tagline: "Diode du bureau compact au grand format S9 et iCube fermé.",
    knownFor: "Rapport qualité/prix fiable, culture air assist et options S9 grand format.",
    overview: [
      "Sculpfun est dans le même segment qu'Ortur et Atomstack mais mise sur des châssis cohérents, l'air assist et une nomenclature S claire. La famille S30 est un passage fréquent après un 10W hobby.",
      "iCube cible ceux qui veulent contrôler les fumées sans prix CO₂.",
    ],
    strengths: [
      "Structure S6/S9/S30 bien comprise",
      "Bonne découpe à ce prix avec air assist adapté",
      "Grand format pour enseignistes",
      "Ligne iCube pour un atelier plus propre",
    ],
    weaknesses: [
      "Best-sellers souvent en portique ouvert ; pas Classe 1",
      "Haut de gamme chevauche Atomstack/xTool sans leur polish logiciel",
      "Marquage métal = autre machine ou module IR",
      "Documentation variable selon le revendeur",
    ],
    flagship: {
      summary:
        "S30 Pro est le cheval de bataille Sculpfun : diode haute puissance et upgrade populaire. Adaptez le wattage à l'épaisseur réelle de contreplaqué ou acrylique visée.",
    },
  },
  gweike: {
    tagline: "CO₂ bureau et fibre entre diode hobby et découpeuses d'atelier.",
    knownFor: "CO₂ desktop accessibles et options cloud quand la diode ne suffit plus.",
    overview: [
      "Gweike vend CO₂ et fibre pour ceux qui dépassent les limites diode. Les modèles cloud ajoutent une app ; les K-series coupent les matériaux organiques.",
      "À choisir pour la profondeur CO₂ ou le marquage fibre — pas pour le plus petit encombrement bureau.",
    ],
    strengths: [
      "Vraie découpe CO₂ acrylique/bois au-delà de la diode",
      "Galvo fibre pour métal",
      "Fonctions cloud sur certains modèles",
      "Souvent moins cher que CO₂ rebadgés US",
    ],
    weaknesses: [
      "Encombrement, bruit et ventilation importants",
      "Moins de prise en main que Glowforge",
      "Réputation tube variable ; lisez la garantie",
      "Peu adapté aux vrais débutants vs diode fermée",
    ],
    flagship: {
      summary:
        "Cloud Pro illustre le CO₂ connecté Gweike : découpe bureau avec app. Budgétisez extraction, sécurité incendie et espace — pas seulement la machine.",
    },
  },
  longer: {
    tagline: "Ray diode et hybrides aux côtés de l'impression 3D Longer.",
    knownFor: "Portiques Ray5/Ray6 en bundles et SKU hybrides pour tests multi-matériaux.",
    overview: [
      "Longer commercialise Ray en diode et quelques hybrides, souvent vers les clients imprimante 3D. Positionnement valeur et accessoires plutôt qu'enclosure premium.",
      "Vérifiez si les hybrides sont simultanés ou à modules interchangeables avant d'acheter pour bois + métal.",
    ],
    strengths: [
      "Prix compétitifs en diode 20W+",
      "Nomenclature Ray5/Ray6 relativement claire",
      "Hybrides pour tester le marquage métal",
      "LightBurn sur beaucoup de configs",
    ],
    weaknesses: [
      "Notoriété inférieure à xTool ou Creality laser",
      "Marketing hybride parfois flou sur le métal",
      "QC et SAV inégaux dans les retours communauté",
      "Moins d'options fermées qu'iCube ou xTool P",
    ],
    flagship: {
      summary:
        "Ray5 est la plateforme diode la plus citée chez Longer : plusieurs wattages et point de comparaison interne avant Nano/Duo hybrides.",
    },
  },
  acmer: {
    tagline: "Diode budget pour premiers acheteurs.",
    knownFor: "Promotions fréquentes sur portiques 10–20W d'entrée de gamme.",
    overview: [
      "Acmer joue le bas du marché diode avec séries P, S et M. Souvent en soldes pour tester si un laser est utile.",
      "Attendez-vous à montage manuel et performances alignées sur le prix — pas le polish xTool.",
    ],
    strengths: [
      "Parmi les prix les plus bas en 10–20W",
      "Correct pour gravure légère et coupes fines",
      "Catalogue simple sans écosystème modules",
      "Comparaison directe Ortur/TwoTrees",
    ],
    weaknesses: [
      "Alignement châssis et composants variables",
      "SAV et pièces peu clairs long terme",
      "Sécurité portique entièrement sur l'utilisateur",
      "Valeur de revente faible",
    ],
    flagship: {
      summary:
        "P2 est le milieu de gamme Acmer : plus de plateau et de puissance que S/M sans prix premium. Budget air assist et extraction dès le départ.",
    },
  },
  monport: {
    tagline: "CO₂ et fibre avec vente et support orientés Amérique du Nord.",
    knownFor: "CO₂ desktop pour petites entreprises qui quittent la diode.",
    overview: [
      "Monport cible les acheteurs US qui veulent CO₂ ou fibre avec support anglais et garantie plus claire qu'import direct OEM.",
      "Ventilation, espace et courbe d'apprentissage restent à votre charge — Monport simplifie l'achat, pas la physique.",
    ],
    strengths: [
      "Canal support US pour le CO₂",
      "Du K40 desktop aux CO₂ plus grands",
      "Fibre pour bijou et métal",
      "Assez transparent pour un budget pro",
    ],
    weaknesses: [
      "Plus cher que CO₂ chinois nu sur marketplaces",
      "Pas une marque diode bureau hobby",
      "Maintenance CO₂ (tube, miroirs, eau) obligatoire",
      "Fibre = poste de marquage, pas graveuse généraliste",
    ],
    flagship: {
      summary:
        "Le CO₂ 55W desktop est la référence Monport pour passer de la diode : vraie profondeur de coupe acrylique/bois si l'extraction est en place.",
    },
  },
  omtech: {
    tagline: "CO₂ et fibre d'atelier pour enseignes et production légère.",
    knownFor: "Listings orientés business avec grands plateaux et présence revendeur US.",
    overview: [
      "OMTech vend CO₂ et fibre aux enseignes, trophées et ateliers qui dépassent la diode. Polar et armoires privilégient le débit plutôt que le portable.",
      "Budgétisez espace, électricité et extraction — pas seulement le prix affiché.",
    ],
    strengths: [
      "CO₂ plus grands que les marques hobby",
      "Marquage fibre pour production métal",
      "SKU pensés pour acheteurs pro",
      "Pièces et support orientés US",
    ],
    weaknesses: [
      "Surdimensionné pour hobby occasionnel",
      "Coût total élevé (refroidisseur, extraction, place)",
      "Courbe d'apprentissage plus raide que CO₂ consumer fermé",
      "Pas la première marque si vous hésitez encore sur la diode",
    ],
    flagship: {
      summary:
        "Polar représente le CO₂ compact OMTech pour les ateliers entre diode et armoire industrielle. Validez plateau et passthrough selon vos formats de pièces.",
    },
  },
  twotrees: {
    tagline: "Diode low-cost vendues avec les imprimantes TwoTrees.",
    knownFor: "Portiques TTS en promo pour tester la gravure à budget minimal.",
    overview: [
      "TwoTrees propose surtout TTS/TS portiques bon marché, souvent en bundle imprimante. Optimisé prix, pas finition premium.",
      "Lisez les avis par génération ; firmware et châssis changent vite.",
    ],
    strengths: [
      "Prix d'entrée très bas en promotion",
      "Correct pour apprendre LightBurn et bases",
      "Plusieurs tailles TTS",
      "Comparaison simple avec Acmer/Ortur entrée",
    ],
    weaknesses: [
      "Qualité et durabilité en retrait du milieu de gamme",
      "Documentation souvent minimale",
      "Pas pour production ou coupe épaisse",
      "Confiance upgrade inférieure à Sculpfun/xTool",
    ],
    flagship: {
      summary:
        "TTS-55 est le grand plateau TwoTrees sans payer un S9 Sculpfun. Vérifiez l'équerrage et améliorez l'air assist tôt.",
    },
  },
  laserpecker: {
    tagline: "Graveuses compactes et portables pour personnalisation.",
    knownFor: "Lasers de poche qui ont démocratisé la gravure nomade (cadeaux, coques).",
    overview: [
      "LaserPecker occupe une niche : diode ultra-compacte (et quelques hybrides) pilotée par app. Priorité portabilité, pas grands panneaux.",
      "Outil complémentaire — pas un remplacement des découpeuses 400×400 mm.",
    ],
    strengths: [
      "Encombrement minimal et transport facile",
      "Mise en route rapide petits cadeaux/cuir",
      "App accessible aux non-techniciens",
      "Hybrides LP pour marquage métal léger",
    ],
    weaknesses: [
      "Zone de travail minuscule",
      "Peu de découpe vs portiques",
      "Dépendance app sur certains modèles",
      "Prix/watt élevé vs portiques ouverts",
    ],
    flagship: {
      summary:
        "LaserPecker 5 poursuit la ligne compacte phare. Achetez pour la portabilité et la personnalisation, pas la production atelier.",
    },
  },
  algolaser: {
    tagline: "Kits DIY et Alpha MK2 fermées.",
    knownFor: "Proposer kit à monter soi-même ou boîtier fermé Alpha à prix contenu.",
    overview: [
      "AlgoLaser se distingue par kits DIY et ligne Alpha MK2 fermée. Économie si vous montez, ou enclosure d'usine pour les fumées.",
      "Delta couvre le portique classique à plusieurs wattages.",
    ],
    strengths: [
      "Prix kit pour bricoleurs",
      "Enclosure Alpha sans tarif Glowforge",
      "Paliers wattage clairs sur MK2",
      "Delta pour grand format ouvert",
    ],
    weaknesses: [
      "Kit = temps, équerrage et dépannage",
      "Orthographe marque incohérente (AlgoLaser/Algolaser)",
      "Communauté plus petite qu'Ortur/xTool",
      "SAV variable selon région",
    ],
    flagship: {
      summary:
        "Alpha MK2 est le phare fermé : fumées mieux contrôlées à prix diode. Comparez le coût total à xTool P2 ou Sculpfun iCube.",
    },
  },
  commarker: {
    tagline: "Marqueurs galvo fibre et UV pour métal et marquage de précision.",
    knownFor: "Galvo fibre abordables populaires en bijouterie et petites séries métal.",
    overview: [
      "ComMarker fait du marquage galvo — pas de grande découpe. B fibre et Omni UV pour marques permanentes métal/outils/plastiques sensibles.",
      "Extraction, formation sécurité et attentes réalistes obligatoires : ce sont des postes de marquage.",
    ],
    strengths: [
      "Prix d'entrée fibre galvo vs industriel",
      "UV pour plastiques difficiles en fibre",
      "Encombrement benchtop",
      "Communautés bijou/couteaux",
    ],
    weaknesses: [
      "Petit champ vs graveuses portique",
      "Pas pour découper contreplaqué ou grandes enseignes",
      "Extraction obligatoire ; particules métal",
      "Courbe logiciel/paramètres pour débutants",
    ],
    flagship: {
      summary:
        "B4 20W fibre est le marqueur benchtop de référence ComMarker : gravure métal profonde et séries rapides. Prévoyez extraction et lunettes adaptées.",
    },
  },
  comgrow: {
    tagline: "Z1 diode budget, souvent en bundle imprimante 3D.",
    knownFor: "Portiques Z1 d'entrée en packs débutants.",
    overview: [
      "Comgrow laser = surtout Z1 portique à quelques wattages, cross-sell imprimante et promos saisonnières.",
      "Comparable à Acmer/Ortur entrée — comparez prix, plateau et accessoires.",
    ],
    strengths: [
      "Prix bas en bundle",
      "Catalogue simple (Z1)",
      "OK pour apprendre et gravure légère",
      "Comparaison facile avec autres diode entrée",
    ],
    weaknesses: [
      "Peu de différenciation hors prix",
      "SAV et pièces peu établis",
      "Pas pour coupe épaisse ni métal",
      "Sécurité/fumées non gérées par le matériel",
    ],
    flagship: {
      summary:
        "Z1 résume toute l'offre laser Comgrow : choisissez le wattage et traitez-le comme premier portique. Budget air assist et extraction si vous découpez.",
    },
  },
  foxalien: {
    tagline: "Diode compactes pour petits bureaux.",
    knownFor: "Portiques Reisler et LE à faible encombrement.",
    overview: [
      "FoxAlien garde un catalogue étroit de machines compactes. Reisler/LE pour espaces serrés avec plus de plateau qu'un LaserPecker.",
      "Concurrent d'Acmer/TwoTrees, pas des marques enclosure premium.",
    ],
    strengths: [
      "Tailles adaptées appartement",
      "SKU simples sans modules",
      "Souvent en promo entrée de gamme",
      "OK gravure légère et coupes fines",
    ],
    weaknesses: [
      "Catalogue petit, peu de communauté",
      "Qualité inégale vs pairs low-cost",
      "Pas de montée en gamme CO₂/fibre/grand format dans la marque",
      "Documentation et SAV limités",
    ],
    flagship: {
      summary:
        "Reisler 2 est le compact le plus cité : assez de plateau pour le craft sans envahir le bureau. Comparez rigidité et accessoires à Acmer P2.",
    },
  },
  glowforge: {
    tagline: "CO₂ fermés cloud avec UX craft soignée.",
    knownFor: "Rendre le CO₂ accessible aux non-techniciens (caméra, presets matériaux).",
    overview: [
      "Glowforge vend CO₂ fermés workflow cloud, alignement caméra et écosystème matériaux propriétaire. Aura/Pro pour Etsy et écoles qui privilégient la simplicité.",
      "L'expérience coûte plus cher — machine, matériaux et options cloud s'additionnent.",
    ],
    strengths: [
      "Facilité d'usage top pour non-techniciens",
      "Fonctionnement fermé avec extraction intégrée possible",
      "Caméra pour jobs répétables",
      "Forte notoriété marchés craft US",
    ],
    weaknesses: [
      "Machine et consommables plus chers qu'import CO₂",
      "Dépendance cloud et fonctions parfois bridées",
      "Moins flexible que machines LightBurn-first",
      "Modèle QR matériaux propriétaires pas pour tous",
    ],
    flagship: {
      summary:
        "Glowforge Pro est le phare passthrough pour longues pièces avec l'UX la plus simple. Choisissez-le si SAV et enclosure priment sur le coût/watt.",
    },
  },
  atezr: {
    tagline: "Diode budget une seule gamme.",
    knownFor: "Prix parmi les plus bas du segment 10W portique.",
    overview: [
      "Atezr sur Maker Atlas = surtout P2, point de comparaison marché entrée plutôt qu'écosystème large.",
      "Comparez à Acmer, Comgrow Z1 et Ortur LM sur plateau et accessoires.",
    ],
    strengths: [
      "Catalogue minimal facile à lire",
      "Prix bas en soldes",
      "OK pour premiers tests gravure",
      "Pas de complexité modules",
    ],
    weaknesses: [
      "Très peu de présence marque et communauté",
      "SAV et pièces incertains long terme",
      "Peu d'avis indépendants ; alignement variable",
      "Pas de montée en gamme format dans la marque",
    ],
    flagship: {
      summary:
        "P2 est la seule référence Atezr meaningful : comparez ligne par ligne avec Ortur ou Acmer mieux documentés.",
    },
  },
  wecreat: {
    tagline: "Diode fermées Vision avec aide caméra.",
    knownFor: "Boîtiers fermés et alignement visuel pour ateliers plus propres.",
    overview: [
      "WeCreat vend diode fermée avec vision/caméra pour alignement et petites séries. Petit catalogue mais distinct des portiques value.",
      "L'enclosure aide sur les fumées ; vérifiez filtres et évacuation pour votre pièce.",
    ],
    strengths: [
      "Format fermé sans prix CO₂",
      "Caméra pour placement répétable",
      "Bureau plus propre qu'un 20W+ ouvert",
      "Pour crafters qui quittent le portable",
    ],
    weaknesses: [
      "Marque jeune, peu d'avis tiers",
      "Limites toujours diode, pas profondeur CO₂",
      "Écosystème accessoires plus petit que xTool",
      "Historique SAV encore court",
    ],
    flagship: {
      summary:
        "Vision définit WeCreat : diode fermée assistée caméra. Comparez à xTool P2 ou Sculpfun iCube sur prix, filtres et ouverture logicielle.",
    },
  },
};

fs.writeFileSync(
  "content/translations/fr/brands/catalog.json",
  `${JSON.stringify(fr, null, 2)}\n`,
);
console.log(`Wrote FR overlays for ${Object.keys(fr).length} brands`);
