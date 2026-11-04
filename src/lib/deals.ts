import type { Locale } from "@/i18n/config";
import type { FaqItem } from "@/components/seo/SeoFaqSection";

/**
 * Sale tracker for the Black Friday / Cyber Monday window.
 *
 * `usualPrice` is the official-store price we recorded in October 2026, before
 * the sale season. The saving shown on the page is measured against it, never
 * against the store's own crossed-out "was" price, which is often inflated.
 */
export const DEALS_CHECKED_ON = "2026-11-04";

export interface Deal {
  slug: string;
  /** Official-store price on DEALS_CHECKED_ON, USD. */
  price: number;
  /** Official-store price we recorded in October 2026, USD. */
  usualPrice: number;
  /** The crossed-out price the store displays next to the sale price. */
  storeWasPrice?: number;
  storeUrl: string;
  store: string;
  configuration: Record<Locale, string>;
}

export const DEALS: Deal[] = [
  {
    slug: "xtool-f1-ultra",
    price: 2549,
    usualPrice: 2999,
    storeWasPrice: 2999,
    store: "xTool",
    storeUrl: "https://www.xtool.com/products/xtool-f1-ultra-20w-fiber-diode-dual-laser-engraver",
    configuration: { en: "Standalone machine", fr: "Machine seule" },
  },
  {
    slug: "xtool-s1-40w",
    price: 1448,
    usualPrice: 1699,
    storeWasPrice: 2199,
    store: "xTool",
    storeUrl: "https://www.xtool.com/products/xtool-s1-laser-cutter",
    configuration: { en: "40W Basic Bundle", fr: "Pack Basic 40 W" },
  },
  {
    slug: "monport-gt-50w-fiber",
    price: 3199,
    usualPrice: 3530,
    storeWasPrice: 4999.99,
    store: "Monport",
    storeUrl: "https://monportlaser.com/products/gt-50w-autofocus-fiber-laser-engraver",
    configuration: { en: "GT 50W with autofocus, machine only", fr: "GT 50 W autofocus, machine seule" },
  },
  {
    slug: "acmer-s2-pro-36w",
    price: 549,
    usualPrice: 599,
    storeWasPrice: 799,
    store: "Acmer",
    storeUrl: "https://www.acmerlaser.com/products/acmer-s2-pro-laser-engraver",
    configuration: { en: "36W Basic Pack", fr: "Pack Basic 36 W" },
  },
  {
    slug: "atomstack-a70-max",
    price: 1519,
    usualPrice: 1639,
    storeWasPrice: 2099.99,
    store: "Atomstack",
    storeUrl: "https://www.atomstack.com/products/atomstack-a70-max",
    configuration: { en: "Machine only (US plug)", fr: "Machine seule (prise US)" },
  },
  {
    slug: "xtool-p3",
    price: 6599,
    usualPrice: 6999,
    store: "xTool",
    storeUrl: "https://www.xtool.com/products/xtool-p3-the-flagship-80w-co2-laser-cutters",
    configuration: { en: "Standalone machine", fr: "Machine seule" },
  },
  {
    slug: "sculpfun-s70-max-70w",
    price: 1599,
    usualPrice: 1699,
    store: "Sculpfun",
    storeUrl: "https://www.sculpfun.com/products/sculpfun-s70-max-70w-laser-engraver-and-cutting-machine",
    configuration: { en: "Machine only", fr: "Machine seule" },
  },
];

/** Crossed-out prices that have nothing to do with what the machine actually sold for. */
export interface InflatedWasPrice {
  slug: string;
  storeWasPrice: number;
  octoberPrice: number;
  price: number;
}

export const INFLATED_WAS_PRICES: InflatedWasPrice[] = [
  { slug: "acmer-p3-48w", storeWasPrice: 2299, octoberPrice: 1149, price: 1199 },
  { slug: "two-trees-ts2-20w", storeWasPrice: 1134, octoberPrice: 499, price: 499 },
  { slug: "acmer-p2-33w", storeWasPrice: 1599, octoberPrice: 609, price: 589 },
];

