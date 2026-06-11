import type { ContentStatus } from "@/types/machine";

export interface BrandFlagship {
  name: string;
  machineSlug: string;
  summary: string;
}

export interface BrandEditorial {
  slug: string;
  /** Canonical display name */
  name: string;
  tagline: string;
  /** One-line reputation hook */
  knownFor: string;
  website?: string;
  headquarters?: string;
  overview: string[];
  strengths: string[];
  weaknesses: string[];
  flagship: BrandFlagship;
  status: ContentStatus;
}

export interface BrandProfile extends BrandEditorial {
  lineCount: number;
  laserTypes: string[];
  priceMin: number;
  priceMax: number;
  /** Resolved from public/brands/logos/{slug}.* when present */
  logoSrc?: string;
}
