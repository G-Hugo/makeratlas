/**
 * Legal / publisher identifiers — override via env in production.
 * NEXT_PUBLIC_LEGAL_* vars are exposed to the client for display on legal pages.
 */
import { SITE_URL } from "@/lib/site-url";

export const siteLegal = {
  siteUrl: SITE_URL,
  publisherName: process.env.NEXT_PUBLIC_LEGAL_PUBLISHER ?? "Maker Atlas",
  /** Natural person or company name shown on legal notice */
  publisherLegalName:
    process.env.NEXT_PUBLIC_LEGAL_NAME ?? "Maker Atlas (éditeur du site)",
  contactEmail:
    process.env.NEXT_PUBLIC_LEGAL_EMAIL ?? "contact@maker-atlas.com",
  country: process.env.NEXT_PUBLIC_LEGAL_COUNTRY ?? "France",
  /** Optional — leave empty until you have a registered address */
  postalAddress:
    process.env.NEXT_PUBLIC_LEGAL_ADDRESS ??
    "[Adresse postale à compléter via les variables d'environnement]",
  hostName:
    process.env.NEXT_PUBLIC_LEGAL_HOST ?? "Hostinger International Ltd.",
  hostAddress:
    process.env.NEXT_PUBLIC_LEGAL_HOST_ADDRESS ??
    "61 Lordou Vironos Street, 6023 Larnaca, Chypre",
  /** ISO date string for legal page “last updated” */
  policyLastUpdated: "2025-06-02",
} as const;
