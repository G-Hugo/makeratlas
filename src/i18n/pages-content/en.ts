import type { Dictionary } from "@/i18n/dictionaries/types";

/** Extended copy for info & legal pages (EN). */
export const pagesContentEn: Pick<
  Dictionary,
  "infoPage" | "aboutContent" | "methodologyContent" | "transparencyContent" | "legal"
> = {
  infoPage: {
    breadcrumbHome: "Home",
    relatedTitle: "On this topic",
    relatedMethodology: "How profiles and benchmarks are built",
    relatedTransparency: "Independence, affiliates, and corrections",
    relatedAbout: "Mission and editorial principles",
    relatedLegal: "Publisher, host, and liability",
    relatedPrivacy: "Personal data and your rights",
    relatedCookies: "Cookies and similar technologies",
  },
  aboutContent: {
    whyTitle: "Why Maker Atlas exists",
    whyBody:
      "Buying a laser engraver should not mean ten open tabs, contradictory YouTube reviews, and guessing whether “40W” is optical power or marketing. Maker Atlas is the structured reference we wished existed: honest limits, comparable benchmarks, and guides written for real workshops, not recycled spec sheets.",
    principlesTitle: "Editorial principles",
    principles: [
      "Honest limits first: every profile states what the machine cannot do well",
      "Plain language: TL;DR and summaries up front, technical depth when you need it",
      "Fair comparison: same reference job sizes so times are comparable across models",
      "Broad coverage: relevant brands and power tiers, not only affiliate-friendly picks",
      "Transparent methodology: how we score, price, and update is public",
    ],
    whoTitle: "Who it is for",
    whoBody:
      "Hobby makers, small artisans, and workshop owners who need a trustworthy overview before spending hundreds or thousands on a machine. We are not a reseller and we do not replace manufacturer support or safety training.",
    coverageTitle: "What we cover today",
    coverageBody:
      "Laser engravers and related maker machines (diode, CO₂, fiber, UV, hybrid lines) with multi-power variants where manufacturers sell separate modules. Guides cover buying, laser types, and safety basics.",
    ctaTitle: "Start here",
    ctaBody: "New to lasers? Read these before comparing machines:",
    ctaBuying: "Laser buying guide 2026",
    ctaTypes: "Understanding laser types",
    ctaCatalog: "Browse the full catalog",
  },
  methodologyContent: {
    profileTitle: "What each machine profile includes",
    profileItems: [
      "Honest material limits: engrave, cut, and cannot-do lists",
      "Power tiers: separate pages per factory module when a line ships multiple wattages",
      "Reference benchmarks: sample engrave/cut times on a fixed 10×10 cm job for fair comparison",
      "Editorial ratings (1–10): overall, value, ease of use, capability, build quality",
      "Spot size vs motion precision: optical detail vs frame repositioning accuracy",
      "Last updated date on every profile",
    ],
    powerTitle: "Multi-power lines",
    powerBody:
      "When you switch power on a product line page, specs that depend on the laser module update: benchmark times, spot size, capability score, and cut materials. Frame precision and work area usually stay the same on the same chassis.",
    pricesTitle: "Prices (USD & EUR)",
    pricesBody:
      "Prices are stored in USD. EUR shown on the site uses a fixed indicative rate of 1 USD ≈ {rate} EUR, not live FX, excluding VAT, shipping, and import duties. Always confirm price and SKU with the seller before ordering.",
    benchmarkTitle: "Performance benchmarks",
    benchmarkBody:
      "Times are editorial estimates for standardized reference jobs, not lab certificates. They help compare machines fairly; your materials, optics, and settings will change real-world results.",
    precisionTitle: "Precision fields",
    precisionBody:
      "Laser spot size affects fine detail in engraving and usually varies with optical power. Motion precision (e.g. 0.01 mm) describes the frame, often identical across tiers on the same model line.",
    ratingsTitle: "Ratings (1–10)",
    ratingsBody:
      "Scores are editorial and relative to class and price. A 7/10 is a solid machine with clear trade-offs, not a school grade.",
    updatesTitle: "Updates",
    updatesBody:
      "Profiles are revised when lines, modules, or major specs change. The visible “last updated” date reflects content review, not a daily price crawl.",
    correctionsTitle: "Corrections",
    correctionsBody: "Found an error? See",
    disclaimer:
      "Maker Atlas is informational content, not professional safety, legal, or engineering advice. Always follow manufacturer manuals and local regulations.",
  },
  transparencyContent: {
    affiliateTitle: "Affiliate links",
    affiliateBody:
      "Today: no affiliate links on the site. When we add purchase links, they will be clearly labeled and will not change rankings or which machines we cover.",
    independenceTitle: "How we stay independent",
    independenceItems: [
      "Editorial scores are set before any monetization on a given page",
      "We cover discontinued and non-affiliate brands when makers still search for them",
      "Manufacturer marketing claims are cross-checked against optical power and laser type",
    ],
    refuseTitle: "What we refuse to publish",
    refuseItems: [
      "Treating combined wattage as optical power without qualification",
      "Promising cuts or materials without stating thickness and laser type limits",
      "Fake “hands-on” claims when content is spec-based and editorial",
      "Hiding hybrid or multi-module configurations behind a single power badge",
    ],
    correctionsTitle: "Corrections & contact",
    correctionsBody:
      "Report an error with the page URL and a source (manual, listing, photo) when possible. Email:",
    safetyTitle: "Safety",
    safetyBody:
      "Laser machines can injure, ignite materials, and produce toxic smoke. Read our",
    legalHintTitle: "Legal information",
    legalHintBody: "For publisher details, privacy, and cookies, see",
  },
  legal: {
    lastUpdatedLabel: "Last updated: {date}",
    notice: {
      title: "Legal notice",
      subtitle: "Publisher, hosting, and liability for makeratlas.com.",
      sections: [
        {
          title: "Site publisher",
          paragraphs: [
            "Site: {url}",
            "Publisher: {publisher}",
            "Contact: {email}",
            "Postal address: {address}",
            "Country: {country}",
          ],
        },
        {
          title: "Publication director",
          paragraphs: [
            "The publication director is the person responsible for editorial content: {publisher}.",
          ],
        },
        {
          title: "Hosting",
          paragraphs: [
            "Hosting provider: {host}",
            "Address: {hostAddress}",
          ],
        },
        {
          title: "Intellectual property",
          paragraphs: [
            "Text, structure, and original graphics on {site} are protected by copyright. Manufacturer names, logos, and product images remain the property of their respective owners and are used for identification and commentary.",
            "You may quote short excerpts with a clear link to the source page. Automated scraping of the full catalog for republication is not permitted without written permission.",
          ],
        },
        {
          title: "Liability",
          paragraphs: [
            "Content on {site} is provided for general information only. We strive for accuracy but do not guarantee completeness or that it matches every SKU revision.",
            "Use of laser equipment is at your own risk. Follow manufacturer manuals, ventilation requirements, and applicable safety regulations.",
          ],
        },
      ],
    },
    privacy: {
      title: "Privacy policy",
      subtitle: "How we handle personal data when you use Maker Atlas.",
      sections: [
        {
          title: "Data controller",
          paragraphs: [
            "Controller: {publisher}",
            "Contact for privacy requests: {email}",
          ],
        },
        {
          title: "Data we collect",
          paragraphs: [
            "When you browse the site, our host and analytics tools may process technical data such as IP address, browser type, pages viewed, and approximate region, mainly to secure and improve the service.",
            "If you email us, we process your address, message content, and any information you choose to include in order to respond.",
            "We do not sell your personal data.",
          ],
        },
        {
          title: "Purposes and legal bases (GDPR)",
          paragraphs: [
            "Legitimate interest: operating, securing, and improving an editorial reference website.",
            "Consent: where required for non-essential cookies (see the Cookies page).",
            "Contract / pre-contractual steps: only if you contact us about a specific request.",
          ],
        },
        {
          title: "Retention",
          paragraphs: [
            "Server logs are kept for a limited period consistent with security needs, then deleted or anonymized.",
            "Emails are kept as long as needed to handle your request and comply with legal obligations.",
          ],
        },
        {
          title: "Your rights",
          paragraphs: [
            "Depending on your location (including the EU/EEA), you may have rights to access, rectify, erase, restrict, object, and port your data, and to withdraw consent where processing is consent-based.",
            "You may lodge a complaint with your local data protection authority.",
            "To exercise your rights, contact {email} with enough detail for us to identify your request.",
          ],
        },
        {
          title: "International transfers",
          paragraphs: [
            "Our host may process data in the United States or other countries. Where required, appropriate safeguards (such as standard contractual clauses) apply.",
          ],
        },
      ],
    },
    cookies: {
      title: "Cookie policy",
      subtitle: "What cookies and similar technologies we use.",
      sections: [
        {
          title: "What is a cookie?",
          paragraphs: [
            "Cookies are small text files stored on your device. Similar technologies include local storage and pixels.",
          ],
        },
        {
          title: "Cookies we use",
          paragraphs: [
            "Essential cookies: required for basic operation (e.g. locale preference, security). These do not require consent in the EU.",
            "Audience measurement: if enabled, we may use privacy-oriented analytics to understand traffic without advertising profiles. You will be informed before any non-essential cookie is set.",
          ],
          list: [
            "We do not use advertising or social-tracking cookies on the editorial catalog today.",
            "Third-party embeds (e.g. future video players) may set their own cookies; we will label them when added.",
          ],
        },
        {
          title: "Managing cookies",
          paragraphs: [
            "You can delete or block cookies in your browser settings. Blocking essential cookies may affect locale or site functionality.",
            "For EU visitors, a consent banner will appear when we enable non-essential cookies.",
          ],
        },
      ],
    },
  },
};
