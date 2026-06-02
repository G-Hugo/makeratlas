/**
 * Legal / publisher identifiers — override via env in production.
 * NEXT_PUBLIC_LEGAL_* vars are exposed to the client for display on legal pages.
 */
export const siteLegal = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://makeratlas.com",
  publisherName: process.env.NEXT_PUBLIC_LEGAL_PUBLISHER ?? "Maker Atlas",
  /** Natural person or company name shown on legal notice */
  publisherLegalName:
    process.env.NEXT_PUBLIC_LEGAL_NAME ?? "Maker Atlas (éditeur du site)",
  contactEmail: process.env.NEXT_PUBLIC_LEGAL_EMAIL ?? "contact@makeratlas.com",
  country: process.env.NEXT_PUBLIC_LEGAL_COUNTRY ?? "France",
  /** Optional — leave empty until you have a registered address */
  postalAddress:
    process.env.NEXT_PUBLIC_LEGAL_ADDRESS ??
    "[Adresse postale à compléter via les variables d'environnement]",
  hostName: process.env.NEXT_PUBLIC_LEGAL_HOST ?? "Vercel Inc.",
  hostAddress:
    process.env.NEXT_PUBLIC_LEGAL_HOST_ADDRESS ??
    "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
  /** ISO date string for legal page “last updated” */
  policyLastUpdated: "2025-06-02",
} as const;