export interface DealsCopy {
  metaTitle: string;
  metaDescription: string;
  breadcrumb: string;
  title: string;
  intro: string;
  checkedOn: string;
  dropsTitle: string;
  dropsIntro: string;
  dealPrice: string;
  usualPrice: string;
  storeWas: string;
  saving: string;
  viewProfile: string;
  viewStore: string;
  inflatedTitle: string;
  inflatedIntro: string;
  inflatedRow: string;
  datesTitle: string;
  dates: { label: string; date: string }[];
  datesNote: string;
  tipsTitle: string;
  tips: string[];
  faqTitle: string;
  faq: FaqItem[];
}

export const DEALS_COPY: Record<Locale, DealsCopy> = {
  en: {
    metaTitle: "Laser Engraver Black Friday Deals 2026: Real Price Drops",
    metaDescription:
      "Black Friday 2026 laser engraver deals checked against the price each machine sold for in October: xTool, Monport, Acmer, Atomstack, Sculpfun. No inflated list prices.",
    breadcrumb: "Deals",
    title: "Laser engraver Black Friday deals 2026",
    intro:
      "Every price below comes from the brand's official store. We compare it with the price we recorded for the same machine in October, before the sale season, so the saving you see is real money and not a discount off an inflated list price.",
    checkedOn: "Prices checked on {date}. We update this page as brands launch their Black Friday and Cyber Monday offers.",
    dropsTitle: "Real price drops so far",
    dropsIntro:
      "Machines that cost less today than in October, sorted by the size of the drop. Early November is quiet: most brands keep their best offers for the last week of the month.",
    dealPrice: "Now",
    usualPrice: "October price",
    storeWas: "Store's crossed-out price",
    saving: "Real saving",
    viewProfile: "Our review",
    viewStore: "Official store",
    inflatedTitle: "Crossed-out prices to ignore",
    inflatedIntro:
      "Many stores show a huge “was” price next to the sale price. On these machines it is not a price anyone paid recently:",
    inflatedRow: ": shown “was {was}”, but it already sold for {october} in October. Today: {now}.",
    datesTitle: "Key dates",
    dates: [
      { label: "Black Friday", date: "Friday, November 27, 2026" },
      { label: "Cyber Monday", date: "Monday, November 30, 2026" },
    ],
    datesNote:
      "Most laser brands start their sale a week or two before Black Friday and keep it running until Cyber Monday. Prices usually move again when the sale ends.",
    tipsTitle: "How to get a good deal",
    tips: [
      "Compare the machine-only price. Bundles add a rotary, a riser or an air filter at a “bundle price” that is not always cheaper than buying them later.",
      "Ignore the crossed-out price and check the price history instead: the October price on this page is a good reference.",
      "Pick the machine first, then wait for its price. A discount on a machine that does not fit your materials is not a saving.",
      "In Europe, check that the store ships from an EU warehouse: otherwise import VAT and customs fees can cancel the discount.",
      "Discontinued and refurbished machines are often cheaper still, and our reviews stay online for them.",
    ],
    faqTitle: "Black Friday laser engraver questions",
    faq: [
      {
        question: "When do laser engraver Black Friday deals start in 2026?",
        answer:
          "Black Friday falls on November 27, 2026 and Cyber Monday on November 30. Most laser brands (xTool, Creality Falcon, Atomstack, Monport, Acmer) open their sale one to two weeks earlier and keep it running until Cyber Monday.",
      },
      {
        question: "Are the crossed-out prices on laser stores real?",
        answer:
          "Often not. Several stores display a list price that the machine has not sold for in months. We measure each saving against the official-store price we recorded in October 2026 instead.",
      },
      {
        question: "Is Black Friday the best time to buy a laser engraver?",
        answer:
          "It is one of the best, together with brand anniversary sales and new-model launches, when the previous generation drops in price. If the machine you want is not discounted, waiting a few weeks rarely saves more than 10 to 15 percent.",
      },
      {
        question: "Should I buy a bundle or the machine alone?",
        answer:
          "Start from the machine-only price. A bundle is worth it only if you need every accessory in it: a rotary for tumblers, an air filter if you work indoors, a riser for thick objects.",
      },
    ],
  },
  fr: {
    metaTitle: "Black Friday graveur laser 2026 : les vraies baisses de prix",
    metaDescription:
      "Promos Black Friday 2026 sur les graveurs laser, comparées au prix d’octobre de chaque machine : xTool, Monport, Acmer, Atomstack, Sculpfun. Sans faux prix barrés.",
    breadcrumb: "Promos",
    title: "Black Friday graveur laser 2026 : les vraies promos",
    intro:
      "Tous les prix ci-dessous viennent de la boutique officielle de la marque. On les compare au prix relevé pour la même machine en octobre, avant la saison des promos : l’économie affichée est donc réelle, et non une remise sur un prix barré gonflé.",
    checkedOn: "Prix relevés le {date}. Cette page est mise à jour au fil des offres Black Friday et Cyber Monday.",
    dropsTitle: "Les vraies baisses de prix pour l’instant",
    dropsIntro:
      "Les machines moins chères aujourd’hui qu’en octobre, de la plus forte baisse à la plus faible. Début novembre, c’est encore calme : la plupart des marques gardent leurs meilleures offres pour la dernière semaine du mois.",
    dealPrice: "Aujourd’hui",
    usualPrice: "Prix en octobre",
    storeWas: "Prix barré par la boutique",
    saving: "Économie réelle",
    viewProfile: "Notre avis",
    viewStore: "Boutique officielle",
    inflatedTitle: "Les prix barrés à ignorer",
    inflatedIntro:
      "Beaucoup de boutiques affichent un énorme prix barré à côté du prix promo. Sur ces machines, personne ne l’a payé récemment :",
    inflatedRow: " : barré à {was}, alors qu’elle se vendait déjà {october} en octobre. Aujourd’hui : {now}.",
    datesTitle: "Les dates à retenir",
    dates: [
      { label: "Black Friday", date: "vendredi 27 novembre 2026" },
      { label: "Cyber Monday", date: "lundi 30 novembre 2026" },
    ],
    datesNote:
      "La plupart des marques de lasers lancent leurs promos une à deux semaines avant le Black Friday et les prolongent jusqu’au Cyber Monday. Les prix bougent souvent de nouveau à la fin des soldes.",
    tipsTitle: "Comment faire une bonne affaire",
    tips: [
      "Comparez le prix de la machine seule. Les packs ajoutent un rotatif, des rehausses ou un filtre à un « prix pack » qui n’est pas toujours moins cher qu’un achat plus tard.",
      "Ignorez le prix barré et regardez l’historique : le prix d’octobre indiqué sur cette page est une bonne référence.",
      "Choisissez d’abord la machine, puis attendez son prix. Une remise sur une machine qui ne convient pas à vos matériaux n’est pas une économie.",
      "En Europe, vérifiez que la boutique expédie depuis un entrepôt européen : sinon la TVA à l’import et les frais de douane peuvent annuler la remise.",
      "Les machines arrêtées ou reconditionnées sont souvent encore moins chères, et nos avis restent en ligne pour elles.",
    ],
    faqTitle: "Questions sur le Black Friday des graveurs laser",
    faq: [
      {
        question: "Quand commencent les promos Black Friday sur les graveurs laser en 2026 ?",
        answer:
          "Le Black Friday tombe le 27 novembre 2026 et le Cyber Monday le 30 novembre. La plupart des marques (xTool, Creality Falcon, Atomstack, Monport, Acmer) ouvrent leurs promos une à deux semaines avant et les prolongent jusqu’au Cyber Monday.",
      },
      {
        question: "Les prix barrés des boutiques de lasers sont-ils réels ?",
        answer:
          "Souvent non. Plusieurs boutiques affichent un prix catalogue auquel la machine ne s’est pas vendue depuis des mois. Nous mesurons chaque économie par rapport au prix de la boutique officielle relevé en octobre 2026.",
      },
      {
        question: "Le Black Friday est-il le meilleur moment pour acheter un graveur laser ?",
        answer:
          "C’est l’un des meilleurs, avec les anniversaires de marque et les sorties de nouveaux modèles, quand la génération précédente baisse. Si la machine voulue n’est pas en promo, attendre quelques semaines fait rarement gagner plus de 10 à 15 %.",
      },
      {
        question: "Faut-il prendre un pack ou la machine seule ?",
        answer:
          "Partez du prix de la machine seule. Un pack ne vaut le coup que si vous avez besoin de chaque accessoire : un rotatif pour les gobelets, un filtre si vous travaillez en intérieur, des rehausses pour les objets épais.",
      },
    ],
  },
};
