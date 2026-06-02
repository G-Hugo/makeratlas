export type LaserType = "diode" | "co2" | "fiber" | "uv" | "hybrid";

/** How laser power / source is configured on the machine */
export type ModuleSystemStyle = "fixed" | "interchangeable" | "dual-laser";

export interface ModuleSystemOption {
  power: string;
  /** Primary laser type for this head (infrared = 1064 nm accessory, not fiber galvo) */
  laserKind: LaserType | "infrared";
  label: string;
  /** Link to a power-tier profile when we list it */
  tierSlug?: string;
}

/** Explains swappable heads vs hybrid dual-source — shown on detail pages */
export interface ModuleSystem {
  style: ModuleSystemStyle;
  headline: string;
  description: string;
  options: ModuleSystemOption[];
}

export type MachineCategory = "laser-engraver";

export type ContentStatus = "draft" | "published" | "archived";

export interface PriceRange {
  min: number;
  max: number;
  currency: "USD";
  note?: string;
}

/** Plain-language job example — easy to understand */
export interface JobExample {
  description: string;
  size: string;
  time: string;
}

/** Pro-level speed & beam specs — shown in technical section only */
export interface MachineTechnical {
  spotSize: string;
  maxSpeed: string;
  avgEngraveSpeed: string;
  avgCutSpeed: string;
}

export interface MachinePerformance {
  /** Repositioning accuracy — shown prominently */
  precision: string;
  /** Real-world engrave job example */
  engraveExample: JobExample;
  /** Real-world cut job example */
  cutExample: JobExample;
  /** Technical details for pros */
  technical: MachineTechnical;
}

export interface MachineSpecs {
  power: string;
  workArea: string;
  performance: MachinePerformance;
  dimensions?: string;
  weight?: string;
  software?: string[];
  connectivity?: string[];
}

export interface MachineMaterials {
  engrave: string[];
  cut: string[];
  cannot: string[];
}

export interface MachineRating {
  overall: number;
  value: number;
  easeOfUse: number;
  capability: number;
  buildQuality: number;
}

export interface MachineFaq {
  question: string;
  answer: string;
}

/** One photo in a machine gallery (manufacturer product shots). */
export interface MachinePhoto {
  src: string;
  alt: string;
  caption?: string;
}

export interface Machine {
  id: string;
  slug: string;
  name: string;
  /** Product family for grouping variants (e.g. sculpfun-s30-ultra) */
  modelLine?: string;
  /** Single optical power tier when this profile is one SKU */
  powerRating?: string;
  /** Shown in /lasers grid as the family card (flagship SKU) */
  catalogPrimary?: boolean;
  /** Detail page only — omit from browse grid (e.g. generic family slug) */
  catalogHidden?: boolean;
  /** Swappable laser heads or dual-source layout (see ModuleSystemNotice on detail page) */
  moduleSystem?: ModuleSystem;
  /** Laser types this machine can use — for hybrid / multi-source browse filters */
  laserCapabilities?: LaserType[];
  /** Short tags for card labels, e.g. diode + fiber or diode + blade */
  capabilityTags?: Array<LaserType | "blade" | "infrared">;
  brand: string;
  category: MachineCategory;
  laserType: LaserType;
  /** Primary thumbnail — first gallery image */
  image: string;
  /** Multiple product photos for detail page */
  images?: MachinePhoto[];
  tagline: string;
  tldr: string;
  mainObjective: string;
  bestFor: string[];
  priceRange: PriceRange;
  specs: MachineSpecs;
  materials: MachineMaterials;
  pros: string[];
  cons: string[];
  beginnerNotes: string;
  proTips: string;
  primaryUse: string;
  rating: MachineRating;
  similarModels?: string[];
  faq?: MachineFaq[];
  affiliateUrl?: string;
  status: ContentStatus;
  lastUpdated: string;
  /** First retail availability — YYYY-MM or YYYY-MM-DD */
  releaseDate?: string;
}

export interface GuideMeta {
  slug: string;
  title: string;
  description: string;
  category: "laser-types" | "buying-guide" | "safety" | "general";
  readTime: string;
  lastUpdated: string;
  status: ContentStatus;
}

export interface Guide extends GuideMeta {
  content: string;
}
