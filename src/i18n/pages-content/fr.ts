import type { Dictionary } from "@/i18n/dictionaries/types";

/** Extended copy for info & legal pages (FR). */
export const pagesContentFr: Pick<
  Dictionary,
  "infoPage" | "aboutContent" | "methodologyContent" | "transparencyContent" | "legal"
> = {
  infoPage: {
    breadcrumbHome: "Accueil",
    relatedTitle: "Sur ce sujet",
    relatedMethodology: "Construction des fiches et benchmarks",
    relatedTransparency: "Indépendance, affiliation et corrections",
    relatedAbout: "Mission et principes éditoriaux",
    relatedLegal: "Éditeur, hébergeur et responsabilité",
    relatedPrivacy: "Données personnelles et vos droits",
    relatedCookies: "Cookies et traceurs",
  },
  aboutContent: {
    whyTitle: "Pourquoi Maker Atlas existe",
    whyBody:
      "Choisir une graveuse laser ne devrait pas passer par dix onglets ouverts, des avis YouTube contradictoires et le doute sur ce que signifie vraiment « 40 W ». Maker Atlas est la référence structurée qui manquait : limites honnêtes, benchmarks comparables et guides pensés pour l’atelier, pas pour recopier les fiches constructeur.",
    principlesTitle: "Principes éditoriaux",
    principles: [
      "Limites d’abord : chaque fiche indique ce que la machine ne fait pas bien",
      "Langage clair : résumé en haut, détails techniques quand vous en avez besoin",
      "Comparaison équitable : mêmes formats de test pour comparer les temps entre modèles",
      "Couverture large : marques et puissances pertinentes, pas seulement les liens affiliés",
      "Méthode publique : notation, prix et mises à jour expliqués ouvertement",
    ],
    whoTitle: "Pour qui",
    whoBody:
      "Makers loisir, artisans et petits ateliers qui veulent une vue d’ensemble fiable avant d’investir. Nous ne sommes pas revendeurs et nous ne remplaçons ni le SAV constructeur ni la formation sécurité.",
    coverageTitle: "Ce que nous couvrons",
    coverageBody:
      "Graveuses laser et machines maker associées (diode, CO₂, fibre, UV, hybrides), avec variantes de puissance lorsque le fabricant vend plusieurs modules. Les guides couvrent l’achat, les types de laser et les bases sécurité.",
    ctaTitle: "Par où commencer",
    ctaBody: "Nouveau en gravure laser ? Lisez ceci avant de comparer les machines :",
    ctaBuying: "Guide d’achat laser 2026",
    ctaTypes: "Comprendre les types de laser",
    ctaCatalog: "Parcourir le catalogue",
  },
  methodologyContent: {
    profileTitle: "Contenu de chaque fiche machine",
    profileItems: [
      "Limites matériaux : gravure, découpe et « ne convient pas pour »",
      "Gammes multi-puissances : pages distinctes par module d’usine quand il existe plusieurs watts",
      "Benchmarks de référence : temps gravure/découpe sur un format 10×10 cm fixe",
      "Notes éditoriales (1–10) : global, rapport qualité-prix, simplicité, capacités, finition",
      "Spot laser vs précision de déplacement : détail optique vs précision du châssis",
      "Date de dernière mise à jour visible",
    ],
    powerTitle: "Changement de puissance sur une gamme",
    powerBody:
      "Lorsque vous sélectionnez une autre puissance sur une même ligne produit, les données liées au module se mettent à jour : temps de benchmark, taille du spot, note capacités, matériaux coupables. La surface utile et la précision de déplacement restent en général identiques sur le même châssis.",
    pricesTitle: "Prix (USD et EUR)",
    pricesBody:
      "Les prix sont saisis en USD. L’EUR affiché utilise un taux fixe indicatif 1 USD ≈ {rate} EUR, hors change en direct, TVA, livraison et douanes. Vérifiez toujours prix et référence chez le vendeur.",
    benchmarkTitle: "Benchmarks de performance",
    benchmarkBody:
      "Les temps sont des estimations éditoriales pour des travaux de référence standardisés, pas des certificats de laboratoire. Ils servent à comparer équitablement ; vos matériaux et réglages changeront les résultats réels.",
    precisionTitle: "Champs « précision »",
    precisionBody:
      "La taille du spot laser influence le détail en gravure et varie souvent avec la puissance optique. La précision de déplacement (ex. 0,01 mm) décrit le châssis, souvent identique sur toute la gamme.",
    ratingsTitle: "Notes (1–10)",
    ratingsBody:
      "Scores éditoriaux relatifs à la catégorie et au prix. Un 7/10 signifie une bonne machine avec des compromis clairs, pas une note scolaire.",
    updatesTitle: "Mises à jour",
    updatesBody:
      "Les fiches sont révisées quand les lignes, modules ou specs majeures changent. La date affichée reflète une revue éditoriale, pas une mise à jour prix en temps réel.",
    correctionsTitle: "Corrections",
    correctionsBody: "Une erreur ? Consultez",
    disclaimer:
      "Maker Atlas est un contenu d’information, pas un conseil professionnel en sécurité, juridique ou ingénierie. Suivez les manuels constructeur et la réglementation locale.",
  },
  transparencyContent: {
    affiliateTitle: "Liens affiliés",
    affiliateBody:
      "Aujourd’hui : aucun lien affilié sur le site. Lorsque nous en ajouterons, ils seront clairement signalés et n’influenceront ni les notes ni les machines couvertes.",
    independenceTitle: "Indépendance éditoriale",
    independenceItems: [
      "Les notes sont définies avant toute monétisation sur une page donnée",
      "Nous couvrons des marques sans affiliation lorsque les makers les recherchent encore",
      "Les allégations marketing sont recoupées avec la puissance optique et le type de laser",
    ],
    refuseTitle: "Ce que nous refusons",
    refuseItems: [
      "Présenter des watts combinés comme puissance optique sans nuance",
      "Promettre découpes ou matériaux sans épaisseur ni type de laser",
      "Faux tests « main » quand le contenu est éditorial et basé sur specs",
      "Masquer les configurations hybrides ou multi-modules derrière une seule pastille de puissance",
    ],
    correctionsTitle: "Corrections et contact",
    correctionsBody:
      "Signalez une erreur avec l’URL de la page et une source (manuel, annonce, photo) si possible. E-mail :",
    safetyTitle: "Sécurité",
    safetyBody:
      "Les lasers peuvent blesser, enflammer des matériaux et produire des fumées toxiques. Lisez notre",
    legalHintTitle: "Informations légales",
    legalHintBody: "Mentions légales, confidentialité et cookies :",
  },
  legal: {
    lastUpdatedLabel: "Dernière mise à jour : {date}",
    notice: {
      title: "Mentions légales",
      subtitle: "Informations légales relatives au site maker-atlas.com (LCEN).",
      sections: [
        {
          title: "Éditeur du site",
          paragraphs: [
            "Site : {url}",
            "Éditeur : {publisher}",
            "Contact : {email}",
            "Adresse postale : {address}",
            "Pays : {country}",
          ],
        },
        {
          title: "Directeur de la publication",
          paragraphs: [
            "Le directeur de la publication est responsable du contenu éditorial : {publisher}.",
          ],
        },
        {
          title: "Hébergement",
          paragraphs: [
            "Hébergeur : {host}",
            "Adresse : {hostAddress}",
          ],
        },
        {
          title: "Propriété intellectuelle",
          paragraphs: [
            "Les textes, la structure et les visuels originaux de {site} sont protégés par le droit d’auteur. Les marques, logos et visuels produits restent la propriété de leurs titulaires et sont utilisés à titre d’identification et de commentaire.",
            "Courtes citations autorisées avec lien vers la page source. L’extraction automatisée du catalogue complet à des fins de republication est interdite sans accord écrit.",
          ],
        },
        {
          title: "Responsabilité",
          paragraphs: [
            "Les informations sur {site} sont fournies à titre informatif. Nous visons l’exactitude sans garantir l’exhaustivité ni la conformité à chaque révision de SKU.",
            "L’utilisation d’équipements laser est sous votre responsabilité. Respectez les manuels, la ventilation et la réglementation applicable (y compris classe laser et EPI).",
          ],
        },
        {
          title: "Signalement de contenu illicite",
          paragraphs: [
            "Pour signaler un contenu manifestement illicite : {email}, en précisant l’URL et les motifs.",
          ],
        },
      ],
    },
    privacy: {
      title: "Politique de confidentialité",
      subtitle: "Traitement des données personnelles (RGPD) lors de l’utilisation de Maker Atlas.",
      sections: [
        {
          title: "Responsable du traitement",
          paragraphs: [
            "Responsable : {publisher}",
            "Contact données personnelles : {email}",
          ],
        },
        {
          title: "Données collectées",
          paragraphs: [
            "Lors de la navigation, l’hébergeur et d’éventuels outils de mesure d’audience peuvent traiter des données techniques (adresse IP, navigateur, pages vues, région approximative) pour sécuriser et améliorer le service.",
            "Si vous nous écrivez, nous traitons votre adresse, le contenu du message et les informations que vous choisissez d’y joindre pour vous répondre.",
            "Nous ne vendons pas vos données personnelles.",
          ],
        },
        {
          title: "Finalités et bases légales",
          paragraphs: [
            "Intérêt légitime : exploitation, sécurisation et amélioration d’un site de référence éditorial.",
            "Consentement : pour les cookies non essentiels lorsque requis (voir la page Cookies).",
            "Exécution de mesures précontractuelles : uniquement si vous nous contactez pour une demande précise.",
          ],
        },
        {
          title: "Durée de conservation",
          paragraphs: [
            "Les journaux serveur sont conservés pour une durée limitée compatible avec la sécurité, puis supprimés ou anonymisés.",
            "Les e-mails sont conservés le temps de traiter votre demande et des obligations légales.",
          ],
        },
        {
          title: "Vos droits",
          paragraphs: [
            "Vous disposez notamment des droits d’accès, de rectification, d’effacement, de limitation, d’opposition, de portabilité et de retrait du consentement le cas échéant.",
            "Vous pouvez introduire une réclamation auprès de la CNIL (www.cnil.fr) ou de l’autorité de votre pays.",
            "Pour exercer vos droits : {email} avec les éléments permettant de traiter votre demande.",
          ],
        },
        {
          title: "Transferts hors UE",
          paragraphs: [
            "L’hébergeur peut traiter des données aux États-Unis ou dans d’autres pays. Le cas échéant, des garanties appropriées (clauses contractuelles types, etc.) sont mises en place.",
          ],
        },
      ],
    },
    cookies: {
      title: "Politique de cookies",
      subtitle: "Cookies et traceurs utilisés sur Maker Atlas.",
      sections: [
        {
          title: "Définition",
          paragraphs: [
            "Un cookie est un petit fichier déposé sur votre terminal. Des technologies similaires existent (stockage local, pixels).",
          ],
        },
        {
          title: "Cookies utilisés",
          paragraphs: [
            "Cookies strictement nécessaires : fonctionnement de base (ex. préférence de langue, sécurité). Ils ne requièrent pas de consentement au sens de la directive ePrivacy.",
            "Mesure d’audience : si activée, nous pouvons utiliser des statistiques respectueuses de la vie privée, sans profilage publicitaire. Vous serez informé avant tout dépôt non essentiel.",
          ],
          list: [
            "Pas de cookies publicitaires ou de réseaux sociaux sur le catalogue éditorial à ce jour.",
            "Les contenus tiers intégrés (ex. vidéos futures) peuvent déposer leurs propres traceurs ; ils seront signalés le cas échéant.",
          ],
        },
        {
          title: "Gérer vos choix",
          paragraphs: [
            "Vous pouvez supprimer ou bloquer les cookies via les paramètres du navigateur. Bloquer les cookies essentiels peut affecter la langue ou certaines fonctions.",
            "Pour les visiteurs de l’UE/EEE, un bandeau de consentement apparaîtra lorsque nous activerons des cookies non essentiels.",
          ],
        },
      ],
    },
  },
};
