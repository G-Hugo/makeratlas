export type LaserType = "diode" | "co2" | "fiber" | "uv" | "hybrid";

export type MachineCategory = "laser-engraver";

export type ContentStatus = "draft" | "published";

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

export interface Machine {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: MachineCategory;
  laserType: LaserType;
  image: string;
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
